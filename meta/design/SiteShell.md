# Design spec: SiteShell

**Atomic layer**: organism
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-06-01

---

## 1. Purpose

`<SiteShell>` is the canonical page-chrome organism for pouk.ai surfaces. It owns the full-page layout: a top header (wordmark link + primary nav + optional end slot), a `<main>` content slot, and a hairline-ruled footer slot.

This revision (issue #391) extends the existing marketing shell with four additive capabilities — sticky header, nested dropdown nav items, mobile hamburger menu, and a right-side end slot for consumer-supplied controls (avatar, sign-out, etc.) — while preserving full backwards compatibility with all existing usage. The existing flat `routes` + `footer` marketing pattern continues to render identically when no new props are provided.

### Non-goals

- **No router awareness.** SiteShell emits plain `<a href>` for all navigation links. Framework router consumers handle link interception at the application level. This is non-negotiable; it keeps the DS framework-agnostic.
- **No auth or session logic.** SiteShell does not know whether a user is logged in. The consumer passes different `routes` and `end` content for authenticated vs. unauthenticated states. SiteShell is purely compositional with respect to auth.
- **No density variant for app-shell mode.** The header height and spacing are unchanged for the app-shell usage pattern. A density prop is explicitly deferred — the existing spacing works for both contexts and adding it now would be premature.
- SiteShell does not manage page scroll, anchor behavior, or scroll restoration.
- SiteShell does not own Footer content layout; the `footer` slot is a pass-through.

---

## 2. Anatomy

### Desktop (≥ `--bp-md`, 768px)

```
┌─────────────────────────────────────────────────────┐
│ [header] (sticky when sticky=true)                  │
│  [brand link / Wordmark]  [nav]  ···  [end slot]    │
│   item  item  item▾  More▾                          │
├─────────────────────────────────────────────────────┤
│ [main]                                              │
│   {children}                                        │
├─────────────────────────────────────────────────────┤
│ [footer]  (hairline rule above)                     │
└─────────────────────────────────────────────────────┘
```

- **Root element**: `<div>` — full-height flex column, `--bg`, `--fg`. Same as today.
- **Header**: `<header>` — flex row, `space-between`, `--page-pad` horizontal padding, `--space-4` vertical padding (reduced from `--space-6` to keep the bar compact when dropdowns + end slot are present). When `sticky` is true: `position: sticky; top: 0` with a z-index (see §8 stop-and-ask), a hairline rule on `border-bottom`, and `background: var(--bg)`. No backdrop-blur or JS-on-scroll behavior — a static hairline rule is sufficient for the brand register. The marketing shell (no `sticky`) retains its existing header padding of `--space-6` block to preserve exact rendering.
- **Brand link**: `<a href={homeHref}>` wrapping `<Wordmark height={56} />`. Unchanged.
- **Nav**: `<nav aria-label={navLabel}>` containing a `<ul>`. Rendered only when `routes.length > 0`. On desktop, items render as a horizontal flex row with `gap: --space-6`. Flat items render as plain `<a>` links (unchanged). Items with `items` children render as a `DropdownMenu.Root` wrapping a `<button>` trigger and a `DropdownMenu.Content` panel.
- **End slot**: optional `ReactNode` positioned at the trailing (right) edge of the header flex row via `margin-inline-start: auto` on a `<div className={styles.end}>` wrapper. Sits to the right of the nav. When `end` is absent, the header layout is identical to today (`justify-content: space-between` between brand and nav).
- **Mobile hamburger button**: rendered below `--bp-md` in place of the nav list and end slot. Icon-only `<button>` with inline SVG hamburger (three horizontal strokes). `aria-expanded` + accessible name. Opens the mobile nav panel.
- **Mobile nav panel**: a `<div>` rendered as a full-width column below the header (not a portal, not a side drawer) that slides in vertically — `transform: translateY(-100%)` hidden → `translateY(0)` open — `position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-elevated)`. Contains the full route list in stacked layout, plus the `end` slot content below a hairline separator. Closed by clicking outside, pressing Escape, or clicking the close (×) button that replaces the hamburger icon when open.
- **Main**: `<main>` — `flex: 1 1 auto`, centered at `--content-max`, `--page-pad` horizontal padding. Unchanged.
- **Footer**: `<footer>` — hairline rule above, `--fg-muted`, `--fs-meta`. Unchanged.

---

## 3. Tokens used

All existing tokens retained. No new tokens added. The one gap is z-index (see §8).

| Token           | Role                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------- |
| `--bg`          | Root background; mobile panel background fallback                                           |
| `--bg-elevated` | Mobile nav panel background (front-most layer)                                              |
| `--fg`          | Root text; brand link; active nav link                                                      |
| `--fg-muted`    | Resting nav links; footer text                                                              |
| `--hairline`    | Footer border-top; header `border-bottom` when sticky                                       |
| `--hairline-w`  | Border widths                                                                               |
| `--accent`      | Focus rings                                                                                 |
| `--radius-1`    | Focus ring border-radius                                                                    |
| `--font-sans`   | Nav link font-family                                                                        |
| `--fs-meta`     | Nav link font-size; footer font-size                                                        |
| `--dur-fast`    | Nav hover color transition                                                                  |
| `--dur-mid`     | Mobile panel slide transition (`transform`)                                                 |
| `--easing`      | Mobile panel slide easing (expo-out)                                                        |
| `--space-4`     | Header block padding when sticky prop is used (compact bar)                                 |
| `--space-6`     | Header block padding (non-sticky, existing value); nav item gap; header inline gap          |
| `--space-8`     | Footer padding block; mobile panel item vertical padding                                    |
| `--space-12`    | Main content top padding                                                                    |
| `--space-24`    | Main content bottom padding                                                                 |
| `--page-pad`    | Horizontal padding throughout                                                               |
| `--content-max` | Main content max-width                                                                      |
| `--bp-md`       | Mobile/desktop breakpoint — `@media (--bp-md)` / `@custom-media --bp-md (min-width: 768px)` |

### `.muted-link` global utility

Nav links retain the `.muted-link` global class. No change.

---

## 4. Layout and rhythm

### Header — non-sticky (default)

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-6) var(--page-pad);
}
```

Identical to today. Existing marketing usage unchanged.

### Header — sticky

When `sticky={true}`:

```css
.header--sticky {
  position: sticky;
  top: 0;
  /* z-index: see §8 — stop-and-ask before implementing */
  border-bottom: var(--hairline-w) solid var(--hairline);
  background: var(--bg);
  padding-block: var(--space-4); /* compact: 16px top/bottom instead of 24px */
}
```

The hairline `border-bottom` provides visual separation from page content as it scrolls behind the bar. No backdrop-filter, no JS scroll listener — the border is always present when `sticky` is true, not conditionally on scroll. This is deliberate: adding scroll-detection JS for a CSS-only affordance is not worth the complexity at this register. Arian may override if a "show border only on scroll" behavior is later requested; that becomes a JS-managed `data-scrolled` attribute on the root, not a new prop in this revision.

### Nav — desktop

```css
.nav-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-6);
  list-style: none;
  margin: 0;
  padding: 0;
}
```

Flat items: identical to today. Items with children: the `<li>` contains a `DropdownMenu.Root` instead of a plain `<a>`. The trigger button uses the same `.nav-link` + `.muted-link` styles as flat items, with a trailing chevron SVG (inline, see §6). The dropdown content panel aligns `start` to the trigger.

### End slot

```css
.end {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-inline-start: auto;
}
```

`margin-inline-start: auto` pushes the end slot to the right edge of the flex row, regardless of how many nav items exist. When `end` is absent, the wrapper is not rendered; existing `justify-content: space-between` between brand and nav is preserved unchanged.

### Mobile panel

```css
.mobile-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-elevated);
  border-bottom: var(--hairline-w) solid var(--hairline);
  padding: var(--space-6) var(--page-pad) var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  /* z-index: same as header — see §8 */
  transform: translateY(-8px);
  opacity: 0;
  /* open state: transform: translateY(0); opacity: 1 */
  transition:
    transform var(--dur-mid) var(--easing),
    opacity var(--dur-mid) var(--easing);
}
```

The panel sits directly below the header (`top: 100%` relative to `position: relative` on `.root`). It is not a portal — it renders in DOM order. When open, it overlaps page content visually (via z-index, see §8 stop-and-ask). On mobile, nested dropdown items expand inline — there is no second-level floating panel on mobile. Parent items with `items` children render as a disclosure group: the parent label is a plain `<button>` that toggles visibility of its children stacked below it. This keeps the mobile nav purely CSS-transition-driven with no Radix dependency on mobile.

---

## 5. States

### Default (non-sticky, flat routes, no end slot)

Renders identically to the existing implementation. No behaviour change.

### Sticky

Header is `position: sticky; top: 0` with a hairline `border-bottom` and compact block padding (`--space-4`). Page content scrolls behind it.

### With `end` slot

End slot rendered at right edge of header. On desktop it sits in the header flex row after the nav. On mobile it appears at the bottom of the mobile panel, separated by a hairline rule.

### With dropdown nav items

Top-level items that have `items` children render as `DropdownMenu.Root` on desktop. The trigger button shows a chevron-down SVG (inline). On open: `aria-expanded="true"` on the trigger, the `DropdownMenu.Content` panel mounts below via Radix portal. On close: focus returns to trigger. Escape closes the open dropdown (Radix default).

### Mobile — closed

Below `--bp-md`: the nav list and end slot are hidden (`display: none` on `.nav` and `.end`). The hamburger button is shown (`display: flex`).

### Mobile — open

The mobile panel slides into view (`translateY(0)`, `opacity: 1`). The hamburger button shows the close (×) SVG. Nav items render in stacked layout. Parent items with children render as inline disclosure groups (no Radix dropdown on mobile). The end slot content renders at the bottom of the panel above `--space-8` padding.

### No routes (chrome-less)

When `routes` is empty or omitted: no `<nav>`, no hamburger button, no mobile panel. Header contains only brand link and optional end slot. Identical to current chrome-less pattern.

### Disabled / error

Not applicable to shell chrome.

---

## 6. Inline SVG icons

No lucide-react. Three icons are rendered as inline SVG within the component. They are not exported as separate atoms. The engineer inline-pastes these paths directly into JSX.

### Hamburger (three horizontal strokes, 20×20 viewBox)

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

### Chevron-down (12×12 viewBox, for dropdown triggers)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
     fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
     stroke-linejoin="round" aria-hidden="true" focusable="false">
  <polyline points="2,4 6,8 10,4" />
</svg>
```

All three use `currentColor` so they inherit the link color in their parent context. All carry `aria-hidden="true"` and `focusable="false"` — they are decorative; the surrounding button or link carries the accessible name.

---

## 7. Motion

### Mobile panel

- **Enter**: `transform: translateY(-8px) → translateY(0)`, `opacity: 0 → 1`, `transition-duration: var(--dur-mid)` (240ms), `transition-timing-function: var(--easing)` (expo-out).
- **Exit**: reverse — `translateY(0) → translateY(-8px)`, `opacity: 1 → 0`, same duration and easing.
- **Reduced-motion**: per-component `animation: none` override is not needed here since this uses `transition`, not `@keyframes`. However the component must include an explicit override for the panel transition:

```css
@media (prefers-reduced-motion: reduce) {
  .mobile-panel {
    transition: none;
  }
}
```

This ensures instant show/hide. The panel remains functionally present — it is not hidden, only its transition is suppressed.

### Nav hover / active color transitions

`transition: color var(--dur-fast) var(--easing)` via `.muted-link`. Global reduced-motion block collapses this to instant. No per-component override needed (state transition, not staggered/fill-mode animation).

### Dropdown open/close

Radix DropdownMenu renders its own enter/exit animation via the `data-state` attribute. The engineer applies the standard DS content panel animation to `DropdownMenu.Content` via the existing `.content` CSS class in `DropdownMenu.module.css` — consistent with the rest of the dropdown system. No new motion spec needed here.

### Chevron rotation (dropdown trigger)

When a dropdown is open (`data-state="open"` on the trigger), the chevron rotates 180°: `transform: rotate(180deg)`, `transition: transform var(--dur-fast) var(--easing)`. This is the only transform on a nav element. Reduced-motion: covered by the global block (state transition).

---

## 8. Accessibility

### Landmarks

- `<header>` → `banner` landmark. One per page.
- `<nav aria-label={navLabel}>` → `navigation` landmark. Only when `routes.length > 0`. Default label `"Primary"`.
- `<main>` → `main` landmark.
- `<footer>` → `contentinfo` landmark. Only when `footer` is provided.

### Active route

`aria-current="page"` on the active flat nav link. Unchanged. For parent items that are purely group labels (no `href`, with `items` children), `aria-current` is not set on the trigger — the active state is conveyed by the active child item inside the dropdown content.

### Hamburger button

```html
<button
  type="button"
  aria-expanded={mobileOpen}
  aria-controls="siteshell-mobile-panel"
  aria-label="Open navigation"  <!-- when closed -->
  <!-- aria-label="Close navigation" when open — engineer manages this toggle -->
  class="..."
>
  {mobileOpen ? closeIcon : hamburgerIcon}
</button>
```

The `aria-label` is toggled between `"Open navigation"` and `"Close navigation"` based on state. The `aria-expanded` attribute is `true` when the panel is open. `aria-controls` references the panel `id`. The button is visible only below `--bp-md`.

### Mobile panel focus management

- When the panel opens, focus moves to the first focusable element inside the panel (the first nav link or parent group button). The engineer implements this with a `useEffect` / `ref.current?.focus()` call triggered on open.
- When the panel closes (via Escape, outside click, or close button), focus returns to the hamburger button. Radix does not manage this — the engineer manages it explicitly via a ref to the hamburger button.
- Escape key closes the panel and returns focus to the hamburger button.
- Focus does not trap inside the panel — the mobile panel is not a modal dialog. Users can Tab past the panel to reach the main content. A focus trap would require `Dialog` semantics, which is a heavier contract than a nav panel warrants.

### Dropdown keyboard interaction

Handled by Radix `@radix-ui/react-dropdown-menu`:

- `Enter` / `Space` on trigger opens the menu.
- `ArrowDown` / `ArrowUp` moves focus between items.
- `Escape` closes the menu and returns focus to trigger.
- `Home` / `End` jump to first/last item.
- Tab closes the menu (Radix default for non-modal usage with `modal={false}` — nav dropdowns should use `modal={false}` to allow Tab to continue past the menu without closing the whole nav).

The engineer passes `modal={false}` to `DropdownMenu.Root` for nav items to preserve natural tab order in the nav bar.

### Contrast

All new elements use existing token pairings already verified in the current spec. The hamburger button trigger inherits `--fg-muted` at rest / `--fg` on hover — the same pairing as nav links (4.91:1 / 16.29:1 against `--bg`). The mobile panel background is `--bg-elevated` (`#FFFFFF` / dark: `#1C1C1E`) — `--fg` text on `--bg-elevated` is 16.83:1 (AAA) in light mode.

---

## 9. Prop intent

### Extended `SiteShellRoute`

```typescript
interface SiteShellRoute {
  href?: string; // optional — parent group items have no href
  label: ReactNode; // visible nav label
  items?: SiteShellRoute[]; // children → renders as dropdown on desktop,
  // inline disclosure on mobile
}
```

`href` is now optional. A route with no `href` and a non-empty `items` array is a group label — it renders as a `<button>` trigger on desktop and an inline disclosure on mobile. A route with a `href` and a non-empty `items` array is both a link and a group; the engineer renders the link text and the chevron-trigger as a split control (link goes to `href`; chevron opens the dropdown). The simpler — and recommended — pattern is `href`-less group labels; the split link+dropdown pattern is supported but the consumer is responsible for the UX implication.

The "More" dropdown is expressed as a standard route with no `href` and `label="More"` (or any label the consumer chooses). There is no dedicated `overflow` prop or `more` flag. The route shape is sufficient — the DS does not need to know which item is semantically "More."

### Extended `SiteShellProps`

```typescript
interface SiteShellProps extends ComponentPropsWithoutRef<"div"> {
  currentRoute?: string;
  routes?: SiteShellRoute[];
  footer?: ReactNode;
  homeHref?: string;
  navLabel?: string;
  /**
   * Makes the header sticky (position: sticky; top: 0).
   * Adds a hairline border-bottom and reduces block padding to --space-4.
   * Default false — non-sticky preserves current marketing shell behavior exactly.
   */
  sticky?: boolean;
  /**
   * Slot for consumer-supplied controls at the right edge of the header.
   * Typical content: Avatar + sign-out button, theme toggle, notification bell.
   * SiteShell does not own auth state — the consumer decides what renders here
   * based on its own session logic.
   */
  end?: ReactNode;
  children: ReactNode;
}
```

All new props are optional with defaults that reproduce current behavior. `sticky` defaults to `false`. `end` defaults to `undefined` (not rendered).

### Prop intent notes

- Consumers must be able to pass a `sticky` boolean that makes the header bar stick to the viewport top as the page scrolls.
- Consumers must be able to place any ReactNode in the `end` slot — an Avatar + sign-out group, a Button, an IconButton, or a custom control. SiteShell provides the layout container; the consumer owns the contents.
- Consumers must be able to define nested nav items by passing `items` on a route. Nesting beyond one level (grandchildren) is not supported in this revision.
- The mobile panel must be accessible and keyboard-navigable without requiring any consumer configuration beyond passing routes.
- The `mobileMenuLabel` and `mobileCloseLabel` props (accessible names for the hamburger and close buttons) should be exposed as optional strings with defaults `"Open navigation"` and `"Close navigation"` to support i18n.

---

## 10. Composition rules

- SiteShell is the outermost layout wrapper. One per page.
- The `end` slot accepts any ReactNode. The canonical app-shell usage is an Avatar atom + a ghost Button ("Sign out"). The DS does not ship a pre-composed auth control — consumers assemble from DS primitives.
- Dropdown nav items use `DropdownMenu` from `@poukai-inc/ui/atoms/DropdownMenu` — the existing Radix-backed atom. SiteShell imports it directly. No new organism dependency is introduced.
- The mobile panel is a built-in panel — not `Dialog`, not `Sheet`, not any existing overlay organism. It is a positionally-placed `<div>` managed by local open/close state inside SiteShell. This keeps SiteShell self-contained and avoids portal coupling to overlay organisms.
- `<Hero>`, `<Section>`, and other content molecules live inside `children` → `<main>`. They have no interaction with the new header additions.

---

## 11. Out of scope

- **Nesting beyond one level.** Grandchild dropdown items are not supported in this revision. A route's `items` array is the maximum depth.
- **Split link+dropdown active state.** `aria-current` on a parent route that has both `href` and `items` is deferred — the engineer marks `aria-current` on the matching child item instead.
- **Skip-to-main link.** This remains a tracked gap from the original spec. Not addressed in this revision.
- **`renderLink` / `asChild` escape hatch on the wordmark or nav links.** Still deferred. Framework router consumers intercept at the application level.
- **Backdrop-blur or scroll-detected sticky border.** The sticky border is always-present when `sticky={true}`. JS-on-scroll behavior is explicitly out of scope.
- **Multi-column or mega-menu dropdown panels.** `DropdownMenu.Content` renders a standard vertical item list. Complex layout inside the dropdown is the consumer's responsibility via item composition.
- **Dark-mode sticky backdrop.** `background: var(--bg)` already resolves to the dark-mode `--bg` value (`#000000`) via the existing `@media (prefers-color-scheme: dark)` block in `tokens.css`. No additional work needed.
- **`homeHref` as a framework `<Link>`.** Still deferred.

---

## 12. Usage examples

### (a) Marketing shell — unchanged pattern

Existing usage. No new props. Renders identically.

```jsx
import { SiteShell, Footer } from "@poukai-inc/ui";

<SiteShell
  currentRoute="/why-ai"
  routes={[
    { href: "/why-ai", label: "Why AI" },
    { href: "/roles", label: "Roles" },
    { href: "/principles", label: "Principles" },
  ]}
  footer={<Footer copyright="© Pouk AI INC 2026" email="hello@pouk.ai" />}
>
  {pageContent}
</SiteShell>;
```

The `/why-ai` item has `aria-current="page"`. No hamburger — the consumer decides whether to add `sticky`. Mobile nav wraps at narrow viewports via `flex-wrap: wrap` (legacy behavior) until this component is updated; once the new implementation ships, it collapses to a hamburger below `--bp-md`.

### (b) App shell — logged-in, sticky, end slot, nested "More" group

```jsx
import { SiteShell, Avatar, Button } from "@poukai-inc/ui";

<SiteShell
  sticky
  currentRoute="/dashboard"
  routes={[
    { href: "/dashboard", label: "Dashboard" },
    { href: "/posts", label: "Posts" },
    { href: "/analytics", label: "Analytics" },
    {
      label: "More",
      items: [
        { href: "/settings", label: "Settings" },
        { href: "/integrations", label: "Integrations" },
        { href: "/billing", label: "Billing" },
      ],
    },
  ]}
  end={
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
      <Avatar src={user.avatarUrl} name={user.name} size="sm" />
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  }
>
  {appContent}
</SiteShell>;
```

- `sticky` makes the header stick and adds the hairline border-bottom.
- `"More"` is a route with no `href` and an `items` array — renders as a dropdown trigger on desktop, inline disclosure on mobile.
- `end` is the consumer-assembled auth control. SiteShell places it at the right edge of the header; the consumer controls the contents.
- `routes` and `end` are different when the user is logged out — the consumer passes a "Sign in" Button in `end` and omits app-specific routes. SiteShell requires no auth prop.

---

## 13. Z-index resolution

`src/tokens/tokens.css` contains no z-index tokens. Z-index in this DS is a **documented raw-value exception** — see the comment in `src/atoms/DropdownMenu/DropdownMenu.module.css`. An informal scale is already in use:

| Layer                  | Raw value |
| ---------------------- | --------- |
| DropdownMenu content   | 50        |
| Sticky nav / Header    | 100       |
| Dialog overlay / Sheet | 101       |
| Toast                  | 200       |
| SkipLink / Tooltip     | 9999      |

**Resolution (Arian-approved 2026-06-01):** The sticky SiteShell header uses raw `z-index: 100`, matching `src/organisms/Header/Header.module.css` precedent. The mobile panel uses the same value (`z-index: 100`) to sit on the same layer as the header. No `--z-nav` token is added. The raw value is documented with a comment in `SiteShell.module.css` citing the informal scale.

This is consistent with the DS's position that z-index is too context-dependent to tokenise at a component level; the informal scale serves as the coordination mechanism.

---

## 14. Changelog

- **2026-06-01 (this revision)**: Extended for issue #391. Added `sticky` prop, `end` slot, nested `SiteShellRoute.items`, mobile hamburger panel, inline SVG icons, dropdown chevron. All changes additive; no breaking changes to existing prop surface. Added stop-and-ask for `--z-nav` token. Auth-aware usage documented as purely compositional — no auth prop added. Original marketing usage examples preserved.
- **2026-05-19 (original)**: Shipped in v0.1.0. Wordmark height `28px → 56px` in v0.2.3. `--bp-md` custom media token added in v0.17.0 (no SiteShell changes required).
