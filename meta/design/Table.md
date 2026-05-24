# Table

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`Table` is the system's data-display primitive — a set of composable table-part atoms (`Table`, `Table.Head`, `Table.Body`, `Table.Row`, `Table.HeaderCell`, `Table.Cell`) that render a standards-compliant `<table>` element styled with DS tokens. It serves dashboard list pages in `autopost` (scheduled posts, comments, conversations, approvals, blog, engagements) where today the code reaches for Tailwind class soup or bespoke card-as-table layouts. Table standardises header typography, row hover rhythm, cell padding, and status-pill alignment, and is the required dependency for the future `DataTable` organism. Sort, filter, and pagination belong to that organism — Table itself is a pure display primitive with no interactive state management.

## 2. Anatomy

```
<table>                       ← Table root
  <thead>                     ← Table.Head
    <tr>                      ← Table.Row (inside Head)
      <th scope="col">…</th>  ← Table.HeaderCell
    </tr>
  </thead>
  <tbody>                     ← Table.Body
    <tr>                      ← Table.Row (inside Body)
      <td>…</td>              ← Table.Cell
    </tr>
  </tbody>
</table>
```

- **Table** — root `<table>` element; owns `density` and `tone` props; applies `border-collapse: collapse` and `width: 100%`.
- **Table.Head** — semantic `<thead>`; no visual role beyond grouping.
- **Table.Body** — semantic `<tbody>`; no visual role beyond grouping.
- **Table.Row** — semantic `<tr>`; carries row-hover background in the body context; inert inside `<thead>`.
- **Table.HeaderCell** — semantic `<th scope="col">`; uppercase micro-tracked label typography; bottom border via `--hairline`.
- **Table.Cell** — semantic `<td>`; body-text register; cell padding driven by `density`.

## 3. Tokens

- `--fg` — `Table.HeaderCell` label color and `Table.Cell` default text color
- `--fg-muted` — `Table.HeaderCell` label color (`tone="subtle"` variant)
- `--surface` — row hover background (`tone="default"`)
- `--surface-section` — row hover background (`tone="subtle"`)
- `--hairline` — bottom border on `Table.HeaderCell`; optional row dividers
- `--hairline-w` — border width (1px)
- `--font-sans` — all table text
- `--fs-meta` — `Table.HeaderCell` font size (14px)
- `--fs-body` — `Table.Cell` font size (17–19px fluid)
- `--tracking-micro` — `Table.HeaderCell` letter-spacing (0.04em, paired with uppercase)
- `--lh-meta` — `Table.HeaderCell` line-height (1.2)
- `--lh-body` — `Table.Cell` line-height (1.55)
- `--space-2` — vertical cell padding (`density="compact"`, 8px)
- `--space-3` — vertical cell padding (`density="comfortable"`, 12px)
- `--space-4` — horizontal cell padding (16px, both densities)
- `--dur-fast` — row hover background transition (180ms)
- `--easing` — row hover transition easing

## 4. Variants / Props

**`Table` root**

| Prop      | Values                       | Default         | Rationale                                                                                                            |
| --------- | ---------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------- |
| `density` | `"compact" \| "comfortable"` | `"comfortable"` | Dashboard list pages read better with comfortable padding; `compact` for dense audit tables or mobile viewports      |
| `tone`    | `"default" \| "subtle"`      | `"default"`     | `default` puts row hover on `--surface`; `subtle` uses `--surface-section` for tables embedded inside a section band |

**`Table.HeaderCell`**

| Prop    | Values                         | Default   | Rationale                                            |
| ------- | ------------------------------ | --------- | ---------------------------------------------------- |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Numeric columns align end; action columns may centre |

**`Table.Cell`**

| Prop    | Values                         | Default   | Rationale                                                             |
| ------- | ------------------------------ | --------- | --------------------------------------------------------------------- |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Mirrors `HeaderCell`; consumers must keep column alignment consistent |

All parts forward a `ref` and spread `className` so consumers can override layout on a per-column basis (e.g. `min-width` on a content-preview column).

## 5. Interaction

- **Row hover** — `Table.Row` inside `Table.Body` receives a background change to `--surface` (default) or `--surface-section` (subtle) on `:hover`. Transition: `background-color var(--dur-fast) var(--easing)`. No hover on header rows.
- **Focus** — Table itself is not an interactive widget; focus lands on interactive children (`Button`, `IconButton`, links) inside cells. No table-level roving-tabindex pattern is required for a static display primitive.
- **Selection** — not in scope for this molecule; belongs to `DataTable`.
- **Sort trigger** — not in scope; belongs to `DataTable`.

## 6. A11y

- Root element is `<table>` — native table semantics, no `role` override needed.
- `Table.HeaderCell` renders `<th scope="col">` — `scope="col"` is mandatory for column headers; it pairs each cell with its column header for screen readers.
- `Table.Head` renders `<thead>`, `Table.Body` renders `<tbody>` — required for correct AT announcement of header vs. body rows.
- `Table.Row` renders `<tr>` — no additional role needed.
- `Table.Cell` renders `<td>` — no additional role needed.
- Consumer responsibility: if a table has no visible caption, pass an `aria-label` or `aria-labelledby` on the `Table` root so AT announces the table's purpose.
- Contrast: `--fg` on `--bg` = 16.29:1 (AAA). `--fg-muted` on `--bg` = 4.56:1 (AA). Both pass for the 14px header label size.
- Axe rules in play: `td-headers-attr`, `th-has-data-cells`, `scope-attr-valid`.

## 7. Motion

- `background-color` on `Table.Row` (body context): `transition: background-color var(--dur-fast) var(--easing)` — 180ms expo-out.
- Under `prefers-reduced-motion: reduce`, the global `transition-duration: 0.01ms !important` in `tokens.css` collapses the row-hover transition. No additional component-level override required.

## 8. Anti-patterns

- **Not for layout grids.** `Table` is a data table — it requires row/column header semantics. CSS grid or flex is correct for visual alignment of non-tabular content.
- **Not a replacement for `DataTable`.** Sorting, filtering, pagination, and column resizing belong to the `DataTable` organism. Do not add those behaviors to `Table`.
- **Not for single-column lists.** A plain `<ul>` or a card list organism is correct for single-column content.
- **Not for form layouts.** Label-input pairs belong in `Field`, `FormRow`, or `Fieldset`.
- **Not for key-value pairs.** Two-column label/value metadata belongs in `MetaList` (`<dl>`).
- **Do not nest tables.** Nested `<table>` elements break screen-reader navigation and are never warranted in this system's surfaces.

## 9. Depends on

No other DS components are required. `Table.Cell` children frequently compose with `StatusBadge`, `Button`, `IconButton`, and `Tag` — those are consumer choices, not Table dependencies.

## Open questions

- **Row dividers as a prop.** The current spec applies a bottom border only to `Table.HeaderCell`. Whether body rows should carry `--hairline` dividers between them is undecided — striped/ruled tables read well for long lists, but the hover-background approach may be sufficient. A `dividers: boolean` prop on `Table` is the likely resolution; leaving it open until a consumer surface requests it.
- **Sticky header token.** A `stickyHeader` boolean prop would `position: sticky; top: 0` on `Table.Head` with a `z-index` value and a `--bg-elevated` background to cover scrolling rows. No existing token covers the `z-index` layer. If `stickyHeader` is needed, a `--z-sticky` token addition must go through `meta/brand.md` first.
