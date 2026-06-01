---
"@poukai-inc/ui": minor
---

Dark mode gains a manual class/attribute toggle (#393).

Previously dark mode activated only via `@media (prefers-color-scheme: dark)`.
Now consumers can force a theme regardless of OS:

- `class="dark"` or `data-theme="dark"` on `<html>`/`:root` → forced dark.
- `class="light"` or `data-theme="light"` → forced light.
- No class → follows OS preference (unchanged).

Explicit choice wins over the OS preference (the media block is scoped
`:root:not(.light):not([data-theme="light"])`). The DS now also sets
`color-scheme` per forced mode so native controls (scrollbars, form widgets)
match. No new tokens — the dark values are unchanged.
