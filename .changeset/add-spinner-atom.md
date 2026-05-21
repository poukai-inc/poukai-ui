---
"@poukai-inc/ui": minor
---

Add `Spinner` atom — indeterminate loading indicator.

- Inline SVG arc (track at 0.2 opacity + rotating arc at full opacity), `currentColor` throughout so it adapts to any surface without a color prop.
- Three sizes: `sm` (16px), `md` (20px, default), `lg` (24px) — matched to the icon size token scale (`--icon-sm`, `--icon-md`, `--icon-lg`).
- Rotation driven by new `--dur-spinner: 800ms` motion token (added to `tokens.css` by `poukai-design`); `linear` easing for a smooth continuous loop.
- `role="status"` + `aria-live="polite"` + `aria-label` on the host `<span>`; visually-hidden text sibling for virtual browse mode.
- Reduced-motion fallback: explicit `animation: none` on the arc (belt-and-suspenders over the global `tokens.css` collapse) plus a CSS-only `…` ellipsis revealed only under `prefers-reduced-motion: reduce` — no JS branching, no DOM structure change.
- Full Playwright CT test suite (render, sizes, label, ref forwarding, className merge, rest props, animation token regression, reduced-motion assertions, axe scans).
- Added to `src/a11y.test.tsx` central gate (default, all sizes, custom label, reduced-motion).
