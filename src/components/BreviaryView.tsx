import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sun, 
  Moon, 
  Sunset, 
  Sunrise, 
  Clock, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Share2, 
  Copy, 
  Check, 
  Maximize2, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck,
  Flame, 
  Church, 
  User, 
  Users,
  Scroll,
  ShieldAlert,
  HelpCircle,
  Calendar,
  Music,
  Play,
  Square,
  Pause,
  Eye,
  EyeOff,
  Bell,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { BREVIARY_OFFICE_SAMPLE, MARIAN_ANTIPHONS_COLLECTION } from '../data/breviaryData';
import { BreviaryHourType, BreviaryAudience, ScrutationSession, BreviaryPsalmItem } from '../types';
import { requestScreenWakeLock, releaseScreenWakeLock, isWakeLockSupported, playMonasticBellSound, playGregorianToneAudio } from '../utils/prayerTools';
import { PrayerToolsBar } from './PrayerToolsBar';

interface BreviaryViewProps {
  initialAudience?: BreviaryAudience;
  initialHour?: BreviaryHourType;
  onStartScrutationWithVerse?: (siglum: string, text: string) => void;
  onOpenPatristicView?: (siglum: string) => void;
  onSaveVerseToJournal?: (siglum: string, text: string, contextNote?: string) => void;
}

export const BreviaryView: React.FC<BreviaryViewProps> = ({
  initialAudience = 'lay',
  initialHour = 'laudes',
  onStartScrutationWithVerse,
  onOpenPatristicView,
  onSaveVerseToJournal
}) => {
  const [audience, setAudience] = useState<BreviaryAudience>(initialAudience);
  const [activeHour, setActiveHour] = useState<BreviaryHourType>(() => {
    const currentH = new Date().getHours();
    if (initialHour) return initialHour;
    if (currentH >= 5 && currentH < 9) return 'laudes';
    if (currentH >= 9 && currentH < 12) return audience === 'clergy' ? 'tercia' : 'daytime';
    if (currentH >= 12 && currentH < 15) return audience === 'clergy' ? 'sexta' : 'daytime';
    if (currentH >= 15 && currentH < 17) return audience === 'clergy' ? 'nona' : 'daytime';
    if (currentH >= 17 && currentH < 21) return 'vesperae';
    if (currentH >= 21 || currentH < 5) return 'completorium';
    return 'laudes';
  });

  const [fontSizeLevel, setFontSizeLevel] = useState<number>(1); // 0: standard, 1: medium, 2: large, 3: very large
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [savedVersesMap, setSavedVersesMap] = useState<Record<string, boolean>>({});
  const [selectedMarianAntiphon, setSelectedMarianAntiphon] = useState<string>('ant_sub_tuum');
  
  // Point 3: Ergonomic features - WakeLock & Auto-scroll & Meditation Silence Timer
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [autoScrollActive, setAutoScrollActive] = useState<boolean>(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<number>(2); // 1: Wolno, 2: Średnio, 3: Szybko
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  // Point 4: Audio features - Tone playing indicator & Monastic silence timer
  const [playingTone, setPlayingTone] = useState<string | null>(null);
  const [silenceTimerMinutes, setSilenceTimerMinutes] = useState<number | null>(null);
  const [silenceSecondsRemaining, setSilenceSecondsRemaining] = useState<number>(0);
  const silenceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const office = BREVIARY_OFFICE_SAMPLE;
  const currentHourData = office.hours[activeHour] || office.hours.laudes;

  // Toggle WakeLock
  const toggleWakeLock = async () => {
    if (wakeLockActive) {
      await releaseScreenWakeLock();
      setWakeLockActive(false);
    } else {
      const ok = await requestScreenWakeLock();
      if (ok) {
        setWakeLockActive(true);
      }
    }
  };

  // Cleanup WakeLock on unmount
  useEffect(() => {
    return () => {
      releaseScreenWakeLock();
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
    };
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (autoScrollActive) {
      const intervalMs = autoScrollSpeed === 1 ? 55 : autoScrollSpeed === 2 ? 38 : 22;
      autoScrollRef.current = setInterval(() => {
        window.scrollBy({ top: 1, behavior: 'auto' });
      }, intervalMs);
    } else {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    }
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [autoScrollActive, autoScrollSpeed]);

  // Silence meditation timer countdown
  const startSilenceTimer = (minutes: number) => {
    playMonasticBellSound('monastic_bell');
    setSilenceTimerMinutes(minutes);
    setSilenceSecondsRemaining(minutes * 60);

    if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);

    silenceIntervalRef.current = setInterval(() => {
      setSilenceSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
          playMonasticBellSound('monastic_bell');
          setSilenceTimerMinutes(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSilenceTimer = () => {
    if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
    setSilenceTimerMinutes(null);
    setSilenceSecondsRemaining(0);
  };

  // Play Gregorian Tone
  const handlePlayGregorianTone = (toneName: string) => {
    setPlayingTone(toneName);
    playGregorianToneAudio(toneName);
    setTimeout(() => {
      setPlayingTone(null);
    }, 3800);
  };

  // Save Verse to Journal Handler
  const handleSaveVerse = (siglum: string, text: string, contextTitle: string) => {
    if (onSaveVerseToJournal) {
      onSaveVerseToJournal(siglum, text, `Liturgia Godzin: ${currentHourData.name} (${contextTitle})`);
      setSavedVersesMap(prev => ({ ...prev, [siglum]: true }));
      setTimeout(() => {
        setSavedVersesMap(prev => ({ ...prev, [siglum]: false }));
      }, 3000);
    }
  };

  const handleCopyHourText = async () => {
    let fullText = `${currentHourData.name} (${currentHourData.latinName})\n`;
    fullText += `${office.formattedDate} • ${office.liturgicalCelebration}\n\n`;
    fullText += `HYMN:\n${currentHourData.hymn.title}\n${currentHourData.hymn.strophes.join('\n')}\n\n`;
    currentHourData.psalmody.forEach(p => {
      fullText += `PSALMODIA: ${p.siglum} - ${p.title}\nAntyfona: ${p.antiphon}\n${p.text}\n\n`;
    });
    fullText += `CZYTANIE: ${currentHourData.scriptureReading.siglum}\n${currentHourData.scriptureReading.text}\n\n`;
    if (currentHourData.evangelicalCanticle) {
      fullText += `${currentHourData.evangelicalCanticle.name} (${currentHourData.evangelicalCanticle.siglum})\n${currentHourData.evangelicalCanticle.text}\n\n`;
    }
    fullText += `MODLITWA KOŃCOWA:\n${currentHourData.closingPrayer}\n\n— Brewiarz z aplikacji Skrutacja Pisma Świętego`;

    try {
      await navigator.clipboard.writeText(fullText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const fontClasses = [
    'text-base leading-relaxed',       // 0: Normal
    'text-lg leading-loose',           // 1: Medium (Default for prayer comfort)
    'text-xl leading-[2.3rem]',        // 2: Large
    'text-2xl leading-[2.6rem]'        // 3: Extra Large
  ][fontSizeLevel];

  // Render psalm lines with highlighted pause markers (* and †)
  const renderFormattedPsalmText = (text: string) => {
    return text.split('\n').map((line, lIdx) => {
      if (!line.trim()) return <div key={lIdx} className="h-3" />;
      
      // Split with asterisks and crosses for sacred rhythm
      const parts = line.split(/(\*|†)/g);
      return (
        <div key={lIdx} className="py-0.5">
          {parts.map((p, pIdx) => {
            if (p === '*') {
              return (
                <span key={pIdx} className="text-amber-600 font-bold px-1.5 inline-block text-sm" title="Pauza / Średniówka psalmu (oddech i chwila ciszy)">
                  *
                </span>
              );
            }
            if (p === '†') {
              return (
                <span key={pIdx} className="text-rose-600 font-bold px-1.5 inline-block text-sm" title="Krzyżyk psalmu (krótka pauza bez opadania głosu)">
                  †
                </span>
              );
            }
            return <span key={pIdx}>{p}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-28">
      {/* Top Liturgical Gold Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 text-white border-b-2 border-amber-500/40 shadow-lg sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Title & Audience Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                  <Church className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-amber-100 flex items-center gap-2">
                    LITURGIA GODZIN
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-widest">
                    {audience === 'lay' ? 'Dla Świeckich i Rodzin' : 'Dla Duchownych i Zakonów'}
                  </span>
                </div>
                <p className="text-xs text-amber-200/80 font-sans flex items-center gap-1.5">
                  <span>{office.formattedDate}</span>
                  <span>•</span>
                  <span className="text-amber-300 font-medium">{office.liturgicalCelebration}</span>
                </p>
              </div>
            </div>

            {/* Controls: Mode Switcher & Tools */}
            <div className="flex items-center gap-2 flex-wrap self-start md:self-center">
              {/* Audience Pill Toggle */}
              <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-amber-500/30">
                <button
                  type="button"
                  onClick={() => {
                    setAudience('lay');
                    if (['tercia', 'sexta', 'nona'].includes(activeHour)) {
                      setActiveHour('daytime');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    audience === 'lay'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-amber-200/80 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Świeccy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAudience('clergy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    audience === 'clergy'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-amber-200/80 hover:text-white'
                  }`}
                >
                  <Church className="w-3.5 h-3.5" />
                  <span>Duchowni</span>
                </button>
              </div>

              {/* Point 3: Screen WakeLock Toggle */}
              <button
                type="button"
                onClick={toggleWakeLock}
                title={wakeLockActive ? 'Ekran stale włączony (aktywna blokada wygaszania)' : 'Włącz tryb modlitwy: nie wygaszaj ekranu'}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-sans font-semibold ${
                  wakeLockActive 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs' 
                    : 'bg-white/10 hover:bg-white/15 text-amber-200 border-amber-500/30'
                }`}
              >
                {wakeLockActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{wakeLockActive ? 'Ekran aktywny' : 'Czuwanie'}</span>
              </button>

              {/* Point 3: Auto-scroll Controller */}
              <div className="flex items-center rounded-xl bg-white/10 border border-amber-500/30 p-0.5">
                <button
                  type="button"
                  onClick={() => setAutoScrollActive(!autoScrollActive)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    autoScrollActive ? 'bg-amber-400 text-slate-950' : 'text-amber-200 hover:text-white'
                  }`}
                  title="Włącz płynne automatyczne przewijanie tekstu"
                >
                  {autoScrollActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Auto-scroll</span>
                </button>
                {autoScrollActive && (
                  <button
                    type="button"
                    onClick={() => setAutoScrollSpeed((prev) => (prev % 3) + 1)}
                    className="px-1.5 py-1 text-[10px] font-mono text-amber-300 font-bold hover:text-white cursor-pointer"
                    title="Zmień prędkość przewijania"
                  >
                    {autoScrollSpeed === 1 ? '1x' : autoScrollSpeed === 2 ? '2x' : '3x'}
                  </button>
                )}
              </div>

              {/* Point 4: Monastic Bell & Silence Timer Menu */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => playMonasticBellSound('monastic_bell')}
                  title="Uderz w dzwon monastyczny / Rozpocznij skupienie"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 border border-amber-500/30 transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>

              {/* Point 3: Quick Font Resizer */}
              <div className="flex items-center rounded-xl bg-white/10 border border-amber-500/30 p-0.5">
                <button
                  type="button"
                  onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
                  className="px-2 py-1 text-xs font-bold text-amber-200 hover:text-white cursor-pointer"
                  title="Mniejsza czcionka"
                >
                  A-
                </button>
                <span className="text-[10px] text-amber-400 font-mono px-1">
                  {['1x', '1.2x', '1.4x', '1.6x'][fontSizeLevel]}
                </span>
                <button
                  type="button"
                  onClick={() => setFontSizeLevel(Math.min(3, fontSizeLevel + 1))}
                  className="px-2 py-1 text-xs font-bold text-amber-200 hover:text-white cursor-pointer"
                  title="Większa czcionka"
                >
                  A+
                </button>
              </div>

              {/* Copy */}
              <button
                type="button"
                onClick={handleCopyHourText}
                title="Kopiuj tekst modlitwy"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Liturgical Hours Navigation Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 mt-2 border-t border-amber-500/20 custom-scrollbar">
            {audience === 'clergy' && (
              <button
                type="button"
                onClick={() => setActiveHour('invitatorium')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeHour === 'invitatorium'
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-white/5 text-amber-200/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wezwanie</span>
              </button>
            )}

            {audience === 'clergy' && (
              <button
                type="button"
                onClick={() => setActiveHour('lectionis')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeHour === 'lectionis'
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-white/5 text-amber-200/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Godzina Czytań</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveHour('laudes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeHour === 'laudes'
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-white/5 text-amber-200/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Sunrise className="w-3.5 h-3.5 text-amber-300" />
              <span>Jutrznia (Rano)</span>
            </button>

            {audience === 'lay' ? (
              <button
                type="button"
                onClick={() => setActiveHour('daytime')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeHour === 'daytime'
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-white/5 text-amber-200/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>W ciągu dnia</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveHour('tercia')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeHour === 'tercia'
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                      : 'bg-white/5 text-amber-200/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>Tercja (9:00)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHour('sexta')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeHour === 'sexta'
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                      : 'bg-white/5 text-amber-200/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>Seksta (12:00)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHour('nona')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeHour === 'nona'
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                      : 'bg-white/5 text-amber-200/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>Nona (15:00)</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setActiveHour('vesperae')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeHour === 'vesperae'
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-white/5 text-amber-200/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Sunset className="w-3.5 h-3.5 text-amber-300" />
              <span>Nieszpory (Wieczór)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveHour('completorium')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeHour === 'completorium'
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-white/5 text-amber-200/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              <span>Kompleta (Przed snem)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Point 4: Monastic Silence Banner when Active */}
      <AnimatePresence>
        {silenceTimerMinutes !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-900 text-emerald-100 border-b border-emerald-700 py-2.5 px-4 shadow-md sticky top-[102px] z-10"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold font-serif">Monastyczna chwila milczenia (Silentium):</span>
                <span className="font-mono text-emerald-200 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-600">
                  {Math.floor(silenceSecondsRemaining / 60)}:{(silenceSecondsRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <button
                type="button"
                onClick={cancelSilenceTimer}
                className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-sans text-xs font-semibold cursor-pointer"
              >
                Zakończ milczenie
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Prayer Parchment Sheet */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Prominent Prayer Tools Bar (Dzwony, Autoscroll, Blokada wygaszania ekranu) */}
        <div className="mb-8">
          <PrayerToolsBar inline={true} />
        </div>

        <article className="bg-white rounded-3xl border border-amber-900/15 shadow-xl p-6 sm:p-12 space-y-10 font-serif">
          
          {/* Header of the Hour */}
          <div className="text-center space-y-2 border-b-2 border-amber-800/20 pb-8">
            <span className="text-[11px] font-sans font-bold text-amber-800 tracking-[0.25em] uppercase block">
              {currentHourData.latinName}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {currentHourData.name}
            </h2>
            <p className="text-xs sm:text-sm font-sans text-amber-900/80 max-w-lg mx-auto italic">
              {currentHourData.description}
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-sans font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Pora: {currentHourData.recommendedTime}</span>
              </div>

              {/* Meditation Silence Trigger */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-sans font-medium">
                <Bell className="w-3 h-3 text-slate-500" />
                <span>Pauza ciszy:</span>
                <button
                  type="button"
                  onClick={() => startSilenceTimer(1)}
                  className="px-1.5 py-0.5 hover:bg-amber-100 text-amber-900 rounded font-bold cursor-pointer"
                  title="Rozpocznij 1 minutę ciszy medytacyjnej"
                >
                  1 min
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => startSilenceTimer(3)}
                  className="px-1.5 py-0.5 hover:bg-amber-100 text-amber-900 rounded font-bold cursor-pointer"
                  title="Rozpocznij 3 minuty ciszy medytacyjnej"
                >
                  3 min
                </button>
              </div>
            </div>
          </div>

          {/* Rubrics (Red Liturgical Guidelines) */}
          {currentHourData.rubrics && currentHourData.rubrics.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900 text-xs font-sans space-y-1">
              {currentHourData.rubrics.map((r, idx) => (
                <p key={idx} className="italic flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold not-italic">†</span>
                  <span>{r}</span>
                </p>
              ))}
            </div>
          )}

          {/* 1. Invocations / Werset początkowy */}
          {currentHourData.invocations && (
            <section className="space-y-2 border-b border-amber-200/60 pb-6 text-slate-800">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800 block">
                Rozpoczęcie
              </span>
              <p className="text-base sm:text-lg">
                <strong className="text-rose-800 mr-2 font-sans text-sm font-bold">K.</strong>
                {currentHourData.invocations.verse.replace('K. ', '')}
              </p>
              <p className="text-base sm:text-lg">
                <strong className="text-rose-800 mr-2 font-sans text-sm font-bold">W.</strong>
                {currentHourData.invocations.response.replace('W. ', '')}
              </p>
            </section>
          )}

          {/* Examination of Conscience (For Kompleta) */}
          {currentHourData.examinationOfConscience && (
            <section className="space-y-4 p-5 rounded-2xl bg-amber-50/50 border border-amber-300/50">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                Rachunek sumienia i Spowiedź powszechna
              </span>
              <p className="text-xs sm:text-sm font-sans text-slate-700 italic leading-relaxed">
                {currentHourData.examinationOfConscience.invitation}
              </p>
              <div className="p-4 rounded-xl bg-white border border-amber-200 text-sm sm:text-base leading-relaxed text-slate-800">
                <p className="mb-3">{currentHourData.examinationOfConscience.confiteor}</p>
                <p className="text-xs sm:text-sm font-sans text-rose-900 italic">
                  {currentHourData.examinationOfConscience.absolution}
                </p>
              </div>
            </section>
          )}

          {/* 2. Hymn */}
          <section className="space-y-4 border-b border-amber-200/60 pb-8">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800">
                Hymn
              </span>
              {currentHourData.hymn.latinTitle && (
                <span className="text-xs text-amber-700/80 font-sans italic">
                  {currentHourData.hymn.latinTitle}
                </span>
              )}
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {currentHourData.hymn.title}
            </h3>

            <div className={`space-y-4 ${fontClasses} text-slate-800 pl-4 sm:pl-6 border-l-2 border-amber-400`}>
              {currentHourData.hymn.strophes.map((strophe, idx) => (
                <p key={idx} className="whitespace-pre-line">
                  {strophe}
                </p>
              ))}
            </div>
          </section>

          {/* 3. Psalmody (Psałterz z kluczami chrystologicznymi i tonami gregoriańskimi) */}
          <section className="space-y-8 border-b border-amber-200/60 pb-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800 block">
                Psalmodia
              </span>
              <span className="text-[11px] font-sans text-slate-500 italic">
                * oznacza średniówkę (pauza i oddech w połowie wersetu)
              </span>
            </div>

            {currentHourData.psalmody.map((psalm, idx) => (
              <div key={psalm.id || idx} className="space-y-4 p-5 sm:p-7 rounded-2xl bg-[#FCFAF5] border border-amber-900/10 shadow-xs">
                {/* Header with Siglum & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-950 font-mono text-xs font-bold mr-2">
                      {psalm.siglum}
                    </span>
                    <h4 className="inline text-lg sm:text-xl font-bold text-slate-900">
                      {psalm.title}
                    </h4>
                    {psalm.latinTitle && (
                      <p className="text-xs text-slate-500 italic mt-0.5">{psalm.latinTitle}</p>
                    )}
                  </div>

                  {/* Actions Bar: Tone Audio, Journal, Scrutation */}
                  <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-center">
                    {/* Gregorian Tone Audio */}
                    {psalm.gregorianTone && (
                      <button
                        type="button"
                        onClick={() => handlePlayGregorianTone(psalm.gregorianTone || 'Ton II')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all cursor-pointer ${
                          playingTone === psalm.gregorianTone
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300/80'
                        }`}
                        title={`Odsłuchaj melodię chorałową (${psalm.gregorianTone})`}
                      >
                        <Music className="w-3.5 h-3.5" />
                        <span>{psalm.gregorianTone}</span>
                      </button>
                    )}

                    {/* Point 6: Save to Spiritual Journal */}
                    {onSaveVerseToJournal && (
                      <button
                        type="button"
                        onClick={() => handleSaveVerse(psalm.siglum, psalm.text, psalm.title)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 text-xs font-sans font-medium transition-all shadow-xs cursor-pointer"
                        title="Zapisz ten Psalm do mojego Dziennika Duchowego"
                      >
                        {savedVersesMap[psalm.siglum] ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Zapisano!</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5 text-amber-700" />
                            <span>Zapisz w Dzienniku</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Scrutatio Button for Psalm */}
                    {onStartScrutationWithVerse && (
                      <button
                        type="button"
                        onClick={() => onStartScrutationWithVerse(psalm.siglum, psalm.text)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 text-emerald-50 hover:bg-emerald-700 text-xs font-sans font-bold transition-all shadow-xs cursor-pointer"
                        title="Rozpocznij skrutację tego Psalmu"
                      >
                        <Scroll className="w-3.5 h-3.5 text-amber-300" />
                        <span>Skrutuj</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Point 5: Christological Context Key */}
                {psalm.christologicalKey && (
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 text-xs font-sans text-amber-950 flex items-start gap-2">
                    <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[10px] text-amber-900 block mb-0.5">
                        Klucz chrystologiczny (Tradycja monastyczna):
                      </span>
                      <p className="italic text-slate-800 leading-relaxed">
                        {psalm.christologicalKey}
                      </p>
                    </div>
                  </div>
                )}

                {/* Antiphon Start */}
                <div className="p-3 rounded-xl bg-amber-100/70 border-l-4 border-amber-600 text-amber-950 text-xs sm:text-sm font-sans font-semibold">
                  <span className="text-rose-800 mr-2 uppercase font-bold text-[10px]">Antyfona:</span>
                  {psalm.antiphon}
                </div>

                {/* Psalm Text with formatted pauses */}
                <div className={`space-y-1 ${fontClasses} text-slate-800 pl-2 leading-relaxed font-serif`}>
                  {renderFormattedPsalmText(psalm.text)}
                </div>

                {psalm.gloryBe && (
                  <p className="text-xs sm:text-sm font-sans text-slate-600 italic pt-2 border-t border-amber-100">
                    Chwała Ojcu i Synowi, i Duchowi Świętemu, jak była na początku, teraz i zawsze, i na wieki wieków. Amen.
                  </p>
                )}

                {/* Antiphon End */}
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900 text-xs font-sans italic border border-amber-200/50">
                  <span className="text-rose-800 mr-2 uppercase font-bold text-[10px] not-italic">Antyfona:</span>
                  {psalm.antiphon}
                </div>
              </div>
            ))}
          </section>

          {/* 4. Scripture Reading (Krótkie czytanie Słowa Bożego) */}
          <section className="space-y-4 border-b border-amber-200/60 pb-8">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800">
                Czytanie Słowa Bożego
              </span>
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                {currentHourData.scriptureReading.siglum}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-sans text-slate-500 italic">
              {currentHourData.scriptureReading.intro}
            </p>

            <div className={`p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-300/70 ${fontClasses} text-slate-900 font-scripture`}>
              „{currentHourData.scriptureReading.text}”
            </div>

            {/* Responsorium */}
            <div className="space-y-1 text-sm sm:text-base text-slate-800 pt-2 font-sans">
              <p>
                <strong className="text-rose-800 mr-2 font-bold text-xs">K.</strong>
                {currentHourData.scriptureReading.response.verse.replace('K. ', '')}
              </p>
              <p>
                <strong className="text-rose-800 mr-2 font-bold text-xs">W.</strong>
                {currentHourData.scriptureReading.response.response.replace('W. ', '')}
              </p>
            </div>

            {/* Quick Actions for Reading: Journal & Scrutatio */}
            <div className="pt-2 flex items-center justify-end gap-2 flex-wrap">
              {onSaveVerseToJournal && (
                <button
                  type="button"
                  onClick={() => handleSaveVerse(currentHourData.scriptureReading.siglum, currentHourData.scriptureReading.text, 'Krótkie czytanie')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-slate-800 text-xs font-sans font-bold border border-slate-300 transition-all shadow-xs cursor-pointer"
                  title="Zapisz ten werset do Dziennika Duchowego"
                >
                  {savedVersesMap[currentHourData.scriptureReading.siglum] ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Zapisano w Dzienniku!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-amber-700" />
                      <span>Zapisz w Dzienniku</span>
                    </>
                  )}
                </button>
              )}

              {onStartScrutationWithVerse && (
                <button
                  type="button"
                  onClick={() => onStartScrutationWithVerse(currentHourData.scriptureReading.siglum, currentHourData.scriptureReading.text)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-sans font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Scroll className="w-4 h-4 text-amber-300" />
                  <span>Rozpocznij skrutację tego Słowa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </section>

          {/* Patristic Reading (For Godzina Czytań in Clergy Mode) */}
          {currentHourData.patristicReading && (
            <section className="space-y-4 border-b border-amber-200/60 pb-8 p-6 rounded-2xl bg-sky-50/50 border border-sky-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                  Drugie Czytanie: Ojcowie Kościoła
                </span>
                <span className="text-xs font-sans text-sky-800 font-semibold">
                  {currentHourData.patristicReading.author}
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-bold text-sky-950">
                {currentHourData.patristicReading.title}
              </h4>
              <p className="text-xs font-sans text-slate-500 italic">
                {currentHourData.patristicReading.source}
              </p>

              <div className={`text-slate-800 ${fontClasses} leading-relaxed italic border-l-3 border-sky-400 pl-4 py-1`}>
                {currentHourData.patristicReading.text}
              </div>

              <div className="space-y-1 text-sm text-slate-800 pt-2 font-sans">
                <p>
                  <strong className="text-rose-800 mr-2 font-bold text-xs">K.</strong>
                  {currentHourData.patristicReading.response.verse.replace('K. ', '')}
                </p>
                <p>
                  <strong className="text-rose-800 mr-2 font-bold text-xs">W.</strong>
                  {currentHourData.patristicReading.response.response.replace('W. ', '')}
                </p>
              </div>
            </section>
          )}

          {/* 5. Evangelical Canticle (Kantyki Ewangeliczne: Benedictus / Magnificat / Nunc Dimittis) */}
          {currentHourData.evangelicalCanticle && (
            <section className="space-y-4 border-b border-amber-200/60 pb-8">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800">
                  Kantyk Ewangeliczny
                </span>
                <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                  {currentHourData.evangelicalCanticle.siglum}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentHourData.evangelicalCanticle.name}
              </h4>
              <p className="text-xs text-amber-800 font-sans italic">
                {currentHourData.evangelicalCanticle.latinIncipit}
              </p>

              {/* Antiphon */}
              <div className="p-3 rounded-xl bg-amber-200/60 border-l-4 border-amber-600 text-amber-950 text-xs sm:text-sm font-sans font-semibold">
                <span className="text-rose-800 mr-2 uppercase font-bold text-[10px]">Antyfona:</span>
                {currentHourData.evangelicalCanticle.antiphon}
              </div>

              {/* Canticle Text */}
              <div className={`space-y-3 ${fontClasses} text-slate-900 whitespace-pre-line pl-3 border-l-2 border-amber-400 font-scripture`}>
                {renderFormattedPsalmText(currentHourData.evangelicalCanticle.text)}
              </div>

              {/* Antiphon Repetition */}
              <div className="p-2.5 rounded-lg bg-amber-100/60 text-amber-950 text-xs font-sans italic">
                <span className="text-rose-800 mr-2 uppercase font-bold text-[10px] not-italic">Antyfona:</span>
                {currentHourData.evangelicalCanticle.antiphon}
              </div>
            </section>
          )}

          {/* 6. Intercessions (Prośby i modlitwa wstawiennicza) */}
          {currentHourData.intercessions && (
            <section className="space-y-4 border-b border-amber-200/60 pb-8">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800 block">
                Prośby
              </span>

              <p className="text-sm sm:text-base font-sans text-slate-700 italic">
                {currentHourData.intercessions.call}
              </p>

              <div className="space-y-3 pt-2 font-sans">
                {currentHourData.intercessions.intentions.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                    <p className="text-sm sm:text-base text-slate-800 font-medium">
                      {item.intention}
                    </p>
                    {item.response && (
                      <p className="text-xs sm:text-sm text-amber-900 font-bold italic pl-4">
                        {item.response}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. Ojcze Nasz */}
          {currentHourData.ourFather && (
            <section className="space-y-3 border-b border-amber-200/60 pb-8 text-center bg-amber-50/40 p-6 rounded-2xl border border-amber-200/60">
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-amber-900 block">
                Modlitwa Pańska
              </span>
              <div className={`max-w-xl mx-auto ${fontClasses} text-slate-900 leading-relaxed`}>
                Ojcze nasz, któryś jest w niebie, święć się imię Twoje; przyjdź królestwo Twoje; bądź wola Twoja jako w niebie, tak i na ziemi. Chleba naszego powszedniego daj nam dzisiaj; i odpuść nam nasze winy, jako i my odpuszczamy naszym winowajcom; i nie wódź nas na pokuszenie, ale nas zbaw ode złego. Amen.
              </div>
            </section>
          )}

          {/* 8. Closing Prayer (Modlitwa końcowa) */}
          <section className="space-y-3 border-b border-amber-200/60 pb-8">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800 block">
              Modlitwa końcowa
            </span>
            <div className={`p-5 rounded-2xl bg-amber-50 border border-amber-200 ${fontClasses} text-slate-900 leading-relaxed font-serif`}>
              <strong className="text-rose-800 font-sans text-xs uppercase block mb-2">Módlmy się:</strong>
              {currentHourData.closingPrayer}
            </div>
            <p className="text-xs sm:text-sm font-sans text-slate-600">
              <strong className="text-rose-800 mr-2 font-bold">K.</strong>
              Niech nas Pan błogosławi, broni od wszelkiego zła i doprowadzi do życia wiecznego.
              <br />
              <strong className="text-rose-800 mr-2 font-bold">W.</strong>
              Amen.
            </p>
          </section>

          {/* 9. Marian Antiphon (For Kompleta or general devotions) */}
          {(currentHourData.marianAntiphon || activeHour === 'completorium') && (
            <section className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white border border-blue-200 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Antyfona Maryjna na zakończenie dnia
                </span>
              </div>

              {/* Antiphon Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {MARIAN_ANTIPHONS_COLLECTION.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMarianAntiphon(m.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedMarianAntiphon === m.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-blue-900 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    {m.title}
                  </button>
                ))}
              </div>

              {(() => {
                const ant = MARIAN_ANTIPHONS_COLLECTION.find(a => a.id === selectedMarianAntiphon) || MARIAN_ANTIPHONS_COLLECTION[0];
                return (
                  <div className="space-y-3 pt-2">
                    <h5 className="font-serif text-lg font-bold text-blue-950">
                      {ant.title} <span className="text-xs text-blue-700 italic font-normal">({ant.latinTitle})</span>
                    </h5>
                    <div className={`whitespace-pre-line ${fontClasses} text-slate-800 leading-relaxed pl-3 border-l-2 border-blue-400`}>
                      {ant.polishText}
                    </div>
                  </div>
                );
              })()}
            </section>
          )}

        </article>
      </main>
    </div>
  );
};
