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
  ArrowRight
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

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Quick Launch Cards for Daily Readings / Passage / Presets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {onOpenDailyTab && (
            <div 
              onClick={onOpenDailyTab}
              className="p-6 rounded-xl bg-gradient-to-br from-[#1a1a1e] to-[#141417] border border-[#C5A059]/60 hover:border-[#C5A059] cursor-pointer transition-all flex items-start gap-4 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0F0F12] border border-[#3D3524] group-hover:border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0 transition-colors">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A059] font-bold block">
                  Rekomendowane na dziś
                </span>
                <h3 className="font-display text-lg font-light text-[#E0E0D6] group-hover:text-[#C5A059] transition-colors">
                  Czytania z Dnia (Liturgia Słowa)
                </h3>
                <p className="text-xs font-serif text-[#8C8270]">
                  Wybierz dzisiejsze I Czytanie, Psalm, II Czytanie lub Ewangelię, aby natychmiast odprawić skrutację.
                </p>
              </div>
            </div>
          )}

          {onOpenDailyTab && (
            <div 
              onClick={onOpenDailyTab}
              className="p-6 rounded-xl bg-[#141417] border border-[#3D3524] hover:border-[#C5A059] cursor-pointer transition-all flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0F0F12] border border-[#3D3524] group-hover:border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0 transition-colors">
                <Scroll className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C8270] font-bold block">
                  Kanon & Perykopy
                </span>
                <h3 className="font-display text-lg font-light text-[#E0E0D6] group-hover:text-[#C5A059] transition-colors">
                  Wybierz Dowolny Fragment
                </h3>
                <p className="text-xs font-serif text-[#8C8270]">
                  Wyszukaj perykopę ze Starego lub Nowego Testamentu (np. Hymn o miłości, Krzew gorejący, Emaus).
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#141417] rounded-xl p-8 sm:p-12 border border-[#3D3524] space-y-8 text-center">
          <div className="w-16 h-16 rounded-xl bg-[#0F0F12] border border-[#3D3524] text-[#C5A059] mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          
          <div className="space-y-3">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8C8270]">
              Inicjacja Drogi Wersetów
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-light text-[#C5A059] tracking-wider">
              Własny Werset Wyjściowy
            </h2>
            <p className="text-sm font-serif text-[#8C8270] max-w-xl mx-auto leading-relaxed">
              Wpisz werset wyjściowy, z którego wyruszysz w biblijną drogę po odnośnikach, komentarzach Ojców Kościoła i oryginalnych tekstach.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-lg bg-[#0F0F12] border border-[#3D3524] text-left space-y-5">
            <div>
              <label className="block text-[10px] font-sans font-semibold text-[#8C8270] uppercase tracking-widest mb-2">
                Werset startowy (Siglum):
              </label>
              <input
                id="start-siglum-input"
                type="text"
                value={customStartSiglum}
                onChange={(e) => setCustomStartSiglum(e.target.value)}
                placeholder="np. Iz 61, 1-2 lub J 1, 29 lub Rdz 12, 1"
                className="w-full px-4 py-3 rounded-lg border border-[#3D3524] focus:outline-none focus:border-[#C5A059] font-mono text-sm bg-[#141417] text-[#E0E0D6]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans font-semibold text-[#8C8270] uppercase tracking-widest mb-2">
                Temat / Motyw przewodni:
              </label>
              <input
                id="start-theme-input"
                type="text"
                value={customStartTheme}
                onChange={(e) => setCustomStartTheme(e.target.value)}
                placeholder="np. Ewangelizacja ubogich, Baranek Boży, Przymierze"
                className="w-full px-4 py-3 rounded-lg border border-[#3D3524] focus:outline-none focus:border-[#C5A059] text-sm bg-[#141417] text-[#E0E0D6]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans font-semibold text-[#8C8270] uppercase tracking-widest mb-2">
                Treść wersetu wyjściowego:
              </label>
              <textarea
                id="start-text-input"
                value={customStartText}
                onChange={(e) => setCustomStartText(e.target.value)}
                rows={3}
                placeholder="Wklej lub wpisz treść wersetu..."
                className="w-full px-4 py-3 rounded-lg border border-[#3D3524] focus:outline-none focus:border-[#C5A059] font-scripture text-base italic bg-[#141417] text-[#E0E0D6]"
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
              className="w-full py-3.5 rounded-lg bg-[#C5A059] hover:bg-[#b08e4c] text-[#0F0F12] font-sans font-semibold text-xs tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Rozpocznij Skrutację i Badanie Słowa
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Top Header Session Bar - Geometric Balance */}
      <div className="bg-[#141417] rounded-xl p-5 sm:p-6 border border-[#3D3524] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded bg-[#1a1a1e] text-[#C5A059] border border-[#3D3524]">
              {session.initialSiglum}
            </span>
            <span className="text-[11px] text-[#8C8270] font-sans uppercase tracking-widest">
              {session.nodes.length} {session.nodes.length === 1 ? 'werset' : 'wersety'} w łańcuchu
            </span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-light tracking-wide text-[#E0E0D6]">
            {session.title}
          </h1>
        </div>

        {/* Timer & Session Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Prayer Timer Widget */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F0F12] border border-[#3D3524]">
            <div className="font-mono text-sm font-bold text-[#C5A059] tracking-wider">
              {formatTime(session.durationSeconds || 0)}
            </div>
            <button
              id="timer-toggle-btn"
              onClick={() => {
                setTimerRunning(!timerRunning);
                if (!timerRunning) playBellChime();
              }}
              className="p-1 rounded bg-[#1a1a1e] hover:bg-[#3D3524] text-[#E0E0D6] cursor-pointer transition-colors"
              title={timerRunning ? 'Wstrzymaj modlitwę' : 'Włącz stoper modlitwy (z dzwonkiem)'}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5 text-[#C5A059]" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
            <button
              id="timer-reset-btn"
              onClick={() => onUpdateSession({ ...session, durationSeconds: 0 })}
              className="p-1 rounded bg-[#1a1a1e] hover:bg-[#3D3524] text-[#8C8270] hover:text-[#E0E0D6] cursor-pointer transition-colors"
              title="Resetuj czas"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {onOpenDailyTab && (
            <button
              id="session-daily-readings-btn"
              onClick={onOpenDailyTab}
              className="px-3 py-2 rounded-lg bg-[#1a1a1e] hover:bg-[#3D3524] text-[#C5A059] border border-[#3D3524] text-xs font-sans uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Przejdź do czytań z dnia i wyboru nowego fragmentu"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Czytania / Fragmenty</span>
            </button>
          )}

          <button
            id="save-to-journal-btn"
            onClick={() => onSaveSessionToJournal(session)}
            className="px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#b08e4c] text-[#0F0F12] text-xs font-sans uppercase tracking-widest font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Zapisz w Dzienniku</span>
          </button>
        </div>
      </div>

      {/* Step Progression Ribbon */}
      <div className="bg-[#141417] text-[#E0E0D6] rounded-xl p-4 sm:p-5 border border-[#3D3524]">
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#3D3524]">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded bg-[#3D3524] text-[#C5A059] flex items-center justify-center text-xs font-bold font-mono">
              {currentStep.step + 1}
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-sans block">
                Krok {currentStep.step + 1} z {PRAYER_STEPS_INFO.length}
              </span>
              <span className="font-display text-sm sm:text-base font-light text-[#E0E0D6]">
                {currentStep.latinName} — <span className="text-[#8C8270]">{currentStep.polishName}</span>
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
              className="px-3 py-1.5 rounded bg-[#1a1a1e] hover:bg-[#3D3524] disabled:opacity-30 disabled:hover:bg-[#1a1a1e] border border-[#3D3524] text-xs font-sans uppercase tracking-wider text-[#8C8270] hover:text-[#E0E0D6] flex items-center gap-1 transition-colors cursor-pointer"
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
              className="px-3 py-1.5 rounded bg-[#3D3524] hover:bg-[#C5A059] hover:text-[#0F0F12] disabled:opacity-30 disabled:hover:bg-[#3D3524] disabled:hover:text-[#C5A059] border border-[#3D3524] text-[#C5A059] text-xs font-sans uppercase tracking-wider font-semibold flex items-center gap-1 transition-colors cursor-pointer"
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
                className={`py-2 px-1 text-center rounded text-[10px] sm:text-xs font-sans tracking-wide transition-all truncate cursor-pointer ${
                  isCurrent
                    ? 'bg-[#C5A059] text-[#0F0F12] font-bold shadow-xs'
                    : isPassed
                    ? 'bg-[#1a1a1e] text-[#C5A059] border border-[#3D3524] hover:border-[#C5A059]'
                    : 'bg-[#0F0F12] text-[#8C8270] border border-[#3D3524]/60 hover:text-[#E0E0D6]'
                }`}
                title={`${step.step + 1}. ${step.latinName} - ${step.polishName}`}
              >
                <div className="font-semibold">{step.step + 1}. {step.latinName.split('&')[0].trim()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#3D3524] pb-2">
        <div className="flex items-center gap-2">
          <button
            id="tab-chain-btn"
            onClick={() => setWorkspaceView('chain')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              workspaceView === 'chain'
                ? 'bg-[#3D3524] text-[#C5A059] font-semibold'
                : 'text-[#8C8270] hover:text-[#E0E0D6]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Łańcuch Wersetów</span>
          </button>

          <button
            id="tab-patristic-btn"
            onClick={() => setWorkspaceView('patristic')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              workspaceView === 'patristic'
                ? 'bg-[#3D3524] text-[#C5A059] font-semibold'
                : 'text-[#8C8270] hover:text-[#E0E0D6]'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>2. Ojcowie Kościoła & Tekst Pierwotny</span>
          </button>

          <button
            id="tab-meditation-btn"
            onClick={() => setWorkspaceView('meditation')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              workspaceView === 'meditation'
                ? 'bg-[#3D3524] text-[#C5A059] font-semibold'
                : 'text-[#8C8270] hover:text-[#E0E0D6]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Medytacja i Owoce</span>
          </button>
        </div>

        <button
          id="open-bible-books-btn"
          onClick={onOpenBooksModal}
          className="text-xs text-[#8C8270] hover:text-[#C5A059] font-sans uppercase tracking-wider flex items-center gap-1.5 transition-colors"
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
            <div className="p-4 rounded-xl bg-[#141417] border border-[#3D3524] space-y-3">
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C8270] block">
                Wybierz werset ze swojej drogi do zbadania u Ojców Kościoła:
              </span>
              <div className="space-y-2">
                {session.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1a1a1e] border-[#C5A059] text-[#E0E0D6]'
                          : 'bg-[#0F0F12] border-[#3D3524] text-[#8C8270] hover:border-[#C5A059]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-[#C5A059]">{node.siglum}</span>
                        <span className="text-[10px] text-[#8C8270]">{node.testament}</span>
                      </div>
                      <p className="font-scripture text-xs italic line-clamp-2">
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
            <div className="p-6 rounded-xl bg-[#141417] border border-[#3D3524] space-y-4">
              <div className="flex items-center justify-between border-b border-[#3D3524] pb-3">
                <h3 className="font-display text-base font-light text-[#E0E0D6] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  Meditatio — Co Bóg mówi do mojego życia
                </h3>
                <button
                  id="generate-meditation-questions-btn"
                  onClick={handleGenerateMeditation}
                  disabled={isGeneratingMeditation}
                  className="px-3 py-1 rounded bg-[#3D3524] hover:bg-[#C5A059] hover:text-[#0F0F12] text-[#C5A059] text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingMeditation ? 'Generowanie pytań...' : 'Wygeneruj pytania do serca'}
                </button>
              </div>

              <p className="text-xs font-serif text-[#8C8270] leading-relaxed">
                Skrutacja nie jest ćwiczeniem czysto intelektualnym. Celem jest spotkanie z żywym Chrystusem, który przez łańcuch wersetów objawia Twoją historię w świetle Jego miłosierdzia.
              </p>

              {meditationQuestions.length > 0 && (
                <div className="space-y-3 p-4 rounded-lg bg-[#0F0F12] border border-[#3D3524]">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A059] block">
                    Pytania w świetle odkrytych wersetów:
                  </span>
                  <ul className="space-y-2.5">
                    {meditationQuestions.map((q, idx) => (
                      <li key={idx} className="text-xs font-serif text-[#E0E0D6] flex items-start gap-2">
                        <span className="text-[#C5A059] font-mono text-sm">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meditatio textarea */}
              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-sans uppercase tracking-widest text-[#8C8270]">
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
                  className="w-full p-4 rounded-lg border border-[#3D3524] bg-[#0F0F12] text-[#E0E0D6] text-sm focus:border-[#C5A059] focus:outline-none font-serif leading-relaxed"
                />
              </div>
            </div>

            {/* Word of Life (Rhema) */}
            <div className="p-6 rounded-xl bg-[#141417] border border-[#3D3524] space-y-3">
              <div className="flex items-center gap-2 text-[#C5A059]">
                <Flame className="w-4 h-4" />
                <span className="text-xs font-sans uppercase tracking-widest font-semibold">
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
                className="w-full px-4 py-3 rounded-lg border border-[#3D3524] bg-[#0F0F12] text-[#C5A059] font-scripture text-base italic focus:border-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            {/* Oratio and Actio */}
            <div className="p-6 rounded-xl bg-[#141417] border border-[#3D3524] space-y-4">
              <h4 className="font-display text-sm font-light text-[#E0E0D6]">
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
                className="w-full p-4 rounded-lg border border-[#3D3524] bg-[#0F0F12] text-[#E0E0D6] text-sm focus:border-[#C5A059] focus:outline-none font-serif leading-relaxed"
              />
            </div>

            <div className="p-6 rounded-xl bg-[#141417] border border-[#3D3524] space-y-4">
              <h4 className="font-display text-sm font-light text-[#E0E0D6]">
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
                className="w-full p-4 rounded-lg border border-[#3D3524] bg-[#0F0F12] text-[#E0E0D6] text-sm focus:border-[#C5A059] focus:outline-none font-serif leading-relaxed"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Chain & Reference Discovery View (Geometric Balance 3-Col/Bento) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Chain List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans uppercase tracking-[0.2em] text-[#C5A059] font-medium flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                Drzewo Skrutacji (Łańcuch Wersetów)
              </span>
              <span className="text-xs text-[#8C8270]">
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
                    className={`rounded-xl p-5 border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#1a1a1e] border-[#C5A059] shadow-sm'
                        : 'bg-[#141417] border-[#3D3524] hover:border-[#8C8270]'
                    }`}
                  >
                    {/* Connector line */}
                    {index > 0 && (
                      <div className="absolute -top-3 left-6 w-px h-3 bg-[#3D3524]" />
                    )}

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded border ${
                          node.testament === 'NT' ? 'bg-[#141417] text-[#C5A059] border-[#3D3524]' : 'bg-[#141417] text-emerald-400 border-[#3D3524]'
                        }`}>
                          {node.testament}
                        </span>
                        <span className="font-mono font-bold text-sm sm:text-base text-[#E0E0D6]">
                          {node.siglum}
                        </span>
                        {isRoot && (
                          <span className="text-[9px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#3D3524] text-[#C5A059]">
                            Punkt Startowy
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNodeId(node.id);
                            setWorkspaceView('patristic');
                          }}
                          className="px-2 py-0.5 rounded bg-[#0F0F12] border border-[#3D3524] text-[10px] font-sans uppercase tracking-wider text-[#8C8270] hover:text-[#C5A059] transition-colors"
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
                            className="p-1 text-[#8C8270] hover:text-red-400 transition-colors"
                            title="Usuń ten werset ze ścieżki"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Verse text */}
                    <p className="font-scripture text-sm sm:text-base text-[#E0E0D6] leading-relaxed italic mb-2">
                      «{node.text}»
                    </p>

                    {/* Relation reason */}
                    {node.crossReferenceReason && (
                      <div className="text-xs text-[#8C8270] font-sans pt-1 border-t border-[#3D3524]/60">
                        <strong className="text-[#C5A059]">Powiązanie:</strong> {node.crossReferenceReason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Next Verse in Chain Box (Automatic Jerusalem Bible Cross-References by default, or Manual Input) */}
            <div className="bg-[#141417] rounded-xl p-5 sm:p-6 border border-[#3D3524] space-y-4">
              {/* Header with Selected Node Anchor */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3D3524] pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-display text-sm font-light text-[#E0E0D6]">
                    Rozwiń łańcuch biblijny
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#8C8270]">
                  <span>Punkt wyjścia:</span>
                  <span className="px-2 py-0.5 rounded bg-[#0F0F12] border border-[#3D3524] text-[#C5A059] font-bold">
                    {selectedNode?.siglum}
                  </span>
                </div>
              </div>

              {/* Mode Toggle Bar (Auto BJ vs Manual Input) */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#0F0F12] border border-[#3D3524]">
                <button
                  id="mode-auto-bj-btn"
                  onClick={() => setCreationMode('auto')}
                  className={`py-2 px-3 rounded text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    creationMode === 'auto'
                      ? 'bg-[#3D3524] text-[#C5A059] shadow-xs font-semibold'
                      : 'text-[#8C8270] hover:text-[#E0E0D6]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Automatyczne (Biblia Jerozolimska)</span>
                </button>

                <button
                  id="mode-manual-btn"
                  onClick={() => setCreationMode('manual')}
                  className={`py-2 px-3 rounded text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    creationMode === 'manual'
                      ? 'bg-[#3D3524] text-[#C5A059] shadow-xs font-semibold'
                      : 'text-[#8C8270] hover:text-[#E0E0D6]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Wpisywanie ręczne (Własne siglum)</span>
                </button>
              </div>

              {creationMode === 'auto' ? (
                /* AUTOMATIC MODE: Authentic Jerusalem Bible Cross-References */
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#8C8270]">
                      <span>Filtruj:</span>
                      <button
                        onClick={() => setTestamentFilter('all')}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          testamentFilter === 'all'
                            ? 'bg-[#C5A059] text-[#0F0F12] font-semibold'
                            : 'bg-[#0F0F12] text-[#8C8270] hover:text-[#E0E0D6] border border-[#3D3524]'
                        }`}
                      >
                        Wszystkie ({aiSearchResults.length})
                      </button>
                      <button
                        onClick={() => setTestamentFilter('ST')}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          testamentFilter === 'ST'
                            ? 'bg-emerald-500 text-[#0F0F12] font-semibold'
                            : 'bg-[#0F0F12] text-[#8C8270] hover:text-[#E0E0D6] border border-[#3D3524]'
                        }`}
                      >
                        Stary Testament ({aiSearchResults.filter(r => r.testament === 'ST').length})
                      </button>
                      <button
                        onClick={() => setTestamentFilter('NT')}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          testamentFilter === 'NT'
                            ? 'bg-[#C5A059] text-[#0F0F12] font-semibold'
                            : 'bg-[#0F0F12] text-[#8C8270] hover:text-[#E0E0D6] border border-[#3D3524]'
                        }`}
                      >
                        Nowy Testament ({aiSearchResults.filter(r => r.testament === 'NT').length})
                      </button>
                    </div>

                    <button
                      id="search-crossrefs-deep-btn"
                      onClick={handleSearchCrossReferences}
                      disabled={isSearchingAI}
                      className="px-3 py-1.5 rounded bg-[#0F0F12] hover:bg-[#1a1a1e] text-[#C5A059] border border-[#3D3524] hover:border-[#C5A059] text-xs font-sans uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      title="Poszukaj dodatkowych powiązań teologicznych przez AI"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isSearchingAI ? 'Przeszukiwanie...' : 'Szukaj głębiej (AI)'}
                    </button>
                  </div>

                  <p className="text-xs text-[#8C8270] font-sans leading-relaxed">
                    Poniżej znajdują się odnośniki z <strong>Biblii Jerozolimskiej (BJ)</strong> powiązane z wersetem <strong className="text-[#C5A059]">{selectedNode?.siglum}</strong>. Kliknij <em>«+ Dołącz do łańcucha»</em>, by kontynuować drogę modlitwy:
                  </p>

                  {/* Cross references cards */}
                  <div className="space-y-3">
                    {aiSearchResults
                      .filter(res => testamentFilter === 'all' || res.testament === testamentFilter)
                      .map((res, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-[#0F0F12] border border-[#3D3524] hover:border-[#C5A059] transition-all space-y-2.5 group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                                res.testament === 'NT'
                                  ? 'bg-[#1a1a1e] text-[#C5A059] border-[#3D3524]'
                                  : 'bg-[#1a1a1e] text-emerald-400 border-[#3D3524]'
                              }`}>
                                {res.testament}
                              </span>
                              <span className="font-mono text-sm font-bold text-[#E0E0D6]">{res.siglum}</span>
                              <span className="text-xs text-[#C5A059] font-sans font-medium px-2 py-0.5 rounded bg-[#141417] border border-[#3D3524]">
                                {res.relation}
                              </span>
                            </div>

                            <button
                              id={`add-auto-verse-btn-${i}`}
                              onClick={() => handleAddVerseNode(res.siglum, res.text, res.testament, `${res.relation} — ${res.explanation}`)}
                              className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#b08e4c] text-[#0F0F12] text-xs font-sans uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Dołącz do łańcucha
                            </button>
                          </div>

                          <p className="font-scripture text-sm text-[#E0E0D6] italic leading-relaxed pl-3 border-l-2 border-[#C5A059]/40">
                            «{res.text}»
                          </p>

                          <p className="text-xs text-[#8C8270] font-sans">
                            {res.explanation}
                          </p>
                        </div>
                      ))}

                    {aiSearchResults.length === 0 && (
                      <div className="p-6 rounded-xl bg-[#0F0F12] border border-dashed border-[#3D3524] text-center space-y-3">
                        <p className="text-xs text-[#8C8270]">
                          Brak załadowanych odnośników dla wersetu {selectedNode?.siglum}.
                        </p>
                        <button
                          onClick={handleSearchCrossReferences}
                          disabled={isSearchingAI}
                          className="px-4 py-2 rounded-lg bg-[#3D3524] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0F0F12] text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer"
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
                      className="text-xs text-[#8C8270] hover:text-[#C5A059] font-sans underline transition-colors cursor-pointer"
                    >
                      Masz werset z papierowej Biblii, którego tu nie ma? Przełącz na wpisywanie ręczne →
                    </button>
                  </div>
                </div>
              ) : (
                /* MANUAL MODE: Custom Siglum and Text Input */
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-[#8C8270] font-sans">
                    Wpisz siglum oraz treść wersetu, który odkryłeś na marginesie swojej Biblii papierowej lub podczas modlitwy:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-sans uppercase tracking-widest text-[#8C8270] mb-1">
                        Siglum biblijne:
                      </label>
                      <input
                        id="new-siglum-input"
                        type="text"
                        value={newSiglumInput}
                        onChange={(e) => setNewSiglumInput(e.target.value)}
                        placeholder="np. Ps 146, 7 lub Mt 11, 5"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#3D3524] bg-[#0F0F12] text-[#E0E0D6] font-mono focus:border-[#C5A059] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase tracking-widest text-[#8C8270] mb-1">
                        Testament:
                      </label>
                      <select
                        id="new-testament-select"
                        value={newTestament}
                        onChange={(e) => setNewTestament(e.target.value as 'ST' | 'NT')}
                        className="w-full px-3.5 py-2.5 text-xs font-sans rounded-lg border border-[#3D3524] bg-[#0F0F12] text-[#E0E0D6] focus:border-[#C5A059] focus:outline-none"
                      >
                        <option value="ST">Stary Testament (ST)</option>
                        <option value="NT">Nowy Testament (NT)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-widest text-[#8C8270] mb-1">
                      Treść wersetu:
                    </label>
                    <textarea
                      id="new-text-input"
                      value={newTextInput}
                      onChange={(e) => setNewTextInput(e.target.value)}
                      placeholder="Wpisz treść wersetu lub kliknij «Wypełnij treść automatycznie»..."
                      rows={2}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#3D3524] bg-[#0F0F12] text-[#E0E0D6] font-scripture italic focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-widest text-[#8C8270] mb-1">
                      Dlaczego ten werset? (Powiązanie teologiczne / życiowe):
                    </label>
                    <input
                      id="new-relation-input"
                      type="text"
                      value={newRelationInput}
                      onChange={(e) => setNewRelationInput(e.target.value)}
                      placeholder="np. Uwolnienie więźniów, Wypełnienie w Chrystusie, Opatrzność"
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#3D3524] bg-[#0F0F12] text-[#E0E0D6] focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      id="search-crossrefs-ai-btn"
                      onClick={handleSearchCrossReferences}
                      disabled={isSearchingAI || !newSiglumInput.trim()}
                      className="px-3.5 py-2.5 rounded-lg bg-[#0F0F12] hover:bg-[#1a1a1e] text-[#C5A059] border border-[#3D3524] hover:border-[#C5A059] text-xs font-sans uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                      title="Wyszukaj treść i podpowiedzi dla wpisanego siglum"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isSearchingAI ? 'Pobieranie...' : 'Wypełnij treść z Biblii'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCreationMode('auto')}
                        className="px-3 py-2 text-xs text-[#8C8270] hover:text-[#E0E0D6] font-sans transition-colors cursor-pointer"
                      >
                        Anuluj
                      </button>
                      <button
                        id="submit-add-verse-btn"
                        disabled={!newSiglumInput.trim()}
                        onClick={() => handleAddVerseNode(newSiglumInput, newTextInput, newTestament, newRelationInput)}
                        className="px-4 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#b08e4c] disabled:opacity-30 text-[#0F0F12] text-xs font-sans uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Dodaj do Drzewa
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
            <div className="bg-[#141417] rounded-xl p-5 sm:p-6 border border-[#3D3524] space-y-4">
              <div className="flex items-center justify-between border-b border-[#3D3524] pb-3">
                <div>
                  <h3 className="font-display text-sm font-light text-[#E0E0D6]">
                    {currentStep.latinName}
                  </h3>
                  <p className="text-xs text-[#8C8270] font-sans">{currentStep.polishName}</p>
                </div>
                <button
                  onClick={() => setWorkspaceView('patristic')}
                  className="text-xs text-[#C5A059] hover:underline font-sans uppercase tracking-wider flex items-center gap-1"
                >
                  <Scroll className="w-3.5 h-3.5" />
                  Ojcowie Kościoła &rarr;
                </button>
              </div>

              <p className="text-xs text-[#8C8270] leading-relaxed font-serif bg-[#0F0F12] p-3.5 rounded-lg border border-[#3D3524]">
                {currentStep.guide}
              </p>

              {/* Step Personal Notes */}
              <div className="space-y-2 pt-1">
                <label className="block text-[10px] font-sans font-semibold text-[#8C8270] uppercase tracking-widest">
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
                  className="w-full p-3.5 text-xs sm:text-sm rounded-lg border border-[#3D3524] bg-[#0F0F12] text-[#E0E0D6] focus:border-[#C5A059] focus:outline-none font-serif leading-relaxed"
                />
              </div>

              {/* Quick Jump to Patristic / Original Languages Button */}
              <div className="pt-2">
                <button
                  onClick={() => setWorkspaceView('patristic')}
                  className="w-full py-2.5 rounded-lg bg-[#0F0F12] hover:bg-[#1a1a1e] border border-[#3D3524] hover:border-[#C5A059] text-[#C5A059] text-xs font-sans uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Scroll className="w-4 h-4" />
                  Komentarze Ojców dla {selectedNode?.siglum}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
