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
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#0A120E] via-[#080D1A] to-[#120F0A] text-white select-none overflow-y-auto px-4 py-6 sm:py-8 custom-scrollbar"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px) + 16px, 20px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 20px, 24px)',
          paddingLeft: 'max(env(safe-area-inset-left, 0px) + 16px, 16px)',
          paddingRight: 'max(env(safe-area-inset-right, 0px) + 16px, 16px)'
        }}
      >
        {/* Ambient Golden & Emerald Radial Halo Light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,158,11,0.18),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_75%,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none" />

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
              className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-r from-amber-400/30 via-emerald-400/25 to-amber-300/30 blur-2xl pointer-events-none"
            />

            {/* Holy Spirit Dove SVG */}
            <svg
              className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-[0_8px_20px_rgba(251,191,36,0.4)]"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="introDoveBody" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#CBD5E1" />
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
                animate={{ opacity: [0.4, 0.85, 0.4], rotate: [0, 4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                style={{ transformOrigin: '100px 95px' }}
              >
                <line x1="100" y1="20" x2="100" y2="5" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <line x1="145" y1="40" x2="160" y2="25" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <line x1="55" y1="40" x2="40" y2="25" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <line x1="170" y1="90" x2="185" y2="90" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <line x1="30" y1="90" x2="15" y2="90" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              </motion.g>

              {/* Left Wing */}
              <path
                d="M100 85 C80 40 45 35 25 55 C40 70 65 85 90 95 Z"
                fill="url(#introDoveBody)"
                stroke="#CBD5E1"
                strokeWidth="1"
              />
              {/* Right Wing */}
              <path
                d="M100 85 C120 40 155 35 175 55 C160 70 135 85 110 95 Z"
                fill="url(#introDoveBody)"
                stroke="#CBD5E1"
                strokeWidth="1"
              />
              {/* Dove Body & Head */}
              <path
                d="M100 65 C94 65 88 72 88 80 C88 95 92 118 92 135 C92 142 96 148 100 148 C104 148 108 142 108 135 C108 118 112 95 112 80 C112 72 106 65 100 65 Z"
                fill="url(#introDoveBody)"
              />
              {/* Tail */}
              <path
                d="M93 135 L85 165 C95 160 105 160 115 165 L107 135 Z"
                fill="url(#introDoveBody)"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              {/* Beak */}
              <polygon points="100,60 97,67 103,67" fill="url(#introDoveGold)" />
              {/* Light Point */}
              <circle cx="100" cy="54" r="3.5" fill="#FDE047" filter="url(#introGlow)" />
              {/* Branch */}
              <path
                d="M100 64 Q125 58 148 70"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M112 60 Q118 50 124 57" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M122 60 Q128 48 134 56" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M132 62 Q140 52 144 60" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
          </motion.div>

          {/* Intro Title & Inscription */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-1.5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[11px] font-sans font-semibold tracking-widest uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Veni Sancte Spiritus • Wybierz drogę modlitwy</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-white to-amber-100 bg-clip-text text-transparent drop-shadow-md">
              SKRUTACJA & BREWIARZ
            </h1>

            <p className="font-serif italic text-xs sm:text-sm text-amber-200/80 tracking-wide max-w-lg mx-auto">
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
            className="group relative rounded-2xl bg-gradient-to-b from-[#1E2923] via-[#131D18] to-[#0A120E] border-2 border-emerald-500/40 hover:border-emerald-400 p-5 sm:p-6 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-xl hover:shadow-emerald-500/20 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            {/* Ambient gold glow highlight on hover */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-400/20 rounded-full blur-2xl group-hover:bg-emerald-400/35 transition-all" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-80" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                    <Scroll className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                  Główna
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                  1. Skrutacja
                </h3>
                <p className="text-[11px] font-sans font-semibold text-emerald-300/90 tracking-wide uppercase mt-0.5">
                  Scrutatio Scripturae
                </p>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Badanie powiązań biblijnych werset po wersecie, drzewko skrutacji, komentarze Ojców Kościoła i Targumy.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs font-sans font-bold text-emerald-300 group-hover:text-emerald-200 relative z-10">
              <span>Wejdź do Skrutacji</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Brewiarz dla Duchownych */}
          <button
            type="button"
            id="intro-btn-breviary-clergy"
            onClick={() => onSelectChoice('breviary_clergy')}
            className="group relative rounded-2xl bg-gradient-to-b from-[#251A10] via-[#1A1208] to-[#0F0A05] border-2 border-amber-500/40 hover:border-amber-400 p-5 sm:p-6 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-xl hover:shadow-amber-500/25 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl group-hover:bg-amber-400/35 transition-all" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 opacity-90" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                    <Church className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  Oficjum
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  2. Brewiarz Duchownych
                </h3>
                <p className="text-[11px] font-sans font-semibold text-amber-300/90 tracking-wide uppercase mt-0.5">
                  Liturgia Horarum
                </p>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Pełne Oficjum kapłańskie i zakonne: Wezwanie, Godzina Czytań z patrystyką, Jutrznia, Tercja, Seksta, Nona, Nieszpory, Kompleta.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-sans font-bold text-amber-300 group-hover:text-amber-200 relative z-10">
              <span>Otwórz Brewiarz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Brewiarz dla Świeckich */}
          <button
            type="button"
            id="intro-btn-breviary-lay"
            onClick={() => onSelectChoice('breviary_lay')}
            className="group relative rounded-2xl bg-gradient-to-b from-[#1C182B] via-[#120F1F] to-[#0A0813] border-2 border-indigo-400/40 hover:border-indigo-300 p-5 sm:p-6 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-xl hover:shadow-indigo-500/20 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-400/20 rounded-full blur-2xl group-hover:bg-indigo-400/35 transition-all" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-amber-300 to-indigo-400 opacity-80" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-300 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 uppercase tracking-wider">
                  Codzienna
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                  3. Brewiarz Świeckich
                </h3>
                <p className="text-[11px] font-sans font-semibold text-indigo-300/90 tracking-wide uppercase mt-0.5">
                  Dla Rodzin i Wiernych
                </p>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Przejrzysty układ modlitwy porannej (Jutrznia), w ciągu dnia, wieczornej (Nieszpory) i na sen (Kompleta) dla uświęcenia życia w świecie.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-indigo-500/20 flex items-center justify-between text-xs font-sans font-bold text-indigo-200 group-hover:text-white relative z-10">
              <span>Módl się w rodzinie</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 4: Losuj Słowo Boże */}
          <button
            type="button"
            id="intro-btn-draw-word"
            onClick={() => onSelectChoice('draw_word')}
            className="group relative rounded-2xl bg-gradient-to-b from-[#2B1B14] via-[#1E110B] to-[#120904] border-2 border-amber-400/60 hover:border-amber-300 p-5 sm:p-6 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-2xl hover:shadow-amber-400/35 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            {/* Animated Golden Sparkle Halo */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/25 rounded-full blur-2xl group-hover:bg-amber-300/45 transition-all" />
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center">
                  <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-amber-400 group-hover:scale-125 transition-transform" />
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-extrabold bg-amber-400 text-slate-950 shadow-sm uppercase tracking-wider animate-pulse">
                  Nowość
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  4. Losuj Słowo Boże
                </h3>
                <p className="text-[11px] font-sans font-semibold text-amber-300/90 tracking-wide uppercase mt-0.5">
                  Karta Rhema & Sigla
                </p>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Wylosuj natchnioną kartę ze Słowem Bożym na dzisiaj, poznaj sigla, werset, szerszy kontekst i przejdź do skrutacji.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-amber-500/30 flex items-center justify-between text-xs font-sans font-extrabold text-amber-300 group-hover:text-yellow-200 relative z-10">
              <span>Wylosuj Słowo teraz</span>
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
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
          <p className="text-xs font-serif text-slate-400 italic leading-relaxed">
            „Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce.”
            <span className="inline-block not-italic text-[11px] text-amber-300/80 font-sans ml-1.5">
              (Ps 119, 105)
            </span>
          </p>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-[11px] font-sans text-slate-400 hover:text-amber-200 underline transition-colors cursor-pointer"
            >
              Przejdź do ostatnio otwartego widoku
            </button>
          )}
        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
};
