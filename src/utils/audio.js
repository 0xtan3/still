// Soft, serene ambient chime synthesized using Web Audio API
export function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Warm, calming chord notes (F4, A4, C5, E5 - F Major 7th)
    const notes = [349.23, 440.00, 523.25, 659.25];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + i * 0.14; // soft arpeggio stagger
      const duration = 2.4;

      // Soft envelope: gentle attack, smooth exponential decay
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1 / (i * 0.4 + 1), startTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    console.warn('Audio chime playback warning:', e);
  }
}
