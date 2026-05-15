---
"@poukai-inc/ui": patch
---

Visual polish pass:

**Wordmark horizontal lockup proportions revised.** Three coupled changes to rebalance the mark's visual weight:

- Gap between isotype and wordtype: 24 → 120 SVG units (~25 rendered px at SiteShell's 56px height).
- Wordtype scale: 1× → 1.8× (cap-height ≈28px → ≈50px).
- Isotype scale: 1× → 1.25× to give the feather more presence over the lettering.

`viewBox` `0 0 662 274` → `0 0 1184 290` (aspect ratio 2.4:1 → ~4.08:1). Consumers sizing the mark by container width should re-check layouts. No prop API change. Supersedes the geometry lock from ADR-0009; see ADR-0011 for the full derivation, including the same-day corrections of the initial 40-SVG-unit gap and the subsequent isotype scale-up.

**Wordmark inverted variant now actually inverts.** Removed the hardcoded `color: var(--fg)` on `.root` that was overriding the parent's color context. The SVG's `fill="currentColor"` now inherits from whatever color is in scope — so an inverted wrapper that sets `color: var(--bg)` actually produces a light mark on a dark background.

**RoleCard grid overlap fixed.** Removed `min-height: 100%` from `.root`. CSS Grid items already stretch to the row height via the default `align-items: stretch`; the percentage height was resolving against an undefined parent context in some grid layouts and causing second-row cards to overflow into the first row.

**StatusBadge `available` pulse made prominent.** Keyframes: `scale(1 → 6)` (was `1 → 2.2`); `opacity` starts at `1` (was `0.6`) and reaches zero by 80%. Duration `2400ms → 1600ms` with `ease-out` (was `ease-in-out`). The pulse background is now solid `--accent` rather than `--accent-glow`. The dot itself also gains a static 2px `--accent-glow` halo so it reads as "lit" between pulses rather than going dark. The motion now reads as a heartbeat rather than a flicker.
