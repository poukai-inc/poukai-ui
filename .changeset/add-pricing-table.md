---
"@poukai-inc/ui": minor
---

feat(organism): add PricingTable organism and PriceTier molecule

New components for building responsive pricing pages:

- `PriceTier` molecule — pricing plan card with name, price, cadence, description, feature bullet list, and CTA slot. Featured variant with elevated surface, accent border, and entrance animation. Full axe/a11y coverage.
- `PricingTable` organism — responsive CSS grid of `PriceTier` cards with optional heading slot, optional comparison body slot, `columns` (2 | 3 | "auto") and `align` ("top" | "stretch") props. `<section>` wrapper with auto-wired `aria-labelledby` when heading is provided.

Both components: `forwardRef`, `displayName`, tokens-only CSS, Ladle stories, Playwright CT tests, axe-core a11y assertions.
