# ArticleLayout

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`ArticleLayout` is the single-column long-form reading template for article, blog-post, and docs-page surfaces. It owns the reading-measure container and a CSS grid that exposes named width slots (`text`, `wide`, `bleed`) so editorial content blocks — `Prose`, `Pull`, `Figure`, `CodeBlock` — can break out of the measure column without leaving the layout system. It does not own the page chrome (that is `SiteShell` or `DocsLayout`); it owns the content column inside `<main>`.

## 2. Anatomy

```
<article>
  ├── header slot          — ArticleHeader (or any ReactNode)
  └── content area         — CSS grid, named column tracks
        ├── [text]  cells  — Prose, Pull, Byline, TagList, MetaList, CodeBlock
        ├── [wide]  cells  — Figure (wide), VideoEmbed, Carousel
        └── [bleed] cells  — full-viewport-width bleed elements
```

- **Root element**: semantic `<article>`.
- **Header slot**: accepts any `ReactNode`; canonical value is `<ArticleHeader>`. Placed above the content grid, inherits `text`-column width.
- **Content grid**: CSS grid with three named column tracks. Children placed in the grid via a `width` prop on supporting components, or by composing inside a wrapper that carries the correct grid-column class. Children that carry no explicit `width` land in the `text` track by default.
- **Width slots**:
  - `text` — prose measure, `min(var(--article-measure), 100%)`.
  - `wide` — wider than measure, `min(var(--content-max), 100%)`.
  - `bleed` — `var(--content-max-bleed)` (100vw), centered via negative margin.

## 3. Tokens

- `--content-max` (`64rem`) — `wide` column width ceiling
- `--content-max-bleed` (`100vw`) — `bleed` column full width
- `--page-pad` (`clamp(1.5rem, 2vw + 1rem, 3rem)`) — horizontal gutters at narrow viewports
- `--space-16` (`4rem`) — vertical gap between header slot and content area
- `--space-12` (`3rem`) — bottom padding on root `<article>`
- `--space-8` (`2rem`) — gap between grid rows (block-axis rhythm)
- `--font-sans` — base font family (inherited; not set by ArticleLayout)
- `--fg` — base text color (inherited)
- `--bg` — page background (inherited from `SiteShell`)

## Open questions

**`--article-measure` token gap.** The `text` column requires a reading-measure value — canonically `65–75ch` (around `42rem`–`48rem`). No such token exists in `tokens.css` today. Either `--hero-max` (`38rem`) is reused (narrower than ideal for body copy) or a new `--article-measure` token is needed. This is a token-addition decision requiring Arian's sign-off before implementation. The spec cannot proceed to Approved without it.

## 4. Variants / Props

- `header` — `ReactNode`, optional. Rendered above the content grid. Canonical: `<ArticleHeader>`. When omitted, no header slot is emitted.
- `children` — `ReactNode`, required. The article body. Direct children land in the `text` column by default. Supporting components (`Figure`, `Pull`, etc.) opt into `wide` or `bleed` via their own `width` prop or by the consumer wrapping them in a layout helper.
- `as` — `"article" | "div"`, default `"article"`. Override to `"div"` when `ArticleLayout` is nested inside another `<article>` (e.g. a docs page that wraps the entire `<DocsLayout>` in `<article>`). Default is `"article"` — the correct semantic for a self-contained composition.

## 5. Interaction

Static layout shell. No interactive behavior authored by this component. Keyboard navigation follows natural tab order through slotted children. No focus management, no scroll orchestration, no sticky behavior (sticky TOC belongs to `DocsLayout` or `TableOfContents`).

## 6. A11y

- Root is `<article>` — carries the `article` landmark role. Assistive technology users can jump to it directly from the landmarks list.
- When nested inside `DocsLayout`, the `<article>` landmark is correctly identified as a sibling to `<aside>` (Sidebar) and the TOC `<nav>`.
- Header slot should contain an `<h1>` (via `ArticleHeader`) — required for correct heading hierarchy. `ArticleLayout` does not enforce this but documents it as the required consumer contract.
- No ARIA attributes added by `ArticleLayout` itself; semantic structure is provided by slotted children.
- `bleed`-width elements that break the visual container must not create horizontal scroll on the page. The engineer ensures `overflow-x: hidden` or `overflow-x: clip` on the root if bleed is used.

## 7. Motion

None. Static layout template. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` handles any transitions on slotted children. `ArticleLayout` emits no animations of its own.

## 8. Anti-patterns

- **Do not use as a general page layout.** `ArticleLayout` is for long-form single-column reading surfaces. Multi-column app dashboards belong in a different shell.
- **Do not nest `SiteShell` inside `ArticleLayout`.** `ArticleLayout` lives inside `<main>` — `SiteShell` is the outer page chrome.
- **Do not manage scroll or sticky position here.** Sticky TOC and sticky headers belong to `DocsLayout` or `TableOfContents`.
- **Do not place interactive shell elements (nav, global header) inside the article grid.** The grid is content; chrome is outside it.
- **Do not use `bleed` width for prose text.** Full-bleed prose breaks the reading measure and violates the layout contract. `bleed` is for visual media only (full-width images, video, decorative bands).
- **Do not skip the `header` prop in favor of placing `ArticleHeader` as the first child.** Slotting the header via the prop keeps it outside the content grid and allows consistent spacing without a consumer-managed grid-column override.

## 9. Depends on

- `ArticleHeader` (canonical `header` slot value)
- `Prose` (primary content child)
- `Figure`, `Pull`, `CodeBlock`, `VideoEmbed` (optional wide/bleed children)
- `DocsLayout` composes `ArticleLayout` as its center column
