---
"@poukai-inc/ui": minor
---

feat(organism): add ArticleHeader — eyebrow + title + lede + Byline + ShareLinks

New `ArticleHeader` organism for long-form editorial surfaces. Composes `Eyebrow`, `Heading`, and `Text` atoms with `byline` and optional `share` ReactNode slots into a semantic `<header>` element. Props: `eyebrow`, `title` (ReactNode, supports `<em>`), `lede`, `byline`, `share`, `divider`. Token-only CSS; zero new tokens.
