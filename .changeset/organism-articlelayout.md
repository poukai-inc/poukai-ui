---
"@poukai-inc/ui": minor
---

feat(organism): add ArticleLayout — single-column long-form reading template

Implements `ArticleLayout` organism per `meta/design/ArticleLayout.md`. Wraps
content in a semantic `<article>` with a CSS grid exposing named width slots
(`text`, `wide`, `bleed`) for editorial content blocks. Ships a `header` prop
slot for `ArticleHeader` (or any ReactNode), a polymorphic `as` prop for
`<div>` override when nested in an existing article landmark, and full
`...rest` / `className` / `ref` forwarding.

TOKEN FALLBACK: The `text` column requires `--article-measure` (reading-comfort
prose measure, ~65ch). This token does not yet exist in `tokens.css`. Per
orchestrator decision, the implementation uses a hardcoded fallback of `65ch`
directly in `ArticleLayout.module.css`. This is a known follow-up item: once
`--article-measure` is ratified and added to `tokens.css`, replace the
hardcoded value with `var(--article-measure)` in the CSS module. No new token
was added in this PR.

Closes #214.
