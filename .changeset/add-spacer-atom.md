---
"@poukai-inc/ui": minor
---

Add `Spacer` atom — explicit-gap element for contexts where flex/grid `gap` cannot reach.

`Spacer` is a deliberately minimal atom: one required prop (`size`, closed union `"1" | "2" | "3" | "4" | "6" | "8" | "10"` mapped to `--space-1` … `--space-10`), one optional axis (`axis="block"` default, `axis="inline"`), and one optional element variant (`as="div"` default, `as="span"`). It always renders `aria-hidden="true"`, owns no background, border, motion, or content — it occupies space and nothing else.

The size union is intentionally clamped to atom-tier spacing tokens. Layout-tier values (`--space-12`+) are excluded by design: a 3rem+ explicit gap is the wrong shape for an inline atom — that decision belongs to a section or template primitive.

Canonical use is inside `<Prose>` long-form HTML where the parent context does not own layout, between conditionally-rendered siblings where a stable spacer slot is needed, and inside legacy block containers where `gap` is architecturally unavailable. Do not use between flex/grid siblings (use `gap`), for section-tier rhythm (use Section padding), or as a vertical typography hack (fix the type ramp).

No new tokens are introduced.
