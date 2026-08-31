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
    } catch (err) {
      console.warn('Patristic fallback activated for:', sig, err);
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
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D3524]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#C5A059] font-medium">
              Tradycja Patrystyczna i Języki Biblijne
            </span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-light text-[#E0E0D6] tracking-wide flex items-center gap-2">
            <Scroll className="w-4 h-4 text-[#C5A059]" />
            Komentarze Ojców Kościoła (Catena Aurea)
          </h3>
          <p className="text-xs text-[#8C8270] font-sans mt-0.5">
            Dla wersetu: <strong className="text-[#C5A059] font-mono">{siglum}</strong>
          </p>
        </div>

        {/* Controls: Language mode toggle & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg p-0.5 bg-[#0F0F12] border border-[#3D3524]">
            <button
              id="lang-mode-pl-btn"
              onClick={() => setLanguageMode('pl')}
              className={`px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider rounded transition-colors cursor-pointer ${
                languageMode === 'pl'
                  ? 'bg-[#3D3524] text-[#C5A059] font-semibold'
                  : 'text-[#8C8270] hover:text-[#E0E0D6]'
              }`}
            >
              Polski
            </button>
            <button
              id="lang-mode-orig-btn"
              onClick={() => setLanguageMode('original')}
              className={`px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider rounded transition-colors cursor-pointer ${
                languageMode === 'original'
                  ? 'bg-[#3D3524] text-[#C5A059] font-semibold'
                  : 'text-[#8C8270] hover:text-[#E0E0D6]'
              }`}
            >
              Oryginał
            </button>
            <button
              id="lang-mode-parallel-btn"
              onClick={() => setLanguageMode('parallel')}
              className={`px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider rounded transition-colors cursor-pointer ${
                languageMode === 'parallel'
                  ? 'bg-[#3D3524] text-[#C5A059] font-semibold'
                  : 'text-[#8C8270] hover:text-[#E0E0D6]'
              }`}
            >
              Bilingwistyczny
            </button>
          </div>

          <button
            id="refresh-patristics-btn"
            onClick={() => fetchCommentaries(siglum, verseText)}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-[#141417] border border-[#3D3524] hover:border-[#C5A059] text-[#8C8270] hover:text-[#C5A059] transition-colors cursor-pointer disabled:opacity-50"
            title="Odśwież lub poszukaj więcej komentarzy Ojców"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C5A059]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-8 rounded-xl bg-[#141417] border border-[#3D3524] text-center space-y-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-[#1a1a1e] border border-[#3D3524] mx-auto flex items-center justify-center text-[#C5A059]">
            <Scroll className="w-5 h-5 animate-spin" />
          </div>
          <p className="font-display text-sm text-[#C5A059]">
            Przeszukiwanie pism Ojców Kościoła i tekstów oryginalnych...
          </p>
          <p className="text-xs text-[#8C8270]">
            (Św. Augustyn, Św. Jan Chryzostom, Św. Hieronim, Catena Aurea św. Tomasza)
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-4 rounded-xl bg-[#1a1a1e] border border-red-900/50 text-red-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchCommentaries(siglum, verseText)}
            className="px-2 py-1 bg-red-950/60 rounded border border-red-800 text-[11px] hover:text-white"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}

      {/* Original Scripture Inspector Card */}
      {!isLoading && originalScripture && (
        <div className="p-5 rounded-xl bg-[#141417] border border-[#3D3524] space-y-4">
          <div className="flex items-center justify-between border-b border-[#3D3524] pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-sans uppercase tracking-widest text-[#C5A059] font-semibold">
                Tekst Pierwotny i Wulgata ({originalScripture.originalLanguage})
              </span>
            </div>
            <span className="font-mono text-xs text-[#8C8270]">{originalScripture.siglum}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Scripture Script */}
            <div className="p-4 rounded-lg bg-[#0F0F12] border border-[#3D3524] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C8270]">
                  Język Oryginalny ({originalScripture.originalLanguage})
                </span>
                <span className="text-[10px] text-[#C5A059] font-mono">Font biblijny</span>
              </div>
              <p className="text-lg font-scripture text-[#E0E0D6] leading-relaxed italic select-all" dir={originalScripture.originalLanguage === 'Hebrajski' ? 'rtl' : 'ltr'}>
                {originalScripture.originalScript}
              </p>
              <p className="text-xs font-mono text-[#8C8270] italic pt-1 border-t border-[#3D3524]/60">
                Transliteracja: {originalScripture.transliteration}
              </p>
            </div>

            {/* Latin Vulgate */}
            <div className="p-4 rounded-lg bg-[#0F0F12] border border-[#3D3524] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C8270]">
                  Biblia Sacra Vulgata (Łacina)
                </span>
                <span className="text-[10px] text-[#C5A059] font-serif">św. Hieronim</span>
              </div>
              <p className="text-base font-scripture text-[#E0E0D6] leading-relaxed italic select-all">
                «{originalScripture.latinVulgate}»
              </p>
              <p className="text-xs text-[#8C8270] pt-1 border-t border-[#3D3524]/60">
                Polski (BT/BJ): «{originalScripture.polishText}»
              </p>
            </div>
          </div>

          {/* Interlinear vocabulary pill list */}
          {originalScripture.interlinearWords && originalScripture.interlinearWords.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C8270] block mb-2">
                Słownik wersetu (analiza morfologiczna i słowa kluczowe):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {originalScripture.interlinearWords.map((word, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#1a1a1e] border border-[#3D3524] text-center space-y-0.5">
                    <div className="font-scripture text-sm text-[#C5A059]">{word.original}</div>
                    <div className="text-[10px] font-mono text-[#8C8270]">{word.transliteration}</div>
                    <div className="text-[11px] font-medium text-[#E0E0D6]">{word.polish}</div>
                    {word.grammarNote && (
                      <div className="text-[9px] text-[#8C8270] truncate" title={word.grammarNote}>
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
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-[#C5A059] font-medium">
              Komentarze Ojców i Tradycji ({commentaries.length})
            </span>
            <span className="text-[11px] text-[#8C8270]">
              Zmysł: dosłowny, alegoryczny, moralny i anagogiczny
            </span>
          </div>

          <div className="space-y-4">
            {commentaries.map((com) => (
              <div
                key={com.id}
                id={`patristic-commentary-${com.id}`}
                className="p-5 rounded-xl bg-[#141417] border border-[#3D3524] hover:border-[#C5A059]/60 transition-all space-y-3 group"
              >
                {/* Author & Work Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3D3524] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-[#1a1a1e] border border-[#3D3524] flex items-center justify-center text-[#C5A059]">
                      <Feather className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-medium text-sm text-[#E0E0D6]">
                          {com.author}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1e] border border-[#3D3524] text-[#8C8270] font-sans">
                          {com.century}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8C8270] font-serif italic">
                        {com.workTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1a1a1e] border border-[#3D3524] text-[#C5A059] font-mono">
                      {com.theologicalSense}
                    </span>

                    <button
                      onClick={() => copyToClipboard(com.id, `${com.author} (${com.workTitle}):\n${com.polishTranslation}\n\nWgląd: ${com.spiritualInsight}`)}
                      className="p-1 rounded text-[#8C8270] hover:text-[#C5A059] transition-colors"
                      title="Kopiuj cytat"
                    >
                      {copiedId === com.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Content according to Language Mode */}
                {languageMode === 'pl' && (
                  <div className="space-y-2">
                    <div className="relative pl-4 border-l-2 border-[#C5A059]">
                      <p className="font-scripture text-sm sm:text-base text-[#E0E0D6] leading-relaxed italic">
                        {com.polishTranslation}
                      </p>
                    </div>
                  </div>
                )}

                {languageMode === 'original' && (
                  <div className="space-y-2">
                    <div className="relative pl-4 border-l-2 border-[#8C8270]">
                      <div className="flex items-center justify-between text-[10px] text-[#8C8270] uppercase tracking-wider mb-1 font-sans">
                        <span>Tekst w oryginale ({com.originalLanguage})</span>
                      </div>
                      <p className="font-scripture text-sm sm:text-base text-[#C5A059] leading-relaxed italic select-all">
                        {com.originalText}
                      </p>
                    </div>
                  </div>
                )}

                {languageMode === 'parallel' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Original */}
                    <div className="p-3.5 rounded bg-[#0F0F12] border border-[#3D3524] space-y-1.5">
                      <div className="text-[10px] font-sans uppercase tracking-widest text-[#8C8270]">
                        Oryginał ({com.originalLanguage}):
                      </div>
                      <p className="font-scripture text-xs sm:text-sm text-[#C5A059] leading-relaxed italic">
                        {com.originalText}
                      </p>
                    </div>

                    {/* Polish */}
                    <div className="p-3.5 rounded bg-[#0F0F12] border border-[#3D3524] space-y-1.5">
                      <div className="text-[10px] font-sans uppercase tracking-widest text-[#C5A059]">
                        Przekład na język polski:
                      </div>
                      <p className="font-scripture text-xs sm:text-sm text-[#E0E0D6] leading-relaxed italic">
                        {com.polishTranslation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Spiritual Insight Box */}
                {com.spiritualInsight && (
                  <div className="p-3 rounded-lg bg-[#0F0F12] border border-[#3D3524] flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-sans uppercase tracking-wider text-[#C5A059] font-semibold flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#C5A059]" />
                        Wgląd Duchowy dla Skrutacji:
                      </span>
                      <p className="text-[#8C8270] leading-relaxed">
                        {com.spiritualInsight}
                      </p>
                    </div>

                    {onInsertInsightToNotes && (
                      <button
                        onClick={() => onInsertInsightToNotes(`${com.author} (${com.workTitle}): ${com.polishTranslation} [${com.spiritualInsight}]`)}
                        className="shrink-0 px-2.5 py-1 rounded bg-[#1a1a1e] hover:bg-[#3D3524] border border-[#3D3524] text-[#C5A059] text-[10px] font-sans uppercase tracking-wider transition-colors cursor-pointer"
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
