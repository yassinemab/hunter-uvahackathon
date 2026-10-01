"use client";

import { useEffect, useState } from "react";
import HunterBrand from "./HunterBrand";

import WindingPath from "./WindingPath";
import { getCompletedLevelIds } from "@/lib/progress";
import type { Chapter } from "@/lib/types";
import "./forest-map.css";

function difficultyLabel(difficulty: number): string {
  if (difficulty <= 2) return "Easy";
  if (difficulty <= 5) return "Medium";
  if (difficulty <= 7) return "Hard";
  return "Expert";
}

export default function Roadmap({
  chapters,
  finalChapter,
}: {
  chapters: Chapter[];
  finalChapter: Chapter;
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Deferred (rather than read directly during render) so the client's
    // first render matches the server-rendered markup before localStorage
    // state is synced in — avoids a hydration mismatch.
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (!cancelled) setCompleted(getCompletedLevelIds());
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allChapters = [...chapters, finalChapter];
  const flatLevels = allChapters.flatMap((c) => c.levels);
  const firstIncompleteIndex = flatLevels.findIndex((l) => !completed.has(l.id));
  const activeLevelId =
    firstIncompleteIndex === -1
      ? flatLevels[flatLevels.length - 1]?.id
      : flatLevels[firstIncompleteIndex].id;
  const completedCount = flatLevels.filter((level) => completed.has(level.id)).length;

  return (
    <div className="forest-shell">
      <header className="forest-header">
        <HunterBrand />
        <span className="forest-header-label">Catch, Check, Correct</span>
        <span className="forest-course-pill"><span />Physics 101</span>
      </header>
      <main className="forest-layout">
        <div className="forest-map-column">
          <div className="forest-map-heading">
            <div>
              <span className="forest-small-label">YOUR ROADMAP</span>
              <h1>Into the forest</h1>
              <p className="forest-map-caption">Pick any chapter. Find the mistakes. Follow your own path.</p>
            </div>
            <div className="forest-heading-progress">
              <div className="forest-progress-label"><span>Trail progress</span><strong>{completedCount} / {flatLevels.length}</strong></div>
              <div className="forest-progress-track" role="progressbar" aria-label="Completed levels" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={flatLevels.length}>
                <span style={{ width: `${flatLevels.length ? completedCount / flatLevels.length * 100 : 0}%` }} />
              </div>
              <p>{chapters.length} chapters · 1 final challenge</p>
            </div>
          </div>
          <div className="forest-map">
        {allChapters.map((chapter, chapterIndex) => {
          const isFinal = chapter.id === finalChapter.id;

          return (
            <section key={chapter.id} className={`forest-chapter${isFinal ? " forest-final-chapter" : ""}`}>
              <div className="forest-chapter-sign">
                <span className="forest-chapter-number">{isFinal ? "↗" : String(chapterIndex + 1).padStart(2, "0")}</span>
                <div><span className="forest-small-label">{isFinal ? "THE FINAL HUNT" : `CHAPTER ${chapterIndex + 1}`}</span><h3>{chapter.title}</h3></div>
                <span className="forest-difficulty">{isFinal ? "All topics" : difficultyLabel(chapter.difficulty)}</span>
              </div>

              <WindingPath
                nodes={chapter.levels.map((level, levelIndex) => ({
                  id: level.id,
                  href: `/level/${level.id}`,
                  label: level.title,
                  isCompleted: completed.has(level.id),
                  isActive: level.id === activeLevelId,
                  variant: isFinal ? "final" : "default",
                  tooltip: chapterIndex === 0 && levelIndex === 1 ? "Jump in here" : undefined,
                }))}
              />
            </section>
          );
        })}
          </div>
        </div>
      </main>
    </div>
  );
}
