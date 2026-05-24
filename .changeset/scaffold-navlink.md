---
"@poukai-inc/ui": minor
---

feat(molecule): add NavLink — top-nav anchor with active state

Implements the NavLink molecule per `meta/design/NavLink.md`.

- Renders a semantic `<a>` with `forwardRef` + `displayName`.
- `active` prop drives `aria-current="page"` and a 2px `--accent` `border-bottom`.
- Rest state: `--fg-muted` label, hairline layer invisible.
- Hover: label shifts to `--fg`; accent underline grows 0%→100% via `background-size` transition matching the global `<a>` mechanic.
- Active + hover: active wins; no double-underline.
- Tokens only; no hex values or magic numbers.
- Closes #174.
