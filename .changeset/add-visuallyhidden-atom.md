---
"@poukai-inc/ui": minor
---

Add `VisuallyHidden` atom — the canonical sr-only clip-pattern primitive for `@poukai-inc/ui`.

Renders children in the accessibility tree (screen-reader-readable, announced by assistive technology) while remaining completely invisible to sighted users via the WCAG/Bootstrap/Tailwind canonical clip pattern. Invariant: no tokens, no variants, no motion.

- `as?: "span" | "div"` closed union (default `"span"`) for inline vs block-level contexts
- `...rest` forwarded to root — use `id` for `aria-labelledby`/`aria-describedby`, `aria-live` for live-region announcements
- `className` merged additively; internal clip class has dedicated specificity
- Zero axe violations across default span, div variant, and `aria-live` usage
- First-party consumers: `IconButton`, `Dialog` close label, `SkipLink` (hidden base), `Carousel` slide counter
