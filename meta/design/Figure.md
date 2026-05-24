# Figure

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`Figure` is the semantic pairing molecule for an image (or Portrait) and its caption. It solves the repeated editorial pattern — an image followed by an attribution or explanatory line — by wrapping a media slot and a `Caption` atom inside a semantic `<figure>` element. It serves articles, case studies, docs, and any editorial surface where an image requires a formal captioned treatment.

## 2. Anatomy

```
<figure>                    ← Figure root
  [media slot]              ← Portrait, img, or any block media — consumer-provided
  <figcaption>              ← Caption atom, rendered in figcaption context
    "Photographer: Jane Doe"
  </figcaption>
</figure>
```

- **Root**: semantic `<figure>` element. No wrapper div.
- **Media slot** (`children` or named slot): accepts any block-level media node — `Portrait`, a raw `<img>`, a `CodeBlock`, etc. The Figure does not constrain what goes in the slot; it provides the containing semantic frame.
- **Caption slot**: a `Figure.Caption` sub-component (or a `caption` prop) that renders `Caption` inside `<figcaption>`. Optional — a Figure without a caption is semantically valid but uncommon.

## 3. Tokens

- `--fg-muted` — caption text color
- `--fs-micro` — caption font size (12px)
- `--tracking-micro` — caption letter-spacing (0.04em)
- `--font-sans` — caption font family
- `--lh-meta` — caption line-height (1.2)
- `--space-2` — gap between media slot and caption (8px)
- `--space-4` — block margin below the figure in flow (16px)

## 4. Variants / Props

| Prop        | Type                  | Default     | Rationale                                                                                         |
| ----------- | --------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `children`  | `ReactNode`           | —           | Media content occupying the figure slot. Required.                                                |
| `caption`   | `ReactNode`           | `undefined` | Shorthand caption string or node. Rendered inside `Figure.Caption`.                               |
| `align`     | `"start" \| "center"` | `"start"`   | Caption text-alignment. `"start"` for inline editorial; `"center"` for standalone figure moments. |
| `className` | `string`              | —           | Merged onto root `<figure>`.                                                                      |

`Figure.Caption` sub-component accepts `children: ReactNode` and forwards remaining props to the underlying `Caption` atom. This allows compound usage when caption content is richer than a plain string.

No `size` prop — Figure takes the full width of its containing column; the media slot governs intrinsic dimensions.

## 5. Interaction

Static. No hover, focus, or active states on the Figure itself. If the media slot contains an interactive element (e.g., a linked image), focus and hover are owned by that element, not by Figure.

## 6. A11y

- Root is `<figure>` — carries the implicit `figure` ARIA role. No additional `role` attribute needed.
- Caption renders inside `<figcaption>` — browsers associate it with the parent `<figure>` automatically; no `aria-labelledby` needed.
- Media content (`<img>`, `Portrait`) must carry its own `alt` text. Figure does not inject or synthesise alt text; that is the consumer's responsibility.
- `<figcaption>` text is read by screen readers as descriptive context for the figure. It must not duplicate the image's `alt` text verbatim — they serve different semantic roles.
- axe rule `region`: `<figure>` is not a landmark; no axe landmark rule applies.

## 7. Motion

None. Figure is a static layout molecule. No entrance animation, no transition on any property.

`prefers-reduced-motion` has no effect here. If a parent applies an entrance stagger, Figure participates as a block child with no internal motion contribution.

## 8. Anti-patterns

- **Do not use Figure as a generic card wrapper.** Figure is for media + caption pairings only. Use a card molecule for content with titles, bodies, and CTAs.
- **Do not put a heading inside Figure.** `<figure>` is not a section container; placing `<h2>`/`<h3>` inside it is a document-outline error. Headings belong outside.
- **Do not use Figure for decorative images.** If an image is purely decorative (empty `alt=""`), a caption is semantically confusing — it implies the image carries informational content. Decorative images do not need Figure wrapping.
- **Do not nest Figures.** `<figure>` inside `<figure>` is invalid HTML and conveys no useful semantic structure.
- **Do not substitute Figure for Blockquote.** Pull quotes and testimonials are `<blockquote>` territory, even if they share a similar visual register.
- **Do not hardcode media dimensions inside Figure.** The media slot governs its own dimensions; Figure must not set fixed widths or heights on slot content.

## 9. Depends on

- `Caption` (molecule) — renders the `<figcaption>` text.
- `Portrait` (atom) — the primary expected media slot content, though not required.
