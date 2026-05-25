# GalleryGrid

**Status**: Approved

## 1. Intent

`<GalleryGrid>` is a Section-framed responsive grid of `Portrait` molecules where each item can be clicked to open an enlarged view via a `Dialog` overlay. It serves editorial and portfolio surfaces — "Selected work", "Project screenshots", "Team photos" — where consumers need a scannable thumbnail grid with a lightbox affordance. Optional per-image captions appear below each thumbnail and inside the enlarged Dialog.

## 2. Anatomy

```
<Section heading="Selected work">
  [grid — CSS grid, responsive columns]
    <GalleryGrid.Item> × n
      <Portrait src alt />         ← thumbnail, full grid-cell width
      <figcaption>caption</figcaption>  ← optional, muted micro text
    </GalleryGrid.Item>
  [Dialog]                          ← shared single overlay, portal-mounted
    <Portrait src alt />            ← enlarged view
    <p>caption</p>                  ← optional, muted text
    <button aria-label="Close">     ← IconButton
```

Each item is a `<figure>` element. The grid and Section header are owned by the organism; the Dialog is a shared singleton that opens to show the tapped item.

## 3. Tokens

- `--space-4` — gap between grid items (default)
- `--space-2` — gap between thumbnail and caption
- `--space-6` — gap between Section header and grid body
- `--fs-micro` — caption font size
- `--fg-muted` — caption text color
- `--font-sans` — caption font family
- `--lh-meta` — caption line-height
- `--surface` — Dialog content background (via Dialog atom)
- `--bg-elevated` — Dialog overlay surface (via Dialog atom)
- `--hairline` — Dialog border (via Dialog atom)
- `--hairline-w` — Dialog border width (via Dialog atom)
- `--radius-3` — Portrait border-radius (via Portrait atom)
- `--accent` — focus ring on interactive items and close button
- `--radius-1` — focus ring border-radius
- `--dur-fast` — hover opacity transition on thumbnail
- `--dur-mid` — Dialog open/close transition (via Dialog atom)
- `--easing` — Dialog entrance easing (via Dialog atom)

## 4. Variants / Props

| Prop       | Type                   | Default     | Rationale                                                                                            |
| ---------- | ---------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `heading`  | `string`               | —           | Optional Section eyebrow/title; omit for anonymous grids                                             |
| `columns`  | `2 \| 3 \| 4`          | `3`         | Controls CSS grid `repeat(n, 1fr)`; collapses to 1 at `< 480px`, 2 at `480–767px` regardless of prop |
| `gap`      | `"default" \| "tight"` | `"default"` | `"default"` uses `--space-4`; `"tight"` uses `--space-2` for denser editorial grids                  |
| `children` | `ReactNode`            | —           | `GalleryGrid.Item` nodes only                                                                        |

**`GalleryGrid.Item` sub-component props:**

| Prop      | Type     | Default  | Rationale                                        |
| --------- | -------- | -------- | ------------------------------------------------ |
| `src`     | `string` | required | Image URL; passed to Portrait                    |
| `alt`     | `string` | required | Alt text; required for a11y                      |
| `caption` | `string` | —        | Optional label below thumbnail and inside Dialog |

## 5. Interaction

- **Click / Enter / Space on a thumbnail**: opens the Dialog overlay with the enlarged Portrait and caption.
- **Close Dialog**: `Esc` key, clicking the backdrop, or activating the close IconButton. Focus returns to the triggering thumbnail.
- **Hover on thumbnail** (pointer devices): subtle opacity reduction (`0.85`) transitions over `--dur-fast` to signal the item is interactive. Restores on `mouseleave`. Suppressed when `prefers-reduced-motion: reduce` is active.
- **Focus order**: thumbnails are tab-navigable in DOM order. The Dialog close button receives focus on open (managed by Dialog). On close, focus returns to the activating thumbnail.
- **Keyboard within Dialog**: Tab cycles between the close button and any focusable content inside the overlay. Arrow keys do not navigate between images in the Dialog — that is a lightbox navigation pattern outside this spec.

## 6. A11y

- Each item renders as `<figure>` with `<figcaption>` when caption is present.
- Each thumbnail is wrapped in a `<button>` (or has `role="button"` + `tabindex="0"`) to make it keyboard-activatable with a visible `:focus-visible` ring via `--accent`.
- The Dialog uses `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the caption or a visually hidden title.
- The close button carries `aria-label="Close"`.
- `alt` on Portrait is required; the DS emits a dev warning if `alt` is an empty string on a non-decorative item.
- Contrast: `--fg-muted` on `--bg` = 4.91:1 (AA ✓) for caption text at `--fs-micro` (12px large-text threshold is 3:1; 12px does not meet large-text; this is informational caption only — consumer should verify per WCAG 1.4.3 if captions are essential).

## 7. Motion

- **Thumbnail hover**: `opacity` transition, `--dur-fast` (180ms), `--easing`. Reduced-motion: no transition (tokens.css global clamp applies).
- **Dialog open**: delegated to Dialog atom — scale + fade entrance, `--dur-mid` (240ms), `--easing`. Reduced-motion: Dialog renders without animation per its own spec.
- **Dialog close**: delegated to Dialog atom.

## 8. Anti-patterns

- Not for primary navigation imagery — use `<Hero>` or `<Portrait>` directly.
- Not for single images — use `<Figure>` or `<Portrait>` with a `<Caption>`.
- Not for video thumbnails — use `<VideoEmbed>` or a future `VideoGrid`.
- Not for data-dense lists — use `<Table>` or `<DataTable>`.
- Not as a carousel — items are not sequentially navigable inside the Dialog; use `<Carousel>` for that pattern.
- Not for user-generated upload previews in product UIs — this is an editorial/portfolio organism, not a file-picker grid.

## 9. Depends on

- `Section` — outer framing, heading, block padding
- `Portrait` — thumbnail and enlarged view rendering
- `Dialog` — lightbox overlay with focus trap and Radix accessibility primitives
- `IconButton` — close button inside Dialog

## Open questions

- **Caption contrast at `--fs-micro` (12px)**: `--fg-muted` on `--bg` passes AA for large text (3:1) but 12px is not large text under WCAG 2.1, requiring 4.5:1. 4.91:1 passes, but only if captions render on `--bg` directly. If grid items sit on a `--surface-section` band, contrast drops to ~4.66:1 — still passes AA but worth confirming the expected surface context before implementation.
- **Dialog shared vs. per-item**: spec assumes a single Dialog instance with dynamic content (src, alt, caption swapped on open). Confirm whether the Dialog atom's API supports controlled content injection or whether a per-item Dialog is preferred. The shared approach is lighter in the DOM; the per-item approach is simpler to implement without coordination state.
