---
"@poukai-inc/ui": minor
---

**Hero**: add `variant="no-title"` for editorial doorway pages without a heading in the doorway band.

Editorial pages (starting with `/about`) want an eyebrow + lede opener with **no `<h1>`** in the doorway region — the page's heading lives in body content. The new variant provides a first-class DS primitive for this composition.

```tsx
<Hero variant="no-title" eyebrow="About" lede="One to two sentences setting up the page." />
```

- Renders an eyebrow `<p>` at `--fs-micro`, uppercase, `letter-spacing: 0.04em`, `--fg-muted`, then a lede `<p>` — no heading element emitted.
- **Non-breaking**: all existing `<Hero>` invocations are unaffected. `variant` defaults to `"default"`.
- TypeScript: discriminated union — `title` and `status` are excluded from the `"no-title"` variant's type; `eyebrow` is excluded from the default variant.
- `align`, `entrance`, and `cta` remain available in both variants.
- `entrance="stagger"` stagger sequence adapts to three slots (eyebrow → lede → cta) with compressed delays.
- Consumer obligation: every page using `variant="no-title"` must place an `<h1>` in body content. The molecule does not emit one.
