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
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center flex flex-col items-center shadow-xs">
        <div className="w-12 h-1 bg-emerald-500 rounded-full mb-4" />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider rounded-full mb-4 shadow-xs">
          <Flame className="w-3.5 h-3.5 text-emerald-600" />
          <span>Scrutatio Scripturae</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 mb-6">
          SKRUTACJA PISMA ŚWIĘTEGO
        </h1>

        <p className="font-serif text-xl sm:text-2xl text-slate-800 italic max-w-2xl leading-relaxed mb-4">
          «Badajcie Pisma, ponieważ sądzicie, że w nich zawarte jest życie wieczne: to one właśnie dają o Mnie świadectwo.»
        </p>

        <div className="flex items-center gap-4 mb-8">
          <span className="h-px w-8 bg-slate-200" />
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-emerald-800">
            Ewangelia wg św. Jana 5, 39
          </span>
          <span className="h-px w-8 bg-slate-200" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onSelectDailyTab && (
            <button
              id="daily-readings-hero-btn"
              onClick={onSelectDailyTab}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Czytania z Dnia & Fragmenty</span>
            </button>
          )}

          <button
            id="start-scrutation-hero-btn"
            onClick={() => onStartScrutation()}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 text-xs uppercase tracking-wider border border-slate-300 font-bold transition-all rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Otwórz Warsztat</span>
          </button>
          
          <button
            id="explore-themes-hero-btn"
            onClick={onSelectThemeTab}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 text-xs uppercase tracking-wider border border-slate-300 font-bold transition-all rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Ścieżki Tematyczne</span>
          </button>
        </div>
      </section>

      {/* Czym jest skrutacja — Wyjaśnienie */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Co to jest Skrutacja Pisma Świętego?
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Starożytna metoda modlitwy słowem Bożym, w której «Pismo wyjaśnia Pismo»
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-slate-500 hidden sm:inline-block bg-slate-100 px-2.5 py-1 rounded-lg">
            Zasada Odnośników
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 border border-slate-200 bg-slate-50/70 rounded-2xl space-y-2 hover:border-emerald-300 hover:bg-white transition-all">
            <span className="text-[11px] font-sans uppercase tracking-wider text-emerald-800 font-bold block">
              1. Źródło i Etymologia
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Łacińskie słowo <strong className="text-slate-900">scrutatio</strong> (od <em>scrutari</em>) oznacza wnikliwe badanie i drążenie. To odpowiedź na wezwanie Jezusa: <em>Scrutamini Scripturas</em> (J 5,39).
            </p>
          </div>

          <div className="p-5 border border-slate-200 bg-slate-50/70 rounded-2xl space-y-2 hover:border-emerald-300 hover:bg-white transition-all">
            <span className="text-[11px] font-sans uppercase tracking-wider text-emerald-800 font-bold block">
              2. Zasada Odnośników
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              W skrutacji wędrujemy po <strong className="text-slate-900">odnośnikach marginesowych</strong> (z tradycji Biblii Jerozolimskiej). Stary Testament zapowiada Chrystusa, a Nowy rozjaśnia Stary (typologia).
            </p>
          </div>

          <div className="p-5 border border-slate-200 bg-slate-50/70 rounded-2xl space-y-2 hover:border-emerald-300 hover:bg-white transition-all">
            <span className="text-[11px] font-sans uppercase tracking-wider text-emerald-800 font-bold block">
              3. Cel: Spotkanie z Bogiem
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Skrutacja nie jest wyłącznie intelektualną analizą. Jej celem jest odkrycie, jak <strong className="text-slate-900">historia zbawienia realizuje się dzisiaj w moim życiu</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 7 Etapów Skrutacji — Interaktywny przewodnik */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              7 Etapów Skrutacji Krok po Kroku
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Droga modlitwy od wezwania Ducha Świętego po Słowo Życia (Rhema)
            </p>
          </div>
          <span className="text-[10px] px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 uppercase tracking-wider font-bold rounded-lg self-start sm:self-auto font-sans">
            Tradycja Kościoła
          </span>
        </div>

        {/* Step Buttons */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin">
          {PRAYER_STEPS_INFO.map((step) => {
            const isSelected = activeStepTab === step.step;
            return (
              <button
                key={`guide-step-${step.step}`}
                id={`guide-step-tab-${step.step}`}
                onClick={() => setActiveStepTab(step.step)}
                className={`px-3.5 py-2 text-xs font-sans uppercase tracking-wider whitespace-nowrap transition-all rounded-xl flex items-center gap-2 cursor-pointer border font-semibold ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={`w-4 h-4 flex items-center justify-center text-[10px] font-bold ${
                  isSelected ? 'text-white' : 'text-slate-400'
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
            <div className="p-6 border border-slate-200 bg-slate-50/70 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-800">
                    KROK {current.step + 1} Z 7
                  </span>
                  <h3 className="font-serif text-xl font-bold tracking-tight text-slate-900">
                    {current.latinName}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans uppercase tracking-wider font-semibold">
                    {current.polishName}
                  </p>
                </div>
                <div className="text-[10px] px-3 py-1 bg-white text-slate-600 border border-slate-200 uppercase tracking-wider font-semibold rounded-lg self-start">
                  Czas: <strong className="text-emerald-800">ok. {current.defaultTimeMin} min</strong>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-serif">
                {current.shortDesc}
              </p>

              <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed shadow-xs">
                <div className="font-sans uppercase text-[10px] text-emerald-800 font-bold tracking-wider mb-1">
                  Praktyczna wskazówka:
                </div>
                {current.guide}
              </div>
            </div>
          );
        })()}
      </section>

      {/* Modlitewnik do Ducha Świętego */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Modlitwy do Ducha Świętego (Invocatio)
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Nie rozpoczynaj skrutacji bez wezwania Tego, który natchnął Pismo Święte
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOLY_SPIRIT_PRAYERS.map((prayer, idx) => (
            <div key={`guide-prayer-${prayer.title || idx}`} className="p-5 border border-slate-200 bg-slate-50/70 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:bg-white transition-all shadow-xs">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-serif text-base font-bold text-slate-900">
                    {prayer.title}
                  </h3>
                  <button
                    id={`copy-prayer-${idx}`}
                    onClick={() => handleCopyPrayer(prayer.text, idx)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title="Kopiuj tekst modlitwy"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {prayer.author && (
                  <p className="text-[10px] text-slate-500 font-sans font-bold uppercase tracking-wider mb-3">
                    {prayer.author}
                  </p>
                )}
                <p className="font-serif text-xs sm:text-sm text-slate-800 italic whitespace-pre-line leading-relaxed">
                  {prayer.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Najczęściej zadawane pytania (FAQ) */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
        <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900 pb-3 border-b border-slate-100">
          Pytania i Odpowiedzi o Skrutacji
        </h2>

        <div className="space-y-3">
          {SCRUTATION_THEOLOGY_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={`guide-faq-${index}`}
                className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  id={`faq-toggle-${index}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-5 py-3.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif text-sm sm:text-base">{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 py-4 bg-slate-50/80 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-sans">
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
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-xl cursor-pointer shadow-md"
        >
          <span>Otwórz Warsztat i Rozpocznij Skrutację</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
