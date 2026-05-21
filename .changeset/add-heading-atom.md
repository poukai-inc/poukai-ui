---
"@poukai-inc/ui": minor
---

Add `Heading` atom — canonical `h1`–`h6` type-ramp wrapper.

Props: `as` (`"h1"` … `"h6"`, default `"h2"`) drives the rendered HTML element and document outline; `size` (`"h1"` … `"h6"`, defaults to the value of `as`) drives the visual rank. The two are decoupled so consumers can render an `<h1>` styled at H3 visual rank (or vice versa) without breaking accessibility. `forwardRef` to the underlying heading element, plus standard `className` / `id` / `data-*` / `aria-*` forwarding.

Introduces six new tokens — `--fs-h1` … `--fs-h6` — for the canonical heading ramp. `--fs-h1` aliases `--fs-tagline` (display ceiling shared with `<Hero>`); `--fs-h6` aliases `--fs-meta` (bottom of the ramp = meta-text rung). `--fs-h2` and `--fs-h3` are lifted verbatim from the current `tokens.css` global `h2` / `h3` rules — zero visual drift on existing consumers. `--fs-h4` (`1rem`) and `--fs-h5` (`0.9375rem`) are new rungs.

**Not included in this PR:** migration of raw `<h1>` / `<h2>` / `<h3>` usage inside molecules (`Hero`, `Section`, `RoleCard`, `Principle`, etc.) to `<Heading>`. The global `tokens.css` heading rules stay in place so existing markup continues to render correctly. Migration is a follow-up engineering task.
