import React, { useState } from 'react';
import { BookOpen, Flame, Compass, ArrowRight, Sparkles, ChevronDown, ChevronUp, Copy, Check, CalendarDays } from 'lucide-react';
import { PRAYER_STEPS_INFO, HOLY_SPIRIT_PRAYERS, SCRUTATION_THEOLOGY_FAQ } from '../data/biblicalData';

interface ScrutationGuideViewProps {
  onStartScrutation: (themeId?: string) => void;
  onSelectThemeTab: () => void;
  onSelectDailyTab?: () => void;
}

export const ScrutationGuideView: React.FC<ScrutationGuideViewProps> = ({
  onStartScrutation,
  onSelectThemeTab,
  onSelectDailyTab
}) => {
  const [activeStepTab, setActiveStepTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyPrayer = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10 text-[#E0E0D6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#141417] border border-[#3D3524] p-8 sm:p-12 text-center flex flex-col items-center">
        <div className="w-px h-10 bg-[#C5A059] mb-4" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1a1e] border border-[#3D3524] text-[#C5A059] text-[10px] font-sans uppercase tracking-[0.3em] mb-4">
          <Flame className="w-3.5 h-3.5" />
          Scrutatio Scripturae
        </div>

        <h1 className="text-3xl sm:text-5xl font-light tracking-widest text-[#C5A059] mb-6">
          SKRUTACJA PISMA ŚWIĘTEGO
        </h1>

        <p className="font-scripture text-xl sm:text-2xl text-[#E0E0D6] italic max-w-2xl leading-relaxed mb-4">
          «Badajcie Pisma, ponieważ sądzicie, że w nich zawarte jest życie wieczne: to one właśnie dają o Mnie świadectwo.»
        </p>

        <div className="flex items-center gap-4 mb-8">
          <span className="h-px w-8 bg-[#3D3524]" />
          <span className="text-xs font-sans uppercase tracking-[0.4em] text-[#8C8270]">
            Ewangelia wg św. Jana 5, 39
          </span>
          <span className="h-px w-8 bg-[#3D3524]" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onSelectDailyTab && (
            <button
              id="daily-readings-hero-btn"
              onClick={onSelectDailyTab}
              className="px-6 py-3 bg-[#C5A059] hover:bg-[#b08e4d] text-[#0F0F12] font-semibold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <CalendarDays className="w-4 h-4" />
              Czytania z Dnia & Fragmenty
            </button>
          )}

          <button
            id="start-scrutation-hero-btn"
            onClick={() => onStartScrutation()}
            className="px-6 py-3 bg-[#1a1a1e] hover:bg-[#25252b] text-[#E0E0D6] text-xs uppercase tracking-widest border border-[#3D3524] hover:border-[#C5A059] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#C5A059]" />
            Otwórz Warsztat
          </button>
          
          <button
            id="explore-themes-hero-btn"
            onClick={onSelectThemeTab}
            className="px-6 py-3 bg-[#1a1a1e] hover:bg-[#25252b] text-[#E0E0D6] text-xs uppercase tracking-widest border border-[#3D3524] hover:border-[#C5A059] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            Ścieżki Tematyczne
          </button>
        </div>
      </section>

      {/* Czym jest skrutacja — Wyjaśnienie */}
      <section className="bg-[#141417] p-6 sm:p-8 border border-[#3D3524] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#3D3524]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1a1a1e] border border-[#3D3524] flex items-center justify-center text-[#C5A059]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-medium tracking-wide text-[#C5A059]">
                Co to jest Skrutacja Pisma Świętego?
              </h2>
              <p className="text-xs text-[#8C8270] font-sans">
                Starożytna metoda modlitwy słowem Bożym, w której «Pismo wyjaśnia Pismo»
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#8C8270] hidden sm:inline-block">
            Zasada Odnośników
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 border border-[#3D3524] bg-[#1a1a1e] space-y-2 hover:border-[#C5A059] transition-colors">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A059] block">
              1. Źródło i Etymologia
            </span>
            <p className="text-xs sm:text-sm text-[#8C8270] leading-relaxed">
              Łacińskie słowo <strong className="text-[#E0E0D6]">scrutatio</strong> (od <em>scrutari</em>) oznacza wnikliwe badanie i drążenie. To odpowiedź na wezwanie Jezusa: <em>Scrutamini Scripturas</em> (J 5,39).
            </p>
          </div>

          <div className="p-5 border border-[#3D3524] bg-[#1a1a1e] space-y-2 hover:border-[#C5A059] transition-colors">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A059] block">
              2. Zasada Odnośników
            </span>
            <p className="text-xs sm:text-sm text-[#8C8270] leading-relaxed">
              W skrutacji wędrujemy po <strong className="text-[#E0E0D6]">odnośnikach marginesowych</strong> (z tradycji Biblii Jerozolimskiej). Stary Testament zapowiada Chrystusa, a Nowy rozjaśnia Stary (typologia).
            </p>
          </div>

          <div className="p-5 border border-[#3D3524] bg-[#1a1a1e] space-y-2 hover:border-[#C5A059] transition-colors">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A059] block">
              3. Cel: Spotkanie z Bogiem
            </span>
            <p className="text-xs sm:text-sm text-[#8C8270] leading-relaxed">
              Skrutacja nie jest wyłącznie intelektualną analizą. Jej celem jest odkrycie, jak <strong className="text-[#E0E0D6]">historia zbawienia realizuje się dzisiaj w moim życiu</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 7 Etapów Skrutacji — Interaktywny przewodnik */}
      <section className="bg-[#141417] p-6 sm:p-8 border border-[#3D3524] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D3524]">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-medium tracking-wide text-[#C5A059]">
              7 Etapów Skrutacji Krok po Kroku
            </h2>
            <p className="text-xs text-[#8C8270] font-sans">
              Droga modlitwy od wezwania Ducha Świętego po Słowo Życia (Rhema)
            </p>
          </div>
          <span className="text-[10px] px-3 py-1 bg-[#1a1a1e] text-[#C5A059] border border-[#3D3524] uppercase tracking-widest self-start sm:self-auto font-sans">
            Tradycja Kościoła
          </span>
        </div>

        {/* Step Buttons */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin">
          {PRAYER_STEPS_INFO.map((step) => {
            const isSelected = activeStepTab === step.step;
            return (
              <button
                key={step.step}
                id={`guide-step-tab-${step.step}`}
                onClick={() => setActiveStepTab(step.step)}
                className={`px-3 py-2 text-xs font-sans uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1a1a1e] border-[#C5A059] text-[#C5A059]'
                    : 'bg-[#0F0F12] border-[#3D3524] text-[#8C8270] hover:text-[#E0E0D6] hover:border-[#8C8270]'
                }`}
              >
                <span className={`w-4 h-4 flex items-center justify-center text-[10px] font-bold ${
                  isSelected ? 'text-[#C5A059]' : 'text-[#8C8270]'
                }`}>
                  {step.step + 1}.
                </span>
                <span>{step.latinName.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Step Content */}
        {(() => {
          const current = PRAYER_STEPS_INFO[activeStepTab];
          return (
            <div className="p-6 border border-[#3D3524] bg-[#1a1a1e] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A059]">
                    KROK {current.step + 1} Z 7
                  </span>
                  <h3 className="font-display text-xl font-light tracking-wide text-[#E0E0D6]">
                    {current.latinName}
                  </h3>
                  <p className="text-xs text-[#8C8270] font-sans uppercase tracking-wider">
                    {current.polishName}
                  </p>
                </div>
                <div className="text-[10px] px-3 py-1 bg-[#0F0F12] text-[#8C8270] border border-[#3D3524] uppercase tracking-widest self-start font-sans">
                  Czas: <strong className="text-[#C5A059]">ok. {current.defaultTimeMin} min</strong>
                </div>
              </div>

              <p className="text-sm text-[#E0E0D6] leading-relaxed">
                {current.shortDesc}
              </p>

              <div className="p-4 bg-[#0F0F12] border border-[#3D3524] text-xs text-[#8C8270] leading-relaxed">
                <div className="font-sans uppercase text-[10px] text-[#C5A059] tracking-wider mb-1">
                  Praktyczna wskazówka:
                </div>
                {current.guide}
              </div>
            </div>
          );
        })()}
      </section>

      {/* Modlitewnik do Ducha Świętego */}
      <section className="bg-[#141417] p-6 sm:p-8 border border-[#3D3524] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#3D3524]">
          <div className="w-8 h-8 rounded bg-[#1a1a1e] border border-[#3D3524] flex items-center justify-center text-[#C5A059]">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-xl font-medium tracking-wide text-[#C5A059]">
              Modlitwy do Ducha Świętego (Invocatio)
            </h2>
            <p className="text-xs text-[#8C8270] font-sans">
              Nie rozpoczynaj skrutacji bez wezwania Tego, który natchnął Pismo Święte
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOLY_SPIRIT_PRAYERS.map((prayer, idx) => (
            <div key={idx} className="p-5 border border-[#3D3524] bg-[#1a1a1e] flex flex-col justify-between space-y-4 hover:border-[#C5A059] transition-colors">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-sm font-medium tracking-wide text-[#C5A059]">
                    {prayer.title}
                  </h3>
                  <button
                    id={`copy-prayer-${idx}`}
                    onClick={() => handleCopyPrayer(prayer.text, idx)}
                    className="p-1.5 text-[#8C8270] hover:text-[#C5A059] hover:bg-[#0F0F12] transition-colors"
                    title="Kopiuj tekst modlitwy"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {prayer.author && (
                  <p className="text-[10px] text-[#8C8270] font-sans uppercase tracking-widest mb-3">
                    {prayer.author}
                  </p>
                )}
                <p className="font-scripture text-xs sm:text-sm text-[#E0E0D6] italic whitespace-pre-line leading-relaxed">
                  {prayer.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Najczęściej zadawane pytania (FAQ) */}
      <section className="bg-[#141417] p-6 sm:p-8 border border-[#3D3524] space-y-6">
        <h2 className="font-display text-lg sm:text-xl font-medium tracking-wide text-[#C5A059] pb-3 border-b border-[#3D3524]">
          Pytania i Odpowiedzi o Skrutacji
        </h2>

        <div className="space-y-3">
          {SCRUTATION_THEOLOGY_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="border border-[#3D3524] bg-[#1a1a1e] overflow-hidden transition-colors"
              >
                <button
                  id={`faq-toggle-${index}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-5 py-3.5 text-left text-sm font-medium text-[#E0E0D6] bg-[#1a1a1e] hover:bg-[#202025] flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-medium text-xs sm:text-sm">{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#C5A059] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#8C8270] shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 py-4 bg-[#0F0F12] text-xs sm:text-sm text-[#8C8270] leading-relaxed border-t border-[#3D3524] font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center py-4">
        <button
          id="start-first-scrutation-btn"
          onClick={() => onStartScrutation()}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C5A059] hover:bg-[#b08e4d] text-[#0F0F12] font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer"
        >
          <span>Otwórz Warsztat i Rozpocznij Skrutację</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
