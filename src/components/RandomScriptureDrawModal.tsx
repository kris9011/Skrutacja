import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  RotateCw, 
  Copy, 
  Check, 
  ArrowRight, 
  X, 
  Flame, 
  Compass, 
  Share2, 
  Bookmark,
  Scroll,
  Feather
} from 'lucide-react';
import { RANDOM_SCRIPTURE_QUOTES } from '../data/randomScriptureQuotes';
import { RandomScriptureQuote, ScrutationSession } from '../types';

interface RandomScriptureDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartScrutationWithQuote: (session: ScrutationSession) => void;
  initialQuoteId?: string;
}

export const RandomScriptureDrawModal: React.FC<RandomScriptureDrawModalProps> = ({
  isOpen,
  onClose,
  onStartScrutationWithQuote,
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
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showFullContext, setShowFullContext] = useState<boolean>(true);

  // Trigger open animation when opened or quote changes
  useEffect(() => {
    if (isOpen) {
      setIsOpening(true);
      const timer = setTimeout(() => {
        setIsOpening(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDrawNew = () => {
    setIsOpening(true);
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * RANDOM_SCRIPTURE_QUOTES.length);
      // Ensure different quote
      if (RANDOM_SCRIPTURE_QUOTES[nextIndex].id === currentQuote.id && RANDOM_SCRIPTURE_QUOTES.length > 1) {
        nextIndex = (nextIndex + 1) % RANDOM_SCRIPTURE_QUOTES.length;
      }
      setCurrentQuote(RANDOM_SCRIPTURE_QUOTES[nextIndex]);
      setIsOpening(false);
    }, 450);
  };

  const handleCopyQuote = async () => {
    const textToCopy = `„${currentQuote.text}”\n(${currentQuote.siglum} - ${currentQuote.bookName})\n\nKontekst: ${currentQuote.theologicalContext}\n\n— Z aplikacji Skrutacja Pisma Świętego`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleStartScrutation = () => {
    const isNT = currentQuote.testament === 'NT';
    const newSession: ScrutationSession = {
      id: 'session_draw_' + Date.now(),
      title: `Słowo Boże: ${currentQuote.siglum}`,
      theme: currentQuote.title,
      initialSiglum: currentQuote.siglum,
      initialText: currentQuote.text,
      nodes: [
        {
          id: 'node_root',
          parentId: null,
          siglum: currentQuote.siglum,
          text: currentQuote.text,
          testament: isNT ? 'NT' : 'ST',
          crossReferenceReason: 'Natchnione Słowo wyjściowe z losowania',
          order: 0,
          isExpanded: true,
          createdAt: Date.now(),
          availableCrossReferences: currentQuote.crossReferencesPreview?.map(cr => ({
            siglum: cr.siglum,
            textPreview: cr.text,
            testament: cr.testament,
            relation: cr.relation
          }))
        }
      ],
      activeStep: 0,
      prayerNotes: {
        statio: 'Panie, wierzę, że to Słowo jest dziś skierowane osobiście do mojego serca.',
        invocatio: 'Duchu Święty, otwórz moje oczy, abym ujrzał cud Twojego Prawa.',
        lectio: currentQuote.text,
        meditatio: currentQuote.theologicalContext,
        oratio: '',
        contemplatio: '',
        actio: '',
        wordOfLife: currentQuote.siglum
      },
      durationSeconds: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onStartScrutationWithQuote(newSession);
    onClose();
  };

  if (!isOpen) return null;

  // Build a rich broader context description if none explicitly stored
  const broaderContextText = currentQuote.broaderContext || (
    currentQuote.testament === 'NT'
      ? `Fragment ten pochodzi z ${currentQuote.bookName}. W szerszym kontekście Ewangelii i Listów Apostolskich stanowi on kluczowe objawienie tajemnicy Królestwa Bożego oraz relacji Syna Bożego do człowieka. Przed tymi słowami autor ukazuje drogę uczniów, ich zmagania oraz powołanie do całkowitego zaufania Łasce. Werset ten wzywa do osobistej odpowiedzi wiary w konkrecie dzisiejszego dnia.`
      : `Werset z ${currentQuote.bookName} wpisuje się w historię Pierwszego Przymierza Boga z Jego ludem. W historycznym i teologicznym kontekście perykopy, Słowo to rozbrzmiewa jako obietnica wierności Jahwe pośród prób, wygnania lub pustyni. Wskazuje ono profetycznie na wypełnienie wszystkich Bożych obietnic w osobie Jezusa Chrystusa.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1C1712] via-[#16120E] to-[#0D0B08] text-amber-50 rounded-3xl border-2 border-amber-500/40 shadow-2xl overflow-hidden z-10 my-auto">
        {/* Decorative Golden Ornaments & Ambient Light */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/15 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-amber-900/40 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center text-slate-950 font-bold">
              <Scroll className="w-4 h-4 text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-100 tracking-wide flex items-center gap-2">
                  Losowanie Słowa Bożego
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  Rhema
                </span>
              </div>
              <p className="text-xs text-amber-200/70 font-sans">
                Natchnione Słowo na ten moment Twojego życia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-amber-200/80 hover:text-white transition-all cursor-pointer"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body with 3D Opening / Flipping Animation */}
        <div className="p-5 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {isOpening ? (
              <motion.div
                key="opening-anim"
                initial={{ opacity: 0, scale: 0.85, rotateX: 30 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: -20 }}
                transition={{ duration: 0.4 }}
                className="py-16 flex flex-col items-center justify-center space-y-4"
              >
                {/* Golden Animated Parchment Envelope Opening */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0], scale: [0.95, 1.05, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 shadow-[0_0_35px_rgba(245,158,11,0.4)] flex items-center justify-center"
                >
                  <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                    <Sparkles className="w-9 h-9 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                </motion.div>
                <p className="font-serif italic text-base text-amber-200 animate-pulse text-center">
                  Otwieranie natchnionego Słowa Pisma...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={currentQuote.id}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Visual Sacred Card / Pergamin */}
                <div className="relative rounded-2xl bg-gradient-to-b from-[#251F19] to-[#1A1510] p-6 sm:p-8 border border-amber-500/30 shadow-xl overflow-hidden space-y-5">
                  {/* Subtle watermarked cross in background */}
                  <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                    <svg className="w-48 h-48 text-amber-400 fill-current" viewBox="0 0 100 100">
                      <rect x="42" y="10" width="16" height="80" rx="3" />
                      <rect x="15" y="30" width="70" height="16" rx="3" />
                    </svg>
                  </div>

                  {/* 1. Prominent Siglum & Testament Badge */}
                  <div className="flex items-center justify-between flex-wrap gap-2.5 pb-4 border-b border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/50 font-mono text-base sm:text-lg font-bold shadow-inner">
                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {currentQuote.siglum}
                      </span>
                      <span className="text-xs font-sans text-amber-200/70 font-semibold">
                        • {currentQuote.bookName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-sans font-bold bg-white/5 text-amber-200 border border-amber-500/20">
                        {currentQuote.testament === 'NT' ? 'Nowy Testament' : 'Stary Testament'}
                      </span>
                    </div>
                  </div>

                  {/* 2. Main Bible Verse Text */}
                  <div className="space-y-2">
                    <h3 className="font-sans text-xs uppercase tracking-wider text-amber-400/80 font-bold">
                      {currentQuote.title}
                    </h3>
                    <div className="font-scripture text-lg sm:text-2xl text-amber-50 leading-relaxed sm:leading-loose tracking-wide italic border-l-3 border-amber-400 pl-4 py-1">
                      {currentQuote.text}
                    </div>
                  </div>

                  {/* 3. Szerszy Kontekst Biblijny i Teologiczny */}
                  <div className="pt-4 border-t border-amber-500/20 space-y-3 bg-amber-950/20 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-5 sm:p-6 rounded-b-2xl border-b border-amber-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-amber-300">
                          Szerszy kontekst biblijny i teologiczny
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowFullContext(!showFullContext)}
                        className="text-[11px] font-sans text-amber-400 hover:text-amber-300 underline cursor-pointer"
                      >
                        {showFullContext ? 'Zwiń' : 'Rozwiń'}
                      </button>
                    </div>

                    {showFullContext && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans"
                      >
                        <p className="bg-black/20 p-3.5 rounded-xl border border-amber-500/20">
                          <strong className="text-amber-300 block mb-1 font-serif text-sm">
                            Tło perykopy i orędzie teologiczne:
                          </strong>
                          {currentQuote.theologicalContext}
                        </p>

                        <p className="text-amber-200/80 italic">
                          {broaderContextText}
                        </p>

                        {/* Parallel Verses Preview */}
                        {currentQuote.crossReferencesPreview && currentQuote.crossReferencesPreview.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] font-bold text-amber-400 block mb-1.5 uppercase tracking-wide">
                              Powiązane wersety (odnośniki):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {currentQuote.crossReferencesPreview.map((cr, idx) => (
                                <div
                                  key={idx}
                                  className="p-2.5 rounded-lg bg-black/30 border border-amber-500/20 space-y-1"
                                >
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-mono font-bold text-amber-300">{cr.siglum}</span>
                                    <span className="text-[10px] text-amber-400/80">{cr.relation}</span>
                                  </div>
                                  <p className="text-[11px] text-amber-100/80 italic line-clamp-2">
                                    «{cr.text}»
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDrawNew}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 hover:text-white text-xs font-sans font-bold border border-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
                    >
                      <RotateCw className="w-4 h-4 text-amber-400" />
                      <span>Losuj inne Słowo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyQuote}
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 hover:text-white text-xs font-sans font-bold border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                      title="Kopiuj werset z odnośnikami"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                      <span className="hidden sm:inline">{isCopied ? 'Skopiowano!' : 'Kopiuj'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartScrutation}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs sm:text-sm font-sans font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-500/25 cursor-pointer active:scale-95"
                  >
                    <span>Rozpocznij skrutację tego Słowa</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
