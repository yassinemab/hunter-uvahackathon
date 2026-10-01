// Lightweight client-side progress tracking, persisted to localStorage.
//
// There's no backend/database in v0 (per product scope), but the Duolingo-
// style chapter path needs *some* notion of "completed" to render checkmarks
// vs. the "Start" node. This is purely cosmetic within a browser session —
// nothing is sent to the server and nothing blocks access to any level.

const STORAGE_KEY = "mistake-hunter:completed-levels";

export function getCompletedLevelIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function markLevelCompleted(levelId: string): void {
  if (typeof window === "undefined") return;
  try {
    const ids = getCompletedLevelIds();
    ids.add(levelId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Ignore storage errors (private browsing, quota, etc.) — non-critical.
  }
}
