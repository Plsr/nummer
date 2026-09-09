import { beforeEach, describe, expect, test } from "vitest";
import { getStats, recordAnswer } from "./stats";

beforeEach(() => {
  window.localStorage.clear();
});

describe("stats", () => {
  test("starts at zero", () => {
    expect(getStats()).toEqual({ correct: 0, wrong: 0 });
  });

  test("records correct answers", () => {
    recordAnswer(true);
    recordAnswer(true);
    expect(getStats()).toEqual({ correct: 2, wrong: 0 });
  });

  test("records wrong answers", () => {
    recordAnswer(false);
    expect(getStats()).toEqual({ correct: 0, wrong: 1 });
  });

  test("tracks correct and wrong independently", () => {
    recordAnswer(true);
    recordAnswer(false);
    recordAnswer(true);
    expect(getStats()).toEqual({ correct: 2, wrong: 1 });
  });

  test("persists across calls (reads from localStorage)", () => {
    recordAnswer(true);
    expect(getStats()).toEqual({ correct: 1, wrong: 0 });
  });

  test("ignores corrupted storage", () => {
    window.localStorage.setItem("nummer:stats", "not json");
    expect(getStats()).toEqual({ correct: 0, wrong: 0 });
  });

  test("resets invalid counter values to zero", () => {
    window.localStorage.setItem(
      "nummer:stats",
      JSON.stringify({ correct: -5, wrong: 1.5 }),
    );
    expect(getStats()).toEqual({ correct: 0, wrong: 0 });

    window.localStorage.setItem(
      "nummer:stats",
      JSON.stringify({ correct: Infinity, wrong: "3" }),
    );
    expect(getStats()).toEqual({ correct: 0, wrong: 0 });
  });
});
