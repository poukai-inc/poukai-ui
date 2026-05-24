# LinkList

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`LinkList` is the system's canonical vertical list of styled anchor rows. It serves footer columns, sitemap blocks, sidebar navigation sections, and on-this-page TOC panels — any surface where a titled or untitled group of links must stack with consistent rhythm, hover treatment, and accessible markup. It is a molecule because it pairs the `Link` atom with an optional `Heading` and wraps them in a semantic `<ul>` / `<li>` structure that a bare Link cannot provide on its own.

## 2. Anatomy

```
<nav aria-label="…"> (optional — when used as a navigation region)
  <div class="root">
    [heading]  ← optional <Heading> at h3 (or overridable level)
    <ul>
      <li><Link href="…">Label</Link></li>
      <li><Link href="…">Label</Link></li>
      …
    </ul>
  </div>
```

- **Root element**: `<div>` by default; wraps heading + list.
- **Heading** (optional): renders via `<Heading>` atom at `level={3}` by default. Accepts a string or ReactNode via the `heading` prop.
- **List**: semantic `<ul>` containing `<li>` items.
- **Item** (`LinkList.Item`): a `<li>` wrapping a `<Link>`. The compound sub-component keeps the list markup clean and lets the engineer enforce the `<li>` wrapper without requiring consumers to write it by hand.
- **Icon slot** (optional, trailing): each `LinkList.Item` accepts an optional trailing icon — used for external-link indicators (`ArrowUpRight`) or active-section markers.

## 3. Tokens

- `--font-sans` — link label font family
- `--fs-meta` — link label size (14px); footer and sidebar registers
- `--fs-body` — alternative size for TOC / main-nav usage (via `size` prop)
- `--fg-muted` — resting link color (muted register; subordinate to body content)
- `--fg` — hover/active link color
- `--accent` — focus ring color
- `--hairline` — optional heading separator below the heading
- `--hairline-w` — 1px separator width
- `--space-1` — item padding-block (compact density)
- `--space-2` — item padding-block (default density); gap between icon and label
- `--space-3` — gap between heading and list
- `--space-6` — gap between list items at `size="md"` (body-scale)
- `--lh-meta` — line-height for meta-scale items
- `--lh-body` — line-height for body-scale items
- `--dur-fast` — color transition duration on hover
- `--easing` — transition easing
- `--radius-1` — focus ring border-radius

## 4. Variants / Props

```
heading?: string | ReactNode      // optional column heading; default undefined
headingLevel?: 2 | 3 | 4         // heading element level; default 3
size?: "sm" | "md"                // "sm" (default): --fs-meta; "md": --fs-body
divider?: boolean                 // renders --hairline rule below heading; default false
```

`LinkList.Item`:

```
href: string                      // required
external?: boolean                // adds rel="noopener noreferrer" + target="_blank"
                                  // + trailing ArrowUpRight icon (visually hidden label appended)
current?: boolean                 // aria-current="page" for active-state highlighting
icon?: ReactNode                  // optional trailing icon slot
```

**`size="sm"` is the default** because the primary use cases (footer columns, sidebar nav) live in subordinate chrome where `--fs-meta` (14px) is the correct register. `size="md"` upgrades to `--fs-body` for contexts like a prominent TOC or a sitemap section that sits within the reading flow.

**No `tone` prop.** Link color is always `--fg-muted` at rest → `--fg` on hover. This is the `.muted-link` pattern from `tokens.css`. A separate tone prop is not warranted — the muted-to-full-fg transition is the only appropriate register for navigational link lists.

## 5. Interaction

- **Hover**: link color transitions from `--fg-muted` to `--fg` over `--dur-fast` with `--easing`. No underline on hover (`.muted-link` pattern — plain color shift, no background-gradient underline used by inline `<a>` defaults). This keeps footer and sidebar columns clean.
- **Focus-visible**: 2px solid `--accent` outline, `4px` offset, `--radius-1` border-radius — matches global `a:focus-visible` rule.
- **Active / current**: `LinkList.Item` with `current={true}` renders `aria-current="page"` and applies `color: var(--fg)` at rest (already "arrived" — no muting needed). Visual distinction from resting items is color only; no bold, no background, no indicator bar (avoids layout shift and keeps the register quiet).
- **Keyboard**: standard tab order through `<a>` elements. No arrow-key roving; `LinkList` is a plain link list, not a menu widget.
- **External links**: `external={true}` adds `target="_blank"` + `rel="noopener noreferrer"` and appends a visually-hidden `" (opens in new tab)"` text node so screen reader users are informed without the icon carrying the only signal.

## 6. A11y

- `<ul>` / `<li>` for the list; semantic list structure exposes item count to screen readers.
- Heading (when present) provides an accessible label for the group. When `LinkList` is the primary navigation in a footer column, the consumer should wrap it in `<nav aria-label="…">` — the component does not add `<nav>` automatically because multiple `LinkList` instances on a page would produce redundant unnamed nav landmarks.
- `aria-current="page"` on the active item per WCAG 2.4.8 (Location) — standard pattern for navigation lists.
- External-link items include visually-hidden supplemental text; no icon-only signal.
- Contrast: `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.91:1 (AA normal at 14px). `--fg` (#1D1D1F) on `--bg` = 16.29:1 (AAA).
- axe rules in play: `link-name` (each `<a>` has text content), `list` (items are direct `<li>` children), `aria-allowed-attr` (`aria-current` on `<a>`).

## 7. Motion

- Link color: `transition: color var(--dur-fast) var(--easing)` — inherits `.muted-link` rule from `tokens.css`.
- No entrance animation. LinkList is a static navigation primitive.
- `@media (prefers-reduced-motion: reduce)`: the global token override in `tokens.css` clamps all `transition-duration` to `0.01ms`. No per-component reduced-motion block needed.

## 8. Anti-patterns

- **Not a menu widget.** Do not use `LinkList` for command menus, dropdown items, or `role="menu"` patterns — those are `DropdownMenu` / `ContextMenu` territory with roving-focus keyboard semantics.
- **Not for action buttons.** Items are anchors (`<a>`), not `<button>`. Do not pass `onClick`-only handlers as items; use a different component for non-navigational actions.
- **Not a tag cloud.** Tags are inline categorical pills; `LinkList` is a vertical navigation column. Do not use it for topic chips or filter groups.
- **Not a content outline with headings.** If the list items are section headings on the same page, use `TableOfContents` (which adds IntersectionObserver active-state tracking) rather than a bare `LinkList`.
- **Not a data list.** `MetaList` is the correct primitive for label/value pairs (`Published: 2026-05-22`). `LinkList` items are navigational anchors, not metadata rows.
- **Not for top-level primary navigation.** The `Header` organism with `NavLink` molecules owns primary nav. `LinkList` is subordinate chrome: footer, sidebar, TOC.

## 9. Depends on

- `Link` atom — each list item's anchor.
- `Heading` atom — the optional column heading.
