# Design spec: Image

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<Image>` is the token-aware plain-image atom. It renders a single `<img>` element — logos, product screenshots, diagrams, spot illustrations, decorative photography — with CLS-safe intrinsic sizing, lazy loading by default, and an optional border-radius that maps to the DS radius scale.

Its structural job is narrow: emit a correctly-attributed `<img>` that never causes layout shift, never exceeds its container, and always carries an explicit aspect ratio so the browser can reserve space before the image loads. It does not manage srcsets, picture sources, or format negotiation. Those concerns belong to `<Portrait>`.

### Distinction from Portrait

`<Image>` and `<Portrait>` solve adjacent but non-overlapping problems.

**`<Image>`** is for static assets whose URL is known and stable at build time: logos, screenshots, interface diagrams, illustrations, decorative photography. The consumer controls the URL; the DS handles sizing, lazy loading, and layout safety. No srcset. No `<picture>`. No format fallback.

**`<Portrait>`** is the editorial photography primitive. It generates AVIF > WebP > JPEG srcsets at multiple breakpoints, enforces a non-empty alt contract at runtime, and is scoped specifically to figural / editorial photographs of people at card or section scale. If the surface calls for a founder photograph, a press headshot, or a testimonial image with multiple format and size variants, use `<Portrait>`. If it calls for a logo or a screenshot, use `<Image>`.

The boundary is: srcset / format negotiation / editorial photography → `<Portrait>`. Single URL, known dimensions, static asset → `<Image>`.

---

## 2. Anatomy

`<Image>` is a single element: a native `<img>` with no wrapper. There is no container `<div>`, no `<picture>`, no `<figure>`. The atom is the `<img>` itself.

- **Root (`<img>`)**: The component's only element. Carries `src`, `alt`, `width`, `height`, `loading`, `decoding`, and inline styles for `max-width`, `height`, `aspect-ratio`, and optionally `object-fit` and `border-radius`.

There is intentionally no wrapper. A wrapper would add DOM nodes without providing layout value — the `max-width: 100%` + `aspect-ratio` pattern on `<img>` directly is sufficient for CLS prevention and responsive containment. Consumers who need a positioned or captioned context should wrap `<Image>` in their own `<figure>`, `<div>`, or layout element.

---

## 3. Tokens used

No new tokens are introduced. `<Image>` reuses the existing radius scale exclusively.

| Token        | Value | Role                                            |
| ------------ | ----- | ----------------------------------------------- |
| `--radius-1` | `2px` | Radius for `radius="sm"` — subtle rounding      |
| `--radius-2` | `4px` | Radius for `radius="md"` — standard card corner |
| `--radius-3` | `8px` | Radius for `radius="lg"` — prominent rounding   |

`radius="none"` maps to `border-radius: 0` — the literal value, not a token. The `0` case is a hard reset, not a named brand value; it does not warrant a token.

No color tokens are used. `<Image>` has no background, no border, no text. The browser's native image rendering is the only visual output.

---

## 4. Layout and rhythm

### Inline styles (always applied)

These three rules are applied as inline styles on the `<img>` element unconditionally. They are the minimum contract for CLS-safe responsive images:

| Property       | Value                | Rationale                                                                                                                                                                                                                                    |
| -------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max-width`    | `100%`               | Constrains the image to its containing block. Prevents overflow at any viewport width. Universal responsive-image baseline.                                                                                                                  |
| `height`       | `auto`               | Allows height to derive from the intrinsic aspect ratio once `max-width` constrains the width. Without `height: auto`, the explicit `height` HTML attribute would lock the element to a fixed pixel height regardless of responsive scaling. |
| `aspect-ratio` | `{width} / {height}` | Computed from the required `width` and `height` props. Tells the browser the image's intrinsic proportions before any bytes are loaded, so it can reserve the correct vertical space. CLS prevention mechanism.                              |

### Conditional inline styles

Applied only when the corresponding prop is set:

| Prop     | CSS property    | Applied when…                                 |
| -------- | --------------- | --------------------------------------------- |
| `fit`    | `object-fit`    | `fit` prop is provided                        |
| `radius` | `border-radius` | always (class-driven, default `"none"` → `0`) |

`object-fit` has no DS default. When the consumer omits `fit`, no `object-fit` class is written — the browser's CSS default (`fill`) applies. This is intentional: for logos and illustrations displayed at their natural proportions, `fill` is correct (the image is already sized to the container). When the consumer clips or fills an asymmetric container (e.g. a fixed-height screenshot slot), they declare `fit` explicitly.

### `width` and `height` HTML attributes

The numeric `width` and `height` props are written as HTML attributes on the `<img>` element as well as contributing to the `aspect-ratio` inline style. Both are required for two distinct reasons:

1. **`aspect-ratio` computation** — both values are needed to express the ratio.
2. **`width` / `height` HTML attributes** — inform the browser's intrinsic-sizing hint used by layout engines before CSS is applied, and enable the browser's built-in aspect-ratio reservation even when CSS `aspect-ratio` has not yet been parsed (e.g. during FOUC or non-CSS rendering paths).

The consumer provides the image's natural pixel dimensions — not display dimensions. These are the pixel values from the source image file. The CSS `max-width: 100%` + `height: auto` combination then scales the image responsively within those proportions.

---

## 5. States

`<Image>` is a non-interactive presentational atom. It has no hover, focus, active, disabled, or error states at the component level.

**Loading.** The browser's native lazy-load behavior defers the image network request until the element approaches the viewport. Before the image bytes arrive, the element occupies the correct CLS-reserved space (from the `aspect-ratio` inline style) with a transparent background. No skeleton shimmer, no placeholder color. The blank space is the loading state.

**Error.** When the image fails to load (`<img>` fires `onerror`), the browser renders its native broken-image indicator. `<Image>` does not intercept this. There is no `onError` handler, no fallback URL, and no placeholder swap. This is a deliberate v1 constraint — see §10.

---

## 6. Motion

None. `<Image>` is a static presentational atom. No entrance animation, no hover transition, no fade-in. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` covers the system; no component-level handling is needed.

---

## 7. Accessibility

### `alt` is required at the type level, including the empty string

`alt` is a required prop with type `string`. The empty string (`alt=""`) is valid and explicitly supported — it marks the image as decorative to assistive technology. The consumer must declare their intent: either provide descriptive alt text, or explicitly pass `alt=""` to signal that the image is decorative.

`alt` is never optional (i.e. `alt?: string` is not the correct type). Making `alt` optional would allow consumers to omit it entirely, which produces an `<img>` with no alt attribute — the worst accessibility outcome (screen readers read the src URL as a fallback). The DS enforces the choice at the type level: the consumer must either describe the image or acknowledge it is decorative.

The distinction:

- `alt="Poukai logo"` — meaningful image. Screen readers announce the description.
- `alt=""` — decorative image. Screen readers skip the element entirely.
- `alt` omitted — invalid in this DS; enforced by TypeScript.

### Why `width` and `height` are required

Beyond CLS prevention (§4), the required numeric dimensions serve an indirect accessibility purpose: they prevent the browser from collapsing the image slot to zero height during load on slow connections, which would cause the page to reflow and shift focus for keyboard and screen-reader users as content paints below the fold. Stable layout is an accessibility property, not only a performance one.

### Contrast

`<Image>` has no text content and no border. No contrast check is required. The image content's own contrast is the responsibility of the asset creator, not the DS.

### Keyboard interaction

`<Image>` is not focusable and not interactive. It has no `tabIndex`. Interactive wrappers (links, buttons) are the consumer's composition responsibility — the consumer wraps `<Image>` in an `<a>` or `<button>`; `<Image>` does not become a control.

---

## 8. Prop intent

```
// INTENT ONLY — engineer designs the actual API

Root element: <img> — non-polymorphic. No `as` prop.

Required:
  src: string
    The image URL. Passed directly as the <img> src attribute.

  alt: string
    Alt text for the image. Required at the type level.
    - Pass a descriptive string for meaningful images: alt="Poukai logo"
    - Pass an empty string for decorative images: alt=""
    - Never omit. The type is `string`, not `string | undefined`.

  width: number
    The image's intrinsic width in pixels (from the source file).
    Written as the HTML width attribute and used to compute aspect-ratio.

  height: number
    The image's intrinsic height in pixels (from the source file).
    Written as the HTML height attribute and used to compute aspect-ratio.

Optional:
  loading?: "lazy" | "eager"
    Default: "lazy".
    Controls the browser's native lazy-loading behavior.
    Use "eager" for above-the-fold images that are visible on page load
    (e.g. a hero logo or an above-the-fold screenshot).

  decoding?: "async" | "sync" | "auto"
    Default: "async".
    Controls the browser's image decoding hint.
    "async" is correct for the vast majority of images; it allows the
    browser to decode off the main thread without blocking rendering.
    "sync" is only appropriate for images that must be decoded before
    the page is interactive (rare). "auto" defers the choice to the browser.

  fit?: "cover" | "contain" | "fill" | "none" | "scale-down"
    Default: not set (CSS default "fill" applies when omitted).
    Maps to the object-fit CSS property.
    Omit for most use cases (logos, illustrations sized to their container).
    Set when the image occupies a fixed-dimension slot and needs to fill
    or contain without distortion (e.g. a fixed-height screenshot band,
    a circular or square image slot).

  radius?: "none" | "sm" | "md" | "lg"
    Default: "none".
    Maps to border-radius on the <img> element:
      "none" → border-radius: 0
      "sm"   → border-radius: var(--radius-1)  (2px)
      "md"   → border-radius: var(--radius-2)  (4px)
      "lg"   → border-radius: var(--radius-3)  (8px)

Additional HTML attributes:
  The component spreads remaining props onto the <img> element
  (className, style, data-*, aria-*, etc.).
  The inline styles for max-width, height, aspect-ratio are applied
  before the consumer's style spread, so the consumer can override
  individual properties if needed.
```

**Non-polymorphic root.** The root is always `<img>`. There is no `as` prop. `<img>` is the correct and only semantic element for this component's purpose; no valid alternative warrants a polymorphic API.

**`fit` has no DS default.** Setting a default of `"fill"` would be nominally accurate (it matches the CSS default) but misleading — it implies the DS has made a brand decision where there is none. The correct expression is: when `fit` is omitted, no `object-fit` style is written, and the browser's CSS default applies. This is semantically different from the DS actively choosing `"fill"`.

**`radius` defaults to `"none"`.** Images without rounded corners are the common case. The consumer opts in to rounding explicitly. A default of any non-zero value would add rounding everywhere without intent.

**`forwardRef<HTMLImageElement, ImageProps>`, `displayName`.** Consistent with all atoms in the DS. The forwarded ref targets the `<img>` element directly.

---

## 9. Composition rules

- **Inside a flex or grid cell.** `<Image>` is a block-level element (`display: block` removes the inline-baseline gap). It fills the cell's inline axis up to the image's natural width (governed by `max-width: 100%`). No wrapper is needed.

- **Inside a fixed-dimension slot.** When the consumer constrains both width and height on the parent container, pass `fit="cover"` or `fit="contain"` to control how the image fills the slot. Without a `fit` prop, the browser's default `fill` will stretch the image to fit both dimensions exactly, which distorts non-matching aspect ratios.

- **Inside a linked context.** Wrap `<Image>` in `<a>` for linked images (logos, linked screenshots). The `<a>` element is the interactive affordance; `<Image>` does not become a button or link.

- **With a caption.** Wrap `<Image>` in a `<figure>` and add a `<figcaption>`. `<Image>` never emits `<figure>` or `<figcaption>`.

- **`<Image>` must not be used for editorial photography with format variants.** If the asset requires AVIF/WebP/JPEG fallback or responsive srcsets, use `<Portrait>`. The two components are not interchangeable. `<Portrait>` owns the multi-format editorial image primitive; `<Image>` owns the single-URL static asset.

- **Avatar, not Image, for person attribution disks.** If the surface needs a person's photograph at attribution scale (24–40px, circular, inside a row), use `<Avatar>`. `<Image>` has no built-in circular clipping and no attribution semantics.

---

## 10. Out of scope

- **`srcset` and `sizes`.** Single-URL rendering only. If the asset requires responsive breakpoint variants or format negotiation, use `<Portrait>`.

- **`<picture>` with multiple `<source>` children.** `<Portrait>` owns this pattern. `<Image>` is always a plain `<img>`.

- **`onError` / fallback URL.** When the image fails to load, the browser's native broken-image indicator is the v1 behavior. An `onError` fallback mechanism (swap to a placeholder URL, show a colored slot) would require React state and is deferred. Consumers who need error handling should manage it in their own wrapper component.

- **Skeleton / shimmer loading state.** The `aspect-ratio`-reserved blank space is the loading state. No animated placeholder.

- **`objectPosition` prop.** `object-position` is not exposed in v1. When `fit` is set to `"cover"` or `"contain"`, the default `object-position: center` (CSS default) applies. If a consumer needs to shift the crop point, they can pass an inline `style` override via the spread. Uncommon need; does not warrant a named prop in v1.

- **`fetchPriority`.** Not exposed as a prop. Consumers who need `fetchpriority="high"` for LCP images can pass it via the spread (`<Image fetchPriority="high" ... />`). This maps to the standard React `fetchPriority` prop on `<img>`.

- **Dark-mode filtering.** No `filter: brightness()` or `invert()` logic. Dark-mode image variants are the asset creator's responsibility.

- **Animated images (GIF, APNG, animated WebP).** `<Image>` renders them natively without restriction. The DS makes no motion contract for the asset content itself — only for DS-authored animations, which this component has none of.

- **`<figure>` + `<figcaption>` slot.** Out of scope for this atom. If a captioned image primitive is needed, that is a molecule-level concern.

- **`prefers-reduced-motion` for asset content.** The `@media (prefers-reduced-motion: reduce)` token in `tokens.css` covers DS-authored transitions. Animated image assets (GIFs, etc.) played by the browser are outside the DS's motion contract.
