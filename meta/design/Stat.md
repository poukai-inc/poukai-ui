# Design spec: Stat

**Atomic layer**: atom
**Status**: Shipped in v0.1.0
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Status

Shipped in v0.1.0. Color inheritance fixed in v0.17.0 (the `caption` and `source` slots were previously hardcoded to `--fg-muted`; replaced with `color-mix(in srgb, currentColor 65%, transparent)` so inverted placements work without a prop). `--tracking-numeric` token added and wired in v0.17.0 (consistency audit — the `tracking-numeric` value on `source` was previously a hardcoded literal).

---

## 2. Purpose & non-goals

`<Stat>` is the canonical editorial statistic primitive. It renders a display-scale numeral (value), a short explanatory caption beneath it, and an optional provenance line (source) in the micro/uppercase register. The component is purely typographic — no chart, no sparkline, no animation, no progress bar. It is the visual equivalent of a pull-quote but for quantitative claims.

**Why a dedicated atom and not prose numerals.** Display numerals require Instrument Serif at `--fs-stat` (44–72px) or `--fs-stat-large` (56–96px) with negative tracking (`--tracking-stat: -0.015em`), optical bottom-padding for descenders, and tabular figure alignment (`font-variant-numeric: tabular-nums`) so adjacent stats line up vertically in a grid. These rules cannot be sensibly encoded in a utility class or an HTML convention. Stat encapsulates all of them.

**Differentiating Stat from Eyebrow.** `Eyebrow` is a short uppercase meta-label — typically 1–3 words, `--fs-meta` (14px), muted, above a section or card title. Stat is a display-scale numeral up to 96px, paired with a caption. They operate at opposite ends of the typographic scale. Stat is never a label; Eyebrow is never quantitative.

**Differentiating Stat from inline numerals.** Inline numerals in body copy are `--font-sans` (Geist), `--fs-body` (17–19px), no special tracking or alignment. Stat is `--font-serif` (Instrument Serif), `--fs-stat` / `--fs-stat-large` (44–96px), negative tracking, optical padding. The visual difference is immediately apparent: Stat is the number you stop at; an inline numeral is the number you read through.

**Non-goals:**

- Stat has no chart, bar, or sparkline. Quantitative visualization is outside the DS scope.
- Stat does not animate the count up from zero. Any entrance animation is the caller's concern (scroll-triggered, etc.).
- Stat does not enforce a unit or format on the `value` prop — the caller passes the fully-formatted string (e.g. `"85%"`, `"$300B"`, `"3.2×"`).
- Stat does not own its layout context. The caller arranges multiple Stats in a grid or flex row. Stat is a single vertical column.

---

## 3. Anatomy

- **Root element**: `<div>` — `display: flex; flex-direction: column; gap: var(--space-3)`. The root applies `font-variant-numeric: tabular-nums` globally so both the value and any digit-containing caption/source align consistently.
- **Value**: `<span className={styles.value}>` — Instrument Serif, weight 400, `--fs-stat` or `--fs-stat-large` (driven by the `size` prop), `line-height: 1`, `letter-spacing: var(--tracking-stat)` (-0.015em), `padding-bottom: 0.04em` (optical correction for serif descenders on glyphs like `$`, `%`, `×`).
- **Caption**: `<span className={styles.caption}>` — Geist sans-serif, `--fs-body` (17–19px fluid), `line-height: 1.45`, `max-width: 22rem`, `text-wrap: pretty`. Color via `color-mix(in srgb, currentColor 65%, transparent)` — approximately 65% opacity of the inherited foreground color.
- **Source** (optional): `<span className={styles.source}>` — rendered only when the `source` prop is provided. Geist Mono, `--fs-micro` (12px), `letter-spacing: var(--tracking-micro)` (0.04em), `text-transform: uppercase`, `margin-top: var(--space-1)` (4px — tighter than the root `gap` to visually group source with caption). Same `color-mix` muting as caption.

### Color inheritance model

The root carries `color: var(--fg)` and `font-family: var(--font-sans)`. Caption and source use `color-mix(in srgb, currentColor 65%, transparent)` — this computes a 65% blend of whatever `color` is in scope at that point. On a `--bg` page this resolves to approximately `--fg-muted`. On an inverted band where the parent sets `color: var(--bg)`, it resolves to approximately 65% of `--bg` — still legible against the dark background. This approach means inversion works without a prop, without a CSS variable override, and without a media query.

---

## 4. Props API

```tsx
type StatAlign = "start" | "end";
type StatSize = "md" | "lg";

interface StatProps extends ComponentPropsWithoutRef<"div"> {
  value: ReactNode;   // required — the numeral string
  caption: ReactNode; // required — explanatory text
  source?: ReactNode; // optional — provenance / attribution
  align?: StatAlign;  // default "start"
  size?: StatSize;    // default "md"
}
```

**`value`** (ReactNode, required): The display numeral — e.g. `"85%"`, `"$300B"`, `"3.2×"`. `ReactNode` rather than `string` to allow inline `<em>` or `<sup>` for footnote references, though plain strings are idiomatic. The component does not format or transform the value — the caller passes the ready-to-display string.

**`caption`** (ReactNode, required): A short explanatory phrase beneath the numeral — e.g. `"of AI pilots never reach production."` `max-width: 22rem` prevents very long captions from running full-width in a wide grid cell. `text-wrap: pretty` avoids orphan words on the last line.

**`source`** (ReactNode, optional): A provenance line — e.g. `"MIT Sloan, 2025"`. When omitted, no source element is rendered. The mono uppercase treatment places this firmly in the citation/meta register, distinct from caption.

**`align`** (`"start" | "end"`, default `"start"`): Horizontal alignment of the flex column.

- `"start"` — `align-items: flex-start; text-align: left`. The natural reading direction. Used for the left stat in a two-column pair.
- `"end"` — `align-items: flex-end; text-align: right`. Used for the right stat in a two-column pair where the value is visually anchored to the right edge (see §9 worked example b). The caption also gets `margin-left: auto` so it does not stretch full-width in a right-aligned flex column.

**`size`** (`"md" | "lg"`, default `"md"`): Controls the value font-size.

- `"md"` — `--fs-stat: clamp(2.75rem, 2rem + 3vw, 4.5rem)` (44–72px). The standard display rung for stats in a two-column pair.
- `"lg"` — `--fs-stat-large: clamp(3.5rem, 2.25rem + 5vw, 6rem)` (56–96px). A larger rung for a solo hero stat or a high-emphasis moment.

**Standard HTML spread** (`ComponentPropsWithoutRef<"div">`): `id`, `data-*`, `className`, `style`, event handlers forwarded to the root `<div>`. `className` merges via `clsx`.

---

## 5. Token contract

| Token              | Value                                       | Role                                                                     |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------------------ |
| `--font-serif`     | Instrument Serif                            | Value numeral typeface                                                   |
| `--font-sans`      | Geist stack                                 | Root font-family; caption typeface                                       |
| `--font-mono`      | Geist Mono stack                            | Source typeface                                                          |
| `--fs-stat`        | `clamp(2.75rem, 2rem + 3vw, 4.5rem)`       | Value size — `size="md"` (44–72px)                                       |
| `--fs-stat-large`  | `clamp(3.5rem, 2.25rem + 5vw, 6rem)`       | Value size — `size="lg"` (56–96px)                                       |
| `--fs-body`        | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Caption font-size (17–19px)                                              |
| `--fs-micro`       | `0.75rem` (12px)                            | Source font-size                                                         |
| `--tracking-stat`  | `-0.015em`                                  | Value letter-spacing — tightens large serif numerals optically           |
| `--tracking-micro` | `0.04em`                                    | Source letter-spacing — opens out the uppercase micro label              |
| `--fg`             | `#1D1D1F`                                   | Root `color` — cascades into value and feeds the `color-mix` computation |
| `--space-3`        | `0.75rem` (12px)                            | Column gap between value, caption, source                                |
| `--space-1`        | `0.25rem` (4px)                             | `margin-top` on source — tighter than gap to group source with caption   |

**`color-mix` note.** Caption and source use `color-mix(in srgb, currentColor 65%, transparent)` — not a named token. This is an inline computed value that intentionally varies with the inherited `currentColor`. It resolves to approximately `--fg-muted` on a light background and to approximately 65% white on an inverted dark surface. This technique is not tokenizable because it is contextual, not fixed.

---

## 6. States & motion

**Static.** Stat has no interactive states. It is a display element.

No hover, focus, active, or disabled states are defined. No animation on the component itself. Any count-up or scroll-triggered entrance animation is the caller's responsibility.

**Reduced motion**: Not applicable. Stat has no animation.

---

## 7. Responsive behavior

The `value` font-size is fluid via CSS `clamp()` — it scales continuously between the stated min and max based on the viewport width. No breakpoint is hard-coded inside Stat. The caller's grid layout may change at `--bp-md` (768px), but Stat itself is agnostic to that.

The canonical two-column paired layout (see §9 example b) uses `gridTemplateColumns: "1fr 1fr"` at the caller level. On narrow viewports the caller may collapse to a single column — Stat renders identically in either context.

---

## 8. A11y

- Root element is `<div>` — a non-semantic block container. No landmark role needed; Stat is content within a section, not a section itself.
- `value`, `caption`, and `source` are all `<span>` elements — inline phrasing content. Screen readers announce them in DOM order: value, then caption, then source. This is the correct reading order.
- `font-variant-numeric: tabular-nums` is a visual-only property — no accessibility impact.
- The `color-mix` muting on caption and source: caption at ~65% of `--fg` on `--bg` = approximately `#6E6E73` on `#FBFBFD` = **4.91:1** (AA normal at `--fs-body` 17px). Source at ~65% of `--fg` on `--bg` at `--fs-micro` (12px) = approximately 4.91:1. At 12px, normal text threshold applies (4.5:1) — passes.
- No keyboard interaction. Stat is not focusable.

---

## 9. Worked examples

### (a) Single stat — default

```jsx
import { Stat } from "@poukai-inc/ui";

<Stat
  value="85%"
  caption="of AI pilots never reach production."
  source="MIT Sloan, 2025"
/>
```

### (b) Two-column pair — canonical `/why-ai` layout

```jsx
import { Stat } from "@poukai-inc/ui";

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "var(--space-12)",
  }}
>
  <Stat
    value="85%"
    caption="of AI pilots never reach production."
    source="MIT Sloan, 2025"
  />
  <Stat
    value="$300B"
    caption="annual spend on initiatives that stall at proof-of-concept."
    source="IDC, 2025"
    align="end"
  />
</div>
```

The left stat is `align="start"` (default); the right stat is `align="end"`. The values anchor to their respective edges, giving the pair a balanced, mirror-like composition.

### (c) Large solo stat

```jsx
<Stat
  size="lg"
  value="3.2×"
  caption="faster delivery once a working dev loop replaces handoff theatre."
/>
```

`size="lg"` bumps the numeral to `--fs-stat-large` (56–96px). No source — the claim stands alone.

### (d) Inverted placement (dark editorial band)

```jsx
<div style={{ background: "var(--fg)", color: "var(--bg)", padding: "var(--space-12)" }}>
  <Stat
    value="85%"
    caption="of AI pilots never reach production."
    source="MIT Sloan, 2025"
  />
</div>
```

No prop change on Stat. The parent sets `color: var(--bg)` — Stat's root inherits this, the value renders in near-white, and the caption/source compute via `color-mix` as ~65% near-white on dark. No additional CSS override needed.

---

## 10. Open questions

None. The component is stable. The `color-mix` approach for muted caption/source color was the correct fix over the original hardcoded `--fg-muted` token — it enables inversion without props.
