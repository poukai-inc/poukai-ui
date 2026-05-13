---
"@poukai/ui": patch
---

Fix: `Wordmark` renders empty.

The component referenced an external SVG symbol via
`<use href="#poukai-wordmark-geometry" />`, but no consumer or DS-internal
sprite ever defined that symbol. The mark rendered as an empty box.

Geometry is now **inlined** at build time from a generated
`wordmark-geometry.ts` (regenerated from `brand/poukai-logo.svg`, with the
verbose per-path styling stripped — `fill="currentColor"` on the parent
`<svg>` handles colour). Self-contained; no consumer setup required.

Adds a regression test that asserts at least six `<path>` elements render.
Bundle grows by ~9 kB (the path data itself is incompressible); within the
size-limit budget.

No API change.
