---
"@poukai-inc/ui": minor
---

feat(molecule): add Pagination — stateless, controlled page-navigation control

Implements `<Pagination>` per `meta/design/Pagination.md`. Renders
`<nav aria-label="Pagination">` with first/prev/page-numerals/next/last
button controls. Page-number visibility uses a configurable boundary +
sibling algorithm with ellipsis truncation for large page sets. Returns
`null` when `pageCount <= 1`.

Props: `page`, `pageCount`, `onPageChange` (required); `siblingCount`,
`boundaryCount`, `size` ("sm" | "md"), `disabled` (optional).

A11y: `aria-current="page"` on active page, `aria-label` on icon-only
controls, ellipsis spans are `aria-hidden`. All tokens from spec §3.
