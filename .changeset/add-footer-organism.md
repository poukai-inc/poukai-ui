---
"@poukai-inc/ui": minor
---

feat: add Footer organism

Adds `<Footer>` — the canonical site-footer content block for pouk.ai surfaces.

Composes copyright string + `<EmailLink variant="muted">` + an optional secondary `<nav>` link row. The `as` prop (`"div"` | `"footer"`, default `"div"`) prevents the double-`<footer>` landmark problem when Footer is slotted into SiteShell's `footer` prop. When `as="footer"` (standalone), Footer applies its own hairline rule and padding mirroring SiteShell's `.footer` CSS.

New exports: `Footer`, `FooterProps`, `FooterLink`.

No new tokens introduced. No breaking changes.
