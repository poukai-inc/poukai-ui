---
"@poukai-inc/ui": minor
---

feat: add FieldNote molecule

Adds `<FieldNote>` — the canonical inline technical-aside primitive for long-form prose surfaces.

A short parenthetical callout (a sentence or two) that sits inline with body copy and provides a factual clarification, caveat, or data footnote without interrupting reading flow. Renders as `<aside>` with a 1px left hairline rule (`--hairline-w solid --hairline`), `--space-3` (12px) inset, and `--space-6` (24px) block margin.

Optional `label` prop (string) renders a single `<p>` above the body text in the Eyebrow typographic register (`--fs-meta`, `--fg-muted`, uppercase, `--tracking-eyebrow`). Defaults to `undefined` — the left rule is the primary signal.

Distinct from `<Pull>` (3px rule, 20–26px serif-italic, editorial accent) and `<FailureMode>` (section-level, titled, indexed). FieldNote is body-register: `--fs-body` (17–19px), Geist roman, 1px rule.

New exports: `FieldNote`, `FieldNoteProps`.

No new tokens introduced. No breaking changes.
