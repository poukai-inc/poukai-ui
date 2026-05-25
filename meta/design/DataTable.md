# DataTable

**Status**: Approved

## 1. Intent

> Status: deferred / demand-pull. Do not implement until a consumer surface explicitly requests it.

`DataTable` is the organism-layer wrapper that composes the `Table` molecule, `Pagination` molecule, and `EmptyState` molecule into a single controlled unit with sort, filter, and pagination state. It serves the `autopost` dashboard list surfaces — scheduled posts, comments, engagements, conversations — where each page independently rolls bespoke sort/filter/pagination logic, producing inconsistent UX. `DataTable` standardises that machinery once so all list pages share the same interaction model, visual rhythm, and accessibility contract. It is explicitly blocked behind `Table`, `Pagination`, and `EmptyState`; those must ship first.

## 2. Anatomy

```
<section aria-label="…">          ← optional labelled region
  [Toolbar]                        ← optional: filter controls, SearchField slot
  <Table …>                        ← Table molecule, owned entirely by DataTable
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell>         ← sortable: adds sort button + aria-sort
        …
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row> × n              ← rows rendered from columns × rows data
    </Table.Body>
  </Table>
  [EmptyState]                     ← rendered when rows is empty; slot
  <Pagination …>                   ← Pagination molecule, rendered when pageCount > 1
</section>
```

- **Toolbar slot** (optional): consumer-supplied `ReactNode`. Not owned by DataTable — DataTable reserves the slot above the table and applies `--space-4` bottom margin. Filter pickers, `SearchField`, segment controls go here.
- **Column definitions**: each column carries id, header, accessor function, and optional `sortable` / `filterable` metadata. The accessor returns a `ReactNode` — consumers can render `<StatusBadge>`, `<Time>`, `<IconButton>` etc. inline.
- **Empty state slot**: when `rows` is empty, `Table` is not rendered; the `emptyState` slot (a `ReactNode`) takes its place inside the root region.
- **Pagination**: rendered below the table when `pageCount > 1`. When there is only one page, `Pagination` is not rendered — no orphaned nav.

## 3. Tokens

- `--space-4` — margin below toolbar, margin above pagination
- `--space-6` — margin above pagination on wider viewports (via `--bp-md`)
- `--hairline` / `--hairline-w` — inherited via `Table`; DataTable adds no borders itself
- `--bg` / `--fg` — inherited from body; DataTable adds no surface of its own
- `--fs-meta` / `--font-sans` — sort button label register, inherited via `Table.HeaderCell`

No new tokens. All visual expression is delegated to `Table`, `Pagination`, and `EmptyState`.

## 4. Variants / Props

```
columns         ColumnDef[]     required  Column definitions (id, header, accessor, sortable?, filterable?)
rows            unknown[]       required  Data rows; DataTable is generic over row shape
sortState       SortState|null  null      { columnId: string; direction: "asc"|"desc" } | null
onSortChange    fn|undefined    —         Called with next SortState when a sortable header is clicked
filterState     FilterState     {}        Record<columnId, string[]> of active filter values
onFilterChange  fn|undefined    —         Called with updated FilterState
page            number          1         Current 1-based page number
pageSize        number          20        Rows per page (informational; consumer slices data)
pageCount       number          required  Total number of pages; drives Pagination
onPageChange    fn|undefined    —         Called with next page number
emptyState      ReactNode       —         Shown when rows.length === 0
toolbar         ReactNode       —         Slot above table for filter/search controls
density         "compact"|"comfortable"  "comfortable"  Forwarded to Table
caption         string|undefined  —       <caption> text for the underlying <table>; required for a11y when multiple tables are on the page
```

**Default rationale.** `pageSize` defaults to 20 — enough rows to fill a typical 1080p viewport without overwhelming the user, consistent with the `autopost` use-case brief. `density` defaults to `"comfortable"` matching `Table`'s default.

## 5. Interaction

- **Sort**: clicking a sortable `Table.HeaderCell` calls `onSortChange` with `{ columnId, direction }`. Clicking the same column again toggles direction (`asc` → `desc` → null/reset). `aria-sort="ascending"` / `"descending"` / `"none"` is applied to the active header cell; all other sortable cells get `aria-sort="none"`.
- **Filter**: filter UI lives in the toolbar slot — DataTable does not own filter controls. `filterState` is a plain record; the consumer passes it to whatever filter controls they place in the toolbar and propagates changes via `onFilterChange`. DataTable has no opinion on filter control shape.
- **Pagination**: `Pagination` molecule handles all page-navigation keyboard interaction internally. `DataTable` wires `page`, `pageCount`, `onPageChange` through.
- **Focus management on page change**: when the page changes, focus moves to the first interactive element in the table body (first row's first actionable cell, or the table itself if no interactive cells). Engineer determines the exact focus target.
- **Keyboard in sort header**: sort toggle buttons are standard `<button>` elements inside `<th>`; Enter and Space activate sort. Tab order within the header row follows DOM order.

## 6. A11y

- Root element is `<section>` with an `aria-label` derived from `caption` or a consumer-supplied prop. This registers a landmark region for screen reader navigation.
- `<table>` carries a `<caption>` element (visually hidden if not needed; present in DOM for SR). The `caption` prop text populates it.
- `aria-sort` on `<th>` cells for active sort column (`ascending` / `descending`); `aria-sort="none"` on all other sortable headers.
- `aria-live="polite"` region wraps the table body — announces row-count changes when sort/filter/page updates occur. The announcement reads the new row count ("Showing 20 of 143 results").
- `Pagination` molecule handles its own `aria-current`, `aria-label` per page button.
- Empty state slot is not hidden from AT — when shown it is read naturally as page content.
- Axe rules in play: `landmark-one-main`, `table-duplicate-name`, `th-has-data-cells`, `aria-required-attr` (for sort).

## 7. Motion

Sort header: no transition on the sort icon swap — state changes in tables should be immediate and not distracting. The icon (ascending/descending chevron) appears/disappears without animation.

Row updates on page change: no cross-fade. Rows replace instantly. `prefers-reduced-motion` has no effect here because no transition is authored.

`Pagination` and `Table` own any motion they define internally. DataTable adds none of its own.

## 8. Anti-patterns

- **Do not use DataTable for a read-only, non-interactive list.** A plain `Table` molecule is sufficient when sort, filter, and pagination are not needed. DataTable carries state machinery that is overhead for static displays.
- **Do not use DataTable as a spreadsheet.** Inline cell editing is out of scope. If cells need to be editable, use a purpose-built data-grid library.
- **Do not put DataTable inside DataTable.** Nested tables break accessibility and visual rhythm. If you need a row-expansion pattern, file a separate proposal.
- **Do not pass total row count as `pageCount`.** `pageCount` is the number of pages, not the number of rows. Pass `Math.ceil(totalRows / pageSize)`.
- **Do not place DataTable inside a `<form>`.** Filter and sort controls live in the toolbar slot; they should not be form fields that submit. Use `<button type="button">` for all controls inside the toolbar.
- **Do not use DataTable for fewer than ~10 rows of static data.** The sort/filter/pagination overhead is visual noise at small data volumes. Use `Table` directly.

## 9. Depends on

- `Table` molecule (separate spec — must ship first)
- `Pagination` molecule (separate spec — must ship first)
- `EmptyState` molecule (separate spec — must ship first)

## Open questions

- **`useDataTable` headless hook**: the proposal requests a headless variant for consumers who want the state machinery but custom rendering. This is a real need (custom row rendering beyond the `accessor` pattern) but adds API surface and test burden. Deferring the hook to a follow-up spec once `DataTable` itself is approved and the consumer use-case is clearer. Flag for Arian: should the hook ship in the same PR or be spec'd separately?
- **Filter control ownership**: the current spec puts all filter UI in the consumer-supplied `toolbar` slot. This is the lightest approach but means DataTable provides no filterable column UI itself. The `filterable: { options: STATUSES }` field in `ColumnDef` (from the proposal) implies DataTable could render per-column filter menus in the header. That requires `Popover` and `Combobox`, which may not be ready when DataTable ships. Decision needed before implementation: does `filterable` on a column definition drive any DataTable-owned UI, or is it metadata only?
