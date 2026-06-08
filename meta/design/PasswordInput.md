# Design spec: PasswordInput

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-06-08

---

## 1. Purpose

`PasswordInput` is the canonical masked-credential input **atom** in `@poukai-inc/ui` — an `<Input type="password">` with a built-in show/hide reveal toggle. It owns one job: let a user verify what they typed without unmasking the field permanently. It does **not** own its own label, helper text, or error message; those are the responsibility of the `<Field>` molecule (or a consumer-supplied `<label htmlFor>` when used standalone).

**Composition, not a fork.** PasswordInput does not re-implement the styled control. It composes the existing `Input` atom (for the field) and the existing `IconButton` atom (for the toggle). It inherits Input's height ladder, border, focus ring, and invalid styling unchanged, and adds only a positioned toggle button plus the show/hide state. This keeps the brand contract in one place (`Input`) and makes PasswordInput a thin, stateful wrapper.

**Primary use cases**: login forms, sign-up forms, password-change panes, and any credential entry inside form surfaces (`<Field>`, `<Form>`, `<Dialog>`).

**Non-goals (v1):**

- No `type` prop — the field is always a password field; the toggle flips it to `text` transiently. (Use `<Input>` for non-password types.)
- No strength meter — consumer responsibility (separate future molecule).
- No generate / suggest-password affordance — consumer responsibility.
- No validation logic — consumer responsibility (Zod, React Hook Form, etc.).
- No leading icon slot — same posture as `Input`.
- No controlled `shown` prop in v1 — the reveal state is internal. (A controlled API may be added later without a breaking change.)

---

## 2. Anatomy

- **Root**: `<div>` wrapper with `position: relative`. Hosts the input and the absolutely-positioned toggle.
- **Field**: the `Input` atom, rendered with `type="password"` (or `type="text"` while revealed). Carries extra inline-end padding so a long value never slides under the toggle.
- **Toggle**: a `ghost` `IconButton` at `size="sm"`, absolutely positioned at the inline-end of the field, vertically centred. Renders the Lucide `Eye` glyph when masked and `EyeOff` when revealed.
- **Ref**: `forwardRef<HTMLInputElement, PasswordInputProps>` — ref attaches to the underlying `<input>` (not the wrapper), so consumers can focus / select the field directly.
- **Prop spread**: `...rest` forwards `value`, `onChange`, `placeholder`, `disabled`, `readOnly`, `required`, `autoComplete`, `name`, `aria-*`, `data-*`, and every event handler onto the underlying `Input`.

---

## 3. Tokens consumed

PasswordInput introduces **no new tokens**. It inherits every visual token through the composed `Input` and `IconButton` atoms, and uses three existing tokens for its own layout-only concerns:

| Token        | Role                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| `--btn-h-sm` | Inline-end padding reservation on the field; matches the toggle's width |
| `--space-1`  | Inline-end inset of the toggle from the field edge                      |
| `--space-2`  | Added to `--btn-h-sm` so the value never touches the toggle             |

All color, border, focus, height, font, and radius tokens are inherited from `Input` (see `meta/design/Input.md` §3) and `IconButton` (Button token ladder). No new tokens introduced.

---

## 4. Size axis

Closed union: `size: "sm" | "md" | "lg"`. Default `"md"`. The `size` prop is forwarded straight to the composed `Input`, so the field height follows the shared `--btn-h-*` ladder exactly like `Input` and `Select`.

| Size | Field `min-height`       | Pairs with           |
| ---- | ------------------------ | -------------------- |
| `sm` | `var(--btn-h-sm)` = 32px | `<Button size="sm">` |
| `md` | `var(--btn-h-md)` = 44px | `<Button size="md">` |
| `lg` | `var(--btn-h-lg)` = 52px | `<Button size="lg">` |

The reveal toggle stays at `IconButton size="sm"` (32px square) at every field size. A fixed-size toggle inside a taller field reads as a contained affordance rather than a second control competing with the field height; the `--space-1` inset and vertical centering keep it visually anchored.

**Size prop vs native HTML `size`.** As with `Input`, the DS `size` prop shadows the rarely-used native `<input size>` attribute via `Omit<…, "size">`.

---

## 5. States

All field states (rest, hover, focus-visible, disabled, readonly, invalid) are inherited unchanged from the `Input` atom — see `meta/design/Input.md` §5. PasswordInput adds the reveal dimension:

| State            | Treatment                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Masked (default) | Field is `type="password"`; toggle shows Lucide `Eye`, `aria-pressed="false"`, label = `revealLabel` |
| Revealed         | Field is `type="text"`; toggle shows Lucide `EyeOff`, `aria-pressed="true"`, label = `hideLabel`     |

The toggle inherits all `IconButton` / `Button` ghost states (hover, focus-visible, disabled). When the field is `disabled`, the consumer should also disable the toggle (pass `disabled` through `...rest` only reaches the input — see §6 note).

**Why type-flip, not CSS.** Unmasking is done by switching the input `type` between `password` and `text`, not via `-webkit-text-security` or a font trick. The native type switch is the only approach that reliably exposes the cleartext to assistive tech and the browser's own reveal heuristics.

---

## 6. Accessibility

- `forwardRef<HTMLInputElement, PasswordInputProps>` — ref attaches to the underlying `<input>`.
- `...rest` spread forwards every `aria-*` and `data-*` onto the input, so label association via `<Field>` (auto-wired `htmlFor` / `id` / `aria-describedby`) or a standalone `<label htmlFor>` works exactly as it does for `Input`.
- The toggle is a real `<button type="button">` (via `IconButton`), so it never submits the surrounding form and is keyboard-reachable.
- The toggle carries `aria-pressed` reflecting the reveal state, and an `aria-label` that flips between `revealLabel` ("Show password") and `hideLabel` ("Hide password"). Both labels are overridable for localization.
- `aria-label` on `IconButton` is mandatory at the type level, so the toggle always has an accessible name.
- The toggle is excluded from the field's tab-into focus only by natural DOM order — it follows the input. Focus ring (`--accent`) is inherited from Button.
- Tap target: the toggle is `sm` (32px), AA per WCAG 2.5.5; document for consumers requiring AAA.

> **Note.** In v1 the `disabled` / `readOnly` props reach only the underlying input (via `...rest`); the toggle is not auto-disabled. Consumers wanting a fully inert disabled field should render the field read-only and visually communicate state through `<Field>`.

---

## 7. Prop interface

```tsx
export interface PasswordInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size" | "type"
> {
  /**
   * Visual size — maps to the shared `--btn-h-*` height ladder.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";

  /**
   * Error-state styling, forwarded to the underlying Input
   * (`data-invalid` / `aria-invalid`). Prefer wiring through `<Field>`.
   */
  invalid?: boolean;

  /**
   * Accessible label for the reveal toggle while the password is masked.
   * @default "Show password"
   */
  revealLabel?: string;

  /**
   * Accessible label for the reveal toggle while the password is shown.
   * @default "Hide password"
   */
  hideLabel?: string;
}
```

`type` is intentionally omitted — the field is always a password field, toggled to `text` transiently by the reveal control.

---

## 8. Motion

No PasswordInput-specific motion. The field's `--dur-fast` border / box-shadow transitions are inherited from `Input` (see `meta/design/Input.md` §8); the toggle's hover / focus transitions are inherited from Button. The masked↔revealed switch is an instant `type` change with no animation. Reduced-motion is handled globally in `tokens.css`.

---

## 9. Worked examples

```tsx
// (a) Inside Field — canonical pattern:
<Field label="Password" id="password">
  <PasswordInput autoComplete="current-password" />
</Field>

// (b) Sign-up with a new-password autocomplete hint:
<Field label="Choose a password" id="new-password" helper="At least 12 characters.">
  <PasswordInput autoComplete="new-password" />
</Field>

// (c) Localized toggle labels:
<Field label="Contraseña" id="pw-es">
  <PasswordInput revealLabel="Mostrar contraseña" hideLabel="Ocultar contraseña" />
</Field>

// (d) Error via Field:
<Field label="Password" id="pw-err" error="Password is too short.">
  <PasswordInput invalid defaultValue="abc" />
</Field>
```

---

## 10. Implementation note

PasswordInput is `"use client"` — it holds reveal state with `useState` and must run on the client. It is a pure composition of two shipped atoms (`Input` + `IconButton`) plus three layout tokens (`--btn-h-sm`, `--space-1`, `--space-2`); it adds no new tokens and no new runtime dependency (Lucide `Eye` / `EyeOff` come from `lucide-react`, already a peer of the `Icon` atom).
