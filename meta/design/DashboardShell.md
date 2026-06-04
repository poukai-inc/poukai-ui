# Design spec: DashboardShell

**Atomic layer**: organism
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-06-02
**Implements proposal**: GitHub issue #406, `poukai-inc/poukai-admin`

---

## 1. Purpose

`<DashboardShell>` is the canonical page-chrome organism for authenticated ops and admin surfaces. It owns a full-viewport two-column layout: a persistent fixed-width left rail containing the Wordmark, vertical nav items, and a bottom-anchored identity footer slot — and a scrollable `<main>` content column that fills the remaining width.

This organism is deliberately separate from `<SiteShell>`, which owns the horizontal top-bar marketing chrome. The layout contracts are fundamentally different: SiteShell is a flex column with a row header; DashboardShell is a flex row with a column rail. Merging them via an `orientation` prop would fork SiteShell's internal layout model and couple two semantically distinct page types. A distinct organism is the cleaner contract.

### Non-goals

- **No router awareness.** DashboardShell emits plain `<a href>` for all nav links. Framework router consumers handle link interception at the application level. This mirrors SiteShell's non-negotiable framework-agnostic stance.
- **No auth or session logic.** DashboardShell does not know whether a user is signed in. The consumer passes identity content via the `footer` slot. DashboardShell is purely compositional with respect to auth.
- **No nested sub-nav.** The rail nav is a flat list of routes. Nested groups, collapsible trees, or second-level flyouts are out of scope for this version.
- **No rail width resizing.** The rail width is fixed. A resize handle is explicitly deferred.
- DashboardShell does not manage page scroll, anchor behavior, or scroll restoration within `<main>`.
- DashboardShell does not own the content layout inside `<main>` — that is the consumer's responsibility.

---

## 2. Anatomy

### Desktop (≥ `--bp-md`, 768px)

```
┌──────────────┬─────────────────────────────────────────┐
│ [rail]       │ [main]                                  │
│              │                                         │
│ [Wordmark]   │   {children}                            │
│              │                                         │
│ [nav]        │                                         │
│  • item      │                                         │
│  • item ←    │  ← active item: accent left mark        │
│  • item      │                                         │
│              │                                         │
│ [rail slot]  │                                         │
│              │                                         │
│ ──────────── │                                         │
│ [footer]     │                                         │
│  identity    │                                         │
│  sign-out    │                                         │
└──────────────┴─────────────────────────────────────────┘
```

- **Root element**: `<div>` — `display: flex; flex-direction: row; min-height: 100vh`. Background `--bg`, color `--fg`.
- **Rail**: `<aside>` — `display: flex; flex-direction: column; width: 14rem` (224px — see §4 for the non-tokenised exception). `position: sticky; top: 0; height: 100vh; overflow-y: auto`. Background `--surface`. A `border-right: var(--hairline-w) solid var(--hairline)` hairline separates it from the content column. The rail does not scroll with the page — it sticks to the viewport left edge.
- **Wordmark link**: `<a href={homeHref}>` wrapping `<Wordmark height={40} />` at the top of the rail. `background-image: none; padding-bottom: 0` to suppress the global link underline animation on the brand mark.
- **Rail slot**: optional `ReactNode` below the Wordmark and above the `<nav>`. For consumer-injected content such as a workspace selector, an environment badge, or an account switcher. Renders only when the `rail` prop is provided.
- **Nav**: `<nav aria-label={navLabel}>` containing a `<ul role="list">`. Each item is a `<li>` containing a plain `<a>` link. Flex column layout with `gap: var(--space-1)` between items.
- **Main**: `<main>` — `flex: 1 1 0; min-width: 0; overflow-y: auto`. The `min-width: 0` prevents flex children from overflowing the content column. `padding: var(--space-8) var(--space-8)` as the default content breathing room; consumers override via their own layout composition inside `children`.
- **Footer slot**: a `<div>` pinned to the bottom of the rail via `margin-top: auto` within the rail flex column. Contains a `border-top: var(--hairline-w) solid var(--hairline)` separator and `padding: var(--space-4) var(--space-4)`. Accepts any `ReactNode` — canonical usage is identity (name, avatar) + a server-action sign-out `<form>`. The DS owns the slot container; the consumer owns the contents.

### Mobile (`< --bp-md`, 768px)

```
┌─────────────────────────────────────────┐
│ [top bar]  ☰  [Wordmark]               │
├─────────────────────────────────────────┤
│ [main]                                  │
│   {children}                            │
└─────────────────────────────────────────┘

                    ↓ when open

┌░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░┐   ← backdrop (z-index: 100)
│┌──────────────┐░░░░░░░░░░░░░░░░░░░░░░░░│
││ [rail panel] │░░░░░░░░░░░░░░░░░░░░░░░░│   ← off-canvas panel (z-index: 101)
││ [Wordmark]   │░░░░░░░░░░░░░░░░░░░░░░░░│
││ [nav]        │░░░░░░░░░░░░░░░░░░░░░░░░│
││  • item      │░░░░░░░░░░░░░░░░░░░░░░░░│
││  • item ←   │░░░░░░░░░░░░░░░░░░░░░░░░│
││ [footer]     │░░░░░░░░░░░░░░░░░░░░░░░░│
│└──────────────┘░░░░░░░░░░░░░░░░░░░░░░░░│
└░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░┘
```

- **Top bar**: `<div>` — `display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3) var(--page-pad); border-bottom: var(--hairline-w) solid var(--hairline); background: var(--surface)`. Shown only below `--bp-md` (`display: none` on desktop). Contains the hamburger button and a compact Wordmark link (`height={32}`).
- **Hamburger button**: `<button type="button">` with inline SVG icon. `aria-expanded`, `aria-controls`, `aria-label`. Sits at the leading (left) edge of the top bar. On open: renders the close (×) SVG.
- **Backdrop**: a `<div>` absolutely positioned over the full viewport (`position: fixed; inset: 0`). Background `rgba(0, 0, 0, 0.4)`. `z-index: 100`. Clicking or touching the backdrop closes the panel.
- **Off-canvas rail panel**: the rail `<aside>` transforms in from the left on mobile. `position: fixed; top: 0; left: 0; bottom: 0; width: 14rem; z-index: 101; background: var(--bg-elevated)`. In the closed state: `transform: translateX(-100%)`. In the open state: `transform: translateX(0)`. The panel contains the full rail anatomy (Wordmark, rail slot, nav, footer) identical to desktop, scaled appropriately.

---

## 3. Tokens used

No new tokens are required. Every token referenced below exists in `src/tokens/tokens.css`. The rail width (`14rem`) and z-index values are intentional non-tokenised exceptions — see §4 and §13 respectively.

| Token           | Role                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `--bg`          | Root background; main content area background                                                                                         |
| `--bg-elevated` | Off-canvas rail panel background on mobile (front-most layer, consistent with popover/sheet elevation)                                |
| `--surface`     | Rail background on desktop; top bar background on mobile                                                                              |
| `--fg`          | Root text color; Wordmark color; active nav link color                                                                                |
| `--fg-muted`    | Resting nav link color; footer slot supporting text                                                                                   |
| `--hairline`    | Rail `border-right` on desktop; footer slot `border-top`; top bar `border-bottom`; mobile panel separators                            |
| `--hairline-w`  | All 1px border widths                                                                                                                 |
| `--accent`      | Active nav link left accent mark (`border-left`); focus rings; active link color override                                             |
| `--radius-1`    | Focus ring `border-radius`                                                                                                            |
| `--font-sans`   | Nav link `font-family`                                                                                                                |
| `--fs-meta`     | Nav link `font-size`; footer slot supporting text size                                                                                |
| `--lh-meta`     | Nav link `line-height`                                                                                                                |
| `--dur-fast`    | Nav link hover color transition                                                                                                       |
| `--dur-mid`     | Off-canvas panel slide transition                                                                                                     |
| `--easing`      | Off-canvas panel slide easing (expo-out)                                                                                              |
| `--space-1`     | Gap between nav items                                                                                                                 |
| `--space-2`     | Nav link horizontal padding compensation for active border (`padding-left: calc(var(--space-3) - 2px)` when accent border is present) |
| `--space-3`     | Nav link inline padding (leading side)                                                                                                |
| `--space-4`     | Rail internal padding (inline); footer slot padding; top bar gap                                                                      |
| `--space-6`     | Rail vertical padding at top (below Wordmark area)                                                                                    |
| `--space-8`     | Main content default padding block and inline; rail slot bottom margin                                                                |
| `--page-pad`    | Mobile top bar horizontal padding                                                                                                     |
| `--bp-md`       | Mobile/desktop breakpoint (`@custom-media --bp-md (min-width: 768px)`)                                                                |

---

## 4. Layout and rhythm

### Rail width — documented non-tokenised exception

The rail is `width: 14rem` (224px). No `--sidebar-w` or `--rail-w` token exists in the token vocabulary. This value is hardcoded in `DashboardShell.module.css` with a comment citing this precedent:

> Rail width: 14rem (224px). Non-tokenised by design — same exception as z-index values. See meta/design/DashboardShell.md §4.

**Rationale for non-tokenisation.** The Sidebar spec (`meta/design/Sidebar.md`) raised this question explicitly and deferred it. A shared `--rail-w` or `--sidebar-w` token would be appropriate only if (a) multiple organisms need to reference the same rail width, or (b) the width is consumer-configurable. Neither condition holds yet: DashboardShell is the only organism with a persistent rail, and the width is not a prop in this version. Introducing a single-consumer token without a cross-component coordination need is premature abstraction. If a `DocsLayout` organism or a multi-rail layout is introduced later, a token can be extracted at that point with real evidence. Until then, the raw value with an explanatory comment is the correct choice.

14rem (224px) sits at the narrower end of the conventional sidebar range (224–256px) and was chosen because it is wide enough to render a Wordmark at `height={40}` with comfortable rail padding, while keeping the content column as wide as possible on the minimum supported viewport width (768px: content column = 768 - 224 = 544px, which is comfortable for most app content).

### Rail — desktop

```css
.rail {
  display: flex;
  flex-direction: column;
  width: 14rem; /* non-tokenised exception — see spec §4 */
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;
  background: var(--surface);
  border-right: var(--hairline-w) solid var(--hairline);
}
```

### Rail inner layout

```css
.rail-inner {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding: var(--space-6) var(--space-4) var(--space-4);
  min-height: 0;
}
```

### Wordmark area

```css
.brand {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-6);
  background-image: none; /* suppress global link underline on brand mark */
  padding-bottom: 0;
}
```

### Rail slot (optional)

```css
.rail-slot {
  margin-bottom: var(--space-8);
}
```

When the `rail` prop is absent, `.rail-slot` is not rendered and the `<nav>` follows directly below the Wordmark area.

### Nav list

```css
.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-2); /* 4px — subtle pill shape consistent with DS radius vocabulary */
  font-family: var(--font-sans);
  font-size: var(--fs-meta);
  line-height: var(--lh-meta);
  color: var(--fg-muted);
  background-image: none; /* suppress global link underline in nav context */
  padding-bottom: var(--space-2); /* override the 2px that global <a> adds */
  transition: color var(--dur-fast) var(--easing);
  /* Active state — applied when aria-current="page" */
}

.nav-link[aria-current="page"] {
  color: var(--fg);
  border-left: 2px solid var(--accent);
  padding-left: calc(var(--space-3) - 2px); /* compensate so text stays optically aligned */
}

@media (hover: hover) {
  .nav-link:not([aria-current="page"]):hover {
    color: var(--fg);
  }
}

.nav-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: var(--radius-1);
}
```

The `border-radius: var(--radius-2)` on `.nav-link` provides a subtle hover-region shape without creating a background fill — the link background is transparent at rest. No `background-color` is applied on hover; only the `color` transitions. This keeps the rail visually quiet and avoids the filled-pill nav pattern common in generic admin UIs.

### Footer slot

```css
.rail-footer {
  margin-top: auto;
  border-top: var(--hairline-w) solid var(--hairline);
  padding: var(--space-4);
  flex-shrink: 0;
}
```

`margin-top: auto` pushes the footer to the bottom of the rail flex column regardless of how many nav items exist.

### Main content

```css
.main {
  flex: 1 1 0;
  min-width: 0;
  overflow-y: auto;
  padding: var(--space-8);
}
```

`padding: var(--space-8)` (32px) is the default content breathing room. Consumers who need a full-bleed content layout (e.g. a data table that spans the full column) apply `padding: 0` inside their own child component rather than receiving a prop to strip the main padding — that is the consumer's layout concern, not the shell's.

### Mobile top bar

```css
.top-bar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--page-pad);
  border-bottom: var(--hairline-w) solid var(--hairline);
  background: var(--surface);
  position: sticky;
  top: 0;
  z-index: 100; /* same layer as sticky header — see §13 */
}

@media (--bp-md) {
  .top-bar {
    display: none;
  }
}
```

### Off-canvas rail panel (mobile)

```css
.rail-mobile {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 14rem; /* same raw value as desktop rail */
  background: var(--bg-elevated);
  border-right: var(--hairline-w) solid var(--hairline);
  z-index: 101; /* one above top bar / backdrop — see §13 */
  transform: translateX(-100%);
  transition: transform var(--dur-mid) var(--easing);
  display: flex;
  flex-direction: column;
}

.rail-mobile[data-state="open"] {
  transform: translateX(0);
}

@media (--bp-md) {
  .rail-mobile {
    display: none;
  }
}
```

### Backdrop

```css
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100; /* behind the panel, in front of page content */
  opacity: 0;
  transition: opacity var(--dur-mid) var(--easing);
}

.backdrop[data-state="open"] {
  opacity: 1;
}

@media (--bp-md) {
  .backdrop {
    display: none;
  }
}
```

---

## 5. States

### Default — desktop

Rail is visible and sticky. Nav links render in `.muted-link` register. The link matching `currentRoute` receives `aria-current="page"`, `color: var(--fg)`, and the 2px `--accent` left border mark.

### Default — mobile, panel closed

Top bar is visible (sticky). Rail and backdrop are hidden. The hamburger button is shown. Page content fills the full viewport width below the top bar.

### Mobile — panel open

The off-canvas rail slides in from the left (`translateX(0)`). The backdrop fades in behind the panel. The hamburger button shows the close (×) icon. Page content is visually overlaid but remains in the DOM (not `inert` — see accessibility note in §8 on focus management).

### No routes

When `routes` is empty or omitted: `<nav>` is not rendered. The rail shows only the Wordmark, optional rail slot, and footer. This is valid for shell surfaces where nav is injected into `children` rather than via the routes prop.

### No footer

When `footer` is not provided: `.rail-footer` is not rendered. The nav fills the rail and the bottom of the rail is empty space. This is unusual for an authenticated shell but is valid — do not render an empty container.

### Disabled / error

Not applicable to shell chrome.

---

## 6. Motion

### Off-canvas panel (mobile)

- **Enter**: `transform: translateX(-100%) → translateX(0)`, `transition-duration: var(--dur-mid)` (240ms), `transition-timing-function: var(--easing)` (expo-out).
- **Exit**: `transform: translateX(0) → translateX(-100%)`, same duration and easing.
- **Backdrop enter**: `opacity: 0 → 1`, `transition-duration: var(--dur-mid)`, `transition-timing-function: var(--easing)`.
- **Backdrop exit**: `opacity: 1 → 0`, same duration and easing.

Both the panel and backdrop transitions must be covered by explicit reduced-motion overrides:

```css
@media (prefers-reduced-motion: reduce) {
  .rail-mobile,
  .backdrop {
    transition: none;
  }
}
```

This ensures instant show/hide with no intermediate frame. The panel and backdrop remain functionally present — only the transition is suppressed, not the open/closed state.

### Nav hover color transition

`transition: color var(--dur-fast) var(--easing)` on `.nav-link`. The global reduced-motion block in `tokens.css` collapses this to instant. No per-component override needed (state transition, not staggered or fill-mode animation).

### Rail entrance

None. The rail is persistent chrome, not an entering element on desktop. No entrance animation.

---

## 7. Accessibility

### Landmarks

- `<aside aria-label={railLabel}>` — `complementary` landmark. The rail is supplementary navigation chrome.
- `<nav aria-label={navLabel}>` — `navigation` landmark, nested inside the `<aside>`. Label defaults to `"Sidebar"` to distinguish it from any `<nav aria-label="Primary">` on the page.
- `<main>` — `main` landmark.

On a page with both a SiteShell `<nav aria-label="Primary">` and a DashboardShell `<nav aria-label="Sidebar">`, screen reader users see two distinct navigation landmarks with distinct labels. The two organisms are not expected to co-exist on the same page (DashboardShell replaces SiteShell for authenticated surfaces), but the landmark labeling is correct regardless.

### Active route

`aria-current="page"` on the `<a>` whose `href` matches `currentRoute`. The DS performs a string equality check (`route.href === currentRoute`). Partial prefix matching is not implemented — the consumer is responsible for passing the exact active `href`. Do not use `aria-selected` (tabs) or `aria-pressed` (toggles).

### Hamburger button

```html
<button
  type="button"
  aria-expanded="{mobileOpen}"
  aria-controls="dashboardshell-rail-panel"
  aria-label="Open navigation"
>
  <!-- hamburger or close SVG depending on state -->
</button>
```

`aria-label` toggles between `"Open navigation"` (closed) and `"Close navigation"` (open). The `aria-expanded` attribute reflects open state. `aria-controls` references the panel `id`. This button is hidden above `--bp-md` via `display: none`.

The `mobileOpenLabel` and `mobileCloseLabel` props (optional strings) expose these accessible names for i18n. Defaults: `"Open navigation"` and `"Close navigation"`.

### Mobile panel focus management

- When the panel opens, focus moves to the first focusable element inside the panel (the Wordmark link or the first nav link). The engineer implements this with a `useEffect` / `ref.current?.focus()` triggered on open.
- When the panel closes (via close button, backdrop click, or Escape), focus returns to the hamburger button.
- Pressing Escape while the panel is open closes the panel and returns focus to the hamburger button.
- Focus does not trap inside the panel. The off-canvas rail is a navigation panel, not a modal dialog. Users can Tab past it to reach the main content without a focus trap. A focus trap would require `Dialog` semantics (`role="dialog"`, `aria-modal`), which is semantically incorrect for a nav panel.
- The backdrop does not receive focus and is not keyboard-operable (it is a click/touch target only). It carries `aria-hidden="true"` and `tabIndex={-1}`.

### Keyboard interaction

All nav items are native `<a>` elements. Tab order follows DOM order: top bar hamburger button → (skip to main ideally) → content. On desktop: Wordmark link → optional rail slot content → nav items (top to bottom) → footer slot content → main content.

No custom keyboard management is needed. The nav is a plain list of native links.

### Contrast

All token pairings used here are already verified in `meta/brand.md` and the SiteShell spec:

- `--fg-muted` on `--surface` (desktop rail background `#F5F5F7`): 4.66:1 — AA normal.
- `--fg` on `--surface`: 15.46:1 — AAA.
- `--fg` on `--bg-elevated` (mobile panel): 16.83:1 — AAA.
- `--accent` focus ring on `--bg` / `--surface`: non-text UI element (focus ring); satisfies WCAG 1.4.11.
- Backdrop `rgba(0,0,0,0.4)` over page content: decorative overlay; no text on the backdrop itself.

---

## 8. Inline SVG icons

Two icons are rendered as inline SVG. They are not exported as separate atoms and are not sourced from `lucide-react`. The engineer pastes these paths directly into JSX. Both use `currentColor` to inherit the button's color.

### Hamburger (20×20 viewBox)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
     fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
     aria-hidden="true" focusable="false">
  <line x1="3" y1="5"  x2="17" y2="5"  />
  <line x1="3" y1="10" x2="17" y2="10" />
  <line x1="3" y1="15" x2="17" y2="15" />
</svg>
```

### Close / × (20×20 viewBox)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
     fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
     aria-hidden="true" focusable="false">
  <line x1="5" y1="5"  x2="15" y2="15" />
  <line x1="15" y1="5" x2="5"  y2="15" />
</svg>
```

Both carry `aria-hidden="true"` and `focusable="false"`. The surrounding button carries the accessible name.

---

## 9. Prop intent

### `DashboardShellRoute`

```typescript
interface DashboardShellRoute {
  href: string; // required — all nav items are direct route links, no group labels
  label: ReactNode; // visible nav text
  icon?: ReactNode; // optional icon slot — accepts any ReactNode (lucide-react icon, custom SVG)
}
```

All DashboardShell nav items are direct links (`href` required). There are no group labels or parent-only items. Nesting is out of scope for this version (see §11).

The optional `icon` slot sits to the left of the label text inside the nav link. When provided, it renders inside a small container that preserves icon alignment across items with and without icons. The icon inherits `currentColor` from the link.

### `DashboardShellProps`

Prop intent (the engineer designs the actual TypeScript API):

- Consumers must be able to pass an array of route objects (`routes`) that renders as the vertical nav list.
- Consumers must be able to pass `currentRoute?: string` to mark the active nav item. The DS performs strict equality matching against each route's `href`.
- Consumers must be able to configure the home link target via `homeHref?: string`. Default: `"/"`.
- Consumers must be able to pass a `rail?: ReactNode` slot rendered between the Wordmark and the `<nav>`. Intended for workspace selectors, environment badges, account switchers. Optional — omitting it renders the Wordmark directly above the nav.
- Consumers must be able to pass a `footer?: ReactNode` slot rendered at the bottom of the rail. Canonical usage: identity row (avatar + name) + server-action sign-out `<form>`. Optional — omitting it suppresses the footer slot entirely (no empty container).
- Consumers must be able to pass `navLabel?: string` for the `<nav aria-label>`. Default: `"Sidebar"`.
- Consumers must be able to pass `railLabel?: string` for the `<aside aria-label>`. Default: `"Navigation"`.
- Consumers must be able to pass `mobileOpenLabel?: string` and `mobileCloseLabel?: string` for the hamburger button accessible name toggle. Defaults: `"Open navigation"` / `"Close navigation"`. These exist for i18n.
- The `children` slot fills `<main>`. Required.
- The component spreads remaining HTML attributes onto the root `<div>`.

### Prop intent notes

- Consumers must be able to inject any ReactNode into the `footer` slot without DashboardShell imposing any layout constraint on the slot's contents beyond the `padding: var(--space-4)` container. A server-action `<form>` with a submit button, a `<div>` with an Avatar + name row, or any combination passes through cleanly.
- Consumers must be able to inject icons into nav items via `route.icon`. The DS aligns icon + label text but does not enforce icon size — that is the consumer's responsibility. Using `--icon-sm` (16px) is the recommended size for rail nav icons, as it pairs with `--fs-meta` (14px) text.
- The mobile panel is built-in. It is not a `Sheet` or `Dialog` organism import. It is a positionally-placed element managed by local open/close state inside DashboardShell. This keeps DashboardShell self-contained.

---

## 10. Composition rules

- DashboardShell is the outermost layout wrapper for authenticated surfaces. One per page. It replaces SiteShell entirely on these surfaces — the two organisms do not co-exist.
- `<main>` content (`children`) is unrestricted. Consumers compose their page layout inside `children` using DS molecules and organisms (data tables, form layouts, stat grids, etc.).
- The `footer` slot does not receive any DS-managed children. The canonical composition is an Avatar atom + a name string + a Button or form element. The DS does not ship a pre-composed identity row — consumers assemble from DS primitives.
- The `rail` slot is fully free-form. No DS atom is prescribed. Typical usage: a `<select>` styled as a workspace switcher, or a `<StatusBadge>` indicating environment.
- DashboardShell introduces no new Radix dependencies. No Radix import is required — the mobile panel is managed with local state and CSS transforms, not a Radix primitive. This is consistent with SiteShell's mobile panel approach.
- Icon slots in nav items accept any `ReactNode`. The recommended source is `lucide-react` (already a peer dep), but no specific icon is mandated by the DS.

---

## 11. Out of scope

- **Nested nav groups.** The rail nav is a flat list in this version. Collapsible groups, second-level flyouts, and group headings are deferred. The route shape (`href` required, no `items` array) reflects this constraint.
- **Rail width as a prop.** The 14rem width is fixed. A `railWidth` prop or resize handle is deferred.
- **Mini rail / icon-only collapsed state.** A compact `isCollapsed` mode (icon-only rail, tooltip labels) is deferred. It would require separate icon assets for every nav item and a significantly more complex layout contract.
- **Multiple rails.** A right-hand context rail or a secondary left rail is deferred.
- **Sticky rail scroll with overflow.** When the nav list overflows the rail height, it scrolls within the sticky rail (`overflow-y: auto` on `.rail`). A separate scrollable nav list with a pinned Wordmark header within the rail is deferred.
- **Skip-to-main link.** A `<a href="#main-content">Skip to main content</a>` link is a tracked accessibility gap (carried from SiteShell). Not addressed in this version — it is a meaningful addition that should be addressed across both organisms in a dedicated a11y pass.
- **`renderLink` / `asChild` escape hatch.** Framework router consumers intercept at the application level. An `asChild` prop on nav items is deferred.
- **Breadcrumb or page title area.** A top region inside `<main>` for page title, breadcrumb, and primary actions is not part of DashboardShell. Consumers compose that region inside `children`.
- **Theme / dark-mode toggle control.** This is consumer-supplied content, typically via the `footer` slot. DashboardShell does not provide a built-in toggle.

---

## 12. Usage example

```jsx
import { DashboardShell, Avatar, Button } from "@poukai-inc/ui";
import { LayoutDashboard, Users, Settings, FileText } from "lucide-react";

<DashboardShell
  currentRoute="/dashboard/jobs"
  routes={[
    { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={16} /> },
    { href: "/dashboard/jobs", label: "Jobs", icon: <FileText size={16} /> },
    { href: "/dashboard/team", label: "Team", icon: <Users size={16} /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings size={16} /> },
  ]}
  rail={
    <div style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>Acme Corp workspace</div>
  }
  footer={
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
      <Avatar src={user.avatarUrl} name={user.name} size="sm" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "var(--fs-meta)", color: "var(--fg)", fontWeight: 500 }}>
          {user.name}
        </div>
      </div>
      <form action={signOutAction}>
        <Button type="submit" variant="ghost" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  }
>
  <h1>Jobs</h1>
  {/* page content */}
</DashboardShell>;
```

- `/dashboard/jobs` matches `currentRoute` → that nav item receives `aria-current="page"` and the `--accent` left border mark.
- The `rail` slot renders a workspace label above the nav.
- The `footer` slot renders an identity row with an Avatar and a server-action sign-out form. DashboardShell places it at the bottom of the rail and provides the hairline separator. The consumer controls the contents.
- Icon size `size={16}` matches `--icon-sm` (16px), which pairs with `--fs-meta` (14px) nav link text.

---

## 13. Z-index resolution

`src/tokens/tokens.css` contains no z-index tokens. Z-index in this DS is a **documented raw-value exception** — see SiteShell spec §13 and `src/atoms/DropdownMenu/DropdownMenu.module.css`. The informal scale in use:

| Layer                          | Raw value |
| ------------------------------ | --------- |
| DropdownMenu content           | 50        |
| Sticky nav / Header / Top bar  | 100       |
| Dialog overlay / Sheet / Panel | 101       |
| Toast                          | 200       |
| SkipLink / Tooltip             | 9999      |

**DashboardShell values:**

- Mobile top bar: `z-index: 100` — same layer as sticky headers. It is a sticky positional bar; it belongs on this layer.
- Backdrop: `z-index: 100` — same layer as the top bar. The backdrop sits between page content and the panel but on the same layer as the top bar (the top bar is behind the panel).
- Off-canvas rail panel: `z-index: 101` — one above the backdrop and top bar. The panel must render in front of both.

The backdrop and top bar share `z-index: 100`. On mobile the top bar is `position: sticky` and the backdrop is `position: fixed`. The backdrop covers the top bar because `position: fixed` and `position: sticky` elements on the same stacking layer are painted in DOM order — the backdrop is rendered after the top bar in DOM order and visually overlaps it. This is correct behavior: the backdrop should cover the full screen including the top bar when the panel is open.

The engineer documents these values with a comment in `DashboardShell.module.css` referencing this informal scale, consistent with the SiteShell precedent.

---

## 14. Changelog

- **2026-06-02 (initial)**: Authored for GitHub issue #406 (`poukai-inc/poukai-admin`). New organism — does not extend or modify SiteShell. Status: Approved. Rail width `14rem` documented as non-tokenised exception. No new tokens introduced.
