import { useStore } from '../store';
import styles from './Controls.module.css';

const ResetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
  </svg>
);

const RedoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 4v6h6M2.65 15.57a10 10 0 1 0 .57-8.38L1 4"/>
  </svg>
);

export default function Controls() {
  const running = useStore(s => s.running);
  const elapsed = useStore(s => s.elapsed);
  const play    = useStore(s => s.play);
  const pause   = useStore(s => s.pause);
  const reset   = useStore(s => s.reset);

  return (
    <div className={styles.controls}>
      {/* Main Start / Stop Action Button */}
      <button
        className={`${styles.mainBtn} ${running ? styles.runningBtn : ''}`}
        onClick={running ? pause : play}
      >
        {running ? 'Stop' : elapsed > 0 ? 'Resume' : 'Start'}
      </button>

      {/* Redo / Reset Button */}
      <button
        className={styles.resetBtn}
        onClick={reset}
        title="Reset Timer (Redo)"
        aria-label="Reset Timer"
      >
        <ResetIcon />
      </button>
    </div>
  );
}
