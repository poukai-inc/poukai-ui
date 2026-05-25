# NewsletterField

**Status**: Approved

## 1. Intent

`NewsletterField` is the inline email-capture primitive: a single-row `<form>` that pairs an email `<input>` with a submit `<Button>`. It serves footer newsletter signups, end-of-post blog subscriptions, and launch waitlists — any surface where the conversion moment is a one-field form rather than a multi-step flow. The molecule owns the field/button composition and its inline layout; the consumer owns the submission handler (native `action` URL or controlled `onSubmit`).

## 2. Anatomy

```
┌─────────────────────────────────────────────┐
│  <form>                                      │
│  ┌──────────────────────────┐ ┌────────────┐ │
│  │ <input type="email">     │ │ <Button>   │ │
│  └──────────────────────────┘ └────────────┘ │
│  [optional: FieldNote / error message slot]  │
└─────────────────────────────────────────────┘
```

- **Root**: `<form>` — native form element; supports both `action` (native POST) and `onSubmit` (JS-controlled).
- **Input**: `<input type="email">` — browser-native email validation; styled to DS tokens. Fills available width.
- **Button**: `<Button variant="primary" size="compact">` — the submit affordance. Label from `cta` prop.
- **Note slot** (optional): a `<p>` below the row for privacy notices or error messages (`--fg-muted`, `--fs-meta`).

## 3. Tokens

- `--font-sans` — input and button typography
- `--fs-body` — input font size (matches `Button` `compact` register)
- `--fs-meta` — note slot font size
- `--fg` — input text color
- `--fg-muted` — placeholder text color; note slot color
- `--bg-elevated` — input background (elevated surface, clearly a field)
- `--hairline` — input border at rest
- `--hairline-w` — input border width
- `--accent` — input focus ring color; `:focus-visible` outline
- `--radius-2` — input and button corner radius (4px)
- `--space-2` — gap between input and button
- `--space-4` — padding-inline inside the input
- `--space-1` — padding-block inside the input (pairs with `--btn-h-compact` for height alignment)
- `--btn-h-compact` — drives `min-height` of the input row (40px) so input and button align optically
- `--dur-fast` — border-color and outline transition on the input
- `--easing` — transition easing for input focus state

## 4. Variants / Props

| Prop          | Type                            | Default             | Rationale                                                                                                             |
| ------------- | ------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `action`      | `string \| undefined`           | `undefined`         | Native form `action` for progressive enhancement / server actions.                                                    |
| `method`      | `"get" \| "post"`               | `"post"`            | Standard form method when `action` is set.                                                                            |
| `onSubmit`    | `FormEventHandler \| undefined` | `undefined`         | JS-controlled submission. Coexists with `action`.                                                                     |
| `placeholder` | `string`                        | `"you@example.com"` | Descriptive; reinforces expected format.                                                                              |
| `cta`         | `string`                        | `"Subscribe"`       | Button label. Surfaces vary: "Subscribe", "Join waitlist", "Notify me".                                               |
| `name`        | `string`                        | `"email"`           | Input `name` attribute — required for native form submission.                                                         |
| `disabled`    | `boolean`                       | `false`             | Disables both input and button; propagated to both children.                                                          |
| `note`        | `ReactNode \| undefined`        | `undefined`         | Privacy copy or inline error. Renders below the row in `--fg-muted` at `--fs-meta`.                                   |
| `size`        | `"compact" \| "md"`             | `"compact"`         | Maps to Button size. `compact` (40px) is correct for inline footer placement; `md` (44px) for section-hero placement. |

No `value` / `defaultValue` prop at the molecule layer — the input is uncontrolled by default and controlled only when the consumer passes `onSubmit` and manages state at that level. The molecule does not own email-validation state; that belongs to the consumer.

## 5. Interaction

- **Submit**: `Enter` in the input submits the form (native browser behavior). The Button is `type="submit"`.
- **Focus order**: input → button (left-to-right, matches visual order).
- **Input focus**: `outline: 2px solid var(--accent)` with `2px offset` on `:focus-visible`; border-color transitions to `--accent` over `--dur-fast`.
- **Button hover/active**: inherits all Button states unchanged.
- **Disabled**: `disabled` attribute on both input and button; `opacity: 0.5`, `pointer-events: none` on input.
- **Email validation**: browser-native (`type="email"`) surfaces an inline error on submit if the value is not a valid email address. No custom validation UI is prescribed — that belongs to a form library or the consumer's `onSubmit` handler.
- **Loading/success state**: out of scope for this version. Consumer wraps the molecule and sets `disabled` during pending, swaps it for a confirmation message on success.

## 6. A11y

- **Semantic root**: `<form>`. If the NewsletterField sits inside a larger `<form>`, the consumer must render it without the `<form>` root (use the `asForm={false}` prop escape hatch) to avoid nested forms.
- **Label**: the `<input>` must have an accessible label. Default implementation uses a visually hidden `<label>` (via `VisuallyHidden`) with text matching the `placeholder`. The visual label is omitted to preserve the compact inline layout; the a11y label is never omitted.
- **`aria-label` on form**: `<form aria-label="Newsletter signup">` by default. Consumer may override via `formAriaLabel` prop.
- **Button type**: `type="submit"` — submits the parent form on activation (click or `Enter`). Never `type="button"`.
- **Contrast**: `--fg` on `--bg-elevated` (≈ 16.29:1, AAA). `--fg-muted` on `--bg` for placeholder/note (≈ 4.91:1, AA at 14px+).
- **Keyboard**: full keyboard-operable via native form semantics. No custom key handlers.

## 7. Motion

- Input border-color transition on focus: `border-color var(--dur-fast) var(--easing)`.
- No entrance animation on the molecule itself — parent page/section owns stagger.
- `prefers-reduced-motion`: the global clamp in `tokens.css` reduces all `transition-duration` to `0.01ms`; no component-level override needed.

## 8. Anti-patterns

- **Do not use for multi-field forms.** A name + email + message contact form is `Fieldset` + individual `Field` atoms, not a NewsletterField.
- **Do not use as a search field.** `SearchField` is the correct primitive; it carries `role="search"`, a leading icon, and a clear button — none of which belong here.
- **Do not put NewsletterField inside another `<form>`.** Nested forms are invalid HTML. Use `asForm={false}` if embedding in an existing form context.
- **Do not own validation UI inside this molecule.** Error display belongs in the `note` slot or the consumer's form library. This molecule does not manage field-level error state.
- **Do not use the `note` slot for marketing copy that is not directly related to the form.** The note is for privacy notices ("No spam. Unsubscribe any time.") and inline errors — not for additional promotional text, which belongs in the parent section.

## 9. Depends on

- `Button` — the submit affordance (already shipped, atom layer).
- `VisuallyHidden` — accessible label for the email input (if not yet shipped, engineer adds inline visually-hidden CSS until it lands).

## Open questions

- **`asForm` escape hatch naming**: the prop that renders the root as a `<div>` instead of `<form>` (for nested-form avoidance) needs a name. `asForm={false}` is descriptive but inverted logic. Alternative: `renderAsForm={false}`. Confirm preferred convention before implementation.
- **`bg-elevated` for input background**: `--bg-elevated` (#ffffff light, #1c1c1e dark) is the front-most surface token, chosen here so the input field reads as elevated above the surrounding page or footer surface. Confirm this is the correct elevation tier — if the molecule lands on `--bg-elevated` surfaces (e.g. inside a modal), input and modal background would be indistinguishable. A dedicated `--input-bg` token would resolve this ambiguity but falls outside Phase 1's no-new-tokens constraint.
