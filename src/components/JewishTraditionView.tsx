import React, { useState } from 'react';
import { 
  Scroll, 
  Sparkles, 
  Flame, 
  BookOpen, 
  Search, 
  Loader2, 
  Copy, 
  Check, 
  Volume2, 
  ExternalLink, 
  ArrowRight, 
  HelpCircle,
  Layers,
  FileText,
  RotateCw
} from 'lucide-react';
import { JewishTraditionCommentary } from '../types';
import { JEWISH_TRADITION_DATABASE, getGuaranteedJewishTradition } from '../data/jewishTraditionDatabase';
import { audioEngine } from '../utils/audioContemplationEngine';

interface JewishTraditionViewProps {
  initialSiglum?: string;
  onStartScrutationWithVerse?: (siglum: string, text: string) => void;
  onOpenPatristicsForSiglum?: (siglum: string) => void;
}

export const JewishTraditionView: React.FC<JewishTraditionViewProps> = ({
  initialSiglum = 'Rdz 22, 1-18',
  onStartScrutationWithVerse,
  onOpenPatristicsForSiglum
}) => {
  const [searchSiglum, setSearchSiglum] = useState<string>(initialSiglum);
  const [activeCommentary, setActiveCommentary] = useState<JewishTraditionCommentary>(() => {
    return getGuaranteedJewishTradition(initialSiglum);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  const handleLookup = async (siglumToSearch: string) => {
    const trimmed = siglumToSearch.trim();
    if (!trimmed) return;

    setIsLoading(true);
    const guaranteed = getGuaranteedJewishTradition(trimmed);
    setActiveCommentary(guaranteed);

    try {
      const res = await fetch('/api/scrutation/jewish-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siglum: trimmed })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.theologicalConcept) {
          setActiveCommentary(data);
        }
      }
    } catch (e) {
      console.warn('API lookup error, using guaranteed Jewish tradition database:', e);
    } finally {
      setIsLoading(false);
      audioEngine.strikeBowl(528);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Hero Banner with Jewish Tradition styling */}
      <div className="p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-amber-500/15 via-white to-orange-50 border-2 border-amber-300 shadow-xs space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3.5 py-1 rounded-full text-xs font-sans font-bold bg-amber-600 text-white uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <Scroll className="w-3.5 h-3.5" />
            Tradycja Żydowska & Targumy
          </span>
          <span className="text-xs font-mono text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Tora • Midrasze • Targum Onkelos & Jonatan • Talmud
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Korzenie Wiary: Jak Pierwsze Przymierze czytało Pismo?
          </h1>
          <p className="font-sans text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
            Odkryj aramejskie parafrazy synagogalne (Targumy), komentarze starożytnych mędrców Izraela (Tannaitów i Amoraitów) oraz typologię ukazującą, jak obietnice dane ojcom wypełniły się w Jezusie Chrystusie.
          </p>
        </div>

        {/* Quick Search & Preset Chips */}
        <div className="space-y-3 pt-2">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup(searchSiglum);
            }} 
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchSiglum}
                onChange={(e) => setSearchSiglum(e.target.value)}
                placeholder="Wpisz siglum np. Rdz 22, Wj 12, Iz 53, J 1, Jr 31, Ps 110..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-amber-300 bg-white font-mono text-sm text-slate-900 focus:outline-amber-600 shadow-2xs"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-sans text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
              <span>Zbadaj w Tradycji Żydowskiej</span>
            </button>
          </form>

          {/* Quick Concept Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[11px] font-sans font-bold text-amber-900 shrink-0 mr-1">
              Kluczowe pojęcia:
            </span>
            {JEWISH_TRADITION_DATABASE.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSearchSiglum(item.siglum);
                  setActiveCommentary(item);
                  audioEngine.strikeBowl(432);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  activeCommentary.siglum === item.siglum
                    ? 'bg-amber-700 text-white border-amber-800 shadow-xs'
                    : 'bg-white/80 hover:bg-amber-100 text-amber-950 border-amber-200'
                }`}
              >
                {item.theologicalConcept.split(' ')[0]} ({item.siglum})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="p-6 sm:p-9 rounded-3xl bg-white border border-amber-200 shadow-xs space-y-8">
        {/* Header of the Selected Passage */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-amber-950 bg-amber-50 px-3 py-1 rounded-xl border border-amber-300">
                {activeCommentary.siglum}
              </span>
              <span className="text-xs font-sans font-bold text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-lg border border-amber-200">
                {activeCommentary.theologicalConcept}
              </span>
            </div>
            <p className="text-xs font-sans text-slate-500 pt-0.5">
              Źródło: <span className="font-semibold text-slate-700">{activeCommentary.sourceName}</span> ({activeCommentary.era})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(`${activeCommentary.siglum}\n${activeCommentary.targumPolish}\n\nKomentarz rabiniczny: ${activeCommentary.rabbinicInterpretation}\n\nTypologia chrześcijańska: ${activeCommentary.christianTypology}`)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-sans font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Skopiowano' : 'Kopiuj'}</span>
            </button>

            {onStartScrutationWithVerse && (
              <button
                type="button"
                onClick={() => onStartScrutationWithVerse(activeCommentary.siglum, activeCommentary.targumPolish || activeCommentary.hebrewText)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>Skrutuj ten fragment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Hebrew Original & Aramaic Targum Parallel Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Hebrew Script Box */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-sans uppercase font-bold text-amber-950 border-b border-amber-200/80 pb-2">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                Tekst Masorecki (Hebrajski)
              </span>
              <span className="text-[11px] font-mono text-slate-500">Lekcja synagogalna</span>
            </div>

            <p className="font-serif text-2xl text-slate-900 text-right leading-loose pt-1 select-text" dir="rtl">
              {activeCommentary.hebrewText}
            </p>

            {activeCommentary.hebrewTransliteration && (
              <p className="font-mono text-xs text-amber-900 italic pt-1 border-t border-amber-200/60">
                Wymowa: {activeCommentary.hebrewTransliteration}
              </p>
            )}
          </div>

          {/* Aramaic Targum Box */}
          <div className="p-5 rounded-2xl bg-amber-50/30 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-sans uppercase font-bold text-amber-950 border-b border-amber-200/80 pb-2">
              <span className="flex items-center gap-1.5">
                <Scroll className="w-3.5 h-3.5 text-amber-600" />
                Parafraza Aramejska (Targum)
              </span>
              <span className="text-[11px] font-mono text-slate-500">Tradycja ustna</span>
            </div>

            {activeCommentary.targumArameicText && (
              <p className="font-serif text-xl text-slate-800 text-right leading-relaxed select-text" dir="rtl">
                {activeCommentary.targumArameicText}
              </p>
            )}

            {activeCommentary.targumPolish && (
              <div className="pt-2 border-t border-amber-200/60">
                <span className="text-[11px] font-sans font-bold text-slate-500 block uppercase">
                  Przekład na język polski:
                </span>
                <p className="font-scripture text-sm text-slate-900 italic leading-relaxed pt-1">
                  «{activeCommentary.targumPolish}»
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Deep Commentary Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* 1. Rabbinic & Synagogal Understanding */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-amber-200 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-950 pb-1 border-b border-amber-100">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <h3 className="font-serif text-base font-bold">
                1. Interpretacja Rabiniczna i Midrasze
              </h3>
            </div>
            <p className="font-sans text-sm text-slate-800 leading-relaxed">
              {activeCommentary.rabbinicInterpretation}
            </p>
          </div>

          {/* 2. Christian Typology & Fulfilment in Christ */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border-2 border-emerald-300 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-950 pb-1 border-b border-emerald-100">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h3 className="font-serif text-base font-bold">
                2. Typologia Chrześcijańska i Nowy Testament
              </h3>
            </div>
            <p className="font-sans text-sm text-slate-900 leading-relaxed font-medium">
              {activeCommentary.christianTypology}
            </p>
          </div>
        </div>

        {/* Scrutation Prayer Reflection Question */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-start gap-3.5">
          <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-sans uppercase font-bold text-amber-950 tracking-wider">
              Pytanie do Medytacji i Skrutacji (Scrutatio):
            </span>
            <p className="font-serif text-sm sm:text-base text-amber-950 italic leading-relaxed">
              «{activeCommentary.scrutationQuestion}»
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
