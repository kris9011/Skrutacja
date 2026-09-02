import React, { useState } from 'react';
import { RotateCcw, Trash2, AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface ResetAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetTreeOnly: () => void;
  onResetAllData: () => void;
  hasActiveSession: boolean;
  journalCount: number;
}

export const ResetAppModal: React.FC<ResetAppModalProps> = ({
  isOpen,
  onClose,
  onResetTreeOnly,
  onResetAllData,
  hasActiveSession,
  journalCount
}) => {
  const [confirmFullReset, setConfirmFullReset] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-slate-900/65 backdrop-blur-sm animate-fade-in overflow-y-auto"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 16px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 12px, 16px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0px) + 12px, 12px)',
        paddingRight: 'max(env(safe-area-inset-right, 0px) + 12px, 12px)'
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col my-auto max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-32px)]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-rose-200" />
            </div>
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-rose-200 bg-rose-950/50 px-2 py-0.5 rounded-full">
                Pamięć i czyszczenie
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold pt-0.5">
                Wyzeruj aplikację lub drzewo
              </h3>
            </div>
          </div>

          <p className="text-xs font-sans text-rose-100/90 pt-1.5 sm:pt-2 leading-relaxed">
            Aplikacja automatycznie <strong>zapamiętuje Twoje sesje, drzewo i notatki</strong> w pamięci telefonu/przeglądarki. Tutaj możesz bezpiecznie wyczyścić dane.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 text-xs font-sans text-slate-700 overflow-y-auto flex-1">
          {/* Option 1: Reset active tree/session */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>1. Wyzeruj tylko bieżące drzewko / sesję</span>
                </h4>
                <p className="text-slate-500 text-xs pt-1 leading-relaxed">
                  Usuwa aktualnie otwartą ścieżkę skrutacji i pozwala zacząć nową modlitwę od czystego wersetu. Zapisane wcześniej w Dzienniku sesje pozostaną bezpieczne.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onResetTreeOnly();
                onClose();
              }}
              disabled={!hasActiveSession}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasActiveSession
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{hasActiveSession ? 'Wyczyść bieżącą skrutację' : 'Brak aktywnej sesji do wyzerowania'}</span>
            </button>
          </div>

          {/* Option 2: Full factory reset */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2.5">
            <div>
              <h4 className="font-bold text-rose-950 text-sm flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>2. Całkowity reset aplikacji (Wszystkie dane)</span>
              </h4>
              <p className="text-rose-900/80 text-xs pt-1 leading-relaxed">
                Usuwa wszystkie zapisane sesje w Dzienniku (obecnie: <strong>{journalCount}</strong>), notatki, historię i przywraca stan początkowy.
              </p>
            </div>

            {!confirmFullReset ? (
              <button
                type="button"
                onClick={() => setConfirmFullReset(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs flex items-center justify-center gap-2 border border-rose-300 transition-all cursor-pointer active:scale-98"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                <span>Chcę wyczyścić całą aplikację...</span>
              </button>
            ) : (
              <div className="space-y-2 pt-1 animate-fade-in">
                <div className="p-2.5 rounded-xl bg-rose-900 text-white text-[11px] font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Czy na pewno bezpowrotnie usunąć wszystkie zapisane skrutacje i notatki?</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmFullReset(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Anuluj
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetAllData();
                      onClose();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-98"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Tak, usuń wszystko</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
