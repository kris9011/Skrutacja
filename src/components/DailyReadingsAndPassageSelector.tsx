import React, { useState, useEffect } from 'react';
import { 
  DailyLiturgicalReadings, 
  DailyReadingItem, 
  ScriptureLookupResult, 
  ScrutationSession 
} from '../types';
import { BIBLE_BOOKS } from '../data/biblicalData';
import { getGuaranteedDailyReadings } from '../data/liturgicalCalendarFallback';
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
  X
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
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'passage'>('daily');

  // Daily Readings state
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [dailyData, setDailyData] = useState<DailyLiturgicalReadings | null>(null);
  const [isLoadingDaily, setIsLoadingDaily] = useState<boolean>(false);
  const [dailyError, setDailyError] = useState<string | null>(null);
  const [copiedSiglum, setCopiedSiglum] = useState<string | null>(null);
  const [speakingSiglum, setSpeakingSiglum] = useState<string | null>(null);
  const [expandedReadingLang, setExpandedReadingLang] = useState<string | null>(null);
  
  // Verse Picker Modal State
  const [readingToPickVerse, setReadingToPickVerse] = useState<DailyReadingItem | null>(null);
  const [customVerseInput, setCustomVerseInput] = useState<string>('');
  const [customVerseTextInput, setCustomVerseTextInput] = useState<string>('');

  // Passage lookup state
  const [selectedBookSiglum, setSelectedBookSiglum] = useState<string>('J');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [versesInput, setVersesInput] = useState<string>('29-34');
  const [customSearchQuery, setCustomSearchQuery] = useState<string>('');
  const [pericopeCategoryFilter, setPericopeCategoryFilter] = useState<string>('Wszystkie');
  const [isLoadingPassage, setIsLoadingPassage] = useState<boolean>(false);
  const [passageLookupResult, setPassageLookupResult] = useState<ScriptureLookupResult | null>(null);
  const [passageError, setPassageError] = useState<string | null>(null);

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
      // Seamless fallback so the user always has verified, authentic Catholic readings
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
    const today = new Date().toISOString().slice(0, 10);
    setSelectedDate(today);
  };

  const handleShiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
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
      // scroll to result
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err) {
      console.error('Error looking up scripture:', err);
      setPassageError('Nie udało się pobrać tekstu fragmentu. Sprawdź poprawność siglum.');
    } finally {
      setIsLoadingPassage(false);
    }
  };

  // Helper: Extract or get all selectable verses / fragments for a reading
  const getSelectableVersesForReading = (reading: DailyReadingItem) => {
    const list: { siglum: string; label: string; text: string; theme?: string; isFull?: boolean }[] = [
      {
        siglum: reading.siglum,
        label: 'Cała perykopa czytania',
        text: reading.text,
        theme: reading.theologicalTheme,
        isFull: true
      }
    ];

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

    return list;
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
          crossReferenceReason: `Punkt startowy ze Słowa Bożego na dziś: ${reading.label} (${targetSiglum})`,
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

  // Liturgical color formatting
  const getLiturgicalColorStyle = (color?: string) => {
    switch (color) {
      case 'green':
        return { 
          name: 'Zieleń liturgiczna (Okres Zwykły)', 
          badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60',
          indicator: 'bg-emerald-500'
        };
      case 'purple':
        return { 
          name: 'Fiolet liturgiczny (Adwent / Wielki Post)', 
          badgeClass: 'bg-purple-950/60 text-purple-200 border-purple-700/60',
          indicator: 'bg-purple-500'
        };
      case 'white':
        return { 
          name: 'Biel / Złoto (Okres Paschalny / Narodzenia / Uroczystości)', 
          badgeClass: 'bg-[#22222a] text-[#C5A059] border-[#C5A059]/60',
          indicator: 'bg-[#C5A059]'
        };
      case 'red':
        return { 
          name: 'Czerwień liturgiczna (Męka Pańska / Duch Święty / Męczennicy)', 
          badgeClass: 'bg-red-950/60 text-red-300 border-red-700/60',
          indicator: 'bg-red-500'
        };
      default:
        return { 
          name: 'Zieleń liturgiczna', 
          badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60',
          indicator: 'bg-emerald-500'
        };
    }
  };

  // Filtered pericopes
  const filteredPericopes = FAMOUS_PERICOPES.filter(p => {
    if (pericopeCategoryFilter === 'Wszystkie') return true;
    return p.category === pericopeCategoryFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 text-[#E0E0D6]">
      {/* ========================================================================= */}
      {/* MODAL: WYBÓR KONKRETNEGO FRAGMENTU / WERSETU DO SKRUTACJI */}
      {/* ========================================================================= */}
      {readingToPickVerse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div 
            className="relative w-full max-w-2xl bg-[#141419] border-2 border-[#C5A059]/60 rounded-2xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-b from-[#1E1E28] to-[#141419] border-b border-[#3D3524] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                    {readingToPickVerse.label}
                  </span>
                  <span className="font-mono text-xs text-amber-200/90 font-bold">
                    {readingToPickVerse.siglum}
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">
                  Wybierz fragment do skrutacji
                </h3>
                <p className="text-xs text-[#A39B8B] font-serif leading-relaxed">
                  Możesz skrutować całą perykopę lub wybrać konkretny werset, który szczególnie porusza Twoje serce w dzisiejszej modlitwie.
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => setReadingToPickVerse(null)}
                className="p-2 rounded-xl bg-[#20202A] hover:bg-[#2A2A38] text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Zamknij"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Verse List */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Option 1: Whole Pericope */}
              <div 
                onClick={() => startScrutationFromDailyReading(
                  readingToPickVerse, 
                  readingToPickVerse.siglum, 
                  readingToPickVerse.text, 
                  readingToPickVerse.theologicalTheme
                )}
                className="p-4 rounded-xl bg-[#1A1A24] hover:bg-[#232332] border-2 border-[#3D3524] hover:border-[#C5A059] transition-all cursor-pointer group shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-bold text-sm text-white group-hover:text-[#C5A059]">
                      Całe czytanie (Perykopa)
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/40 text-amber-200 font-semibold border border-amber-900/40">
                      {readingToPickVerse.siglum}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#C5A059] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Skrutuj całość <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs text-[#A0A095] line-clamp-2 font-serif italic leading-relaxed">
                  «{readingToPickVerse.text}»
                </p>
              </div>

              {/* Option 2: Specific Key Verses */}
              {readingToPickVerse.keyVerses && readingToPickVerse.keyVerses.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-sans uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Wyodrębnione kluczowe wersety:
                  </span>

                  <div className="space-y-2.5">
                    {readingToPickVerse.keyVerses.map((kv, idx) => (
                      <div
                        key={idx}
                        onClick={() => startScrutationFromDailyReading(
                          readingToPickVerse, 
                          kv.siglum, 
                          kv.text, 
                          kv.theme
                        )}
                        className="p-4 rounded-xl bg-[#16161E] hover:bg-[#1E1E2A] border border-[#2D2D3A] hover:border-[#C5A059] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] font-mono text-xs font-bold border border-[#C5A059]/30">
                              {kv.siglum}
                            </span>
                            <span className="font-semibold text-sm text-[#E0E0D6] group-hover:text-white">
                              {kv.label}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Skrutuj ten werset <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <p className="text-xs text-stone-300 font-serif leading-relaxed italic bg-black/40 p-2.5 rounded-lg border border-[#22222C]">
                          «{kv.text}»
                        </p>
                        {kv.theme && (
                          <span className="inline-block mt-2 text-[11px] text-[#8C8270] font-sans">
                            <strong className="text-[#C5A059]/80 font-normal">Temat teologiczny:</strong> {kv.theme}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Option 3: Custom Siglum / Verse Input */}
              <div className="p-4 rounded-xl bg-[#101014] border border-[#2D2D3A] space-y-3">
                <span className="text-[11px] font-sans uppercase tracking-wider text-stone-300 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                  Lub wpisz własny werset z tego czytania:
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customVerseInput}
                    onChange={(e) => setCustomVerseInput(e.target.value)}
                    placeholder={`np. ${readingToPickVerse.siglum.split(' ')[0]} 7, 6`}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0C0C0F] border border-[#3D3524] text-white text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const finalSiglum = customVerseInput.trim() || readingToPickVerse.siglum;
                      startScrutationFromDailyReading(
                        readingToPickVerse, 
                        finalSiglum, 
                        customVerseTextInput.trim() || readingToPickVerse.text,
                        `Werset: ${finalSiglum}`
                      );
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#b08e4c] text-[#0F0F12] text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow"
                  >
                    Skrutuj ten werset
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0E0E11] border-t border-[#3D3524] flex justify-end">
              <button
                type="button"
                onClick={() => setReadingToPickVerse(null)}
                className="px-5 py-2.5 rounded-xl bg-[#1E1E26] hover:bg-[#282834] text-stone-300 text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Editorial Header Banner */}
      <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-[#18181E] via-[#121216] to-[#0D0D10] border border-[#3D3524] shadow-2xl overflow-hidden text-center space-y-4">
        {/* Subtle Decorative Background Gold Lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0F0F12] border border-[#3D3524] text-[#C5A059] text-[11px] font-sans uppercase tracking-[0.25em]">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Liturgia Słowa & Kanon Pisma</span>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-light tracking-wide text-[#E0E0D6]">
          Źródło Słowa do <span className="text-[#C5A059] italic font-normal">Skrutacji</span>
        </h1>

        <p className="text-sm sm:text-base font-serif text-[#A39B8B] max-w-2xl mx-auto leading-relaxed">
          Wybierz dzisiejsze czytanie mszalne z Lekcjonarza Kościoła lub odszukaj dowolną perykopę ze Starego bądź Nowego Testamentu, aby natychmiast rozpocząć drogę odnośników biblijnych.
        </p>

        {/* Liturgical Tab Switcher */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex p-1.5 bg-[#0F0F12] border border-[#3D3524] rounded-xl max-w-md w-full shadow-inner">
            <button
              id="subtab-daily-btn"
              onClick={() => setActiveSubTab('daily')}
              className={`flex-1 py-3 px-5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                activeSubTab === 'daily'
                  ? 'bg-gradient-to-r from-[#3D3524] to-[#2E281C] text-[#C5A059] border border-[#C5A059]/40 shadow-md'
                  : 'text-[#8C8270] hover:text-[#E0E0D6]'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Czytania z Dnia</span>
            </button>
            <button
              id="subtab-passage-btn"
              onClick={() => setActiveSubTab('passage')}
              className={`flex-1 py-3 px-5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                activeSubTab === 'passage'
                  ? 'bg-gradient-to-r from-[#3D3524] to-[#2E281C] text-[#C5A059] border border-[#C5A059]/40 shadow-md'
                  : 'text-[#8C8270] hover:text-[#E0E0D6]'
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span>Wybór Fragmentu</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: CZYTANIA Z DNIA (LITURGIA SŁOWA) */}
      {/* ========================================================================= */}
      {activeSubTab === 'daily' && (
        <div className="space-y-6">
          {/* Liturgical Control Bar */}
          <div className="bg-[#141418] rounded-xl p-4 sm:p-5 border border-[#3D3524] shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Date navigation */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="daily-prev-day-btn"
                onClick={() => handleShiftDate(-1)}
                className="p-2.5 rounded-lg bg-[#0F0F12] border border-[#3D3524] hover:border-[#C5A059] text-[#8C8270] hover:text-[#C5A059] transition-colors cursor-pointer flex items-center gap-1 text-xs font-sans"
                title="Poprzedni dzień"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Wczoraj</span>
              </button>
              
              <button
                id="daily-today-btn"
                onClick={handleSetToday}
                className="px-3.5 py-2 rounded-lg bg-[#1F1F26] border border-[#3D3524] hover:border-[#C5A059] text-xs font-sans uppercase tracking-wider text-[#C5A059] font-semibold transition-colors cursor-pointer"
              >
                Dzisiaj
              </button>

              <button
                id="daily-next-day-btn"
                onClick={() => handleShiftDate(1)}
                className="p-2.5 rounded-lg bg-[#0F0F12] border border-[#3D3524] hover:border-[#C5A059] text-[#8C8270] hover:text-[#C5A059] transition-colors cursor-pointer flex items-center gap-1 text-xs font-sans"
                title="Następny dzień"
              >
                <span className="hidden sm:inline">Jutro</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-[#3D3524]/60">
                <Calendar className="w-4 h-4 text-[#8C8270]" />
                <input
                  id="daily-date-picker"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0F0F12] border border-[#3D3524] text-xs text-[#E0E0D6] font-mono focus:outline-none focus:border-[#C5A059] cursor-pointer"
                />
              </div>
            </div>

            {/* Liturgical Badges */}
            {dailyData && (
              <div className="flex items-center gap-3 flex-wrap justify-end">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm ${getLiturgicalColorStyle(dailyData.liturgicalColor).badgeClass}`}>
                  <span className={`w-2 h-2 rounded-full ${getLiturgicalColorStyle(dailyData.liturgicalColor).indicator}`} />
                  {getLiturgicalColorStyle(dailyData.liturgicalColor).name}
                </span>
                <span className="text-xs font-mono text-[#A39B8B] px-2.5 py-1 rounded bg-[#0F0F12] border border-[#3D3524]">
                  {dailyData.liturgicalCycle}
                </span>
              </div>
            )}
          </div>

          {/* Liturgical Celebration Header Ribbon */}
          {dailyData && (
            <div className="p-6 rounded-xl bg-gradient-to-r from-[#1A1A22] via-[#141418] to-[#141418] border border-[#3D3524] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#C5A059] text-xs font-sans uppercase tracking-[0.2em] font-semibold">
                  <Flame className="w-4 h-4" />
                  <span>{dailyData.formattedDate}</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-light text-[#E0E0D6]">
                  {dailyData.liturgicalCelebration}
                </h2>
              </div>
              <div className="flex items-center gap-3 bg-[#0F0F12] p-3 rounded-lg border border-[#3D3524]/80 text-xs font-serif text-[#A39B8B] max-w-sm">
                <Info className="w-5 h-5 text-[#C5A059] shrink-0" />
                <span>
                  Wybierz werset z poniższego zestawu czytań, aby wejść w modlitwę i zbadać jego korzenie w całym Piśmie Świętym.
                </span>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoadingDaily && (
            <div className="py-24 text-center space-y-4 rounded-xl bg-[#141418] border border-[#3D3524]">
              <Loader2 className="w-10 h-10 text-[#C5A059] animate-spin mx-auto" />
              <p className="text-sm font-serif text-[#A39B8B] tracking-wide">
                Pobieranie czytań mszalnych z Lekcjonarza Kościoła...
              </p>
            </div>
          )}

          {/* Error message */}
          {dailyError && (
            <div className="p-5 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-sm">
              {dailyError}
            </div>
          )}

          {/* Readings Grid - Manuscript Card Design */}
          {!isLoadingDaily && dailyData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dailyData.readings.map((reading) => {
                const isGospel = reading.type === 'gospel';
                const isPsalm = reading.type === 'psalm';
                const isLangOpen = expandedReadingLang === reading.id;
                const isSpeaking = speakingSiglum === reading.siglum;
                const isCopied = copiedSiglum === reading.siglum;

                return (
                  <div
                    key={reading.id}
                    className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
                      isGospel 
                        ? 'bg-gradient-to-b from-[#1C1A17] to-[#141418] border-[#C5A059] shadow-xl shadow-[#C5A059]/5' 
                        : 'bg-[#141418] border-[#3D3524] hover:border-[#8C8270]/80 shadow-md'
                    }`}
                  >
                    {/* Gospel Golden Top Ribbon */}
                    {isGospel && (
                      <div className="h-1.5 w-full bg-gradient-to-r from-[#C5A059] via-[#E5C158] to-[#C5A059]" />
                    )}

                    <div className="p-6 sm:p-7 space-y-5">
                      {/* Top Meta Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`px-2.5 py-1 rounded text-xs font-sans uppercase font-bold tracking-wider ${
                              isGospel 
                                ? 'bg-[#C5A059] text-[#0F0F12] shadow-sm' 
                                : isPsalm
                                ? 'bg-[#22222A] text-amber-300 border border-amber-500/30'
                                : 'bg-[#0F0F12] text-[#C5A059] border border-[#3D3524]'
                            }`}>
                              {reading.label}
                            </span>
                            {isGospel && (
                              <span className="flex items-center gap-1 text-[11px] font-sans text-[#C5A059] font-semibold">
                                <Flame className="w-3.5 h-3.5" />
                                Szczyt Liturgii Słowa
                              </span>
                            )}
                          </div>
                          
                          <span className="font-mono text-sm font-bold text-[#E0E0D6] bg-[#0F0F12] px-2.5 py-1 rounded border border-[#3D3524] inline-block">
                            {reading.siglum}
                          </span>
                        </div>

                        {/* Fast Utility Actions: Audio read, Copy, Languages */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSpeakText(reading.siglum, reading.text)}
                            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                              isSpeaking 
                                ? 'bg-[#C5A059] text-[#0F0F12] border-[#C5A059]' 
                                : 'bg-[#0F0F12] text-[#8C8270] hover:text-[#C5A059] border-[#3D3524]'
                            }`}
                            title="Odsłuchaj lektora (synteza mowy)"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleCopyText(reading.siglum, reading.text)}
                            className="p-2 rounded-lg bg-[#0F0F12] text-[#8C8270] hover:text-[#C5A059] border border-[#3D3524] transition-colors cursor-pointer"
                            title="Skopiuj werset do schowka"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => setExpandedReadingLang(isLangOpen ? null : reading.id)}
                            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                              isLangOpen 
                                ? 'bg-[#3D3524] text-[#C5A059] border-[#C5A059]' 
                                : 'bg-[#0F0F12] text-[#8C8270] hover:text-[#C5A059] border-[#3D3524]'
                            }`}
                            title="Podgląd tekstu oryginalnego i Wulgaty"
                          >
                            <Languages className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Liturgical Introduction */}
                      {reading.liturgicalIntroduction && (
                        <p className="text-xs font-sans italic text-[#8C8270] border-l-2 border-[#3D3524] pl-3 py-0.5">
                          {reading.liturgicalIntroduction}
                        </p>
                      )}

                      {/* Psalm Response Banner */}
                      {reading.psalmResponse && (
                        <div className="p-3.5 bg-gradient-to-r from-[#191922] to-[#121216] rounded-xl border border-[#3D3524] space-y-1">
                          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5A059] font-bold block">
                            Refren Psalmu:
                          </span>
                          <p className="font-scripture text-base font-medium text-[#E0E0D6] italic">
                            «{reading.psalmResponse}»
                          </p>
                        </div>
                      )}

                      {/* Scripture Body with Illuminated Manuscript Styling */}
                      <div className="p-4 rounded-xl bg-[#0C0C0F] border border-[#272730] max-h-56 overflow-y-auto pr-3 custom-scrollbar">
                        <p className="font-scripture text-base text-[#E0E0D6] leading-relaxed whitespace-pre-line">
                          «{reading.text}»
                        </p>
                      </div>

                      {/* Parallel Original Language Preview Drawer */}
                      {isLangOpen && (
                        <div className="p-4 rounded-xl bg-[#101014] border border-[#C5A059]/40 space-y-3 animate-fade-in text-xs">
                          <div className="flex items-center justify-between text-[11px] font-sans uppercase tracking-wider text-[#C5A059] font-semibold border-b border-[#3D3524] pb-2">
                            <span>Teksty Źródłowe & Wulgata</span>
                            <span className="text-[#8C8270]">Originalia</span>
                          </div>
                          
                          {reading.greekText && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-[#8C8270] uppercase">Novum Testamentum Graece:</span>
                              <p className="font-serif italic text-amber-200/90 leading-relaxed">
                                {reading.greekText}
                              </p>
                            </div>
                          )}

                          {reading.hebrewText && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-[#8C8270] uppercase">Biblia Hebraica Stuttgartensia:</span>
                              <p className="font-serif italic text-amber-200/90 text-right leading-relaxed" dir="rtl">
                                {reading.hebrewText}
                              </p>
                            </div>
                          )}

                          {reading.latinText && (
                            <div className="space-y-1 pt-1 border-t border-[#25252D]">
                              <span className="text-[10px] font-mono text-[#8C8270] uppercase">Biblia Sacra Vulgata (św. Hieronim):</span>
                              <p className="font-serif italic text-stone-300 leading-relaxed">
                                {reading.latinText}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Selectable Verses & Key Fragments in this Reading */}
                      <div className="pt-3 space-y-2 border-t border-[#25252D]">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-sans uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                            Wybierz fragment / werset do skrutacji:
                          </span>
                          <button
                            type="button"
                            onClick={() => setReadingToPickVerse(reading)}
                            className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <span>Wszystkie wersety</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => startScrutationFromDailyReading(
                              reading, 
                              reading.siglum, 
                              reading.text, 
                              reading.theologicalTheme
                            )}
                            className="px-2.5 py-1.5 rounded-lg text-xs bg-[#1C1C24] hover:bg-[#2A2A36] text-[#E0E0D6] border border-[#3D3524] hover:border-[#C5A059] transition-all flex items-center gap-1.5 cursor-pointer text-left shadow-sm"
                            title="Skrutuj całą perykopę"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                            <span className="font-semibold font-mono text-[11px] text-[#C5A059]">Całość</span>
                            <span className="text-[11px] text-[#8C8270]">({reading.siglum})</span>
                          </button>

                          {reading.keyVerses && reading.keyVerses.map((kv, kIdx) => (
                            <button
                              key={kIdx}
                              type="button"
                              onClick={() => startScrutationFromDailyReading(
                                reading, 
                                kv.siglum, 
                                kv.text, 
                                kv.theme
                              )}
                              className="px-2.5 py-1.5 rounded-lg text-xs bg-[#171720] hover:bg-[#252535] text-[#E0E0D6] border border-[#2B2B38] hover:border-[#C5A059] transition-all flex items-center gap-1.5 cursor-pointer text-left group"
                              title={kv.text}
                            >
                              <span className="font-mono font-bold text-[11px] text-[#C5A059] group-hover:text-amber-300">
                                {kv.siglum}
                              </span>
                              <span className="text-[11px] text-[#A0A095] group-hover:text-white truncate max-w-[170px] sm:max-w-[210px]">
                                {kv.label}
                              </span>
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => setReadingToPickVerse(reading)}
                            className="px-2 py-1.5 rounded-lg text-[11px] bg-[#121217] hover:bg-[#1A1A22] text-[#8C8270] hover:text-[#C5A059] border border-[#2B2B38] hover:border-[#C5A059] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>+ Inny werset</span>
                          </button>
                        </div>
                      </div>

                      {/* Theological Theme Annotation */}
                      {reading.theologicalTheme && (
                        <div className="pt-2 text-xs text-[#8C8270] flex items-start gap-2">
                          <span className="font-semibold text-[#C5A059] uppercase text-[10px] tracking-wider shrink-0 mt-0.5">
                            Motyw:
                          </span>
                          <span className="font-serif">{reading.theologicalTheme}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Launch Buttons: Odnośniki & Ojcowie Kościoła */}
                    <div className="p-4 sm:p-5 bg-[#0E0E11] border-t border-[#3D3524] flex flex-col sm:flex-row gap-2.5">
                      <button
                        id={`start-scrutation-${reading.id}-btn`}
                        onClick={() => setReadingToPickVerse(reading)}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-sans uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg hover:scale-[1.01] ${
                          isGospel
                            ? 'bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0F0F12] hover:brightness-110'
                            : 'bg-[#C5A059] text-black hover:bg-[#E5C98B]'
                        }`}
                      >
                        <BookOpen className="w-4 h-4 shrink-0" />
                        <span>Skrutuj (Wybierz fragment / Odnośniki)</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>

                      {onOpenPatristicForVerse && (
                        <button
                          id={`patristic-reading-${reading.id}-btn`}
                          onClick={() => onOpenPatristicForVerse(reading.siglum)}
                          className="py-3 px-4 rounded-xl text-xs font-sans uppercase tracking-wider font-semibold flex items-center justify-center gap-2 bg-[#1C1C24] hover:bg-[#252530] text-[#E0E0D6] border border-[#3D3524] hover:border-[#C5A059] transition-all cursor-pointer"
                        >
                          <Scroll className="w-4 h-4 text-[#C5A059] shrink-0" />
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

      {/* ========================================================================= */}
      {/* SUBTAB 2: WYBÓR DOWOLNEGO FRAGMENTU PISMA ŚWIĘTEGO */}
      {/* ========================================================================= */}
      {activeSubTab === 'passage' && (
        <div className="space-y-8">
          {/* Main Interactive Selector Card */}
          <div className="bg-gradient-to-b from-[#18181E] to-[#121216] rounded-2xl p-6 sm:p-8 border border-[#3D3524] shadow-xl space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#3D3524] pb-4">
              <div className="flex items-center gap-2.5 text-[#C5A059]">
                <Scroll className="w-5 h-5" />
                <h2 className="font-display text-lg sm:text-2xl font-light text-[#E0E0D6]">
                  Wyszukiwarka Perykop & Kanon 73 Ksiąg
                </h2>
              </div>
              <span className="text-xs text-[#8C8270] font-sans">
                Wpisz dowolne siglum lub wybierz księgę z listy
              </span>
            </div>

            {/* Quick Free Search Bar */}
            <div className="space-y-2">
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-widest text-[#C5A059]">
                Szybkie wyszukiwanie siglum lub tematu:
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8C8270] absolute left-3.5 top-3.5" />
                  <input
                    id="search-passage-query-input"
                    type="text"
                    value={customSearchQuery}
                    onChange={(e) => setCustomSearchQuery(e.target.value)}
                    placeholder="np. «Rz 8, 28-39», «Hymn o miłości», «Iz 53», «Krzew gorejący»..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0F0F12] border border-[#3D3524] text-sm text-[#E0E0D6] placeholder-[#8C8270] focus:border-[#C5A059] focus:outline-none font-mono transition-colors"
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
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-[#0F0F12] font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
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
            <div className="p-5 rounded-xl bg-[#0E0E12] border border-[#272730] space-y-4">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#8C8270] font-semibold">
                <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Ręczny selektor wg struktury kanonu:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Book Select */}
                <div className="sm:col-span-6 space-y-1.5">
                  <label className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-[#8C8270]">
                    Księga Biblijna:
                  </label>
                  <select
                    id="select-book-dropdown"
                    value={selectedBookSiglum}
                    onChange={(e) => {
                      setSelectedBookSiglum(e.target.value);
                      setSelectedChapter(1);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141418] border border-[#3D3524] text-sm text-[#E0E0D6] focus:border-[#C5A059] focus:outline-none"
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
                  <label className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-[#8C8270]">
                    Rozdział (1 – {currentBookInfo.chaptersCount}):
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
                      className="px-3 py-2 rounded-lg bg-[#141418] border border-[#3D3524] text-[#8C8270] hover:text-[#C5A059] cursor-pointer"
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
                      className="w-full text-center py-2 rounded-lg bg-[#141418] border border-[#3D3524] text-sm text-[#E0E0D6] font-mono focus:border-[#C5A059] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedChapter(Math.min(currentBookInfo.chaptersCount, selectedChapter + 1))}
                      className="px-3 py-2 rounded-lg bg-[#141418] border border-[#3D3524] text-[#8C8270] hover:text-[#C5A059] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Verses input */}
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-[#8C8270]">
                    Wersety (np. 1-14):
                  </label>
                  <input
                    id="select-verses-input"
                    type="text"
                    value={versesInput}
                    onChange={(e) => setVersesInput(e.target.value)}
                    placeholder="np. 1-14 lub 29-34"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#141418] border border-[#3D3524] text-sm text-[#E0E0D6] font-mono focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {passageError && (
              <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl">
                {passageError}
              </div>
            )}
          </div>

          {/* Passage Lookup Result Card (Illuminated Manuscript Style) */}
          {passageLookupResult && (
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1C1A17] to-[#121216] border-2 border-[#C5A059] shadow-2xl space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3D3524] pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-3 py-1 rounded-md bg-[#0F0F12] text-[#C5A059] border border-[#C5A059]/40 text-xs font-mono font-bold">
                      {passageLookupResult.siglum}
                    </span>
                    <span className="text-xs font-sans text-[#A39B8B]">
                      {passageLookupResult.bookFullName} ({passageLookupResult.testament === 'NT' ? 'Nowy Testament' : 'Stary Testament'})
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-light text-[#E0E0D6]">
                    {passageLookupResult.pericopeTitle}
                  </h3>
                </div>

                <button
                  id="start-scrutation-from-lookup-btn"
                  onClick={() => startScrutationFromLookup(passageLookupResult)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#0F0F12] text-xs font-sans uppercase tracking-widest font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg self-start md:self-center"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Rozpocznij Skrutację z tego Fragmentu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Full Text */}
              <div className="p-6 bg-[#0B0B0E] rounded-xl border border-[#3D3524] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5" />
                    Tekst Pisma Świętego (Biblia Tysiąclecia / Jerozolimska)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeakText(passageLookupResult.siglum, passageLookupResult.text)}
                      className="text-xs text-[#8C8270] hover:text-[#C5A059] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Czytaj</span>
                    </button>
                    <button
                      onClick={() => handleCopyText(passageLookupResult.siglum, passageLookupResult.text)}
                      className="text-xs text-[#8C8270] hover:text-[#C5A059] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopiuj</span>
                    </button>
                  </div>
                </div>

                <p className="font-scripture text-base sm:text-lg text-[#E0E0D6] leading-relaxed whitespace-pre-line italic">
                  «{passageLookupResult.text}»
                </p>
              </div>

              {/* Theological theme, suggested paths and keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-[#8C8270]">
                <div className="space-y-1">
                  <span className="font-sans font-semibold text-[#C5A059] uppercase text-[10px] tracking-wider block">
                    Kontekst teologiczny i motyw:
                  </span>
                  <p className="font-serif text-[#E0E0D6] leading-relaxed">
                    {passageLookupResult.theologicalTheme}
                  </p>
                </div>
                {passageLookupResult.keyWords && passageLookupResult.keyWords.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-sans font-semibold text-[#C5A059] uppercase text-[10px] tracking-wider block">
                      Kluczowe pojęcia do tropienia powiązań:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {passageLookupResult.keyWords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#0F0F12] border border-[#3D3524] text-[#E0E0D6] rounded-md text-[11px] font-sans font-medium">
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
                <h3 className="font-display text-xl sm:text-2xl font-light text-[#E0E0D6]">
                  Katalog Sławnych Fragmentów i Perykop
                </h3>
                <p className="text-xs font-serif text-[#8C8270]">
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
                        ? 'bg-[#C5A059] text-[#0F0F12]'
                        : 'bg-[#141418] border border-[#3D3524] text-[#8C8270] hover:text-[#E0E0D6]'
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
                  className="p-5 rounded-xl bg-[#141418] border border-[#3D3524] hover:border-[#C5A059] transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group hover:bg-[#18181E] shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#C5A059] px-2.5 py-0.5 bg-[#0F0F12] rounded border border-[#3D3524]">
                        {p.siglum}
                      </span>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C8270] px-2 py-0.5 rounded bg-[#0F0F12]">
                        {p.category}
                      </span>
                    </div>

                    <h4 className="font-display text-base font-light text-[#E0E0D6] group-hover:text-[#C5A059] transition-colors">
                      {p.title}
                    </h4>

                    {p.verseExcerpt && (
                      <p className="font-scripture text-xs text-[#A39B8B] italic line-clamp-2">
                        «{p.verseExcerpt}»
                      </p>
                    )}

                    <p className="text-[11px] font-serif text-[#8C8270]">
                      {p.theme}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#3D3524]/60 flex items-center justify-between text-[11px] text-[#C5A059] font-sans font-semibold uppercase tracking-wider">
                    <span>Załaduj i skrutuj</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
