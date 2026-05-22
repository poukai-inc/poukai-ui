---
"@poukai-inc/ui": minor
---

Add `Logo` atom — partner-logo cell with tone + size scale.

- Composes `<Image>` internally; no extra DOM wrapper — the root is always the `<img>`.
- `tone` prop (`"color"` | `"mono"` | `"muted"`, default `"mono"`): `"color"` renders as-is; `"mono"` applies `grayscale(1) brightness(0)` for a black silhouette; `"muted"` adds 0.55 opacity at rest with hover/focus-visible reveal to full opacity.
- `size` prop (`"sm"` | `"md"` | `"lg"`, default `"md"`): constrains rendered height via `max-height` — 24px / 32px / 40px respectively. Width is always auto.
- `width` / `height` optional props (defaults 200 × 80) passed to `<Image>` for CLS-safe `aspect-ratio` reservation. Override with true intrinsic dimensions when known.
- Hover/focus-visible contract on `tone="muted"`: `opacity: 1`, transition `opacity var(--dur-fast) var(--easing)`. Reduced-motion handled globally via `tokens.css`.
- No new tokens introduced — reuses `--dur-fast` and `--easing`.
- `forwardRef<HTMLImageElement>`, `displayName="Logo"`, full `...rest` spread via `<Image>`.
- Full Playwright CT suite (14 cases): render, src/alt, default tone/size classes, all tone classes, size max-height values, muted hover opacity, ref forwarding, className merge, width/height defaults.
- Added to `src/a11y.test.tsx` central gate (4 cases: default, tone=color, tone=muted, all sizes).
- Subpath export `./atoms/Logo` added to `package.json`.
