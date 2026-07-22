// Web Audio API Chimes for CHRONO by TENAZITY

// 1. Focus Session Completion Chime (Warm, serene F Major 7th chord: F4, A4, C5, E5)
export function playFocusChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const notes = [349.23, 440.00, 523.25, 659.25]; // F4, A4, C5, E5

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + i * 0.14; // soft arpeggio stagger
      const duration = 2.4;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1 / (i * 0.4 + 1), startTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    console.warn('Audio focus chime warning:', e);
  }
}

// 2. Break Completion Chime (Refreshing, energizing 3-note ascending bell chime: C5, E5, G5, C6)
export function playBreakChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Bright energizing C Major triad (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sine + slight triangle harmonic mix for crisp crystal bell timbre
      osc.type = i === 3 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + i * 0.11; // crisp ascending bell chime
      const duration = 1.8;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12 / (i * 0.3 + 1), startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    console.warn('Audio break chime warning:', e);
  }
}

// Backward compatibility alias
export const playChime = playFocusChime;
