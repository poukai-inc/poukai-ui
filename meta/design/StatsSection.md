# StatsSection

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`StatsSection` is the marketing-surface organism that frames a `StatList` inside a `Section` band. It owns the "by the numbers" editorial moment on landing pages — an optional heading above a horizontal row of `Stat` atoms with optional dividers. It adds no layout logic of its own beyond what `Section` already provides; its value is in composing the two primitives with the correct spacing contract and semantic heading hierarchy so individual pages don't have to.

## 2. Anatomy

```
<section>                          ← Section root (semantic section band)
  [optional heading]               ← h2 via Section's heading slot
  <div class="statList">           ← StatList root (flex row, optional dividers)
    <div class="stat"> × n         ← Stat atom: value + label
```

- **Section wrapper** — provides the outer band: horizontal padding via `--page-pad`, optional `--surface-section` background, max-width clamped to `--content-max`.
- **Heading** (optional) — eyebrow-scale or h2 label above the stat row. Passed through Section's heading slot.
- **StatList** — the horizontal grouping of `Stat` atoms with gap rhythm and optional hairline dividers between items.
- **Stat atoms** — each renders a display-numeral value (`--fs-stat`) + a muted label (`--fs-meta`).

## 3. Tokens

- `--surface-section` — optional recessed section background (`#f8f8fa` light / `#161618` dark)
- `--bg` — default section background when no fill is applied
- `--fg` — Stat value color (display numeral)
- `--fg-muted` — Stat label color; section heading muted register
- `--hairline` — divider color between Stat items when `dividers` is enabled
- `--hairline-w` — divider width (1px)
- `--font-serif` — display numeral face (Instrument Serif) for `Stat` value
- `--font-sans` — label face (Geist) for `Stat` label
- `--fs-stat` — `clamp(2.75rem, 2rem + 3vw, 4.5rem)` — Stat display numeral
- `--fs-meta` — `0.875rem` — Stat label and optional eyebrow
- `--tracking-stat` — `-0.015em` — letter-spacing on Stat numerals
- `--tracking-eyebrow` — `0.06em` — optional section eyebrow label tracking
- `--lh-meta` — `1.2` — Stat label line-height
- `--space-4` — `1rem` — gap between Stat label and value within each Stat
- `--space-8` — `2rem` — gap between Stat siblings in the row (no dividers)
- `--space-12` — `3rem` — section heading bottom margin before StatList
- `--space-16` — `4rem` — section vertical padding (top + bottom)
- `--page-pad` — horizontal section padding
- `--content-max` — `64rem` — max-width for the band content

## 4. Variants / Props

| Prop       | Type                | Default  | Rationale                                                                       |
| ---------- | ------------------- | -------- | ------------------------------------------------------------------------------- |
| `heading`  | `string` (optional) | —        | Omit on pure-data surfaces; include for editorial "By the numbers" moments      |
| `dividers` | `boolean`           | `false`  | Hairline rules between stats; use when stat count ≥ 3 for visual separation     |
| `fill`     | `boolean`           | `false`  | Applies `--surface-section` background to band; default is transparent (`--bg`) |
| `children` | `ReactNode`         | required | One or more `Stat` atoms composed inside `StatList`                             |

No `centered` prop — alignment follows the brand register (left-aligned on all surfaces consistent with Section and Footer conventions).

## 5. Interaction

Static, display-only. No hover, active, or keyboard interaction on the band itself. Individual `Stat` atoms carry no interactive affordance. If a stat value were made into a link (e.g. linking to a metrics page), that is the consumer's responsibility via composition — `StatsSection` does not enable it.

## 6. A11y

- `Section` root renders `<section>` — implicit ARIA `region` role. When `heading` is provided, the section is labelled by the heading element (`aria-labelledby` wired by Section).
- `heading` renders as `<h2>` by default via Section's heading slot — consistent with landing-page heading hierarchy (follows `<h1>` in Hero).
- Each `Stat` atom renders its value and label as adjacent block elements; no additional ARIA roles needed — the data relationship is visually clear and order-independent.
- No decorative dividers require `aria-hidden`; hairline rules are `<hr>` elements or CSS `border` — if CSS border, no ARIA annotation needed.
- Contrast: `--fg` on `--bg` = 16.29:1 (AAA); `--fg-muted` on `--bg` = 4.91:1 (AA normal text); `--fg-muted` on `--surface-section` = 4.66:1 (AA normal text).

## 7. Motion

None — static display component. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` requires no per-component work. A scroll-triggered counter animation on Stat values is explicitly out of scope for this version (see §8).

## 8. Anti-patterns

- **Not for interactive data.** Sortable, filterable, or paginated numbers belong in `DataTable` or a dashboard widget, not `StatsSection`.
- **Not for dense tabular data.** When values require labels, units, and comparison rows, use `Table` or `MetaList`.
- **Not for progress indicators.** Percentage stats that represent progress toward a goal belong in a `ProgressBar` composition, not a bare `Stat`.
- **Not a chart replacement.** Trend lines, bar charts, or time-series data require a dedicated charting primitive; `StatsSection` conveys single scalar values only.
- **Not for count-up animations.** Scroll-triggered number counters are an accessibility anti-pattern (motion, ARIA live region churn) and are excluded from this spec.
- **Not the only stat surface.** An inline stat row within a `Hero` or `Section` body uses `StatList` directly — `StatsSection` is only warranted when the stat row is its own dedicated page band.

## 9. Depends on

- `Section` — provides the band wrapper, heading slot, and `fill` surface token
- `StatList` — provides the horizontal grouping and divider rhythm
- `Stat` — the individual display-numeral + label atom
