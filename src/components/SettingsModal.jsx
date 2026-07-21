import { useStore, VISUALIZERS, THEMES } from '../store';
import styles from './SettingsModal.module.css';

export default function SettingsModal() {
  const isSettingsOpen     = useStore(s => s.isSettingsOpen);
  const toggleSettings     = useStore(s => s.toggleSettings);
  const bestStreak         = useStore(s => s.bestStreak);
  const streak             = useStore(s => s.streak);
  const currentStreak      = Math.max(streak, bestStreak);

  const selectedVisualizer = useStore(s => s.selectedVisualizer);
  const setVisualizer      = useStore(s => s.setVisualizer);

  const selectedTheme      = useStore(s => s.selectedTheme);
  const setTheme           = useStore(s => s.setTheme);

  if (!isSettingsOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && toggleSettings()}>
      <div className={styles.modalDrawer}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerTitle}>
            <span className={styles.gearIcon}>⚙️</span>
            <h3>App Customization</h3>
          </div>
          <button className={styles.closeBtn} onClick={toggleSettings} aria-label="Close settings">
            ✕
          </button>
        </div>

        <div className={styles.drawerBody}>
          {/* Section 1: Visualizer Selector */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>3D Visualizers</h4>
              <span className={styles.streakBadge}>Streak: {currentStreak}d</span>
            </div>

            <div className={styles.optionsGrid}>
              {VISUALIZERS.map(vis => {
                const unlocked = currentStreak >= vis.reqStreak;
                const isSelected = selectedVisualizer === vis.id;

                return (
                  <div
                    key={vis.id}
                    className={`${styles.optionCard} ${isSelected ? styles.activeCard : ''} ${!unlocked ? styles.lockedCard : ''}`}
                    onClick={() => unlocked && setVisualizer(vis.id)}
                  >
                    <div className={styles.optionTop}>
                      <span className={styles.optionEmoji}>{vis.emoji}</span>
                      <span className={styles.optionName}>{vis.name}</span>
                    </div>

                    <div className={styles.optionDesc}>{vis.desc}</div>

                    {!unlocked && (
                      <div className={styles.lockInfo}>
                        🔒 Unlock at {vis.reqStreak}-day streak
                      </div>
                    )}

                    {unlocked && isSelected && (
                      <div className={styles.activePill}>Active</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Background Theme Selector */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>Background Themes</h4>
            </div>

            <div className={styles.optionsGrid}>
              {THEMES.map(th => {
                const unlocked = currentStreak >= th.reqStreak;
                const isSelected = selectedTheme === th.id;

                return (
                  <div
                    key={th.id}
                    className={`${styles.optionCard} ${isSelected ? styles.activeCard : ''} ${!unlocked ? styles.lockedCard : ''}`}
                    onClick={() => unlocked && setTheme(th.id)}
                  >
                    <div className={styles.optionTop}>
                      <span
                        className={styles.colorDot}
                        style={{ background: th.bg, borderColor: th.accent }}
                      />
                      <span className={styles.optionName}>{th.name}</span>
                    </div>

                    {!unlocked && (
                      <div className={styles.lockInfo}>
                        🔒 Unlock at {th.reqStreak}-day streak
                      </div>
                    )}

                    {unlocked && isSelected && (
                      <div className={styles.activePill}>Active</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
