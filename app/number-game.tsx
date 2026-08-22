"use client";

import { useMemo, useState } from "react";
import { Volume2 } from "lucide-react";
import {
  danishPalette,
  danishTokens,
  TOKEN_GROUPS,
} from "@/lib/danish-numbers";
import { candidateNumbers, requireMode } from "@/lib/modes";
import clsx from "clsx";
import { PrimaryButton } from "@/components/Button";

function speakDanish(word: string) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "da-DK";
  window.speechSynthesis.speak(utterance);
}

function tileClassName(token: string) {
  if (token === "og") {
    return "rounded-lg border border-solid border-amber-400/70 bg-amber-50 px-4 py-3 text-base font-medium text-amber-900 transition-colors hover:border-amber-400 hover:bg-amber-100 disabled:opacity-40 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20";
  }
  return "rounded-lg border border-solid border-black/[.08] px-4 py-3 text-base font-medium transition-colors hover:border-transparent hover:bg-black/[.04] disabled:opacity-40 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]";
}

function chipClassName(token: string) {
  if (token === "og") {
    return "rounded bg-amber-500 px-4 py-2 text-base font-medium text-white disabled:opacity-70 dark:bg-amber-500/90";
  }
  return "rounded bg-foreground px-4 py-2 text-base font-medium text-background disabled:opacity-70";
}

export default function NumberGame({
  modeId,
  initialNumber,
}: {
  modeId: string;
  initialNumber: number;
}) {
  const mode = useMemo(() => requireMode(modeId), [modeId]);
  const [current, setCurrent] = useState(initialNumber);
  const [tapped, setTapped] = useState<string[]>([]);
  const [status, setStatus] = useState<"pending" | "correct" | "incorrect">(
    "pending",
  );
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const palette = useMemo(() => danishPalette(candidateNumbers(mode)), [mode]);
  const paletteGroups = useMemo(() => {
    const paletteSet = new Set(palette);
    return [
      TOKEN_GROUPS.onesToTen,
      TOKEN_GROUPS.teens,
      TOKEN_GROUPS.tensAndUp,
      TOKEN_GROUPS.connector,
    ]
      .map((group) => group.filter((token) => paletteSet.has(token)))
      .filter((group) => group.length > 0);
  }, [palette]);
  const answer = useMemo(() => danishTokens(current).join(""), [current]);
  const constructed = tapped.join("");

  function handleTap(token: string) {
    if (status !== "pending") return;
    setTapped((prev) => [...prev, token]);
  }

  function handleRemove(index: number) {
    if (status !== "pending") return;
    setTapped((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (status !== "pending" || tapped.length === 0) return;
    setStatus(constructed === answer ? "correct" : "incorrect");
  }

  async function handleNext() {
    setIsLoadingNext(true);
    try {
      const res = await fetch(`/mode/${modeId}/next?exclude=${current}`);
      const { number } = (await res.json()) as { number: number };
      setCurrent(number);
      setTapped([]);
      setStatus("pending");
    } finally {
      setIsLoadingNext(false);
    }
  }

  return (
    <main className="flex w-full h-full flex-col items-center gap-8">
      <div className="max-w-4xl flex items-center flex-col gap-4 py-12">
        <div className="flex items-center gap-3">
          <p className="text-6xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {current}
          </p>
          <button
            type="button"
            onClick={() => speakDanish(answer)}
            aria-label="Hør udtale"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-solid border-black/[.08] text-zinc-600 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-300 dark:hover:bg-[#1a1a1a]"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-16 w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-dashed border-black/[.15] px-4 py-3 dark:border-white/[.2]">
          {tapped.length === 0 && (
            <span className="text-sm text-zinc-400 dark:text-zinc-600">
              Tryk på ordene herunder for at bygge svaret
            </span>
          )}
          {tapped.map((token, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleRemove(i)}
              disabled={status !== "pending"}
              className={chipClassName(token)}
            >
              {token}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          {paletteGroups.map((group, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {group.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => handleTap(token)}
                  disabled={status !== "pending"}
                  className={tileClassName(token)}
                >
                  {token}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto sticky bottom-0 z-10 flex w-full flex-col gap-3 border-t border-black/[.08] bg-zinc-50 px-4 py-6 dark:border-white/[.145] dark:bg-black">
        {status !== "pending" && (
          <>
            <SolutionCallout
              isCorrect={status === "correct"}
              correctAnswer={answer}
            />
          </>
        )}
        <div className="flex w-full items-center justify-center gap-3">
          {status === "pending" ? (
            <button
              onClick={handleSubmit}
              disabled={tapped.length === 0}
              className="group"
            >
              <PrimaryButton>Svar</PrimaryButton>
            </button>
          ) : (
            <button onClick={handleNext} disabled={isLoadingNext}>
              <PrimaryButton>{isLoadingNext ? "…" : "Næste"}</PrimaryButton>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

type SolutionCalloutProps = {
  isCorrect: boolean;
  correctAnswer?: string;
};

const SolutionCallout = ({
  isCorrect,
  correctAnswer,
}: SolutionCalloutProps) => {
  return (
    <div className="max-w-2xl text-center mx-auto">
      <p
        className={clsx(
          "text-lg font-medium",
          isCorrect && "text-green-600 dark:text-green-400",
          !isCorrect && "text-red-600 dark:text-red-400",
        )}
      >
        {isCorrect ? "Rigtigt!" : `Forkert. Svaret er "${correctAnswer}".`}
      </p>
    </div>
  );
};
