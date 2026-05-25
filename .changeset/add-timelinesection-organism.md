---
"@poukai-inc/ui": minor
---

feat(organism): add TimelineSection — Section-framed vertical list of TimelineItem molecules

Implements `TimelineSection` organism per `meta/design/TimelineSection.md`.
Ships with `TimelineItem` molecule (copied from feat/molecule-timelineitem).

- `TimelineSection`: `<section>` landmark via `Section` molecule, `<ol>` track with `gap: --space-8` between entries, `reversed` prop via HTML `<ol reversed>`.
- `TimelineItem`: dated entry molecule with left-rail marker dot and optional connector line.
- Full Ladle stories, Playwright CT tests, and axe a11y assertions included.
- New subpath exports: `@poukai-inc/ui/organisms/TimelineSection`, `@poukai-inc/ui/molecules/TimelineItem`.
