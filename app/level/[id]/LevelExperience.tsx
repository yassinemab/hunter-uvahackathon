"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ExplanationInput from "@/components/ExplanationInput";
import FeedbackCard from "@/components/FeedbackCard";
import ProgressBar from "@/components/ProgressBar";
import StatementCard from "@/components/StatementCard";
import RobinMascot from "@/components/RobinMascot";
import HunterBrand from "@/components/HunterBrand";
import styles from "@/components/lesson-ui.module.css";
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
  const [helpOpen, setHelpOpen] = useState(false);

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
    setHelpOpen(false);
  };

  const completed = status === "ready" && queue.length === 0;

  useEffect(() => {
    if (completed) markLevelCompleted(level.id);
  }, [completed, level.id]);

  const arrowsLeft = Math.max(0, MAX_ATTEMPTS - attempts + (evaluation && !evaluation.correct ? 0 : 1));

  return (
    <div className={styles.lesson}>
      <header className={styles.topbar}>
        <HunterBrand />
        <div className={styles.levelContext}>
          <div className={styles.contextPath}><span>{level.chapterTitle}</span><span aria-hidden="true">/</span><h1>{level.title}</h1></div>
          <p>LEVEL {level.levelIndex} OF {level.levelCount}</p>
        </div>
        <div className={styles.topbarActions}>
          <Link href="/" className={styles.mapLink}>Back to forest <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <div className={styles.forestDecor} aria-hidden="true">
        <svg className={styles.forestLeft} viewBox="0 0 210 460" fill="none">
          <path d="M95 436V122" stroke="#c8d2b8" strokeWidth="7" strokeLinecap="round" />
          <path d="m96 262-58-67m58 29 52-79m-51 183 47-43" stroke="#c8d2b8" strokeWidth="4" strokeLinecap="round" />
          <path d="M98 44c-54 40-85 102-78 164 51-15 78-62 78-164Z" fill="#dce3ce" />
          <path d="M99 80c53 22 81 70 82 114-50-9-79-53-82-114Z" fill="#e1e6d5" />
          <path d="M57 248c-32-8-53 4-60 33 35 6 53-8 60-33Zm85 14c25-20 49-15 61 10-22 22-47 17-61-10Z" fill="#dde4cf" />
          <path d="M22 435c25-35 61-47 81-20-22 29-55 31-81 20Z" fill="#e0e5d3" />
          <path d="M111 431c24-44 62-49 85-22-21 32-51 44-85 22Z" fill="#e5e9dc" />
        </svg>
        <svg className={styles.forestRight} viewBox="0 0 180 330" fill="none">
          <path d="M97 307V76" stroke="#cbd4bd" strokeWidth="5" strokeLinecap="round" />
          <path d="m96 181-38-50m39 93 33-37" stroke="#cbd4bd" strokeWidth="3" strokeLinecap="round" />
          <path d="M94 20c-44 34-67 86-66 137 44-13 67-58 66-137Z" fill="#dfe5d2" />
          <path d="M99 53c45 26 64 69 58 111-39-18-58-57-58-111Z" fill="#e5e9db" />
          <path d="M130 185c24-12 46-2 49 24-30 11-47 0-49-24Z" fill="#dfe5d2" />
        </svg>
      </div>
      <main className={styles.main}>

        {status === "loading" && (
          <div className={styles.loadingCard} role="status">
            <RobinMascot state="idle" variant="portrait" className={styles.loadingRobin} />
            <div><h2>Getting the hunt ready...</h2><p>Generating statements for this level.</p></div>
            <div className={styles.loadingLines} aria-hidden="true"><span /><span /><span /></div>
          </div>
        )}

        {status === "error" && (
          <div className={styles.statusCard}>
            <p className={styles.eyebrow}>LET&apos;S TRY AGAIN</p>
            <h2>Couldn&apos;t load this level</h2>
            <p>Something went wrong generating statements. Let&apos;s try that again.</p>
            <button
              type="button"
              onClick={() => {
                setStatus("loading");
                setReloadKey((k) => k + 1);
              }}
              className={styles.primaryButton}
            >Retry</button>
          </div>
        )}

        {completed && (
          <div className={styles.completeCard}>
            <div className={styles.completeScene}><RobinMascot state="correct" variant="scene" /></div>
            <div className={styles.completeCopy}>
              <p className={styles.eyebrow}><span /> ALL TARGETS FOUND</p>
              <h2>Level complete<span>.</span></h2>
              <p className={styles.completeSubject}>{level.chapterTitle}{level.levelCount > 1 ? ` · ${level.title}` : ""}</p>
              <p>{totalCount} / {totalCount} statements solved. Your forest is growing.</p>
              <Link href="/" className={styles.primaryButton}>Continue to roadmap <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        )}

        {status === "ready" && !completed && current && (
          <div className={styles.huntLayout}>
            <section className={styles.exercise} aria-label="Current statement">
              <div className={styles.progressHeader}>
                <div className={styles.progressCopy}><span>QUESTION {solvedCount + 1} / {totalCount}</span><strong>{solvedCount} solved</strong></div>
                <div className={styles.quiver} aria-label={`${arrowsLeft} of ${MAX_ATTEMPTS} arrows remaining`}>
                  <div className={styles.arrows} aria-hidden="true">
                    {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
                      <svg key={i} viewBox="0 0 18 38" className={i < arrowsLeft ? styles.arrow : styles.arrowSpent}>
                        <path d="M9 31V7M9 3 5 10h8L9 3Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="m9 27-5-5v8l5 5 5-5v-8l-5 5Z" fill="currentColor" />
                      </svg>
                    ))}
                  </div>
                  <span>{arrowsLeft} / {MAX_ATTEMPTS} arrows</span>
                </div>
              </div>
              <ProgressBar current={solvedCount} total={totalCount} />

              {evaluation ? (
                <FeedbackCard statement={current} evaluation={evaluation} attemptNumber={attempts} onContinue={handleContinue} />
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
                  {(selectedSpan || believesCorrect) && (
                    <ExplanationInput
                      label={believesCorrect ? "Why?" : "Why is this incorrect?"}
                      value={explanation}
                      onChange={setExplanation}
                      disabled={evaluating}
                    />
                  )}
                  {evalError && <p className={styles.errorMessage} role="alert">{evalError}</p>}
                  <div className={styles.submitRow}>
                    <p>One arrow. One well-reasoned answer.</p>
                    <button type="button" onClick={handleCheckAnswer} disabled={!canSubmit} className={styles.primaryButton}>
                      {evaluating ? "Checking…" : "Shoot your answer"}<span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </main>

      {status === "ready" && !completed && !evaluation && (
        <div className={styles.helpDock}>
          {helpOpen && (
            <div className={styles.helpFlyout} id="robin-help-flyout">
              <span className={styles.helpName}>ROBIN&apos;S LOOKOUT</span>
              <p>{hintRevealed ? "Read the claim once more. Check its definitions and relationships against what you know." : "Need another pair of eyes? Let's take a closer look together."}</p>
              <button type="button" onClick={() => setHintRevealed((prev) => !prev)} disabled={evaluating} aria-pressed={hintRevealed} className={styles.helpAction}>
                {hintRevealed ? "Hide hint" : "Get help"}<span aria-hidden="true">↗</span>
              </button>
            </div>
          )}
          <button type="button" onClick={() => setHelpOpen((prev) => !prev)} disabled={evaluating} aria-label={helpOpen ? "Close Robin's help" : "Ask Robin for help"} aria-expanded={helpOpen} aria-controls={helpOpen ? "robin-help-flyout" : undefined} className={styles.helpTrigger}>
            <RobinMascot state="idle" variant="portrait" className={styles.helpPortrait} />
            <span className={styles.helpIndicator} aria-hidden="true">{helpOpen ? "×" : "?"}</span>
          </button>
          <span className={styles.helpCaption}>ASK ROBIN</span>
        </div>
      )}
    </div>
  );
}
