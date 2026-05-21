# Design spec: Footer

**Atomic layer**: organism
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<Footer>` is the canonical site-footer content block for pouk.ai surfaces. It owns the internal composition of the footer band: copyright line, contact link, and an optional row of muted secondary links (legal, social, secondary navigation). It does **not** own the hairline rule or the outer padding — `SiteShell` provides those via its `.footer` CSS class. Footer slots directly into `SiteShell`'s `footer` prop or can stand alone on a surface that manages its own chrome.

**Why lift this into an organism now.** The holding page today passes a freeform `<p>` into `SiteShell`'s `footer` slot. A second surface (internal product) will share the same footer shape: copyright + email + a small link row. Once two surfaces express the same structure ad hoc, the shape becomes a DS primitive. Footer eliminates per-surface drift in spacing, type scale, link treatment, and accessibility semantics.

**Non-goals.** Footer does not own:

- The hairline rule above itself — SiteShell's `.footer` already provides `border-top: var(--hairline-w) solid var(--hairline)`.
- The outer horizontal padding — SiteShell's `.footer` already provides `padding: var(--space-8) var(--page-pad)`.
- Any navigation or wayfinding beyond muted secondary links. Primary navigation belongs in `SiteShell`'s header.
- Dark-mode per-component overrides — tokens flip cleanly via the global block in `tokens.css`.

---

## 2. Anatomy

- **Root element**: `<div>` when nested inside `SiteShell` (which wraps the `footer` slot in its own `<footer>` element — see §7). `<footer>` when used standalone. Controlled by the `as` prop — see §3 for the full reasoning.

- **Layout wrapper**: a single flex row (`align-items: center`, `justify-content: space-between`, `flex-wrap: wrap`). Collapses to a flex column at the 768px breakpoint on narrow viewports — see §6.

- **Left group**: copyright + contact, presented inline separated by a middle-dot separator (`·`). These two items are the minimum required content.
  - **Copyright line**: a short string — e.g. `"© Pouk AI INC 2026"`. Rendered as a plain `<span>` in the muted register. Consumer is responsible for the year value; the DS never auto-inserts `new Date().getFullYear()` — that couples the component to a runtime and breaks SSG/SSR hydration snapshots. The consumer passes the prepared string.
  - **Separator**: the `·` glyph (`&middot;`) rendered as `aria-hidden="true"`. Purely presentational. Color: `--fg-muted`.
  - **Contact (`<EmailLink>`)**: uses the existing `<EmailLink variant="muted">` atom. The muted variant's behavior (`--fg-muted` at rest, `--fg` on hover, color transition via `--dur-fast`) already matches the footer register exactly. No special override needed. The `email` prop flows through to `EmailLink`.

- **Right group**: optional secondary links. Rendered as a `<nav>` with an `aria-label` (see §7) containing an inline list of plain `<a href>` elements. Each link uses the `.muted-link` global utility class from `tokens.css`: `color: var(--fg-muted)`, no underline, `color` transitions to `var(--fg)` on hover. This is the same treatment SiteShell applies to its header nav links — visual consistency is the reason to use `.muted-link` here rather than a custom rule. The DS emits plain `<a href>` — no router abstraction (same contract as SiteShell).

  Link items:
  - Each item has an `href` (string) and a `label` (string). No ReactNode labels in the links array — these are secondary utility links (Privacy, Terms, GitHub), never rich content.
  - An optional `external` boolean per link: when true, adds `target="_blank" rel="noopener noreferrer"`. No auto-injected icon — consumers add an icon in the label string if desired (e.g. `"GitHub ↗"`), or leave it as text.

---

## 3. The `as` prop — double-`<footer>` problem

HTML prohibits a `<footer>` landmark nested inside another `<footer>` element (the inner one loses its `contentinfo` role per the ARIA spec). SiteShell already emits:

```html
<footer class="footer">{footer prop}</footer>
```

If `<Footer>` always renders `<footer>` as its root, consumers who pass it into `SiteShell` produce `<footer><footer>…</footer></footer>` — the inner `<footer>` degrades to a generic container with no landmark semantics, and the DOM is technically invalid (nested sectioning content).

**Decision: `as` prop, default `"div"`.**

The root element is controlled by an `as` prop that accepts `"div" | "footer"`. The **default is `"div"`**, not `"footer"`. Rationale:

1. The primary use case is inside `SiteShell`, where the outer `<footer>` already exists. `as="div"` is correct for that case and produces no double-nesting.
2. Standalone use (a surface without SiteShell) passes `as="footer"` explicitly — the consumer opts into the landmark.
3. A context-sniffing approach (React context from SiteShell) was considered and rejected: it creates an invisible implicit coupling between SiteShell and Footer that is hard to debug and breaks when Footer is used in a test or story without SiteShell wrapping it. An explicit prop is unambiguous.
4. A render-prop or `asChild` pattern was considered and rejected: the root element does not need to be a consumer-supplied component (unlike `LinkCard`, where the root is an `<a>` that may need to become a framework router `<Link>`). The two valid values are `"div"` and `"footer"` — an `as` prop with a two-item union is the lightest correct solution.

The engineer emits a development warning if `as` is omitted and the component detects it is being rendered as a direct child of a `<footer>` element — but this detection is advisory, not blocking. The spec does not require the runtime check; it is optional safety.

---

## 4. Tokens used

No new tokens. Footer is constructed entirely from the existing vocabulary.

| Token         | Value             | Role                                                                                      |
| ------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| `--fg-muted`  | `#6E6E73`         | Copyright text color; separator color; link resting color (via `.muted-link`)             |
| `--fg`        | `#1D1D1F`         | Link hover color (via `.muted-link`); `EmailLink` hover color (via `variant="muted"`)     |
| `--font-sans` | Geist stack       | All text in the footer                                                                    |
| `--fs-meta`   | `0.875rem` (14px) | All footer text — copyright, separator, links, email                                      |
| `--lh-meta`   | `1.2`             | Line-height for all footer text                                                           |
| `--space-4`   | `1rem` (16px)     | Gap between copyright+contact group and links group (horizontal)                          |
| `--space-2`   | `0.5rem` (8px)    | Gap between the `·` separator and adjacent spans; gap between individual links in the nav |
| `--dur-fast`  | `180ms`           | Color transition for `.muted-link` hover and `EmailLink variant="muted"` hover            |
| `--accent`    | `#0071E3`         | Focus ring on links (`:focus-visible` — 2px outline)                                      |
| `--radius-1`  | `2px`             | Focus ring border-radius                                                                  |

**Why `--fs-meta` for all footer text.** SiteShell's `.footer` CSS already sets `font-size: var(--fs-meta)` and `color: var(--fg-muted)` on the footer band. Footer inherits these values from SiteShell's wrapper when slotted. When used standalone, Footer sets them on its own root. Either way, `--fs-meta` (14px) is the correct scale: footer content is metadata — not a reading surface, not a CTA. Apple, Linear, and Stripe footers all sit at 12–14px. `--fs-meta` (14px) is the minimum size that satisfies WCAG 1.4.4 (text resize) without requiring the consumer to touch zoom. `--fs-micro` (12px) was considered and rejected — the links are interactive (email, nav links), and interactive text below 14px strains legibility at normal viewing distance.

**New tokens required: none.** The token vocabulary is sufficient. No new spacing, color, or typography tokens are introduced.

---

## 5. Layout and rhythm

### Horizontal (default, ≥ 768px)

```
[root — flex row, align-items: center, justify-content: space-between, flex-wrap: wrap]
  ├── [left group — flex row, align-items: center, gap: --space-2]
  │     ├── <span> copyright text
  │     ├── <span aria-hidden="true"> · </span>
  │     └── <EmailLink variant="muted" email="…" />
  └── [right group — <nav aria-label="…"> — optional]
        └── <ul> flex row, gap: --space-2, list-style: none, padding: 0, margin: 0
              └── <li> × n — each: <a class="muted-link" href="…">label</a>
```

Gap between left group and right group: managed by `justify-content: space-between` on the root flex container. No explicit gap token between the two groups is needed — `space-between` handles the distribution. On viewports where the two groups together fit comfortably within `--content-max`, the layout is a single row. On viewports where they wrap (below 768px), they stack as a column — see §6.

### Standalone (with `as="footer"`)

The Footer root carries its own `padding: var(--space-8) var(--page-pad)` and `border-top: var(--hairline-w) solid var(--hairline)` when `as="footer"` — mirroring SiteShell's `.footer` rule so the visual output is identical whether Footer is slotted into SiteShell or used standalone. When `as="div"` (slotted into SiteShell), these values are intentionally omitted — SiteShell's wrapper already provides them and Footer must not double them.

The engineer implements this as a conditional style in `Footer.module.css`:

```css
.root[data-standalone="true"] {
  border-top: var(--hairline-w) solid var(--hairline);
  padding: var(--space-8) var(--page-pad);
}
```

The `data-standalone` attribute is set by the component when `as="footer"`. This is cleaner than a CSS module variant class because it avoids a prop-to-class mapping for a single boolean condition.

---

## 6. Responsive behavior

Breakpoint: **768px** (consistent with the system convention — `--bp-md` is the pending token for this value; the engineer uses the literal `768px` until that token ships, consistent with `Section.md §3`).

| Viewport | Layout                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------- |
| ≥ 768px  | Single flex row: left group (copyright · email) — right group (links) side by side                  |
| < 768px  | Flex column: left group stacked above right group; both left-aligned; `gap: --space-4` between rows |

**Why `--space-4` (16px) as the column gap on mobile.** The two rows (copyright+contact / links) are related but not tightly coupled — 16px gives them visual breathing room without overweighting the footer band at mobile scale. `--space-2` (8px) was considered and rejected — at 8px the two rows read as a single line that happened to wrap, which is visually confusing. `--space-6` (24px) was considered and rejected — excessive for a footer whose outer block padding (already `--space-8` via SiteShell) handles the vertical breathing room.

**Right group alignment on mobile.** The links group is left-aligned on mobile (matching the copyright group), not centered. Center-aligned footer links are a marketing-page convention. The operator-grade, editorial register is always left-aligned.

---

## 7. States and motion

### Link hover

All links in Footer use `.muted-link` from `tokens.css`:

```css
.muted-link {
  color: var(--fg-muted);
  background-image: none; /* suppresses the global <a> two-layer underline */
  transition: color var(--dur-fast) ease;
}
@media (hover: hover) {
  .muted-link:hover {
    color: var(--fg);
  }
}
```

`EmailLink variant="muted"` uses its own internal implementation but matches this behavior exactly (`--fg-muted` at rest, `--fg` on hover, `--dur-fast` transition). No additional override is needed on Footer's side.

**Why `.muted-link` and not the default `<a>` treatment.** The global `<a>` rule (two-layer hairline+accent underline, `color: inherit`) is for inline text links in body copy — a footer nav link is a utility item in the chrome, not a link in prose. SiteShell's header nav uses `.muted-link` for the same reason. Footer should be visually identical to the header nav links in their resting and hover states — they are both chrome.

### Focus

`:focus-visible` on all anchor elements follows the global rule in `tokens.css`:

```css
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: var(--radius-1); /* 2px */
}
```

No override needed. The engineer must not suppress this rule inside Footer's CSS module scope.

### Motion

Footer has no entrance animation. It is chrome — it is in the DOM on load and does not participate in scroll-triggered or staggered sequences. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` handles transition suppression globally; no per-component override is needed.

---

## 8. Accessibility

### Landmark role

- **`as="div"` (default, inside SiteShell)**: the SiteShell `<footer>` element is the `contentinfo` landmark. Footer's `<div>` root is a non-landmark container inside it — correct. One `contentinfo` landmark per page.
- **`as="footer"` (standalone)**: Footer's `<footer>` element is the `contentinfo` landmark. Per the ARIA spec, `<footer>` carries the `contentinfo` role only when it is not nested inside `<article>`, `<aside>`, `<main>`, `<nav>`, or `<section>`. For standalone use on a full page, this is the correct and expected behavior.
- **Multiple footer landmarks**: if a page renders Footer more than once (e.g. a sticky footer and a page-bottom footer), each `<footer>` must have a distinct `aria-label` to differentiate the two `contentinfo` landmarks in the SR landmark list. The `aria-label` prop on Footer's root serves this purpose. When only one Footer is on the page, `aria-label` is optional and should be omitted to avoid redundancy (screen readers already announce "contentinfo" for a single `<footer>`).

### Secondary links nav

The right group, when present, renders as `<nav aria-label="…">`. The label is required — two `<nav>` elements on the page (header nav + footer nav) must each have a distinct `aria-label` for SR navigation. Footer's nav label defaults to `"Footer"` and is overridable via the `linksLabel` prop. This produces "Footer, navigation" in SR output, which is clear and conventional.

When the right group is absent (no `links` prop), no `<nav>` element is emitted — an empty `<nav>` is a landmark with no content, which is an SR anti-pattern.

### EmailLink accessibility

`<EmailLink>` already provides correct accessibility: the `href="mailto:…"` is the accessible target, the visible label is the `email` string (or a custom `label`), and the `qualifier` slot handles additional context. No ARIA wrapping is needed at the Footer level.

### Contrast

All text in Footer renders at `--fs-meta` (14px) — this is normal text (not large text), so the applicable WCAG threshold is 4.5:1 (AA normal).

- `--fg-muted` on `--bg` = **4.91:1** (AA ✓)
- `--fg-muted` on `--surface` = **4.66:1** (AA ✓) — for surfaces where Footer is used on `--surface` bands
- `--fg` on hover on `--bg` = **16.29:1** (AAA ✓)
- `--accent` focus ring on `--bg` = **4.54:1** (satisfies WCAG 1.4.11 non-text contrast 3:1 ✓)

All pairings pass. No exceptions.

### Keyboard interaction

All interactive elements in Footer are standard `<a>` elements. Keyboard navigation follows the native tab order: left-to-right through the copyright (no tab stop) → EmailLink (tab stop) → each links-nav item (tab stop). No custom keyboard management is needed.

---

## 9. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API
interface FooterLink {
  href: string;
  label: string;
  external?: boolean; // adds target="_blank" rel="noopener noreferrer"
}

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "footer"; // default "div" — see §3
  copyright: string; // e.g. "© Pouk AI INC 2026"
  email: string; // passed to <EmailLink variant="muted">
  emailLabel?: string; // optional visible label override for EmailLink
  links?: FooterLink[]; // secondary nav links; omit to suppress the <nav>
  linksLabel?: string; // aria-label for the <nav>; default "Footer"
}
```

**Prop-by-prop intent:**

- `as` — controls the root element. Default `"div"` (correct for use inside SiteShell's `<footer>` wrapper). Pass `"footer"` for standalone use. See §3 for full rationale. The component must not accept any other value — `<footer>` and `<div>` are the only two semantically appropriate roots for this organism.

- `copyright` — required. The copyright string. Rendered as a `<span>` in the muted register. Consumer provides the full string including `©` and the year. The DS does not compute or format the year — that is a content concern, not a component concern. An empty string is invalid; the engineer emits a `console.error` in development if `copyright` is an empty string.

- `email` — required. Passed directly to `<EmailLink email={email} variant="muted">`. Footer owns no `mailto:` logic — that is `EmailLink`'s contract.

- `emailLabel` — optional. Maps to `EmailLink`'s `label` prop. When provided and different from the email address, the label is the visible text and the email is the `href` target only. Useful for rendering `"hello@pouk.ai"` as simply `"Contact"` in space-constrained contexts.

- `links` — optional. An array of `{ href, label, external? }` objects. When absent or empty, no `<nav>` is rendered. When present, Footer renders a `<nav aria-label={linksLabel}>` containing a `<ul>` of `<li><a class="muted-link" …>` items. External links receive `target="_blank" rel="noopener noreferrer"`. Order is the consumer's responsibility — the DS renders items in array order.

- `linksLabel` — optional. The `aria-label` for the secondary nav. Default `"Footer"`. Consumer should override this if the page uses a different naming convention (e.g. `"Legal"`, `"Secondary"`). The spec recommends keeping `"Footer"` as the default — it is clear, conventional, and distinguishes the footer nav from the header nav in SR landmark navigation.

- `className` — available via `React.HTMLAttributes<HTMLElement>` spread. For layout overrides at the consumer layer. Footer has no margin of its own; the consumer or SiteShell positions it.

- Standard HTML attributes (`id`, `data-*`, `aria-label`, `aria-labelledby`, event handlers) are spreadable via `React.HTMLAttributes<HTMLElement>`. The engineer uses `HTMLElement` (not `HTMLDivElement` or `HTMLElement`) as the base because the root is polymorphic.

**What was trimmed and why:**

- `separator` prop (custom separator character) — cut. The `·` middle-dot is a brand constant in this footer register, identical to the site's current holding-page footer. Making it configurable adds API surface without a real consumer need. If a specific surface needs no separator, the consumer passes `emailLabel` to reduce visual weight.

- `socialLinks` as a separate prop — cut. Social links are a subset of `links`. Separating them into a `socials` prop would imply different visual treatment (an icon-only row, a different grouping). Footer does not differentiate social links from legal links at the component level — both are plain muted text links in the secondary nav. If a consumer wants to group them visually, they author their layout with two Footer instances or use a custom composition. This keeps the prop surface minimal.

- `year` prop (auto-inserting the year into a copyright template) — cut. See rationale under `copyright` above.

- `icon` slot on individual links — cut. Links in the footer nav are text-only by DS convention. If a consumer wants `"GitHub ↗"`, the `↗` is part of the `label` string. Rich icon nodes inside footer nav links add visual complexity that is not in the brand register.

---

## 10. Composition rules

- **Footer inside `SiteShell`.** The canonical composition. Pass `<Footer as="div" copyright="…" email="…" />` to `SiteShell`'s `footer` prop. SiteShell renders `<footer className={styles.footer}>{footer}</footer>` — the outer `<footer>` is the `contentinfo` landmark; Footer's `<div>` root carries the internal layout. No padding or border-top on Footer's root in this configuration (`as="div"` suppresses the standalone styles — see §5).

- **Footer standalone.** Pass `as="footer"` and Footer emits its own `<footer>` landmark with the hairline rule and padding. Correct for surfaces that do not use `SiteShell` (e.g. an internal product app with its own chrome).

- **Footer and `EmailLink`.** Footer internally renders `<EmailLink variant="muted" email={email} label={emailLabel} />`. The engineer imports `EmailLink` from the atoms layer. Footer does not re-export `EmailLink`; consumers who want `EmailLink` elsewhere import it directly.

- **Footer does not compose with `<Section>`.** Section is a page-subdivision molecule; Footer is page chrome. They are positional siblings on the page, not parent/child.

- **Footer does not compose with `<Hero>`.** Hero is the first child of `<main>`; Footer is outside `<main>`. They do not interact.

- **Two Footer instances on one page.** Rare but valid (e.g. a sticky footer + a page-bottom footer). Each must have a distinct `aria-label` on the root to differentiate the two `contentinfo` landmarks. Consumer passes `aria-label="Site footer"` on one and `aria-label="Sticky footer"` on the other.

---

## 11. Out of scope

- **Logo / wordmark in the footer.** Some site footers repeat the wordmark. This is not in scope for the initial Footer organism. If a surface needs the wordmark in the footer, the consumer places `<Wordmark>` inside a custom footer composition, not inside `<Footer>`. Introducing a `showWordmark` or `logo` slot would expand Footer beyond its declared purpose as a utility band.

- **Multiple email addresses.** Footer surfaces one contact email via `<EmailLink>`. A multi-contact footer (e.g. sales + support addresses) is a different layout pattern outside this spec.

- **Rich social link icons.** Icon-only social links (SVG icon buttons for Twitter, GitHub, LinkedIn) are a different visual pattern — they require accessible naming, icon sizing, and hover states that differ from plain text links. If a social icon row is needed, file a proposal for a `SocialLinks` atom. For now, `links` accepts a `"GitHub ↗"` text label and that is sufficient.

- **Multi-column footer layout.** A footer with distinct columns (Products / Company / Legal, the classic SaaS footer grid) is a different organism. `<Footer>` is a single-row utility band. A multi-column footer is out of scope and should be spec'd separately if needed.

- **Dark-mode per-component overrides.** `--fg`, `--fg-muted`, `--hairline`, `--accent` all flip cleanly via the global dark-mode token override in `tokens.css`. No per-component dark-mode CSS is needed.

- **`links` as a ReactNode slot.** Links are a typed array of `{ href, label, external? }` objects, not a freeform `ReactNode`. Accepting a ReactNode links slot would transfer layout and accessibility responsibility to the consumer, defeating the purpose of the component. The typed array ensures every link is a valid plain `<a>` with the correct `.muted-link` treatment.

---

## 12. Worked examples

### (a) Standalone use

```jsx
import { Footer } from "@poukai-inc/ui";

// Standalone — Footer emits its own <footer> landmark with hairline + padding
<Footer
  as="footer"
  copyright="© Pouk AI INC 2026"
  email="hello@pouk.ai"
  links={[
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "https://github.com/poukai-inc", label: "GitHub ↗", external: true },
  ]}
/>;
```

Renders:

```html
<footer data-standalone="true">
  <div class="layout">
    <div class="left">
      <span class="copyright">© Pouk AI INC 2026</span>
      <span aria-hidden="true" class="separator">·</span>
      <a href="mailto:hello@pouk.ai" class="email-link muted">hello@pouk.ai</a>
    </div>
    <nav aria-label="Footer">
      <ul>
        <li><a href="/privacy" class="muted-link">Privacy</a></li>
        <li><a href="/terms" class="muted-link">Terms</a></li>
        <li>
          <a
            href="https://github.com/poukai-inc"
            class="muted-link"
            target="_blank"
            rel="noopener noreferrer"
            >GitHub ↗</a
          >
        </li>
      </ul>
    </nav>
  </div>
</footer>
```

### (b) Inside SiteShell

```jsx
import { SiteShell, Footer } from "@poukai-inc/ui";

<SiteShell
  currentRoute="/why-ai"
  routes={[
    { href: "/why-ai", label: "Why AI" },
    { href: "/roles", label: "Roles" },
  ]}
  footer={
    <Footer
      copyright="© Pouk AI INC 2026"
      email="hello@pouk.ai"
      links={[{ href: "/privacy", label: "Privacy" }]}
    />
    // as="div" is the default — no double <footer>
  }
>
  {pageContent}
</SiteShell>;
```

SiteShell renders:

```html
<div class="root">
  <header class="header">…</header>
  <main class="main">…</main>
  <footer class="footer">
    <!-- Footer root is <div>, not <footer> — no double-landmark -->
    <div>
      <div class="left">…</div>
      <nav aria-label="Footer">…</nav>
    </div>
  </footer>
</div>
```

---

## 13. Story matrix

| Story file                       | Story name         | Description                                                                                                                                                                                                  |
| -------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Footer.stories.tsx`             | `Default`          | `as="div"` + copyright + email + links (3 items). Verifies: layout row, `.muted-link` on links, `EmailLink variant="muted"` present, separator rendered with `aria-hidden`.                                  |
| `Footer.stories.tsx`             | `NoLinks`          | copyright + email only — no `links` prop. Verifies: no `<nav>` is emitted, left group renders correctly without a right group, layout is still coherent as a single-row element.                             |
| `Footer.stories.tsx`             | `Standalone`       | `as="footer"` + full props. Verifies: root is `<footer>`, hairline rule and padding are present (standalone styles active), `contentinfo` landmark in axe-core audit.                                        |
| `Footer.stories.tsx`             | `ExternalLink`     | One link with `external: true`. Verifies: `target="_blank"` and `rel="noopener noreferrer"` on that link only; other links unaffected.                                                                       |
| `Footer.stories.tsx`             | `CustomEmailLabel` | `email="hello@pouk.ai"` + `emailLabel="Contact"`. Verifies: visible label is "Contact", `href` is `mailto:hello@pouk.ai`, EmailLink renders correctly.                                                       |
| `Footer.AllVariants.stories.tsx` | `InsideSiteShell`  | Full SiteShell composition with Footer in the `footer` slot (`as="div"`). Verifies: no double `<footer>` in DOM, SiteShell hairline rule is present, Footer layout aligns within SiteShell's padding column. |
| `Footer.AllVariants.stories.tsx` | `MobileCollapse`   | Viewport set to 375px. Verifies: flex column layout, left group above right group, both left-aligned, `--space-4` vertical gap between rows.                                                                 |
| `Footer.AllVariants.stories.tsx` | `HoverAndFocus`    | Links hovered and focused via pseudo-states. Verifies: `.muted-link` color shifts to `--fg`, focus ring at 2px `--accent` with 4px offset and `--radius-1` border-radius.                                    |
| `Footer.AllVariants.stories.tsx` | `A11yAudit`        | Standalone `as="footer"` + links. Run axe-core. Verifies: single `contentinfo` landmark, `<nav aria-label="Footer">` present, no duplicate landmarks, all interactive elements have accessible names.        |

---

## 14. Open questions for Arian

1. **`copyright` as a required string vs. a ReactNode.** The spec makes `copyright` a required string prop, which keeps the contract simple and predictable. However, if a future surface needs a copyright line with an inline link (e.g. `"© 2026 Pouk AI · Built with ♥"`) the string type is a constraint. Should `copyright` accept `ReactNode`? If so, the separator rendering logic becomes more complex (we can't assume the copyright is always followed by a `·` separator). The current spec uses a string for predictability. Awaiting sign-off on whether this is sufficient for all planned surfaces.

2. **`emailLabel` default behavior.** The current spec defaults `emailLabel` to the `email` string (the `EmailLink` atom default). This means the footer renders the full email address `hello@pouk.ai` as visible text. On the holding page this is the intended treatment. If the internal product footer should read `"Contact"` instead of the raw address, `emailLabel` handles it — but should the DS specify a brand-level default for this? Recommend keeping it as the raw address (consistent with the holding page), but noting the override.

3. **Links separator between items.** The current spec renders links as an inline `<ul>` with `gap: --space-2` but no separator glyph between them. The header nav also has no separator. Some footers add `·` between nav items. Should Footer add a visible separator between link items, or is the gap alone sufficient? Recommend gap-only (consistent with SiteShell header nav), but this is a brand-level call.

4. **Sticky / positioned footer variant.** The spec assumes Footer is a static in-flow element (bottom of the page). A sticky or `position: fixed` footer is not addressed. If the internal product surface needs a sticky footer, that is an additive layout concern that can be layered via `className` — but confirm whether a `sticky` prop or explicit layout guidance belongs in this spec before the engineer implements.

5. **`as` default being `"div"`.** The decision to default `as` to `"div"` (rather than `"footer"`) is deliberate to make the slotted-into-SiteShell case the path of least resistance, but it means standalone use requires an explicit prop. This is an intentional trade-off. Confirming Arian is comfortable with this ergonomics decision before engineering starts — particularly whether `as="footer"` for standalone use is intuitive enough or whether a different API shape would be preferable.
