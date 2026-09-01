import React, { useState, useEffect } from 'react';
import { 
  ScrutationSession, 
  ScrutationNode, 
  BiblicalThemePreset 
} from '../types';
import { 
  PRAYER_STEPS_INFO, 
  BIBLE_BOOKS 
} from '../data/biblicalData';
import { getGuaranteedCrossReferences } from '../data/crossReferenceDatabase';
import { PatristicCommentarySection } from './PatristicCommentarySection';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Flame, 
  Layers, 
  Scroll,
  Globe,
  FileText,
  Clock,
  Compass,
  CalendarDays,
  ArrowRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Quote,
  Eye,
  Type,
  X,
  BookMarked
} from 'lucide-react';

interface ActiveScrutationWorkspaceProps {
  session: ScrutationSession | null;
  onUpdateSession: (session: ScrutationSession) => void;
  onSaveSessionToJournal: (session: ScrutationSession) => void;
  onStartNewSession: (preset?: BiblicalThemePreset) => void;
  onOpenBooksModal: () => void;
  onOpenDailyTab?: () => void;
}

export const ActiveScrutationWorkspace: React.FC<ActiveScrutationWorkspaceProps> = ({
  session,
  onUpdateSession,
  onSaveSessionToJournal,
  onStartNewSession,
  onOpenBooksModal,
  onOpenDailyTab
}) => {
  // Focus Mode state for deep meditation (hides all unnecessary UI elements)
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [focusFontSize, setFocusFontSize] = useState<'md' | 'lg' | 'xl' | '2xl'>('xl');
  const [focusTheme, setFocusTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [showFocusNotes, setShowFocusNotes] = useState<boolean>(false);
  const [isSpeakingFocus, setIsSpeakingFocus] = useState<boolean>(false);
  const [copiedSiglum, setCopiedSiglum] = useState<string | null>(null);

  // Timer state
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Sub-view tab in workspace: 'chain' (biblical references), 'patristic' (Church Fathers & original languages), 'meditation' (guided reflection)
  const [workspaceView, setWorkspaceView] = useState<'chain' | 'patristic' | 'meditation'>('chain');

  // New verse form state & mode toggle ('auto': Jerusalem Bible automatic links, 'manual': user custom inputs)
  const [creationMode, setCreationMode] = useState<'auto' | 'manual'>('auto');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'ST' | 'NT'>('all');
  const [newSiglumInput, setNewSiglumInput] = useState<string>('');
  const [newTextInput, setNewTextInput] = useState<string>('');
  const [newTestament, setNewTestament] = useState<'ST' | 'NT'>('NT');
  const [newRelationInput, setNewRelationInput] = useState<string>('');
  const [isSearchingAI, setIsSearchingAI] = useState<boolean>(false);
  const [aiSearchResults, setAiSearchResults] = useState<{
    siglum: string;
    text: string;
    testament: 'ST' | 'NT';
    relation: string;
    explanation: string;
  }[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  // Meditation assistant state
  const [isGeneratingMeditation, setIsGeneratingMeditation] = useState<boolean>(false);
  const [meditationQuestions, setMeditationQuestions] = useState<string[]>([]);
  const [suggestedWordOfLife, setSuggestedWordOfLife] = useState<string>('');

  // Initial session setup state if no session is active
  const [customStartSiglum, setCustomStartSiglum] = useState<string>('Iz 61, 1-2');
  const [customStartTheme, setCustomStartTheme] = useState<string>('Duch Pana nade mną — Ewangelizacja ubogich');
  const [customStartText, setCustomStartText] = useState<string>('«Duch Pana Boga nade mną, bo Pan mnie namaścił. Posłał mnie, by głosić dobrą nowinę ubogim, by opatrywać rany serc złamanych...»');

  // Bell chime using Web Audio API
  const playBellChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note (warm bell)
      osc.frequency.exponentialRampToValueAtTime(293.66, ctx.currentTime + 1.8);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 2.1);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && session) {
      interval = setInterval(() => {
        onUpdateSession({
          ...session,
          durationSeconds: (session.durationSeconds || 0) + 1,
          updatedAt: new Date().toISOString()
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, session]);

  // Set default selected node
  useEffect(() => {
    if (session && session.nodes.length > 0 && !selectedNodeId) {
      setSelectedNodeId(session.nodes[0].id);
    }
  }, [session, selectedNodeId]);

  // ESC shortcut to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // Text-to-speech helper for focus meditation
  const handleToggleSpeakVerse = (siglum: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeakingFocus) {
      window.speechSynthesis.cancel();
      setIsSpeakingFocus(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/«|»|\[.*?\]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(`${siglum}. ${cleanText}`);
    utterance.lang = 'pl-PL';
    utterance.rate = 0.88; // Calm, meditative pace
    utterance.pitch = 0.98;

    utterance.onend = () => setIsSpeakingFocus(false);
    utterance.onerror = () => setIsSpeakingFocus(false);

    setIsSpeakingFocus(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyFocusVerse = (siglum: string, text: string) => {
    const content = `${siglum}\n«${text}»`;
    navigator.clipboard.writeText(content).then(() => {
      setCopiedSiglum(siglum);
      setTimeout(() => setCopiedSiglum(null), 2500);
    });
  };

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 font-sans">
        {/* Quick Launch Cards for Daily Readings / Passage / Presets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {onOpenDailyTab && (
            <div 
              onClick={onOpenDailyTab}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all flex items-start gap-4 group shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-emerald-700 shrink-0 transition-colors shadow-xs">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-wider text-emerald-800 font-bold block">
                  Rekomendowane na dziś
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Czytania z Dnia (Liturgia Słowa)
                </h3>
                <p className="text-xs font-serif text-slate-600">
                  Wybierz dzisiejsze I Czytanie, Psalm, II Czytanie lub Ewangelię, aby natychmiast odprawić skrutację.
                </p>
              </div>
            </div>
          )}

          {onOpenDailyTab && (
            <div 
              onClick={onOpenDailyTab}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md cursor-pointer transition-all flex items-start gap-4 group shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center text-sky-700 shrink-0 transition-colors shadow-xs">
                <Scroll className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-wider text-sky-800 font-bold block">
                  Kanon & Perykopy
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                  Wybierz Dowolny Fragment
                </h3>
                <p className="text-xs font-serif text-slate-600">
                  Wyszukaj perykopę ze Starego lub Nowego Testamentu (np. Hymn o miłości, Krzew gorejący, Emaus).
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-8 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
            <BookOpen className="w-8 h-8" />
          </div>
          
          <div className="space-y-3">
            <span className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-bold">
              Inicjacja Drogi Wersetów
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Własny Werset Wyjściowy
            </h2>
            <p className="text-sm font-serif text-slate-600 max-w-xl mx-auto leading-relaxed">
              Wpisz werset wyjściowy, z którego wyruszysz w biblijną drogę po odnośnikach, komentarzach Ojców Kościoła i oryginalnych tekstach.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-5">
            <div>
              <label className="block text-[10px] font-sans font-bold text-slate-700 uppercase tracking-wider mb-2">
                Werset startowy (Siglum):
              </label>
              <input
                id="start-siglum-input"
                type="text"
                value={customStartSiglum}
                onChange={(e) => setCustomStartSiglum(e.target.value)}
                placeholder="np. Iz 61, 1-2 lub J 1, 29 lub Rdz 12, 1"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono text-sm bg-white text-slate-900 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans font-bold text-slate-700 uppercase tracking-wider mb-2">
                Temat / Motyw przewodni:
              </label>
              <input
                id="start-theme-input"
                type="text"
                value={customStartTheme}
                onChange={(e) => setCustomStartTheme(e.target.value)}
                placeholder="np. Ewangelizacja ubogich, Baranek Boży, Przymierze"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 text-sm bg-white text-slate-900 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans font-bold text-slate-700 uppercase tracking-wider mb-2">
                Treść wersetu wyjściowego:
              </label>
              <textarea
                id="start-text-input"
                value={customStartText}
                onChange={(e) => setCustomStartText(e.target.value)}
                rows={3}
                placeholder="Wklej lub wpisz treść wersetu..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-serif text-base italic bg-white text-slate-900 shadow-xs leading-relaxed"
              />
            </div>

            <button
              id="start-custom-session-btn"
              onClick={() => {
                const newSession: ScrutationSession = {
                  id: 'session_' + Date.now(),
                  title: customStartTheme || `Skrutacja ${customStartSiglum}`,
                  theme: customStartTheme || 'Osobista Skrutacja',
                  initialSiglum: customStartSiglum,
                  initialText: customStartText,
                  nodes: [
                    {
                      id: 'node_root',
                      parentId: null,
                      siglum: customStartSiglum,
                      text: customStartText,
                      testament: customStartSiglum.startsWith('Mt') || customStartSiglum.startsWith('Mk') || customStartSiglum.startsWith('Łk') || customStartSiglum.startsWith('J') || customStartSiglum.startsWith('Dz') || customStartSiglum.startsWith('Rz') || customStartSiglum.startsWith('1 Kor') || customStartSiglum.startsWith('Ap') ? 'NT' : 'ST',
                      theologicalTheme: customStartTheme,
                      crossReferenceReason: 'Werset wyjściowy (punkt startowy skrutacji)',
                      order: 0,
                      isExpanded: true,
                      createdAt: Date.now()
                    }
                  ],
                  activeStep: 0,
                  prayerNotes: {
                    statio: '',
                    invocatio: '',
                    lectio: '',
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
                onUpdateSession(newSession);
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Rozpocznij Skrutację i Badanie Słowa</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format time (MM:SS)
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStep = PRAYER_STEPS_INFO[session.activeStep] || PRAYER_STEPS_INFO[0];
  const selectedNode = session.nodes.find((n) => n.id === selectedNodeId) || session.nodes[0];

  // Auto-populate Jerusalem Bible cross-references whenever the selected node changes
  useEffect(() => {
    if (selectedNode && selectedNode.siglum) {
      const guaranteed = getGuaranteedCrossReferences(selectedNode.siglum, selectedNode.text);
      if (guaranteed.crossReferences && guaranteed.crossReferences.length > 0) {
        setAiSearchResults(guaranteed.crossReferences);
      }
    }
  }, [selectedNode?.id, selectedNode?.siglum]);

  // Add a new verse node to the scrutation tree
  const handleAddVerseNode = (siglum: string, text: string, testament: 'ST' | 'NT', relation: string) => {
    const newNode: ScrutationNode = {
      id: 'node_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      parentId: selectedNode ? selectedNode.id : session.nodes[0].id,
      siglum: siglum.trim(),
      text: text.trim(),
      testament,
      crossReferenceReason: relation || 'Odnośnik z Biblii Jerozolimskiej',
      order: session.nodes.length,
      isExpanded: true,
      createdAt: Date.now()
    };

    const updatedNodes = [...session.nodes, newNode];
    onUpdateSession({
      ...session,
      nodes: updatedNodes,
      updatedAt: new Date().toISOString()
    });

    setSelectedNodeId(newNode.id);
    setNewSiglumInput('');
    setNewTextInput('');
    setNewRelationInput('');
  };

  // Delete a verse node (cannot delete root)
  const handleDeleteNode = (id: string) => {
    if (session.nodes.length <= 1) return;
    const updatedNodes = session.nodes.filter((n) => n.id !== id);
    onUpdateSession({
      ...session,
      nodes: updatedNodes,
      updatedAt: new Date().toISOString()
    });
    if (selectedNodeId === id) {
      setSelectedNodeId(updatedNodes[0]?.id || null);
    }
  };

  // Search Cross-References via Server API (Gemini or Fallback)
  const handleSearchCrossReferences = async () => {
    if (!newSiglumInput && (!selectedNode || !selectedNode.siglum)) return;
    const siglumToSearch = newSiglumInput || selectedNode.siglum;
    setIsSearchingAI(true);
    setAiError(null);
    setAiSearchResults([]);

    try {
      const res = await fetch('/api/scrutation/cross-references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siglum: siglumToSearch,
          text: newTextInput || selectedNode?.text,
          contextTheme: session.theme
        })
      });

      if (!res.ok) throw new Error('Błąd połączenia z serwerem');
      const data = await res.json();
      if (data.text && !newTextInput) {
        setNewTextInput(data.text);
      }
      if (data.crossReferences && data.crossReferences.length > 0) {
        setAiSearchResults(data.crossReferences);
      } else {
        const guaranteed = getGuaranteedCrossReferences(siglumToSearch, newTextInput || selectedNode?.text);
        setAiSearchResults(guaranteed.crossReferences);
      }
    } catch (err) {
      console.warn('Cross references fallback activated:', err);
      const guaranteed = getGuaranteedCrossReferences(siglumToSearch, newTextInput || selectedNode?.text);
      setAiSearchResults(guaranteed.crossReferences);
      if (guaranteed.fullText && !newTextInput) {
        setNewTextInput(guaranteed.fullText);
      }
    } finally {
      setIsSearchingAI(false);
    }
  };

  // Generate Meditation questions via Server API
  const handleGenerateMeditation = async () => {
    setIsGeneratingMeditation(true);
    try {
      const res = await fetch('/api/scrutation/meditation-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chain: session.nodes.map((n) => ({
            siglum: n.siglum,
            text: n.text,
            relation: n.crossReferenceReason
          })),
          currentStep: currentStep.latinName
        })
      });
      if (!res.ok) throw new Error('Błąd serwera');
      const data = await res.json();
      setMeditationQuestions(data.meditationQuestions || []);
      if (data.suggestedWordOfLife) {
        setSuggestedWordOfLife(data.suggestedWordOfLife);
      }
    } catch {
      setMeditationQuestions([
        'W czym ta droga wersetów dotyka dzisiaj twojego serca?',
        'Do jakiego nawrócenia i zaufania wzywa cię Bóg w twojej konkretnej historii?',
        'Co ten łańcuch Słowa mówi o wierności Boga w twoich słabościach?'
      ]);
    } finally {
      setIsGeneratingMeditation(false);
    }
  };

  const handleInsertInsightToNotes = (insight: string) => {
    const currentNotes = session.prayerNotes.meditatio || '';
    const newNotes = currentNotes ? `${currentNotes}\n\n[Ojcowie Kościoła] ${insight}` : `[Ojcowie Kościoła] ${insight}`;
    onUpdateSession({
      ...session,
      prayerNotes: {
        ...session.prayerNotes,
        meditatio: newNotes
      }
    });
  };

  // =========================================================================
  // TRYB SKUPIENIA I GŁĘBOKIEJ MEDYTACJI (FOCUS MODE)
  // Ukrywa wszystkie zbędne elementy nawigacji, przyciski i formularze,
  // eksponując wyłącznie werset biblijny w najwyższej czytelności i kontraście.
  // =========================================================================
  if (isFocusMode) {
    const activeFocusNode = session.nodes.find((n) => n.id === selectedNodeId) || session.nodes[0];
    const activeFocusIndex = session.nodes.findIndex((n) => n.id === activeFocusNode.id);
    const activeBook = BIBLE_BOOKS.find(b => activeFocusNode.siglum.startsWith(b.siglum));

    const getFontSizeClass = () => {
      switch (focusFontSize) {
        case 'md': return 'text-xl sm:text-2xl md:text-3xl';
        case 'lg': return 'text-2xl sm:text-3xl md:text-4xl';
        case 'xl': return 'text-3xl sm:text-4xl md:text-5xl';
        case '2xl': return 'text-4xl sm:text-5xl md:text-6xl';
        default: return 'text-3xl sm:text-4xl md:text-5xl';
      }
    };

    const themeStyles = {
      light: {
        container: 'bg-slate-50 text-slate-900',
        glow: 'bg-emerald-100/50',
        border: 'border-slate-200',
        headerText: 'text-slate-600',
        strongText: 'text-slate-900',
        mutedText: 'text-slate-500',
        badge: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        badgeSiglum: 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold',
        card: 'bg-white border-slate-200 text-slate-700 shadow-xs',
        verseText: 'text-slate-950 font-semibold',
        buttonInactive: 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200',
        buttonActive: 'bg-emerald-600 text-white border-emerald-600 shadow-xs',
        dotInactive: 'bg-slate-300 hover:bg-slate-400',
        footerGuide: 'text-slate-600',
        exitBtn: 'bg-slate-900 hover:bg-slate-800 text-white',
      },
      sepia: {
        container: 'bg-[#FBF7EE] text-[#2D241E]',
        glow: 'bg-amber-200/30',
        border: 'border-[#E8DFC8]',
        headerText: 'text-[#6E5D4F]',
        strongText: 'text-[#2D241E]',
        mutedText: 'text-[#8C7A6B]',
        badge: 'bg-[#F3EAD6] border-[#DFD2B5] text-[#4A3B2C]',
        badgeSiglum: 'bg-[#F3EAD6] border-[#DFD2B5] text-[#2D241E] font-bold',
        card: 'bg-[#FFFDF9] border-[#E8DFC8] text-[#3D3228] shadow-xs',
        verseText: 'text-[#1C140E] font-semibold',
        buttonInactive: 'bg-[#FFFDF9] text-[#5C4D3F] hover:text-[#1F1710] hover:bg-[#F3EAD6] border-[#E8DFC8]',
        buttonActive: 'bg-[#8C6D3B] text-white border-[#8C6D3B] shadow-xs',
        dotInactive: 'bg-[#D6C7A8] hover:bg-[#B8A783]',
        footerGuide: 'text-[#7A6B5C]',
        exitBtn: 'bg-[#3D3228] hover:bg-[#2D241E] text-[#FFFDF9]',
      },
      dark: {
        container: 'bg-slate-950 text-slate-100',
        glow: 'bg-emerald-900/30',
        border: 'border-slate-800',
        headerText: 'text-slate-400',
        strongText: 'text-white',
        mutedText: 'text-slate-400',
        badge: 'bg-emerald-950/90 border-emerald-700 text-emerald-300',
        badgeSiglum: 'bg-emerald-950 border-emerald-600 text-emerald-200 font-bold',
        card: 'bg-slate-900 border-slate-800 text-slate-200 shadow-lg',
        verseText: 'text-white font-semibold drop-shadow-xs',
        buttonInactive: 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800',
        buttonActive: 'bg-emerald-600 text-white border-emerald-600 shadow-xs',
        dotInactive: 'bg-slate-700 hover:bg-slate-600',
        footerGuide: 'text-slate-300',
        exitBtn: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
      }
    };

    const t = themeStyles[focusTheme];

    return (
      <div 
        id="focus-meditation-mode-container"
        className={`fixed inset-0 z-50 ${t.container} flex flex-col justify-between p-4 sm:p-8 md:p-12 overflow-y-auto selection:bg-emerald-200 selection:text-emerald-950 animate-fade-in font-sans transition-colors duration-300`}
      >
        {/* Subtle decorative background glow */}
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[600px] sm:h-[600px] ${t.glow} rounded-full blur-3xl pointer-events-none`} />

        {/* Minimalist Top Bar */}
        <header className={`relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${t.border} max-w-6xl w-full mx-auto`}>
          {/* Left: Mode Title and Active Prayer Step */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${t.badge} text-xs font-sans font-bold uppercase tracking-wider shadow-xs`}>
              <Flame className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Tryb Skupienia</span>
            </div>

            <div className={`hidden sm:flex items-center gap-2 text-xs font-serif ${t.headerText}`}>
              <span>Krok {currentStep.step + 1}:</span>
              <strong className={`${t.strongText} font-bold`}>{currentStep.latinName}</strong>
              <span className={t.mutedText}>({currentStep.polishName})</span>
            </div>
          </div>

          {/* Center: Minimalist Prayer Timer */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl ${t.card} border ${t.border}`}>
            <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              {formatTime(session.durationSeconds || 0)}
            </span>
            <button
              id="focus-timer-toggle-btn"
              onClick={() => {
                setTimerRunning(!timerRunning);
                if (!timerRunning) playBellChime();
              }}
              className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
              title={timerRunning ? 'Wstrzymaj stoper' : 'Włącz stoper medytacji (z dzwonkiem)'}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
            <button
              id="focus-bell-chime-btn"
              onClick={playBellChime}
              className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 cursor-pointer transition-colors"
              title="Zadzwoń dzwonkiem modlitewnym"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Controls & Exit Button */}
          <div className="flex items-center gap-2">
            {/* Theme switcher: Light / Sepia / Dark */}
            <div className={`hidden sm:flex items-center gap-1 p-1 rounded-xl border ${t.border} ${t.card} text-xs`}>
              <button
                onClick={() => setFocusTheme('light')}
                className={`px-2 py-0.5 rounded-lg text-xs font-sans font-bold transition-colors cursor-pointer ${
                  focusTheme === 'light' ? t.buttonActive : t.headerText
                }`}
                title="Tryb jasny (dzienny)"
              >
                Jasny
              </button>
              <button
                onClick={() => setFocusTheme('sepia')}
                className={`px-2 py-0.5 rounded-lg text-xs font-sans font-bold transition-colors cursor-pointer ${
                  focusTheme === 'sepia' ? t.buttonActive : t.headerText
                }`}
                title="Tryb ciepły pergamin"
              >
                Pergamin
              </button>
              <button
                onClick={() => setFocusTheme('dark')}
                className={`px-2 py-0.5 rounded-lg text-xs font-sans font-bold transition-colors cursor-pointer ${
                  focusTheme === 'dark' ? t.buttonActive : t.headerText
                }`}
                title="Tryb nocny / ciemny"
              >
                Nocny
              </button>
            </div>

            {/* Font size control */}
            <div className={`hidden md:flex items-center gap-1 p-1 rounded-xl border ${t.border} ${t.card} text-xs`}>
              <span className={`px-1 text-[10px] ${t.mutedText} uppercase font-sans font-bold`}>Rozmiar:</span>
              {(['md', 'lg', 'xl', '2xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFocusFontSize(size)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-sans font-bold transition-colors cursor-pointer ${
                    focusFontSize === size
                      ? t.buttonActive
                      : t.buttonInactive
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Read aloud / TTS */}
            <button
              id="focus-speak-verse-btn"
              onClick={() => handleToggleSpeakVerse(activeFocusNode.siglum, activeFocusNode.text)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer shadow-xs ${
                isSpeakingFocus
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : t.buttonInactive
              }`}
              title={isSpeakingFocus ? 'Zatrzymaj czytanie' : 'Czytaj werset na głos'}
            >
              {isSpeakingFocus ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Copy verse */}
            <button
              id="focus-copy-verse-btn"
              onClick={() => handleCopyFocusVerse(activeFocusNode.siglum, activeFocusNode.text)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer shadow-xs ${t.buttonInactive}`}
              title="Kopiuj werset"
            >
              {copiedSiglum === activeFocusNode.siglum ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Toggle prayer notes pad */}
            <button
              id="focus-toggle-notes-btn"
              onClick={() => setShowFocusNotes(!showFocusNotes)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs ${
                showFocusNotes
                  ? t.badge
                  : t.buttonInactive
              }`}
              title="Otwórz / ukryj notatnik modlitewny"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Notatka</span>
            </button>

            {/* Exit Focus Mode Button */}
            <button
              id="exit-focus-mode-btn"
              onClick={() => {
                setIsFocusMode(false);
                if (isSpeakingFocus) {
                  window.speechSynthesis?.cancel();
                  setIsSpeakingFocus(false);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl ${t.exitBtn} text-xs font-sans uppercase font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs`}
              title="Wyłącz tryb skupienia i powróć do pełnego widoku roboczego (Klawisz ESC)"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Wróć (ESC)</span>
            </button>
          </div>
        </header>

        {/* Central Scripture Meditation Focal Point */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-8 sm:py-12 max-w-5xl w-full mx-auto my-auto text-center space-y-6 sm:space-y-8">
          {/* Verse Badge & Chain Position */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className={`font-mono text-base sm:text-xl font-bold px-4 py-1.5 rounded-2xl border ${t.badgeSiglum} shadow-xs tracking-wider`}>
              {activeFocusNode.siglum}
            </span>
            {activeBook && (
              <span className={`text-xs font-sans uppercase font-bold tracking-wider ${t.headerText} px-3 py-1 rounded-xl border ${t.border} ${t.card}`}>
                {activeBook.polishName}
              </span>
            )}
            <span className={`text-xs font-mono font-bold ${t.mutedText} px-2.5 py-1 rounded-xl border ${t.border} ${t.card}`}>
              {activeFocusNode.testament === 'NT' ? 'Nowy Testament' : 'Stary Testament'}
            </span>
            {session.nodes.length > 1 && (
              <span className={`text-xs font-sans font-medium ${t.headerText} px-3 py-1 rounded-xl border ${t.border} ${t.card}`}>
                Werset {activeFocusIndex + 1} z {session.nodes.length} w łańcuchu
              </span>
            )}
          </div>

          {/* Big Scripture Verse Text with Guaranteed Crystal High Contrast */}
          <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-8">
            <Quote className="absolute -top-6 -left-2 sm:-left-6 w-10 h-10 sm:w-14 sm:h-14 text-emerald-500/20 pointer-events-none" />
            <p className={`font-serif ${getFontSizeClass()} ${t.verseText} leading-relaxed italic text-center transition-all duration-300`}>
              «{activeFocusNode.text}»
            </p>
          </div>

          {/* Theological relation or context if present */}
          {activeFocusNode.crossReferenceReason && (
            <div className={`p-4 rounded-2xl ${t.card} border ${t.border} max-w-2xl mx-auto text-xs sm:text-sm font-serif leading-relaxed`}>
              <span className="text-emerald-600 dark:text-emerald-400 font-sans font-bold uppercase tracking-wider text-[11px] block mb-1">
                Klucz do skrutacji:
              </span>
              {activeFocusNode.crossReferenceReason}
            </div>
          )}

          {/* Word of life if defined */}
          {session.prayerNotes.wordOfLife && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${t.badge} text-xs sm:text-sm font-serif italic shadow-xs font-bold`}>
              <Flame className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Słowo Życia: {session.prayerNotes.wordOfLife}</span>
            </div>
          )}

          {/* Chain Verse Switcher (if session has multiple verses) */}
          {session.nodes.length > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                id="focus-prev-verse-btn"
                disabled={activeFocusIndex <= 0}
                onClick={() => {
                  if (activeFocusIndex > 0) {
                    setSelectedNodeId(session.nodes[activeFocusIndex - 1].id);
                  }
                }}
                className={`px-4 py-2 rounded-xl disabled:opacity-30 border ${t.border} ${t.buttonInactive} text-xs font-sans uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs font-bold`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Poprzedni werset</span>
              </button>

              <div className="flex items-center gap-1.5">
                {session.nodes.map((node, i) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      selectedNodeId === node.id || (!selectedNodeId && i === 0)
                        ? 'bg-emerald-500 w-6'
                        : t.dotInactive
                    }`}
                    title={node.siglum}
                  />
                ))}
              </div>

              <button
                id="focus-next-verse-btn"
                disabled={activeFocusIndex >= session.nodes.length - 1}
                onClick={() => {
                  if (activeFocusIndex < session.nodes.length - 1) {
                    setSelectedNodeId(session.nodes[activeFocusIndex + 1].id);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 border border-emerald-600 text-xs font-sans uppercase tracking-wider text-white flex items-center gap-2 transition-all cursor-pointer shadow-xs font-bold"
              >
                <span>Następny werset</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Note Drawer in Focus Mode */}
          {showFocusNotes && (
            <div className={`w-full max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl ${t.card} border ${t.border} shadow-lg text-left space-y-3 animate-fade-in`}>
              <div className={`flex items-center justify-between border-b ${t.border} pb-2`}>
                <span className="text-xs font-sans uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Notatka modlitewna ({currentStep.latinName}):</span>
                </span>
                <button
                  onClick={() => setShowFocusNotes(false)}
                  className={`text-xs ${t.mutedText} hover:${t.strongText} p-1 cursor-pointer`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={session.prayerNotes.meditatio}
                onChange={(e) => onUpdateSession({
                  ...session,
                  prayerNotes: { ...session.prayerNotes, meditatio: e.target.value }
                })}
                rows={3}
                placeholder="Zapisz krótkie poruszenie serca w ciszy..."
                className={`w-full p-3 rounded-xl border ${t.border} ${t.container} text-xs sm:text-sm font-serif leading-relaxed focus:border-emerald-500 focus:outline-none`}
              />
            </div>
          )}
        </main>

        {/* Minimalist Bottom Step Ribbon & Guidance */}
        <footer className={`relative z-10 pt-4 border-t ${t.border} max-w-6xl w-full mx-auto space-y-3`}>
          {/* Lectio Divina Steps Navigator */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {PRAYER_STEPS_INFO.map((step) => {
                const isCurrent = session.activeStep === step.step;
                return (
                  <button
                    key={step.step}
                    onClick={() => {
                      onUpdateSession({ ...session, activeStep: step.step });
                      playBellChime();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                      isCurrent
                        ? t.buttonActive
                        : t.buttonInactive
                    }`}
                  >
                    <span>{step.step + 1}. {step.latinName.split('&')[0].trim()}</span>
                  </button>
                );
              })}
            </div>

            <div className={`text-[11px] font-sans ${t.mutedText} italic`}>
              Naciśnij <strong className={`${t.strongText} font-bold`}>ESC</strong>, aby powrócić do pełnego pulpitu
            </div>
          </div>

          <p className={`text-center text-xs font-serif ${t.footerGuide} italic`}>
            „{currentStep.guide}”
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6 font-sans">
      {/* Top Header Session Bar - Geometric Balance */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              {session.initialSiglum}
            </span>
            <span className="text-[11px] text-slate-500 font-sans font-bold uppercase tracking-wider">
              {session.nodes.length} {session.nodes.length === 1 ? 'werset' : 'wersety'} w łańcuchu
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {session.title}
          </h1>
        </div>

        {/* Timer & Session Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Focus Mode Trigger Button */}
          <button
            id="focus-mode-toggle-btn"
            onClick={() => {
              setIsFocusMode(true);
              if (!timerRunning) {
                setTimerRunning(true);
                playBellChime();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-sans uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs group"
            title="Przełącz w tryb głębokiego skupienia i medytacji (ukrywa wszystkie zbędne przyciski i nawigację)"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-700 group-hover:scale-110 transition-transform" />
            <span>Tryb Skupienia</span>
          </button>

          {/* Prayer Timer Widget */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="font-mono text-sm font-bold text-emerald-800 tracking-wider">
              {formatTime(session.durationSeconds || 0)}
            </div>
            <button
              id="timer-toggle-btn"
              onClick={() => {
                setTimerRunning(!timerRunning);
                if (!timerRunning) playBellChime();
              }}
              className="p-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors shadow-xs"
              title={timerRunning ? 'Wstrzymaj modlitwę' : 'Włącz stoper modlitwy (z dzwonkiem)'}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
            <button
              id="timer-reset-btn"
              onClick={() => onUpdateSession({ ...session, durationSeconds: 0 })}
              className="p-1 rounded-lg bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors shadow-xs"
              title="Resetuj czas"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {onOpenDailyTab && (
            <button
              id="session-daily-readings-btn"
              onClick={onOpenDailyTab}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-sans uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Przejdź do czytań z dnia i wyboru nowego fragmentu"
            >
              <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Czytania / Fragmenty</span>
            </button>
          )}

          <button
            id="save-to-journal-btn"
            onClick={() => onSaveSessionToJournal(session)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Zapisz w Dzienniku</span>
          </button>
        </div>
      </div>

      {/* Step Progression Ribbon */}
      <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold font-mono border border-emerald-200">
              {currentStep.step + 1}
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold font-sans block">
                Krok {currentStep.step + 1} z {PRAYER_STEPS_INFO.length}
              </span>
              <span className="font-serif text-sm sm:text-base font-bold text-slate-900">
                {currentStep.latinName} — <span className="text-slate-500 font-normal font-sans">{currentStep.polishName}</span>
              </span>
            </div>
          </div>

          {/* Prev/Next Step buttons */}
          <div className="flex items-center gap-2">
            <button
              id="prev-step-btn"
              disabled={session.activeStep === 0}
              onClick={() => {
                onUpdateSession({ ...session, activeStep: session.activeStep - 1 });
                playBellChime();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-xs font-sans uppercase tracking-wider text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer font-bold shadow-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Poprzedni</span>
            </button>
            <button
              id="next-step-btn"
              disabled={session.activeStep === PRAYER_STEPS_INFO.length - 1}
              onClick={() => {
                onUpdateSession({ ...session, activeStep: session.activeStep + 1 });
                playBellChime();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 border border-emerald-600 text-white text-xs font-sans uppercase tracking-wider font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <span className="hidden sm:inline">Następny krok</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Steps track */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {PRAYER_STEPS_INFO.map((step) => {
            const isCurrent = session.activeStep === step.step;
            const isPassed = session.activeStep > step.step;
            return (
              <button
                key={step.step}
                id={`workspace-step-track-${step.step}`}
                onClick={() => {
                  onUpdateSession({ ...session, activeStep: step.step });
                  playBellChime();
                }}
                className={`py-2 px-1 text-center rounded-xl text-[10px] sm:text-xs font-sans tracking-wide transition-all truncate cursor-pointer border ${
                  isCurrent
                    ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs'
                    : isPassed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400 font-medium'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={`${step.step + 1}. ${step.latinName} - ${step.polishName}`}
              >
                <div className="font-bold">{step.step + 1}. {step.latinName.split('&')[0].trim()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            id="tab-chain-btn"
            onClick={() => setWorkspaceView('chain')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
              workspaceView === 'chain'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Łańcuch Wersetów</span>
          </button>

          <button
            id="tab-patristic-btn"
            onClick={() => setWorkspaceView('patristic')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
              workspaceView === 'patristic'
                ? 'bg-sky-100 text-sky-900 border border-sky-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>2. Ojcowie Kościoła & Tekst Pierwotny</span>
          </button>

          <button
            id="tab-meditation-btn"
            onClick={() => setWorkspaceView('meditation')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
              workspaceView === 'meditation'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Medytacja i Owoce</span>
          </button>
        </div>

        <button
          id="open-bible-books-btn"
          onClick={onOpenBooksModal}
          className="text-xs text-slate-600 hover:text-emerald-700 font-sans uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Kanon i Sigla</span>
        </button>
      </div>

      {/* Main Workspace Split View */}
      {workspaceView === 'patristic' ? (
        /* Patristic Commentaries & Original Texts Focused View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Verse Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <span className="text-[10px] font-sans uppercase tracking-wider text-slate-500 font-bold block">
                Wybierz werset ze swojej drogi do zbadania u Ojców Kościoła:
              </span>
              <div className="space-y-2">
                {session.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer shadow-xs ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-400 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-emerald-800">{node.siglum}</span>
                        <span className="text-[10px] font-mono font-semibold text-slate-500">{node.testament}</span>
                      </div>
                      <p className="font-serif text-xs italic line-clamp-2 text-slate-700">
                        «{node.text}»
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Church Fathers and Original Texts (8 cols) */}
          <div className="lg:col-span-8">
            <PatristicCommentarySection
              siglum={selectedNode?.siglum || session.initialSiglum}
              verseText={selectedNode?.text || session.initialText}
              onInsertInsightToNotes={handleInsertInsightToNotes}
            />
          </div>
        </div>
      ) : workspaceView === 'meditation' ? (
        /* Meditation & Existential Reflection View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Meditatio — Co Bóg mówi do mojego życia
                </h3>
                <button
                  id="generate-meditation-questions-btn"
                  onClick={handleGenerateMeditation}
                  disabled={isGeneratingMeditation}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-sans uppercase tracking-wider font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isGeneratingMeditation ? 'Generowanie pytań...' : 'Wygeneruj pytania do serca'}
                </button>
              </div>

              <p className="text-xs font-serif text-slate-600 leading-relaxed">
                Skrutacja nie jest ćwiczeniem czysto intelektualnym. Celem jest spotkanie z żywym Chrystusem, który przez łańcuch wersetów objawia Twoją historię w świetle Jego miłosierdzia.
              </p>

              {meditationQuestions.length > 0 && (
                <div className="space-y-3 p-4 rounded-xl bg-amber-50/60 border border-amber-200 shadow-xs">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-amber-900 font-bold block">
                    Pytania w świetle odkrytych wersetów:
                  </span>
                  <ul className="space-y-2.5">
                    {meditationQuestions.map((q, idx) => (
                      <li key={idx} className="text-xs font-serif text-slate-800 flex items-start gap-2">
                        <span className="text-amber-600 font-mono text-sm">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meditatio textarea */}
              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-sans uppercase tracking-wider text-slate-700 font-bold">
                  Moje osobiste rozważanie (Meditatio):
                </label>
                <textarea
                  id="meditatio-notes-textarea"
                  value={session.prayerNotes.meditatio}
                  onChange={(e) => onUpdateSession({
                    ...session,
                    prayerNotes: { ...session.prayerNotes, meditatio: e.target.value }
                  })}
                  rows={6}
                  placeholder="Zapisz poruszenia serca, gdzie czujesz opór, gdzie Bóg daje ci pokój i nadzieję..."
                  className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:border-emerald-500 focus:outline-none font-serif leading-relaxed"
                />
              </div>
            </div>

            {/* Word of Life (Rhema) */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-sans uppercase tracking-wider font-bold">
                  Słowo Życia (Rhema) do zapamiętania na dziś
                </span>
              </div>
              <input
                id="word-of-life-input"
                type="text"
                value={session.prayerNotes.wordOfLife}
                onChange={(e) => onUpdateSession({
                  ...session,
                  prayerNotes: { ...session.prayerNotes, wordOfLife: e.target.value }
                })}
                placeholder="Wpisz jedno zdanie lub werset, który nosisz w sercu..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-emerald-950 font-serif text-base italic focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            {/* Oratio and Actio */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-serif text-sm font-bold text-slate-900">
                Oratio — Twoja modlitwa do Boga
              </h4>
              <textarea
                id="oratio-notes-textarea"
                value={session.prayerNotes.oratio}
                onChange={(e) => onUpdateSession({
                  ...session,
                  prayerNotes: { ...session.prayerNotes, oratio: e.target.value }
                })}
                rows={4}
                placeholder="Odpowiedz Bogu modlitwą dziękczynienia, prośby lub skruchy..."
                className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:border-emerald-500 focus:outline-none font-serif leading-relaxed"
              />
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-serif text-sm font-bold text-slate-900">
                Actio — Czyn i owoc nawrócenia
              </h4>
              <textarea
                id="actio-notes-textarea"
                value={session.prayerNotes.actio}
                onChange={(e) => onUpdateSession({
                  ...session,
                  prayerNotes: { ...session.prayerNotes, actio: e.target.value }
                })}
                rows={3}
                placeholder="Jaki konkretny gest miłości, pojednania lub przebaczenia dziś wykonasz?"
                className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:border-emerald-500 focus:outline-none font-serif leading-relaxed"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Chain & Reference Discovery View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Chain List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Drzewo Skrutacji (Łańcuch Wersetów)
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Kliknij werset, by zobaczyć powiązania
              </span>
            </div>

            {/* Verses Chain List */}
            <div className="space-y-3">
              {session.nodes.map((node, index) => {
                const isSelected = selectedNode?.id === node.id;
                const isRoot = index === 0;

                return (
                  <div
                    key={node.id}
                    id={`verse-node-${node.id}`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`rounded-2xl p-5 border transition-all cursor-pointer relative shadow-xs ${
                      isSelected
                        ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Connector line */}
                    {index > 0 && (
                      <div className="absolute -top-3 left-6 w-px h-3 bg-slate-300" />
                    )}

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded-lg border ${
                          node.testament === 'NT' ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {node.testament}
                        </span>
                        <span className="font-mono font-bold text-sm sm:text-base text-slate-900">
                          {node.siglum}
                        </span>
                        {isRoot && (
                          <span className="text-[9px] font-sans uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Punkt Startowy
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNodeId(node.id);
                            setIsFocusMode(true);
                            if (!timerRunning) {
                              setTimerRunning(true);
                              playBellChime();
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] font-sans uppercase tracking-wider text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1 font-bold shadow-xs cursor-pointer"
                          title="Medytuj nad tym wersetem w trybie skupienia"
                        >
                          <Flame className="w-3 h-3 text-emerald-600" />
                          <span>Medytuj</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNodeId(node.id);
                            setWorkspaceView('patristic');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-sans uppercase tracking-wider text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-colors font-bold shadow-xs cursor-pointer"
                          title="Zobacz komentarze Ojców Kościoła dla tego wersetu"
                        >
                          Ojcowie Kościoła
                        </button>

                        {!isRoot && (
                          <button
                            id={`delete-node-${node.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNode(node.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Usuń ten werset ze ścieżki"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Verse text */}
                    <p className="font-serif text-sm sm:text-base text-slate-800 leading-relaxed italic mb-2">
                      «{node.text}»
                    </p>

                    {/* Relation reason */}
                    {node.crossReferenceReason && (
                      <div className="text-xs text-slate-600 font-sans pt-2 border-t border-slate-100">
                        <strong className="text-emerald-800">Powiązanie:</strong> {node.crossReferenceReason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Next Verse in Chain Box (Automatic Jerusalem Bible Cross-References by default, or Manual Input) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              {/* Header with Selected Node Anchor */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Rozwiń łańcuch biblijny
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
                  <span>Punkt wyjścia:</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                    {selectedNode?.siglum}
                  </span>
                </div>
              </div>

              {/* Mode Toggle Bar (Auto BJ vs Manual Input) */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  id="mode-auto-bj-btn"
                  onClick={() => setCreationMode('auto')}
                  className={`py-2 px-3 rounded-lg text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    creationMode === 'auto'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Automatyczne (Biblia Jerozolimska)</span>
                </button>

                <button
                  id="mode-manual-btn"
                  onClick={() => setCreationMode('manual')}
                  className={`py-2 px-3 rounded-lg text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    creationMode === 'manual'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  <span>Wpisywanie ręczne (Własne siglum)</span>
                </button>
              </div>

              {creationMode === 'auto' ? (
                /* AUTOMATIC MODE: Authentic Jerusalem Bible Cross-References */
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="font-bold">Filtruj:</span>
                      <button
                        onClick={() => setTestamentFilter('all')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                          testamentFilter === 'all'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                        }`}
                      >
                        Wszystkie ({aiSearchResults.length})
                      </button>
                      <button
                        onClick={() => setTestamentFilter('ST')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                          testamentFilter === 'ST'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                        }`}
                      >
                        Stary Testament ({aiSearchResults.filter(r => r.testament === 'ST').length})
                      </button>
                      <button
                        onClick={() => setTestamentFilter('NT')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                          testamentFilter === 'NT'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                        }`}
                      >
                        Nowy Testament ({aiSearchResults.filter(r => r.testament === 'NT').length})
                      </button>
                    </div>

                    <button
                      id="search-crossrefs-deep-btn"
                      onClick={handleSearchCrossReferences}
                      disabled={isSearchingAI}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-sans uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                      title="Poszukaj dodatkowych powiązań teologicznych przez AI"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      {isSearchingAI ? 'Przeszukiwanie...' : 'Szukaj głębiej (AI)'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    Poniżej znajdują się odnośniki z <strong>Biblii Jerozolimskiej (BJ)</strong> powiązane z wersetem <strong className="text-emerald-800 font-mono">{selectedNode?.siglum}</strong>. Kliknij <em>«+ Dołącz do łańcucha»</em>, by kontynuować drogę modlitwy:
                  </p>

                  {/* Cross references cards */}
                  <div className="space-y-3">
                    {aiSearchResults
                      .filter(res => testamentFilter === 'all' || res.testament === testamentFilter)
                      .map((res, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition-all space-y-2.5 group shadow-xs hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                                res.testament === 'NT'
                                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}>
                                {res.testament}
                              </span>
                              <span className="font-mono text-sm font-bold text-slate-900">{res.siglum}</span>
                              <span className="text-xs text-emerald-800 font-sans font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                                {res.relation}
                              </span>
                            </div>

                            <button
                              id={`add-auto-verse-btn-${i}`}
                              onClick={() => handleAddVerseNode(res.siglum, res.text, res.testament, `${res.relation} — ${res.explanation}`)}
                              className="shrink-0 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Dołącz do łańcucha</span>
                            </button>
                          </div>

                          <p className="font-serif text-sm text-slate-800 italic leading-relaxed pl-3 border-l-2 border-emerald-500">
                            «{res.text}»
                          </p>

                          <p className="text-xs text-slate-600 font-sans leading-relaxed">
                            {res.explanation}
                          </p>
                        </div>
                      ))}

                    {aiSearchResults.length === 0 && (
                      <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                        <p className="text-xs text-slate-600">
                          Brak załadowanych odnośników dla wersetu {selectedNode?.siglum}.
                        </p>
                        <button
                          onClick={handleSearchCrossReferences}
                          disabled={isSearchingAI}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-sans uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          {isSearchingAI ? 'Wyszukiwanie...' : 'Odkryj odnośniki teraz'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Switch to manual hint */}
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setCreationMode('manual')}
                      className="text-xs text-slate-500 hover:text-emerald-700 font-sans font-medium underline transition-colors cursor-pointer"
                    >
                      Masz werset z papierowej Biblii, którego tu nie ma? Przełącz na wpisywanie ręczne →
                    </button>
                  </div>
                </div>
              ) : (
                /* MANUAL MODE: Custom Siglum and Text Input */
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-slate-600 font-sans">
                    Wpisz siglum oraz treść wersetu, który odkryłeś na marginesie swojej Biblii papierowej lub podczas modlitwy:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-sans uppercase tracking-wider text-slate-700 font-bold mb-1">
                        Siglum biblijne:
                      </label>
                      <input
                        id="new-siglum-input"
                        type="text"
                        value={newSiglumInput}
                        onChange={(e) => setNewSiglumInput(e.target.value)}
                        placeholder="np. Ps 146, 7 lub Mt 11, 5"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase tracking-wider text-slate-700 font-bold mb-1">
                        Testament:
                      </label>
                      <select
                        id="new-testament-select"
                        value={newTestament}
                        onChange={(e) => setNewTestament(e.target.value as 'ST' | 'NT')}
                        className="w-full px-3.5 py-2.5 text-xs font-sans rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="ST">Stary Testament (ST)</option>
                        <option value="NT">Nowy Testament (NT)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-slate-700 font-bold mb-1">
                      Treść wersetu:
                    </label>
                    <textarea
                      id="new-text-input"
                      value={newTextInput}
                      onChange={(e) => setNewTextInput(e.target.value)}
                      placeholder="Wpisz treść wersetu lub kliknij «Wypełnij treść automatycznie»..."
                      rows={2}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-serif italic focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-slate-700 font-bold mb-1">
                      Dlaczego ten werset? (Powiązanie teologiczne / życiowe):
                    </label>
                    <input
                      id="new-relation-input"
                      type="text"
                      value={newRelationInput}
                      onChange={(e) => setNewRelationInput(e.target.value)}
                      placeholder="np. Uwolnienie więźniów, Wypełnienie w Chrystusie, Opatrzność"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      id="search-crossrefs-ai-btn"
                      onClick={handleSearchCrossReferences}
                      disabled={isSearchingAI || !newSiglumInput.trim()}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-sans uppercase tracking-wider font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                      title="Wyszukaj treść i podpowiedzi dla wpisanego siglum"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      {isSearchingAI ? 'Pobieranie...' : 'Wypełnij treść z Biblii'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCreationMode('auto')}
                        className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900 font-sans font-bold transition-colors cursor-pointer"
                      >
                        Anuluj
                      </button>
                      <button
                        id="submit-add-verse-btn"
                        disabled={!newSiglumInput.trim()}
                        onClick={() => handleAddVerseNode(newSiglumInput, newTextInput, newTestament, newRelationInput)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white text-xs font-sans uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Dodaj do Drzewa</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Step Guidance & Quick Patristics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Guide & Notes Widget */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    {currentStep.latinName}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans font-medium">{currentStep.polishName}</p>
                </div>
                <button
                  onClick={() => setWorkspaceView('patristic')}
                  className="text-xs text-sky-700 hover:text-sky-900 font-sans uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Scroll className="w-3.5 h-3.5" />
                  <span>Ojcowie &rarr;</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-serif bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {currentStep.guide}
              </p>

              {/* Step Personal Notes */}
              <div className="space-y-2 pt-1">
                <label className="block text-[10px] font-sans font-bold text-slate-700 uppercase tracking-wider">
                  Notatki do etapu ({currentStep.latinName.split('&')[0].trim()}):
                </label>
                <textarea
                  id={`step-notes-textarea-${session.activeStep}`}
                  value={
                    session.activeStep === 0 ? session.prayerNotes.invocatio :
                    session.activeStep === 1 ? session.prayerNotes.lectio :
                    session.activeStep === 2 ? (selectedNode?.userNotes || '') :
                    session.activeStep === 3 ? session.prayerNotes.meditatio :
                    session.activeStep === 4 ? session.prayerNotes.oratio :
                    session.activeStep === 5 ? session.prayerNotes.contemplatio :
                    session.prayerNotes.actio
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (session.activeStep === 2 && selectedNode) {
                      const updated = session.nodes.map((n) => n.id === selectedNode.id ? { ...n, userNotes: val } : n);
                      onUpdateSession({ ...session, nodes: updated });
                    } else {
                      const stepKey = 
                        session.activeStep === 0 ? 'invocatio' :
                        session.activeStep === 1 ? 'lectio' :
                        session.activeStep === 3 ? 'meditatio' :
                        session.activeStep === 4 ? 'oratio' :
                        session.activeStep === 5 ? 'contemplatio' : 'actio';

                      onUpdateSession({
                        ...session,
                        prayerNotes: {
                          ...session.prayerNotes,
                          [stepKey]: val
                        }
                      });
                    }
                  }}
                  rows={4}
                  placeholder="Zapisz swoje refleksje, owoce Słowa lub światło Ducha Świętego..."
                  className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:border-emerald-500 focus:outline-none font-serif leading-relaxed"
                />
              </div>

              {/* Quick Jump to Patristic / Original Languages Button */}
              <div className="pt-2">
                <button
                  onClick={() => setWorkspaceView('patristic')}
                  className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-sans uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Scroll className="w-4 h-4 text-sky-600" />
                  <span>Komentarze Ojców dla {selectedNode?.siglum}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
