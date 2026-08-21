export type Mode = {
  id: string;
  label: string;
  min: number;
  max: number;
  filter?: (n: number) => boolean;
};

export const MODES: Mode[] = [
  { id: "1-10", label: "1–10", min: 1, max: 10 },
  { id: "1-20", label: "1–20", min: 1, max: 20 },
  { id: "1-100", label: "1–100", min: 1, max: 100 },
  {
    id: "tens",
    label: "Tiere",
    min: 10,
    max: 100,
    filter: (n) => n % 10 === 0,
  },
];

export const DEFAULT_MODE_ID = "1-100";

export function getMode(modeId: string): Mode | undefined {
  return MODES.find((m) => m.id === modeId);
}

/** Resolves a mode known to be valid (e.g. after a route already checked it with getMode). */
export function requireMode(modeId: string): Mode {
  const mode = getMode(modeId);
  if (!mode) throw new Error(`Unknown mode: ${modeId}`);
  return mode;
}

export function candidateNumbers(mode: Mode): number[] {
  const numbers: number[] = [];
  for (let n = mode.min; n <= mode.max; n++) {
    if (!mode.filter || mode.filter(n)) numbers.push(n);
  }
  return numbers;
}

export function randomForMode(mode: Mode, exclude?: number): number {
  const candidates = candidateNumbers(mode);
  if (candidates.length === 1) return candidates[0];

  let next = candidates[Math.floor(Math.random() * candidates.length)];
  while (next === exclude) {
    next = candidates[Math.floor(Math.random() * candidates.length)];
  }
  return next;
}
