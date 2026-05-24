---
"@poukai-inc/ui": minor
---

feat(organism): add ContactBlock — EmailLink + CTAs + StatusBadge line

Implements the ContactBlock organism per `meta/design/ContactBlock.md` (Phase 2).

ContactBlock is the end-of-page contact moment: a centered, editorial section
framing an `EmailLink` at display scale (`--fs-h3`), an optional `StatusBadge`
slot for availability signal, and an optional `actions` slot for CTA Button(s).

Props: `email` (required), `emailLabel`, `heading`, `status`, `actions`, `as`.
When `heading` is provided the root landmark is named via `aria-labelledby`.
No `tone`/`variant` — one visual register only.

Distinct from `Footer` (persistent page chrome) and `CtaBlock` (general conversion
moment). Not a form container.

Closes #204.
