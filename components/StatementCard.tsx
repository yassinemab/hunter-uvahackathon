import TextSelector from "./TextSelector";
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
    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Find the mistake</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Click or drag over the part you think is incorrect.
      </p>

      <div className="mt-5 rounded-2xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <TextSelector
          text={statement}
          selection={believesCorrect ? null : selectedSpan}
          onChange={onSelectSpan}
          disabled={disabled || believesCorrect}
          hintSpan={believesCorrect ? null : hintSpan}
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
        <span className="text-xs font-medium text-zinc-400">or</span>
        <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
      </div>

      <button
        type="button"
        onClick={onToggleBelievesCorrect}
        disabled={disabled}
        className={`mt-5 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          believesCorrect
            ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300"
            : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
        }`}
      >
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            believesCorrect
              ? "border-brand-500 bg-brand-500"
              : "border-zinc-300 dark:border-zinc-600"
          }`}
        >
          {believesCorrect && (
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        I think this statement is correct
      </button>
    </div>
  );
}
