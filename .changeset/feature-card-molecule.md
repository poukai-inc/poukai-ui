---
"@poukai-inc/ui": minor
---

Add `FeatureCard` molecule — canonical structural feature-grid tile.

New component `<FeatureCard>` at `src/molecules/FeatureCard/`. Canonical primitive for capability and service grids. Presents a single feature as a bounded content object: optional icon, optional eyebrow, required title, required body, optional footer. Polymorphic via `as` prop (`"article"` | `"section"` | `"div"` | `"li"`). Two variants: `"default"` (transparent, no border) and `"bordered"` (`--surface` bg, `--hairline` border, `--radius-3`). `aria-labelledby` wired on `article`/`section` roots; omitted for `div`/`li` per spec. Icon slot wrapped in `aria-hidden="true"` span. String eyebrow auto-wrapped in `<Eyebrow variant="muted">`; ReactNode eyebrow passed through. String body auto-wrapped in `<p style="margin:0">`. No new tokens — built entirely from the existing vocabulary.
