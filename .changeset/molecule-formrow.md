---
"@poukai-inc/ui": minor
---

Add `FormRow` molecule — horizontal multi-Field row with responsive collapse.

`FormRow` places two or more `Field` instances side-by-side using CSS grid with equal-width columns and consistent gap rhythm (`--space-4` default, `--space-2` tight). Below the `--bp-md` breakpoint (768px) the row collapses to a single-column stack via a CSS-only media query — no JS reordering, stable DOM order.

Props: `gap` (`"default" | "tight"`), `columns` (explicit count), `children` (ReactNode). Root is a plain `<div>`; no landmark semantics. Ref forwarded to `HTMLDivElement`. `...rest` spread for `data-*`, `aria-*`, etc.

Depends on `Field` for direct child primitive. Pairs with `Fieldset` when semantic `<fieldset>`/`<legend>` grouping is needed around the row.
