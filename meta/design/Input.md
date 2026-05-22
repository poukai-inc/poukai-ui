# Design spec: Input

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-22

---

## 1. Purpose

`Input` is the canonical single-line text input **atom** in `@poukai-inc/ui` — the styled `<input>` element, nothing more. It owns the brand contract for height, border, focus ring, and invalid styling. It does **not** own its own label, helper text, or error message; those are the responsibility of the `<Field>` molecule (or a consumer-supplied `<label htmlFor>` when used standalone).

**Layer rationale.** Input was previously published as a molecule because the original Form spec needed label + helper + error packaged together. That conflated two layers: the styled control (atom) and the label/help/error composition (molecule). `Field` now owns the composition; Input is lifted to the atom layer alongside `Button`, `IconButton`, and the other interactive primitives.

**Primary use cases**: text, email, URL, tel, password, search, and number inputs inside form surfaces (waitlist forms, contact forms inside `<Dialog>`, settings panes).

**Non-goals (v1):**

- No polymorphism — root is always `<input>`.
- No leading / trailing slots — icon-prefix variants belong to a future `SearchField` molecule.
- No character count display — consumer responsibility.
- No validation logic — consumer responsibility (Zod, React Hook Form, etc.).
- No `type="checkbox" | "radio" | "file" | "range" | "date" | "color"` — each is a different visual primitive and will ship as its own atom.
- No per-size font scaling — `--fs-body` at every size; only height changes.

---

## 2. Anatomy

- **Root**: `<input>` element. Non-polymorphic.
- **Ref**: `forwardRef<HTMLInputElement, InputProps>` — ref attaches to the root input.
- **Prop spread**: `...rest` forwards `value`, `onChange`, `placeholder`, `disabled`, `readOnly`, `required`, `autoComplete`, `name`, `aria-*`, `data-*`, and every event handler the consumer supplies.
- **Focus ring**: 2px solid `--accent` outline with 2px outline-offset on `:focus-visible`. Sits outside the border-box.

---

## 3. Tokens consumed

| Token           | Role                                                         |
| --------------- | ------------------------------------------------------------ |
| `--bg-elevated` | Input background fill (white; front-most control surface)    |
| `--hairline`    | Resting border color                                         |
| `--fg-muted`    | Placeholder text; hover border color                         |
| `--fg`          | Input text color                                             |
| `--accent`      | Focus-visible outline + focus border                         |
| `--danger`      | Invalid-state border color                                   |
| `--font-sans`   | Input font family (Geist)                                    |
| `--fs-body`     | Input font size — same at all sizes                          |
| `--lh-body`     | Input line height                                            |
| `--space-2`     | Vertical (block) padding                                     |
| `--space-3`     | Horizontal (inline) padding                                  |
| `--radius-2`    | Border radius                                                |
| `--dur-fast`    | Transition duration for border-color / box-shadow            |
| `--easing`      | Transition easing                                            |
| `--btn-h-sm`    | `min-height` for `size="sm"` (32px) — shared with `<Button>` |
| `--btn-h-md`    | `min-height` for `size="md"` (44px) — shared with `<Button>` |
| `--btn-h-lg`    | `min-height` for `size="lg"` (52px) — shared with `<Button>` |

No new tokens introduced.

**Why reuse `--btn-h-*`.** Inputs and buttons routinely sit on the same row (newsletter signup, search bar, login form). Sharing the height ladder guarantees `<Input size="md">` next to `<Button size="md">` pairs visually without ad-hoc CSS.

---

## 4. Size axis

Closed union: `size: "sm" | "md" | "lg"`. Default `"md"`.

| Size | `min-height`             | Pairs with           |
| ---- | ------------------------ | -------------------- |
| `sm` | `var(--btn-h-sm)` = 32px | `<Button size="sm">` |
| `md` | `var(--btn-h-md)` = 44px | `<Button size="md">` |
| `lg` | `var(--btn-h-lg)` = 52px | `<Button size="lg">` |

Padding stays constant across sizes: `--space-2` block / `--space-3` inline. Font-size is `--fs-body` at every size — only height changes.

**Size prop vs native HTML `size`.** The native `<input size>` attribute controls visible character width in mono-width contexts and is rarely used in modern layouts. The DS `size` prop intentionally shadows it (via `Omit<…, "size">`), matching the precedent set by `Button`, `IconButton`, `Avatar`, and `Stat`.

---

## 5. States

| State                                                   | Visual treatment                                                                   |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Rest                                                    | `--bg-elevated` bg, 1px `--hairline` border, `--fg` text, `--fg-muted` placeholder |
| Hover (`@media (hover: hover)`, not disabled/readonly)  | Border → `--fg-muted`                                                              |
| `:focus-visible`                                        | 2px `--accent` outline + 2px offset; border → `--accent`                           |
| Disabled (`:disabled`)                                  | `opacity: 0.5; cursor: not-allowed`; no hover border shift                         |
| Readonly (`:read-only`)                                 | `cursor: default`; no hover border shift; border same as rest                      |
| Invalid (`data-invalid="true"` / `aria-invalid="true"`) | Border → `--danger`                                                                |

**Focus inside invalid.** When an invalid input is focused, the outline stays `--accent`. Focus is an interactive-state register ("where you are"); invalid is an error register ("what is wrong"). Swapping focus color to danger collapses those registers. The border remains `--danger` during focus so the error register is still visible.

---

## 6. Accessibility

- `forwardRef<HTMLInputElement, InputProps>` — ref attaches to the root input.
- `...rest` spread — passes every `aria-*` and `data-*`.
- `invalid` prop sets both `data-invalid="true"` and `aria-invalid="true"` on the root.
- Label association is owned by the wrapper: `<Field>` (auto-wires `htmlFor` / `id` / `aria-describedby` via `cloneElement`) or a consumer-supplied `<label htmlFor>` in standalone use.
- `required` is forwarded native; visible `*` indicators are Field's responsibility.
- Focus ring: `--accent` on `--bg-elevated` clears WCAG 2.4.7 non-text contrast (≥ 3 : 1).
- Tap target: `sm` (32px) is AA only; `md` and `lg` clear AAA (44px+). Document for consumers requiring AAA on specific surfaces.

---

## 7. Prop interface

```tsx
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  /**
   * Constrained to single-line text-like types.
   * @default "text"
   */
  type?: "text" | "email" | "url" | "tel" | "search" | "password" | "number";

  /**
   * Visual size — maps to the shared `--btn-h-*` height ladder.
   * @default "md"
   */
  size?: InputSize;

  /**
   * Error-state styling. Sets `data-invalid="true"` and `aria-invalid="true"`.
   * Prefer wiring through `<Field error="…">`.
   */
  invalid?: boolean;
}
```

---

## 8. Motion

Per `meta/brand.md` §Allowlist, only `--dur-fast` color / border / box-shadow transitions are permitted:

```css
transition:
  border-color var(--dur-fast) var(--easing),
  box-shadow var(--dur-fast) var(--easing);
```

No transitions on `height`, `width`, `padding`, `transform`. Disabled opacity snap is intentional. Reduced-motion handled by the global `@media (prefers-reduced-motion: reduce)` block in `tokens.css`.

---

## 9. Worked examples

```tsx
// (a) Inside Field — canonical pattern:
<Field label="Email address" id="email" helper="We'll never share your email.">
  <Input type="email" placeholder="you@example.com" />
</Field>

// (b) Standalone — consumer owns label:
<label htmlFor="search">Search</label>
<Input id="search" type="search" placeholder="Search docs…" />

// (c) Error via Field:
<Field label="Email" id="email-err" error="Please enter a valid email.">
  <Input type="email" defaultValue="not-an-email" />
</Field>

// (d) Size paired with Button on the same row:
<div style={{ display: "flex", gap: "var(--space-2)" }}>
  <Input size="sm" placeholder="sm" />
  <Button size="sm">Send</Button>
</div>
<div style={{ display: "flex", gap: "var(--space-2)" }}>
  <Input size="md" placeholder="md" />
  <Button size="md">Send</Button>
</div>
<div style={{ display: "flex", gap: "var(--space-2)" }}>
  <Input size="lg" placeholder="lg" />
  <Button size="lg">Send</Button>
</div>
```

---

## 10. Migration note

Input was previously published as a molecule at `src/molecules/Input/`. In 1.x it is lifted to `src/atoms/Input/`. The molecule path remains as a deprecated re-export that forwards to the atom — consumers importing `@poukai-inc/ui/molecules/Input` continue to work unchanged in the 1.x line. The molecule path will be removed in 2.0; consumers should switch to `@poukai-inc/ui/atoms/Input` at their convenience.

The runtime behavior, existing prop surface, CSS class structure, and DOM output are identical. The lift adds one new prop (`size`, default `"md"` — zero breaking change) and corrects the atomic-layer classification.
