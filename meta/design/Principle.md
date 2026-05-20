# Design spec: Principle

**Atomic layer**: molecule
**Status**: Shipped in v0.1.0
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Status

Shipped in v0.1.0. `--fs-card-title` token added and Principle migrated in v0.16.0 (consistency audit — the card-title clamp was previously duplicated inline). `--lh-body-relaxed` token added and wired in v0.17.0 (replacing inline `1.6` literal — the relaxed line-height is intentional for editorial long-form prose). `--bp-md` custom media token added and Principle's grid breakpoint migrated from a literal `768px` to `@media (--bp-md)` in v0.17.0.

---

## 2. Purpose & non-goals

`<Principle>` is the editorial principle block for the `/principles` surface. It presents a named operating principle as a horizontal rule — a numeral in the left margin (on desktop) or above the title (on mobile), followed by a serif title and a body column. The component encodes the visual pattern of editorial enumerated lists as used in long-form brand and philosophy pages.

**Differentiating Principle from FailureMode.** Both are numbered, titled, body-content blocks. The key differences:

| Concern | Principle | FailureMode |
|---|---|---|
| Marker | Roman numeral, serif italic, margin column | Arabic numeral, sans-serif weight 500, stacked above title |
| Marker position | Left margin column on desktop (5rem wide) | Stacked above title at all breakpoints |
| Marker register | Editorial, muted, companion to title | Reference label, technical, `--tracking-numeric` |
| Layout | 2-column grid on desktop (numeral + body) | Single column flex always |
| Max-width | 38rem on body column | 44rem on root |
| Surface | No card surface — open layout on page | No card surface — open layout on page |

The numeral in Principle is an editorial accompaniment — it reads alongside the title. The index in FailureMode is a reference label — it names and identifies the failure mode as an item in a catalog.

**Non-goals:**

- Principle is not a card. It has no background fill, no border, no padding box. It is open typography on the page surface.
- Principle does not enforce numeral format. The caller passes the `numeral` prop as a free-form string — `"i."`, `"ii."`, `"01."`, etc. The component renders whatever is provided.
- Principle does not compose multiple items into a list — that is the caller's responsibility. Items are placed in a container; each `<Principle>` manages its own top border rule and the last child gets a bottom border via the `:last-child` selector.
- Principle does not manage scroll-triggered reveal or any entrance animation.

---

## 3. Anatomy

- **Root element**: `<section>` — a CSS Grid container. Single column on mobile, 2-column (5rem numeral + 1fr body) on desktop (`@media (--bp-md)`). `padding: var(--space-8) 0` on mobile, `padding: var(--space-12) 0` on desktop. `border-top: var(--hairline-w) solid var(--hairline)` always. `border-bottom: var(--hairline-w) solid var(--hairline)` on `:last-child` only — so a list of Principles is bounded by rules above the first and below the last, with shared interior rules between items.
- **Numeral**: `<span className={styles.numeral} aria-hidden="true">` — Instrument Serif, italic, `--fs-body` (17–19px) on mobile, `1.25rem` on desktop (`@media (--bp-md)`), `line-height: 1.2`, `color: var(--fg-muted)`. `aria-hidden="true"` — the numeral is a visual marker; the accessible content is the title text. Screen readers encounter the title directly without the numeral prefix. `padding-top: 0.4rem` on desktop — an optical nudge to align the numeral baseline with the title cap-height in the 2-column grid.
- **Body column**: `<div className={styles.body}>` — `display: flex; flex-direction: column; gap: var(--space-4)`. `max-width: 38rem` — the same prose column cap as `--hero-max`, Pull, and FieldNote. All editorial text in the DS that is meant to be read (not scanned) caps at 38rem.
- **Title**: `<h3 className={styles.title}>` inside the body column — Instrument Serif, weight 400, `--fs-card-title` (24–32px fluid), `line-height: 1.2`, `letter-spacing: -0.005em`, `color: var(--fg)`, `margin: 0`, `padding-bottom: 0.04em`, `text-wrap: balance`.
- **Content**: `<div className={styles.content}>{children}</div>` — Geist sans-serif, `--fs-body` (17–19px), `line-height: var(--lh-body-relaxed)` (1.6), `color: var(--fg)`. The relaxed line-height (1.6 vs. the canonical 1.55) is intentional — principle body copy is long-form prose meant to be read carefully. The extra line-height eases the reading pace. First and last child margins are zeroed so the `gap: var(--space-4)` on the body column owns all vertical spacing between title and content.

---

## 4. Props API

```tsx
interface PrincipleProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  numeral: string;      // required — e.g. "i.", "ii.", "iii."
  title: ReactNode;     // required — the principle name
  children: ReactNode;  // required — body copy (paragraphs, lists)
}
```

**`numeral`** (string, required): The marker string. Convention is lowercase Roman numerals with a period — `"i."`, `"ii."`, `"iii."`. The prop is typed as `string` (not a union or number) so callers can use any format (`"01."`, `"§ 1"`, `"A"`) on a different surface without requiring a prop or component change. The DS does not format, zero-pad, or convert the value — it renders as provided.

**`title`** (ReactNode, required): The principle name — e.g. `"Ship the smallest real thing."` `ReactNode` rather than `string` to allow inline `<em>` for editorial emphasis. `Omit<ComponentPropsWithoutRef<"section">, "title">` removes the HTML `title` attribute from the spread to avoid a type conflict.

**`children`** (ReactNode, required): The body copy. In practice: one or more `<p>` elements, occasionally a `<ul>`. Children render inside `<div className={styles.content}>` — block-level children are expected and appropriate. The content div zeroes first/last child margins so the parent `gap` controls rhythm.

**Standard HTML spread** (`ComponentPropsWithoutRef<"section">`, `"title"` omitted): `id`, `data-*`, `className`, `style`, event handlers forwarded to the root `<section>`. `className` merges via `clsx`.

---

## 5. Token contract

| Token               | Value                                       | Role                                                               |
| ------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| `--font-serif`      | Instrument Serif                            | Numeral typeface (italic); title typeface                          |
| `--font-sans`       | Geist stack                                 | Content body typeface                                              |
| `--fs-card-title`   | `clamp(1.5rem, 1.15rem + 1.2vw, 2rem)`     | Title font-size (24–32px)                                          |
| `--fs-body`         | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Numeral font-size (mobile); content font-size                      |
| `--fg`              | `#1D1D1F`                                   | Title color; content color                                         |
| `--fg-muted`        | `#6E6E73`                                   | Numeral color                                                      |
| `--hairline`        | `#D2D2D7`                                   | Top border rule; last-child bottom rule                            |
| `--hairline-w`      | `1px`                                       | Border width                                                       |
| `--lh-body-relaxed` | `1.6`                                       | Content line-height — intentional relaxed value for prose reading  |
| `--space-3`         | `0.75rem` (12px)                            | Root grid column gap on mobile (between numeral and body)          |
| `--space-4`         | `1rem` (16px)                               | Body column flex gap (title → content); content paragraph rhythm   |
| `--space-8`         | `2rem` (32px)                               | Root padding on mobile                                             |
| `--space-12`        | `3rem` (48px)                               | Root padding on desktop                                            |
| `--bp-md`           | `768px`                                     | Breakpoint at which layout shifts to 2-column grid                 |

**Desktop numeral size (`1.25rem`)**: not a token. The desktop numeral size is a fixed `1.25rem` — an inline value in `Principle.module.css`. It was not promoted to a token because it is a component-local optical calibration, not a system-wide typography scale decision.

---

## 6. States & motion

**Static.** Principle has no interactive states and no motion. It is an editorial display block.

No hover, focus, active, or disabled states on the component. Any scroll-triggered entrance animation is the caller's concern.

---

## 7. Responsive behavior

| Viewport | Layout                                                                         |
| -------- | ------------------------------------------------------------------------------ |
| < 768px  | Single column: numeral above title, `gap: var(--space-3)`, `padding: var(--space-8) 0` |
| ≥ 768px  | 2-column grid: `5rem` numeral column + `1fr` body column, `gap: var(--space-8)`, `padding: var(--space-12) 0` |

On mobile the numeral appears above the title — it reads as an inline prefix to the block. On desktop the numeral occupies a fixed 5rem left margin column, sitting beside the body column. The numeral receives `padding-top: 0.4rem` on desktop to optically align its baseline with the title's cap-height.

The `body` div has `max-width: 38rem` at all breakpoints — the prose measure is capped regardless of the parent container width.

---

## 8. A11y

- Root element is `<section>` — a sectioning content element. Each principle is a standalone section of the page. `<section>` is appropriate when the content has a heading (the `<h3>` title provides one).
- Numeral is `aria-hidden="true"`. Screen readers announce the title directly: `"heading level 3, Ship the smallest real thing."` The Roman numeral is a visual ordering cue, not semantic content — the title is self-explanatory without it.
- Title is `<h3>`. On the `/principles` page, the page `<h1>` is the page title. Each principle is a subsection — `<h3>` is correct assuming a `<Section>` wrapper provides an intermediate `<h2>`. Same caveat as RoleCard: callers in different heading hierarchies may need a polymorphic heading prop (see §10).
- Content is inside a `<div>` (not a landmark) — children `<p>` elements are phrasing content. No landmark pollution.
- Contrast:
  - Title (`--fg` on `--bg`): **16.29:1** (AAA)
  - Content (`--fg` on `--bg`): **16.29:1** (AAA)
  - Numeral (`--fg-muted` on `--bg`): **4.91:1** (AA normal at `--fs-body` 17px ✓)
- No keyboard interaction. Principle is not interactive.

---

## 9. Worked examples

### (a) Single principle

```jsx
import { Principle } from "@poukai-inc/ui";

<Principle numeral="i." title="Ship the smallest real thing.">
  <p>
    Pilots fail because they're rehearsals. Production is the only proving ground — find the
    smallest piece of the workflow that can run for real, and run it for real.
  </p>
</Principle>
```

### (b) Three-item principle list — `/principles` page recipe

```jsx
import { Principle } from "@poukai-inc/ui";

<div>
  <Principle numeral="i." title="Ship the smallest real thing.">
    <p>Pilots fail because they're rehearsals. Production is the only proving ground.</p>
  </Principle>
  <Principle numeral="ii." title="Senior, end-to-end, no handoff theatre.">
    <p>Every engagement is one or two senior engineers from intake through cutover.</p>
  </Principle>
  <Principle numeral="iii." title="Evaluation is part of the system.">
    <p>If you can't measure the quality of an AI output, you can't ship it.</p>
  </Principle>
</div>
```

The first item gets a top border via its own rule. The last item (`numeral="iii."`) also gets a bottom border via `:last-child`. Interior borders between items are shared — each item's top border is the previous item's visual bottom rule.

### (c) Multi-paragraph body

```jsx
<Principle numeral="i." title="Ship the smallest real thing.">
  <p>Pilots fail because they're rehearsals. Production is the only proving ground.</p>
  <p>
    Find the smallest piece of the workflow that can run for real, and run it for real. Then expand
    from that foothold.
  </p>
</Principle>
```

The `gap: var(--space-4)` on the body column controls spacing between the title and the content div. The content div's first/last child margins are zeroed — `<p>` default margins are suppressed so the `gap` owns all rhythm.

---

## 10. Open questions

One open question: **heading level for `title`.** Same issue as RoleCard — `<h3>` is hardcoded. A `titleAs` prop would allow callers to use Principle in heading hierarchies other than the `/principles` page structure. Not a current bug but worth addressing as the DS expands to new surfaces.
