---
"@poukai-inc/ui": minor
---

feat(molecule): add Caption — muted micro-tracked figure label

Implements the Caption molecule per the approved spec at `meta/design/Caption.md`.
Renders `<figcaption>` by default (semantic inside `<figure>`); polymorphic `as` prop
accepts `"p"` or `"span"` for other contexts. Token-only CSS: `--font-sans`, `--fs-micro`,
`--lh-meta`, `--tracking-micro`, `--fg-muted`. Zero new tokens introduced.
