# Design spec: Portrait

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-18
**Implements proposal**: GitHub issue #58

---

## 1. Purpose

Portrait is the editorial photography primitive. It renders a single figural or editorial photograph with correct CLS prevention, modern image format delivery (AVIF > WebP > JPEG fallback), and a strict alt-text contract. It is scoped to editorial and figural photography: portraits of people, press photography, testimonial imagery. Its first consumer is the pouk.ai /about v2 founder portrait; intended future consumers are /team, testimonials, and press photography.

The component's two structural jobs are: (1) ship the right bytes to the browser (AVIF > WebP > JPEG, correct srcset breakpoints, responsive sizes hint) and (2) prevent layout shift before the image loads (explicit width + height attributes derived from the declared aspect ratio).

Portrait does not handle product screenshots, interface diagrams, spot illustrations, or decorative photography. Those are explicitly deferred.

---

## 2. Anatomy

- picture root: the component root element. The forwarded ref targets this element. display: block on the root ensures consistent block layout behavior across browsers.
- AVIF source: first child of picture. type=image/avif. Carries the AVIF srcset and the consumer-provided sizes string.
- WebP source: second child of picture. type=image/webp. Same srcset breakpoints as AVIF, same sizes string.
- img fallback: final child of picture. The base URL without a ?w= query param. Carries alt, width, height, loading, fetchpriority, and inline style for aspect-ratio, object-fit, and object-position.

---

## 3. Tokens used

No brand tokens. Portrait is a structural CSS component. Every visual property is computed directly from props at render time.

---

## 4. Layout and rhythm

Aspect ratio, CLS width/height, and srcset generation documented in the implementation. See Portrait.tsx.

---

## 5. States

Loaded, Loading, Error — standard browser img states.

---

## 6. Motion

None. Static presentational component.

---

## 7. Accessibility

Portraits are never decorative. WCAG 1.1.1 requires a text alternative. Portrait refuses empty alt. Runtime enforcement in development: throws if alt is empty or whitespace-only.

---

## 8. Prop intent

- src: string or Astro ImageMetadata object
- alt: required, non-empty
- aspect: 1:1 | 3:4 | 4:3 | 16:9 | 9:16
- width: number, canonical source width
- loading: eager | lazy (default lazy)
- fetchPriority: high | auto | low (default auto)
- sizes: string (default 100vw)
- objectPosition: string (default center)

---

## 9. Composition rules

Portrait fills its containing block. Always place inside a width-constrained grid cell or column. Consumer wraps in figure + figcaption for captions. Portrait never emits figure or figcaption.

---

## 10. Out of scope

ProductImage, Screenshot, Diagram, DecorativeImage, Video portrait, border-radius prop, skeleton, caption slot, dark-mode filtering - all deferred.
