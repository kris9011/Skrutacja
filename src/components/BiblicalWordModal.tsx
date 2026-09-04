import React, { useState, useEffect } from 'react';
import { X, Copy, Check, BookOpen, ExternalLink, Sparkles, Loader2, Bookmark, Compass } from 'lucide-react';
import { BiblicalLexiconEntry, BiblicalWordOccurrence } from '../data/biblicalLexiconDatabase';

interface BiblicalWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  lexiconData: BiblicalLexiconEntry | null;
  isLoading: boolean;
  status: 'idle' | 'loading' | 'slow_loading' | 'ready' | 'error';
  onSelectForScrutation?: (word: string) => void;
  onOpenVerseSiglum?: (siglum: string) => void;
}

export const BiblicalWordModal: React.FC<BiblicalWordModalProps> = ({
  isOpen,
  onClose,
  word,
  lexiconData,
  isLoading,
  status,
  onSelectForScrutation,
  onOpenVerseSiglum
}) => {
  const [activeTab, setActiveTab] = useState<'powiazania' | 'strong' | 'teologia'>('powiazania');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const cleanStrong = lexiconData?.strongNumber || '—';

  return (
    <div
      id="biblical-word-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        id="biblical-word-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300/90 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white p-5 sm:p-6 relative shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-amber-400 text-stone-950 uppercase tracking-wider">
                  Słownik Stronga & Powiązania
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white/15 border border-white/20 text-amber-200">
                  Strong {cleanStrong}
                </span>
                {lexiconData?.originalLanguage && (
                  <span className="text-xs font-sans text-stone-300 bg-black/25 px-2 py-0.5 rounded border border-white/10">
                    {lexiconData.originalLanguage}
                  </span>
                )}
              </div>

              {/* Word Title */}
              <div className="flex items-baseline gap-3 pt-1 flex-wrap">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-amber-100">
                  {lexiconData?.originalWord || word}
                </h2>
                {lexiconData?.transliteration && (
                  <span className="font-mono text-sm sm:text-base text-stone-300 italic">
                    ({lexiconData.transliteration})
                  </span>
                )}
                <span className="font-sans text-lg sm:text-xl font-bold text-white">
                  = «{lexiconData?.wordPolish || word}»
                </span>
              </div>

              {lexiconData?.partOfSpeech && (
                <p className="text-xs font-mono text-emerald-300 pt-0.5">
                  {lexiconData.partOfSpeech}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              id="close-word-modal-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer shrink-0 border border-white/10"
              title="Zamknij okno powiązań słowa (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/15 overflow-x-auto no-scrollbar">
            <button
              id="tab-word-powiazania"
              type="button"
              onClick={() => setActiveTab('powiazania')}
              className={`px-3.5 py-1.5 rounded-xl font-sans font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'powiazania'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'bg-white/10 text-stone-200 hover:bg-white/15'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Powiązania w Piśmie ({lexiconData?.occurrences?.length || 0})</span>
            </button>

            <button
              id="tab-word-strong"
              type="button"
              onClick={() => setActiveTab('strong')}
              className={`px-3.5 py-1.5 rounded-xl font-sans font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'strong'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'bg-white/10 text-stone-200 hover:bg-white/15'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Słownik Stronga & Znaczenie</span>
            </button>

            <button
              id="tab-word-teologia"
              type="button"
              onClick={() => setActiveTab('teologia')}
              className={`px-3.5 py-1.5 rounded-xl font-sans font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'teologia'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'bg-white/10 text-stone-200 hover:bg-white/15'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Klucz Skrutacji (ST / NT)</span>
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Loading / Slow Loading Indicator */}
          {isLoading && status === 'slow_loading' && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center gap-3 text-xs font-sans">
              <Loader2 className="w-4 h-4 text-amber-700 animate-spin shrink-0" />
              <div>
                <p className="font-bold text-amber-900">Trwa filologiczna analiza powiązań biblijnych...</p>
                <p className="text-amber-800/90 text-[11px]">
                  Ładowanie zweryfikowanych wersetów konkordancji z bazy Pisma Świętego.
                </p>
              </div>
            </div>
          )}

          {isLoading && status === 'loading' && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-xs font-sans">
              <Loader2 className="w-4 h-4 text-emerald-700 animate-spin shrink-0" />
              <span>Wyszukiwanie wystąpień i powiązań w Starym i Nowym Testamencie...</span>
            </div>
          )}

          {/* TAB 1: POWIĄZANIA W PIŚMIE ŚWIĘTYM (Konkordancja i wersetu) */}
          {activeTab === 'powiazania' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-700" />
                    Wystąpienia tego słowa w Piśmie Świętym (Skrutacja)
                  </h3>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Miejsca w Biblii, gdzie to samo pojęcie łączy objawienie Boże w jedną całość:
                  </p>
                </div>
                {lexiconData?.biblicalFrequency && (
                  <span className="text-[11px] font-sans font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 hidden sm:inline">
                    {lexiconData.biblicalFrequency}
                  </span>
                )}
              </div>

              {lexiconData?.occurrences && lexiconData.occurrences.length > 0 ? (
                <div className="space-y-3">
                  {lexiconData.occurrences.map((occ, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-stone-50/80 hover:bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-all space-y-2.5 group"
                    >
                      {/* Siglum header with Testament badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider ${
                              occ.testament === 'ST'
                                ? 'bg-amber-100 text-amber-950 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                            }`}
                          >
                            {occ.testament === 'ST' ? 'Stary Testament' : 'Nowy Testament'}
                          </span>
                          <span className="font-serif font-bold text-base text-stone-900">
                            {occ.siglum}
                          </span>
                          <span className="text-xs font-sans text-stone-400">
                            — {occ.bookName}
                          </span>
                        </div>

                        {/* Copy & open actions */}
                        <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleCopy(`${occ.siglum}: ${occ.text}`, `occ_${idx}`)}
                            className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-800 border border-stone-200 transition-colors cursor-pointer text-xs flex items-center gap-1"
                            title="Kopiuj ten werset"
                          >
                            {copiedText === `occ_${idx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {onOpenVerseSiglum && (
                            <button
                              type="button"
                              onClick={() => onOpenVerseSiglum(occ.siglum)}
                              className="px-2 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-sans text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                              title="Otwórz ten werset w skrutacji"
                            >
                              <span>Zbadaj werset</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Verse Text with highlighted word */}
                      <p className="font-scripture text-base sm:text-lg text-stone-900 leading-relaxed pl-3 border-l-2 border-amber-400">
                        {occ.text}
                      </p>

                      {/* Context / Theological note */}
                      {occ.contextNote && (
                        <div className="text-xs font-sans text-emerald-950 bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/80 flex items-start gap-1.5">
                          <Bookmark className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{occ.contextNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
                  <p className="text-sm font-sans text-stone-600">
                    Brak bezpośrednich wersetów w podręcznej pamięci.
                  </p>
                  <p className="text-xs font-sans text-stone-400">
                    Wybierz opcję „Zbadaj to pojęcie w drzewie skrutacji”, aby wygenerować pełną sieć odnośników.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SŁOWNIK STRONGA & ZNACZENIA */}
          {activeTab === 'strong' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="text-[11px] font-sans uppercase font-bold text-stone-400 tracking-wider">
                    Numer Stronga & Język:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-lg border border-amber-300">
                      {cleanStrong}
                    </span>
                    <span className="text-sm font-sans font-semibold text-stone-700">
                      {lexiconData?.originalLanguage}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="text-[11px] font-sans uppercase font-bold text-stone-400 tracking-wider">
                    Część mowy & Gramatyka:
                  </span>
                  <p className="font-mono text-xs font-semibold text-emerald-950 pt-1">
                    {lexiconData?.partOfSpeech || 'Termin biblijny'}
                  </p>
                </div>
              </div>

              {/* Root meaning */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <span className="text-[11px] font-sans uppercase font-bold text-emerald-800 tracking-wider block">
                  Rdzeń słowa i podstawowe znaczenie:
                </span>
                <p className="font-serif text-base font-semibold text-stone-900 leading-relaxed">
                  {lexiconData?.rootMeaning || `Pojęcie biblijne «${word}»`}
                </p>
              </div>

              {/* Detailed Definition */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <span className="text-[11px] font-sans uppercase font-bold text-stone-500 tracking-wider block">
                  Szczegółowa definicja teologiczno-biblijna:
                </span>
                <p className="font-sans text-sm sm:text-base text-stone-800 leading-relaxed">
                  {lexiconData?.detailedDefinition || 'Szczegółowa definicja w trakcie opracowywania.'}
                </p>
              </div>

              {/* Related Words */}
              {lexiconData?.relatedWords && lexiconData.relatedWords.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-sans uppercase font-bold text-stone-400 tracking-wider">
                    Pojęcia i słowa pokrewne w Biblii:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {lexiconData.relatedWords.map((rel, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-sans text-xs border border-stone-200"
                      >
                        {rel}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: KLUCZ SKRUTACJI (ST / NT) */}
          {activeTab === 'teologia' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <h4 className="font-serif text-base font-bold text-amber-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  Jedność Starego i Nowego Testamentu
                </h4>
                <p className="font-sans text-sm text-stone-800 leading-relaxed">
                  {lexiconData?.theologicalSignificance ||
                    'W tradycji Scrutatio Scripturae badanie tego pojęcia odkrywa, jak obietnica dana Ojcom w Starym Testamencie wypełnia się w Chrystusie w Nowym Testamencie.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs font-sans text-stone-600">
                <p className="font-bold text-stone-900">Zasada Skrutacji (Scrutatio Scripturae):</p>
                <p>
                  «Pismo wyjaśnia samo siebie» (*Scriptura sacra sui ipsius interpres*). Gdy klikasz w dane słowo,
                  Duch Święty pozwala ci przejść przez całą historię zbawienia: od Prawa (Tora), przez Proroków i Psalmy,
                  aż po Ewangelię i Listy Apostolskie.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              const textToCopy = `${lexiconData?.wordPolish || word} (${lexiconData?.originalWord || ''} / Strong ${cleanStrong}): ${lexiconData?.rootMeaning || ''}\nDefinicja: ${lexiconData?.detailedDefinition || ''}`;
              handleCopy(textToCopy, 'full_lexicon');
            }}
            className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-sans font-medium text-xs flex items-center gap-1.5 transition-colors border border-stone-200 cursor-pointer shadow-2xs"
          >
            {copiedText === 'full_lexicon' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Skopiowano hasło</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Kopiuj hasło</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {onSelectForScrutation && (
              <button
                type="button"
                onClick={() => {
                  onSelectForScrutation(lexiconData?.wordPolish || word);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-sans font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Zbadaj w drzewku skrutacji</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-sans font-semibold text-xs transition-colors cursor-pointer"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
