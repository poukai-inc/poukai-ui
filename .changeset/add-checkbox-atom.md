---
"@poukai-inc/ui": minor
---

Add Checkbox atom — Radix Checkbox wrap.

Wraps `@radix-ui/react-checkbox` (`Checkbox.Root` + `Checkbox.Indicator`). Supports
unchecked / checked / indeterminate states via Radix `CheckedState` (`boolean | "indeterminate"`).

`CheckboxCheckedState` is re-exported for consumer convenience.

Fixed 16×16px (`--icon-sm`) footprint with `--radius-1` (2px). No size variants.
Token contract: `--bg`, `--fg`, `--hairline`, `--fg-muted`, `--danger`, `--accent`,
`--radius-1`, `--icon-sm`, `--dur-fast`, `--easing`. No new tokens introduced.

Visual states: unchecked (resting), hover-unchecked, checked, indeterminate,
disabled (opacity 0.5), invalid (`aria-invalid="true"` → `--danger` border).
Transitions on `background-color` and `border-color` at `--dur-fast` only.

Indicator glyphs: Lucide `Check` (checked, 12px) and `Minus` (indeterminate, 12px),
both `aria-hidden="true"`. State is announced via Radix-managed `aria-checked`.

Label-agnostic: supply `aria-label` directly or wire `<label htmlFor={id}>` at the
molecule layer. `forwardRef` to root `<button>`, `displayName = "Checkbox"`.

Note: CT assertions use Radix `data-state` attribute (canonical contract) rather than
Lucide icon DOM presence. See BACKLOG.md §Blocking. Icon-presence assertions deferred
until the blocker resolves.

`@radix-ui/react-checkbox@^1.1.0` added to dependencies.
