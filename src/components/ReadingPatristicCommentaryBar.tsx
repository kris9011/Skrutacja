import React, { useState } from 'react';
import { Scroll, MessageSquareQuote, Search, Sparkles, BookOpen } from 'lucide-react';

interface ReadingPatristicCommentaryBarProps {
  siglum: string;
  verseText: string;
  label?: string;
  theologicalTheme?: string;
  liturgicalContext?: string;
  onOpenPatristics: (targetSiglum: string) => void;
  onOpenCommentary: (targetSiglum: string) => void;
}

export const ReadingPatristicCommentaryBar: React.FC<ReadingPatristicCommentaryBarProps> = ({
  siglum,
  verseText,
  label,
  theologicalTheme,
  liturgicalContext,
  onOpenPatristics,
  onOpenCommentary
}) => {
  const [searchInput, setSearchInput] = useState<string>('');

  const handleSearchFathers = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim() || siglum;
    onOpenPatristics(query);
  };

  const handleSearchModern = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim() || siglum;
    onOpenCommentary(query);
  };

  return (
    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-slate-50 to-sky-50/90 border border-amber-200/90 shadow-2xs space-y-3">
      {/* Top Bar with clear label and direct links */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-amber-900 block">
              Komentarze do czytania
            </span>
            <span className="font-mono text-xs font-bold text-slate-800">
              {siglum} {label ? `• ${label}` : ''}
            </span>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onOpenPatristics(siglum)}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-sans font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Otwórz komentarze Ojców Kościoła do tego czytania"
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>Ojcowie Kościoła</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCommentary(siglum)}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-sans font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Otwórz komentarze biblijne: św. Tomasz z Akwinu, JFB po polsku, pastoralne i 4 zmysły Pisma"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Komentarze (Tomasz • JFB • Pastoralne)</span>
          </button>
        </div>
      </div>

      {/* Available Sources Pill Chips */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-sans font-semibold text-slate-600">
        <span className="text-amber-800 font-bold uppercase tracking-wider text-[9px]">Dostępne źródła:</span>
        <span className="px-2 py-0.5 rounded-md bg-amber-100/80 border border-amber-200 text-amber-900">🕊️ Św. Tomasz z Akwinu</span>
        <span className="px-2 py-0.5 rounded-md bg-sky-100/80 border border-sky-200 text-sky-900">📖 Jamieson-Fausset-Brown (JFB)</span>
        <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 border border-emerald-200 text-emerald-900">🌿 Pastoralne & Spurgeon</span>
        <span className="px-2 py-0.5 rounded-md bg-purple-100/80 border border-purple-200 text-purple-900">📜 4 Zmysły Pisma (KKK)</span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">⛪ Przypisy ks. Wujka</span>
      </div>

      {/* Quick Search for any fragment or verse */}
      <div className="pt-2 border-t border-amber-200/60">
        <form
          onSubmit={handleSearchFathers}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id={`commentary-search-input-${siglum.replace(/[^a-zA-Z0-9]/g, '-')}`}
              type="text"
              placeholder={`Szukaj fragmentu u Ojców lub w komentarzach (np. ${siglum})...`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 font-sans"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                title="Wyczyść"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <button
              type="button"
              id={`search-fathers-btn-${siglum.replace(/[^a-zA-Z0-9]/g, '-')}`}
              onClick={handleSearchFathers}
              className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 rounded-xl text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
              title="Szukaj tego fragmentu u Ojców Kościoła"
            >
              <Scroll className="w-3.5 h-3.5 text-sky-700" />
              <span>Szukaj u Ojców</span>
            </button>

            <button
              type="button"
              id={`search-modern-btn-${siglum.replace(/[^a-zA-Z0-9]/g, '-')}`}
              onClick={handleSearchModern}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
              title="Szukaj tego fragmentu w najnowszych komentarzach"
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-amber-700" />
              <span>Szukaj najnowsze</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
