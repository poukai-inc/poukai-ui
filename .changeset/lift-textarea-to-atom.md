---
"@poukai-inc/ui": minor
---

Lift `Textarea` to the atom layer.

`Textarea` is now a true atom under `src/atoms/Textarea/` — a pure styled `<textarea>` primitive that owns visual register, focus choreography, and invalid styling, and nothing else. Label / helper text / error message continue to live in `<Field>`. Canonical import paths:

```ts
import { Textarea } from "@poukai-inc/ui";
// or
import { Textarea } from "@poukai-inc/ui/atoms/Textarea";
```

**New / changed surface**

- New prop `resize: "vertical" | "none" | "both"` — maps directly to CSS `resize`. Default `"vertical"`.
- Default `rows` is now `3` (was `4`). Consumers depending on the previous default can pass `rows={4}` explicitly.
- Padding is symmetric — `--space-3` on all four sides. Previously block/inline padding were asymmetric (`--space-2` / `--space-3`). The new contract gives multi-line content equal vertical headroom and is the only visual delta from the prior molecule.
- Hard-coded `min-height` rule (4 × line-height of body) is removed. `rows` is now the canonical height knob.
- Invalid state uses `--danger` (introduced in 1.3.0). Prior molecule already aligned with this token; no consumer-visible change beyond the layer move.

**Migration**

`@poukai-inc/ui/molecules/Textarea` is kept as a `@deprecated` re-export shim that points at the atom. Existing imports continue to compile and render identically. The shim will be removed in **v2.0** — migrate to either the root export (`@poukai-inc/ui`) or the atom subpath (`@poukai-inc/ui/atoms/Textarea`).

**Not included**

- No autosize / content-height tracking. A future `useAutosizeTextarea` utility hook will compose on top of the atom; tracked separately.
- No character-count display. Consumer responsibility.
