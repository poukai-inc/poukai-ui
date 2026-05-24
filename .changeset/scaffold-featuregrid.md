---
"@poukai-inc/ui": minor
---

feat(organism): add FeatureGrid — responsive Section + FeatureCard grid

Implements the FeatureGrid organism per the approved spec at `meta/design/FeatureGrid.md`.

Composes `Section` (landmark, eyebrow, heading, lede, block padding) with a CSS `auto-fit` grid container. Supports `columns=2|3`, `size="default"|"tight"`, and arbitrary `FeatureCard` children.

Token-only CSS: `--space-6`, `--space-8` (gap), `--bp-md` (gap breakpoint). No new tokens introduced. All layout tokens were already in `tokens.css`.

Exports: `FeatureGrid`, `FeatureGridProps` from `@poukai-inc/ui`, `@poukai-inc/ui/organisms`, and `@poukai-inc/ui/organisms/FeatureGrid`.
