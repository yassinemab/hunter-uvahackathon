"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ExplanationInput from "@/components/ExplanationInput";
import FeedbackCard from "@/components/FeedbackCard";
import ProgressBar from "@/components/ProgressBar";
import StatementCard from "@/components/StatementCard";
import { MAX_ATTEMPTS } from "@/lib/constants";
import { computeHintSpan } from "@/lib/hint";
import { markLevelCompleted } from "@/lib/progress";
import type {
  EvaluateRequest,
  EvaluateResponse,
  EvaluationResult,
  GenerateResponse,
  GeneratedStatement,
  IncorrectSpan,
  LevelWithContext,
} from "@/lib/types";

type Status = "loading" | "ready" | "error";

export default function LevelExperience({ level }: { level: LevelWithContext }) {
  const [status, setStatus] = useState<Status>("loading");
  const [queue, setQueue] = useState<GeneratedStatement[]>([]);
  const [totalCount, setTotalCount] = useState(3);
  const [solvedCount, setSolvedCount] = useState(0);

  const [selectedSpan, setSelectedSpan] = useState<IncorrectSpan | null>(null);
  const [believesCorrect, setBelievesCorrect] = useState(false);
  const [explanation, setExplanation] = useState("");

  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Attempts (1-3) on the *current* statement before it gets requeued to the
  // back. Only reset when actually moving to a different statement.
  const [attempts, setAttempts] = useState(1);
  const [hintRevealed, setHintRevealed] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ levelId: level.id }),
        });
        if (!res.ok) throw new Error("Request failed");
        const data: GenerateResponse = await res.json();
        if (!data.statements || data.statements.length === 0) throw new Error("No statements");

        if (cancelled) return;
        setQueue(data.statements);
        setTotalCount(data.statements.length);
        setSolvedCount(0);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [level.id, reloadKey]);

  const resetAnswerState = () => {
    setSelectedSpan(null);
    setBelievesCorrect(false);
    setExplanation("");
    setEvaluation(null);
    setEvalError(null);
  };

  const current = queue[0];

  const hintSpan = useMemo(() => {
    if (!hintRevealed || !current?.incorrectSpan) return null;
    return computeHintSpan(current.statement, current.incorrectSpan);
  }, [hintRevealed, current]);

  const handleSelectSpan = (span: IncorrectSpan | null) => {
    setSelectedSpan(span);
    if (span) setBelievesCorrect(false);
  };

  const handleToggleBelievesCorrect = () => {
    setBelievesCorrect((prev) => {
      const next = !prev;
      if (next) setSelectedSpan(null);
      return next;
    });
  };

  const canSubmit =
    !evaluating && explanation.trim().length > 0 && (believesCorrect || selectedSpan !== null);

  const handleCheckAnswer = async () => {
    if (!current || !canSubmit) return;
    setEvaluating(true);
    setEvalError(null);

    const body: EvaluateRequest = {
      statement: current,
      answer: {
        believesCorrect,
        selectedSpan: believesCorrect ? undefined : (selectedSpan ?? undefined),
        selectedText:
          !believesCorrect && selectedSpan
            ? current.statement.slice(selectedSpan.start, selectedSpan.end)
            : undefined,
        explanation: explanation.trim(),
      },
      attemptNumber: attempts,
    };

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Request failed");
      const result: EvaluateResponse = await res.json();
      setEvaluation(result);
    } catch {
      setEvalError("Something went wrong grading that answer. Please try again.");
    } finally {
      setEvaluating(false);
    }
  };

  const handleContinue = () => {
    if (!evaluation || !current) return;

    if (evaluation.correct) {
      setQueue((prev) => prev.slice(1));
      setSolvedCount((prev) => prev + 1);
      setAttempts(1);
      setHintRevealed(false);
    } else if (attempts >= MAX_ATTEMPTS) {
      // Out of attempts on this one — send it to the back of the queue and
      // give the student a clean slate for whichever statement is next.
      setQueue((prev) => [...prev.slice(1), prev[0]]);
      setAttempts(1);
      setHintRevealed(false);
    } else {
      // Still has attempts left — same statement stays at the front of the
      // queue, just reset the answer inputs for another try.
      setAttempts((prev) => prev + 1);
    }

    resetAnswerState();
  };

  const completed = status === "ready" && queue.length === 0;

  useEffect(() => {
    if (completed) markLevelCompleted(level.id);
  }, [completed, level.id]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          ← {level.chapterTitle}
        </Link>
        {level.levelCount > 1 && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
            Level {level.levelIndex} of {level.levelCount} · {level.title}
          </p>
        )}

        {status === "loading" && (
          <div className="mt-8 animate-pulse rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="h-4 w-32 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="mt-6 h-5 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="mt-3 h-5 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="mt-3 h-5 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
            <p className="mt-8 text-sm text-zinc-400">Generating statements…</p>
          </div>
        )}

        {status === "error" && (
          <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Couldn&apos;t load this level
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Something went wrong generating statements. Let&apos;s try that again.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("loading");
                setReloadKey((k) => k + 1);
              }}
              className="mt-5 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Retry
            </button>
          </div>
        )}

        {completed && (
          <div className="mt-8 rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-10 text-center shadow-sm dark:border-brand-900 dark:from-brand-950 dark:to-zinc-900">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl text-white">
              ✓
            </span>
            <h2 className="mt-5 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Level complete
            </h2>
            <p className="mt-1 text-base font-medium text-brand-600 dark:text-brand-400">
              {level.chapterTitle}
              {level.levelCount > 1 ? ` · ${level.title}` : ""}
            </p>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              {totalCount} / {totalCount} statements solved
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
            >
              Continue to roadmap
            </Link>
          </div>
        )}

        {status === "ready" && !completed && current && (
          <div className="mt-8">
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Question {solvedCount + 1} of {totalCount}
              </p>
              <ProgressBar current={solvedCount} total={totalCount} />
            </div>

            {evaluation ? (
              <FeedbackCard
                statement={current}
                evaluation={evaluation}
                attemptNumber={attempts}
                onContinue={handleContinue}
              />
            ) : (
              <>
                <StatementCard
                  statement={current.statement}
                  selectedSpan={selectedSpan}
                  onSelectSpan={handleSelectSpan}
                  believesCorrect={believesCorrect}
                  onToggleBelievesCorrect={handleToggleBelievesCorrect}
                  disabled={evaluating}
                  hintSpan={hintSpan}
                />

                <ExplanationInput
                  label={believesCorrect ? "Why?" : "Why is this incorrect?"}
                  value={explanation}
                  onChange={setExplanation}
                  disabled={evaluating}
                />

                {evalError && <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{evalError}</p>}

                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  disabled={!canSubmit}
                  className="mt-5 w-full rounded-full bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
                >
                  {evaluating ? "Checking…" : "Check answer"}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {status === "ready" &&
        !completed &&
        !evaluation &&
        current?.incorrectSpan &&
        !believesCorrect && (
          <button
            type="button"
            onClick={() => setHintRevealed((prev) => !prev)}
            disabled={evaluating}
            aria-pressed={hintRevealed}
            className={`fixed bottom-6 right-6 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              hintRevealed
                ? "bg-amber-500 text-white hover:bg-amber-400"
                : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path
                d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.4 10.9c.6.44.9 1.16.9 1.9v.2h5v-.2c0-.74.3-1.46.9-1.9A6 6 0 0 0 12 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {hintRevealed ? "Hide hint" : "Hint"}
          </button>
        )}
    </div>
  );
}
