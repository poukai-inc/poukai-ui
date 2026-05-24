# TimePicker

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`TimePicker` is the system's canonical time-of-day input — a styled wrapper around the native `<input type="time">` that replaces the browser's unstyled control with DS tokens. Its single job is to produce a valid `HH:mm` string in the `autopost` scheduling surface: preferred-times arrays in the schedule optimizer, the time portion of a scheduled-post form, and page-level preferred-times editors. It composes with `Field` for the full label + input + note anatomy; it does not manage that anatomy itself.

## 2. Anatomy

```
┌─────────────────────────────┐
│  [HH]:[mm]  [▲▼ spinner]   │  ← native <input type="time"> restyled
└─────────────────────────────┘
```

- **Root**: `<input type="time">` — native control, styled with DS tokens via CSS custom properties and `::-webkit-datetime-edit-*` selectors.
- **Spinner affordance**: browser-native; not replaced. Positioning and display are suppressed only if they conflict with token-driven layout.
- **No custom dropdown**: the native picker is the default. A future custom dropdown (15/30/60-min step list) is deferred — see §8.

## 3. Tokens

- `--font-sans` — input text face
- `--fs-body` — input text size (matches Input atom)
- `--fg` — input text color
- `--fg-muted` — placeholder / empty-value color
- `--bg` — input background
- `--surface` — background when `disabled`
- `--hairline` — default border color
- `--accent` — focus ring + border color on focus
- `--accent-glow` — focus ring outer glow (box-shadow)
- `--danger` — border color when `invalid`
- `--radius-2` — 4px corner radius
- `--space-2` — vertical padding (block axis)
- `--space-3` — horizontal padding (inline axis)
- `--btn-h-md` — 44px min-height (aligns with Input atom, WCAG 2.5.5 tap target)
- `--dur-fast` — transition duration for border / shadow state changes
- `--easing` — transition easing

## 4. Variants / Props

| Prop            | Type                      | Default | Rationale                                                   |
| --------------- | ------------------------- | ------- | ----------------------------------------------------------- |
| `value`         | `string \| undefined`     | —       | Controlled `HH:mm` value                                    |
| `defaultValue`  | `string`                  | —       | Uncontrolled seed (`"HH:mm"`)                               |
| `onValueChange` | `(value: string) => void` | —       | Fires on `change`; provides current `input.value`           |
| `step`          | `number`                  | `60`    | Seconds; `900` = 15-min steps, `1800` = 30-min, `3600` = 1h |
| `min`           | `string`                  | —       | Minimum time (`"HH:mm"`)                                    |
| `max`           | `string`                  | —       | Maximum time (`"HH:mm"`)                                    |
| `disabled`      | `boolean`                 | `false` | Dims + blocks interaction; `--surface` bg                   |
| `invalid`       | `boolean`                 | `false` | Red border via `--danger`; consumer passes after validation |
| `size`          | `"sm" \| "md" \| "lg"`    | `"md"`  | Height aligns with `--btn-h-sm / -md / -lg`; matching Input |

`size="md"` default matches the Input atom default — TimePicker in the same form row as other inputs has identical height without manual alignment.

## 5. Interaction

- **Mouse**: click to focus; browser native time picker appears on supported platforms.
- **Keyboard**: `Tab` moves focus to the input. Arrow keys increment/decrement hour, minute, AM/PM segments per native browser behavior. `step` prop controls allowed minute increments.
- **Focus order**: participates in natural DOM tab order. No custom focus management.
- **Hover**: border transitions from `--hairline` to a slightly darker tint using `color-mix(in oklab, var(--hairline) 70%, var(--fg))`; `--dur-fast` transition.
- **Focus-visible**: 2px solid `--accent` outline + `box-shadow: 0 0 0 3px var(--accent-glow)`. Matches Input atom focus ring contract.
- **Disabled**: `pointer-events: none`; `opacity: 0.5`; `background: var(--surface)`.
- **Invalid**: border `--danger`; no icon — the `Field` molecule's `FieldNote` carries the error message.

## 6. A11y

- **Semantic element**: `<input type="time">`. Native semantics; no ARIA role override needed.
- **Label association**: `id` must be passed so the parent `Field` can bind `<label for="…">`. TimePicker does not render its own label.
- **`aria-invalid`**: set to `"true"` when `invalid` prop is `true`.
- **`aria-describedby`**: consumer passes the `id` of any `FieldNote` error/hint element; TimePicker forwards it via spread props.
- **Contrast**: `--fg` on `--bg` ≈ 16.29:1 (AAA). `--danger` border on `--bg` ≥ 3:1 (non-text contrast, WCAG 1.4.11).
- **Tap target**: `min-height: var(--btn-h-md)` = 44px passes WCAG 2.5.5 AAA; `size="sm"` (32px) is AA only.

## 7. Motion

- Border color: `transition: border-color var(--dur-fast) var(--easing)`.
- Box-shadow (focus glow): `transition: box-shadow var(--dur-fast) var(--easing)`.
- `@media (prefers-reduced-motion: reduce)`: both durations collapse to `0.01ms` via the global token block in `tokens.css`. No component-level override needed.

## 8. Anti-patterns

- Do not use `TimePicker` to pick a date — that is `DatePicker`.
- Do not render `TimePicker` without a `Field` wrapper; a bare input with no visible label is an a11y violation.
- Do not use `TimePicker` for duration input (e.g. "2h 30m") — this control expresses a time of day, not an elapsed interval.
- Do not use `TimePicker` as a range selector — it expresses a single point in time; a range requires two instances composed by the consumer.
- Do not drive `invalid` state from inside `TimePicker`; validation is always the consumer's responsibility, surfaced via the `invalid` prop.

## 9. Depends on

- `Field` (molecule) — label, layout, and `FieldNote` error/hint slot.
- No Radix dependency. Styled native input + DS tokens only.

## Open questions

- **Custom step-list dropdown**: the proposal suggests an optional custom dropdown for 15/30/60-min steps (replacing the native spinner). This would require a `Popover` + list, bringing in `@radix-ui/react-popover`. Deferred to a follow-up spec — the native `step` prop covers the `autopost` need for now. Confirm whether the native approach is sufficient for P2 launch or whether the custom dropdown must ship together.
- **`size="sm"` tap target**: at 32px (`--btn-h-sm`), `size="sm"` fails WCAG 2.5.5 AAA (44px). It passes 2.5.8 AA (24px). Confirm whether `sm` should be excluded from this component entirely or documented as AA-only (matching `Button` sm posture).
