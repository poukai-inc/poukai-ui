# Design spec: FieldNote

**Atomic layer**: molecule
**Status**: Draft
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<FieldNote>` is the canonical technical-aside primitive for long-form prose surfaces. It is a short, parenthetical callout — a sentence or two — that sits inline with body copy and provides a factual clarification, caveat, or data footnote without interrupting the reading flow. It lives entirely in the body register: same font-size as surrounding prose, a quiet left hairline rule, and optional muted label.

Canonical use case: "Note: in 2024 we ran the same prompt across three model families and saw consistent degradation after context exceeded 16k tokens." That sentence is informational, parenthetical, specific — it belongs to the text but is not the text. FieldNote holds it at a slight visual offset so the reader can skip it or absorb it depending on their reading mode.

### Why FieldNote is distinct from its neighbors

**FieldNote vs. Pull.** Pull extracts a passage for disproportionate visual weight — it is the accent, the emphasis, the slow-down signal. It uses `--fs-pull` (20–26px fluid), Instrument Serif italic, and a 3px left rule. Pull is loud relative to the body column. FieldNote is quiet: `--fs-body` (17–19px), Geist roman, a 1px left rule. Pull is the editorial exclamation; FieldNote is the parenthetical footnote.

**FieldNote vs. FailureMode.** FailureMode is a structured block — a `<section>` with a large zero-padded index, a `--fs-card-title` heading, and a body slot that accepts paragraphs, lists, and nested callouts. It has significant vertical mass and is never inline with continuous prose. FieldNote has no heading, no index, no structural wrapper — it is a single text block with an optional short label. FieldNote is a sentence-level device; FailureMode is a section-level device.

**FieldNote vs. Section.** Section is page scaffolding: it owns block padding, eyebrow/title/lede slots, the section-to-section rhythm. FieldNote has no scaffolding role — it is content, not structure.

### Non-goals (explicit exclusions)

- FieldNote is not a Card. It has no border, no background fill, no shadow, no padding on all four sides.
- FieldNote is not a Quote or Pull. It does not attribute a source person; it does not carry Instrument Serif italic; it is not a typographic accent.
- FieldNote is not a FailureMode. It has no index, no title, no slot-heavy composition.
- FieldNote does not accept block-level children. No `<h2>`, `<ul>`, `<table>`, or nested structured content. It is plain text with optional inline marks (`<strong>`, `<em>`, `<a>`).
- FieldNote is not an alert or status message. It is not colored red/yellow for urgency. It is never decorative-loud.

---

## 2. Anatomy

### Visual treatment decision: 1px left hairline rule + inset

Two candidate treatments were evaluated:

**Option A — eyebrow label only, no rule.** A small uppercase `"NOTE"` label above or inline with the text, no left border, `--fg-muted` text. This reads as metadata annotation — clean, minimal. Rejected: without a left rule, FieldNote is visually indistinguishable from a plain `<p class="lede">`. The eyebrow alone does not give the aside enough spatial separation from surrounding prose; readers who skip eyebrows (a well-documented scanning pattern) lose all signal that this is a parenthetical.

**Option B — 1px left hairline rule + inset (chosen).** A `1px` left border in `--hairline` with `padding-inline-start: var(--space-3)` (12px) between the rule and the text. Optionally, a small muted label above the body text. This is chosen for the following reasons:

1. The 1px rule is the minimum viable spatial signal. It differentiates FieldNote from a plain paragraph without adding decorative mass. Compared to Pull's 3px rule, the 1px rule reads as "quiet aside," not "editorial accent" — the weight difference is load-bearing.
2. `--space-3` (12px) inset — tighter than Pull's `--space-4` (16px) — reinforces the smaller, quieter character of this component. FieldNote takes up less horizontal oxygen than Pull.
3. The optional label (e.g. "Note", "Caveat", "Aside") sits above the body text at `--fs-meta` (14px), `--fg-muted`, uppercase via `text-transform: uppercase`, `--tracking-eyebrow` letter-spacing. It is the same visual register as an Eyebrow atom — lightweight, factual. It is never bold or colored.
4. This treatment is coherent with the Apple-light palette register. Hairline rules and muted labels are the system's two tools for creating low-friction visual hierarchy without color or weight intervention. Using both in their quietest form is the correct choice for a component that must sit unobtrusively inside prose.

**Option C — both rule AND eyebrow, always visible.** Rejected: when the label is absent, the rule alone is sufficient. When the label is present, requiring the rule adds redundant hierarchy. Making both required would over-structure a component whose entire purpose is to be lightweight.

**Decision: 1px left hairline rule is always present. Optional label above the body text, rendered only when the `label` prop is provided.**

### Named anatomy parts

- **Root element**: `<aside>` (see §8 for rationale).
- **Left rule**: `border-inline-start: var(--hairline-w) solid var(--hairline)`. Always rendered. `--hairline-w` is 1px — matching dividers and table rules. Not 3px (that is Pull's editorial accent weight).
- **Label** (optional): a `<p>` rendered above the body text when the `label` prop is provided. Typography: `--fs-meta` (14px), `--fg-muted`, `text-transform: uppercase`, `--tracking-eyebrow` (0.06em) letter-spacing, `--lh-meta` (1.2) line-height. The label is not an `<Eyebrow>` atom — `<Eyebrow>` accepts a numeral slot and has its own layout complexity. FieldNote's label is a single-line `<p>` that borrows Eyebrow's typographic register without the atom's compositional overhead. If a future version requires the full Eyebrow atom here, that is a spec revision, not a bug fix.
- **Body slot**: `children`. Required. Accepts `ReactNode` to support inline `<strong>`, `<em>`, and `<a>`. The body renders as a `<p>` element. No block-level children. Typography: `--fs-body`, `--fg`, line-height `1.55` (the global body value — see §4 for the line-height choice).

---

## 3. Tokens used

No new tokens are introduced. FieldNote is constructed entirely from the existing vocabulary.

| Token                | Value                                       | Role                                                        |
| -------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| `--hairline-w`       | `1px`                                       | Left rule width                                             |
| `--hairline`         | `#D2D2D7`                                   | Left rule color                                             |
| `--space-3`          | `0.75rem` (12px)                            | `padding-inline-start`: gap from rule to body text          |
| `--space-1`          | `0.25rem` (4px)                             | Gap: label → body text                                      |
| `--space-6`          | `1.5rem` (24px)                             | `margin-block`: breathing room above and below FieldNote    |
| `--fs-body`          | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Body text font size (17–19px)                               |
| `--fs-meta`          | `0.875rem` (14px)                           | Label font size                                             |
| `--fg`               | `#1D1D1F`                                   | Body text color                                             |
| `--fg-muted`         | `#6E6E73`                                   | Label color                                                 |
| `--font-sans`        | Geist stack                                 | All text in FieldNote                                       |
| `--tracking-eyebrow` | `0.06em`                                    | Label letter-spacing                                        |
| `--lh-meta`          | `1.2`                                       | Label line-height                                           |
| `--accent`           | `#0071E3`                                   | Focus ring on inline `<a>` (inherited from global `a` rule) |
| `--radius-1`         | `2px`                                       | Focus ring border-radius (inherited)                        |

### New tokens required

None. The token vocabulary is sufficient. The deliberate choice here:

- **Font size**: `--fs-body`. FieldNote stays in the body register. Using `--fs-meta` (14px) for the body would make it feel like a caption, which is too small for a full sentence that the reader may need to parse carefully. Using `--fs-pull` (20–26px) would defeat the entire purpose — FieldNote must not grow above the prose column. `--fs-body` is the correct and only choice.
- **Color**: `--fg` for the body (same as body prose — FieldNote is not muted content; it is real content placed parenthetically). `--fg-muted` for the label (it is purely orientational, not content).
- **Line-height**: `1.55`. The BACKLOG documents a drift between `1.6` (Principle/FailureMode) and `1.55` (RoleCard/global body). FieldNote uses `1.55` — the global body value set in `tokens.css` on the `body` element. FieldNote is a body-register component; it should inherit the global body line-height, not the component-local drift values. This is an inline value in the CSS module (not a new `--lh-body` token), consistent with how Pull specifies its own `1.45` inline. When the BACKLOG item to tokenize `--lh-body` is addressed, FieldNote is a migration target.

### Token reasoning: `--space-6` for margin-block

Pull uses `--space-8` (32px) for `margin-block`. FieldNote is a smaller, quieter component — it warrants less vertical separation. `--space-6` (24px) is the step below, giving FieldNote breathing room without pulling it as far from the prose as Pull does. This difference reinforces the visual hierarchy: Pull is a major inline pause; FieldNote is a minor one.

### Token reasoning: `--space-3` for padding-inline-start

`--space-3` (12px) is deliberately tighter than Pull's `--space-4` (16px). The smaller inset creates a narrower visual column for FieldNote, reinforcing its character as a subsidiary element. 12px is still enough to clearly separate the rule from the text at body scale.

### Token reasoning: `--space-1` for label-to-body gap

4px between the label and the body text. This is a tight coupling — the label and body read as a single visual unit, not as a header above a section. `--space-2` (8px) was considered and rejected: at 8px the label begins to feel like a separate heading, which FieldNote explicitly is not.

---

## 4. Layout & rhythm

### Container

| Property               | Value                                     | Notes                                                                                                                                                 |
| ---------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `margin-block`         | `var(--space-6)` (24px) top + bottom      | Breathing room from surrounding paragraphs. Smaller than Pull's `--space-8` (32px) — intentional.                                                     |
| `padding-inline-start` | `var(--space-3)` (12px)                   | Gap from left rule to text content.                                                                                                                   |
| `border-inline-start`  | `var(--hairline-w) solid var(--hairline)` | 1px rule in `--hairline`. The rule is always present regardless of `label` presence.                                                                  |
| `max-width`            | `var(--hero-max)` (38rem / 608px)         | Matches the prose column cap used by Pull, Hero, and Section header blocks. FieldNote must not exceed the measure of the body text it is embedded in. |

`border-inline-start` and `padding-inline-start` are CSS logical properties — RTL-correct by default. No additional RTL work needed.

### Label element (when present)

| Property         | Value                              | Notes                           |
| ---------------- | ---------------------------------- | ------------------------------- |
| `font-size`      | `var(--fs-meta)` (14px)            |                                 |
| `font-family`    | `var(--font-sans)`                 | Geist — inherited from root     |
| `color`          | `var(--fg-muted)`                  |                                 |
| `text-transform` | `uppercase`                        | Same register as Eyebrow atom   |
| `letter-spacing` | `var(--tracking-eyebrow)` (0.06em) |                                 |
| `line-height`    | `var(--lh-meta)` (1.2)             | Tight — label is a single line  |
| `margin`         | `0 0 var(--space-1)`               | 4px below label, none elsewhere |

### Body element

| Property      | Value              | Notes                                                                                                                                                                                     |
| ------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `font-size`   | `var(--fs-body)`   | 17–19px fluid — inherits from the global `body` rule in `tokens.css`; no override needed unless the component is rendered outside a `body` context                                        |
| `font-family` | `var(--font-sans)` | Geist. FieldNote is never Instrument Serif — that is Pull's editorial register. FieldNote is factual, operator-grade.                                                                     |
| `font-style`  | `normal`           | Never italic. Italic carries editorial or citation connotation; FieldNote is neutral.                                                                                                     |
| `line-height` | `1.55`             | Global body value. Inline value, not a new token — see §3 for rationale. Migration target when `--lh-body` is tokenized.                                                                  |
| `color`       | `var(--fg)`        | Full-weight primary text color. FieldNote is real content, not a caption.                                                                                                                 |
| `margin`      | `0`                | No default paragraph margin — the container's `margin-block` and `padding-inline-start` own all spacing. The global `p { margin: 0 0 var(--space-4) }` is reset inside FieldNote's scope. |

---

## 5. States

FieldNote itself has no interactive states — it is a static typography component. The only interactivity within it is an optional inline `<a>` in the body text.

### Inline link within body

Inline links inside `children` inherit the global `<a>` rule from `tokens.css`: hairline underline at rest (the two-layer gradient system — see brand.md 2026-05-19 decision), accent underline grows on hover, `--dur-mid` transition via `--easing-link`. This is the correct treatment for inline body-copy links and requires no override.

**Focus-visible on inline link**: inherits the global `a:focus-visible` rule — `outline: 2px solid var(--accent)`, `outline-offset: 4px`, `border-radius: var(--radius-1)`. No override needed. The engineer must not suppress this rule inside FieldNote's CSS module scope.

**`.muted-link` is not used here.** `.muted-link` is the treatment for chrome links (nav, footer, SiteShell) — it suppresses the underline and uses a plain `color` transition. A link inside FieldNote's body is a body-copy inline link, not a chrome link. It uses the full two-layer underline treatment. This distinction is consistent with how `EmailLink` (a body-copy link) works — it inherits the global `<a>` rule rather than `.muted-link`.

---

## 6. Motion

None. FieldNote is editorial typography. It renders statically. No entrance animation, no hover transition on the container, no reduced-motion variant needed for the component itself. Any scroll-driven reveal would be authored by the page composition layer, not by FieldNote. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` handles global suppression.

---

## 7. Responsive behavior

FieldNote's layout is identical on both sides of the `768px` breakpoint. No responsive changes are defined.

**Rationale.** FieldNote's width is constrained by `max-width: var(--hero-max)` (38rem / 608px), which is already within the typical mobile viewport width when accounting for `--page-pad`. The `1px` left rule, `12px` inset, and `--fs-body` fluid scale all read correctly at narrow viewports. The `margin-block: var(--space-6)` (24px) spacing is not excessive at mobile scale — it is less than half the `--space-16` editorial section padding. No responsive tweak is needed.

If a future live audit reveals that `--space-6` top/bottom is too heavy on narrow viewports, a responsive reduction to `--space-4` (16px) can be added without a brand-level decision-log entry — it is a rhythm calibration, not a token or brand change.

---

## 8. Accessibility

### Root element: `<aside>`

`<aside>` is the correct root. The HTML spec defines `<aside>`: "The aside element represents a section of a page that consists of content that is tangentially related to the content around the aside element." That definition maps precisely to FieldNote's purpose — a parenthetical technical note tangentially related to the prose it sits within. When `<aside>` is inside `<article>` (a common FieldNote host), the spec explicitly describes this relationship: "The aside element used within an article element could be used for pull quotes or secondary content."

`<aside>` carries `role="complementary"` as an implicit ARIA landmark — but only when it is a top-level sectioning element. When nested inside `<article>`, `<section>`, or `<main>`, an `<aside>` without an accessible name is not exposed as a `complementary` landmark in most screen reader implementations (it degrades to a generic container). For FieldNote's use case — multiple instances per page, inline with prose — this degradation is the correct behavior. An `<aside>` that is not a landmark avoids polluting the landmark list while still conveying its semantic "tangential content" role in the document outline.

**No extra ARIA is needed.** `<aside>` inside prose is semantically self-describing. Screen readers that expose it will announce it as "complementary" or "aside" depending on their implementation and the nesting context. This is correct and informative.

**Why not `<div role="note">`?** The ARIA `role="note"` is defined in the ARIA spec as "A section whose content is parenthetic or ancillary to the main content." This maps well to FieldNote conceptually. However, `role="note"` has uneven screen reader support (it is not a landmark role — it is a document structure role with limited implementation). `<aside>` provides equivalent semantics with broader and better-tested support. `<div role="note">` was considered and rejected on these grounds. If future ARIA spec revisions or screen reader implementations improve `role="note"` support significantly, this can be revisited.

**Why not `<p>`?** A `<p>` element cannot contain another `<p>` as a descendant. Since FieldNote's body renders as a `<p>`, and the label also renders as a `<p>`, a `<p>` root would produce invalid HTML. `<aside>` is the correct block-level semantic container.

### Contrast ratios (verified against `meta/brand.md` values)

| Pair                                       | Ratio     | Verdict     |
| ------------------------------------------ | --------- | ----------- |
| `--fg` (#1D1D1F) on `--bg` (#FBFBFD)       | 16.29 : 1 | AAA         |
| `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) | 4.91 : 1  | AA normal ✓ |

The label at `--fg-muted` renders at `--fs-meta` (14px). 14px is normal text (not large text) — the applicable WCAG threshold is 4.5:1 (AA normal). 4.91:1 passes. No exception needed.

The left rule (`--hairline` on `--bg`) is decorative. No contrast requirement applies to decorative CSS borders.

### Keyboard interaction

FieldNote is not interactive. If the consumer places an inline `<a>` inside `children`, that link is a standard focusable element and receives the global focus ring. No custom keyboard management is needed.

---

## 9. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API
interface FieldNoteProps extends ComponentPropsWithoutRef<"aside"> {
  /**
   * Optional label rendered above the body text.
   * Displays in the Eyebrow register (--fs-meta, --fg-muted, uppercase, tracked).
   * When omitted, no label element is rendered.
   * Example values: "Note", "Caveat", "Aside", "Data point".
   */
  label?: string;
  /**
   * The aside body text. Required.
   * Accepts ReactNode to support inline <strong>, <em>, and <a>.
   * No block-level elements — no <h2>, <ul>, <p>, <div>, etc.
   * The engineer renders children inside a <p> element.
   */
  children: ReactNode;
}
```

**Root element decision.** The root is `<aside>`. It is not polymorphic — FieldNote has one correct semantic role and no valid alternative root. A polymorphic `as` prop would imply there are multiple valid semantic choices, but there are not. The engineer uses `ComponentPropsWithoutRef<"aside">` as the base type.

**`label` is `string`, not `ReactNode`.** The label slot is typographically constrained — it is a single-line metadata label in the muted/uppercase register. Accepting `ReactNode` would allow consumers to pass block elements, rich markup, or composed components into a slot that is visually and semantically a one-liner. `string` enforces that constraint at the type level.

**`label` has no default.** If `label` is omitted, no label element is rendered. This is the correct default: the left hairline rule alone is sufficient visual differentiation for most inline asides. The label is for cases where the type of aside (note vs. caveat vs. data point) is load-bearing information. Defaulting to `"Note"` would be presumptuous — most consumers may not want a label at all.

**`children` renders inside a `<p>`.** The engineer wraps `children` in a `<p>` element inside the `<aside>` root. This is the correct semantic: FieldNote's body is a paragraph. The `<p>` receives `className={styles.body}` for the CSS rules. Consumers pass the text content as children — no wrapping `<p>` in JSX is needed or desired.

**Standard HTML spread.** `ComponentPropsWithoutRef<"aside">` gives consumers access to `id`, `data-*`, `aria-*`, `className`, and event handlers on the root element. `className` merges via `clsx` (consistent with every other component in the DS — see Pull.tsx, Section.tsx, FailureMode.tsx).

**`forwardRef` and `displayName`.** The component uses `forwardRef` (consistent with Pull, Section, FailureMode — all molecules use `forwardRef`). `displayName = "FieldNote"` must be set explicitly on the `forwardRef` result.

**What was trimmed:**

- `variant` prop (e.g. `"warning"`, `"tip"`) — rejected. FieldNote is tonally neutral. Color variants would push it toward a notification/alert component, which is explicitly not its role. A warning-colored callout is a different component (future `Callout` atom, if needed). The brand register for FieldNote is always quiet.
- `as` polymorphic prop — rejected. See "Root element decision" above.
- `icon` slot — rejected. Icons add visual weight and imply status/severity. FieldNote is plain text only.
- `body` as a prop instead of `children` — rejected. `children` is the convention for text-content molecules in this DS (Pull, FailureMode, Section body slot all use `children`).

---

## 10. Composition rules

- FieldNote composes inside long-form prose — between paragraphs, after a factual claim, mid-article where a clarification is needed. Its natural parent is an `<article>` body, the `children` slot of a `<Section>`, or any prose column.
- Multiple FieldNotes may appear on a single page. The `margin-block: var(--space-6)` spacing creates natural breathing room. There is no enforced count limit — editorial judgment applies.
- FieldNote should not be placed inside a `<Hero>`. Hero owns the page's display moment; FieldNote is a prose-level device.
- FieldNote should not nest inside `<Pull>`. These components operate at different typographic scales. Nesting a quiet aside inside an already-accented pull-quote creates contradictory hierarchy.
- FieldNote should not be used as a decorative block or section header. If the content needs a heading, it is not a FieldNote.
- FieldNote is not a substitute for `<FailureMode>`. If the content has a title, an index, or more than two sentences of structured prose, it is a FailureMode (or a Section), not a FieldNote.
- FieldNote composes cleanly alongside `<Pull>` in the same article without visual conflict: Pull is wide-and-loud (3px rule, 20–26px type, serif italic), FieldNote is narrow-and-quiet (1px rule, 17–19px type, sans roman). A reader can distinguish them at a glance. Using both on the same page is valid and intentional for long-form editorial surfaces like `/why-ai`.

---

## 11. Out of scope

- **Color variants** (`variant="warning"`, `variant="tip"`, `variant="danger"`). Excluded entirely. FieldNote is tonally neutral. Colored callouts are a different component. This exclusion is brand-level — it is not a "maybe later" item; it requires explicit founder sign-off to add.
- **Icon slot.** No icon support. Icons imply status severity. FieldNote is plain text only.
- **Multi-paragraph body.** FieldNote is a single-paragraph aside. If the content requires multiple paragraphs, it is not a FieldNote — use a Section with `size="tight"` or author a new molecule.
- **Dark mode per-component overrides.** `--fg`, `--fg-muted`, `--hairline`, `--accent` all flip cleanly via the global dark-mode token override block in `tokens.css` (when it ships). No per-component dark-mode CSS is needed.
- **Entrance animation.** Static typography. No scroll-triggered reveal. Deferred entirely.
- **`title` or heading slot.** FieldNote has no heading. The `label` is purely a metadata label in the muted/uppercase register — it is not a heading element and must not be mistaken for one.
- **Polymorphic root.** The root is always `<aside>`. No `as` prop.
- **RTL support.** `border-inline-start` and `padding-inline-start` are logical properties and are RTL-correct by default. No additional work needed.

---

## 12. Worked examples

### (a) Plain body — no label

```jsx
import { FieldNote } from "@poukai-inc/ui";

<FieldNote>
  In 2024 we ran the same prompt across three model families and saw consistent degradation after
  context exceeded 16k tokens.
</FieldNote>;
```

Renders:

```html
<aside class="root">
  <p class="body">
    In 2024 we ran the same prompt across three model families and saw consistent degradation after
    context exceeded 16k tokens.
  </p>
</aside>
```

### (b) With custom label

```jsx
<FieldNote label="Caveat">
  These numbers reflect Q4 2023 benchmarks. The 2024 evals are in progress and results may differ.
</FieldNote>
```

Renders:

```html
<aside class="root">
  <p class="label">Caveat</p>
  <p class="body">
    These numbers reflect Q4 2023 benchmarks. The 2024 evals are in progress and results may differ.
  </p>
</aside>
```

### (c) Inline link inside body

```jsx
<FieldNote label="Note">
  The latency figures come from our <a href="/methodology">public methodology doc</a>, updated
  monthly.
</FieldNote>
```

Renders:

```html
<aside class="root">
  <p class="label">Note</p>
  <p class="body">
    The latency figures come from our
    <a href="/methodology">public methodology doc</a>, updated monthly.
  </p>
</aside>
```

The inline `<a>` inherits the global two-layer underline treatment from `tokens.css` — no special handling inside FieldNote required. On hover the accent underline grows over the resting hairline underline. On `:focus-visible` the global `outline: 2px solid var(--accent)` rule applies.

---

## 13. Story matrix

| Story file                          | Story name       | Description                                                                                                                                                                                                           |
| ----------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FieldNote.stories.tsx`             | `Default`        | Body text only, no `label`. Verifies: `<aside>` root, `<p class="body">` inside, 1px left rule, `--space-3` inset, `--space-6` margin-block, `--fs-body` size, `--fg` color.                                          |
| `FieldNote.stories.tsx`             | `WithLabel`      | `label="Note"` + body. Verifies: label element rendered above body, `--fs-meta` size, `--fg-muted` color, uppercase + tracked, `--space-1` gap between label and body.                                                |
| `FieldNote.stories.tsx`             | `CustomLabel`    | `label="Caveat"` — verifies label renders the provided string without modification.                                                                                                                                   |
| `FieldNote.stories.tsx`             | `WithInlineLink` | Body containing an `<a href>`. Verifies: link inherits global two-layer underline; focus ring renders on `:focus-visible`; no visual regression from global `a` rule inside `<aside>`.                                |
| `FieldNote.stories.tsx`             | `LongBody`       | A two-sentence body (~35 words). Verifies: `max-width: var(--hero-max)` constrains the block at wide viewports; `line-height: 1.55` renders correctly at full measure.                                                |
| `FieldNote.AllVariants.stories.tsx` | `AllVariants`    | Three instances stacked: no label, label="Note", label="Aside" with inline link. Design-matrix story.                                                                                                                 |
| `FieldNote.AllVariants.stories.tsx` | `InProseRhythm`  | Two prose paragraphs above FieldNote, two below. Verifies `margin-block: --space-6` reads as natural breathing room in the article column without over-separating FieldNote from its context. Primary prose-fit test. |
| `FieldNote.AllVariants.stories.tsx` | `AlongsidePull`  | A `<Pull>` followed by a `<FieldNote>`. Verifies the two components are visually distinct at a glance (3px vs 1px rule, 20–26px vs 17–19px type, serif-italic vs sans-roman) and do not create a confusing hierarchy. |

---

## 14. Open questions for Arian

1. **Label default: `undefined` or `"Note"`?** The spec defaults `label` to `undefined` (no label rendered). The alternative is defaulting to `"Note"` so every FieldNote is self-labeled even if the consumer does not pass `label`. The current decision favors `undefined` — "Note" is presumptuous and many technical asides are better left unlabeled (the left rule is the signal). If pages consistently want labels, the default can be set to `"Note"` without a brand-level change. Awaiting your preference.

2. **`max-width` inheritance from prose column.** The spec sets `max-width: var(--hero-max)` (38rem) to match the prose column cap. If a surface uses a wider prose measure (e.g. a future documentation layout at `--content-max: 64rem`), FieldNote will be narrower than the surrounding text, which may look intentional or may look like a constraint. Should FieldNote inherit its max-width from a CSS `max-width: inherit` / no explicit cap and rely on the prose container? Or is the `--hero-max` cap always correct for FieldNote regardless of host column width? The current spec is opinionated toward `--hero-max`; changing this would be a layout-level call.

3. **Block-element restriction enforcement.** The spec says `children` accepts inline marks only — no block-level elements. This is documented but not type-enforced (React's type system cannot prevent a consumer from passing a `<ul>` as a `ReactNode`). A development-mode `console.error` warning when `children` contains a block-level element was considered but rejected as complex to implement reliably. The engineer may add an optional guard. Should the spec require the guard or leave it as editorial documentation only?
