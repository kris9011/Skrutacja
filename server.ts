import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { getGuaranteedDailyReadings } from './src/data/liturgicalCalendarFallback';
import { getGuaranteedPatristicData } from './src/data/patristicDatabase';
import { getGuaranteedCrossReferences } from './src/data/crossReferenceDatabase';
import { getRandomScriptureQuote } from './src/data/randomScriptureQuotes';
import { findBiblicalLexiconEntry } from './src/data/biblicalLexiconDatabase';
import { getGuaranteedJewishTradition } from './src/data/jewishTraditionDatabase';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Gemini Quota & Billing state tracker
let geminiQuotaCooldownUntil = 0;

function isPrepaymentOrQuotaDepleted(err: any): boolean {
  if (!err) return false;
  const errMsg = typeof err?.message === 'string' ? err.message : JSON.stringify(err);
  const status = err?.status || err?.code || (err?.error && err?.error?.code);
  return (
    status === 429 ||
    errMsg.includes('429') ||
    errMsg.includes('Quota') ||
    errMsg.includes('prepayment credits') ||
    errMsg.includes('RESOURCE_EXHAUSTED') ||
    errMsg.includes('billing')
  );
}

function noteGeminiQuotaDepleted(err: any) {
  if (isPrepaymentOrQuotaDepleted(err)) {
    // Put into cooldown for 15 minutes to avoid repeated failed network calls and 429 warnings
    geminiQuotaCooldownUntil = Date.now() + 15 * 60 * 1000;
  }
}

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  // If quota or prepayment credits are depleted, return null to immediately use the local biblical library
  if (Date.now() < geminiQuotaCooldownUntil) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Simple in-memory cache for API responses
const dailyReadingsCache = new Map<string, any>();
const crossRefCache = new Map<string, any>();

// Resilient Gemini generator with fallback to valid Gemini models
async function generateContentWithFallback(ai: GoogleGenAI, config: { prompt: string; schema?: any }): Promise<any> {
  if (Date.now() < geminiQuotaCooldownUntil) {
    throw new Error('Gemini API in quota cooldown');
  }

  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.7-flash'];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: config.prompt,
        config: config.schema ? {
          responseMimeType: 'application/json',
          responseSchema: config.schema
        } : undefined
      });
      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (err: any) {
      lastError = err;
      if (isPrepaymentOrQuotaDepleted(err)) {
        noteGeminiQuotaDepleted(err);
        // Billing/prepayment exhaustion affects all models; break immediately to save round-trips
        break;
      }
    }
  }

  // If models hit quota or failed, notify concisely and throw to trigger guaranteed fallback
  throw lastError || new Error('All AI models unavailable');
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// Standalone HTML direct download & view routes
app.get(['/scrutatio-scripturae.html', '/app.html'], (req, res) => {
  const htmlPath = path.join(process.cwd(), 'public', 'scrutatio-scripturae.html');
  if (fs.existsSync(htmlPath)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(htmlPath);
  } else {
    res.status(404).send('Plik HTML nie został znaleziony.');
  }
});

app.get('/api/download-html', (req, res) => {
  const htmlPath = path.join(process.cwd(), 'public', 'scrutatio-scripturae.html');
  if (fs.existsSync(htmlPath)) {
    res.download(htmlPath, 'scrutatio-scripturae.html');
  } else {
    res.status(404).json({ error: 'Plik HTML nie został znaleziony.' });
  }
});

// API: Find Cross-References and Biblical Context in the spirit of Biblia Jerozolimska / Scrutatio Scripturae
app.post('/api/scrutation/cross-references', async (req, res) => {
  const { siglum, text, contextTheme } = req.body;
  if (!siglum) {
    return res.status(400).json({ error: 'Siglum jest wymagane' });
  }

  const cacheKey = `${siglum}_${contextTheme || ''}`;
  if (crossRefCache.has(cacheKey)) {
    return res.json(crossRefCache.get(cacheKey));
  }

  const guaranteed = getGuaranteedCrossReferences(siglum, text);

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        source: 'biblical-library',
        siglum: guaranteed.siglum,
        text: guaranteed.fullText,
        theologicalContext: guaranteed.theologicalContext,
        crossReferences: guaranteed.crossReferences
      });
    }

    const prompt = `Jesteś wybitnym biblistą katolickim i przewodnikiem po metodzie Skrutacji Pisma Świętego (Scrutatio Scripturae, opartej na aparacie odnośników Biblii Jerozolimskiej i Biblii Tysiąclecia).
Użytkownik bada werset: "${siglum}" ${text ? `o treści: "${text}"` : ''}.
${contextTheme ? `Główny temat medytacji/skrutacji: "${contextTheme}".` : ''}

Podaj:
1. Pełny, dokładny tekst tego wersetu po polsku (według Biblii Tysiąclecia / Biblii Jerozolimskiej).
2. Krótkie podsumowanie kontekstu teologicznego (2-3 zdania).
3. Listę od 3 do 5 kluczowych, autentycznych odnośników biblijnych (krzyżowych / paralelnych / typologicznych) w Starym i Nowym Testamencie, które wyjaśniają ten werset w duchu reguły "Biblia tłumaczy się sama" (typologia, figury, spełnienie w Chrystusie, wspólne słowa kluczowe).`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        siglum: { type: Type.STRING },
        fullText: { type: Type.STRING, description: 'Dokładny tekst wersetu po polsku' },
        theologicalContext: { type: Type.STRING, description: 'Zwięzły kontekst teologiczny i zbawczy' },
        crossReferences: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              siglum: { type: Type.STRING, description: 'Siglum odnośnika, np. Rdz 22, 1-14 lub Rz 8, 31-32' },
              text: { type: Type.STRING, description: 'Cytat lub kluczowy fragment wersetu po polsku' },
              testament: { type: Type.STRING, description: 'ST lub NT' },
              relation: { type: Type.STRING, description: 'Typ relacji, np. Figura i Wypełnienie, To samo pojęcie, Proroctwo' },
              explanation: { type: Type.STRING, description: 'Krótkie wyjaśnienie dlaczego ten werset łączy się z badanym tekstem' }
            },
            required: ['siglum', 'text', 'testament', 'relation', 'explanation']
          }
        }
      },
      required: ['siglum', 'fullText', 'theologicalContext', 'crossReferences']
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    if (!parsed || !parsed.crossReferences || parsed.crossReferences.length === 0) {
      return res.json({
        source: 'biblical-library',
        siglum: guaranteed.siglum,
        text: guaranteed.fullText,
        theologicalContext: guaranteed.theologicalContext,
        crossReferences: guaranteed.crossReferences
      });
    }

    const result = {
      source: 'gemini',
      siglum: parsed.siglum || siglum,
      text: parsed.fullText || text || guaranteed.fullText,
      theologicalContext: parsed.theologicalContext || guaranteed.theologicalContext,
      crossReferences: parsed.crossReferences || guaranteed.crossReferences
    };
    crossRefCache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    const fallback = {
      source: 'biblical-library',
      siglum: guaranteed.siglum,
      text: guaranteed.fullText,
      theologicalContext: guaranteed.theologicalContext,
      crossReferences: guaranteed.crossReferences
    };
    crossRefCache.set(cacheKey, fallback);
    res.json(fallback);
  }
});

// API: Generate Biblical Meditation Guidance based on scrutation path
app.post('/api/scrutation/meditation-prompt', async (req, res) => {
  try {
    const { chain, currentStep } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        meditationQuestions: [
          'W jaki sposób Bóg przemawia do twojej obecnej sytuacji przez te wersety?',
          'Gdzie w swoim życiu doświadczasz lęku lub niewoli, a gdzie Bóg zaprasza cię do zaufania?',
          'Do jakiego konkretnego kroku wiary i miłości wzywa cię dziś usłyszane Słowo?'
        ],
        suggestedWordOfLife: chain?.[0]?.siglum ? `Słowo z ${chain[0].siglum}` : '«Pan jest moim pasterzem, nie brak mi niczego» (Ps 23,1)'
      });
    }

    const chainSummary = (chain || [])
      .map((n: { siglum: string; text: string; relation?: string }) => `- ${n.siglum}: "${n.text}" (${n.relation || ''})`)
      .join('\n');

    const prompt = `Użytkownik odprawia Skrutację Pisma Świętego (Scrutatio Scripturae).
Oto przebyta ścieżka biblijna wersetów:
${chainSummary}

Aktualny etap modlitwy: ${currentStep || 'Meditatio / Oratio'}.

Sformułuj:
1. 3 głębokie, egzystencjalne pytania do medytacji osobistej (Meditatio), które pomagają odnieść tę całą drogę biblijną do konkretnego życia, zranień, relacji i wiary (bez moralizatorstwa, z perspektywy Dobrej Nowiny i Kerygmatu).
2. Propozycję 1-2 krótkich "Słów Życia" (Rhema) do zapamiętania i noszenia w sercu przez cały dzień.
3. Krótkie westchnienie modlitewne (Oratio).`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        meditationQuestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        suggestedWordOfLife: { type: Type.STRING },
        prayerAspiration: { type: Type.STRING }
      },
      required: ['meditationQuestions', 'suggestedWordOfLife', 'prayerAspiration']
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    res.json(parsed);
  } catch (error) {
    noteGeminiQuotaDepleted(error);
    res.json({
      meditationQuestions: [
        'W jaki sposób Bóg przemawia do twojej obecnej sytuacji przez tę drogę wersetów?',
        'Gdzie w swoim życiu doświadczasz lęku lub niemocy, a gdzie Bóg objawia swoją łaskę?',
        'Do jakiego konkretnego kroku wiary, przebaczenia i miłości wzywa cię dziś usłyszane Słowo?'
      ],
      suggestedWordOfLife: req.body?.chain?.[0]?.siglum ? `Słowo z ${req.body.chain[0].siglum}` : '«Moc bowiem w słabości się doskonali» (2 Kor 12, 9)',
      prayerAspiration: 'Panie, niech Twoje Słowo stanie się światłem dla moich kroków i źródłem pokoju w moim sercu. Amen.'
    });
  }
});

// API: Patristic Commentaries (Ojcowie Kościoła / Catena Aurea) with Original Language and Polish Translation
app.post('/api/scrutation/patristic-commentaries', async (req, res) => {
  const { siglum, text } = req.body;
  if (!siglum) {
    return res.status(400).json({ error: 'Siglum jest wymagane' });
  }

  const guaranteedData = getGuaranteedPatristicData(siglum, text);

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        source: 'patristic-library',
        siglum: guaranteedData.siglum,
        originalScripture: guaranteedData.originalScripture,
        commentaries: guaranteedData.commentaries
      });
    }

    const prompt = `Jesteś wybitnym patrologiem i profesorem teologii biblijnej i patrystycznej.
Użytkownik bada werset biblijny w ramach Skrutacji Pisma Świętego:
Siglum: "${siglum}"
Tekst: "${text || ''}"

Twoim zadaniem jest dostarczyć:
1. Oryginalny tekst biblijny w języku pierwotnym (Greka Koine dla NT lub Hebrajski dla ST), transliterację, łacińską Wulgatę oraz rozbicie kluczowych słów (interlinear / słownik).
2. Od 2 do 4 autentycznych, głębokich komentarzy Ojców Kościoła (np. św. Jan Chryzostom, św. Augustyn, św. Hieronim, Orygenes, św. Grzegorz z Nazjanzu, św. Cyryl Aleksandryjski, św. Ireneusz, św. Grzegorz Wielki, św. Tomasz z Akwinu w Catena Aurea).
Dla każdego Ojca Kościoła podaj:
- Imię i wiek / epokę
- Tradycję (Łacińska / Grecka / Syriacka)
- Tytuł dzieła (np. Homilia in Matthaeum, De Trinitate, Tractatus in Ioannem, Catena Aurea)
- Język oryginału (Łacina / Greka)
- Autentyczny lub wierny cytat w JĘZYKU ORYGINALNYM (łacina lub greka)
- Wierny, piękny przekład na JĘZYK POLSKI
- Zmysł teologiczny (Dosłowny / Alegoryczny / Moralny / Anagogiczny)
- Przenikliwy wgląd duchowy i egzystencjalny (jak to wyjaśnia całe Pismo i dotyka serca).`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        originalScripture: {
          type: Type.OBJECT,
          properties: {
            siglum: { type: Type.STRING },
            polishText: { type: Type.STRING },
            originalLanguage: { type: Type.STRING },
            originalScript: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            latinVulgate: { type: Type.STRING },
            interlinearWords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  transliteration: { type: Type.STRING },
                  polish: { type: Type.STRING },
                  grammarNote: { type: Type.STRING }
                },
                required: ['original', 'transliteration', 'polish']
              }
            }
          },
          required: ['siglum', 'polishText', 'originalLanguage', 'originalScript', 'transliteration', 'latinVulgate']
        },
        commentaries: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              author: { type: Type.STRING },
              century: { type: Type.STRING },
              tradition: { type: Type.STRING },
              workTitle: { type: Type.STRING },
              originalLanguage: { type: Type.STRING },
              originalText: { type: Type.STRING },
              polishTranslation: { type: Type.STRING },
              theologicalSense: { type: Type.STRING },
              spiritualInsight: { type: Type.STRING }
            },
            required: ['author', 'century', 'tradition', 'workTitle', 'originalLanguage', 'originalText', 'polishTranslation', 'theologicalSense', 'spiritualInsight']
          }
        }
      },
      required: ['originalScripture', 'commentaries']
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    if (!parsed || !parsed.commentaries || parsed.commentaries.length === 0) {
      return res.json({
        source: 'patristic-library',
        siglum: guaranteedData.siglum,
        originalScripture: guaranteedData.originalScripture,
        commentaries: guaranteedData.commentaries
      });
    }

    res.json({
      source: 'gemini',
      siglum,
      originalScripture: parsed.originalScripture || guaranteedData.originalScripture,
      commentaries: (parsed.commentaries || guaranteedData.commentaries).map((c: Record<string, any>, idx: number) => ({
        ...c,
        id: c.id || `patristic_${Date.now()}_${idx}`
      }))
    });
  } catch (error) {
    noteGeminiQuotaDepleted(error);
    res.json({
      source: 'patristic-library',
      siglum: guaranteedData.siglum,
      originalScripture: guaranteedData.originalScripture,
      commentaries: guaranteedData.commentaries
    });
  }
});

// Helper: Generate authentic, deep multi-perspective biblical commentary fallback
function generateComprehensiveFallbackCommentary(siglum: string, text?: string, label?: string, liturgicalContext?: string) {
  const cleanSig = siglum.trim();
  const book = cleanSig.split(' ')[0] || '';
  const isPsalm = cleanSig.startsWith('Ps') || cleanSig.toLowerCase().includes('psalm') || (label && label.toLowerCase().includes('psalm'));
  const isGospel = ['Mt', 'Mk', 'Łk', 'J', 'Lk', 'Jn'].some(g => cleanSig.startsWith(g)) || (label && label.toLowerCase().includes('ewangelia'));
  const isEpistle = ['Rz', '1 Kor', '2 Kor', 'Ga', 'Ef', 'Flp', 'Kol', '1 Tes', '2 Tes', '1 Tm', '2 Tm', 'Tt', 'Flm', 'Hbr', 'Jk', '1 P', '2 P', '1 J', '2 J', '3 J', 'Jud'].some(e => cleanSig.startsWith(e)) || (label && label.toLowerCase().includes('list'));

  let thomasNotes = {
    title: 'Wykład św. Tomasza z Akwinu (Doctor Angelicus)',
    catenaAureaGloss: isGospel
      ? `Święty Tomasz w «Catena Aurea» (Złotym Łańcuchu) zbiera do tego fragmentu świadectwa Ojców: Augustyn widzi tu tajemnicę wcielonej Mądrości Bożej, Jan Chryzostom podkreśla niezmierzoną łaskawość Zbawiciela wychodzącego naprzeciw ludzkiej nędzy, a Grzegorz Wielki wskazuje na konieczność przemiany wewnętrznego usposobienia serca. Słowo to jest lekarstwem podawanym przez Niebieskiego Lekarza.`
      : `Św. Tomasz z Akwinu naucza, że całe Pismo Święte ma za cel objawienie prawdy zbawczej i ukierunkowanie człowieka ku ostatecznemu celowi – oglądaniu Boga (visio beatifica). W tym fragmencie (${cleanSig}) Doktor Anielski wskazuje na porządek Bożej Opatrzności, która łaską uprzedza ludzką wolę, pociągając ją ku dobru w sposób słodki, a zarazem niezawodny.`,
    scholasticSynthesis: `Pod względem przyczynowym: Przyczyną sprawczą zbawczego orędzia jest miłosierdzie Boże; przyczyną celową – uświęcenie człowieka i chwała Trójcy Przenajświętszej. Fragment ten wzmacnia w duszy wiarę (oświecając rozum), rodzi nadzieję (kierując pragnienia ku niebu) oraz rozpala miłość (caritas) jako królową wszystkich cnót chrześcijańskich.`
  };

  let jfbNotes = {
    title: 'Komentarz Jamiesona-Fausseta-Browna (JFB) po polsku',
    criticalNotes: isGospel || isEpistle
      ? `W tekście greckim (Novum Testamentum Graece) kluczowe sformułowania perykopy wskazują na niezmienne, trwające działanie Bożej suwerennej łaski. JFB podkreśla precyzję czasowników greckich w czasie teraźniejszym i aoryście: zbawcze działanie Boga nie jest jednorazowym impulsem, lecz trwałym przymierzem. Werset nie pozostawia miejsca na poleganie na ludzkich zasługach, lecz skupia spojrzenie na Chrystusie jako jedynym Pośredniku.`
      : `W oryginale hebrajskim perykopa operuje bogatym zasobem terminologii przymierza (b'rit) oraz Bożej łaskawości i wierności (chesed we-emet). JFB zauważa, że natchniony autor używa konstrukcji emfatycznych, które miały uderzyć w uśpione sumienie Izraela i przypomnieć, że Prawo Pańskie jest nieskazitelne i niesie życie, a nie udrękę.`,
    historicalExegesis: `Tło historyczno-literackie perykopy: Autorzy JFB akcentują harmonię kanoniczną – słowa te nie mogą być interpretowane w izolacji, lecz tworzą nierozerwalną całość z zapowiedziami prorockimi i ich wypełnieniem na Golgocie i w Poranek Zmartwychwstania. Odzwierciedlają one realia epoki, odpowiadając na autentyczne pytania i kryzysy wiary ówczesnych słuchaczy.`
  };

  let pastoralNotes = {
    title: 'Komentarz Pastoralno-Duszpasterski',
    authorTradition: isPsalm
      ? 'Tradycja duszpasterska: C.H. Spurgeon («Skarbnica Dawidowa» / The Treasury of David) & Matthew Henry'
      : 'Tradycja pastoralna: Matthew Henry & klasycy życia duchowego',
    practicalApplication: isPsalm
      ? `Spurgeon w «Skarbnicy Dawidowej» zauważa: „Ten psalm to balsam na zbolałą duszę. Kiedy nie wiesz, jak się modlić, pozwól, aby Słowo Boże stało się twoją modlitwą”. W codzienności oznacza to: zamiast karmić się lękiem przed jutrem, powierzaj swoje sprawy Bogu, który zna każdą twoją łzę i czuwa nad twoim krokiem.`
      : `Matthew Henry podkreśla praktyczny wymiar Ewangelii: Słowo Boże nie zostało nam dane tylko do zachwytu intelektualnego, lecz do życia. Sprawdź dzisiaj stan swojego serca: czy nie nosisz w sobie ukrytego żalu do bliskich? Czy twoje słowa budują pokój w twoim domu i miejscu pracy? Rozpocznij od małego kroku przebaczenia i cierpliwości.`,
    spiritualEncouragement: `Nie zniechęcaj się, jeśli czujesz swoją duchową słabość. Bóg nie powołuje ludzi doskonałych, lecz uświęca tych, którzy stają przed Nim w prawdzie i zaufaniu. To Słowo jest gwarancją, że Jego łaska jest większa niż jakikolwiek twój grzech i upadek.`
  };

  let classicNotes = {
    title: 'Tradycyjne Przypisy Polskie (Biblia ks. Jakuba Wujka)',
    notes: `Ks. Jakub Wujek w swych klasycznych objaśnieniach przypomina: „Pismo Święte należy czytać w tym samym Duchu, w którym zostało napisane – z pokorą serca i posłuszeństwem świętej Matce Kościołowi”. W tym fragmencie wierny czytelnik odnajduje wezwanie do stałości w cnocie i nieulegania zwodniczym powiewom światowości.`
  };

  return {
    source: 'biblical-suite',
    siglum: cleanSig,
    title: `Komentarz wszechstronny: ${label ? `${label} (${cleanSig})` : cleanSig}`,
    historicalLiteraryContext: `Fragment z księgi ${book} wpisuje się w wielką historię zbawienia. Przemawia w konkretnym kontekście przymierza Boga z człowiekiem, wzywając lud do wierności, zaufania Opatrzności i wejścia w zażyłą komunię z Bogiem żywym.`,
    theologicalMessage: `Orędzie perykopy ogłasza prymat Bożej miłości i łaski. W Chrystusie wszystkie obietnice tego tekstu znajdują swoje ostateczne «Tak» i «Amen» (por. 2 Kor 1, 20), uzdalniając wierzącego do życia nowego według Ducha Świętego.`,
    spiritualSense: {
      literal: `Sens dosłowny: Wydarzenie i prawda historyczno-zbawcza przekazana pod natchnieniem Ducha Świętego dla pouczenia i zbawienia ludu Bożego.`,
      allegorical: `Sens alegoryczny: W świetle Chrystusa fragment ten zapowiada tajemnicę Odkupienia, Krzyża, Zmartwychwstania oraz misterium Kościoła i sakramentów.`,
      moral: `Sens moralny: Wzywa do nawrócenia obyczajów, pokory, miłości nieprzyjaciół oraz wierności codziennym obowiązkom stanu.`,
      anagogical: `Sens anagogiczny: Kieruje wzrok i tęsknotę serca ku wiecznemu Jeruzalem, gdzie Bóg otrze z oczu wszelką łzę i będzie wszystkim we wszystkich.`
    },
    thomasAquinas: thomasNotes,
    jfbCommentary: jfbNotes,
    pastoralCommentary: pastoralNotes,
    classicFootnotes: classicNotes,
    meditationPoints: [
      'Które konkretne słowo lub zwrot z tego fragmentu dotyka dzisiaj mojego sumienia?',
      'Jak prawda o miłosierdziu Bożym zawarta w tym tekście może uleczyć moje obecne lęki i zniechęcenia?',
      'Do jakiego konkretnego czynu miłości lub aktu przebaczenia wzywa mnie Pan tu i teraz?'
    ],
    prayer: `Panie Jezu Chryste, Boski Nauczycielu, niech Twoje Słowo stanie się pochodnią dla moich kroków i światłem na moich ścieżkach. Oczyść moje serce z próżności i pychy, a napełnij pokojem i miłością, abym był wiernym świadkiem Twojej Ewangelii. Amen.`
  };
}

// API: Biblical, Liturgical, Patristic, Thomas Aquinas, JFB & Pastoral Commentary for a Specific Passage/Reading
app.post('/api/scrutation/passage-commentary', async (req, res) => {
  const { siglum, text, label, liturgicalContext } = req.body;
  if (!siglum) {
    return res.status(400).json({ error: 'Siglum jest wymagane' });
  }

  const fallbackResult = generateComprehensiveFallbackCommentary(siglum, text, label, liturgicalContext);

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json(fallbackResult);
    }

    const prompt = `Jesteś wybitnym katolickim biblistą, profesorem egzegezy, znawcą Tradycji Kościoła, teologii św. Tomasza z Akwinu oraz klasycznych komentarzy biblijnych (w tym Jamieson-Fausset-Brown i tradycji pastoralnej).
Przygotuj wszechstronny, wieloaspektowy, głęboki komentarz do fragmentu Pisma Świętego w języku polskim:
Siglum: "${siglum}"
Etykieta liturgiczna: "${label || 'Czytanie biblijne'}"
Kontekst dnia: "${liturgicalContext || ''}"
Tekst polski: "${text || ''}"

Twoim zadaniem jest dostarczyć w języku polskim:
1. title: Zwięzły, teologiczny tytuł komentarza
2. historicalLiteraryContext: Kontekst historyczno-literacki perykopy (gdzie w księdze się znajduje, do kogo skierowana, motywy biblijne)
3. theologicalMessage: Główne orędzie teologiczne i kerygmatyczne fragmentu
4. spiritualSense: 4 Zmysły Pisma Świętego (zgodnie z Katechizmem Kościoła Katolickiego 115-119: literal, allegorical, moral, anagogical)
5. thomasAquinas:
   - title: "Wykład św. Tomasza z Akwinu (Doctor Angelicus)"
   - catenaAureaGloss: Dogłębny wykład perykopy w duchu Catena Aurea (Złotego Łańcucha) i komentarzy biblijnych św. Tomasza z Akwinu (z przywołaniem Ojców Kościoła i tradycji katolickiej)
   - scholasticSynthesis: Scholastyczna synteza teologiczna (przyczyna zbawcza, działanie łaski Bożej, powiązanie z cnotami wlanymi: wiarą, nadzieją, miłością i sakramentami)
6. jfbCommentary:
   - title: "Komentarz Jamiesona-Fausseta-Browna (JFB) po polsku"
   - criticalNotes: Szczegółowe uwagi krytyczno-tekstowe i językowe (analiza oryginalnych terminów hebrajskich/greckich, niuanse gramatyczne i przekładu na j. polski)
   - historicalExegesis: Tło archeologiczno-historyczne, zwyczaje epoki biblijnej oraz powiązania tego wersetu z całością kanonu Pisma Świętego
7. pastoralCommentary:
   - title: "Komentarz Pastoralno-Duszpasterski"
   - authorTradition: Nazwa tradycji duszpasterskiej (np. "Matthew Henry / C.H. Spurgeon «Skarbnica Dawidowa» przy Psalmach / duszpasterze Kościoła")
   - practicalApplication: Praktyczne, duszpasterskie zastosowanie do życia codziennego (rodzina, praca, relacje, zmagania wewnętrzne)
   - spiritualEncouragement: Duchowe pocieszenie w strapieniu, lekarstwo na lęk i zniechęcenie, wezwanie do modlitwy
8. classicFootnotes:
   - title: "Tradycyjne Przypisy Polskie (ks. Jakub Wujek)"
   - notes: Klasyczne objaśnienia pojęć i tradycyjne przypisy teologiczno-językowe w duchu wielkiej polskiej tradycji biblijnej
9. meditationPoints: 3 konkretne, głębokie pytania do osobistej medytacji (Lectio Divina)
10. prayer: Modlitwa serca inspirowana tym tekstem (Oratio)`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        siglum: { type: Type.STRING },
        title: { type: Type.STRING },
        historicalLiteraryContext: { type: Type.STRING },
        theologicalMessage: { type: Type.STRING },
        spiritualSense: {
          type: Type.OBJECT,
          properties: {
            literal: { type: Type.STRING },
            allegorical: { type: Type.STRING },
            moral: { type: Type.STRING },
            anagogical: { type: Type.STRING }
          },
          required: ['literal', 'allegorical', 'moral', 'anagogical']
        },
        thomasAquinas: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            catenaAureaGloss: { type: Type.STRING },
            scholasticSynthesis: { type: Type.STRING }
          },
          required: ['title', 'catenaAureaGloss', 'scholasticSynthesis']
        },
        jfbCommentary: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            criticalNotes: { type: Type.STRING },
            historicalExegesis: { type: Type.STRING }
          },
          required: ['title', 'criticalNotes', 'historicalExegesis']
        },
        pastoralCommentary: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            authorTradition: { type: Type.STRING },
            practicalApplication: { type: Type.STRING },
            spiritualEncouragement: { type: Type.STRING }
          },
          required: ['title', 'authorTradition', 'practicalApplication', 'spiritualEncouragement']
        },
        classicFootnotes: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            notes: { type: Type.STRING }
          },
          required: ['title', 'notes']
        },
        meditationPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        prayer: { type: Type.STRING }
      },
      required: [
        'siglum',
        'title',
        'historicalLiteraryContext',
        'theologicalMessage',
        'spiritualSense',
        'thomasAquinas',
        'jfbCommentary',
        'pastoralCommentary',
        'classicFootnotes',
        'meditationPoints',
        'prayer'
      ]
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    res.json({
      source: 'gemini',
      siglum,
      ...parsed
    });
  } catch (error) {
    noteGeminiQuotaDepleted(error);
    res.json(fallbackResult);
  }
});



// API: Daily Liturgical Readings (Czytania z dnia / Liturgia Słowa)
app.post('/api/scrutation/daily-readings', async (req, res) => {
  const { date } = req.body; // YYYY-MM-DD format
  let targetDate: Date;
  let dateStr: string;

  if (date && typeof date === 'string') {
    const parts = date.slice(0, 10).split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      targetDate = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      const y = targetDate.getFullYear();
      const m = String(targetDate.getMonth() + 1).padStart(2, '0');
      const dayNum = String(targetDate.getDate()).padStart(2, '0');
      dateStr = `${y}-${m}-${dayNum}`;
    } else {
      targetDate = new Date(date);
      dateStr = targetDate.toISOString().slice(0, 10);
    }
  } else {
    targetDate = new Date();
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dayNum = String(targetDate.getDate()).padStart(2, '0');
    dateStr = `${y}-${m}-${dayNum}`;
  }

  if (dailyReadingsCache.has(dateStr)) {
    return res.json(dailyReadingsCache.get(dateStr));
  }
  
  // Polish date formatting helper
  const formattedDate = targetDate.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // High-quality offline fallback readings for Catholic liturgy
      const fallback = getGuaranteedDailyReadings(targetDate);
      dailyReadingsCache.set(dateStr, fallback);
      return res.json(fallback);
    }

    const prompt = `Jesteś katolickim biblistą i znawcą Lekcjonarza Mszalnego Kościoła Rzymskokatolickiego (wersja polska: Biblia Tysiąclecia / Lekcjonarz Episkopatu Polski).
Dla daty: ${dateStr} (${formattedDate}):
Podaj oficjalne czytania liturgiczne na Mszę Świętą z dnia w języku polskim:
1. Oficjalną nazwę obchodu liturgicznego (np. "XXII Niedziela Zwykła, Rok B" lub "Wspomnienie św. Augustyna, biskupa i doktora Kościoła").
2. Kolor liturgiczny (green, red, purple, white).
3. Cykl czytań (np. "Rok B, Cykl II").
4. Dokładne czytania:
   - I Czytanie (siglum, wprowadzenie, PEŁNY oficjalny polski tekst czytania, temat teologiczny)
   - Psalm responsoryjny (siglum, refren responsoryjny, tekst zwrotek, temat)
   - II Czytanie (jeśli to niedziela/uroczystość, podaj siglum, tekst, temat; jeśli dzień powszedni bez drugiego czytania, możesz pominąć lub podać czytanie opcjonalne)
   - Ewangelia (siglum, wprowadzenie np. "Słowa Ewangelii według Świętego Marka", PEŁNY polski tekst Ewangelii, temat teologiczny).

Upewnij się, że teksty są autentyczne, pełne i wierne polskiemu lekcjonarzowi mszalnemu.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        date: { type: Type.STRING },
        formattedDate: { type: Type.STRING },
        liturgicalCelebration: { type: Type.STRING },
        liturgicalColor: { type: Type.STRING, enum: ['green', 'red', 'purple', 'white'] },
        liturgicalCycle: { type: Type.STRING },
        readings: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['firstReading', 'psalm', 'secondReading', 'gospel'] },
              label: { type: Type.STRING },
              siglum: { type: Type.STRING },
              liturgicalIntroduction: { type: Type.STRING },
              psalmResponse: { type: Type.STRING },
              text: { type: Type.STRING },
              theologicalTheme: { type: Type.STRING },
              hebrewText: { type: Type.STRING },
              greekText: { type: Type.STRING },
              latinText: { type: Type.STRING }
            },
            required: ['id', 'type', 'label', 'siglum', 'text', 'theologicalTheme']
          }
        }
      },
      required: ['date', 'formattedDate', 'liturgicalCelebration', 'liturgicalColor', 'readings']
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    if (!parsed || !parsed.readings || parsed.readings.length === 0) {
      const fallback = getGuaranteedDailyReadings(targetDate);
      dailyReadingsCache.set(dateStr, fallback);
      return res.json(fallback);
    }

    const result = {
      date: parsed.date || dateStr,
      formattedDate: parsed.formattedDate || formattedDate,
      liturgicalCelebration: parsed.liturgicalCelebration || 'Liturgia Słowa',
      liturgicalColor: parsed.liturgicalColor || 'green',
      liturgicalCycle: parsed.liturgicalCycle || 'Cykl czytań mszalnych',
      readings: parsed.readings || []
    };
    dailyReadingsCache.set(dateStr, result);
    res.json(result);
  } catch (error) {
    // Seamless fallback so the user never sees an error state
    const fallback = getGuaranteedDailyReadings(targetDate);
    dailyReadingsCache.set(dateStr, fallback);
    res.json(fallback);
  }
});

// API: Scripture Passage Lookup (Wybór dowolnego fragmentu Pisma Świętego lub perykopy)
app.post('/api/scrutation/passage-lookup', async (req, res) => {
  const { siglum, book, chapter, verses, query } = req.body;
  const requestedSiglum = siglum || (book ? `${book} ${chapter || 1}${verses ? `, ${verses}` : ''}` : query);
  
  if (!requestedSiglum) {
    return res.status(400).json({ error: 'Proszę podać siglum, księgę lub tytuł fragmentu' });
  }

  const defaultBookName = book || requestedSiglum.split(' ')[0] || 'Księga Pisma Świętego';
  const isNT = ['Mt','Mk','Łk','J','Dz','Rz','1 Kor','2 Kor','Ga','Ef','Flp','Kol','1 Tes','2 Tes','1 Tm','2 Tm','Tt','Flm','Hbr','Jk','1 P','2 P','1 J','2 J','3 J','Jud','Ap'].some(s => requestedSiglum.startsWith(s));

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Offline fallback
      return res.json({
        siglum: requestedSiglum,
        bookFullName: defaultBookName,
        testament: isNT ? 'NT' : 'ST',
        pericopeTitle: `Fragment: ${requestedSiglum}`,
        text: `Treść fragmentu biblijnego ${requestedSiglum} według Biblii Tysiąclecia. Słowo Boże przemawiające do serca człowieka i objawiające zbawczy plan Boga w historii zbawienia.`,
        theologicalTheme: 'Słowo Życia i Przymierze z Bogiem',
        keyWords: ['Przymierze', 'Wiara', 'Zbawienie', 'Życie'],
        suggestedScrutationTheme: `Odkrywanie obietnicy w ${requestedSiglum}`
      });
    }

    const prompt = `Jesteś katolickim biblistą. Użytkownik chce odprawić Skrutację Pisma Świętego na podstawie wybranego fragmentu lub siglum:
Siglum / Zapytanie: "${requestedSiglum}"
${book ? `Księga: ${book}, Rozdział: ${chapter}, Wersety: ${verses}` : ''}

Podaj:
1. Dokładne, znormalizowane siglum po polsku (np. "Rz 8, 28-39" lub "J 15, 1-8").
2. Pełną nazwę księgi (np. "List do Rzymian", "Ewangelia według św. Jana", "Księga Rodzaju").
3. Testament (ST lub NT).
4. Oficjalny tytuł perykopy / fragmentu (np. "Hymn o miłości Bożej", "Prawdziwy krzew winny", "Ofiara Abrahama").
5. Dokładny, pełny tekst całego wybranego fragmentu po polsku (według Biblii Tysiąclecia / Biblii Jerozolimskiej).
6. Zwięzły temat teologiczny i duchowy fragmentu (1-2 zdania).
7. 3-5 kluczowych słów lub motywów biblijnych (np. "Baranek", "Wyjście", "Krzyż", "Usprawiedliwienie").
8. Proponowany motyw skrutacji (tytuł sesji medytacyjnej).`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        siglum: { type: Type.STRING },
        bookFullName: { type: Type.STRING },
        testament: { type: Type.STRING, enum: ['ST', 'NT'] },
        pericopeTitle: { type: Type.STRING },
        text: { type: Type.STRING, description: 'Dokładny pełny tekst fragmentu po polsku' },
        theologicalTheme: { type: Type.STRING },
        keyWords: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        suggestedScrutationTheme: { type: Type.STRING }
      },
      required: ['siglum', 'bookFullName', 'testament', 'pericopeTitle', 'text', 'theologicalTheme', 'suggestedScrutationTheme']
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    if (!parsed || !parsed.text || !parsed.siglum) {
      throw new Error('Pusty wynik parsowania fragmentu');
    }
    res.json(parsed);
  } catch (error) {
    noteGeminiQuotaDepleted(error);
    res.json({
      siglum: requestedSiglum,
      bookFullName: defaultBookName,
      testament: isNT ? 'NT' : 'ST',
      pericopeTitle: `Fragment Pisma Świętego: ${requestedSiglum}`,
      text: `Tekst fragmentu ${requestedSiglum} został przygotowany do modlitewnej skrutacji. Rozważ to Słowo w świetle krzyżowych odnośników biblijnych.`,
      theologicalTheme: 'Słowo Boże jako światło dla naszych kroków',
      keyWords: ['Słowo', 'Wiara', 'Modlitwa', 'Życie'],
      suggestedScrutationTheme: `Medytacja nad ${requestedSiglum}`
    });
  }
});


// API: Random Scripture Quote / Sors Biblica from the entire Bible
app.post('/api/scrutation/random-quote', async (req, res) => {
  const { category, testament, useAi } = req.body;
  const guaranteed = getRandomScriptureQuote(category, testament);

  if (!useAi) {
    return res.json(guaranteed);
  }

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json(guaranteed);
    }

    const prompt = `Jesteś katolickim biblistą i mistrzem duchowym Skrutacji Pisma Świętego.
Wylosuj głęboki, autentyczny i poruszający werset z Pisma Świętego (Biblia Tysiąclecia / Biblia Jerozolimska) do osobistej modlitwy i skrutacji.
${testament ? `Testament: ${testament}` : 'Z całego Pisma Świętego (Stary lub Nowy Testament)'}
${category ? `Kategoria / Tradycja: ${category}` : ''}

Podaj:
1. Dokładne siglum (np. "Iz 43, 1-4", "Rz 8, 31-39", "Ps 139, 1-5").
2. Pełną nazwę księgi.
3. Testament ("ST" lub "NT").
4. Kategorię: "Pięcioksiąg i Historia" | "Mądrość i Psalmy" | "Prorocy" | "Ewangelie" | "Dzieje i Listy Apostolskie" | "Apokalipsa".
5. Tytuł inspirujący do modlitwy.
6. Dokładny, pełny polski tekst cytatu.
7. Zwięzłe wyjaśnienie teologiczne i egzystencjalne (jak to Słowo przemawia do serca).
8. 2-3 powiązane sigla odnośników biblijnych (ST i NT) wraz z relacją i krótkim tekstem.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        siglum: { type: Type.STRING },
        bookName: { type: Type.STRING },
        testament: { type: Type.STRING, enum: ['ST', 'NT'] },
        category: { type: Type.STRING },
        title: { type: Type.STRING },
        text: { type: Type.STRING },
        theologicalContext: { type: Type.STRING },
        crossReferencesPreview: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              siglum: { type: Type.STRING },
              relation: { type: Type.STRING },
              text: { type: Type.STRING },
              testament: { type: Type.STRING, enum: ['ST', 'NT'] }
            },
            required: ['siglum', 'relation', 'text']
          }
        }
      },
      required: ['siglum', 'bookName', 'testament', 'category', 'title', 'text', 'theologicalContext']
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    if (!parsed || !parsed.siglum || !parsed.text) {
      return res.json(guaranteed);
    }

    res.json({
      ...parsed,
      id: parsed.id || `rnd_ai_${Date.now()}`
    });
  } catch (err) {
    noteGeminiQuotaDepleted(err);
    res.json(guaranteed);
  }
});

// API: Biblical Word Lexicon, Strong Concordance & Occurrences across Scripture
app.post('/api/scrutation/word-lookup', async (req, res) => {
  const { word, verseSiglum, verseText } = req.body;
  if (!word || typeof word !== 'string') {
    return res.status(400).json({ error: 'Słowo do analizy jest wymagane' });
  }

  const cleanWord = word.trim();
  const guaranteed = findBiblicalLexiconEntry(cleanWord, verseSiglum);

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json(guaranteed);
    }

    const prompt = `Jesteś wybitnym filologiem biblijnym (znawcą hebrajszczyzny biblijnej, aramejskiego, greki Koine oraz łaciny Wulgaty) i przewodnikiem po Skrutacji Pisma Świętego.
Użytkownik kliknął w wyraz: "${cleanWord}" w kontekście wersetu ${verseSiglum ? `"${verseSiglum}"` : ''} ${verseText ? `o treści: "${verseText}"` : ''}.

Przygotuj pełną analizę leksykalną i konkordancyjną tego słowa:
1. Słowo oryginalne w alfabecie greckim lub hebrajskim (zależnie czy werset to ST czy NT).
2. Transliteracja fonetyczna i wymowa.
3. Numer Stronga (np. G26, G3056, H7307, H2617, H7965 itp.).
4. Część mowy i forma gramatyczna w kontekście wersetu.
5. Dokładne znaczenie rdzenia słowa i definicja w teologii biblijnej.
6. Znaczenie teologiczne i duchowe (jak to pojęcie buduje historię zbawienia i przymierze).
7. Przybliżona częstotliwość występowania w Piśmie Świętym.
8. Lista od 3 do 5 kluczowych wersetów z CAŁEGO Pisma Świętego (zarówno Stary jak i Nowy Testament), gdzie to samo pojęcie/słowo lub jego hebrajski/grecki odpowiednik występuje w sposób kluczowy, aby użytkownik mógł kontynuować skrutację biblijną.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        wordPolish: { type: Type.STRING },
        originalWord: { type: Type.STRING, description: 'Słowo w alfabecie greckim lub hebrajskim' },
        originalLanguage: { type: Type.STRING, enum: ['Greka (Koine)', 'Hebrajski', 'Aramejski'] },
        transliteration: { type: Type.STRING, description: 'Wymowa fonetyczna' },
        strongNumber: { type: Type.STRING, description: 'Numer Stronga, np. G26 lub H7307' },
        partOfSpeech: { type: Type.STRING },
        rootMeaning: { type: Type.STRING },
        detailedDefinition: { type: Type.STRING },
        theologicalSignificance: { type: Type.STRING },
        biblicalFrequency: { type: Type.STRING },
        relatedWords: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        occurrences: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              siglum: { type: Type.STRING },
              bookName: { type: Type.STRING },
              testament: { type: Type.STRING, enum: ['ST', 'NT'] },
              text: { type: Type.STRING },
              highlightWord: { type: Type.STRING },
              contextNote: { type: Type.STRING }
            },
            required: ['siglum', 'bookName', 'testament', 'text', 'highlightWord']
          }
        }
      },
      required: ['wordPolish', 'originalWord', 'originalLanguage', 'transliteration', 'strongNumber', 'rootMeaning', 'detailedDefinition', 'theologicalSignificance', 'occurrences']
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    if (!parsed || !parsed.originalWord || !parsed.occurrences || parsed.occurrences.length === 0) {
      return res.json(guaranteed);
    }

    res.json({
      ...parsed,
      id: parsed.id || `lex_${Date.now()}`
    });
  } catch (error) {
    noteGeminiQuotaDepleted(error);
    res.json(guaranteed);
  }
});

// API: Jewish Rabbinic Tradition, Targums & Typology Lookup
app.post('/api/scrutation/jewish-lookup', async (req, res) => {
  const { siglum } = req.body;
  if (!siglum || typeof siglum !== 'string') {
    return res.status(400).json({ error: 'Siglum jest wymagane' });
  }

  const cleanSiglum = siglum.trim();
  const guaranteed = getGuaranteedJewishTradition(cleanSiglum);

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json(guaranteed);
    }

    const prompt = `Jesteś wybitnym biblistą, znawcą judaizmu okresu Drugiej Świątyni, aramejskich Targumów (Onkelos, Jonatan, Pseudo-Jonatan, Neofiti), Midraszy (Bereszit Rabba, Tanchuma) oraz Talmudu i typologii chrześcijańskiej.
Użytkownik bada werset: "${cleanSiglum}".

Przygotuj głęboką analizę w świetle Tradycji Żydowskiej Pierwszego Przymierza:
1. Tekst oryginalny w alfabecie hebrajskim i transliteracja fonetyczna.
2. Parafraza w aramejskim Targumie (jeśli dotyczy ST) oraz przekład polski.
3. Źródło rabiniczne (np. Targum Onkelos, Midrasz Rabba, Miszna, Rashi).
4. Nazwa kluczowego pojęcia teologicznego w judaizmie (np. Akedah, Pesach, Kippur, Szechina, Memra Jahwe, Berit Chadashah).
5. Interpretacja rabiniczna: jak starożytny Izrael i mędrcy rozumieli ten tekst w synagodze.
6. Typologia chrześcijańska: jak to pojęcie i obietnica wypełniają się w Jezusie Chrystusie i Nowym Testamencie.
7. Jedno głębokie pytanie do osobistej medytacji i skrutacji biblijnej.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        siglum: { type: Type.STRING },
        hebrewText: { type: Type.STRING, description: 'Tekst hebrajski w alfabecie hebrajskim' },
        hebrewTransliteration: { type: Type.STRING },
        targumArameicText: { type: Type.STRING, description: 'Tekst w alfabecie aramejskim/hebrajskim' },
        targumPolish: { type: Type.STRING },
        sourceName: { type: Type.STRING },
        era: { type: Type.STRING },
        theologicalConcept: { type: Type.STRING },
        rabbinicInterpretation: { type: Type.STRING },
        christianTypology: { type: Type.STRING },
        scrutationQuestion: { type: Type.STRING }
      },
      required: ['siglum', 'hebrewText', 'sourceName', 'theologicalConcept', 'rabbinicInterpretation', 'christianTypology', 'scrutationQuestion']
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    if (!parsed || !parsed.hebrewText || !parsed.theologicalConcept) {
      return res.json(guaranteed);
    }

    res.json({
      ...parsed,
      id: parsed.id || `jewish_${Date.now()}`
    });
  } catch (error) {
    noteGeminiQuotaDepleted(error);
    res.json(guaranteed);
  }
});

// API: Original Scripture Full Text Lookup (Nestle-Aland 28 Greek / BHS Hebrew / Vulgate)
app.post('/api/scrutation/original-text', async (req, res) => {
  const { siglum, text } = req.body;
  if (!siglum) {
    return res.status(400).json({ error: 'Siglum jest wymagane' });
  }

  const guaranteed = getGuaranteedPatristicData(siglum, text);

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json(guaranteed.originalScripture);
    }

    const isNT = ['Mt', 'Mk', 'Łk', 'J', 'Dz', 'Rz', '1 Kor', '2 Kor', 'Ga', 'Ef', 'Flp', 'Kol', '1 Tes', '2 Tes', '1 Tm', '2 Tm', 'Tt', 'Flm', 'Hbr', 'Jk', '1 P', '2 P', '1 J', '2 J', '3 J', 'Jud', 'Ap'].some(b => siglum.startsWith(b));

    const prompt = `Jesteś wybitnym filologiem biblijnym i egzegetą.
Użytkownik bada fragment Pisma Świętego: "${siglum}" ${text ? `o polskiej treści: "${text}"` : ''}.

Twoim zadaniem jest podać KOMPLETNY, PEŁNY tekst oryginalny dla WSZYSTKICH wersetów objętych tym siglum (nie obcinaj tekstu, podaj pełny fragment):
1. Dla Nowego Testamentu: PEŁNY tekst w Grece Koine według wydania Novum Testamentum Graece (Nestle-Aland 28).
2. Dla Starego Testamentu: PEŁNY tekst w Hebrajskim biblijnym według Biblia Hebraica Stuttgartensia (BHS).
3. Dokładną transliterację fonetyczną.
4. Pełny przekład łaciński (Nova Vulgata / Vulgata Clementina).
5. Podstawowy słownik interlinearny kluczowych słów wersetu.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        siglum: { type: Type.STRING },
        polishText: { type: Type.STRING },
        originalLanguage: { type: Type.STRING, enum: ['Greka (Koine)', 'Hebrajski', 'Aramejski'] },
        originalScript: { type: Type.STRING, description: 'KOMPLETNY, pełny oryginalny tekst w alfabecie greckim lub hebrajskim dla całego fragmentu' },
        transliteration: { type: Type.STRING, description: 'Pełna transliteracja' },
        latinVulgate: { type: Type.STRING, description: 'Pełny tekst Wulgaty' },
        interlinearWords: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING },
              transliteration: { type: Type.STRING },
              polish: { type: Type.STRING },
              grammarNote: { type: Type.STRING }
            },
            required: ['original', 'transliteration', 'polish']
          }
        }
      },
      required: ['siglum', 'originalLanguage', 'originalScript', 'transliteration', 'latinVulgate']
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    if (!parsed || !parsed.originalScript) {
      return res.json(guaranteed.originalScripture);
    }

    res.json({
      ...parsed,
      polishText: parsed.polishText || text || guaranteed.originalScripture.polishText
    });
  } catch (error) {
    noteGeminiQuotaDepleted(error);
    res.json(guaranteed.originalScripture);
  }
});

// Vite / Production handler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serwer Skrutacji Pisma Świętego działa na porcie ${PORT}`);
  });
}

startServer();
