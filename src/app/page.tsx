import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const levels = [1, 2, 3, 4, 5, 6];

  return (
    <main className={styles.main}>
      <div className={`glass-panel fade-in ${styles.hero}`}>
        <h1 className={styles.title}>Mandarin Master</h1>
        <p className={styles.subtitle}>
          Master your pronunciation with real-time AI feedback.
          <br />
          Select your HSK level to begin your journey.
        </p>
        
        <div className={styles.grid}>
          {levels.map((level) => (
            <Link 
              key={level} 
              href={`/practice?level=${level}`}
              className={`glass-panel ${styles.card}`}
            >
              <span className={styles.levelLabel}>HSK Level</span>
              <span className={styles.levelNumber}>{level}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
