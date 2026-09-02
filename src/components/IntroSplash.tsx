import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Scroll, 
  Church, 
  Users, 
  Flame, 
  BookOpen, 
  Compass,
  Sunrise
} from 'lucide-react';

export type IntroChoice = 'scrutation' | 'breviary_clergy' | 'breviary_lay' | 'draw_word';

interface IntroSplashProps {
  onSelectChoice: (choice: IntroChoice) => void;
  onDismiss?: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ 
  onSelectChoice, 
  onDismiss 
}) => {
  return (
    <AnimatePresence>
      <motion.div
        id="intro-splash-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#022c22] text-white select-none overflow-y-auto px-4 py-6 sm:py-8 custom-scrollbar"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px) + 16px, 20px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 20px, 24px)',
          paddingLeft: 'max(env(safe-area-inset-left, 0px) + 16px, 16px)',
          paddingRight: 'max(env(safe-area-inset-right, 0px) + 16px, 16px)'
        }}
      >
        {/* Ambient Golden & Emerald Soft Radial Halo Light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(245,158,11,0.22),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.25),transparent_65%)] pointer-events-none" />

        {/* Top Header Section with Animated Holy Spirit Dove */}
        <div className="w-full max-w-4xl flex flex-col items-center text-center relative z-10 pt-2 sm:pt-4">
          
          {/* Animated Holy Spirit Dove with Olive/Palm Branch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-3 sm:mb-4 flex items-center justify-center"
          >
            {/* Glowing Halo / Nimbus behind the Dove */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-r from-amber-300/40 via-emerald-300/30 to-amber-200/40 blur-2xl pointer-events-none"
            />

            {/* Holy Spirit Dove SVG */}
            <svg
              className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-[0_8px_16px_rgba(245,158,11,0.25)]"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="introDoveBody" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
                <linearGradient id="introDoveGold" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <filter id="introGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Light rays spreading from Holy Spirit */}
              <motion.g
                animate={{ opacity: [0.5, 0.9, 0.5], rotate: [0, 4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                style={{ transformOrigin: '100px 95px' }}
              >
                <line x1="100" y1="20" x2="100" y2="5" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <line x1="145" y1="40" x2="160" y2="25" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <line x1="55" y1="40" x2="40" y2="25" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <line x1="170" y1="90" x2="185" y2="90" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <line x1="30" y1="90" x2="15" y2="90" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              </motion.g>

              {/* Left Wing */}
              <path
                d="M100 85 C80 40 45 35 25 55 C40 70 65 85 90 95 Z"
                fill="url(#introDoveBody)"
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />
              {/* Right Wing */}
              <path
                d="M100 85 C120 40 155 35 175 55 C160 70 135 85 110 95 Z"
                fill="url(#introDoveBody)"
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />
              {/* Dove Body & Head */}
              <path
                d="M100 65 C94 65 88 72 88 80 C88 95 92 118 92 135 C92 142 96 148 100 148 C104 148 108 142 108 135 C108 118 112 95 112 80 C112 72 106 65 100 65 Z"
                fill="url(#introDoveBody)"
                stroke="#CBD5E1"
                strokeWidth="1"
              />
              {/* Tail */}
              <path
                d="M93 135 L85 165 C95 160 105 160 115 165 L107 135 Z"
                fill="url(#introDoveBody)"
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />
              {/* Beak */}
              <polygon points="100,60 97,67 103,67" fill="url(#introDoveGold)" />
              {/* Light Point */}
              <circle cx="100" cy="54" r="3.5" fill="#FDE047" filter="url(#introGlow)" />
              {/* Branch */}
              <path
                d="M100 64 Q125 58 148 70"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M112 60 Q118 50 124 57" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M122 60 Q128 48 134 56" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M132 62 Q140 52 144 60" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
          </motion.div>

          {/* Intro Title & Inscription */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-1.5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/90 border border-emerald-400/50 text-emerald-200 text-[11px] font-sans font-semibold tracking-widest uppercase shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Veni Sancte Spiritus • Wybierz drogę modlitwy</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 bg-clip-text text-transparent drop-shadow-md">
              SKRUTACJA & BREWIARZ
            </h1>

            <p className="font-serif italic text-xs sm:text-sm text-emerald-100/90 tracking-wide max-w-lg mx-auto">
              Modlitwa Słowem Bożym, Liturgią Godzin i Tradycją Kościoła
            </p>
          </motion.div>
        </div>

        {/* 4 Majestic Interactive Golden Gateway Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 z-10"
        >
          {/* Card 1: Skrutacja Pisma Świętego */}
          <button
            type="button"
            id="intro-btn-scrutation"
            onClick={() => onSelectChoice('scrutation')}
            className="group relative rounded-2xl bg-white border-2 border-emerald-600/30 hover:border-emerald-600 p-5 sm:p-6 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-emerald-700/10 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-90" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 p-0.5 shadow-sm flex items-center justify-center text-white">
                  <Scroll className="w-6 h-6 text-amber-300 group-hover:scale-110 transition-transform" />
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  Główna
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  1. Skrutacja
                </h3>
                <p className="text-[11px] font-sans font-semibold text-emerald-800 tracking-wide uppercase mt-0.5">
                  Scrutatio Scripturae
                </p>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Badanie powiązań biblijnych werset po wersecie, drzewko skrutacji, komentarze Ojców Kościoła i Targumy.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-sans font-bold text-emerald-800 group-hover:text-emerald-950 relative z-10">
              <span>Wejdź do Skrutacji</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Brewiarz dla Duchownych */}
          <button
            type="button"
            id="intro-btn-breviary-clergy"
            onClick={() => onSelectChoice('breviary_clergy')}
            className="group relative rounded-2xl bg-white border-2 border-amber-600/30 hover:border-amber-600 p-5 sm:p-6 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-amber-700/10 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 to-yellow-500 opacity-90" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-700 p-0.5 shadow-sm flex items-center justify-center text-white">
                  <Church className="w-6 h-6 text-amber-200 group-hover:scale-110 transition-transform" />
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-bold bg-amber-50 text-amber-900 border border-amber-200 uppercase tracking-wider">
                  Oficjum
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                  2. Brewiarz Duchownych
                </h3>
                <p className="text-[11px] font-sans font-semibold text-amber-800 tracking-wide uppercase mt-0.5">
                  Liturgia Horarum
                </p>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Pełne Oficjum kapłańskie i zakonne: Wezwanie, Godzina Czytań z patrystyką, Jutrznia, Tercja, Seksta, Nona, Nieszpory, Kompleta.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-sans font-bold text-amber-800 group-hover:text-amber-950 relative z-10">
              <span>Otwórz Brewiarz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Brewiarz dla Świeckich */}
          <button
            type="button"
            id="intro-btn-breviary-lay"
            onClick={() => onSelectChoice('breviary_lay')}
            className="group relative rounded-2xl bg-white border-2 border-indigo-600/30 hover:border-indigo-600 p-5 sm:p-6 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-indigo-700/10 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 to-sky-500 opacity-90" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-700 p-0.5 shadow-sm flex items-center justify-center text-white">
                  <Users className="w-6 h-6 text-indigo-200 group-hover:scale-110 transition-transform" />
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 uppercase tracking-wider">
                  Codzienna
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                  3. Brewiarz Świeckich
                </h3>
                <p className="text-[11px] font-sans font-semibold text-indigo-800 tracking-wide uppercase mt-0.5">
                  Dla Rodzin i Wiernych
                </p>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Przejrzysty układ modlitwy porannej (Jutrznia), w ciągu dnia, wieczornej (Nieszpory) i na sen (Kompleta) dla uświęcenia życia w świecie.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-sans font-bold text-indigo-800 group-hover:text-indigo-950 relative z-10">
              <span>Módl się w rodzinie</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 4: Losuj Słowo Boże */}
          <button
            type="button"
            id="intro-btn-draw-word"
            onClick={() => onSelectChoice('draw_word')}
            className="group relative rounded-2xl bg-white border-2 border-amber-400 hover:border-amber-500 p-5 sm:p-6 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-amber-500/15 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-sm flex items-center justify-center">
                  <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                    <Flame className="w-6 h-6 text-amber-600 group-hover:scale-125 transition-transform" />
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-extrabold bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider animate-pulse">
                  Nowość
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                  4. Losuj Słowo Boże
                </h3>
                <p className="text-[11px] font-sans font-semibold text-amber-800 tracking-wide uppercase mt-0.5">
                  Karta Rhema & Sigla
                </p>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Wylosuj natchnioną kartę ze Słowem Bożym na dzisiaj, poznaj sigla, werset, szerszy kontekst i przejdź do skrutacji.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-sans font-extrabold text-amber-800 group-hover:text-amber-950 relative z-10">
              <span>Wylosuj Słowo teraz</span>
              <Sparkles className="w-4 h-4 text-amber-600 group-hover:rotate-45 transition-transform" />
            </div>
          </button>
        </motion.div>

        {/* Biblical Scripture verse at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center max-w-lg z-10 space-y-2 pb-2"
        >
          <p className="text-xs sm:text-sm font-serif text-emerald-100/95 italic leading-relaxed drop-shadow-xs">
            „Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce.”
            <span className="inline-block not-italic text-[11px] text-amber-300 font-sans ml-1.5 font-semibold">
              (Ps 119, 105)
            </span>
          </p>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-[11px] font-sans text-emerald-300/80 hover:text-white underline transition-colors cursor-pointer"
            >
              Przejdź do ostatnio otwartego widoku
            </button>
          )}
        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
};
