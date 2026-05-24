# Sidebar

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`<Sidebar>` is the vertical navigation surface for docs layouts and app shells. Its single job is to present grouped, hierarchical link lists in a persistent left-rail position, giving users a stable wayfinding anchor as they navigate multi-page content trees. It serves `DocsLayout` as the primary consumer and any app shell that needs a persistent side-nav (dashboard, settings, account).

## 2. Anatomy

```
<aside aria-label="Sidebar">
  <nav aria-label="Sidebar">
    <Sidebar.Group>           ← repeating group unit
      <heading>               ← optional group heading (Heading atom, h3 rung)
      <LinkList>              ← list of nav items
        <LinkList.Item>       ← individual anchor; aria-current="page" on active
      </LinkList>
    </Sidebar.Group>
    ...
  </nav>
</aside>
```

- **Root**: `<aside>` with `aria-label="Sidebar"` (or consumer-supplied label). Provides the complementary landmark.
- **Nav**: `<nav aria-label="Sidebar">` nested inside the aside. Provides the navigation landmark. Distinct label distinguishes it from any `<nav aria-label="Primary">` in the header.
- **Group**: `<section>` containing an optional heading and a `LinkList`. Semantic grouping for SR list navigation.
- **Group heading**: rendered via Heading atom at the h3 rung — `--fs-h3` (18px sans, weight 500). Omit when the group is self-evident from context.
- **Link items**: `LinkList.Item` atoms — plain `<a>` elements at `--fs-meta` (14px) in the `.muted-link` register. Active item: `aria-current="page"`, `color: var(--fg)`.
- **Sticky container**: the aside itself is `position: sticky; top: var(--space-12); height: fit-content` so it tracks the viewport on scroll without disrupting flow.

## 3. Tokens

- `--bg` — page background; sidebar inherits, no separate surface token needed at rest
- `--surface` — optional recessed variant background when sidebar sits in a distinct column lane
- `--fg` — active link color; group heading color
- `--fg-muted` — resting link color (via `.muted-link`)
- `--hairline` — optional group separator rule (`border-top: var(--hairline-w) solid var(--hairline)`)
- `--hairline-w` — 1px rule weight
- `--accent` — focus ring on links
- `--radius-1` — focus ring border-radius
- `--font-sans` — all text
- `--fs-h3` — group heading size (18px)
- `--fs-meta` — link item size (14px)
- `--lh-meta` — link item line-height
- `--space-2` — gap between link items
- `--space-4` — gap between group heading and its LinkList
- `--space-8` — gap between successive groups
- `--space-12` — sticky `top` offset (clears the header band)
- `--dur-fast` — link hover color transition (via `.muted-link`)

## 4. Variants / Props

| Prop       | Type        | Default     | Rationale                                                                                                                                   |
| ---------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`    | `string`    | `"Sidebar"` | `aria-label` for both `<aside>` and `<nav>`; override for locale or multi-sidebar pages                                                     |
| `sticky`   | `boolean`   | `true`      | Enables `position: sticky; top: var(--space-12)`. Disable for app shells where the sidebar lives in a fixed-height scroll container instead |
| `children` | `ReactNode` | —           | One or more `<Sidebar.Group>` elements                                                                                                      |

**`Sidebar.Group`**

| Prop          | Type        | Default | Rationale                                                                             |
| ------------- | ----------- | ------- | ------------------------------------------------------------------------------------- |
| `heading`     | `string`    | —       | Optional group label; omit to suppress the heading element entirely (no empty `<h3>`) |
| `collapsible` | `boolean`   | `false` | Wraps the group's LinkList in a `<Disclosure>` / `<details>` collapse affordance      |
| `defaultOpen` | `boolean`   | `true`  | Initial open state when `collapsible` is true                                         |
| `children`    | `ReactNode` | —       | `LinkList.Item` elements                                                              |

Default `collapsible: false` — most doc sidebars want all groups visible on load. Collapsible groups are an explicit opt-in for large navigation trees that would otherwise overflow the viewport.

## 5. Interaction

- **Hover**: links use `.muted-link` — `--fg-muted` at rest → `--fg` on hover via `color` transition, `--dur-fast`.
- **Active item**: the consumer passes `aria-current="page"` (or the parent router sets it); CSS targets `[aria-current="page"]` to apply `color: var(--fg)` and a 2px left accent mark (`border-left: 2px solid var(--accent); padding-left: calc(var(--space-2) - 2px)`).
- **Focus**: standard `:focus-visible` ring — `2px solid var(--accent)`, `outline-offset: 4px`, `border-radius: var(--radius-1)`.
- **Keyboard**: native tab order — top-to-bottom through all links in DOM order. No custom keyboard management; links are plain `<a>` elements.
- **Collapsible groups** (when `collapsible` is true): toggle via click or Enter/Space on the `<summary>` / trigger. Chevron rotates to indicate open/closed state. Respects `prefers-reduced-motion` — see §7.
- **Scroll**: sidebar scrolls independently of the main content area when its item count exceeds the viewport height. `overflow-y: auto` on the sticky container; `max-height: calc(100vh - var(--space-12))`.

## 6. A11y

- `<aside aria-label="Sidebar">` → `complementary` landmark. Distinguishes the sidebar from `<main>` and `<header>` in SR landmark navigation.
- `<nav aria-label="Sidebar">` nested inside the aside → `navigation` landmark. The matching `aria-label` values on both elements is intentional: the aside scopes the region, the nav names the list for SR shortcut navigation. On a page with both `<nav aria-label="Primary">` (header) and `<nav aria-label="Sidebar">`, SR users see two distinct nav landmarks.
- `aria-current="page"` on the active `LinkList.Item`. Do not use `aria-selected` (tabs) or `aria-pressed` (toggles).
- Group headings are real `<h3>` elements (via Heading atom) — they appear in the SR heading tree, aiding in-page structure navigation.
- When `collapsible` is true: the trigger uses native `<summary>` semantics (or a `<button>` with `aria-expanded`) — not a custom div. The collapsed state is communicated via `aria-expanded` to SRs.
- No `tabindex="-1"` or focus management is needed — all items are native `<a>` elements.
- axe rules in play: `landmark-unique`, `aria-required-children`, `link-name`.

## 7. Motion

- Link hover color: `transition: color var(--dur-fast) var(--easing)` via `.muted-link`. No transform.
- Collapsible group open/close: `max-height` or `grid-row` expand — `transition: var(--dur-fast) var(--easing)`.
- `prefers-reduced-motion: reduce`: the global block in `tokens.css` collapses all transitions to `0.01ms`. No per-component override needed.
- Sidebar entrance: none. It is persistent chrome, not an entering element.

## 8. Anti-patterns

- **Not a modal or off-canvas drawer.** The Sidebar spec covers the persistent in-flow side column. Mobile/responsive off-canvas behavior (slide-in from the left, overlay) belongs to a Sheet or Drawer organism.
- **Not a primary navigation.** Top-level site routes (Why AI, Roles, Principles) belong in `<SiteShell>`'s header nav. Sidebar is for within-section depth nav (docs chapters, settings sub-pages).
- **Not a Table of Contents.** `TableOfContents` (issue 169) handles in-page anchor lists with IntersectionObserver-driven active state. Sidebar handles between-page route navigation.
- **Not a filter or facet panel.** Sidebar links navigate to routes; they do not filter in-page data. Filter panels are a different pattern (Sheet, Popover, or a dedicated filter organism).
- **Not a command palette.** Search-and-jump navigation (`cmdk` / Combobox) is a separate primitive. Sidebar is a static, always-visible list — not an invoked overlay.

## 9. Depends on

- `LinkList` molecule — provides the `<ul>` / `<li>` / `<a>` structure for each group's items
- `Heading` atom — renders optional group headings at the h3 rung
- `Disclosure` molecule (optional) — when `collapsible` is true on a `Sidebar.Group`

## Open questions

- **Active link accent mark token gap.** The 2px left accent border on the active item (§5) reads `border-left: 2px solid var(--accent)`. No existing spacing token represents the compensating negative inset (`padding-left: calc(var(--space-2) - 2px)`). This works arithmetically with existing tokens but is non-obvious. Consider whether a `--sidebar-item-indent` token should be added, or whether the inline calc is sufficient. Flag before engineering starts.
- **Sidebar width token.** No token currently names a canonical sidebar column width. `14rem` (224px) and `16rem` (256px) are conventional ranges. The layout grid (how `DocsLayout` splits the viewport into sidebar + content columns) is outside this spec's scope — but if a width token is needed for both the sidebar and the layout grid to reference the same value, a `--sidebar-w` token addition should be raised as a separate PR before engineering.
