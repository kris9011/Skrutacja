import React from 'react';
import { BookOpen, Compass, BookmarkCheck, Library, Flame, Sparkles, CalendarDays, Droplets, Leaf, Network, Scroll, Smartphone, Download, RotateCcw, BellRing, Bell, Church, Heart, Layers } from 'lucide-react';
import { ScrutationReminderSettings, MainAppTab } from '../types';

interface HeaderProps {
  activeTab: MainAppTab;
  setActiveTab: (tab: MainAppTab) => void;
  hasActiveSession: boolean;
  onReplayIntro?: () => void;
  onOpenResetModal?: () => void;
  onOpenReminderModal: () => void;
  onOpenInstallModal: (platform: 'ios' | 'android') => void;
  onOpenDrawWordModal?: () => void;
  reminderSettings: ScrutationReminderSettings;
  isPrayerToolsOpen?: boolean;
  onTogglePrayerTools?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  hasActiveSession, 
  onReplayIntro,
  onOpenResetModal,
  onOpenReminderModal,
  onOpenInstallModal,
  onOpenDrawWordModal,
  reminderSettings,
  isPrayerToolsOpen,
  onTogglePrayerTools
}) => {

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/90 shadow-xs transition-colors">
      {/* Top Scripture Edition Notice & Mobile App Shortcuts Strip */}
      <div 
        className="bg-stone-50 border-b border-stone-200/80 text-[11px] font-sans text-stone-700 px-3 sm:px-6 transition-all"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 6px)',
          paddingBottom: '6px'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium truncate text-[10px] sm:text-[11px] text-stone-600">
            <BookOpen className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span>Tekst: <strong className="text-stone-900 font-semibold">Biblia Tysiąclecia</strong></span>
            <span className="text-stone-300 hidden md:inline">•</span>
            <span className="hidden md:inline">Aparat: <strong className="text-stone-900 font-semibold">Biblia Jerozolimska</strong></span>
            <span className="text-stone-300 hidden lg:inline">•</span>
            <span className="hidden lg:inline text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-serif">
              Aparat Ojców Kościoła i Tradycji
            </span>
          </div>

          {/* Action Buttons: Reset, Intro, iOS & Android */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Daily Reminder Bell Button */}
            <button
              type="button"
              id="header-reminder-btn"
              onClick={onOpenReminderModal}
              title={`Przypomnienie o skrutacji ${reminderSettings.enabled ? `(Włączone: ${reminderSettings.scheduledTime})` : '(Wyłączone)'}`}
              className={`h-7 px-2 sm:px-2.5 rounded-lg border text-[11px] font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 group ${
                reminderSettings.enabled
                  ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold'
                  : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
              }`}
            >
              {reminderSettings.enabled ? (
                <BellRing className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              ) : (
                <Bell className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 shrink-0" />
              )}
              <span className="hidden sm:inline">
                {reminderSettings.enabled ? reminderSettings.scheduledTime : 'Przypomnienie'}
              </span>
              {reminderSettings.enabled && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 hidden sm:inline-block" />
              )}
            </button>

            {/* Reset Button - Calmed down neutral styling */}
            {onOpenResetModal && (
              <button
                type="button"
                id="header-reset-btn"
                onClick={onOpenResetModal}
                title="Wyzeruj drzewko lub całą aplikację"
                className="h-7 px-2.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900 font-sans font-medium text-[11px] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Wyzeruj</span>
              </button>
            )}

            {/* Replay Holy Spirit Intro Button */}
            {onReplayIntro && (
              <button
                type="button"
                id="replay-intro-btn"
                onClick={onReplayIntro}
                title="Ekran startowy: Gołębica Ducha Świętego, modlitwa wstępna i wybór drogi modlitwy"
                className="h-7 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-sans font-semibold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 group shadow-xs"
              >
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500/30" />
                <span>Duch Święty</span>
              </button>
            )}

            {/* Prayer Tools Button */}
            {onTogglePrayerTools && (
              <button
                type="button"
                id="header-prayer-tools-btn"
                onClick={onTogglePrayerTools}
                title="Przybornik Modlitewny: Dzwony monastyczne, Auto-scroll, Blokada wygaszania ekranu"
                className={`h-7 px-2.5 rounded-lg border font-sans font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  isPrayerToolsOpen
                    ? 'bg-emerald-800 text-white border-emerald-900 font-semibold'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 shrink-0 ${isPrayerToolsOpen ? 'text-emerald-200' : 'text-stone-500'}`} />
                <span>Przybornik</span>
              </button>
            )}

            {/* iOS Button */}
            <button
              type="button"
              id="download-ios-btn"
              onClick={() => onOpenInstallModal('ios')}
              title="Zainstaluj aplikację na iPhone / iPad (iOS)"
              className="h-7 px-2 sm:px-2.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 font-sans font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-3.5 h-3.5 fill-stone-700 shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.83-11.74-14.36-5.45-8.62-9.76-18.49-12.93-29.62-3.18-11.13-4.77-21.75-4.77-31.86 0-14.85 3.73-27.1 11.2-36.74 7.46-9.65 17.06-14.58 28.79-14.79 4.35 0 9.42 1.16 15.22 3.49 5.8 2.33 9.46 3.55 10.99 3.65 1.53 0 5.48-1.38 11.85-4.13 6.37-2.75 11.96-3.92 16.78-3.49 12.8.95 22.84 5.92 30.13 14.92-11.43 6.88-17.04 16.51-16.82 28.89.21 9.74 3.97 17.89 11.28 24.45 7.31 6.56 16.03 10.16 26.16 10.79-2.22 6.78-4.97 13.97-8.25 21.57zM119.22 31.84c0-7.3 2.65-14.13 7.94-20.48 5.29-6.35 11.8-10.48 19.53-12.39.42 1.06.63 2.12.63 3.17 0 7.3-2.7 14.23-8.1 20.79-5.4 6.56-11.91 10.48-19.53 11.75-.11-.95-.47-1.91-.47-2.84z" />
              </svg>
              <span>iOS</span>
            </button>

            {/* Android Button */}
            <button
              type="button"
              id="download-android-btn"
              onClick={() => onOpenInstallModal('android')}
              title="Zainstaluj aplikację na telefon Android"
              className="h-7 px-2 sm:px-2.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 font-sans font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-3.5 h-3.5 fill-emerald-800 shrink-0" viewBox="0 0 24 24">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4114 13.8533 8.081 12 8.081c-1.8533 0-3.5902.3304-5.1368.8687L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
              </svg>
              <span>Android</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveTab('daily')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group select-none shrink-0"
            id="header-logo-btn"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 border border-emerald-700 flex items-center justify-center text-amber-300 shadow-2xs">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-emerald-900 transition-colors">
                  SKRUTACJA
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hidden sm:inline-block">
                  Scripturae
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-sans font-medium tracking-wide hidden lg:block">
                Biblia Tysiąclecia • Biblia Jerozolimska • Ojcowie Kościoła • Tradycja
              </p>
            </div>
          </div>

          {/* Navigation Links - All features directly accessible */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 font-sans text-xs text-stone-600 custom-scrollbar">
            <button
              id="nav-daily-btn"
              onClick={() => setActiveTab('daily')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'daily'
                  ? 'text-white bg-emerald-800 font-semibold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium'
              }`}
              title="Czytania z liturgii dnia i wybór fragmentu"
            >
              <CalendarDays className={`w-3.5 h-3.5 ${activeTab === 'daily' ? 'text-white' : 'text-emerald-800'}`} />
              <span>Czytania</span>
            </button>

            <button
              id="nav-tree-btn"
              onClick={() => setActiveTab('tree')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'tree'
                  ? 'text-white bg-emerald-800 font-semibold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium'
              }`}
              title="Wizualne interaktywne drzewo skrutacji (graf wersetów)"
            >
              <Network className={`w-3.5 h-3.5 ${activeTab === 'tree' ? 'text-white' : 'text-emerald-800'}`} />
              <span>Drzewko</span>
              {hasActiveSession && (
                <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'tree' ? 'bg-amber-300' : 'bg-emerald-600'} animate-pulse`} />
              )}
            </button>

            {/* Brewiarz (Liturgia Godzin) */}
            <button
              id="nav-breviary-btn"
              onClick={() => setActiveTab('breviary')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'breviary'
                  ? 'text-white bg-emerald-800 font-semibold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium'
              }`}
              title="Liturgia Godzin (Brewiarz dla Świeckich i Duchownych)"
            >
              <Church className={`w-3.5 h-3.5 ${activeTab === 'breviary' ? 'text-white' : 'text-amber-700'}`} />
              <span>Brewiarz</span>
            </button>

            {/* Litanie i Nowenny */}
            <button
              id="nav-litanies-btn"
              onClick={() => setActiveTab('litanies')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'litanies'
                  ? 'text-white bg-emerald-800 font-semibold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium'
              }`}
              title="Litanie i Nowenny"
            >
              <Heart className={`w-3.5 h-3.5 ${activeTab === 'litanies' ? 'text-white fill-white/20' : 'text-amber-700'}`} />
              <span>Litanie i Nowenny</span>
            </button>

            {/* Losuj Słowo Boże */}
            {onOpenDrawWordModal && (
              <button
                id="nav-draw-word-btn"
                onClick={onOpenDrawWordModal}
                className="py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-semibold whitespace-nowrap bg-amber-50/80 hover:bg-amber-100 text-amber-950 border border-amber-300"
                title="Wylosuj natchnione Słowo Boże (Rhema)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Losuj Słowo</span>
              </button>
            )}

            <button
              id="nav-workspace-btn"
              onClick={() => setActiveTab('workspace')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'workspace'
                  ? 'text-white bg-emerald-800 font-semibold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium'
              }`}
              title="Pulpit badania i odnośniki biblijne"
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'workspace' ? 'text-white' : 'text-emerald-800'}`} />
              <span>Odnośniki</span>
            </button>

            {/* Słownik Stronga & Aparat Interlinearny */}
            <button
              id="nav-dictionary-btn"
              onClick={() => setActiveTab('dictionary')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'dictionary'
                  ? 'text-white bg-emerald-800 font-semibold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium'
              }`}
              title="Rozszerzony słownik Stronga, język hebrajski/grecki i układ interlinearny"
            >
              <Layers className={`w-3.5 h-3.5 ${activeTab === 'dictionary' ? 'text-white' : 'text-amber-700'}`} />
              <span>Słownik Stronga</span>
            </button>

            <button
              id="nav-jewish-btn"
              onClick={() => setActiveTab('jewish')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'jewish'
                  ? 'text-white bg-emerald-800 font-semibold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium'
              }`}
              title="Tradycja Żydowska, Targumy aramejskie i Midrasze"
            >
              <Scroll className={`w-3.5 h-3.5 ${activeTab === 'jewish' ? 'text-white' : 'text-amber-700'}`} />
              <span>Tradycja Żydowska</span>
            </button>

            <button
              id="nav-patristic-btn"
              onClick={() => setActiveTab('patristic')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'patristic'
                  ? 'text-white bg-emerald-800 font-semibold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium'
              }`}
              title="Komentarze Ojców Kościoła i języki oryginalne"
            >
              <Droplets className={`w-3.5 h-3.5 ${activeTab === 'patristic' ? 'text-white' : 'text-emerald-800'}`} />
              <span>Ojcowie</span>
            </button>

            <button
              id="nav-journal-btn"
              onClick={() => setActiveTab('journal')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'journal'
                  ? 'text-white bg-emerald-800 font-semibold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium'
              }`}
              title="Osobisty Dziennik Duchowy"
            >
              <BookmarkCheck className={`w-3.5 h-3.5 ${activeTab === 'journal' ? 'text-white' : 'text-emerald-800'}`} />
              <span>Dziennik</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};


