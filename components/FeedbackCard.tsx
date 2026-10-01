import { MAX_ATTEMPTS } from "@/lib/constants";
import type { EvaluationResult, GeneratedStatement } from "@/lib/types";

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

  return (
    <div
      className={`rounded-3xl border p-8 shadow-sm ${
        correct
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40"
          : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white ${
            correct ? "bg-emerald-500" : "bg-amber-500"
          }`}
        >
          {correct ? "✓" : "!"}
        </span>
        <h2
          className={`text-lg font-semibold ${
            correct ? "text-emerald-800 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"
          }`}
        >
          {correct ? "Correct" : "Not quite"}
        </h2>
      </div>

      <p className="mt-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        {evaluation.feedback}
      </p>

      {!correct && (
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-amber-700/70 dark:text-amber-400/70">
          {outOfAttempts
            ? "Out of attempts for now — we'll come back to this one later."
            : `Attempt ${attemptNumber} of ${MAX_ATTEMPTS}`}
        </p>
      )}

      {correct && (
        <div className="mt-5 rounded-2xl border border-emerald-100 bg-white/60 p-5 dark:border-emerald-900 dark:bg-zinc-900/40">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Explanation</p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {statement.explanation}
          </p>
        </div>
      )}

      {correct && evaluation.missingKnowledge && (
        <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Also worth knowing</p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {evaluation.missingKnowledge}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onContinue}
        className={`mt-6 w-full rounded-full px-5 py-3 text-sm font-semibold text-white transition-colors ${
          correct
            ? "bg-emerald-600 hover:bg-emerald-500"
            : "bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        }`}
      >
        {correct ? "Continue" : outOfAttempts ? "Continue" : "Try again"}
      </button>
    </div>
  );
}
