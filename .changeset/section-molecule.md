---
"@poukai-inc/ui": minor
---

Add Section molecule — canonical page-section wrapper consuming Eyebrow atom.

`<Section>` owns the vertical rhythm around a section's header block (eyebrow + title + lede) and exposes a children slot for body content. Polymorphic `as` prop (`section` / `article` / `aside` / `div`), `titleAs` heading-level swap, `size="tight"` padding variant, automatic `aria-labelledby` wiring for landmark elements, and empty-header guard. Constructed entirely from the existing token vocabulary — no new tokens.
