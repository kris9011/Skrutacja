import { ScrutationReminderSettings } from '../types';

const STORAGE_KEY = 'scrutatio_notification_settings_v1';

export const DEFAULT_REMINDER_SETTINGS: ScrutationReminderSettings = {
  enabled: false,
  scheduledTime: '06:30',
  daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day (Sunday to Saturday)
  soundEnabled: true,
  reminderTitle: 'Pora na Skrutację Słowa Bożego',
  reminderBody: '«Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce» (Ps 119). Poświęć czas na modlitwę Pismem.',
  lastNotifiedDate: ''
};

/**
 * Checks if browser Web Notifications API is supported
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermissionStatus(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Loads stored settings from localStorage
 */
export function getStoredReminderSettings(): ScrutationReminderSettings {
  if (typeof window === 'undefined') return DEFAULT_REMINDER_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_REMINDER_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_REMINDER_SETTINGS,
      ...parsed
    };
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

/**
 * Saves settings to localStorage
 */
export function saveReminderSettings(settings: ScrutationReminderSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save reminder settings', err);
  }
}

/**
 * Plays a peaceful bell chime using Web Audio API
 */
export function playContemplativeChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Peaceful church bell harmonic chords (E4, G#4, B4, E5)
    const freqs = [329.63, 415.30, 493.88, 659.25];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      // Bell envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5 + idx * 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.5);
    });
  } catch (e) {
    console.warn('Audio chime could not be played:', e);
  }
}

/**
 * Request notification permission from browser
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return Notification.permission;
  }
}

/**
 * Displays a system Web Notification
 */
export function showScrutationNotification(
  title: string = 'Czas na Skrutację Słowa Bożego',
  body: string = '«Czy serce nasze nie pałało w nas...» (Łk 24). Otwórz Słowo Boże.',
  playSound: boolean = true
): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  if (playSound) {
    playContemplativeChime();
  }

  try {
    const options: NotificationOptions = {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'scrutatio-daily-reminder',
      requireInteraction: true, // Keep notification until user dismisses or clicks
      silent: !playSound
    };

    const notif = new Notification(title, options);

    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    return true;
  } catch (err) {
    console.error('Failed to trigger notification:', err);
    return false;
  }
}

/**
 * Sends a test notification to verify settings
 */
export async function sendTestNotification(settings: ScrutationReminderSettings): Promise<boolean> {
  if (!isNotificationSupported()) {
    throw new Error('Powiadomienia przeglądarkowe nie są obsługiwane w tej przeglądarce.');
  }

  let perm = Notification.permission;
  if (perm !== 'granted') {
    perm = await requestNotificationPermission();
  }

  if (perm !== 'granted') {
    throw new Error('Uprawnienia do powiadomień zostały odrzucone lub zablokowane w ustawieniach przeglądarki.');
  }

  return showScrutationNotification(
    `[Test] ${settings.reminderTitle}`,
    settings.reminderBody || 'To jest testowe powiadomienie przypomnienia o modlitwie.',
    settings.soundEnabled
  );
}

// Background scheduler timer ID
let schedulerTimer: number | null = null;

/**
 * Starts the background loop that checks time and triggers reminders
 */
export function initNotificationScheduler(onTrigger?: (title: string, body: string) => void): void {
  if (typeof window === 'undefined') return;

  if (schedulerTimer !== null) {
    window.clearInterval(schedulerTimer);
  }

  const checkSchedule = () => {
    const settings = getStoredReminderSettings();
    if (!settings.enabled) return;

    if (!isNotificationSupported() || Notification.permission !== 'granted') {
      return;
    }

    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Check if today is an active reminder day
    if (!settings.daysOfWeek.includes(currentDayOfWeek)) {
      return;
    }

    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Check if scheduled time matches and hasn't already fired today
    if (currentTimeStr === settings.scheduledTime && settings.lastNotifiedDate !== todayStr) {
      // Fire notification!
      showScrutationNotification(
        settings.reminderTitle,
        settings.reminderBody,
        settings.soundEnabled
      );

      // Save that we already notified today
      saveReminderSettings({
        ...settings,
        lastNotifiedDate: todayStr
      });

      if (onTrigger) {
        onTrigger(settings.reminderTitle, settings.reminderBody);
      }
    }

    // Check Novenas reminders
    try {
      const rawNovenaReminders = localStorage.getItem('scrutatio_novena_reminders_v1');
      const rawProgress = localStorage.getItem('scrutatio_novenas_progress_v1');
      if (rawNovenaReminders) {
        const novenaReminders = JSON.parse(rawNovenaReminders);
        const progressMap = rawProgress ? JSON.parse(rawProgress) : {};
        let updated = false;

        for (const [novenaId, rem] of Object.entries<any>(novenaReminders)) {
          if (rem && rem.enabled && rem.time === currentTimeStr && rem.lastNotifiedDate !== todayStr) {
            const currentDay = (progressMap[novenaId]?.completedDays?.length || 0) + 1;
            const novenaTitle = rem.novenaTitle || 'Nowenna';
            const title = `🕊️ Czas na Nowennę: ${novenaTitle} (Dzień ${currentDay})`;
            const body = `Otwórz aplikację, aby odmówić modlitwę na dzień ${currentDay}.`;

            showScrutationNotification(title, body, true);
            rem.lastNotifiedDate = todayStr;
            updated = true;

            if (onTrigger) {
              onTrigger(title, body);
            }
          }
        }

        if (updated) {
          localStorage.setItem('scrutatio_novena_reminders_v1', JSON.stringify(novenaReminders));
        }
      }
    } catch (novenaErr) {
      console.warn('Error checking novena reminders:', novenaErr);
    }
  };

  // Check every 15 seconds for precision
  schedulerTimer = window.setInterval(checkSchedule, 15000);
  // Also check immediately on mount
  checkSchedule();
}
