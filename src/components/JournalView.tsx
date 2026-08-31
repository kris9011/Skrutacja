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
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 text-[#E0E0D6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3D3524]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1a1e] border border-[#3D3524] text-[#C5A059] text-[10px] font-sans uppercase tracking-[0.3em] mb-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            Dziennik Duchowy
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-light tracking-wide text-[#C5A059]">
            Zapisane Skrutacje
          </h1>
          <p className="text-sm font-serif text-[#8C8270]">
            Historia twoich modlitw, odkrytych wersetów i Słów Życia (Rhema)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {sessions.length > 0 && (
            <button
              id="export-journal-json-btn"
              onClick={handleExportJson}
              className="px-4 py-2 rounded-lg bg-[#141417] hover:bg-[#1a1a1e] text-[#8C8270] hover:text-[#E0E0D6] border border-[#3D3524] text-xs font-sans uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Pobierz kopię zapasową w pliku JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Eksportuj Kopię</span>
            </button>
          )}
          <button
            id="start-new-from-journal-btn"
            onClick={onStartNewScrutation}
            className="px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#b08e4c] text-[#0F0F12] text-xs font-sans uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Nowa Skrutacja</span>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {sessions.length === 0 ? (
        <div className="bg-[#141417] rounded-xl p-12 text-center border border-[#3D3524] space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-xl bg-[#0F0F12] border border-[#3D3524] text-[#C5A059] mx-auto flex items-center justify-center">
            <BookmarkCheck className="w-7 h-7" />
          </div>
          <h3 className="font-display text-lg font-light text-[#E0E0D6]">
            Twój dziennik jest jeszcze pusty
          </h3>
          <p className="text-xs sm:text-sm font-serif text-[#8C8270] leading-relaxed">
            Gdy odprawisz skrutację w Warsztacie, kliknij przycisk «Zapisz w Dzienniku», aby utrwalić drogę wersetów, komentarze Ojców i owoce modlitwy.
          </p>
          <button
            id="start-first-journal-btn"
            onClick={onStartNewScrutation}
            className="px-5 py-2.5 rounded bg-[#C5A059] hover:bg-[#b08e4c] text-[#0F0F12] text-xs font-sans uppercase tracking-widest font-semibold transition-colors cursor-pointer"
          >
            Rozpocznij Pierwszą Skrutację
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="bg-[#141417] rounded-xl border border-[#3D3524] hover:border-[#C5A059] transition-all p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-[#0F0F12] text-[#C5A059] border border-[#3D3524]">
                    {s.initialSiglum}
                  </span>
                  <div className="flex items-center gap-1.5 text-[#8C8270] text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDateTime(s.createdAt)}</span>
                  </div>
                </div>

                <h3 className="font-display text-lg font-light text-[#E0E0D6] group-hover:text-[#C5A059] transition-colors">
                  {s.title}
                </h3>

                {/* Słowo Życia badge if present */}
                {s.prayerNotes.wordOfLife && (
                  <div className="p-3 bg-[#0F0F12] border border-[#3D3524] rounded-lg space-y-1">
                    <div className="text-[10px] font-sans uppercase tracking-widest text-[#C5A059] font-semibold">
                      Słowo Życia (Rhema):
                    </div>
                    <p className="font-scripture text-xs text-[#E0E0D6] italic">
                      «{s.prayerNotes.wordOfLife}»
                    </p>
                  </div>
                )}

                {/* Wersety w łańcuchu */}
                <div className="space-y-1">
                  <div className="text-[10px] font-sans uppercase tracking-widest text-[#8C8270]">
                    Łańcuch ({s.nodes.length} wersetów):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.nodes.map((n) => (
                      <span
                        key={n.id}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#0F0F12] text-[#E0E0D6] border border-[#3D3524]"
                      >
                        {n.siglum}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-[#3D3524] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    id={`print-session-${s.id}`}
                    onClick={() => handlePrint(s)}
                    className="p-2 rounded text-[#8C8270] hover:text-[#E0E0D6] hover:bg-[#1a1a1e] transition-colors"
                    title="Wydrukuj kartę skrutacji"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    id={`delete-session-${s.id}`}
                    onClick={() => onDeleteSession(s.id)}
                    className="p-2 rounded text-[#8C8270] hover:text-red-400 hover:bg-[#1a1a1e] transition-colors"
                    title="Usuń ten wpis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id={`open-session-${s.id}`}
                  onClick={() => onOpenSession(s)}
                  className="px-4 py-2 rounded bg-[#3D3524] hover:bg-[#C5A059] hover:text-[#0F0F12] text-[#C5A059] text-xs font-sans uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
        <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:p-8 print:z-50 text-stone-900 font-sans">
          <div className="border-b-2 border-stone-800 pb-4 mb-6 text-center space-y-1">
            <h1 className="text-2xl font-bold font-serif">KARTA SKRUTACJI PISMA ŚWIĘTEGO</h1>
            <p className="text-sm italic">«Badajcie Pisma... to one dają o Mnie świadectwo» (J 5,39)</p>
            <p className="text-xs text-stone-600">Data: {formatDateTime(selectedSessionForPrint.createdAt)} | Temat: {selectedSessionForPrint.title}</p>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h2 className="font-bold uppercase text-xs text-stone-600 border-b border-stone-300 pb-1 mb-2">1. Werset Wyjściowy</h2>
              <p className="font-serif italic font-semibold">{selectedSessionForPrint.initialSiglum}: «{selectedSessionForPrint.initialText}»</p>
            </div>

            <div>
              <h2 className="font-bold uppercase text-xs text-stone-600 border-b border-stone-300 pb-1 mb-2">2. Drzewo Odnośników Biblijnych</h2>
              <div className="space-y-2">
                {selectedSessionForPrint.nodes.map((n, i) => (
                  <div key={n.id} className="pl-4 border-l-2 border-stone-400">
                    <div className="font-bold">{i + 1}. {n.siglum} ({n.testament}) — <span className="font-normal italic">{n.crossReferenceReason}</span></div>
                    <div className="font-serif italic text-xs">«{n.text}»</div>
                    {n.userNotes && <div className="text-xs text-stone-600">Notatka: {n.userNotes}</div>}
                  </div>
                ))}
              </div>
            </div>

            {selectedSessionForPrint.prayerNotes.meditatio && (
              <div>
                <h2 className="font-bold uppercase text-xs text-stone-600 border-b border-stone-300 pb-1 mb-1">3. Meditatio (Co Bóg mówi do mego życia)</h2>
                <p className="whitespace-pre-line text-xs">{selectedSessionForPrint.prayerNotes.meditatio}</p>
              </div>
            )}

            {selectedSessionForPrint.prayerNotes.oratio && (
              <div>
                <h2 className="font-bold uppercase text-xs text-stone-600 border-b border-stone-300 pb-1 mb-1">4. Oratio (Odpowiedź modlitewna)</h2>
                <p className="whitespace-pre-line text-xs">{selectedSessionForPrint.prayerNotes.oratio}</p>
              </div>
            )}

            {selectedSessionForPrint.prayerNotes.wordOfLife && (
              <div className="p-3 bg-stone-100 border border-stone-300 rounded">
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
