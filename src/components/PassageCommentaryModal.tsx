import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Scroll,
  Sparkles,
  Copy,
  Check,
  Compass,
  Heart,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Share2,
  MessageSquareQuote,
  Search,
  Feather,
  ShieldCheck,
  BookmarkCheck,
  FileText
} from 'lucide-react';
import { PassageCommentaryData } from '../types';

interface PassageCommentaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  siglum: string;
  text: string;
  label?: string;
  liturgicalContext?: string;
  theologicalTheme?: string;
  onOpenPatristics?: (siglum: string) => void;
  onStartScrutation?: (siglum: string, text: string) => void;
}

type CommentarySectionTab =
  | 'all'
  | 'thomas'
  | 'jfb'
  | 'pastoral'
  | 'senses'
  | 'context'
  | 'wujek'
  | 'meditation';

export const PassageCommentaryModal: React.FC<PassageCommentaryModalProps> = ({
  isOpen,
  onClose,
  siglum,
  text,
  label,
  liturgicalContext,
  theologicalTheme,
  onOpenPatristics,
  onStartScrutation
}) => {
  const [activeSiglum, setActiveSiglum] = useState<string>(siglum);
  const [searchInput, setSearchInput] = useState<string>('');
  const [commentary, setCommentary] = useState<PassageCommentaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<CommentarySectionTab>('all');

  useEffect(() => {
    setActiveSiglum(siglum);
  }, [siglum]);

  const fetchCommentary = async (targetSiglum: string = activeSiglum) => {
    if (!targetSiglum) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/scrutation/passage-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siglum: targetSiglum,
          text,
          label,
          liturgicalContext: liturgicalContext || theologicalTheme
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCommentary(data);
      } else {
        throw new Error('Nie udało się pobrać komentarza');
      }
    } catch (_err) {
      // Fallback multi-perspective commentary
      setCommentary({
        siglum: targetSiglum,
        title: `Komentarz biblijny: ${label ? `${label} (${targetSiglum})` : targetSiglum}`,
        historicalLiteraryContext: `Fragment z księgi ${targetSiglum.split(' ')[0]} wpisuje się w zbawczą historię Przymierza. Bóg w konkretnym czasie i języku objawia swoją wolę, wzywając człowieka do zaufania i wejścia w zażyłość z Nim.`,
        theologicalMessage: theologicalTheme || `Orędzie tego tekstu ogłasza prymat Bożej łaski i wierności. Słowo to rozjaśnia mroki ludzkiego serca i prowadzi do odkrycia Chrystusa jako centrum całego Pisma.`,
        spiritualSense: {
          literal: 'Sens dosłowny wskazuje na wydarzenie zbawcze oraz słowa i czyny przekazane przez natchnionego autora dla pouczenia wierzących.',
          allegorical: 'Sens alegoryczny pozwala rozpoznać zapowiedź i figurę tajemnicy Chrystusa i Kościoła, które w Nim znajdują ostateczne wypełnienie.',
          moral: 'Sens moralny prowadzi do nawrócenia obyczajów, wzywając do miłości braterskiej, pokory i wypełniania woli Ojca.',
          anagogical: 'Sens anagogiczny wznosi myśl ku rzeczom wiecznym – do eschatologicznego celu naszej ziemskiej pielgrzymki.'
        },
        thomasAquinas: {
          title: 'Wykład św. Tomasza z Akwinu (Doctor Angelicus)',
          catenaAureaGloss: 'Święty Tomasz z Akwinu naucza, że całe Pismo Święte ma za cel doprowadzenie człowieka do komunii z Bogiem. W duchu Catena Aurea perykopa ta łączy głos Tradycji z głęboką kontemplacją tajemnicy wcielonej Mądrości Bożej.',
          scholasticSynthesis: 'Przyczyną sprawczą zbawczego orędzia jest Boże miłosierdzie; przyczyną celową – wieczne szczęście człowieka. Fragment ten oświeca rozum wiarą i rozpala wolę miłością (caritas).'
        },
        jfbCommentary: {
          title: 'Komentarz Jamiesona-Fausseta-Browna (JFB) po polsku',
          criticalNotes: 'W tekście oryginalnym kluczowe terminy wskazują na trwałe, niezłomne przymierze Boga. JFB podkreśla precyzję oryginalnego słownictwa i ścisły związek z całością objawienia biblijnego.',
          historicalExegesis: 'Tło epoki i kontekst starożytny ukazują wierność Boga pośród zmiennych kolei losów narodu wybranego, zapowiadając pełnię odkupienia w Nowym Testamencie.'
        },
        pastoralCommentary: {
          title: 'Komentarz Pastoralno-Duszpasterski',
          authorTradition: 'Tradycja duszpasterska: Matthew Henry & C.H. Spurgeon («Skarbnica Dawidowa»)',
          practicalApplication: 'Słowo to jest wezwaniem do zbadania stanu własnego serca: zaufaj Bożej Opatrzności w codziennych troskach i zrób dziś konkretny krok przebaczenia.',
          spiritualEncouragement: 'Bóg nie męczy się przebaczaniem. Jego miłosierdzie jest świeże każdego poranka – nie ulegaj zniechęceniu w swoich zmaganiach.'
        },
        classicFootnotes: {
          title: 'Tradycyjne Przypisy Polskie (ks. Jakub Wujek)',
          notes: 'W klasycznej polskiej tradycji biblijnej werset ten interpretowany jest jako tarcza wiary i wezwanie do stateczności w cnocie pośród przeciwności świata.'
        },
        meditationPoints: [
          'Jakie słowo lub obraz z tego fragmentu zatrzymuje dzisiaj moją uwagę?',
          'Do jakiej postawy w relacji z Bogiem i bliźnimi zaprasza mnie to czytanie?',
          'Gdzie w moim życiu potrzebuję doświadczyć mocy tego Słowa?'
        ],
        prayer: `Panie Jezu Chryste, Twoje Słowo jest duchem i życiem. Daj mi uszy otwarte na Twój głos i serce gotowe, by iść drogą Twoich przykazań. Amen.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeSiglum) {
      fetchCommentary(activeSiglum);
    }
  }, [isOpen, activeSiglum]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveSiglum(searchInput.trim());
    }
  };

  const handleCopyAll = async () => {
    if (!commentary) return;
    const fullContent = [
      `${commentary.title}`,
      `Siglum: ${activeSiglum}`,
      `\nTekst biblijny:\n«${text}»`,
      `\n1. KONTEKST & ORĘDZIE:`,
      `Kontekst historyczno-literacki: ${commentary.historicalLiteraryContext}`,
      `Orędzie teologiczne: ${commentary.theologicalMessage}`,
      `\n2. CZTERY ZMYSŁY PISMA ŚWIĘTEGO (KKK 115-119):`,
      `- Sens dosłowny: ${commentary.spiritualSense.literal}`,
      `- Sens alegoryczny: ${commentary.spiritualSense.allegorical}`,
      `- Sens moralny: ${commentary.spiritualSense.moral}`,
      `- Sens anagogiczny: ${commentary.spiritualSense.anagogical}`,
      commentary.thomasAquinas ? `\n3. ŚW. TOMASZ Z AKWINU (DOCTOR ANGELICUS):\n${commentary.thomasAquinas.catenaAureaGloss}\nSynteza: ${commentary.thomasAquinas.scholasticSynthesis}` : '',
      commentary.jfbCommentary ? `\n4. JAMIESON-FAUSSET-BROWN (JFB) PO POLSKU:\nUwagi krytyczne: ${commentary.jfbCommentary.criticalNotes}\nEgzegeza: ${commentary.jfbCommentary.historicalExegesis}` : '',
      commentary.pastoralCommentary ? `\n5. KOMENTARZ PASTORALNY (${commentary.pastoralCommentary.authorTradition}):\nZastosowanie: ${commentary.pastoralCommentary.practicalApplication}\nPocieszenie: ${commentary.pastoralCommentary.spiritualEncouragement}` : '',
      commentary.classicFootnotes ? `\n6. PRZYPISY TRADYCYJNE (ks. J. Wujek):\n${commentary.classicFootnotes.notes}` : '',
      `\n7. PUNKTY DO MEDYTACJI (Lectio Divina):\n${commentary.meditationPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`,
      `\n8. MODLITWA SERCA (Oratio):\n«${commentary.prayer}»`
    ].filter(Boolean).join('\n');

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-amber-200/90 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-50 p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-amber-600/50 shrink-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-[10px] uppercase font-sans font-bold tracking-widest text-amber-200">
                {label || 'Komentarz Biblijny'}
              </span>
              <span className="font-mono text-xs font-bold text-amber-100 bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                {activeSiglum}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-[10px] font-sans font-semibold text-emerald-200 border border-emerald-500/30">
                Tomasz z Akwinu • JFB • Pastoralny
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-300 shrink-0" />
              <span>{commentary?.title || `Komentarz do fragmentu: ${activeSiglum}`}</span>
            </h2>
            {liturgicalContext && (
              <p className="text-xs text-amber-200/90 font-sans italic">
                {liturgicalContext}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fetchCommentary(activeSiglum)}
              disabled={isLoading}
              className="p-2 rounded-xl bg-amber-800/60 hover:bg-amber-800 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Odśwież komentarz"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleCopyAll}
              className="p-2 rounded-xl bg-amber-800/60 hover:bg-amber-800 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Kopiuj cały komentarz (wszystkie tradycje)"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-amber-800/60 hover:bg-amber-800 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Switch Bar: Komentarze Wieloaspektowe vs Ojcowie Kościoła + Search */}
        <div className="bg-amber-950/20 border-b border-amber-200/60 px-4 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 self-start">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold bg-amber-600 text-white shadow-xs flex items-center gap-1.5"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Komentarze (Tomasz • JFB • Pastoralne)</span>
            </button>
            {onOpenPatristics && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPatristics(activeSiglum);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Przełącz na komentarze Ojców Kościoła"
              >
                <Scroll className="w-3.5 h-3.5 text-sky-700" />
                <span>Ojcowie Kościoła</span>
              </button>
            )}
          </div>

          {/* Quick Siglum / Phrase Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-1.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Wpisz fragment np. Mt 5,3..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-amber-300 focus:outline-none focus:border-amber-600 font-sans"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-sans font-bold rounded-lg transition-colors cursor-pointer"
            >
              Szukaj
            </button>
          </form>
        </div>

        {/* Section Navigation Pills */}
        <div className="bg-amber-50/70 border-b border-amber-200/70 px-4 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'all'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            🌟 Całość
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('thomas')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeSection === 'thomas'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
            title="Wykład św. Tomasza z Akwinu (Catena Aurea i synteza teologiczna)"
          >
            <span>🕊️ Św. Tomasz z Akwinu</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('jfb')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeSection === 'jfb'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
            title="Jamieson-Fausset-Brown (JFB) po polsku: krytyczno-egzegetyczny"
          >
            <span>📖 JFB (po polsku)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('pastoral')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeSection === 'pastoral'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
            title="Komentarze pastoralne: Matthew Henry & Spurgeon Skarbnica Dawidowa"
          >
            <span>🌿 Pastoralne & Spurgeon</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('senses')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'senses'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            📜 4 Zmysły Pisma
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('context')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'context'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            🧭 Kontekst & Orędzie
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('wujek')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'wujek'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
            title="Przypisy ks. Jakuba Wujka i tradycja polska"
          >
            <span>⛪ Ks. Jakub Wujek</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('meditation')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'meditation'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            🕯️ Medytacja
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Scripture Excerpt Card */}
          <div className="p-4 sm:p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans uppercase tracking-wider font-bold text-amber-900 flex items-center gap-1.5">
                <Scroll className="w-3.5 h-3.5 text-amber-700" />
                Fragment czytania ({siglum})
              </span>
            </div>
            <p className="font-serif text-sm sm:text-base text-slate-800 leading-relaxed italic">
              «{text}»
            </p>
          </div>

          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="font-serif text-base text-slate-700 font-semibold">
                Opracowywanie wszechstronnego komentarza dla {siglum}...
              </p>
              <p className="text-xs text-slate-500 font-sans max-w-md mx-auto">
                Łączenie teologii św. Tomasza z Akwinu, analizy krytycznej JFB po polsku, komentarza pastoralnego oraz 4 zmysłów Pisma Świętego.
              </p>
            </div>
          ) : commentary ? (
            <>
              {/* 1. Saint Thomas Aquinas (Doctor Angelicus) Section */}
              {(activeSection === 'all' || activeSection === 'thomas') && commentary.thomasAquinas && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-yellow-50/80 border border-amber-300 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-amber-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-200 flex items-center justify-center text-amber-900 font-bold text-xs">
                        🕊️
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-amber-950">
                          {commentary.thomasAquinas.title}
                        </h3>
                        <span className="text-[10px] font-sans text-amber-800 uppercase tracking-wider font-semibold">
                          Catena Aurea & Wykład Pisma Świętego • Synteza Scholastyczna
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      Doctor Angelicus
                    </span>
                  </div>

                  <div className="space-y-3 text-slate-800 text-xs sm:text-sm">
                    <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 space-y-1">
                      <div className="font-sans font-bold text-amber-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Feather className="w-3.5 h-3.5 text-amber-700" />
                        <span>Wykład Pisma i Catena Aurea:</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.thomasAquinas.catenaAureaGloss}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 space-y-1">
                      <div className="font-sans font-bold text-amber-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>Synteza teologiczna (Łaska, cnoty, sakramenty):</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.thomasAquinas.scholasticSynthesis}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Jamieson-Fausset-Brown (JFB) in Polish */}
              {(activeSection === 'all' || activeSection === 'jfb') && commentary.jfbCommentary && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50/90 via-slate-50 to-blue-50/70 border border-sky-300 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-sky-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-200 flex items-center justify-center text-sky-900 font-bold text-xs">
                        📖
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-sky-950">
                          {commentary.jfbCommentary.title}
                        </h3>
                        <span className="text-[10px] font-sans text-sky-800 uppercase tracking-wider font-semibold">
                          A Commentary, Critical and Explanatory, on the Whole Bible (1871)
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold bg-sky-100 text-sky-900 border border-sky-300">
                      Egzegeza krytyczna
                    </span>
                  </div>

                  <div className="space-y-3 text-slate-800 text-xs sm:text-sm">
                    <div className="p-3.5 bg-white/90 rounded-xl border border-sky-200 space-y-1">
                      <div className="font-sans font-bold text-sky-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <BookmarkCheck className="w-3.5 h-3.5 text-sky-700" />
                        <span>Uwagi krytyczno-językowe (hebr./gr. w przekładzie polskim):</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.jfbCommentary.criticalNotes}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white/90 rounded-xl border border-sky-200 space-y-1">
                      <div className="font-sans font-bold text-sky-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-sky-700" />
                        <span>Tło archeologiczne, historyczne i spójność Pisma:</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.jfbCommentary.historicalExegesis}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Pastoral Commentary (Matthew Henry & Spurgeon Skarbnica Dawidowa) */}
              {(activeSection === 'all' || activeSection === 'pastoral') && commentary.pastoralCommentary && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-slate-50 border border-emerald-300 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-emerald-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-200 flex items-center justify-center text-emerald-900 font-bold text-xs">
                        🌿
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-emerald-950">
                          {commentary.pastoralCommentary.title}
                        </h3>
                        <span className="text-[10px] font-sans text-emerald-800 uppercase tracking-wider font-semibold">
                          {commentary.pastoralCommentary.authorTradition}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Duszpasterstwo & Życie
                    </span>
                  </div>

                  <div className="space-y-3 text-slate-800 text-xs sm:text-sm">
                    <div className="p-3.5 bg-white/90 rounded-xl border border-emerald-200 space-y-1">
                      <div className="font-sans font-bold text-emerald-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Praktyczne zastosowanie w codzienności:</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.pastoralCommentary.practicalApplication}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white/90 rounded-xl border border-emerald-200 space-y-1">
                      <div className="font-sans font-bold text-emerald-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Pocieszenie duchowe i zachęta w próbie:</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.pastoralCommentary.spiritualEncouragement}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Classic Polish Footnotes (ks. Jakub Wujek) */}
              {(activeSection === 'all' || activeSection === 'wujek') && commentary.classicFootnotes && (
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-300/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-800" />
                      <h3 className="font-serif text-sm sm:text-base font-bold text-amber-950">
                        {commentary.classicFootnotes.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-sans font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded">
                      Biblia Wujka
                    </span>
                  </div>
                  <p className="font-serif text-xs sm:text-sm text-slate-800 leading-relaxed bg-white/90 p-3.5 rounded-xl border border-amber-200">
                    {commentary.classicFootnotes.notes}
                  </p>
                </div>
              )}

              {/* 5. Context & Theological Message */}
              {(activeSection === 'all' || activeSection === 'context') && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-sans font-bold text-xs uppercase tracking-wider">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>Kontekst historyczno-literacki</span>
                    </div>
                    <p className="font-serif text-sm sm:text-base text-slate-700 leading-relaxed">
                      {commentary.historicalLiteraryContext}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2 text-amber-800 font-sans font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Główne orędzie teologiczne</span>
                    </div>
                    <p className="font-serif text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      {commentary.theologicalMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* 6. Four Senses of Scripture */}
              {(activeSection === 'all' || activeSection === 'senses') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                      <Scroll className="w-4 h-4 text-amber-700" />
                      <span>Cztery Zmysły Pisma Świętego (Katechizm KK 115-119)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Literal */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 px-2 py-0.5 bg-white rounded border border-slate-200 inline-block">
                        1. Sens Dosłowny (Littera)
                      </span>
                      <p className="text-xs sm:text-sm font-serif text-slate-700 leading-relaxed">
                        {commentary.spiritualSense.literal}
                      </p>
                    </div>

                    {/* Allegorical */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-emerald-900 px-2 py-0.5 bg-white rounded border border-emerald-200 inline-block">
                        2. Sens Alegoryczny (Chrystus)
                      </span>
                      <p className="text-xs sm:text-sm font-serif text-slate-700 leading-relaxed">
                        {commentary.spiritualSense.allegorical}
                      </p>
                    </div>

                    {/* Moral */}
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-amber-900 px-2 py-0.5 bg-white rounded border border-amber-200 inline-block">
                        3. Sens Moralny (Życie)
                      </span>
                      <p className="text-xs sm:text-sm font-serif text-slate-700 leading-relaxed">
                        {commentary.spiritualSense.moral}
                      </p>
                    </div>

                    {/* Anagogical */}
                    <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-1.5">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-sky-900 px-2 py-0.5 bg-white rounded border border-sky-200 inline-block">
                        4. Sens Anagogiczny (Wieczność)
                      </span>
                      <p className="text-xs sm:text-sm font-serif text-slate-700 leading-relaxed">
                        {commentary.spiritualSense.anagogical}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Meditation Questions & Prayer */}
              {(activeSection === 'all' || activeSection === 'meditation') && (
                <div className="space-y-4">
                  {commentary.meditationPoints && commentary.meditationPoints.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                      <div className="flex items-center gap-2 text-amber-900 font-sans font-bold text-xs uppercase tracking-wider">
                        <HelpCircle className="w-4 h-4 text-amber-700" />
                        <span>Punkty do osobistej medytacji (Meditatio)</span>
                      </div>
                      <ul className="space-y-2">
                        {commentary.meditationPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-serif text-slate-800">
                            <span className="font-mono font-bold text-amber-800 text-xs bg-white px-2 py-0.5 rounded border border-amber-300 shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-emerald-50 space-y-2 border border-emerald-700">
                    <div className="flex items-center gap-2 text-amber-300 font-sans font-bold text-xs uppercase tracking-wider">
                      <Heart className="w-4 h-4 text-amber-400" />
                      <span>Modlitwa serca (Oratio)</span>
                    </div>
                    <p className="font-serif italic text-sm sm:text-base leading-relaxed text-emerald-100">
                      „{commentary.prayer}”
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Action Bottom Footer with Church Fathers & Scrutation */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenPatristics && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPatristics(siglum);
                }}
                className="py-2.5 px-4 rounded-xl text-xs font-sans uppercase tracking-wider font-bold flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Otwórz komentarze Ojców Kościoła dla tego wersetu"
              >
                <Scroll className="w-4 h-4 text-emerald-700" />
                <span>Ojcowie Kościoła ({siglum})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onStartScrutation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartScrutation(siglum, text);
                }}
                className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl text-xs font-sans uppercase tracking-wider font-bold flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Skrutuj ten fragment</span>
                <ArrowRight className="w-4 h-4" />
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

