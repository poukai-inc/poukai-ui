# Design spec: Kbd

**Atomic layer**: atom
**Status**: Shipped in v1.5.0
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<Kbd>` is the system's keyboard-key glyph — a compact chip that represents
a physical key or key combination (`⌘`, `K`, `Enter`, `Esc`). It answers the
question "what key do I press?" in onboarding copy, command-menu shortcuts,
help text, and inline tutorials.

Kbd arrived because two near-term molecules — `MenuItem` (dropdown rows
with trailing shortcuts) and the future `CommandMenu` organism (the ⌘K
command palette) — need a shared keystroke chip primitive. Today, those
surfaces have no canonical glyph for "press this key"; they either fall
back to raw `<kbd>` (with its inconsistent browser defaults) or invent
inline span overrides. Kbd lifts the keystroke chip into the DS.

### What Kbd is not

**Kbd is not `<Code>`.** Code represents a literal text token (a variable,
a CSS custom property, an HTML element name). Kbd represents a physical
keypress. They share the surface family (`--surface` fill, mono font) as a
deliberate visual sibling cue: both encode "this is a literal." The
semantic registers, however, are distinct — input gesture (Kbd) vs. text
content (Code).

**Kbd is not a `<Tag>`.** Tag is a categorical label. Kbd is a keystroke
representation.

**Kbd is not interactive.** Pressing the rendered Kbd chip does nothing —
it is a visual representation of a key, not the key itself. If a consumer
needs an interactive shortcut display tied to a real handler, that is a
composition concern, not a Kbd concern.

**Kbd is a single key.** A multi-key combination like `⌘ + Shift + K` is
rendered as multiple `<Kbd>` instances side by side, optionally with a
non-breaking thin separator owned by the consumer. The DS does not encode
"combination" semantics inside a single Kbd. This keeps each key glyph an
atom; the combination is a composition.

---

## 2. Anatomy

- **Root element**: `<kbd>`. The semantic HTML element for keyboard input.
  Non-polymorphic — no `as` prop.
- **Content**: `children`. Typically a single key character or short token
  (`⌘`, `K`, `Enter`, `Esc`, `Tab`, `Shift`). `ReactNode` for parity, but
  the idiomatic usage is a plain string.

There is no leading or trailing slot. No icon. No tooltip.

---

## 3. Tokens used

No new tokens are introduced.

| Token          | Value             | Role            |
| -------------- | ----------------- | --------------- |
| `--font-mono`  | Geist Mono stack  | Font family     |
| `--surface`    | `#F5F5F7` (light) | Chip background |
| `--fg`         | `#1D1D1F` (light) | Chip text color |
| `--hairline`   | `#D2D2D7` (light) | Border color    |
| `--hairline-w` | `1px`             | Border width    |
| `--space-1`    | `0.25rem` (4px)   | Inline padding  |
| `--radius-2`   | `4px`             | Corner radius   |

### Token decisions

**Font size: `0.85em`, not a fixed `--fs-*` token.**

Same reasoning as Code §3: keystroke chips must follow the surrounding text
register. A keystroke shown inside a `MenuItem` row (`--fs-meta` text)
should read smaller than the same keystroke shown inside body copy. `0.85em`
is slightly tighter than Code's `0.9em` because Kbd carries a visible
border — without the slight size pull-back, the bordered chip reads as
heavier than its inline-text neighbor. The 0.05em differential is small but
intentional.

**Background: `--surface`.**

Same chip background as Code, by design. The two atoms intentionally share
visual family — both communicate "this is a literal." The disambiguation
between them comes from the border (Kbd has one, Code does not) and the
semantic element (`<kbd>` vs. `<code>`), not from the fill.

**Border: `--hairline` (1px).**

The single feature that visually separates Kbd from Code. A 1px
`--hairline` border gives the chip a subtle key-cap impression — enough to
suggest "this is a physical key" without resorting to skeuomorphic shading,
shadows, or gradients (all of which clash with the Apple-light editorial
register).

**Radius: `--radius-2` (4px).**

Identical to Code. Keystroke chips and code chips share radius for the
"same literal-chip family" reading.

**Padding: `--space-1` inline only.**

Identical to Code's padding rule and for the same reason — inline-only
padding preserves text baseline alignment.

**Font weight: `500`.**

A half-step heavier than Code's `400`. Keystroke labels are short (often a
single character or two) — the slightly heavier weight gives them
mechanical presence ("press this") without crossing into bold. The
differential also aids at-a-glance disambiguation between an inline Code
chip and an inline Kbd chip when both appear on the same page.

**Min-width / square-ish proportions.**

A single-character key (`K`, `Enter` icon glyphs) inside `--space-1`
padding reads narrower than the chip's height, which produces an awkward
"tall rectangle" silhouette. To preserve a square-ish key-cap proportion
for single-character keys, set `min-width: 1.5em`. This is geometric, not a
brand decision — kept as a CSS literal (documented in the module).

---

## 4. Layout & rhythm

| Property         | Value                                           | Notes                                                     |
| ---------------- | ----------------------------------------------- | --------------------------------------------------------- |
| `display`        | `inline-block`                                  | Allows `min-width` to apply; remains inline-flow          |
| `font-family`    | `var(--font-mono)`                              | Geist Mono                                                |
| `font-size`      | `0.85em`                                        | Relative to parent; see §3 decision                       |
| `font-weight`    | `500`                                           | See §3                                                    |
| `line-height`    | `1`                                             | Tight; the chip is single-line and we want height ≈ width |
| `padding-block`  | `0`                                             | Preserves baseline                                        |
| `padding-inline` | `var(--space-1)` (4px)                          | Horizontal breathing room                                 |
| `min-width`      | `1.5em`                                         | Square-ish proportion for single-character keys           |
| `text-align`     | `center`                                        | Centers single-char content within min-width              |
| `background`     | `var(--surface)`                                | Chip fill                                                 |
| `color`          | `var(--fg)`                                     | Full foreground                                           |
| `border`         | `var(--hairline-w) solid var(--hairline)` (1px) | Key-cap separator                                         |
| `border-radius`  | `var(--radius-2)` (4px)                         | Compact rounding                                          |
| `box-sizing`     | `border-box`                                    | So `min-width` is honored inclusive of border             |
| `margin`         | `0`                                             | Consumer owns layout                                      |

---

## 5. States

Kbd is a non-interactive atom. No hover, focus, active, or disabled states.

The CSS module contains no `:hover`, `:focus`, `:focus-visible`, `:active`,
or `[disabled]` rules.

---

## 6. Motion

None.

---

## 7. Responsive behavior

Identical across breakpoints. Relative font sizing means Kbd auto-tracks
fluid type. The `min-width: 1.5em` is em-relative and scales with the chip.

---

## 8. Accessibility

**Root element: `<kbd>`.**

The semantic element for keyboard input. Screen readers can announce its
content as "keyboard" or similar (verbosity-dependent). The semantic intent
is correctly encoded.

**Glyph keys vs. spelled-out keys.**

Symbols like `⌘`, `⇧`, `⌥`, `⌃`, `↵`, `⎋` are visually concise but read
inconsistently across screen readers. Two consumer-side patterns are
acceptable:

- Pass the symbol as `children` and the spelled-out name via
  `aria-label`: `<Kbd aria-label="Command">⌘</Kbd>`.
- Spell out the key directly: `<Kbd>Command</Kbd>`.

Recommendation: pass the spelled-out form via `aria-label` when displaying a
symbol. The DS documents this in the JSDoc but does not enforce it (types
cannot require an aria-label when content is a symbol). For non-symbolic
keys (`K`, `Enter`, `Esc`), no `aria-label` is needed — the rendered text
is the accessible name.

**Contrast verification.**

- `--fg` (#1D1D1F) on `--surface` (#F5F5F7) = 15.46:1 — AAA.
- `--hairline` (#D2D2D7) on `--bg` (#FBFBFD) = decorative border, no
  contrast requirement.
- Dark mode: `--fg` (#F5F5F7) on `--surface` (#1C1C1E) = 17.85:1 — AAA.

**Keyboard interaction.**

Kbd is not focusable. It is not a tab stop.

---

## 9. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API
interface KbdProps extends ComponentPropsWithoutRef<"kbd"> {
  /**
   * The key content. Typically a single character ("K"), a symbol ("⌘"),
   * or a short token ("Enter", "Esc").
   * Pass aria-label for symbol keys: <Kbd aria-label="Command">⌘</Kbd>.
   */
  children: ReactNode;
}
```

**Root is `<kbd>`, non-polymorphic.** `forwardRef<HTMLElement, KbdProps>`
(the DOM interface for `<kbd>` is `HTMLElement`).

**`ComponentPropsWithoutRef<"kbd">`** as base — gives consumers `className`,
`id`, `data-*`, `aria-*`, event handlers.

**`displayName = "Kbd"`** on the `forwardRef` result.

**No `tone`, `size`, `as`, or `variant` props.** One visual register; one
correct root; relative font sizing handles size context.

---

## 10. Composition rules

- `<Kbd>` is an inline atom. It composes inline in any text surface.
- **Multi-key combinations** are multiple `<Kbd>` instances composed by the
  consumer:

  ```tsx
  <Kbd aria-label="Command">⌘</Kbd> <Kbd>K</Kbd>
  ```

  The DS does not own combination separators or "join" semantics. A `+`
  string between Kbd chips is the consumer's call (`<Kbd>⌘</Kbd> + <Kbd>K</Kbd>`
  is valid; so is the bare space-separated form).

- **Inside `MenuItem` (when shipped)**: Kbd appears as a trailing shortcut
  hint, right-aligned within the row. Layout and spacing belong to
  MenuItem, not Kbd.
- **Inside `CommandMenu` / Dialog footers**: Kbd appears as a hint for the
  invoking shortcut.
- **Kbd does not compose with `<Code>` in the same slot.** Their semantic
  registers differ; pick the right one.
- **Kbd does not compose with `<Tag>`.** Different registers.

---

## 11. Out of scope

- **Multi-key combination as a single atom** (e.g., `<Kbd keys={["Meta","K"]} />`).
  Combinations are a composition, not an atom. Encoding combination
  semantics inside Kbd would expand its API surface for no clear win.
- **Modifier glyph dictionary** (auto-mapping `"Meta"` → `⌘`,
  `"Shift"` → `⇧`). Could be a future utility; not part of Kbd.
- **OS-aware key labels** (`⌘` on macOS, `Ctrl` on Windows/Linux).
  Belongs in a future `useShortcutLabel` utility hook, not the atom.
- **Interactive shortcut binding.** Kbd is a visual representation. Real
  keypress handling is the consumer's responsibility (likely via a hooks
  utility or a `CommandMenu`).
- **Tone variants.** Kbd has one neutral register. A muted or accent
  keystroke chip would over-elaborate the API for no surface need.
- **Size ladder.** Relative font sizing handles size context.
- **Dark mode per-component overrides.** All tokens used resolve via the
  global dark-mode block.
- **RTL.** `padding-inline` is logical.

---

## 12. Worked examples

### (a) Single-key shortcut hint

```tsx
import { Kbd } from "@poukai-inc/ui";

<p>
  Press <Kbd>Esc</Kbd> to close.
</p>;
```

### (b) Multi-key combination

```tsx
<p>
  Open the command menu with <Kbd aria-label="Command">⌘</Kbd> <Kbd>K</Kbd>.
</p>
```

### (c) Inside a MenuItem trailing slot (future)

```tsx
<MenuItem
  label="Quick open"
  shortcut={
    <>
      <Kbd aria-label="Command">⌘</Kbd> <Kbd>K</Kbd>
    </>
  }
/>
```

---

## 13. Story matrix

| Story file        | Story name    | Description                                                                                  |
| ----------------- | ------------- | -------------------------------------------------------------------------------------------- |
| `Kbd.stories.tsx` | `Playground`  | Controls-driven sandbox for `children`.                                                      |
| `Kbd.stories.tsx` | `SingleKey`   | `<Kbd>K</Kbd>` — verifies min-width square proportion for a single character.                |
| `Kbd.stories.tsx` | `SymbolKey`   | `<Kbd aria-label="Command">⌘</Kbd>` — verifies symbol rendering and accessible name pattern. |
| `Kbd.stories.tsx` | `WordKey`     | `<Kbd>Enter</Kbd>` — verifies a wider, multi-character key chip.                             |
| `Kbd.stories.tsx` | `Combination` | `⌘ K` composition — verifies side-by-side chips with consumer-owned separator.               |
| `Kbd.stories.tsx` | `InProse`     | Kbd embedded in `<p>` body text — verifies inline flow and proportional sizing.              |

---

## 14. Open questions for Arian

1. **Font weight: `500` vs `400`.** Heavier weight gives the chip
   mechanical presence; lighter would match Code more closely. Recommendation
   is `500` — distinguishes Kbd from Code at a glance, even when they sit
   next to each other.
2. **Min-width: `1.5em` vs `1.75em`.** Tighter min-width packs better in
   menu rows but loosens the square key-cap silhouette. Recommendation:
   `1.5em` as a balance.
3. **Symbol vs spelled-out keys.** Recommended default in DS docs is to
   pass the symbol with `aria-label="<name>"`. Confirm whether docs should
   show both patterns or favor one.
