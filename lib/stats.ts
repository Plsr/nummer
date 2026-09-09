const STORAGE_KEY = "nummer:stats";

export type Stats = { correct: number; wrong: number };

const EMPTY_STATS: Stats = { correct: 0, wrong: 0 };

function toCount(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
    ? value
    : 0;
}

export function getStats(): Stats {
  if (typeof window === "undefined") return EMPTY_STATS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATS;
    const parsed = JSON.parse(raw);
    return {
      correct: toCount(parsed.correct),
      wrong: toCount(parsed.wrong),
    };
  } catch {
    return EMPTY_STATS;
  }
}

export function recordAnswer(correct: boolean): Stats {
  const stats = getStats();
  const next = correct
    ? { ...stats, correct: stats.correct + 1 }
    : { ...stats, wrong: stats.wrong + 1 };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (e.g. private browsing) — stats just won't persist
  }
  return next;
}
