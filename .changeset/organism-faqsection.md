---
"@poukai-inc/ui": minor
---

feat(organism): add FAQSection — Section-framed Accordion of FAQItem children

Implements `<FAQSection>` per `meta/design/FAQSection.md`. Composes
a `Section` molecule (eyebrow, title, lede, landmark semantics) with an
`Accordion.Root` containing `FAQItem` children. The FAQ block is a named
region landmark with consistent vertical rhythm and collapsible Q&A rows.

Props: `eyebrow`, `title` (default "Frequently asked questions"), `titleAs`
("h1" | "h2" | "h3", default "h2"), `lede`, `size` ("default" | "tight"),
`type` ("single" | "multiple", default "single"), `defaultValue`, `children`.

A11y: Section root renders `<section aria-labelledby>` — named region
landmark. Accordion keyboard model (Space/Enter toggle, Arrow Up/Down focus
movement) provided by Radix. FAQItem question headings are h3 by default
(correct under an h2 Section title).

Closes #210. Depends on Accordion (#184/#296) + FAQItem (#173/#298).
