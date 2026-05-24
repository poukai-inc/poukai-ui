---
"@poukai-inc/ui": minor
---

feat(organism): add HeroSection — marketing-page primary hero band

Implements the HeroSection organism per `meta/design/HeroSection.md` (Phase 2 pilot).

HeroSection composes a `Hero` molecule (title, status, lede, CTA entrance stagger)
inside a landmark `<section>` with an optional `media` slot. Two-column CSS grid
at `md+` (≥ 768px) — text column left (`--hero-max`), media column right
(`--hero-illustration-max`). Collapses to a single stacked column below the
breakpoint with text leading in DOM order.

Props: `title` (required), `status`, `lede`, `cta`, `media`, `size`, `entrance`,
`sectionSize`, `as`. All forwarded to Hero except `sectionSize` and `as` which
control the outer landmark and block padding independently of Hero's `size`.

Closes #197.
