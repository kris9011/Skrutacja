import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Music, 
  Sparkles, 
  Sliders, 
  RotateCw, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Bell, 
  Disc, 
  Waves, 
  Wind,
  Headphones,
  Check,
  BookOpen,
  Scroll,
  ListTree,
  Edit3,
  UserCheck,
  Radio
} from 'lucide-react';
import { audioEngine } from '../utils/audioContemplationEngine';
import { prepareScriptureTextForSpeech, expandSiglumForSpeech } from '../utils/biblicalSpeechExpander';

export interface AudioTargetItem {
  id?: string;
  siglum: string;
  text: string;
  title?: string;
  category?: 'verse' | 'gospel' | 'firstReading' | 'psalm' | 'secondReading' | 'tree' | 'custom';
}

interface AudioContemplationPlayerProps {
  currentVerseSiglum?: string;
  currentVerseText?: string;
  currentVerseTitle?: string;
  allVersesInChain?: { siglum: string; text: string }[];
  dailyReadingsPresets?: AudioTargetItem[];
  onVerseChange?: (siglum: string) => void;
  externalAudioTrigger?: AudioTargetItem | null;
}

export const AudioContemplationPlayer: React.FC<AudioContemplationPlayerProps> = ({
  currentVerseSiglum = 'Łk 24, 13-35',
  currentVerseText = 'Czy serce nasze nie pałało w nas, kiedy rozmawiał z nami w drodze i Pisma nam wyjaśniał?',
  currentVerseTitle = 'Słowo Wyjściowe',
  allVersesInChain = [],
  dailyReadingsPresets = [],
  onVerseChange,
  externalAudioTrigger
}) => {
  const [isAmbientOn, setIsAmbientOn] = useState<boolean>(false);
  const [preset, setPreset] = useState<'gregorian' | 'bowls' | 'desert' | 'monastery'>('gregorian');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.35);

  // Available synth voices
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  // Lector Speech states
  const [isLectorSpeaking, setIsLectorSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.92); // Natural and prayerful speed
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [activeReadingIndex, setActiveReadingIndex] = useState<number>(0);
  const [isAutoPlayChain, setIsAutoPlayChain] = useState<boolean>(false);

  // Active target selection
  const [selectedTargetType, setSelectedTargetType] = useState<'current' | 'daily_gospel' | 'daily_first' | 'daily_psalm' | 'chain' | 'custom'>('current');
  const [customTextToRead, setCustomTextToRead] = useState<string>('');
  const [customSiglumToRead, setCustomSiglumToRead] = useState<string>('J 1, 1-5');

  // Currently playing info
  const [currentlyReadingLabel, setCurrentlyReadingLabel] = useState<string>('');
  const [currentlyReadingText, setCurrentlyReadingText] = useState<string>('');

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        if (!synthRef.current) return;
        const allVoices = synthRef.current.getVoices();
        
        // Polish voices first, then others
        const plVoices = allVoices.filter(v => v.lang.startsWith('pl') || v.lang.startsWith('PL'));
        const otherVoices = allVoices.filter(v => !v.lang.startsWith('pl') && !v.lang.startsWith('PL'));
        
        const sorted = [...plVoices, ...otherVoices];
        setAvailableVoices(sorted);

        // Auto-select best natural polish voice
        if (!selectedVoiceURI && plVoices.length > 0) {
          const naturalPl = plVoices.find(v => 
            v.name.toLowerCase().includes('google') || 
            v.name.toLowerCase().includes('natural') || 
            v.name.toLowerCase().includes('online') ||
            v.name.toLowerCase().includes('paulina') ||
            v.name.toLowerCase().includes('zofia') ||
            v.name.toLowerCase().includes('zosia')
          ) || plVoices[0];

          setSelectedVoiceURI(naturalPl.voiceURI);
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [selectedVoiceURI]);

  // React to external play trigger (when user clicks "Czytaj lektorem" on ANY card in the app)
  useEffect(() => {
    if (externalAudioTrigger && externalAudioTrigger.text) {
      setCurrentlyReadingLabel(externalAudioTrigger.title || externalAudioTrigger.siglum);
      setCurrentlyReadingText(externalAudioTrigger.text);
      setSelectedTargetType('current');
      speakTarget(externalAudioTrigger.text, externalAudioTrigger.siglum, externalAudioTrigger.title);
    }
  }, [externalAudioTrigger]);

  // Update volume
  const handleVolumeChange = (newVol: number) => {
    setAmbientVolume(newVol);
    audioEngine.setVolume(newVol);
  };

  const toggleAmbient = () => {
    if (isAmbientOn) {
      audioEngine.stopAmbient();
      setIsAmbientOn(false);
    } else {
      audioEngine.startAmbient(preset, ambientVolume);
      setIsAmbientOn(true);
    }
  };

  const handlePresetChange = (newPreset: 'gregorian' | 'bowls' | 'desert' | 'monastery') => {
    setPreset(newPreset);
    if (isAmbientOn) {
      audioEngine.setPreset(newPreset);
    }
  };

  // Core speak method with Polish natural expansions
  const speakTarget = (text: string, siglum?: string, title?: string, onComplete?: () => void) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    // Soft chime before reading to establish contemplative silence
    audioEngine.playSoftChime();

    // Format text using our Polish Biblical Speech Expander
    const naturalSpokenScripture = prepareScriptureTextForSpeech(text, siglum, title);
    
    setCurrentlyReadingLabel(title || siglum || 'Słowo Boże');
    setCurrentlyReadingText(text);

    const utterance = new SpeechSynthesisUtterance(naturalSpokenScripture);
    utterance.lang = 'pl-PL';
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    // Apply user selected voice
    if (selectedVoiceURI && availableVoices.length > 0) {
      const chosenVoice = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
    } else {
      const plVoice = availableVoices.find(v => v.lang.startsWith('pl'));
      if (plVoice) utterance.voice = plVoice;
    }

    utterance.onstart = () => {
      setIsLectorSpeaking(true);
    };

    utterance.onend = () => {
      setIsLectorSpeaking(false);
      if (onComplete) {
        onComplete();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsLectorSpeaking(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopLector = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsLectorSpeaking(false);
      setIsAutoPlayChain(false);
    }
  };

  // Determine what text to read based on current target selection
  const handleTriggerLector = () => {
    if (isLectorSpeaking) {
      stopLector();
      return;
    }

    if (selectedTargetType === 'current') {
      speakTarget(currentVerseText, currentVerseSiglum, currentVerseTitle);
    } else if (selectedTargetType === 'daily_gospel') {
      const gospel = dailyReadingsPresets.find(r => r.category === 'gospel');
      if (gospel) {
        speakTarget(gospel.text, gospel.siglum, gospel.title || 'Ewangelia z dnia');
      } else {
        speakTarget(currentVerseText, currentVerseSiglum, 'Ewangelia');
      }
    } else if (selectedTargetType === 'daily_first') {
      const first = dailyReadingsPresets.find(r => r.category === 'firstReading');
      if (first) {
        speakTarget(first.text, first.siglum, first.title || 'I Czytanie z dnia');
      } else {
        speakTarget(currentVerseText, currentVerseSiglum, 'I Czytanie');
      }
    } else if (selectedTargetType === 'daily_psalm') {
      const psalm = dailyReadingsPresets.find(r => r.category === 'psalm');
      if (psalm) {
        speakTarget(psalm.text, psalm.siglum, psalm.title || 'Psalm responsoryjny');
      } else {
        speakTarget(currentVerseText, currentVerseSiglum, 'Psalm');
      }
    } else if (selectedTargetType === 'chain') {
      handlePlayEntireChain(0);
    } else if (selectedTargetType === 'custom') {
      if (customTextToRead.trim()) {
        speakTarget(customTextToRead.trim(), customSiglumToRead.trim(), 'Własny fragment');
      }
    }
  };

  // Play chain of verses in tree
  const handlePlayEntireChain = (startIndex: number = 0) => {
    if (allVersesInChain.length === 0) return;
    setIsAutoPlayChain(true);
    setActiveReadingIndex(startIndex);

    const item = allVersesInChain[startIndex];
    if (onVerseChange) onVerseChange(item.siglum);

    speakTarget(item.text, item.siglum, `Werset ${startIndex + 1} z ${allVersesInChain.length}`, () => {
      if (startIndex + 1 < allVersesInChain.length) {
        setTimeout(() => {
          handlePlayEntireChain(startIndex + 1);
        }, 1500); // 1.5s peaceful pause between cross references
      } else {
        setIsAutoPlayChain(false);
        audioEngine.strikeBowl(432); // Final peace chime
      }
    });
  };

  // Find daily readings from presets
  const gospelReading = dailyReadingsPresets.find(r => r.category === 'gospel');
  const firstReading = dailyReadingsPresets.find(r => r.category === 'firstReading');
  const psalmReading = dailyReadingsPresets.find(r => r.category === 'psalm');

  return (
    <>
      {/* Floating Bottom Right Prayer & Chants Bar */}
      <aside 
        aria-label="Odtwarzacz modlitewny i lektor biblijny"
        className="fixed bottom-16 md:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end gap-2 animate-fade-in"
      >
        {/* Minimized Pill Bar */}
        <div className="bg-slate-950/95 text-white backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-700/80 shadow-2xl flex items-center gap-2.5">
          {/* Lector Button */}
          <button
            type="button"
            onClick={handleTriggerLector}
            className={`p-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center ${
              isLectorSpeaking 
                ? 'bg-emerald-500 text-slate-950 animate-pulse ring-2 ring-emerald-300 shadow-emerald-500/50' 
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
            title={isLectorSpeaking ? 'Zatrzymaj czytanie lektora' : 'Odsłuchaj Słowo Boże głosem lektora'}
          >
            {isLectorSpeaking ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Ambient Music Switch */}
          <button
            type="button"
            onClick={toggleAmbient}
            className={`p-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center ${
              isAmbientOn 
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-200' 
                : 'bg-slate-800 hover:bg-slate-700 text-amber-200'
            }`}
            title={isAmbientOn ? 'Wyłącz tło kontemplacyjne' : 'Włącz tło kontemplacyjne: Chorał gregoriański / Misy'}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Target and Status Pill text */}
          <div className="flex flex-col text-left max-w-[140px] sm:max-w-[190px]">
            <span className="text-[11px] font-sans font-bold text-slate-100 truncate flex items-center gap-1">
              <Headphones className="w-3 h-3 text-emerald-400 shrink-0" />
              {isLectorSpeaking ? (
                <span className="text-emerald-300 font-bold truncate">Czyta: {currentlyReadingLabel || currentVerseSiglum}</span>
              ) : (
                <span className="truncate">{currentVerseSiglum}</span>
              )}
            </span>
            <span className="text-[9px] font-mono text-slate-400 truncate">
              {isLectorSpeaking 
                ? 'Odtwarzanie lektora...' 
                : isAmbientOn 
                ? (preset === 'gregorian' ? 'Chorał gregoriański' : preset === 'bowls' ? 'Misy i dzwonki' : preset === 'desert' ? 'Pustynia Synaj' : 'Dzwony') 
                : 'Lektor & Chorał'}
            </span>
          </div>

          {/* Expand / Panel toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? 'Zwiń panel lektora' : 'Rozwiń panel ustawień lektora i wyboru tekstu'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="w-[330px] sm:w-[410px] bg-slate-900/98 text-slate-100 backdrop-blur-2xl p-5 rounded-3xl border border-slate-700 shadow-2xl space-y-4 animate-scale-up max-h-[82vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-emerald-400" />
                <h3 className="font-serif text-sm font-bold text-white tracking-wide">
                  Lektor Biblijny & Chorał
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. SEKCJA: WSKAZANIE CO MA CZYTAĆ (WYBÓR TEKSTU) */}
            <div className="space-y-2.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-sans font-bold text-slate-200">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Radio className="w-3.5 h-3.5" />
                  Wskaż, co ma czytać lektor:
                </span>
                <span className="text-[10px] font-mono text-slate-400">Wybór fragmentu</span>
              </div>

              {/* Target Selector Buttons */}
              <div className="grid grid-cols-2 gap-1.5 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => setSelectedTargetType('current')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-0.5 ${
                    selectedTargetType === 'current'
                      ? 'bg-emerald-950/80 border-emerald-400 text-white ring-1 ring-emerald-400/50'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-[11px] truncate flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Wybrany werset
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate">{currentVerseSiglum}</span>
                </button>

                {gospelReading && (
                  <button
                    type="button"
                    onClick={() => setSelectedTargetType('daily_gospel')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-0.5 ${
                      selectedTargetType === 'daily_gospel'
                        ? 'bg-emerald-950/80 border-emerald-400 text-white ring-1 ring-emerald-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-emerald-400" />
                      Ewangelia z dnia
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate">{gospelReading.siglum}</span>
                  </button>
                )}

                {firstReading && (
                  <button
                    type="button"
                    onClick={() => setSelectedTargetType('daily_first')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-0.5 ${
                      selectedTargetType === 'daily_first'
                        ? 'bg-emerald-950/80 border-emerald-400 text-white ring-1 ring-emerald-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate flex items-center gap-1">
                      <Scroll className="w-3 h-3 text-amber-400" />
                      I Czytanie z dnia
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate">{firstReading.siglum}</span>
                  </button>
                )}

                {psalmReading && (
                  <button
                    type="button"
                    onClick={() => setSelectedTargetType('daily_psalm')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-0.5 ${
                      selectedTargetType === 'daily_psalm'
                        ? 'bg-emerald-950/80 border-emerald-400 text-white ring-1 ring-emerald-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate flex items-center gap-1">
                      <Waves className="w-3 h-3 text-amber-400" />
                      Psalm responsoryjny
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate">{psalmReading.siglum}</span>
                  </button>
                )}

                {allVersesInChain.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTargetType('chain')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-0.5 ${
                      selectedTargetType === 'chain'
                        ? 'bg-emerald-950/80 border-emerald-400 text-white ring-1 ring-emerald-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate flex items-center gap-1">
                      <ListTree className="w-3 h-3 text-sky-400" />
                      Całe drzewko ({allVersesInChain.length})
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate">Kolejno z gongiem</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedTargetType('custom')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-0.5 ${
                    selectedTargetType === 'custom'
                      ? 'bg-emerald-950/80 border-emerald-400 text-white ring-1 ring-emerald-400/50'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-[11px] truncate flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-purple-400" />
                    Własny tekst
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate">Wpisz lub wklej</span>
                </button>
              </div>

              {/* Custom text input if custom selected */}
              {selectedTargetType === 'custom' && (
                <div className="space-y-2 pt-2 animate-fade-in">
                  <input
                    type="text"
                    value={customSiglumToRead}
                    onChange={(e) => setCustomSiglumToRead(e.target.value)}
                    placeholder="Siglum np. J 1, 1-14"
                    className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-emerald-500"
                  />
                  <textarea
                    rows={2}
                    value={customTextToRead}
                    onChange={(e) => setCustomTextToRead(e.target.value)}
                    placeholder="Wpisz lub wklej tekst biblijny do przeczytania..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-scripture focus:outline-emerald-500"
                  />
                </div>
              )}

              {/* Read-along Text Preview Box */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                  <span className="font-semibold text-emerald-400">Podgląd tekstu do czytania:</span>
                  <span className="font-mono">{selectedTargetType === 'current' ? currentVerseSiglum : selectedTargetType === 'daily_gospel' ? gospelReading?.siglum : selectedTargetType === 'daily_first' ? firstReading?.siglum : selectedTargetType === 'daily_psalm' ? psalmReading?.siglum : selectedTargetType === 'chain' ? `${allVersesInChain.length} wersetów` : customSiglumToRead}</span>
                </div>
                <p className="font-scripture text-xs text-slate-200 line-clamp-3 italic leading-relaxed">
                  «{selectedTargetType === 'current' ? currentVerseText : selectedTargetType === 'daily_gospel' ? gospelReading?.text : selectedTargetType === 'daily_first' ? firstReading?.text : selectedTargetType === 'daily_psalm' ? psalmReading?.text : selectedTargetType === 'chain' ? allVersesInChain.map(n => n.siglum).join(' ➔ ') : (customTextToRead || 'Wpisz tekst powyżej...')}»
                </p>
              </div>

              {/* Main Play Action Button */}
              <button
                type="button"
                onClick={handleTriggerLector}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isLectorSpeaking
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isLectorSpeaking ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Zatrzymaj czytanie lektora</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Rozpocznij czytanie lektora</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. SEKCJA: WYBÓR NATURALNEGO GŁOSU I TEMPA */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-300 font-sans font-semibold">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  Wybór głosu lektora (Naturalny PL):
                </span>
                <span className="text-[10px] text-sky-300 font-mono">
                  {availableVoices.filter(v => v.lang.startsWith('pl')).length} głosów PL
                </span>
              </div>

              {/* Voice Selector Dropdown */}
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {availableVoices.length === 0 ? (
                  <option value="">Domyślny głos systemowy</option>
                ) : (
                  availableVoices.map((v) => {
                    const isPl = v.lang.startsWith('pl') || v.lang.startsWith('PL');
                    const isNatural = v.name.toLowerCase().includes('google') || 
                                     v.name.toLowerCase().includes('natural') || 
                                     v.name.toLowerCase().includes('online');
                    return (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {isPl ? '🇵🇱 ' : '🌐 '}
                        {v.name} {isNatural ? '★ (Naturalny)' : ''}
                      </option>
                    );
                  })
                )}
              </select>

              {/* Speed adjustment */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Tempo czytania modlitewnego:</span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSpeechRate(0.8)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${speechRate === 0.8 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    0.8x (Spokojne)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechRate(0.92)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${speechRate === 0.92 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    0.9x (Modlitwa)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechRate(1.0)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${speechRate === 1.0 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    1.0x (Standard)
                  </button>
                </div>
              </div>
            </div>

            {/* 3. SEKCJA: TŁO KONTEMPLACYJNE (CHORAŁ GREGORIAŃSKI, MISY, PUSTYNIA) */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-300 font-sans font-semibold">
                <span className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-400" />
                  Tło kontemplacyjne (Syntezator Web Audio):
                </span>
                <button
                  type="button"
                  onClick={toggleAmbient}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer ${
                    isAmbientOn ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAmbientOn ? 'Gra' : 'Włącz'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handlePresetChange('gregorian');
                    if (!isAmbientOn) toggleAmbient();
                  }}
                  className={`p-2 rounded-xl border text-xs font-sans text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                    preset === 'gregorian' && isAmbientOn
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">Chorał Gregoriański</span>
                    <Disc className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-[9px] text-slate-400">Dźwięki organum</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handlePresetChange('bowls');
                    if (!isAmbientOn) toggleAmbient();
                  }}
                  className={`p-2 rounded-xl border text-xs font-sans text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                    preset === 'bowls' && isAmbientOn
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">Misy i Dzwonki</span>
                    <Bell className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-[9px] text-slate-400">432 Hz Solfeggio</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handlePresetChange('monastery');
                    if (!isAmbientOn) toggleAmbient();
                  }}
                  className={`p-2 rounded-xl border text-xs font-sans text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                    preset === 'monastery' && isAmbientOn
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">Dzwony Klasztorne</span>
                    <Waves className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-[9px] text-slate-400">Klasztorna cisza</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handlePresetChange('desert');
                    if (!isAmbientOn) toggleAmbient();
                  }}
                  className={`p-2 rounded-xl border text-xs font-sans text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                    preset === 'desert' && isAmbientOn
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">Pustynia Synaj</span>
                    <Wind className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-[9px] text-slate-400">Ciepły pad modlitewny</span>
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 pt-1">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-xs text-slate-300 w-8 text-right">
                  {Math.round(ambientVolume * 100)}%
                </span>
              </div>
            </div>

            {/* 4. Manual Chime Bell */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                Gong medytacyjny:
              </span>
              <button
                type="button"
                onClick={() => audioEngine.strikeBowl(432)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-sans cursor-pointer transition-colors"
              >
                Uderz w misę (432Hz)
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
