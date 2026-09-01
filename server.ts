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

// Resilient Gemini generator with fallback to valid Gemini models
async function generateContentWithFallback(ai: GoogleGenAI, config: { prompt: string; schema?: any }): Promise<any> {
  const modelsToTry = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
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
      console.warn(`Model ${model} unavailable (${err?.status || err?.message}), trying fallback model...`);
    }
  }
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

    res.json({
      source: 'gemini',
      siglum: parsed.siglum || siglum,
      text: parsed.fullText || text || guaranteed.fullText,
      theologicalContext: parsed.theologicalContext || guaranteed.theologicalContext,
      crossReferences: parsed.crossReferences || guaranteed.crossReferences
    });
  } catch (error) {
    console.warn('Gemini cross-references fallback:', error);
    res.json({
      source: 'biblical-library',
      siglum: guaranteed.siglum,
      text: guaranteed.fullText,
      theologicalContext: guaranteed.theologicalContext,
      crossReferences: guaranteed.crossReferences
    });
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


// API: Daily Liturgical Readings (Czytania z dnia / Liturgia Słowa)
app.post('/api/scrutation/daily-readings', async (req, res) => {
  const { date } = req.body; // YYYY-MM-DD format
  const targetDate = date ? new Date(date) : new Date();
  const dateStr = targetDate.toISOString().slice(0, 10);
  
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
      return res.json(getGuaranteedDailyReadings(targetDate));
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
      return res.json(getGuaranteedDailyReadings(targetDate));
    }

    res.json({
      date: parsed.date || dateStr,
      formattedDate: parsed.formattedDate || formattedDate,
      liturgicalCelebration: parsed.liturgicalCelebration || 'Liturgia Słowa',
      liturgicalColor: parsed.liturgicalColor || 'green',
      liturgicalCycle: parsed.liturgicalCycle || 'Cykl czytań mszalnych',
      readings: parsed.readings || []
    });
  } catch (error) {
    console.warn('Gemini daily readings unavailable, using guaranteed liturgical calendar fallback:', error);
    // Seamless fallback so the user never sees an error state
    res.json(getGuaranteedDailyReadings(targetDate));
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
