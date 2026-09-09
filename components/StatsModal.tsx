"use client";

import { useRef, useState } from "react";
import { ChartColumn, X } from "lucide-react";
import { getStats, type Stats } from "@/lib/stats";

/** Sidebar entry that opens a modal with lifetime right/wrong answer stats. */
export function StatsModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [stats, setStats] = useState<Stats>({ correct: 0, wrong: 0 });

  function handleOpen() {
    setStats(getStats());
    dialogRef.current?.showModal();
  }

  const total = stats.correct + stats.wrong;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : null;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="mt-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
      >
        <ChartColumn className="h-4 w-4" />
        Statistik
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="stats-modal-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto rounded-2xl border-2 border-b-4 border-zinc-500 bg-white p-6 text-zinc-900 backdrop:bg-black/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      >
        <div className="flex w-72 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 id="stats-modal-title" className="text-lg font-bold">
              Statistik
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Luk"
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col gap-1 rounded-lg bg-zinc-100 py-3 dark:bg-zinc-800">
              <dt className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                Rigtige
              </dt>
              <dd className="text-2xl font-semibold text-green-700 dark:text-green-400">
                {stats.correct}
              </dd>
            </div>
            <div className="flex flex-col gap-1 rounded-lg bg-zinc-100 py-3 dark:bg-zinc-800">
              <dt className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                Forkerte
              </dt>
              <dd className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {stats.wrong}
              </dd>
            </div>
          </dl>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            {accuracy === null
              ? "Ingen svar endnu"
              : `${accuracy}% rigtige ud af ${total} svar`}
          </p>
        </div>
      </dialog>
    </>
  );
}
