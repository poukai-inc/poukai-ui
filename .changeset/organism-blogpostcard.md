---
"@poukai-inc/ui": minor
---

Add `BlogPostCard` organism — index-card preview for blog posts.

Composes `LinkCard` as the full-surface anchor root with an optional 16:9
cover thumbnail, a linked serif title (`h2`/`h3` via `headingLevel`), a
lede excerpt clamped to 3 lines, a `Byline` slot, and an optional `TagList`
slot. Supports `"default"` and `"subtle"` tone variants.

New exports: `BlogPostCard`, `BlogPostCardProps`, `BlogPostCardTone`,
`BlogPostCardHeadingLevel`, `BlogPostCardCover`.
