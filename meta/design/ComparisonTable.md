# ComparisonTable

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`ComparisonTable` is the pricing page's feature × tier matrix — a dense, scannable grid that lets a visitor compare what each plan includes at a glance. It composes a sticky `<thead>` of tier names against a scrollable body of feature rows, with optional row group headings to cluster related features. It serves the pricing surface of pouk.ai as the dense sibling of `PricingTable`; where `PricingTable` is the hero tier-card moment, `ComparisonTable` is the exhaustive reference a careful buyer reaches for.

## 2. Anatomy

```
┌─────────────────────────────────────────────┐
│ [sticky thead]                              │
│  Feature  │   Free   │   Pro   │   Team     │
├───────────┼──────────┼─────────┼────────────┤
│ [group]   Storage                           │
│  Projects │    3     │  Unlim  │  Unlim     │
│  Members  │    1     │    5    │  Unlim     │
├───────────┼──────────┼─────────┼────────────┤
│ [group]   Support                           │
│  SLA      │    —     │  Email  │  Priority  │
└─────────────────────────────────────────────┘
```

- **Root**: `<Section>` wrapper providing standard block padding and optional heading.
- **Table**: semantic `<table>` — the single scroll container when overflow occurs on narrow viewports.
- **Sticky header row** (`<thead> <tr>`): one `<th scope="col">` per tier, plus a leading empty `<th>` for the feature column. `position: sticky; top: 0` via CSS.
- **Row group heading** (`<tr>` with single `<th colspan>` spanning all columns): optional cluster label rendered in `--fg-muted`, `--fs-meta`, uppercase. Inserted between `<tbody>` row sets when `rows` contains group separators.
- **Feature row** (`<tr>`): leading `<th scope="row">` for the feature label; one `<td>` per tier value. Values are strings — check marks, "Unlimited", counts, or `"—"` for absent features.
- **Tier label cell**: renders the tier name in `--fg`, `--fs-meta`, `font-weight: 500`. The featured tier (if flagged) receives `--accent` text color.

## 3. Tokens

- `--bg-elevated` — sticky thead background (prevents bleed-through on scroll)
- `--surface` — zebra-stripe on alternate rows (optional, controlled by `striped` prop)
- `--surface-section` — row group heading row background
- `--fg` — feature label text (`<th scope="row">`) and tier name cells
- `--fg-muted` — row group heading text; tier label subtext (e.g. "/month")
- `--hairline` — horizontal row dividers (`border-bottom` on each `<tr>`)
- `--hairline-w` — `1px` rule weight
- `--fs-meta` — tier name, feature label, cell value font-size (14px)
- `--fs-micro` — row group heading font-size (12px)
- `--font-sans` — all table text
- `--tracking-micro` — row group heading letter-spacing (`0.04em`) paired with `text-transform: uppercase`
- `--space-2` — cell padding block axis (8px)
- `--space-4` — cell padding inline axis (16px)
- `--space-3` — gap between tier name and optional subtext within a header cell
- `--accent` — featured tier column header text color
- `--lh-meta` — line-height for all table text (1.2)
- `--radius-2` — optional featured-tier column header pill marker (4px)

## 4. Variants / Props

| Prop | Type | Default | Rationale |
|---|---|---|---|
| `tiers` | `Array<{ label: string; featured?: boolean }>` or `string[]` | required | Column headers. `featured` flags one tier for accent styling. |
| `rows` | `Array<Row \| GroupHeading>` | required | `Row: { feature: string; values: string[] }`. `GroupHeading: { group: string }`. Discriminated by presence of `group` key. |
| `striped` | `boolean` | `false` | Alternate-row fill via `--surface`. Off by default — the brand register prefers hairlines over fills for table rhythm. |
| `stickyHeader` | `boolean` | `true` | Sticky `<thead>`. Disable only when the table sits inside a container with `overflow: hidden` that breaks `position: sticky`. |
| `caption` | `string` | `undefined` | Visible or visually-hidden `<caption>` for accessibility. When absent a `aria-label` on the `<table>` must be supplied by the consumer. |

`tiers` accepts both plain `string[]` (shorthand) and `Array<{ label: string; featured?: boolean }>` (full form). The engineer discriminates via `typeof tiers[0] === 'string'`.

## 5. Interaction

- **Horizontal scroll**: on viewports narrower than the table's natural width, the table scrolls horizontally inside its container. The root wrapper receives `overflow-x: auto`. The sticky header scrolls with the table horizontally (it is `position: sticky` on the block axis only).
- **No row hover, no row click, no sort.** This is a static display primitive. Sort/filter belongs to `DataTable`.
- **Keyboard**: no custom keyboard handling. Native table navigation (arrow keys in some screen readers) is preserved by semantic `<th>` / `<td>` markup with correct `scope` attributes.
- **Focus**: no interactive elements inside cells by default. If a consumer places a `<Button>` or `<Link>` inside a value slot (not recommended), focus order follows natural DOM order.

## 6. A11y

- Semantic `<table>` with `<thead>`, `<tbody>` (one per group, or a single `<tbody>`).
- `<th scope="col">` on every tier header cell; `<th scope="row">` on every feature label cell.
- Row group headings use `<tr><th colspan={tiers.length + 1} scope="colgroup">` — this is the correct pattern for grouped table sections.
- `<caption>` or `aria-label` on the `<table>` is required; the component accepts a `caption` prop. When `caption` is provided it renders as a `<caption>` element. Visual consumers may want it visually hidden; the engineer exposes a `captionVisibility: "visible" | "sr-only"` implementation detail.
- `role="table"` is not added — the native `<table>` element already carries implicit table role.
- axe rules in play: `td-headers-attr`, `th-has-data-cells`, `scope-attr-valid`.
- Contrast: `--fg` on `--bg-elevated` (thead) = 16.29:1 (AAA); `--fg-muted` on `--surface-section` (group row) = sufficient AA given `--fg-muted` (#6e6e73) on `--surface-section` (#f8f8fa) ≈ 4.7:1.

## 7. Motion

None — static display component. No entrance animation. No transition on any property.

`@media (prefers-reduced-motion: reduce)` in `tokens.css` has no effect here but applies globally if a parent introduces animation.

## 8. Anti-patterns

- **Not a `DataTable` replacement.** `ComparisonTable` has no sort, filter, or pagination. Use `DataTable` for interactive dataset tables.
- **Not for more than ~5 tiers.** Beyond 5 columns the horizontal layout collapses on mobile without meaningful improvement to comprehension. Redesign the surface or use a card-based approach.
- **Not for arbitrary cell content.** Cells accept strings only. Embedding interactive widgets, images, or complex layouts inside cells is out of scope and will break the alignment contract.
- **Not a substitute for `PricingTable`.** `PricingTable` is the primary conversion moment (tier cards + CTA). `ComparisonTable` is the exhaustive reference that follows it. They are siblings, not alternatives.
- **Not for status data.** Use `StatusBadge` for liveness signals. Check-mark vs dash is a binary feature-presence indicator, not a status.
- **Do not use row group headings as section titles.** They are cluster labels inside the table. Page-level headings belong in `Section`.

## 9. Depends on

- `Section` — outer wrapper providing block padding and optional heading.
- `MetaList` — not directly rendered inside cells, but the feature-label column shares the same label/value semantic pattern; `MetaList` is the non-table sibling for the same data shape.

## Open questions

- **Featured-tier column highlight**: the spec flags one tier via `--accent` text on the header cell. A full-column background tint (e.g. `--surface`) for the featured column would improve scannability but requires a CSS approach (`nth-child` or CSS custom properties per-column) that has cross-browser quirks in sticky-header contexts. Needs a live layout test before committing to a column-fill approach. If no column tint lands, `--accent` header text alone is the minimum viable signal.
- **Check / dash glyph convention**: cell values are consumer-supplied strings. A convention for "included" (`✓` or `"Yes"`) versus "not included" (`—`) is not enforced by the component — the consumer decides. A future `CheckCell` slot (renders a lucide `Check` or `Minus` icon) would standardize this but requires an icon token decision. Flagged for a follow-up spec if demand appears.
