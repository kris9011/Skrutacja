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
  Share2
} from 'lucide-react';

interface SpiritualSense {
  literal: string;
  allegorical: string;
  moral: string;
  anagogical: string;
}

interface PassageCommentaryData {
  siglum: string;
  title: string;
  historicalLiteraryContext: string;
  theologicalMessage: string;
  spiritualSense: SpiritualSense;
  meditationPoints: string[];
  prayer: string;
}

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
  const [commentary, setCommentary] = useState<PassageCommentaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'all' | 'context' | 'senses' | 'meditation'>('all');

  const fetchCommentary = async () => {
    if (!siglum) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/scrutation/passage-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siglum,
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
    } catch (err) {
      console.warn('Fallback passage commentary:', err);
      // Fallback local commentary
      setCommentary({
        siglum,
        title: `Komentarz biblijny: ${label ? `${label} (${siglum})` : siglum}`,
        historicalLiteraryContext: `Fragment z księgi ${siglum.split(' ')[0]} wpisuje się w zbawczą historię Przymierza. Bóg w konkretnym czasie i języku objawia swoją wolę, wzywając człowieka do zaufania i wejścia w zażyłość z Nim.`,
        theologicalMessage: theologicalTheme || `Orędzie tego tekstu ogłasza prymat Bożej łaski i wierności. Słowo to rozjaśnia mroki ludzkiego serca i prowadzi do odkrycia Chrystusa jako centrum całego Pisma.`,
        spiritualSense: {
          literal: 'Sens dosłowny wskazuje na wydarzenie zbawcze oraz słowa i czyny przekazane przez natchnionego autora dla pouczenia wierzących.',
          allegorical: 'Sens alegoryczny pozwala rozpoznać zapowiedź i figurę tajemnicy Chrystusa i Kościoła, które w Nim znajdują ostateczne wypełnienie.',
          moral: 'Sens moralny prowadzi do nawrócenia obyczajów, wzywając do miłości braterskiej, pokory i wypełniania woli Ojca.',
          anagogical: 'Sens anagogiczny wznosi myśl ku rzeczom wiecznym – do eschatologicznego celu naszej ziemskiej pielgrzymki.'
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
    if (isOpen && siglum) {
      fetchCommentary();
    }
  }, [isOpen, siglum]);

  if (!isOpen) return null;

  const handleCopyAll = async () => {
    if (!commentary) return;
    const fullContent = `${commentary.title}\nSiglum: ${siglum}\n\nTekst biblijny:\n${text}\n\nKontekst historyczno-literacki:\n${commentary.historicalLiteraryContext}\n\nOrędzie teologiczne:\n${commentary.theologicalMessage}\n\nCztery Zmysły Pisma Świętego:\n- Sens dosłowny: ${commentary.spiritualSense.literal}\n- Sens alegoryczny: ${commentary.spiritualSense.allegorical}\n- Sens moralny: ${commentary.spiritualSense.moral}\n- Sens anagogiczny: ${commentary.spiritualSense.anagogical}\n\nPunkty do medytacji:\n${commentary.meditationPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nModlitwa:\n${commentary.prayer}`;

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
                {siglum}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-300 shrink-0" />
              <span>{commentary?.title || `Komentarz do fragmentu: ${siglum}`}</span>
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
              onClick={fetchCommentary}
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
              title="Kopiuj cały komentarz"
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

        {/* Section Navigation Pills */}
        <div className="bg-amber-50/70 border-b border-amber-200/70 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'all'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Całość komentarza
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
            Kontekst & Orędzie
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
            4 Zmysły Pisma (KKK)
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
            Medytacja & Modlitwa
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
                Opracowywanie komentarza biblijno-liturgicznego dla {siglum}...
              </p>
              <p className="text-xs text-slate-500 font-sans">
                Analiza zmysłów Pisma Świętego, tradycji egzegetycznej i orędzia zbawczego
              </p>
            </div>
          ) : commentary ? (
            <>
              {/* Context & Theological Message */}
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

              {/* Four Senses of Scripture */}
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

              {/* Meditation Questions & Prayer */}
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
