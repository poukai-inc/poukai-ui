---
"@poukai-inc/ui": minor
---

feat(molecule): add Figure — semantic `<figure>` + `<figcaption>` pairing molecule

Implements the Figure molecule per `meta/design/Figure.md`. Wraps a media slot (Portrait, img, or any block-level content) and an optional caption inside a semantic `<figure>` element.

- `Figure` root component with `children`, `caption`, `align` (`"start" | "center"`), `className` props
- `Figure.Caption` compound sub-component for richer caption markup
- Token-only CSS: `--font-sans`, `--fs-micro`, `--lh-meta`, `--tracking-micro`, `--fg-muted`, `--space-2`, `--space-4`
- Subpath export: `@poukai-inc/ui/molecules/Figure`
- Playwright CT tests + axe a11y assertions
