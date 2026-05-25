# DatePicker

**Status**: Approved

## 1. Intent

DatePicker is a controlled or uncontrolled calendar-based date input that replaces native `<input type="date">` / `<input type="datetime-local">` across product surfaces where cross-browser consistency and DS token fidelity are required. Its primary consumer is `autopost`: the schedule-optimizer flow, the post-form `scheduledFor` field, and date-range filters on dashboard list pages. It composes with `Field` for label + validation wiring and accepts an optional `TimePicker` sibling when time selection is needed alongside date selection.

## 2. Anatomy

```
┌─ Trigger (Button-like input row) ────────────────┐
│  [calendar icon]  "May 23, 2026"        [▼]      │
└──────────────────────────────────────────────────┘
         ↓ opens Popover
┌─ Calendar panel ─────────────────────────────────┐
│  [‹ Prev]   May 2026   [Next ›]                   │
│  Su  Mo  Tu  We  Th  Fr  Sa                       │
│  …   …   …   …   1   2   3                        │
│  …   …  [23] …   …   …   …   ← selected day      │
│  …   …   …   …   …   …   …                        │
└──────────────────────────────────────────────────┘
```

- **Trigger**: styled input-like button row — calendar icon (leading), formatted date string or placeholder text, chevron (trailing). Acts as the Popover trigger.
- **Popover**: anchored overlay (Radix Popover) that contains the calendar panel. Dismisses on outside click, Escape, or date selection.
- **Month header**: current month + year label centered between Prev / Next icon buttons.
- **Day grid**: 7-column CSS grid. Day-of-week header row (Su–Sa) + date cells.
- **Day cell**: interactive `<button>` for each calendar day. States: default, hover, focus-visible, selected, today, out-of-month, disabled (before `min` / after `max`).
- **Field slot**: consumed by parent `Field` molecule for label, `id`, and `aria-describedby` wiring.

## 3. Tokens

- `--bg-elevated` — calendar panel surface (popover layer)
- `--bg` — trigger background at rest
- `--surface` — out-of-month day cell background
- `--surface-section` — today cell background indicator
- `--fg` — trigger text (date value), day cell numbers, month/year label
- `--fg-muted` — placeholder text, day-of-week header labels
- `--accent` — selected day cell background
- `--accent-glow` — selected day cell focus ring glow
- `--hairline` — trigger border, calendar panel border
- `--hairline-w` — border width (1px)
- `--font-sans` — all text within the component
- `--fs-meta` — trigger date string, day cell numbers, month/year label
- `--fs-micro` — day-of-week header row labels
- `--lh-meta` — line-height for all calendar text
- `--space-1` — day cell padding (block)
- `--space-2` — day cell padding (inline); gap between trigger icon and text
- `--space-3` — calendar panel internal padding (sides)
- `--space-4` — gap between month header and day grid
- `--space-6` — calendar panel padding (top / bottom)
- `--btn-h-md` — trigger row height (44px — aligns with Input/Select)
- `--radius-2` — trigger border-radius (4px)
- `--radius-3` — calendar panel border-radius (8px)
- `--dur-fast` — popover open/close transition duration
- `--easing` — popover open/close easing

## 4. Variants / Props

| Prop            | Type                           | Default         | Rationale                                                                     |
| --------------- | ------------------------------ | --------------- | ----------------------------------------------------------------------------- |
| `value`         | `Date \| null`                 | —               | Controlled selected date                                                      |
| `defaultValue`  | `Date \| null`                 | `null`          | Uncontrolled initial date                                                     |
| `onValueChange` | `(date: Date \| null) => void` | —               | Fires on day selection                                                        |
| `min`           | `Date`                         | —               | Disables days before this date                                                |
| `max`           | `Date`                         | —               | Disables days after this date                                                 |
| `disabled`      | `boolean`                      | `false`         | Disables trigger and all interaction                                          |
| `locale`        | `string`                       | `"en-US"`       | `Intl.DateTimeFormat` locale for day/month names and display format           |
| `format`        | `string`                       | `"MMM d, yyyy"` | Display format string for the trigger label                                   |
| `placeholder`   | `string`                       | `"Pick a date"` | Trigger text when no date selected                                            |
| `invalid`       | `boolean`                      | `false`         | Error state — red border on trigger, maps to `aria-invalid`                   |
| `id`            | `string`                       | —               | Forwarded to the trigger button; used by parent `Field` for label association |
| `name`          | `string`                       | —               | Hidden `<input type="hidden">` for native form submission                     |

## 5. Interaction

- **Open**: click or Enter/Space on trigger opens the Popover calendar panel.
- **Month navigation**: Left arrow button = previous month, Right arrow button = next month. Both are reachable by Tab within the open panel.
- **Day grid navigation**: Arrow keys (Up/Down/Left/Right) move focus between day cells. Tab moves focus to the month nav buttons and out of the grid.
- **Day selection**: Enter or Space on a focused day cell selects the date, fires `onValueChange`, and closes the Popover.
- **Dismiss**: Escape closes the panel and returns focus to the trigger. Outside click also closes.
- **Disabled days**: `min`/`max` out-of-range cells render with reduced opacity, `aria-disabled="true"`, and are skipped by arrow-key navigation.
- **Trigger hover**: border color transitions from `--hairline` toward `--fg-muted` (using `--dur-fast`).
- **Trigger focus-visible**: 2px `--accent` outline, `outline-offset: 2px`, `border-radius: var(--radius-1)`.

## 6. A11y

- Trigger is a `<button>` (not a `<div>`); receives natural keyboard focus.
- `aria-haspopup="dialog"` on the trigger; `aria-expanded` reflects open state.
- Calendar panel has `role="dialog"` and `aria-label="Choose date"`.
- Month/year heading inside the dialog has `role="heading" aria-level="2"`.
- Day grid is a `role="grid"` with `role="row"` children and `role="gridcell"` day cells.
- Selected day: `aria-selected="true"`. Today: `aria-current="date"`. Disabled days: `aria-disabled="true"`.
- Day-of-week headers are `<abbr title="Sunday">Su</abbr>` pattern for full-name screen-reader expansion.
- Hidden `<input type="hidden" name={name}>` carries the ISO-8601 value for form submission without a visible text field.
- Focus is trapped inside the open dialog; Escape releases it back to the trigger.
- Contrast: `--fg` on `--bg-elevated` = AAA. `--fg-muted` on `--bg-elevated` (day-of-week labels) = AA. `--fg-on-warm` equivalent is not used — white text on `--accent` selected cell must be verified by the engineer at implementation.

## 7. Motion

- Popover open: `opacity: 0 → 1` + `transform: translateY(-4px) → translateY(0)`, duration `var(--dur-fast)`, easing `var(--easing)`.
- Popover close: same properties reversed.
- `@media (prefers-reduced-motion: reduce)`: no transform, no opacity transition — panel appears/disappears instantly. The global `transition-duration: 0.01ms !important` from `tokens.css` handles this; no per-component override needed since this component uses CSS transitions (not `animation-fill-mode`).

## 8. Anti-patterns

- **Not a date-range picker.** Single-date selection only. A range variant (start + end date) is a separate `DateRangePicker` spec; do not bolt range selection onto this component.
- **Not a datetime picker.** DatePicker selects a calendar day only. Time-of-day is the responsibility of `TimePicker`. Compose them side-by-side; do not merge into a single compound field here.
- **Not a native input wrapper.** Do not use when the native `<input type="date">` is sufficient (e.g., a form served to a known-modern-browser audience with no branding requirement). The overhead of a Popover + day grid is only justified when cross-browser visual consistency and DS tokens matter.
- **Not for year or month-only selection.** A year picker or month picker is a different interaction model with different grid semantics. Do not repurpose the day-grid for those.
- **Not a multi-select.** Selecting multiple non-contiguous days is out of scope. If multi-select is ever needed, it requires a fresh spec.

## 9. Depends on

- `Field` — label, `id`, and validation wiring for the trigger button.
- `Popover` (molecule, `@radix-ui/react-popover`) — anchored overlay with portal, outside-click dismiss, focus management.
- `TimePicker` (atom) — optional sibling for combined date + time entry; composed by a future `DateTimePicker` molecule.

## Open questions

1. **`format` prop implementation.** The spec lists a format string (e.g. `"MMM d, yyyy"`). The DS has no date-formatting utility. The engineer must decide whether to use `Intl.DateTimeFormat` (no dep) with a fixed set of supported patterns, or accept a format function `(date: Date) => string` as an alternative prop. A format-function prop avoids a mini date-format parser inside the DS. Decision deferred to engineer; the spec intent is: the trigger label must be consumer-controllable.
2. **Calendar library.** The proposal suggests `react-day-picker` or Radix Popover + a hand-rolled grid. If `react-day-picker` is used it becomes a direct dep (not a peer). A hand-rolled grid avoids the dep but requires implementing ARIA grid keyboard navigation from scratch. The engineer should decide based on bundle budget — if `react-day-picker` causes a `pnpm size` failure the hand-rolled path is the fallback.
