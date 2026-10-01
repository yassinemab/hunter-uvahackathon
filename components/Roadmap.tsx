"use client";

import { useEffect, useState } from "react";

import WindingPath from "./WindingPath";
import { getCompletedLevelIds } from "@/lib/progress";
import type { Chapter } from "@/lib/types";

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

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <header className="mb-14 text-center">
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Biology 101</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Mistake Hunter
        </h1>
        <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
          Your mission: find the mistakes. Understand the material.
        </p>
      </header>

      <div className="mx-auto flex w-full max-w-xs flex-col gap-10">
        {allChapters.map((chapter, chapterIndex) => {
          const isFinal = chapter.id === finalChapter.id;

          return (
            <section key={chapter.id}>
              <div className="mb-2 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                <span
                  className={`shrink-0 text-center text-xs font-semibold uppercase tracking-wide ${
                    isFinal ? "text-red-800 dark:text-amber-400" : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {chapter.title}
                  {!isFinal && (
                    <span className="font-medium normal-case text-zinc-400 dark:text-zinc-600">
                      {" "}
                      · {difficultyLabel(chapter.difficulty)}
                    </span>
                  )}
                </span>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
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
  );
}
