---
"@poukai-inc/ui": minor
---

Add `Image` atom — token-aware plain-image primitive with CLS-safe sizing.

`Image` is the single-URL static-asset primitive: logos, screenshots, illustrations, decorative photography. Root is `<img>` (non-polymorphic, no wrapper). Required props are `src`, `alt` (empty string allowed for decorative — required at the type level), `width`, and `height` — the numeric dimensions drive both the HTML `width`/`height` attributes and an inline `aspect-ratio` style so the browser reserves the correct vertical slot before any image bytes arrive.

Optional `loading` defaults to `"lazy"`, `decoding` defaults to `"async"`. `fit` maps to `object-fit` (no DS default — when omitted, the browser's CSS default applies). `radius` (`"none"` | `"sm"` | `"md"` | `"lg"`) maps to the existing `--radius-1`/`--radius-2`/`--radius-3` scale; default is `"none"`.

Inline-style baseline (always applied): `max-width: 100%`, `height: auto`, `aspect-ratio: width/height` — the minimum contract for CLS-safe responsive images. No new tokens introduced.

`Image` is intentionally distinct from `Portrait`. Portrait owns editorial photography with AVIF/WebP/JPEG srcset and `<picture>`; `Image` is the plain single-URL atom. Reach for `Portrait` when the asset requires srcset, format negotiation, or editorial photographic semantics.
