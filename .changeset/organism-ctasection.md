---
"@poukai-inc/ui": minor
---

feat(organism): add CTASection — full-width end-of-page CtaBlock organism

Implements the `CTASection` organism per `meta/design/CTASection.md`. Composes
`CtaBlock` in a landmark `<section>` with optional `surface="recessed"` bleed-band
and hairline rule, centered layout (bilateral symmetry default), and `size` /
`headingAs` / `align` props. Wires `aria-labelledby` from the section root to the
`CtaBlock` heading element for a properly-named region landmark.

Closes #205.
