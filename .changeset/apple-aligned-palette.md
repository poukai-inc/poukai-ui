---
"@poukai-inc/ui": minor
---

Apple-aligned palette refinement: `--bg` shifts off pure white to `#FBFBFD` (apple.com canvas), and `#FFFFFF` becomes the reserved value of a new `--bg-elevated` token for popovers / sheets / front-most layers. Establishes a three-step elevation rhythm (`--surface < --bg < --bg-elevated`) and the "never pure edges" rule that makes the palette invert cleanly to dark mode. Page contrast remains AAA: `--fg` on `--bg` ≈ 16.3:1. See `meta/brand.md` for the full decision entry, contrast math, and dark-mode direction sketch.
