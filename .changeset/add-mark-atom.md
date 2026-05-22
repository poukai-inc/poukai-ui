---
"@poukai-inc/ui": minor
---

Add `Mark` atom — editorial `<mark>` highlight.

`Mark` is the canonical inline highlight chip for long-form prose. It replaces the ad-hoc inline `<span style="background: …">` overrides that editorial surfaces (Pull, Quote, FieldNote, FeatureCard body, Prose) had been using to flag a run of text as "the part the reader should notice."

The chip tints the background with `--accent-glow` (the same low-opacity blue the system uses for `::selection`) so the highlight reads as kindred to selected prose rather than as a foreign decoration. Padding is inline-only (`--space-1`) so the highlight preserves text baseline alignment in running prose; the corner is rounded with `--radius-1` (2px) — softer than a selection-rect, far short of a pill. `box-decoration-break: clone` (with the WebKit prefix) ensures the highlight tiles cleanly across line wraps.

Root is always `<mark>` (non-polymorphic). Non-interactive — no hover, focus, or active states. Inherits `font-family`, `font-size`, `font-weight`, `line-height`, and `color` from the surrounding context, so the chip scales with parent text on every surface and resolves correctly inside the warm editorial band. `--accent-glow` already flips under `prefers-color-scheme: dark` via the global `:root` block, so no per-component dark-mode override is required.

No new tokens are introduced. Spec: `meta/design/Mark.md`.
