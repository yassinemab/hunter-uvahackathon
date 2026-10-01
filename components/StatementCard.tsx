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
      <div className={styles.woodenBoard}>
        <span className={`${styles.boardPin} ${styles.pinTopLeft}`} aria-hidden="true" />
        <span className={`${styles.boardPin} ${styles.pinTopRight}`} aria-hidden="true" />
        <span className={`${styles.boardPin} ${styles.pinBottomLeft}`} aria-hidden="true" />
        <span className={`${styles.boardPin} ${styles.pinBottomRight}`} aria-hidden="true" />
        <div className={styles.boardTop}>
          <span>FIELD NOTES</span>
          <span className={styles.boardStamp}><span aria-hidden="true">◎</span> CLAIM UNDER REVIEW</span>
        </div>
        <h2 className={styles.boardTitle}>Find the mistake.</h2>
        <p className={styles.boardInstruction}>Click or drag over the part you think is incorrect.</p>
        <div className={styles.statementText}>
          <TextSelector
            text={statement}
            selection={believesCorrect ? null : selectedSpan}
            onChange={onSelectSpan}
            disabled={disabled || believesCorrect}
            hintSpan={believesCorrect ? null : hintSpan}
          />
        </div>
        <div className={styles.boardBottom}>
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
