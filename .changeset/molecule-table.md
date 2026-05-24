---
"@poukai-inc/ui": minor
---

feat(molecule): add Table — semantic data-display primitive

Implements the `Table` molecule per `meta/design/Table.md`. Provides a
composable `<table>` with sub-components `Table.Head`, `Table.Body`,
`Table.Row`, `Table.HeaderCell` (`<th scope="col">`), and `Table.Cell`.

Props: `density` (`"compact" | "comfortable"`, default `"comfortable"`)
controls vertical cell padding; `tone` (`"default" | "subtle"`, default
`"default"`) controls row-hover background register. All sub-components
forward `ref`, `className`, and arbitrary props (`data-*`, `aria-*`).

No sort / filter / pagination — those belong to the future `DataTable`
organism. Closes #150.
