/**
 * Audio Contemplation Engine (Web Audio API)
 * Synthesizes peaceful Gregorian monastic drones, singing bowls, and desert chimes.
 */

class AudioContemplationEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentPreset: 'gregorian' | 'bowls' | 'desert' | 'monastery' = 'gregorian';
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private intervalId: any = null;

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setPreset(preset: 'gregorian' | 'bowls' | 'desert' | 'monastery') {
    this.currentPreset = preset;
    if (this.isPlaying) {
      this.stopAmbient();
      this.startAmbient(this.currentPreset);
    }
  }

  public getPreset() {
    return this.currentPreset;
  }

  public isAmbientPlaying() {
    return this.isPlaying;
  }

  public startAmbient(preset: 'gregorian' | 'bowls' | 'desert' | 'monastery' = this.currentPreset, volume: number = 0.4) {
    this.init();
    if (!this.ctx) return;
    this.stopAmbient();

    this.isPlaying = true;
    this.currentPreset = preset;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), this.ctx.currentTime + 3.0);
    this.masterGain.connect(this.ctx.destination);

    if (preset === 'gregorian') {
      this.playGregorianDrone();
    } else if (preset === 'bowls') {
      this.playSingingBowls();
    } else if (preset === 'desert') {
      this.playDesertPad();
    } else if (preset === 'monastery') {
      this.playMonasteryBells();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0.0001, volume), this.ctx.currentTime, 0.1);
    }
  }

  private playGregorianDrone() {
    if (!this.ctx || !this.masterGain) return;
    // Gregorian Mode II / Hypodorian drone on D (73.4 Hz, 146.8 Hz, 220 Hz, 293.6 Hz)
    const baseFreq = 73.42; // D2
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 3, baseFreq * 4];

    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f + (Math.random() * 0.4 - 0.2), this.ctx.currentTime);

      // Low pass filter for warm church acoustics
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, this.ctx.currentTime);

      const targetGain = idx === 0 ? 0.25 : idx === 1 ? 0.18 : 0.08 / idx;
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(targetGain, this.ctx.currentTime + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });
  }

  private playDesertPad() {
    if (!this.ctx || !this.masterGain) return;
    // Warm Sinai Contemplative Pad in F# Minor
    const baseFreq = 92.5; // F#2
    const freqs = [baseFreq, baseFreq * 1.498, baseFreq * 1.78, baseFreq * 2.0];

    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320 + idx * 60, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15 / (idx + 1), this.ctx.currentTime + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });
  }

  private playSingingBowls() {
    if (!this.ctx || !this.masterGain) return;
    // Background soft harmonic hum
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(128, this.ctx.currentTime); // C3
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    this.oscillators.push(osc);
    this.gainNodes.push(gain);

    // Periodic gentle chime strike
    this.strikeBowl(432); // Healing Solfeggio 432 Hz
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        const notes = [432, 528, 384, 648];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        this.strikeBowl(randomNote);
      }
    }, 7000);
  }

  private playMonasteryBells() {
    if (!this.ctx || !this.masterGain) return;
    // Low bell drone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime); // A2
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    this.oscillators.push(osc);
    this.gainNodes.push(gain);

    this.strikeMonasteryBell(220);
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.strikeMonasteryBell(220);
      }
    }, 9000);
  }

  public strikeBowl(freq: number = 432) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    [freq, freq * 2.76, freq * 5.4].forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      const amp = idx === 0 ? 0.3 : 0.1 / (idx + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5 + idx);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 6.5);
    });
  }

  public strikeMonasteryBell(freq: number = 220) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const partials = [1, 1.5, 2, 2.6, 3.2];

    partials.forEach((mult, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * mult, now);

      const amp = 0.25 / (idx + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 7.0);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 7.5);
    });
  }

  public playSoftChime() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6 triad

    notes.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);

      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + 3.0);
    });
  }

  public stopAmbient() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.4);
    }

    setTimeout(() => {
      this.oscillators.forEach(o => {
        try { o.stop(); o.disconnect(); } catch (e) {}
      });
      this.gainNodes.forEach(g => {
        try { g.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      this.gainNodes = [];
      this.isPlaying = false;
    }, 500);
  }
}

export const audioEngine = new AudioContemplationEngine();
