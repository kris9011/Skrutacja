import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  Check, 
  Copy, 
  Download, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlatform?: 'ios' | 'android';
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  initialPlatform = 'ios'
}) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>(initialPlatform);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    if (initialPlatform) {
      setPlatform(initialPlatform);
    }
  }, [initialPlatform]);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Capture Android PWA install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  const handleCopyAppUrl = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAndroidInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('W menu przeglądarki Chrome (trzy kropki) wybierz „Zainstaluj aplikację” lub „Dodaj do ekranu głównego”.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 sm:p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
              <Smartphone className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-200 bg-emerald-950/40 px-2 py-0.5 rounded-full">
                Instalacja na telefonie
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold pt-0.5">
                Pobierz Skrutację na Telefon
              </h3>
            </div>
          </div>

          <p className="text-xs font-sans text-emerald-100/90 pt-2 leading-relaxed">
            Działa jak natywna aplikacja z App Store i Google Play — bez pobierania ciężkich plików, z błyskawicznym startem i pełnym ekranem.
          </p>

          {/* Platform Switcher Tabs */}
          <div className="flex items-center gap-2 mt-4 bg-emerald-950/40 p-1 rounded-2xl border border-emerald-700/50">
            <button
              type="button"
              onClick={() => setPlatform('ios')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                platform === 'ios'
                  ? 'bg-white text-emerald-950 shadow-md scale-100'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              {/* Apple Icon */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.83-11.74-14.36-5.45-8.62-9.76-18.49-12.93-29.62-3.18-11.13-4.77-21.75-4.77-31.86 0-14.85 3.73-27.1 11.2-36.74 7.46-9.65 17.06-14.58 28.79-14.79 4.35 0 9.42 1.16 15.22 3.49 5.8 2.33 9.46 3.55 10.99 3.65 1.53 0 5.48-1.38 11.85-4.13 6.37-2.75 11.96-3.92 16.78-3.49 12.8.95 22.84 5.92 30.13 14.92-11.43 6.88-17.04 16.51-16.82 28.89.21 9.74 3.97 17.89 11.28 24.45 7.31 6.56 16.03 10.16 26.16 10.79-2.22 6.78-4.97 13.97-8.25 21.57zM119.22 31.84c0-7.3 2.65-14.13 7.94-20.48 5.29-6.35 11.8-10.48 19.53-12.39.42 1.06.63 2.12.63 3.17 0 7.3-2.7 14.23-8.1 20.79-5.4 6.56-11.91 10.48-19.53 11.75-.11-.95-.47-1.91-.47-2.84z" />
              </svg>
              <span>Apple (iPhone / iPad)</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('android')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                platform === 'android'
                  ? 'bg-white text-emerald-950 shadow-md scale-100'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              {/* Android Icon */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4114 13.8533 8.081 12 8.081c-1.8533 0-3.5902.3304-5.1368.8687L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
              </svg>
              <span>Android (Samsung, Xiaomi...)</span>
            </button>
          </div>
        </div>

        {/* Modal Body - Step by step guide */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans text-slate-700">
          {/* iOS Instructions */}
          {platform === 'ios' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Otwórz w Safari</h4>
                  <p className="text-slate-600 pt-0.5">
                    Otwórz ten adres w przeglądarce <strong>Safari</strong> na iPhonie lub iPadzie.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    Kliknij przycisk „Udostępnij”
                    <Share2 className="w-4 h-4 text-emerald-700" />
                  </h4>
                  <p className="text-slate-600 pt-0.5">
                    Na dolnym pasku Safari dotknij ikony kwadratu ze strzałką w górę (Udostępnij).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    Wybierz „Do ekranu początkowego”
                    <PlusSquare className="w-4 h-4 text-emerald-700" />
                  </h4>
                  <p className="text-slate-600 pt-0.5">
                    Przewiń w dół listy opcji i kliknij <strong>„Do ekranu początkowego”</strong> (Add to Home Screen), a następnie w prawym górnym rogu kliknij <strong>„Dodaj”</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-amber-950">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="font-medium">
                  Gotowe! Ikona <strong>Skrutacja</strong> pojawi się na Twoim pulpicie i uruchamia się bez ramek przeglądarki.
                </span>
              </div>
            </div>
          )}

          {/* Android Instructions */}
          {platform === 'android' && (
            <div className="space-y-3.5 animate-fade-in">
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={handleAndroidInstallClick}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Zainstaluj teraz jednym kliknięciem</span>
                </button>
              )}

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Otwórz w Chrome / przeglądarce</h4>
                  <p className="text-slate-600 pt-0.5">
                    Otwórz stronę w przeglądarce Chrome, Samsung Internet, Edge lub Opera.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Dotknij menu (3 kropki)</h4>
                  <p className="text-slate-600 pt-0.5">
                    W prawym górnym rogu ekranu dotknij ikony menu z trzema pionowymi kropkami.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Wybierz „Zainstaluj aplikację”</h4>
                  <p className="text-slate-600 pt-0.5">
                    Dotknij <strong>„Zainstaluj aplikację”</strong> lub <strong>„Dodaj do ekranu głównego”</strong> i potwierdź.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-amber-950">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="font-medium">
                  Gotowe! Aplikacja pojawi się w szufladzie Twoich aplikacji na telefonie.
                </span>
              </div>
            </div>
          )}

          {/* Quick Copy Link Bar */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="text-[11px] text-slate-500 truncate">
              Link do wysłania na telefon:
            </div>
            <button
              type="button"
              onClick={handleCopyAppUrl}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copiedLink ? 'Skopiowano link' : 'Kopiuj link aplikacji'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
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
