# Button architecture

This app's buttons follow the composition pattern from
[timomeh.de: "A better button component with composition"](https://timomeh.de/posts/a-better-button-component-with-composition).
This doc records how that pattern is applied here, the components it produced,
and the questions I couldn't resolve on my own.

## The core pattern

A "Button" component in this codebase is **not** an interactive element. It's a
presentational `<div>` shell that only knows how to look like a button. The
real `<button>` (or `<a>`) is written at the call site and wraps the shell:

```tsx
<button type="button" onClick={handleTap} disabled={!isPending} className="group">
  <TileButton>tre</TileButton>
</button>
```

This split exists so that:

- **Semantics stay with the native element.** `disabled`, `onClick`, keyboard
  activation, `aria-*` — all of that is just normal `<button>` behavior. The
  shell component never re-implements or proxies it.
- **Styling has no variant-prop surface to grow.** There's no
  `<Button variant="primary" size="lg">`. Each visual style is its own named
  component (`PrimaryButton`, `TileButton`, `ChipButton`, ...), so adding a new
  look means adding a new component, not widening an enum that every call site
  has to reason about.
- **State flows down via CSS, not props.** The shell reacts to its parent's
  state using Tailwind's `in-*` and `group-*` variants:
  - `in-disabled:opacity-40` — styles the shell when the ancestor `<button>`
    is `disabled`, no `group` class needed for this one.
  - `group-active:translate-y-[…]` — styles the shell while the ancestor
    `<button>` is `:active` (pressed). This **does** need `className="group"`
    on the wrapping `<button>`, which is why every call site sets it.

If a button doesn't visually react on press, the first thing to check is
whether its wrapper is missing `className="group"` — this already happened
once (see `git log` on `app/number-game.tsx`, the "Næste" button).

## The comic/sticker look

The visual language is deliberately closer to Duolingo's chunky, flat,
high-contrast buttons than to soft "material" elevation. Every shell in
`components/Button.tsx` shares one recipe, built from a single "edge" color
per component (per theme):

1. A uniform `border-2` all the way around, in the edge color — a crisp,
   visible ink outline, not a near-invisible hairline.
2. A thicker `border-b-4` in the *same* edge color — the chunky bottom "lip"
   that reads as depth.
3. One flat, non-blurred `box-shadow` (`0_4px_0_0_<edge-color>`) continuing
   that lip below the shape. No blur, no translucent halo layer — comic
   shading is flat and hard-edged, not soft.
4. Generous `rounded-2xl` corners (`rounded-full` for `IconButton`, which is
   circular already) and `font-bold` labels — `PrimaryButton` additionally
   uses `uppercase tracking-wide` for its "SVAR"/"NÆSTE" chrome labels (word
   tiles/chips keep normal case since that text is the actual Danish
   vocabulary being tested, not decorative chrome).
5. On `group-active`: the shell drops `translate-y-[6px]`, the bottom border
   shrinks from `border-b-4` to `border-b-2` (matching the constant width of
   the other three sides, so the shape reads as evenly bordered while
   pressed), and the box-shadow collapses to `0px` — settling flush into the
   surface, then springing back on release.

Using one edge color for both the outline and the lip (instead of two
different shades) keeps each component's palette to a single decision: pick
an edge color per fill, per theme, and border/shadow all derive from it.

## Component inventory

| Component | Used for | Fill | Notes |
|---|---|---|---|
| `PrimaryButton` | "Svar" / "Næste" | blue-500 | Restyled to the comic look alongside the rest — no longer the original soft-shadow version. |
| `TileButton` | word-palette tiles (`en`, `to`, `tyve`, …) | white / zinc-900 | |
| `ConnectorTileButton` | the `og` palette tile | amber-50 / amber-400/10 | Same shape as `TileButton`, amber accent to flag it as a connector rather than a number word. |
| `ChipButton` | tapped tokens in the constructed-answer tray | zinc-900 / zinc-100 | Tapping a chip removes it — same shell, different wrapping `onClick`. |
| `ConnectorChipButton` | the `og` chip in the tray | amber-500 | |
| `IconButton` | the pronunciation (speaker) control | white / zinc-900 | Circular; only component sized by a fixed `h-10 w-10` instead of padding. |

Call sites choose between a base component and its `Connector*` counterpart
with a plain conditional (`token === "og" ? <ConnectorTileButton>… : <TileButton>…`),
not a prop — keeping with "separate components over variant enums."

## Decisions made without asking

- **Scope**: extended the 3D treatment to the word tiles, the answer chips,
  and the pronunciation icon button (not just the primary CTA), per your
  answer when I asked.
- **Structure**: one component per visual style rather than a shared
  component with a `tone` prop, per your answer when I asked.
- **`og` accent**: kept the amber accent color for both the tile and chip
  variants of the connector token, per your answer when I asked.
- Colors for the non-`og` variants are hardcoded `zinc-*`/hex values rather
  than reusing the `--background`/`--foreground` CSS variables the old
  `chipClassName` used — box-shadow arbitrary values need concrete colors to
  compute a "one shade darker" edge, and I couldn't derive that from a CSS
  variable without also hardcoding a shade. Flagged below in case that
  tradeoff should go the other way.

## Open questions

I didn't want to guess silently on these — flagging them here rather than
picking an answer:

1. **Shadow/edge colors are literal hex values duplicated across six
   components** (each with a light and dark variant). If this palette needs
   to change later (e.g. a rebrand, or swapping zinc for slate), it means
   editing every component. Is that acceptable, or would you rather these
   depth/color values live as reusable design tokens (e.g. Tailwind theme
   values or CSS custom properties) that the components reference?
2. **The press-depth numbers (`translate-y-[6px]`, `4px` shadow offset,
   `border-2`/`border-b-4`) were chosen by eye** to read as a Duolingo-style
   bevel at this component's scale — I didn't find an existing spec to match
   more precisely. Let me know if the line weight or press distance should
   change.
3. **Only the word tiles/chips get color (neutral + amber); nothing is as
   colorful as Duolingo's broader UI** (their chrome uses green, blue, red,
   purple throughout). I kept the palette narrow since this app doesn't have
   other semantic colors to assign yet (correct/incorrect currently only use
   text color, not button color). Worth introducing more color elsewhere
   (e.g. a green "correct" state on the chips), or should color stay reserved
   for the `og` connector as the one accent?
4. **`IconButton` reuses the same white/zinc-900 surface as `TileButton`**
   rather than getting its own visual identity. It's currently the only
   circular member of the family. Should it stay visually distinct from
   tiles (e.g. no fill, transparent by default), or is sharing the "neutral
   surface" language across tiles and the icon button correct?
5. **No component currently supports the "looks disabled but is still
   clickable" case** the source article describes (an explicit `disabled`
   prop on the shell, independent of the wrapping `<button>`'s `disabled`
   attribute — useful for showing a message on click instead of blocking
   it). Nothing in this app needs that today. Worth adding preemptively, or
   add it only when a real use case shows up?
