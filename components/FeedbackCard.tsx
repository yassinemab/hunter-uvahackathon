import { MAX_ATTEMPTS } from "@/lib/constants";
import type { EvaluationResult, GeneratedStatement } from "@/lib/types";
import RobinMascot from "./RobinMascot";
import styles from "./robin-feedback.module.css";

export default function FeedbackCard({
  statement,
  evaluation,
  attemptNumber,
  onContinue,
}: {
  statement: GeneratedStatement;
  evaluation: EvaluationResult;
  attemptNumber: number;
  onContinue: () => void;
}) {
  const correct = evaluation.correct;
  const outOfAttempts = !correct && attemptNumber >= MAX_ATTEMPTS;
  const finished = correct || outOfAttempts;

  return (
    <section
      className={`${styles.card} ${finished ? styles.finished : styles.retry}`}
      aria-label={correct ? "Correct answer" : outOfAttempts ? "Out of attempts" : "Robin's hint"}
    >
      <div className={styles.resultVisual}>
        <RobinMascot
          key={`${statement.id}-${attemptNumber}-${correct}`}
          state={correct ? "correct" : outOfAttempts ? "incorrect" : "lose-arrow"}
          variant="scene"
        />
      </div>

      <div className={styles.message}>
        <div className={styles.eyebrow}>
          <span className={styles.statusDot} />
          {correct ? "Right on target" : outOfAttempts ? "Quiver empty" : "A hint from Robin"}
        </div>
        <h2 className={styles.title}>
          {correct ? "Bullseye!" : outOfAttempts ? "Every archer misses sometimes." : "Stay sharp. Try another angle."}
        </h2>

        <div className={`${styles.bubble} ${!finished ? styles.hintBubble : ""}`} role="status">
          <p className={styles.feedback}>{evaluation.feedback}</p>
        </div>

        {!correct && (
          <p className={styles.attempts}>
            {outOfAttempts
              ? "Out of attempts for now. We'll come back to this one later."
              : `${MAX_ATTEMPTS - attemptNumber} ${MAX_ATTEMPTS - attemptNumber === 1 ? "arrow" : "arrows"} left · Attempt ${attemptNumber} of ${MAX_ATTEMPTS}`}
          </p>
        )}

        {correct && (
          <div className={styles.explanation}>
            <p className={styles.sectionTitle}>Why it works</p>
            <p>{statement.explanation}</p>
          </div>
        )}

        {correct && evaluation.missingKnowledge && (
          <div className={styles.knowledge}>
            <p className={styles.sectionTitle}>Also worth knowing</p>
            <p>{evaluation.missingKnowledge}</p>
          </div>
        )}

        <button type="button" onClick={onContinue} className={styles.continueButton}>
          {finished ? "Continue" : "Try again"}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
