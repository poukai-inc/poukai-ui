---
"@poukai-inc/ui": minor
---

feat(molecule): add Alert — inline semantic banner with five variants (info, success, warn, error, note).

Carries explicit ARIA live-region semantics per variant: `role="alert"` for error (assertive), `role="status"` for info/success/warn (polite), `role="note"` for note (static landmark). Composes the Icon atom for the leading glyph slot (decorative, aria-hidden). Optional title rendered as `<strong>`. Consumer can override or suppress the icon via the `icon` prop. Token-only styles; no new tokens introduced.

Exports: `Alert`, `AlertProps`, `AlertVariant` from `@poukai-inc/ui` and `@poukai-inc/ui/molecules/Alert`.

Closes #186.
