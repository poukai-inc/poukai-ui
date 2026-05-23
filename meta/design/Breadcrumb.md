# Breadcrumb

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`<Breadcrumb>` renders the hierarchical location trail for nested dashboard and product routes, giving users an always-visible path back through the page hierarchy without relying on a single back-arrow link. It serves the `autopost` dashboard surfaces — settings, data-sources, edit, and engagement sub-routes — where two or more levels of context must remain visible simultaneously.

## 2. Anatomy

```
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="…">Pages</a></li>        ← linked ancestor
    <li aria-hidden>›</li>               ← separator (presentational)
    <li><a href="…">My Page</a></li>      ← linked ancestor
    <li aria-hidden>›</li>
    <li aria-current="page">Settings</li> ← current item (not linked)
  </ol>
</nav>
```

- **Root**: `<nav aria-label="Breadcrumb">` — landmark wrapping the trail.
- **List**: `<ol>` — ordered, reflects hierarchy.
- **Item**: `<li>` — one per route segment.
- **Ancestor link**: `<a>` wrapping the label for all non-current items.
- **Separator**: a presentational `›` character rendered between items via CSS `::before` or an `aria-hidden` `<li>`; not part of the accessible label.
- **Current item**: plain text, no `<a>`, carries `aria-current="page"`.

Compound API (preferred):

```tsx
<Breadcrumb>
  <Breadcrumb.Item href="/dashboard/pages">Pages</Breadcrumb.Item>
  <Breadcrumb.Item href={`/dashboard/pages/${id}`}>{pageName}</Breadcrumb.Item>
  <Breadcrumb.Item current>Settings</Breadcrumb.Item>
</Breadcrumb>
```

Data-driven alias also accepted:

```tsx
<Breadcrumb items={[
  { href: "/dashboard/pages", label: "Pages" },
  { href: `/dashboard/pages/${id}`, label: pageName },
  { label: "Settings", current: true },
]} />
```

## 3. Tokens

- `--font-sans` — font family for all items
- `--fs-meta` — 14px; breadcrumb text reads at meta register, subordinate to page headings
- `--lh-meta` — 1.2; tight single-line
- `--fg-muted` — ancestor link color at rest
- `--fg` — current item color (higher weight signals "you are here")
- `--accent` — ancestor link hover color
- `--hairline` — separator color
- `--space-2` — gap between item + separator pairs (8px)
- `--dur-fast` — 180ms; ancestor link color transition on hover
- `--easing` — expo-out easing for hover color transition
- `--radius-1` — 2px; focus ring border-radius on ancestor links

## 4. Variants / Props

| Prop | Type | Default | Rationale |
|---|---|---|---|
| `items` | `Array<{ href?: string; label: ReactNode; current?: boolean }>` | — | Data-driven path; mutually exclusive with compound children |
| `children` | `ReactNode` | — | Compound `Breadcrumb.Item` nodes; preferred for dynamic labels |
| `separator` | `ReactNode` | `"›"` | Override with custom char or icon; default chevron is universally understood |
| `className` | `string` | — | Layout override passthrough |

`Breadcrumb.Item` sub-component props:

| Prop | Type | Default | Rationale |
|---|---|---|---|
| `href` | `string` | — | When present renders `<a>`; absent on current item |
| `current` | `boolean` | `false` | Marks terminal item; suppresses link, adds `aria-current="page"` |
| `children` | `ReactNode` | — | Item label |

No `size` prop — `--fs-meta` is the single correct register for nav metadata. No `tone` prop — ancestor/current states are the only meaningful visual distinction.

## 5. Interaction

- **Hover**: ancestor links transition `color` from `--fg-muted` → `--accent` over `--dur-fast` with `--easing`. Underline grows via background-size transition matching the global `<a>` pattern in `tokens.css`.
- **Focus-visible**: `outline: 2px solid var(--accent); outline-offset: 4px; border-radius: var(--radius-1)` on ancestor `<a>` elements. Matches global focus-visible rule.
- **Active**: no distinct active press state — breadcrumb items are navigation links, not action buttons.
- **Current item**: not focusable via keyboard (it is not a link); excluded from tab order naturally.
- **Keyboard**: Tab navigates ancestor links left-to-right. Each ancestor link is a full tab stop.
- **Truncation**: no JS-driven overflow collapse in this version. On narrow viewports the trail wraps or the container clips; see §8.

## 6. A11y

- Root is `<nav aria-label="Breadcrumb">` — exposes a navigation landmark distinct from the primary nav.
- `<ol>` conveys ordered hierarchy to screen readers.
- Current item carries `aria-current="page"` — screen readers announce "Settings, current page" or equivalent.
- Separator elements carry `aria-hidden="true"` so they are not read as content.
- All ancestor links have visible text as their accessible name; no `aria-label` needed on the links themselves.
- Contrast: `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.91:1 — AA normal at 14px. `--fg` (#1D1D1F) on `--bg` = 16.29:1 — AAA. Focus ring `--accent` (#0071E3) meets non-text contrast requirement (3:1) against `--bg`.
- axe rules in scope: `aria-required-children` (ol > li structure), `color-contrast`, `link-name`, `landmark-unique`.

## 7. Motion

- Ancestor link color transition: `color var(--dur-fast) var(--easing)` on hover.
- Ancestor link underline grow: `background-size var(--dur-mid) var(--easing-link)` — inherits the global `<a>` pattern.
- `@media (prefers-reduced-motion: reduce)`: the global `tokens.css` block clamps all `transition-duration` to `0.01ms`. No per-component motion override needed.
- No entrance animation. Breadcrumb is a static nav element that renders synchronously with the page.

## 8. Anti-patterns

- **Do not use for tab navigation.** Breadcrumb is a location trail, not a content-switching control. Use `Tabs` for switching views.
- **Do not place a breadcrumb inside a `<Hero>`.** The Hero owns the `<h1>` moment; a breadcrumb above or inside it competes with the hierarchy. Place it above the Hero or in the page shell.
- **Do not link the current item.** The terminal item is where the user is — linking it is a no-op and confuses screen reader output. Always `current` items are plain text.
- **Do not use for wizard step progress.** That is `Stepper` (linear sequential flow with completion state). Breadcrumb is spatial hierarchy, not temporal progress.
- **Do not deep-nest beyond 4–5 levels.** Beyond that, consider flattening the IA or using a back-link pattern. A 7-item breadcrumb is a navigation architecture problem, not a component problem.
- **Do not apply breadcrumb to top-level (root) pages.** A single-item trail ("Dashboard") adds no navigational value. Render nothing, or render the component only when depth ≥ 2.

## 9. Depends on

No other DS components required. Pure CSS + DS tokens.

Ancestor links reuse the global `<a>` hover/focus pattern from `tokens.css` directly — no `Link` atom abstraction needed at this layer, though if a `Link` atom ships it can replace the raw `<a>` in the implementation without a spec change.
