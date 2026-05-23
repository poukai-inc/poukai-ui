# FormRow

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`FormRow` is the horizontal multi-Field layout molecule. Its single job is to place two or more `Field` instances side-by-side with consistent column widths and gap rhythm, then collapse them to a single-column stack below the `--bp-md` breakpoint. It exists so the "First name / Last name" and "City / State / Zip" patterns share one layout primitive rather than ad-hoc flex wrappers per form.

## 2. Anatomy

```
┌─────────────────────────────────────────┐
│  [Field ──────────] [Field ──────────]  │  ← row (CSS grid, ≥ bp-md)
└─────────────────────────────────────────┘
↓ below bp-md
┌─────────────────────────────────────────┐
│  [Field ──────────────────────────────] │
│  [Field ──────────────────────────────] │
└─────────────────────────────────────────┘
```

- **Root element**: `<div>` — a neutral layout wrapper; no landmark semantics.
- **Children slot**: one or more `Field` molecules passed as `children`. `FormRow` owns spacing between them; each `Field` retains its own label, input, and hint structure.
- No header, legend, or label of its own — that concern belongs to `Fieldset` (a sibling molecule).

## 3. Tokens

- `--space-4` (1rem / 16px) — column gap between Fields at row layout
- `--space-6` (1.5rem / 24px) — row gap when Fields stack vertically (below `--bp-md`)
- `--bp-md` (768px) — breakpoint at which row collapses to stack

## 4. Variants / Props

| Prop      | Type                 | Default    | Rationale                                                                        |
|-----------|----------------------|------------|----------------------------------------------------------------------------------|
| `gap`     | `"default" \| "tight"` | `"default"` | `"default"` = `--space-4` column gap; `"tight"` = `--space-2` for dense forms  |
| `columns` | `number`             | auto       | Explicit column count; defaults to equal-width auto tracks (`1fr` per child)     |
| `children` | `ReactNode`         | —          | `Field` instances; 2–4 recommended; more than 4 columns read as cramped         |

`gap="default"` (`--space-4`) is the editorial standard matching the vertical gap between stacked Fields. `gap="tight"` (`--space-2`) exists for utility-dense contexts (address lines, filter bars).

## 5. Interaction

`FormRow` is a passive layout container. It has no interactive surface of its own. Focus order follows DOM source order — left to right in row layout, top to bottom in stacked layout. Both are the natural tab sequence; no `tabindex` manipulation needed.

## 6. A11y

- Root `<div>` carries no implicit ARIA role — correct for a layout wrapper.
- Do not use `FormRow` as a substitute for `<fieldset>`/`<legend>` grouping. When the row's Fields form a semantically related group (e.g. a mailing address), wrap `FormRow` inside `Fieldset`.
- Each child `Field` owns its own `<label>` and `for`/`id` association; `FormRow` does not interfere with that contract.
- Column collapse at `--bp-md` is CSS-only; no JS reordering. DOM order is stable and matches visual order in both layouts.

## 7. Motion

None — static layout molecule. No transitions on the grid itself. The `prefers-reduced-motion` block in `tokens.css` has no effect here. If individual child Fields carry focus-ring transitions, those are owned by `Field`.

## 8. Anti-patterns

- **Not a fieldset replacement.** `FormRow` has no `<legend>` and provides no semantic grouping. Use `Fieldset` when the group of fields needs an accessible name.
- **Not for unrelated fields.** Placing semantically unrelated fields side-by-side in one `FormRow` creates a confusing visual grouping; each `FormRow` should read as a single conceptual row.
- **Not for more than 4 columns.** Beyond 4 fields the minimum column width becomes too narrow for comfortable label + input layout at `--content-max`.
- **Not a data-table row.** `FormRow` is for form inputs, not for displaying tabular data; use `Table` for that.
- **Not a responsive grid system.** `FormRow` handles one row of fields. Multi-row form layout is composed by stacking multiple `FormRow` and `Field` instances; `FormRow` does not span or auto-place across rows.

## 9. Depends on

- `Field` — the direct child primitive this molecule spaces and collapses.
- `Fieldset` — the sibling molecule that adds `<fieldset>`/`<legend>` wrapping when semantic grouping is needed around a `FormRow`.
