import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IntroSplashProps {
  onComplete?: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    // Auto-dismiss after 2.8 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onComplete) {
      setTimeout(onComplete, 600);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="intro-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950 text-white cursor-pointer select-none overflow-hidden px-4"
        >
          {/* Subtle Ambient Background Rays & Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.18),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.12),transparent_40%)] pointer-events-none" />

          {/* Animated Holy Spirit Dove with Olive/Palm Branch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -40, x: -30, rotate: -8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: 0,
              rotate: 0,
            }}
            transition={{
              duration: 1.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative mb-6 flex items-center justify-center"
          >
            {/* Glowing Halo / Nimbus behind the Dove */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.9, 1.15, 1], opacity: [0.4, 0.85, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-amber-400/25 via-emerald-400/20 to-amber-300/30 blur-2xl pointer-events-none"
            />

            {/* Holy Spirit Dove SVG with Palm/Olive Branch */}
            <svg
              className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_12px_24px_rgba(251,191,36,0.35)]"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="doveBodyGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>

                <linearGradient id="doveGoldGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                <linearGradient id="palmBranchGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="50%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>

                <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Light rays spreading from Holy Spirit */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.7, 0.4], rotate: [0, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ transformOrigin: '100px 95px' }}
              >
                <line x1="100" y1="20" x2="100" y2="5" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <line x1="145" y1="40" x2="160" y2="25" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <line x1="55" y1="40" x2="40" y2="25" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <line x1="170" y1="90" x2="185" y2="90" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <line x1="30" y1="90" x2="15" y2="90" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              </motion.g>

              {/* Left Wing */}
              <path
                d="M100 85 C80 40 45 35 25 55 C40 70 65 85 90 95 Z"
                fill="url(#doveBodyGrad)"
                stroke="#CBD5E1"
                strokeWidth="1"
              />
              <path
                d="M85 75 C68 45 42 42 32 54"
                stroke="#E2E8F0"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Right Wing */}
              <path
                d="M100 85 C120 40 155 35 175 55 C160 70 135 85 110 95 Z"
                fill="url(#doveBodyGrad)"
                stroke="#CBD5E1"
                strokeWidth="1"
              />
              <path
                d="M115 75 C132 45 158 42 168 54"
                stroke="#E2E8F0"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Dove Body & Head */}
              <path
                d="M100 65 C94 65 88 72 88 80 C88 95 92 118 92 135 C92 142 96 148 100 148 C104 148 108 142 108 135 C108 118 112 95 112 80 C112 72 106 65 100 65 Z"
                fill="url(#doveBodyGrad)"
              />

              {/* Tail Feathers */}
              <path
                d="M93 135 L85 165 C95 160 105 160 115 165 L107 135 Z"
                fill="url(#doveBodyGrad)"
                stroke="#E2E8F0"
                strokeWidth="1"
              />

              {/* Beak / Dzióbek */}
              <polygon points="100,60 97,67 103,67" fill="url(#doveGoldGrad)" />

              {/* Golden Fire / Crown above Head */}
              <circle cx="100" cy="54" r="3.5" fill="#FDE047" filter="url(#glowLight)" />

              {/* Palm / Olive Branch in Beak (Palemka / Gałązka oliwna) */}
              <motion.g
                initial={{ rotate: -10 }}
                animate={{ rotate: [ -5, 5, -5 ] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 62px' }}
              >
                {/* Branch Stem */}
                <path
                  d="M100 64 Q125 58 148 70"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Palm Leaves / Listki palemki */}
                <path d="M112 60 Q118 50 124 57" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M122 60 Q128 48 134 56" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M132 62 Q140 52 144 60" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M142 66 Q150 58 152 68" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" fill="none" />

                <path d="M118 64 Q122 72 116 76" stroke="#059669" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M128 66 Q134 76 128 80" stroke="#059669" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M138 68 Q146 76 142 82" stroke="#059669" strokeWidth="2" strokeLinecap="round" fill="none" />
              </motion.g>
            </svg>
          </motion.div>

          {/* Animated Main Title "SKRUTACJA" */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-2 z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-sans font-semibold tracking-widest uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Veni Sancte Spiritus</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-100 via-white to-emerald-200 bg-clip-text text-transparent drop-shadow-sm">
              SKRUTACJA
            </h1>

            <p className="font-serif italic text-sm sm:text-base text-emerald-200/90 tracking-wide max-w-md mx-auto">
              Scrutatio Scripturae • W świetle Ducha Świętego
            </p>
          </motion.div>

          {/* Biblical Scripture verse */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-xs sm:text-sm font-serif text-slate-400 text-center max-w-lg mt-6 px-4 leading-relaxed italic"
          >
            „Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce.”
            <span className="block not-italic text-[11px] text-amber-300/80 font-sans mt-1">
              (Ps 119, 105)
            </span>
          </motion.p>

          {/* Bottom Enter / Skip Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 z-10"
          >
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-600/60 text-xs font-sans font-bold shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Wejdź do Słowa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
