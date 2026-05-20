# Design spec: Input

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design (spec authored inline with implementation)
**Last updated**: 2026-05-19

---

## 1. Purpose

`Input` is the canonical single-line text input primitive for the Poukai design system. It wraps a native `<input>` element, applies brand styling via CSS Modules and tokens, and exposes an `invalid` prop for error-state styling. It is non-polymorphic and non-interactive beyond standard HTML input behavior.

**Primary use cases**: text, email, URL, tel, password, search, and number inputs inside form surfaces (waitlist forms, contact forms inside `<Dialog>`, settings panes).

**Non-goals:**

- No prefix/suffix icon slots (v1 minimal surface).
- No validation logic — consumer responsibility (Zod, React Hook Form, etc.).
- No polymorphism — root is always `<input>`.
- No character count display.

---

## 2. Anatomy

Root is `<input>`. Non-polymorphic.

Props forwarded via `...rest` spread: `value`, `onChange`, `placeholder`, `disabled`, `readOnly`, `required`, `autoComplete`, `aria-*`, `data-*`, etc.

---

## 3. Tokens consumed

| Token           | Role                                    |
| --------------- | --------------------------------------- |
| `--bg-elevated` | Input background (front-most elevation) |
| `--hairline`    | Resting border color                    |
| `--fg-muted`    | Placeholder text; hover border          |
| `--fg`          | Input text color                        |
| `--accent`      | Focus ring + border; error border       |
| `--font-sans`   | Input font family                       |
| `--fs-body`     | Input font size                         |
| `--lh-body`     | Input line height                       |
| `--space-2`     | Vertical padding (block)                |
| `--space-3`     | Horizontal padding (inline)             |
| `--radius-2`    | Border radius                           |
| `--dur-fast`    | Border-color transition duration        |
| `--easing`      | Border-color transition easing          |

No new tokens introduced.

---

## 4. States

| State         | Visual treatment                                                  |
| ------------- | ----------------------------------------------------------------- |
| Default       | `--hairline` border, `--bg-elevated` background                   |
| Hover         | Border shifts to `--fg-muted`                                     |
| Focus-visible | 2px `--accent` outline + `outline-offset: 2px`; border `--accent` |
| Invalid       | Border `--accent` (via `data-invalid="true"`)                     |
| Disabled      | `opacity: 0.5; cursor: not-allowed`                               |

**Error uses `--accent`**, not a dedicated danger token. The DS does not ship a danger token. This is the correct register for v1.

---

## 5. Accessibility

- `forwardRef<HTMLInputElement, InputProps>` — ref to the root input.
- `...rest` spread — passes `aria-*`, `data-*`, event handlers.
- `invalid` prop sets both `data-invalid="true"` and `aria-invalid="true"`.
- Label association and `aria-describedby` are wired by `<Field>` — Input is label-agnostic.
- Standalone usage: consumer is responsible for `<label htmlFor>`.

---

## 6. Prop interface

```tsx
interface InputProps extends ComponentPropsWithoutRef<"input"> {
  type?: "text" | "email" | "url" | "tel" | "password" | "search" | "number";
  invalid?: boolean;
}
```

---

## 7. Worked examples

```tsx
// Inside Field (recommended):
<Field label="Email" id="email">
  <Input type="email" placeholder="you@example.com" />
</Field>

// Standalone (consumer owns label):
<label htmlFor="search">Search</label>
<Input id="search" type="search" />

// Error state (via Field):
<Field label="Email" error="Please enter a valid email.">
  <Input type="email" defaultValue="bad-email" />
</Field>
```
