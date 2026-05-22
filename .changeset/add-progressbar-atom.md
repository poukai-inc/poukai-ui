---
"@poukai-inc/ui": minor
---

Add `ProgressBar` atom — linear progress with determinate + indeterminate modes.

- Determinate mode: `value` prop (0–100, clamped). Fill uses `transform: scaleX` driven by a CSS custom property (`--progress-fraction`). Never animates `width` — compositor-only motion contract.
- Indeterminate mode: two bars (`poukai-progress-bar1` / `poukai-progress-bar2`) sweep left→right using `translateX` keyframes at `--dur-progress-indeterminate` (1400ms) with `--easing` (expo-out). Bar 2 starts at `translateX(-200%)` to eliminate dead-track gaps.
- Reduced-motion (indeterminate): animated bars hidden; a static `scaleX(0.5)` fill revealed via CSS-only toggle. Reduced-motion (determinate): transition removed (snap).
- Four tones: `default` (`--fg`), `success` (`--success`), `warning` (`--warning`), `danger` (`--danger`). Two sizes: `sm` (2px track), `md` (4px track, default).
- Labeling enforced at TypeScript type level: exactly one of `aria-label` / `aria-labelledby` required via discriminated union.
- `aria-valuenow` omitted entirely when indeterminate (not set to `undefined` — attribute absent from DOM).
- Full Playwright CT suite: ARIA contract, tone colors, size heights, transform regression guard (no `width`), animation token regression (1400ms), reduced-motion assertions (staticFill at scaleX(0.5), bars hidden), axe scans (aria-label + aria-labelledby × determinate + indeterminate).
- Added to `src/a11y.test.tsx` central gate (6 cases covering all tones, both labeling strategies, reduced-motion).
- New tokens added to `src/tokens/tokens.css`:
  - `--success: #248a3d` / `--bg-success: #f0faf3` / `--fg-on-success: #0d3d1e` (light)
  - `--success: #30d158` / `--bg-success: #041a09` / `--fg-on-success: #a8f0be` (dark)
  - `--dur-progress-indeterminate: 1400ms`
