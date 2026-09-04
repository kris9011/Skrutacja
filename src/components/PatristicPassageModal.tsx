import React, { useState } from 'react';
import { X, Scroll, ExternalLink, Sparkles, MessageSquareQuote, Search } from 'lucide-react';
import { PatristicCommentarySection } from './PatristicCommentarySection';

interface PatristicPassageModalProps {
  isOpen: boolean;
  onClose: () => void;
  siglum: string;
  verseText: string;
  label?: string;
  onOpenFullPatristicView?: (siglum: string) => void;
  onStartScrutation?: (siglum: string, text: string) => void;
  onOpenModernCommentary?: (siglum: string, text: string, label?: string) => void;
}

export const PatristicPassageModal: React.FC<PatristicPassageModalProps> = ({
  isOpen,
  onClose,
  siglum,
  verseText,
  label,
  onOpenFullPatristicView,
  onStartScrutation,
  onOpenModernCommentary
}) => {
  const [activeSiglum, setActiveSiglum] = useState<string>(siglum);
  const [searchInput, setSearchInput] = useState<string>('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveSiglum(searchInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-sky-200 overflow-hidden max-h-[96dvh] sm:max-h-[90vh] flex flex-col overscroll-contain"
        role="dialog"
        aria-modal="true"
      >
        {/* Compact Sticky Top Bar */}
        <div className="relative flex-shrink-0 z-30 bg-slate-950/95 backdrop-blur-md text-slate-50 px-3.5 sm:px-5 py-2.5 flex items-center justify-between border-b border-sky-700/50 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-sky-400/20 border border-sky-400/30 text-[10px] uppercase font-sans font-bold tracking-wider text-sky-200 shrink-0">
              {label ? `Ojcowie • ${label}` : 'Ojcowie Kościoła'}
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-white bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30 shrink-0">
              {activeSiglum}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenFullPatristicView && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullPatristicView(activeSiglum);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-800/80 hover:bg-sky-700 text-xs font-sans font-bold text-sky-100 transition-colors cursor-pointer border border-sky-600/40"
                title="Otwórz w pełnej zakładce Ojców Kościoła"
              >
                <span>Pełna zakładka</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-sky-200 hover:text-white transition-colors cursor-pointer"
              title="Zamknij"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar flex flex-col min-h-0">
          {/* Rich Header Banner (scrolls naturally with content) */}
          <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-emerald-950 text-white p-4 sm:p-6 border-b border-sky-700/50 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-sky-950/60 text-[10px] sm:text-xs font-sans font-semibold text-sky-200 border border-sky-500/30">
                Catena Aurea & Patrologia Graeca et Latina
              </span>
            </div>
            <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Scroll className="w-5 h-5 text-sky-400 shrink-0" />
              <span>Komentarze Ojców Kościoła do fragmentu</span>
            </h2>
            <p className="text-xs sm:text-sm text-sky-200/90 font-sans">
              Święty Augustyn, Jan Chryzostom, Hieronim, Tomasz z Akwinu i starożytna Tradycja Kościoła
            </p>
          </div>

          {/* Navigation Switch Bar: Ojcowie Kościoła vs Komentarze Najnowsze */}
          <div className="bg-sky-950/20 border-b border-slate-200 px-3.5 sm:px-5 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 self-start">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-sans font-bold bg-sky-700 text-white shadow-xs flex items-center gap-1.5"
              >
                <Scroll className="w-3.5 h-3.5" />
                <span>Ojcowie Kościoła (Tradycja)</span>
              </button>
              {onOpenModernCommentary && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenModernCommentary(activeSiglum, verseText, label);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Przełącz na najnowsze komentarze biblijno-egzegetyczne"
                >
                  <MessageSquareQuote className="w-3.5 h-3.5 text-amber-600" />
                  <span>Komentarze najnowsze</span>
                </button>
              )}
            </div>

            {/* Quick Siglum / Phrase Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-1.5">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Wpisz fragment np. Mt 5,3..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-sky-600 font-sans"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white text-xs font-sans font-bold rounded-lg transition-colors cursor-pointer"
              >
                Szukaj
              </button>
            </form>
          </div>

          {/* Content Body (flows naturally in the scrollable card) */}
          <div className="p-4 sm:p-7 space-y-6 text-slate-900 flex-1">
            <PatristicCommentarySection
              siglum={activeSiglum}
              verseText={verseText}
              onInsertInsightToNotes={(insight) => {
                if (onStartScrutation) {
                  onClose();
                  onStartScrutation(activeSiglum, verseText);
                }
              }}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {onOpenFullPatristicView && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullPatristicView(siglum);
              }}
              className="py-2.5 px-4 rounded-xl text-xs font-sans uppercase tracking-wider font-bold flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-sky-700" />
              <span>Otwórz w pełnej zakładce Ojców Kościoła</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            {onStartScrutation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartScrutation(siglum, verseText);
                }}
                className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl text-xs font-sans uppercase tracking-wider font-bold flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Skrutuj ten fragment</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-sans font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
