---
"@poukai-inc/ui": minor
---

feat(molecule): add Disclosure — single open/close toggle row via native `<details>` / `<summary>`

Closes #185.

- Uncontrolled (default) and controlled (`open` + `onOpenChange`) usage.
- `defaultOpen` prop for initial state.
- `divider` prop adds a top border for list contexts.
- `tone` prop (`"default"` | `"muted"`) controls summary label color.
- Chevron `Icon` atom (lucide `ChevronDown`) rotates 180° on open via `--dur-fast` / `--easing`; no per-component reduced-motion override needed (global token clamp covers it).
- Zero new tokens. Depends on `Icon` atom only (no Radix).
