---
"@poukai-inc/ui": patch
---

chore(ladle): rename 41 story titles from "Components / X" to correct layer ("Atoms / X", "Molecules / X", "Organisms / X") so they group under the right sidebar section.

Ladle's `storyOrder` in `.ladle/config.mjs` enforces the sidebar order
`home → system → atoms → molecules → organisms → showcase`. Stories whose
`title` started with `"Components / "` produced `components-*` ids that
fell to the bottom of the sidebar because `"components"` is not in that
order list, making them appear missing from the UI.

This rename is title-only — no runtime, API, or visual change to any
component. All 7 local gates green (typecheck, lint, format:check,
check:llms, build, test, size).
