import React, { useState } from 'react';
import { THEME_PRESETS } from '../data/biblicalData';
import { BiblicalThemePreset } from '../types';
import { Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface ThemePresetsViewProps {
  onSelectTheme: (preset: BiblicalThemePreset) => void;
}

export const ThemePresetsView: React.FC<ThemePresetsViewProps> = ({ onSelectTheme }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');

  const categories = ['Wszystkie', 'Pascha i Krzyż', 'Przymierze i Wiara', 'Miłosierdzie', 'Duch Święty', 'Uczniostwo'];

  const filteredPresets = selectedCategory === 'Wszystkie'
    ? THEME_PRESETS
    : THEME_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider rounded-full shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Katalog Ścieżek Biblijnych</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Gotowe Tematy Skrutacji
        </h1>
        <p className="text-sm font-serif text-slate-600 leading-relaxed">
          Wybierz sprawdzony łańcuch wersetów oparty na typologii Starego i Nowego Testamentu oraz tradycji biblijnej
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex overflow-x-auto justify-center gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`category-filter-${cat}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-sans uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border font-semibold ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresets.map((preset) => (
          <div
            key={preset.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group shadow-xs"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-lg font-sans uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                  {preset.category}
                </span>
                <span className="text-xs text-slate-500 font-mono font-medium">
                  {preset.suggestedChain.length + 1} wersetów
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-serif">
                  {preset.subtitle}
                </p>
              </div>

              {/* Initial verse box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-mono font-bold text-emerald-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Werset startowy: {preset.initialSiglum}</span>
                </div>
                <p className="font-serif text-xs text-slate-800 line-clamp-3 italic leading-relaxed">
                  «{preset.initialText}»
                </p>
              </div>

              <p className="text-xs text-slate-600 font-serif leading-relaxed">
                {preset.description}
              </p>

              {/* Chain preview pills */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-sans uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                  <Layers className="w-3 h-3 text-emerald-600" />
                  <span>Ścieżka wersetów:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                    {preset.initialSiglum}
                  </span>
                  {preset.suggestedChain.slice(0, 3).map((c, i) => (
                    <React.Fragment key={`chain-${preset.id}-${c.siglum}-${i}`}>
                      <span className="text-slate-400 text-xs">→</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                        {c.siglum}
                      </span>
                    </React.Fragment>
                  ))}
                  {preset.suggestedChain.length > 3 && (
                    <span className="text-slate-500 text-xs font-mono">+{preset.suggestedChain.length - 3}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action button footer */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100">
              <button
                id={`select-theme-${preset.id}`}
                onClick={() => onSelectTheme(preset)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sans uppercase tracking-wider font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Rozpocznij tę Skrutację</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
