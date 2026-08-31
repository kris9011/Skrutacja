import React from 'react';
import { BookOpen, Compass, BookmarkCheck, Library, Flame, Sparkles, CalendarDays, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'daily' | 'workspace' | 'patristic' | 'journal' | 'guide' | 'themes' | 'books';
  setActiveTab: (tab: 'daily' | 'workspace' | 'patristic' | 'journal' | 'guide' | 'themes' | 'books') => void;
  hasActiveSession: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, hasActiveSession }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F0F12] text-[#E0E0D6] border-b border-[#3D3524]">
      <div className="max-w-7xl mx-auto px-3 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveTab('daily')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group select-none"
            id="header-logo-btn"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#141417] border border-[#3D3524] group-hover:border-[#C5A059] flex items-center justify-center text-[#C5A059] transition-colors">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg sm:text-2xl font-light tracking-widest text-[#C5A059]">
                  SKRUTACJA
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-sans text-[#8C8270] opacity-80 hidden sm:inline-block">
                  Scripturae
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#8C8270] font-sans tracking-wide hidden md:block">
                Czytania z dnia • Odnośniki Biblijne • Ojcowie Kościoła
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-3 md:gap-4 font-sans text-xs tracking-wider text-[#8C8270] uppercase">
            <button
              id="nav-daily-btn"
              onClick={() => setActiveTab('daily')}
              className={`py-1 px-2 sm:px-2.5 text-xs tracking-wider transition-all rounded-md flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'daily'
                  ? 'text-[#C5A059] bg-[#1F1E24] border border-[#3D3524] font-medium'
                  : 'hover:text-[#E0E0D6]'
              }`}
              title="Czytania z dnia"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-semibold">Czytania</span>
            </button>

            <button
              id="nav-workspace-btn"
              onClick={() => setActiveTab('workspace')}
              className={`py-1 px-2 sm:px-2.5 text-xs tracking-wider transition-all rounded-md flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === 'workspace'
                  ? 'text-[#C5A059] bg-[#1F1E24] border border-[#3D3524] font-medium'
                  : 'hover:text-[#E0E0D6]'
              }`}
              title="Odnośniki biblijne i aktywne drzewo skrutacji"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Odnośniki</span>
              {hasActiveSession && (
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
              )}
            </button>

            <button
              id="nav-patristic-btn"
              onClick={() => setActiveTab('patristic')}
              className={`py-1 px-2 sm:px-2.5 text-xs tracking-wider transition-all rounded-md flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'patristic'
                  ? 'text-[#C5A059] bg-[#1F1E24] border border-[#3D3524] font-medium'
                  : 'hover:text-[#E0E0D6]'
              }`}
              title="Komentarze Ojców Kościoła i języki oryginalne"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Ojcowie Kościoła</span>
              <span className="sm:hidden">Ojcowie</span>
            </button>

            <button
              id="nav-journal-btn"
              onClick={() => setActiveTab('journal')}
              className={`py-1 px-2 sm:px-2.5 text-xs tracking-wider transition-all rounded-md flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'journal'
                  ? 'text-[#C5A059] bg-[#1F1E24] border border-[#3D3524] font-medium'
                  : 'hover:text-[#E0E0D6]'
              }`}
              title="Osobisty Dziennik Duchowy"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dziennik</span>
              <span className="sm:hidden">Dziennik</span>
            </button>

            {/* Standalone HTML download link */}
            <a
              id="download-html-btn"
              href="/api/download-html"
              download="scrutatio-scripturae.html"
              className="ml-1 sm:ml-2 px-2.5 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#E5C98B] text-black font-semibold transition-all flex items-center gap-1 text-[11px] uppercase tracking-wider shadow"
              title="Pobierz aplikację jako pojedynczy plik .html do działania bez serwera"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Zapisz .HTML</span>
              <span className="md:hidden">.HTML</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

