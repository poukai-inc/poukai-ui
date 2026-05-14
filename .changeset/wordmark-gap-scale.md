---
"@poukai-inc/ui": patch
---

Wordmark horizontal lockup proportions revised: gap between isotype and wordtype widened from 24px to 40px, wordtype scaled from 1× to 1.8×. Cap-height goes from ≈28px to ≈50px so the letters read as commensurate with the isotype's line density rather than visually subordinate.

`viewBox` changed from `0 0 662 274` (aspect ratio ≈ 2.4:1) to `0 0 1092 274` (≈ 3.98:1). Consumers sizing the mark by container width should re-check their layouts. No prop API change.

Supersedes the geometry lock from ADR-0009. New ratio is locked at ≈3.98:1 per ADR-0011.
