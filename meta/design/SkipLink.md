# Design spec: SkipLink

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<SkipLink>` is the keyboard-navigation escape hatch — the standard "Skip to content" anchor that lets keyboard and screen-reader users bypass repeated chrome (navigation, header, shell) and land directly at the main content area. It is visually hidden at rest so it does not intrude on the visual layout; it becomes a visible, fixed-position focus pill when it receives keyboard focus.

This atom exists because `SiteShell` and `DocsLayout` both require a skip link as a baseline accessibility primitive. Without a DS-level atom, each layout would author its own implementation — diverging in clip pattern, pill styling, and z-index management. Centralising here ensures the clip technique, the `--fg`/`--bg` inversion pair, the z-ordering, and the no-motion rationale are decided once and expressed consistently across every layout that uses the shell.

SkipLink is the first focusable element when placed at the top of a layout shell. That placement rule is a usage contract, not an implementation detail of the atom itself — see §11 (Usage rules).

---

## 2. Anatomy

- **Root element**: `<a>`. Non-polymorphic. No `as` prop. Fragment navigation is an anchor concern; the semantic element is fixed.
- **Link label**: `children`. Defaults to the string `"Skip to content"`. `ReactNode` for parity, but the idiomatic usage is a plain string that names the action clearly.
- **Rest state**: visually hidden via the canonical sr-only clip pattern. The element is present in the DOM and in the accessibility tree at all times; only its visual rendering is suppressed.
- **Focused state**: a fixed-position pill that appears in the top-left of the viewport when the anchor receives keyboard focus. The pill uses `--fg` as background and `--bg` as text — DS-wide max-contrast inversion pair.

There is no icon slot. No badge. No trailing affordance. The link label is the only content.

---

## 3. Tokens used

No new tokens are introduced. All styling uses existing tokens, with two raw-literal stand-ins documented as token gaps in §14.

| Token        | Value (light)  | Role in focused pill                              |
| ------------ | -------------- | ------------------------------------------------- |
| `--fg`       | `#1D1D1F`      | Focused pill background — max-contrast inversion  |
| `--bg`       | `#FBFBFD`      | Focused pill text color — max-contrast inversion  |
| `--space-2`  | `0.5rem` (8px) | Pill top/left position offset; pill block padding |
| `--space-4`  | `1rem` (16px)  | Pill inline padding                               |
| `--radius-2` | `4px`          | Pill corner radius                                |
| `--fs-meta`  | `14px` (fixed) | Pill font size — action affordance, meta register |

**Raw-literal stand-ins (token gaps — see §14):**

- `font-weight: 500` — no `--font-weight-*` tokens exist in the DS.
- `box-shadow: 0 4px 12px rgb(0 0 0 / 0.08)` — same raw value as Toast; no `--shadow-elevated` token exists.

### Token decisions

**`--fg` / `--bg` for the focused pill.**

The pill background is `--fg` (`#1D1D1F` light / `#F5F5F7` dark); pill text is `--bg` (`#FBFBFD` light / `#1C1C1E` dark). This is the DS-wide maximum-contrast inversion pair. Light mode: `#FBFBFD` on `#1D1D1F` ≈ 16.29 : 1 (AAA). Dark mode: `#1C1C1E` on `#F5F5F7` ≈ 17.85 : 1 (AAA). The pill is legible at the highest possible contrast in both modes without introducing any new color token.

**`--fs-meta` (14px) for pill font size, not `--fs-micro` (12px).**

`--fs-micro` is the uppercase-label register, always paired with `text-transform: uppercase` and `--tracking-micro`. SkipLink is an action affordance — it tells the user "press Enter to skip." That register is `--fs-meta`: secondary UI text (captions, nav labels, badge text, attributions). The same reasoning applies to `Tag` and `Kbd`, both of which use `--fs-meta` for interactive or action-oriented chips. Using `--fs-micro` here would make the skip link read as a label rather than an action.

**No outline on the focused pill.**

The global `a:focus-visible` rule applies a `2px solid --accent` outline with `2px offset`. That rule is suppressed for SkipLink's focused state. The `--fg` chip background is itself the focus indicator — a high-contrast `#1D1D1F` rectangular region appearing against `--bg` is unambiguous as a focus event. Stacking the `--accent` ring on top produces double-indicator noise: two competing signals (the chip materialising + the blue ring) that reduce rather than improve clarity. This is an explicit, documented deviation from the global focus rule. The engineer sets `outline: none` on the `.focused` class.

---

## 4. Layout & rhythm

### Rest state (sr-only clip pattern)

The rest-state CSS is the canonical sr-only technique, copied verbatim from `VisuallyHidden.module.css`. SkipLink owns this directly in its own module — it does not compose or re-export `VisuallyHidden`. Both states (rest and focused) live in one CSS module because the focus transition must un-clip the same element; splitting across modules would require fighting specificity.

The same a11y-constant comment from `VisuallyHidden.module.css` is reproduced in `SkipLink.module.css`:

> These values are fixed a11y constants, NOT design tokens. They are drawn from the WCAG / Bootstrap / Tailwind canonical sr-only technique and must not be replaced with token references. `margin: -1px` is load-bearing: it prevents the 1×1px ghost element from contributing to scroll dimensions in some browser/layout combinations. `clip` is the legacy property for older browser compat. `clip-path: inset(50%)` is the modern equivalent — both are applied for maximum coverage.

| Property      | Rest value         | Notes                                 |
| ------------- | ------------------ | ------------------------------------- |
| `position`    | `absolute`         | A11y constant — see comment above     |
| `width`       | `1px`              | A11y constant                         |
| `height`      | `1px`              | A11y constant                         |
| `padding`     | `0`                | A11y constant                         |
| `margin`      | `-1px`             | A11y constant — prevents scroll ghost |
| `overflow`    | `hidden`           | A11y constant                         |
| `clip`        | `rect(0, 0, 0, 0)` | A11y constant — legacy coverage       |
| `clip-path`   | `inset(50%)`       | A11y constant — modern coverage       |
| `white-space` | `nowrap`           | A11y constant                         |
| `border`      | `0`                | A11y constant                         |

### Focused pill state (`:focus-visible` override)

| Property          | Value                           | Source                          |
| ----------------- | ------------------------------- | ------------------------------- |
| `position`        | `fixed`                         | Overlay above all layout chrome |
| `top`             | `var(--space-2)` (8px)          | Token                           |
| `left`            | `var(--space-2)` (8px)          | Token                           |
| `z-index`         | `9999`                          | Raw literal — see §14           |
| `width`           | `auto`                          | Un-clip                         |
| `height`          | `auto`                          | Un-clip                         |
| `clip-path`       | `none`                          | Un-clip                         |
| `clip`            | `auto`                          | Un-clip                         |
| `overflow`        | `visible`                       | Un-clip                         |
| `white-space`     | `normal`                        | Un-clip                         |
| `margin`          | `0`                             | Un-clip                         |
| `padding`         | `var(--space-2) var(--space-4)` | 8px block, 16px inline          |
| `background`      | `var(--fg)`                     | Max-contrast inversion          |
| `color`           | `var(--bg)`                     | Max-contrast inversion          |
| `border-radius`   | `var(--radius-2)` (4px)         | Token                           |
| `box-shadow`      | `0 4px 12px rgb(0 0 0 / 0.08)`  | Raw literal — token gap (§14)   |
| `font-family`     | inherit                         | Body font, no override needed   |
| `font-size`       | `var(--fs-meta)` (14px)         | Token                           |
| `font-weight`     | `500`                           | Raw literal — token gap (§14)   |
| `text-decoration` | `none`                          | No underline on the pill        |
| `outline`         | `none`                          | Suppresses global focus ring    |
| `border`          | `0`                             | No border on pill               |

**z-index rationale.** Dialog layers at 100/101; Toast layers at 200. SkipLink at 9999 ensures it is never occluded by any DS surface, including any future organism that stacks between 200 and the system UI. A skip link buried under a dialog or sheet is an a11y violation. The value is intentionally high and documented here rather than left as a magic number in the module.

---

## 5. States

| State            | Visual                                                                                                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rest             | Visually hidden via sr-only clip pattern. Present in DOM and accessibility tree.                                                                                                                |
| `:focus-visible` | Fixed-position pill: `--fg` background, `--bg` text, `--radius-2` corners, `--space-2`/`--space-4` padding, `0 4px 12px rgb(0 0 0 / 0.08)` shadow. No outline.                                  |
| Active           | No distinct active style. The click/Enter activation navigates instantly; a transient pressed state adds no clarity.                                                                            |
| Hover            | No hover style. SkipLink is only reachable by keyboard in normal use. A hover state would be visible only if a user mouses over the 1×1px clip region, which is not a real interaction pattern. |
| Disabled         | Not applicable. SkipLink is always active.                                                                                                                                                      |

---

## 6. Motion

None. The pill appears instantly on `:focus-visible` — no transition, no fade, no slide-in.

**Rationale.** A skip link is a navigational utility, not a decorative transition moment. Users who reach this element via keyboard are navigating with intent. Delaying the pill's appearance by even 150ms adds latency to a control that should respond immediately. The brand motion principle (purposeful, not decorative) applies here by pointing toward zero motion, not toward any transition.

**Reduced-motion posture.** There is nothing to suppress. The global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` has no effect on this atom because no transition is defined.

---

## 7. Accessibility

**Semantic element: `<a href="...">`.**

An anchor with a valid `href` is natively focusable, included in the tab order, and announced by screen readers as a link. No ARIA attributes are needed on the root element — the native semantics are correct and complete. `aria-*` props are not placed on the root anchor by the DS; consumers inherit `AnchorHTMLAttributes` and may add them if needed for non-standard use cases.

**Accessible name.**

The anchor's accessible name is its text content (`children`). The default `"Skip to content"` is the widely-recognised phrasing. Screen readers announce it as "Skip to content, link" (or similar, AT-dependent). No `aria-label` is needed.

**Tab order and placement.**

The skip link must be the first focusable element in the document when placed at the top of the shell. This is a placement rule for consumers, not an internal enforcement (see §11). When placed correctly, the first Tab keystroke from any page lands on the skip link; a second Tab moves to the first interactive element in the shell chrome (e.g. navigation).

**Contrast verification.**

Focused pill: `--bg` (`#FBFBFD`) text on `--fg` (`#1D1D1F`) background = **16.29 : 1** (AAA). Dark mode: `--fg` (`#F5F5F7`) text on `--bg` (`#1C1C1E`) background = **17.85 : 1** (AAA). Both modes exceed AAA at every text size. The contrast is a structural property of the `--fg`/`--bg` inversion — it cannot be broken by a token update unless the primary neutral ramp itself is altered, which is a brand-level change requiring Arian's approval.

**No-outline deviation.**

As documented in §3, the global `a:focus-visible` outline is suppressed on the focused pill. The pill itself is the focus indicator. The DS is explicit that this is a deliberate deviation, not an accidental suppression. Engineers must not restore the outline under the impression it was omitted by mistake.

**axe / screen-reader posture.**

Zero axe violations expected in both rest and focused states:

- Rest: the element is in the accessibility tree with a valid accessible name. It is not hidden from AT (`aria-hidden` is never set; `display: none` / `visibility: hidden` are never used — the clip pattern keeps the element AT-visible).
- Focused: fully rendered visible link with high-contrast text. No colour-contrast violations, no missing name, no missing role.

**Keyboard interaction.**

Native `<a>` behavior — `Tab` focuses; `Enter` activates (navigates to `href`). No custom key handlers. No `Space` activation (anchors, not buttons).

---

## 8. Prop intent

- `href: string` — required. Consumer supplies the fragment target (`"#main"`, `"#content"`, `"#docs-content"`, etc.). The DS does not compute or default this value — different layouts use different IDs and the atom must not assume any particular one.
- `children?: React.ReactNode` — defaults to the string `"Skip to content"`. Consumers who use a different language or a different phrasing supply their own label.
- `className?: string` — merged with the internal class via `clsx`. Allows consumers to apply layout-level adjustments if needed (rare).
- All remaining `AnchorHTMLAttributes<HTMLAnchorElement>` are forwarded to the root `<a>`. `ref` forwards to `HTMLAnchorElement`.

**The DS does not expose a `label` prop or a `target` alias.** `href` is the standard anchor attribute; using it directly is clearer than aliasing it. `children` is the standard content slot; a separate `label` prop would duplicate it.

**No `as` prop, no `asChild`, no polymorphism.** Fragment navigation is anchor semantics. A skip link that renders as a `<button>` or a `<span>` is both semantically wrong and functionally broken (buttons don't navigate to fragments natively; spans are not focusable). The element is `<a>` and that is not negotiable.

---

## 9. Composition rules

- **SkipLink + SiteShell.** SkipLink is placed as the first child of the `<SiteShell>` root element, before the navigation and header children. The shell's main content region must carry the matching `id` (e.g. `id="main"`). The SiteShell migration that adds SkipLink is a separate follow-up PR — do not edit SiteShell in this change.
- **SkipLink + DocsLayout.** Same placement rule: first child of the layout root; the docs main region carries `id="docs-content"` (or equivalent).
- **SkipLink does not compose with other atoms.** It renders no child DS components. The label is plain text (or a consumer `ReactNode`); no `Icon`, `Tag`, `Badge`, or other atom belongs inside a skip link.
- **Multiple SkipLinks.** A single page may contain more than one skip link if the layout has multiple navigable regions (e.g. "Skip to main content" + "Skip to sidebar nav"). Each has a distinct `href` and distinct `children`. They stack in source order; the last one in the tab order is the one closest to the main region. This is a rare composition — most pages need exactly one.
- **SkipLink is not a general navigation link.** It does not participate in the navigation molecule. It is not a `NavLink` variant. It is a single-purpose a11y utility and should never appear in visible navigation menus.

---

## 10. Out of scope

- **`as` prop / polymorphism.** Fixed `<a>`. Not revisitable — the semantic is definitional.
- **Computed `href`.** The DS does not know the consumer's DOM structure. `href` is always explicit.
- **Animated entrance.** Instant reveal is intentional. No fade, slide, or scale entrance will be added — the motion principle argues against it, not for it.
- **`:hover` style.** Not a hover-reachable control in real use. A hover style would be visible only when mousing over a 1×1px clip region, which is not a user-facing interaction.
- **`disabled` state.** Not applicable.
- **Icon variant.** No icon belongs in a skip link. The label carries the full meaning.
- **Tone or variant props.** One visual register. The `--fg`/`--bg` inversion is the only correct treatment for a max-contrast focus indicator.
- **Dark-mode per-component override.** Handled by the global dark-mode token block in `tokens.css`. `--fg` and `--bg` flip automatically; the inversion relationship is preserved.
- **RTL.** The `left` position offset is a raw fixed value. If RTL is added to the DS in the future, this atom will need a `dir`-aware update (`inset-inline-start` instead of `left`). Flagged here for the RTL pass; not in scope now.

---

## 11. Usage rules / placement

**Rule 1: first focusable element.**

SkipLink must be the first focusable element in the document. Place it as the first child of the layout shell root — before any `<nav>`, `<header>`, logo, or interactive chrome. If it is not first, keyboard users Tab through intervening focusable elements before reaching it, defeating its purpose.

```tsx
// Correct
<SiteShell>
  <SkipLink href="#main" />
  <nav>...</nav>
  <main id="main">...</main>
</SiteShell>

// Wrong — skip link placed after navigation
<SiteShell>
  <nav>...</nav>
  <SkipLink href="#main" />
  <main id="main">...</main>
</SiteShell>
```

**Rule 2: matching `id` on the target.**

The element referenced by `href` must exist in the DOM and carry the matching `id`. If `href="#main"` and no element has `id="main"`, the link navigates nowhere — the user presses Enter and focus does not move. The DS cannot enforce this at type level; consumers are responsible for the contract.

**Rule 3: one per layout.**

One SkipLink per layout root. Multiple layout roots on the same page (e.g. a docs layout with a sidebar layout) may each have their own SkipLink targeting their respective main regions, but a single layout shell should not contain more than one.

**Rule 4: do not hide from AT.**

Never set `aria-hidden="true"`, `display: none`, or `visibility: hidden` on a SkipLink. The clip pattern keeps the element visually hidden while remaining in the accessibility tree. Hiding it from AT removes the only programmatic skip mechanism from the page.

---

## 12. Examples (described in prose)

**Example A — SiteShell integration.**

A `<SiteShell>` renders `<SkipLink href="#main" />` as its first child. The shell's main content region is `<main id="main">`. On page load, the user presses Tab; the focused pill appears top-left (`"Skip to content"`). The user presses Enter; focus moves to `#main`. The user presses Tab again; focus enters the main content region's first interactive element (e.g. the first article link). The pill is not visible again until Tab wraps back to the skip link.

**Example B — DocsLayout with custom label.**

A docs layout uses `<SkipLink href="#docs-content">Skip to documentation</SkipLink>`. The label overrides the default to be more specific to the page context. The `id="docs-content"` is on the `<article>` that renders the markdown content. Behavior is otherwise identical to Example A.

**Example C — Two skip links for a split layout.**

A layout with a persistent sidebar and a main panel uses two skip links:

```
<SkipLink href="#main-content">Skip to main content</SkipLink>
<SkipLink href="#sidebar-nav">Skip to sidebar navigation</SkipLink>
```

The first is first in source order (Tab order). Both are visually hidden at rest; each becomes a pill when focused. The consumer owns the ordering decision.

---

## 13. Composition with SiteShell

The SiteShell migration that wires `<SkipLink>` into the shell is a **separate follow-up PR**. This spec authorises the atom; the SiteShell update is an engineer task that should reference this spec and implement the placement described in §11.

The SiteShell engineer will:

1. Add `<SkipLink href="#main" />` as the first child of the shell's root element.
2. Ensure the shell's main content wrapper carries `id="main"` (or confirm which ID is already used and adjust `href` accordingly).
3. Verify that no existing focusable element (e.g. an existing anchor or button) precedes the SkipLink in the DOM.

No changes to `SiteShell.tsx` or its spec are authorised in this change.

---

## 14. Token gaps

Three raw literals are used in this spec. All three are documented here for the DS engineer and for the future token-addition pass.

**1. `font-weight: 500`.**

No `--font-weight-*` tokens exist in the DS. The raw value `500` is used throughout (Kbd, Tag, and now SkipLink all share this weight). When the DS adds a `--font-weight-medium: 500` token, these three atoms should migrate to it in the same change.

**2. `box-shadow: 0 4px 12px rgb(0 0 0 / 0.08)`.**

This is the same value used by Toast (the other elevated, fixed-position surface in the DS). Both surfaces share the "elevated chip that appears above the page" visual register and should share a token. When `--shadow-elevated` (or similar) is added, both SkipLink and Toast migrate to it. Until then, the raw literal is the correct implementation — do not invent a local variable in the CSS module.

**3. `z-index: 9999`.**

The DS has no `--z-*` token scale. Dialog = 100/101; Toast = 200; SkipLink = 9999. The value is high by design (see §4, z-index rationale). When the DS adds a z-index scale, SkipLink should be assigned the topmost rung. Until then, the raw literal `9999` is correct. Do not reduce this value without explicit approval — a skip link occluded by any DS surface is an a11y regression.

---

## 15. Open questions

None. All design decisions were resolved in the prior session and are carried forward verbatim in this spec. The engineer may implement immediately against this document.
