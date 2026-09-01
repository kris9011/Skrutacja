import React, { useState, useEffect } from 'react';
import { 
  DailyLiturgicalReadings, 
  DailyReadingItem, 
  ScriptureLookupResult, 
  ScrutationSession,
  RandomScriptureQuote
} from '../types';
import { BIBLE_BOOKS } from '../data/biblicalData';
import { getGuaranteedDailyReadings } from '../data/liturgicalCalendarFallback';
import { getRandomScriptureQuote, RANDOM_SCRIPTURE_QUOTES } from '../data/randomScriptureQuotes';
import { 
  CalendarDays, 
  BookOpen, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  Flame, 
  Scroll, 
  Quote, 
  BookMarked,
  Volume2,
  Copy,
  Check,
  Languages,
  Info,
  Calendar,
  Layers,
  X,
  Shuffle,
  Dice5,
  RefreshCw,
  Compass,
  CheckCircle2,
  MousePointerClick,
  LayoutList,
  LayoutGrid
} from 'lucide-react';

interface DailyReadingsAndPassageSelectorProps {
  onStartScrutationWithPassage: (session: ScrutationSession) => void;
  onOpenPatristicForVerse?: (siglum: string) => void;
}

interface PericopePreset {
  title: string;
  siglum: string;
  testament: 'ST' | 'NT';
  theme: string;
  category: 'Ewangelia' | 'Prorocy' | 'Pięcioksiąg' | 'Listy' | 'Mądrość';
  verseExcerpt?: string;
}

const FAMOUS_PERICOPES: PericopePreset[] = [
  {
    title: 'Hymn o Miłości',
    siglum: '1 Kor 13, 1-13',
    testament: 'NT',
    theme: 'Miłość (Agape) jako największy dar Ducha, który nigdy nie ustaje.',
    category: 'Listy',
    verseExcerpt: 'Gdybym mówił językami ludzi i aniołów, a miłości bym nie miał, stałbym się jak miedź brzęcząca...'
  },
  {
    title: 'Oto Baranek Boży',
    siglum: 'J 1, 29-34',
    testament: 'NT',
    theme: 'Świadectwo Jana Chrzciciela i Paschalna ofiara Tego, który gładzi grzech świata.',
    category: 'Ewangelia',
    verseExcerpt: 'Nazajutrz Jan ujrzał Jezusa, podchodzącego ku niemu, i rzekł: «Oto Baranek Boży, który gładzi grzech świata».'
  },
  {
    title: 'Błogosławieństwa na Górze',
    siglum: 'Mt 5, 1-12',
    testament: 'NT',
    theme: 'Konstytucja Królestwa Bożego, droga ubogich w duchu i czystego serca.',
    category: 'Ewangelia',
    verseExcerpt: 'Błogosławieni ubodzy w duchu, albowiem do nich należy królestwo niebieskie.'
  },
  {
    title: 'Pieśń o Cierpiącym Słudze Pańskim',
    siglum: 'Iz 53, 1-12',
    testament: 'ST',
    theme: 'Ekspiacja, zranienie za nasze grzechy i obietnica chwały Przebitego.',
    category: 'Prorocy',
    verseExcerpt: 'Lecz On był przebity za nasze grzechy, zdruzgotany za nasze winy. Spadła Nań chłosta zbawienna dla nas...'
  },
  {
    title: 'Powołanie Abrahama i Wyjście w Wierze',
    siglum: 'Rdz 12, 1-4',
    testament: 'ST',
    theme: 'Posłuszeństwo wiary, opuszczenie ziemi i wielka obietnica błogosławieństwa.',
    category: 'Pięcioksiąg',
    verseExcerpt: 'Wyjdź z twojej ziemi rodzinnej i z domu twego ojca do kraju, który ci ukażę...'
  },
  {
    title: 'Krzew Gorejący i Imię Boże',
    siglum: 'Wj 3, 1-15',
    testament: 'ST',
    theme: 'Objawienie Imienia JAHWE («JESTEM, KTÓRY JESTEM») i misja wyzwolenia z Egiptu.',
    category: 'Pięcioksiąg',
    verseExcerpt: 'Zdejmij sandały z nóg, gdyż miejsce, na którym stoisz, jest ziemią świętą...'
  },
  {
    title: 'Przejście przez Morze Czerwone',
    siglum: 'Wj 14, 15-31',
    testament: 'ST',
    theme: 'Wielka Pascha, ocalenie ludu wybranego i ostateczne rozbicie potęgi niewoli.',
    category: 'Pięcioksiąg',
    verseExcerpt: 'Pan rzekł do Mojżesza: Podnieś swą laskę i wyciągnij rękę nad morze i rozdziel je...'
  },
  {
    title: 'Nowe Serce i Nowy Duch',
    siglum: 'Ez 36, 24-28',
    testament: 'ST',
    theme: 'Obietnica wylania Ducha, usunięcie serca z kamienia i przymierze łaski.',
    category: 'Prorocy',
    verseExcerpt: 'I dam wam serce nowe i ducha nowego tchnę do waszego wnętrza, zabiorę wam serce kamienne...'
  },
  {
    title: 'Hymn o Kenozie Chrystusa',
    siglum: 'Flp 2, 5-11',
    testament: 'NT',
    theme: 'Uniżenie Syna Bożego, posłuszeństwo aż do krzyża i wywyższenie Imienia ponad wszystko.',
    category: 'Listy',
    verseExcerpt: 'On, istniejąc w postaci Bożej, nie skorzystał ze sposobności, aby na równi być z Bogiem, lecz ogołocił samego siebie...'
  },
  {
    title: 'Droga do Emaus',
    siglum: 'Łk 24, 13-35',
    testament: 'NT',
    theme: 'Wyjaśnianie wszystkich Pism przez Zmartwychwstałego i rozpoznanie przy łamaniu chleba.',
    category: 'Ewangelia',
    verseExcerpt: 'Czyż serce nie pałało w nas, kiedy rozmawiał z nami w drodze i Pisma nam wyjaśniał?'
  },
  {
    title: 'Krzew Winny i Latorośle',
    siglum: 'J 15, 1-8',
    testament: 'NT',
    theme: 'Trwanie w miłości Chrystusa i przynoszenie owocu, który trwa na wieki.',
    category: 'Ewangelia',
    verseExcerpt: 'Ja jestem krzewem winnym, wy - latoroślami. Kto trwa we Mnie, a Ja w nim, ten przynosi owoc obfity...'
  },
  {
    title: 'Nic nas nie odłączy od miłości Boga',
    siglum: 'Rz 8, 31-39',
    testament: 'NT',
    theme: 'Triumf łaski: Jeśli Bóg z nami, któż przeciwko nam? Nic nie zdoła nas odłączyć od miłości.',
    category: 'Listy',
    verseExcerpt: 'I jestem pewien, że ani śmierć, ani życie, ani aniołowie... nie zdoła nas odłączyć od miłości Boga...'
  },
  {
    title: 'Psalm Dobrego Pasterza',
    siglum: 'Ps 23, 1-6',
    testament: 'ST',
    theme: 'Zaufanie Opatrzności, pasterska troska i stół przygotowany na oczach wrogów.',
    category: 'Mądrość',
    verseExcerpt: 'Pan jest moim pasterzem, nie brak mi niczego. Pozwala mi leżeć na zielonych pastwiskach...'
  },
  {
    title: 'Zwiastowanie Pańskie',
    siglum: 'Łk 1, 26-38',
    testament: 'NT',
    theme: 'Wcielenie Słowa, «Fiat» Maryi i moc Ducha Świętego.',
    category: 'Ewangelia',
    verseExcerpt: 'Bądź pozdrowiona, łaski pełna, Pan z Tobą... Oto ja służebnica Pańska, niech mi się stanie według słowa twego.'
  }
];

export const DailyReadingsAndPassageSelector: React.FC<DailyReadingsAndPassageSelectorProps> = ({
  onStartScrutationWithPassage,
  onOpenPatristicForVerse
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'passage' | 'random'>('daily');

  // Helper for today's local date string
  const getLocalTodayDateString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Daily Readings state
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [dailyData, setDailyData] = useState<DailyLiturgicalReadings | null>(null);
  const [isLoadingDaily, setIsLoadingDaily] = useState<boolean>(false);
  const [dailyError, setDailyError] = useState<string | null>(null);
  const [copiedSiglum, setCopiedSiglum] = useState<string | null>(null);
  const [speakingSiglum, setSpeakingSiglum] = useState<string | null>(null);
  const [expandedReadingLang, setExpandedReadingLang] = useState<string | null>(null);
  const [dailyViewMode, setDailyViewMode] = useState<'stream' | 'cards'>('stream');
  
  // Verse Picker Modal State
  const [readingToPickVerse, setReadingToPickVerse] = useState<DailyReadingItem | null>(null);
  const [customVerseInput, setCustomVerseInput] = useState<string>('');
  const [selectedSentenceText, setSelectedSentenceText] = useState<string | null>(null);

  // Passage lookup state
  const [selectedBookSiglum, setSelectedBookSiglum] = useState<string>('J');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [versesInput, setVersesInput] = useState<string>('29-34');
  const [customSearchQuery, setCustomSearchQuery] = useState<string>('');
  const [pericopeCategoryFilter, setPericopeCategoryFilter] = useState<string>('Wszystkie');
  const [isLoadingPassage, setIsLoadingPassage] = useState<boolean>(false);
  const [passageLookupResult, setPassageLookupResult] = useState<ScriptureLookupResult | null>(null);
  const [passageError, setPassageError] = useState<string | null>(null);

  // Random Scripture Quote state (Sors Biblica)
  const [randomCategoryFilter, setRandomCategoryFilter] = useState<string>('Wszystkie');
  const [randomTestamentFilter, setRandomTestamentFilter] = useState<'ALL' | 'ST' | 'NT'>('ALL');
  const [currentRandomQuote, setCurrentRandomQuote] = useState<RandomScriptureQuote | null>(() => getRandomScriptureQuote());
  const [isDrawingRandom, setIsDrawingRandom] = useState<boolean>(false);
  const [drawHistory, setDrawHistory] = useState<RandomScriptureQuote[]>([]);

  // Current selected book info
  const currentBookInfo = BIBLE_BOOKS.find(b => b.siglum === selectedBookSiglum) || BIBLE_BOOKS[0];

  // Fetch Daily Readings
  const fetchDailyReadings = async (dateStr: string) => {
    setIsLoadingDaily(true);
    setDailyError(null);
    try {
      const res = await fetch('/api/scrutation/daily-readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr })
      });
      if (!res.ok) {
        throw new Error('Błąd odpowiedzi serwera');
      }
      const data = await res.json();
      if (data && data.readings && data.readings.length > 0) {
        setDailyData(data);
      } else {
        setDailyData(getGuaranteedDailyReadings(dateStr));
      }
    } catch (err) {
      console.warn('Używam lokalnego silnika lekcjonarza liturgicznego:', err);
      setDailyData(getGuaranteedDailyReadings(dateStr));
      setDailyError(null);
    } finally {
      setIsLoadingDaily(false);
    }
  };

  useEffect(() => {
    fetchDailyReadings(selectedDate);
  }, [selectedDate]);

  // Quick date change handlers
  const handleSetToday = () => {
    setSelectedDate(getLocalTodayDateString());
  };

  const handleShiftDate = (days: number) => {
    const parts = selectedDate.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2] + days, 12, 0, 0);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${day}`);
  };

  // Copy citation helper
  const handleCopyText = async (siglum: string, text: string) => {
    const fullCitation = `${siglum}\n«${text}»`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullCitation);
      }
    } catch (err) {
      console.warn('Clipboard write failed or permission denied:', err);
    }
    setCopiedSiglum(siglum);
    setTimeout(() => setCopiedSiglum(null), 2500);
  };

  // Text-to-speech reading helper
  const handleSpeakText = (siglum: string, text: string) => {
    try {
      if (!('speechSynthesis' in window)) return;
      
      if (speakingSiglum === siglum) {
        window.speechSynthesis.cancel();
        setSpeakingSiglum(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL';
      utterance.rate = 0.92;
      utterance.onend = () => setSpeakingSiglum(null);
      utterance.onerror = () => setSpeakingSiglum(null);
      setSpeakingSiglum(siglum);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis unavailable:', err);
      setSpeakingSiglum(null);
    }
  };

  // Passage Lookup action
  const handleLookupPassage = async (overrideSiglum?: string) => {
    setIsLoadingPassage(true);
    setPassageError(null);
    try {
      const payload = overrideSiglum
        ? { siglum: overrideSiglum }
        : customSearchQuery.trim()
        ? { query: customSearchQuery.trim() }
        : {
            book: selectedBookSiglum,
            chapter: selectedChapter,
            verses: versesInput.trim()
          };

      const res = await fetch('/api/scrutation/passage-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error('Błąd pobierania fragmentu');
      }
      const data = await res.json();
      setPassageLookupResult(data);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err) {
      console.error('Error looking up scripture:', err);
      setPassageError('Nie udało się pobrać tekstu fragmentu. Sprawdź poprawność siglum.');
    } finally {
      setIsLoadingPassage(false);
    }
  };

  // Helper: Extract all selectable strophes and verses for a reading
  const getSelectableVersesForReading = (reading: DailyReadingItem) => {
    const list: { siglum: string; label: string; text: string; theme?: string; isFull?: boolean }[] = [];

    // 1. Key Verses if defined
    if (reading.keyVerses && reading.keyVerses.length > 0) {
      reading.keyVerses.forEach(kv => {
        list.push({
          siglum: kv.siglum,
          label: kv.label,
          text: kv.text,
          theme: kv.theme,
          isFull: false
        });
      });
    }

    // 2. If it's a psalm or has stanza breaks (\n\n), extract stanzas if not already in list
    const paragraphs = reading.text.split(/\n\s*\n/).map(s => s.trim()).filter(s => s.length > 10);
    if (paragraphs.length > 1) {
      paragraphs.forEach((pText, pIdx) => {
        const cleanSnippet = pText.replace(/\n/g, ' ');
        const exists = list.some(item => item.text.includes(cleanSnippet.slice(0, 25)));
        if (!exists) {
          list.push({
            siglum: `${reading.siglum} (Zwrotka ${pIdx + 1})`,
            label: `Zwrotka ${pIdx + 1}`,
            text: cleanSnippet,
            theme: `Zwrotka ${pIdx + 1} z ${reading.siglum}`,
            isFull: false
          });
        }
      });
    }

    return list;
  };

  // Helper: Extract individual sentences/lines from reading text for granular click
  const getSentencesFromReading = (text: string) => {
    // Split by newlines or full stops followed by capital letters
    const rawLines = text
      .split(/\n+/)
      .map(l => l.trim())
      .filter(l => l.length > 8);
    
    if (rawLines.length > 1) {
      return rawLines;
    }
    
    // Fallback: split by sentences
    return text
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
  };

  // Launch Scrutation from a Daily Reading with optional specific verse
  const startScrutationFromDailyReading = (
    reading: DailyReadingItem,
    specificSiglum?: string,
    specificText?: string,
    specificTheme?: string
  ) => {
    const targetSiglum = specificSiglum || reading.siglum;
    const targetText = specificText || reading.text;
    const targetTheme = specificTheme || reading.theologicalTheme || `${reading.label} (${targetSiglum})`;

    const isNT = ['Mt', 'Mk', 'Łk', 'J', 'Dz', 'Rz', '1 Kor', '2 Kor', 'Ga', 'Ef', 'Flp', 'Kol', '1 Tes', '2 Tes', '1 Tm', '2 Tm', 'Tt', 'Flm', 'Hbr', 'Jk', '1 P', '2 P', '1 J', '2 J', '3 J', 'Jud', 'Ap'].some(s => targetSiglum.startsWith(s) || reading.siglum.startsWith(s));
    
    const newSession: ScrutationSession = {
      id: 'session_daily_' + Date.now(),
      title: `${reading.label}: ${targetSiglum} — ${dailyData?.liturgicalCelebration || 'Liturgia Słowa'}`,
      theme: targetTheme,
      initialSiglum: targetSiglum,
      initialText: targetText,
      nodes: [
        {
          id: 'node_root',
          parentId: null,
          siglum: targetSiglum,
          text: targetText,
          testament: isNT ? 'NT' : 'ST',
          theologicalTheme: targetTheme,
          crossReferenceReason: `Punkt startowy ze Słowa Bożego: ${reading.label} (${targetSiglum})`,
          order: 0,
          isExpanded: true,
          createdAt: Date.now()
        }
      ],
      activeStep: 0,
      prayerNotes: {
        statio: '',
        invocatio: '',
        lectio: targetText,
        meditatio: '',
        oratio: '',
        contemplatio: '',
        actio: '',
        wordOfLife: reading.psalmResponse ? reading.psalmResponse : (targetText.length < 120 ? targetText : '')
      },
      durationSeconds: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setReadingToPickVerse(null);
    setSelectedSentenceText(null);
    onStartScrutationWithPassage(newSession);
  };

  // Launch Scrutation from Passage Lookup Result
  const startScrutationFromLookup = (result: ScriptureLookupResult) => {
    const newSession: ScrutationSession = {
      id: 'session_lookup_' + Date.now(),
      title: `${result.pericopeTitle} (${result.siglum})`,
      theme: result.suggestedScrutationTheme || result.theologicalTheme || `Badanie ${result.siglum}`,
      initialSiglum: result.siglum,
      initialText: result.text,
      nodes: [
        {
          id: 'node_root',
          parentId: null,
          siglum: result.siglum,
          text: result.text,
          testament: result.testament,
          theologicalTheme: result.theologicalTheme,
          crossReferenceReason: `Werset wyjściowy: ${result.pericopeTitle}`,
          order: 0,
          isExpanded: true,
          createdAt: Date.now()
        }
      ],
      activeStep: 0,
      prayerNotes: {
        statio: '',
        invocatio: '',
        lectio: result.text,
        meditatio: '',
        oratio: '',
        contemplatio: '',
        actio: '',
        wordOfLife: ''
      },
      durationSeconds: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onStartScrutationWithPassage(newSession);
  };

  // Launch Scrutation from Random Quote
  const startScrutationFromRandomQuote = (quote: RandomScriptureQuote) => {
    const newSession: ScrutationSession = {
      id: 'session_random_' + Date.now(),
      title: `${quote.title} (${quote.siglum})`,
      theme: quote.theologicalContext || `Skrutacja: ${quote.title}`,
      initialSiglum: quote.siglum,
      initialText: quote.text,
      nodes: [
        {
          id: 'node_root',
          parentId: null,
          siglum: quote.siglum,
          text: quote.text,
          testament: quote.testament,
          theologicalTheme: quote.theologicalContext,
          crossReferenceReason: `Wylosowane Słowo Opatrzności: ${quote.title} (${quote.siglum})`,
          order: 0,
          isExpanded: true,
          createdAt: Date.now()
        }
      ],
      activeStep: 0,
      prayerNotes: {
        statio: '',
        invocatio: '',
        lectio: quote.text,
        meditatio: '',
        oratio: '',
        contemplatio: '',
        actio: '',
        wordOfLife: quote.text
      },
      durationSeconds: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onStartScrutationWithPassage(newSession);
  };

  // Draw Random Quote
  const handleDrawRandomQuote = (category?: string, testament?: 'ALL' | 'ST' | 'NT') => {
    setIsDrawingRandom(true);
    setTimeout(() => {
      const drawn = getRandomScriptureQuote(
        category || randomCategoryFilter,
        testament || randomTestamentFilter
      );
      setCurrentRandomQuote(drawn);
      setDrawHistory(prev => [drawn, ...prev.filter(q => q.id !== drawn.id)].slice(0, 10));
      setIsDrawingRandom(false);
    }, 280);
  };

  // Liturgical color styles
  const getLiturgicalColorStyle = (color?: string) => {
    switch (color) {
      case 'white':
        return { 
          name: 'Biel liturgiczna', 
          badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
          indicator: 'bg-amber-400'
        };
      case 'violet':
        return { 
          name: 'Fiolet liturgiczny', 
          badgeClass: 'bg-purple-50 text-purple-900 border-purple-300',
          indicator: 'bg-purple-500'
        };
      case 'red':
        return { 
          name: 'Czerwień liturgiczna', 
          badgeClass: 'bg-red-50 text-red-900 border-red-300',
          indicator: 'bg-red-500'
        };
      default:
        return { 
          name: 'Zieleń liturgiczna', 
          badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          indicator: 'bg-emerald-500'
        };
    }
  };

  const filteredPericopes = FAMOUS_PERICOPES.filter(p => {
    if (pericopeCategoryFilter === 'Wszystkie') return true;
    return p.category === pericopeCategoryFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 text-slate-800">
      {/* ========================================================================= */}
      {/* MODAL: WYBÓR KONKRETNEGO ZDANIA / WERSETU / ZWROTKI DO SKRUTACJI */}
      {/* ========================================================================= */}
      {readingToPickVerse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div 
            className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {readingToPickVerse.label}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-300">
                    {readingToPickVerse.siglum}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  Wybierz werset lub konkretne zdanie do skrutacji
                </h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Możesz skrutować całą perykopę, wybrać wyodrębnioną zwrotkę / kluczowy werset, albo kliknąć w dowolne zdanie z tekstu poniżej.
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setReadingToPickVerse(null);
                  setSelectedSentenceText(null);
                }}
                className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                title="Zamknij"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
              {/* Option 1: Whole Pericope */}
              <div 
                onClick={() => startScrutationFromDailyReading(
                  readingToPickVerse, 
                  readingToPickVerse.siglum, 
                  readingToPickVerse.text, 
                  readingToPickVerse.theologicalTheme
                )}
                className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-500 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-800">
                      Całe czytanie (Perykopa)
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                      {readingToPickVerse.siglum}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Skrutuj całość <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 font-scripture italic leading-relaxed">
                  «{readingToPickVerse.text}»
                </p>
              </div>

              {/* Option 2: Structured Strophes & Key Verses */}
              {getSelectableVersesForReading(readingToPickVerse).length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <span className="text-xs font-sans uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {readingToPickVerse.type === 'psalm' ? 'Zwrotki Psalmu i wersety:' : 'Wyodrębnione kluczowe wersety:'}
                  </span>

                  <div className="grid grid-cols-1 gap-2.5">
                    {getSelectableVersesForReading(readingToPickVerse).map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => startScrutationFromDailyReading(
                          readingToPickVerse, 
                          item.siglum, 
                          item.text, 
                          item.theme
                        )}
                        className="p-3.5 rounded-xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500 transition-all cursor-pointer group shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200">
                              {item.siglum}
                            </span>
                            <span className="font-semibold text-sm text-slate-800 group-hover:text-emerald-900">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Skrutuj ten fragment <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-scripture leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          «{item.text}»
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Option 3: Interactive Sentences in Full Text */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-sans uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                  <MousePointerClick className="w-3.5 h-3.5 text-emerald-600" />
                  Kliknij w konkretne zdanie / linijkę z tekstu:
                </span>
                
                <div className="space-y-1.5">
                  {getSentencesFromReading(readingToPickVerse.text).map((sentence, sIdx) => {
                    const isSelected = selectedSentenceText === sentence;
                    return (
                      <div
                        key={sIdx}
                        onClick={() => setSelectedSentenceText(sentence)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer text-xs font-scripture leading-relaxed flex items-start justify-between gap-3 ${
                          isSelected 
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-medium shadow-xs' 
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="flex-1">
                          «{sentence}»
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startScrutationFromDailyReading(
                              readingToPickVerse,
                              `${readingToPickVerse.siglum} (Werset ${sIdx + 1})`,
                              sentence,
                              `Fragment z ${readingToPickVerse.siglum}`
                            );
                          }}
                          className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-sans text-[11px] font-bold uppercase shrink-0 transition-colors shadow-xs"
                        >
                          Skrutuj to zdanie
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Option 4: Custom Siglum Input */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <span className="text-xs font-sans uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Lub wpisz własny numer wersetu:
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customVerseInput}
                    onChange={(e) => setCustomVerseInput(e.target.value)}
                    placeholder={`np. ${readingToPickVerse.siglum.split(' ')[0]} 1, 3`}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const finalSiglum = customVerseInput.trim() || readingToPickVerse.siglum;
                      startScrutationFromDailyReading(
                        readingToPickVerse, 
                        finalSiglum, 
                        selectedSentenceText || readingToPickVerse.text,
                        `Werset: ${finalSiglum}`
                      );
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-xs"
                  >
                    Skrutuj ten werset
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setReadingToPickVerse(null);
                  setSelectedSentenceText(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editorial Header Banner */}
      <div className="relative p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-sans uppercase tracking-[0.2em] font-bold">
          <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
          <span>Liturgia Słowa & Kanon Pisma</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
          Źródło Słowa do <span className="text-emerald-800 font-normal italic">Skrutacji</span>
        </h1>

        <p className="text-sm sm:text-base font-sans text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Wybierz dzisiejsze czytanie mszalne z Lekcjonarza Kościoła lub odszukaj dowolną perykopę ze Starego bądź Nowego Testamentu, aby natychmiast rozpocząć drogę odnośników biblijnych.
        </p>

        {/* Liturgical Tab Switcher */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex p-1.5 bg-slate-100 border border-slate-200 rounded-xl max-w-xl w-full shadow-inner">
            <button
              id="subtab-daily-btn"
              onClick={() => setActiveSubTab('daily')}
              className={`flex-1 py-3 px-3 sm:px-5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'daily'
                  ? 'bg-white text-emerald-900 border border-slate-200 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Czytania z Dnia</span>
            </button>
            <button
              id="subtab-passage-btn"
              onClick={() => setActiveSubTab('passage')}
              className={`flex-1 py-3 px-3 sm:px-5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'passage'
                  ? 'bg-white text-emerald-900 border border-slate-200 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scroll className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Wybór Fragmentu</span>
            </button>
            <button
              id="subtab-random-btn"
              onClick={() => {
                setActiveSubTab('random');
                if (!currentRandomQuote) {
                  handleDrawRandomQuote();
                }
              }}
              className={`flex-1 py-3 px-3 sm:px-5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'random'
                  ? 'bg-white text-emerald-900 border border-slate-200 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Dice5 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Losuj Cytat</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: CZYTANIA Z DNIA (LITURGIA SŁOWA) */}
      {/* ========================================================================= */}
      {activeSubTab === 'daily' && (
        <div className="space-y-6">
          {/* Daily Date Verification Status Badge */}
          {selectedDate === getLocalTodayDateString() ? (
            <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2.5 text-emerald-900">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                <span className="font-sans font-bold">
                  Czytania na dziś ({dailyData?.formattedDate || selectedDate}):
                </span>
                <span className="text-emerald-800 font-serif italic hidden md:inline">
                  {dailyData?.liturgicalCelebration}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[10px] uppercase font-bold text-emerald-900 tracking-wider shrink-0">
                ✓ Zweryfikowane z dnia
              </span>
            </div>
          ) : (
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2.5 text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-sans">
                  Przeglądasz czytania z dnia: <strong className="text-amber-950">{dailyData?.formattedDate || selectedDate}</strong> ({dailyData?.liturgicalCelebration})
                </span>
              </div>
              <button
                onClick={handleSetToday}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Wróć do dzisiaj</span>
              </button>
            </div>
          )}

          {/* Liturgical Control Bar */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Date navigation */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="daily-prev-day-btn"
                onClick={() => handleShiftDate(-1)}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs font-sans"
                title="Poprzedni dzień"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Wczoraj</span>
              </button>
              
              <button
                id="daily-today-btn"
                onClick={handleSetToday}
                className="px-3.5 py-2 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-xs font-sans uppercase tracking-wider text-emerald-900 font-bold transition-colors cursor-pointer"
              >
                Dzisiaj
              </button>

              <button
                id="daily-next-day-btn"
                onClick={() => handleShiftDate(1)}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs font-sans"
                title="Następny dzień"
              >
                <span className="hidden sm:inline">Jutro</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Calendar className="w-4 h-4 text-slate-500" />
                <input
                  id="daily-date-picker"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Liturgical Badges */}
            {dailyData && (
              <div className="flex items-center gap-3 flex-wrap justify-end">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold uppercase tracking-wider px-3 py-1 rounded-full border shadow-xs ${getLiturgicalColorStyle(dailyData.liturgicalColor).badgeClass}`}>
                  <span className={`w-2 h-2 rounded-full ${getLiturgicalColorStyle(dailyData.liturgicalColor).indicator}`} />
                  {getLiturgicalColorStyle(dailyData.liturgicalColor).name}
                </span>
                <span className="text-xs font-mono text-slate-600 px-2.5 py-1 rounded bg-slate-50 border border-slate-200">
                  {dailyData.liturgicalCycle}
                </span>
              </div>
            )}
          </div>

          {/* Liturgical Celebration Header Ribbon */}
          {dailyData && (
            <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-50 via-slate-50 to-white border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-sans uppercase tracking-[0.2em] font-bold">
                  <Flame className="w-4 h-4 text-emerald-600" />
                  <span>{dailyData.formattedDate}</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  {dailyData.liturgicalCelebration}
                </h2>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs font-sans text-slate-600 max-w-sm">
                <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Wybierz werset z poniższego zestawu czytań, aby wejść w modlitwę i zbadać jego korzenie w całym Piśmie Świętym.
                </span>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoadingDaily && (
            <div className="py-24 text-center space-y-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
              <p className="text-sm font-sans text-slate-600 tracking-wide">
                Pobieranie czytań mszalnych z Lekcjonarza Kościoła...
              </p>
            </div>
          )}

          {/* Error message */}
          {dailyError && (
            <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm">
              {dailyError}
            </div>
          )}

          {/* Readings Container: Scrollable Stream View (Default) or Card Grid */}
          {!isLoadingDaily && dailyData && (
            <div className="space-y-6">
              {/* Sticky Top Reading Index & View Switcher Bar */}
              <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-14 z-20">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
                  <span className="text-xs font-sans uppercase font-bold text-emerald-900 flex items-center gap-1.5 shrink-0 mr-1">
                    <Scroll className="w-3.5 h-3.5 text-emerald-600" />
                    Spis czytań:
                  </span>
                  {dailyData.readings.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(`reading-section-${r.id}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                        r.type === 'gospel'
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs'
                          : r.type === 'psalm'
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <span>{r.label}</span>
                      <span className="font-mono text-[11px] opacity-75 font-normal">({r.siglum})</span>
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setDailyViewMode('stream')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      dailyViewMode === 'stream'
                        ? 'bg-white text-emerald-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Ciągły, przewijany widok czytań (jak w Lekcjonarzu)"
                  >
                    <LayoutList className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Widok przewijany</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDailyViewMode('cards')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      dailyViewMode === 'cards'
                        ? 'bg-white text-emerald-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Widok kafelkowy"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Karty</span>
                  </button>
                </div>
              </div>

              {/* View Mode 1: Continuous Scrollable Stream (Recommended & Default) */}
              {dailyViewMode === 'stream' ? (
                <div className="max-w-4xl mx-auto space-y-8">
                  {dailyData.readings.map((reading, rIdx) => {
                    const isGospel = reading.type === 'gospel';
                    const isPsalm = reading.type === 'psalm';
                    const isLangOpen = expandedReadingLang === reading.id;
                    const isSpeaking = speakingSiglum === reading.siglum;
                    const isCopied = copiedSiglum === reading.siglum;
                    const selectableVerses = getSelectableVersesForReading(reading);

                    return (
                      <article
                        key={reading.id}
                        id={`reading-section-${reading.id}`}
                        className={`relative rounded-3xl border transition-all duration-300 bg-white overflow-hidden scroll-mt-28 shadow-xs hover:shadow-md ${
                          isGospel
                            ? 'border-emerald-300 ring-2 ring-emerald-100'
                            : isPsalm
                            ? 'border-amber-200'
                            : 'border-slate-200'
                        }`}
                      >
                        {/* Gospel Golden Top Ribbon */}
                        {isGospel && (
                          <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />
                        )}

                        <div className="p-6 sm:p-9 space-y-6">
                          {/* Top Meta & Action Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span
                                className={`px-3 py-1 rounded-xl text-xs font-sans uppercase font-bold tracking-wider ${
                                  isGospel
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : isPsalm
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                                }`}
                              >
                                {reading.label}
                              </span>

                              <span className="font-mono text-sm font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                                {reading.siglum}
                              </span>

                              {isGospel && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-sans text-emerald-800 font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                                  <Flame className="w-3.5 h-3.5 text-emerald-600" />
                                  Szczyt Liturgii Słowa
                                </span>
                              )}
                            </div>

                            {/* Utility Actions */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button
                                type="button"
                                onClick={() => handleSpeakText(reading.siglum, reading.text)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                                  isSpeaking
                                    ? 'bg-emerald-700 text-white border-emerald-700'
                                    : 'bg-white text-slate-700 hover:text-emerald-800 border-slate-200 hover:bg-slate-50'
                                }`}
                                title="Odsłuchaj lektora (synteza mowy)"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{isSpeaking ? 'Zatrzymaj' : 'Odsłuchaj'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyText(reading.siglum, reading.text)}
                                className="px-3 py-1.5 rounded-xl text-xs font-sans font-semibold bg-white text-slate-700 hover:text-emerald-800 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
                                title="Skopiuj werset do schowka"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Skopiowano</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Kopiuj</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => setExpandedReadingLang(isLangOpen ? null : reading.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                                  isLangOpen
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                                    : 'bg-white text-slate-700 hover:text-emerald-800 border-slate-200 hover:bg-slate-50'
                                }`}
                                title="Podgląd tekstu oryginalnego i Wulgaty"
                              >
                                <Languages className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Źródła</span>
                              </button>
                            </div>
                          </div>

                          {/* Liturgical Introduction */}
                          {reading.liturgicalIntroduction && (
                            <div className="border-l-3 border-emerald-600 pl-4 py-1">
                              <p className="text-sm font-sans italic text-slate-600">
                                {reading.liturgicalIntroduction}
                              </p>
                            </div>
                          )}

                          {/* Psalm Response Banner */}
                          {reading.psalmResponse && (
                            <div className="p-4 sm:p-5 bg-amber-50/90 rounded-2xl border border-amber-200 space-y-1.5">
                              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-amber-900 font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                Refren Psalmu Responsoryjnego:
                              </span>
                              <p className="font-scripture text-lg sm:text-xl font-bold text-slate-900 italic">
                                «{reading.psalmResponse}»
                              </p>
                            </div>
                          )}

                          {/* Full Scripture Body - Fluid & Readable */}
                          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50/70 border border-slate-200 shadow-2xs">
                            <p className="font-scripture text-lg sm:text-xl text-slate-900 leading-relaxed sm:leading-loose whitespace-pre-line select-text">
                              «{reading.text}»
                            </p>
                          </div>

                          {/* Parallel Original Language Preview Drawer */}
                          {isLangOpen && (
                            <div className="p-5 rounded-2xl bg-emerald-50/30 border border-emerald-200 space-y-4 animate-fade-in text-xs">
                              <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-emerald-950 font-bold border-b border-emerald-200 pb-2">
                                <span>Teksty Źródłowe & Wulgata</span>
                                <span className="text-slate-500">Aparat tekstualny</span>
                              </div>

                              {reading.greekText && (
                                <div className="space-y-1.5">
                                  <span className="text-[11px] font-mono text-emerald-900 uppercase font-bold">
                                    Novum Testamentum Graece:
                                  </span>
                                  <p className="font-serif text-sm italic text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-emerald-100">
                                    {reading.greekText}
                                  </p>
                                </div>
                              )}

                              {reading.hebrewText && (
                                <div className="space-y-1.5">
                                  <span className="text-[11px] font-mono text-emerald-900 uppercase font-bold">
                                    Biblia Hebraica Stuttgartensia:
                                  </span>
                                  <p className="font-serif text-sm italic text-slate-800 text-right leading-relaxed bg-white p-3 rounded-xl border border-emerald-100" dir="rtl">
                                    {reading.hebrewText}
                                  </p>
                                </div>
                              )}

                              {reading.latinText && (
                                <div className="space-y-1.5">
                                  <span className="text-[11px] font-mono text-emerald-900 uppercase font-bold">
                                    Biblia Sacra Vulgata (św. Hieronim):
                                  </span>
                                  <p className="font-serif text-sm italic text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-emerald-100">
                                    {reading.latinText}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Selectable Verses & Key Fragments */}
                          <div className="space-y-3 pt-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="text-xs font-sans uppercase tracking-wider text-emerald-900 font-bold flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                {isPsalm ? 'Wybierz zwrotkę / werset do skrutacji:' : 'Wybierz fragment lub werset do skrutacji:'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setReadingToPickVerse(reading)}
                                className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                              >
                                <span>Wybierz konkretne zdanie z tekstu</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  startScrutationFromDailyReading(
                                    reading,
                                    reading.siglum,
                                    reading.text,
                                    reading.theologicalTheme
                                  )
                                }
                                className="px-3.5 py-2 rounded-xl text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-all flex items-center gap-2 cursor-pointer text-left shadow-2xs font-semibold"
                                title="Skrutuj całą perykopę"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                <span className="font-bold font-mono text-xs">Całość</span>
                                <span className="text-xs text-emerald-800">({reading.siglum})</span>
                              </button>

                              {selectableVerses.slice(0, 5).map((kv, kIdx) => (
                                <button
                                  key={kIdx}
                                  type="button"
                                  onClick={() =>
                                    startScrutationFromDailyReading(
                                      reading,
                                      kv.siglum,
                                      kv.text,
                                      kv.theme
                                    )
                                  }
                                  className="px-3 py-2 rounded-xl text-xs bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 border border-slate-200 hover:border-emerald-300 transition-all flex items-center gap-2 cursor-pointer text-left group"
                                  title={kv.text}
                                >
                                  <span className="font-mono font-bold text-xs text-emerald-800 group-hover:text-emerald-900">
                                    {kv.siglum}
                                  </span>
                                  <span className="text-xs text-slate-600 group-hover:text-slate-900 truncate max-w-[180px] sm:max-w-[240px]">
                                    {kv.label}
                                  </span>
                                </button>
                              ))}

                              <button
                                type="button"
                                onClick={() => setReadingToPickVerse(reading)}
                                className="px-3 py-2 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer font-medium"
                              >
                                <span>+ Wszystkie wersety</span>
                              </button>
                            </div>
                          </div>

                          {/* Theological Theme */}
                          {reading.theologicalTheme && (
                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                              <span className="font-bold text-emerald-900 uppercase text-[10px] tracking-wider shrink-0 mt-0.5 px-2 py-0.5 rounded bg-emerald-100">
                                Motyw teologiczny:
                              </span>
                              <span className="font-serif text-slate-800 leading-relaxed text-sm">
                                {reading.theologicalTheme}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Reading Action Footer */}
                        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                          <button
                            id={`start-scrutation-${reading.id}-btn`}
                            onClick={() => setReadingToPickVerse(reading)}
                            className="flex-1 py-3.5 px-5 rounded-xl text-xs font-sans uppercase tracking-wider font-bold flex items-center justify-center gap-2 bg-emerald-700 text-white hover:bg-emerald-800 transition-all duration-200 cursor-pointer shadow-sm"
                          >
                            <BookOpen className="w-4 h-4 shrink-0" />
                            <span>Rozpocznij Skrutację (Wybierz werset / Odnośniki)</span>
                            <ArrowRight className="w-4 h-4 shrink-0" />
                          </button>

                          {onOpenPatristicForVerse && (
                            <button
                              id={`patristic-reading-${reading.id}-btn`}
                              onClick={() => onOpenPatristicForVerse(reading.siglum)}
                              className="py-3.5 px-5 rounded-xl text-xs font-sans uppercase tracking-wider font-semibold flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-all cursor-pointer shadow-xs"
                            >
                              <Scroll className="w-4 h-4 text-emerald-700 shrink-0" />
                              <span>Ojcowie Kościoła</span>
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* View Mode 2: Multi-Column Cards Layout */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dailyData.readings.map((reading) => {
                    const isGospel = reading.type === 'gospel';
                    const isPsalm = reading.type === 'psalm';
                    const isLangOpen = expandedReadingLang === reading.id;
                    const isSpeaking = speakingSiglum === reading.siglum;
                    const isCopied = copiedSiglum === reading.siglum;
                    const selectableVerses = getSelectableVersesForReading(reading);

                    return (
                      <div
                        key={reading.id}
                        className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group bg-white shadow-xs ${
                          isGospel
                            ? 'border-emerald-300 ring-1 ring-emerald-200 shadow-md'
                            : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                        }`}
                      >
                        {isGospel && (
                          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600" />
                        )}

                        <div className="p-6 sm:p-7 space-y-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span
                                  className={`px-2.5 py-1 rounded text-xs font-sans uppercase font-bold tracking-wider ${
                                    isGospel
                                      ? 'bg-emerald-700 text-white shadow-xs'
                                      : isPsalm
                                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                                  }`}
                                >
                                  {reading.label}
                                </span>
                                {isGospel && (
                                  <span className="flex items-center gap-1 text-[11px] font-sans text-emerald-800 font-bold">
                                    <Flame className="w-3.5 h-3.5 text-emerald-600" />
                                    Szczyt Liturgii Słowa
                                  </span>
                                )}
                              </div>

                              <span className="font-mono text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 inline-block">
                                {reading.siglum}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleSpeakText(reading.siglum, reading.text)}
                                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                  isSpeaking
                                    ? 'bg-emerald-700 text-white border-emerald-700'
                                    : 'bg-white text-slate-600 hover:text-emerald-700 border-slate-200 hover:bg-slate-50'
                                }`}
                                title="Odsłuchaj lektora (synteza mowy)"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleCopyText(reading.siglum, reading.text)}
                                className="p-2 rounded-lg bg-white text-slate-600 hover:text-emerald-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                                title="Skopiuj werset do schowka"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => setExpandedReadingLang(isLangOpen ? null : reading.id)}
                                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                  isLangOpen
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                                    : 'bg-white text-slate-600 hover:text-emerald-700 border-slate-200 hover:bg-slate-50'
                                }`}
                                title="Podgląd tekstu oryginalnego i Wulgaty"
                              >
                                <Languages className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {reading.liturgicalIntroduction && (
                            <p className="text-xs font-sans italic text-slate-500 border-l-2 border-emerald-600 pl-3 py-0.5">
                              {reading.liturgicalIntroduction}
                            </p>
                          )}

                          {reading.psalmResponse && (
                            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1">
                              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-amber-900 font-bold block">
                                Refren Psalmu:
                              </span>
                              <p className="font-scripture text-base font-semibold text-slate-900 italic">
                                «{reading.psalmResponse}»
                              </p>
                            </div>
                          )}

                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-h-80 overflow-y-auto pr-3 custom-scrollbar">
                            <p className="font-scripture text-base text-slate-900 leading-relaxed whitespace-pre-line">
                              «{reading.text}»
                            </p>
                          </div>

                          {/* Selectable Verses */}
                          <div className="pt-3 space-y-2 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-sans uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                {isPsalm ? 'Wybierz zwrotkę / werset:' : 'Wybierz fragment / werset:'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setReadingToPickVerse(reading)}
                                className="text-[11px] text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                              >
                                <span>Wybierz konkretne zdanie</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  startScrutationFromDailyReading(
                                    reading,
                                    reading.siglum,
                                    reading.text,
                                    reading.theologicalTheme
                                  )
                                }
                                className="px-2.5 py-1.5 rounded-lg text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer text-left shadow-xs font-medium"
                                title="Skrutuj całą perykopę"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                <span className="font-bold font-mono text-[11px]">Całość</span>
                                <span className="text-[11px] text-emerald-800">({reading.siglum})</span>
                              </button>

                              {selectableVerses.slice(0, 4).map((kv, kIdx) => (
                                <button
                                  key={kIdx}
                                  type="button"
                                  onClick={() =>
                                    startScrutationFromDailyReading(
                                      reading,
                                      kv.siglum,
                                      kv.text,
                                      kv.theme
                                    )
                                  }
                                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 hover:bg-emerald-50 text-slate-800 border border-slate-200 hover:border-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer text-left group"
                                  title={kv.text}
                                >
                                  <span className="font-mono font-bold text-[11px] text-emerald-800 group-hover:text-emerald-900">
                                    {kv.siglum}
                                  </span>
                                  <span className="text-[11px] text-slate-600 group-hover:text-slate-900 truncate max-w-[150px] sm:max-w-[190px]">
                                    {kv.label}
                                  </span>
                                </button>
                              ))}

                              <button
                                type="button"
                                onClick={() => setReadingToPickVerse(reading)}
                                className="px-2 py-1.5 rounded-lg text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center gap-1 cursor-pointer font-medium"
                              >
                                <span>+ Wszystkie wersety</span>
                              </button>
                            </div>
                          </div>

                          {reading.theologicalTheme && (
                            <div className="pt-2 text-xs text-slate-600 flex items-start gap-2">
                              <span className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider shrink-0 mt-0.5">
                                Motyw:
                              </span>
                              <span className="font-serif text-slate-700">{reading.theologicalTheme}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
                          <button
                            id={`start-scrutation-${reading.id}-btn`}
                            onClick={() => setReadingToPickVerse(reading)}
                            className="flex-1 py-3 px-4 rounded-xl text-xs font-sans uppercase tracking-wider font-bold flex items-center justify-center gap-2 bg-emerald-700 text-white hover:bg-emerald-800 transition-all duration-200 cursor-pointer shadow-xs"
                          >
                            <BookOpen className="w-4 h-4 shrink-0" />
                            <span>Skrutuj (Wybierz werset / Odnośniki)</span>
                            <ArrowRight className="w-4 h-4 shrink-0" />
                          </button>

                          {onOpenPatristicForVerse && (
                            <button
                              id={`patristic-reading-${reading.id}-btn`}
                              onClick={() => onOpenPatristicForVerse(reading.siglum)}
                              className="py-3 px-4 rounded-xl text-xs font-sans uppercase tracking-wider font-semibold flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-all cursor-pointer shadow-xs"
                            >
                              <Scroll className="w-4 h-4 text-emerald-700 shrink-0" />
                              <span>Ojcowie Kościoła</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: WYBÓR DOWOLNEGO FRAGMENTU PISMA ŚWIĘTEGO */}
      {/* ========================================================================= */}
      {activeSubTab === 'passage' && (
        <div className="space-y-8">
          {/* Main Interactive Selector Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <Scroll className="w-5 h-5 text-emerald-700" />
                <h2 className="font-serif text-lg sm:text-2xl font-bold text-slate-900">
                  Wyszukiwarka Perykop & Kanon 73 Ksiąg
                </h2>
              </div>
              <span className="text-xs text-slate-600 font-sans">
                Wpisz dowolne siglum lub wybierz księgę z listy
              </span>
            </div>

            {/* Quick Free Search Bar */}
            <div className="space-y-2">
              <label className="block text-[11px] font-sans font-bold uppercase tracking-widest text-emerald-800">
                Szybkie wyszukiwanie siglum lub tematu:
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="search-passage-query-input"
                    type="text"
                    value={customSearchQuery}
                    onChange={(e) => setCustomSearchQuery(e.target.value)}
                    placeholder="np. «Rz 8, 28-39», «Hymn o miłości», «Iz 53», «Krzew gorejący»..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none font-mono transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLookupPassage();
                      }
                    }}
                  />
                </div>
                <button
                  id="lookup-passage-btn"
                  onClick={() => handleLookupPassage()}
                  disabled={isLoadingPassage}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
                >
                  {isLoadingPassage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <BookMarked className="w-4 h-4" />
                  )}
                  <span>Pobierz Tekst</span>
                </button>
              </div>
            </div>

            {/* Fine-Tuned Bible Book, Chapter, Verse Inputs */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-slate-700 font-bold">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ręczny selektor wg struktury kanonu:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Book Select */}
                <div className="sm:col-span-6 space-y-1.5">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-slate-600">
                    Księga Biblijna:
                  </label>
                  <select
                    id="select-book-dropdown"
                    value={selectedBookSiglum}
                    onChange={(e) => {
                      setSelectedBookSiglum(e.target.value);
                      setSelectedChapter(1);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none"
                  >
                    <optgroup label="Nowy Testament (27)">
                      {BIBLE_BOOKS.filter(b => b.testament === 'NT').map(b => (
                        <option key={b.siglum} value={b.siglum}>
                          {b.siglum} — {b.fullName} ({b.chaptersCount} rozdz.)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Stary Testament (46)">
                      {BIBLE_BOOKS.filter(b => b.testament === 'ST').map(b => (
                        <option key={b.siglum} value={b.siglum}>
                          {b.siglum} — {b.fullName} ({b.chaptersCount} rozdz.)
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Chapter input */}
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-slate-600">
                    Rozdział (1 – {currentBookInfo.chaptersCount}):
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
                      className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      id="select-chapter-input"
                      type="number"
                      min={1}
                      max={currentBookInfo.chaptersCount}
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(Math.max(1, Math.min(currentBookInfo.chaptersCount, Number(e.target.value) || 1)))}
                      className="w-full text-center py-2 rounded-lg bg-white border border-slate-300 text-sm text-slate-800 font-mono focus:border-emerald-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedChapter(Math.min(currentBookInfo.chaptersCount, selectedChapter + 1))}
                      className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Verses input */}
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-slate-600">
                    Wersety (np. 1-14):
                  </label>
                  <input
                    id="select-verses-input"
                    type="text"
                    value={versesInput}
                    onChange={(e) => setVersesInput(e.target.value)}
                    placeholder="np. 1-14 lub 29-34"
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-sm text-slate-800 font-mono focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {passageError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-900 text-xs rounded-xl">
                {passageError}
              </div>
            )}
          </div>

          {/* Passage Lookup Result Card */}
          {passageLookupResult && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-emerald-300 shadow-md space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold">
                      {passageLookupResult.siglum}
                    </span>
                    <span className="text-xs font-sans text-slate-600">
                      {passageLookupResult.bookFullName} ({passageLookupResult.testament === 'NT' ? 'Nowy Testament' : 'Stary Testament'})
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                    {passageLookupResult.pericopeTitle}
                  </h3>
                </div>

                <button
                  id="start-scrutation-from-lookup-btn"
                  onClick={() => startScrutationFromLookup(passageLookupResult)}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans uppercase tracking-widest font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs self-start md:self-center"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Rozpocznij Skrutację z tego Fragmentu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Full Text */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-emerald-800 font-bold flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-emerald-600" />
                    Tekst Pisma Świętego (Biblia Tysiąclecia / Jerozolimska)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeakText(passageLookupResult.siglum, passageLookupResult.text)}
                      className="text-xs text-slate-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Czytaj</span>
                    </button>
                    <button
                      onClick={() => handleCopyText(passageLookupResult.siglum, passageLookupResult.text)}
                      className="text-xs text-slate-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopiuj</span>
                    </button>
                  </div>
                </div>

                <p className="font-scripture text-base sm:text-lg text-slate-900 leading-relaxed whitespace-pre-line italic font-medium">
                  «{passageLookupResult.text}»
                </p>
              </div>

              {/* Theological theme, suggested paths and keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-slate-600">
                <div className="space-y-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-sans font-bold text-emerald-800 uppercase text-[10px] tracking-wider block">
                    Kontekst teologiczny i motyw:
                  </span>
                  <p className="font-serif text-slate-800 leading-relaxed">
                    {passageLookupResult.theologicalTheme}
                  </p>
                </div>
                {passageLookupResult.keyWords && passageLookupResult.keyWords.length > 0 && (
                  <div className="space-y-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-sans font-bold text-emerald-800 uppercase text-[10px] tracking-wider block">
                      Kluczowe pojęcia do tropienia powiązań:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {passageLookupResult.keyWords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-md text-[11px] font-sans font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Famous Pericopes Catalog */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  Katalog Sławnych Fragmentów i Perykop
                </h3>
                <p className="text-xs font-sans text-slate-600">
                  Wybierz kluczowy fragment biblijny, aby załadować pełen werset i rozpocząć drogę wersetów
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['Wszystkie', 'Ewangelia', 'Listy', 'Prorocy', 'Pięcioksiąg', 'Mądrość'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPericopeCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                      pericopeCategoryFilter === cat
                        ? 'bg-emerald-700 text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPericopes.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleLookupPassage(p.siglum);
                  }}
                  className="p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-800 px-2.5 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                        {p.siglum}
                      </span>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-600 px-2 py-0.5 rounded bg-slate-100">
                        {p.category}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                      {p.title}
                    </h4>

                    {p.verseExcerpt && (
                      <p className="font-scripture text-xs text-slate-600 italic line-clamp-2">
                        «{p.verseExcerpt}»
                      </p>
                    )}

                    <p className="text-[11px] font-sans text-slate-500">
                      {p.theme}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-700 font-sans font-bold uppercase tracking-wider">
                    <span>Załaduj i skrutuj</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: LOSOWANIE CYTATU Z CAŁEGO PISMA ŚWIĘTEGO (SORS BIBLICA) */}
      {/* ========================================================================= */}
      {activeSubTab === 'random' && (
        <div className="space-y-6">
          {/* Top Filter and Randomizer Bar */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-sans uppercase tracking-widest font-bold">
                  <Dice5 className="w-3 h-3 text-emerald-600" />
                  <span>Sors Biblica • Boża Opatrzność</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-slate-900 font-bold">
                  Losowanie Słowa z <span className="text-emerald-800 italic font-normal">Całego Pisma Świętego</span>
                </h3>
                <p className="text-xs sm:text-sm font-sans text-slate-600">
                  Wylosuj natchnione Słowo z kanonu 73 ksiąg biblijnych i wejdź w głąb jego odnośników.
                </p>
              </div>
            </div>

            {/* Filter controls */}
            <div className="space-y-4">
              {/* Testament Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-sans text-slate-700 uppercase tracking-wider font-bold mr-1">
                  Kanon:
                </span>
                {[
                  { key: 'ALL', label: 'Całe Pismo Święte (ST + NT)' },
                  { key: 'ST', label: 'Stary Testament (ST)' },
                  { key: 'NT', label: 'Nowy Testament (NT)' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setRandomTestamentFilter(item.key as any);
                      handleDrawRandomQuote(randomCategoryFilter, item.key as any);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider transition-all cursor-pointer ${
                      randomTestamentFilter === item.key
                        ? 'bg-emerald-700 text-white font-bold shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-sans text-slate-700 uppercase tracking-wider font-bold mr-1">
                  Tradycja:
                </span>
                {[
                  'Wszystkie',
                  'Ewangelie',
                  'Mądrość i Psalmy',
                  'Prorocy',
                  'Dzieje i Listy Apostolskie',
                  'Pięcioksiąg i Historia',
                  'Apokalipsa'
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setRandomCategoryFilter(cat);
                      handleDrawRandomQuote(cat, randomTestamentFilter);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-sans transition-all cursor-pointer ${
                      randomCategoryFilter === cat
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Draw Button */}
            <div className="pt-2">
              <button
                id="draw-random-quote-btn"
                type="button"
                onClick={() => handleDrawRandomQuote()}
                disabled={isDrawingRandom}
                className="w-full py-4 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-sans font-bold text-sm sm:text-base uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-3 shadow-md cursor-pointer disabled:opacity-75"
              >
                {isDrawingRandom ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Otwieranie Pisma Świętego...</span>
                  </>
                ) : (
                  <>
                    <Dice5 className="w-5 h-5 text-white" />
                    <span>Wylosuj Słowo z Pisma Świętego</span>
                    <Sparkles className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Current Random Quote Card */}
          {currentRandomQuote && (
            <div className="bg-white rounded-2xl border border-emerald-300 p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
              {/* Quote Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-base sm:text-lg font-bold text-emerald-900 px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                    {currentRandomQuote.siglum}
                  </span>
                  <span className="text-xs font-sans font-semibold text-slate-700 px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
                    {currentRandomQuote.bookName}
                  </span>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-800 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
                    {currentRandomQuote.category}
                  </span>
                  <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {currentRandomQuote.testament === 'NT' ? 'Nowy Testament' : 'Stary Testament'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeakText(currentRandomQuote.siglum, currentRandomQuote.text)}
                    className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Czytaj na głos"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyText(currentRandomQuote.siglum, currentRandomQuote.text)}
                    className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Kopiuj cytat"
                  >
                    {copiedSiglum === currentRandomQuote.siglum ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  {onOpenPatristicForVerse && (
                    <button
                      onClick={() => onOpenPatristicForVerse(currentRandomQuote.siglum)}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-sans text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Zobacz komentarze Ojców Kościoła"
                    >
                      <BookMarked className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="hidden sm:inline">Ojcowie Kościoła</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Scripture Text */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {currentRandomQuote.title}
                </h3>

                <div className="p-5 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs relative">
                  <Quote className="absolute top-4 left-4 w-7 h-7 text-emerald-600/20 pointer-events-none" />
                  <p className="font-scripture text-lg sm:text-xl text-slate-900 leading-relaxed italic pl-6 sm:pl-8 font-medium">
                    «{currentRandomQuote.text}»
                  </p>
                </div>
              </div>

              {/* Theological Context */}
              {currentRandomQuote.theologicalContext && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5 text-xs sm:text-sm shadow-xs">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-sans font-bold text-xs uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Sens duchowy & egzystencjalny:</span>
                  </div>
                  <p className="font-serif text-slate-800 leading-relaxed">
                    {currentRandomQuote.theologicalContext}
                  </p>
                </div>
              )}

              {/* Suggested Cross-References */}
              {currentRandomQuote.crossReferencesPreview && currentRandomQuote.crossReferencesPreview.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-slate-700">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Drogowskazy do skrutacji (Miejsca paralelne):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentRandomQuote.crossReferencesPreview.map((cr, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-emerald-800">{cr.siglum}</span>
                          <span className="text-[10px] text-slate-500 italic">{cr.relation}</span>
                        </div>
                        <p className="text-xs font-scripture text-slate-800 italic line-clamp-2">
                          «{cr.text}»
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Call to Action */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  id="start-scrutation-from-random-btn"
                  type="button"
                  onClick={() => startScrutationFromRandomQuote(currentRandomQuote)}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-white" />
                  <span>Rozpocznij Skrutację tego Słowa</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDrawRandomQuote()}
                  className="py-3 px-5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-sans font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Losuj inne Słowo</span>
                </button>
              </div>
            </div>
          )}

          {/* History of Drawn Quotes */}
          {drawHistory.length > 1 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-600 uppercase tracking-wider font-bold">
                <span>Historia losowań w tej sesji:</span>
                <span className="text-[10px]">{drawHistory.length} wersetów</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {drawHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentRandomQuote(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                      currentRandomQuote?.id === item.id
                        ? 'bg-emerald-50 border-emerald-400'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-emerald-800">{item.siglum}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{item.category}</span>
                    </div>
                    <p className="text-xs font-serif text-slate-800 truncate">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
