---
"@poukai-inc/ui": minor
---

Add `Prose` atom — typographic context wrapper for long-form HTML.

**What ships:**

- `<Prose width="full|reading" asChild>` — named, versioned atom in `src/atoms/Prose/`.
- Single root class scopes the canonical type contract to descendant HTML primitives: `h1`–`h6`, `p`, `p.lede`, `ul`, `ol`, `li`, `blockquote` (with `cite`), `code`, `pre`, `kbd`, `hr`, `figure`, `figcaption`, `img`, `video`, `table` / `thead` / `th` / `td` / `caption`, `strong`, `em`, `small`. Markdown output and CMS body fields drop in without per-element class plumbing.
- Element rules authored with `:where(...)` to keep specificity at `0,0,1`; consumer overrides via a single `className` always win.
- Vertical rhythm declared as **top-margins on adjacent siblings** (`> :where(*) + :where(*)`) rather than bottom-margins on every element — eliminates leading/trailing margin collapse and keeps Prose composable inside flex/grid columns.
- `width="reading"` opts into the canonical editorial column at `64ch` (inside the 45–75 CPL band) with `margin-inline: auto`. `width="full"` (default) inherits the column from the parent layout.
- `asChild` via `@radix-ui/react-slot` — compose Prose styles onto `<article>`, `<section>`, or any semantically richer block element.
- Heading lead-in cadence per `meta/design/Prose.md` §3: `--space-10` before `h1`, `--space-8` before `h2`/`h3`, `--space-6` before `h4`–`h6` and block elements (`blockquote`, `pre`, `figure`, `table`, `hr`); tightened `--space-3` for heading → paragraph transition; `--space-4` default flow.
- Exported from `@poukai-inc/ui`, `@poukai-inc/ui/atoms`, and `@poukai-inc/ui/atoms/Prose` subpath.

**No new tokens.** Every value reads from `src/tokens/tokens.css`. The `64ch` reading column is the only `ch`-unit use in the DS — see `meta/design/Prose.md` §3 for the rationale.

**Design spec:** `meta/design/Prose.md` (10 sections; Approved status).
