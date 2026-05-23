# StatList

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`StatList` groups two or more `Stat` atoms into a shared horizontal rhythm with consistent gap cadence and optional hairline dividers between items. It is the canonical "by the numbers" row used on marketing landing pages, pricing pages, and the `StatsSection` organism — surfaces where multiple metrics need to read as a coherent unit rather than independent floats.

## 2. Anatomy

```
┌─────────────────────────────────────────────────┐
│  [Stat]  │  [Stat]  │  [Stat]                   │
│  12k     │  200     │  99.9%                    │
│  Users   │ Customers│  Uptime                   │
└─────────────────────────────────────────────────┘
         ↑ optional --hairline divider
```

- **Root**: `<div>` with `role="list"` (contains semantic list items).
- **Item wrapper**: each `Stat` child is wrapped in a `<div role="listitem">` to preserve list semantics without prescribing `<ul>`/`<li>` around non-list content.
- **Divider**: when `dividers` is true, a `1px` vertical rule rendered via `::before` on each item (except the first) using `--hairline` + `--hairline-w`. Pure CSS; no `Divider` component is instantiated in the DOM.
- **Children slot**: `ReactNode` — consumers pass `<Stat>` atoms directly.

## 3. Tokens

- `--space-8` (2rem) — gap between items, mobile
- `--space-12` (3rem) — gap between items, `@media (--bp-md)` desktop
- `--hairline` (#D2D2D7) — divider color when `dividers={true}`
- `--hairline-w` (1px) — divider width
- `--space-8` — padding-inline on each side of a divider (keeps text clear of the rule)
- `--bp-md` (768px) — breakpoint for column → row collapse and gap change

No new tokens introduced.

## 4. Variants / Props

| Prop        | Type                  | Default    | Rationale                                                                                                                  |
| ----------- | --------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `dividers`  | `boolean`             | `false`    | Opt-in hairline rules between items. Off by default so StatList can be used without visual separators in tighter contexts. |
| `align`     | `"start" \| "center"` | `"center"` | Center-aligns the row in its container — the marketing default. `"start"` for left-docked layouts (docs, sidebars).        |
| `children`  | `ReactNode`           | —          | Required. Expects `Stat` atoms; consumer owns composition.                                                                 |
| `className` | `string`              | —          | For layout overrides (max-width, margin) from the parent.                                                                  |

**Collapse behavior**: below `--bp-md` the row stacks to a single column (`flex-direction: column`). Dividers become horizontal rules in the stacked state (`width: 100%; height: var(--hairline-w); border: none`). Gap shrinks to `--space-8` at all sizes (the `--space-12` step applies only in the desktop row).

## 5. Interaction

Static display molecule. No hover, focus, active, or dismiss states authored by `StatList`. Individual `Stat` atoms are non-interactive; if a consumer wraps a `Stat` in a link, that link owns its own interaction treatment.

Keyboard: no tab stops on `StatList` itself.

## 6. A11y

- Root renders `<div role="list">` so the flat children are exposed as a list to assistive technology without requiring `<ul>` semantics on a display layout.
- Each item slot renders `<div role="listitem">`.
- Dividers are decorative (`aria-hidden="true"` on the `::before` pseudo — no additional DOM node needed; the CSS pseudo is not reachable by AT).
- `Stat` atoms carry their own accessible number + label pairing (see Stat spec). `StatList` does not re-label them.
- No additional ARIA attributes needed on the root.

## 7. Motion

None — `StatList` is a static layout shell. `Stat` atoms may carry their own number-count entrance if that is specced separately. `StatList` does not add or coordinate entrance timing.

`prefers-reduced-motion`: no transitions on `StatList` itself; the global clamp in `tokens.css` handles any descendant transitions.

## 8. Anti-patterns

- **Do not use StatList for a single Stat.** A lone `Stat` stands alone; `StatList` only earns its keep with two or more items.
- **Do not mix non-Stat children.** StatList is not a generic flex row. Mixing arbitrary content breaks the shared rhythm assumption.
- **Do not use StatList for status indicators.** `Stat` shows numerical metrics; `StatusBadge` shows liveness. The two are not interchangeable.
- **Do not nest StatLists.** One level of grouped metrics per surface. Nested grouping implies a table — use a different primitive.
- **Do not use StatList for form-field rows.** The layout shape may look similar but the semantic register is incompatible; use `FormRow` instead.

## 9. Depends on

- `Stat` (atom) — the only intended child content.
- No other DS components required. Dividers are CSS-only (`::before` pseudo); no `Divider` atom is composed.
