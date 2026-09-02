/**
 * Audio Synthesis & WakeLock Utility for Sacred Breviary & Scrutation Prayer
 */

let wakeLockSentinel: any = null;

/**
 * Request Screen WakeLock to prevent screen from sleeping during active prayer
 */
export async function requestScreenWakeLock(): Promise<boolean> {
  try {
    if ('wakeLock' in navigator) {
      wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      wakeLockSentinel.addEventListener('release', () => {
        wakeLockSentinel = null;
      });
      return true;
    }
  } catch (err) {
    console.warn('Wake Lock request failed or not permitted:', err);
  }
  return false;
}

/**
 * Release Screen WakeLock
 */
export async function releaseScreenWakeLock(): Promise<void> {
  try {
    if (wakeLockSentinel) {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
  } catch (err) {
    console.warn('Wake Lock release failed:', err);
  }
}

/**
 * Check if screen wake lock is currently supported & active
 */
export function isWakeLockSupported(): boolean {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
}

/**
 * Monastic Bell / Chime / Meditation Gong using Web Audio API
 */
export function playMonasticBellSound(type: 'monastic_bell' | 'singing_bowl' | 'chime' = 'monastic_bell') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'monastic_bell') {
      // Deep cathedral / monastery bell strike with harmonic decays
      const partials = [
        { freq: 220, gain: 0.45, decay: 4.5 }, // Fundamental (A3)
        { freq: 440, gain: 0.35, decay: 3.8 }, // Octave
        { freq: 554.37, gain: 0.25, decay: 3.0 }, // Major 3rd (C#5)
        { freq: 659.25, gain: 0.2, decay: 2.5 }, // 5th (E5)
        { freq: 880, gain: 0.15, decay: 1.8 }, // 2nd octave
        { freq: 1108.73, gain: 0.08, decay: 1.2 }
      ];

      partials.forEach(({ freq, gain, decay }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gainNode.gain.setValueAtTime(gain, now);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + decay);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });
    } else if (type === 'singing_bowl') {
      // Warm Tibetan / monastic singing bowl pulsation
      const baseFreq = 329.63; // E4
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 2.76, now); // Metallic overtones

      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 5.0);

      osc.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 5.0);
      osc2.stop(now + 5.0);
    } else {
      // Gentle chime
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        g.gain.setValueAtTime(0.15, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.00001, now + i * 0.08 + 2.2);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 2.2);
      });
    }
  } catch (e) {
    console.warn('Audio synthesis failed:', e);
  }
}

/**
 * Gregorian Tone Audio Demonstration (Plays the intonation formula & mediant cadence)
 */
export function playGregorianToneAudio(toneName: string) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone scale pitches in Hz (Gregorian pitch approximations)
    const tonesMap: Record<string, number[]> = {
      'Ton I': [293.66, 329.63, 349.23, 392.00, 440.00, 392.00, 349.23, 293.66], // D - E - F - G - A - G - F - D
      'Ton II': [293.66, 349.23, 349.23, 392.00, 349.23, 329.63, 293.66], // D - F - F - G - F - E - D
      'Ton III': [329.63, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63], // E - G - A - B - A - G - E
      'Ton IV': [329.63, 349.23, 392.00, 440.00, 392.00, 349.23, 329.63], // E - F - G - A - G - F - E
      'Ton V': [349.23, 440.00, 523.25, 523.25, 440.00, 392.00, 349.23], // F - A - C - C - A - G - F
      'Ton VI': [349.23, 392.00, 440.00, 392.00, 349.23, 329.63, 349.23], // F - G - A - G - F - E - F
      'Ton VII': [392.00, 440.00, 493.88, 587.33, 493.88, 440.00, 392.00], // G - A - B - D - B - A - G
      'Ton VIII': [392.00, 440.00, 523.25, 523.25, 440.00, 392.00] // G - A - C - C - A - G
    };

    const pitches = tonesMap[toneName] || tonesMap['Ton II'];
    const noteDuration = 0.42;

    pitches.forEach((freq, idx) => {
      const startTime = now + idx * noteDuration;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Organ flute / vocal warmth
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Smooth envelope
      gainNode.gain.setValueAtTime(0.001, startTime);
      gainNode.gain.linearRampToValueAtTime(0.18, startTime + 0.06);
      gainNode.gain.setValueAtTime(0.15, startTime + noteDuration - 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);
    });
  } catch (e) {
    console.warn('Gregorian tone audio failed:', e);
  }
}
