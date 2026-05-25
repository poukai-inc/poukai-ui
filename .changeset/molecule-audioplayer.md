---
"@poukai-inc/ui": minor
---

feat(molecule): add AudioPlayer

HTML5 audio embed molecule with Caption row and optional transcript link. Wraps native `<audio controls>` inside a `<figure>` for semantic association. Supports `src`, `aria-label`, `caption`, `transcriptHref`, `transcriptLabel`, `autoPlay`, `loop`, `muted`, and `preload` props. `autoPlay` defaults to `false` (WCAG 1.4.2 compliance).

Closes #192.
