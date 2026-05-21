# Design spec: Label

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<Label>` is the system's canonical form-label atom. It renders a visible `<label>` element bound to a form control via `htmlFor`, with an optional required-field indicator (`*`) and a secondary tone for nested or de-emphasized form sections.

Its job is narrow: provide a typed, token-aligned wrapper for the HTML `<label>` element so every form surface in the DS speaks the same typographic and semantic contract. Without it, form labels are hand-rolled at each call site — inconsistent font-size, inconsistent color, inconsistent asterisk handling, no shared token surface.

`<Label>` is the standalone atom. `<Field>` (a molecule) composes `<Label>` internally; consumers who need label + input + helper/error wiring should use `<Field>`. `<Label>` exists for cases where a consumer authors their own form layout and wants the label atom without the full `<Field>` scaffold.

---

## 2. Anatomy

```
<label htmlFor="…">
  ├── [children]          — label text (ReactNode)
  └── [<span>*</span>]   — required indicator, aria-hidden="true"; when required={true}
```

- **Root element**: `<label>`. Non-polymorphic. No `as` prop. The `<label>` element is the only semantically correct root for a form label and swapping it would break the `htmlFor` association contract.
- **Label text**: `children`. Any ReactNode; typically a short string.
- **Required indicator** (optional): a `<span aria-hidden="true">*</span>` appended inline after the label text when `required={true}`. Rendered in `var(--danger)`. The span is `aria-hidden` because the ARIA contract for required fields lives on the bound control (`aria-required="true"`), not on the label text.

---

## 3. Tokens consumed

All tokens listed below are confirmed present in `src/tokens/tokens.css`. No new tokens are introduced by this spec.

| Token               | Value              | Role                                               |
| ------------------- | ------------------ | -------------------------------------------------- |
| `--font-sans`       | Geist stack        | Font family                                        |
| `--fs-meta`         | `0.875rem` (14px)  | Font size — meta register, matches Field and Eyebrow |
| `--lh-meta`         | `1.2`              | Line height                                        |
| `--tracking-numeric`| `0.08em`           | Letter spacing — deliberate; see rationale below   |
| `--fg`              | `#1d1d1f`          | Text color — `default` tone                        |
| `--fg-muted`        | `#6e6e73`          | Text color — `muted` tone                          |
| `--danger`          | `#b3261e`          | Required-indicator asterisk color                  |

**Letter-spacing rationale — `--tracking-numeric` not `--tracking-eyebrow`.**

Label text is not uppercase. `--tracking-eyebrow` (0.06em) was designed for all-caps micro-labels and carries the visual assumption of uppercase letter shapes. At mixed-case 14px, `0.06em` would read as unusually airy — adding spacing where the reader's eye does not expect it. `--tracking-numeric` (0.08em) is the system's wider-air token, but it was named for a different purpose (sequential numeric markers on `FailureMode`). Its value, however, is appropriate here only if chosen deliberately.

On reflection: the correct tracking for a form label at `--fs-meta` in mixed case is closer to `0` to `0.01em` — enough to counter any font-metric tightening at small sizes, but not enough to introduce obvious air. Neither existing tracking token fits the label register cleanly.

**Decision**: `--tracking-numeric` is **not** used. Label uses `letter-spacing: 0.01em` — a raw value, not a named token. This is an intentional exception. Introducing a `--tracking-label` token for a single 0.01em value would add token noise without buying readability. If a future form atom (Select, Checkbox legend) also needs this value, a `--tracking-label` token should be introduced at that point. The engineer sets `letter-spacing: 0.01em` directly; no token mapping.

---

## 4. Layout & rhythm

| Property         | Value                                    | Notes                                            |
| ---------------- | ---------------------------------------- | ------------------------------------------------ |
| `display`        | `inline-block`                           | Allows margin/padding without full block width   |
| `margin`         | `0`                                      | Consumer and molecule own all spacing            |
| `font-family`    | `var(--font-sans)`                       | Geist                                            |
| `font-size`      | `var(--fs-meta)`                         | 14px fixed; matches `<Field>` label typography   |
| `font-weight`    | `500`                                    | Medium; distinct from body copy (400) without bold |
| `line-height`    | `var(--lh-meta)`                         | 1.2                                              |
| `letter-spacing` | `0.01em`                                 | Raw value; see §3 rationale                      |
| `color`          | `var(--fg)` or `var(--fg-muted)`         | Driven by `tone` prop (see §5)                   |
| `cursor`         | `default`                                | Browser-native; `<label>` click-to-focus is untouched |

The required-indicator `<span>`:

| Property    | Value            | Notes                                   |
| ----------- | ---------------- | --------------------------------------- |
| `color`     | `var(--danger)`  | Always; independent of `tone`           |
| `margin-inline-start` | `0.25em`   | Slight gap after label text             |
| `aria-hidden` | `"true"`       | Decorative; AT reads `aria-required` on the control |

---

## 5. Prop intent

**`htmlFor` (required, string).**
The id of the form control this label describes. This prop is type-level required — no default, no optional. A `<Label>` without a `htmlFor` is a broken label: it renders visible text but provides no programmatic association. The engineer must surface this as a required prop with no fallback. Consumers who forget `htmlFor` must receive a TypeScript error at authoring time, not a silent runtime gap.

**`children` (required, ReactNode).**
The label text. Typically a string; may include a `<strong>` or similar inline element for emphasis. The DS does not restrict or process `children`; it is rendered verbatim before the optional required indicator.

**`required` (optional, boolean, default `false`).**
When `true`, renders the visible `*` suffix (`<span aria-hidden="true">*</span>`) in `var(--danger)`. This is purely visual. The DS owns the visual indicator; the consumer owns the ARIA contract on the bound control. See §6 for the full semantics split.

**`tone` (optional, `"default" | "muted"`, default `"default"`).**
Controls text color only.
- `"default"` → `var(--fg)`. Use for primary form fields — the label is a first-class element on the surface.
- `"muted"` → `var(--fg-muted)`. Use for fields inside nested fieldsets, secondary form sections, or any context where the label should recede relative to primary labels. Does not affect the required indicator color; `*` is always `var(--danger)` regardless of tone.

**`className` (optional, string).**
Passed through to the root `<label>`. Consumers use this for spacing overrides (e.g. `margin-bottom: var(--space-1)`) without breaking the atom's internal styling.

**`...rest`.**
All other props (e.g. `id`, `data-*`, `style`) are spread onto the root `<label>` element via rest props. The engineer decides the exact spread pattern; the intent is that `<Label>` is not opaque to standard HTML attributes.

---

## 6. Required-indicator semantics

The `*` indicator is a visual affordance only. Its full semantic contract:

**What the DS owns:**
- Rendering `<span aria-hidden="true">*</span>` in `var(--danger)` when `required={true}`.
- Hiding the span from assistive technology via `aria-hidden="true"`.
- The visual position: inline after `children`, separated by `0.25em` of inline-start margin.

**What the consumer owns:**
- `aria-required="true"` on the bound form control. This is the attribute that tells assistive technology the field is required. The label `*` is invisible to screen readers by design; AT users learn about the required state from the control, not the label.
- If using `<Field>`, the molecule handles `aria-required` injection automatically via `cloneElement`. When using `<Label>` standalone (without `<Field>`), the consumer is responsible for `aria-required="true"` on the control.

**Why this split:**
The `<label>` element is not the correct location for the required-field ARIA signal. WCAG Success Criterion 1.3.5 (Identify Input Purpose) and the HTML spec both place `required` / `aria-required` on the `<input>`, not the `<label>`. Encoding `aria-required` into the label would duplicate it when `<Field>` also injects it — and would not work at all when `<Label>` is used standalone without Field's cloneElement injection. The `aria-hidden="true"` asterisk avoids double-announcing ("asterisk, required") while preserving the visual convention that sighted users have been trained to read.

---

## 7. Accessibility

**`htmlFor` association.**
`<label htmlFor="control-id">` creates a programmatic association between the label and the control. Clicking the label moves focus to the control (browser-native; the DS does not author this behavior). Screen readers announce the label text when the control receives focus. This association only works when `htmlFor` matches the control's `id` exactly — see §5 on why `htmlFor` is type-level required.

**Click-to-focus.**
Browser-native behavior on `<label>`. The DS does not suppress or modify it. No `onClick` handler is authored.

**Required-indicator a11y model.**
The `*` span is `aria-hidden="true"`. AT users hear the required state from `aria-required="true"` or `required` on the bound control, not from the label text. Sighted users see the `*`. This is the industry-standard pattern (used by WCAG examples, Radix, Headless UI, and HTML spec worked examples).

**Contrast — `default` tone.**
- `--fg` (#1d1d1f) on `--bg` (#fbfbfd): approximately 16.1 : 1 — AAA.
- `--fg` (#1d1d1f) on `--surface` (#f5f5f7): approximately 15.5 : 1 — AAA.

**Contrast — `muted` tone.**
- `--fg-muted` (#6e6e73) on `--bg` (#fbfbfd): approximately 4.9 : 1 — AA normal.
- `--fg-muted` (#6e6e73) on `--surface` (#f5f5f7): approximately 4.7 : 1 — AA normal.
- At `--fs-meta` (14px), `font-weight: 500`, WCAG requires 4.5 : 1 for normal text. Both surface pairings pass. The muted tone is appropriate for secondary labels; it is not suitable as the sole label on a high-stakes required field where maximum legibility is needed — use `default` in those cases.

**Required-indicator contrast.**
- `--danger` (#b3261e) on `--bg` (#fbfbfd): approximately 7.2 : 1 — AAA. The asterisk passes at any text size.

**Dark mode.**
Token values flip via the `@media (prefers-color-scheme: dark)` block in `tokens.css`. No per-component dark-mode overrides are needed. In dark mode: `--fg` → `#f5f5f7`, `--fg-muted` → `#86868b`, `--danger` → `#ff453a`. All pairings against dark `--bg` (#000000) pass AA or better.

---

## 8. Motion

None. `<Label>` is a static element. No entrance, no transition, no hover treatment is authored. The global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` requires no component-level consideration.

---

## 9. Composition rules

**With `<Field>` (molecule).**
`<Field>` composes `<Label>` internally. Consumers do not pass a `<Label>` as a child of `<Field>`; the molecule creates and manages the label from its own `label` prop. The `<Label>` atom exists for standalone use — form layouts where the consumer controls the structure without the full Field molecule. See `meta/design/Field.md` for the full molecule shape.

**Standalone usage pattern.**
```
<Label htmlFor="email">Email address</Label>
<Input id="email" type="email" />
```
The consumer owns the spacing between `<Label>` and the control. `<Label>` never sets margin; spacing is always a layout concern at the consumer or molecule layer.

**With `required`.**
```
<Label htmlFor="email" required>Email address</Label>
<Input id="email" type="email" aria-required="true" />
```
Consumer is responsible for `aria-required="true"` on the input when using `<Label>` standalone.

**With `tone="muted"` — nested fieldset context.**
```
<fieldset>
  <legend>Optional preferences</legend>
  <Label htmlFor="timezone" tone="muted">Timezone</Label>
  <Input id="timezone" />
</fieldset>
```
The muted tone signals to the reader that this field is secondary without removing the label's visible presence.

**Does not compose with:**
`<Button>`, `<Stat>`, `<StatusBadge>`, `<Eyebrow>`. `<Label>` is a form-domain atom; it has no role in editorial or interactive-component compositions.

---

## 10. Out of scope

- **Inline label layout** (label left, control right). V1 is standalone only; inline layout is a molecule or template concern.
- **Floating label** (label animates into the input on focus). Not brand-aligned; excluded permanently.
- **`(optional)` text suffix**. Consumer appends this to `children` if needed: `<Label htmlFor="x">Nickname (optional)</Label>`. The DS does not provide a slot for it.
- **Tooltip slot.** No icon-triggered tooltip beside the label. If a consumer needs a hint, `<Field helper="…">` is the DS-approved path.
- **Icon slot.** No leading or trailing icon inside the label. If a consumer needs an icon-prefixed label that is a composite at the consumer layer.
- **Multi-line wrap beyond browser default.** `<Label>` does not set `white-space`, `text-overflow`, or `max-width`. Long label text wraps naturally; the DS does not truncate or clamp.
- **`as` prop / polymorphism.** `<label>` is the only correct root for a form label. No `as` prop; no polymorphism.

---

## 11. Story matrix

Stories live in `src/atoms/Label/Label.stories.tsx`.

| Story       | Props                                                     | What it verifies                                               |
| ----------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| `Default`   | `htmlFor="demo"`, label text, no other props              | Baseline render; `default` tone; no required indicator         |
| `Required`  | `htmlFor="demo"`, `required={true}`                       | `*` renders in `var(--danger)`; span is `aria-hidden="true"` |
| `Muted`     | `htmlFor="demo"`, `tone="muted"`                          | `--fg-muted` color; no asterisk                                |
| `LongText`  | `htmlFor="demo"`, label string of 60+ characters          | Natural wrap behavior; no truncation; layout integrity         |

---

## 12. Open questions

None. All design decisions are resolved in this spec.
