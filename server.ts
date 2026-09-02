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

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
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
      const isQuotaError = err?.status === 429 || err?.message?.includes('Quota') || err?.message?.includes('429');
      if (isQuotaError) {
        // Quota exceeded for this model, try next lightweight model
        continue;
      }
    }
  }

  // If all models hit quota or failed, notify concisely and throw to trigger guaranteed fallback
  console.info('[Gemini AI] Quota/Model fallback: korzystanie z lokalnej bazy liturgiczno-biblijnej.');
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
    console.warn('Fallback for meditation prompt due to API overload:', error);
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
    console.warn('Gemini patristic commentaries fallback:', error);
    res.json({
      source: 'patristic-library',
      siglum: guaranteedData.siglum,
      originalScripture: guaranteedData.originalScripture,
      commentaries: guaranteedData.commentaries
    });
  }
});

// API: Biblical and Liturgical Commentary for a Specific Passage/Reading (Egzegeza i Komentarz Duchowy)
app.post('/api/scrutation/passage-commentary', async (req, res) => {
  const { siglum, text, label, liturgicalContext } = req.body;
  if (!siglum) {
    return res.status(400).json({ error: 'Siglum jest wymagane' });
  }

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Meaningful default theological commentary
      return res.json({
        source: 'local-tradition',
        siglum,
        title: `Komentarz do ${label ? `${label} (${siglum})` : siglum}`,
        historicalLiteraryContext: `Fragment z księgi ${siglum.split(' ')[0]} wpisuje się w zbawczą historię Przymierza. Ukazuje wierność Boga, który przemawia do swojego ludu pośród konkretnych realiów historycznych i prowadzi ku pełni objawienia w Chrystusie.`,
        theologicalMessage: `Słowo to wzywa do żywej wiary i nawrócenia serca. W centrum orędzia znajduje się miłość Boża, która uprzedza ludzkie wysiłki i uzdalnia do odpowiedzi posłuszeństwa wiary.`,
        spiritualSense: {
          literal: `Dosłowne znaczenie tekstu odnosi się do konkretnego wydarzenia i dialogu Boga z człowiekiem, zapisanego pod natchnieniem Ducha Świętego.`,
          allegorical: `W świetle Chrystusa fragment ten zapowiada tajemnicę Paschy, zbawienia i nowego Ludu Bożego – Kościoła.`,
          moral: `Wskazuje drogę prawego postępowania: czystości intencji, miłości bliźniego i zaufania Bożej Opatrzności w próbie.`,
          anagogical: `Otwiera perspektywę eschatologiczną – kieruje serce ku wiecznemu odpocznieniu i uczcie w Królestwie Niebieskim.`
        },
        meditationPoints: [
          'Co w tym fragmencie najbardziej porusza moje serce w tej chwili życia?',
          'Do jakiego konkretnego kroku wiary lub przebaczenia wzywa mnie Pan?',
          'Jak ten tekst łączy się z moją dzisiejszą modlitwą i sakramentami?'
        ],
        prayer: `Panie Jezu Chryste, Twoje Słowo jest pochodnią dla moich stóp i światłem na mojej ścieżce. Otwórz moje serce, abym nie tylko słuchał Twego głosu, ale wypełniał go każdego dnia. Amen.`
      });
    }

    const prompt = `Jesteś wybitnym katolickim biblistą, profesorem egzegezy i teologii duchowości.
Przygotuj głęboki, wierny Tradycji Kościoła i pomocny w modlitwie osobistej (Lectio Divina) komentarz do fragmentu Pisma Świętego:
Siglum: "${siglum}"
Etykieta liturgiczna: "${label || 'Czytanie biblijne'}"
Kontekst dnia: "${liturgicalContext || ''}"
Tekst polski: "${text || ''}"

Twoim zadaniem jest dostarczyć w języku polskim:
1. Tytuł komentarza (zwięzły, teologiczny)
2. Kontekst historyczno-literacki perykopy (gdzie w księdze się znajduje, do kogo skierowana, motyw)
3. Główne orędzie teologiczne fragmentu
4. 4 Zmysły Pisma Świętego (zgodnie z Katechizmem Kościoła Katolickiego: sens dosłowny, alegoryczny, moralny, anagogiczny)
5. Krótkie punkty do osobistej medytacji i rachunku sumienia (3 pytania)
6. Zakończenie modlitewne (krótka modlitwa serca inspirowana tym tekstem)`;

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
        meditationPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        prayer: { type: Type.STRING }
      },
      required: ['siglum', 'title', 'historicalLiteraryContext', 'theologicalMessage', 'spiritualSense', 'meditationPoints', 'prayer']
    };

    const parsed = await generateContentWithFallback(ai, { prompt, schema });
    res.json({
      source: 'gemini',
      siglum,
      ...parsed
    });
  } catch (error) {
    console.warn('Gemini passage commentary fallback:', error);
    res.json({
      source: 'fallback',
      siglum,
      title: `Komentarz do ${siglum}`,
      historicalLiteraryContext: `Fragment z księgi ${siglum.split(' ')[0]} ukazuje działanie Boga w historii zbawienia.`,
      theologicalMessage: `Słowo Boże jest żywe i skuteczne, przynosi światło prawdy i uzdrowienie serca.`,
      spiritualSense: {
        literal: `Dosłowne znaczenie wskazuje na przymierze Boga ze swoim ludem.`,
        allegorical: `W Chrystusie wypełniają się wszystkie zapowiedzi Pism.`,
        moral: `Wzywa do wierności przykazaniom miłości Boga i bliźniego.`,
        anagogical: `Przypomina o wiecznym przeznaczeniu człowieka do chwały Bożej.`
      },
      meditationPoints: [
        'Jak to Słowo odpowiada na moje obecne trudności lub pytania?',
        'W jaki sposób Bóg objawia tu swoją miłosierną miłość?',
        'Do jakiej przemiany myślenia zaprasza mnie dzisiaj Duch Święty?'
      ],
      prayer: `Niech Twoje Słowo, Panie, zamieszka we mnie w obfitości, aby rodziło owoce wiary, nadziei i miłości. Amen.`
    });
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
    console.warn('Gemini passage lookup fallback:', error);
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
    console.warn('Fallback for random quote due to AI error:', err);
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
    console.warn('Gemini word-lookup fallback to database:', error);
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
    console.warn('Gemini jewish-lookup fallback to database:', error);
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
    console.warn('Original text lookup fallback:', error);
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
