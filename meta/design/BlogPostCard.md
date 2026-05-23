# BlogPostCard

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`BlogPostCard` is the index-card preview unit for a single blog post. It surfaces a cover thumbnail (optional), a linked title, a lede excerpt, authorship via `Byline`, and topic classification via `TagList`. It is the repeating list-item inside `BlogList` and anywhere a blog post preview is rendered outside of a full article page — blog index, tag/category pages, related-posts rows.

## 2. Anatomy

```
┌─────────────────────────────────────────────┐
│ [Cover thumbnail — optional, aspect 16/9]   │
├─────────────────────────────────────────────┤
│ Title (linked)                              │
│ Lede excerpt                                │
│ [Byline — avatar + name + date + read time] │
│ [TagList — topic tags]                      │
└─────────────────────────────────────────────┘
```

- **Root**: `LinkCard` — full-surface anchor; the entire card is one keyboard/pointer target.
- **Cover slot** (optional): `<img>` or `<figure>` with a 16:9 aspect ratio. Omitted when no thumbnail is provided; the card collapses gracefully to text-only layout.
- **Title**: linked heading (`<h2>` or `<h3>` depending on context); Instrument Serif, card-title scale.
- **Lede**: 1–3 sentence excerpt; body register, muted color; capped at 2–3 lines via `-webkit-line-clamp`.
- **Byline slot**: `Byline` molecule — avatar + author name + role + publish date + optional read time.
- **TagList slot** (optional): `TagList` molecule — inline wrapped tags for topic classification.

## 3. Tokens

- `--surface` — card background (recessed elevation)
- `--bg-elevated` — card background in elevated/hover state
- `--hairline` — card border at rest
- `--hairline-w` — border width (1px)
- `--radius-3` — card corner radius (8px)
- `--space-4` — padding inside card, gap between cover and body
- `--space-3` — gap between title and lede; between lede and Byline
- `--space-2` — gap between Byline and TagList
- `--font-serif` — title font family
- `--fs-card-title` — title font size (clamp 24–32px)
- `--fs-body` — lede font size
- `--fs-meta` — used by Byline and TagList (delegated)
- `--fg` — title color
- `--fg-muted` — lede color, Byline secondary copy
- `--dur-fast` — hover transition duration (180ms)
- `--easing` — hover transition easing

## 4. Variants / Props

| Prop        | Type                        | Default     | Rationale                                                                 |
|-------------|-----------------------------|-------------|---------------------------------------------------------------------------|
| `href`      | `string`                    | required    | Destination URL; forwarded to `LinkCard` root anchor.                     |
| `title`     | `string`                    | required    | Post heading. Rendered as `<h2>` by default; level overridable via `headingLevel`. |
| `lede`      | `string`                    | required    | Short excerpt. Capped to 3 lines via `-webkit-line-clamp: 3`.             |
| `byline`    | `ReactNode`                 | required    | Accepts a `Byline` instance.                                              |
| `tags`      | `ReactNode`                 | `undefined` | Accepts a `TagList` instance. Omitted when no tags are provided.          |
| `cover`     | `{ src: string; alt: string }` | `undefined` | Optional cover image. Renders at 16:9 aspect ratio above the body.    |
| `headingLevel` | `2 \| 3`               | `2`         | Allows `BlogList` to semantically nest cards under a section `<h2>`.      |
| `tone`      | `"default" \| "subtle"`     | `"default"` | `subtle` uses transparent background + hairline border for use on `--surface-section` banded contexts. |

## 5. Interaction

- **Full-surface click target**: the entire card is the link. `LinkCard` handles the anchor wrapping.
- **Hover**: card lifts from `--surface` to `--bg-elevated`; border color deepens from `--hairline` to `--fg-muted` equivalent. Transition: `var(--dur-fast)` / `var(--easing)`.
- **Focus-visible**: `outline: 2px solid var(--accent); outline-offset: 4px; border-radius: var(--radius-3)` — applied to the `LinkCard` root anchor.
- **Active / pressed**: no separate active state beyond browser default.
- **Keyboard nav**: one tab stop per card (the `LinkCard` root anchor). No internal focusable children — `Byline` and `TagList` are presentational in this context.

## 6. A11y

- Root is an `<a>` via `LinkCard`. Semantic link; screen readers announce title as the accessible name.
- Heading level defaults to `h2`; the `headingLevel` prop must be set to `h3` when `BlogList` carries its own section heading to preserve outline hierarchy.
- Cover image `alt` is required when `cover` is provided; empty `alt=""` is not acceptable for a content image.
- `Byline` and `TagList` are inside the anchor; their text is included in the accessible name by default. To prevent verbose announcements, apply `aria-label` on the `LinkCard` root containing the post title alone, and mark the internal Byline/TagList container with `aria-hidden`. The engineer should evaluate the verbosity tradeoff and choose the approach that yields the most useful link announcement.
- Contrast: `--fg` (#1D1D1F) on `--surface` (#F5F5F7) = 15.46:1 (AAA). `--fg-muted` (#6E6E73) on `--surface` = 4.56:1 (AA normal).

## 7. Motion

- **Hover lift**: `background-color` and `border-color` transition over `var(--dur-fast)` (180ms) with `var(--easing)`.
- **No entrance animation on the card itself.** If `BlogList` introduces a stagger entrance, that is the organism's concern; `BlogPostCard` is static.
- **`prefers-reduced-motion`**: the global `animation-duration: 0.01ms` + `transition-duration: 0.01ms` block in `tokens.css` collapses the hover transition to instant. No per-component override needed.

## 8. Anti-patterns

- **Do not use as a navigation tile for non-editorial content.** `BlogPostCard` carries Byline and TagList — it implies authorship. Use `LinkCard` directly for generic content previews.
- **Do not nest interactive elements inside the card.** There is one link target (the `LinkCard` root). Adding a secondary "Read more" button creates overlapping click targets and breaks the single-anchor a11y contract.
- **Do not use for current-article context.** `BlogPostCard` is an index-preview. It must not appear on the article page it links to.
- **Do not truncate title.** Only the lede is clamped. Titles must be short enough to render fully; truncating a heading harms scannability and SEO.
- **Do not use `TagList` for status labels.** Tags here are editorial topics, not liveness state. Use `StatusBadge` for state; `TagList`/`Tag` for category.
- **Do not use in a `DataTable` row.** Card layout is inappropriate in tabular contexts; use a flat cell with a `Link` instead.

## 9. Depends on

- `LinkCard` — full-surface anchor root
- `Byline` — avatar + author + date + read time row
- `TagList` — wrapped tag collection
- `Tag` — consumed transitively through `TagList`
