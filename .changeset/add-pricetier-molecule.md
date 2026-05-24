---
"@poukai-inc/ui": minor
---

feat(molecule): add PriceTier

Introduces the `PriceTier` molecule — a single pricing-plan card that composes a tier name (`<h3>`), a stat-scale price display, an optional period label, a feature bullet list, and a CTA slot. An optional `featured` boolean elevates the card to `--bg-elevated` surface and shows a configurable badge above the name. Designed to live inside a `PricingTable` organism grid. Root is `<article aria-label="…plan">` for correct landmark semantics.

Props: `name`, `price`, `per?`, `bullets?`, `bulletIcon?`, `cta`, `featured?`, `featuredLabel?`.
