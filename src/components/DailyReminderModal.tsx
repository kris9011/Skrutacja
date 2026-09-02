import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  Clock, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Check, 
  AlertCircle, 
  X, 
  Send, 
  Flame,
  HelpCircle
} from 'lucide-react';
import { ScrutationReminderSettings } from '../types';
import { 
  getStoredReminderSettings, 
  saveReminderSettings, 
  isNotificationSupported, 
  getNotificationPermissionStatus,
  requestNotificationPermission,
  sendTestNotification,
  playContemplativeChime
} from '../utils/notificationService';

interface DailyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: (settings: ScrutationReminderSettings) => void;
}

const PRESET_TIMES = [
  { label: 'O świcie (Jutrznia)', time: '06:00', desc: 'Przed początkiem dnia' },
  { label: 'Przed pracą', time: '07:15', desc: 'Święty spokój o poranku' },
  { label: 'Anioł Pański', time: '12:00', desc: 'W południe' },
  { label: 'Po pracy', time: '17:30', desc: 'Chwila wytchnienia' },
  { label: 'Wieczór (Nieszpory)', time: '20:30', desc: 'Klasyczna godzina skrutacji' },
  { label: 'Kompleta', time: '22:00', desc: 'Nocna czujność' }
];

const DAYS_OF_WEEK = [
  { id: 1, label: 'Pn', fullName: 'Poniedziałek' },
  { id: 2, label: 'Wt', fullName: 'Wtorek' },
  { id: 3, label: 'Śr', fullName: 'Środa' },
  { id: 4, label: 'Czw', fullName: 'Czwartek' },
  { id: 5, label: 'Pt', fullName: 'Piątek' },
  { id: 6, label: 'Sob', fullName: 'Sobota' },
  { id: 0, label: 'Ndz', fullName: 'Niedziela' }
];

export const DailyReminderModal: React.FC<DailyReminderModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved
}) => {
  const [settings, setSettings] = useState<ScrutationReminderSettings>(getStoredReminderSettings());
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);
  const [testErrorMessage, setTestErrorMessage] = useState<string | null>(null);
  const isSupported = isNotificationSupported();

  useEffect(() => {
    if (isOpen) {
      setSettings(getStoredReminderSettings());
      setPermissionStatus(getNotificationPermissionStatus());
      setTestSuccessMessage(null);
      setTestErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleDay = (dayId: number) => {
    setSettings(prev => {
      const exists = prev.daysOfWeek.includes(dayId);
      const updated = exists 
        ? prev.daysOfWeek.filter(d => d !== dayId)
        : [...prev.daysOfWeek, dayId];
      // Keep at least one day
      return {
        ...prev,
        daysOfWeek: updated.length > 0 ? updated : [dayId]
      };
    });
  };

  const handleRequestPermission = async () => {
    try {
      const perm = await requestNotificationPermission();
      setPermissionStatus(perm);
      if (perm === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
        setTestSuccessMessage('Udzielono zgody na powiadomienia!');
      } else if (perm === 'denied') {
        setTestErrorMessage('Powiadomienia zostały zablokowane w przeglądarce. Odblokuj je w pasku adresu kłódki strony.');
      }
    } catch (e) {
      setTestErrorMessage('Wystąpił błąd podczas pytania o zgodę.');
    }
  };

  const handleTestNotification = async () => {
    setIsTesting(true);
    setTestSuccessMessage(null);
    setTestErrorMessage(null);

    try {
      await sendTestNotification(settings);
      setTestSuccessMessage('Wysłano powiadomienie testowe na Twoje urządzenie!');
      setPermissionStatus('granted');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Nie udało się wysłać powiadomienia';
      setTestErrorMessage(msg);
      setPermissionStatus(getNotificationPermissionStatus());
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    saveReminderSettings(settings);
    if (onSettingsSaved) {
      onSettingsSaved(settings);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-emerald-300 shadow-inner">
              <BellRing className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-300">
                Wierność Codziennej Modlitwie
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                Przypomnienie o Skrutacji
              </h2>
            </div>
          </div>
          <p className="text-xs text-emerald-100/90 font-sans mt-2 leading-relaxed">
            Ustaw stałą porę dnia, aby aplikacja wysłała powiadomienie w przeglądarce i przypomniała o chwili wyciszenia ze Słowem Bożym.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Browser Support & Permission Banner */}
          {!isSupported ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Brak wsparcia Web Notifications:</strong> Twoja przeglądarka nie obsługuje systemowych powiadomień. Przypomnienia będą działały jako sygnał dźwiękowy przy otwartej karcie.
              </div>
            </div>
          ) : permissionStatus === 'denied' ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
              <div className="flex items-start gap-2.5">
                <BellOff className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Powiadomienia są zablokowane w przeglądarce:</strong>
                  <p className="mt-0.5 text-rose-800">
                    Kliknij ikonę kłódki/ustawień strony obok adresu URL w przeglądarce i zezwól na <em>Powiadomienia</em>, aby otrzymywać codzienne przypomnienia.
                  </p>
                </div>
              </div>
            </div>
          ) : permissionStatus === 'default' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Wymagana jednorazowa zgoda przeglądarki na powiadomienia.</span>
              </div>
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shrink-0 cursor-pointer shadow-xs"
              >
                Zezwól teraz
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Zgoda na powiadomienia jest aktywna.</span>
            </div>
          )}

          {/* Master Enable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <div className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <span>Codzienne przypomnienie</span>
                {settings.enabled && (
                  <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Aktywne
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Wysyłaj powiadomienie o ustalonej godzinie
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!settings.enabled && permissionStatus === 'default') {
                  handleRequestPermission();
                } else {
                  setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
                }
              }}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.enabled ? 'bg-emerald-700' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Time Picker & Presets */}
          <div className="space-y-3">
            <label className="font-serif font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Godzina przypomnienia:</span>
            </label>

            {/* Time Input */}
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={settings.scheduledTime}
                onChange={(e) => setSettings(prev => ({ ...prev, scheduledTime: e.target.value }))}
                className="px-4 py-3 rounded-2xl bg-slate-100 border border-slate-300 text-2xl font-mono font-bold text-slate-900 text-center focus:outline-emerald-600 focus:bg-white transition-all shadow-inner"
              />
              <div className="text-xs text-slate-500 font-sans leading-relaxed">
                Ustaw dokładną godzinę, o której chcesz rozpocząć modlitwę.
              </div>
            </div>

            {/* Quick Time Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {PRESET_TIMES.map((preset) => {
                const isSelected = settings.scheduledTime === preset.time;
                return (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, scheduledTime: preset.time }))}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-mono text-sm font-bold text-emerald-900">{preset.time}</div>
                    <div className="text-[11px] truncate">{preset.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Days of the Week Selection */}
          <div className="space-y-2 pt-1">
            <label className="font-serif font-bold text-sm text-slate-900">
              Dni tygodnia:
            </label>
            <div className="flex items-center justify-between gap-1.5">
              {DAYS_OF_WEEK.map((day) => {
                const isActive = settings.daysOfWeek.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleToggleDay(day.id)}
                    title={day.fullName}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound & Notification Message Customization */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <div className="font-serif font-bold text-xs text-slate-900">Dźwięk dzwonka kontemplacyjnego</div>
                  <div className="text-[10px] text-slate-500">Cichy akord dzwonu kościelnego</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => playContemplativeChime()}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-sans font-medium text-slate-700 cursor-pointer"
                  title="Odsłuchaj dzwonek"
                >
                  Odsłuchaj
                </button>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer rounded"
                />
              </div>
            </div>

            {/* Custom Notification Text (Optional) */}
            <div className="space-y-1.5">
              <label className="font-serif font-bold text-xs text-slate-900">
                Treść powiadomienia:
              </label>
              <input
                type="text"
                value={settings.reminderTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, reminderTitle: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs font-sans text-slate-900 focus:outline-emerald-600"
                placeholder="Tytuł powiadomienia"
              />
              <textarea
                value={settings.reminderBody}
                onChange={(e) => setSettings(prev => ({ ...prev, reminderBody: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs font-sans text-slate-900 focus:outline-emerald-600 resize-none"
                placeholder="Treść zachęty lub werset..."
              />
            </div>
          </div>

          {/* Test & Status Alerts */}
          {testSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2 font-medium animate-fade-in">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{testSuccessMessage}</span>
            </div>
          )}

          {testErrorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 text-xs flex items-center gap-2 font-medium animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{testErrorMessage}</span>
            </div>
          )}

          {/* Scripture Inspiration Footer */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-serif font-bold text-amber-900">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Słowo o wierności o poranku (Ps 63, 2):</span>
            </div>
            <p className="font-serif italic text-amber-900/90 leading-relaxed">
              «Boże, mój Boże, szukam Ciebie od świtu, pragnie Ciebie moja dusza, tęskni za Tobą moje ciało, jak ziemia sucha, spragniona, bez wody.»
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestNotification}
            disabled={isTesting}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isTesting ? 'Wysyłanie...' : 'Wyślij test'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-sans font-medium transition-all cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Zapisz ustawienia</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
