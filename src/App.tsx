/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SimpleLightScrutationView } from './components/SimpleLightScrutationView';
import { ScrutationGuideView } from './components/ScrutationGuideView';
import { ActiveScrutationWorkspace } from './components/ActiveScrutationWorkspace';
import { ThemePresetsView } from './components/ThemePresetsView';
import { JournalView } from './components/JournalView';
import { BibleBooksView } from './components/BibleBooksView';
import { DailyReadingsAndPassageSelector } from './components/DailyReadingsAndPassageSelector';
import { PatristicView } from './components/PatristicView';
import { ScrutationSession, BiblicalThemePreset } from './types';
import { THEME_PRESETS } from './data/biblicalData';
import { CheckCircle2, Flame, BookOpen, CalendarDays, Sparkles, BookmarkCheck } from 'lucide-react';

const LOCAL_STORAGE_ACTIVE_SESSION = 'scrutatio_active_session_v1';
const LOCAL_STORAGE_JOURNAL = 'scrutatio_journal_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simple' | 'daily' | 'workspace' | 'patristic' | 'journal' | 'guide' | 'themes' | 'books'>('daily');
  const [activeSession, setActiveSession] = useState<ScrutationSession | null>(null);
  const [journalSessions, setJournalSessions] = useState<ScrutationSession[]>([]);
  const [patristicSiglum, setPatristicSiglum] = useState<string>('Mk 7, 1-8');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
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
          createdAt: Date.now() + i * 1000
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
    setActiveTab('workspace');
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
    setActiveTab('workspace');
    showToast(`Utworzono sesję skrutacji dla księgi: ${siglum}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveSession={Boolean(activeSession)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeTab === 'simple' && (
          <div className="bg-gradient-to-b from-sky-50/40 via-slate-50 to-emerald-50/30 min-h-screen text-slate-900 pb-16">
            <SimpleLightScrutationView
              onStartFullScrutation={(session) => {
                handleUpdateSession(session);
                setActiveTab('workspace');
                showToast(`Przeniesiono do pełnego pulpitu skrutacji: "${session.title}"`);
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
              setActiveTab('workspace');
              showToast(`Rozpoczęto nową skrutację ze Słowa Bożego: "${newSession.title}"`);
            }}
            onOpenPatristicForVerse={(sig) => {
              setPatristicSiglum(sig);
              setActiveTab('patristic');
            }}
          />
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

        {activeTab === 'patristic' && (
          <div className="p-4 sm:p-8">
            <PatristicView
              defaultSiglum={patristicSiglum || activeSession?.initialSiglum || 'Mk 7, 1-8'}
              onStartScrutationWithVerse={(sig, txt) => {
                handleStartNewGeneric();
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
              setActiveTab('workspace');
            }}
            onDeleteSession={handleDeleteFromJournal}
            onStartNewScrutation={() => {
              setActiveSession(null);
              setActiveTab('workspace');
            }}
          />
        )}

        {activeTab === 'books' && (
          <BibleBooksView onSelectBookForScrutation={handleSelectBook} />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation (Thumb-friendly 48px targets) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          id="mobile-nav-daily"
          onClick={() => setActiveTab('daily')}
          className={`flex flex-col items-center justify-center min-h-[48px] px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'daily' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <CalendarDays className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase">Czytania</span>
        </button>

        <button
          id="mobile-nav-workspace"
          onClick={() => setActiveTab('workspace')}
          className={`flex flex-col items-center justify-center min-h-[48px] px-3 rounded-lg transition-colors cursor-pointer relative ${
            activeTab === 'workspace' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase">Odnośniki</span>
          {Boolean(activeSession) && (
            <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-1 right-2 animate-pulse" />
          )}
        </button>

        <button
          id="mobile-nav-simple"
          onClick={() => setActiveTab('simple')}
          className={`flex flex-col items-center justify-center min-h-[48px] px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'simple' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-emerald-600" />
          <span className="text-[10px] tracking-wider uppercase">Skrutuj</span>
        </button>

        <button
          id="mobile-nav-patristic"
          onClick={() => setActiveTab('patristic')}
          className={`flex flex-col items-center justify-center min-h-[48px] px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'patristic' ? 'text-sky-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-sky-600" />
          <span className="text-[10px] tracking-wider uppercase">Ojcowie</span>
        </button>

        <button
          id="mobile-nav-journal"
          onClick={() => setActiveTab('journal')}
          className={`flex flex-col items-center justify-center min-h-[48px] px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'journal' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <BookmarkCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase">Dziennik</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in bg-white text-slate-800 px-4 py-3 border border-emerald-300 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif font-semibold text-emerald-900 tracking-wider">
            <Flame className="w-4 h-4 text-emerald-600" />
            <span>Scrutatio Scripturae — «Badajcie Pisma» (J 5, 39)</span>
          </div>
          <p className="text-slate-500 text-xs font-sans">
            Aparat odnośników biblijnych, tradycja Biblii Jerozolimskiej i modlitwa Słowem Bożym.
          </p>
        </div>
      </footer>
    </div>
  );
}
