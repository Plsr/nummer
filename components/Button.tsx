import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
};

/**
 * All buttons here are presentational shells only — no <button>/<a> semantics.
 * Wrap them in the real interactive element and put a `group` class there:
 *
 *   <button type="button" className="group" onClick={...} disabled={...}>
 *     <TileButton>...</TileButton>
 *   </button>
 *
 * The wrapper's `disabled`/`:active` state drives styling via `in-disabled:`
 * and `group-active:`.
 *
 * Visual language: a thick, uniform ink border all the way around, a chunky
 * bottom lip in the same color (border-b-4 vs border-2 everywhere else) plus
 * a single flat (non-blurred) box-shadow of that same color continuing the
 * lip — no soft/translucent halo layers. On press the lip and shadow
 * collapse to 0 and the shape drops down to meet them, comic/sticker style
 * (à la Duolingo) rather than soft "material" elevation.
 */

export function PrimaryButton(props: ButtonProps) {
  return (
    <div className="flex bg-blue-600 rounded-lg transition-all group-active:translate-y-[6px] group-active:border-b-2 border-2 border-b-4 border-blue-700 group-active:[box-shadow:0_0px_0_0_#1d4ed8] [box-shadow:0_4px_0_0_#1d4ed8] h-10 w-sm mx-auto flex-1 items-center justify-center px-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-blue-700 in-disabled:opacity-40">
      {props.children}
    </div>
  );
}

/** Neutral word-tile in the palette (e.g. "tre", "tyve"). */
export function TileButton(props: ButtonProps) {
  return (
    <div className="flex items-center justify-center rounded-lg bg-white border-2 border-b-4 border-zinc-300 [box-shadow:0_4px_0_0_#d4d4d8] transition-all group-active:translate-y-[6px] group-active:border-b-2 group-active:[box-shadow:0_0px_0_0_#d4d4d8] px-4 py-3 text-base font-bold text-zinc-900 hover:bg-zinc-50 in-disabled:opacity-40 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:[box-shadow:0_4px_0_0_#3f3f46] dark:group-active:[box-shadow:0_0px_0_0_#3f3f46]">
      {props.children}
    </div>
  );
}

/** The "og" (connector) word-tile — same shape as TileButton, amber accent. */
export function ConnectorTileButton(props: ButtonProps) {
  return (
    <div className="flex items-center justify-center rounded-lg bg-amber-50 border-2 border-b-4 border-amber-400 [box-shadow:0_4px_0_0_#fbbf24] transition-all group-active:translate-y-[6px] group-active:border-b-2 group-active:[box-shadow:0_0px_0_0_#fbbf24] px-4 py-3 text-base font-bold text-amber-900 hover:bg-amber-100 in-disabled:opacity-40 dark:bg-amber-400/10 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-400/20 dark:[box-shadow:0_4px_0_0_#d97706] dark:group-active:[box-shadow:0_0px_0_0_#d97706]">
      {props.children}
    </div>
  );
}

/** A tapped token in the constructed-answer tray. Tapping again removes it. */
export function ChipButton(props: ButtonProps) {
  return (
    <div className="flex items-center rounded-lg bg-zinc-300 border-2 border-b-4 border-zinc-500 [box-shadow:0_4px_0_0_#71717a] transition-all group-active:translate-y-[6px] group-active:border-b-2 group-active:[box-shadow:0_0px_0_0_#71717a] px-4 py-2 text-base font-bold text-zinc-900 in-disabled:opacity-70 dark:bg-zinc-600 dark:border-zinc-800 dark:text-white dark:[box-shadow:0_4px_0_0_#27272a] dark:group-active:[box-shadow:0_0px_0_0_#27272a]">
      {props.children}
    </div>
  );
}

/** The "og" chip in the constructed-answer tray — amber accent. */
export function ConnectorChipButton(props: ButtonProps) {
  return (
    <div className="flex items-center rounded-lg bg-amber-500 border-2 border-b-4 border-amber-700 [box-shadow:0_4px_0_0_#b45309] transition-all group-active:translate-y-[6px] group-active:border-b-2 group-active:[box-shadow:0_0px_0_0_#b45309] px-4 py-2 text-base font-bold text-amber-950 in-disabled:opacity-70 dark:bg-amber-500/90 dark:border-amber-700">
      {props.children}
    </div>
  );
}

/** Small circular icon button (e.g. the pronunciation control). */
export function IconButton(props: ButtonProps) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-b-4 border-zinc-300 [box-shadow:0_4px_0_0_#d4d4d8] transition-all group-active:translate-y-[6px] group-active:border-b-2 group-active:[box-shadow:0_0px_0_0_#d4d4d8] text-zinc-600 hover:text-zinc-900 in-disabled:opacity-40 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-50 dark:[box-shadow:0_4px_0_0_#3f3f46] dark:group-active:[box-shadow:0_0px_0_0_#3f3f46]">
      {props.children}
    </div>
  );
}
