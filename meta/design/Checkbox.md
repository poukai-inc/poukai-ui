# Design spec: Checkbox

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-22
**Version**: 1.0.0

---

## 1. Purpose

`Checkbox` is the canonical boolean-selection control for the Poukai design system. It wraps `@radix-ui/react-checkbox` (`Checkbox.Root` + `Checkbox.Indicator`) and owns exactly one thing: the control and its indicator glyph. It is non-polymorphic, non-labeled, and carries no layout concern. Its sole visual job is to communicate one of three states — unchecked, checked, or indeterminate — at a fixed 16 × 16 footprint, using the brand's token stack.

Label pairing, helper text, error messaging, and `htmlFor` wiring are the molecule layer's responsibility (a `CheckboxField` or equivalent composition). Checkbox is intentionally label-agnostic so it can be embedded into any molecule without carrying label assumptions.

---

## 2. Dependencies

| Dependency                 | Role                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `@radix-ui/react-checkbox` | Radix primitive — manages `aria-checked`, `data-state`, keyboard, form association |
| `lucide-react`             | Peer dep — `Check` (checked) and `Minus` (indeterminate) glyphs at 12px            |
| `src/tokens/tokens.css`    | All visual values                                                                  |

---

## 3. Geometry & tokens

| Property            | Value | Token                                                      |
| ------------------- | ----- | ---------------------------------------------------------- |
| Width               | 16px  | `--icon-sm`                                                |
| Height              | 16px  | `--icon-sm`                                                |
| Border radius       | 2px   | `--radius-1`                                               |
| Border width        | 1px   | —                                                          |
| Indicator icon size | 12px  | literal (no token rung at 12px that matches this semantic) |

**Rationale — `--radius-1` (2px) over `--radius-2` (4px):** At 16px, a 4px radius makes the control read as nearly pill-shaped. 2px is the minimum perceptible rounding that avoids a raw square without losing the checkbox register.

**Rationale — indicator size 12px:** `--icon-xs` is 12px but its semantic is "compact pill / dense label row." Using it for an indicator glyph inside a 16px control would be a semantic mismatch. The literal `12` is passed as the Lucide `size` prop.

---

## 4. Color tokens by state

| State                             | Background                    | Border            | Indicator color                          |
| --------------------------------- | ----------------------------- | ----------------- | ---------------------------------------- |
| Unchecked (resting)               | `var(--bg)`                   | `var(--hairline)` | —                                        |
| Checked                           | `var(--fg)`                   | `var(--fg)`       | `var(--bg)`                              |
| Indeterminate                     | `var(--fg)`                   | `var(--fg)`       | `var(--bg)`                              |
| Hover — unchecked, pointer device | `var(--bg)`                   | `var(--fg-muted)` | —                                        |
| Hover — checked / indeterminate   | no change                     | no change         | no change                                |
| Focus-visible                     | —                             | —                 | `var(--accent)` outline, 2px, offset 2px |
| Disabled (any state)              | opacity 0.5 on entire control |                   |                                          |
| Invalid (`aria-invalid="true"`)   | `var(--bg)`                   | `var(--danger)`   | —                                        |

**Rationale — hover suppressed on checked/indeterminate:** The `--fg` fill is already maximum contrast. There is no darker resting value to darken the border to; lightening toward `--fg-muted` would erode state legibility rather than add affordance. Hover signals "you can interact with this" — most useful on the blank unchecked box.

**Rationale — invalid + focus-visible coexist:** Invalid border is on `border-color`; focus ring is on `outline`. Different CSS properties, different stacking layers. Both render simultaneously, which is the correct behaviour when a user focuses an already-invalid control.

---

## 5. Indicator glyphs

| State         | Glyph     | Lucide component | Size                      |
| ------------- | --------- | ---------------- | ------------------------- |
| Checked       | Checkmark | `Check`          | 12px, `strokeWidth={2.5}` |
| Indeterminate | Minus     | `Minus`          | 12px, `strokeWidth={2.5}` |
| Unchecked     | (none)    | —                | —                         |

Both icons carry `aria-hidden="true"`. State is announced via Radix-managed `aria-checked` on the root button — not via icon presence. This also means the icons can change (glyph, library) without affecting accessibility semantics.

Both icons are mounted inside `<Checkbox.Indicator>` simultaneously; CSS `display: none / block` selects the visible one based on `data-state`. This avoids a conditional render mismatch during Radix's controlled unmount cycle.

---

## 6. Motion

Only `background-color` and `border-color` transition, at `--dur-fast` with `--easing`. No transform. No indicator entrance animation — Radix's conditional mount of `<Checkbox.Indicator>` is instant; animating the mount/unmount cycle adds complexity without perceptible benefit at 16px.

```css
transition:
  background-color var(--dur-fast) var(--easing),
  border-color var(--dur-fast) var(--easing);
```

---

## 7. Accessibility

- Root renders as `<button role="checkbox">`. Radix manages `aria-checked` (`false` / `true` / `mixed`).
- Supply either `aria-label` (standalone) or a linked `<label htmlFor={id}>` at the molecule layer.
- `required`, `name`, `value` forwarded for form association.
- `aria-describedby` forwarded for helper / error text wiring by the molecule.
- `aria-invalid="true"` surfaces the invalid state visually (danger border) and semantically.
- Disabled: Radix sets `disabled` on the underlying `<button>` (native) and `data-disabled` (CSS hook). `cursor: not-allowed` reinforces.

### Hit-target shortfall

The 16 × 16px control fails WCAG 2.5.8 AA (24px minimum) and 2.5.5 AAA (44px minimum) hit-target requirements. This is accepted: the practical hit target in all production use is control + label combined (molecule layer's responsibility). Consumers embedding bare `Checkbox` without a label must extend the click target via `padding` or a wrapping `<label>` to meet the standard for their context. This mirrors the posture established for `IconButton` `sm` and `compact` sizes.

---

## 8. Props

| Prop               | Type                                          | Default | Notes                              |
| ------------------ | --------------------------------------------- | ------- | ---------------------------------- |
| `checked`          | `CheckedState` (`boolean \| "indeterminate"`) | —       | Controlled. Radix type.            |
| `defaultChecked`   | `boolean`                                     | `false` | Uncontrolled initial state.        |
| `onCheckedChange`  | `(checked: CheckedState) => void`             | —       | Controlled handler.                |
| `disabled`         | `boolean`                                     | `false` |                                    |
| `required`         | `boolean`                                     | `false` |                                    |
| `name`             | `string`                                      | —       | Form association.                  |
| `value`            | `string`                                      | `"on"`  | Form value when checked.           |
| `id`               | `string`                                      | —       | For `<label htmlFor>` wiring.      |
| `aria-label`       | `string`                                      | —       | Required when no external label.   |
| `aria-labelledby`  | `string`                                      | —       |                                    |
| `aria-describedby` | `string`                                      | —       |                                    |
| `aria-invalid`     | `"true" \| "false"`                           | —       | Triggers danger border.            |
| `className`        | `string`                                      | —       | Merged with internal module class. |

No `size` prop — 16 × 16px is the only size. No indicator slot — `Check` / `Minus` pair is DS-fixed. Consumers requiring custom indicators should compose `@radix-ui/react-checkbox` directly.

`forwardRef` to root `<button>`. `displayName = "Checkbox"`. `asChild` is excluded — Checkbox always renders a `<button>`.

---

## 9. Do not

- Roll a custom checkbox without Radix.
- Re-export Radix primitives publicly. Only the wrapped `Checkbox` component leaves the barrel.
- Add a `size` prop.
- Add motion beyond `--dur-fast` color/bg transitions.
- Add an indicator slot.
- Use `--icon-xs` token for the indicator size (semantic mismatch — see §3 rationale).

---

## 10. Testing — Playwright CT & Lucide blocker

### Blocker context

`BACKLOG.md §Blocking` documents a Playwright CT issue where `lucide-react` icons fail to render inside the CT harness. Because the checked and indeterminate states render Lucide `Check` and `Minus` icons respectively inside `<Checkbox.Indicator>`, any CT assertion that checks for Lucide SVG DOM presence will fail in the current harness.

### Required test strategy

Assert on Radix's `data-state` attribute on the root `<button>`. Radix sets this unconditionally regardless of icon rendering:

| `CheckedState` value | `data-state` string |
| -------------------- | ------------------- |
| `false`              | `"unchecked"`       |
| `true`               | `"checked"`         |
| `"indeterminate"`    | `"indeterminate"`   |

`data-state` is derived from the same internal state machine as `aria-checked`. It is the canonical behavioral contract for testing and is resilient to icon-library changes.

### Deferred coverage

The following CT assertions are deferred until the Lucide CT blocker resolves:

- Presence of `<svg>` / Lucide icon inside `<Checkbox.Indicator>` when `data-state="checked"`
- Presence of `<svg>` / Lucide icon inside `<Checkbox.Indicator>` when `data-state="indeterminate"`
- Absence of any icon when `data-state="unchecked"`

Even after the blocker resolves, `data-state` assertions remain the primary behavioral contract. Icon-presence assertions become supplementary visual regression only.

---

## 11. Future work

- `CheckboxField` molecule: Checkbox + Label + FieldNote + invalid wiring.
- Group pattern: `CheckboxGroup` for multi-select lists with indeterminate parent.
- Hit-target extension: decide whether the molecule layer uses `padding` or `<label>` wrap to meet WCAG 2.5.5 AAA on the combined target.
