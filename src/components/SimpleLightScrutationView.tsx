import React, { useState, useEffect } from 'react';
import { 
  DailyLiturgicalReadings, 
  DailyReadingItem, 
  ScrutationSession,
  ScrutationNode
} from '../types';
import { BIBLE_BOOKS } from '../data/biblicalData';
import { getGuaranteedDailyReadings } from '../data/liturgicalCalendarFallback';
import { getGuaranteedCrossReferences } from '../data/crossReferenceDatabase';
import { getGuaranteedPatristicData } from '../data/patristicDatabase';
import { PassageCommentaryModal } from './PassageCommentaryModal';
import { PatristicPassageModal } from './PatristicPassageModal';
import { ReadingPatristicCommentaryBar } from './ReadingPatristicCommentaryBar';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CalendarDays, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RefreshCw, 
  ChevronRight, 
  Compass, 
  CheckCircle2, 
  Quote, 
  Flame, 
  Plus, 
  RotateCcw, 
  BookMarked,
  X,
  Search,
  ChevronLeft,
  Calendar,
  Layers,
  Leaf,
  Droplets,
  Share2,
  ExternalLink,
  BookCheck,
  MousePointerClick,
  MessageSquareQuote,
  Scroll
} from 'lucide-react';

interface SimpleLightScrutationViewProps {
  onStartFullScrutation?: (session: ScrutationSession) => void;
  onOpenPatristicView?: (siglum: string) => void;
}

interface DiscoveredVerse {
  id: string;
  siglum: string;
  text: string;
  testament: 'ST' | 'NT';
  relation: string;
  explanation?: string;
  sourceSiglum: string;
  stepNumber: number;
}

export const SimpleLightScrutationView: React.FC<SimpleLightScrutationViewProps> = ({
  onStartFullScrutation,
  onOpenPatristicView
}) => {
  // Liturgical date handling
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyReadings, setDailyReadings] = useState<DailyLiturgicalReadings>(getGuaranteedDailyReadings(new Date()));
  
  // View mode: Daily liturgy vs custom siglum
  const [activeInputMode, setActiveInputMode] = useState<'daily' | 'custom'>('daily');
  const [showAllReadingsTogether, setShowAllReadingsTogether] = useState<boolean>(false);
  const [selectedReadingId, setSelectedReadingId] = useState<string>('');

  // Custom siglum input states
  const [customSiglum, setCustomSiglum] = useState<string>('');
  const [customVerseText, setCustomVerseText] = useState<string>('');

  // Active root reading chosen to be scrutinized
  const [rootSiglum, setRootSiglum] = useState<string>('');
  const [rootText, setRootText] = useState<string>('');
  const [rootTestament, setRootTestament] = useState<'ST' | 'NT'>('NT');
  const [rootTitle, setRootTitle] = useState<string>('');
  const [rootLiturgicalIntro, setRootLiturgicalIntro] = useState<string>('');
  const [rootPsalmResponse, setRootPsalmResponse] = useState<string>('');

  // Discovered cross-references chain
  const [discoveredVerses, setDiscoveredVerses] = useState<DiscoveredVerse[]>([]);
  const [availableQueue, setAvailableQueue] = useState<{
    siglum: string;
    text: string;
    testament: 'ST' | 'NT';
    relation: string;
    explanation?: string;
    sourceSiglum: string;
  }[]>([]);
  
  // UX Interaction States
  const [isScrutationActive, setIsScrutationActive] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [copiedSiglum, setCopiedSiglum] = useState<string | null>(null);
  const [speakingSiglum, setSpeakingSiglum] = useState<string | null>(null);

  // Modal for Church Fathers and Biblical Commentary
  const [patristicModalVerse, setPatristicModalVerse] = useState<{
    siglum: string;
    text: string;
  } | null>(null);

  const [commentaryModalTarget, setCommentaryModalTarget] = useState<{
    siglum: string;
    text: string;
    label?: string;
    theologicalTheme?: string;
    liturgicalContext?: string;
  } | null>(null);

  const [patristicModalTarget, setPatristicModalTarget] = useState<{
    siglum: string;
    text: string;
    label?: string;
  } | null>(null);

  // Load daily readings whenever selectedDate changes
  useEffect(() => {
    const readings = getGuaranteedDailyReadings(selectedDate);
    setDailyReadings(readings);
    
    // Default to gospel, or first reading if no gospel
    const defaultRdg = readings.readings.find(r => r.type === 'gospel') || readings.readings[0];
    if (defaultRdg) {
      applySelectedReading(defaultRdg);
    }
  }, [selectedDate]);

  // Select a specific reading from liturgy
  const applySelectedReading = (reading: DailyReadingItem) => {
    setSelectedReadingId(reading.id);
    setRootSiglum(reading.siglum);
    setRootText(reading.text);
    const isST = (reading.type === 'firstReading' || reading.type === 'psalm') && !reading.siglum.startsWith('Dz');
    setRootTestament(isST ? 'ST' : 'NT');
    setRootTitle(reading.label + ' — ' + (reading.theologicalTheme || ''));
    setRootLiturgicalIntro(reading.liturgicalIntroduction || '');
    setRootPsalmResponse(reading.psalmResponse || '');
  };

  const handleSelectDailyReading = (reading: DailyReadingItem) => {
    applySelectedReading(reading);
    // Reset any previous active chain so user starts fresh with newly chosen reading
    setIsScrutationActive(false);
    setDiscoveredVerses([]);
    setAvailableQueue([]);
  };

  const handleSelectSpecificSnippet = (snippetText: string, snippetSiglum: string, label: string) => {
    setRootSiglum(snippetSiglum);
    setRootText(snippetText);
    const isST = snippetSiglum.startsWith('Ps') || snippetSiglum.startsWith('Pwt') || snippetSiglum.startsWith('Iz') || snippetSiglum.startsWith('Rdz') || snippetSiglum.startsWith('Wj') || snippetSiglum.startsWith('Mdr') || snippetSiglum.startsWith('Syr');
    setRootTestament(isST ? 'ST' : 'NT');
    setRootTitle(`${label}: ${snippetSiglum}`);
    setIsScrutationActive(false);
    setDiscoveredVerses([]);
    setAvailableQueue([]);
  };

  // Change date helpers
  const handleShiftDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
    setIsScrutationActive(false);
    setDiscoveredVerses([]);
    setAvailableQueue([]);
  };

  const handleResetToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setIsScrutationActive(false);
    setDiscoveredVerses([]);
    setAvailableQueue([]);
  };

  // Start the Scrutation chain
  const handleStartScrutatio = () => {
    let finalSiglum = rootSiglum;
    let finalText = rootText;
    let finalTestament = rootTestament;

    if (activeInputMode === 'custom') {
      if (!customSiglum.trim()) return;
      finalSiglum = customSiglum.trim();
      finalText = customVerseText.trim() || `Werset ${finalSiglum} wybrany do modlitwy i skrutacji biblijnej.`;
      const isST = BIBLE_BOOKS.some(b => b.testament === 'ST' && finalSiglum.startsWith(b.siglum));
      finalTestament = isST ? 'ST' : 'NT';
      setRootSiglum(finalSiglum);
      setRootText(finalText);
      setRootTestament(finalTestament);
      setRootTitle('Wybrany werset: ' + finalSiglum);
      setRootLiturgicalIntro('');
      setRootPsalmResponse('');
    }

    // Get guaranteed cross references
    const refData = getGuaranteedCrossReferences(finalSiglum, finalText);
    
    // Prepare queue
    const queue = (refData.crossReferences || []).map(ref => ({
      siglum: ref.siglum,
      text: ref.text,
      testament: ref.testament,
      relation: ref.relation,
      explanation: ref.explanation,
      sourceSiglum: finalSiglum
    }));

    setIsScrutationActive(true);
    setDiscoveredVerses([]);
    
    // Automatically reveal the first connected verse
    if (queue.length > 0) {
      const [first, ...rest] = queue;
      setDiscoveredVerses([{
        id: 'disc_' + Date.now(),
        siglum: first.siglum,
        text: first.text,
        testament: first.testament,
        relation: first.relation,
        explanation: first.explanation,
        sourceSiglum: first.sourceSiglum,
        stepNumber: 1
      }]);
      setAvailableQueue(rest);
    } else {
      setAvailableQueue([]);
    }

    // Smooth scroll down to scrutation area
    setTimeout(() => {
      document.getElementById('scrutation-active-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Discover next verse in the chain
  const handleDiscoverNextVerse = async () => {
    setIsLoadingMore(true);

    // If we have pre-queued items, pop one
    if (availableQueue.length > 0) {
      const [nextItem, ...remainingQueue] = availableQueue;
      const newDiscovered: DiscoveredVerse = {
        id: 'disc_' + Date.now(),
        siglum: nextItem.siglum,
        text: nextItem.text,
        testament: nextItem.testament,
        relation: nextItem.relation,
        explanation: nextItem.explanation,
        sourceSiglum: nextItem.sourceSiglum,
        stepNumber: discoveredVerses.length + 1
      };

      setDiscoveredVerses(prev => [...prev, newDiscovered]);
      setAvailableQueue(remainingQueue);
      setIsLoadingMore(false);
      return;
    }

    // If queue is empty, fetch references based on the LAST discovered verse
    const lastVerse = discoveredVerses[discoveredVerses.length - 1] || { siglum: rootSiglum, text: rootText };
    try {
      const res = await fetch('/api/scrutation/cross-references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siglum: lastVerse.siglum,
          text: lastVerse.text
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.crossReferences && data.crossReferences.length > 0) {
          const freshRefs = data.crossReferences.filter(
            (r: any) => !discoveredVerses.some(d => d.siglum === r.siglum) && r.siglum !== rootSiglum
          );

          if (freshRefs.length > 0) {
            const [first, ...rest] = freshRefs;
            setDiscoveredVerses(prev => [
              ...prev,
              {
                id: 'disc_' + Date.now(),
                siglum: first.siglum,
                text: first.text,
                testament: first.testament,
                relation: first.relation || 'Dalsze powiązanie biblijne',
                explanation: first.explanation,
                sourceSiglum: lastVerse.siglum,
                stepNumber: prev.length + 1
              }
            ]);
            setAvailableQueue(rest.map((r: any) => ({
              siglum: r.siglum,
              text: r.text,
              testament: r.testament,
              relation: r.relation || 'Powiązanie',
              explanation: r.explanation,
              sourceSiglum: lastVerse.siglum
            })));
            setIsLoadingMore(false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('API fetch fallback:', e);
    }

    // Local fallback database
    const fallbackRefData = getGuaranteedCrossReferences(lastVerse.siglum, lastVerse.text);
    const available = (fallbackRefData.crossReferences || []).filter(
      r => !discoveredVerses.some(d => d.siglum === r.siglum) && r.siglum !== rootSiglum
    );

    if (available.length > 0) {
      const [first, ...rest] = available;
      setDiscoveredVerses(prev => [
        ...prev,
        {
          id: 'disc_' + Date.now(),
          siglum: first.siglum,
          text: first.text,
          testament: first.testament,
          relation: first.relation,
          explanation: first.explanation,
          sourceSiglum: lastVerse.siglum,
          stepNumber: prev.length + 1
        }
      ]);
      setAvailableQueue(rest.map(r => ({
        siglum: r.siglum,
        text: r.text,
        testament: r.testament,
        relation: r.relation,
        explanation: r.explanation,
        sourceSiglum: lastVerse.siglum
      })));
    } else {
      // Universal theological scripture links
      const universalVerses = [
        { siglum: 'J 5, 39', text: 'Badacie Pisma, ponieważ sądzicie, że w nich zawarte jest życie wieczne: to one właśnie dają o Mnie świadectwo.', testament: 'NT' as const, relation: 'Klucz chrystologiczny Pisma Świętego' },
        { siglum: 'Łk 24, 27', text: 'I zaczynając od Mojżesza, poprzez wszystkich proroków, wykładał im, co we wszystkich Pismach odnosiło się do Niego.', testament: 'NT' as const, relation: 'Droga do Emaus i wyjaśnianie Pism' },
        { siglum: 'Ps 119, 105', text: 'Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce.', testament: 'ST' as const, relation: 'Słowo jako światło w ciemności' },
        { siglum: 'Hbr 4, 12', text: 'Żywe bowiem jest słowo Boże, skuteczne i ostrzejsze niż wszelki miecz obosieczny.', testament: 'NT' as const, relation: 'Moc i skuteczność Słowa Bożego' },
        { siglum: 'Iz 55, 11', text: 'Tak słowo, które wychodzi z ust moich, nie wraca do Mnie bezowocne, zanim wpierw nie dokona tego, co chciałem.', testament: 'ST' as const, relation: 'Obietnica niezawodnego owocu Słowa' },
        { siglum: 'Rz 10, 17', text: 'Przeto wiara rodzi się z tego, co się słyszy, tym zaś, co się słyszy, jest słowo Chrystusa.', testament: 'NT' as const, relation: 'Źródło żywej wiary w Kościele' }
      ];
      const unused = universalVerses.find(u => !discoveredVerses.some(d => d.siglum === u.siglum) && u.siglum !== rootSiglum) || universalVerses[0];
      setDiscoveredVerses(prev => [
        ...prev,
        {
          id: 'disc_' + Date.now(),
          siglum: unused.siglum,
          text: unused.text,
          testament: unused.testament,
          relation: unused.relation,
          sourceSiglum: lastVerse.siglum,
          stepNumber: prev.length + 1
        }
      ]);
    }

    setIsLoadingMore(false);
  };

  // Branch from any discovered verse
  const handleBranchFromVerse = (verse: DiscoveredVerse) => {
    setRootSiglum(verse.siglum);
    setRootText(verse.text);
    setRootTestament(verse.testament);
    setRootTitle('Skrutacja od wersetu: ' + verse.siglum);
    setRootLiturgicalIntro('');
    setRootPsalmResponse('');

    const refData = getGuaranteedCrossReferences(verse.siglum, verse.text);
    const queue = (refData.crossReferences || []).map(ref => ({
      siglum: ref.siglum,
      text: ref.text,
      testament: ref.testament,
      relation: ref.relation,
      explanation: ref.explanation,
      sourceSiglum: verse.siglum
    }));

    if (queue.length > 0) {
      const [first, ...rest] = queue;
      setDiscoveredVerses([{
        id: 'disc_' + Date.now(),
        siglum: first.siglum,
        text: first.text,
        testament: first.testament,
        relation: first.relation,
        explanation: first.explanation,
        sourceSiglum: first.sourceSiglum,
        stepNumber: 1
      }]);
      setAvailableQueue(rest);
    } else {
      setDiscoveredVerses([]);
      setAvailableQueue([]);
    }
  };

  // Audio Speech Reader (TTS)
  const handleSpeakText = (siglum: string, text: string) => {
    if (!window.speechSynthesis) return;
    if (speakingSiglum === siglum) {
      window.speechSynthesis.cancel();
      setSpeakingSiglum(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/«|»/g, '').replace(/\n+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(`${siglum}. ${cleanText}`);
    utterance.lang = 'pl-PL';
    utterance.rate = 0.88;
    utterance.onend = () => setSpeakingSiglum(null);
    utterance.onerror = () => setSpeakingSiglum(null);
    setSpeakingSiglum(siglum);
    window.speechSynthesis.speak(utterance);
  };

  // Clipboard copy
  const handleCopyText = (siglum: string, text: string) => {
    navigator.clipboard.writeText(`${siglum}\n«${text}»`).then(() => {
      setCopiedSiglum(siglum);
      setTimeout(() => setCopiedSiglum(null), 2500);
    });
  };

  // Reset scrutation view
  const handleReset = () => {
    setIsScrutationActive(false);
    setDiscoveredVerses([]);
    setAvailableQueue([]);
  };

  // Transfer to full Lectio Divina prayer workspace
  const handleTransferToFullSession = () => {
    if (!onStartFullScrutation) return;
    const session: ScrutationSession = {
      id: 'session_' + Date.now(),
      title: 'Skrutacja: ' + rootSiglum,
      theme: rootTitle || 'Badanie Słowa Bożego w ciszy',
      initialSiglum: rootSiglum,
      initialText: rootText,
      nodes: [
        {
          id: 'root_node',
          parentId: null,
          siglum: rootSiglum,
          text: rootText,
          testament: rootTestament,
          theologicalTheme: rootTitle,
          crossReferenceReason: 'Werset wyjściowy',
          order: 0,
          isExpanded: true,
          createdAt: Date.now()
        },
        ...discoveredVerses.map((d, index) => ({
          id: 'node_' + d.id,
          parentId: index === 0 ? 'root_node' : 'node_' + discoveredVerses[index - 1].id,
          siglum: d.siglum,
          text: d.text,
          testament: d.testament,
          crossReferenceReason: d.relation + (d.explanation ? ' — ' + d.explanation : ''),
          order: index + 1,
          isExpanded: true,
          createdAt: Date.now() + index
        }))
      ],
      activeStep: 2, // Scrutatio
      prayerNotes: {
        statio: '',
        invocatio: '',
        lectio: rootText,
        meditatio: '',
        oratio: '',
        contemplatio: '',
        actio: '',
        wordOfLife: rootSiglum
      },
      durationSeconds: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onStartFullScrutation(session);
  };

  // Find currently active reading item in the array
  const currentSelectedReading = dailyReadings.readings.find(r => r.id === selectedReadingId) || dailyReadings.readings[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8 font-sans">
      
      {/* HEADER: Serene, Calming White-Green-Blue Aesthetic */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide shadow-xs">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Skrutacja Słowa Bożego • Spokój i Medytacja</span>
          <Droplets className="w-3.5 h-3.5 text-sky-500" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">
          Pismo Święte wyjaśnia Pismo Święte
        </h1>
        
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Wybierz czytanie mszalne lub wpisz siglum, zapoznaj się z <strong className="text-emerald-800 font-semibold">pełnym tekstem</strong> i kliknij <strong className="text-emerald-700 font-semibold">«Skrutuj Słowo»</strong>, aby odkrywać kolejne powiązane wersety.
        </p>
      </div>

      {/* STEP 1: LITURGICAL DATE & READINGS CONTAINER (White, Clean, Blue-Green accents) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden transition-all">
        
        {/* Navigation Bar between Liturgy & Custom Input */}
        <div className="flex border-b border-slate-200 bg-slate-50/70">
          <button
            id="tab-daily-readings-btn"
            onClick={() => {
              setActiveInputMode('daily');
              setIsScrutationActive(false);
            }}
            className={`flex-1 py-4 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeInputMode === 'daily'
                ? 'bg-white text-emerald-800 border-b-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-emerald-600" />
            <span>Czytania z Liturgii Dnia (Pełne Teksty)</span>
          </button>

          <button
            id="tab-custom-siglum-btn"
            onClick={() => {
              setActiveInputMode('custom');
              setIsScrutationActive(false);
            }}
            className={`flex-1 py-4 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeInputMode === 'custom'
                ? 'bg-white text-sky-800 border-b-2 border-sky-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            <Search className="w-4 h-4 text-sky-600" />
            <span>Wpisz Własne Siglum lub Werset</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-8 space-y-6">
          
          {/* MODE A: DAILY LITURGY READINGS WITH FULL TEXTS */}
          {activeInputMode === 'daily' && (
            <div className="space-y-6">
              
              {/* Date & Liturgical Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-sky-50/60 to-slate-50 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShiftDate(-1)}
                    className="p-2 rounded-xl bg-white hover:bg-emerald-100/60 text-slate-600 hover:text-emerald-800 border border-slate-200 transition-colors cursor-pointer shadow-xs"
                    title="Poprzedni dzień"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="px-3 py-1 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {selectedDate.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <button
                    onClick={() => handleShiftDate(1)}
                    className="p-2 rounded-xl bg-white hover:bg-emerald-100/60 text-slate-600 hover:text-emerald-800 border border-slate-200 transition-colors cursor-pointer shadow-xs"
                    title="Następny dzień"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleResetToToday}
                    className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100/70 rounded-lg transition-colors cursor-pointer"
                  >
                    Dzisiaj
                  </button>
                </div>

                {/* Liturgical celebration title */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-medium shadow-xs">
                    {dailyReadings.liturgicalCelebration || dailyReadings.formattedDate}
                  </span>
                  <button
                    onClick={() => setShowAllReadingsTogether(!showAllReadingsTogether)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Przełącz widok wszystkich czytań na raz"
                  >
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    <span>{showAllReadingsTogether ? 'Widok Pojedynczy' : 'Wszystkie Czytania'}</span>
                  </button>
                </div>
              </div>

              {/* READINGS SELECTION TABS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {dailyReadings.readings.map((reading) => {
                  const isSelected = selectedReadingId === reading.id;
                  return (
                    <button
                      key={reading.id}
                      onClick={() => handleSelectDailyReading(reading)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${
                          isSelected ? 'text-emerald-900' : 'text-slate-500'
                        }`}>
                          {reading.label}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                      </div>
                      
                      <div className="font-mono text-sm font-bold text-slate-900">
                        {reading.siglum}
                      </div>

                      <div className="text-[11px] text-slate-600 line-clamp-1 italic font-serif">
                        {reading.theologicalTheme || reading.liturgicalIntroduction || 'Słowo Boże'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* FULL TEXT DISPLAY OF THE SELECTED READING */}
              {!showAllReadingsTogether && currentSelectedReading && (
                <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                  
                  {/* Reading Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-xl bg-emerald-100/90 text-emerald-900 font-mono font-bold text-base sm:text-lg border border-emerald-200">
                        {currentSelectedReading.siglum}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {currentSelectedReading.label}
                      </span>
                    </div>

                    {/* Audio TTS and Copy Buttons */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => handleSpeakText(currentSelectedReading.siglum, currentSelectedReading.text)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Czytaj pełne czytanie na głos"
                      >
                        {speakingSiglum === currentSelectedReading.siglum ? (
                          <VolumeX className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                        )}
                        <span className="hidden sm:inline">{speakingSiglum === currentSelectedReading.siglum ? 'Zatrzymaj' : 'Posłuchaj'}</span>
                      </button>

                      <button
                        onClick={() => handleCopyText(currentSelectedReading.siglum, currentSelectedReading.text)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Kopiuj tekst czytania"
                      >
                        {copiedSiglum === currentSelectedReading.siglum ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                        )}
                        <span className="hidden sm:inline">{copiedSiglum === currentSelectedReading.siglum ? 'Skopiowano' : 'Kopiuj'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Liturgical Introduction (e.g., "Czytanie z Księgi..." or "Słowa Ewangelii według...") */}
                  {currentSelectedReading.liturgicalIntroduction && (
                    <div className="text-xs sm:text-sm font-serif italic font-semibold text-emerald-900 bg-emerald-50/60 px-3.5 py-1.5 rounded-lg border-l-2 border-emerald-500 inline-block">
                      {currentSelectedReading.liturgicalIntroduction}
                    </div>
                  )}

                  {/* Psalm Response Banner if Psalm */}
                  {currentSelectedReading.psalmResponse && (
                    <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 flex items-center gap-2.5">
                      <span className="font-bold text-xs font-mono uppercase bg-sky-200/80 px-2 py-0.5 rounded text-sky-900">
                        Refren:
                      </span>
                      <span className="font-serif italic font-semibold text-sm sm:text-base">
                        {currentSelectedReading.psalmResponse}
                      </span>
                    </div>
                  )}

                  {/* Full Reading Text with Stanza and Sentence Selection */}
                  {currentSelectedReading.type === 'psalm' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Zwrotki Psalmu — Wybierz zwrotkę lub cały psalm:</span>
                        </span>
                        <button
                          onClick={() => handleSelectSpecificSnippet(currentSelectedReading.text, currentSelectedReading.siglum, 'Cały Psalm')}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                            rootSiglum === currentSelectedReading.siglum && rootText === currentSelectedReading.text
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          Wybierz cały psalm
                        </button>
                      </div>

                      {/* Stanzas List */}
                      <div className="space-y-3">
                        {currentSelectedReading.text.split(/\n\s*\n/).map((stanza, sIdx) => {
                          const stanzaClean = stanza.trim();
                          if (!stanzaClean) return null;
                          const stanzaSiglum = `${currentSelectedReading.siglum} (Zwrotka ${sIdx + 1})`;
                          const isSelectedStanza = rootText === stanzaClean;

                          return (
                            <div
                              key={sIdx}
                              className={`p-4 rounded-xl border transition-all ${
                                isSelectedStanza
                                  ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                                  Zwrotka {sIdx + 1}
                                </span>
                                <button
                                  onClick={() => handleSelectSpecificSnippet(stanzaClean, stanzaSiglum, `Zwrotka ${sIdx + 1}`)}
                                  className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                                    isSelectedStanza
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  }`}
                                >
                                  <span>{isSelectedStanza ? '✓ Wybrana zwrotka' : 'Skrutuj tę zwrotkę'}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="font-serif text-base sm:text-lg text-slate-800 whitespace-pre-line leading-relaxed italic">
                                «{stanzaClean}»
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-medium flex items-center gap-1">
                          <MousePointerClick className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Kliknij dowolne zdanie poniżej, aby skrutować ten konkretny fragment:</span>
                        </span>
                        <button
                          onClick={() => handleSelectSpecificSnippet(currentSelectedReading.text, currentSelectedReading.siglum, currentSelectedReading.label)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            rootText === currentSelectedReading.text
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          Wybierz całą perykopę
                        </button>
                      </div>

                      <div className="font-serif text-base sm:text-lg text-slate-900 leading-relaxed p-4 rounded-xl bg-white border border-slate-200/90 space-y-2">
                        {currentSelectedReading.text.split(/(?<=[.!?])\s+/).map((sentence, sentIdx) => {
                          const clean = sentence.trim();
                          if (!clean) return null;
                          const isSentenceSelected = rootText === clean;
                          return (
                            <span
                              key={sentIdx}
                              onClick={() => handleSelectSpecificSnippet(clean, `${currentSelectedReading.siglum} (fragm.)`, currentSelectedReading.label)}
                              className={`cursor-pointer rounded px-1.5 py-0.5 transition-all inline mr-1.5 ${
                                isSentenceSelected
                                  ? 'bg-emerald-100 text-emerald-950 font-semibold ring-1 ring-emerald-400'
                                  : 'hover:bg-emerald-50 hover:text-emerald-900 hover:underline decoration-emerald-300'
                              }`}
                              title="Kliknij, aby wybrać tylko to zdanie do skrutacji"
                            >
                              {clean}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selected Fragment Status Pill */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-900 uppercase tracking-wider text-[11px]">Wybrany werset:</span>
                      <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        {rootSiglum}
                      </span>
                    </div>
                    <span className="text-slate-600 text-[11px] truncate max-w-md italic">
                      «{rootText.length > 80 ? rootText.slice(0, 80) + '...' : rootText}»
                    </span>
                  </div>

                  {/* Liturgical Conclusion */}
                  <div className="pt-2 text-xs font-serif font-semibold text-slate-500 italic">
                    {currentSelectedReading.type === 'gospel' ? '— Oto Słowo Pańskie.' : '— Oto Słowo Boże.'}
                  </div>

                  {/* Key Verses Chips if available */}
                  {currentSelectedReading.keyVerses && currentSelectedReading.keyVerses.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                        Wyróżnione kluczowe wersety do osobistej medytacji:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentSelectedReading.keyVerses.map((kv, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setRootSiglum(kv.siglum);
                              setRootText(kv.text);
                              setRootTitle(kv.label || kv.theme || '');
                              setIsScrutationActive(false);
                            }}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                              rootSiglum === kv.siglum
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span className="font-mono font-bold">{kv.siglum}:</span>
                            <span className="italic">{kv.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct link to Church Fathers & Modern Commentary with Search under reading */}
                  <ReadingPatristicCommentaryBar
                    siglum={currentSelectedReading.siglum}
                    verseText={currentSelectedReading.text}
                    label={currentSelectedReading.label}
                    theologicalTheme={currentSelectedReading.theologicalTheme}
                    liturgicalContext={`${dailyReadings.liturgicalCelebration} • ${dailyReadings.formattedDate}`}
                    onOpenPatristics={(targetSig) => {
                      setPatristicModalTarget({
                        siglum: targetSig,
                        text: currentSelectedReading.text,
                        label: currentSelectedReading.label
                      });
                    }}
                    onOpenCommentary={(targetSig) => {
                      setCommentaryModalTarget({
                        siglum: targetSig,
                        text: currentSelectedReading.text,
                        label: currentSelectedReading.label,
                        theologicalTheme: currentSelectedReading.theologicalTheme,
                        liturgicalContext: `${dailyReadings.liturgicalCelebration} • ${dailyReadings.formattedDate}`
                      });
                    }}
                  />
                </div>
              )}

              {/* ALL READINGS DISPLAY (If toggled) */}
              {showAllReadingsTogether && (
                <div className="space-y-6">
                  {dailyReadings.readings.map((reading) => (
                    <div
                      key={reading.id}
                      className={`p-6 rounded-2xl border transition-all ${
                        selectedReadingId === reading.id
                          ? 'bg-emerald-50/30 border-emerald-300 ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                            {reading.siglum}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 uppercase">
                            {reading.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleSelectDailyReading(reading)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              selectedReadingId === reading.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-700'
                            }`}
                          >
                            {selectedReadingId === reading.id ? 'Wybrane do skrutacji' : 'Wybierz ten tekst'}
                          </button>
                        </div>
                      </div>

                      {reading.liturgicalIntroduction && (
                        <p className="text-xs font-serif italic text-emerald-800 font-semibold mb-2">
                          {reading.liturgicalIntroduction}
                        </p>
                      )}

                      {reading.psalmResponse && (
                        <div className="p-2.5 mb-3 rounded-lg bg-sky-50 text-sky-900 text-xs font-serif font-semibold">
                          Refren: {reading.psalmResponse}
                        </div>
                      )}

                      <p className="font-serif text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line">
                        {reading.text}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <ReadingPatristicCommentaryBar
                          siglum={reading.siglum}
                          verseText={reading.text}
                          label={reading.label}
                          theologicalTheme={reading.theologicalTheme}
                          liturgicalContext={`${dailyReadings.liturgicalCelebration} • ${dailyReadings.formattedDate}`}
                          onOpenPatristics={(targetSig) => {
                            setPatristicModalTarget({
                              siglum: targetSig,
                              text: reading.text,
                              label: reading.label
                            });
                          }}
                          onOpenCommentary={(targetSig) => {
                            setCommentaryModalTarget({
                              siglum: targetSig,
                              text: reading.text,
                              label: reading.label,
                              theologicalTheme: reading.theologicalTheme,
                              liturgicalContext: `${dailyReadings.liturgicalCelebration} • ${dailyReadings.formattedDate}`
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MODE B: CUSTOM SIGLUM INPUT */}
          {activeInputMode === 'custom' && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Siglum biblijne (np. J 1, 29, Rz 8, 28, Wj 3, 1-15, Ps 23):
                </label>
                <div className="relative">
                  <input
                    id="input-custom-siglum"
                    type="text"
                    value={customSiglum}
                    onChange={(e) => setCustomSiglum(e.target.value)}
                    placeholder="Wpisz np. Mk 7, 1-8 lub Iz 53, 1-12"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 text-base font-mono focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Treść wersetu (opcjonalnie — jeśli puste, pobierzemy automatycznie):
                </label>
                <textarea
                  id="input-custom-verse-text"
                  value={customVerseText}
                  onChange={(e) => setCustomVerseText(e.target.value)}
                  placeholder="Wklej lub wpisz treść wersetu do rozważenia..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/40 text-slate-900 text-sm font-serif focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Quick suggestions chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Szybkie propozycje:</span>
                {[
                  { label: 'Oto Baranek Boży', sig: 'J 1, 29' },
                  { label: 'Hymn o miłości', sig: '1 Kor 13, 1-13' },
                  { label: 'Błogosławieństwa', sig: 'Mt 5, 1-12' },
                  { label: 'Krzew Gorejący', sig: 'Wj 3, 1-15' },
                  { label: 'Duch Pana nade mną', sig: 'Iz 61, 1-3' },
                  { label: 'Dobry Pasterz', sig: 'Ps 23, 1-6' }
                ].map((sug) => (
                  <button
                    key={sug.sig}
                    onClick={() => {
                      setCustomSiglum(sug.sig);
                      setCustomVerseText('');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-medium transition-colors cursor-pointer border border-slate-200"
                  >
                    {sug.sig}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* THE BIG SERENE "SKRUTUJ SŁOWO" BUTTON */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="main-scrutuj-btn"
              onClick={handleStartScrutatio}
              disabled={activeInputMode === 'custom' && !customSiglum.trim()}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] disabled:opacity-50 text-white font-sans font-bold text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
            >
              <Flame className="w-5 h-5 text-emerald-200 animate-pulse" />
              <span>{isScrutationActive ? 'Odśwież / Skrutuj od nowa' : 'Skrutuj Słowo Boże'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isScrutationActive && (
              <button
                onClick={handleReset}
                className="px-5 py-3.5 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Wyczyść</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* STEP 2: ACTIVE SCRUTATION AREA (Revealed upon clicking "Skrutuj") */}
      {isScrutationActive && (
        <div id="scrutation-active-section" className="space-y-6 animate-fade-in pt-2">
          
          {/* Section banner */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>Droga Odkrywania Pism (Biblia Jerozolimska)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-slate-900">
              Łańcuch Odnośników Biblijnych
            </h2>
          </div>

          {/* 1. Root Starting Verse Card (Punkt wyjścia) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-400 shadow-sm relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-emerald-600 text-white text-xs font-bold font-mono tracking-wider shadow-xs">
              PUNKT WYJŚCIA
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-950 bg-emerald-50 px-3.5 py-1 rounded-xl border border-emerald-200">
                {rootSiglum}
              </span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100">
                {rootTestament === 'ST' ? 'Stary Testament' : 'Nowy Testament'}
              </span>
              {rootTitle && (
                <span className="text-xs text-slate-600 font-medium">
                  ({rootTitle})
                </span>
              )}
            </div>

            {/* Liturgical Intro if exists */}
            {rootLiturgicalIntro && (
              <p className="text-xs font-serif italic text-emerald-800 font-semibold">
                {rootLiturgicalIntro}
              </p>
            )}

            {/* Psalm response if exists */}
            {rootPsalmResponse && (
              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs font-serif font-semibold">
                Refren: {rootPsalmResponse}
              </div>
            )}

            {/* Main Text */}
            <p className="font-serif text-lg sm:text-xl text-slate-900 leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1 whitespace-pre-line">
              «{rootText}»
            </p>

            {/* Actions for Root Verse */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setPatristicModalVerse({ siglum: rootSiglum, text: rootText })}
                className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Ojcowie Kościoła</span>
              </button>

              <button
                onClick={() => handleSpeakText(rootSiglum, rootText)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {speakingSiglum === rootSiglum ? (
                  <VolumeX className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                <span>{speakingSiglum === rootSiglum ? 'Zatrzymaj' : 'Czytaj'}</span>
              </button>

              <button
                onClick={() => handleCopyText(rootSiglum, rootText)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSiglum === rootSiglum ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedSiglum === rootSiglum ? 'Skopiowano' : 'Kopiuj'}</span>
              </button>
            </div>
          </div>

          {/* 2. Discovered Connected Verses Chain (Karty kolejnych wersetów) */}
          {discoveredVerses.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <BookCheck className="w-4 h-4 text-emerald-600" />
                  <span>Odkryte Odnośniki ({discoveredVerses.length}):</span>
                </h3>
                <span className="text-xs text-slate-500 font-serif italic">
                  Pismo wyjaśnia Pismo
                </span>
              </div>

              {/* Cards for each discovered verse */}
              <div className="space-y-3.5">
                {discoveredVerses.map((disc, idx) => (
                  <div
                    key={disc.id}
                    className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3.5 relative"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-lg sm:text-xl font-bold text-slate-900">
                          {disc.siglum}
                        </span>
                        <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {disc.testament === 'ST' ? 'Stary Testament' : 'Nowy Testament'}
                        </span>
                      </div>

                      {/* Connection relation tag */}
                      <span className="text-xs font-medium text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        {disc.relation}
                      </span>
                    </div>

                    {/* Scripture Text */}
                    <p className="font-serif text-base sm:text-lg text-slate-900 leading-relaxed italic border-l-2 border-emerald-400 pl-3.5 py-0.5">
                      «{disc.text}»
                    </p>

                    {/* Theological Insight / Explanation */}
                    {disc.explanation && (
                      <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                        <strong className="text-emerald-900 font-sans uppercase tracking-wider text-[10px] block">
                          Sens i klucz biblijny:
                        </strong>
                        <p>{disc.explanation}</p>
                      </div>
                    )}

                    {/* Action buttons on each discovered verse */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Ojcowie Kościoła */}
                        <button
                          onClick={() => setPatristicModalVerse({ siglum: disc.siglum, text: disc.text })}
                          className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Zobacz komentarze Ojców Kościoła do tego wersetu"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                          <span>Ojcowie Kościoła</span>
                        </button>

                        {/* Read Aloud TTS */}
                        <button
                          onClick={() => handleSpeakText(disc.siglum, disc.text)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {speakingSiglum === disc.siglum ? (
                            <VolumeX className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                          )}
                          <span>{speakingSiglum === disc.siglum ? 'Zatrzymaj' : 'Czytaj'}</span>
                        </button>

                        {/* Copy */}
                        <button
                          onClick={() => handleCopyText(disc.siglum, disc.text)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedSiglum === disc.siglum ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-600" />
                          )}
                          <span>{copiedSiglum === disc.siglum ? 'Skopiowano' : 'Kopiuj'}</span>
                        </button>

                        {/* Branch from this verse */}
                        <button
                          onClick={() => handleBranchFromVerse(disc)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Rozpocznij skrutację od tego konkretnego wersetu"
                        >
                          <Compass className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Skrutuj odtąd</span>
                        </button>
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono">
                        od: {disc.sourceSiglum}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. "NASTĘPNY FRAGMENT / SKRUTUJ DALEJ" ACTION BOX */}
          <div className="bg-gradient-to-r from-emerald-50/70 via-sky-50/50 to-slate-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 text-center space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              
              {/* Następny fragment */}
              <button
                id="discover-next-fragment-btn"
                onClick={handleDiscoverNextVerse}
                disabled={isLoadingMore}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-sans font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isLoadingMore ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Następny Fragment (Skrutuj dalej)</span>
              </button>

              {/* Transfer to full prayer workspace */}
              {onStartFullScrutation && (
                <button
                  id="open-in-full-workspace-btn"
                  onClick={handleTransferToFullSession}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  title="Otwórz to odkryte drzewo w pełnym trybie modlitwy z notatnikiem i stoperem"
                >
                  <BookMarked className="w-4 h-4 text-sky-600" />
                  <span>Otwórz w Pełnym Pulpicie Modlitwy</span>
                </button>
              )}
            </div>
            
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Każde naciśnięcie przycisku dodaje kolejny kluczowy werset biblijny powiązany z poprzednim tekstem.
            </p>
          </div>

        </div>
      )}

      {/* MODAL: OJCOWIE KOŚCIOŁA DLA WYBRANEGO WERSETU */}
      {patristicModalVerse && (
        <PatristicQuickModal
          siglum={patristicModalVerse.siglum}
          verseText={patristicModalVerse.text}
          onClose={() => setPatristicModalVerse(null)}
          onOpenFullPatristic={onOpenPatristicView}
        />
      )}

      {/* Rich Biblical Commentary Modal */}
      {commentaryModalTarget && (
        <PassageCommentaryModal
          isOpen={!!commentaryModalTarget}
          siglum={commentaryModalTarget.siglum}
          text={commentaryModalTarget.text}
          label={commentaryModalTarget.label}
          theologicalTheme={commentaryModalTarget.theologicalTheme}
          liturgicalContext={commentaryModalTarget.liturgicalContext}
          onClose={() => setCommentaryModalTarget(null)}
          onOpenPatristics={(sig) => {
            setCommentaryModalTarget(null);
            setPatristicModalTarget({
              siglum: sig,
              text: commentaryModalTarget.text,
              label: commentaryModalTarget.label
            });
          }}
        />
      )}

      {/* Rich Patristic Commentary Modal */}
      {patristicModalTarget && (
        <PatristicPassageModal
          isOpen={!!patristicModalTarget}
          siglum={patristicModalTarget.siglum}
          verseText={patristicModalTarget.text}
          label={patristicModalTarget.label}
          onOpenModernCommentary={(sig, txt, lbl) => {
            setPatristicModalTarget(null);
            setCommentaryModalTarget({
              siglum: sig,
              text: txt || patristicModalTarget.text,
              label: lbl || patristicModalTarget.label,
              liturgicalContext: `${dailyReadings.liturgicalCelebration} • ${dailyReadings.formattedDate}`
            });
          }}
          onOpenFullPatristicView={(sig) => {
            if (onOpenPatristicView) {
              onOpenPatristicView(sig);
            }
          }}
          onClose={() => setPatristicModalTarget(null)}
        />
      )}
    </div>
  );
};

// Modal for Church Fathers (Ojcowie Kościoła) - White-Emerald-Sky theme
interface PatristicQuickModalProps {
  siglum: string;
  verseText: string;
  onClose: () => void;
  onOpenFullPatristic?: (siglum: string) => void;
}

const PatristicQuickModal: React.FC<PatristicQuickModalProps> = ({
  siglum,
  verseText,
  onClose,
  onOpenFullPatristic
}) => {
  const [data, setData] = useState(() => getGuaranteedPatristicData(siglum, verseText));

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 16px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 12px, 16px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0px) + 12px, 12px)',
        paddingRight: 'max(env(safe-area-inset-right, 0px) + 12px, 12px)'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-32px)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-sky-50 to-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Ojcowie Kościoła: {siglum}
              </h3>
              <p className="text-xs text-slate-600">
                Tradycja patrystyczna i komentarze starożytnych teologów
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
              Rozważany werset:
            </span>
            <p className="font-serif text-sm italic text-slate-800">
              «{verseText}»
            </p>
          </div>

          {/* Commentaries list */}
          <div className="space-y-3">
            {data.commentaries && data.commentaries.length > 0 ? (
              data.commentaries.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 hover:border-sky-300 transition-all shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      {c.author} <span className="text-xs font-normal text-slate-500">({c.century}, {c.tradition})</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900">
                      {c.theologicalSense}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-serif text-slate-700 italic border-l-2 border-sky-500 pl-3">
                    „{c.polishTranslation}”
                  </p>
                  {c.spiritualInsight && (
                    <p className="text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-xl">
                      <strong className="text-emerald-950">Sens duchowy:</strong> {c.spiritualInsight}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic text-center py-4">
                Brak szczegółowego komentarza w podręcznej bazie dla tego wersetu.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          {onOpenFullPatristic ? (
            <button
              onClick={() => {
                onClose();
                onOpenFullPatristic(siglum);
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Przejdź do pełnego modułu Ojców Kościoła</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : <div />}
          
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
