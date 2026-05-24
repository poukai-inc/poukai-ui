---
"@poukai-inc/ui": minor
---

feat(organism): add NewsletterSection — NewsletterField in section frame

Implements the `NewsletterSection` organism per `meta/design/NewsletterSection.md`.
Composes the `Section` molecule with a required `field` slot (`NewsletterField`),
optional `body` lede, `eyebrow`, `size` (`default` | `tight`), `surface` background
toggle (`--surface-section`), `titleAs` heading level override, and polymorphic `as`
prop. No new tokens introduced.
