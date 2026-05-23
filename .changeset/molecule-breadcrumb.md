---
"@poukai-inc/ui": minor
---

feat(molecule): add Breadcrumb — hierarchical location trail

`<Breadcrumb>` renders a `<nav aria-label="Breadcrumb">` + `<ol>` + `<li>` item trail for nested dashboard and product routes. Supports compound `<Breadcrumb.Item>` children and a data-driven `items` prop. Separator is configurable (default `›`). Current (terminal) item carries `aria-current="page"` and is rendered as plain text, not a link. Full axe-core a11y pass, Playwright CT, and Ladle stories included.

Closes #157.
