import React from 'react';
import { BookOpen, Compass, BookmarkCheck, Library, Flame, Sparkles, CalendarDays, Download, Droplets, Leaf } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simple' | 'daily' | 'workspace' | 'patristic' | 'journal' | 'guide' | 'themes' | 'books';
  setActiveTab: (tab: 'simple' | 'daily' | 'workspace' | 'patristic' | 'journal' | 'guide' | 'themes' | 'books') => void;
  hasActiveSession: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, hasActiveSession }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/90 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveTab('daily')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group select-none"
            id="header-logo-btn"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400 group-hover:shadow-md flex items-center justify-center text-white transition-all shadow-xs">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                  SKRUTACJA
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 hidden sm:inline-block">
                  Scripturae
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-sans font-medium tracking-wide hidden md:block">
                Liturgia Dnia • Biblia Jerozolimska • Ojcowie Kościoła
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 font-sans text-xs tracking-wider text-slate-600">
            <button
              id="nav-daily-btn"
              onClick={() => setActiveTab('daily')}
              className={`py-1.5 px-2.5 sm:px-3 text-xs tracking-wider transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium ${
                activeTab === 'daily'
                  ? 'text-emerald-900 bg-emerald-100/80 border border-emerald-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Czytania z liturgii dnia i wybór fragmentu"
            >
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span>Czytania z dnia</span>
            </button>

            <button
              id="nav-workspace-btn"
              onClick={() => setActiveTab('workspace')}
              className={`py-1.5 px-2.5 sm:px-3 text-xs tracking-wider transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium relative ${
                activeTab === 'workspace'
                  ? 'text-emerald-900 bg-emerald-100/80 border border-emerald-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Pulpit badania i drzewo odnośników biblijnych"
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Odnośniki</span>
              {hasActiveSession && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              id="nav-simple-btn"
              onClick={() => setActiveTab('simple')}
              className={`py-1.5 px-2.5 sm:px-3 text-xs tracking-wider transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium ${
                activeTab === 'simple'
                  ? 'text-emerald-900 bg-emerald-100/80 border border-emerald-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Przejrzysty widok krok po kroku z pełnymi tekstami czytań"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Prosta Skrutacja</span>
              <span className="sm:hidden">Skrutuj</span>
            </button>

            <button
              id="nav-patristic-btn"
              onClick={() => setActiveTab('patristic')}
              className={`py-1.5 px-2.5 sm:px-3 text-xs tracking-wider transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium ${
                activeTab === 'patristic'
                  ? 'text-sky-900 bg-sky-100/80 border border-sky-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Komentarze Ojców Kościoła i języki oryginalne"
            >
              <Droplets className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Ojcowie Kościoła</span>
              <span className="sm:hidden">Ojcowie</span>
            </button>

            <button
              id="nav-journal-btn"
              onClick={() => setActiveTab('journal')}
              className={`py-1.5 px-2.5 sm:px-3 text-xs tracking-wider transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium ${
                activeTab === 'journal'
                  ? 'text-emerald-900 bg-emerald-100/80 border border-emerald-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Osobisty Dziennik Duchowy"
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Dziennik</span>
              <span className="sm:hidden">Dziennik</span>
            </button>

            {/* Standalone HTML download link */}
            <a
              id="download-html-btn"
              href="/api/download-html"
              download="scrutatio-scripturae.html"
              className="ml-1 sm:ml-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold transition-all flex items-center gap-1.5 text-xs shadow-xs cursor-pointer"
              title="Pobierz aplikację jako pojedynczy plik .html do działania bez internetu"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pobierz .HTML</span>
              <span className="md:hidden">.HTML</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

