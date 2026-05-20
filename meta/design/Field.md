# Design spec: Field

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design (spec authored inline with implementation)
**Last updated**: 2026-05-19

---

## 1. Purpose

`Field` is the composition wrapper that wires a visible label, optional helper text, and optional error message to a single form control (`<Input>`, `<Textarea>`, or any HTML form element). It auto-generates `id` when not provided, links `<label htmlFor>`, and injects `aria-describedby`, `aria-invalid`, and `required` onto its child via `React.cloneElement`.

**Primary use cases**: wrapping `<Input>` and `<Textarea>` on any form surface.

**Non-goals:**

- No `<Form>` wrapper — that is a separate organism for a later round.
- No validation logic — consumer responsibility.
- No multi-field composition — one child per Field.
- No layout columns or grid — structural only.

---

## 2. Anatomy

```
[Field root — <div>]
  ├── [<label htmlFor={id}>]
  │     ├── label text
  │     └── [<span aria-hidden="true">*</span>]  — when required
  ├── [child control — cloneElement'd with id, aria-*, required]
  └── [<p id={errorId} role="alert">]   — when error is set
      or [<p id={helperId}>]            — when helper is set (and no error)
```

---

## 3. Tokens consumed

| Token         | Role                                          |
| ------------- | --------------------------------------------- |
| `--fs-meta`   | Label and helper/error font size (14px)       |
| `--lh-meta`   | Label and helper/error line height            |
| `--font-sans` | All text in the field wrapper                 |
| `--fg`        | Label text color; error text color            |
| `--fg-muted`  | Helper text color; required `*` indicator     |
| `--accent`    | Error message left-rule accent border         |
| `--space-1`   | Gap between elements; helper/error margin-top |
| `--space-2`   | Error message padding-inline-start            |

No new tokens introduced.

---

## 4. cloneElement behavior

Field clones its single `children` ReactElement and injects:

| Injected prop         | When                                                |
| --------------------- | --------------------------------------------------- |
| `id`                  | Always — wires the label's `htmlFor`                |
| `aria-describedby`    | When `helper` or `error` is set                     |
| `aria-invalid="true"` | When `error` is set                                 |
| `invalid={true}`      | When `error` is set (for DS Input/Textarea styling) |
| `required={true}`     | When `required` is set                              |

Consumer-supplied props on the child element that overlap with Field's injected props are overwritten by Field's values for id and aria wiring. `invalid` and `required` are merged additively.

---

## 5. Error vs. helper

- When `error` is set: error message renders with `role="alert"`, accent left-rule border. Helper text is hidden.
- When only `helper` is set: helper renders in `--fg-muted` register.
- Both absent: no text below the control.
- `aria-describedby` points at error id when error is present; helper id otherwise.

---

## 6. Accessibility

- `<label htmlFor={id}>` — always present, always visible.
- `id` — auto-generated via `useId` when not provided.
- Required `*` indicator is `aria-hidden="true"` — the `required` attribute on the input conveys to AT.
- `role="alert"` on error paragraph — announces error to screen readers on mount.
- `aria-describedby` — links helper or error text to the control.
- `aria-invalid="true"` — injected on child when `error` is set.
- `forwardRef<HTMLDivElement, FieldProps>` — ref to root div.

---

## 7. Prop interface

```tsx
interface FieldProps extends ComponentPropsWithoutRef<"div"> {
  label: string; // required visible label
  id?: string; // auto-generated if omitted
  helper?: string; // optional helper text
  error?: string; // optional error message; forces invalid state
  required?: boolean; // * indicator + required on child
  children: ReactElement; // exactly one form control
}
```

---

## 8. Worked examples

```tsx
// (a) Field + Input (email):
<Field label="Email address" id="email" helper="We'll never share your email.">
  <Input type="email" placeholder="you@example.com" />
</Field>

// (b) Field + Textarea (message):
<Field label="Message" id="message" helper="Tell us about your project.">
  <Textarea placeholder="What are you working on?" />
</Field>

// (c) Field with error state:
<Field label="Email address" id="email-err" error="Please enter a valid email address.">
  <Input type="email" defaultValue="not-an-email" />
</Field>

// (d) Standalone Input (no Field wrapper) — consumer owns label:
<label htmlFor="search">Search</label>
<Input id="search" type="search" />
```

---

## 9. Out of scope

- **Form wrapper organism.** Multi-field layout, submit handling, and validation orchestration are a separate organism (`<Form>`), planned for a later round.
- **Inline vs. stacked label.** V1 ships stacked only (label above input). Inline (label left, input right) is a future variant.
- **Floating label.** Not in scope — not brand-aligned.
- **Character count.** Excluded from Textarea. Consumer responsibility.
