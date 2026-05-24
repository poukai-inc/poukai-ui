---
"@poukai-inc/ui": minor
---

feat(molecule): add CtaBlock — heading + body + button row

Implements the `CtaBlock` molecule per `meta/design/CtaBlock.md` (Phase 2 pilot).

`CtaBlock` is the reusable inline conversion moment — the "Ready to start? [Get a demo]" pattern used on marketing pages, end-of-feature sections, and any content moment that closes with a call to action.

**API**

- `heading` (required `ReactNode`) — primary CTA text
- `headingAs` (`"h1" | "h2" | "h3"`, default `"h2"`) — semantic heading level
- `body` (optional `ReactNode`) — supporting paragraph; absent → heading jumps to actions with `--space-8` gap
- `actions` (required `ReactNode`) — CTA button slot; consumer owns Button composition
- `orientation` (`"stacked" | "horizontal"`, default `"stacked"`) — stacked or side-by-side (collapses below `--bp-md`)
- `align` (`"start" | "center"`, default `"start"`) — inline alignment

**Zero new tokens.** Consumes existing `--font-serif`, `--fs-h2`, `--font-sans`, `--fs-body`, `--lh-body`, `--fg`, `--fg-muted`, `--space-2`, `--space-6`, `--space-8`, `--bp-md`.
