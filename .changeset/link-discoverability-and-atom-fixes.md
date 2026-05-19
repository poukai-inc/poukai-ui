---
"@poukai-inc/ui": minor
---

Link resting-state discoverability + atom inversion fixes.

**Global `<a>` rule** — links now carry a persistent `--hairline`-colored
underline at rest. On hover, an `--accent`-colored underline grows over the
top via a two-layer CSS gradient. This gives every link a visible affordance
in its resting state without violating the `--accent`-is-signal-only rule.
Cascade-affects every anchor in the system (EmailLink, SiteShell nav, Hero
CTAs). Components that suppress the global rule via `background-image: none`
(LinkCard root + title, SiteShell Wordmark, `.muted-link`) are unaffected.
Brand decision logged in `meta/brand.md`.

**Stat** — `.value`, `.caption`, and `.source` now inherit `currentColor`
(captions via `color-mix(in srgb, currentColor 65%, transparent)` for the
muted register). Stat is now invertable: wrap with `color: var(--bg)` on a
`background: var(--fg)` parent and the numeral + caption render correctly
on the dark surface. Previously hardcoded `--fg` / `--fg-muted` on children
suppressed inheritance.

**EmailLink** — dropped the persistent underline override. EmailLink now
inherits the global `<a>` two-layer underline behavior. Removes the brand
divergence between mailto links and every other link in the system.
