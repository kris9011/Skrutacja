import React from 'react';
import { BookOpen, Compass, BookmarkCheck, Library, Flame, Sparkles, CalendarDays, Droplets, Leaf, Network, Scroll, Users, Smartphone, Download, RotateCcw, BellRing, Bell, Church } from 'lucide-react';
import { ScrutationReminderSettings } from '../types';

interface HeaderProps {
  activeTab: 'simple' | 'daily' | 'workspace' | 'tree' | 'patristic' | 'jewish' | 'community' | 'journal' | 'guide' | 'themes' | 'books' | 'breviary';
  setActiveTab: (tab: 'simple' | 'daily' | 'workspace' | 'tree' | 'patristic' | 'jewish' | 'community' | 'journal' | 'guide' | 'themes' | 'books' | 'breviary') => void;
  hasActiveSession: boolean;
  onReplayIntro?: () => void;
  onOpenResetModal?: () => void;
  onOpenReminderModal: () => void;
  onOpenInstallModal: (platform: 'ios' | 'android') => void;
  onOpenDrawWordModal?: () => void;
  reminderSettings: ScrutationReminderSettings;
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
  reminderSettings
}) => {

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/90 shadow-xs transition-colors">
      {/* Top Scripture Edition Notice & Mobile App Shortcuts Strip */}
      <div 
        className="bg-emerald-50/95 border-b border-emerald-200/60 text-[11px] font-sans text-emerald-950 px-3 sm:px-6 transition-all"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 6px)',
          paddingBottom: '6px'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium truncate text-[10px] sm:text-[11px]">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Tekst: <strong className="text-emerald-950 font-semibold">Biblia Tysiąclecia</strong></span>
            <span className="text-emerald-400 hidden md:inline">•</span>
            <span className="hidden md:inline">Aparat: <strong className="text-emerald-950 font-semibold">Biblia Jerozolimska</strong></span>
          </div>

          {/* Action Buttons: Reset, Intro, iOS & Android */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Daily Reminder Bell Button */}
            <button
              type="button"
              id="header-reminder-btn"
              onClick={onOpenReminderModal}
              title={`Przypomnienie o skrutacji ${reminderSettings.enabled ? `(Włączone: ${reminderSettings.scheduledTime})` : '(Wyłączone)'}`}
              className={`h-7 px-2 sm:px-2.5 rounded-lg border text-[11px] font-sans font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 group ${
                reminderSettings.enabled
                  ? 'bg-emerald-100 hover:bg-emerald-200/90 border-emerald-400 text-emerald-950'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              {reminderSettings.enabled ? (
                <BellRing className="w-3.5 h-3.5 text-emerald-700 animate-bounce shrink-0" />
              ) : (
                <Bell className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-700 shrink-0" />
              )}
              <span className="hidden sm:inline">
                {reminderSettings.enabled ? reminderSettings.scheduledTime : 'Przypomnienie'}
              </span>
              {reminderSettings.enabled && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping hidden sm:inline-block" />
              )}
            </button>

            {/* Prominent Reset Button */}
            {onOpenResetModal && (
              <button
                type="button"
                id="header-reset-btn"
                onClick={onOpenResetModal}
                title="Wyzeruj drzewko lub całą aplikację"
                className="h-7 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-sans font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Wyzeruj</span>
              </button>
            )}

            {/* Replay Holy Spirit Intro Button */}
            {onReplayIntro && (
              <button
                type="button"
                id="replay-intro-btn"
                onClick={onReplayIntro}
                title="W świetle Ducha Świętego — otwórz intro"
                className="h-7 px-2 rounded-lg bg-white hover:bg-amber-50 border border-amber-300/80 text-amber-900 font-sans font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer active:scale-95 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-600 animate-pulse" />
                <span className="hidden md:inline">Duch Święty</span>
              </button>
            )}

            {/* iOS Square Button */}
            <button
              type="button"
              id="download-ios-btn"
              onClick={() => onOpenInstallModal('ios')}
              title="Zainstaluj aplikację na iPhone / iPad (iOS)"
              className="h-7 px-2 sm:px-2.5 rounded-lg bg-white hover:bg-emerald-100/90 border border-emerald-300 text-slate-900 hover:text-emerald-950 font-sans font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 group"
            >
              <svg className="w-3.5 h-3.5 fill-slate-800 group-hover:fill-black shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.83-11.74-14.36-5.45-8.62-9.76-18.49-12.93-29.62-3.18-11.13-4.77-21.75-4.77-31.86 0-14.85 3.73-27.1 11.2-36.74 7.46-9.65 17.06-14.58 28.79-14.79 4.35 0 9.42 1.16 15.22 3.49 5.8 2.33 9.46 3.55 10.99 3.65 1.53 0 5.48-1.38 11.85-4.13 6.37-2.75 11.96-3.92 16.78-3.49 12.8.95 22.84 5.92 30.13 14.92-11.43 6.88-17.04 16.51-16.82 28.89.21 9.74 3.97 17.89 11.28 24.45 7.31 6.56 16.03 10.16 26.16 10.79-2.22 6.78-4.97 13.97-8.25 21.57zM119.22 31.84c0-7.3 2.65-14.13 7.94-20.48 5.29-6.35 11.8-10.48 19.53-12.39.42 1.06.63 2.12.63 3.17 0 7.3-2.7 14.23-8.1 20.79-5.4 6.56-11.91 10.48-19.53 11.75-.11-.95-.47-1.91-.47-2.84z" />
              </svg>
              <span>iOS</span>
            </button>

            {/* Android Square Button */}
            <button
              type="button"
              id="download-android-btn"
              onClick={() => onOpenInstallModal('android')}
              title="Zainstaluj aplikację na telefon Android"
              className="h-7 px-2 sm:px-2.5 rounded-lg bg-white hover:bg-emerald-100/90 border border-emerald-300 text-slate-900 hover:text-emerald-950 font-sans font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 group"
            >
              <svg className="w-3.5 h-3.5 fill-emerald-700 group-hover:fill-emerald-800 shrink-0" viewBox="0 0 24 24">
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
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400 group-hover:shadow-md flex items-center justify-center text-white transition-all shadow-xs">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                  SKRUTACJA
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 hidden sm:inline-block">
                  Scripturae
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans font-medium tracking-wide hidden lg:block">
                Biblia Tysiąclecia (Wyd. V) • Biblia Jerozolimska • Ojcowie Kościoła • Targumy
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 font-sans text-xs tracking-wider text-slate-600 custom-scrollbar">
            <button
              id="nav-daily-btn"
              onClick={() => setActiveTab('daily')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 'daily'
                  ? 'text-emerald-900 bg-emerald-100/80 border border-emerald-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Czytania z liturgii dnia i wybór fragmentu"
            >
              <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
              <span>Czytania</span>
            </button>

            <button
              id="nav-tree-btn"
              onClick={() => setActiveTab('tree')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 'tree'
                  ? 'text-emerald-900 bg-emerald-100/80 border border-emerald-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Wizualne interaktywne drzewo skrutacji (graf wersetów)"
            >
              <Network className="w-3.5 h-3.5 text-emerald-600" />
              <span>Drzewko</span>
              {hasActiveSession && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Brewiarz (Liturgia Godzin) */}
            <button
              id="nav-breviary-btn"
              onClick={() => setActiveTab('breviary')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 'breviary'
                  ? 'text-amber-950 bg-amber-100 border border-amber-400 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Liturgia Godzin (Brewiarz dla Świeckich i Duchownych)"
            >
              <Church className="w-3.5 h-3.5 text-amber-600" />
              <span>Brewiarz</span>
            </button>

            {/* Losuj Słowo Boże Modal Trigger */}
            {onOpenDrawWordModal && (
              <button
                id="nav-draw-word-btn"
                onClick={onOpenDrawWordModal}
                className="py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-bold whitespace-nowrap bg-gradient-to-r from-amber-500/15 via-yellow-400/20 to-amber-500/15 text-amber-900 border border-amber-400/50 hover:bg-amber-100/90 shadow-xs"
                title="Wylosuj natchnione Słowo Boże (Rhema) z siglami i kontekstem"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Losuj Słowo</span>
              </button>
            )}

            <button
              id="nav-workspace-btn"
              onClick={() => setActiveTab('workspace')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 'workspace'
                  ? 'text-emerald-900 bg-emerald-100/80 border border-emerald-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Pulpit badania i odnośniki biblijne"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Odnośniki</span>
            </button>

            <button
              id="nav-jewish-btn"
              onClick={() => setActiveTab('jewish')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 'jewish'
                  ? 'text-amber-950 bg-amber-100 border border-amber-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Tradycja Żydowska, Targumy aramejskie i Midrasze"
            >
              <Scroll className="w-3.5 h-3.5 text-amber-600" />
              <span>Tradycja Żydowska</span>
            </button>

            <button
              id="nav-patristic-btn"
              onClick={() => setActiveTab('patristic')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 'patristic'
                  ? 'text-sky-900 bg-sky-100/80 border border-sky-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Komentarze Ojców Kościoła i języki oryginalne"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-600" />
              <span>Ojcowie</span>
            </button>

            <button
              id="nav-community-btn"
              onClick={() => setActiveTab('community')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 'community'
                  ? 'text-emerald-900 bg-emerald-100/80 border border-emerald-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Wspólnotowe dzielenie słowem i krąg biblijny"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Wspólnota</span>
            </button>

            <button
              id="nav-journal-btn"
              onClick={() => setActiveTab('journal')}
              className={`py-1.5 px-2.5 text-xs transition-all rounded-xl flex items-center gap-1.5 cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 'journal'
                  ? 'text-emerald-900 bg-emerald-100/80 border border-emerald-300 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title="Osobisty Dziennik Duchowy"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dziennik</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};


