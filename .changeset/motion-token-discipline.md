---
"@poukai-inc/ui": patch
---

Fix animation token discipline: replace all raw `ease` literals with `var(--easing)` across tokens.css and Dialog.module.css. Add component-level reduced-motion suppression block to Dialog. Add reduced-motion CT tests for StatusBadge, Hero, and Dialog.
