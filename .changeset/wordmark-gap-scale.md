---
"@poukai-inc/ui": patch
---

Visual polish pass:

**Wordmark horizontal lockup proportions revised.** Gap between isotype and wordtype widened from 24 to 120 SVG units (~25 rendered px at SiteShell's 56px height); wordtype scaled from 1× to 1.8× (cap-height ≈28px → ≈50px). `viewBox` `0 0 662 274` → `0 0 1172 274` (aspect ratio 2.4:1 → ~4.28:1). Consumers sizing the mark by container width should re-check layouts. No prop API change. Supersedes the geometry lock from ADR-0009; see ADR-0011 for the full derivation and the same-day amendment correcting the initial 40-SVG-unit gap that rendered as ~8 actual pixels.

**Wordmark inverted variant now actually inverts.** Removed the hardcoded `color: var(--fg)` on `.root` that was overriding the parent's color context. The SVG's `fill="currentColor"` now inherits from whatever color is in scope — so an inverted wrapper that sets `color: var(--bg)` actually produces a light mark on a dark background.

**RoleCard grid overlap fixed.** Removed `min-height: 100%` from `.root`. CSS Grid items already stretch to the row height via the default `align-items: stretch`; the percentage height was resolving against an undefined parent context in some grid layouts and causing second-row cards to overflow into the first row.

**StatusBadge `available` pulse made visible.** Keyframes amplified: scale `1 → 3` (was `1 → 2.2`), opacity starts at `1` (was `0.6`) and reaches zero at 70% rather than 100% for a clearer fade-out. Duration `2400ms → 1800ms` with `ease-out` (was `ease-in-out`). The motion now reads as a heartbeat rather than a flicker.
