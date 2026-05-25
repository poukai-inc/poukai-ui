---
"@poukai-inc/ui": minor
---

feat(molecule): add Carousel — scroll-snap compound slide container

Implements `Carousel` molecule per `meta/design/Carousel.md`. Compound
API: `Carousel.Root` / `Carousel.Track` / `Carousel.Slide` /
`Carousel.Prev` / `Carousel.Next` / `Carousel.Indicators`.

- CSS scroll-snap (`scroll-snap-type: x mandatory`) with no external dep.
- `autoplay` prop (default `false`); never starts under
  `prefers-reduced-motion: reduce`; pauses on hover and focus-within.
- `loop` prop (default `false`); Prev/Next disable at boundaries when
  `loop={false}`.
- `Carousel.Indicators` — `role="tablist"` dot row with arrow-key
  navigation; each dot carries `role="tab"`, `aria-selected`,
  `aria-controls`.
- Live region (`aria-live="polite"`) announces active slide on change.
- Tokens only in CSS; no hex values, no magic numbers.
- Subpath export `@poukai-inc/ui/molecules/Carousel` added.
