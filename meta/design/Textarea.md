# Design spec: Textarea

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`Textarea` is the canonical multi-line text-input primitive for the Poukai design system. It is an **atom** — a pure styled `<textarea>` element. It owns visual register, focus choreography, and invalid styling, and nothing else.

It does **not** own its label, helper text, or error message. Those concerns live in `<Field>`, which composes the Textarea atom with label/helper/error in the same surface contract used for `<Input>`. Consumers who need standalone usage own their own `<label htmlFor>`.

**Primary use cases**: message fields, long-form text inputs inside form surfaces (contact forms inside `<Dialog>`, settings panes, support inboxes).

**Non-goals (v1):**

- No character-count display.
- No validation logic — consumer responsibility (Zod, React Hook Form, etc.).
- No polymorphism — root is always `<textarea>`.
- No prefix/suffix slots.
- **No autosize / content-height tracking.** Consumers who need autosize compose a future utility hook (`useAutosizeTextarea`) on top of this atom. Tracked separately. Adding autosize into the atom would couple layout side-effects to the primitive and prevent SSR from rendering correctly.

---

## 2. Anatomy

Root is `<textarea>`. Non-polymorphic. Ref forwarded to the underlying `HTMLTextAreaElement`.

All visible labelling is the consumer's responsibility — either via `<Field>` (recommended) or a manual `<label htmlFor>` pair. The atom emits no label of its own and exposes no `label` prop.

Props forwarded via `...rest` spread: `value`, `onChange`, `placeholder`, `disabled`, `readOnly`, `required`, `name`, `aria-*`, `data-*`, etc.

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
| `--space-3`     | Block + inline padding (symmetric)         |
| `--radius-2`    | Border radius                              |
| `--dur-fast`    | Border-color transition duration           |
| `--easing`      | Border-color transition easing             |

Tokens consumed are a strict subset of the `Input` atom's token list. No new tokens introduced.

**Padding contract** is the only visual delta from `Input`: Textarea uses `--space-3` on **all four sides** (symmetric), where Input uses `--space-2` block / `--space-3` inline. Multi-line content needs equal vertical headroom on both edges so the first and last lines do not feel cramped against the border.

---

## 4. States

| State         | Visual treatment                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Default       | `--hairline` border, `--bg-elevated` background                                                         |
| Hover         | Border shifts to `--fg-muted` (gated on `@media (hover: hover)`)                                        |
| Focus-visible | 2px `--accent` outline + `outline-offset: 2px`; border `--accent`                                       |
| Readonly      | Same border + background as default; cursor unchanged; placeholder + value visible; no focus-ring drift |
| Invalid       | Border `--danger` (via `data-invalid="true"` / `aria-invalid="true"`)                                   |
| Disabled      | `opacity: 0.5; cursor: not-allowed`                                                                     |

Visual register mirrors the `Input` atom exactly — same tokens, same border-color choreography, same outline-offset. A Textarea and an Input stacked inside the same `<Field>` must read as the same surface tier.

Invalid state uses `--danger` (`#b3261e`). Distinct from `--accent` (blue) so the error register reads as wrong, not interactive.

---

## 5. Sizing

- `rows` prop — default `3`. Drives the natural rendered height. Consumer overrides as needed (`rows={6}` for long-form contact-form messages, `rows={2}` for short notes).
- `resize` prop — `"vertical" | "none" | "both"`, default `"vertical"`. Maps directly to the CSS `resize` property on the root.
  - `"vertical"` (default) — user can grow/shrink height; width is locked to the parent container.
  - `"none"` — resize handle hidden; height fixed by `rows`.
  - `"both"` — both axes draggable. Use sparingly; horizontal resize breaks responsive layouts in most surfaces.
- No hard-coded `min-height` rule. `rows` is the canonical height knob.

---

## 6. Accessibility

- `forwardRef<HTMLTextAreaElement, TextareaProps>` — ref points at the root textarea.
- `...rest` spread — passes `aria-*`, `data-*`, event handlers, `name`, etc.
- `invalid` prop sets both `data-invalid="true"` (styling hook) and `aria-invalid="true"` (assistive-tech signal). The two always agree.
- Label association and `aria-describedby` are wired by `<Field>` — Textarea is label-agnostic.
- Standalone usage: consumer is responsible for `<label htmlFor>`.

---

## 7. Prop interface

```tsx
type Resize = "vertical" | "none" | "both";

interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  /**
   * Default: 3.
   */
  rows?: number;
  /**
   * Default: "vertical".
   */
  resize?: Resize;
  /**
   * When true, applies error-state styling via `data-invalid="true"` and
   * `aria-invalid="true"` on the root element. Prefer wiring through
   * `<Field error="…">` rather than setting directly — Field handles both
   * the visual state and the aria-describedby link.
   */
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

// Standalone (consumer owns label):
<label htmlFor="notes">Notes</label>
<Textarea id="notes" rows={4} />

// Resize locked — fixed-height note:
<Field label="Internal note">
  <Textarea rows={2} resize="none" placeholder="Short note…" />
</Field>

// Error state (via Field):
<Field label="Message" error="Message is required.">
  <Textarea />
</Field>
```
