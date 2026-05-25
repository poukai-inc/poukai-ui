---
"@poukai-inc/ui": minor
---

feat(molecule): add VideoEmbed

Responsive iframe wrapper for embedded video (YouTube, Vimeo, generic). Renders a `<figure>` root with a CSS `aspect-ratio` box that prevents CLS as the embed loads. Supports `src`, `title`, `aspectRatio` (16/9 | 4/3 | 1/1 | string), `lazy`, `bordered`, and `caption` props.

Closes #191.
