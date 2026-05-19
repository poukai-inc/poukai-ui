# Design spec: Section

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<Section>` is the system's canonical page-section wrapper. It owns the vertical rhythm around a section's header block — the eyebrow, title, and lede — and exposes a children slot for section body content. It does not style children directly; it only controls the space above them.

Every full-page surface on pouk.ai currently re-rolls `<section>` structure inline: arbitrary block padding, inline `<h2>` typography, ad hoc gap values between eyebrow labels and titles. The result is section-to-section rhythm that drifts between pages and between developers. `<Section>` lifts that decision into one molecule so every page subdivision draws from the same rhythm, the same token values, and the same accessible landmark shape.

What Section is not: it is not a card, not a callout, not a decorative container. It carries no visual surface (no background, no border, no shadow in the default configuration). It is structural scaffolding — the invisible vertical metronome of the page.

---

## 2. Anatomy

- **Root element**: `<section>` by default. Polymorphic via an `as` prop — valid values: `"section" | "article" | "aside" | "div"`. This follows the Statement/Eyebrow polymorphic pattern: the root element swaps without forking styling. `<section>` is the correct default for page subdivisions; `"article"` is the override when the content is independently distributable (e.g. a press mention, a blog post); `"aside"` when the content is tangential; `"div"` when a landmark element is undesirable (see §7 on the empty-region problem).

- **Header block**: a container wrapping the eyebrow, title, and lede in document order. The header block has a `max-width` (see §4); the children slot does not inherit this constraint. The header block is not rendered if none of its three slots are populated — Section degrades gracefully to a plain wrapper.

- **Eyebrow slot** (optional): renders the `<Eyebrow>` atom. Two calling conventions:
  - String form: `eyebrow="01 · Approach"` — Section internally wraps the string in `<Eyebrow>` with default props (`variant="muted"`). Consumer writes natural case; Eyebrow applies `text-transform: uppercase`.
  - ReactNode form: `eyebrow={<Eyebrow numeral="01" variant="solid">Approach</Eyebrow>}` — Section renders the node as-is. This is the escape hatch for custom Eyebrow configuration (non-default variant, numeral slot, or a future Eyebrow prop this spec does not anticipate). Section never wraps a ReactNode in a second Eyebrow instance.
  - The decision rule: if the value is a `string`, Section owns the wrapping. If the value is a `ReactNode`, Section renders it directly. The engineer implements this as `typeof eyebrow === 'string' ? <Eyebrow>{eyebrow}</Eyebrow> : eyebrow`.

- **Title slot** (optional): an `h2` by default. The heading level is overridable via a `titleAs` prop (`"h1" | "h2" | "h3"`). The title renders with the same typography as the global `h2` rule in `tokens.css`: Instrument Serif, `clamp(1.75rem, 1.25rem + 2vw, 2.5rem)`, `line-height: 1.2`, `color: var(--fg)`. This is not a new token; it consumes the existing element-level default. Section does not add a separate class for title typography — it relies on the semantic element inheriting `tokens.css` base styles.

- **Lede slot** (optional): a paragraph below the title. Uses `--fs-body` for font size and `--fg-muted` for color — the muted register signals "supporting copy, not the heading." Inherits body `line-height: 1.55`. The lede slot accepts `ReactNode` so consumers can pass a pre-formed `<p>` or a string; when given a string, Section wraps it in a `<p className="lede">`, using the existing `.lede` class from `tokens.css` (which applies `color: var(--fg-muted)` and `max-width: 36rem`).

- **Children slot**: the section body content. Section places children below the header block with a gap of `--space-12` (48px) when the header block is populated, or with no gap if the header block is empty (the children are the first element inside the root). Section applies no styling to children — no max-width, no typography, no background. The body is the consumer's space.

---

## 3. Tokens used

### Existing tokens (no change)

| Token                | Value                                       | Role                                                                                     |
| -------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `--space-2`          | `0.5rem` (8px)                              | Gap: eyebrow → title                                                                     |
| `--space-4`          | `1rem` (16px)                               | Gap: title → lede                                                                        |
| `--space-12`         | `3rem` (48px)                               | Gap: lede (or last header slot) → children; also section block padding at `size="tight"` |
| `--space-16`         | `4rem` (64px)                               | Section block padding (top + bottom) at `size="default"`                                 |
| `--hero-max`         | `38rem`                                     | Max-width of the header block (eyebrow + title + lede). Reuses Hero's column cap.        |
| `--fg`               | `#1D1D1F`                                   | Title color (inherited from global `h2` rule)                                            |
| `--fg-muted`         | `#6E6E73`                                   | Lede color                                                                               |
| `--font-serif`       | Instrument Serif stack                      | Title font family (inherited from global `h2` rule)                                      |
| `--fs-body`          | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Lede font size (inherited from body)                                                     |
| `--tracking-eyebrow` | `0.06em`                                    | Eyebrow letter-spacing (owned by `<Eyebrow>`)                                            |
| `--lh-meta`          | `1.2`                                       | Eyebrow line-height (owned by `<Eyebrow>`)                                               |

### New tokens

None. Section is constructed entirely from the existing token vocabulary. The header-block max-width reuses `--hero-max` (38rem / 608px), which already exists as the Hero text-column cap. Both are page-subdivision headers at the same conceptual scale; sharing the token is correct, not coincidental.

**Max-width note.** The existing `--content-max: 64rem` controls the full page content column; `--hero-max: 38rem` controls the display title column. Section's header block caps at `--hero-max` because the eyebrow + title + lede stack is a narrower reading zone than the full page column — it benefits from the same tight constraint Hero uses. If a future consumer demonstrates that header blocks at 42–48rem read better (e.g. a long-form editorial with a wider measure), a `--section-header-max` token can be introduced then with a decision-log entry. For now, `--hero-max` is the honest answer.

**Breakpoint note.** Section's responsive padding uses `768px` as the breakpoint threshold, consistent with the `768px` majority convention documented in the Eyebrow spec breakpoint note (`--bp-md: 768px` is the planned token for this value). Section does not introduce `--bp-md` because that token addition requires its own `brand.md` decision-log entry and is pending as a follow-up. The literal `768px` is used in the spec; the engineer uses the literal until `--bp-md` ships, at which point Section is a migration target alongside Hero.

---

## 4. Layout & rhythm

### Header block

| Property                           | Value                             | Notes                                                                                                                                         |
| ---------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `max-width`                        | `var(--hero-max)` (38rem / 608px) | Constrains eyebrow + title + lede to a comfortable reading measure                                                                            |
| Eyebrow → Title gap                | `var(--space-2)` (8px)            | Label-to-thing coupling: tight intentionally                                                                                                  |
| Title → Lede gap                   | `var(--space-4)` (16px)           | Heading-to-body spacing: one clear step                                                                                                       |
| Lede → Children gap                | `var(--space-12)` (48px)          | The major break: header block ends, body begins                                                                                               |
| Last-populated-slot → Children gap | `var(--space-12)` (48px)          | Same value regardless of which slot is the last populated one — if there is no lede, the gap from the title to children is still `--space-12` |

The gaps between eyebrow → title → lede are `--space-2` and `--space-4` respectively. This mirrors the label-pairing logic in Hero (`--space-2` for eyebrow-to-nearest-content) and Eyebrow spec (§10: `--space-2` minimum between Eyebrow and its sibling heading). The `--space-4` step from title to lede is borrowed from the global `h2` bottom margin in `tokens.css` — the title's native margin is zeroed in Section's scope; Section's flex gap replaces it so the gap is controlled by the molecule, not by the element default.

### Section block padding

Section's root carries block padding (top + bottom) that creates the section-to-section breathing room on a page.

| Size variant     | Padding (top + bottom)                                         | Total vertical span per section |
| ---------------- | -------------------------------------------------------------- | ------------------------------- |
| `size="default"` | `var(--space-16)` (64px) top + `var(--space-16)` (64px) bottom | 128px + content                 |
| `size="tight"`   | `var(--space-12)` (48px) top + `var(--space-12)` (48px) bottom | 96px + content                  |

**`size="default"` rationale.** `--space-16` (64px) per side is the Apple editorial register value: generous enough to let sections breathe and signal a meaningful pause to the eye, restrained enough to avoid the inflated whitespace of generic SaaS landing pages. At 1440px wide, `64px` top + `64px` bottom is 128px of vertical breathing room per section, which is roughly 8–9% of a full viewport height — in the zone where separation is legible without feeling like the page is stretching to fill space.

**`size="tight"` rationale.** `--space-12` (48px) per side is the correct reduction for dense or utility sections — internal tools pages, `/work` case studies, documentation surfaces — where the generous editorial spacing of `default` would create unnecessary vertical scroll. The tight variant still reads as a deliberate pause; `--space-12` is the same value used for `Principle.module.css`'s desktop block padding (`padding: var(--space-12) 0`), so it has established precedent as a "section-within-a-page" breathing unit.

**No responsive padding shift** between mobile and desktop in this spec. Principle and Hero both shift padding values at `768px`; Section does not, because `--space-16` and `--space-12` (both in `rem`) scale naturally with the browser's base font size and read correctly at both viewport widths. If a live audit reveals that 64px top/bottom is too heavy on narrow viewports, a responsive tweak can be added without a brand-level decision-log entry — it is a rhythm calibration, not a brand token change.

### Children slot

The children slot has no max-width applied by Section. The section body content is the consumer's space. Grids, card lists, prose columns, full-bleed imagery — all inherit their own layout rules. Section provides the vertical context (padding above the block, gap below the header) and steps back.

---

## 5. Variants

Two variants: `size="default"` and `size="tight"`. No third variant is introduced.

| Variant                        | Block padding                    | When to use                                                                                                                                                                                      |
| ------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `size="default"` (the default) | `--space-16` (64px) top + bottom | Standard editorial pages, marketing surfaces, page sections where generous breathing room reinforces the brand's restrained, considered register. This is the correct default for pouk.ai pages. |
| `size="tight"`                 | `--space-12` (48px) top + bottom | Utility or dense surfaces, in-product pages, or any context where the default spacing reads as too expansive. Same as Principle's desktop block padding.                                         |

No `align` prop is introduced in this spec. Eyebrow, title, and lede are always left-aligned. A center-aligned variant (`align="center"`) was considered and rejected: the brand register is restrained and content-first; centered title + lede is a marketing-page trope that does not fit the Apple-adjacent aesthetic. If a specific surface needs centered section headers, it is an explicit consumer override, not a system variant. The spec is not the place to bless it as a default mode.

No `bleed` prop is introduced in this spec. Hero has `bleed="full"` because its use case — a full-width band with optional illustration — demands viewport-edge breakout. Section is a structural wrapper, not a visual band. If a consumer needs a full-bleed colored background on a section, they add `background: var(--surface-section)` to the Section root and let the page layout carry the bleed — or they use a dedicated layout wrapper outside Section. The DS does not need to own that concern inside Section at this stage. `bleed` can be added if a real consumer asks with a real surface.

---

## 6. States

None. Section is a structural molecule. It has no interactive states, no hover, no focus, no disabled treatment. Slots delegate to their contained components.

---

## 7. Accessibility

**Landmark semantics and the empty-region problem.**

An HTML `<section>` element is a region landmark — but only when it has an accessible name. A `<section>` without an accessible name is not exposed as a region landmark in most screen reader implementations (it degrades to a generic container, similar to `<div>`). This is not a bug; it is the spec-correct behavior.

Section's title, when present, becomes the implicit accessible name of the region via `aria-labelledby`. The engineer must wire this up:

1. The title element receives a generated or consumer-supplied `id` (e.g. `id="section-title-{n}"` where `n` is derived from the component instance or a consumer-passed `id` prop).
2. The root `<section>` receives `aria-labelledby={titleId}`.
3. Screen readers announce the region as "Approach — region" (or equivalent), which is correct and useful for users who navigate by landmark.

When `title` is omitted:

- The `<section>` element has no accessible name and is therefore not exposed as a region landmark. This is acceptable — an unlabeled section is structurally equivalent to a `<div>`. The consumer should either:
  - Pass a `title` to give the region an accessible name (preferred), or
  - Pass `aria-label` via spread props to name the region explicitly (acceptable when the section's purpose is clear from context), or
  - Render as `as="div"` to avoid emitting an unlabeled landmark (the safest option for purely decorative structural groupings).
- Section does not add a fallback `aria-label` automatically — inferring one from children is not reliable and would produce poor SR output.

**Heading order is the consumer's responsibility.**

Section's `titleAs` prop makes the heading level explicit and visible in the component tree. The correct default is `h2` — page subdivisions below a `<Hero>` (which owns the `<h1>`) are level-2 headings. If a consumer uses Section at the top of a page without a Hero (rare), they must pass `titleAs="h1"`. If a consumer nests Sections (very rare), they must pass `titleAs="h3"` on the inner instance.

Section cannot enforce heading order at runtime. The `titleAs` prop is the system's mechanism for making the consumer's intention explicit rather than implicit — it removes the ambiguity of wondering which element the title renders as. The engineer should document the `h2` default clearly in JSDoc.

**`as` prop and landmark roles.**

| `as` value            | SR landmark role                      | When correct                                                |
| --------------------- | ------------------------------------- | ----------------------------------------------------------- |
| `"section"` (default) | region (when titled), none (untitled) | Page subdivisions — the standard case                       |
| `"article"`           | article                               | Independently distributable content (press mentions, posts) |
| `"aside"`             | complementary                         | Tangential or supplementary content                         |
| `"div"`               | none                                  | Purely structural grouping where a landmark would be noise  |

**Contrast.** Section introduces no new color pairings. All slots use existing tokens with verified ratios inherited from `meta/brand.md`: `--fg` on `--bg` = 16.29:1 (AAA), `--fg-muted` on `--bg` = 4.91:1 (AA normal). The Eyebrow slot inherits `<Eyebrow>`'s verified contrasts (see Eyebrow spec §7).

---

## 8. Motion

None. Section is structural. It does not own entrance animations. If an entrance animation is required for a section's content (e.g. a staggered card list reveal on scroll), that animation is owned by the children or by a parent page composition layer. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` handles suppression globally for any animations within children.

---

## 9. Prop intent

Final proposed signature after trimming unjustified props:

```tsx
// INTENT ONLY — engineer designs the actual API
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "article" | "aside" | "div";
  eyebrow?: string | React.ReactNode;
  title?: React.ReactNode;
  titleAs?: "h1" | "h2" | "h3";
  lede?: React.ReactNode;
  size?: "default" | "tight";
}
```

**What was trimmed and why:**

- `bleed?: "none" | "full"` — removed. Rationale in §5: Section is not a visual band; bleed is a layout concern owned by the page or a dedicated layout wrapper. Defer to a real consumer ask.
- `align?: "start" | "center"` — removed. Rationale in §5: center-aligned section headers are not in the brand register. Consumer overrides via className if genuinely needed; the DS does not bless it as a variant.

**Prop-by-prop intent:**

- `as` — controls the root element for landmark and semantic correctness. Default `"section"`. Consumer selects based on content type. See §7.
- `eyebrow` — string or ReactNode. When string: Section wraps in `<Eyebrow>`. When ReactNode: Section renders as-is. When absent: the eyebrow slot is not rendered; no empty element is emitted.
- `title` — the section heading content. When present, renders as the element named by `titleAs`. When absent, the header block may still render (if `eyebrow` or `lede` are present). No title = no heading element emitted.
- `titleAs` — the heading element to render the title as. Default `"h2"`. Override with `"h1"` when Section sits at the top of a page without a Hero; override with `"h3"` for nested subdivision contexts. Documents the consumer's intention explicitly rather than leaving it implicit in the DOM.
- `lede` — supporting copy below the title. String values are wrapped in `<p className="lede">` (which applies `color: var(--fg-muted)` and `max-width: 36rem` via the existing `.lede` class in `tokens.css`). ReactNode values are rendered as-is — consumer is responsible for the `<p>` wrapper if they pass a node.
- `size` — controls block padding. Default `"default"` (`--space-16` top + bottom). `"tight"` reduces to `--space-12`. Additive opt-in; the default is the editorial register.
- `className` — for layout overrides (e.g. custom background on a specific section). Section has no margin of its own; the page layout positions it.
- Standard HTML attributes (`id`, `data-*`, `aria-*`, event handlers) are spreadable onto the root element. The engineer uses `React.HTMLAttributes<HTMLElement>` as the base extension type — `HTMLElement` rather than `HTMLSectionElement` because the root element is polymorphic.

**The `aria-labelledby` wiring.** The engineer must connect the title element's `id` to the root's `aria-labelledby` when `title` is present and `as="section"` (or `"article"` / `"aside"`). The spec recommends generating a stable id from a consumer-supplied `id` prop on the root, falling back to a component-local uuid or counter. The exact implementation is the engineer's call; the intent is that every titled Section is a properly named landmark.

---

## 10. Composition rules

- Section is the canonical page-subdivision wrapper. Every top-level page section should be a `<Section>` or a component that internally wraps its content in one.
- Section does not nest inside Section. If a sub-section is needed, the inner content uses its own heading hierarchy (pass `titleAs="h3"`) inside the children slot — but the outer `<Section>` is not a composition unit for inner `<Section>` instances. Nested Section wrappers would double the block padding and produce excessive vertical rhythm.
- Section composes naturally above `<Principle>`, `<RoleCard>`, `<FailureMode>`, and similar molecules. The children slot receives any ReactNode. Section owns the heading block and the gap above the children; the children own their own internal rhythm.
- Section does not compose with `<Hero>`. Hero is the `<h1>` moment; Section is the `<h2>` moment. They are siblings on the page, not parent/child. A typical page structure: `<Hero>` (h1) → `<Section title="Approach" titleAs="h2">` → `<Section title="The work" titleAs="h2">` etc.
- `<Eyebrow>` is the atom Section consumes for eyebrow content. Section never renders raw span/p elements for the eyebrow slot — it always goes through `<Eyebrow>` so the visual and accessibility treatment is consistent.
- The `.lede` global class from `tokens.css` is the lede's visual contract. Section relies on this existing class rather than duplicating its CSS properties.

---

## 11. Out of scope

- **`bleed` prop.** Deferred. See §5. File a proposal with a real consumer surface when the need arrives.
- **`align="center"` variant.** Excluded from this version. Not in the brand register. Consumer can override via `className`.
- **Background / surface variants.** Section does not accept a `surface` or `background` prop. If a section needs a colored background band (e.g. `--surface-section`), the consumer applies it via `className` or a wrapping element. Section is structural, not decorative.
- **Section-level entrance animations.** Section does not own an `entrance` prop. Deferred entirely — if a common stagger pattern emerges across multiple page surfaces, it can be added to Section in a follow-up spec. For now, children own their own animations.
- **Separator / hairline divider between sections.** Principle has `border-top: var(--hairline-w) solid var(--hairline)`. Section does not. Page-level section dividers are either handled by the page layout or by a future layout primitive. Adding an opt-in hairline prop to Section is a reasonable follow-up if the need surfaces.
- **`titleId` as a consumer prop.** The `aria-labelledby` wiring uses an auto-generated or `id`-derived value. A dedicated `titleId` prop is not exposed — it is an internal implementation detail.
- **Dark mode.** Section introduces no per-component dark-mode overrides. `--fg`, `--fg-muted`, and all inherited tokens flip cleanly via the global dark-mode token override block in `tokens.css`. No action needed here.

---

## 12. Story matrix

| Story file                        | Story name               | Description                                                                                                                                                                                                                                                                          |
| --------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Section.stories.tsx`             | `TitleOnly`              | `title="The approach"` — bare minimum: a single h2, no eyebrow, no lede, no children. Verifies the header block renders cleanly alone and the section block padding is present.                                                                                                      |
| `Section.stories.tsx`             | `EyebrowTitleLede`       | `eyebrow="01 · Approach"` (string form) + `title` + `lede` (string) — standard three-slot header with no children. Verifies string→Eyebrow wrapping, gap stack (8px / 16px), lede muted color.                                                                                       |
| `Section.stories.tsx`             | `FullComposition`        | `eyebrow={<Eyebrow numeral="01">Approach</Eyebrow>}` (ReactNode form) + title + lede + children (lorem paragraph). Verifies ReactNode eyebrow pass-through, header→children gap (48px), and that children inherit no Section styling.                                                |
| `Section.stories.tsx`             | `TightVariant`           | Same as `EyebrowTitleLede` but with `size="tight"`. Verifies reduced block padding (48px vs 64px). Place both `default` and `tight` instances in the same story for direct comparison.                                                                                               |
| `Section.stories.tsx`             | `PolymorphicArticle`     | `as="article"` + `title` + `lede` — verifies the root element is `<article>`, that SR landmark is `article`, and that styling is identical to `as="section"`.                                                                                                                        |
| `Section.AllVariants.stories.tsx` | `AllVariants`            | Both size variants stacked with full slots (eyebrow + title + lede + children). The canonical design-matrix story.                                                                                                                                                                   |
| `Section.AllVariants.stories.tsx` | `SectionToSectionRhythm` | Three `<Section>` instances stacked in sequence — verifies that section-to-section spacing reads as coherent vertical rhythm. The primary smoke test for the component's core raison d'être. Each section has different children height to stress the rhythm at varied content mass. |
| `Section.AllVariants.stories.tsx` | `TitleH1Override`        | `titleAs="h1"` + full slots — verifies the heading element is `<h1>` and that typography matches the page-top use case.                                                                                                                                                              |
| `Section.AllVariants.stories.tsx` | `NoTitleWarning`         | `as="section"` with no title prop — verifies that no heading element is emitted, no ARIA error in axe-core (unlabeled section degrades gracefully), and documents the accessible-name gap.                                                                                           |

---

## 13. Open questions for the engineer

1. **`aria-labelledby` and title `id` generation.** The spec requires wiring `aria-labelledby` on the root element to the title element's `id` when `title` is present. The recommended implementation: if the consumer passes an `id` prop on the `<Section>`, derive the title id as `${id}-title`. If no `id` is passed, use a stable component-local counter or a `useId()` hook (React 18+). Confirm which React version the DS targets before choosing the `useId` path. If below React 18, a simple module-level counter is acceptable.

2. **`aria-labelledby` on polymorphic elements.** The `aria-labelledby` wiring is meaningful for `section`, `article`, and `aside` roots (all landmark elements). It is not meaningful for `as="div"` (no landmark semantics). The engineer should conditionally apply `aria-labelledby` only when the root element is a landmark type. Recommended implementation: `const isLandmark = as !== 'div'; return <Tag aria-labelledby={isLandmark && title ? titleId : undefined} ...>`.

3. **Lede string vs ReactNode wrapping.** When `lede` is a string, Section wraps it in `<p className="lede">`. When `lede` is a ReactNode, Section renders it as-is. The type-narrowing for this is `typeof lede === 'string'`. Confirm this is the correct check vs. `React.isValidElement` — a string is not a valid React element, so `typeof lede === 'string'` is the safe discriminant.

4. **Header block empty state.** If all three slots (`eyebrow`, `title`, `lede`) are absent, the header block `<div>` should not be rendered — an empty div adds unnecessary DOM weight and can confuse layout tools. The engineer should gate the header block render on `Boolean(eyebrow || title || lede)`.

5. **`--hero-max` vs. a dedicated `--section-header-max`.** This spec reuses `--hero-max` for the Section header block max-width. The engineer should verify that `--hero-max` is not semantically overloaded by this reuse — it was introduced for the Hero text column and now also constrains Section header blocks. If the engineer believes they should diverge in future, flag it and we will introduce `--section-header-max` with a brand.md entry at that point. For now, `--hero-max` is the honest shared constraint.

6. **`<h2>` element default margin.** The global `h2` rule in `tokens.css` applies `margin: 0 0 var(--space-4)`. Inside Section's header block (a flex column with explicit `gap` values), this margin will double-stack the title→lede spacing. The engineer must zero the margin on the title element inside Section's scope: `margin: 0` on the title, with gap controlled by the flex container. This is the same pattern used in Principle (`.title { margin: 0 }`).

7. **`--bp-md` token.** This spec uses `768px` as a literal breakpoint. When the `--bp-md: 768px` token is added in a follow-up PR (as noted in the Eyebrow spec breakpoint note), Section is a migration target. No action required now; flagged for awareness.
