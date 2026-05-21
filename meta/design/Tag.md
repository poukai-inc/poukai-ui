# Design spec: Tag

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<Tag>` is the system's canonical inline categorical pill — a compact label that communicates the type, category, topic, or metadata classification of adjacent content. It answers the question "what kind of thing is this?" inline with content flow: inside a card, in a list of topics, beside a title, or inside a sentence.

Tag arrived because three recently-shipped card molecules — `FeatureCard`, `TeamCard`, `LinkCard` — each carry implicit type labels (category, role, topic) that today are either plain inline text or absent entirely. Those surfaces need a shared pill-shaped primitive so categorical labels are consistent across the system without each card inventing its own small-text treatment.

Standalone usage is equally valid: a list of topic tags below an article title, a taxonomy pill in a sidebar, an inline "type indicator" inside a table cell.

### What Tag is not

**Tag is not `<Eyebrow>`.** Eyebrow is a block-level micro-label that precedes a heading. It is always uppercase, always tracked, and always sits above the content it labels — never inline with it. Tag is an inline pill that floats in content flow. The visual registers are distinct: Eyebrow is structured label-above-content; Tag is inline categorical metadata.

**Tag is not `<StatusBadge>`.** StatusBadge communicates liveness state (available / idle / offline) with a colored pulse dot. It is stateful, animated, and encodes a live signal. Tag encodes a static category — it has no dot, no pulse, no color-coded status semantics. A Tag saying "Engineering" is not the same kind of claim as a StatusBadge saying "available."

**Tag is not a button.** Tags have no `onClick` semantics. They do not look clickable. They do not receive hover or focus states (other than what the browser provides if a consumer wraps one in an anchor, which the DS does not prescribe). If a clickable filtering chip is needed in the future, that is a distinct `TagButton` primitive with a separate spec and separate interaction model.

**Tag carries a single short string.** It is not a structured layout container. No heading inside a Tag. No avatars. No close buttons (that is a future interactive-removal variant if it is ever needed).

---

## 2. Anatomy

- **Root element**: `<span>`. Tag appears inline in prose and card bodies; `<span>` is correct. Non-polymorphic — there is no `as` prop. Tags do not need to be headings, list items, or block elements. If a consumer needs block layout around multiple Tags, that is the parent's responsibility, not the Tag's.
- **Icon slot** (optional, leading): a `ReactNode` slot that accepts any icon from `lucide-react` (e.g. `<Sparkles size={12} aria-hidden />`). When populated, the root shifts from `display: inline` to `display: inline-flex` with `align-items: center` to maintain optical icon–text alignment. When absent, the root is plain inline. The DS does not ship or re-export icons; the consumer passes them.
- **Label content**: `children`. The visible text content of the pill. Typically a short string (one to three words). `ReactNode` to accommodate inline `<strong>` emphasis if a consumer genuinely needs it — but a plain string is the expected and idiomatic usage.
- **Pill container**: the root `<span>` styled as a pill — `border-radius: 999px`, tight horizontal padding, subtle background or transparent-with-border depending on tone.

There is no close button. There is no trailing chevron. There is no avatar. There is no count badge. These are all future surface areas if interactive or composite tag variants are ever specced.

---

## 3. Tokens used

No new tokens are introduced. Tag is constructed entirely from the existing token vocabulary.

| Token          | Value             | Role                                                                |
| -------------- | ----------------- | ------------------------------------------------------------------- |
| `--fs-meta`    | `0.875rem` (14px) | Font size — meta register, readable but clearly subordinate to body |
| `--font-sans`  | Geist stack       | Font family                                                         |
| `--fg`         | `#1D1D1F`         | Label text color, `default` tone                                    |
| `--fg-muted`   | `#6E6E73`         | Label text color, `muted` tone                                      |
| `--surface`    | `#F5F5F7`         | Background for `default` tone pill                                  |
| `--hairline`   | `#D2D2D7`         | Border color for `muted` tone pill                                  |
| `--hairline-w` | `1px`             | Border width for `muted` tone pill                                  |
| `--space-1`    | `0.25rem` (4px)   | Vertical padding (block axis)                                       |
| `--space-2`    | `0.5rem` (8px)    | Horizontal padding (inline axis)                                    |
| `--space-2`    | `0.5rem` (8px)    | Gap between icon and label text                                     |
| `--lh-meta`    | `1.2`             | Line-height — tight, single-line label register                     |

### Token decisions

**Font size: `--fs-meta` (14px), not `--fs-micro` (12px).**

`--fs-micro` is 12px — used for the `.micro` global utility class, which serves lowercase footer annotations and inline metadata in the smallest legible register. Tag is not the smallest legible register: it is a categorical label that users need to actually read and parse quickly. At 12px, uppercase or title-case pill text starts losing legibility on non-Retina displays and requires more cognitive work to scan. `--fs-meta` (14px) is correct: it reads clearly as a distinct categorical signal without competing with body copy. This is the same reasoning that determined `<Eyebrow>` uses `--fs-meta` over `--fs-micro`.

**Line-height: `--lh-meta` (1.2).**

Tag is a single-line label. `--lh-meta: 1.2` is the existing token for meta/eyebrow-scale text introduced by the Eyebrow spec. It is tight-leading (appropriate for labels that never wrap) and is already in the token vocabulary. No new token is needed.

**Background: `--surface` for `default` tone.**

`--surface: #F5F5F7` is the recessed elevation token — it is the Apple-light equivalent of a very quiet fill. Using it as a pill background gives the Tag a visible but thoroughly unobtrusive presence. It is one step lighter than a visible card background and does not compete with any other surface in the system. Using a hardcoded hex here would be a bug; `--surface` is the correct semantic token.

**Border: `--hairline` + `--hairline-w` for `muted` tone.**

The `muted` tone uses a transparent background with a 1px border in `--hairline` (`#D2D2D7`). This is the same token used for all dividers and hairline rules in the system. It produces a very quiet outlined pill that reads as "less prominent than `default`" — appropriate for secondary tags, draft labels, and any context where the tag should recede further.

**Radius: `999px` inline, not a new `--radius-pill` token.**

The existing radius token set is `--radius-1` (2px), `--radius-2` (4px), `--radius-3` (8px). None produces a full pill shape. Two options:

- Introduce `--radius-pill: 999px` as a new token.
- Use `999px` inline in `Tag.module.css`.

The decision is `999px` inline. A pill radius is not a "decision" in the brand sense — it is a geometric constant that means "make this a pill regardless of height." The system has no other pill-shaped components today, and the value `999px` is a universally understood CSS idiom for pill shape (it is larger than any foreseeable height). Introducing `--radius-pill` as a token would be tokenizing geometry rather than brand decisions. If a second pill-shaped component arrives, the right move is to evaluate then whether a shared token earns its keep — not to preemptively create one for a single usage. The `999px` literal is documented here and in `Tag.module.css` with a comment; it is not a hardcoded magic number if it is documented.

**No new tokens.** This was the strong default from the brief and has been honored. Zero new tokens are introduced.

---

## 4. Layout & rhythm

### Root element

| Property         | Value                                              | Notes                                                                             |
| ---------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
| `display`        | `inline` (no icon) / `inline-flex` (icon present)  | Flex only when icon slot is populated                                             |
| `align-items`    | `center` (when `inline-flex`)                      | Center-aligned for icon–text optical pairing at small sizes                       |
| `gap`            | `var(--space-2)` (8px) — only when `inline-flex`   | Between icon and label text                                                       |
| `font-family`    | `var(--font-sans)`                                 | Geist                                                                             |
| `font-size`      | `var(--fs-meta)` (14px)                            | Fixed, not fluid                                                                  |
| `font-weight`    | `400`                                              | Regular weight. Tags are metadata — not bold, not prominent                       |
| `line-height`    | `var(--lh-meta)` (1.2)                             | Tight leading; labels are always single-line                                      |
| `letter-spacing` | `0` / `normal`                                     | No tracking. Tags are mixed-case; tracking is for uppercase labels (see Eyebrow). |
| `white-space`    | `nowrap`                                           | Tags do not wrap. The string is always one line.                                  |
| `padding-block`  | `var(--space-1)` (4px)                             | Top and bottom                                                                    |
| `padding-inline` | `var(--space-2)` (8px)                             | Left and right                                                                    |
| `border-radius`  | `999px`                                            | Full pill shape — see §3 for token decision rationale                             |
| `margin`         | `0` — consumer owns layout; Tag has no self-margin |                                                                                   |

### Tone: `default`

| Property           | Value                        |
| ------------------ | ---------------------------- |
| `background-color` | `var(--surface)` (`#F5F5F7`) |
| `color`            | `var(--fg)` (`#1D1D1F`)      |
| `border`           | `none`                       |

### Tone: `muted`

| Property           | Value                                                     |
| ------------------ | --------------------------------------------------------- |
| `background-color` | `transparent`                                             |
| `color`            | `var(--fg-muted)` (`#6E6E73`)                             |
| `border`           | `var(--hairline-w) solid var(--hairline)` (1px `#D2D2D7`) |

### Why no padding adjustment between tones

The border in `muted` tone adds 1px to each side relative to the `default` tone's borderless pill. This means `muted` Tags are 2px wider and 2px taller in box-model terms (before border-box normalization). The engineer must apply `box-sizing: border-box` on the root element so the padding values are identical across both tones and the pill dimensions do not shift between tones. The spec prescribes `border-box` sizing; same padding tokens for both tones; the border consumes from inside the padding box.

---

## 5. States

Tag is a non-interactive atom. There are no hover, focus, active, or disabled states authored by the DS.

This is explicit and deliberate. A Tag is a label, not a control. Adding hover styles would imply interactivity. Adding a focus ring would cause confusion for keyboard users who do not understand why a non-interactive element is receiving focus. Adding a disabled state implies there is an enabled state — and an enabled Tag that can be disabled implies toggle or filter semantics that are out of scope.

If a consumer places a `<Tag>` inside a `<button>` or `<a>`, the Tag inherits the parent element's cursor and hover treatment — but the DS does not author or test that composition. The responsibility for interactive affordance rests entirely with the parent element, not the Tag.

Consequence: `Tag.module.css` contains no `:hover`, `:focus`, `:focus-visible`, `:active`, or `[disabled]` rules.

---

## 6. Motion

None. Tag is a static inline label. No entrance animation. No transition on any property. No transform on any state.

The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` clamps all `transition-duration` globally; since Tag has no transitions, this block has no effect on Tag but correctly handles any edge case.

If a Tag appears inside a parent with a stagger entrance animation (e.g., cards in a grid with CSS `animation-delay`), the parent owns that timing. Tag does not own or add to entrance sequencing.

---

## 7. Responsive behavior

Identical across all breakpoints. Tags do not reflow, change size, or change tone at any viewport width. `white-space: nowrap` ensures the label string is always one line. The pill shape is fixed at all sizes.

If a list of Tags wraps at narrow viewports, that is the responsibility of the parent flex or wrap container — the Tag itself never changes shape.

---

## 8. Accessibility

**Root element: `<span>`.**

`<span>` is a neutral inline element with no implicit ARIA role. This is correct for a non-interactive categorical label. The Tag's text content (its `children`) is its accessible name — it is read aloud by screen readers as part of the surrounding text flow, exactly as it would be for any inline `<span>`.

**No ARIA attributes needed on the Tag itself.**

A Tag is decorative semantic enrichment — it adds categorical context to surrounding content but is not a widget, a control, or a landmark. No `role`, `aria-label`, or `aria-describedby` is required on the Tag root. The text content carries the information.

**Icon slot — mark as decorative.**

When a consumer passes an icon into the `icon` slot, that icon is in virtually all cases purely decorative (it reinforces the label visually but adds no information a screen reader needs). The consumer must pass `aria-hidden="true"` on the icon element:

```tsx
<Tag icon={<Sparkles size={12} aria-hidden="true" />}>Featured</Tag>
```

This is documented in the component JSDoc. The DS does not attempt to enforce it (React's type system cannot require a prop on a `ReactNode` child), but it is the required consumer contract for all decorative icons.

In the rare case where the icon carries information not conveyed by the label text (unusual for a Tag), the consumer should add a visually hidden sibling element with the icon description rather than rely on `aria-label` on the icon, which has inconsistent support across icon components.

**Contrast verification.**

- `default` tone: `--fg` (#1D1D1F) on `--surface` (#F5F5F7) = 15.46 : 1 — AAA.
- `muted` tone: `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.91 : 1 — AA normal. At 14px (`--fs-meta`), the WCAG 2.1 AA threshold for normal text is 4.5:1. 4.91:1 passes.
- `muted` tone border (`--hairline` #D2D2D7 on `--bg` #FBFBFD): decorative border — no contrast requirement under WCAG 2.1 §1.4.11 (non-text contrast applies to interactive UI components and informational graphics, not decorative borders).
- All ratios are consistent with the `meta/brand.md` canonical palette table.

**Keyboard interaction.**

Tag is not focusable and should not receive keyboard focus in normal usage. It is not a tab stop. If a consumer makes a Tag focusable (e.g., by placing it inside an anchor), that is the consumer's interaction design decision and is outside this spec's scope.

---

## 9. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API
interface TagProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * The label content. Typically a plain string.
   * ReactNode is accepted to accommodate rare inline <strong> emphasis.
   * Required.
   */
  children: ReactNode;

  /**
   * Optional leading icon slot.
   * Accepts any ReactNode — idiomatic usage is a lucide-react icon at size={12}.
   * When present, the root shifts to inline-flex for optical alignment.
   * Pass decorative icons with aria-hidden="true".
   *
   * @example
   *   icon={<Sparkles size={12} aria-hidden="true" />}
   */
  icon?: ReactNode;

  /**
   * Visual tone.
   * - "default" (default) — subtle surface fill (--surface), full fg text.
   *   Use for primary categorical labels in cards and content.
   * - "muted" — transparent background, hairline border, muted fg text.
   *   Use for secondary tags, draft labels, or where the tag must recede further.
   */
  tone?: "default" | "muted";
}
```

**Root is `<span>`, non-polymorphic.** The engineer uses `forwardRef<HTMLSpanElement, TagProps>`. The `ref` type is `HTMLSpanElement`. No `as` prop — Tag has one correct semantic role and one correct root element.

**`ComponentPropsWithoutRef<"span">` as the base extension.** Gives consumers access to `id`, `data-*`, `aria-*`, `className`, and event handlers on the root span. `className` merges via `clsx`, consistent with every other atom in the DS (EmailLink, Eyebrow, StatusBadge).

**`displayName = "Tag"` must be set on the `forwardRef` result.** This is the convention on every DS atom.

**`children` is `ReactNode`, not `string`.** The `ReactNode` type is required because `ComponentPropsWithoutRef<"span">` types `children` as `ReactNode` in its base — and overriding it to `string` would be overly strict and would reject valid (if unusual) uses like `<Tag><strong>Breaking</strong></Tag>`. The prop intent documents the idiomatic usage (plain string) without type-narrowing away the edge cases.

**`tone` defaults to `"default"`.** The `default` tone (surface fill, full fg) is the primary use case — cards, topic lists, category labels. The `muted` tone is for secondary or receding contexts. The engineer sets `tone = "default"` in the destructuring default.

**No `size` prop.** Tag is fixed at `--fs-meta` (14px). There is no `sm` / `md` / `lg` ladder. Introducing a size ladder without a concrete use case would be speculative API surface. If a smaller or larger tag variant is needed, a proposal should be filed with a real surface.

**No `color` or `variant` prop beyond `tone`.** The two tones defined here cover the full brand-appropriate range for a non-interactive categorical label. See §10 for the rationale against colored semantic tones.

---

## 10. Composition rules

- `<Tag>` is an inline atom. It composes into any inline or flex context: inside a card body, inside a `<p>`, inside a flex row of multiple Tags, inside a `<li>`.
- **Inside `FeatureCard`, `TeamCard`, `LinkCard`**: a Tag with `tone="default"` replaces the plain-text category or type label. Margin between the Tag and sibling content is owned by the card molecule's layout, not the Tag.
- **List of Tags**: multiple Tags in a row compose naturally in a flex container with `gap: var(--space-2)` and `flex-wrap: wrap`. The Tag never adds self-margin; the parent container spaces them.
- **Inside prose `<p>`**: Tags compose as inline elements. No special treatment needed — `display: inline` is the default when no icon is present. Note: `display: inline-flex` (icon-present) inside a `<p>` is standard and visually correct; the icon and text align at center, and the pill sits on the text baseline.
- **Tag does not compose with `<Button>`.** A Tag is not a button and should never be placed inside one as the button's label. `<Button>` is for primary actions; Tags are for metadata classification.
- **Tag does not compose with `<StatusBadge>`.** These are distinct semantic registers — liveness status and categorical labels. Never use a Tag to signal liveness; never use a StatusBadge for categories.
- **Tag does not compose with `<Eyebrow>`.** An Eyebrow is the label-above-content device; a Tag is inline categorical metadata. They serve different layout positions and should not be stacked or mixed in the same visual slot.

---

## 11. Out of scope

- **Colored semantic tones** (`"success"`, `"warning"`, `"danger"`, `"info"`, `"accent"`). Explicitly excluded from this version. Rationale: the brand register is "Apple-light, restrained, editorial." A green pill labeled "Published" or a red pill labeled "Deprecated" would introduce status-color semantics that belong to a dedicated `StatusTag` or `Callout` primitive with its own semantic rationale — not to a generic categorical Tag. The two defined tones (`default` and `muted`) cover all categorical usage correctly without importing alert-palette semantics. Any future colored-tone addition requires a brand-level decision-log entry in `meta/brand.md` and Arian's explicit sign-off — it is not a minor extension.
- **Interactive variant (close button, onClick).** Tags in this spec are static labels. A Tag with a close button (for filter chips, removable selections) is a `TagButton` — a future primitive with its own spec, its own interaction model, and its own focus/hover/active states. Do not add an `onRemove` or `onClick` prop to this atom; that would be adding interactive semantics to a non-interactive element, which changes its ARIA role requirements.
- **Size ladder** (`size="sm" | "md" | "lg"`). One size. `--fs-meta` (14px) is the established meta register. A smaller Tag would be `--fs-micro` (12px) — not legible enough for categorical labels. A larger Tag would start competing with body copy. No size ladder is warranted.
- **Avatar slot.** No. An avatar implies a person-reference component — a different primitive (e.g. `PersonTag` or a user chip). This spec's Tag is for abstract categorical labels.
- **Dot / indicator slot.** No leading dot. That is `<StatusBadge>`. Do not conflate.
- **Max-width or truncation.** Tag does not truncate. Tags are always short strings by design. If a string overflows the pill, that is a content problem, not a DS problem. The DS does not add `text-overflow: ellipsis` to an inline pill.
- **Dark mode per-component overrides.** `--fg`, `--fg-muted`, `--surface`, `--hairline` all resolve correctly via the global dark-mode token block when it ships. No per-component dark-mode CSS needed.
- **RTL.** Tag uses `padding-inline` (logical property) — RTL-correct by default. No additional RTL work needed.

---

## 12. Worked examples

### (a) Bare label — default tone

```tsx
import { Tag } from "@poukai-inc/ui";

<Tag>Engineering</Tag>;
```

Renders as a `#F5F5F7` pill at 14px, full `--fg` text. Appropriate for a category label inside a `FeatureCard`.

### (b) With leading icon — default tone

```tsx
import { Tag } from "@poukai-inc/ui";
import { Sparkles } from "lucide-react";

<Tag icon={<Sparkles size={12} aria-hidden="true" />}>Featured</Tag>;
```

Root shifts to `inline-flex`. Icon and text are center-aligned. `aria-hidden` suppresses the decorative icon from the accessibility tree. Icon at `size={12}` sits proportionally inside a 14px-text pill.

### (c) Muted tone — for secondary or receding labels

```tsx
<Tag tone="muted">Draft</Tag>
```

Transparent background, 1px `--hairline` border, `--fg-muted` text. Appropriate for a secondary label ("Draft", "Archived", "Optional") where the Tag must not compete with primary content.

### (d) Multiple Tags inline in a flex row

```tsx
<div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
  <Tag>Engineering</Tag>
  <Tag>AI Infrastructure</Tag>
  <Tag tone="muted">Draft</Tag>
</div>
```

The parent flex container owns spacing. The Tags contribute their natural inline-flex widths. `flex-wrap: wrap` handles narrow viewports gracefully — Tags break to new lines but each individual Tag never breaks internally (enforced by `white-space: nowrap`).

---

## 13. Story matrix

| Story file                    | Story name      | Description                                                                                                                                                                     |
| ----------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tag.stories.tsx`             | `Default`       | `<Tag>Engineering</Tag>` — bare label, default tone. Verifies: `<span>` root, `--surface` bg, `--fg` text, `999px` radius, `--fs-meta` size, `--space-1` / `--space-2` padding. |
| `Tag.stories.tsx`             | `Muted`         | `<Tag tone="muted">Draft</Tag>` — transparent bg, `--hairline` border, `--fg-muted` text.                                                                                       |
| `Tag.stories.tsx`             | `WithIcon`      | `<Tag icon={<Sparkles size={12} aria-hidden />}>Featured</Tag>` — verifies `inline-flex`, center alignment, `--space-2` gap, icon rendering.                                    |
| `Tag.stories.tsx`             | `MutedWithIcon` | Muted tone with icon — verifies border and muted text survive alongside an icon without visual collision.                                                                       |
| `Tag.AllVariants.stories.tsx` | `AllVariants`   | All tone × icon combinations stacked — design-matrix record. Default no icon / default with icon / muted no icon / muted with icon.                                             |
| `Tag.AllVariants.stories.tsx` | `InlineInProse` | Tags embedded inside a `<p>` sentence ("Tagged in: <Tag>Engineering</Tag> and <Tag>AI Infrastructure</Tag>") — verifies inline flow, no baseline disruption, no wrap.           |
| `Tag.AllVariants.stories.tsx` | `FlexRow`       | Multiple Tags in a flex container with `gap: --space-2`, `flex-wrap: wrap` — verifies row layout, wrap behavior at 240px constrained width.                                     |
| `Tag.AllVariants.stories.tsx` | `InsideCard`    | A mock card surface (`--surface-section` background) with `<Tag>` placed as the card's category label — verifies the pill reads clearly against a recessed surface.             |

---

## 14. Open questions for Arian

1. **`muted` tone on `--surface` backgrounds.** The `muted` tone uses a transparent background. When a Tag sits inside a card that has a `--surface` or `--surface-section` background, "transparent" reveals the card's background rather than `--bg`. The hairline border in `--hairline` reads correctly on `--surface` (both are close values in the neutral ramp). But the overall result is a slightly lower-contrast presentation than on `--bg`. Is this acceptable, or should `muted` tone on elevated surfaces carry a fixed `--bg` background instead of transparent? Alternative: introduce a `muted-on-surface` tone. Recommendation is to accept the transparent behavior — it reads correctly and the contrast is within AA — but this is a judgment call you may want to override.

2. **Icon size convention.** The worked examples use `size={12}` for icons inside a 14px-text pill. This is an authorial recommendation, not an enforced constraint — the DS cannot type-enforce the icon `size` prop because `icon` accepts any `ReactNode`. The JSDoc could state "recommended icon size: 12px for standard Tags." Confirm whether this guidance is strong enough or whether you want it tightened (e.g., "always 12px").

3. **`FeatureCard` / `TeamCard` / `LinkCard` adoption.** The brief identifies these three cards as the primary motivation for Tag. Once Tag is `Approved` and `Implemented`, those molecules should be updated to adopt `<Tag>` in place of any existing inline text category labels. This is a follow-up PR, not part of the Tag atom itself — but it requires a spec update for each affected card molecule or at least a migration note. Confirm whether you want those migration notes in each card's spec or handled in a separate migration spec.
