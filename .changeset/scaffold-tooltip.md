---
"@poukai-inc/ui": minor
---

feat(atom): add Tooltip — Radix-wrapped hover-hint primitive

Implements `Tooltip` atom per `meta/design/Tooltip.md`. Wraps
`@radix-ui/react-tooltip` with DS tokens for surface, hairline, and
motion. Ships both a shorthand `<Tooltip content="…">` form and a
compound `<Tooltip.Root>` / `<Tooltip.Trigger>` / `<Tooltip.Content>`
API. Adds `TooltipProvider` for app-root setup. Adds
`@radix-ui/react-tooltip` as a new runtime dependency (same `^1.x`
major as existing Radix peers).
