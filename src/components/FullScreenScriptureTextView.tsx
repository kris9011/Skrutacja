import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Minimize2, 
  RotateCw, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Sun, 
  Moon, 
  Scroll, 
  Eye, 
  EyeOff,
  Type,
  X
} from 'lucide-react';
import { requestScreenWakeLock, releaseScreenWakeLock } from '../utils/prayerTools';

export type ScriptureTheme = 'emerald' | 'night' | 'parchment';

interface FullScreenScriptureTextViewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;          // Main golden quote sentence (e.g. "Bo i Syn Człowieczy...")
  text: string;           // Full scripture passage
  siglum: string;         // e.g. "Mk 10, 45"
  bookName: string;       // e.g. "Ewangelia wg św. Marka"
  testament?: 'ST' | 'NT';
  theologicalContext?: string;
  onNextWord?: () => void;
  onStartScrutation?: () => void;
}

export const FullScreenScriptureTextView: React.FC<FullScreenScriptureTextViewProps> = ({
  isOpen,
  onClose,
  title,
  text,
  siglum,
  bookName,
  testament = 'NT',
  onNextWord,
  onStartScrutation
}) => {
  const [theme, setTheme] = useState<ScriptureTheme>('emerald');
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(2); // 0: mała, 1: średnia, 2: duża (domyślna), 3: monumentalna
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);

  // Clean quote text helper to prevent duplicate quotation marks
  const cleanQuote = (str: string): string => {
    if (!str) return '';
    return str
      .replace(/[«»]/g, '')
      .trim()
      .replace(/^[„"“”\s]+/, '')
      .replace(/[„"“”\s]+$/, '')
      .trim();
  };

  const cleanTitle = cleanQuote(title);
  const cleanPassage = cleanQuote(text);

  // Keyboard shortcut listener: ESC to close, Space / Right arrow for next word
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if ((e.key === ' ' || e.key === 'ArrowRight') && onNextWord) {
        // Prevent default spacebar page scrolling
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        onNextWord();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNextWord]);

  // Screen WakeLock management during full-screen contemplation
  useEffect(() => {
    if (isOpen) {
      requestScreenWakeLock().then(ok => {
        if (ok) setWakeLockActive(true);
      });
    } else {
      releaseScreenWakeLock();
      setWakeLockActive(false);
    }
    return () => {
      releaseScreenWakeLock();
    };
  }, [isOpen]);

  const toggleWakeLock = async () => {
    if (wakeLockActive) {
      await releaseScreenWakeLock();
      setWakeLockActive(false);
    } else {
      const ok = await requestScreenWakeLock();
      if (ok) setWakeLockActive(true);
    }
  };

  const handleCopy = async () => {
    const textToCopy = `„${cleanTitle}”\n\n„${cleanPassage}”\n(${siglum} - ${bookName})\n\n— Z aplikacji Skrutacja Pisma Świętego`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  // Theme styling definitions
  const themeStyles = {
    emerald: {
      bg: 'bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#022c22]',
      radialGlow: 'bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.22),transparent_65%)]',
      secondaryGlow: 'bg-[radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.25),transparent_60%)]',
      badge: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200',
      goldenTitle: 'bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 bg-clip-text text-transparent drop-shadow-md',
      softText: 'text-emerald-100/90 drop-shadow-xs',
      divider: 'border-amber-400/40',
      dividerIcon: 'text-amber-300',
      subtleSiglum: 'text-amber-300/80',
      controlsBg: 'bg-emerald-950/70 border-emerald-600/30 text-emerald-200',
      controlsActive: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
      buttonSecondary: 'bg-emerald-900/80 hover:bg-emerald-800/90 text-emerald-100 border-emerald-600/40'
    },
    night: {
      bg: 'bg-gradient-to-b from-[#05070e] via-[#0c1220] to-[#05070e]',
      radialGlow: 'bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.18),transparent_65%)]',
      secondaryGlow: 'bg-[radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.15),transparent_60%)]',
      badge: 'bg-slate-900/90 border-slate-700/60 text-slate-300',
      goldenTitle: 'bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text text-transparent drop-shadow-md',
      softText: 'text-slate-200/90 drop-shadow-xs',
      divider: 'border-amber-500/30',
      dividerIcon: 'text-amber-400',
      subtleSiglum: 'text-amber-400/80',
      controlsBg: 'bg-slate-900/80 border-slate-700/50 text-slate-300',
      controlsActive: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
      buttonSecondary: 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-100 border-slate-700/50'
    },
    parchment: {
      bg: 'bg-[#FAF6EE]',
      radialGlow: 'bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.12),transparent_70%)]',
      secondaryGlow: 'bg-[radial-gradient(circle_at_50%_80%,rgba(180,83,9,0.06),transparent_60%)]',
      badge: 'bg-amber-100/90 border-amber-300/80 text-amber-950',
      goldenTitle: 'text-amber-900 drop-shadow-xs',
      softText: 'text-stone-800',
      divider: 'border-amber-400/50',
      dividerIcon: 'text-amber-600',
      subtleSiglum: 'text-amber-800',
      controlsBg: 'bg-white/85 border-amber-300/60 text-stone-800 shadow-sm',
      controlsActive: 'bg-amber-200/70 text-amber-950 border-amber-400',
      buttonSecondary: 'bg-amber-100/80 hover:bg-amber-200/90 text-amber-950 border-amber-300/70 shadow-xs'
    }
  }[theme];

  // Font size scale for golden quote and passage
  const fontSizes = [
    { title: 'text-xl sm:text-2xl md:text-3xl', passage: 'text-base sm:text-lg md:text-xl' },
    { title: 'text-2xl sm:text-3xl md:text-4xl', passage: 'text-lg sm:text-xl md:text-2xl' },
    { title: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl', passage: 'text-xl sm:text-2xl md:text-3xl' },
    { title: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl', passage: 'text-2xl sm:text-3xl md:text-4xl' }
  ][fontSizeIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="fullscreen-scripture-view"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-0 z-[100] flex flex-col justify-between ${themeStyles.bg} overflow-y-auto custom-scrollbar select-none`}
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 16px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 16px, 20px)',
          paddingLeft: 'max(env(safe-area-inset-left, 0px) + 16px, 20px)',
          paddingRight: 'max(env(safe-area-inset-right, 0px) + 16px, 20px)',
        }}
      >
        {/* Soft Ambient Radiance in Background */}
        <div className={`absolute inset-0 ${themeStyles.radialGlow} pointer-events-none`} />
        <div className={`absolute inset-0 ${themeStyles.secondaryGlow} pointer-events-none`} />

        {/* TOP BAR: Minimalist, Floating, Elegant */}
        <header className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2.5 pb-2">
          {/* Siglum & Book Info Badge */}
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-bold shadow-xs ${themeStyles.badge}`}>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-mono">{siglum}</span>
              <span className="opacity-80 font-serif font-normal hidden sm:inline">• {bookName}</span>
            </div>

            <span className={`text-[11px] font-sans font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border hidden md:inline-flex ${themeStyles.badge}`}>
              {testament === 'NT' ? 'Nowy Testament' : 'Stary Testament'}
            </span>
          </div>

          {/* Right Controls: Theme, Font size, Wake lock, Exit */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme switcher */}
            <div className={`flex items-center p-1 rounded-xl border ${themeStyles.controlsBg}`}>
              <button
                type="button"
                onClick={() => setTheme('emerald')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${theme === 'emerald' ? themeStyles.controlsActive : 'hover:opacity-80'}`}
                title="Szmaragdowa zieleń (kontemplacja)"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-600 border border-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('night')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${theme === 'night' ? themeStyles.controlsActive : 'hover:opacity-80'}`}
                title="Głęboka noc (ciemny motyw)"
              >
                <Moon className="w-4 h-4 text-indigo-400" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('parchment')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${theme === 'parchment' ? themeStyles.controlsActive : 'hover:opacity-80'}`}
                title="Ciepły pergamin (jasny motyw)"
              >
                <Scroll className="w-4 h-4 text-amber-700" />
              </button>
            </div>

            {/* Font size adjustment */}
            <div className={`flex items-center p-1 rounded-xl border ${themeStyles.controlsBg}`}>
              <button
                type="button"
                onClick={() => setFontSizeIndex(prev => Math.max(0, prev - 1))}
                disabled={fontSizeIndex === 0}
                className="px-2 py-1 text-xs font-bold font-serif hover:opacity-80 disabled:opacity-30 cursor-pointer"
                title="Zmniejsz czcionkę"
              >
                A-
              </button>
              <div className="w-px h-3.5 bg-current opacity-20" />
              <button
                type="button"
                onClick={() => setFontSizeIndex(prev => Math.min(3, prev + 1))}
                disabled={fontSizeIndex === 3}
                className="px-2 py-1 text-xs font-bold font-serif hover:opacity-80 disabled:opacity-30 cursor-pointer"
                title="Zwiększ czcionkę"
              >
                A+
              </button>
            </div>

            {/* Screen Awake (WakeLock) Toggle */}
            <button
              type="button"
              onClick={toggleWakeLock}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${wakeLockActive ? themeStyles.controlsActive : themeStyles.controlsBg}`}
              title={wakeLockActive ? 'Ekran pozostaje włączony' : 'Włącz czuwanie ekranu'}
            >
              {wakeLockActive ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 opacity-70" />}
            </button>

            {/* Exit Full Screen Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-sans text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ml-1"
              title="Wyjdź z trybu pełnego ekranu (Esc)"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Wyjdź</span>
            </button>
          </div>
        </header>

        {/* MAIN TEXT AREA: Pure Sacred Word Centered in Space */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center my-auto py-8 sm:py-12 max-w-4xl mx-auto w-full px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={siglum + cleanTitle}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 sm:space-y-8 w-full"
            >
              {/* 1. Golden Quote (Zdanie wyjściowe) */}
              <div className="space-y-2 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-sans font-bold uppercase tracking-widest mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Słowo Życia • Rhema</span>
                </div>

                <blockquote className={`font-serif font-bold tracking-tight leading-snug sm:leading-snug ${fontSizes.title} ${themeStyles.goldenTitle} px-2`}>
                  „{cleanTitle}”
                </blockquote>
              </div>

              {/* 2. Sacred Subtle Divider */}
              <div className="flex items-center justify-center gap-3 opacity-60">
                <div className={`h-px w-16 sm:w-28 border-t ${themeStyles.divider}`} />
                <span className={`text-xs ${themeStyles.dividerIcon}`}>✦ ✟ ✦</span>
                <div className={`h-px w-16 sm:w-28 border-t ${themeStyles.divider}`} />
              </div>

              {/* 3. Full Passage Below (Miękką czcionką) */}
              <div className="max-w-3xl mx-auto px-2">
                <p className={`font-serif italic font-normal leading-relaxed sm:leading-loose ${fontSizes.passage} ${themeStyles.softText}`}>
                  „{cleanPassage}”
                </p>
              </div>

              {/* 4. Biblical Reference Signature */}
              <div className="pt-2">
                <p className={`font-serif text-sm sm:text-base font-semibold tracking-wide ${themeStyles.subtleSiglum}`}>
                  — {siglum} • {bookName}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* BOTTOM ACTION BAR: Subtle, Accessible, Non-intrusive */}
        <footer className="relative z-20 w-full max-w-3xl mx-auto pt-2 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center flex-wrap gap-2.5">
            {/* Draw Next Word button */}
            {onNextWord && (
              <button
                type="button"
                onClick={onNextWord}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-bold border flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs ${themeStyles.buttonSecondary}`}
              >
                <RotateCw className="w-4 h-4 text-amber-400" />
                <span>Kolejne Słowo</span>
              </button>
            )}

            {/* Copy verse */}
            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-bold border flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs ${themeStyles.buttonSecondary}`}
              title="Kopiuj tekst wersetu"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 opacity-80" />}
              <span>{isCopied ? 'Skopiowano!' : 'Kopiuj'}</span>
            </button>

            {/* Start Scrutation if callback provided */}
            {onStartScrutation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartScrutation();
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-sans font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer active:scale-95"
              >
                <span>Rozpocznij skrutację</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Discreet keyboard shortcuts help */}
          <p className="text-[10px] sm:text-xs opacity-50 font-sans tracking-wide text-center">
            Naciśnij <kbd className="px-1.5 py-0.5 rounded bg-black/20 border border-current/20 font-mono text-[10px]">Esc</kbd>, aby wyjść • <kbd className="px-1.5 py-0.5 rounded bg-black/20 border border-current/20 font-mono text-[10px]">Spacja</kbd> lub <kbd className="px-1.5 py-0.5 rounded bg-black/20 border border-current/20 font-mono text-[10px]">→</kbd> kolejne Słowo
          </p>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
