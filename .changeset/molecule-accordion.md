---
"@poukai-inc/ui": minor
---

feat(molecule): add Accordion — Radix-wrapped compound accordion (single + multiple)

Wraps `@radix-ui/react-accordion` with a compound API: `Accordion.Root`,
`Accordion.Item`, `Accordion.Trigger`, `Accordion.Content`. Supports
`type="single"` (collapsible) and `type="multiple"`. Animated height
collapse via Radix CSS custom property. Chevron rotation transition with
`prefers-reduced-motion` handled globally by `tokens.css`. `tone="tinted"`
applies `--surface` to content panels. Full keyboard navigation and ARIA
wiring via Radix. Zero axe violations.
