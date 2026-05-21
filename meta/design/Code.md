# Design spec: Code

**Atomic layer**: atom
**Status**: Draft
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<Code>` is the system's inline code chip — a compact monospace fragment that
identifies a literal token in running prose: a variable name, a CSS custom
property, an HTML element, a shell command, a config key. It answers the
question "what is the literal text I am referring to?" inline with content
flow, without interrupting it.

Code arrived because the editorial side of the system has no canonical way to
quote a literal in prose. Today, content authors either fall back to the raw
`<code>` element with whatever default the browser gives it (inconsistent
across platforms, often unstyled) or invent inline `<span style>` overrides.
Both fail the "single visual contract per primitive" goal. Code lifts the
inline-literal treatment into the DS so every editorial surface — Pull,
Quote, FieldNote, FeatureCard body, future Prose wrapper — quotes the same
way.

### What Code is not

**Code is not a `CodeBlock`.** A CodeBlock is the fenced multi-line code
surface — separate primitive with its own scrolling, language label, and
CopyButton concerns. Code is strictly inline.

**Code is not `<Kbd>`.** Kbd represents a physical keyboard key (`⌘`, `K`,
`Enter`). Code represents a literal text token. They share the surface family
intentionally — both encode "this is a literal" — but the semantic registers
differ: keystrokes (input gesture) vs. text content (data).

**Code is not a `<Tag>`.** Tag is a categorical pill (a label). Code is a
literal-quotation chip (a quoted fragment). Both are inline, but their
semantic registers are unrelated.

**Code is not interactive.** No hover, no focus, no copy-on-click. (A future
inline-copy variant, if needed, is a distinct `CopyableCode` primitive.)

---

## 2. Anatomy

- **Root element**: `<code>`. The semantic HTML element for inline code,
  with implicit recognition by screen readers and assistive tech.
  Non-polymorphic — no `as` prop.
- **Content**: `children`. Typically a short literal string (one to a few
  words). `ReactNode` for parity with the rest of the atomic system, but the
  idiomatic usage is a plain string.

There is no leading or trailing slot. No icon. No copy button. No language
indicator. These belong to `CodeBlock`.

---

## 3. Tokens used

No new tokens are introduced.

| Token         | Value             | Role                          |
| ------------- | ----------------- | ----------------------------- |
| `--font-mono` | Geist Mono stack  | Font family                   |
| `--surface`   | `#F5F5F7` (light) | Chip background               |
| `--fg`        | `#1D1D1F` (light) | Chip text color               |
| `--space-1`   | `0.25rem` (4px)   | Inline padding (left + right) |
| `--radius-2`  | `4px`             | Corner radius                 |

### Token decisions

**Font size: `0.9em`, not a fixed `--fs-*` token.**

Inline code must follow the size of its host text. A `<Code>` chip inside
body copy (`--fs-body`, 17–19px) should read at a proportional ~16px monospace.
The same chip inside a `Pull` quote (`--fs-pull`, 20–26px) should read
proportionally larger. Fixing the size at any of `--fs-meta` / `--fs-body` /
`--fs-micro` would either oversize the chip inside small text or undersize it
inside editorial display text. `0.9em` is the standard CSS idiom for
"slightly smaller than my parent" and is documented in the module CSS.

This mirrors the same pattern Tag uses for its `999px` pill radius — a
geometric/relative constant correctly belongs in the component CSS, not the
token file, because it is not a brand decision.

**Background: `--surface`.**

Same chip-background semantics as Tag's `default` tone. The Apple-light
recessed elevation token, used wherever an inline element should read as
"slightly recessed from the surrounding canvas." Both Code and Kbd share
`--surface` for visual family coherence — see Kbd spec §3.

**No border.**

Code chips read as background-fill literals. The `--surface` fill alone is
enough visual separation from the surrounding `--bg`. Adding a hairline
border would over-decorate the chip and pull visual weight away from the
editorial copy that contains it.

**Radius: `--radius-2` (4px).**

The smallest existing radius rung above `--radius-1` (the focus-ring 2px).
Code chips are small inline elements; a larger radius would round away the
chip's compact rectangular feel. `--radius-2` is also what the brand has
chosen for general "inline content rounding."

**Padding: `--space-1` inline only, no block padding.**

Code chips are inline. Adding block padding (top/bottom) inflates the chip
above the text baseline and creates a small "lump" in running prose. Inline
padding alone gives the chip horizontal breathing room while preserving line
flow. The chip's monospace font and `0.9em` size already provide enough
vertical air without explicit block padding.

---

## 4. Layout & rhythm

| Property         | Value                   | Notes                                                           |
| ---------------- | ----------------------- | --------------------------------------------------------------- |
| `display`        | `inline`                | Pure inline flow; no flex                                       |
| `font-family`    | `var(--font-mono)`      | Geist Mono                                                      |
| `font-size`      | `0.9em`                 | Relative to parent; see §3 decision                             |
| `font-weight`    | `400`                   | Regular weight — content is the literal, not the chrome         |
| `line-height`    | `inherit`               | Inherits parent line-height so the chip never increases leading |
| `padding-block`  | `0`                     | No vertical padding; preserves baseline                         |
| `padding-inline` | `var(--space-1)` (4px)  | Tight horizontal breathing room                                 |
| `background`     | `var(--surface)`        | Chip fill                                                       |
| `color`          | `var(--fg)`             | Full foreground for legibility                                  |
| `border-radius`  | `var(--radius-2)` (4px) | Compact corner rounding                                         |
| `margin`         | `0`                     | Consumer owns layout                                            |

---

## 5. States

Code is a non-interactive atom. No hover, focus, active, or disabled states.

The CSS module contains no `:hover`, `:focus`, `:focus-visible`, `:active`,
or `[disabled]` rules. If a consumer wraps a `<Code>` in an `<a>` or
`<button>`, the parent element owns interactive affordance.

---

## 6. Motion

None. No transitions, no animations.

---

## 7. Responsive behavior

Identical across breakpoints. The relative `0.9em` font sizing means Code
automatically tracks any fluid type in its parent (body copy, pull-quote,
field note) without per-breakpoint rules.

---

## 8. Accessibility

**Root element: `<code>`.**

The semantic element for inline code. Screen readers announce content as
"code" in some configurations (verbosity-dependent); regardless of the
specific announcement, the semantic intent is correctly encoded and indexable
by assistive tech and search.

**No ARIA attributes needed.**

`<code>` carries the correct implicit semantics. No `role`, `aria-label`, or
`aria-describedby` is required.

**Contrast verification.**

- `--fg` (#1D1D1F) on `--surface` (#F5F5F7) = 15.46:1 — AAA.
- Dark mode: `--fg` (#F5F5F7) on `--surface` (#1C1C1E) = 17.85:1 — AAA.

Both modes are well above WCAG AAA for normal text.

**Selection.**

Inherits the global `::selection` rule (`--accent-glow` background, `--fg`
text) from `tokens.css`. Selecting code text feels identical to selecting
any other prose text — desirable.

---

## 9. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API
interface CodeProps extends ComponentPropsWithoutRef<"code"> {
  /**
   * The literal content. Typically a plain string.
   * ReactNode is accepted for parity with the rest of the atomic system;
   * idiomatic usage is a plain string.
   */
  children: ReactNode;
}
```

**Root is `<code>`, non-polymorphic.** `forwardRef<HTMLElement, CodeProps>`
(the DOM interface for `<code>` is `HTMLElement`, not a dedicated
`HTMLCodeElement` constructor — `HTMLElement` is the correct ref type).

**`ComponentPropsWithoutRef<"code">`** as base — gives consumers `className`,
`id`, `data-*`, `aria-*`, event handlers.

**`displayName = "Code"`** on the `forwardRef` result.

**No `tone`, `size`, `as`, or `variant` props.** One visual register; one
correct root element; relative font sizing handles the size-context problem.
If a future content surface needs a distinct register (e.g., "danger code"
in error messages), the right move is to propose a new prop with a real
surface — not to speculatively add one now.

---

## 10. Composition rules

- `<Code>` is an inline atom. It composes anywhere inline content is valid:
  body copy, list items, pull-quote text, field-note descriptions, dialog
  body, Banner messages, button labels (rare but valid).
- **Inside `Pull`, `Quote`, `Statement`**: the chip reads proportionally
  larger via `0.9em` — no per-surface override needed.
- **Inside `Prose` (when shipped)**: the global `<code>` styling currently
  in `tokens.css` will be moved into the Code atom; Prose will rely on Code
  for any inline literal it contains.
- **Multiple `<Code>` chips inline**: compose naturally as inline-flow text.
  No special container needed.
- **Code does not compose with `<Kbd>`**: they are distinct registers
  (text token vs. physical key). Use the one that matches the semantic
  intent; do not stack them in the same inline slot.
- **Code does not compose with `<Tag>`**: Tag is a categorical pill, not a
  literal-quotation chip. The two never share a slot.

---

## 11. Out of scope

- **Block code / fenced code.** That is `CodeBlock`, a separate molecule.
  Code is strictly inline.
- **Language hint, syntax highlighting.** Inline code carries no language
  semantics. If language-aware coloring is needed, it belongs in `CodeBlock`.
- **Copy-on-click / inline copy button.** Not part of this atom. A
  `CopyableCode` molecule with a trailing CopyButton is a future primitive
  if the need arises.
- **Tone variants** (`muted`, `accent`, `danger`). The single neutral
  register on `--surface` covers all current and foreseeable editorial use.
  Colored inline code would conflate semantic-status messaging with
  literal-text-quoting — a category mistake.
- **Size ladder** (`size="sm" | "md" | "lg"`). Relative `0.9em` font sizing
  obviates the need.
- **Wrapping / soft-break behavior.** Inline `<code>` inherits the parent's
  word-break rules; long literals wrap at standard text breakpoints. The DS
  does not impose `word-break: break-all` (which mangles legitimate
  identifiers) or `white-space: nowrap` (which can force horizontal scroll
  in narrow viewports). Long literals are a content concern, not a Code
  concern. If a content surface needs no-wrap inline code, the consumer can
  apply it via wrapping markup.
- **Dark mode per-component overrides.** `--surface` and `--fg` resolve
  correctly via the global dark-mode token block. No per-component dark
  CSS needed.
- **RTL.** `padding-inline` is logical; RTL-correct by default.

---

## 12. Worked examples

### (a) Inside body copy

```tsx
import { Code } from "@poukai-inc/ui";

<p>
  Set the <Code>--accent</Code> token in your theme to override the default link color.
</p>;
```

### (b) Inside a Pull quote (proportionally larger)

```tsx
<Pull>
  Every page should call <Code>useTheme()</Code> exactly once.
</Pull>
```

The chip renders at ~90% of the Pull's `--fs-pull` size, preserving rhythm.

### (c) Multiple chips inline

```tsx
<p>
  Run <Code>pnpm install</Code> and then <Code>pnpm dev</Code>.
</p>
```

---

## 13. Story matrix

| Story file         | Story name        | Description                                                                                     |
| ------------------ | ----------------- | ----------------------------------------------------------------------------------------------- |
| `Code.stories.tsx` | `Playground`      | Controls-driven sandbox for `children`.                                                         |
| `Code.stories.tsx` | `InProse`         | `<Code>` inside `<p>` body text — verifies inline flow and proportional sizing.                 |
| `Code.stories.tsx` | `InsideLargeText` | `<Code>` inside a larger headline-scale paragraph — verifies `0.9em` scales with parent.        |
| `Code.stories.tsx` | `MultipleInline`  | Several `<Code>` chips in one sentence — verifies spacing, no baseline shift, no leading drift. |
| `Code.stories.tsx` | `LongLiteral`     | A long path or import string — verifies wrap behavior inside a narrow container.                |

---

## 14. Open questions for Arian

1. **Padding token: `--space-1` (4px) vs. a tighter literal (2px).** 4px
   reads as a comfortable inline chip; a tighter 2px would feel more like
   "underlined inline literal" than "chip." Recommendation is `--space-1`
   for consistency with the rest of the spacing system.
2. **Font size: `0.9em` vs. `0.875em`.** Both are common idioms. `0.9em` is
   slightly more legible at body scale; `0.875em` (= 7/8) is a tidier
   fraction. Recommendation: `0.9em` — legibility over tidiness for code.
