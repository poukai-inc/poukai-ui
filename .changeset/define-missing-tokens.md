---
"@poukai-inc/ui": patch
---

Define two tokens that shipped components were consuming without a fallback in `0.15.0`. Both were referenced in component CSS but absent from `src/tokens/tokens.css`, leaving the values undefined at runtime.

- `--fs-statement: clamp(1.75rem, 1.25rem + 2vw, 2.75rem)` (28–44px). Italic-serif editorial Statement block; sits between `h2` and `--fs-tagline-intimate`. Consumed by `<Statement>` (`Statement.module.css`), which previously fell back to the browser-default font-size.
- `--hero-illustration-max: 25rem`. Cap for the Hero illustration column in the two-column layout. Consumed by `<Hero illustration>` (`Hero.module.css`) and previously claimed in the `0.15.0` CHANGELOG as already-added, but never landed; without it the illustration column rendered without a width cap.
