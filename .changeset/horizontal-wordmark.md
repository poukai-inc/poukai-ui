---
"@poukai-inc/ui": minor
---

Restore Wordmark to horizontal lockup (isotype left, POUKAI lettering right, side-by-side).

The SVG geometry in `brand/poukai-logo.svg` was rearranged: the isotype group's translate-y was shifted by +82 so the mark sits on the wordtype's cap-height midline, and the six letter-group tx values were each shifted by +140 to place the lettering flush-right of the isotype with a ~24 px optical gap.

The viewBox changed from `0 0 518.67 274.41` (aspect ratio ~1.9:1) to `0 0 662 274` (aspect ratio ~2.4:1). Consumers who sized containers around the old aspect ratio should re-check their layouts. No prop API change — `height`, `label`, and `className` are unchanged.
