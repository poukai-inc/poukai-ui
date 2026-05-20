# Design spec: Textarea

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design (spec authored inline with implementation)
**Last updated**: 2026-05-19

---

## 1. Purpose

`Textarea` is the canonical multi-line text input primitive for the Poukai design system. It wraps a native `<textarea>` element, applies brand styling via CSS Modules and tokens, and exposes an `invalid` prop for error-state styling. Default `rows={4}`, resize is vertical only.

**Primary use cases**: message fields, long-form text inputs inside form surfaces (contact forms inside `<Dialog>`, settings panes).

**Non-goals:**

- No character count display.
- No validation logic — consumer responsibility.
- No polymorphism — root is always `<textarea>`.
- No horizontal resize (resize locked to vertical).

---

## 2. Anatomy

Root is `<textarea>`. Non-polymorphic.

Props forwarded via `...rest` spread: `value`, `onChange`, `placeholder`, `rows`, `disabled`, `readOnly`, `required`, `aria-*`, `data-*`, etc.

---

## 3. Tokens consumed

| Token           | Role                                       |
| --------------- | ------------------------------------------ |
| `--bg-elevated` | Textarea background (front-most elevation) |
| `--hairline`    | Resting border color                       |
| `--fg-muted`    | Placeholder text; hover border             |
| `--fg`          | Textarea text color                        |
| `--accent`      | Focus ring + border (focus-visible only)   |
| `--danger`      | Error/invalid border                       |
| `--font-sans`   | Textarea font family                       |
| `--fs-body`     | Textarea font size                         |
| `--lh-body`     | Textarea line height                       |
| `--space-2`     | Vertical padding (block)                   |
| `--space-3`     | Horizontal padding (inline)                |
| `--radius-2`    | Border radius                              |
| `--dur-fast`    | Border-color transition duration           |
| `--easing`      | Border-color transition easing             |

No new tokens introduced.

---

## 4. States

| State         | Visual treatment                                                  |
| ------------- | ----------------------------------------------------------------- |
| Default       | `--hairline` border, `--bg-elevated` background                   |
| Hover         | Border shifts to `--fg-muted`                                     |
| Focus-visible | 2px `--accent` outline + `outline-offset: 2px`; border `--accent` |
| Invalid       | Border `--danger` (via `data-invalid="true"`)                     |
| Disabled      | `opacity: 0.5; cursor: not-allowed`                               |

**Error uses `--danger`** (`#b3261e`). The invalid border is a true danger red — distinct from `--accent` (blue) so the error register reads as wrong, not interactive.

---

## 5. Sizing

- Default `rows={4}`.
- `min-height: calc(var(--lh-body) * var(--fs-body) * 4)` — ensures minimum height corresponds to 4 lines of body text.
- `resize: vertical` — horizontal resize disabled; vertical resize allowed.

---

## 6. Accessibility

- `forwardRef<HTMLTextAreaElement, TextareaProps>` — ref to the root textarea.
- `...rest` spread — passes `aria-*`, `data-*`, event handlers.
- `invalid` prop sets both `data-invalid="true"` and `aria-invalid="true"`.
- Label association and `aria-describedby` are wired by `<Field>` — Textarea is label-agnostic.
- Standalone usage: consumer is responsible for `<label htmlFor>`.

---

## 7. Prop interface

```tsx
interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  invalid?: boolean;
}
```

---

## 8. Worked examples

```tsx
// Inside Field (recommended):
<Field label="Message" id="message">
  <Textarea placeholder="Tell us about your project…" rows={6} />
</Field>

// Error state (via Field):
<Field label="Message" error="Message is required.">
  <Textarea />
</Field>
```
