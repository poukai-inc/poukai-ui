---
"@poukai-inc/ui": minor
---

feat(organism): add TeamGrid — Section-framed responsive grid of TeamCard molecules

Implements the TeamGrid organism per meta/design/TeamGrid.md. Composes the Section molecule as its structural frame (heading, optional eyebrow/lede, optional band background) with a responsive CSS grid container (1 → 2 → 3 columns). Exposes `heading` (required), `eyebrow`, `lede`, `columns` (2|3, default 3), and `tone` ("default"|"section") props. forwardRef forwards to the Section root; className and rest props spread to root. No new tokens introduced — consumes --space-6, --space-16, --surface-section.
