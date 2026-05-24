---
"@poukai-inc/ui": minor
---

feat(molecule): add Popover — Radix-wrapped anchored content panel

Implements `<Popover>` molecule per `meta/design/Popover.md`. Wraps
`@radix-ui/react-popover` with DS tokens (surface elevation, motion,
focus ring, border). Compound API: `Popover.Root`, `Popover.Trigger`,
`Popover.Content`, `Popover.Close`. Content always renders via a portal
so it is never clipped by `overflow:hidden` ancestors. Adds
`@radix-ui/react-popover` as a new runtime dependency.

Closes #181.
