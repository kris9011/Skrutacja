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

  const cleanQuoteText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/[«»]/g, '')
      .trim()
      .replace(/^[„"“”\s]+/, '')
      .replace(/[„"“”\s]+$/, '')
      .trim();
  };

  const handleCopyQuote = async () => {
    const quoteSentence = cleanQuoteText(currentQuote.title);
    const fullPassage = cleanQuoteText(currentQuote.text);
    const textToCopy = `„${quoteSentence}”\n\n„${fullPassage}”\n(${currentQuote.siglum} - ${currentQuote.bookName})\n\nKontekst: ${currentQuote.theologicalContext}\n\n— Z aplikacji Skrutacja Pisma Świętego`;
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
    const cleaned = cleanQuoteText(currentQuote.text);
    const newSession: ScrutationSession = {
      id: 'session_draw_' + Date.now(),
      title: `Słowo Boże: ${currentQuote.siglum}`,
      theme: currentQuote.title,
      initialSiglum: currentQuote.siglum,
      initialText: cleaned,
      nodes: [
        {
          id: 'node_root',
          parentId: null,
          siglum: currentQuote.siglum,
          text: cleaned,
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
        lectio: cleaned,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
        {/* Top Header - Pure Crisp Light theme with Emerald and Gold accents */}
        <div className="bg-white border-b border-slate-200 p-4 sm:p-5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white p-2 shadow-sm flex items-center justify-center font-bold">
              <Scroll className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 tracking-wide flex items-center gap-2">
                  Losowanie Słowa Bożego
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                  Rhema
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Natchnione Słowo na ten moment Twojego życia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body with 3D Opening / Flipping Animation */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar bg-slate-50">
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
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 shadow-md flex items-center justify-center"
                >
                  <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                    <Sparkles className="w-9 h-9 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                </motion.div>
                <p className="font-serif italic text-base text-emerald-900 font-semibold animate-pulse text-center">
                  Otwieranie natchnionego Słowa Pisma...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={currentQuote.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                {/* Visual Sacred Card / Pergamin */}
                <div className="relative rounded-2xl bg-white p-5 sm:p-7 border border-slate-200 shadow-sm overflow-hidden space-y-5">
                  {/* 1. Prominent Siglum & Testament Badge */}
                  <div className="flex items-center justify-between flex-wrap gap-2.5 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-950 border border-amber-300 font-mono text-base sm:text-lg font-bold shadow-xs">
                        <Flame className="w-4 h-4 text-amber-600 fill-amber-600" />
                        {currentQuote.siglum}
                      </span>
                      <span className="text-xs font-sans text-slate-600 font-semibold">
                        • {currentQuote.bookName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-sans font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {currentQuote.testament === 'NT' ? 'Nowy Testament' : 'Stary Testament'}
                      </span>
                    </div>
                  </div>

                  {/* 2. Main Bible Verse & Passage Presentation */}
                  <div className="space-y-3.5">
                    {/* Zdanie powyżej cytatu - piękny cytat w złotych literach z cudzysłowem */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-700">
                          Słowo Życia • Rhema
                        </span>
                      </div>
                      <blockquote className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-800 sm:text-amber-900 leading-snug drop-shadow-xs">
                        „{cleanQuoteText(currentQuote.title)}”
                      </blockquote>
                    </div>

                    {/* Poniżej cały fragment - również ładnie, ale miększą czcionką */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 border-l-4 border-l-amber-500 shadow-xs relative">
                      <p className="font-serif text-base sm:text-lg text-slate-700 sm:text-slate-800 leading-relaxed italic font-normal">
                        „{cleanQuoteText(currentQuote.text)}”
                      </p>
                    </div>
                  </div>

                  {/* 3. Szerszy Kontekst Biblijny i Teologiczny */}
                  <div className="pt-4 border-t border-slate-100 space-y-3 bg-[#FAF8F5] -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-5 sm:p-6 rounded-b-2xl border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-700" />
                        <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-emerald-950">
                          Szerszy kontekst biblijny i teologiczny
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowFullContext(!showFullContext)}
                        className="text-xs font-sans text-emerald-800 hover:text-emerald-950 font-semibold underline cursor-pointer"
                      >
                        {showFullContext ? 'Zwiń' : 'Rozwiń'}
                      </button>
                    </div>

                    {showFullContext && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans"
                      >
                        <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs">
                          <strong className="text-emerald-900 block mb-1 font-serif text-sm font-bold">
                            Tło perykopy i orędzie teologiczne:
                          </strong>
                          <p className="text-slate-800">
                            {currentQuote.theologicalContext}
                          </p>
                        </div>

                        <p className="text-slate-700 italic px-1">
                          {broaderContextText}
                        </p>

                        {/* Parallel Verses Preview */}
                        {currentQuote.crossReferencesPreview && currentQuote.crossReferencesPreview.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] font-bold text-emerald-900 block mb-2 uppercase tracking-wide">
                              Powiązane wersety (odnośniki w skrutacji):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {currentQuote.crossReferencesPreview.map((cr, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1 hover:border-emerald-300 transition-colors"
                                >
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-mono font-bold text-emerald-800">{cr.siglum}</span>
                                    <span className="text-[10px] text-amber-900 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">{cr.relation}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-700 italic line-clamp-2">
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDrawNew}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-sans font-bold border border-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
                    >
                      <RotateCw className="w-4 h-4 text-emerald-700" />
                      <span>Losuj inne Słowo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyQuote}
                      className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-sans font-bold border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                      title="Kopiuj werset z odnośnikami"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                      <span className="hidden sm:inline">{isCopied ? 'Skopiowano!' : 'Kopiuj'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartScrutation}
                    className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-emerald-700/20 cursor-pointer active:scale-95"
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
