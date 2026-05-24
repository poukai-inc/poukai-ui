---
"@poukai-inc/ui": minor
---

feat(molecule): add StatList — grouped Stat row with rhythm and optional hairline dividers

Groups two or more `Stat` atoms into a horizontal rhythm with consistent gap cadence (`--space-8` mobile, `--space-12` desktop). Optional `dividers` prop renders CSS-only hairline rules (`--hairline` / `--hairline-w`) between items via `::before` pseudo-elements. Collapses to a single column below `--bp-md`. Root renders `role="list"` with each item in `role="listitem"` for proper AT semantics.
