---
"@poukai-inc/ui": minor
---

feat(molecule): add LinkList — vertical styled link rows

Implements the `LinkList` molecule per `meta/design/LinkList.md`.

`LinkList` is the system's canonical vertical list of styled anchor rows. It
serves footer columns, sitemap blocks, sidebar navigation sections, and
on-this-page TOC panels. It composes the `Link` atom (variant `"muted-link"`)
with an optional `Heading` and a semantic `<ul>` / `<li>` structure via a
compound `LinkList.Item` sub-component.

**API**

- `<LinkList heading? headingLevel? size? divider?>` — root `<div>` with
  optional `Heading` atom and `<ul>` list.
- `<LinkList.Item href external? current? icon?>` — `<li>` wrapping a `Link`
  with `variant="muted-link"`. `external` adds `target="_blank"` +
  `rel="noopener noreferrer"` + visually-hidden "(opens in new tab)".
  `current` sets `aria-current="page"` and renders the item at full `--fg`.

**Size variants**

- `"sm"` (default): `--fs-meta` (14px) — footer columns, sidebar nav.
- `"md"`: `--fs-body` — TOC or reading-flow contexts.

No new tokens introduced; all values reference existing DS tokens.
