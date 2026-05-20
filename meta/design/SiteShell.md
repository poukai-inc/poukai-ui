# Design spec: SiteShell

**Atomic layer**: organism
**Status**: Shipped in v0.1.0
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Status

Shipped in v0.1.0. Wordmark height changed from 28px to 56px in v0.2.3. Wordmark geometry revised across v0.3.0–v0.3.2 (those changes are in the Wordmark atom, not SiteShell). `--bp-md` custom media token added in v0.17.0 but SiteShell does not have breakpoint-dependent layout changes — no migration needed.

---

## 2. Purpose & non-goals

`<SiteShell>` is the canonical page-chrome organism for pouk.ai surfaces. It owns the full-page layout: a top header (wordmark link + primary nav), a `<main>` content slot, and a hairline-ruled footer slot. Every page on the site uses a single `<SiteShell>` as its outermost layout wrapper.

**What SiteShell owns:**

- The full-height flex column (`min-height: 100vh; min-height: 100dvh`) and the page background (`--bg`).
- The header band: wordmark + primary nav, with the wordmark as a link (`homeHref` prop) and nav items rendered as plain `<a>` elements.
- The active route highlight: the `currentRoute` prop marks one nav item as `aria-current="page"` and applies the active foreground color.
- The main content slot: horizontal padding via `--page-pad`, top/bottom padding, centered at `--content-max` (64rem), flex-grows to fill available height.
- The footer slot: hairline rule above, `--page-pad` horizontal padding, muted text register. The shell renders a `<footer>` element wrapping whatever the caller passes in the `footer` prop.

**No router awareness.** SiteShell emits plain `<a href>` elements for all navigation links — wordmark home link and nav items alike. It does not import or wrap any framework router (`next/link`, `react-router`, `@astrojs/react`, etc.). Consumers using a framework router handle link interception at the application level (e.g. intercepting `<a>` clicks, or wrapping SiteShell in a context that swaps anchor behavior). This keeps the DS framework-agnostic — a deliberate trade-off documented in the JSDoc.

**Differentiating SiteShell from Section and Hero.** `Section` is a page-content band — it owns a content block's internal spacing (eyebrow, title, lede, children) and optional section background. `Hero` is the first content block inside `<main>`. Neither Section nor Hero is a layout primitive — they are content molecules that live inside SiteShell's `<main>` slot. SiteShell is the only organism that owns the full-page layout frame.

**Non-goals:**

- SiteShell does not own the Footer content layout. The `footer` slot accepts any `ReactNode` — the caller passes a `<Footer>` component or a plain `<p>`. SiteShell's `.footer` CSS provides the border rule, padding, and muted text defaults; the contents are the caller's domain.
- SiteShell does not ship a mobile hamburger menu or off-canvas navigation. The nav items wrap via `flex-wrap: wrap` on narrow viewports. A mobile nav drawer is a future component.
- SiteShell does not manage page-level scroll, anchor behavior, or scroll restoration.
- SiteShell does not provide a skip-to-main link. This is a known gap — see §10.
- SiteShell does not compose with Dialog, Sheet, or any overlay. Overlays render into `document.body` via their own portals.

---

## 3. Anatomy

- **Root element**: `<div>` — `display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; background: var(--bg); color: var(--fg)`. A `<div>` rather than a semantic element because the root is a layout container — the semantic elements (`<header>`, `<main>`, `<footer>`) are its children.
- **Header**: `<header className={styles.header}>` — `display: flex; align-items: center; justify-content: space-between; gap: var(--space-6); padding: var(--space-6) var(--page-pad)`. The `<header>` element carries the `banner` landmark role implicitly.
  - **Brand link**: `<a href={homeHref} className={styles.brand} aria-label="Poukai — home">` — `display: inline-flex; align-items: center; color: var(--fg); background-image: none; padding-bottom: 0`. The `background-image: none` and `padding-bottom: 0` suppress the global animated underline-grow that applies to all `<a>` elements — a wordmark link is brand chrome, not a prose link. Focus ring: `outline: 2px solid var(--accent); outline-offset: 4px; border-radius: var(--radius-1)` — explicit in `SiteShell.module.css` rather than relying on the global `a:focus-visible` rule, because the brand link's `background-image: none` override means the global rule's `background-image` reset is already handled.
  - **Wordmark**: `<Wordmark height={56} />` inside the brand link. The `height={56}` is the nav-bar size — proportional width is ~228px at that height (1184/290 × 56). SiteShell is the only place in the DS that sets a fixed Wordmark height.
  - **Nav** (conditional): `<nav className={styles.nav} aria-label={navLabel}>` — rendered only when `routes.length > 0`. Contains a `<ul>` with `display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-6)`. Each route is a `<li>` containing an `<a>` with `className={clsx(styles.navLink, "muted-link", isActive && styles.navLinkActive)}`. The `.muted-link` global utility class provides `--fg-muted` at rest → `--fg` on hover with `--dur-fast` transition. The active link gets `color: var(--fg)` via `.navLinkActive` (overriding the muted default) and `aria-current="page"`.
- **Main**: `<main className={styles.main}>{children}</main>` — `flex: 1 1 auto; padding: var(--space-12) var(--page-pad) var(--space-24); width: 100%; max-width: var(--content-max); margin-left: auto; margin-right: auto`. The `flex: 1 1 auto` makes `<main>` expand to fill the available vertical space between header and footer, pushing the footer to the bottom even on short pages. `max-width: var(--content-max)` (64rem) centers the content column. `margin: auto` centers the main block horizontally within the root div.
- **Footer** (conditional): `<footer className={styles.footer}>{footer}</footer>` — rendered only when `footer` is provided. `border-top: var(--hairline-w) solid var(--hairline); padding: var(--space-8) var(--page-pad); color: var(--fg-muted); font-size: var(--fs-meta)`. First and last children have their margins zeroed. The `<footer>` element carries the `contentinfo` landmark role implicitly.

---

## 4. Props API

```tsx
interface SiteShellRoute {
  href: string;        // plain href — e.g. "/why-ai"
  label: ReactNode;    // visible nav label
}

interface SiteShellProps extends ComponentPropsWithoutRef<"div"> {
  currentRoute?: string;   // matched against routes[i].href for active state
  routes?: SiteShellRoute[]; // primary nav items; default []
  footer?: ReactNode;      // footer slot content
  homeHref?: string;       // wordmark link href; default "/"
  navLabel?: string;       // aria-label for <nav>; default "Primary"
  children: ReactNode;     // page content — rendered inside <main>
}
```

**`currentRoute`** (string, optional): The pathname of the currently active route — e.g. `"/why-ai"`. Matched by strict equality against `routes[i].href`. When matched, the corresponding nav item receives `aria-current="page"` and `styles.navLinkActive` (foreground color at full weight). When absent or unmatched, all nav items render in the muted default state. Optional — SiteShell is happy without a `currentRoute` (the nav renders without any active indicator).

**`routes`** (SiteShellRoute[], default `[]`): Primary nav items. Each item has an `href` (plain string) and a `label` (ReactNode — allows formatted labels, though plain strings are idiomatic). When the array is empty or omitted, no `<nav>` element is rendered — SiteShell becomes a "chrome-less hero shell" (header contains only the wordmark; no nav). This allows surfaces that don't need top navigation (splash pages, error pages) to use SiteShell without the nav.

**`footer`** (ReactNode, optional): The footer slot. When provided, SiteShell renders `<footer className={styles.footer}>{footer}</footer>`. When absent, no `<footer>` element is rendered. The canonical value is `<Footer />` (the Footer organism, which handles its own internal layout). A plain `<p>` is also valid — the showcase uses a plain `<p>` with copyright + email link.

**`homeHref`** (string, default `"/"`): The `href` for the wordmark brand link. Defaults to `"/"` — the root of the site. Override for sub-apps or embedded contexts where the home destination is different.

**`navLabel`** (string, default `"Primary"`): The `aria-label` for the `<nav>` element. Defaults to `"Primary"` — producing `"Primary, navigation"` in screen reader output. Override to `"Main"` or a locale-specific string if required. When no `<nav>` is rendered (empty routes), this prop is ignored.

**`children`** (ReactNode, required): The page content. Rendered inside `<main>`. Typically starts with a `<Hero>` molecule, followed by `<Section>` bands.

**Standard HTML spread** (`ComponentPropsWithoutRef<"div">`): `id`, `data-*`, `className`, `style` forwarded to the root `<div>`. `className` merges via `clsx`.

---

## 5. Token contract

| Token          | Value                                     | Role                                                           |
| -------------- | ----------------------------------------- | -------------------------------------------------------------- |
| `--bg`         | `#FBFBFD`                                 | Page background on root `<div>`                               |
| `--fg`         | `#1D1D1F`                                 | Root text color; brand link color; active nav link color       |
| `--fg-muted`   | `#6E6E73`                                 | Footer text color default                                      |
| `--hairline`   | `#D2D2D7`                                 | Footer top border                                              |
| `--hairline-w` | `1px`                                     | Border width                                                   |
| `--accent`     | `#0071E3`                                 | Brand link focus ring color                                    |
| `--radius-1`   | `2px`                                     | Brand link focus ring border-radius                            |
| `--font-sans`  | Geist stack                               | Nav link font-family                                           |
| `--fs-meta`    | `0.875rem` (14px)                         | Nav link font-size; footer font-size                           |
| `--dur-fast`   | `180ms`                                   | Nav link hover color transition (via `.muted-link`)            |
| `--space-6`    | `1.5rem` (24px)                           | Header internal gap; nav item gap; header padding block        |
| `--space-8`    | `2rem` (32px)                             | Footer padding block                                           |
| `--space-12`   | `3rem` (48px)                             | Main content top padding                                       |
| `--space-24`   | `6rem` (96px)                             | Main content bottom padding                                    |
| `--page-pad`   | `clamp(1.5rem, 2vw + 1rem, 3rem)`        | Horizontal padding for header, main, footer                    |
| `--content-max`| `64rem`                                   | Max-width for the main content column                          |

**`.muted-link` global utility.** Nav links apply the global `.muted-link` class from `tokens.css` rather than a locally-scoped CSS module rule. This is one of two places in the DS where a global utility class leaks into component JSX (the other is `Hero`'s `.lede` class). A BACKLOG item tracks moving `.muted-link` usage into the respective CSS modules — it is a hygiene item, not a correctness issue.

---

## 6. States & motion

### Brand link

- **Default**: `color: var(--fg)`, no underline (global animated underline suppressed via `background-image: none`).
- **Focus-visible**: `outline: 2px solid var(--accent); outline-offset: 4px; border-radius: var(--radius-1)`. Explicit rule in `SiteShell.module.css`.
- No hover state on the wordmark link itself — it is a logo, not a text link.

### Nav links

- **Default**: `color: var(--fg-muted)` via `.muted-link`.
- **Hover**: `color: var(--fg)` via `.muted-link`'s `@media (hover: hover)` rule, `transition: color var(--dur-fast) ease`.
- **Active** (`currentRoute` match): `color: var(--fg)` via `.navLinkActive`, `aria-current="page"` set.
- **Focus-visible**: inherits global `a:focus-visible` rule — `outline: 2px solid var(--accent); outline-offset: 4px; border-radius: var(--radius-1)`.

### Motion

SiteShell has no entrance animation and no transition of its own. It is page chrome — present on load, static. The global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` handles any inherited transitions.

---

## 7. Responsive behavior

SiteShell has no hard-coded breakpoint changes in its CSS. The layout adapts fluidly:

- **`--page-pad`** is fluid (`clamp(1.5rem, 2vw + 1rem, 3rem)`) — horizontal gutters narrow on small viewports and widen on large ones.
- **Nav wrap**: the nav `<ul>` has `flex-wrap: wrap` — on very narrow viewports where nav items exceed the available width, they wrap to a second line inside the header. There is no hamburger menu or collapsed nav state.
- **Header**: `justify-content: space-between` with `gap: var(--space-6)` — on narrow viewports the wordmark and nav naturally compress toward each other; flex-wrap on the nav provides the safety valve.
- **Main**: `max-width: var(--content-max)` (64rem) + `margin: auto` centers the content at wide viewports. At narrow viewports the content is full-width within `--page-pad` gutters.

A mobile hamburger nav is explicitly out of scope for this version — see §10.

---

## 8. A11y

### Landmarks

- `<header>` → `banner` landmark (implicit). One per page.
- `<nav aria-label={navLabel}>` → `navigation` landmark. Only rendered when `routes.length > 0`. The `aria-label` differentiates this nav from any `<nav>` in the page content (e.g. a Footer nav). Default label `"Primary"` → screen reader announces `"Primary, navigation"`.
- `<main>` → `main` landmark. One per page.
- `<footer>` → `contentinfo` landmark. Only rendered when `footer` is provided. One per page.

### Active route

`aria-current="page"` is set on the active nav link. This is the correct ARIA attribute for indicating the current page in a site navigation — it is not `aria-selected` (for tab panels) or `aria-pressed` (for toggle buttons).

### Brand link

`aria-label="Poukai — home"` on the brand link provides an accessible name that describes both the brand and the destination — clearer than the default computed name from the Wordmark's visually-hidden `<span>` (`"Poukai"`), which does not indicate "home."

### Keyboard navigation

Tab order in the header: brand link → nav links (in DOM order). Standard native tab order — no custom management needed. Nav items are plain `<a>` elements; keyboard activation (Enter) follows standard anchor behavior.

### Skip-to-main link

SiteShell does not include a "skip to main content" link. This is a known gap — see §10. All `<main>` elements have no `id` set by default; adding a skip link requires an `id="main-content"` on the `<main>` element and a visually-hidden anchor before the header.

### Contrast

| Pair                                    | Ratio     | Verdict       |
| --------------------------------------- | --------- | ------------- |
| Nav link at rest (`--fg-muted` on `--bg`) | 4.91:1  | AA normal ✓   |
| Nav link on hover (`--fg` on `--bg`)    | 16.29:1   | AAA ✓         |
| Active nav link (`--fg` on `--bg`)      | 16.29:1   | AAA ✓         |
| Footer text (`--fg-muted` on `--bg`)    | 4.91:1    | AA normal ✓   |
| Focus ring (`--accent` on `--bg`)       | 4.54:1    | WCAG 1.4.11 non-text contrast 3:1 ✓ |

---

## 9. Worked examples

### (a) Full shell — canonical three-route site

```jsx
import { SiteShell, Footer } from "@poukai-inc/ui";

<SiteShell
  currentRoute="/why-ai"
  routes={[
    { href: "/why-ai",      label: "Why AI" },
    { href: "/roles",       label: "Roles" },
    { href: "/principles",  label: "Principles" },
  ]}
  footer={
    <Footer
      copyright="© Pouk AI INC 2026"
      email="hello@pouk.ai"
    />
  }
>
  {pageContent}
</SiteShell>
```

The `/why-ai` nav item receives `aria-current="page"` and full `--fg` color. Footer is slotted as the `<Footer>` organism with `as="div"` (default) — no double `<footer>` element because SiteShell's `.footer` wrapper provides the outer `<footer>`.

### (b) Shell with plain footer (holding-page pattern)

```jsx
import { SiteShell } from "@poukai-inc/ui";

<SiteShell
  currentRoute="/why-ai"
  routes={[
    { href: "/why-ai",     label: "Why AI" },
    { href: "/roles",      label: "Roles" },
    { href: "/principles", label: "Principles" },
  ]}
  footer={
    <p style={{ margin: 0 }}>
      © Pouk AI INC 2026 ·{" "}
      <a href="mailto:hello@pouk.ai" className="muted-link">
        hello@pouk.ai
      </a>
    </p>
  }
>
  {pageContent}
</SiteShell>
```

The plain `<p>` footer — the pattern used in the showcase before the `Footer` organism shipped. Still valid.

### (c) Chrome-less — no nav, no footer

```jsx
import { SiteShell } from "@poukai-inc/ui";

// Splash page, error page, or holding page with no navigation
<SiteShell>
  {pageContent}
</SiteShell>
```

`routes` defaults to `[]` — no `<nav>` rendered. `footer` omitted — no `<footer>` rendered. SiteShell provides the page background, full-height flex column, and centered main slot.

---

## 10. Open questions

**Skip-to-main link.** SiteShell does not include a "skip to main content" link. This is a WCAG 2.4.1 (Bypass Blocks) consideration — keyboard users must Tab through the wordmark and all nav links to reach the page content on every page load. The fix requires:
1. Adding `id="main-content"` to the `<main>` element (or making `mainId` a prop).
2. Rendering a visually-hidden `<a href="#main-content">Skip to main content</a>` as the first child of the root `<div>`, visible on `:focus`.

This is not a blocking issue for the current single-page holding site (one nav link), but becomes significant when the site has 3+ nav items. Recommend adding a `skipLabel` prop (optional string, default `"Skip to main content"`) that, when provided, renders the skip link. Flagging for Arian's awareness.

**Mobile nav.** The current nav wraps via `flex-wrap: wrap` on narrow viewports. At 3 short nav labels this is acceptable. At 5+ labels, or with longer label text, a hamburger menu or off-canvas drawer is needed. Not in scope for this version — file a proposal when the site navigation grows beyond 4 items.

**`homeHref` as a framework `<Link>`.** The wordmark link is a plain `<a href={homeHref}>`. Consumers using Next.js or Astro may want this to be a framework `<Link>` for client-side navigation. The current architecture (no router awareness, plain anchors) means framework consumers handle this at the application level. A future `renderLink` or `asChild` escape hatch on the brand anchor could address this — not in scope for this version.
