---
"@poukai-inc/ui": minor
---

feat(Button): add `size="compact"` — 40px rung between `sm` and `md` (issue #42)

Adds a fourth size to `<Button>`. `compact` (40px min-height, `--fs-body`,
9/16 padding) sits between `sm` (32px) and `md` (44px) — the editorial-CTA
rung where `md` reads too heavy and `sm` reads too small. Aligned to Apple's
"Compact" control register and the 4px spacing grid.

The full Button height ladder is now exposed as tokens (`--btn-h-sm`,
`--btn-h-compact`, `--btn-h-md`, `--btn-h-lg`) in `src/tokens/tokens.css`.
The previously inline literals (32 / 44 / 52) are refactored to consume
the tokens — same runtime values, named contract.

Accessibility: `compact` passes WCAG 2.5.8 AA (24×24) but fails 2.5.5 AAA
(44×44) — same posture as `sm`. Consumers on strict-AAA surfaces must use
`md` or `lg`.

Default `size="md"` is unchanged; every existing consumer is zero-regression.

Closes #42.
