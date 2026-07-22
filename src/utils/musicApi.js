// Chill Lofi Beats Track Pool Engine for CHRONO

export const LOFI_PLAYLIST = [
  {
    id: 'lofi_chillhop',
    title: 'Lofi Chillhop Beats',
    genre: 'Chill Lofi',
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv'
  },
  {
    id: 'lofi_cafe',
    title: 'Lofi Study Cafe',
    genre: 'Chill Lofi',
    streamUrl: 'https://stream.zeno.fm/0r0xa792kwzuv'
  },
  {
    id: 'lofi_peaceful',
    title: 'Peaceful Lofi Melodies',
    genre: 'Chill Lofi',
    streamUrl: 'https://stream.zeno.fm/4v362bca1d0uv'
  },
  {
    id: 'lofi_midnight',
    title: 'Midnight Focus Lofi',
    genre: 'Chill Lofi',
    streamUrl: 'https://stream.zeno.fm/z8m8a3791d0uv'
  }
];

let audioEl = null;
let currentTrackIndex = 0;

function getAudioElement() {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.crossOrigin = 'anonymous';
    audioEl.preload = 'none';

    // Auto-advance to a different Lofi track when stream/track ends
    audioEl.addEventListener('ended', () => {
      skipToNextLofiTrack();
    });
  }
  return audioEl;
}

export function playLofi(volume = 0.5, forceTrackIndex = null) {
  try {
    const audio = getAudioElement();

    if (forceTrackIndex !== null) {
      currentTrackIndex = forceTrackIndex % LOFI_PLAYLIST.length;
    }

    const currentTrack = LOFI_PLAYLIST[currentTrackIndex];
    if (audio.src !== currentTrack.streamUrl) {
      audio.src = currentTrack.streamUrl;
    }

    audio.volume = Math.max(0, Math.min(1, volume));
    const p = audio.play();
    if (p !== undefined) {
      p.catch(err => console.warn('Lofi playback warning:', err));
    }

    return currentTrack;
  } catch (err) {
    console.warn('Audio play error:', err);
    return LOFI_PLAYLIST[0];
  }
}

export function skipToNextLofiTrack(volume = 0.5) {
  // Pick a DIFFERENT track index from the current one
  let nextIndex = (currentTrackIndex + 1) % LOFI_PLAYLIST.length;
  if (nextIndex === currentTrackIndex && LOFI_PLAYLIST.length > 1) {
    nextIndex = (nextIndex + 1) % LOFI_PLAYLIST.length;
  }
  currentTrackIndex = nextIndex;
  return playLofi(volume, currentTrackIndex);
}

export function pauseLofi() {
  if (audioEl) {
    audioEl.pause();
  }
}

export function setLofiVolume(vol = 0.5) {
  if (audioEl) {
    audioEl.volume = Math.max(0, Math.min(1, vol));
  }
}

export function getCurrentLofiTrack() {
  return LOFI_PLAYLIST[currentTrackIndex];
}
