# Pagination

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`<Pagination>` is the system's stateless, controlled page-navigation control. It renders a row of numbered page buttons flanked by Prev/Next chevron buttons, with ellipsis truncation at configurable sibling and boundary counts. It serves dashboard list pages — specifically `autopost` scheduled posts, comments, and any `Table`-backed list page — where datasets exceed a single viewport and users must navigate between pages without triggering a full layout re-render.

## 2. Anatomy

```
[← Prev]  [1]  [2]  [•••]  [9]  [10]  [Next →]
```

- **Root**: `<nav aria-label="Pagination">` — landmark wrapper.
- **Prev button**: `<button>` with leading chevron icon; disabled on page 1.
- **Page buttons**: `<button>` for each visible page number; current page carries `aria-current="page"`.
- **Ellipsis**: `<span aria-hidden="true">…</span>` — decorative truncation marker, not focusable.
- **Next button**: `<button>` with trailing chevron icon; disabled on last page.

Page number visibility algorithm:

- Always show `boundaryCount` pages at each end.
- Always show `siblingCount` pages either side of current page.
- Fill gaps with a single ellipsis span when the gap is larger than one page.

## 3. Tokens

- `--font-sans` — button font family
- `--fs-meta` — page button font size (14px)
- `--fg` — default button text
- `--fg-muted` — ellipsis color
- `--surface` — current-page button background
- `--bg-elevated` — hover background for non-current page buttons
- `--hairline` — border on non-current page buttons
- `--hairline-w` — border width
- `--accent` — focus ring color
- `--radius-2` — button border-radius (4px)
- `--radius-1` — focus ring border-radius (2px)
- `--space-1` — vertical padding inside page buttons
- `--space-2` — horizontal padding inside page buttons; gap between all row items
- `--dur-fast` — hover transition duration
- `--easing` — hover transition easing

## 4. Variants / Props

| Prop            | Type                     | Default | Rationale                                                                                                                          |
| --------------- | ------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `page`          | `number`                 | —       | Current page (1-indexed). Required.                                                                                                |
| `pageCount`     | `number`                 | —       | Total number of pages. Required.                                                                                                   |
| `onPageChange`  | `(page: number) => void` | —       | Required; component is stateless/controlled.                                                                                       |
| `siblingCount`  | `number`                 | `1`     | Pages shown each side of current. `1` covers the common case; raise to `2` for wide layouts.                                       |
| `boundaryCount` | `number`                 | `1`     | Pages shown at each end. `1` is sufficient for most list pages.                                                                    |
| `size`          | `"sm" \| "md"`           | `"md"`  | `"sm"` reduces to `--fs-micro` + `--btn-h-sm`; `"md"` uses `--fs-meta` + `--btn-h-compact`. Dashboard density often favors `"sm"`. |
| `disabled`      | `boolean`                | `false` | Disables all buttons; useful during loading state.                                                                                 |

## 5. Interaction

**Keyboard navigation:**

- All buttons are focusable tab stops in DOM order: Prev → page 1 → … → page N → Next.
- Ellipsis spans are skipped (`aria-hidden`, not focusable).
- `Enter` / `Space` activate the focused button.
- Prev button is `disabled` (and therefore skipped by tab order) when `page === 1`.
- Next button is `disabled` when `page === pageCount`.

**Hover:** non-current page buttons and Prev/Next show `--bg-elevated` background on hover. Transition: `background-color var(--dur-fast) var(--easing)`.

**Active:** `transform: scale(0.97)` on `mousedown` / `:active`. Duration `--dur-press`.

**Current page button:** rendered with `--surface` background, full `--fg` weight (`font-weight: 500`), no hover state change — it is already selected.

**Disabled state:** `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none`. Applies to individual Prev/Next when at boundaries, and to all buttons when `disabled={true}`.

## 6. A11y

- Root is `<nav aria-label="Pagination">` — exposes a navigation landmark.
- Current page button: `aria-current="page"`.
- Prev/Next buttons: `aria-label="Previous page"` / `aria-label="Next page"` (icon-only, must have accessible name).
- Ellipsis `<span>` carries `aria-hidden="true"` — purely decorative.
- Disabled Prev/Next use the HTML `disabled` attribute (removes from tab order, announces as unavailable to screen readers).
- Focus ring: `outline: 2px solid var(--accent)`, `outline-offset: 2px`, `border-radius: var(--radius-1)`.
- Contrast: `--fg` (#1D1D1F) on `--surface` (#F5F5F7) = 15.46:1 (AAA) for current page; `--fg` on `--bg` (#FBFBFD) = 16.29:1 (AAA) for resting buttons.
- axe rules in play: `button-name`, `landmark-unique`, `color-contrast`.

## 7. Motion

- Hover background: `background-color var(--dur-fast) var(--easing)`.
- Active press: `transform var(--dur-press) var(--easing)`.
- No entrance animation — Pagination is a utility control.
- `prefers-reduced-motion: reduce`: the global `tokens.css` block clamps all `transition-duration` to `0.01ms`. No per-component override needed.

## 8. Anti-patterns

- **Not for in-page anchor navigation.** Use `TableOfContents` for scroll-linked TOC.
- **Not a substitute for infinite scroll.** Pagination is an explicit, user-initiated control; do not use it to approximate lazy loading.
- **Not for step-by-step wizard flows.** Use `Stepper` for sequential process navigation with progress semantics.
- **Not for tab switching.** `Tabs` owns horizontal content-panel switching within a single view.
- **Do not render when `pageCount <= 1`.** The component should return `null`; consumers must guard or the component guards internally.
- **Do not manage page state internally.** This is a controlled component; lifting state to the parent is required and intentional.

## 9. Depends on

- `Button` atom — Prev/Next controls reuse button height tokens (`--btn-h-sm`, `--btn-h-compact`) and focus-ring contract for visual consistency, though the page number buttons are rendered as plain `<button>` elements styled directly rather than as `<Button>` instances (to avoid compound-component overhead for a dense row of small controls).
- `Icon` atom — chevron icons for Prev (`ChevronLeft`) and Next (`ChevronRight`) at `--icon-xs` (12px) inside `"sm"` size, `--icon-sm` (16px) inside `"md"` size.

## Open questions

- **`--btn-h-sm` / `--btn-h-compact` as height for page buttons.** The button height tokens exist for the `Button` atom. Reusing them for Pagination page-number buttons ensures visual row alignment but the connection is indirect. Confirm whether page buttons should use the button height tokens directly (via `min-height`) or carry their own vertical padding derived only from `--space-1` / `--space-2`. Recommendation: use `min-height: var(--btn-h-compact)` for `"md"` and `min-height: var(--btn-h-sm)` for `"sm"` to guarantee alignment when Pagination appears beside other controls.
- **Minimum `pageCount` before ellipsis appears.** The algorithm needs a threshold: if `pageCount <= siblingCount * 2 + boundaryCount * 2 + 3`, show all pages without any ellipsis. The exact formula should be confirmed with the engineer during implementation.
