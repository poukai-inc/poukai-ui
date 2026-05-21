---
"@poukai-inc/ui": minor
---

Add Text atom — canonical paragraph primitive.

Resolves the three ad-hoc patterns currently sprinkled across molecules — raw
`<p>` tags, the `.lede` utility, and inline muted `<p style>` overrides — into
one component with orthogonal `size` and `tone` axes.

`size`: `body` (default) / `lede` / `caption` / `micro`. Sizes map to existing
`--fs-*` and `--lh-*` tokens; `lede` adds `max-inline-size: 36rem` matching the
current `.lede` utility. No new tokens introduced.

`tone`: `default` / `muted` / `on-warm` / `on-warm-muted`. Maps to `--fg`,
`--fg-muted`, `--fg-on-warm`, `--fg-on-warm-muted` respectively. The
`on-warm-muted` tone is a brand-sanctioned decorative ceiling (~3.9:1 contrast,
below WCAG AA 4.5:1 for normal text) — its axe scan disables the
`color-contrast` rule, matching the documented brand-tier exception in
`meta/brand.md`. All other tone/size pairings meet AA on their intended
surfaces.

`as`: closed union `p` (default) / `span` / `div` / `dt` / `dd` / `li`.
Headings excluded — reserved for a future `<Heading>` atom. Polymorphic
implementation follows the `<Eyebrow>` switch-based pattern.

`margin: 0` invariant — consumer owns vertical rhythm via parent layout.
No `text-transform: uppercase` — the uppercase-tracked register belongs to
`<Eyebrow>`; `<Text size="micro">` is lowercase footnote scale.

Spec: `meta/design/Text.md`. Molecule adoption (Hero, FieldNote, RoleCard,
Footer, FailureMode) is a separate follow-up PR — this change only ships the
atom and registers it in `src/index.ts`, `src/atoms.ts`, and the
`./atoms/Text` subpath export.
