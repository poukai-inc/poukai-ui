---
"@poukai-inc/ui": minor
---

feat(molecule): add MenuItem — dropdown/context-menu row with optional leading icon and trailing Kbd shortcut slots.

`MenuItem` is the individual row primitive for `DropdownMenu` and `ContextMenu` wrappers. It owns the visual shape of a menu row — typography, spacing, icon alignment, shortcut placement — while deferring all keyboard navigation, focus management, ARIA roles, and portal behaviour to the parent Radix wrapper.

Props: `children` (required), `icon` (optional ReactNode), `shortcut` (optional string rendered as `<Kbd>`), `tone` (`"default" | "danger"`), `disabled` (boolean).

Closes #175.
