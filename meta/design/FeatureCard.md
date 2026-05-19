# Design spec: FeatureCard

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<FeatureCard>` is the canonical feature tile for capability and service surfaces. It presents a single feature, capability, or benefit as a bounded content object: an optional icon, optional eyebrow, required title, required body, and optional footer. It is the answer when a `/services`, `/capabilities`, or `/features` page needs to present a grid of distinct items that are not navigational destinations and carry no sequential numbering.

**Explicit contrast with siblings:**

- `RoleCard` — carries "Role 01 / 02 / 03" sequencing semantics and a numeraled eyebrow. FeatureCard has no ordinal; items are peers, not a sequence.
- `LinkCard` — the entire tile is an interactive navigation affordance. FeatureCard is structural only; it has no click target, no hover state, no routing semantics. For an interactive feature tile that links somewhere, use LinkCard.
- `Principle` / `FailureMode` — ordered editorial atoms with numeral headings. FeatureCard is unordered and carries prose body copy, not an aphorism or failure description.

FeatureCard is the correct primitive when: the page author wants to lay out a grid of features, each with an icon, a short label, and one to three sentences of description, and none of those tiles need to be clicked to navigate anywhere.

---

## 2. Anatomy

FeatureCard's root element is `<article>` by default, polymorphic via `as`. It has six named zones: four optional, two required.

- **Root element** (`<article>` default, polymorphic via `as`: `"article" | "section" | "div" | "li"`). `<article>` is semantically correct for a self-contained, independently distributable feature description. `"li"` is explicitly included because feature grids are often marked up as `<ul>` lists of capabilities — each tile as a `<li>` is the semantically correct structure in that context. The forwarded ref targets this element.

- **Icon slot** (optional): a `ReactNode` positioned at the top of the content stack, before the eyebrow. Consumer-supplied — typically a `lucide-react` icon. FeatureCard does not size or color the icon beyond setting `color: currentColor` (so the icon inherits the card's foreground color). Recommended icon sizes from `lucide-react`: `size={24}` or `size={32}`. The consumer is responsible for passing `aria-hidden` on the icon node — it is a decorative reinforcement of the title, not semantic content. No icon shell `<div>` wrapper adds accessible semantics; the wrapper is presentational only.

- **Eyebrow slot** (optional): a contextual label between the icon and the title. String convention: when a `string` is passed, FeatureCard wraps it in `<Eyebrow variant="muted">` — identical to the convention in `<Section>`, `<LinkCard>`, and `<TeamCard>`. When a `ReactNode` is passed, FeatureCard renders it as-is (no double-wrapping). Decision rule: `typeof eyebrow === 'string'` → wrap; else → render directly.

- **Title slot** (required): the feature's name. Renders as `<h3>` by default; overridable via `titleAs` (`"h2" | "h3" | "h4"`). Typography: inherits the global `h3` rule from `tokens.css` (Geist sans, `font-size: 1.125rem`, weight 500, line-height 1.3, letter-spacing -0.005em). The `<h3>` default is correct for a grid of tiles under a `<Section>` (h2) on a page with a `<Hero>` (h1). The engineer must zero the title element's bottom margin inside FeatureCard's flex-column scope and let `gap` govern spacing — the global `h3` rule applies `margin: 0 0 var(--space-2)` which double-stacks with flex gap.

- **Body slot** (required): the feature description. Accepts a `string` (wrapped in `<p>`) or a `ReactNode` (rendered as-is). Color: `var(--fg-muted)`. Font: `--fs-body` at the body line-height 1.55. One to three sentences is the editorial convention; the DS does not truncate. When a string is passed, FeatureCard wraps it in `<p style="margin: 0">` — the global `p` rule applies `margin: 0 0 var(--space-4)` which must not compound inside the flex column.

- **Footer slot** (optional): accepts any `ReactNode`. Typical contents: a small "Learn more →" text link, a metric, or a short tag. Rendered as-is; no DS styling is applied to the footer content beyond the wrapper defaults specified in §4. When absent, no element is emitted and no gap is created.

---

## 3. Tokens used

No new tokens. FeatureCard is constructed entirely from the existing vocabulary.

| Token                | Value                                       | Role                                                                                        |
| -------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--space-6`          | `1.5rem` (24px)                             | Gap: icon → eyebrow (when both present); gap: icon → title (no eyebrow); gap: body → footer |
| `--space-2`          | `0.5rem` (8px)                              | Gap: eyebrow → title                                                                        |
| `--space-3`          | `0.75rem` (12px)                            | Gap: title → body                                                                           |
| `--space-6`          | `1.5rem` (24px)                             | Inset padding (all four sides) — `default` variant                                          |
| `--surface`          | `#F5F5F7`                                   | Card background — `bordered` variant only                                                   |
| `--hairline`         | `#D2D2D7`                                   | Border color — `bordered` variant only                                                      |
| `--hairline-w`       | `1px`                                       | Border width — `bordered` variant only                                                      |
| `--radius-3`         | `8px`                                       | Corner radius — `bordered` variant only                                                     |
| `--fg`               | `#1D1D1F`                                   | Title color (inherited from global h3); icon color via currentColor                         |
| `--fg-muted`         | `#6E6E73`                                   | Body copy color; footer wrapper default color                                               |
| `--font-sans`        | Geist stack                                 | Title font family (inherited from global h3)                                                |
| `--fs-body`          | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Body copy font size                                                                         |
| `--fs-meta`          | `0.875rem` (14px)                           | Footer wrapper default font size                                                            |
| `--tracking-eyebrow` | `0.06em`                                    | Eyebrow letter-spacing (owned by `<Eyebrow>`)                                               |
| `--lh-meta`          | `1.2`                                       | Eyebrow line-height (owned by `<Eyebrow>`)                                                  |

**Padding decision: `--space-6` (24px) for the `default` variant.**

LinkCard uses `--space-8` (32px) because it is a navigational surface with bordered containment — the 32px inset reinforces its presence as a tile you click into. FeatureCard is structural and lighter; the default variant is transparent and borderless, so the padding's job is to give the content internal breathing room when the `bordered` variant is used, and to serve as a consistent gutter when tiles sit in a grid. `--space-6` (24px) is the correct value: generous enough to feel considered, lighter than LinkCard's 32px to reflect the difference in visual weight.

**Background decision: transparent (`default`), `--surface` (`bordered`).**

The default variant has no background color — it reads as content tiles on the page canvas, not as chrome tiles. This is the register of TeamCard (also padding-less and surface-less by default) and is appropriate for feature grids where the page background itself provides the context. The `bordered` variant adds `--surface` background and a `--hairline` border for surfaces that want visual containment.

**Border decision: none (`default`), `1px solid --hairline` (`bordered`).**

A borderless default keeps FeatureCard lighter than LinkCard, which always has a border. The two primitives should read differently at a glance: a grid of FeatureCards should feel like a content layout, not a card-UI.

---

## 4. Layout & rhythm

FeatureCard is a flex column, start-aligned. All content stacks top-to-bottom with explicit gap values. No min-height. Max-width is left to the parent grid — FeatureCard never constrains its own width.

```
[root — flex column, start-aligned]
  ├── [icon slot — optional]
  │     icon → eyebrow gap: --space-6 (24px)  [when eyebrow present]
  │     icon → title gap:   --space-6 (24px)  [when no eyebrow]
  ├── [eyebrow — optional, <Eyebrow variant="muted">]
  │     eyebrow → title gap: --space-2 (8px)
  ├── [title — required, <h3> default]
  │     title → body gap: --space-3 (12px)
  ├── [body — required, <p> or ReactNode]
  │     body → footer gap: --space-6 (24px)   [when footer present]
  └── [footer — optional, ReactNode]
```

**Gap between icon and title/eyebrow: `--space-6` (24px).**

The icon is a category signal, not a line-height participant. A 24px gap between the icon and the title block ensures the icon reads as its own zone before the text begins. `--space-4` (16px) was considered — it would tighten the icon-title pairing, which is appropriate when the icon is small (16px) but feels cramped at 32px. `--space-6` is the correct value for icon sizes 24–32px.

**Gap between title and body: `--space-3` (12px).**

The title and body are closely related — title names the feature, body elaborates it. A 12px gap (one step below `--space-4`) keeps them as a semantic unit. This is tighter than the 16px gap used in LinkCard between title and body because FeatureCard's title is at the global h3 size (1.125rem), which is smaller than LinkCard's `--fs-card-title` (24–32px fluid). At a smaller heading size, 12px is the right visual coupling; at a larger heading size, 16px is needed to prevent the title from merging with the body optically.

**Padding: `--space-6` on all four sides.**

Applied by FeatureCard's CSS unconditionally — the padding is present in both `default` and `bordered` variants. In the `default` variant (no border, transparent bg), the padding creates a consistent internal gutter so the icon and title are never flush against the grid's column boundary. In the `bordered` variant, the same padding insets all content from the visible border edge. A single padding value for both variants prevents layout shift when switching variants at runtime.

**No flex spacer pushing the footer.** Unlike LinkCard, FeatureCard does not use a flex spacer to push the footer to the card's bottom edge. FeatureCard has no min-height and no uniform-height contract with siblings — height is content-driven. If a consumer needs all FeatureCards in a grid to share equal height with aligned footers, they apply `align-items: stretch` on the grid and `height: 100%` on the card root — this is the same pattern as LinkCard and documented in §9 (composition rules). The decision not to include an internal flex spacer keeps FeatureCard simpler than LinkCard; the spacer belongs in compositions that explicitly want footer alignment, not in the component by default.

---

## 5. Variants

Two variants. No third is introduced.

| Variant             | Background  | Border                      | Radius       | When to use                                                                                                                                                                         |
| ------------------- | ----------- | --------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` (default) | transparent | none                        | none         | Open feature grids. Content tiles on the page canvas without chrome. Grids where whitespace is the separator.                                                                       |
| `bordered`          | `--surface` | `1px solid var(--hairline)` | `--radius-3` | Pages wanting visual containment per tile. Denser grids where tiles need a visible boundary. Surfaces with dark or patterned backgrounds where transparency would read incorrectly. |

**Why two variants and not one.** The default variant is the right primitive for most feature grids: the icon + title + body grouping is visually self-contained without needing a border box. But some consumer surfaces — particularly `/capabilities` or `/services` pages that lay features out on `--surface-section` bands — need explicit tile containment to distinguish individual items from the band background. The `bordered` variant serves that need without requiring the consumer to override className in a way that would fight the component's default styling.

**Why no `quiet` variant (like LinkCard).** LinkCard's `quiet` variant serves a dense vertical list with hairline top rules. FeatureCard is explicitly grid-oriented and non-interactive; the hairline-top convention signals "list of navigational items" which is semantically incorrect for a structural feature tile. The `bordered` / `default` split is the correct axis of variation for FeatureCard.

---

## 6. States

None. FeatureCard is a structural molecule with no interactive states. It has no hover, focus, active, or disabled treatment. Any interactive content passed in the footer slot (e.g. a text link) carries its own interaction states via the global `<a>` rule in `tokens.css` and any DS atoms it uses. FeatureCard's root element is `<article>` (or `<section>`, `<div>`, `<li>` via `as`) — never a button or a link.

---

## 7. Motion

None. FeatureCard is a static structural molecule. Entrance sequences (stagger on scroll, fade-in) are owned by the parent grid or page composition layer. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` handles suppression globally for any animations inside children.

---

## 8. Accessibility

**Root element semantics.** `<article>` is the correct default for a self-contained feature tile. Each article's accessible name is its title heading — the engineer must wire `aria-labelledby` on the article root to the title heading's `id`, following the same pattern as `<Section>` and `<TeamCard>`. When `as="div"` or `as="li"`, the `aria-labelledby` wiring is omitted — neither element carries landmark role semantics.

When `as="li"`, the consumer is responsible for wrapping the list of FeatureCards in a `<ul>` (or `<ol>`). FeatureCard does not emit its own list wrapper.

**Icon is decorative.** The icon slot reinforces the title visually but carries no semantic meaning independent of the title text. The consumer passes `aria-hidden="true"` on the icon node — this is documented as a consumer responsibility (same contract as LinkCard's icon slot). The DS does not auto-add `aria-hidden` to consumer-supplied nodes.

**Title heading and document outline.** The `titleAs="h3"` default is correct for the canonical composition: FeatureCard inside a `<Section>` (h2) on a page with a `<Hero>` (h1). Consumers who render FeatureCards outside this hierarchy must pass the appropriate `titleAs`. The DS cannot enforce heading order at runtime; `titleAs` is the mechanism for making intention explicit.

**Body required.** Both `title` and `body` are required props. A FeatureCard without body copy is degenerate — the component exists to describe a feature, not just name it. The title alone belongs in an Eyebrow or a list item, not a FeatureCard. The `body` prop is not marked optional at the TypeScript level.

**Contrast — all pairings verified against the canonical light palette.**

- Title (`--fg`) on transparent/`--bg` background: 16.29:1 (AAA).
- Title (`--fg`) on `--surface` (`bordered` variant): 15.46:1 (AAA).
- Body (`--fg-muted`) on `--bg`: 4.91:1 (AA normal).
- Body (`--fg-muted`) on `--surface` (`bordered` variant): 4.66:1 (AA normal).

**Keyboard interaction.** FeatureCard has no keyboard interaction of its own. Interactive children in the footer slot handle their own keyboard affordances.

---

## 9. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API
interface FeatureCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  as?: "article" | "section" | "div" | "li";
  icon?: React.ReactNode;
  eyebrow?: string | React.ReactNode;
  title: React.ReactNode;
  titleAs?: "h2" | "h3" | "h4";
  body: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "bordered";
}
```

**Why `Omit<…, "title">`.** The native HTML `title` attribute is a tooltip string. `title` is FeatureCard's primary content prop. `Omit<…, "title">` prevents the native attribute from appearing as if it were a content slot — identical rationale to `<TeamCard>` and `<LinkCard>`.

**Prop-by-prop intent:**

- `as` — root element override. Default `"article"`. Use `"li"` when FeatureCard is a list item inside a `<ul>` feature list; use `"section"` when the parent context expects section landmarks; use `"div"` in layout contexts where article/section semantics would be incorrect.

- `icon` — optional decorative icon. `ReactNode` pass-through. FeatureCard renders a wrapper `<div>` (`aria-hidden="true"`, `color: currentColor`) containing the icon. The consumer passes `aria-hidden` on the icon node itself. When absent, no wrapper is emitted and the first content zone is the eyebrow or title.

- `eyebrow` — optional category label. String → FeatureCard wraps in `<Eyebrow variant="muted">`. ReactNode → rendered as-is. When absent, no element is emitted.

- `title` — required. The feature's name. Rendered as the element named by `titleAs`. Margin zeroed inside FeatureCard's flex scope.

- `titleAs` — heading level. Default `"h3"`. Valid values: `"h2" | "h3" | "h4"`. The engineer must not accept `"h1"` — a feature tile is never a page's primary heading.

- `body` — required. Feature description. When a `string`, FeatureCard wraps in `<p style="margin: 0">`. When a `ReactNode`, rendered as-is. The consumer owns paragraph wrapping when passing a ReactNode.

- `footer` — optional. Any `ReactNode`. Rendered inside a wrapper `<div>` with default `color: var(--fg-muted); font-size: var(--fs-meta)`. These defaults can be overridden by the footer content's own styles. When absent, no element is emitted.

- `variant` — `"default"` (transparent, no border) or `"bordered"` (`--surface` bg, `--hairline` border, `--radius-3`). Default `"default"`.

**What was cut and why:**

- `align` prop — cut. Content is always start-aligned (left in LTR). Center-aligned feature tiles are a marketing pattern not in the operator-grade brand register. If a consumer needs center alignment, that is a className override at the consumer layer, not a named variant.

- `size` prop — cut. FeatureCard has one size. Padding and typography scale appropriately for a feature-grid tile at all viewports via fluid tokens.

- `href` / interactive props — cut. FeatureCard is not interactive. For an interactive feature tile, use `<LinkCard>`.

---

## 10. Composition rules

- **FeatureCard in a CSS grid.** The canonical usage is three or four FeatureCards in a CSS grid inside a `<Section>`. The Section owns the heading block (eyebrow + section title + lede) above the grid; FeatureCard fills each cell. For equal-height rows with aligned footers, the consumer applies `align-items: stretch` on the grid container and `height: 100%` on the FeatureCard root. Note: because FeatureCard does not include an internal flex spacer, footer alignment in a grid requires the consumer to additionally add `display: flex; flex-direction: column` on the root and `margin-top: auto` on the footer wrapper — this is a composition-level concern, not a component concern.

- **FeatureCard as `<li>` inside a `<ul>`.** When `as="li"`, the consumer must render the list of FeatureCards inside a `<ul>` (reset default list styling). This is the correct semantic structure for an unordered feature list. Recommended reset on the `<ul>`: `list-style: none; padding: 0; margin: 0`. The grid layout can then be applied to the `<ul>` element.

- **FeatureCard and `<Section>`.** `<Section titleAs="h2">` above a grid of `<FeatureCard titleAs="h3">` is the correct heading hierarchy and the expected composition for a `/capabilities` or `/services` page.

- **FeatureCard and `<Eyebrow>`.** The eyebrow slot follows the same string-convention as Section, LinkCard, and TeamCard: string → auto-wrap in `<Eyebrow variant="muted">`, ReactNode → pass-through. When all tiles in a grid share the same category label, prefer placing the eyebrow in the Section header rather than repeating it on every card.

- **FeatureCard does not compose with `<LinkCard>`.** They are sibling primitives with distinct interaction contracts. Do not mix them in the same grid.

- **FeatureCard does not compose with `<RoleCard>`.** RoleCard carries sequencing semantics that conflict with FeatureCard's peer-item register.

- **Two FeatureCard variants do not mix in the same grid.** Using `default` and `bordered` side by side in one grid produces an incoherent visual rhythm — one set of tiles reads as contained objects, the other as open content. Pick one variant per grid context.

---

## 11. Out of scope

- **Interactivity / click target.** FeatureCard is never the click target. For a navigational feature tile, use `<LinkCard>`. For a FeatureCard with a footer link, the footer link carries its own interaction; the card itself remains structural.

- **Image / media slot.** A feature tile with a hero image or thumbnail is a different primitive (`MediaCard` or `FeatureMediaCard`). FeatureCard is icon + text only.

- **`variant="compact"`** — a smaller variant with less padding or smaller type. Not specified. A consumer wanting minimal output omits optional slots; the component's padding and typography are fixed at the spec values. File a proposal with a real consumer surface if a compact variant is needed.

- **Horizontal layout.** FeatureCard does not have a `layout="horizontal"` prop (unlike TeamCard). The icon + title + body structure is vertical by design — a horizontal icon-left / text-right layout would need different gap values, different icon sizing, and different width constraints. That is a distinct design problem. File a proposal if a real surface needs it.

- **Skeleton / loading state.** Out of scope. File a proposal if an async-populated feature grid is needed.

- **Dark-mode per-component overrides.** `--fg`, `--fg-muted`, `--surface`, `--hairline` all flip cleanly via the global dark-mode token override block in `tokens.css`. No per-component dark-mode CSS needed.

- **`titleAs="h1"`** — explicitly excluded. A feature tile is never a page's primary heading.

---

## 12. Story matrix

| Story file                            | Story name             | Description                                                                                                                                                                                                          |
| ------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FeatureCard.stories.tsx`             | `Default`              | Full slots: icon (24px lucide-react `Zap` with `aria-hidden`) + title + body (2 sentences). Default variant, no eyebrow, no footer. Verifies: icon renders, gap stack correct, body muted color, transparent bg.     |
| `FeatureCard.stories.tsx`             | `WithEyebrowAndFooter` | Icon + eyebrow (string form) + title + body + footer ("Learn more →" text link). Verifies: eyebrow wraps in `<Eyebrow variant="muted">`, body→footer gap at `--space-6`, footer wrapper default muted/meta register. |
| `FeatureCard.stories.tsx`             | `Bordered`             | `variant="bordered"` + full slots (icon + title + body). Verifies: `--surface` background, `1px solid --hairline` border, `--radius-3` corners, padding reads correctly against visible edge.                        |
| `FeatureCard.stories.tsx`             | `TitleOnly`            | `title` + `body` only — no icon, no eyebrow, no footer. Degenerate stress test: verifies component renders cleanly with minimum required slots and no gap artifacts from absent optional slots.                      |
| `FeatureCard.stories.tsx`             | `AsLiPolymorphism`     | `as="li"` inside a `<ul style="list-style:none;padding:0">`. Full slots. Verifies: root element is `<li>`, inherits all styles identically, no landmark regression.                                                  |
| `FeatureCard.AllVariants.stories.tsx` | `ThreeColumnGrid`      | Three `default` FeatureCards in a CSS 3-column grid. Varying body lengths. Verifies grid layout, consistent icon alignment across cards, rhythm between tiles.                                                       |
| `FeatureCard.AllVariants.stories.tsx` | `BorderedGrid`         | Four `bordered` FeatureCards in a 2×2 CSS grid. Verifies: bordered variant looks correct at grid scale, tile containment reads clearly, radius + border + surface bg work together.                                  |
| `FeatureCard.AllVariants.stories.tsx` | `SemanticFeatureList`  | Five FeatureCards as `as="li"` inside `<ul>`. Stacked vertically (1 column). Verifies semantic list structure, each item self-contained, no unwanted spacing from list reset.                                        |
| `FeatureCard.AllVariants.stories.tsx` | `EyebrowReactNode`     | `eyebrow={<Eyebrow variant="solid">New</Eyebrow>}` (ReactNode form). Verifies pass-through (no double-wrapping), solid variant renders at full contrast.                                                             |
| `FeatureCard.AllVariants.stories.tsx` | `TitleH2Override`      | `titleAs="h2"` + full slots. Verifies the title renders as `<h2>` and typography is correct for a standalone section context without a preceding h2.                                                                 |
| `FeatureCard.AllVariants.stories.tsx` | `Icon32px`             | Icon at `size={32}` (larger glyph). Verifies the icon wrapper and gap values remain correct at the larger recommended icon size; no layout overflow.                                                                 |

---

## 13. Open questions for the engineer

1. **`aria-labelledby` wiring.** The spec requires wiring `aria-labelledby` on the root element (when `as === "article"` or `as === "section"`) to the title heading's `id`. Follow the same pattern as `<Section>` and `<TeamCard>`: derive the heading id from the consumer-supplied `id` prop (e.g. `${id}-title`), falling back to `useId()` (React 18+). Confirm which React version the DS targets.

2. **Icon wrapper `aria-hidden`.** The icon slot wrapper `<div>` should carry `aria-hidden="true"` at the wrapper level in addition to the consumer-applied `aria-hidden` on the icon node itself — belt-and-suspenders for icon libraries that render SVG without `aria-hidden`. Recommendation: apply `aria-hidden="true"` on the wrapper `<div>` unconditionally when the `icon` prop is present. The consumer still owns the icon node's `aria-hidden` for their own clarity, but the wrapper ensures screen readers never announce the icon regardless of how the consumer constructs the SVG node.

3. **Footer flex alignment in a grid.** The spec intentionally omits an internal flex spacer — FeatureCard is content-height, not fixed-height. If a consumer needs footer alignment across a grid row, the recommended pattern is `margin-top: auto` on the footer wrapper inside the card's flex column. Whether the engineer implements this as an optional internal spacer (activated when the `footer` slot is present) or leaves it as documented composition guidance is an implementation call. Either approach is acceptable; document the decision in a code comment.

4. **Body `<p>` margin zero.** When `body` is a `string`, FeatureCard wraps it in `<p>`. The global `p` rule applies `margin: 0 0 var(--space-4)`. Inside FeatureCard's flex column, this bottom margin will stack with the gap. The engineer must zero the `<p>` margin in FeatureCard's CSS module scope — consistent with the title margin zeroing pattern used in Principle and TeamCard.

5. **`h3` global margin.** The global `h3` rule applies `margin: 0 0 var(--space-2)`. The engineer must zero this on the title element inside FeatureCard's scope. This is the same open question as TeamCard §13.5 — confirm the same fix applies here and document it in the CSS module.

6. **`as="li"` and `aria-labelledby`.** When `as="li"`, the `aria-labelledby` wiring should be omitted (consistent with TeamCard §8: a `<div>` or `<li>` carries no landmark role). The engineer implements the wiring conditionally: emit `aria-labelledby` only when `as === "article"` or `as === "section"`.

7. **Icon color inheritance.** The icon wrapper `<div>` sets `color: currentColor`. This means icon color is inherited from the root element's `color` value (`--fg`). If a consumer wants a different icon color, they apply a className with an explicit `color` value on the FeatureCard root or pass a pre-colored icon node. The DS does not provide an `iconColor` prop — color overrides belong at the consumer layer.
