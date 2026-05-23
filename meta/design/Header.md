# Header

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`<Header>` is the standalone nav-bar organism for pouk.ai surfaces that need a top navigation row outside of, or instead of, the full `SiteShell` layout wrapper. It lifts the header band out of `SiteShell` so it can compose with non-marketing shells — docs layouts, app surfaces, and any surface that manages its own page chrome without the full-height flex column `SiteShell` provides. It owns the horizontal band containing a brand/logo slot on the left, a primary nav slot in the center, and an optional actions slot on the right. Sticky-on-scroll behavior and mobile-menu trigger are additive variants on the base organism.

## 2. Anatomy

```
<header aria-label="Primary">
  ├── Header.Brand  — <a href={homeHref}> wrapping <Wordmark> (or custom logo slot)
  ├── Header.Nav    — <nav aria-label="Primary"> containing NavLink children
  └── Header.Actions — optional slot for Button(s), IconButton(s), or any ReactNode
```

- **Root**: semantic `<header>` element — carries the `banner` landmark implicitly. One per page.
- **Header.Brand**: `<a>` wrapping the `<Wordmark>` (default) or a consumer-supplied logo node. Suppresses the global two-layer animated underline (`background-image: none`). Focus ring: `2px solid var(--accent)` at `4px` offset, `border-radius: var(--radius-1)`.
- **Header.Nav**: `<nav aria-label="Primary">` containing an `<ul>` of `<li><NavLink>` items. Only rendered when children are present.
- **Header.Actions**: optional trailing slot — no wrapper element opinion; renders children directly inside a flex container. Omitted when no children passed.
- **Layout**: `display: flex; align-items: center; justify-content: space-between; gap: var(--space-6); padding: var(--space-6) var(--page-pad)`. Background: `var(--bg)`. Color: `var(--fg)`.

## 3. Tokens

- `--bg` — band background
- `--fg` — brand link color; active nav link color
- `--fg-muted` — nav links at rest (via `.muted-link`)
- `--hairline` — bottom border on `bordered` variant and sticky-scrolled state
- `--hairline-w` — border width (`1px`)
- `--accent` — focus ring color
- `--radius-1` — focus ring border-radius (`2px`)
- `--font-sans` — all text in the band
- `--fs-meta` — nav link font-size (`14px`)
- `--dur-fast` — nav link hover color transition (via `.muted-link`)
- `--dur-mid` — sticky-state border/shadow transition
- `--space-6` — header block padding; gap between brand, nav, actions
- `--page-pad` — horizontal gutter (`clamp(1.5rem, 2vw + 1rem, 3rem)`)
- `--content-max` — optional max-width constraint when `constrained` prop is set

## 4. Variants / Props

```
// INTENT ONLY — engineer designs the actual API
interface HeaderProps {
  homeHref?: string;        // default "/" — href for the brand link
  logo?: ReactNode;         // overrides <Wordmark> in the brand slot
  navLabel?: string;        // aria-label for <nav>; default "Primary"
  sticky?: boolean;         // default false — position: sticky; top: 0; z-index layering
  bordered?: boolean;       // default false — adds 1px hairline bottom border at rest
  constrained?: boolean;    // default false — caps band content at --content-max
  children?: ReactNode;     // slot for Header.Nav, Header.Actions compound parts
}
```

- `homeHref` default `"/"` — plain `href`, no router awareness (same contract as `SiteShell`).
- `logo` — when provided, replaces `<Wordmark height={56} />` in the brand slot. Accepts any `ReactNode`. When absent, `<Wordmark>` renders at the SiteShell-established `56px` height.
- `sticky` default `false` — when true: `position: sticky; top: 0`. On scroll (via `IntersectionObserver` sentinel or `scrollY > 0`), adds `border-bottom: var(--hairline-w) solid var(--hairline)` and a subtle backdrop blur or `--bg` fill to preserve legibility over page content. Transition: `border-color var(--dur-mid)`.
- `bordered` default `false` — always-on bottom hairline; complements the `sticky` scrolled state for surfaces that want a persistent visual boundary.
- `constrained` default `false` — wraps interior content in a `max-width: var(--content-max); margin-inline: auto` container so the band's visual content aligns with a centered page column.

## 5. Interaction

- **Tab order**: brand link → NavLink items (DOM order) → Header.Actions children. Standard native tab order; no custom management.
- **Brand link**: keyboard-activatable via Enter (standard anchor). No hover state on the wordmark itself.
- **NavLink items**: hover → `color: var(--fg)` (via `.muted-link`); active/current → `aria-current="page"` set on the matching item, full `--fg` color.
- **Actions slot**: each child manages its own interaction (Button, IconButton, etc.).
- **Sticky on scroll**: when `sticky` is true, `position: sticky; top: 0`. The scroll sentinel fires at `scrollY > 0` to add the hairline border transition.
- **Mobile menu trigger**: when a mobile-menu is needed, consumers place an `IconButton` (hamburger) in `Header.Actions`. The off-canvas panel (Sheet/Drawer) is a separate organism not owned by Header.

## 6. A11y

- Root `<header>` carries the implicit `banner` landmark. One per page.
- `<nav aria-label={navLabel}>` (default `"Primary"`) distinguishes this nav landmark from any footer or sidebar nav on the same page. When no `Header.Nav` children are present, no `<nav>` element is emitted.
- Brand link: `aria-label="Poukai — home"` on the `<a>` wrapping the Wordmark (same contract as `SiteShell`). Overridable via the standard HTML spread.
- Active NavLink: `aria-current="page"` on the matched item.
- Focus ring: `outline: 2px solid var(--accent); outline-offset: 4px; border-radius: var(--radius-1)` — explicit on the brand link; NavLink and Button/IconButton each carry their own focus rules.
- Contrast: `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.91:1 (AA normal). `--fg` on `--bg` = 16.29:1 (AAA). `--accent` focus ring = 4.54:1 (WCAG 1.4.11 non-text ✓).
- Skip-to-main link is not owned by `Header` — same known gap as `SiteShell`. Consumers add a visually-hidden `<a href="#main-content">Skip to main content</a>` before the Header in the page tree.

## 7. Motion

- Nav link hover: `transition: color var(--dur-fast)` via `.muted-link` (inherited from `tokens.css` global).
- Sticky border appearance on scroll: `transition: border-color var(--dur-mid)`.
- No entrance animation — Header is page chrome, present on load.
- `@media (prefers-reduced-motion: reduce)` in `tokens.css` clamps all transition durations globally; no per-component override needed.

## 8. Anti-patterns

- Do not use `Header` inside `SiteShell`. `SiteShell` already owns its header band. `Header` is for shells that do not use `SiteShell`.
- Do not place `<Section>`, `<Hero>`, or page-content molecules inside `Header`. Header owns chrome only.
- Do not render more than one `<Header>` per page — it carries the `banner` landmark, which must be unique per page.
- Do not put form inputs (search fields, selectors) in `Header.Nav`. Nav items are navigational anchors; inputs belong in `Header.Actions` or in a dedicated search overlay.
- Do not use `Header` as a section heading or article heading. It is a page-level landmark wrapper, not a typographic heading element.

## 9. Depends on

- `Wordmark` (atom) — default brand slot content
- `NavLink` (molecule) — primary nav items in `Header.Nav`
- `Button` (atom) — typical `Header.Actions` content

## Open questions

- **Sticky implementation detail**: the scroll-sentinel approach (IntersectionObserver on a 1px div above the Header) vs. a `scroll` event listener — both are valid. The engineer should choose based on the broader app's existing scroll infrastructure. Flagging because the choice affects whether `sticky` adds a JS dependency.
- **`--bp-md` breakpoint token for mobile collapse**: the nav collapse breakpoint should reference `--bp-md` (768px, already in `tokens.css`). Below this breakpoint, `Header.Nav` items may need to hide and a mobile-menu trigger in `Header.Actions` takes over. The exact collapse behaviour (hide nav items, show hamburger, render Sheet/Drawer) depends on the Sheet/Drawer organism which is not yet shipped. Mobile nav handling is deferred until Sheet/Drawer lands; this spec describes the ≥768px layout fully.
