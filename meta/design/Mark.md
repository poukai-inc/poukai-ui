# Design spec: Mark

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<Mark>` is the system's editorial highlight — a compact, inline chip that
flags a run of text inside long-form prose as "this is the part the reader
should notice." It answers the question "what should my eye stop on?" without
interrupting the line. The visual treatment is a low-saturation
`--accent-glow` background tinted at the same opacity the system uses for
text selection, so the highlight reads as a kindred surface ("selected
prose") rather than a foreign decoration.

Mark arrived because the editorial side of the system has no canonical way
to highlight a phrase in prose. Today, content authors either fall back to
the raw `<mark>` element with whatever default the browser gives it
(typically a saturated yellow that clashes with the Apple-light palette) or
invent inline `<span style="background: …">` overrides — both of which
break the "single visual contract per primitive" goal. Mark lifts the
highlight treatment into the DS so every editorial surface — Pull, Quote,
FieldNote, FeatureCard body, Prose — highlights identically.

### What Mark is not

**Mark is not `<Code>`.** Code is the inline literal-quotation chip
(monospace, `--surface` fill). Mark is the editorial highlight chip
(sans-serif inherit, `--accent-glow` fill). They share the inline-chip
family but the semantic registers differ — literal text token (Code) vs.
emphasised reading fragment (Mark).

**Mark is not a `<Tag>`.** Tag is a categorical pill. Mark is a highlight
of running text.

**Mark is not interactive.** No hover, no focus, no states. It is not a
button, not a link, not a tab stop.

**Mark is not a status indicator.** Highlighting a phrase is not the same
as flagging an error, warning, or success — those belong to `<Banner>`,
`<StatusBadge>`, and the toast tone tier.

---

## 2. Anatomy

- **Root element**: `<mark>`. The semantic HTML element for "marked or
  highlighted text for reference or notation purposes" (MDN). Implicitly
  recognised by assistive tech. Non-polymorphic — no `as` prop.
- **Content**: `children`. Typically a short prose fragment (a phrase, a
  clause, occasionally a single word). `ReactNode` for parity with the
  rest of the atomic system, but the idiomatic usage is a plain string or
  inline-flow markup.

There is no leading or trailing slot. No icon. No tooltip.

---

## 3. Tokens used

No new tokens are introduced.

| Token           | Value                                                                 | Role                          |
| --------------- | --------------------------------------------------------------------- | ----------------------------- |
| `--accent-glow` | `rgba(0, 113, 227, 0.18)` (light) / `rgba(10, 132, 255, 0.24)` (dark) | Highlight background          |
| `--space-1`     | `0.25rem` (4px)                                                       | Inline padding (left + right) |
| `--radius-1`    | `2px`                                                                 | Corner micro-rounding         |

### Token decisions

**Background: `--accent-glow`.**

`--accent-glow` is the brand-blue at low opacity — the same value used for
the global `::selection` background (`tokens.css:296`). Reusing it here is
intentional: a highlight should read as "this is selected prose," not as a
foreign sticker. The token resolves correctly in dark mode via the global
`@media (prefers-color-scheme: dark)` block (`rgba(10, 132, 255, 0.24)`),
where the opacity is raised slightly to compensate for dark-surface
absorption.

No alternative token was considered. `--accent` (solid) would over-saturate
the highlight to the point of competing with body copy. `--bg-warm-accent`
is reserved for the warm editorial band. `--surface` is Code's territory.
The accent-glow is the one correct value.

**Color: `inherit`.**

The highlight tints the background; the text on top must remain the
surrounding text's foreground. Hard-coding `--fg` would break dark-mode
flips inside Prose (which authors text on `--bg-warm-accent` using
`--fg-on-warm`); hard-coding any tone token would override consumer-level
choices. `color: inherit` is the right contract: the chip is a background
treatment, not a foreground treatment.

**Padding: `--space-1` inline only, no block padding.**

Mark chips are inline. Adding block padding (top/bottom) inflates the chip
above the text baseline and creates a visible "lump" in running prose,
especially across line wraps. Inline padding alone gives the highlight
horizontal breathing room while preserving line flow and leading. The
inline padding also gives `border-radius` something to round on — without
it, the radius would collapse to zero against the glyph edges.

**Border-radius: `--radius-1` (2px).**

The smallest existing radius rung — chosen deliberately. A selection-rect
(`0`) would feel mechanical and resemble browser selection too closely; a
pill (`999px`) would over-decorate the run and conflict with Tag's
visual register; the editorial radius (`--radius-2: 4px`, which Code and
Kbd use) would tip the highlight toward "chip" rather than "tinted run
of prose." `--radius-1: 2px` lands the highlight as a softly-rounded
prose run — present, but not a sticker. This is the same value
`tokens.css` uses for the link `:focus-visible` outline corner, which
shares Mark's "soft inline rounding" register.

**No border, no shadow.**

The accent-glow fill alone communicates the highlight. Adding a border
would conflate Mark with Kbd's key-cap reading; adding a shadow would
break the inline-prose register entirely.

---

## 4. Layout & rhythm

| Property               | Value                   | Notes                                                                                            |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| `display`              | `inline`                | Pure inline flow; no flex, no inline-block                                                       |
| `font-family`          | `inherit`               | The chip adopts surrounding prose typography                                                     |
| `font-size`            | `inherit`               | The chip scales with parent text register                                                        |
| `font-weight`          | `inherit`               | No bolder/lighter — highlight is the signal, not weight                                          |
| `line-height`          | `inherit`               | Inherits parent line-height so the chip never increases the leading of the line that contains it |
| `color`                | `inherit`               | The text inside the highlight adopts the surrounding `--fg` (or `--fg-on-warm`, etc.)            |
| `padding-block`        | `0`                     | No vertical padding; preserves baseline                                                          |
| `padding-inline`       | `var(--space-1)` (4px)  | Tight horizontal breathing room                                                                  |
| `background-color`     | `var(--accent-glow)`    | Highlight fill                                                                                   |
| `border-radius`        | `var(--radius-1)` (2px) | Micro-rounding — not selection-rect, not pill                                                    |
| `box-decoration-break` | `clone`                 | Each line-wrap fragment is independently boxed so the highlight tiles cleanly across line breaks |
| `margin`               | `0`                     | Consumer owns layout                                                                             |

The `box-decoration-break: clone` + `-webkit-box-decoration-break: clone`
pairing is load-bearing: without it, a Mark that spans a line break
renders the background and padding only on the first fragment, leaving
the wrapped portion of the highlight visually unfinished. With `clone`,
each fragment receives its own padding and rounded corners — the
canonical behaviour for an inline highlight that may wrap.

---

## 5. States

Mark is a non-interactive atom. No hover, focus, active, or disabled
states.

The CSS module contains no `:hover`, `:focus`, `:focus-visible`,
`:active`, or `[disabled]` rules. Mark is not focusable, not a tab stop,
and carries no interaction affordance.

If a consumer wraps a `<Mark>` inside an `<a>` or `<button>`, the parent
element owns interactive affordance and focus ring. Mark contributes no
overlay or border that would conflict with the parent's `:focus-visible`.

---

## 6. Motion

None. No transitions, no animations.

Per BACKLOG §Allowlist, no new motion is added; per §Banlist, no animated
gradients, no hover-pulse, no scroll-triggered reveals.

---

## 7. Responsive behaviour

Identical across breakpoints. Inheriting `font-family`, `font-size`,
`font-weight`, `line-height`, and `color` means Mark automatically tracks
any fluid type in its parent (body copy, pull-quote, field note, prose)
without per-breakpoint rules.

---

## 8. Dark mode

`--accent-glow` is already defined under
`@media (prefers-color-scheme: dark)` in `tokens.css` and flips to
`rgba(10, 132, 255, 0.24)` — slightly higher opacity to compensate for
dark-surface absorption, per the dark-mode token contract. No
per-component dark-mode overrides are required.

Because `color: inherit`, the foreground reading inside the highlight
follows whatever the surrounding context provides (`--fg` on `--bg`,
`--fg-on-warm` on `--bg-warm-accent`, etc.). The light-on-dark and
dark-on-light pairings both produce a readable highlighted run; the
contrast contract is owned by the parent text + background, not by Mark.

---

## 9. Accessibility

**Root element: `<mark>`.**

The semantic HTML element for marked or highlighted text. Screen readers
may announce content as "highlighted" (verbosity-dependent); regardless
of the specific announcement, the semantic intent is correctly encoded
and indexable by assistive tech.

**No ARIA attributes needed.**

`<mark>` carries the correct implicit semantics. No `role`,
`aria-label`, or `aria-describedby` is required for the default editorial
use case.

**Color is not the only signifier.**

The `<mark>` element conveys highlight semantically — assistive tech that
announces "highlighted" makes this discoverable to users who do not
perceive the colour. For users who do perceive colour but with reduced
sensitivity, the `--accent-glow` background sits at low opacity on `--bg`
and at slightly higher opacity on the dark canvas — measured perceptual
delta is sufficient to read the highlight as distinct from surrounding
prose in both modes. Where Mark is used inside an editorial run, the
phrase being highlighted should also carry its own semantic weight (it
is the meaningful clause in the sentence) so the highlight reinforces
meaning rather than carrying it alone.

**Contrast (text inside the highlight).**

Mark sets `color: inherit`. The text on top of the highlight inherits the
surrounding `--fg` / `--fg-on-warm` / etc. Because `--accent-glow` is
applied at low opacity over `--bg`, the effective background under the
text is a near-`--bg` value tinted toward `--accent` — the resulting text
contrast remains AAA in all standard editorial pairings (`--fg` on
`--bg`-tinted-blue = ≥ 15:1). No contrast regression versus surrounding
prose.

**Selection.**

Inherits the global `::selection` rule (`--accent-glow` background,
`--fg` text) from `tokens.css`. Selecting marked text behaves identically
to selecting any other prose text — desirable.

**Not focusable.**

Mark is not focusable, not a tab stop, and not announced as interactive.

---

## 10. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API
interface MarkProps extends HTMLAttributes<HTMLElement> {
  /**
   * The highlighted content. Typically a short prose fragment.
   * ReactNode is accepted for parity with the rest of the atomic system;
   * idiomatic usage is a plain string or inline-flow markup.
   */
  children: ReactNode;
}
```

**Root is `<mark>`, non-polymorphic.** `forwardRef<HTMLElement, MarkProps>`
(the DOM interface for `<mark>` is `HTMLElement`, not a dedicated
`HTMLMarkElement` constructor — `HTMLElement` is the correct ref type,
same pattern as Code and Kbd).

**`HTMLAttributes<HTMLElement>`** as base — gives consumers `className`,
`id`, `data-*`, `aria-*`, event handlers.

**`displayName = "Mark"`** on the `forwardRef` result.

**No `tone`, `size`, `as`, or `variant` props.** One visual register; one
correct root element; relative inheritance handles the size-context
problem. If a future surface needs a distinct register (e.g., "danger
mark" in error messages), the right move is to propose a new prop with
a real surface — not to speculatively add one now.

---

## 11. Composition rules

- `<Mark>` is an inline atom. It composes anywhere inline content is
  valid: body copy, list items, pull-quote text, field-note descriptions,
  Prose long-form bodies, FeatureCard body, dialog body, button labels
  (rare but valid — though see "not interactive" caveat below).
- **Inside `Pull`, `Quote`, `Statement`**: the highlight reads
  proportionally larger because Mark inherits the parent's font-size — no
  per-surface override needed.
- **Inside `Prose`**: the highlight is the canonical way to flag an
  editorial run inside CMS / MDX / markdown output. Author the content as
  `<mark>...</mark>` directly; the Prose context will style it via this
  atom's contract when Prose composes Mark, or via the global rule below.
- **Multiple `<Mark>` runs inline**: compose naturally as inline-flow
  text. No special container needed. More than two highlights in one
  short paragraph is an editorial judgment, not a DS constraint.
- **Mark does not compose with `<Code>` in the same slot.** Their
  semantic registers differ (highlight vs. literal). Pick the right one;
  do not stack them. (Nesting `<Code>` inside `<Mark>` to highlight a
  literal is acceptable in rare cases — Mark's `color: inherit` and
  inline display preserve Code's chip rendering inside.)
- **Mark does not compose with `<Kbd>`**: keystrokes are not highlighted
  prose.
- **Mark does not compose with `<Tag>`**: Tag is a categorical pill;
  Mark is a highlighted prose run.

---

## 12. Anti-patterns

- **Do not** use Mark for inline code literals — use `<Code>`.
- **Do not** use Mark for keyboard keys — use `<Kbd>`.
- **Do not** use Mark for status indication (error, warning, success) —
  use `<Banner>`, `<StatusBadge>`, or the toast tone tier.
- **Do not** use Mark as a button, link, or tab stop — it is not
  interactive.
- **Do not** nest interactive elements inside Mark (no `<button>`,
  `<a>`, `<input>` children). If the highlighted run must be clickable,
  the consumer composes `<a><Mark>...</Mark></a>`, with the anchor owning
  the interaction.
- **Do not** override the highlight colour with an inline `style` or
  `className` background. The highlight is `--accent-glow`, single
  contract. If a brand exception is needed, propose a new prop with a
  decision-log entry in `meta/brand.md` — do not silently fork the
  background.
- **Do not** add block padding, borders, shadows, or animations to
  Mark via consumer CSS — the inline-prose contract is intentional.
- **Do not** use Mark to draw attention to entire paragraphs or blocks —
  it is for inline runs of words, not block-level emphasis. For
  block-level emphasis, use `<Pull>` or `<Banner>`.

---

## 13. Allowlist alignment

**Tokens.** Mark consumes only `--accent-glow`, `--space-1`, and
`--radius-1` — all existing tokens. Per BACKLOG §Tokens (and the wider
"no new tokens" guardrail on this work), nothing is added to
`src/tokens/tokens.css`.

**Motion.** Mark introduces no transitions, no animations, no entrance
sequences. Per BACKLOG §Allowlist this is consistent — no new sanctioned
motion is needed. Per BACKLOG §Banlist this is consistent — no
scroll-triggered reveals, no hover-pulse, no animated gradients, no
shimmer, no decorative spinner.

**A11y.** Mark uses the native `<mark>` element; no extra ARIA. Colour
is reinforced by the semantic element and by the meaningful phrase being
highlighted, satisfying the "colour is not the only signifier" contract.

**Anti-patterns.** Mark is non-polymorphic, non-interactive, and ships
zero variants — consistent with the editorial-primitive register that
Code, Kbd, and Eyebrow established.

---

## 14. Implementation notes

- **`box-decoration-break: clone` is required.** Without it, a Mark that
  spans a line break renders padding and rounded corners only on the
  first fragment, leaving the wrapped portion of the highlight visually
  unfinished. The CSS module must declare both the standard
  `box-decoration-break: clone` and the WebKit-prefixed
  `-webkit-box-decoration-break: clone` so Safari behaves identically
  to Chromium and Firefox.
- **`color: inherit` is load-bearing.** The text inside the highlight
  must adopt the surrounding context's foreground (light `--fg` on
  `--bg`, `--fg-on-warm` inside the warm editorial band, etc.). Hard
  -coding any specific colour token would break dark mode or warm-band
  composition.
- **Non-polymorphic.** Root is always `<mark>`. The DOM interface is
  `HTMLElement` (not a dedicated `HTMLMarkElement`). `forwardRef` types
  match Code / Kbd.
- **Class-merge helper.** Use the existing `clsx` import that Code and
  Kbd use (`import clsx from "clsx"`) — no new utility needed.
- **No new tokens.** All values resolve through existing tokens
  declared in `src/tokens/tokens.css`. If a future need surfaces (e.g.
  a separate highlight tone for the warm editorial band), the response
  is a new prop + decision-log entry, not a new token introduced
  silently.

---

## Story matrix

| Story file         | Story name        | Description                                                                                                              |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `Mark.stories.tsx` | `Default`         | A single `<Mark>` rendered alone — verifies the chip background, radius, and inline padding.                             |
| `Mark.stories.tsx` | `InsideProse`     | Mark embedded inside a `<Prose>` long-form body — verifies inheritance and editorial fit.                                |
| `Mark.stories.tsx` | `InsideParagraph` | Mark embedded inside a `<p>` body-copy paragraph that wraps — verifies `box-decoration-break: clone` across line breaks. |

---

## Open questions

None. All decisions in this spec are locked.

Notes for verification (not blocking):

- Token verification: `--accent-glow`, `--space-1`, and `--radius-1` are
  all defined in `src/tokens/tokens.css`. `--accent-glow` flips correctly
  under `prefers-color-scheme: dark` (same file). No new tokens needed.
- The `--accent-glow` dark-mode value is `rgba(10, 132, 255, 0.24)` —
  slightly raised opacity, which is the intended dark-mode behaviour for
  this token's selection/highlight role.
