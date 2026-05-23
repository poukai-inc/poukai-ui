# DocsLayout

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`DocsLayout` is the three-column page template for documentation surfaces. It composes a `Sidebar` navigation rail on the left, a scrollable `ArticleLayout` content column in the center, and a `TableOfContents` anchor list on the right. It owns column widths, gap rhythm, and the responsive collapse rules — not the content inside any column. Serves `/docs/**` and any structured reference surface that needs persistent left-nav + per-page right-rail TOC.

## 2. Anatomy

```
┌─────────────────────────────────────────────────────┐
│  [sidebar]      [children / content]   [toc]        │
│  <aside>        <main> or slot         <aside>      │
│  sticky         flex: 1 1 auto         sticky       │
│  (hides→Sheet   (always visible)       (hides md)   │
│   at sm)                                            │
└─────────────────────────────────────────────────────┘
```

- **Root element**: `<div>` — CSS grid container with named template areas (`sidebar`, `content`, `toc`).
- **Sidebar slot**: `sidebar` prop — `ReactNode`. Rendered inside a `<div data-area="sidebar">` wrapping element. Sticky from the top using `--space-6` offset (header clearance). Collapses to a `Sheet` drawer at `< --bp-md`.
- **Content slot**: `children` — rendered inside `<div data-area="content">`. No max-width imposed here; `ArticleLayout` owns its own reading measure.
- **TOC slot**: `toc` prop — `ReactNode`. Rendered inside `<div data-area="toc">`. Sticky. Hidden (`display: none`) at `< 1024px` (lg breakpoint — wider than `--bp-md` because the TOC is a luxury column, not essential nav).
- **Mobile sidebar trigger**: an `IconButton` rendered above the content column at `< --bp-md`, opening the `Sheet`-wrapped Sidebar. The trigger label is consumer-supplied via `sidebarLabel` prop (default `"Menu"`).

## 3. Tokens

- `--bg` — page background on root grid container
- `--fg` — inherited text color
- `--hairline` — optional vertical rule between sidebar and content (`border-right` on sidebar wrapper)
- `--hairline-w` — 1px rule width
- `--space-4` — gap between sidebar and content column
- `--space-6` — sticky `top` offset for sidebar and TOC (clears a standard header height)
- `--space-8` — gap between content column and TOC column
- `--space-12` — content column top padding
- `--page-pad` — horizontal padding at narrow viewports when grid collapses to single column
- `--bp-md` — 768px — breakpoint at which sidebar collapses to Sheet
- `--font-sans` — inherited; no direct type setting in the layout shell
- `--dur-fast` — Sheet open/close transition (delegated to Sheet organism)

## 4. Variants / Props

```tsx
// INTENT ONLY — engineer designs the actual API
interface DocsLayoutProps {
  sidebar: ReactNode;          // Sidebar organism; required
  toc?: ReactNode;             // TableOfContents molecule; optional — omit to suppress right rail
  sidebarLabel?: string;       // aria-label + trigger label for mobile Sheet; default "Menu"
  children: ReactNode;         // center content — typically <ArticleLayout>
}
```

- `sidebar` — required. At `>= --bp-md` rendered as a sticky left column. Below `--bp-md`, hidden from flow; accessible via the mobile Sheet trigger.
- `toc` — optional. When omitted the grid collapses to two columns (sidebar + content) at all breakpoints where the TOC would normally appear. Do not render an empty right-rail `<aside>`.
- `sidebarLabel` — default `"Menu"`. Used as the `aria-label` on the Sheet trigger `IconButton` and as the `aria-label` on the `<nav>` inside the Sheet at mobile. Consumers localise this string.
- `children` — required. The center content slot. DocsLayout imposes no reading-measure constraint here; `ArticleLayout` carries its own.

## 5. Interaction

- **Keyboard nav**: at desktop, tab order is sidebar links → content → TOC links. No custom management needed; all elements are standard anchors.
- **Mobile Sheet trigger**: `IconButton` (hamburger or equivalent icon) receives focus as the first interactive element above the content area at mobile. `Enter` / `Space` opens the Sheet.
- **Sheet dismiss**: `Escape` closes; clicking the overlay closes; focus returns to the trigger button on close (Sheet organism handles this).
- **TOC active state**: `TableOfContents` internally uses `IntersectionObserver` to track active section; DocsLayout does not manage scroll state.
- **Sticky columns**: sidebar and TOC use `position: sticky; top: var(--space-6)` and `overflow-y: auto` so they scroll independently within the viewport when content overflows. `max-height: calc(100vh - var(--space-6))` caps their height.

## 6. A11y

- Root `<div>` is a layout container — no landmark role.
- Sidebar wrapper: `<aside aria-label="Sidebar navigation">` at desktop. Inside the Sheet at mobile, the Sheet organism provides the dialog role and the consumer's `Sidebar` carries its own `<nav>` landmark.
- TOC wrapper: `<aside aria-label="On this page">` when `toc` is present.
- Mobile trigger `IconButton`: `aria-expanded` toggled by Sheet open state; `aria-controls` pointing to the Sheet panel id.
- Skip-to-content: DocsLayout does not provide a skip link; this is the responsibility of the parent shell (e.g. `SiteShell` or the app's own skip-link convention).
- Contrast: all text is inherited from `ArticleLayout`, `Sidebar`, and `TableOfContents` — each carries its own contrast contract.

## 7. Motion

- No entrance animation on the layout shell itself.
- Sheet open/close at mobile uses `--dur-fast` (180ms) slide transition — delegated entirely to the `Sheet` organism.
- `prefers-reduced-motion: reduce`: global block in `tokens.css` clamps all transition durations; DocsLayout adds no per-component override.

## 8. Anti-patterns

- **Do not use DocsLayout for marketing pages.** Marketing pages use `SiteShell` + `Section` bands; they have no persistent sidebar nav.
- **Do not pass `ArticleLayout` as the `sidebar` prop.** Sidebar expects a `Sidebar` organism (grouped link nav). Passing content layout here breaks the column contract.
- **Do not nest DocsLayout inside another DocsLayout.** One three-column shell per page.
- **Do not use DocsLayout as an app dashboard shell.** App chrome with sidebar nav is a separate `DashboardShell` organism; DocsLayout is editorial/docs-only.
- **Do not inline ad-hoc sticky logic on the sidebar or TOC slots.** Stickiness is DocsLayout's responsibility via the wrapper elements; adding `position: sticky` on the slotted organisms creates a double-sticky conflict.
- **Do not omit `toc` and leave an empty right-rail placeholder.** When `toc` is absent the grid must reflow to two columns — an empty `<aside>` is a landmark with no content and an SR anti-pattern.

## 9. Depends on

- `Sidebar` organism (`#196`)
- `ArticleLayout` organism (`#214`)
- `TableOfContents` molecule (`#169`)
- `Sheet` organism (`#220`) — for mobile sidebar drawer
