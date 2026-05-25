---
"@poukai-inc/ui": minor
---

feat(atom): add DropdownMenu — Radix-wrapped menu trigger + items

Adds `DropdownMenu` compound atom built on `@radix-ui/react-dropdown-menu`. Exports:
- `DropdownMenu.Root` / `.Trigger` / `.Content` / `.Item` / `.Separator` — compound API
- `DropdownMenuBasic` — convenience wrapper (trigger + items array)

Adds `@radix-ui/react-dropdown-menu` as a direct runtime dependency (^2.1.x).

Closes #146.
