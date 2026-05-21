# Design spec: Link

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-20

---

## 1. Purpose

`<Link>` is the canonical styled anchor in `@poukai-inc/ui`. It lifts the two-layer underline rule that currently lives as a global `a` selector in `src/tokens/tokens.css` (lines 260–301) into a named, versioned atom — giving `<Button asChild>`, nav molecules, and footer links a single, explicit contract rather than relying on a stylesheet global.

Before this atom existed the system had two leaky mechanisms: the global `a` rule applied to every anchor on the page (requiring opt-out in molecules like SiteShell that suppress it with `background-image: none`), and a `.muted-link` global utility class in `tokens.css` (lines 292–301) that was applied via raw `className` strings in `SiteShell.tsx`, `Footer.tsx`, and story fixtures. Neither mechanism was a named component. This atom names the contract so consumers reach for `<Link>` instead of a raw `<a>` and the system never needs to fight its own global styles.

The atom emits a plain `<a href>`. It deliberately does not abstract the router. The DS is framework-agnostic; consumers who need Next.js `<Link>` or Remix `<NavLink>` use the `asChild` prop to compose.

---

## 2. Anatomy

- **Root element**: `<a>` — the default. When `asChild` is `true`, a Radix `<Slot>` renders in its place and merges all props onto the single child the consumer passes (typically a router `<Link>` component).
- **Content slot**: any inline `ReactNode` — text, an icon, or a mixed run. The DS does not own the content; it owns the underline treatment and color.
- **Underline layer 1 (accent, animated)**: a `background-image: linear-gradient(var(--accent), var(--accent))` painted at `background-size: 0% 1px` at rest, growing to `100% 1px` on hover. This is the "you are targeting this" signal.
- **Underline layer 2 (hairline, static)**: a `background-image: linear-gradient(var(--hairline), var(--hairline))` always painted at `background-size: 100% 1px`. This is the resting discoverability signal that makes the link legible as a link before any interaction.
- **Focus ring**: `2px solid var(--accent)`, `outline-offset: 4px`, `border-radius: var(--radius-1)` — matching the global `a:focus-visible` rule exactly.

The `quiet` variant suppresses layer 2 (hairline) at rest; the underline-grow on hover is the only affordance signal. The `muted-link` variant suppresses both layers entirely and uses a color transition instead. Both variants are documented in §5.

---

## 3. Tokens used

No new tokens are introduced by this spec. The atom is constructed entirely from the existing token vocabulary.

| Token           | Value                           | Role                                                                                     |
| --------------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| `--accent`      | `#0071E3`                       | Animated underline layer color; focus ring color; hover color shift on `default` variant |
| `--hairline`    | `#D2D2D7`                       | Static hairline underline layer color on `default` variant                               |
| `--fg`          | `#1D1D1F`                       | Inherited text color at rest (`color: inherit` — no explicit override needed)            |
| `--fg-muted`    | `#6E6E73`                       | Base text color for `muted-link` variant; `default` hover target on `muted-link`         |
| `--dur-mid`     | `240ms`                         | Duration for the underline background-size grow transition on `default` and `quiet`      |
| `--dur-fast`    | `180ms`                         | Duration for the color transition on `muted-link`                                        |
| `--easing-link` | `cubic-bezier(0.2, 0, 0, 1)`    | Easing for the underline grow on `default` and `quiet`. Not reused elsewhere.            |
| `--radius-1`    | `2px`                           | Focus ring border-radius                                                                 |
| `--focus-ring`  | (shorthand for the 2px pattern) | Focus ring — see §7                                                                      |

**Token-absence note — underline values.** The underline `background-size` (`1px`) and `padding-bottom` (`2px`) are literal values, matching what is already in the global `a` rule in `tokens.css`. The system does not yet have `--text-underline-thickness` or `--text-underline-offset` tokens; the same rationale recorded in `EmailLink.md` §3 applies here — introducing two new tokens for inline literal values that are already in the codebase and have a single usage site is not warranted. If a type-foundations pass adds underline tokens, `Link.module.css` is the primary migration target alongside `EmailLink.module.css`.

---

## 4. Layout & rhythm

`<Link>` is an inline element. It carries no block layout of its own. The only layout effect the component adds to its container is `padding-bottom: 2px` on the root, which is required to give the gradient underlines room below the text descenders. This is inherited directly from the global `a` rule.

| Property                   | `default`                                           | `quiet`                                             | `muted-link`                 |
| -------------------------- | --------------------------------------------------- | --------------------------------------------------- | ---------------------------- |
| `display`                  | `inline`                                            | `inline`                                            | `inline`                     |
| `color`                    | inherited                                           | inherited                                           | `var(--fg-muted)`            |
| `text-decoration`          | `none`                                              | `none`                                              | `none`                       |
| `background-image` at rest | accent gradient + hairline gradient (two layers)    | accent gradient only (one layer, 0% width)          | `none`                       |
| `background-size` at rest  | `0% 1px, 100% 1px`                                  | `0% 1px`                                            | n/a                          |
| `background-size` on hover | `100% 1px, 100% 1px`                                | `100% 1px`                                          | n/a                          |
| `background-position`      | `0 100%, 0 100%`                                    | `0 100%`                                            | n/a                          |
| `background-repeat`        | `no-repeat, no-repeat`                              | `no-repeat`                                         | n/a                          |
| `padding-bottom`           | `2px`                                               | `2px`                                               | `0`                          |
| `transition`               | `background-size var(--dur-mid) var(--easing-link)` | `background-size var(--dur-mid) var(--easing-link)` | `color var(--dur-fast) ease` |
| Hover color shift          | none (underline color signals the interaction)      | none                                                | `var(--fg)` on hover         |

**Why `quiet` uses a single gradient layer instead of zero.** `quiet` still owns the grow animation on hover — the consumer chose it precisely because they want the underline to appear on hover as a hover confirmation. Using a single `background-image` layer (the accent gradient at 0% width) keeps the transition definition identical to `default`; only the number of layers differs. If `quiet` used `background-image: none` at rest and switched to a gradient on hover, the browser would not interpolate the size — the underline would appear instantly. A pre-declared 0%-width layer is the correct technique.

**Why `muted-link` has no underline layers.** The `.muted-link` class in `tokens.css` has `background-image: none` and a plain `color` transition. That is the existing contract and the existing consumer expectation. The migration from the global class to this variant must produce identical visual output — no regression.

---

## 5. Variants

### `default`

The standard navigational link. Inherits the text color from its parent (`color: inherit`). Hairline underline is always visible at rest as a discoverability signal. On hover the accent underline grows over the hairline from `0%` to `100%` width, communicating "you are targeting this." This is the behavior currently expressed by the global `a` selector.

Use on `--bg` or `--surface` contexts where full-contrast prose links are appropriate: body copy, card descriptions, editorial sections.

### `quiet`

Underline on hover only. No hairline at rest. Use for links that must read as text at rest but confirm as links on hover — navigation items where the link nature is implicit from context (e.g. a nav list where every item is clearly a link), or inline links in surfaces where the hairline would be visually noisy against a heavily structured layout.

The hover behavior is identical to `default` — the accent underline grows at `--dur-mid / --easing-link`. The only difference is the absence of the resting hairline.

### `muted-link`

Footer and secondary navigation register. `color: var(--fg-muted)` at rest. No underline. On hover: `color: var(--fg)`, plain color transition at `--dur-fast`. No underline animation.

This variant lifts the existing `.muted-link` global class from `tokens.css` lines 292–301 directly into the component. The visual output is a byte-for-byte match. This is the primary migration target for the backlog item recorded below.

**Backlog item to close: "Move `muted-link` (SiteShell.tsx:86) global class into Link CSS module."** The `.muted-link` global class in `tokens.css` is used in four locations today: `SiteShell.tsx:86` (nav links), `Footer.tsx:111` (footer nav links), `SiteShell.stories.tsx:43` (story fixture), and `a11y.test.tsx:709` (test fixture). After `<Link variant="muted-link">` ships, each of these sites should migrate to the DS atom. The global class must not be removed in the same PR — other consumers outside the DS (site repo) may reference it. The removal requires a separate audit PR with Arian's sign-off. This spec closes the design half of that backlog item; the engineer closes the implementation half.

---

## 6. Motion

The link underline grow is the only animated property on `<Link>`. It is the system's canonical link motion contract, already established in `tokens.css` and in `meta/brand.md` §Motion.

| Variant      | Property          | Duration     | Easing          |
| ------------ | ----------------- | ------------ | --------------- |
| `default`    | `background-size` | `--dur-mid`  | `--easing-link` |
| `quiet`      | `background-size` | `--dur-mid`  | `--easing-link` |
| `muted-link` | `color`           | `--dur-fast` | `ease`          |

This spec does not extend the motion contract. No new duration or easing token is introduced. The `--easing-link` token is reserved for this exact use case and must not be reused on other elements.

**Reduced-motion fallback.** Handled globally by the `@media (prefers-reduced-motion: reduce)` block in `tokens.css`, which collapses all `animation-duration` and `transition-duration` to `0.01ms`. No per-component reduced-motion override is needed.

**Hover media guard.** The `:hover` state must be wrapped in `@media (hover: hover)` to match the global `a:hover` convention in `tokens.css`. On touch devices that do not support hover, no underline grow fires and no color transition fires.

---

## 7. Accessibility

**Semantic element.** `<Link>` renders as `<a>`. It is a native anchor in the accessibility tree. No `role` override is needed or permitted.

**`href` is required.** A `<Link>` without `href` renders an `<a>` with no destination, which screen readers may announce inconsistently. The prop should be typed as required. See §8.

**Focus ring.** `2px solid var(--accent)`, `outline-offset: 4px`, `border-radius: var(--radius-1)` — matching the global `a:focus-visible` rule. The component's CSS module must not override this; the global rule is already correct and the atom inherits it. The component module should suppress the `a:focus` outline (`outline: none`) in the same way the global rule does, to prevent a double-ring on browsers that do not support `:focus-visible`.

**Contrast verification.**

- `default` / `quiet` variants: text color is inherited; the DS does not set it. Contrast is the caller's responsibility in context. On `--bg` (#FBFBFD) with the expected `--fg` (#1D1D1F) parent: 16.29:1 (AAA). Accent on hover: 4.54:1 on `--bg` (AA normal — at threshold; safe for body text).
- `muted-link` variant: `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.91:1 (AA normal). On hover: `--fg` (#1D1D1F) on `--bg` = 16.29:1 (AAA).
- Focus ring: `--accent` (#0071E3) outline — WCAG 1.4.11 non-text contrast satisfied on every surface.

**Keyboard interaction.** Native `<a>` behavior. `Tab` focuses; `Enter` activates. No custom key handlers.

**External-link security.** When `target="_blank"` is set, `rel="noopener noreferrer"` must be present to prevent tab-napping and referrer leakage. The component must apply this automatically: if `target="_blank"` is passed (via props or via `...rest`), the component merges `rel="noopener noreferrer"` onto the rendered element — unless the consumer has already passed an explicit `rel` value, in which case the consumer-supplied value wins (to support valid edge cases like `rel="noopener"` only). The merge logic is the engineer's implementation concern; the requirement is that a consumer who passes only `target="_blank"` gets the secure defaults without extra ceremony. See §8.

**Screen reader.** The accessible name is the visible text content — no `aria-label` is needed for standard usage. Consumers with icon-only links or non-descriptive text (e.g. "here") must add `aria-label` at the call site; the DS does not mandate or provide this.

---

## 8. Prop intent

- Consumers must be able to pass a required destination (`href`). An anchor without an `href` is not a link; the prop is required and the component must not render a navigational element without it.
- Consumers must be able to choose the visual register: `variant="default"` (two-layer underline, full discoverability signal), `variant="quiet"` (underline on hover only), or `variant="muted-link"` (footer / secondary nav — muted color, color transition only). Default is `"default"`.
- Consumers must be able to pass `className` for layout or minor context overrides. The DS does not own margin; `<Link>` has no outer margin. The parent positions it.
- Consumers must be able to pass `...rest` (standard `HTMLAnchorAttributes`) — `id`, `data-*`, event handlers, `aria-*`, `target`, `rel`, etc. — forwarded to the root `<a>`. The spread is open; `href` is not excluded (unlike `EmailLink`, where the href is computed — here the consumer owns the href value directly).
- Consumers must be able to compose `<Link>` with an arbitrary element (typically a Next.js or Remix `<Link>` component) using `asChild?: boolean`. When `asChild` is `true`, the DS renders a Radix `<Slot>` and merges all DS styles and event handlers onto the single child. The child receives the correct class(es), `rel` defaults, and any other DS-managed attributes. The consumer is responsible for passing exactly one child when `asChild` is set.
- The external-link `rel` default behavior (§7) is the DS's responsibility. The engineer must implement the merge so passing `target="_blank"` alone is secure by default.

Intent-level prop sketch (engineer designs the actual TypeScript API):

```
// INTENT ONLY — engineer designs the actual API
interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;                           // required — no anchor without a destination
  variant?: "default" | "quiet" | "muted-link";  // default: "default"
  asChild?: boolean;                      // default: false — Radix Slot composition
  className?: string;
  // ...rest AnchorHTMLAttributes — including target, rel, aria-*, data-*, etc.
}
```

`href` is required (unlike `EmailLink` where the href is computed). The engineer may choose to use `Omit` to re-declare `href` as non-optional if the base `AnchorHTMLAttributes` types it as optional. The intent is clear: no `<Link>` without a destination.

---

## 9. Composition rules

- `<Link>` is an inline atom. It composes into any flow context that accepts inline elements: paragraph copy, nav lists, card bodies, footer lines, caption text.
- `<Button asChild><Link href="…">label</Link></Button>` is an anti-pattern — `Button` already accepts `asChild` directly. Use `<Button asChild><a href="…">label</a></Button>` for button-styled links. `<Link>` is not a wrapper for `<Button>`; they are sibling primitives.
- `<Link asChild>` accepts a router component as its single child. The canonical Next.js pattern: `<Link asChild><NextLink href="/about">About</NextLink></Link>`. The DS component renders the Slot; Next.js Link owns the routing.
- Inside `<SiteShell>` nav: use `variant="muted-link"`. This is the direct replacement for the `"muted-link"` className currently applied at `SiteShell.tsx:86`.
- Inside `<Footer>` nav links: use `variant="muted-link"`. This is the replacement for the `"muted-link"` className at `Footer.tsx:111`.
- Inside prose body copy: use `variant="default"` (or inherit the default). The hairline underline is the discoverability signal for prose links — do not use `quiet` in body paragraphs where link nature may not be otherwise apparent.
- `<Link>` does not compose with `<Eyebrow>`, `<StatusBadge>`, or `<Tag>`. Those are non-interactive or self-contained display primitives.
- External links: pass `target="_blank"` on the `<Link>` directly. The component handles `rel="noopener noreferrer"` automatically (§7). No manual `rel` is needed in the common case.

---

## 10. Out of scope

- **Router abstraction.** The DS emits a plain `<a href>`. Framework-specific routing (`next/link`, Remix `<Link>`) is consumer-applied via `asChild`. This is a deliberate, permanent decision — the DS must remain framework-agnostic. This item is closed as "Won't" in the ROADMAP. Any proposal to add a `router` prop or bundle a specific router adapter will be rejected at the design level.
- **`visited` state styling.** No distinct `:visited` treatment. Same rationale as `EmailLink` — visited state creates false scent on navigational links in an SPA context where the same route appears across multiple surfaces and sessions. Treated identically to `:link`.
- **Active / current-page state.** `aria-current="page"` is the consumer's responsibility at the call site (SiteShell already sets `aria-current` on nav links). A visual "active" state (e.g. bold or underline-filled at rest) is a nav molecule concern, not a link atom concern. The Link atom has no `active` or `current` prop.
- **`rel` union type / validation.** The engineer accepts `rel` as a string passthrough. No exhaustive union type for the full list of valid rel values is specified — that is over-engineering for this atom.
- **Icon slots.** No leading or trailing icon slot. An icon beside a link text is an inline composition concern — the consumer places a `lucide-react` icon as a sibling inside `children`. The DS does not manage icon-to-text gap inside `<Link>`; if a gap is needed, the consumer applies it in the call site. An external-link diagonal-arrow icon convention belongs to a future `ExternalLink` atom.
- **Truncation / overflow.** Long link text in constrained containers is the consumer's responsibility. `<Link>` does not truncate or clamp.
- **Dark-mode variant overrides.** `--fg-muted`, `--fg`, `--accent`, and `--hairline` flip cleanly via the global dark-mode token override block in `meta/brand.md`. No per-component dark-mode CSS is needed.

---

## Handoff note for poukai-ds-engineer

This spec is `Approved`. Implementation can begin.

**Key implementation points:**

1. **`Link.tsx` root.** Use `forwardRef<HTMLAnchorElement, LinkProps>`. When `asChild` is `true`, render `@radix-ui/react-slot`'s `<Slot>` in place of `<a>` — identical pattern to `Button`. The `asChild` default is `false`.

2. **`href` required.** Declare `href: string` (non-optional) in `LinkProps`. If extending `AnchorHTMLAttributes<HTMLAnchorElement>` (which types `href` as optional), use `Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string }` as the base.

3. **`rel` merge for `target="_blank"`.** The component must inspect the resolved `target` prop. If `target === "_blank"` and no explicit `rel` was passed by the consumer, apply `rel="noopener noreferrer"` on the rendered element. If the consumer passed an explicit `rel`, use that value unchanged. Implement as a derived value before spreading — not a side effect.

4. **CSS module.** `Link.module.css` encodes three variant classes. The `default` variant CSS is a direct transcription of the existing global `a` rule in `tokens.css` lines 260–301 (minus the element selector — scoped to the component class). The `muted-link` variant CSS is a direct transcription of the global `.muted-link` rule in `tokens.css` lines 292–301. The `quiet` variant is a single-layer version of `default` (one gradient, no hairline). The module must suppress `text-decoration: none` on all variants so the global `a` rule does not double-underline.

5. **Focus ring.** Do not override `a:focus-visible` in the module — the global rule in `tokens.css` already provides the correct 2px `--accent` outline at 4px offset. The module should suppress `a:focus` (`outline: none`) consistent with the global rule, to prevent a double-ring.

6. **`muted-link` global class deprecation.** After `<Link variant="muted-link">` ships, file a follow-up issue to audit all `"muted-link"` className usages (confirmed locations: `SiteShell.tsx:86`, `Footer.tsx:111`, `SiteShell.stories.tsx:43`, `a11y.test.tsx:709`, `System.stories.tsx:434`, `SiteShellFull.tsx:31`, `Hero.stories.tsx:250`) and migrate each to `<Link variant="muted-link">` or `<EmailLink variant="muted">`. Do not remove the global class in the initial PR — the site repo may reference it.

7. **Story matrix** (engineer authors, per DS convention): Default variant inline in prose, Quiet variant in a nav context, MutedLink variant in a footer context, AsChild with a simulated router Link, ExternalLink (target=`_blank` — verify `rel` is auto-applied), FocusVisible (programmatic `.focus()`), AllVariants matrix.
