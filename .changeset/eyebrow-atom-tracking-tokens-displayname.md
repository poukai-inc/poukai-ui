---
"@poukai-inc/ui": minor
---

Add `Eyebrow` atom, `--tracking-eyebrow` + `--lh-meta` tokens, and `displayName` backfill.

**New component — `Eyebrow`**

Canonical micro-label atom (`src/atoms/Eyebrow/`). Resolves the three independently-authored eyebrow patterns in `RoleCard`, `FailureMode`, and the global `.micro` utility into one shape: `--tracking-eyebrow: 0.06em`, `--fs-meta` (14px), `--font-sans`, weight 500.

- `variant` prop: `"muted"` (default, `--fg-muted`), `"solid"` (`--fg`), `"numbered"` (muted + inline numeral slot).
- `numeral` prop (string): leading index rendered with `font-variant-numeric: tabular-nums` and `--space-2` gap.
- `as` prop: polymorphic root element (`span` default; `p`, `div`, `dt`, `h2`–`h6`, `li`). Follows the Statement pattern.
- `margin: 0` — consuming context owns spacing.
- Exports: `Eyebrow`, `EyebrowProps`, `EyebrowVariant` from root, `./atoms` subpath.

**New tokens** (additive — minor bump)

- `--tracking-eyebrow: 0.06em` — Canonical letter-spacing for Eyebrow labels. Resolves the 0.04/0.06/0.08em drift across existing molecules.
- `--lh-meta: 1.2` — First named line-height token in the system, scoped to the meta/eyebrow register.

**`displayName` backfill** (no API change — patch-level, bundled here for cleanliness)

Added `Component.displayName = "Component"` to: `Button`, `Stat`, `StatusBadge`, `Wordmark`, `FailureMode`, `Principle`, `RoleCard`, `SiteShell`. Matches the pattern already on `Hero`, `Statement`, `Portrait`, and the new `Eyebrow`.

**Migration notes**

`RoleCard`, `FailureMode` inline eyebrow patterns will adopt `<Eyebrow>` in a follow-up PR. No existing molecule output changes in this release.
