import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  HelpCircle, 
  SlidersHorizontal, 
  Volume2, 
  Copy, 
  Check, 
  X, 
  Search 
} from 'lucide-react';
import { ParsedVerse } from '../utils/bibleVerseParser';
import { 
  getOrGenerateInterlinearVerse, 
  PRESEEDED_INTERLINEAR_VERSES, 
  InterlinearColumnData, 
  InterlinearVerseData 
} from '../data/interlinearDatabase';
import { 
  STRONGS_DICTIONARY, 
  getStrongEntry, 
  StrongEntry 
} from '../data/strongsDictionary';
import { BIBLE_BOOKS } from '../data/biblicalData';

interface InterlinearStrongDictionaryViewProps {
  siglum: string;
  parsedVerses: ParsedVerse[];
  onWordClick: (word: string) => void;
  onOpenWordModal?: (word: string, strongNumber?: string) => void;
  onPassageChange?: (siglum: string) => void;
}

// Nazwy ksiąg biblijnych według konwencji biblia.oblubienica.eu (np. Do Koryntian I)
const OBLUBIENICA_BOOK_NAMES: Record<string, string> = {
  '1 Kor': 'Do Koryntian I',
  '2 Kor': 'Do Koryntian II',
  'Rz': 'Do Rzymian',
  'Gal': 'Do Galatów',
  'Ef': 'Do Efezjan',
  'Flp': 'Do Filipian',
  'Kol': 'Do Kolosan',
  '1 Tes': 'Do Tesaloniczan I',
  '2 Tes': 'Do Tesaloniczan II',
  '1 Tm': 'Do Tymoteusza I',
  '2 Tm': 'Do Tymoteusza II',
  'Tt': 'Do Tytusa',
  'Flm': 'Do Filemona',
  'Hbr': 'Do Hebrajczyków',
  'Jk': 'Jakuba',
  '1 P': 'Piotra I',
  '2 P': 'Piotra II',
  '1 J': 'Jana I',
  '2 J': 'Jana II',
  '3 J': 'Jana III',
  'Jud': 'Judy',
  'Mt': 'Ewangelia Mateusza',
  'Mk': 'Ewangelia Marka',
  'Łk': 'Ewangelia Łukasza',
  'J': 'Ewangelia Jana',
  'Dz': 'Dzieje Apostolskie',
  'Ap': 'Objawienie Jana',
  'Rdz': 'Księga Rodzaju',
  'Wj': 'Księga Wyjścia',
  'Kpł': 'Księga Kapłańska',
  'Lb': 'Księga Liczb',
  'Pwt': 'Księga Powtórzonego Prawa',
  'Joz': 'Księga Jozuego',
  'Sdz': 'Księga Sędziów',
  'Rt': 'Księga Rut',
  '1 Sm': 'Księga Samuela I',
  '2 Sm': 'Księga Samuela II',
  '1 Krl': 'Księga Królów I',
  '2 Krl': 'Księga Królów II',
  'Hi': 'Księga Hioba',
  'Ps': 'Księga Psalmów',
  'Prz': 'Księga Przysłów',
  'Koh': 'Księga Koheleta',
  'Pnp': 'Pieśń nad Pieśniami',
  'Iz': 'Księga Izajasza',
  'Jr': 'Księga Jeremiasza',
  'Lm': 'Lamentacje',
  'Ez': 'Księga Ezechiela',
  'Dn': 'Księga Daniela'
};

export const InterlinearStrongDictionaryView: React.FC<InterlinearStrongDictionaryViewProps> = ({
  siglum,
  parsedVerses,
  onWordClick,
  onOpenWordModal,
  onPassageChange
}) => {
  // Rozpoznaj aktywny siglum (Księga, Rozdział, Werset)
  const initialParts = useMemo(() => {
    const match = siglum.match(/^([0-9]?\s?[A-Za-zĄ-ż]+)\s*([0-9]+)?(?:,\s*([0-9]+))?/i);
    const bookSiglum = match ? match[1].trim() : '1 Kor';
    const chapterNum = match && match[2] ? parseInt(match[2], 10) : 4;
    const verseNum = match && match[3] ? parseInt(match[3], 10) : 1;
    return { bookSiglum, chapterNum, verseNum };
  }, [siglum]);

  // Stan wybranego wersetu
  const [selectedVerseIndex, setSelectedVerseIndex] = useState<number>(0);
  const [selectedBookSiglum, setSelectedBookSiglum] = useState<string>(initialParts.bookSiglum);
  const [selectedChapter, setSelectedChapter] = useState<number>(initialParts.chapterNum);
  const [selectedVerse, setSelectedVerse] = useState<number>(initialParts.verseNum);

  // Opcje widoku (wzorzec: przycisk [więcej opcji])
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [showGrammarCodes, setShowGrammarCodes] = useState<boolean>(true);
  const [showSecondaryMeanings, setShowSecondaryMeanings] = useState<boolean>(true);
  const [showPhoneticTranslit, setShowPhoneticTranslit] = useState<boolean>(true);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Modal szczegółów hasła Stronga
  const [activeStrongEntry, setActiveStrongEntry] = useState<StrongEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Aktualny werset z listy parsedVerses lub fallback
  const activeVerse: ParsedVerse = parsedVerses[selectedVerseIndex] || parsedVerses[0] || {
    verseNum: selectedVerse,
    siglum: `${selectedBookSiglum} ${selectedChapter}, ${selectedVerse}`,
    text: 'Tak niech nas ludzie zaliczają: jako podwładnych Chrystusa i odpowiedzialnych za ogłaszanie tajemnic Boga.',
    words: ['Tak', 'niech', 'nas', 'ludzie', 'zaliczają', 'jako', 'podwładnych', 'Chrystusa', 'i', 'odpowiedzialnych', 'tajemnic', 'Boga']
  };

  // Obliczenie aktualnego klucza wersetu do pobrania danych interlinearnych
  const currentVerseSiglum = useMemo(() => {
    return `${selectedBookSiglum} ${selectedChapter}, ${activeVerse.verseNum || selectedVerse}`;
  }, [selectedBookSiglum, selectedChapter, activeVerse.verseNum, selectedVerse]);

  // Pobierz dane interlinearne dla bieżącego wersetu
  const interlinearData: InterlinearVerseData = useMemo(() => {
    return getOrGenerateInterlinearVerse(currentVerseSiglum, activeVerse.verseNum, activeVerse.text);
  }, [currentVerseSiglum, activeVerse.verseNum, activeVerse.text]);

  const canGoPrev = selectedVerseIndex > 0 || selectedVerse > 1;
  const canGoNext = selectedVerseIndex < parsedVerses.length - 1 || selectedVerse < 50;

  const handlePrevVerse = () => {
    if (selectedVerseIndex > 0) {
      setSelectedVerseIndex(prev => prev - 1);
      setSelectedVerse(parsedVerses[selectedVerseIndex - 1]?.verseNum || (selectedVerse - 1));
    } else if (selectedVerse > 1) {
      setSelectedVerse(prev => prev - 1);
    }
  };

  const handleNextVerse = () => {
    if (selectedVerseIndex < parsedVerses.length - 1) {
      setSelectedVerseIndex(prev => prev + 1);
      setSelectedVerse(parsedVerses[selectedVerseIndex + 1]?.verseNum || (selectedVerse + 1));
    } else {
      setSelectedVerse(prev => prev + 1);
    }
  };

  // Otwórz szczegóły hasła Stronga
  const handleOpenStrongModal = (strongNum: string, fallbackWord?: string) => {
    const entry = getStrongEntry(strongNum);
    if (entry) {
      setActiveStrongEntry(entry);
      setIsModalOpen(true);
    } else if (onOpenWordModal) {
      onOpenWordModal(fallbackWord || strongNum, strongNum);
    } else {
      onWordClick(fallbackWord || strongNum);
    }
  };

  // Kopiowanie wersetu z aparatami Stronga
  const handleCopyVerse = () => {
    const textToCopy = `[${currentVerseSiglum}]\nPrzekład dosłowny: ${interlinearData.literalTranslation || interlinearData.annotatedPolishText}\nPrzekład literacki: ${interlinearData.literaryTranslation || activeVerse.text}\nSłowniki:\n` +
      interlinearData.dictionaries.map(d => `${d.letter} <${d.strong}> ${d.definition}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Wybrana księga w nazewnictwie Oblubienicy
  const bookNameDisplay = OBLUBIENICA_BOOK_NAMES[selectedBookSiglum] || 
    BIBLE_BOOKS.find(b => b.siglum.toLowerCase() === selectedBookSiglum.toLowerCase())?.polishName || 
    selectedBookSiglum;

  return (
    <div id="interlinear-strong-view" className="space-y-4 max-w-6xl mx-auto font-sans">
      {/* 1. GÓRNY PASEK NAWIGACJI - IDENTYCZNY JAK NA ZRZUCIE EKRANU IMG_5915.png */}
      <div className="p-3 sm:p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Nawigacja wersetowa: [Wstecz] [Księga] [Rozdział] [Werset] [Dalej] */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Przycisk Wstecz */}
            <button
              id="interlinear-btn-wstecz"
              type="button"
              onClick={handlePrevVerse}
              disabled={!canGoPrev}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                canGoPrev
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 shadow-2xs active:scale-95'
                  : 'bg-stone-50 text-stone-300 border border-stone-200 cursor-not-allowed'
              }`}
              title="Poprzedni werset"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Wstecz</span>
            </button>

            {/* Wybór Księgi */}
            <select
              id="interlinear-select-book"
              value={selectedBookSiglum}
              onChange={(e) => {
                const newBook = e.target.value;
                setSelectedBookSiglum(newBook);
                setSelectedChapter(1);
                setSelectedVerse(1);
                setSelectedVerseIndex(0);
                if (onPassageChange) onPassageChange(`${newBook} 1, 1`);
              }}
              className="bg-white border border-stone-300 text-stone-900 text-xs font-bold py-1.5 px-2.5 rounded-lg hover:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              {Object.entries(OBLUBIENICA_BOOK_NAMES).map(([sig, name]) => (
                <option key={`book-opt-${sig}`} value={sig}>
                  {name}
                </option>
              ))}
            </select>

            {/* Wybór Rozdziału */}
            <select
              id="interlinear-select-chapter"
              value={selectedChapter}
              onChange={(e) => {
                const newChap = Number(e.target.value);
                setSelectedChapter(newChap);
                setSelectedVerse(1);
                setSelectedVerseIndex(0);
                if (onPassageChange) onPassageChange(`${selectedBookSiglum} ${newChap}, 1`);
              }}
              className="bg-white border border-stone-300 text-stone-900 text-xs font-bold py-1.5 px-2 rounded-lg hover:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden cursor-pointer shadow-2xs min-w-[50px] text-center"
            >
              {Array.from({ length: 50 }, (_, i) => i + 1).map((ch) => (
                <option key={`ch-opt-${ch}`} value={ch}>
                  {ch}
                </option>
              ))}
            </select>

            {/* Wybór Wersetu */}
            <select
              id="interlinear-select-verse"
              value={selectedVerseIndex < parsedVerses.length ? selectedVerseIndex : selectedVerse}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < parsedVerses.length) {
                  setSelectedVerseIndex(val);
                  setSelectedVerse(parsedVerses[val]?.verseNum || (val + 1));
                } else {
                  setSelectedVerse(val);
                }
              }}
              className="bg-white border border-stone-300 text-stone-900 text-xs font-bold py-1.5 px-2 rounded-lg hover:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden cursor-pointer shadow-2xs min-w-[50px] text-center"
            >
              {parsedVerses.length > 0 ? (
                parsedVerses.map((v, idx) => (
                  <option key={`interlinear-v-opt-${v.verseNum}-${idx}`} value={idx}>
                    {v.verseNum}
                  </option>
                ))
              ) : (
                Array.from({ length: 30 }, (_, i) => i + 1).map((v) => (
                  <option key={`verse-opt-${v}`} value={v}>
                    {v}
                  </option>
                ))
              )}
            </select>

            {/* Przycisk Dalej */}
            <button
              id="interlinear-btn-dalej"
              type="button"
              onClick={handleNextVerse}
              disabled={!canGoNext}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                canGoNext
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 shadow-2xs active:scale-95'
                  : 'bg-stone-50 text-stone-300 border border-stone-200 cursor-not-allowed'
              }`}
              title="Następny werset"
            >
              <span>Dalej</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Więcej opcji */}
          <div className="flex items-center gap-2">
            <button
              id="interlinear-btn-wiecej-opcji"
              type="button"
              onClick={() => setShowMoreOptions(prev => !prev)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                showMoreOptions 
                  ? 'bg-amber-100 text-amber-950 border-amber-300' 
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
              <span>więcej opcji</span>
            </button>

            <button
              id="interlinear-btn-kopiuj-werset"
              type="button"
              onClick={handleCopyVerse}
              className="p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200 transition-colors"
              title="Kopiuj tekst wersetu z aparatami Stronga"
            >
              {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Panel "więcej opcji" */}
        {showMoreOptions && (
          <div className="mt-3 pt-3 border-t border-stone-200 flex flex-wrap items-center gap-4 text-xs text-stone-700 bg-stone-50/70 p-3 rounded-lg animate-in fade-in duration-150">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showGrammarCodes}
                onChange={(e) => setShowGrammarCodes(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>Pokaż kody gramatyczne</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showSecondaryMeanings}
                onChange={(e) => setShowSecondaryMeanings(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>Pokaż drugie znaczenie</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showPhoneticTranslit}
                onChange={(e) => setShowPhoneticTranslit(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>Transkrypcja fonetyczna</span>
            </label>
          </div>
        )}
      </div>

      {/* 2. PRZEKŁAD DOSŁOWNY: (DOKŁADNIE WEDŁUG IMG_5915.png) */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-sans font-bold text-stone-800">
          Przekład dosłowny:
        </h3>
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-stone-200 text-stone-900 font-serif text-base sm:text-lg leading-relaxed shadow-2xs">
          {interlinearData.literalTranslation || interlinearData.annotatedPolishText}
        </div>
      </div>

      {/* 3. PRZEKŁAD LITERACKI: (DOKŁADNIE WEDŁUG IMG_5915.png) */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-sans font-bold text-stone-800">
          Przekład literacki:
        </h3>
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-stone-200 text-stone-900 font-serif text-base sm:text-lg leading-relaxed shadow-2xs">
          {interlinearData.literaryTranslation || activeVerse.text}
        </div>
      </div>

      {/* 4. SŁOWNIKI: (DOKŁADNIE WEDŁUG IMG_5915.png) */}
      {interlinearData.dictionaries && interlinearData.dictionaries.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-sans font-bold text-stone-800">
            Słowniki:
          </h3>
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-stone-200 space-y-2 text-xs sm:text-sm font-serif text-stone-900 shadow-2xs">
            {interlinearData.dictionaries.map((dict, idx) => (
              <div
                key={`dict-row-${dict.letter}-${dict.strong}-${idx}`}
                onClick={() => handleOpenStrongModal(dict.strong)}
                className="flex items-baseline gap-2 py-0.5 px-1.5 rounded-md hover:bg-amber-50 cursor-pointer transition-colors group"
                title={`Kliknij hasło Stronga <${dict.strong}> aby otworzyć pełną definicję`}
              >
                {/* Litera indeksowa superscript (a, b, c...) */}
                <span className="font-sans font-bold text-xs text-amber-900 shrink-0 select-none">
                  {dict.letter}
                </span>

                {/* Numer Stronga <3049> */}
                <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 group-hover:bg-emerald-100 px-1 py-0.5 rounded border border-emerald-200 shrink-0">
                  &lt;{dict.strong}&gt;
                </span>

                {/* Definicja słownikowa */}
                <span className="text-stone-800 group-hover:text-stone-950 flex-1 leading-snug">
                  {dict.definition}
                </span>

                <ExternalLink className="w-3.5 h-3.5 text-stone-300 group-hover:text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TABELA INTERLINEARY CZĘŚĆ SŁOWO PO SŁOWIE (DOKŁADNIE WEDŁUG IMG_5916.png) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-sans font-bold text-stone-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-800" />
            <span>Tabela interlinearna (Analiza słowo po słowie):</span>
          </h3>
          <span className="text-[11px] text-stone-400 font-sans hidden sm:inline">
            Przewijaj w poziomie • Kliknij kolumnę, aby otworzyć słownik Stronga
          </span>
        </div>

        {/* Pojemnik przewijalny poziomo z precyzyjnym obramowaniem tabeli jak na oblubienica.eu */}
        <div className="rounded-xl bg-white border border-stone-300 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto no-scrollbar p-3 sm:p-4">
            <div className="inline-flex min-w-max border border-stone-300 rounded-lg overflow-hidden bg-white shadow-2xs">
              
              {/* KOLUMNA LEGENDA (Fixed na lewo z etykietami rzędów) */}
              <div className="w-24 sm:w-28 shrink-0 flex flex-col bg-stone-100 text-stone-800 text-xs font-sans font-bold border-r border-stone-300 divide-y divide-stone-300">
                <div className="h-7 px-2 flex items-center justify-center font-mono text-[11px] text-stone-600 bg-stone-200/70">
                  nr
                </div>
                <div className="h-8 px-2 flex items-center justify-center font-mono text-xs text-amber-900 bg-amber-50/50">
                  strong
                </div>
                <div className="h-10 px-2 flex items-center justify-center font-serif text-xs text-stone-900 bg-stone-100">
                  słowo
                </div>
                {showPhoneticTranslit && (
                  <div className="h-8 px-2 flex items-center justify-center font-mono text-[10px] text-stone-600 italic bg-stone-100">
                    trans. fonet.
                  </div>
                )}
                {showGrammarCodes && (
                  <div className="h-8 px-2 flex items-center justify-center font-mono text-[10px] text-stone-500 bg-stone-100">
                    kod gramat.
                  </div>
                )}
                <div className="h-9 px-2 flex items-center justify-center text-xs text-emerald-950 font-bold bg-emerald-50/40">
                  znaczenie
                </div>
                {showSecondaryMeanings && (
                  <div className="h-8 px-2 flex items-center justify-center text-[10px] text-stone-600 bg-stone-100">
                    drugie znacz.
                  </div>
                )}
              </div>

              {/* KOLUMNY DLA KAŻDEGO SŁOWA Z WERSETU */}
              {interlinearData.columns.map((col, cIdx) => (
                <div
                  key={`interlinear-cell-col-${col.nr}-${col.strong}-${cIdx}`}
                  onClick={() => handleOpenStrongModal(col.strong, col.primaryMeaning || col.originalWord)}
                  className="w-28 sm:w-32 shrink-0 flex flex-col text-center text-xs border-r border-stone-300 last:border-r-0 divide-y divide-stone-200 hover:bg-amber-50/60 cursor-pointer transition-colors group"
                  title={`Kliknij, aby otworzyć hasło Stronga <${col.strong}> (${col.primaryMeaning})`}
                >
                  {/* 1. nr */}
                  <div className="h-7 px-1 flex items-center justify-center font-mono text-[11px] text-stone-500 font-semibold bg-stone-50/50 group-hover:bg-amber-100/40">
                    {col.nr}
                  </div>

                  {/* 2. strong */}
                  <div className="h-8 px-1 flex items-center justify-center font-mono font-bold text-xs text-amber-900 group-hover:text-emerald-900">
                    <span className="px-1 py-0.5 bg-amber-50 group-hover:bg-emerald-50 rounded border border-amber-200 group-hover:border-emerald-300">
                      {col.strong}
                    </span>
                  </div>

                  {/* 3. słowo (oryginalne litery greckie lub hebrajskie) */}
                  <div className="h-10 px-1 flex items-center justify-center font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-950 truncate">
                    {col.originalWord}
                  </div>

                  {/* 4. trans. fonet. */}
                  {showPhoneticTranslit && (
                    <div className="h-8 px-1 flex items-center justify-center font-mono text-[11px] text-stone-600 italic truncate group-hover:text-stone-900">
                      {col.transliteration}
                    </div>
                  )}

                  {/* 5. kod gramat. */}
                  {showGrammarCodes && (
                    <div className="h-8 px-1 flex items-center justify-center font-mono text-[10px] text-stone-500 truncate group-hover:text-stone-800" title={col.grammarCode}>
                      {col.grammarCode}
                    </div>
                  )}

                  {/* 6. znaczenie */}
                  <div className="h-9 px-1 flex items-center justify-center font-sans font-bold text-emerald-950 text-xs truncate group-hover:text-emerald-800">
                    {col.primaryMeaning}
                  </div>

                  {/* 7. drugie znaczenie */}
                  {showSecondaryMeanings && (
                    <div className="h-8 px-1 flex items-center justify-center font-sans text-stone-600 text-[11px] truncate">
                      {col.secondaryMeaning || '—'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-500 font-sans flex items-center justify-center gap-1">
            <span>Kliknij dowolną kolumnę lub numer Stronga</span>
            <span className="font-mono text-emerald-800 font-bold">&lt;Strong&gt;</span>
            <span>aby wyświetlić kartę słownikową i powiązania w całym Piśmie Świętym.</span>
          </div>
        </div>
      </div>

      {/* MODAL / KARTA SŁOWNIKOWA STRONGA */}
      {isModalOpen && activeStrongEntry && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="w-full max-w-xl bg-white rounded-2xl border-2 border-amber-300/90 shadow-2xl p-5 sm:p-7 space-y-5 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modala */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">
                    Strong &lt;{activeStrongEntry.number}&gt;
                  </span>
                  <span className="text-xs font-sans font-semibold text-stone-500">
                    Język {activeStrongEntry.language === 'Greek' ? 'Grecki (Koine)' : 'Hebrajski'}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-emerald-950 flex items-center gap-3">
                  <span>{activeStrongEntry.lemma}</span>
                  <span className="font-mono text-base font-normal text-stone-500 italic">
                    [{activeStrongEntry.transliteration}]
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Treść hasła */}
            <div className="space-y-4 text-sm font-sans">
              {/* Znaczenie podstawowe */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                  Znaczenie podstawowe:
                </div>
                <div className="text-base font-serif font-bold text-emerald-950">
                  {activeStrongEntry.shortMeaning}
                  {activeStrongEntry.secondaryMeaning ? ` / ${activeStrongEntry.secondaryMeaning}` : ''}
                </div>
                <div className="text-xs text-stone-600 font-mono mt-1">
                  Część mowy / Kod: {activeStrongEntry.partOfSpeech}
                </div>
              </div>

              {/* Pełna definicja słownikowa */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Pełna definicja słownika Stronga:
                </h4>
                <p className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 leading-relaxed font-serif">
                  {activeStrongEntry.definitionPolish}
                </p>
              </div>

              {/* Odpowiednik hebrajski / grecki */}
              {activeStrongEntry.hebrewOrGreekEquivalent && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                  <span className="font-bold">Odpowiednik w drugim testamencie: </span>
                  <span className="font-serif">{activeStrongEntry.hebrewOrGreekEquivalent}</span>
                </div>
              )}

              {/* Notatka etymologiczna */}
              {activeStrongEntry.etymologyNote && (
                <div className="text-xs text-stone-600 italic">
                  <span className="font-bold not-italic">Etymologia: </span>
                  {activeStrongEntry.etymologyNote}
                </div>
              )}

              {/* Wystąpienia w Piśmie Świętym */}
              {activeStrongEntry.occurrencesCount && (
                <div className="text-xs text-stone-500 font-mono">
                  Występuje w tekście natchnionym około {activeStrongEntry.occurrencesCount} razy.
                </div>
              )}
            </div>

            {/* Stopka akcji */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenWordModal) {
                    onOpenWordModal(activeStrongEntry.shortMeaning, activeStrongEntry.number);
                  }
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Otwórz pełne studium biblijne (skrutacja)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-sans text-xs font-semibold transition-colors cursor-pointer"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
