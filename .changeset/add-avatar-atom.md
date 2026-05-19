---
"@poukai-inc/ui": minor
---

feat(Avatar): add Avatar atom

New `<Avatar>` atom supporting three modes via discriminated union:

- `mode="image"` — renders `<img loading="lazy">` with `src` and optional `alt`
- `mode="initials"` — renders 1–2 character text label
- `mode="empty"` (default) — blank placeholder

Props: `size` (sm/md/lg → 24/32/40px), `shape` (circle/square), `name` (accessible label).

A11y: `name` prop produces `role="img"` + `aria-label` on the root span for initials and
empty modes, and for image mode when `alt` is omitted. Image with `alt` is self-labelling.

Stateless by design — no `onError` fallback, no `imgLoading` prop, no initials derivation.
