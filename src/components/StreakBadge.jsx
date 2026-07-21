import { useStore } from '../store';
import styles from './StreakBadge.module.css';

export default function StreakBadge() {
  const streak = useStore(s => s.streak);
  const today  = useStore(s => {
    const d = new Date();
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    return (s.days[k] || {}).sessions || 0;
  });
  const hour = new Date().getHours();
  const atRisk = streak > 0 && today === 0 && hour >= 18;

  return (
    <div className={`${styles.badge} ${atRisk ? styles.risk : ''}`} title={`${streak} day streak`}>
      <span className={styles.flame}>{streak >= 14 ? '🔥🔥' : '🔥'}</span>
      <span className={styles.count}>{streak}</span>
      {atRisk && <span className={styles.riskDot} title="Study today to keep your streak!" />}
    </div>
  );
}
