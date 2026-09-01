import React, { useState } from 'react';
import { ScrutationSession } from '../types';
import { BookmarkCheck, Calendar, Download, Printer, Trash2, BookOpen, ArrowRight } from 'lucide-react';

interface JournalViewProps {
  sessions: ScrutationSession[];
  onOpenSession: (session: ScrutationSession) => void;
  onDeleteSession: (id: string) => void;
  onStartNewScrutation: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  sessions,
  onOpenSession,
  onDeleteSession,
  onStartNewScrutation
}) => {
  const [selectedSessionForPrint, setSelectedSessionForPrint] = useState<ScrutationSession | null>(null);

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dziennik_skrutacji_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = (session: ScrutationSession) => {
    setSelectedSessionForPrint(session);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-sans uppercase tracking-[0.3em] font-semibold rounded-md mb-2">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
            Dziennik Duchowy
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Zapisane Skrutacje
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Historia twoich modlitw, odkrytych wersetów i Słów Życia (Rhema)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {sessions.length > 0 && (
            <button
              id="export-journal-json-btn"
              onClick={handleExportJson}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-sans uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Pobierz kopię zapasową w pliku JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Eksportuj Kopię</span>
            </button>
          )}
          <button
            id="start-new-from-journal-btn"
            onClick={onStartNewScrutation}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-sans uppercase tracking-widest font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Nowa Skrutacja</span>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center">
            <BookmarkCheck className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Twój dziennik jest jeszcze pusty
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Gdy odprawisz skrutację w Warsztacie, kliknij przycisk «Zapisz w Dzienniku», aby utrwalić drogę wersetów, komentarze Ojców i owoce modlitwy.
          </p>
          <button
            id="start-first-journal-btn"
            onClick={onStartNewScrutation}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-xs"
          >
            Rozpocznij Pierwszą Skrutację
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {s.initialSiglum}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDateTime(s.createdAt)}</span>
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {s.title}
                </h3>

                {/* Słowo Życia badge if present */}
                {s.prayerNotes.wordOfLife && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                    <div className="text-[10px] font-sans uppercase tracking-widest text-amber-900 font-bold">
                      Słowo Życia (Rhema):
                    </div>
                    <p className="font-scripture text-sm text-amber-950 font-serif italic">
                      «{s.prayerNotes.wordOfLife}»
                    </p>
                  </div>
                )}

                {/* Wersety w łańcuchu */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-semibold">
                    Łańcuch ({s.nodes.length} wersetów):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.nodes.map((n) => (
                      <span
                        key={n.id}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        {n.siglum}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    id={`print-session-${s.id}`}
                    onClick={() => handlePrint(s)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Wydrukuj kartę skrutacji"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    id={`delete-session-${s.id}`}
                    onClick={() => onDeleteSession(s.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Usuń ten wpis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id={`open-session-${s.id}`}
                  onClick={() => onOpenSession(s)}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-sans uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200/80"
                >
                  <span>Otwórz w Warsztacie</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden printable reflection sheet */}
      {selectedSessionForPrint && (
        <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:p-8 print:z-50 text-slate-900 font-sans">
          <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center space-y-1">
            <h1 className="text-2xl font-bold font-serif">KARTA SKRUTACJI PISMA ŚWIĘTEGO</h1>
            <p className="text-sm italic">«Badajcie Pisma... to one dają o Mnie świadectwo» (J 5,39)</p>
            <p className="text-xs text-slate-600">Data: {formatDateTime(selectedSessionForPrint.createdAt)} | Temat: {selectedSessionForPrint.title}</p>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h2 className="font-bold uppercase text-xs text-slate-600 border-b border-slate-300 pb-1 mb-2">1. Werset Wyjściowy</h2>
              <p className="font-serif italic font-semibold">{selectedSessionForPrint.initialSiglum}: «{selectedSessionForPrint.initialText}»</p>
            </div>

            <div>
              <h2 className="font-bold uppercase text-xs text-slate-600 border-b border-slate-300 pb-1 mb-2">2. Drzewo Odnośników Biblijnych</h2>
              <div className="space-y-2">
                {selectedSessionForPrint.nodes.map((n, i) => (
                  <div key={n.id} className="pl-4 border-l-2 border-slate-400">
                    <div className="font-bold">{i + 1}. {n.siglum} ({n.testament}) — <span className="font-normal italic">{n.crossReferenceReason}</span></div>
                    <div className="font-serif italic text-xs">«{n.text}»</div>
                    {n.userNotes && <div className="text-xs text-slate-600">Notatka: {n.userNotes}</div>}
                  </div>
                ))}
              </div>
            </div>

            {selectedSessionForPrint.prayerNotes.meditatio && (
              <div>
                <h2 className="font-bold uppercase text-xs text-slate-600 border-b border-slate-300 pb-1 mb-1">3. Meditatio (Co Bóg mówi do mego życia)</h2>
                <p className="whitespace-pre-line text-xs">{selectedSessionForPrint.prayerNotes.meditatio}</p>
              </div>
            )}

            {selectedSessionForPrint.prayerNotes.oratio && (
              <div>
                <h2 className="font-bold uppercase text-xs text-slate-600 border-b border-slate-300 pb-1 mb-1">4. Oratio (Odpowiedź modlitewna)</h2>
                <p className="whitespace-pre-line text-xs">{selectedSessionForPrint.prayerNotes.oratio}</p>
              </div>
            )}

            {selectedSessionForPrint.prayerNotes.wordOfLife && (
              <div className="p-3 bg-slate-100 border border-slate-300 rounded">
                <div className="font-bold text-xs uppercase">Słowo Życia (Rhema na dziś):</div>
                <div className="font-serif italic font-bold">«{selectedSessionForPrint.prayerNotes.wordOfLife}»</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
