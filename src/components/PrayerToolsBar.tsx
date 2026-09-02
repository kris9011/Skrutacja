import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Play, 
  Pause, 
  Eye, 
  EyeOff, 
  Volume2, 
  Sparkles, 
  Clock, 
  X, 
  ChevronUp, 
  ChevronDown,
  Sliders
} from 'lucide-react';
import { requestScreenWakeLock, releaseScreenWakeLock, isWakeLockSupported, playMonasticBellSound } from '../utils/prayerTools';

interface PrayerToolsBarProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

export const PrayerToolsBar: React.FC<PrayerToolsBarProps> = ({
  isOpen = true,
  onClose,
  inline = false
}) => {
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [wakeLockSupported] = useState<boolean>(() => isWakeLockSupported());
  const [autoScrollActive, setAutoScrollActive] = useState<boolean>(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<number>(2); // 1: Wolno, 2: Średnio, 3: Szybko
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const [bellPlaying, setBellPlaying] = useState<boolean>(false);
  const [silenceTimerMinutes, setSilenceTimerMinutes] = useState<number | null>(null);
  const [silenceSecondsRemaining, setSilenceSecondsRemaining] = useState<number>(0);
  const silenceIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Auto-scroll loop
  useEffect(() => {
    if (autoScrollActive) {
      const intervalMs = autoScrollSpeed === 1 ? 55 : autoScrollSpeed === 2 ? 36 : 20;
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

  // Silence Timer
  const handleStartSilence = (minutes: number) => {
    setBellPlaying(true);
    playMonasticBellSound('monastic_bell');
    setTimeout(() => setBellPlaying(false), 3000);

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

  const handleStopSilence = () => {
    if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
    setSilenceTimerMinutes(null);
    setSilenceSecondsRemaining(0);
  };

  const handleStrikeBell = (type: 'monastic_bell' | 'singing_bowl' = 'monastic_bell') => {
    setBellPlaying(true);
    playMonasticBellSound(type);
    setTimeout(() => setBellPlaying(false), 3000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseScreenWakeLock();
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
    };
  }, []);

  const content = (
    <div className={`w-full ${inline ? 'bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 shadow-sm' : 'bg-slate-900/95 text-white backdrop-blur-md border-y border-amber-500/40 px-4 py-3 shadow-2xl'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header row inside panel */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className={`font-serif text-sm sm:text-base font-bold tracking-tight ${inline ? 'text-amber-950' : 'text-amber-100'}`}>
                Przybornik Modlitewny & Tryb Skupienia
              </h3>
              <p className={`text-[11px] font-sans ${inline ? 'text-amber-800/80' : 'text-amber-300/70'}`}>
                Dzwony monastyczne • Płynny auto-scroll • Blokada wygaszania ekranu (czuwanie)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {silenceTimerMinutes !== null && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-800/90 border border-emerald-500 text-emerald-100 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Cisza: {Math.floor(silenceSecondsRemaining / 60)}:{(silenceSecondsRemaining % 60).toString().padStart(2, '0')}</span>
                <button
                  type="button"
                  onClick={handleStopSilence}
                  className="ml-1.5 text-emerald-300 hover:text-white text-[10px] uppercase font-sans cursor-pointer underline"
                >
                  Zatrzymaj
                </button>
              </div>
            )}

            {onClose && !inline && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-amber-300 hover:text-white transition-colors cursor-pointer"
                title="Zamknij przybornik"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* 1. DZWONY MONASTYCZNE & CHWILA MILCZENIA */}
          <div className={`p-3 rounded-xl border flex flex-col justify-between ${inline ? 'bg-white border-amber-200 shadow-xs' : 'bg-white/5 border-amber-500/20'}`}>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 ${inline ? 'text-amber-900' : 'text-amber-300'}`}>
                  <Bell className="w-3.5 h-3.5" />
                  Dzwony Monastyczne
                </span>
                {bellPlaying && (
                  <span className="text-[10px] text-amber-400 animate-pulse font-mono font-bold">BRZMI...</span>
                )}
              </div>
              <p className={`text-[11px] leading-relaxed mb-2.5 ${inline ? 'text-slate-600' : 'text-slate-300'}`}>
                Głęboki dźwięk klasztornego dzwonu wprowadza w skupienie i obecność Bożą.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStrikeBell('monastic_bell')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-sans font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Uderz w dzwon</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStrikeBell('singing_bowl')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-sans font-medium border transition-all cursor-pointer ${inline ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300' : 'bg-white/10 hover:bg-white/15 text-amber-200 border-amber-500/30'}`}
                  title="Ciepła misa tybetańska / gong modlitewny"
                >
                  Misa
                </button>
              </div>

              {/* Minutnik ciszy */}
              <div className="flex items-center gap-1 text-[11px] pt-1">
                <span className={`font-medium ${inline ? 'text-slate-600' : 'text-slate-400'}`}>Minutnik ciszy:</span>
                <button
                  type="button"
                  onClick={() => handleStartSilence(1)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${inline ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : 'bg-white/10 hover:bg-white/20 text-amber-300'}`}
                >
                  1 min
                </button>
                <button
                  type="button"
                  onClick={() => handleStartSilence(3)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${inline ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : 'bg-white/10 hover:bg-white/20 text-amber-300'}`}
                >
                  3 min
                </button>
                <button
                  type="button"
                  onClick={() => handleStartSilence(5)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${inline ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : 'bg-white/10 hover:bg-white/20 text-amber-300'}`}
                >
                  5 min
                </button>
              </div>
            </div>
          </div>

          {/* 2. PŁYNNY AUTO-SCROLL */}
          <div className={`p-3 rounded-xl border flex flex-col justify-between ${inline ? 'bg-white border-amber-200 shadow-xs' : 'bg-white/5 border-amber-500/20'}`}>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 ${inline ? 'text-amber-900' : 'text-amber-300'}`}>
                  <Play className="w-3.5 h-3.5" />
                  Auto-Scroll (Przewijanie)
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${autoScrollActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'text-slate-400'}`}>
                  {autoScrollActive ? 'AKTYWNY' : 'ZATRZYMANY'}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed mb-2.5 ${inline ? 'text-slate-600' : 'text-slate-300'}`}>
                Automatycznie przesuwa modlitwę w dół, by modlić się bez ciągłego dotykania ekranu.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoScrollActive(!autoScrollActive)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-sans font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                  autoScrollActive
                    ? 'bg-amber-400 text-slate-950 font-extrabold'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {autoScrollActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{autoScrollActive ? 'Pauza przewijania' : 'Uruchom przewijanie'}</span>
              </button>

              <div className="flex items-center rounded-lg border border-amber-500/30 overflow-hidden bg-white/5">
                {[1, 2, 3].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setAutoScrollSpeed(speed)}
                    className={`px-2 py-1 text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                      autoScrollSpeed === speed
                        ? 'bg-amber-500 text-slate-950'
                        : inline ? 'text-amber-900 hover:bg-amber-100' : 'text-amber-200 hover:bg-white/10'
                    }`}
                    title={`Prędkość ${speed}x`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. BLOKADA WYGASZANIA EKRANU (WAKE LOCK) */}
          <div className={`p-3 rounded-xl border flex flex-col justify-between ${inline ? 'bg-white border-amber-200 shadow-xs' : 'bg-white/5 border-amber-500/20'}`}>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 ${inline ? 'text-amber-900' : 'text-amber-300'}`}>
                  {wakeLockActive ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                  Czuwanie Ekranu
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  wakeLockActive 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' 
                    : 'text-slate-400'
                }`}>
                  {wakeLockActive ? 'NIE WYGASZAJ' : 'DOMYŚLNE'}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed mb-2.5 ${inline ? 'text-slate-600' : 'text-slate-300'}`}>
                Zapobiega wyłączeniu lub ściemnieniu ekranu telefonu/komputera podczas czytania.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={toggleWakeLock}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-sans font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                  wakeLockActive
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : inline ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-white/15 hover:bg-white/20 text-amber-200 border border-amber-500/40'
                }`}
              >
                {wakeLockActive ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-white" />
                    <span>Ekran czuwa (kliknij by wyłączyć)</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Włącz: Nie wygaszaj ekranu</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -25 }}
          transition={{ duration: 0.2 }}
          className="sticky top-[102px] z-30 w-full"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
