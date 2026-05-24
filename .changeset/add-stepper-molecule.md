---
"@poukai-inc/ui": minor
---

feat(molecule): add Stepper — numbered step indicator for multi-step flows

Implements `Stepper` per `meta/design/Stepper.md`. Renders a semantic `<ol>` of
labeled steps in three derived states (complete / active / upcoming) driven by a
single `current` index prop. Display-only — no interactive semantics.

Props: `steps`, `current`, `orientation` ("horizontal" | "vertical"), `size`
("sm" | "md"), `showLabels`.

A11y: `aria-current="step"` on the active item, visually-hidden "(complete)"
suffix on complete items, decorative connectors and checkmark icon are
`aria-hidden`. Passes axe-core at all states.

Subpath export added: `@poukai-inc/ui/molecules/Stepper`.
