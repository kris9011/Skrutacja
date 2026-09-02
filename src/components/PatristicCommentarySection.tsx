import React, { useState, useEffect } from 'react';
import { PatristicCommentary, OriginalScriptureDetails } from '../types';
import { getGuaranteedPatristicData } from '../data/patristicDatabase';
import { 
  Scroll, 
  Languages, 
  BookOpen, 
  Sparkles, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Check, 
  Copy, 
  Feather, 
  Flame,
  Globe,
  Quote
} from 'lucide-react';

interface PatristicCommentarySectionProps {
  siglum: string;
  verseText: string;
  onInsertInsightToNotes?: (insight: string) => void;
}

export const PatristicCommentarySection: React.FC<PatristicCommentarySectionProps> = ({
  siglum,
  verseText,
  onInsertInsightToNotes
}) => {
  const [commentaries, setCommentaries] = useState<PatristicCommentary[]>([]);
  const [originalScripture, setOriginalScripture] = useState<OriginalScriptureDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // View mode: 'pl' (Polish translation), 'original' (Greek/Latin), 'parallel' (Side-by-side)
  const [languageMode, setLanguageMode] = useState<'pl' | 'original' | 'parallel'>('pl');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch commentaries for the given verse
  const fetchCommentaries = async (sig: string, text: string) => {
    if (!sig) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/scrutation/patristic-commentaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siglum: sig, text })
      });
      if (!res.ok) throw new Error('Błąd pobierania komentarzy Ojców Kościoła');
      const data = await res.json();
      if (data.commentaries && data.commentaries.length > 0) {
        setCommentaries(data.commentaries);
        setOriginalScripture(data.originalScripture || null);
      } else {
        const guaranteed = getGuaranteedPatristicData(sig, text);
        setCommentaries(guaranteed.commentaries);
        setOriginalScripture(guaranteed.originalScripture);
      }
    } catch (_err) {
      const guaranteed = getGuaranteedPatristicData(sig, text);
      setCommentaries(guaranteed.commentaries);
      setOriginalScripture(guaranteed.originalScripture);
    } finally {
      setIsLoading(false);
    }
  };

  // Load when siglum changes
  useEffect(() => {
    if (siglum) {
      fetchCommentaries(siglum, verseText);
    }
  }, [siglum]);

  const copyToClipboard = async (id: string, text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-sky-800 font-bold">
              Tradycja Patrystyczna i Języki Biblijne
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Scroll className="w-4 h-4 text-sky-600" />
            Komentarze Ojców Kościoła (Catena Aurea)
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Dla wersetu: <strong className="text-sky-900 font-mono">{siglum}</strong>
          </p>
        </div>

        {/* Controls: Language mode toggle & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
            <button
              id="lang-mode-pl-btn"
              onClick={() => setLanguageMode('pl')}
              className={`px-3 py-1 text-xs font-sans uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                languageMode === 'pl'
                  ? 'bg-white text-sky-900 font-bold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Polski
            </button>
            <button
              id="lang-mode-orig-btn"
              onClick={() => setLanguageMode('original')}
              className={`px-3 py-1 text-xs font-sans uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                languageMode === 'original'
                  ? 'bg-white text-sky-900 font-bold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Oryginał
            </button>
            <button
              id="lang-mode-parallel-btn"
              onClick={() => setLanguageMode('parallel')}
              className={`px-3 py-1 text-xs font-sans uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                languageMode === 'parallel'
                  ? 'bg-white text-sky-900 font-bold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bilingwistyczny
            </button>
          </div>

          <button
            id="refresh-patristics-btn"
            onClick={() => fetchCommentaries(siglum, verseText)}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-sky-300 text-slate-600 hover:text-sky-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Odśwież lub poszukaj więcej komentarzy Ojców"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200 mx-auto flex items-center justify-center text-sky-700">
            <Scroll className="w-5 h-5 animate-spin" />
          </div>
          <p className="font-serif text-sm font-bold text-slate-800">
            Przeszukiwanie pism Ojców Kościoła i tekstów oryginalnych...
          </p>
          <p className="text-xs text-slate-500">
            (Św. Augustyn, Św. Jan Chryzostom, Św. Hieronim, Catena Aurea św. Tomasza)
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchCommentaries(siglum, verseText)}
            className="px-2.5 py-1 bg-red-100 rounded-lg border border-red-300 text-[11px] font-semibold hover:bg-red-200"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}

      {/* Original Scripture Inspector Card */}
      {!isLoading && originalScripture && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-sans uppercase tracking-widest text-sky-900 font-bold">
                Tekst Pierwotny i Wulgata ({originalScripture.originalLanguage})
              </span>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-500">{originalScripture.siglum}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Scripture Script */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-bold">
                  Język Oryginalny ({originalScripture.originalLanguage})
                </span>
                <span className="text-[10px] text-sky-700 font-mono font-semibold">Font biblijny</span>
              </div>
              <p className="text-lg font-scripture text-slate-900 leading-relaxed italic select-all" dir={originalScripture.originalLanguage === 'Hebrajski' ? 'rtl' : 'ltr'}>
                {originalScripture.originalScript}
              </p>
              <p className="text-xs font-mono text-slate-500 italic pt-1 border-t border-slate-200">
                Transliteracja: {originalScripture.transliteration}
              </p>
            </div>

            {/* Latin Vulgate */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-bold">
                  Biblia Sacra Vulgata (Łacina)
                </span>
                <span className="text-[10px] text-sky-700 font-serif font-semibold">św. Hieronim</span>
              </div>
              <p className="text-base font-scripture text-slate-900 leading-relaxed italic select-all">
                «{originalScripture.latinVulgate}»
              </p>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-200">
                Polski (BT/BJ): «{originalScripture.polishText}»
              </p>
            </div>
          </div>

          {/* Interlinear vocabulary pill list */}
          {originalScripture.interlinearWords && originalScripture.interlinearWords.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-bold block mb-2">
                Słownik wersetu (analiza morfologiczna i słowa kluczowe):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {originalScripture.interlinearWords.map((word, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-0.5">
                    <div className="font-scripture text-sm font-bold text-sky-900">{word.original}</div>
                    <div className="text-[10px] font-mono text-slate-500">{word.transliteration}</div>
                    <div className="text-[11px] font-semibold text-slate-800">{word.polish}</div>
                    {word.grammarNote && (
                      <div className="text-[9px] text-slate-400 truncate" title={word.grammarNote}>
                        {word.grammarNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Church Fathers Commentaries List */}
      {!isLoading && commentaries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-sky-900 font-bold">
              Komentarze Ojców i Tradycji ({commentaries.length})
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Zmysł: dosłowny, alegoryczny, moralny i anagogiczny
            </span>
          </div>

          <div className="space-y-4">
            {commentaries.map((com) => (
              <div
                key={com.id}
                id={`patristic-commentary-${com.id}`}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 shadow-xs transition-all space-y-3 group"
              >
                {/* Author & Work Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                      <Feather className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-slate-900">
                          {com.author}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-sans font-semibold">
                          {com.century}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-serif italic">
                        {com.workTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-800 font-mono font-bold">
                      {com.theologicalSense}
                    </span>

                    <button
                      onClick={() => copyToClipboard(com.id, `${com.author} (${com.workTitle}):\n${com.polishTranslation}\n\nWgląd: ${com.spiritualInsight}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Kopiuj cytat"
                    >
                      {copiedId === com.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Content according to Language Mode */}
                {languageMode === 'pl' && (
                  <div className="space-y-2">
                    <div className="relative pl-4 border-l-2 border-sky-600">
                      <p className="font-scripture text-base text-slate-800 leading-relaxed italic">
                        «{com.polishTranslation}»
                      </p>
                    </div>
                  </div>
                )}

                {languageMode === 'original' && (
                  <div className="space-y-2">
                    <div className="relative pl-4 border-l-2 border-slate-300">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-sans font-semibold">
                        <span>Tekst w oryginale ({com.originalLanguage})</span>
                      </div>
                      <p className="font-scripture text-base text-sky-900 leading-relaxed italic select-all">
                        «{com.originalText}»
                      </p>
                    </div>
                  </div>
                )}

                {languageMode === 'parallel' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Original */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-bold">
                        Oryginał ({com.originalLanguage}):
                      </div>
                      <p className="font-scripture text-xs sm:text-sm text-sky-950 leading-relaxed italic">
                        «{com.originalText}»
                      </p>
                    </div>

                    {/* Polish */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-bold">
                        Przekład na język polski:
                      </div>
                      <p className="font-scripture text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                        «{com.polishTranslation}»
                      </p>
                    </div>
                  </div>
                )}

                {/* Spiritual Insight Box */}
                {com.spiritualInsight && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-sans uppercase tracking-wider text-amber-900 font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-700" />
                        Wgląd Duchowy dla Skrutacji:
                      </span>
                      <p className="text-amber-950 leading-relaxed">
                        {com.spiritualInsight}
                      </p>
                    </div>

                    {onInsertInsightToNotes && (
                      <button
                        onClick={() => onInsertInsightToNotes(`${com.author} (${com.workTitle}): ${com.polishTranslation} [${com.spiritualInsight}]`)}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-sans uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-xs"
                        title="Dodaj ten wgląd do Twoich notatek z modlitwy"
                      >
                        + Do notatek
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
