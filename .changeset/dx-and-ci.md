---
"@poukai/ui": patch
---

DX + CI improvements.

**a11y gate**
- New `src/a11y.test.tsx` mounts every shipped component and scans with
  `@axe-core/playwright`. Runs as part of `pnpm test` (same Playwright
  suite) and on every PR via the existing CI job.
- `@axe-core/playwright` added as a dev dep.
- New `pnpm test:a11y` script for running just the a11y leg locally.

**Per-subpath size budgets**
- `size-limit` now measures each subpath entry independently:
  `dist/atoms.js`, `dist/molecules.js`, `dist/organisms.js`. Catches
  accidental cross-layer imports (e.g. an atom pulling in a molecule).

**Wordmark regeneration script**
- `scripts/build-wordmark.mjs` regenerates `wordmark-geometry.ts` from
  `brand/poukai-logo.svg`. The header of the generated file references the
  command so the next contributor doesn't hand-edit.
- New `pnpm build:wordmark` script.
- `brand/poukai-logo.svg` is now committed inside the package so the script
  has its source colocated.

**README**
- New "Subpath imports" section showing the per-layer entry points.

No public API changes.
