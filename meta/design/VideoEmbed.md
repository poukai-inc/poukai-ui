# VideoEmbed

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

VideoEmbed is a responsive iframe wrapper that renders YouTube, Vimeo, or any generic embed URL at a fixed intrinsic aspect ratio, preventing Cumulative Layout Shift (CLS) as the embed loads. It serves editorial pages, case studies, and documentation surfaces where a hosted video needs to sit inline with prose content without layout thrash.

> Status: deferred / demand-pull. Do not implement until a consumer
> surface explicitly requests it.

## 2. Anatomy

```
┌─────────────────────────────────────┐
│ .root  (block container)            │
│  └─ .ratio  (aspect-ratio box)      │
│      └─ <iframe>  (fills .ratio)    │
└─────────────────────────────────────┘
```

- **Root** — `<figure>` by default; carries `display: block` and optional `max-width`.
- **Ratio box** — `<div>` with `aspect-ratio` set from the `aspectRatio` prop; `position: relative; overflow: hidden`.
- **Iframe** — `position: absolute; inset: 0; width: 100%; height: 100%`; receives `src`, `title`, `loading="lazy"` by default, and the `allow` sandbox attribute set.

## 3. Tokens

- `--radius-3` — border-radius on the ratio box (8px; matches card/surface rounding)
- `--surface` — optional placeholder background while the iframe loads (#f5f5f7)
- `--hairline` — 1px border around the ratio box when `bordered` is true
- `--hairline-w` — border width (1px)
- `--space-4` — gap between the iframe and an optional Caption slot below

## 4. Variants / Props

| Prop          | Type                                 | Default  | Rationale                                                                                                            |
| ------------- | ------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `src`         | `string`                             | —        | Required. The embed URL (YouTube `/embed/`, Vimeo player, or generic).                                               |
| `title`       | `string`                             | —        | Required for a11y. Passed to `<iframe title>`.                                                                       |
| `aspectRatio` | `"16/9" \| "4/3" \| "1/1" \| string` | `"16/9"` | CSS `aspect-ratio` value. `"16/9"` covers YouTube/Vimeo. `"4/3"` for legacy formats. Free string for unusual ratios. |
| `lazy`        | `boolean`                            | `true`   | Sets `loading="lazy"` on the iframe. Set `false` for above-fold video.                                               |
| `bordered`    | `boolean`                            | `false`  | Adds `--hairline-w solid --hairline` border around the ratio box. Useful in docs contexts.                           |
| `caption`     | `ReactNode`                          | —        | Optional Caption slot rendered below the ratio box inside the `<figure>`.                                            |

## 5. Interaction

No interactive states on the wrapper itself. The iframe owns all player controls and keyboard interaction internally. The `<iframe>` carries `tabIndex={0}` by default (browser default); no override needed. Focus ring applied via the global `a:focus-visible` pattern is not appropriate here — the iframe is not an anchor. The ratio box receives no pointer events beyond passing through to the iframe.

## 6. A11y

- Root renders as `<figure>` so an optional `<figcaption>` (via the `caption` slot) is semantically correct.
- `title` prop is required and maps directly to `<iframe title="...">` — this is the primary accessibility label for screen readers navigating by frame.
- `allow` attribute should include at minimum `"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"` to avoid browser-level capability errors.
- No `aria-label` or `role` additions needed on the wrapper; `<figure>` + `<iframe title>` is the correct semantic shape.
- Contrast: no text rendered directly by this component; caption slot defers to Caption atom.

## 7. Motion

None — static component. The iframe's internal player animations are not owned by the DS. `prefers-reduced-motion` has no effect on this wrapper; any autoplay behavior is the consumer's responsibility via URL params (e.g. `?autoplay=0`).

## 8. Anti-patterns

- **Do not use for self-hosted `<video>` elements.** That is a different primitive with native controls, caption tracks, and poster image concerns.
- **Do not embed arbitrary third-party scripts via `<iframe src>`.** VideoEmbed is for hosted video players only, not generic sandboxed pages.
- **Do not use for audio embeds.** Use AudioPlayer instead.
- **Do not use as a full-page background or hero media.** VideoEmbed is an inline editorial primitive; full-bleed video backgrounds require a dedicated layout pattern.
- **Do not omit the `title` prop.** An untitled iframe is an a11y violation; treat `title` as effectively required.

## 9. Depends on

- `Caption` (molecule) — for the optional caption slot below the embed.
