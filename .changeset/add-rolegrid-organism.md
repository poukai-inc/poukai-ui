---
"@poukai-inc/ui": minor
---

feat(organism): add RoleGrid — Section + RoleCard responsive grid

Implements the RoleGrid organism per the approved spec at `meta/design/RoleGrid.md`.
Arranges `RoleCard` molecules into a responsive 1/2/3/4-column CSS grid framed by the
`Section` molecule. Props: `heading` (required), `eyebrow`, `surface` (`"default"` | `"section"`),
`columns` (2 | 3 | 4, default 3), `children`. Token-only CSS: `--space-6`, `--space-8`,
`--surface-section`, `--bp-md`. Zero new tokens introduced.
