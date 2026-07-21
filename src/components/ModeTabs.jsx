import { useStore, MODES } from '../store';
import styles from './ModeTabs.module.css';

const TABS = [
  { key: 'focus', label: 'Focus' },
  { key: 'short', label: 'Short Break' },
  { key: 'long',  label: 'Long Break' },
];

export default function ModeTabs() {
  const mode    = useStore(s => s.mode);
  const setMode = useStore(s => s.setMode);
  const running = useStore(s => s.running);

  return (
    <nav className={styles.tabs} aria-label="Timer mode">
      {TABS.map(t => (
        <button
          key={t.key}
          className={`${styles.tab} ${mode === t.key ? styles.active : ''}`}
          onClick={() => setMode(t.key)}
          aria-pressed={mode === t.key}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
