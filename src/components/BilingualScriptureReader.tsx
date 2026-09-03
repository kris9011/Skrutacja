import React, { useState, useEffect, useMemo } from 'react';
import { 
  Languages, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  RotateCw, 
  Search, 
  X, 
  BookmarkPlus, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Square,
  Headphones,
  Sliders,
  SkipForward,
  SkipBack,
  ExternalLink,
  HelpCircle,
  Flame,
  Layers,
  FileText,
  ListOrdered,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  Hash,
  BookMarked,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  BiblicalLexiconEntry, 
  BiblicalWordOccurrence, 
  findBiblicalLexiconEntry,
  hasExactBiblicalLexiconEntry 
} from '../data/biblicalLexiconDatabase';
import { 
  parseBiblicalVerses, 
  groupVersesIntoParagraphs, 
  ParsedVerse, 
  toSuperscript 
} from '../utils/bibleVerseParser';

export type ScriptureDisplayMode = 'polski' | 'oryginal' | 'bilingwistyczny';

interface BilingualScriptureReaderProps {
  siglum: string;
  polishText: string;
  originalGreekText?: string;
  originalHebrewText?: string;
  latinVulgateText?: string;
  liturgicalIntroduction?: string;
  theologicalTheme?: string;
  onSelectWordForScrutation?: (occurrenceSiglum: string, occurrenceText: string, word: string) => void;
  onOpenFullScrutation?: (siglum: string, text: string) => void;
  className?: string;
}

export const BilingualScriptureReader: React.FC<BilingualScriptureReaderProps> = ({
  siglum,
  polishText,
  originalGreekText,
  originalHebrewText,
  latinVulgateText,
  liturgicalIntroduction,
  theologicalTheme,
  onSelectWordForScrutation,
  onOpenFullScrutation,
  className = ''
}) => {
  const [displayMode, setDisplayMode] = useState<ScriptureDisplayMode>('polski');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [lexiconData, setLexiconData] = useState<BiblicalLexiconEntry | null>(null);
  const [isLoadingLexicon, setIsLoadingLexicon] = useState<boolean>(false);
  const [lexiconStatus, setLexiconStatus] = useState<'idle' | 'loading' | 'slow_loading' | 'ready' | 'error'>('idle');
  const [isExactCurated, setIsExactCurated] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);

  // Dynamic full original scripture details
  const [fetchedOriginal, setFetchedOriginal] = useState<{
    originalScript?: string;
    transliteration?: string;
    latinVulgate?: string;
    originalLanguage?: string;
    interlinearWords?: Array<{ original: string; transliteration: string; polish: string; grammarNote?: string }>;
  } | null>(null);
  const [isLoadingOriginal, setIsLoadingOriginal] = useState<boolean>(false);

  // Wersyfikacja: domyślnie każdy wers od nowej linijki (1, 2, 3...)
  const [polishLayoutMode, setPolishLayoutMode] = useState<'lines' | 'cards' | 'paul'>('lines');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [activeVersePopup, setActiveVersePopup] = useState<ParsedVerse | null>(null);
  const [hoveredVerseNum, setHoveredVerseNum] = useState<number | null>(null);
  const [highlightedVerseNum, setHighlightedVerseNum] = useState<number | null>(null);
  const [copiedVerseNum, setCopiedVerseNum] = useState<number | null>(null);
  const [showVerseFootnotes, setShowVerseFootnotes] = useState<boolean>(true);

  // Web Speech Audio Lector states (0 API consumption, runs local browser synthesis)
  const [isAudioBarOpen, setIsAudioBarOpen] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPausedAudio, setIsPausedAudio] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9); // 0.9 = calm meditative speed
  const [currentAudioVerseNum, setCurrentAudioVerseNum] = useState<number | null>(null);
  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  const activeIndexRef = React.useRef<number>(0);
  const isPlayingRef = React.useRef<boolean>(false);
  const singleVerseModeRef = React.useRef<boolean>(false);

  // Load and filter available voices (prioritizing Polish voices)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      const polish = all.filter(v => v.lang.toLowerCase().startsWith('pl'));
      setSpeechVoices(polish.length > 0 ? polish : all);

      if (!selectedVoiceURI && polish.length > 0) {
        const preferred = polish.find(v => 
          v.name.toLowerCase().includes('natural') || 
          v.name.toLowerCase().includes('online') || 
          v.name.toLowerCase().includes('paulina') || 
          v.name.toLowerCase().includes('zosia')
        ) || polish[0];
        setSelectedVoiceURI(preferred.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoiceURI]);

  // Stop speech synthesis on passage or displayMode change
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    setCurrentAudioVerseNum(null);
    isPlayingRef.current = false;
  }, [polishText, siglum, displayMode]);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    setCurrentAudioVerseNum(null);
    isPlayingRef.current = false;
    singleVerseModeRef.current = false;
  };

  const speakVerseAtIndex = (index: number) => {
    if (!isPlayingRef.current || index >= parsedVerses.length || index < 0) {
      stopAudio();
      return;
    }

    const verse = parsedVerses[index];
    activeIndexRef.current = index;
    setCurrentAudioVerseNum(verse.verseNum);

    // Scroll to verse smoothly
    const el = document.getElementById(`verse-line-${verse.verseNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Clean text for speech
    const cleanSpeechText = verse.text
      .replace(/[\(\[\{]\d+[\)\]\}]/g, '')
      .replace(/[*_#«»„"']/g, '')
      .trim();

    if (!cleanSpeechText) {
      if (!singleVerseModeRef.current && index + 1 < parsedVerses.length) {
        speakVerseAtIndex(index + 1);
      } else {
        stopAudio();
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.lang = 'pl-PL';
    utterance.rate = audioSpeed;
    utterance.pitch = 1.0;

    if (selectedVoiceURI) {
      const chosenVoice = window.speechSynthesis.getVoices().find(v => v.voiceURI === selectedVoiceURI);
      if (chosenVoice) utterance.voice = chosenVoice;
    }

    utterance.onend = () => {
      if (singleVerseModeRef.current) {
        stopAudio();
        return;
      }
      if (isPlayingRef.current) {
        // Natural 450ms pause between verses
        setTimeout(() => {
          if (isPlayingRef.current) {
            speakVerseAtIndex(index + 1);
          }
        }, 450);
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (singleVerseModeRef.current) {
        stopAudio();
      } else if (isPlayingRef.current) {
        speakVerseAtIndex(index + 1);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const startAudioFromVerse = (verseNum?: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Twoja przeglądarka nie posiada wsparcia dla syntezy mowy.');
      return;
    }
    window.speechSynthesis.cancel();
    singleVerseModeRef.current = false;
    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
    setIsAudioBarOpen(true);

    const targetIndex = verseNum 
      ? Math.max(0, parsedVerses.findIndex(v => v.verseNum === verseNum))
      : 0;

    speakVerseAtIndex(targetIndex);
  };

  const playSingleVerse = (verseNum: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    singleVerseModeRef.current = true;
    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
    setIsAudioBarOpen(true);

    const targetIndex = Math.max(0, parsedVerses.findIndex(v => v.verseNum === verseNum));
    speakVerseAtIndex(targetIndex);
  };

  const pauseAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPausedAudio(true);
    }
  };

  const resumeAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPausedAudio(false);
    }
  };

  const skipToVerseOffset = (delta: number) => {
    const nextIdx = activeIndexRef.current + delta;
    if (nextIdx >= 0 && nextIdx < parsedVerses.length) {
      window.speechSynthesis.cancel();
      singleVerseModeRef.current = false;
      isPlayingRef.current = true;
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      speakVerseAtIndex(nextIdx);
    }
  };

  // Parsowanie tekstu na wyodrębnione wersety i akapity
  const parsedVerses = useMemo(() => {
    return parseBiblicalVerses(polishText, siglum);
  }, [polishText, siglum]);

  const verseParagraphs = useMemo(() => {
    return groupVersesIntoParagraphs(parsedVerses, 3);
  }, [parsedVerses]);

  // Clean and split words for interactive selection - tokens keep natural spacing and attached punctuation
  const rawWords = polishText.trim().split(/\s+/).filter(Boolean);

  const isOldTestament = Boolean(
    originalHebrewText || 
    ['Rdz', 'Wj', 'Kpł', 'Lb', 'Pwt', 'Joz', 'Sdz', 'Rt', '1 Sm', '2 Sm', '1 Krl', '2 Krl', '1 Krn', '2 Krn', 'Ezd', 'Ne', 'Tb', 'Jdt', 'Est', '1 Mch', '2 Mch', 'Hi', 'Ps', 'Prz', 'Koh', 'Pnp', 'Mdr', 'Syr', 'Iz', 'Jr', 'Lm', 'Ba', 'Ez', 'Dn', 'Oz', 'Jl', 'Am', 'Ab', 'Jon', 'Mi', 'Na', 'Hab', 'Sof', 'Ag', 'Za', 'Mal'].some(b => siglum.startsWith(b))
  );

  // Automatically fetch full unabridged original text when entering 'oryginal' or 'bilingwistyczny' mode
  useEffect(() => {
    if ((displayMode === 'oryginal' || displayMode === 'bilingwistyczny') && !fetchedOriginal && !isLoadingOriginal) {
      // If we already have complete unabridged text without ellipsis, use it
      const hasCompleteGreek = originalGreekText && originalGreekText.length > 80 && !originalGreekText.includes('...');
      const hasCompleteHebrew = originalHebrewText && originalHebrewText.length > 80 && !originalHebrewText.includes('...');
      if (hasCompleteGreek || hasCompleteHebrew) return;

      setIsLoadingOriginal(true);
      fetch('/api/scrutation/original-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siglum, text: polishText })
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.originalScript) {
            setFetchedOriginal(data);
          }
        })
        .catch(err => {
          console.warn('Original text fetch error:', err);
        })
        .finally(() => {
          setIsLoadingOriginal(false);
        });
    }
  }, [displayMode, siglum, polishText, originalGreekText, originalHebrewText, fetchedOriginal, isLoadingOriginal]);

  // Determine active full original text
  const activeOriginalText = 
    fetchedOriginal?.originalScript ||
    (originalGreekText && !originalGreekText.endsWith('...') ? originalGreekText : null) || 
    (originalHebrewText && !originalHebrewText.endsWith('...') ? originalHebrewText : null) || 
    fetchedOriginal?.originalScript ||
    (isOldTestament 
      ? 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃ וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי־אוֹר׃' 
      : 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος. οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν θεόν. πάντα διʼ αὐτοῦ ἐγένετο, καὶ χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἕν. ὃ γέγονεν ἐν αὐτῷ ζωὴ ἦν, καὶ ἡ ζωὴ ἦν τὸ φῶς τῶν ἀνθρώπων· καὶ τὸ φῶς ἐν τῇ σκοτίᾳ φαίνει, καὶ ἡ σκοτία αὐτὸ οὐ κατέλαβεν.');

  const activeLatinText = 
    fetchedOriginal?.latinVulgate || 
    latinVulgateText || 
    (isOldTestament 
      ? 'In principio creavit Deus caelum et terram. Terra autem erat inanis et vacua, et tenebrae super faciem abyssi, et spiritus Dei ferebatur super aquas.' 
      : 'In principio erat Verbum, et Verbum erat apud Deum, et Deus erat Verbum. Hoc erat in principio apud Deum. Omnia per ipsum facta sunt, et sine ipso factum est nihil.');

  const activeTransliteration = fetchedOriginal?.transliteration;

  // Handle word click
  const handleWordClick = async (word: string) => {
    const trimmed = word.trim().replace(/[.,;!?:«»"()—]/g, '');
    if (!trimmed || trimmed.length < 2) return;

    setSelectedWord(trimmed);
    setIsLoadingLexicon(true);
    setLexiconStatus('loading');

    const exactExists = hasExactBiblicalLexiconEntry(trimmed);
    setIsExactCurated(exactExists);

    // Initial instant preview from local database
    const localEntry = findBiblicalLexiconEntry(trimmed, siglum);
    setLexiconData(localEntry);

    // If request takes longer than 3 seconds, show prompt that loading is in progress / please try again
    const slowTimer = setTimeout(() => {
      setLexiconStatus(prev => prev === 'loading' ? 'slow_loading' : prev);
    }, 3000);

    try {
      const response = await fetch('/api/scrutation/word-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: trimmed,
          verseSiglum: siglum,
          verseText: polishText
        })
      });

      clearTimeout(slowTimer);

      if (response.ok) {
        const data = await response.json();
        setLexiconData(data);
        setIsExactCurated(true);
        setLexiconStatus('ready');
      } else {
        setLexiconStatus('ready');
      }
    } catch (e) {
      clearTimeout(slowTimer);
      console.warn('Word lookup API error, using local verified database:', e);
      setLexiconStatus('ready');
    } finally {
      setIsLoadingLexicon(false);
    }
  };

  // Reset view to default
  const handleReset = () => {
    setDisplayMode('polski');
    setSelectedWord(null);
    setLexiconData(null);
    setLexiconStatus('idle');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Header with Pill Switcher: White, Green, Gold */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-2 sm:p-2.5 rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-serif text-xs sm:text-sm font-bold text-emerald-950 bg-amber-50 px-3 py-1 rounded-lg border border-amber-300/80 shadow-2xs shrink-0">
            {siglum}
          </span>
          <span className="text-xs font-sans text-stone-600 truncate hidden sm:inline">
            Kliknij dowolne słowo, aby odkryć rdzeń grecki/hebrajski
          </span>
        </div>

        {/* Clean Pill Toggle: [ POLSKI | ORYGINAŁ | BILINGWISTYCZNY ] */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center p-0.5 sm:p-1 bg-stone-100 rounded-full border border-stone-200 shadow-inner w-full sm:w-auto justify-around sm:justify-start">
            <button
              type="button"
              onClick={() => setDisplayMode('polski')}
              className={`px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                displayMode === 'polski'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-emerald-950'
              }`}
            >
              Polski
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('oryginal')}
              className={`px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                displayMode === 'oryginal'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-emerald-950'
              }`}
            >
              Oryginał
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('bilingwistyczny')}
              className={`px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                displayMode === 'bilingwistyczny'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-emerald-950'
              }`}
            >
              Bilingwistyczny
            </button>
          </div>

          {/* Reset / Reload Button */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 sm:p-2 rounded-full bg-white hover:bg-stone-50 text-stone-500 hover:text-emerald-900 border border-stone-200 transition-all cursor-pointer shadow-2xs shrink-0"
            title="Zresetuj widok i odznacz słowo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Liturgical Introduction if present */}
      {liturgicalIntroduction && (
        <p className="text-xs font-sans italic text-stone-600 border-l-2 border-emerald-600 pl-3 py-0.5 bg-emerald-50/30 rounded-r-lg">
          {liturgicalIntroduction}
        </p>
      )}

      {/* 1. MODE: POLSKI (Układ Edycji Świętego Pawła z wersyfikacją i przypisami) */}
      {displayMode === 'polski' && (
        <div className="space-y-4">
          {/* Bible Reading Toolbar - Minimalist, white, green and gold */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 sm:p-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs text-xs">
            {/* Layout switch: Clean text pills without icon overload */}
            <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-lg border border-stone-200">
              <button
                type="button"
                onClick={() => setPolishLayoutMode('lines')}
                className={`px-3 py-1 rounded-md font-sans font-semibold text-xs transition-all cursor-pointer ${
                  polishLayoutMode === 'lines'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-emerald-950 hover:bg-white'
                }`}
                title="Wiersze: każdy werset rozpoczyna się od nowej linijki"
              >
                Wiersze (1, 2...)
              </button>

              <button
                type="button"
                onClick={() => setPolishLayoutMode('paul')}
                className={`px-3 py-1 rounded-md font-sans font-semibold text-xs transition-all cursor-pointer ${
                  polishLayoutMode === 'paul'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-emerald-950 hover:bg-white'
                }`}
                title="Akapity: tradycyjny układ ciągły Pisma Świętego"
              >
                Akapity
              </button>

              <button
                type="button"
                onClick={() => setPolishLayoutMode('cards')}
                className={`px-3 py-1 rounded-md font-sans font-semibold text-xs transition-all cursor-pointer ${
                  polishLayoutMode === 'cards'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-emerald-950 hover:bg-white'
                }`}
                title="Karty: studyjny widok wersetów z aparatem skrutacji"
              >
                Karty
              </button>
            </div>

            {/* Font size, footnotes and audio controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Font size pills in gold */}
              <div className="flex items-center gap-0.5 bg-stone-50 px-1.5 py-1 rounded-lg border border-stone-200 text-[11px] font-sans">
                <span className="text-stone-400 font-medium px-1">Tekst:</span>
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    fontSize === 'normal' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Czcionka standardowa"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    fontSize === 'large' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Czcionka czytelna"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('xlarge')}
                  className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    fontSize === 'xlarge' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Czcionka powiększona"
                >
                  A++
                </button>
              </div>

              {/* Toggle Footnotes Panel */}
              <button
                type="button"
                onClick={() => setShowVerseFootnotes(!showVerseFootnotes)}
                className={`px-3 py-1.5 rounded-lg border font-sans font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  showVerseFootnotes
                    ? 'bg-amber-50 text-amber-950 border-amber-300 shadow-2xs'
                    : 'bg-white text-stone-700 hover:text-amber-900 hover:bg-amber-50/50 border-stone-200'
                }`}
                title="Pokaż lub ukryj przypisy wersetowe"
              >
                <span>Przypisy ({parsedVerses.length})</span>
              </button>

              {/* Toggle Audio Lector: White, Emerald and Gold */}
              <button
                type="button"
                onClick={() => {
                  if (!isAudioBarOpen && !isPlayingAudio) {
                    setIsAudioBarOpen(true);
                  } else if (isAudioBarOpen && !isPlayingAudio) {
                    setIsAudioBarOpen(false);
                  } else {
                    setIsAudioBarOpen(!isAudioBarOpen);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg border font-sans font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                  isPlayingAudio
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                    : isAudioBarOpen
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-300 ring-1 ring-emerald-300'
                    : 'bg-white text-emerald-900 hover:bg-emerald-50 border-emerald-300'
                }`}
                title="Włącz lektora audio Pisma Świętego"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse text-amber-300' : 'text-emerald-700'}`} />
                <span>Lektor</span>
                {isPlayingAudio && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>

              {/* Copy button */}
              <button
                type="button"
                onClick={() => {
                  const numbered = parsedVerses.map(v => `(${v.verseNum}) ${v.text}`).join('\n');
                  handleCopy(`${numbered}\n[${siglum}]`);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 font-sans font-medium text-xs flex items-center gap-1 transition-all cursor-pointer"
                title="Kopiuj z numeracją wersetów"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-400" />}
                <span>{isCopied ? 'Skopiowano' : 'Kopiuj'}</span>
              </button>
            </div>
          </div>

          {/* AUDIO LECTOR BAR - Calm, Sacral: White, Green and Gold */}
          {isAudioBarOpen && (
            <div className="p-3 sm:p-4 rounded-xl bg-white border-2 border-emerald-200/90 shadow-xs space-y-2.5 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Title & Status */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-sans font-bold text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300/80 shadow-2xs">
                    w. {currentAudioVerseNum || 1}
                  </span>
                  <div>
                    <div className="text-xs font-sans font-bold text-emerald-950">
                      Lektor Pisma Świętego: {siglum}
                    </div>
                    <div className="text-[11px] text-emerald-800 font-sans">
                      {isPlayingAudio ? (
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          Czytanie wersetu <strong>{currentAudioVerseNum || 1}</strong> z {parsedVerses.length}
                        </span>
                      ) : isPausedAudio ? (
                        <span className="text-amber-800 font-medium">
                          Wstrzymano czytanie na wersecie {currentAudioVerseNum || 1}
                        </span>
                      ) : (
                        <span className="text-stone-500">Gotowy do odczytu ({parsedVerses.length} {parsedVerses.length === 1 ? 'werset' : 'wersetów'})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Audio Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => skipToVerseOffset(-1)}
                    disabled={!isPlayingAudio && !isPausedAudio}
                    className="p-1.5 rounded-lg bg-white hover:bg-emerald-50 text-stone-700 disabled:opacity-30 disabled:pointer-events-none border border-stone-200 transition-colors cursor-pointer shadow-2xs"
                    title="Poprzedni werset"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  {!isPlayingAudio || isPausedAudio ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (isPausedAudio) {
                          resumeAudio();
                        } else {
                          startAudioFromVerse(currentAudioVerseNum || 1);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-sans font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      title={isPausedAudio ? 'Wznów czytanie' : 'Rozpocznij czytanie na głos'}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isPausedAudio ? 'Wznów' : 'Czytaj'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={pauseAudio}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-sans font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      title="Wstrzymaj czytanie"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pauza</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={stopAudio}
                    disabled={!isPlayingAudio && !isPausedAudio}
                    className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-600 disabled:opacity-30 disabled:pointer-events-none border border-stone-200 transition-colors cursor-pointer shadow-2xs"
                    title="Zatrzymaj czytanie"
                  >
                    <Square className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => skipToVerseOffset(1)}
                    disabled={!isPlayingAudio && !isPausedAudio}
                    className="p-1.5 rounded-lg bg-white hover:bg-emerald-50 text-stone-700 disabled:opacity-30 disabled:pointer-events-none border border-stone-200 transition-colors cursor-pointer shadow-2xs"
                    title="Następny werset"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopAudio();
                      setIsAudioBarOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer ml-1"
                    title="Zamknij panel lektora"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Second row: Speed selector and voice */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-100 text-xs">
                {/* Meditative Speed Selection */}
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[11px] font-sans text-emerald-950 font-semibold mr-1">
                    Tempo:
                  </span>
                  {[
                    { label: '0.8x Spokojne', val: 0.8 },
                    { label: '0.9x Medytacja', val: 0.9 },
                    { label: '1.0x Standard', val: 1.0 },
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => setAudioSpeed(s.val)}
                      className={`px-2.5 py-0.5 rounded-md font-sans text-[11px] font-semibold transition-all cursor-pointer ${
                        audioSpeed === s.val
                          ? 'bg-emerald-800 text-white shadow-2xs'
                          : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                      }`}
                      title={`Ustaw tempo odczytu na ${s.val}x`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Voice Selector */}
                {speechVoices.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-sans text-stone-500">Głos:</span>
                    <select
                      value={selectedVoiceURI}
                      onChange={(e) => setSelectedVoiceURI(e.target.value)}
                      className="bg-white border border-stone-300 text-stone-800 text-[11px] rounded-md px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-700 max-w-[200px] truncate cursor-pointer"
                    >
                      {speechVoices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Verse Popup Card - White with gold border and emerald actions */}
          {activeVersePopup && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-white border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-600 text-white font-sans font-bold text-xs shadow-2xs">
                    Werset {activeVersePopup.verseNum}
                  </span>
                  <span className="font-serif font-bold text-xs text-amber-950">
                    {activeVersePopup.siglum}
                  </span>
                  <span className="text-[11px] text-stone-500 italic">
                    Przypis wersetowy
                  </span>
                </div>
                <p className="font-scripture text-sm text-stone-800 italic line-clamp-2">
                  «{activeVersePopup.text}»
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onOpenFullScrutation?.(activeVersePopup.siglum, activeVersePopup.text);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-sans font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Rozpocznij skrutację tego konkretnego wersetu z odnośnikami"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Skrutuj werset</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSingleVerse(activeVersePopup.verseNum);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg font-sans font-bold text-xs flex items-center gap-1 transition-all border shadow-2xs cursor-pointer ${
                    currentAudioVerseNum === activeVersePopup.verseNum && isPlayingAudio
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-emerald-900 border-stone-200'
                  }`}
                  title="Odsłuchaj ten werset (lektor)"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${currentAudioVerseNum === activeVersePopup.verseNum && isPlayingAudio ? 'animate-pulse' : ''}`} />
                  <span>{currentAudioVerseNum === activeVersePopup.verseNum && isPlayingAudio ? 'Czyta...' : 'Odsłuchaj'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCopy(`(${activeVersePopup.verseNum}) ${activeVersePopup.text} [${activeVersePopup.siglum}]`);
                    setCopiedVerseNum(activeVersePopup.verseNum);
                    setTimeout(() => setCopiedVerseNum(null), 2000);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-700 font-sans font-medium text-xs flex items-center gap-1 transition-all border border-stone-200 shadow-2xs cursor-pointer"
                  title="Kopiuj ten werset"
                >
                  {copiedVerseNum === activeVersePopup.verseNum ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Skopiowano</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                      <span>Kopiuj</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVersePopup(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Zamknij przypis"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* MAIN SCRIPTURE DISPLAY */}
          {polishLayoutMode === 'lines' ? (
            /* 1) DOMYŚLNY UKŁAD: KAŻDY WERSET OD NOWEJ LINIJKI (1 -> nowa linijka, 2 -> nowa linijka...) */
            <div className="p-5 sm:p-7 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
              <div className="space-y-1 sm:space-y-1.5 divide-y divide-stone-100">
                {parsedVerses.map((verse) => {
                  const isVerseActive = activeVersePopup?.verseNum === verse.verseNum;
                  const isVerseHovered = hoveredVerseNum === verse.verseNum;
                  const isVerseHighlighted = highlightedVerseNum === verse.verseNum;
                  const isVerseSpeaking = currentAudioVerseNum === verse.verseNum && (isPlayingAudio || isPausedAudio);

                  return (
                    <div key={verse.verseNum} className="pt-2 sm:pt-2.5 first:pt-0">
                      {/* Chapter Header if present */}
                      {verse.chapterHeader && (
                        <div className="font-sans font-bold text-xs uppercase tracking-widest text-emerald-900 bg-emerald-50 px-3.5 py-2 rounded-lg border border-emerald-200/80 my-3">
                          {verse.chapterHeader}
                        </div>
                      )}

                      {/* Verse Line: starts on a fresh line with verse number at the start */}
                      <div
                        id={`verse-line-${verse.verseNum}`}
                        className={`group relative flex items-baseline gap-2.5 sm:gap-3.5 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl transition-all ${
                          isVerseSpeaking
                            ? 'bg-emerald-50/90 ring-2 ring-emerald-600 shadow-xs'
                            : isVerseActive || isVerseHighlighted
                            ? 'bg-amber-50/90 ring-1 ring-amber-400'
                            : isVerseHovered
                            ? 'bg-stone-50'
                            : 'hover:bg-stone-50/60'
                        }`}
                        onMouseEnter={() => setHoveredVerseNum(verse.verseNum)}
                        onMouseLeave={() => setHoveredVerseNum(null)}
                      >
                        {/* Verse Number at the start of the line - Sacral Gold */}
                        <div className="shrink-0 select-none pt-0.5 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveVersePopup(activeVersePopup?.verseNum === verse.verseNum ? null : verse);
                            }}
                            className={`inline-flex items-center justify-center font-sans font-bold text-xs sm:text-sm min-w-[28px] sm:min-w-[32px] px-1.5 py-0.5 rounded-lg transition-all cursor-pointer shadow-2xs ${
                              isVerseSpeaking
                                ? 'bg-emerald-800 text-white shadow-xs scale-105 ring-2 ring-emerald-500'
                                : isVerseActive
                                ? 'bg-amber-600 text-white shadow-xs scale-105 ring-1 ring-amber-700'
                                : isVerseHovered
                                ? 'bg-amber-200 text-amber-950 scale-105'
                                : 'bg-amber-50 text-amber-900 border border-amber-300/80 hover:bg-amber-200'
                            }`}
                            title={`Werset ${verse.verseNum} (${verse.siglum}) — kliknij, aby otworzyć przypis`}
                          >
                            {verse.verseNum}
                          </button>
                        </div>

                        {/* Verse text on this line */}
                        <div
                          className={`flex-1 font-scripture ${
                            fontSize === 'normal'
                              ? 'text-base sm:text-lg leading-relaxed'
                              : fontSize === 'large'
                              ? 'text-lg sm:text-xl leading-relaxed'
                              : 'text-xl sm:text-2xl leading-loose'
                          } text-stone-900`}
                        >
                          {verse.words.map((token, wIdx) => {
                            const match = token.match(/^([«„"'(]*)(.*?)([.,;!?:»”"')—]*)$/);
                            const leadingPunct = match ? match[1] : '';
                            const coreToken = match ? match[2] : token;
                            const trailingPunct = match ? match[3] : '';
                            const isWord = /^[a-zęóąśłżźćńA-ZĘÓĄŚŁŻŹĆŃ0-9]+$/.test(coreToken);
                            const isSelected = isWord && selectedWord?.toLowerCase() === coreToken.toLowerCase();

                            return (
                              <span key={wIdx} className="inline">
                                {leadingPunct}
                                {isWord ? (
                                  <span
                                    onClick={() => handleWordClick(coreToken)}
                                    onMouseEnter={() => setHoveredWordIndex(wIdx)}
                                    onMouseLeave={() => setHoveredWordIndex(null)}
                                    className={`inline cursor-pointer px-0.5 py-0.5 rounded transition-all duration-150 ${
                                      isSelected
                                        ? 'bg-emerald-100 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-600 underline decoration-emerald-600 decoration-2 underline-offset-4'
                                        : hoveredWordIndex === wIdx
                                        ? 'bg-emerald-50 text-emerald-900 underline decoration-emerald-500 decoration-1 underline-offset-4'
                                        : 'hover:bg-amber-50 hover:text-amber-950'
                                    }`}
                                    title={`Kliknij słowo «${coreToken}», aby zbadać w słowniku grecko-hebrajskim`}
                                  >
                                    {coreToken}
                                  </span>
                                ) : (
                                  <span>{coreToken}</span>
                                )}
                                {trailingPunct}{' '}
                              </span>
                            );
                          })}
                        </div>

                        {/* Clean hover action shortcuts - Simplified to 2 calm actions */}
                        <div className="shrink-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => playSingleVerse(verse.verseNum)}
                            className={`px-2 py-1 rounded-lg text-xs font-sans font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                              isVerseSpeaking
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}
                            title="Odsłuchaj ten werset (lektor)"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${isVerseSpeaking ? 'animate-pulse' : ''}`} />
                            <span className="text-[11px] font-semibold hidden md:inline">Odsłuchaj</span>
                          </button>

                          {onOpenFullScrutation && (
                            <button
                              type="button"
                              onClick={() => {
                                onOpenFullScrutation(verse.siglum, verse.text);
                              }}
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-[11px] font-sans font-semibold transition-colors cursor-pointer hidden sm:inline-block"
                              title="Skrutuj ten werset"
                            >
                              Skrutacja
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom clean summary */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100 gap-2 flex-wrap">
                <span className="text-stone-600">
                  Każdy werset rozpoczyna się od nowej linijki. Kliknij <strong className="text-amber-900">numer wersetu</strong>, aby otworzyć przypis, lub <strong className="text-emerald-900">słowo</strong>, aby zbadać rdzeń.
                </span>
                <span className="font-sans text-[11px] text-stone-400 font-medium">
                  {parsedVerses.length} {parsedVerses.length === 1 ? 'werset' : parsedVerses.length < 5 ? 'wersety' : 'wersetów'}
                </span>
              </div>
            </div>
          ) : polishLayoutMode === 'cards' ? (
            /* 2) UKŁAD: KARTY WERSETÓW (Studyjny: Biel, Zieleń, Złoto) */
            <div className="space-y-3">
              {parsedVerses.map((verse) => {
                const isVerseActive = activeVersePopup?.verseNum === verse.verseNum;
                const isVerseHighlighted = highlightedVerseNum === verse.verseNum;
                const isVerseSpeaking = currentAudioVerseNum === verse.verseNum && (isPlayingAudio || isPausedAudio);

                return (
                  <div
                    key={verse.verseNum}
                    id={`verse-card-${verse.verseNum}`}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                      isVerseSpeaking
                        ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-300 shadow-xs'
                        : isVerseActive || isVerseHighlighted
                        ? 'bg-amber-50/90 border-amber-400 ring-1 ring-amber-300 shadow-xs'
                        : 'bg-white hover:bg-stone-50/80 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Left column: Verse badge & Siglum */}
                      <div className="shrink-0 pt-0.5 text-center">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border font-sans font-bold text-xs sm:text-sm flex items-center justify-center shadow-2xs transition-colors ${
                          isVerseSpeaking
                            ? 'bg-emerald-800 border-emerald-900 text-white'
                            : 'bg-amber-50 border-amber-300/80 text-amber-950'
                        }`}>
                          {verse.verseNum}
                        </div>
                        <span className="text-[10px] text-stone-400 font-sans font-semibold block mt-1">
                          w. {verse.verseNum}
                        </span>
                      </div>

                      {/* Main column: Verse Text with interactive words */}
                      <div className="flex-1 space-y-2 min-w-0">
                        {verse.chapterHeader && (
                          <div className="text-xs font-sans font-bold text-emerald-900 uppercase tracking-wider mb-1">
                            {verse.chapterHeader}
                          </div>
                        )}

                        <p
                          className={`font-scripture ${
                            fontSize === 'normal'
                              ? 'text-base sm:text-lg leading-relaxed'
                              : fontSize === 'large'
                              ? 'text-lg sm:text-xl leading-relaxed'
                              : 'text-xl sm:text-2xl leading-loose'
                          } text-stone-900`}
                        >
                          {verse.words.map((token, wIdx) => {
                            const match = token.match(/^([«„"'(]*)(.*?)([.,;!?:»”"')—]*)$/);
                            const leadingPunct = match ? match[1] : '';
                            const coreToken = match ? match[2] : token;
                            const trailingPunct = match ? match[3] : '';
                            const isWord = /^[a-zęóąśłżźćńA-ZĘÓĄŚŁŻŹĆŃ0-9]+$/.test(coreToken);
                            const isSelected = isWord && selectedWord?.toLowerCase() === coreToken.toLowerCase();

                            return (
                              <span key={wIdx} className="inline">
                                {leadingPunct}
                                {isWord ? (
                                  <span
                                    onClick={() => handleWordClick(coreToken)}
                                    className={`inline cursor-pointer px-0.5 py-0.5 rounded transition-all duration-150 ${
                                      isSelected
                                        ? 'bg-emerald-100 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-500'
                                        : 'hover:bg-amber-50 hover:text-amber-950'
                                    }`}
                                    title={`Kliknij słowo «${coreToken}», aby sprawdzić grekę/hebrajski`}
                                  >
                                    {coreToken}
                                  </span>
                                ) : (
                                  <span>{coreToken}</span>
                                )}
                                {trailingPunct}{' '}
                              </span>
                            );
                          })}
                        </p>

                        {/* Bottom action bar of verse card */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                          <span className="font-serif text-[11px] font-bold text-stone-500">
                            {verse.siglum}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => playSingleVerse(verse.verseNum)}
                              className={`px-2.5 py-1 rounded-md font-sans font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                                isVerseSpeaking
                                  ? 'bg-emerald-800 text-white shadow-2xs'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                              }`}
                              title="Odsłuchaj ten werset na głos"
                            >
                              <Volume2 className={`w-3 h-3 ${isVerseSpeaking ? 'animate-pulse' : ''}`} />
                              <span>{isVerseSpeaking ? 'Czyta...' : 'Odsłuchaj'}</span>
                            </button>

                            {onOpenFullScrutation && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenFullScrutation(verse.siglum, verse.text);
                                }}
                                className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 font-sans font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                title="Rozpocznij skrutację tego wersetu"
                              >
                                <span>Skrutuj werset</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 3) UKŁAD: CIĄGŁY Z AKAPITAMI (Tradycyjny: Biel, Zieleń, Złoto) */
            <div className="p-5 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
              <div className="space-y-4">
                {verseParagraphs.map((paragraph, pIdx) => (
                  <div
                    key={pIdx}
                    className={`font-scripture ${
                      fontSize === 'normal'
                        ? 'text-base sm:text-lg leading-relaxed sm:leading-loose'
                        : fontSize === 'large'
                        ? 'text-lg sm:text-xl leading-relaxed sm:leading-loose'
                        : 'text-xl sm:text-2xl leading-loose'
                    } text-stone-900 text-justify space-y-1`}
                  >
                    {paragraph.verses.map((verse) => {
                      const isVerseActive = activeVersePopup?.verseNum === verse.verseNum;
                      const isVerseHovered = hoveredVerseNum === verse.verseNum;
                      const isVerseHighlighted = highlightedVerseNum === verse.verseNum;
                      const isVerseSpeaking = currentAudioVerseNum === verse.verseNum && (isPlayingAudio || isPausedAudio);

                      return (
                        <span
                          key={verse.verseNum}
                          className={`inline transition-colors duration-150 rounded px-0.5 py-0.5 ${
                            isVerseSpeaking
                              ? 'bg-emerald-50/90 ring-2 ring-emerald-600 shadow-2xs'
                              : isVerseActive || isVerseHighlighted
                              ? 'bg-amber-50/90 ring-1 ring-amber-400'
                              : isVerseHovered
                              ? 'bg-amber-50/50'
                              : ''
                          }`}
                        >
                          {verse.chapterHeader && (
                            <span className="block font-sans font-bold text-xs uppercase tracking-widest text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80 my-3 text-left">
                              {verse.chapterHeader}
                            </span>
                          )}

                          <span className="inline-block not-italic mr-1.5 select-none align-baseline">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVersePopup(activeVersePopup?.verseNum === verse.verseNum ? null : verse);
                              }}
                              onMouseEnter={() => setHoveredVerseNum(verse.verseNum)}
                              onMouseLeave={() => setHoveredVerseNum(null)}
                              className={`inline-flex items-center justify-center font-sans font-bold text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md transition-all cursor-pointer shadow-2xs ${
                                isVerseSpeaking
                                  ? 'bg-emerald-800 text-white shadow-xs scale-105 ring-2 ring-emerald-500'
                                  : isVerseActive
                                  ? 'bg-amber-600 text-white shadow-xs scale-105 ring-1 ring-amber-700'
                                  : isVerseHovered
                                  ? 'bg-amber-200 text-amber-950 scale-105'
                                  : 'bg-amber-50 text-amber-900 border border-amber-300/80 hover:bg-amber-200'
                              }`}
                              title={`Werset ${verse.verseNum} (${verse.siglum}) — Kliknij, aby zobaczyć przypis`}
                            >
                              {verse.verseNum}
                            </button>
                          </span>

                          {verse.words.map((token, wIdx) => {
                            const match = token.match(/^([«„"'(]*)(.*?)([.,;!?:»”"')—]*)$/);
                            const leadingPunct = match ? match[1] : '';
                            const coreToken = match ? match[2] : token;
                            const trailingPunct = match ? match[3] : '';
                            const isWord = /^[a-zęóąśłżźćńA-ZĘÓĄŚŁŻŹĆŃ0-9]+$/.test(coreToken);
                            const isSelected = isWord && selectedWord?.toLowerCase() === coreToken.toLowerCase();

                            return (
                              <span key={wIdx} className="inline">
                                {leadingPunct}
                                {isWord ? (
                                  <span
                                    onClick={() => handleWordClick(coreToken)}
                                    onMouseEnter={() => setHoveredWordIndex(wIdx)}
                                    onMouseLeave={() => setHoveredWordIndex(null)}
                                    className={`inline cursor-pointer px-0.5 py-0.5 rounded transition-all duration-150 ${
                                      isSelected
                                        ? 'bg-emerald-100 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-600 underline decoration-emerald-600 decoration-2 underline-offset-4'
                                        : hoveredWordIndex === wIdx
                                        ? 'bg-emerald-50 text-emerald-900 underline decoration-emerald-500 decoration-1 underline-offset-4'
                                        : 'hover:bg-amber-50 hover:text-amber-950'
                                    }`}
                                    title={`Kliknij słowo «${coreToken}», aby zbadać w słowniku grecko-hebrajskim`}
                                  >
                                    {coreToken}
                                  </span>
                                ) : (
                                  <span>{coreToken}</span>
                                )}
                                {trailingPunct}{' '}
                              </span>
                            );
                          })}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTNOTES & VERSIFICATION INDEX PANEL (Aparat wydania św. Pawła) */}
          {showVerseFootnotes && parsedVerses.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider text-amber-950 pb-2 border-b border-amber-200/60">
                <span className="flex items-center gap-1.5">
                  <BookMarked className="w-4 h-4 text-amber-700" />
                  Przypisy i odnośniki wersetowe ({siglum})
                </span>
                <span className="text-stone-500 text-[11px] font-sans font-normal">
                  {parsedVerses.length} wersetów
                </span>
              </div>

              <p className="text-xs text-stone-600 font-sans">
                Wybierz dowolny werset poniżej, aby otworzyć jego przypis i rozpocząć skrutację:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {parsedVerses.map((v) => (
                  <div
                    key={v.verseNum}
                    onClick={() => {
                      setActiveVersePopup(v);
                      setHighlightedVerseNum(v.verseNum);
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2 ${
                      activeVersePopup?.verseNum === v.verseNum || highlightedVerseNum === v.verseNum
                        ? 'bg-amber-50 border-amber-400 shadow-2xs ring-1 ring-amber-300'
                        : 'bg-white hover:bg-amber-50/50 border-stone-200'
                    }`}
                  >
                    <span className="shrink-0 w-6 h-6 rounded bg-amber-50 text-amber-950 font-bold font-sans flex items-center justify-center text-[11px] border border-amber-300/80">
                      {v.verseNum}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-amber-950 font-sans text-[11px] truncate">
                        {v.siglum}
                      </div>
                      <div className="font-scripture text-stone-700 italic truncate text-[11px]">
                        «{v.text}»
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. MODE: ORYGINAŁ (Greek / Hebrew / Vulgate) - White, Gold, Green */}
      {displayMode === 'oryginal' && (
        <div className="p-5 sm:p-7 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-6">
          {/* Primary Original Text (Greek or Hebrew) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-emerald-950 font-bold pb-1 border-b border-stone-200">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                {isOldTestament ? 'Tekst Masorecki (Biblia Hebraica Stuttgartensia)' : 'Novum Testamentum Graece (Nestle-Aland 28)'}
              </span>
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-serif text-[11px]">Tekst Natchniony</span>
            </div>

            {isLoadingOriginal && (
              <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-pulse">
                <RotateCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>Wczytywanie tekstu oryginalnego...</span>
              </div>
            )}

            <div 
              className={`p-4 sm:p-5 rounded-xl bg-amber-50/30 border border-amber-200/70 ${
                isOldTestament ? 'text-right font-serif text-2xl leading-loose' : 'font-serif text-xl sm:text-2xl leading-relaxed text-stone-900'
              }`}
              dir={isOldTestament ? 'rtl' : 'ltr'}
            >
              {activeOriginalText.split(' ').map((origWord, idx) => {
                const clean = origWord.replace(/[.,;·«»׃]/g, '');
                return (
                  <span
                    key={idx}
                    onClick={() => handleWordClick(clean)}
                    className="inline-block px-1.5 py-0.5 rounded cursor-pointer hover:bg-amber-100 hover:text-amber-950 transition-colors mx-0.5"
                    title={`Kliknij słowo "${clean}", aby zbadać w słowniku i konkordancji`}
                  >
                    {origWord}
                  </span>
                );
              })}
            </div>

            {/* Transliteration if available */}
            {activeTransliteration && (
              <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                <span className="text-[10px] font-sans uppercase font-bold text-stone-400 block mb-0.5">
                  Transliteracja fonetyczna:
                </span>
                <p className="font-mono text-xs text-stone-700 italic leading-relaxed">
                  {activeTransliteration}
                </p>
              </div>
            )}
          </div>

          {/* Latin Vulgate */}
          {activeLatinText && (
            <div className="space-y-1.5 pt-3 border-t border-stone-200">
              <div className="text-xs font-sans uppercase font-bold text-stone-700 flex items-center justify-between">
                <span>Biblia Sacra Vulgata (św. Hieronim):</span>
                <span className="text-stone-400 font-normal">Tradycja Zachodnia</span>
              </div>
              <p className="font-serif italic text-base text-stone-800 leading-relaxed bg-white p-3.5 rounded-xl border border-stone-200">
                {activeLatinText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. MODE: BILINGWISTYCZNY (Interlinear / Word-by-Word Analysis) */}
      {displayMode === 'bilingwistyczny' && (
        <div className="p-5 sm:p-7 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between text-xs font-sans uppercase font-bold text-stone-800 pb-2 border-b border-stone-200">
            <span className="flex items-center gap-1.5 text-emerald-950">
              <Layers className="w-4 h-4 text-emerald-800" />
              Układ Interlinearny (Słowo w słowo)
            </span>
            <span className="text-stone-500 font-normal">Kliknij blok, aby wyświetlić konkordancję</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {rawWords
              .map(w => w.replace(/^[«„"'(]+|[.,;!?:»”"')—]+$/g, ''))
              .filter(w => /^[a-zęóąśłżźćńA-ZĘÓĄŚŁŻŹĆŃ0-9]+$/.test(w))
              .map((word, wIdx) => {
              const previewLex = findBiblicalLexiconEntry(word, siglum);
              const isSelected = selectedWord?.toLowerCase() === word.toLowerCase();

              return (
                <div
                  key={wIdx}
                  onClick={() => handleWordClick(word)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-emerald-50/50 border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {previewLex.strongNumber}
                    </span>
                    <span className="text-[10px] text-stone-400 font-sans truncate">
                      {previewLex.originalLanguage.split(' ')[0]}
                    </span>
                  </div>

                  {/* Original script */}
                  <div className="font-serif text-base font-bold text-stone-900">
                    {previewLex.originalWord}
                  </div>

                  {/* Transliteration */}
                  <div className="font-mono text-[11px] text-stone-500 italic">
                    {previewLex.transliteration}
                  </div>

                  {/* Polish Translation */}
                  <div className="font-sans text-xs font-bold text-emerald-950 pt-1 border-t border-stone-100">
                    {word}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WORD LEXICON & SCRIPTURE OCCURRENCES DRAWER / MODAL - White, Green, Gold */}
      {selectedWord && lexiconData && (
        <div className="p-5 sm:p-7 rounded-3xl bg-white border-2 border-amber-300/90 shadow-md space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-sans font-bold bg-emerald-800 text-white uppercase tracking-wider shadow-2xs">
                  Słownik Stronga & Konkordancja
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950">
                  {lexiconData.strongNumber}
                </span>
                <span className="text-xs font-sans text-stone-600 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                  {lexiconData.originalLanguage}
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {lexiconData.originalWord}
                </h3>
                <span className="font-mono text-sm sm:text-base text-stone-500 italic">
                  ({lexiconData.transliteration})
                </span>
                <span className="font-sans text-lg sm:text-xl font-bold text-emerald-900">
                  = «{lexiconData.wordPolish}»
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedWord(null)}
              className="p-2 rounded-full bg-white hover:bg-stone-100 text-stone-400 hover:text-stone-700 border border-stone-200 transition-colors cursor-pointer shadow-2xs"
              title="Zamknij szczegóły słowa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Honest Status / Slow Loading Banner */}
          {isLoadingLexicon && lexiconStatus === 'slow_loading' && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center gap-3 text-xs font-sans">
              <Loader2 className="w-4 h-4 text-amber-700 animate-spin shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-amber-900">Trwa ładowanie pełnej filologicznej bazy konkordancji...</p>
                <p className="text-amber-800/90 text-[11px]">
                  Gdy serwer analizuje rdzeń wyrazu, wyświetlamy zweryfikowane wersety biblijne. Jeśli ładowanie przedłuża się, proszę spróbować ponownie za chwilę.
                </p>
              </div>
            </div>
          )}

          {isLoadingLexicon && lexiconStatus === 'loading' && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-xs font-sans">
              <Loader2 className="w-3.5 h-3.5 text-emerald-700 animate-spin shrink-0" />
              <span>Trwa weryfikacja wystąpień słowa w Piśmie Świętym...</span>
            </div>
          )}

          {/* Morphological & Lexical Meaning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <span className="text-[11px] font-sans uppercase tracking-wider text-stone-400 font-bold block">
                Część mowy & Znaczenie rdzenia:
              </span>
              <p className="text-xs font-mono font-semibold text-emerald-900">
                {lexiconData.partOfSpeech}
              </p>
              <p className="font-sans text-sm text-stone-800 leading-relaxed font-medium">
                {lexiconData.rootMeaning}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <span className="text-[11px] font-sans uppercase tracking-wider text-stone-400 font-bold block">
                Kontekst Teologiczny & Częstotliwość:
              </span>
              <p className="text-xs font-mono text-stone-500">
                {lexiconData.biblicalFrequency}
              </p>
              <p className="font-sans text-sm text-stone-700 leading-relaxed">
                {lexiconData.theologicalSignificance}
              </p>
            </div>
          </div>

          {/* Definition */}
          <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-1">
            <span className="text-[11px] font-sans uppercase tracking-wider text-amber-950 font-bold">
              Szczegółowa definicja biblijna:
            </span>
            <p className="font-serif text-sm text-stone-800 leading-relaxed italic">
              {lexiconData.detailedDefinition}
            </p>
          </div>

          {/* OCCURRENCES IN SCRIPTURE - The heart of Scrutatio by Word! */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-800" />
                <h4 className="font-sans text-sm uppercase tracking-wider font-bold text-stone-900">
                  Gdzie to słowo występuje w Piśmie Świętym? (Konkordancja tematyczna)
                </h4>
              </div>
              <span className="text-xs text-stone-500">
                Wybierz werset, aby kontynuować skrutację
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {lexiconData.occurrences.map((occ, oIdx) => (
                <div
                  key={oIdx}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-bold text-amber-950 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-300/80">
                        {occ.siglum}
                      </span>
                      <span className="text-[11px] font-sans text-stone-500 font-medium">
                        {occ.bookName} ({occ.testament})
                      </span>
                    </div>

                    <p className="font-scripture text-sm text-stone-900 leading-relaxed">
                      {occ.text.startsWith('«') ? occ.text : `«${occ.text}»`}
                    </p>

                    {occ.contextNote && (
                      <p className="text-[11px] font-sans text-stone-500 italic">
                        {occ.contextNote}
                      </p>
                    )}
                  </div>

                  {/* Action Button: Start Scrutation from this occurrence */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const cleanQuote = occ.text.startsWith('«') ? occ.text : `«${occ.text}»`;
                        handleCopy(`${occ.siglum}: ${cleanQuote}`);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-900 hover:bg-stone-50 transition-colors cursor-pointer"
                      title="Skopiuj werset"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectWordForScrutation) {
                          onSelectWordForScrutation(occ.siglum, occ.text, lexiconData.wordPolish);
                        } else if (onOpenFullScrutation) {
                          onOpenFullScrutation(occ.siglum, occ.text);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-sans font-bold bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ml-auto"
                    >
                      <span>Skrutuj ten werset</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
