import { useStore } from '../store';
import styles from './SessionDots.module.css';

export default function SessionDots() {
  const sessions  = useStore(s => s.sessions);
  const totalSess = useStore(s => s.totalSess);

  return (
    <div className={styles.dots} aria-label="Session progress">
      {Array.from({ length: totalSess }, (_, i) => (
        <div
          key={i}
          className={`${styles.dot} ${i < sessions ? styles.done : ''}`}
          aria-label={i < sessions ? 'Complete' : 'Pending'}
        />
      ))}
    </div>
  );
}
