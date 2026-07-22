// Procedural Web Audio API Ambient Sound Generator for CHRONO

let audioCtx = null;
let activeSoundId = 'none';
let masterGainNode = null;
let activeSources = [];

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Generate 5-second buffer of pink/brown/white noise
function createNoiseBuffer(ctx, type = 'brown') {
  const bufferSize = ctx.sampleRate * 5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let lastOut = 0.0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;

    if (type === 'brown') {
      // Brown noise integration
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    } else if (type === 'pink') {
      // Paul Kellet's filter for pink noise
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    } else {
      // White noise
      data[i] = white * 0.15;
    }
  }
  return buffer;
}

export function stopAmbientSound() {
  activeSources.forEach(s => {
    try {
      if (s.stop) s.stop();
      if (s.disconnect) s.disconnect();
    } catch {}
  });
  activeSources = [];
  activeSoundId = 'none';
}

export function setAmbientVolume(vol = 0.5) {
  if (masterGainNode && audioCtx) {
    const targetVol = Math.max(0, Math.min(1, vol));
    masterGainNode.gain.setValueAtTime(targetVol, audioCtx.currentTime);
  }
}

export function playAmbientSound(soundId, volume = 0.5) {
  stopAmbientSound();

  if (!soundId || soundId === 'none') {
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  masterGainNode = ctx.createGain();
  masterGainNode.gain.setValueAtTime(volume, ctx.currentTime);
  masterGainNode.connect(ctx.destination);
  activeSoundId = soundId;

  if (soundId === 'brown_noise') {
    // 🌌 Deep Cosmos Brown Noise
    const buffer = createNoiseBuffer(ctx, 'brown');
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; // Deep soothing cutoff

    source.connect(filter);
    filter.connect(masterGainNode);
    source.start(0);

    activeSources.push(source, filter);
  } else if (soundId === 'rain') {
    // 🌧️ Soft Rainstorm
    const buffer = createNoiseBuffer(ctx, 'pink');
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Bandpass for raindrops sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    // Rain drop patter LFO
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.4; // 0.4 Hz gentle rain wave

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 250;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(masterGainNode);

    source.start(0);
    lfo.start(0);

    activeSources.push(source, filter, lfo, lfoGain);
  } else if (soundId === 'ocean_waves') {
    // 🌊 Zen Ocean Waves
    const buffer = createNoiseBuffer(ctx, 'brown');
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;

    // LFO to simulate wave swell rhythm (1 wave per 10s = 0.1Hz)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 400;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(masterGainNode);

    source.start(0);
    lfo.start(0);

    activeSources.push(source, filter, lfo, lfoGain);
  } else if (soundId === 'binaural_alpha') {
    // 🧠 10Hz Flow State Alpha Waves (Left: 200Hz, Right: 210Hz)
    if (!ctx.createMerger) {
      return;
    }
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();

    oscL.type = 'sine';
    oscR.type = 'sine';

    oscL.frequency.value = 200;
    oscR.frequency.value = 210;

    const merger = ctx.createChannelMerger(2);

    oscL.connect(merger, 0, 0); // Left channel
    oscR.connect(merger, 0, 1); // Right channel

    merger.connect(masterGainNode);

    oscL.start(0);
    oscR.start(0);

    activeSources.push(oscL, oscR, merger);
  }
}

export const AMBIENT_SOUNDS = [
  { id: 'none', name: 'Mute Ambient', emoji: '🔇', desc: 'No background sound' },
  { id: 'brown_noise', name: 'Cosmos Brown Noise', emoji: '🌌', desc: 'Deep low-pass noise to block noise' },
  { id: 'rain', name: 'Soothing Rain', emoji: '🌧️', desc: 'Gentle raindrops & rain patter' },
  { id: 'ocean_waves', name: 'Zen Ocean Surf', emoji: '🌊', desc: 'Rhythmic ocean wave swells' },
  { id: 'binaural_alpha', name: '10Hz Alpha Waves', emoji: '🧠', desc: 'Binaural beats for deep focus' },
];
