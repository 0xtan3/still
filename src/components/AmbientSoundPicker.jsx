import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { AMBIENT_SOUNDS } from '../utils/ambient';
import styles from './AmbientSoundPicker.module.css';

export default function AmbientSoundPicker() {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const selectedAmbientSound = useStore(s => s.selectedAmbientSound);
  const ambientVolume        = useStore(s => s.ambientVolume);
  const setAmbientSound      = useStore(s => s.setAmbientSound);
  const setAmbientVolume     = useStore(s => s.setAmbientVolume);

  const activeSound = AMBIENT_SOUNDS.find(s => s.id === selectedAmbientSound) || AMBIENT_SOUNDS[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={`${styles.triggerBtn} ${selectedAmbientSound !== 'none' ? styles.activeTrigger : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Ambient Sound Generator"
        title="Ambient Sound Generator (Rain, Brown Noise, Waves, Alpha Beats)"
      >
        <span className={styles.emoji}>{activeSound.emoji}</span>
        <span className={styles.label}>
          {selectedAmbientSound === 'none' ? 'Ambient' : activeSound.name.split(' ')[0]}
        </span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          viewBox="0 0 10 6"
          fill="none"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className={styles.popover}>
          <div className={styles.popoverHeader}>
            <div className={styles.popoverTitle}>
              <span className={styles.titleIcon}>🎧</span>
              <h4>Ambient Soundscapes</h4>
            </div>
            <span className={styles.subtitle}>Web Audio procedural generator</span>
          </div>

          <div className={styles.soundsGrid}>
            {AMBIENT_SOUNDS.map(snd => (
              <button
                key={snd.id}
                className={`${styles.soundCard} ${selectedAmbientSound === snd.id ? styles.activeCard : ''}`}
                onClick={() => setAmbientSound(snd.id)}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardEmoji}>{snd.emoji}</span>
                  <span className={styles.cardName}>{snd.name}</span>
                </div>
                <p className={styles.cardDesc}>{snd.desc}</p>
                {selectedAmbientSound === snd.id && <span className={styles.playingBadge}>Playing</span>}
              </button>
            ))}
          </div>

          {selectedAmbientSound !== 'none' && (
            <div className={styles.volumeBox}>
              <div className={styles.volumeHeader}>
                <span className={styles.volumeLabel}>Volume</span>
                <span className={styles.volumePercent}>{Math.round(ambientVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={e => setAmbientVolume(parseFloat(e.target.value))}
                className={styles.volumeSlider}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
