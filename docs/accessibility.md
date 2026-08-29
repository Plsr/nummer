# Accessibility

Read this before changing anything visual — colors, borders, fonts, new
components, layout. It's linked from `CLAUDE.md` so it's loaded every
session; the point is that accessibility gets checked as a normal part of UI
work, not bolted on afterward.

## Color contrast — the rule

WCAG 2.1 AA, which this app targets:

- **Normal text: 4.5:1** against its background.
- **Large text: 3:1**. "Large" means ≥24px regular weight, or ≥18.66px
  (~14pt) at bold (700) weight. Most of this app's button/label text (14–16px,
  `font-bold` which is 700) is close to that line but doesn't clear it —
  treat button and chip text as normal text and hold it to 4.5:1 unless
  you've checked the actual computed size/weight clears the large-text bar.
- **Non-text / UI component boundaries: 3:1** — icon glyphs, focus rings,
  the visible edge of a control against its background (WCAG 1.4.11).
- **Disabled controls are exempt.** `in-disabled:opacity-40` /
  `in-disabled:opacity-70` on the button shells don't need to hit these
  ratios — WCAG explicitly excludes inactive UI from the contrast
  requirement.

### How to check

There's no automated check wired into this repo yet (see Open questions).
Until there is, either use a contrast-checker tool, or compute it yourself:

1. Convert each channel of both colors from sRGB (0–255) to linear light:
   `c ≤ 0.03928 ? c/12.92 : ((c/255 + 0.055) / 1.055) ^ 2.4` (using `c/255`
   first).
2. Relative luminance `L = 0.2126*R + 0.7152*G + 0.0722*B`.
3. Contrast ratio `(L_lighter + 0.05) / (L_darker + 0.05)`.

The failure mode to watch for specifically in this codebase: **Tailwind's
`-400`/`-500` shades (`blue-500`, `amber-500`, `zinc-400`) very often fail
with white text** — they're mid-brightness, tuned to look good as a fill, not
to carry white text. `-600`/`-700` (or a dark, near-black text color instead)
usually clears 4.5:1. Don't assume a color pairing is fine because it "reads
dark" or "reads saturated" at a glance — check it.

## What's already been checked

Every button shell in `components/Button.tsx` and every piece of feedback
text in `app/number-game.tsx` has had its text/fill contrast computed at
least once (2026-08-29 pass). Current pairings, all ≥4.5:1 (or ≥3:1 for
`IconButton`'s icon glyph, which is non-text):

| Component / text | Light mode | Dark mode |
|---|---|---|
| `PrimaryButton` | white on `blue-600` (5.2:1); hover `blue-700` (6.7:1) | same (fixed colors, no longer theme-dependent) |
| `TileButton` | `zinc-900` on white (~18:1) | `zinc-50` on `zinc-900` (~17:1) |
| `ConnectorTileButton` | `amber-900` on `amber-50` (8.7:1) | `amber-300` on `amber-400/10` (11.7:1) |
| `ChipButton` | `zinc-900` on `zinc-300` (12:1) | white on `zinc-600` (7.7:1) |
| `ConnectorChipButton` | `amber-950` on `amber-500` (7:1) | same (9%-transparent variant, 5.7:1) |
| `IconButton` glyph | `zinc-600`/`zinc-900` (hover) on white (7.7:1+) | `zinc-300`/`zinc-50` (hover) on `zinc-900` (12:1+) |
| "Tryk på ordene…" hint | `zinc-500` on white (4.8:1) | `zinc-400` on near-black (7.7:1) |
| "Rigtigt!" | `green-700` on white (5.0:1) | `green-400` on near-black (11.4:1) |
| "Forkert. Svaret er…" | `red-600` on white (4.8:1) | `red-400` on near-black (7.2:1) |

If you change any of these fills or text colors, recompute the ratio and
update this table — it's the thing that keeps the next person from
reintroducing a fix that's already been made once.

## Bugs found and fixed in this pass

For context on what "checking contrast" actually catches, these were real,
shipped failures:

- **`PrimaryButton`**: `white` text on `bg-blue-500` computed to **3.68:1**
  (fails 4.5:1). Its `hover:bg-blue-400` was worse: **2.54:1**. Root cause:
  `text-background` — a CSS variable that flips between white and near-black
  across themes — was being used against a *fixed* blue fill, so no single
  fill color could satisfy both themes at once. Fixed by making the fill
  theme-independent (`blue-600`, hover `blue-700`) and the text a fixed
  `white`, rather than tying button text color to the page's light/dark
  variable.
- **`ConnectorChipButton`**: `white` text on `bg-amber-500` computed to
  **2.15:1** (dark mode's 90%-opacity variant: 2.61:1) — badly fails even the
  3:1 large-text floor. Fixed by switching to `amber-950` text (7:1 / 5.7:1).
- **The "tap the words below" hint text**: `zinc-400`/`zinc-600` on the page
  background computed to **~2.56:1** in both themes. Fixed to
  `zinc-500`/`zinc-400`.
- **The green "Rigtigt!" (correct) message**: `green-600` on white computed
  to **3.30:1**. Fixed to `green-700` (5.0:1). The red "incorrect" message
  was already passing (4.83:1) and was left alone.
- **`<html lang="en">`**: the app's actual content (button labels, hint text,
  the numbers-in-words being tested) is Danish, not English. A screen reader
  following `lang="en"` will apply English pronunciation rules to Danish
  text. Fixed to `lang="da"`.

## Beyond color: other things to keep true

- **Use real `<button>`/`<a>` elements for interactive things**, never a
  `<div onClick>`. This is why every button in `components/Button.tsx` is a
  presentational shell wrapped by a native element — see `docs/buttons.md`.
  Native elements give you keyboard activation (Enter/Space), the correct
  accessibility-tree role, and focus handling for free.
- **Don't remove the default focus outline.** Nothing in this codebase
  currently touches `outline`/`:focus` — keep it that way unless you're
  replacing it with an equally visible custom focus style.
- **Icon-only controls need an `aria-label`** describing the action, not the
  icon (e.g. the pronunciation button uses `aria-label="Hør udtale"`, not
  "speaker icon"). Any new icon-only button should follow the same pattern.
- **Don't encode meaning in color alone.** The correct/incorrect feedback
  already pairs color with text ("Rigtigt!" / "Forkert. Svaret er …"), not
  just a green/red change — keep that pairing if this feedback UI changes.

## Open questions

1. **No automated contrast or a11y check runs in CI or pre-commit.** Every
   ratio in this doc was computed by hand for this one pass. Is it worth
   adding a lint rule / script (or just a checklist reminder) so contrast
   gets checked without a human running the math each time?
2. **`transition-all` on every button shell doesn't respect
   `prefers-reduced-motion`.** The press animation (translate + shadow
   collapse) is small, but a `motion-reduce:transition-none` (or similar)
   would be the correct fix for users who've asked for less motion. Left
   alone for now since nothing in the app has this today — flagging rather
   than guessing at how aggressively to reduce it.
