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
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 text-[#E0E0D6]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1a1e] border border-[#3D3524] text-[#C5A059] text-[10px] font-sans uppercase tracking-[0.3em]">
          <Sparkles className="w-3.5 h-3.5" />
          Katalog Ścieżek Biblijnych
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-light tracking-wide text-[#C5A059]">
          Gotowe Tematy Skrutacji
        </h1>
        <p className="text-sm font-serif text-[#8C8270]">
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
            className={`px-4 py-2 rounded-lg text-xs font-sans uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
              selectedCategory === cat
                ? 'bg-[#3D3524] text-[#C5A059] border-[#C5A059] font-semibold'
                : 'bg-[#141417] text-[#8C8270] hover:text-[#E0E0D6] border-[#3D3524]'
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
            className="bg-[#141417] rounded-xl border border-[#3D3524] hover:border-[#C5A059] transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded font-sans uppercase tracking-wider bg-[#0F0F12] text-[#C5A059] border border-[#3D3524]">
                  {preset.category}
                </span>
                <span className="text-xs text-[#8C8270] font-mono">
                  {preset.suggestedChain.length + 1} wersetów
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg font-light text-[#E0E0D6] group-hover:text-[#C5A059] transition-colors">
                  {preset.title}
                </h3>
                <p className="text-xs text-[#8C8270] mt-1 font-serif">
                  {preset.subtitle}
                </p>
              </div>

              {/* Initial verse box */}
              <div className="p-3.5 rounded-lg bg-[#0F0F12] border border-[#3D3524] space-y-1">
                <div className="text-xs font-mono font-bold text-[#C5A059] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Werset startowy: {preset.initialSiglum}
                </div>
                <p className="font-scripture text-xs text-[#E0E0D6] line-clamp-3 italic">
                  «{preset.initialText}»
                </p>
              </div>

              <p className="text-xs text-[#8C8270] font-serif leading-relaxed">
                {preset.description}
              </p>

              {/* Chain preview pills */}
              <div className="space-y-1.5 pt-2 border-t border-[#3D3524]/60">
                <div className="text-[10px] font-sans uppercase tracking-widest text-[#8C8270] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#C5A059]" />
                  Ścieżka wersetów:
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#0F0F12] text-[#C5A059] border border-[#3D3524]">
                    {preset.initialSiglum}
                  </span>
                  {preset.suggestedChain.slice(0, 3).map((c, i) => (
                    <React.Fragment key={i}>
                      <span className="text-[#3D3524] text-xs">→</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#0F0F12] text-[#E0E0D6] border border-[#3D3524]">
                        {c.siglum}
                      </span>
                    </React.Fragment>
                  ))}
                  {preset.suggestedChain.length > 3 && (
                    <span className="text-[#8C8270] text-xs font-mono">+{preset.suggestedChain.length - 3}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action button footer */}
            <div className="p-4 bg-[#0F0F12] border-t border-[#3D3524]">
              <button
                id={`select-theme-${preset.id}`}
                onClick={() => onSelectTheme(preset)}
                className="w-full py-2.5 px-4 rounded bg-[#3D3524] hover:bg-[#C5A059] hover:text-[#0F0F12] text-[#C5A059] font-sans uppercase tracking-widest font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
