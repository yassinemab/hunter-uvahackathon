import styles from "./lesson-ui.module.css";

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className={styles.progressBar} aria-label={`Question ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`${styles.progressSegment} ${i < current ? styles.progressSolved : ""}`} />
      ))}
    </div>
  );
}
