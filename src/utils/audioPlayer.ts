// Ambient Web Audio API synthesizer for gentle nocturnal harp/piano arpeggios
class WeddingAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private step = 0;

  // D major / Bm / G / A warm romantic arpeggio frequencies
  private readonly sequence = [
    293.66, 369.99, 440.0, 587.33, 440.0, 369.99, // Dmaj7
    246.94, 369.99, 440.0, 493.88, 440.0, 369.99, // Bm7
    196.0, 293.66, 369.99, 493.88, 369.99, 293.66, // Gmaj7
    220.0, 329.63, 440.0, 554.37, 440.0, 329.63, // A6
  ];

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.08;
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private playNote(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle warm harmonic overtone
    const overtone = this.ctx.createOscillator();
    const overtoneGain = this.ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);
    overtoneGain.gain.setValueAtTime(0.001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.32, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 2.3);
    overtone.stop(now + 1.5);
  }

  public async start(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }
    if (this.isPlaying) return true;
    this.isPlaying = true;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0.09, ctx.currentTime, 0.25);
    }

    const tick = () => {
      if (!this.isPlaying) return;
      const freq = this.sequence[this.step % this.sequence.length];
      this.playNote(freq);
      this.step += 1;
      this.timerId = window.setTimeout(tick, 680);
    };

    tick();
    return true;
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.15);
    }
  }

  public getPlaying(): boolean {
    return this.isPlaying;
  }
}

export const weddingAudio = new WeddingAudioPlayer();
