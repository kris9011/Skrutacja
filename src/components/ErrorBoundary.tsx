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
      <div className="min-h-screen bg-[#0F0F12] text-[#E0E0D6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#141417] border border-[#3D3524] rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-[#E0E0D6]">Wystąpił drobny błąd</h2>
            <p className="text-xs text-[#8C8270] mt-1">
              Aplikacja napotkała problem z danymi. Kliknij poniżej, aby odświeżyć stan.
            </p>
          </div>
          {errorMessage && (
            <div className="p-3 bg-[#0F0F12] rounded-xl text-left border border-[#3D3524] text-[11px] font-mono text-amber-300/80 break-words">
              {errorMessage}
            </div>
          )}
          <button
            onClick={handleReset}
            className="w-full py-3 px-4 rounded-xl bg-[#C5A059] hover:bg-[#E5C98B] text-black font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
