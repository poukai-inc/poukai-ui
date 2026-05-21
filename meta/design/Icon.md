# Design spec: Icon

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-20

---

## 1. Purpose

`<Icon>` is a thin rendering wrapper around any `lucide-react` icon component. It enforces three system-wide contracts that would otherwise be reinvented at every call site: a token-aligned size scale (`xs` / `sm` / `md` / `lg`), `currentColor` as the only colour source, and decorative-by-default accessibility (`aria-hidden="true"` unless an explicit label is provided).

Without this atom every molecule that wants an icon must decide independently what `size={16}` means, whether to write `aria-hidden`, and how to let the parent control colour. The answers drift. `<Icon>` makes those three decisions once and holds the line.

The atom does not re-export Lucide. The consumer imports the icon component directly from `lucide-react` and passes it as a prop. `<Icon>` is a size-and-a11y frame, not a catalogue.

---

## 2. Anatomy

- **Root element**: the Lucide icon SVG, rendered by passing the consumer-supplied `icon` component through `<LucideComponent size={…} color="currentColor" aria-hidden={…} role={…} aria-label={…} />`. There is no wrapper `<span>` or `<div>` — the SVG is the root. This keeps the DOM flat and preserves inline-flex alignment when Icon is used inside a button label or an inline label row.
- **Size**: resolved from the `size` prop (an `xs`/`sm`/`md`/`lg` token name) to a numeric pixel value via the icon size token scale (see §3).
- **Color**: always `currentColor`. There is no `color` prop. The effective colour cascades from the parent's `color` CSS property exactly as it does for text.
- **Accessible label**: either absent (`aria-hidden="true"` — the default decorative case) or present (`role="img"` + `aria-label` — the semantic case when the icon carries meaning not expressed in adjacent text).

---

## 3. Tokens used

### Proposed new tokens — icon size scale

These tokens do not yet exist in `src/tokens/tokens.css`. They are proposed here. The engineer must not write these tokens until `meta/brand.md` records the decision. See the hand-off note at the end of this spec for sequencing.

| Token       | Value  | Lucide `size=` | Canonical role                                                                      |
| ----------- | ------ | -------------- | ----------------------------------------------------------------------------------- |
| `--icon-xs` | `12px` | `12`           | Inline icon inside a compact pill or a dense label row (e.g. inside `<Tag>`).       |
| `--icon-sm` | `16px` | `16`           | Default inline icon. Pairs with `--fs-meta` (14px) text. The most common rung.      |
| `--icon-md` | `20px` | `20`           | Mid-weight icon. Pairs with `--fs-body` (17–19px) text or stands alone in a row.    |
| `--icon-lg` | `24px` | `24`           | Large standalone icon. Navigation rows, feature-card icon slots, prominent markers. |

**Scale rationale.** The four rungs follow the 4px grid, starting at 12px and stepping by 4px. This maps cleanly onto the existing spacing scale — `--icon-xs` is `3 × 4px`, `--icon-sm` is `4 × 4px`, `--icon-md` is `5 × 4px`, `--icon-lg` is `6 × 4px`. The scale is intentionally narrow: four rungs cover every plausible inline icon context without creating the sprawl of a full numeric ladder. Values outside this range are out of scope for the `<Icon>` atom (see §10).

`--icon-sm` (16px) is the default. It is optically correct alongside `--fs-meta` (14px) text — the Lucide grid is designed for 16px placement, and the slight upsize relative to text cap-height produces the standard icon-label visual balance.

**Why not re-use `--space-*` tokens for sizes.** Spacing tokens encode component rhythm (gap, padding, margin). Using them for icon dimensions would imply an incorrect semantic — a 16px icon is not "the same concept" as a 16px gap. Distinct tokens for distinct concerns is the pattern already set by `--tracking-eyebrow`, `--lh-body`, and `--btn-h-*`.

### Existing tokens consumed

| Token          | Role                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| `currentColor` | The only colour source. Cascades from the parent's `color` property. No token needed. |

No other tokens are consumed. `<Icon>` has no background, no padding, no border, no border-radius of its own.

---

## 4. Layout & rhythm

`<Icon>` renders as an inline SVG with `display: block`. When placed inside a flex or inline-flex container (a button label row, an icon-text pair, a nav item), `display: block` on the SVG is standard practice — it removes the SVG's descender gap that `display: inline` introduces. The consumer's flex container controls vertical alignment (`align-items: center`).

| Property         | Value                              | Notes                                                                                      |
| ---------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| `display`        | `block`                            | Removes inline descender gap. Parent flex context controls alignment.                      |
| `width`          | `var(--icon-{size})` (e.g. `16px`) | Set by resolving the `size` prop to the appropriate token value.                           |
| `height`         | same as `width`                    | Icons are always square. Lucide guarantees a square `viewBox`.                             |
| `color`          | `currentColor`                     | The only colour. No override prop.                                                         |
| `flex-shrink`    | `0`                                | Icons must not collapse inside a flex row when adjacent text is long.                      |
| `pointer-events` | `none`                             | Icons are never directly interactive. The interactive target is always the parent element. |

**Gap to adjacent text.** `<Icon>` does not apply a gap to its own sides. The consumer's layout container (typically `display: flex; gap: var(--space-1)` for tight icon-label pairs or `gap: var(--space-2)` for standard spacing) owns the gap. This is consistent with the approach taken in `<Tag>`'s icon slot and `<StatusBadge>`'s dot.

---

## 5. States

None. `<Icon>` is a display element. It inherits colour transitions from the parent if the parent has a `color` transition on `:hover` or `:focus-visible` — this is correct and expected behaviour (the icon and its sibling text change colour together). No component-level transition is authored inside `<Icon>` itself.

---

## 6. Motion

None. `<Icon>` is a static atom. It participates in parent-owned transitions only by virtue of `currentColor` inheritance. No entrance animation, no transform, no opacity transition is authored here.

The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` has no effect on `<Icon>` directly.

---

## 7. Accessibility

### Decorative (default — `decorative={true}`)

When `decorative` is `true` (the default), the icon adds no information beyond what adjacent text already communicates. The correct ARIA treatment is removal from the accessibility tree:

- `aria-hidden="true"` is applied to the SVG.
- `role` is not set.
- `focusable="false"` is applied (prevents legacy IE/Edge from making SVGs focusable).

This is the correct pattern for icons that illustrate a label — the label text is the accessible content, not the icon.

### Semantic (non-decorative — `decorative={false}`, `aria-label` required)

When `decorative={false}`, the icon carries meaning that is not expressed in adjacent text. A standalone icon button's visual indicator is the canonical case. In this mode:

- `role="img"` is applied to the SVG so assistive technology announces it as a graphic.
- `aria-label` from the consumer prop is applied. **If `decorative={false}` and no `aria-label` is provided, the engineer must throw a development-mode error.** A semantic icon with no label is an accessibility bug.
- `aria-hidden` is removed (not applied at all — do not set `aria-hidden="false"`, which is not meaningful).
- `focusable="false"` is still applied. The SVG itself is never a keyboard focus target; if the icon is in an interactive context, the surrounding button or link is the focus target.

### Contrast

`<Icon>` uses `currentColor`. Contrast depends entirely on the parent's `color` value against its background. The caller is responsible for ensuring the colour pairing meets WCAG 1.4.11 non-text contrast (3:1) for informational icons, or WCAG 1.4.3 / 1.4.6 for icons that substitute for text. The existing token pairings in `meta/brand.md` all satisfy these thresholds when used as documented.

### `IconButton` dependency note

`<Icon>` alone is never a keyboard target. The `<IconButton>` atom (specced separately, depends on `<Icon>`) wraps `<Icon>` in an accessible `<button>` with a mandatory `aria-label`. Do not attempt to make `<Icon>` itself interactive.

---

## 8. Prop intent

```
// INTENT ONLY — engineer designs the actual API and TypeScript types

interface IconProps {
  /**
   * The Lucide icon component to render.
   * Consumer imports directly from lucide-react and passes the component reference.
   *
   * @example
   *   import { ChevronRight } from "lucide-react"
   *   <Icon icon={ChevronRight} />
   */
  icon: LucideIcon;

  /**
   * Size token. Resolves to the corresponding --icon-* CSS custom property value.
   *
   *   xs →  12px  (var(--icon-xs))  — compact pill / dense label row
   *   sm →  16px  (var(--icon-sm))  — default inline icon (DEFAULT)
   *   md →  20px  (var(--icon-md))  — paired with body-scale text
   *   lg →  24px  (var(--icon-lg))  — standalone feature / nav icon
   *
   * @default "sm"
   */
  size?: "xs" | "sm" | "md" | "lg";

  /**
   * When true (default), the icon is decorative — aria-hidden="true" is applied
   * and the icon is removed from the accessibility tree.
   *
   * When false, the icon carries semantic meaning. aria-label becomes required.
   * Omitting aria-label when decorative={false} is a dev-mode error.
   *
   * @default true
   */
  decorative?: boolean;

  /**
   * Accessible label for non-decorative icons.
   * Required when decorative={false}. Ignored when decorative={true}.
   *
   * @example
   *   <Icon icon={AlertCircle} decorative={false} aria-label="Warning" />
   */
  "aria-label"?: string;

  /**
   * className forwarded to the SVG root. Use sparingly — typically only needed
   * for layout-level positioning (e.g. margin-inline-start in a specific context).
   * Never use to apply a fill or stroke color; use currentColor via parent instead.
   */
  className?: string;
}
```

**No polymorphism.** `<Icon>` always renders the Lucide SVG directly. There is no `as` prop. The SVG element is the correct and only root for an icon.

**No `color` prop.** `currentColor` is the entire colour contract. If a consumer wants the icon in `--fg-muted`, they wrap it in a parent that sets `color: var(--fg-muted)`. This matches the `<Wordmark>` precedent and keeps `<Icon>` colour-agnostic.

**No numeric `size` prop.** Raw pixel values are out of scope. If a consumer needs a size outside the four rungs, the correct escalation is either a proposal for a new rung or a one-off `style={{ width, height }}` override on the SVG — not a change to the `size` prop type. The four named rungs cover all DS-sanctioned usage.

**`...rest` spread.** The engineer should spread remaining props (excluding `aria-label` and `decorative` which are handled explicitly) onto the Lucide SVG element. This gives consumers access to `data-*`, `id`, and other HTML attributes when necessary without the spec needing to enumerate them.

---

## 9. Composition rules

- **Inside `<Button>`**: pass `size="sm"` (16px) for a standard button with leading or trailing icon. The Button's existing label text provides the accessible name; `decorative={true}` (default) is correct. Gap between icon and label is owned by Button's layout.
- **Inside `<Tag>` icon slot**: pass `size="xs"` (12px) to match Tag's `--fs-meta` (14px) text register. The Tag spec documents `size={12}` as the recommended icon size — `<Icon size="xs">` formalises that recommendation.
- **Inside `<Eyebrow>`**: if a consumer adds a leading icon, pass `size="xs"` to match `--fs-meta` text.
- **Inside `<EmailLink>` or similar icon-text atoms**: `size="sm"` (16px) is the standard pairing.
- **Inside `<IconButton>`** (future atom, depends on `<Icon>`): the IconButton spec will define which `size` rung maps to which button height variant. `<Icon>` is agnostic about its container.
- **Inside navigation rows** (`MenuItem`, `NavLink`, future): `size="md"` (20px) or `size="lg"` (24px) depending on the row height token.
- **Standalone in a `<FeatureCard>` icon slot**: `size="lg"` (24px). The existing `FeatureCard` spec allocates an icon slot sized by `--btn-h-md`; migration should be evaluated when `<Icon>` is implemented.
- **Never inside `<Wordmark>`.** The Wordmark SVG geometry is inline and hand-coded. `<Icon>` is not a mechanism for injecting arbitrary SVGs into brand marks.
- **Never as a background or watermark.** `<Icon>` is an inline element in content flow. Decorative background iconography is a layout concern handled at the page level, not via this atom.

---

## 10. Out of scope

- **Re-exporting Lucide icons.** `@poukai-inc/ui` does not re-export any symbol from `lucide-react`. The consumer manages the Lucide import. This is a "Won't" in ROADMAP.md and reaffirmed in BACKLOG.md.
- **Non-Lucide icon sets.** Custom SVG icons, Heroicons, Phosphor, Radix icons — none are in scope. If the system ever adopts a second icon library, a new primitive or a prop-type extension would require a separate proposal and Arian's sign-off.
- **Numeric `size` prop.** Raw pixel values are not accepted as the `size` prop. The four named rungs are the complete set for v1. Overrides via `className` or `style` are a consumer escape hatch, not a DS contract.
- **`color` prop or variant-based colour.** Never tokenize per-colour icon variants. `currentColor` is the entire colour contract.
- **Icon catalogue or icon picker.** `<Icon>` is a frame, not a registry. There is no `name="chevron-right"` string lookup API.
- **Animated icons.** Lucide ships some animated variants. `<Icon>` does not enable or document them. The DS motion doctrine applies: no animation without a semantic purpose, and all animations must respect `prefers-reduced-motion`.
- **Loading / spinner state.** A spinner is a distinct atom (`Spinner`, listed in BACKLOG.md) with its own rotation animation and semantic role. `<Icon>` is static.
- **Sizes outside the four-rung scale** (e.g. `xl` at 32px, `2xl` at 48px). Display-scale icons at 32px+ (e.g. in a `FeatureCard` hero slot or a section illustration) are layout decisions made by the consuming molecule, not a new rung on the Icon atom. If evidence accumulates that a fifth rung is warranted, file a proposal.

---

## Hand-off note for `poukai-ds-engineer`

**What to implement.** `src/atoms/Icon/Icon.tsx` — a forwardRef component that accepts the prop surface above, resolves `size` to a pixel value, and renders the Lucide icon SVG with the correct `aria-*` attributes. No wrapper element — the Lucide SVG is the root.

**Token prerequisite.** The four `--icon-*` tokens are not yet in `src/tokens/tokens.css`. Before implementing, confirm with `poukai-design` that `meta/brand.md` has been updated with the token decision. The spec proposes the values; brand.md records the approval. Do not inline the pixel values as magic numbers in the component — resolve them from tokens via a lookup table (e.g. a `const SIZE_MAP = { xs: 12, sm: 16, md: 20, lg: 24 }` keyed to the token names) so the source of truth is named and traceable.

**Dev-mode guard.** When `decorative={false}` and no `aria-label` is provided, throw or `console.error` a descriptive message in development. This is an a11y contract violation, not a consumer preference.

**`focusable="false"`.** Apply this attribute to the SVG for IE11/legacy Edge compatibility. Lucide may or may not apply it by default depending on version; apply it explicitly.

**`flex-shrink: 0` and `pointer-events: none`.** Apply these in `Icon.module.css` on the root SVG. They are always correct for an icon and should not depend on a prop.

**`displayName = "Icon"`.** Required. Consistent with every other DS atom.

**Export path.** Export from `src/atoms/Icon/index.ts` and re-export via `src/index.ts`. The engineer owns the export wiring.

**Stories.** At minimum: `Default` (sm, decorative), `AllSizes` (xs/sm/md/lg stacked), `Semantic` (decorative={false} with aria-label), `InButtonLabel` (Icon + text in a flex row), `CurrentColorInheritance` (Icon inside a parent with color: var(--fg-muted) to verify colour cascade). Story authoring is the engineer's domain; this list is guidance only.
