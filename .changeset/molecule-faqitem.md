---
"@poukai-inc/ui": minor
---

feat(molecule): add FAQItem — collapsible question + answer row

Thin opinionated wrapper around `Accordion.Item` + `Accordion.Trigger` +
`Accordion.Content`. Exposes `question` (string), `value` (string), and
`children` (ReactNode) props. `questionAs` prop controls heading level
(h2/h3/h4, default h3). Must be placed inside an `<Accordion.Root>` wrapper —
Radix's keyboard model and open/closed state management require the wrapper.
Zero axe violations. Full keyboard navigation and ARIA wiring inherited from
Accordion.

Closes #173. Depends on Accordion (#184 / PR #296) which must merge first.
