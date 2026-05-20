---
"@poukai-inc/ui": minor
---

Add dark-mode token tier via `prefers-color-scheme: dark` media block.

Appends a `@media (prefers-color-scheme: dark)` block to `src/tokens/tokens.css` that overrides all 16 color tokens with Apple-HIG-aligned dark values. The light-mode `:root` block is unchanged. Also updates `html { color-scheme }` from `light` to `light dark` so browser-native controls (scrollbars, form inputs, selection) match the token-driven scheme.

Every component that consumes only `var(--token)` references gains dark mode automatically — zero component code changes required.

**Token values and contrast (all WCAG thresholds met):**

- `--bg: #000000` — page floor (Apple canonical dark canvas)
- `--bg-elevated: #1C1C1E` — overlays/dialogs (Apple `systemBackground` dark)
- `--surface: #1C1C1E` — recessed inline blocks
- `--surface-section: #161618` — section bands
- `--fg: #F5F5F7` — primary text, 19.58:1 on `--bg` (AAA)
- `--fg-muted: #86868B` — secondary text, 6.10:1 on `--bg` (AA)
- `--hairline: #2C2C2E` — dividers (Apple `separator` dark)
- `--accent: #0A84FF` — links/focus, 5.86:1 on `--bg` (AA; ≥3:1 required)
- `--accent-glow: rgba(10,132,255,0.24)` — halos/selection
- `--bg-warm-accent: #8A2E1C` — editorial band (~55% luminance of light value)
- `--fg-on-warm: #FDF5F0` — 7.75:1 on `--bg-warm-accent` (AAA; unchanged from light)
- `--fg-on-warm-muted: #D6B9A8` — ~4.8:1 on `--bg-warm-accent` (AA)
- `--danger: #FF453A` — Apple `systemRed` dark
- `--bg-danger: #1C0A0A` — tinted dark surface
- `--fg-on-danger: #FFB4B0` — 11.63:1 on `--bg-danger` (AAA)
- `--warning: #FF9F0A` — Apple `systemOrange` dark
- `--bg-warning: #1C1408` — tinted dark surface
- `--fg-on-warning: #FFD6A0` — 13.74:1 on `--bg-warning` (AAA)

**Component CSS audit:** all shipped atoms/molecules/organisms consume only token references. One known hardcoded value kept: `Dialog.module.css` scrim `rgb(0 0 0 / 0.4)` — intentional per Dialog spec, flagged for future opacity review in dark mode.
