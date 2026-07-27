/* Lassi Emotions - WebAudio Sound Synthesizer Engine */

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playEmotionSound(category) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (category) {
      case 'joy':
      case 'energy':
        this._playArpeggio([523.25, 659.25, 783.99, 1046.5], 0.06); // C5, E5, G5, C6
        break;
      case 'sadness':
        this._playToneSlide(392, 261.63, 0.35, 'sine'); // G4 -> C4
        break;
      case 'anger':
        this._playRumble(0.25);
        break;
      case 'love':
        this._playArpeggio([587.33, 739.99, 880, 1174.66], 0.08); // D5, F#5, A5, D6
        break;
      case 'surprise':
        this._playToneSlide(300, 1100, 0.18, 'sine');
        break;
      case 'playful':
        this._playArpeggio([659.25, 523.25, 783.99, 1046.5], 0.05);
        break;
      case 'calm':
        this._playSoftChime([440, 554.37, 659.25], 0.4);
        break;
      case 'confidence':
        this._playArpeggio([440, 554.37, 659.25, 880], 0.07);
        break;
      default:
        this.playPop();
    }
  }

  playSlurp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this._playToneSlide(600, 300, 0.2, 'triangle');
  }

  _playArpeggio(freqs, stepDuration) {
    const now = this.ctx.currentTime;
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * stepDuration);

      gain.gain.setValueAtTime(0.25, now + idx * stepDuration);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * stepDuration + stepDuration * 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * stepDuration);
      osc.stop(now + idx * stepDuration + stepDuration * 1.5);
    });
  }

  _playToneSlide(startFreq, endFreq, duration, waveType = 'sine') {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(50, endFreq), now + duration);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  _playSoftChime(freqs, duration) {
    const now = this.ctx.currentTime;
    freqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  _playRumble(duration) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(60, now + duration);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const soundEngine = new SoundEngine();
if (typeof window !== 'undefined') {
  window.soundEngine = soundEngine;
}
