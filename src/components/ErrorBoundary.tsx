import React, { useState, useEffect } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Przechwycono błąd:', event.error);
      setHasError(true);
      setErrorMessage(event.error?.message || 'Błąd wykonania');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.warn('Przechwycono asynchroniczne zdarzenie:', event.reason);
      // Prevent browser default logging of unhandled promise rejection
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    setHasError(false);
    setErrorMessage('');
    window.location.reload();
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-900">Wystąpił drobny błąd</h2>
            <p className="text-xs text-slate-600 mt-1">
              Aplikacja napotkała problem z danymi. Kliknij poniżej, aby odświeżyć stan.
            </p>
          </div>
          {errorMessage && (
            <div className="p-3 bg-slate-50 rounded-xl text-left border border-slate-200 text-[11px] font-mono text-slate-700 break-words">
              {errorMessage}
            </div>
          )}
          <button
            onClick={handleReset}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Odśwież i zresetuj stan</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
