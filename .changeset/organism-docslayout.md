---
"@poukai-inc/ui": minor
---

feat(organism): add DocsLayout — three-column documentation page template

Implements `DocsLayout` organism per `meta/design/DocsLayout.md`. Composes
`Sidebar` (left column, sticky, collapses to a slide-in drawer at mobile),
a center content slot (typically `<ArticleLayout as="div">`), and an optional
`toc` right-rail column (hidden below 1024px).

CSS grid with named template areas (`sidebar`, `content`, `toc`). Responsive:
collapses to single column at `< 768px` (--bp-md). Mobile hamburger trigger
with `aria-expanded` / `aria-controls` / `role="dialog"` drawer pattern.
`toc` prop is optional — when omitted the grid reflows to two columns; no
empty `<aside>` landmark is rendered.

Closes #215. Depends on ArticleLayout (#214 / #299).
