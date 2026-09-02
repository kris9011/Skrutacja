/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SimpleLightScrutationView } from './components/SimpleLightScrutationView';
import { ScrutationGuideView } from './components/ScrutationGuideView';
import { ActiveScrutationWorkspace } from './components/ActiveScrutationWorkspace';
import { ThemePresetsView } from './components/ThemePresetsView';
import { JournalView } from './components/JournalView';
import { BibleBooksView } from './components/BibleBooksView';
import { DailyReadingsAndPassageSelector } from './components/DailyReadingsAndPassageSelector';
import { PatristicView } from './components/PatristicView';
import { ScrutationTreeView } from './components/ScrutationTreeView';
import { JewishTraditionView } from './components/JewishTraditionView';
import { CommunityWordSharingView } from './components/CommunityWordSharingView';
import { BreviaryView } from './components/BreviaryView';
import { RandomScriptureDrawModal } from './components/RandomScriptureDrawModal';
import { IntroSplash, IntroChoice } from './components/IntroSplash';
import { ResetAppModal } from './components/ResetAppModal';
import { DailyReminderModal } from './components/DailyReminderModal';
import { InstallAppModal } from './components/InstallAppModal';
import { ScrutationSession, BiblicalThemePreset, ScrutationReminderSettings, BreviaryAudience } from './types';
import { THEME_PRESETS } from './data/biblicalData';
import { CheckCircle2, Flame, BookOpen, CalendarDays, Sparkles, BookmarkCheck, Network, Scroll, Users, RotateCcw, Church } from 'lucide-react';
import { initNotificationScheduler, getStoredReminderSettings } from './utils/notificationService';

const LOCAL_STORAGE_ACTIVE_SESSION = 'scrutatio_active_session_v1';
const LOCAL_STORAGE_JOURNAL = 'scrutatio_journal_v1';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    // Only show intro splash once per browser session or on reload
    return true;
  });
  const [activeTab, setActiveTab] = useState<'simple' | 'daily' | 'workspace' | 'tree' | 'patristic' | 'jewish' | 'community' | 'journal' | 'guide' | 'themes' | 'books' | 'breviary'>('daily');
  const [breviaryAudience, setBreviaryAudience] = useState<BreviaryAudience>('lay');
  const [isDrawWordModalOpen, setIsDrawWordModalOpen] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<ScrutationSession | null>(null);
  const [journalSessions, setJournalSessions] = useState<ScrutationSession[]>([]);
  const [patristicSiglum, setPatristicSiglum] = useState<string>('Mk 7, 1-8');
  const [jewishSiglum, setJewishSiglum] = useState<string>('Rdz 22, 1-18');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState<boolean>(false);
  const [reminderModalOpen, setReminderModalOpen] = useState<boolean>(false);
  const [installModalOpen, setInstallModalOpen] = useState<boolean>(false);
  const [installPlatform, setInstallPlatform] = useState<'ios' | 'android'>('ios');
  const [reminderSettings, setReminderSettings] = useState<ScrutationReminderSettings>(getStoredReminderSettings);

  // Load from localStorage on mount & initialize daily reminder scheduler
  useEffect(() => {
    try {
      const savedActive = localStorage.getItem(LOCAL_STORAGE_ACTIVE_SESSION);
      if (savedActive) {
        setActiveSession(JSON.parse(savedActive));
      }

      const savedJournal = localStorage.getItem(LOCAL_STORAGE_JOURNAL);
      if (savedJournal) {
        setJournalSessions(JSON.parse(savedJournal));
      }
    } catch (e) {
      console.error('Error loading saved scrutation data:', e);
    }

    // Start background check for scheduled daily scrutation notifications
    initNotificationScheduler((title, body) => {
      showToast(`🔔 ${title}: ${body}`);
    });
  }, []);

  // Save active session to localStorage whenever updated
  const handleUpdateSession = (session: ScrutationSession) => {
    setActiveSession(session);
    try {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_SESSION, JSON.stringify(session));
    } catch (e) {
      console.error('Error storing active session:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save session into journal collection
  const handleSaveToJournal = (session: ScrutationSession) => {
    const existingIndex = journalSessions.findIndex((s) => s.id === session.id);
    let updated: ScrutationSession[];
    if (existingIndex >= 0) {
      updated = [...journalSessions];
      updated[existingIndex] = session;
    } else {
      updated = [session, ...journalSessions];
    }
    setJournalSessions(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_JOURNAL, JSON.stringify(updated));
    } catch (e) {
      console.error('Error storing journal:', e);
    }
    showToast('Skrutacja została pomyślnie zapisana w Twoim Dzienniku!');
  };

  // Delete session from journal
  const handleDeleteFromJournal = (id: string) => {
    const updated = journalSessions.filter((s) => s.id !== id);
    setJournalSessions(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_JOURNAL, JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting from journal:', e);
    }
    showToast('Wpis usunięty z Dziennika');
  };

  // Start new session from preset
  const handleStartPreset = (preset: BiblicalThemePreset) => {
    const newSession: ScrutationSession = {
      id: 'session_' + Date.now(),
      title: preset.title,
      theme: preset.category,
      initialSiglum: preset.initialSiglum,
      initialText: preset.initialText,
      nodes: [
        {
          id: 'node_root',
          parentId: null,
          siglum: preset.initialSiglum,
          text: preset.initialText,
          testament: preset.initialSiglum.startsWith('Wj') || preset.initialSiglum.startsWith('Rdz') || preset.initialSiglum.startsWith('Ps') || preset.initialSiglum.startsWith('Ez') ? 'ST' : 'NT',
          theologicalTheme: preset.title,
          crossReferenceReason: 'Werset wyjściowy (punkt startowy)',
          order: 0,
          isExpanded: true,
          createdAt: Date.now()
        },
        ...preset.suggestedChain.map((c, i) => ({
          id: 'node_preset_' + i,
          parentId: i === 0 ? 'node_root' : 'node_preset_' + (i - 1),
          siglum: c.siglum,
          text: c.text,
          testament: c.testament,
          crossReferenceReason: c.relation,
          order: i + 1,
          isExpanded: true,
          createdAt: Date.now() + (i + 1) * 1000
        }))
      ],
      activeStep: 0,
      prayerNotes: {
        statio: '',
        invocatio: '',
        lectio: '',
        meditatio: '',
        oratio: '',
        contemplatio: '',
        actio: '',
        wordOfLife: ''
      },
      durationSeconds: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    handleUpdateSession(newSession);
    setActiveTab('tree');
    showToast(`Rozpoczęto nową skrutację: "${preset.title}"`);
  };

  // Start generic or custom session
  const handleStartNewGeneric = () => {
    if (!activeSession) {
      handleStartPreset(THEME_PRESETS[0]);
    } else {
      setActiveTab('workspace');
    }
  };

  // Start with book siglum
  const handleSelectBook = (siglum: string) => {
    const newSession: ScrutationSession = {
      id: 'session_' + Date.now(),
      title: `Skrutacja ${siglum}`,
      theme: 'Badanie Księgi',
      initialSiglum: `${siglum} 1, 1`,
      initialText: 'Początek księgi i wsłuchanie się w Boży głos.',
      nodes: [
        {
          id: 'node_root',
          parentId: null,
          siglum: `${siglum} 1, 1`,
          text: 'Początek drogi wersetów.',
          testament: ['Mt','Mk','Łk','J','Dz','Rz','1 Kor','2 Kor','Ga','Ef','Flp','Kol','1 Tes','2 Tes','1 Tm','2 Tm','Tt','Flm','Hbr','Jk','1 P','2 P','1 J','2 J','3 J','Jud','Ap'].includes(siglum) ? 'NT' : 'ST',
          crossReferenceReason: 'Księga wyjściowa',
          order: 0,
          isExpanded: true,
          createdAt: Date.now()
        }
      ],
      activeStep: 0,
      prayerNotes: {
        statio: '',
        invocatio: '',
        lectio: '',
        meditatio: '',
        oratio: '',
        contemplatio: '',
        actio: '',
        wordOfLife: ''
      },
      durationSeconds: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    handleUpdateSession(newSession);
    setActiveTab('tree');
    showToast(`Utworzono sesję skrutacji dla księgi: ${siglum}`);
  };

  // Reset only the active scrutation tree / workspace
  const handleResetActiveTree = () => {
    setActiveSession(null);
    localStorage.removeItem(LOCAL_STORAGE_ACTIVE_SESSION);
    setActiveTab('daily');
    showToast('Wyzerowano bieżące drzewko skrutacji.');
  };

  // Full app data reset
  const handleResetAllData = () => {
    setActiveSession(null);
    setJournalSessions([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_ACTIVE_SESSION);
      localStorage.removeItem(LOCAL_STORAGE_JOURNAL);
      setActiveTab('daily');
      showToast('Wyczyszczono wszystkie dane aplikacji.');
    } catch (e) {
      console.warn('Reset error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Intro Splash Screen with Animated Holy Spirit Dove & Scripture */}
      {showIntro && (
        <IntroSplash 
          onSelectChoice={(choice: IntroChoice) => {
            setShowIntro(false);
            if (choice === 'scrutation') {
              setActiveTab('daily');
            } else if (choice === 'breviary_clergy') {
              setBreviaryAudience('clergy');
              setActiveTab('breviary');
            } else if (choice === 'breviary_lay') {
              setBreviaryAudience('lay');
              setActiveTab('breviary');
            } else if (choice === 'draw_word') {
              setIsDrawWordModalOpen(true);
            }
          }}
          onDismiss={() => setShowIntro(false)} 
        />
      )}

      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveSession={Boolean(activeSession)}
        onReplayIntro={() => setShowIntro(true)}
        onOpenResetModal={() => setResetModalOpen(true)}
        onOpenReminderModal={() => setReminderModalOpen(true)}
        onOpenInstallModal={(platform) => {
          setInstallPlatform(platform);
          setInstallModalOpen(true);
        }}
        onOpenDrawWordModal={() => setIsDrawWordModalOpen(true)}
        reminderSettings={reminderSettings}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-28 md:pb-8">
        {activeTab === 'simple' && (
          <div className="bg-gradient-to-b from-sky-50/40 via-slate-50 to-emerald-50/30 min-h-screen text-slate-900 pb-16">
            <SimpleLightScrutationView
              onStartFullScrutation={(session) => {
                handleUpdateSession(session);
                setActiveTab('tree');
                showToast(`Przeniesiono do drzewka skrutacji: "${session.title}"`);
              }}
              onOpenPatristicView={(sig) => {
                setPatristicSiglum(sig);
                setActiveTab('patristic');
              }}
            />
          </div>
        )}

        {activeTab === 'guide' && (
          <ScrutationGuideView
            onStartScrutation={handleStartNewGeneric}
            onSelectThemeTab={() => setActiveTab('themes')}
            onSelectDailyTab={() => setActiveTab('daily')}
          />
        )}

        {activeTab === 'daily' && (
          <DailyReadingsAndPassageSelector
            onStartScrutationWithPassage={(newSession) => {
              handleUpdateSession(newSession);
              setActiveTab('tree');
              showToast(`Rozpoczęto nową skrutację ze Słowa Bożego: "${newSession.title}"`);
            }}
            onOpenPatristicForVerse={(sig) => {
              setPatristicSiglum(sig);
              setActiveTab('patristic');
            }}
          />
        )}

        {activeTab === 'tree' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <ScrutationTreeView
              session={activeSession}
              onUpdateSession={handleUpdateSession}
              onOpenPatristicsForSiglum={(sig) => {
                setPatristicSiglum(sig);
                setActiveTab('patristic');
              }}
              onOpenJewishTraditionForSiglum={(sig) => {
                setJewishSiglum(sig);
                setActiveTab('jewish');
              }}
              onResetTree={() => setResetModalOpen(true)}
              onOpenDailyTab={() => setActiveTab('daily')}
              onOpenThemesTab={() => setActiveTab('themes')}
              onOpenBooksTab={() => setActiveTab('books')}
            />
          </div>
        )}

        {activeTab === 'workspace' && (
          <ActiveScrutationWorkspace
            session={activeSession}
            onUpdateSession={handleUpdateSession}
            onSaveSessionToJournal={handleSaveToJournal}
            onStartNewSession={handleStartPreset}
            onOpenBooksModal={() => setActiveTab('books')}
            onOpenDailyTab={() => setActiveTab('daily')}
          />
        )}

        {activeTab === 'jewish' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <JewishTraditionView
              initialSiglum={jewishSiglum || activeSession?.initialSiglum || 'Rdz 22, 1-18'}
              onStartScrutationWithVerse={(sig, txt) => {
                const newSession: ScrutationSession = {
                  id: 'session_' + Date.now(),
                  title: `Tradycja Żydowska: ${sig}`,
                  theme: 'Korzenie Pierwszego Przymierza',
                  initialSiglum: sig,
                  initialText: txt,
                  nodes: [
                    {
                      id: 'node_root',
                      parentId: null,
                      siglum: sig,
                      text: txt,
                      testament: sig.startsWith('Mt') || sig.startsWith('J') || sig.startsWith('Łk') ? 'NT' : 'ST',
                      crossReferenceReason: 'Werset wyjściowy z Tradycji Żydowskiej',
                      order: 0,
                      isExpanded: true,
                      createdAt: Date.now()
                    }
                  ],
                  activeStep: 0,
                  prayerNotes: {
                    statio: '',
                    invocatio: '',
                    lectio: '',
                    meditatio: '',
                    oratio: '',
                    contemplatio: '',
                    actio: '',
                    wordOfLife: ''
                  },
                  durationSeconds: 0,
                  isCompleted: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                handleUpdateSession(newSession);
                setActiveTab('tree');
                showToast(`Rozpoczęto skrutację z tradycji żydowskiej: ${sig}`);
              }}
              onOpenPatristicsForSiglum={(sig) => {
                setPatristicSiglum(sig);
                setActiveTab('patristic');
              }}
            />
          </div>
        )}

        {activeTab === 'community' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <CommunityWordSharingView
              currentSession={activeSession}
              onLoadSessionToWorkspace={(sess) => {
                handleUpdateSession(sess);
                setActiveTab('tree');
              }}
            />
          </div>
        )}

        {activeTab === 'patristic' && (
          <div className="p-4 sm:p-8">
            <PatristicView
              defaultSiglum={patristicSiglum || activeSession?.initialSiglum || 'Mk 7, 1-8'}
              onStartScrutationWithVerse={(sig, txt) => {
                const isNT = sig.startsWith('Mt') || sig.startsWith('Mk') || sig.startsWith('Łk') || sig.startsWith('J') || sig.startsWith('Dz') || sig.startsWith('Rz') || sig.startsWith('1 Kor') || sig.startsWith('2 Kor') || sig.startsWith('Ga') || sig.startsWith('Ef') || sig.startsWith('Flp') || sig.startsWith('Kol') || sig.startsWith('1 Tes') || sig.startsWith('2 Tes') || sig.startsWith('1 Tm') || sig.startsWith('2 Tm') || sig.startsWith('Tt') || sig.startsWith('Flm') || sig.startsWith('Hbr') || sig.startsWith('Jk') || sig.startsWith('1 P') || sig.startsWith('2 P') || sig.startsWith('1 J') || sig.startsWith('2 J') || sig.startsWith('3 J') || sig.startsWith('Jud') || sig.startsWith('Ap');
                const newSession: ScrutationSession = {
                  id: 'session_' + Date.now(),
                  title: `Ojcowie Kościoła: ${sig}`,
                  theme: 'Tradycja Patrystyczna',
                  initialSiglum: sig,
                  initialText: txt,
                  nodes: [
                    {
                      id: 'node_root',
                      parentId: null,
                      siglum: sig,
                      text: txt,
                      testament: isNT ? 'NT' : 'ST',
                      crossReferenceReason: 'Werset wyjściowy z Tradycji Ojców Kościoła',
                      order: 0,
                      isExpanded: true,
                      createdAt: Date.now()
                    }
                  ],
                  activeStep: 0,
                  prayerNotes: {
                    statio: '',
                    invocatio: '',
                    lectio: '',
                    meditatio: '',
                    oratio: '',
                    contemplatio: '',
                    actio: '',
                    wordOfLife: ''
                  },
                  durationSeconds: 0,
                  isCompleted: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                handleUpdateSession(newSession);
                setActiveTab('tree');
                showToast(`Rozpoczęto skrutację z komentarza Ojców: ${sig}`);
              }}
            />
          </div>
        )}

        {activeTab === 'themes' && (
          <ThemePresetsView onSelectTheme={handleStartPreset} />
        )}

        {activeTab === 'journal' && (
          <JournalView
            sessions={journalSessions}
            onOpenSession={(s) => {
              handleUpdateSession(s);
              setActiveTab('tree');
            }}
            onDeleteSession={handleDeleteFromJournal}
            onStartNewScrutation={() => {
              setActiveSession(null);
              setActiveTab('daily');
            }}
          />
        )}

        {activeTab === 'books' && (
          <BibleBooksView onSelectBookForScrutation={handleSelectBook} />
        )}

        {/* Brewiarz (Liturgia Godzin) View */}
        {activeTab === 'breviary' && (
          <BreviaryView
            initialAudience={breviaryAudience}
            onStartScrutationWithVerse={(sig, txt) => {
              const isNT = sig.startsWith('Mt') || sig.startsWith('Mk') || sig.startsWith('Łk') || sig.startsWith('J') || sig.startsWith('Dz') || sig.startsWith('Rz') || sig.startsWith('1 Kor') || sig.startsWith('2 Kor') || sig.startsWith('Ga') || sig.startsWith('Ef') || sig.startsWith('Flp') || sig.startsWith('Kol') || sig.startsWith('1 Tes') || sig.startsWith('2 Tes') || sig.startsWith('1 Tm') || sig.startsWith('2 Tm') || sig.startsWith('Tt') || sig.startsWith('Flm') || sig.startsWith('Hbr') || sig.startsWith('Jk') || sig.startsWith('1 P') || sig.startsWith('2 P') || sig.startsWith('1 J') || sig.startsWith('2 J') || sig.startsWith('3 J') || sig.startsWith('Jud') || sig.startsWith('Ap');
              const newSession: ScrutationSession = {
                id: 'session_' + Date.now(),
                title: `Brewiarz: ${sig}`,
                theme: 'Liturgia Godzin',
                initialSiglum: sig,
                initialText: txt,
                nodes: [
                  {
                    id: 'node_root',
                    parentId: null,
                    siglum: sig,
                    text: txt,
                    testament: isNT ? 'NT' : 'ST',
                    crossReferenceReason: 'Werset wyjściowy z Liturgii Godzin',
                    order: 0,
                    isExpanded: true,
                    createdAt: Date.now()
                  }
                ],
                activeStep: 0,
                prayerNotes: {
                  statio: '',
                  invocatio: '',
                  lectio: '',
                  meditatio: '',
                  oratio: '',
                  contemplatio: '',
                  actio: '',
                  wordOfLife: ''
                },
                durationSeconds: 0,
                isCompleted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              handleUpdateSession(newSession);
              setActiveTab('tree');
              showToast(`Rozpoczęto skrutację z Liturgii Godzin: ${sig}`);
            }}
            onOpenPatristicView={(sig) => {
              setPatristicSiglum(sig);
              setActiveTab('patristic');
            }}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1.5 flex items-center justify-between overflow-x-auto shadow-lg transition-all custom-scrollbar"
        style={{
          paddingTop: '6px',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)'
        }}
      >
        <button
          id="mobile-nav-daily"
          onClick={() => setActiveTab('daily')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'daily' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <CalendarDays className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase">Czytania</span>
        </button>

        <button
          id="mobile-nav-tree"
          onClick={() => setActiveTab('tree')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-1.5 rounded-lg transition-colors cursor-pointer shrink-0 relative ${
            activeTab === 'tree' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Network className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase">Drzewko</span>
        </button>

        <button
          id="mobile-nav-breviary"
          onClick={() => setActiveTab('breviary')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'breviary' ? 'text-amber-800 font-bold' : 'text-slate-500'
          }`}
        >
          <Church className="w-4 h-4 mb-0.5 text-amber-600" />
          <span className="text-[9px] uppercase">Brewiarz</span>
        </button>

        <button
          id="mobile-nav-draw"
          onClick={() => setIsDrawWordModalOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] px-1.5 rounded-lg transition-colors cursor-pointer shrink-0 text-amber-700 hover:text-amber-800 font-bold"
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-amber-500 animate-pulse" />
          <span className="text-[9px] uppercase">Losuj</span>
        </button>

        <button
          id="mobile-nav-jewish"
          onClick={() => setActiveTab('jewish')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'jewish' ? 'text-amber-800 font-bold' : 'text-slate-500'
          }`}
        >
          <Scroll className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase">Tora</span>
        </button>

        <button
          id="mobile-nav-community"
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'community' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase">Wspólnota</span>
        </button>

        <button
          id="mobile-nav-patristic"
          onClick={() => setActiveTab('patristic')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'patristic' ? 'text-sky-700 font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase">Ojcowie</span>
        </button>

        <button
          id="mobile-nav-journal"
          onClick={() => setActiveTab('journal')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'journal' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <BookmarkCheck className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase">Dziennik</span>
        </button>

        <button
          id="mobile-nav-reset"
          onClick={() => setResetModalOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] px-1.5 rounded-lg transition-colors cursor-pointer shrink-0 text-rose-600 hover:text-rose-700 active:scale-95"
          title="Wyzeruj drzewko lub aplikację"
        >
          <RotateCcw className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase font-bold">Wyzeruj</span>
        </button>
      </div>

      {/* Random Scripture Draw Modal with animated card opening & context */}
      <RandomScriptureDrawModal
        isOpen={isDrawWordModalOpen}
        onClose={() => setIsDrawWordModalOpen(false)}
        onStartScrutationWithQuote={(newSession) => {
          handleUpdateSession(newSession);
          setActiveTab('tree');
          showToast(`Rozpoczęto skrutację z wylosowanego Słowa: "${newSession.initialSiglum}"`);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 animate-bounce-in bg-white text-slate-800 px-4 py-3 border border-emerald-300 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reset Modal */}
      <ResetAppModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onResetTreeOnly={handleResetActiveTree}
        onResetAllData={handleResetAllData}
        hasActiveSession={Boolean(activeSession)}
        journalCount={journalSessions.length}
      />

      {/* Daily Reminder Modal */}
      <DailyReminderModal
        isOpen={reminderModalOpen}
        onClose={() => setReminderModalOpen(false)}
        onSettingsSaved={(newSettings) => {
          setReminderSettings(newSettings);
        }}
      />

      {/* Install App Modal */}
      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        initialPlatform={installPlatform}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif font-semibold text-emerald-900 tracking-wider">
            <Flame className="w-4 h-4 text-emerald-600" />
            <span>Scrutatio Scripturae — «Badajcie Pisma» (J 5, 39)</span>
          </div>
          <p className="text-slate-500 text-xs font-sans">
            Aparat odnośników biblijnych, tradycja Biblii Jerozolimskiej, Targumy aramejskie i modlitwa Słowem Bożym.
          </p>
        </div>
      </footer>
    </div>
  );
}
