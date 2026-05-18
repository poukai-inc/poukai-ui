---
"@poukai-inc/ui": minor
---

Add `bleed="full"` prop to Hero and `--content-max-bleed` layout permission token.

`bleed="none"` is the default — existing consumers are unaffected. `bleed="full"` extends the Hero section to `100vw` with inner content centered at `--content-max`. The `--content-max-bleed: 100vw` token is available for site-side compositions that need full-bleed without the Hero overlay.

Closes #57.
