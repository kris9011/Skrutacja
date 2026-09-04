import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Bell, 
  BellRing, 
  Clock, 
  Search, 
  RotateCcw, 
  BookOpen, 
  ChevronRight, 
  Share2, 
  Copy, 
  Check, 
  Flame, 
  ArrowLeft,
  Volume2,
  Bookmark
} from 'lucide-react';
import { 
  NOVENAS_LIST, 
  LITANIES_LIST, 
  CatholicNovena, 
  CatholicLitany, 
  NovenaDayItem 
} from '../data/novenasAndLitaniesData';

const LOCAL_STORAGE_NOVENAS_PROGRESS = 'scrutatio_novenas_progress_v1';
const LOCAL_STORAGE_NOVENA_REMINDERS = 'scrutatio_novena_reminders_v1';

export interface NovenaProgressRecord {
  completedDays: number[];
  startedAt?: string;
  lastPrayedDate?: string;
}

export interface NovenaReminderConfig {
  enabled: boolean;
  time: string; // "HH:MM"
  novenaId: string;
}

interface LitaniesAndNovenasViewProps {
  initialNovenaId?: string;
  onOpenJournalForPrayer?: (title: string, text: string) => void;
}

export const LitaniesAndNovenasView: React.FC<LitaniesAndNovenasViewProps> = ({ 
  initialNovenaId,
  onOpenJournalForPrayer 
}) => {
  // Main view mode: 'novenas' | 'litanies'
  const [mainMode, setMainMode] = useState<'novenas' | 'litanies'>('novenas');

  // Selected items
  const [selectedNovena, setSelectedNovena] = useState<CatholicNovena | null>(() => {
    if (initialNovenaId) {
      return NOVENAS_LIST.find((n) => n.id === initialNovenaId) || NOVENAS_LIST[0];
    }
    return null;
  });
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedLitany, setSelectedLitany] = useState<CatholicLitany | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Wszystkie');

  // Progress state: Record<novenaId, NovenaProgressRecord>
  const [progressMap, setProgressMap] = useState<Record<string, NovenaProgressRecord>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_NOVENAS_PROGRESS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Reminder state: Record<novenaId, NovenaReminderConfig>
  const [remindersMap, setRemindersMap] = useState<Record<string, NovenaReminderConfig>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_NOVENA_REMINDERS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // UI helpers
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Persist progress
  const saveProgress = (newMap: Record<string, NovenaProgressRecord>) => {
    setProgressMap(newMap);
    try {
      localStorage.setItem(LOCAL_STORAGE_NOVENAS_PROGRESS, JSON.stringify(newMap));
    } catch (e) {
      console.error('Error saving novena progress:', e);
    }
  };

  // Persist reminders
  const saveReminders = (newMap: Record<string, NovenaReminderConfig>) => {
    setRemindersMap(newMap);
    try {
      localStorage.setItem(LOCAL_STORAGE_NOVENA_REMINDERS, JSON.stringify(newMap));
    } catch (e) {
      console.error('Error saving novena reminders:', e);
    }
  };

  // Check if a day is completed
  const isDayCompleted = (novenaId: string, day: number) => {
    return progressMap[novenaId]?.completedDays?.includes(day) || false;
  };

  // Get current active day for a novena (first uncompleted day, max totalDays)
  const getNextDayToPray = (novena: CatholicNovena): number => {
    const completed = progressMap[novena.id]?.completedDays || [];
    for (let d = 1; d <= novena.totalDays; d++) {
      if (!completed.includes(d)) return d;
    }
    return novena.totalDays;
  };

  // Toggle day completion
  const handleToggleDay = (novenaId: string, dayNumber: number) => {
    const current = progressMap[novenaId] || { completedDays: [] };
    const exists = current.completedDays.includes(dayNumber);
    let updatedDays: number[];

    if (exists) {
      updatedDays = current.completedDays.filter((d) => d !== dayNumber);
    } else {
      updatedDays = [...current.completedDays, dayNumber].sort((a, b) => a - b);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newRecord: NovenaProgressRecord = {
      ...current,
      completedDays: updatedDays,
      lastPrayedDate: todayStr,
      startedAt: current.startedAt || todayStr
    };

    const newMap = { ...progressMap, [novenaId]: newRecord };
    saveProgress(newMap);

    // If marked as completed and there's a next day, advance to it
    if (!exists && dayNumber < 9) {
      setSelectedDayNumber(dayNumber + 1);
    }
  };

  // Reset novena progress
  const handleResetNovena = (novenaId: string) => {
    if (confirm('Czy na pewno chcesz wyzerować postęp tej nowenny i rozpocząć od Dnia 1?')) {
      const newMap = { ...progressMap };
      delete newMap[novenaId];
      saveProgress(newMap);
      setSelectedDayNumber(1);
    }
  };

  // Save reminder settings
  const handleToggleReminder = (novenaId: string, defaultTime = '20:00') => {
    const current = remindersMap[novenaId] || { enabled: false, time: defaultTime, novenaId };
    const nextEnabled = !current.enabled;
    const updated = {
      ...remindersMap,
      [novenaId]: { ...current, enabled: nextEnabled }
    };
    saveReminders(updated);

    if (nextEnabled) {
      setReminderToast(`Włączono przypomnienie codzienne o godz. ${current.time || defaultTime}. Aplikacja przypomni o modlitwie!`);
      // Request browser notification permission if available
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } else {
      setReminderToast('Wyłączono codzienne przypomnienie.');
    }
    setTimeout(() => setReminderToast(null), 3500);
  };

  const handleChangeReminderTime = (novenaId: string, newTime: string) => {
    const current = remindersMap[novenaId] || { enabled: true, time: newTime, novenaId };
    const updated = {
      ...remindersMap,
      [novenaId]: { ...current, time: newTime, enabled: true }
    };
    saveReminders(updated);
    setReminderToast(`Ustawiono godzinę przypomnienia na ${newTime}`);
    setTimeout(() => setReminderToast(null), 3000);
  };

  // Copy helper
  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      console.warn('Clipboard write failed');
    }
  };

  // Filtered lists
  const filteredNovenas = NOVENAS_LIST.filter((n) => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.patron.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'Wszystkie' || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredLitanies = LITANIES_LIST.filter((l) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      l.title.toLowerCase().includes(query) ||
      l.subtitle.toLowerCase().includes(query) ||
      (l.latinTitle && l.latinTitle.toLowerCase().includes(query)) ||
      l.description.toLowerCase().includes(query);
    const matchesCat = categoryFilter === 'Wszystkie' || l.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      {/* Top Banner & Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold uppercase tracking-wider rounded-full shadow-xs">
          <Heart className="w-3.5 h-3.5 text-amber-700" />
          <span>Skarbiec Modlitwy Kościoła</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Litanie i Nowenny
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Codzienne 9-dniowe nowenny z zaznaczaniem ukończonych dni, przypomnieniami i pełnymi tekstami oraz bogaty zbiór litanii Kościoła Katolickiego.
        </p>

        {/* Mode Selector Tabs (Nowenny / Litanie) */}
        <div className="inline-flex p-1 bg-stone-100 rounded-2xl border border-stone-200 mt-2 shadow-inner">
          <button
            id="tab-novenas-btn"
            onClick={() => {
              setMainMode('novenas');
              setSelectedLitany(null);
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mainMode === 'novenas'
                ? 'bg-white text-emerald-900 shadow-2xs border border-stone-200 font-extrabold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-700" />
            <span>Nowenny (9 Dni)</span>
          </button>
          <button
            id="tab-litanies-btn"
            onClick={() => {
              setMainMode('litanies');
              setSelectedNovena(null);
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mainMode === 'litanies'
                ? 'bg-white text-emerald-900 shadow-2xs border border-stone-200 font-extrabold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-800" />
            <span>Litanie Kościoła ({LITANIES_LIST.length})</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {reminderToast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce-in bg-amber-50 border border-amber-300 text-amber-950 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium">
          <BellRing className="w-4 h-4 text-amber-600 animate-bounce shrink-0" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. NOWENNY MODE                                           */}
      {/* ========================================================= */}
      {mainMode === 'novenas' && (
        <>
          {/* If a Novena is selected, show its full 9-Day details view */}
          {selectedNovena ? (
            <div className="space-y-6">
              {/* Back to list bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <button
                  onClick={() => setSelectedNovena(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-800 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Wróć do listy nowenn</span>
                </button>

                <div className="flex items-center gap-2">
                  {/* Reset Novena Button */}
                  <button
                    onClick={() => handleResetNovena(selectedNovena.id)}
                    title="Wyzeruj postęp tej nowenny"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Wyzeruj dni</span>
                  </button>

                  {/* Daily Reminder Button */}
                  {(() => {
                    const rem = remindersMap[selectedNovena.id] || { enabled: false, time: '20:00' };
                    return (
                      <div className="flex items-center gap-1.5 bg-amber-50/80 border border-amber-200/80 px-2.5 py-1 rounded-xl">
                        <button
                          onClick={() => handleToggleReminder(selectedNovena.id, rem.time || '20:00')}
                          className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
                            rem.enabled ? 'text-amber-900' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {rem.enabled ? (
                            <BellRing className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                          ) : (
                            <Bell className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{rem.enabled ? 'Przypomnienie wł.' : 'Ustaw przypomnienie'}</span>
                        </button>
                        {rem.enabled && (
                          <input
                            type="time"
                            value={rem.time || '20:00'}
                            onChange={(e) => handleChangeReminderTime(selectedNovena.id, e.target.value)}
                            className="text-[11px] font-mono bg-white border border-amber-300 rounded px-1.5 py-0.5 text-slate-800 focus:outline-none"
                            title="Godzina przypomnienia"
                          />
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Novena Header Card */}
              <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-100/30 border border-amber-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                      {selectedNovena.category}
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      {selectedNovena.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 italic">
                      {selectedNovena.subtitle}
                    </p>
                  </div>

                  {/* Progress Stats Badge */}
                  {(() => {
                    const completedCount = progressMap[selectedNovena.id]?.completedDays?.length || 0;
                    const percent = Math.round((completedCount / selectedNovena.totalDays) * 100);
                    return (
                      <div className="bg-white/90 border border-amber-300/80 rounded-2xl p-3 sm:text-right shrink-0 shadow-xs">
                        <div className="text-xs font-medium text-slate-500">Postęp Nowenny</div>
                        <div className="text-lg font-bold text-amber-900">
                          {completedCount} / {selectedNovena.totalDays} dni ({percent}%)
                        </div>
                        <div className="w-36 h-2 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-amber-100 pt-3">
                  {selectedNovena.description}
                </p>

                {/* 9 Days Selector Bar */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Dni Nowenny (Kliknij dzień, aby przeczytać modlitwę):</span>
                    <span className="text-[11px] text-amber-800 font-normal">
                      Aktywny: Dzień {selectedDayNumber}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                    {selectedNovena.days.map((day) => {
                      const completed = isDayCompleted(selectedNovena.id, day.dayNumber);
                      const isCurrent = selectedDayNumber === day.dayNumber;

                      return (
                        <button
                          key={`novena-${selectedNovena.id}-day-${day.dayNumber}`}
                          onClick={() => setSelectedDayNumber(day.dayNumber)}
                          className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-center relative ${
                            isCurrent
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md ring-2 ring-amber-400/40'
                              : completed
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-tight">Dzień</span>
                          <span className="text-lg font-mono font-extrabold leading-none">{day.dayNumber}</span>
                          {completed ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-slate-950' : 'text-emerald-600'}`} />
                          ) : (
                            <Circle className={`w-3 h-3 ${isCurrent ? 'text-slate-950/40' : 'text-slate-300'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Day Prayer Details Card */}
              {(() => {
                const currentDayData = selectedNovena.days.find((d) => d.dayNumber === selectedDayNumber) || selectedNovena.days[0];
                const dayDone = isDayCompleted(selectedNovena.id, currentDayData.dayNumber);

                return (
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
                    {/* Day Title & Completed Toggle Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                            DZIEŃ {currentDayData.dayNumber} Z {selectedNovena.totalDays}
                          </span>
                          {dayDone && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Odmówiono
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
                          {currentDayData.title}
                        </h3>
                      </div>

                      {/* Primary Action Button: Mark Day as Prayed / Unmark */}
                      <button
                        id="toggle-day-done-btn"
                        onClick={() => handleToggleDay(selectedNovena.id, currentDayData.dayNumber)}
                        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0 active:scale-95 ${
                          dayDone
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:shadow-md'
                        }`}
                      >
                        {dayDone ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Dzień {currentDayData.dayNumber} odmówiony (Kliknij, by odznaczyć)</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-slate-950" />
                            <span>Zaznacz Dzień {currentDayData.dayNumber} jako odmówiony</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Intention & Scripture Quote */}
                    <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 sm:p-5 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-600" />
                        <span>Intencja modlitewna na dziś</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 leading-relaxed">
                        {currentDayData.intention}
                      </p>
                      {currentDayData.scriptureVerse && (
                        <div className="text-xs text-amber-900 font-serif italic pt-1 border-t border-amber-200/50">
                          {currentDayData.scriptureVerse}
                        </div>
                      )}
                    </div>

                    {/* Opening Prayer */}
                    {selectedNovena.openingPrayer && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Modlitwa wstępna:
                        </div>
                        <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                          {selectedNovena.openingPrayer}
                        </div>
                      </div>
                    )}

                    {/* Reflection / Rozważanie */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Rozważanie:
                      </div>
                      <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-sans">
                        {currentDayData.reflection}
                      </p>
                    </div>

                    {/* Prayer on the Day */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Modlitwa na Dzień {currentDayData.dayNumber}:
                      </div>
                      <div className="text-sm sm:text-base text-slate-900 font-serif leading-relaxed bg-amber-50/40 p-5 rounded-2xl border border-amber-200/60 shadow-xs">
                        {currentDayData.prayer}
                      </div>
                    </div>

                    {/* Closing Prayer */}
                    {selectedNovena.closingPrayer && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Uroczysta modlitwa końcowa:
                        </div>
                        <div className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                          {selectedNovena.closingPrayer}
                        </div>
                      </div>
                    )}

                    {/* Bottom Navigation between days */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold">
                      <button
                        disabled={currentDayData.dayNumber <= 1}
                        onClick={() => setSelectedDayNumber(currentDayData.dayNumber - 1)}
                        className={`px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                          currentDayData.dayNumber <= 1
                            ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                            : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                        }`}
                      >
                        ← Poprzedni dzień ({currentDayData.dayNumber - 1})
                      </button>

                      <button
                        onClick={() => handleToggleDay(selectedNovena.id, currentDayData.dayNumber)}
                        className="text-amber-800 hover:text-amber-900 underline underline-offset-4 cursor-pointer"
                      >
                        {dayDone ? 'Oznacz jako nieodmówiony' : 'Odmówione! Przejdź dalej'}
                      </button>

                      <button
                        disabled={currentDayData.dayNumber >= selectedNovena.totalDays}
                        onClick={() => setSelectedDayNumber(currentDayData.dayNumber + 1)}
                        className={`px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                          currentDayData.dayNumber >= selectedNovena.totalDays
                            ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                            : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950 font-extrabold'
                        }`}
                      >
                        Następny dzień ({currentDayData.dayNumber + 1}) →
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Novenas List Grid */
            <div className="space-y-6">
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj nowenny, np. św. Charbel, Węzłów, Miłosierdzie..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm text-slate-900 placeholder-slate-400 shadow-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 self-center">
                  {['Wszystkie', 'Maryjne', 'Pańskie', 'Do Świętych', 'Do Ducha Świętego'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Novenas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredNovenas.map((novena) => {
                  const completedDays = progressMap[novena.id]?.completedDays || [];
                  const count = completedDays.length;
                  const percent = Math.round((count / novena.totalDays) * 100);
                  const nextDay = getNextDayToPray(novena);
                  const reminder = remindersMap[novena.id];

                  return (
                    <div
                      key={novena.id}
                      className="bg-white border border-slate-200 hover:border-amber-400 rounded-3xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {novena.category}
                          </span>
                          {reminder?.enabled && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                              <BellRing className="w-3 h-3 text-amber-600" />
                              {reminder.time || '20:00'}
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                          {novena.title}
                        </h3>
                        <p className="text-xs text-slate-500 italic">
                          {novena.subtitle}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {novena.description}
                        </p>
                      </div>

                      {/* Progress Bar & Day indicators */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                          <span>
                            {count === 0 ? 'Nie rozpoczęto' : `Ukończono ${count} z ${novena.totalDays} dni`}
                          </span>
                          <span className="text-amber-800 font-bold">{percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        {/* Day Circles preview */}
                        <div className="flex items-center justify-between pt-1">
                          {novena.days.map((d) => {
                            const done = completedDays.includes(d.dayNumber);
                            return (
                              <div
                                key={`novena-${novena.id}-dot-${d.dayNumber}`}
                                title={`Dzień ${d.dayNumber}: ${done ? 'Odmówiono' : 'Do odmówienia'}`}
                                className={`w-5 h-5 rounded-full text-[9px] font-mono flex items-center justify-center border transition-all ${
                                  done
                                    ? 'bg-emerald-500 border-emerald-600 text-white font-bold'
                                    : 'bg-slate-50 border-slate-200 text-slate-400'
                                }`}
                              >
                                {d.dayNumber}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedNovena(novena);
                            setSelectedDayNumber(nextDay);
                          }}
                          className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                          <span>Módl się (Dzień {nextDay})</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedNovena(novena);
                            setSelectedDayNumber(1);
                          }}
                          className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>Wszystkie dni</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* 2. LITANIE MODE                                           */}
      {/* ========================================================= */}
      {mainMode === 'litanies' && (
        <>
          {selectedLitany ? (
            /* Selected Litany Prayer View */
            <div className="space-y-6">
              {/* Back to list & reading controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-200">
                <button
                  onClick={() => setSelectedLitany(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-emerald-900 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Wróć do spisu litanii</span>
                </button>

                {/* Font Size & Copy buttons */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white text-xs">
                    <button
                      onClick={() => setFontSize('normal')}
                      className={`px-2.5 py-1 font-bold ${fontSize === 'normal' ? 'bg-emerald-100 text-emerald-900' : 'text-stone-600 hover:bg-stone-50'}`}
                      title="Domyślna czcionka"
                    >
                      A
                    </button>
                    <button
                      onClick={() => setFontSize('large')}
                      className={`px-2.5 py-1 font-bold text-sm ${fontSize === 'large' ? 'bg-emerald-100 text-emerald-900' : 'text-stone-600 hover:bg-stone-50'}`}
                      title="Większa czcionka"
                    >
                      A+
                    </button>
                    <button
                      onClick={() => setFontSize('xlarge')}
                      className={`px-2.5 py-1 font-bold text-base ${fontSize === 'xlarge' ? 'bg-emerald-100 text-emerald-900' : 'text-stone-600 hover:bg-stone-50'}`}
                      title="Największa czcionka"
                    >
                      A++
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const allText = `${selectedLitany.title}\n\n${selectedLitany.openingPrayers.join('\n')}\n\n` +
                        selectedLitany.sections.map(s => s.invocations.map(i => `${i.invocation} — ${i.response}`).join('\n')).join('\n\n') +
                        `\n\n${selectedLitany.concludingPrayers.join('\n')}`;
                      handleCopy(selectedLitany.id, allText);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    {copiedId === selectedLitany.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Skopiowano</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-500" />
                        <span>Kopiuj</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Litany Content Card */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                    {selectedLitany.category}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    {selectedLitany.title}
                  </h2>
                  {selectedLitany.latinTitle && (
                    <div className="text-xs font-serif italic text-amber-800">
                      {selectedLitany.latinTitle}
                    </div>
                  )}
                  <p className="text-xs text-stone-600 leading-relaxed pt-1">
                    {selectedLitany.description}
                  </p>
                </div>

                {/* Opening Invocations (Kyrie eleison, etc.) */}
                <div className="bg-stone-50 p-4 sm:p-6 rounded-2xl border border-stone-200 space-y-1.5 text-center font-serif text-sm sm:text-base text-stone-800">
                  {selectedLitany.openingPrayers.map((op, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {op}
                    </div>
                  ))}
                </div>

                {/* Invocations Sections */}
                <div className={`space-y-6 font-serif ${
                  fontSize === 'xlarge' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                }`}>
                  {selectedLitany.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      {section.sectionTitle && (
                        <div className="font-sans text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-stone-200 pb-1 pt-2">
                          {section.sectionTitle}
                        </div>
                      )}
                      <div className="space-y-2">
                        {section.invocations.map((inv, iIdx) => (
                          <div 
                            key={iIdx}
                            className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 p-2 rounded-xl hover:bg-stone-50 transition-colors border-b border-stone-100"
                          >
                            <span className="text-stone-900 font-medium">
                              {inv.invocation},
                            </span>
                            <span className="text-emerald-900 font-bold italic shrink-0 sm:pl-4">
                              {inv.response}.
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Concluding Prayers (Agnus Dei, etc.) */}
                <div className="bg-amber-50/40 p-5 sm:p-7 rounded-2xl border border-amber-200/80 space-y-3 font-serif text-sm sm:text-base text-stone-900 leading-relaxed">
                  <div className="font-sans text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                    Modlitwy końcowe:
                  </div>
                  {selectedLitany.concludingPrayers.map((cp, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {cp}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Litanies Grid */
            <div className="space-y-6">
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj litanii (np. Imienia Jezus, Rity, Krwi, Wszystkich Świętych)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 placeholder-stone-400 shadow-2xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 self-center">
                  {['Wszystkie', 'Maryjne', 'Pańskie', 'Do Świętych', 'Do Ducha Świętego'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-stone-600 hover:text-stone-900 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Litanies Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filteredLitanies.map((litany) => (
                  <div
                    key={litany.id}
                    className="bg-white border border-stone-200 hover:border-emerald-600 rounded-3xl p-5 sm:p-6 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                          {litany.category}
                        </span>
                        {litany.latinTitle && (
                          <span className="text-[10px] italic font-serif text-amber-800/80 truncate max-w-[130px]">
                            {litany.latinTitle}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                        {litany.title}
                      </h3>
                      <p className="text-xs text-stone-500 italic">
                        {litany.subtitle}
                      </p>
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {litany.description}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedLitany(litany)}
                      className="w-full py-2.5 bg-stone-50 hover:bg-emerald-800 hover:text-white text-emerald-950 text-xs font-sans font-bold uppercase tracking-wider transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200 hover:border-emerald-800 shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-700 group-hover:text-white" />
                      <span>Módl się litanią</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
