import TextSelector from "./TextSelector";
import styles from "./lesson-ui.module.css";
import type { IncorrectSpan } from "@/lib/types";

export default function StatementCard({
  statement,
  selectedSpan,
  onSelectSpan,
  believesCorrect,
  onToggleBelievesCorrect,
  disabled = false,
  hintSpan = null,
}: {
  statement: string;
  selectedSpan: IncorrectSpan | null;
  onSelectSpan: (span: IncorrectSpan | null) => void;
  believesCorrect: boolean;
  onToggleBelievesCorrect: () => void;
  disabled?: boolean;
  hintSpan?: IncorrectSpan | null;
}) {
  return (
    <div className={styles.statementCard}>
      <div className={styles.statementHeading}>
        <h2>Find the mistake.</h2>
        <details className={styles.instructions}>
          <summary aria-label="How to play" title="How to play">?</summary>
          <div className={styles.instructionsPopover}>
            <h3>How to play</h3>
            <ol>
              <li>Select the words you think are wrong, or mark the statement correct.</li>
              <li>Explain your reasoning in your own words.</li>
              <li>Shoot your answer. You have three attempts per statement.</li>
            </ol>
            <p>Need a hint? Ask Robin in the bottom-right corner.</p>
          </div>
        </details>
      </div>
      <p className={styles.claimInstruction}>Click or drag over the part you think is incorrect.</p>
      <div className={styles.claimCard}>
        <div className={styles.claimTop}>
          <span>FIELD NOTES</span>
          <span className={styles.claimStamp}><span aria-hidden="true">◎</span> CLAIM UNDER REVIEW</span>
        </div>
        <div className={styles.statementText}>
          <TextSelector
            text={statement}
            selection={believesCorrect ? null : selectedSpan}
            onChange={onSelectSpan}
            disabled={disabled || believesCorrect}
            hintSpan={believesCorrect ? null : hintSpan}
          />
        </div>
        <div className={styles.claimBottom}>
          <span className={styles.selectionStatus}><span aria-hidden="true">{selectedSpan ? "↗" : "⊕"}</span>{selectedSpan ? "Target selected" : "Choose your target"}</span>
          <span>READ. REASON. RELEASE.</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleBelievesCorrect}
        disabled={disabled}
        aria-pressed={believesCorrect}
        className={`${styles.correctToggle} ${believesCorrect ? styles.correctToggleActive : ""}`}
      >
        <span className={styles.toggleCircle} aria-hidden="true">
          {believesCorrect && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        I think this statement is correct
        <span className={styles.toggleAlternative}>OR</span>
      </button>
    </div>
  );
}
