---
"@poukai-inc/ui": minor
---

feat(organism): add PrincipleList — Section + Principle ordered stack

Implements the PrincipleList organism per the approved spec at `meta/design/PrincipleList.md`.
Composes `Section` (molecule) as the root landmark with `<ol>` + `<li>`-wrapped `Principle`
molecules. Hairline dividers between items and inter-item spacing (`--space-8` mobile,
`--space-12` desktop) are enforced at the organism layer. Zero new tokens introduced.
