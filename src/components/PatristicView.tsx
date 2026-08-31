import React, { useState } from 'react';
import { PatristicCommentarySection } from './PatristicCommentarySection';
import { getGuaranteedDailyReadings } from '../data/liturgicalCalendarFallback';
import { CHURCH_FATHERS_DIRECTORY, ChurchFatherBio } from '../data/patristicFathersDirectory';
import { 
  Scroll, 
  Sparkles, 
  BookOpen, 
  Search, 
  Calendar, 
  Layers, 
  Users, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Feather,
  Flame,
  Award
} from 'lucide-react';

interface PatristicViewProps {
  onStartScrutationWithVerse?: (siglum: string, text: string) => void;
  defaultSiglum?: string;
}

const POPULAR_THEMATIC_PERICOPES = [
  { siglum: 'J 1, 29', label: 'Oto Baranek Boży, który gładzi grzech świata', text: 'Nazajutrz Jan ujrzał Jezusa i rzekł: «Oto Baranek Boży, który gładzi grzech świata».' },
  { siglum: 'Iz 61, 1', label: 'Duch Pana nade mną, namaścił Mnie', text: 'Duch Pana Boga nade mną, bo Pan mnie namaścił. Posłał mnie, by głosić dobrą nowinę ubogim...' },
  { siglum: 'Ps 23, 1', label: 'Pan jest moim pasterzem', text: 'Pan jest moim pasterzem, nie brak mi niczego. Pozwala mi leżeć na zielonych pastwiskach...' },
  { siglum: 'Mt 5, 3', label: 'Błogosławieni ubodzy w duchu', text: 'Błogosławieni ubodzy w duchu, albowiem do nich należy królestwo niebieskie.' },
  { siglum: 'Flp 2, 6-11', label: 'Hymn o Kenozie Chrystusa', text: 'On, istniejąc w postaci Bożej, nie skorzystał ze sposobności, aby na równi być z Bogiem, lecz ogołocił samego siebie...' },
  { siglum: 'Ez 36, 26', label: 'Serce nowe i Duch nowy', text: 'I dam wam serce nowe i ducha nowego tchnę do waszego wnętrza, zabiorę wam serce kamienne, a dam wam serce z ciała.' },
  { siglum: 'Rz 8, 28', label: 'Bóg z tymi, którzy Go miłują, współdziała we wszystkim ku dobremu', text: 'Wiemy też, że Bóg z tymi, którzy Go miłują, współdziała we wszystkim dla ich dobra, z tymi, którzy są powołani według Jego zamiaru.' }
];

export const PatristicView: React.FC<PatristicViewProps> = ({ defaultSiglum }) => {
  // Source mode toggle: 'daily' (Dzisiejsze czytania mszalne) vs 'custom' (Inne sigla / Baza teologiczna)
  const [sourceMode, setSourceMode] = useState<'daily' | 'custom'>('daily');
  
  // Tab within Patristic section: 'commentaries' (Komentarze i języki) vs 'fathers_directory' (Katalog Ojców Kościoła)
  const [activeSubTab, setActiveSubTab] = useState<'commentaries' | 'fathers_directory'>('commentaries');

  // Daily Readings context
  const today = new Date();
  const dailyLiturgical = getGuaranteedDailyReadings(today);

  // Selected siglum and text
  const [selectedSiglum, setSelectedSiglum] = useState<string>(
    defaultSiglum || dailyLiturgical.readings.find(r => r.type === 'gospel')?.siglum || 'Mk 7, 1-8'
  );
  
  const [verseText, setVerseText] = useState<string>(
    dailyLiturgical.readings.find(r => r.type === 'gospel')?.text || 'Ten lud czci Mnie wargami, lecz sercem swym daleko jest ode Mnie...'
  );

  const [customInput, setCustomInput] = useState<string>('');
  const [fatherSearchFilter, setFatherSearchFilter] = useState<string>('');
  const [selectedFatherTradition, setSelectedFatherTradition] = useState<string>('all');

  // Handle selection from daily readings
  const handleSelectDailyReading = (readingSiglum: string, text: string) => {
    setSelectedSiglum(readingSiglum);
    setVerseText(text);
  };

  // Handle selection from predefined theological pericopes
  const handleSelectPredefined = (p: typeof POPULAR_THEMATIC_PERICOPES[0]) => {
    setSelectedSiglum(p.siglum);
    setVerseText(p.text);
  };

  // Handle custom search
  const handleSearchCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setSelectedSiglum(customInput.trim());
    setVerseText(`Werset ${customInput.trim()} badany w świetle Tradycji Patrystycznej i języków oryginalnych.`);
    setCustomInput('');
  };

  // Filter fathers directory
  const filteredFathers = CHURCH_FATHERS_DIRECTORY.filter(father => {
    const matchesSearch = 
      father.name.toLowerCase().includes(fatherSearchFilter.toLowerCase()) ||
      father.shortDescription.toLowerCase().includes(fatherSearchFilter.toLowerCase()) ||
      father.spiritualCharisma.toLowerCase().includes(fatherSearchFilter.toLowerCase()) ||
      father.keyWorks.some(k => k.toLowerCase().includes(fatherSearchFilter.toLowerCase()));
    
    const matchesTradition = selectedFatherTradition === 'all' || father.tradition.includes(selectedFatherTradition);
    return matchesSearch && matchesTradition;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-b from-[#18181E] via-[#141417] to-[#0D0D10] border border-[#3D3524] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
              Catena Aurea • Święta Tradycja • Języki Biblijne
            </span>
          </div>

          {/* Sub-tab navigation: Komentarze vs Katalog Ojców */}
          <div className="inline-flex rounded-xl p-1 bg-[#0E0E12] border border-[#3D3524] shadow-inner">
            <button
              onClick={() => setActiveSubTab('commentaries')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'commentaries'
                  ? 'bg-[#3D3524] text-[#C5A059] shadow-sm'
                  : 'text-[#8C8270] hover:text-[#E0E0D6]'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>Komentarze i Języki</span>
            </button>
            <button
              onClick={() => setActiveSubTab('fathers_directory')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'fathers_directory'
                  ? 'bg-[#3D3524] text-[#C5A059] shadow-sm'
                  : 'text-[#8C8270] hover:text-[#E0E0D6]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Ojcowie Kościoła ({CHURCH_FATHERS_DIRECTORY.length})</span>
            </button>
          </div>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-normal tracking-wide">
          Ojcowie Kościoła i Języki Oryginalne
        </h1>
        
        <p className="text-sm text-[#A0A095] max-w-3xl mt-2 leading-relaxed font-serif">
          Zanurz się w autentycznej interpretacji Pisma Świętego według Ojców Wschodu i Zachodu (św. Augustyn, św. Jan Chryzostom, św. Hieronim, św. Grzegorz Wielki, Orygenes, św. Ireneusz) oraz zobacz oryginalne brzmienie w grece <span className="text-[#C5A059] italic">Koine</span>, hebrajskim i łacińskiej <span className="text-[#C5A059] italic">Wulgacie</span>.
        </p>

        {/* Source Selector: Czytania z Dnia vs Inne Sigla */}
        {activeSubTab === 'commentaries' && (
          <div className="mt-6 pt-6 border-t border-[#3D3524]/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Wybierz źródło wersetu:
              </span>

              {/* Mode Toggle Button Group */}
              <div className="inline-flex rounded-xl p-1 bg-[#09090C] border border-[#3D3524] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSourceMode('daily')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    sourceMode === 'daily'
                      ? 'bg-[#C5A059] text-[#0F0F12] shadow'
                      : 'text-[#8C8270] hover:text-[#E0E0D6]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Czytania z dnia</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    sourceMode === 'custom'
                      ? 'bg-[#C5A059] text-[#0F0F12] shadow'
                      : 'text-[#8C8270] hover:text-[#E0E0D6]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inne sigle / Własne</span>
                </button>
              </div>
            </div>

            {/* VIEW A: Czytania z dzisiejszej Liturgii Słowa */}
            {sourceMode === 'daily' && (
              <div className="p-4 rounded-xl bg-[#0E0E12] border border-[#2B2B38] space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#C5A059] font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Liturgia Słowa na dziś: <strong>{dailyLiturgical.formattedDate}</strong> ({dailyLiturgical.liturgicalCelebration})</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {dailyLiturgical.readings.map((r) => {
                    const isSelected = selectedSiglum === r.siglum;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleSelectDailyReading(r.siglum, r.text)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#2A2415] border-[#C5A059] shadow-lg scale-[1.02]'
                            : 'bg-[#15151C] border-[#2B2B38] hover:border-[#C5A059]/60 hover:bg-[#1C1C24]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-sans uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                            isSelected ? 'bg-[#C5A059] text-black' : 'bg-[#22222E] text-[#8C8270]'
                          }`}>
                            {r.label}
                          </span>
                          <span className="font-mono text-xs text-[#C5A059] font-bold">
                            {r.siglum}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#A0A095] line-clamp-2 font-serif italic">
                          «{r.text}»
                        </p>

                        {isSelected && (
                          <span className="text-[10px] text-[#C5A059] font-sans font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktywny fragment
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW B: Inne sigle / Własne / Kluczowe perykopy */}
            {sourceMode === 'custom' && (
              <div className="p-4 rounded-xl bg-[#0E0E12] border border-[#2B2B38] space-y-4 animate-fade-in">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#8C8270] mb-2 block font-semibold">
                    Wybierz z fundamentalnych wersetów biblijnych:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_THEMATIC_PERICOPES.map((p) => (
                      <button
                        key={p.siglum}
                        type="button"
                        onClick={() => handleSelectPredefined(p)}
                        className={`px-3 py-1.5 rounded-xl text-xs transition-all border flex items-center gap-1.5 cursor-pointer ${
                          selectedSiglum === p.siglum
                            ? 'bg-[#3D3524] text-[#C5A059] border-[#C5A059] font-semibold shadow-md'
                            : 'bg-[#15151C] text-[#8C8270] hover:text-[#E0E0D6] border-[#2B2B38] hover:bg-[#1F1E28]'
                        }`}
                      >
                        <Scroll className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span className="font-mono font-bold text-amber-200">{p.siglum}</span>
                        <span className="opacity-70 hidden md:inline truncate max-w-[200px]">({p.label})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom siglum input form */}
                <form onSubmit={handleSearchCustom} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#22222C]">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Wpisz dowolne siglum Pisma Świętego (np. Rz 8, 28, Jk 1, 17, Rdz 1, 1)..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#3D3524] text-xs text-[#E0E0D6] focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#E5C98B] transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Zbadaj werset</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: KOMENTARZE PATRYSTYCZNE I JĘZYKI ORYGINALNE DLA WYBRANEGO SIGLUM */}
      {/* ========================================================================= */}
      {activeSubTab === 'commentaries' && (
        <div className="bg-[#141417] border border-[#3D3524] rounded-2xl p-6 sm:p-8 shadow-xl">
          <PatristicCommentarySection
            siglum={selectedSiglum}
            verseText={verseText}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: KATALOG OJCÓW KOŚCIOŁA (Directory of Church Fathers) */}
      {/* ========================================================================= */}
      {activeSubTab === 'fathers_directory' && (
        <div className="space-y-6">
          {/* Directory Filter Bar */}
          <div className="p-5 rounded-2xl bg-[#141417] border border-[#3D3524] shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={fatherSearchFilter}
                onChange={(e) => setFatherSearchFilter(e.target.value)}
                placeholder="Szukaj Ojca Kościoła, dzieła, pojęcia..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0A0A0D] border border-[#3D3524] text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Tradition Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedFatherTradition('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedFatherTradition === 'all'
                    ? 'bg-[#C5A059] text-black'
                    : 'bg-[#1D1D26] text-stone-400 hover:text-white'
                }`}
              >
                Wszyscy ({CHURCH_FATHERS_DIRECTORY.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFatherTradition('Łacińska')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedFatherTradition === 'Łacińska'
                    ? 'bg-[#C5A059] text-black'
                    : 'bg-[#1D1D26] text-stone-400 hover:text-white'
                }`}
              >
                Łacińscy (Zachód)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFatherTradition('Grecka')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedFatherTradition === 'Grecka'
                    ? 'bg-[#C5A059] text-black'
                    : 'bg-[#1D1D26] text-stone-400 hover:text-white'
                }`}
              >
                Greccy (Wschód)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFatherTradition('Syriacka')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedFatherTradition === 'Syriacka'
                    ? 'bg-[#C5A059] text-black'
                    : 'bg-[#1D1D26] text-stone-400 hover:text-white'
                }`}
              >
                Syriaccy / Orientalni
              </button>
            </div>
          </div>

          {/* Fathers Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFathers.map((father) => (
              <div
                key={father.id}
                className="p-6 rounded-2xl bg-[#141419] border border-[#2D2B24] hover:border-[#C5A059] transition-all flex flex-col justify-between gap-4 shadow-lg group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] font-bold border border-[#C5A059]/30">
                        {father.category}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-white mt-1.5 group-hover:text-[#C5A059] transition-colors">
                        {father.name}
                      </h3>
                      <p className="text-xs text-stone-400 font-mono">
                        {father.dates} • {father.tradition}
                      </p>
                    </div>
                    <Award className="w-5 h-5 text-[#C5A059]/60 shrink-0" />
                  </div>

                  <p className="text-xs text-stone-300 font-serif leading-relaxed">
                    {father.shortDescription}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[#22222E]">
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold block">
                      Główne dzieła:
                    </span>
                    <ul className="text-xs text-[#A0A095] space-y-0.5 list-disc list-inside">
                      {father.keyWorks.map((work, wIdx) => (
                        <li key={wIdx} className="truncate italic">
                          {work}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#22222E] bg-black/20 p-3 rounded-xl">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300/80 font-bold block mb-1 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#C5A059]" />
                    Charyzmat duchowy:
                  </span>
                  <p className="text-xs text-stone-300 font-serif italic leading-relaxed">
                    «{father.spiritualCharisma}»
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredFathers.length === 0 && (
            <div className="text-center py-12 bg-[#141419] border border-[#3D3524] rounded-2xl p-8 space-y-3">
              <Info className="w-8 h-8 text-[#C5A059] mx-auto" />
              <p className="text-sm text-stone-300 font-medium">Nie znaleziono Ojca Kościoła dla podanej frazy.</p>
              <button
                type="button"
                onClick={() => { setFatherSearchFilter(''); setSelectedFatherTradition('all'); }}
                className="px-4 py-2 rounded-xl bg-[#3D3524] text-[#C5A059] text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#4E442F]"
              >
                Wyczyść filtry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
