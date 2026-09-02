import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCw, 
  X, 
  Sparkles
} from 'lucide-react';
import { RANDOM_SCRIPTURE_QUOTES } from '../data/randomScriptureQuotes';
import { RandomScriptureQuote, ScrutationSession } from '../types';
import { getAquinasCommentaryForQuote } from '../data/aquinasCommentariesDatabase';

interface RandomScriptureDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartScrutationWithQuote?: (session: ScrutationSession) => void;
  initialQuoteId?: string;
}

export const RandomScriptureDrawModal: React.FC<RandomScriptureDrawModalProps> = ({
  isOpen,
  onClose,
  initialQuoteId
}) => {
  const [currentQuote, setCurrentQuote] = useState<RandomScriptureQuote>(() => {
    if (initialQuoteId) {
      const found = RANDOM_SCRIPTURE_QUOTES.find(q => q.id === initialQuoteId);
      if (found) return found;
    }
    const rndIdx = Math.floor(Math.random() * RANDOM_SCRIPTURE_QUOTES.length);
    return RANDOM_SCRIPTURE_QUOTES[rndIdx];
  });

  const [isOpening, setIsOpening] = useState<boolean>(true);

  // Retrieve guaranteed authentic, unique St. Thomas Aquinas commentary for current quote
  const aquinasCommentary = useMemo(() => {
    return getAquinasCommentaryForQuote(currentQuote.siglum, currentQuote.id, currentQuote.text);
  }, [currentQuote.siglum, currentQuote.id, currentQuote.text]);

  // Trigger open animation when opened or quote changes
  useEffect(() => {
    if (isOpen) {
      setIsOpening(true);
      const timer = setTimeout(() => {
        setIsOpening(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDrawNew = () => {
    setIsOpening(true);
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * RANDOM_SCRIPTURE_QUOTES.length);
      if (RANDOM_SCRIPTURE_QUOTES[nextIndex].id === currentQuote.id && RANDOM_SCRIPTURE_QUOTES.length > 1) {
        nextIndex = (nextIndex + 1) % RANDOM_SCRIPTURE_QUOTES.length;
      }
      setCurrentQuote(RANDOM_SCRIPTURE_QUOTES[nextIndex]);
      setIsOpening(false);
    }, 200);
  };

  const cleanQuoteText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/[«»]/g, '')
      .trim()
      .replace(/^[„"“”\s]+/, '')
      .replace(/[„"“”\s]+$/, '')
      .trim();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#FAF8F5] text-slate-900 rounded-2xl border border-amber-200/80 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
        {/* Top Header - Minimalist */}
        <div className="px-6 py-4 border-b border-amber-200/50 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-amber-950">
              Słowo Boże
            </span>
            <span className="text-xs text-amber-800/80 font-serif italic">
              • {currentQuote.siglum}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-black/5 transition-colors cursor-pointer"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: SAM TEKST */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {isOpening ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-amber-600 animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key={currentQuote.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. Tekst Pisma Świętego */}
                <div className="space-y-2">
                  <div className="text-xs font-serif italic text-amber-800">
                    {currentQuote.bookName} ({currentQuote.siglum})
                  </div>
                  <blockquote className="font-serif text-xl sm:text-2xl text-slate-900 leading-relaxed font-semibold">
                    „{cleanQuoteText(currentQuote.text || currentQuote.title)}”
                  </blockquote>
                </div>

                {/* Subtelny separator */}
                <div className="border-t border-amber-200/70" />

                {/* 2. Komentarz św. Tomasza z Akwinu - Czysty tekst */}
                <div className="space-y-2.5">
                  <div className="text-xs font-sans font-bold uppercase tracking-wider text-amber-900 flex items-center justify-between flex-wrap gap-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>Św. Tomasz z Akwinu</span>
                      {aquinasCommentary?.workTitle && (
                        <span className="font-normal lowercase font-serif italic text-amber-800/90">
                          ({aquinasCommentary.workTitle})
                        </span>
                      )}
                    </div>
                    {aquinasCommentary?.theologicalSense && (
                      <span className="text-[11px] font-sans font-medium text-amber-900/70 bg-amber-100/70 border border-amber-200/50 px-2 py-0.5 rounded-full">
                        {aquinasCommentary.theologicalSense}
                      </span>
                    )}
                  </div>

                  <p className="font-serif text-base sm:text-lg text-slate-800 leading-relaxed italic">
                    {aquinasCommentary?.polishTranslation}
                  </p>

                  {aquinasCommentary?.spiritualInsight && (
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1.5 border-l-2 border-amber-300 pl-3">
                      <span className="font-sans font-semibold text-amber-950 text-[11px] uppercase tracking-wide block mb-0.5">Sens duchowy:</span>
                      {aquinasCommentary.spiritualInsight}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimal Action: Tylko "Losuj kolejne Słowo" i proste zamknięcie */}
        <div className="px-6 py-4 bg-amber-50/60 border-t border-amber-200/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDrawNew}
            className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-sans text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <RotateCw className="w-4 h-4" />
            <span>Losuj inne Słowo</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-sans font-medium transition-colors cursor-pointer"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
