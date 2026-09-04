import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  ChevronRight, 
  Filter,
  Sparkles,
  Compass,
  Check,
  Copy
} from 'lucide-react';
import { 
  BIBLICAL_LEXICON_DATABASE, 
  BiblicalLexiconEntry 
} from '../data/biblicalLexiconDatabase';
import { 
  PRESEEDED_INTERLINEAR_VERSES, 
  InterlinearVerseData, 
  InterlinearColumnData,
  getOrGenerateInterlinearVerse 
} from '../data/interlinearDatabase';
import { InterlinearStrongDictionaryView } from './InterlinearStrongDictionaryView';
import { ParsedVerse } from '../utils/bibleVerseParser';

interface BiblicalDictionaryPageProps {
  onSelectWordForScrutation?: (siglum: string, text: string, keyword: string) => void;
  onOpenWordModal?: (word: string, strongNumber?: string) => void;
  currentPassageSiglum?: string;
  currentPassageText?: string;
  onOpenScrutationSiglum?: (siglum: string) => void;
}

export const BiblicalDictionaryPage: React.FC<BiblicalDictionaryPageProps> = ({
  onSelectWordForScrutation,
  onOpenWordModal,
  currentPassageSiglum = '1 Kor 4, 1-5',
  currentPassageText = 'Niechaj uważają nas ludzie za sługi Chrystusa i za szafarzy tajemnic Bożych! A od szafarzy już tutaj się żąda, aby każdy z nich był uznany za wiernego.',
  onOpenScrutationSiglum
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'ST' | 'NT'>('all');
  const [activeDictionaryTab, setActiveDictionaryTab] = useState<'interlinear' | 'lexicon'>('interlinear');
  const [selectedSiglum, setSelectedSiglum] = useState<string>(
    PRESEEDED_INTERLINEAR_VERSES[currentPassageSiglum] ? currentPassageSiglum : '1 Kor 4, 1'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Available sample interlinear passages to inspect
  const samplePassages = [
    { siglum: '1 Kor 4, 1', label: '1 Kor 4, 1 (Szafarze tajemnic Bożych)' },
    { siglum: '1 Kor 4, 2', label: '1 Kor 4, 2 (Wierność szafarza)' },
    { siglum: 'J 1, 1', label: 'J 1, 1 (Na początku było Słowo - Logos)' },
    { siglum: 'Rdz 1, 1', label: 'Rdz 1, 1 (Bereszit bara Elohim - Stworzenie)' },
    { siglum: 'Ps 23, 1', label: 'Ps 23, 1 (Pan jest moim pasterzem)' }
  ];

  // Search through all lexicon entries
  const allEntries: BiblicalLexiconEntry[] = useMemo(() => {
    return Object.values(BIBLICAL_LEXICON_DATABASE);
  }, []);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allEntries.filter(entry => {
      // Filter by testament
      if (testamentFilter === 'ST' && !entry.originalLanguage.includes('Hebrajski')) return false;
      if (testamentFilter === 'NT' && !entry.originalLanguage.includes('Greka')) return false;

      if (!q) return true;

      const matchesPolish = entry.wordPolish.toLowerCase().includes(q);
      const matchesStrong = entry.strongNumber.toLowerCase().includes(q);
      const matchesOriginal = entry.originalWord.toLowerCase().includes(q);
      const matchesTranslit = entry.transliteration.toLowerCase().includes(q);
      const matchesDef = entry.detailedDefinition.toLowerCase().includes(q);
      const matchesOccurrences = entry.occurrences.some(o => 
        o.siglum.toLowerCase().includes(q) || o.text.toLowerCase().includes(q)
      );

      return matchesPolish || matchesStrong || matchesOriginal || matchesTranslit || matchesDef || matchesOccurrences;
    });
  }, [allEntries, searchQuery, testamentFilter]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate parsed verses for active selected passage
  const currentInterlinearVerses: ParsedVerse[] = useMemo(() => {
    // If 1 Kor 4 is selected, provide all 5 pre-seeded verses for seamless [Wstecz]/[Dalej] navigation
    if (selectedSiglum.includes('1 Kor 4')) {
      return [1, 2, 3, 4, 5].map(v => {
        const vKey = `1 Kor 4, ${v}`;
        const raw = PRESEEDED_INTERLINEAR_VERSES[vKey];
        return {
          verseNum: v,
          siglum: `1 Kor 4, ${v}`,
          text: raw?.annotatedPolishText.replace(/[ᵃᵇᶜᵈᵉᶠ]/g, '') || '',
          words: raw?.columns.map(c => c.primaryMeaning) || []
        };
      });
    }

    const raw = PRESEEDED_INTERLINEAR_VERSES[selectedSiglum];
    if (raw) {
      return [{
        verseNum: raw.verseNum,
        siglum: raw.siglum,
        text: raw.annotatedPolishText.replace(/[ᵃᵇᶜᵈᵉᶠ]/g, ''),
        words: raw.columns.map(c => c.primaryMeaning)
      }];
    }
    return [{
      verseNum: 1,
      siglum: selectedSiglum,
      text: currentPassageText,
      words: currentPassageText.split(/\s+/).filter(Boolean)
    }];
  }, [selectedSiglum, currentPassageText]);

  return (
    <div id="biblical-dictionary-page" className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* HEADER HERO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white shadow-xl border border-amber-300/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-bold bg-amber-400 text-stone-950 uppercase tracking-wider">
                Słownik Stronga & Aparat Interlinearny
              </span>
              <span className="text-xs font-mono text-emerald-300">
                Biblia Hebrajska (BHS) • Nestle-Aland 28 • Wulgata
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Rozszerzony Słownik Biblijny i Konkordancja
            </h1>
            <p className="font-sans text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Szczegółowa analiza filologiczna każdego wersetu: numeracja Stronga, części mowy, rdzeń semicki lub grecki, transliteracja oraz wystąpienia w kanonie Pisma Świętego.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20 shrink-0">
            <button
              type="button"
              id="dict-tab-interlinear-btn"
              onClick={() => setActiveDictionaryTab('interlinear')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeDictionaryTab === 'interlinear'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Układ Interlinearny (Screen 2)</span>
            </button>
            <button
              type="button"
              id="dict-tab-lexicon-btn"
              onClick={() => setActiveDictionaryTab('lexicon')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeDictionaryTab === 'lexicon'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Indeks Haseł Stronga ({allEntries.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: INTERLINEAR BIBLE VERSE EXPLORER (MODELED AFTER SCREEN 2) */}
      {activeDictionaryTab === 'interlinear' && (
        <div className="space-y-6">
          {/* Quick Passage Selector */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-sans font-bold text-stone-700">
                Wybierz werset do analizy:
              </span>
              {samplePassages.map(p => (
                <button
                  key={p.siglum}
                  type="button"
                  onClick={() => setSelectedSiglum(p.siglum)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
                    selectedSiglum === p.siglum
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
                  }`}
                >
                  {p.siglum}
                </button>
              ))}
            </div>

            {onOpenScrutationSiglum && (
              <button
                type="button"
                onClick={() => onOpenScrutationSiglum(selectedSiglum)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer ml-auto"
              >
                <span>Rozpocznij skrutację tego wersetu</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </button>
            )}
          </div>

          {/* Interlinear Component */}
          <InterlinearStrongDictionaryView
            siglum={selectedSiglum}
            parsedVerses={currentInterlinearVerses}
            onWordClick={(w) => onOpenWordModal?.(w)}
            onOpenWordModal={(w, s) => onOpenWordModal?.(w, s)}
            onPassageChange={(newSig) => setSelectedSiglum(newSig)}
          />
        </div>
      )}

      {/* VIEW 2: SEARCHABLE STRONG CONCORDANCE & LEXICON */}
      {activeDictionaryTab === 'lexicon' && (
        <div className="space-y-6">
          {/* SEARCH & FILTER CONTROLS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="strong-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Szukaj po polsku (np. szafarz, miłość), numerze Stronga (np. G3623, H1254) lub grece..."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-sans text-stone-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden transition-colors"
                />
              </div>

              {/* Testament Filters */}
              <div className="flex items-center gap-1.5 shrink-0 bg-stone-50 p-1 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setTestamentFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                    testamentFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Wszystkie
                </button>
                <button
                  type="button"
                  onClick={() => setTestamentFilter('ST')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                    testamentFilter === 'ST'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Stary Testament (Hebrajski)
                </button>
                <button
                  type="button"
                  onClick={() => setTestamentFilter('NT')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                    testamentFilter === 'NT'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Nowy Testament (Greka)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-sans text-stone-500 pt-1">
              <span>
                Znaleziono <strong className="text-stone-900">{filteredEntries.length}</strong> haseł w zweryfikowanej konkordancji
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-emerald-800 hover:underline cursor-pointer font-semibold"
                >
                  Wyczyść filtr
                </button>
              )}
            </div>
          </div>

          {/* ENTRIES LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                id={`lexicon-entry-${entry.id}`}
                className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-amber-400/80 shadow-2xs hover:shadow-md transition-all duration-150 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">
                        {entry.strongNumber}
                      </span>
                      <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        {entry.originalLanguage}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(`${entry.wordPolish} (${entry.originalWord}, ${entry.strongNumber})`, entry.id)}
                      className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Skopiuj hasło"
                    >
                      {copiedKey === entry.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Word Header */}
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="font-serif text-xl font-bold text-stone-950">
                        {entry.wordPolish}
                      </h3>
                      <span className="font-serif text-lg text-emerald-900 font-semibold" dir="auto">
                        {entry.originalWord}
                      </span>
                      <span className="font-mono text-xs text-stone-500 italic">
                        ({entry.transliteration})
                      </span>
                    </div>
                    <p className="text-xs font-mono text-emerald-700 pt-0.5">
                      {entry.partOfSpeech}
                    </p>
                  </div>

                  {/* Definition */}
                  <p className="font-sans text-xs text-stone-700 line-clamp-3 leading-relaxed">
                    {entry.detailedDefinition}
                  </p>

                  {/* Theological Significance Badge */}
                  {entry.theologicalSignificance && (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] font-sans text-amber-950">
                      <strong className="text-amber-900 block font-semibold mb-0.5">
                        Klucz teologiczny / Typologia:
                      </strong>
                      <span className="line-clamp-2">{entry.theologicalSignificance}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-sans text-stone-500">
                    {entry.occurrences.length} powiązanych wersetów
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenWordModal?.(entry.wordPolish, entry.strongNumber)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-sans text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Zobacz powiązania</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
              <p className="font-serif text-lg font-bold text-stone-800">
                Nie znaleziono haseł dla zapytania «{searchQuery}»
              </p>
              <p className="text-xs font-sans text-stone-500 max-w-md mx-auto">
                Spróbuj wpisać numer Stronga (np. G3623, H1254, G2316) lub ogólne polskie pojęcie biblijne (np. słowo, miłość, krzew, pasterz).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
