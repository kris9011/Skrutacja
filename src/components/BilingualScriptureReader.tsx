import React, { useState, useEffect } from 'react';
import { 
  Languages, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  RotateCw, 
  Search, 
  X, 
  BookmarkPlus, 
  Copy, 
  Check, 
  Volume2, 
  ExternalLink,
  HelpCircle,
  Flame,
  Layers,
  FileText
} from 'lucide-react';
import { BiblicalLexiconEntry, BiblicalWordOccurrence, findBiblicalLexiconEntry } from '../data/biblicalLexiconDatabase';

export type ScriptureDisplayMode = 'polski' | 'oryginal' | 'bilingwistyczny';

interface BilingualScriptureReaderProps {
  siglum: string;
  polishText: string;
  originalGreekText?: string;
  originalHebrewText?: string;
  latinVulgateText?: string;
  liturgicalIntroduction?: string;
  theologicalTheme?: string;
  onSelectWordForScrutation?: (occurrenceSiglum: string, occurrenceText: string, word: string) => void;
  onOpenFullScrutation?: (siglum: string, text: string) => void;
  className?: string;
}

export const BilingualScriptureReader: React.FC<BilingualScriptureReaderProps> = ({
  siglum,
  polishText,
  originalGreekText,
  originalHebrewText,
  latinVulgateText,
  liturgicalIntroduction,
  theologicalTheme,
  onSelectWordForScrutation,
  onOpenFullScrutation,
  className = ''
}) => {
  const [displayMode, setDisplayMode] = useState<ScriptureDisplayMode>('polski');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [lexiconData, setLexiconData] = useState<BiblicalLexiconEntry | null>(null);
  const [isLoadingLexicon, setIsLoadingLexicon] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);

  // Dynamic full original scripture details
  const [fetchedOriginal, setFetchedOriginal] = useState<{
    originalScript?: string;
    transliteration?: string;
    latinVulgate?: string;
    originalLanguage?: string;
    interlinearWords?: Array<{ original: string; transliteration: string; polish: string; grammarNote?: string }>;
  } | null>(null);
  const [isLoadingOriginal, setIsLoadingOriginal] = useState<boolean>(false);

  // Clean and split words for interactive selection - tokens keep natural spacing and attached punctuation
  const rawWords = polishText.trim().split(/\s+/).filter(Boolean);

  const isOldTestament = Boolean(
    originalHebrewText || 
    ['Rdz', 'Wj', 'Kpł', 'Lb', 'Pwt', 'Joz', 'Sdz', 'Rt', '1 Sm', '2 Sm', '1 Krl', '2 Krl', '1 Krn', '2 Krn', 'Ezd', 'Ne', 'Tb', 'Jdt', 'Est', '1 Mch', '2 Mch', 'Hi', 'Ps', 'Prz', 'Koh', 'Pnp', 'Mdr', 'Syr', 'Iz', 'Jr', 'Lm', 'Ba', 'Ez', 'Dn', 'Oz', 'Jl', 'Am', 'Ab', 'Jon', 'Mi', 'Na', 'Hab', 'Sof', 'Ag', 'Za', 'Mal'].some(b => siglum.startsWith(b))
  );

  // Automatically fetch full unabridged original text when entering 'oryginal' or 'bilingwistyczny' mode
  useEffect(() => {
    if ((displayMode === 'oryginal' || displayMode === 'bilingwistyczny') && !fetchedOriginal && !isLoadingOriginal) {
      // If we already have complete unabridged text without ellipsis, use it
      const hasCompleteGreek = originalGreekText && originalGreekText.length > 80 && !originalGreekText.includes('...');
      const hasCompleteHebrew = originalHebrewText && originalHebrewText.length > 80 && !originalHebrewText.includes('...');
      if (hasCompleteGreek || hasCompleteHebrew) return;

      setIsLoadingOriginal(true);
      fetch('/api/scrutation/original-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siglum, text: polishText })
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.originalScript) {
            setFetchedOriginal(data);
          }
        })
        .catch(err => {
          console.warn('Original text fetch error:', err);
        })
        .finally(() => {
          setIsLoadingOriginal(false);
        });
    }
  }, [displayMode, siglum, polishText, originalGreekText, originalHebrewText, fetchedOriginal, isLoadingOriginal]);

  // Determine active full original text
  const activeOriginalText = 
    fetchedOriginal?.originalScript ||
    (originalGreekText && !originalGreekText.endsWith('...') ? originalGreekText : null) || 
    (originalHebrewText && !originalHebrewText.endsWith('...') ? originalHebrewText : null) || 
    fetchedOriginal?.originalScript ||
    (isOldTestament 
      ? 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃ וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי־אוֹר׃' 
      : 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος. οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν θεόν. πάντα διʼ αὐτοῦ ἐγένετο, καὶ χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἕν. ὃ γέγονεν ἐν αὐτῷ ζωὴ ἦν, καὶ ἡ ζωὴ ἦν τὸ φῶς τῶν ἀνθρώπων· καὶ τὸ φῶς ἐν τῇ σκοτίᾳ φαίνει, καὶ ἡ σκοτία αὐτὸ οὐ κατέλαβεν.');

  const activeLatinText = 
    fetchedOriginal?.latinVulgate || 
    latinVulgateText || 
    (isOldTestament 
      ? 'In principio creavit Deus caelum et terram. Terra autem erat inanis et vacua, et tenebrae super faciem abyssi, et spiritus Dei ferebatur super aquas.' 
      : 'In principio erat Verbum, et Verbum erat apud Deum, et Deus erat Verbum. Hoc erat in principio apud Deum. Omnia per ipsum facta sunt, et sine ipso factum est nihil.');

  const activeTransliteration = fetchedOriginal?.transliteration;

  // Handle word click
  const handleWordClick = async (word: string) => {
    const trimmed = word.trim().replace(/[.,;!?:«»"()—]/g, '');
    if (!trimmed || trimmed.length < 2) return;

    setSelectedWord(trimmed);
    setIsLoadingLexicon(true);

    // Initial instant preview from local database
    const localEntry = findBiblicalLexiconEntry(trimmed, siglum);
    setLexiconData(localEntry);

    try {
      const response = await fetch('/api/scrutation/word-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: trimmed,
          verseSiglum: siglum,
          verseText: polishText
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLexiconData(data);
      }
    } catch (e) {
      console.warn('Word lookup API error, using local database:', e);
    } finally {
      setIsLoadingLexicon(false);
    }
  };

  // Reset view to default
  const handleReset = () => {
    setDisplayMode('polski');
    setSelectedWord(null);
    setLexiconData(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Header with Pill Switcher matching user request */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-50/80 p-2 sm:p-3 rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs shrink-0">
            {siglum}
          </span>
          <span className="text-xs font-sans text-slate-600 truncate hidden sm:inline">
            Kliknij dowolne słowo, aby odkryć rdzeń i występowanie w Biblii
          </span>
        </div>

        {/* The Exact Pill Toggle Design: [ POLSKI | ORYGINAŁ | BILINGWISTYCZNY ] (⟳) */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center p-0.5 sm:p-1 bg-slate-200/70 backdrop-blur-xs rounded-full border border-slate-300 shadow-inner w-full sm:w-auto justify-around sm:justify-start">
            <button
              type="button"
              onClick={() => setDisplayMode('polski')}
              className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                displayMode === 'polski'
                  ? 'bg-white text-emerald-950 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Polski
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('oryginal')}
              className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                displayMode === 'oryginal'
                  ? 'bg-white text-emerald-950 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Oryginał
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('bilingwistyczny')}
              className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                displayMode === 'bilingwistyczny'
                  ? 'bg-white text-emerald-950 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Bilingwistyczny
            </button>
          </div>

          {/* Reset / Reload Button */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 sm:p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-300 transition-all cursor-pointer shadow-2xs shrink-0"
            title="Zresetuj widok i odznacz słowo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Liturgical Introduction if present */}
      {liturgicalIntroduction && (
        <p className="text-xs font-sans italic text-slate-500 border-l-2 border-emerald-600 pl-3 py-0.5">
          {liturgicalIntroduction}
        </p>
      )}

      {/* 1. MODE: POLSKI (Interactive Word by Word) */}
      {displayMode === 'polski' && (
        <div className="p-4 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="font-scripture text-base sm:text-xl text-slate-900 leading-relaxed sm:leading-loose">
            «
            {rawWords.map((token, idx) => {
              const match = token.match(/^([«„"'(]*)(.*?)([.,;!?:»”"')—]*)$/);
              const leadingPunct = match ? match[1] : '';
              const coreToken = match ? match[2] : token;
              const trailingPunct = match ? match[3] : '';
              const isWord = /^[a-zęóąśłżźćńA-ZĘÓĄŚŁŻŹĆŃ0-9]+$/.test(coreToken);
              const isSelected = isWord && selectedWord?.toLowerCase() === coreToken.toLowerCase();

              return (
                <span key={idx} className="inline">
                  {leadingPunct}
                  {isWord ? (
                    <span
                      onClick={() => handleWordClick(coreToken)}
                      onMouseEnter={() => setHoveredWordIndex(idx)}
                      onMouseLeave={() => setHoveredWordIndex(null)}
                      className={`inline cursor-pointer px-0.5 py-0.5 rounded transition-all duration-150 ${
                        isSelected
                          ? 'bg-emerald-200 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-400'
                          : hoveredWordIndex === idx
                          ? 'bg-emerald-50 text-emerald-900 underline decoration-emerald-500 decoration-2 underline-offset-4'
                          : 'hover:bg-slate-100 hover:text-slate-950'
                      }`}
                      title="Kliknij, aby sprawdzić znaczenie w grece/hebrajskim i występowanie w Biblii"
                    >
                      {coreToken}
                    </span>
                  ) : (
                    <span>{coreToken}</span>
                  )}
                  {trailingPunct}
                  {idx < rawWords.length - 1 ? ' ' : ''}
                </span>
              );
            })}
            »
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Wskazówka: kliknij dowolne słowo powyżej, aby otworzyć aparat filologiczny.</span>
            </span>
            <button
              type="button"
              onClick={() => handleCopy(polishText)}
              className="hover:text-emerald-700 flex items-center gap-1 font-sans cursor-pointer shrink-0"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{isCopied ? 'Skopiowano' : 'Kopiuj całość'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MODE: ORYGINAŁ (Greek / Hebrew / Vulgate) */}
      {displayMode === 'oryginal' && (
        <div className="p-5 sm:p-7 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-6">
          {/* Primary Original Text (Greek or Hebrew) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-emerald-950 font-bold pb-1 border-b border-emerald-100">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                {isOldTestament ? 'Tekst Masorecki (Biblia Hebraica Stuttgartensia)' : 'Novum Testamentum Graece (Nestle-Aland 28)'}
              </span>
              <span className="text-slate-500 text-[11px]">Tekst Natchniony</span>
            </div>

            {isLoadingOriginal && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-pulse">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Wczytywanie pełnego tekstu oryginalnego (Nestle-Aland 28 / BHS)...</span>
              </div>
            )}

            <div 
              className={`p-4 sm:p-5 rounded-xl bg-emerald-50/40 border border-emerald-100 ${
                isOldTestament ? 'text-right font-serif text-2xl leading-loose' : 'font-serif text-xl sm:text-2xl leading-relaxed text-slate-900'
              }`}
              dir={isOldTestament ? 'rtl' : 'ltr'}
            >
              {activeOriginalText.split(' ').map((origWord, idx) => {
                const clean = origWord.replace(/[.,;·«»׃]/g, '');
                return (
                  <span
                    key={idx}
                    onClick={() => handleWordClick(clean)}
                    className="inline-block px-1.5 py-0.5 rounded cursor-pointer hover:bg-emerald-200 hover:text-emerald-950 transition-colors mx-0.5"
                    title={`Kliknij słowo "${clean}", aby zbadać w słowniku i konkordancji`}
                  >
                    {origWord}
                  </span>
                );
              })}
            </div>

            {/* Transliteration if available */}
            {activeTransliteration && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-0.5">
                  Transliteracja fonetyczna:
                </span>
                <p className="font-mono text-xs text-slate-700 italic leading-relaxed">
                  {activeTransliteration}
                </p>
              </div>
            )}
          </div>

          {/* Latin Vulgate */}
          {activeLatinText && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="text-xs font-mono uppercase font-bold text-slate-600 flex items-center justify-between">
                <span>Biblia Sacra Vulgata (św. Hieronim):</span>
                <span className="text-slate-400">Tradycja Zachodnia</span>
              </div>
              <p className="font-serif italic text-base text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {activeLatinText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. MODE: BILINGWISTYCZNY (Interlinear / Word-by-Word Analysis) */}
      {displayMode === 'bilingwistyczny' && (
        <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-300 shadow-2xs space-y-4">
          <div className="flex items-center justify-between text-xs font-sans uppercase font-bold text-slate-800 pb-2 border-b border-slate-200">
            <span className="flex items-center gap-1.5 text-emerald-950">
              <Layers className="w-4 h-4 text-emerald-700" />
              Układ Interlinearny (Słowo w słowo)
            </span>
            <span className="text-slate-500 font-normal">Kliknij blok, aby wyświetlić konkordancję</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {rawWords
              .map(w => w.replace(/^[«„"'(]+|[.,;!?:»”"')—]+$/g, ''))
              .filter(w => /^[a-zęóąśłżźćńA-ZĘÓĄŚŁŻŹĆŃ0-9]+$/.test(w))
              .map((word, wIdx) => {
              const previewLex = findBiblicalLexiconEntry(word, siglum);
              const isSelected = selectedWord?.toLowerCase() === word.toLowerCase();

              return (
                <div
                  key={wIdx}
                  onClick={() => handleWordClick(word)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-100/90 border-emerald-400 ring-2 ring-emerald-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-emerald-50/70 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {previewLex.strongNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans truncate">
                      {previewLex.originalLanguage.split(' ')[0]}
                    </span>
                  </div>

                  {/* Original script */}
                  <div className="font-serif text-base font-bold text-slate-900">
                    {previewLex.originalWord}
                  </div>

                  {/* Transliteration */}
                  <div className="font-mono text-[11px] text-slate-500 italic">
                    {previewLex.transliteration}
                  </div>

                  {/* Polish Translation */}
                  <div className="font-sans text-xs font-bold text-emerald-950 pt-1 border-t border-slate-200/80">
                    {word}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WORD LEXICON & SCRIPTURE OCCURRENCES DRAWER / MODAL */}
      {selectedWord && lexiconData && (
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 border-2 border-emerald-300 shadow-md space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-emerald-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-sans font-bold bg-emerald-700 text-white uppercase tracking-wider">
                  Słownik Stronga & Konkordancja
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-white border border-emerald-300 text-emerald-900">
                  {lexiconData.strongNumber}
                </span>
                <span className="text-xs font-sans text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {lexiconData.originalLanguage}
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  {lexiconData.originalWord}
                </h3>
                <span className="font-mono text-sm sm:text-base text-slate-600 italic">
                  ({lexiconData.transliteration})
                </span>
                <span className="font-sans text-lg sm:text-xl font-bold text-emerald-900">
                  = «{lexiconData.wordPolish}»
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedWord(null)}
              className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
              title="Zamknij szczegóły słowa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Morphological & Lexical Meaning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-[11px] font-sans uppercase tracking-wider text-slate-500 font-bold block">
                Część mowy & Znaczenie rdzenia:
              </span>
              <p className="text-xs font-mono font-semibold text-emerald-900">
                {lexiconData.partOfSpeech}
              </p>
              <p className="font-sans text-sm text-slate-800 leading-relaxed font-medium">
                {lexiconData.rootMeaning}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-[11px] font-sans uppercase tracking-wider text-slate-500 font-bold block">
                Kontekst Teologiczny & Częstotliwość:
              </span>
              <p className="text-xs font-mono text-slate-600">
                {lexiconData.biblicalFrequency}
              </p>
              <p className="font-sans text-sm text-slate-700 leading-relaxed">
                {lexiconData.theologicalSignificance}
              </p>
            </div>
          </div>

          {/* Definition */}
          <div className="p-4 rounded-2xl bg-white/90 border border-emerald-100 space-y-1">
            <span className="text-[11px] font-sans uppercase tracking-wider text-emerald-900 font-bold">
              Szczegółowa definicja biblijna:
            </span>
            <p className="font-serif text-sm text-slate-800 leading-relaxed italic">
              {lexiconData.detailedDefinition}
            </p>
          </div>

          {/* OCCURRENCES IN SCRIPTURE - The heart of Scrutatio by Word! */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <h4 className="font-sans text-sm uppercase tracking-wider font-bold text-slate-900">
                  Gdzie to słowo występuje w Piśmie Świętym? (Konkordancja tematyczna)
                </h4>
              </div>
              <span className="text-xs text-slate-500">
                Wybierz werset, aby kontynuować skrutację
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {lexiconData.occurrences.map((occ, oIdx) => (
                <div
                  key={oIdx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {occ.siglum}
                      </span>
                      <span className="text-[11px] font-sans text-slate-500 font-medium">
                        {occ.bookName} ({occ.testament})
                      </span>
                    </div>

                    <p className="font-scripture text-sm text-slate-900 leading-relaxed">
                      «{occ.text}»
                    </p>

                    {occ.contextNote && (
                      <p className="text-[11px] font-sans text-slate-500 italic">
                        {occ.contextNote}
                      </p>
                    )}
                  </div>

                  {/* Action Button: Start Scrutation from this occurrence */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(`${occ.siglum}: «${occ.text}»`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Skopiuj werset"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectWordForScrutation) {
                          onSelectWordForScrutation(occ.siglum, occ.text, lexiconData.wordPolish);
                        } else if (onOpenFullScrutation) {
                          onOpenFullScrutation(occ.siglum, occ.text);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-sans font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ml-auto"
                    >
                      <span>Skrutuj ten werset</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
