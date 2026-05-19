# Design spec: LinkCard

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<LinkCard>` is the canonical interactive card primitive. A tile that is itself a navigation affordance: the entire card surface is a single click target that routes the user. It is the correct primitive for index pages (`/work`, `/posts`, `/case-studies`) where each item in a grid is a navigational destination.

**Explicit contrast with neighbors:**

- `RoleCard` — structural, not interactive. No hover, no click target, no navigation semantics. RoleCard describes a role; LinkCard routes to a destination. Both coexist; RoleCard is not deprecated by this spec.
- `Button` — a single-line affordance. Communicates one action in minimal space. Not a content surface; carries no body copy, no eyebrow, no footer. Button is for "what happens when you click here"; LinkCard is for "where you go when you click here."
- `EmailLink` — an inline text link. Inline; not a block surface.

LinkCard is the answer when a navigational target needs to present enough context (category, title, summary) that a single-line link or a plain `<a>` tag would undersell it.

---

## 2. Anatomy

- **Root `<a>`** — the entire card is the interactive element. Default HTML element is `<a>`; when `asChild` is true the root becomes a Radix `Slot`, allowing the consumer to swap in a framework router `<Link>` (Next.js, Astro, React Router, etc.) without losing DS styling. This is identical to the `Button` `asChild` pattern. When `asChild` is false (the default), `href` is required; the engineer should emit a runtime warning in development if `href` is absent and `asChild` is false.

- **Eyebrow slot** (optional) — consumes `<Eyebrow>` atom with `variant="muted"`. String convention: when a `string` is passed, LinkCard wraps it in `<Eyebrow>` (same pattern as `<Section>`). When a `ReactNode` is passed, LinkCard renders it as-is. The consumer writes natural case; `<Eyebrow>` applies `text-transform: uppercase`. Sits at the top of the content stack.

- **Title** (required) — every LinkCard has a title; a navigational target without a title has no accessible name. Renders as `<h3>` by default; overridable via `titleAs` (`"h2" | "h3" | "h4"`) for heading hierarchy contexts. Typography: `--fs-card-title` (24–32px fluid, Geist sans, weight 500), `color: var(--fg)`. The `<h3>` default is correct for a grid of cards on a page that already has an `<h1>` (Hero) and an `<h2>` (Section title above the grid).

- **Body slot** (optional) — supporting copy below the title. Accepts `ReactNode` or a plain string (wrapped in `<p>` when a string). Color: `var(--fg-muted)`. Font: `--fs-body`. Line-height: `1.55` (body default). Body copy is read in the card context — it is not a full article excerpt. Two to three sentences maximum is the convention; the DS does not truncate, but consumers should use `-webkit-line-clamp` in their grid-level CSS if they need consistent card heights.

- **Footer slot** (optional) — a horizontal strip at the bottom of the card, separated from the body by a flex spacer (pushes footer to the bottom when cards are in a uniform-height grid context). Intended use: a trailing "Read more →" label, a tag list, a date string, or any short metadata strip. Renders as-is (ReactNode pass-through). When absent, no footer element is emitted.

- **Icon slot** (optional) — an icon positioned at the top-right corner of the card, absolutely positioned within the card's padding box. Intended use: `ArrowUpRight` from `lucide-react` to signal an outbound / external link. Consumer-supplied `ReactNode`; the DS does not own the icon instance. When `external` is true and no `icon` is passed, LinkCard does not auto-inject an icon — the convention is documented, not enforced by the component. This preserves consumer control over icon sizing and color. See §8 for the `external` behavior contract.

---

## 3. Tokens used

### Existing tokens — no changes

| Token                | Value                                       | Role                                                                    |
| -------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `--surface`          | `#F5F5F7`                                   | Card background (default variant)                                       |
| `--bg`               | `#FBFBFD`                                   | Card background (quiet variant — blends with page canvas)               |
| `--hairline`         | `#D2D2D7`                                   | Border color (default state); hairline rule top (quiet variant)         |
| `--hairline-w`       | `1px`                                       | Border width                                                            |
| `--accent`           | `#0071E3`                                   | Border color on hover/focus; focus ring                                 |
| `--accent-glow`      | `rgba(0,113,227,0.18)`                      | Focus ring offset fill (not used directly; referenced for spec clarity) |
| `--radius-3`         | `8px`                                       | Corner radius                                                           |
| `--space-8`          | `2rem` (32px)                               | Inset padding on all four sides                                         |
| `--space-2`          | `0.5rem` (8px)                              | Gap: eyebrow → title                                                    |
| `--space-4`          | `1rem` (16px)                               | Gap: title → body                                                       |
| `--space-6`          | `1.5rem` (24px)                             | Gap: body → footer                                                      |
| `--fs-card-title`    | `clamp(1.5rem, 1.15rem + 1.2vw, 2rem)`      | Title font size (24–32px)                                               |
| `--fs-body`          | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Body copy font size                                                     |
| `--fs-meta`          | `0.875rem`                                  | Eyebrow font size (owned by `<Eyebrow>`)                                |
| `--fg`               | `#1D1D1F`                                   | Title color; icon color                                                 |
| `--fg-muted`         | `#6E6E73`                                   | Body copy color; footer color                                           |
| `--font-sans`        | Geist stack                                 | Title font family                                                       |
| `--tracking-eyebrow` | `0.06em`                                    | Eyebrow letter-spacing (owned by `<Eyebrow>`)                           |
| `--lh-meta`          | `1.2`                                       | Eyebrow line-height (owned by `<Eyebrow>`)                              |
| `--dur-mid`          | `240ms`                                     | Hover transition duration                                               |
| `--dur-press`        | `80ms`                                      | Active press transition duration                                        |
| `--easing-link`      | `cubic-bezier(0.2, 0, 0, 1)`                | Hover transition easing                                                 |
| `--easing`           | `cubic-bezier(0.16, 1, 0.3, 1)`             | Active press easing                                                     |

### New tokens — none

No new tokens are introduced. The card hover interaction uses border-color shift to `--accent` — not a box-shadow lift. The rationale follows.

**Why no `--shadow-card-hover`.** A hover shadow lift is the generic SaaS card interaction pattern (Notion, Webflow, Framer). Apple's card surfaces (product tiles on apple.com, the App Store grid) use no hover shadow; interactivity is communicated through a subtle background shift and border-color change. Linear and Vercel product cards also rely on border-color transitions, not shadows. Introducing a shadow token for hover would push LinkCard toward the wrong aesthetic register. The border-color shift to `--accent` is:

1. On-brand — it uses the existing accent token in a non-text role, consistent with its usage on focus rings and status dots.
2. Sufficient — at 1px, a border-color change from `--hairline` to `--accent` is a perceptible and unambiguous hover signal.
3. Reversible — if a future consumer surface demonstrates that a shadow lift is warranted, the token can be introduced then with a real rationale. Starting without it keeps the vocabulary clean.

**Why `--surface` for the default card background rather than `--bg`.** Cards sit on the page canvas (`--bg`). A card that shares the page background color has no visual containment — it reads as an invisible group, not a tile. `--surface` (#F5F5F7) provides the minimum perceptible separation from `--bg` (#FBFBFD) that makes the card legible as a bounded surface. This is the same reasoning that guides code blocks and quote blocks to `--surface`. The delta is subtle (two steps on the elevation ladder) but present, which is exactly the Apple aesthetic: surfaces separate themselves from the page by the minimum necessary amount.

**Why `--space-8` (32px) inset padding.** The card's content needs enough breathing room that the boundary reads as a generous container, not a cramped one. `--space-6` (24px) was considered and rejected — at that padding, the border feels tight against the content on mobile. `--space-8` (32px) is the same inset used at the Hero text column's CTA-to-edge rhythm and is the right value for a container that presents a content surface rather than a utility action. At 32px inset, a grid of LinkCards will feel open and editorial without wasting viewport space.

---

## 4. Layout & rhythm

### Card structure

LinkCard is a flex column. The flex container stretches to fill its grid cell; the footer is pushed to the bottom via a flex spacer when a footer slot is present.

```
[card root — <a>, flex column, full height]
  ├── [icon — absolute top-right, within padding box]
  ├── [header block — eyebrow + title, flex column]
  │     eyebrow → title gap: --space-2 (8px)
  ├── [body — paragraph(s)]
  │     title → body gap: --space-4 (16px)
  ├── [spacer — flex: 1 — pushes footer to bottom]
  └── [footer — optional]
        body → footer gap: --space-6 (24px)
```

When no footer is present, the spacer is not rendered.

### Padding

`padding: var(--space-8)` (32px) on all four sides. No per-side variation. The icon slot does not affect padding — it is absolutely positioned within the padding box.

### Width and height

LinkCard has no minimum height set by the component. In a uniform-height grid context, the consumer applies `align-items: stretch` on the grid container and the card's `height: 100%` on the root element fills the cell. The DS spec intentionally leaves height as consumer-driven — forcing a `min-height` inside the component creates conflicts with content-rich vs. content-light instances in the same grid.

If the consumer needs all cards in a grid to share a uniform height (the common case for `/work` and `/posts` index pages), the recommended approach is CSS Grid with `align-items: stretch` and `height: 100%` on each LinkCard root. This is documented in the story matrix (§10).

### Title

Renders as `<h3>` by default. Typography: `--fs-card-title` (24–32px fluid), Geist sans, weight 500, `line-height: 1.3`, `letter-spacing: -0.005em`, `color: var(--fg)`, `margin: 0`. The `margin: 0` is explicit — the `h3` global rule in `tokens.css` has `margin: 0 0 var(--space-2)`; inside LinkCard's flex column, gap controls spacing, not element margin. The engineer must zero the title element's margin inside LinkCard's scope.

### Body

`--fs-body`, `--fg-muted`, `line-height: 1.55`. The body renders inside the flex column with no max-width cap — the card's own padding box constrains it. Consumers who need line-clamping apply `-webkit-line-clamp` at the grid or container level. No max-width is set inside the component.

### Icon

Positioned absolutely at `top: var(--space-8); right: var(--space-8)` — top-right corner, within the same inset as the card padding, so the icon lines up with the padding grid rather than floating against the raw border. The icon sits at the top-right of the content area, not of the border box. Icon size: consumer-controlled. Recommended `size={16}` or `size={18}` from `lucide-react` at the card's body-copy scale. The icon does not affect the flow of the header block because it is taken out of flow.

### Quiet variant adjustments

The `quiet` variant:

- Background: `--bg` (same as page canvas — no fill)
- Border: none
- Border-top: `var(--hairline-w) solid var(--hairline)` (hairline rule top only)
- Hover: border-top color shifts to `var(--accent)` (same single-property transition)
- Radius: `0` — rounded corners imply containment; without a border box, rounded corners are meaningless and would produce clipped corners on a surface that has no visible bounding shape. The quiet variant's interaction is the hairline rule, not the border box.
- Padding-inline: `0` — in the quiet variant, the card blends into the page column. Left and right padding at `--space-8` would push content away from the page's left edge, which looks wrong in a dense list context. Block padding (top + bottom) is retained at `--space-4` to maintain vertical rhythm between list items.

---

## 5. Variants

Two variants. A third is not introduced.

| Variant             | Background    | Border                 | Radius       | Hover signal                  | When to use                                                                                                      |
| ------------------- | ------------- | ---------------------- | ------------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `default` (default) | `--surface`   | `1px solid --hairline` | `--radius-3` | Border shifts to `--accent`   | Grid contexts. Cards that need visual containment: editorial index pages, `/work` case studies, `/posts` listing |
| `quiet`             | `--bg` (none) | Hairline rule top only | `0`          | Rule top shifts to `--accent` | Dense list contexts. When cards stack vertically and containment boxes would feel heavy                          |

The quiet variant exists because a bordered tile at `--radius-3` is correct for grid compositions but visually heavy in a dense vertical list. The `/work` index might use `default` in a 3-column grid; a `/posts` listing might use `quiet` in a single-column stack. The same LinkCard component should serve both without forking.

No third variant (`featured`, `hero-card`, etc.) is introduced. If a surface needs a card with a distinct visual treatment (e.g. a featured post with a large image slot), that is a different component — a `FeaturedCard` or a `MediaCard` — scoped by its own spec when a real consumer asks for it. Adding it here without a concrete surface would be speculative.

---

## 6. States

### Default variant

| State            | Visual                                                                                                   | Transition                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Default          | `--surface` bg, `1px solid --hairline`                                                                   | —                                                    |
| `:hover`         | Border color → `var(--accent)`. Background unchanged.                                                    | `border-color var(--dur-mid) var(--easing-link)`     |
| `:focus-visible` | Outline: `2px solid var(--accent)`, `outline-offset: 4px`, `border-radius: var(--radius-3)`              | No transition on focus (snap to visible immediately) |
| `:active`        | `transform: translateY(1px)`. Border color stays at `--accent` (hover is still active during press).     | `transform var(--dur-press) var(--easing)`           |
| `:visited`       | No distinct treatment. The card's state is determined by the destination page's content, not link color. | —                                                    |

### Quiet variant

| State            | Visual                                                     | Transition                                       |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| Default          | `--bg` (no fill), hairline rule top `1px solid --hairline` | —                                                |
| `:hover`         | Hairline rule color → `var(--accent)`                      | `border-color var(--dur-mid) var(--easing-link)` |
| `:focus-visible` | Outline: `2px solid var(--accent)`, `outline-offset: 4px`  | No transition on focus                           |
| `:active`        | `transform: translateY(1px)`                               | `transform var(--dur-press) var(--easing)`       |

### On active press — why yes

The whole card is the affordance. In the same way that `<Button>` presses `translateY(1px)` on `:active` to give the tap a physical register, LinkCard should press for the same reason: the tap target is the entire card surface, and a press response makes the interaction feel immediate and intentional. Without a press, tapping a large card surface on mobile can feel uncertain — "did it register?" The `--dur-press` (80ms) is deliberately faster than `--dur-fast` (180ms) to feel instantaneous rather than animated.

### Title underline on hover — no

The global `a` rule in `tokens.css` grows an underline via `background-size: 0% → 100%` on `:hover`. LinkCard suppresses this behavior on its root element and on all descendant elements within the card. The card is a block-level navigation surface; the underline-grow interaction is for inline text links. Applying the underline to the card title on hover would create a competing signal alongside the border-color shift — two simultaneous hover indicators on the same interaction. The border-color shift is the sole hover signal. The engineer must set `background-image: none` on the card root (and its children where applicable) to suppress the global `a` underline.

---

## 7. Motion

### Hover

```
transition: border-color var(--dur-mid) var(--easing-link)
```

`--dur-mid` (240ms) is appropriate for a surface-level state change. `--easing-link` (`cubic-bezier(0.2, 0, 0, 1)`) is the link-transition easing already used for the global `a` underline grow — it feels responsive without being abrupt. Using the same easing for the border transition keeps the system's hover register consistent.

### Active press

```
transition: transform var(--dur-press) var(--easing)
transform: translateY(1px)
```

`--dur-press` (80ms) is intentionally faster than all other transitions — this is tactile feedback, not an entrance or state animation. `--easing` (expo-out) on a 1px press is perceptibly snappy; the exit (releasing `:active`) uses the same value, which means the card snaps back quickly. This is correct.

### No entrance animation

LinkCard does not own its own entrance animation. Entrance sequences (stagger on scroll, fade-in) are owned by the parent grid or page composition layer. This matches the Section, Pull, and Eyebrow specs: atoms and molecules do not own their own entrance animation; they participate in parent-owned stagger sequences via `--dur-stagger-step` when the parent chooses to animate.

### Reduced-motion fallback

Handled globally by the `@media (prefers-reduced-motion: reduce)` block in `tokens.css`, which clamps all transition durations to `0.01ms`. No per-component override is needed.

---

## 8. Accessibility

### The card is one click target

The entire `<a>` element is the click target. This is intentional and correct. The implication:

**No nested interactive elements.** A `<button>` or `<a>` inside a LinkCard is a WCAG failure (interactive content nested inside an interactive element). If a consumer needs a footer with a tag that is itself a link, they need a different pattern — either a non-interactive presentation of tags inside LinkCard, or a bespoke card molecule that handles the nested-interactivity problem explicitly. The DS documents this constraint hard and does not attempt to solve nested interactivity within LinkCard.

### Accessible name

The card's accessible name is derived from its text content — eyebrow + title + body are all inside the `<a>`, so they all contribute to the computed accessible name. For a card with eyebrow "Design", title "Redesigning the onboarding flow", and body "A three-month project...", the accessible name to a screen reader is approximately "Design Redesigning the onboarding flow A three-month project...". This is verbose but correct — screen reader users navigating by links will hear the full context of the destination, which is better than a terse "Read more" accessible name with no context.

The consequence is that body copy should be meaningful rather than boilerplate. "Click to learn more." as the card body produces a poor accessible name. This is a content authoring rule, not a DS rule, but the spec documents it as a known implication.

### `external` prop

When `external` is true:

- `target="_blank"` — opens in a new tab.
- `rel="noopener noreferrer"` — security baseline for `target="_blank"`.
- A visually hidden `<span>` appended to the card's content with the text `"(opens in new tab)"` — this is the accessible signal pattern chosen over extending `aria-label`. Extending `aria-label` would require the engineer to reconstruct the full card text string in JavaScript (fragile, locale-unsafe). A visually hidden span is appended to the DOM and is read by screen readers as part of the link's accessible name automatically.

The visually hidden span implementation: `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0` — the standard visually-hidden pattern. The DS recommends extracting this as a utility in the engineer's implementation rather than inlining styles.

### `external` icon convention

When `external` is true, the conventional icon is `ArrowUpRight` from `lucide-react`. The DS does not auto-inject it (the consumer passes it via the `icon` slot), but the spec recommends it explicitly: the diagonal upward-right arrow has established meaning ("leaves this page") in web UI and is used consistently by Apple, Linear, and Vercel for outbound links. Recommended icon size: `16` or `18` at the card's body-copy scale.

### Focus ring

The `:focus-visible` ring targets the entire card element with `outline: 2px solid var(--accent); outline-offset: 4px`. For the `default` variant, `border-radius: var(--radius-3)` on the outline matches the card's corner radius so the ring contours the card shape. For the `quiet` variant, `border-radius: 0`.

Contrast: `--accent` (#0071E3) on `--bg` (#FBFBFD) = 4.54:1, which satisfies WCAG 1.4.11 non-text contrast (3:1 required for UI components). The focus indicator is a 2px ring — meets WCAG 2.4.11 (2.2 Enhanced) minimum focus appearance.

### Heading hierarchy

The `titleAs` default is `"h3"`. In the canonical composition — page with `<h1>` (Hero), section with `<h2>` (Section molecule), grid of cards beneath it — `<h3>` is correct. If a consumer renders LinkCards without a preceding `<h2>`, they must pass `titleAs="h2"`. This is the consumer's responsibility; the DS cannot enforce heading order at runtime but documents the expectation clearly.

### Contrast

All text pairings verified against the canonical light palette in `meta/brand.md`:

- `--fg` on `--surface` = 15.46:1 (AAA)
- `--fg-muted` on `--surface` = 4.66:1 (AA normal)
- `--fg` on `--bg` (quiet variant) = 16.29:1 (AAA)
- `--fg-muted` on `--bg` = 4.91:1 (AA normal)

---

## 9. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API
interface LinkCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  href?: string; // Required when asChild is false. Engineer emits dev warning if absent.
  asChild?: boolean; // Radix Slot pattern — swap root <a> for a framework router Link
  eyebrow?: string | React.ReactNode; // String → auto-wrapped in <Eyebrow>; ReactNode → pass-through
  title: React.ReactNode; // REQUIRED. Every LinkCard has a title.
  titleAs?: "h2" | "h3" | "h4"; // Default "h3". Override for heading hierarchy.
  body?: React.ReactNode; // Supporting copy. String → wrapped in <p>.
  footer?: React.ReactNode; // Footer strip. Pushed to bottom via flex spacer.
  icon?: React.ReactNode; // Top-right icon slot. Consumer-supplied. Conventional: ArrowUpRight.
  external?: boolean; // Adds target="_blank" rel="noopener noreferrer" + visually-hidden "(opens in new tab)"
  variant?: "default" | "quiet"; // Default "default".
}
```

**Prop-by-prop intent:**

- `href` — the navigation destination. Required unless `asChild` is true. When `asChild` is true, the consumer's child element (e.g. a Next.js `<Link>`) owns the `href`. The engineer emits a `console.error` in development when `href` is absent and `asChild` is false — a LinkCard with no `href` is a broken navigation affordance.

- `asChild` — Radix `Slot` pattern, identical to `Button`. When true, the first child element becomes the root — it receives all of LinkCard's styling and event handling. Consumer is responsible for passing a valid routing element (e.g. `<Link href="/work/project">` for Next.js). This is the canonical pattern for DS components that need to interoperate with framework routing without owning a router dep.

- `eyebrow` — category label above the title. String form: LinkCard wraps in `<Eyebrow variant="muted">`. ReactNode form: renders as-is. Decision rule: `typeof eyebrow === 'string'` — same discriminant as Section. When absent, no element is emitted.

- `title` — required. The card's primary content and the anchor of its accessible name. Renders as the element named by `titleAs`. Typography: `--fs-card-title`, weight 500. Margin zeroed inside LinkCard's flex scope.

- `titleAs` — controls heading element. Default `"h3"`. Valid values: `"h2" | "h3" | "h4"`. The engineer should not accept `"h1"` — a card is never a page's primary heading. The heading level is the consumer's responsibility; the prop makes intention explicit.

- `body` — body copy. When a `string`, LinkCard wraps in `<p>`. When a `ReactNode`, renders as-is (consumer owns the paragraph wrapper). When absent, no element is emitted.

- `footer` — renders inside a flex-pushed footer area. ReactNode pass-through. No DS styling applied — the footer's content (a label, a tag list, a date) determines its own typography. The engineer renders a wrapping `<div>` with `--fg-muted` color and `--fs-meta` font size as defaults; consumer can override via className on the footer content.

- `icon` — top-right icon. Absolutely positioned within the card's padding box. ReactNode pass-through. The DS provides the positioning shell; the consumer provides the icon. When absent, no icon shell is emitted.

- `external` — when true: adds `target="_blank"`, `rel="noopener noreferrer"`, and appends a visually-hidden `<span>(opens in new tab)</span>` to the card content. Does not auto-inject the `icon` slot — the convention is documented but not enforced.

- `variant` — `"default"` (bordered surface on `--surface`) or `"quiet"` (hairline top on `--bg`). Default `"default"`.

**What was trimmed and why:**

- `size` prop — rejected. LinkCard has one size. Padding and typography are appropriate for the navigational tile use case. A "compact" variant, if ever needed (e.g. a sidebar card), is a separate design problem requiring its own spec.
- `as` prop for the root element type — not applicable. The root is always `<a>` (or `Slot` via `asChild`). Unlike Section or Eyebrow, there is no legitimate non-`<a>` root for a navigational card.
- `imageSlot` / `media` — out of scope. See §11.

---

## 10. Composition rules

- **LinkCard inside a CSS Grid.** The canonical composition. The grid container controls columns, gap, and alignment; LinkCard fills its cell. Apply `align-items: stretch` to the grid and `height: 100%` to the LinkCard root so all cards in a row share the same height. The footer slot's flex spacer then pushes all footers to the same baseline across the row.

- **LinkCard inside `<Section>`.** `<Section>` owns the heading block (eyebrow + section title + lede) above the grid; LinkCard grid is the Section's children slot. Standard composition. `<Section titleAs="h2">` → grid of `<LinkCard titleAs="h3">` is the correct heading hierarchy.

- **LinkCard and `<Eyebrow>`.** The eyebrow slot consumes `<Eyebrow>` identically to Section — string → auto-wrap, ReactNode → pass-through. A consumer who passes a ReactNode takes responsibility for configuration; when passing a string, LinkCard enforces `variant="muted"` via its internal wrapping.

- **LinkCard and `<Button>`.** Do not put a `<Button>` inside a LinkCard. The entire card is already the interactive affordance; a nested Button creates illegal nested interactivity (see §8). If a card needs a secondary action (e.g. "Preview"), that is a different design pattern outside this spec.

- **Two LinkCard variants do not mix in the same grid.** Using `default` and `quiet` side by side in one grid produces an incoherent visual rhythm. The consumer picks one variant per grid context.

- **`asChild` and Next.js / Astro.** Canonical pattern: `<LinkCard asChild title="..."><Link href="/work/case">...</Link></LinkCard>`. The framework `<Link>` becomes the root element; LinkCard's styles are applied via the Radix Slot mechanism. The consumer must not pass both `href` and `asChild`; the engineer should emit a dev warning if both are present.

---

## 11. Out of scope

- **Image / media slot.** A card with a hero image, thumbnail, or aspect-ratio media block is a different primitive. `LinkCard` is text-first. If a `/work` index needs image tiles, that is a `MediaCard` or `PostCard` molecule spec filed separately when a real surface asks for it.

- **`variant="featured"`** — a larger, visually distinct card for a "featured post" or "hero item" in a grid. Out of scope. File a proposal with a real consumer surface.

- **Tag list inside the card as interactive links.** Tags inside a LinkCard must be non-interactive (plain text or a `<span>` list). Nested `<a>` elements are a WCAG failure. If interactive tags are needed, use a different layout pattern at the consumer level.

- **Skeleton / loading state.** Not specified. If a loading state is needed for an async-populated card grid, file a proposal. The placeholder approach (e.g. a `LinkCardSkeleton`) is a separate atom.

- **Disabled state.** A navigational card is either present or absent. There is no meaningful "disabled" state for a link tile. If a card should be non-interactive, the consumer renders it as a structural `<div>` (not LinkCard) or omits it.

- **Dark-mode per-component overrides.** `--fg`, `--fg-muted`, `--surface`, `--hairline`, `--accent` all flip cleanly via the global dark-mode token override in `tokens.css`. No per-component dark-mode overrides are needed.

- **Responsive variant switching** (e.g. `default` on desktop, `quiet` on mobile). Single variant per render. The consumer switches instances or uses a responsive wrapper class at their layer.

- **`title` as a required prop at runtime.** The engineer should enforce `title` as required at the TypeScript level (no `?`). A runtime check producing a visible warning in development is acceptable additional safety. A card without a title has no accessible name and must not ship.

---

## 12. Story matrix

| Story file                         | Story name          | Description                                                                                                                                                                                                     |
| ---------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LinkCard.stories.tsx`             | `Default`           | Full slots: eyebrow (string form) + title + body + footer ("Read more →"). Default variant. Verifies: card surface, border, padding, gap stack, footer push.                                                    |
| `LinkCard.stories.tsx`             | `TitleOnly`         | `title` only — no eyebrow, no body, no footer. Minimal card. Verifies the component renders without optional slots and the padding reads correctly with minimal content.                                        |
| `LinkCard.stories.tsx`             | `ExternalLink`      | `external` + `icon={<ArrowUpRight size={16} />}` + title + body. Verifies: `target="_blank"`, `rel="noopener noreferrer"`, visually-hidden "(opens in new tab)" in DOM, icon positioning at top-right corner.   |
| `LinkCard.stories.tsx`             | `QuietVariant`      | `variant="quiet"` + full slots. Verifies: no border box, hairline rule top only, no radius, left/right padding collapsed.                                                                                       |
| `LinkCard.stories.tsx`             | `HoverState`        | Default variant, programmatically set to `:hover` via Storybook `pseudo-states` addon (or a wrapper class). Verifies: border color shifts to `--accent`.                                                        |
| `LinkCard.stories.tsx`             | `FocusState`        | Default variant, programmatically focused. Verifies: `outline: 2px solid --accent`, `outline-offset: 4px`, radius matches card shape.                                                                           |
| `LinkCard.stories.tsx`             | `AsChildRouterStub` | `asChild` + a plain `<a href="#">` stub as the child. Verifies: the child element is the root (inspect DOM), all card styles are applied, no double-`<a>` nesting.                                              |
| `LinkCard.AllVariants.stories.tsx` | `AllVariants`       | Both variants side by side with full slots. The canonical design-matrix story.                                                                                                                                  |
| `LinkCard.AllVariants.stories.tsx` | `ThreeColumnGrid`   | Three `default` LinkCards in a CSS Grid (3 columns, `align-items: stretch`). Cards have varying body lengths to stress the footer-push alignment. Verifies all footers align to the same baseline across a row. |
| `LinkCard.AllVariants.stories.tsx` | `QuietList`         | Five `quiet` LinkCards stacked vertically (1-column list). Verifies density rhythm: hairline dividers separate items cleanly, block padding creates readable vertical intervals.                                |
| `LinkCard.AllVariants.stories.tsx` | `EyebrowNodeForm`   | `eyebrow={<Eyebrow variant="solid">Design</Eyebrow>}` (ReactNode pass-through). Verifies: ReactNode eyebrow renders as-is without a second Eyebrow wrapper.                                                     |
| `LinkCard.AllVariants.stories.tsx` | `TitleH2Override`   | `titleAs="h2"` + full slots. Verifies the title renders as `<h2>` and typography matches the heading hierarchy context.                                                                                         |

---

## 13. Open questions for the engineer

1. **Radix `Slot` version.** The `asChild` pattern requires `@radix-ui/react-slot` (the same dep used by `Button`). Confirm the version already in `package.json` satisfies the Slot API used here — no new dep should be needed.

2. **`title` as required prop vs. TypeScript.** The prop interface has `title: React.ReactNode` (no `?`). TypeScript will enforce this at compile time. An additional `process.env.NODE_ENV === 'development'` runtime warning is optional but recommended for consumers who bypass TypeScript (e.g. in `.jsx` files or plain JS). Engineer's call on whether to add the runtime guard.

3. **Visually-hidden span implementation.** The `external` prop appends a visually-hidden `<span>(opens in new tab)</span>`. The recommended pattern is a shared utility class (`.sr-only` or equivalent) rather than inline styles. Confirm whether the DS already has a shared visually-hidden utility (e.g. in `tokens.css` or a global utilities file); if not, the engineer should add one in the same PR as LinkCard.

4. **Suppressing the global `<a>` underline.** `tokens.css` applies a `background-image` underline animation to all `a` elements. LinkCard's root is an `<a>` and must suppress this: `background-image: none; padding-bottom: 0` on the card root and `background-image: none` on any descendant `<a>` elements inside the card (none expected, but defensive reset). Confirm this does not create a specificity problem with the global rule — the engineer may need a class selector.

5. **`href` absent warning.** When `asChild` is false and `href` is absent, a `console.error` in development is the recommended signal. Confirm the error message is descriptive: `'[LinkCard] href is required when asChild is false. Provide an href or set asChild={true} and pass a framework Link as the child.'`

6. **Footer wrapper styling.** The spec says the footer wrapper defaults to `--fg-muted` color and `--fs-meta` size. These are defaults on a `<div>` container — the consumer's footer ReactNode can override them. Confirm whether these defaults belong on the wrapper `<div>` or should be documented as consumer responsibility. The argument for applying them on the wrapper: footer content is typically metadata (date, tags, "Read more →") which should default to the muted register without the consumer specifying it every time. The argument against: the ReactNode might already carry explicit typography, making the wrapper defaults redundant. Recommendation: apply `color: var(--fg-muted); font-size: var(--fs-meta)` on the footer wrapper, which the consumer's content can override via inherited specificity.

7. **`icon` slot shell emission.** When `icon` is absent, no shell element is emitted. When `icon` is present, an absolutely-positioned wrapper `<div>` is emitted containing the icon ReactNode. Confirm the wrapper takes `pointer-events: none` — the icon is a visual affordance, not an interactive target. The click target is the card root, not the icon.

8. **CSS module scope for `background-image: none`.** The global `a` rule is defined in `tokens.css` (not in a CSS module), so it has low specificity. A class selector in `LinkCard.module.css` targeting `.root` should override it without needing `!important`. Verify this holds across the build pipeline (Vite/CSS Modules specificity handling).
