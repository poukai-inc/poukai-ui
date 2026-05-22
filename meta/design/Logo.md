# Design spec: Logo

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-22

---

## 1. Purpose

`<Logo>` is the token-aware partner/customer logo atom. It renders a single logo image — constrained to a consistent max-height, treated for tone — inside a logo strip (LogoCloud) or any other surface that needs a branded third-party mark.

Its structural job is narrow: accept a logo image URL, enforce the correct max-height for the requested size, apply the correct tone treatment (color, mono, or muted) via CSS filter and opacity, and forward a ref to the underlying `<img>`. It does not manage logo grids, carousels, or any multi-logo layout. That concern belongs to a LogoCloud organism that composes multiple `<Logo>` cells.

`<Logo>` composes `<Image>` rather than emitting a raw `<img>`. `<Image>` owns the CLS-safe intrinsic-sizing contract (`aspect-ratio`, `max-width: 100%`, `height: auto`, lazy loading by default). `<Logo>` layers the max-height constraint and tone treatment on top, passing all required Image props through.

---

## 2. Anatomy

`<Logo>` is a single element: the `<Image>` atom, which itself renders a single `<img>`. There is no wrapper `<div>`, no `<span>`, no `<figure>`. The atom is the `<img>` itself, reached via `<Image>`.

- **Root (`<img>` via `<Image>`)**: The component's only element. Carries all Image props (`src`, `alt`, `width`, `height`, `loading`, `decoding`) plus inline style overrides for `maxHeight`, `width: auto`, and CSS `filter` and `opacity` derived from the `tone` prop.

There is intentionally no wrapper. Max-height constraint and tone treatment are applied as inline style overrides passed to `<Image>` — `<Image>` merges them with its own baseline inline styles (`max-width: 100%`, `height: auto`, `aspect-ratio`). The net result is a single `<img>` with the full combined style contract. No extra DOM node is introduced.

---

## 3. Tokens used

No new tokens are introduced. `<Logo>` reuses one existing motion token.

| Token        | Value | Role                                                    |
| ------------ | ----- | ------------------------------------------------------- |
| `--dur-fast` | 180ms | Opacity transition duration for `tone="muted"` on hover |

The `--easing` token (`cubic-bezier(0.16, 1, 0.3, 1)`) accompanies `--dur-fast` in the transition shorthand. It is used here consistently with all other DS transitions.

No color tokens are used. Tone treatment is expressed via CSS `filter` and `opacity` literal values — they are rendering rules for third-party assets, not brand decisions that warrant named tokens. The filter values are defined in §6.

---

## 4. Layout and rhythm

### Inline style overrides (always applied, passed to Image)

These rules extend Image's baseline inline styles. They are applied unconditionally, regardless of prop values:

| Property    | Value                      | Rationale                                                                                                                                                                                                                                                |
| ----------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `width`     | `auto`                     | Overrides Image's `max-width: 100%` + native `width` attribute combination. Allows the image to shrink to its natural aspect-ratio width within the max-height constraint.                                                                               |
| `maxWidth`  | `none`                     | Removes Image's `max-width: 100%` so `width: auto` and `maxHeight` together govern dimensions. Without this, `max-width: 100%` would constrain the image to its container's inline size, potentially overriding the max-height aspect-ratio calculation. |
| `maxHeight` | Size-dependent (see below) | The primary sizing constraint. Forces all logos in a strip to the same cap height regardless of intrinsic proportions.                                                                                                                                   |
| `height`    | `auto`                     | Image already writes `height: auto`; Logo preserves it. Height derives from the intrinsic aspect ratio once max-height is applied.                                                                                                                       |

### Size → max-height map

| `size` prop | `maxHeight` value |
| ----------- | ----------------- |
| `"sm"`      | `24px`            |
| `"md"`      | `32px`            |
| `"lg"`      | `40px`            |

Default is `"md"` (32px). These three rungs correspond to dense logo strips (sm), standard logo clouds (md), and featured/hero logo placements (lg).

### Intrinsic width and height props

`width` and `height` are passed through to `<Image>` to drive `aspect-ratio` computation and the HTML `width`/`height` attributes for CLS prevention. Logo exposes them as optional with defaults (`width=200`, `height=80`) so consumers can drop in `<Logo src="…" alt="…" />` without knowing intrinsic dimensions. Consumers who know the true intrinsic pixel dimensions of the asset should pass them — accurate dimensions produce the most precise CLS-safe aspect-ratio reservation.

The defaults (200 × 80) represent a 2.5:1 ratio, a reasonable centroid for landscape-oriented wordmark logos. They are not a brand decision; they are a fallback for rough layout reservation. The engineer should document the defaults clearly in the component's prop types.

---

## 5. States

`<Logo>` in `tone="color"` and `tone="mono"` is a non-interactive presentational atom. It has no hover, focus, active, or disabled states.

`tone="muted"` adds a single hover/focus-visible state: opacity rises from 0.55 to 1. See §6 for the full rendering and transition spec.

**Loading.** Identical to `<Image>`: the browser defers the network request until the element approaches the viewport (lazy loading default). The CLS-reserved space (from `aspect-ratio`) holds open while bytes load. No skeleton or shimmer.

**Error.** Identical to `<Image>`: the browser's native broken-image indicator. No `onError` handler, no fallback.

---

## 6. Rendering rules

Tone is expressed entirely via inline CSS `filter` and `opacity` on the `<img>` element. No class is needed.

| `tone`    | `filter`                     | `opacity` (resting) | Hover / focus-visible | Transition                              |
| --------- | ---------------------------- | ------------------- | --------------------- | --------------------------------------- |
| `"color"` | none                         | `1`                 | Static — no change    | None                                    |
| `"mono"`  | `grayscale(1) brightness(0)` | `1`                 | Static — no change    | None                                    |
| `"muted"` | `grayscale(1) brightness(0)` | `0.55`              | `opacity: 1`          | `opacity var(--dur-fast) var(--easing)` |

Default tone is `"mono"`. A logo cloud whose tone is unspecified renders all marks as black silhouettes — the most typographically neutral register for a diverse set of partner marks on a light background.

**Why `brightness(0)` and not `grayscale(1)` alone.** `grayscale(1)` desaturates to a luminance-matched gray, which preserves the relative lightness of the logo's original colors. A logo with a light-yellow mark would remain light gray — nearly invisible on `--bg`. `brightness(0)` after `grayscale(1)` collapses all luminance to zero, producing a true black silhouette. This is the correct register for a partner logo strip: uniform visual weight, no mark is accidentally lighter than others.

**Muted default tone.** Default is `"mono"`, not `"muted"`, because muted implies interactivity (the hover state is a reveal). If `<Logo>` is not wrapped in a link, the hover affordance is misleading. Consumers who wrap `<Logo>` in an `<a>` should use `tone="muted"` to signal that the logo is interactive.

---

## 7. Hover/focus contract

Applies only to `tone="muted"`. The `tone="color"` and `tone="mono"` renders are static.

- **Resting state**: `opacity: 0.55`.
- **Hover (`:hover`)**: `opacity: 1`. Applied when the pointing device supports hover (`@media (hover: hover)` — same conditional as `tokens.css` link rules).
- **Focus-visible (`:focus-visible`)**: `opacity: 1`. Same value as hover. `<Logo>` is not itself focusable; this state applies when `<Logo>` is the child of a focused `<a>` or `<button>` that the consumer has composed.
- **Transition**: `opacity var(--dur-fast) var(--easing)` — 180ms expo-out, consistent with all other state transitions in the DS.
- **Reduced motion**: The global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` sets `transition-duration: 0.01ms !important` on all elements. No component-level `prefers-reduced-motion` handling is required. The opacity still changes; the transition collapses to imperceptibility, which is the correct reduced-motion pattern — the state change itself is not suppressed, only the animation.

---

## 8. Dark mode

`<Logo>` has no dark-mode overrides and requires none in this version.

**`tone="color"`**: Full-color logos render on whatever background the consumer places them. Dark-mode page background (`--bg: #000000`) is the consumer's concern, not Logo's.

**`tone="mono"` and `tone="muted"`**: `brightness(0)` produces a black silhouette in light mode. In dark mode, the global palette inversion (dark `--bg: #000000`) means a black silhouette would be invisible on a black background. This is a known limitation of the current spec. The correct resolution — either `brightness(1)` in dark mode for a white silhouette, or a consumer-supplied dark-mode logo asset — is deferred to a follow-up. Do not add dark-mode `filter` overrides now; that decision belongs in a dedicated spec revision once dark-mode LogoCloud usage is confirmed.

If a consumer needs dark-mode logo treatment today, they should use `tone="color"` and supply assets designed for both modes, or wrap `<Logo>` and apply their own dark-mode style.

---

## 9. Accessibility

### `alt` is required, and it should name the organisation

`alt` is a required prop with type `string`. For logo images, `alt` should be the organisation's name (e.g. `alt="Stripe"`). This is the correct accessible label: a screen reader user hearing "Stripe" understands the content; "logo" alone is not useful. The empty string (`alt=""`) is valid if the logo is purely decorative and its organisation name is communicated through adjacent text.

`<Logo>` does not add an `aria-label`. The `alt` attribute on `<img>` is the accessible label. Adding both would be redundant and potentially confusing to assistive technology.

### Keyboard interaction

`<Logo>` is not focusable and not interactive on its own. Interactive affordances (links, buttons) are the consumer's composition responsibility. When `<Logo>` is wrapped in an `<a>`, the `<a>` element receives focus; `<Logo>` / `<img>` does not.

### Contrast

`<Logo>` has no DS-authored text content. The logo image's own contrast is the asset creator's responsibility. The DS does not enforce contrast on third-party logo assets.

### `tone="muted"` at 0.55 opacity

At resting state, a muted logo at 0.55 opacity on `--bg (#FBFBFD)` will reduce the effective contrast of the logo image. This is a deliberate tone decision — muted signals "secondary / not the primary action" — and is accepted at the design level. The opacity target of 1 on hover/focus ensures the logo is fully legible when the user interacts with it.

---

## 10. Prop intent

```
// INTENT ONLY — engineer designs the actual API

Root element: <img> via <Image> — non-polymorphic. No `as` prop.

Required:
  src: string
    The logo image URL. Passed directly to <Image>.

  alt: string
    The organisation's name. Required at the type level.
    - Pass the org name for meaningful logos: alt="Stripe"
    - Pass an empty string for decorative logos: alt=""
    - Never omit. The type is `string`, not `string | undefined`.

Optional:
  tone?: "color" | "mono" | "muted"
    Default: "mono".
    Controls the CSS filter and opacity applied to the <img>.
    - "color": no filter, full opacity. Use for full-colour logo assets.
    - "mono": grayscale(1) brightness(0), full opacity. Black silhouette.
    - "muted": grayscale(1) brightness(0), opacity 0.55 resting. Use when
      <Logo> is inside an interactive element (e.g. <a>); hover reveals
      full opacity.

  size?: "sm" | "md" | "lg"
    Default: "md".
    Controls the max-height constraint applied to the <img>:
      "sm" → maxHeight: 24px
      "md" → maxHeight: 32px
      "lg" → maxHeight: 40px

  width?: number
    Default: 200.
    Passed to <Image> as the intrinsic width (px from the source file).
    Used to compute aspect-ratio for CLS prevention.
    Override with the logo asset's true intrinsic width when known.

  height?: number
    Default: 80.
    Passed to <Image> as the intrinsic height (px from the source file).
    Used to compute aspect-ratio for CLS prevention.
    Override with the logo asset's true intrinsic height when known.

Forwarded ref: HTMLImageElement — consistent with <Image>. The ref
  targets the underlying <img> element directly.

Additional HTML attributes:
  The component spreads remaining props onto <Image> (and by extension onto
  the <img> element): className, style, data-*, aria-*, loading, decoding.
  Inline style overrides for maxHeight, width, maxWidth, filter, and opacity
  are applied before the consumer's style spread, so the consumer can
  override individual properties if needed.
```

**Non-polymorphic root.** The root is always `<img>` (via `<Image>`). There is no `as` prop.

**`width` and `height` are optional on `<Logo>` even though they are required on `<Image>`.** `<Logo>` satisfies `<Image>`'s requirement by supplying defaults (200 × 80). The consumer overrides them when they know the true intrinsic dimensions. Making them required on `<Logo>` would add friction for the most common use case — dropping in a logo URL with no additional metadata — without changing the CLS behaviour materially. The defaults produce a reasonable aspect-ratio reservation for most wordmark logos.

**`loading` defaults to `"lazy"` (inherited from `<Image>`).** Logo clouds are typically below the fold. The consumer can pass `loading="eager"` for above-the-fold logo placements (e.g. a hero partner logo).

---

## 11. Composition rules

- **Inside a LogoCloud organism.** `<Logo>` is the cell primitive. The organism controls the grid layout (flex or CSS grid), gap rhythm, and whether logos are wrapped in links. `<Logo>` has no opinion about its siblings.

- **Inside an `<a>` for linked logos.** Wrap `<Logo>` in an `<a>` for linked partner logos. Use `tone="muted"` when inside a link — the hover state signals interactivity. The `<a>` is the interactive affordance; `<Logo>` does not become a button or link.

- **Inside a flex or grid cell.** `<Logo>` (an `<img>`) is a replaced element. Set `display: block` on the `<img>` or on the cell to remove the inline-baseline gap. The engineer should set `display: block` on the `<img>` inside `<Image>` if not already done; otherwise the consumer's grid cell may have an unexpected bottom gap.

- **Do not compose `<Logo>` with `<Portrait>`.** `<Portrait>` owns editorial photography with multi-format srcsets. `<Logo>` is for static logo assets at a known URL.

- **Do not use `<Logo>` for a person's avatar or headshot.** Use `<Avatar>`. `<Logo>` has no circular clipping, no attribution semantics, and is sized for logo-strip max-heights (24–40px cap), not avatar disks.

- **`<Image>` directly for non-logo static assets.** If the surface needs a screenshot, diagram, or illustration — not a partner/customer mark — use `<Image>` directly. `<Logo>` is specifically for the logo-strip use case: consistent max-height cap plus tone treatment. Using `<Logo>` for non-logo assets conflates concerns.

---

## 12. Out of scope

- **LogoCloud organism.** `<Logo>` is the cell; the grid layout, gap rhythm, and responsive reflow are the organism's concern. No LogoCloud spec is included here.

- **Brand-specific logos baked in.** `<Logo>` is a generic wrapper. No logo URLs, no partner names, no brand tokens are hardcoded.

- **Dark-mode tone.** `tone="mono"` produces a black silhouette. In dark mode this silhouette is invisible against a dark background. A dark-mode-aware tone (e.g. `"mono-dark"`, or an automatic `filter: invert(1)` in dark mode) is deferred. See §8.

- **Animated logos (GIF, animated WebP, Lottie).** `<Logo>` renders them natively without restriction via `<Image>`. The DS makes no motion contract for the asset content itself.

- **`onError` / fallback.** Identical to `<Image>`: out of scope for v1.

- **`srcset` / `<picture>`.** Single-URL rendering only. Format negotiation belongs to `<Portrait>`.

- **Tooltip / popover.** If a logo strip needs a tooltip on hover (e.g. organisation name), that is the consuming organism's responsibility. `<Logo>` does not render a tooltip and has no `title` prop intent.

- **`object-fit`.** Max-height + width auto is the sizing model. `object-fit` is not needed; logos scale proportionally to fit within the height cap.

- **`radius`.** Logo images do not receive border-radius. If a rounded logo container is needed, the consumer applies it to a wrapping element.
