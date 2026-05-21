# Design spec: Divider

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-20
**Implements proposal**: n/a — consolidation of inline hairline rules

---

## 1. Purpose

`<Divider>` is the single source of truth for hairline separator rules in the design system. It replaces the dozen inline `border-top: var(--hairline-w) solid var(--hairline)` and `border-left: var(--hairline-w) solid var(--hairline)` declarations scattered across component CSS modules — found today in `FailureMode`, `Principle`, `Statement`, `RoleCard` (footer slot), `LinkCard` (list variant), `Quote` (figcaption), `SiteShell` (footer wrapper), `Footer` (standalone mode), `Tabs` (list), `Dialog` (internal divider rule), and others.

By making the separator a rendered atom rather than a per-component CSS rule, the system gains:

- A single token contract point: the visual weight and color of every separator is controlled by one token (`--hairline`) or its soft companion (`--hairline-soft`).
- Consistent semantics: horizontal separators default to `<hr>` (implied `role="separator"`), vertical ones to `<div role="separator" aria-orientation="vertical">`.
- Opt-in softening: the `tone="muted"` prop routes through `--hairline-soft`, letting molecules quietly distinguish structural separators from decorative ones.

Divider has no content of its own. It is a visual boundary signal, nothing more.

---

## 2. Anatomy

- **Root element**: `<hr>` (horizontal, default) or `<div>` (vertical, or when the consumer passes `as="div"`). The element carries no children and renders no visible text.
- **The rule itself**: expressed entirely as a CSS border. For `orientation="horizontal"`: `border-top: 1px solid <tone-token>` on the root element with `border: 0` resetting the browser default `<hr>` border. For `orientation="vertical"`: `border-inline-start: 1px solid <tone-token>` on a block-displayed root with `width: 1px` and `align-self: stretch`.
- **No decorative content**: no gradient, no label, no icon. The component is the line.

---

## 3. Tokens used

No new spacing or layout tokens are needed. One structural token (`--hairline`) is existing. One new color token (`--hairline-soft`) is proposed — see §3.1.

| Token             | Value (light) | Role                                                                                 |
| ----------------- | ------------- | ------------------------------------------------------------------------------------ |
| `--hairline`      | `#D2D2D7`     | Default separator color. Full-strength hairline — the standard structural boundary.  |
| `--hairline-w`    | `1px`         | Canonical separator width. Used as the `border-width` value for both orientations.   |
| `--hairline-soft` | (proposed)    | Muted separator color. A quieter divider for decorative or de-emphasized boundaries. |

### 3.1 Proposed token: `--hairline-soft`

`--hairline-soft` does not exist in `src/tokens/tokens.css` as of 2026-05-20. It is proposed here and added to `tokens.css` in the same commit as this spec.

**Value (light mode):** `#E5E5EA`

**Rationale.** The existing neutral ramp has `--hairline: #D2D2D7` as its separator token. This is the canonical 1px divider weight — strong enough to read clearly as a structural boundary, consistent with Apple's `separator` color. There is a legitimate need for a lighter-weight separator: Quote's figcaption rule, Statement's optional hairline prefix, and future statistical list spacers are decorative or transitional separators where the full `--hairline` weight would compete with content. `--hairline-soft` fills the gap between `--hairline` and invisible. The proposed value `#E5E5EA` sits between `--hairline` (`#D2D2D7`) and `--surface` (`#F5F5F7`) in the neutral ramp — it is visibly present but clearly subordinate to structural separators. It is the equivalent of Apple's `opaqueSeparator` at a reduced contrast step.

**Dark mode value:** `#3A3A3C`

This sits between the dark `--hairline: #2C2C2E` and `--surface: #1C1C1E` — the same step relationship inverted. It reads as a quieter separator on dark surfaces without disappearing entirely.

**Contrast:** `--hairline-soft` is a non-text decorative element. No WCAG text contrast requirement applies. It must simply remain perceptible against `--bg` (`#FBFBFD`) in light mode and `--bg` (`#000000`) in dark mode — both verified by inspection.

---

## 4. Layout & rhythm

### Horizontal (default, `orientation="horizontal"`, `as="hr"`)

| Property     | Value                                  | Notes                                                                            |
| ------------ | -------------------------------------- | -------------------------------------------------------------------------------- |
| `display`    | `block`                                | `<hr>` is already block; explicit for spec clarity.                              |
| `border`     | `0`                                    | Resets browser default `<hr>` border (varies by UA).                             |
| `border-top` | `var(--hairline-w) solid <tone-token>` | The rule. `<tone-token>` resolves to `--hairline` or `--hairline-soft`.          |
| `margin`     | `0`                                    | The component has no self-margin. Parent layout controls surrounding space.      |
| `width`      | `100%` (auto for `<hr>`)               | Stretches to fill the inline formatting context. No override needed.             |
| `height`     | `0` (with `overflow: visible`)         | Zero content height; only the border-top is visible.                             |
| `box-sizing` | `content-box`                          | `<hr>` UA default; correct for this component.                                   |
| `color`      | `inherit`                              | Unused, but `<hr>` inherits `color` in some browsers — explicit inherit is safe. |

**No margin is ever set on Divider.** Spacing above and below a horizontal Divider is the parent's responsibility — either via `gap` on a flex/grid container or via padding on the adjacent elements. This is identical to the principle applied to Tag: zero self-margin, parent owns rhythm.

### Vertical (`orientation="vertical"`, `as="div"`)

| Property              | Value                                  | Notes                                                                                            |
| --------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `display`             | `block`                                | Must be block for `align-self: stretch` to work.                                                 |
| `width`               | `var(--hairline-w)` (1px)              | The rule is the element's inline dimension.                                                      |
| `align-self`          | `stretch`                              | Fills the cross-axis of the parent flex/grid container automatically. No explicit height needed. |
| `border`              | `0`                                    | Resets everything.                                                                               |
| `border-inline-start` | `var(--hairline-w) solid <tone-token>` | The rule. Logical property — RTL-correct.                                                        |
| `margin`              | `0`                                    | Zero self-margin. Parent controls horizontal spacing around the rule.                            |
| `flex-shrink`         | `0`                                    | Prevents the 1px rule from collapsing inside a compressed flex container.                        |

**`align-self: stretch` contract.** The vertical Divider only produces a visible rule when placed inside a `display: flex` or `display: grid` container. In a block flow context it would render 1px wide and 0px tall — invisible. This is documented in the prop intent (§8) and in the engineer handoff (§11). It is the consumer's responsibility to ensure the parent is a flex/grid container when using `orientation="vertical"`.

---

## 5. States

Divider is a static, non-interactive element. There are no hover, focus, active, disabled, or empty states. It renders identically in all states.

The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` has no effect on Divider because Divider has no transitions or animations.

---

## 6. Motion

None. Divider is a static structural element. No entrance animation, no transition on any property, no transform.

---

## 7. Accessibility

### Horizontal — `as="hr"` (default)

`<hr>` carries an implicit ARIA role of `separator` with implicit `aria-orientation="horizontal"`. No explicit ARIA attributes are needed on the root element. Screen readers announce an `<hr>` as a thematic break or separator (behavior varies by reader — NVDA, JAWS, and VoiceOver all handle it consistently as a structural boundary).

When `as="hr"` is used, the DS does **not** add `role="separator"` — it would be redundant and in some browser/reader combinations causes double-announcement.

### Vertical — `as="div"` (default for `orientation="vertical"`)

A `<div>` has no implicit role. The engineer must apply `role="separator"` and `aria-orientation="vertical"` explicitly. The prop intent in §8 reflects this requirement. The engineer should conditionally apply these attributes based on the rendered element type.

### Combined rule

The engineer should implement the ARIA contract as:

- When `as="hr"`: no explicit `role` or `aria-orientation` needed (both are implicit).
- When `as="div"`: `role="separator"` + `aria-orientation` matching the `orientation` prop value.

### Contrast

`--hairline` (`#D2D2D7`) and `--hairline-soft` (`#E5E5EA`) are non-text decorative elements. WCAG 1.4.11 (Non-text Contrast) applies only to interactive UI components and informational graphics — a decorative separator is exempt. No contrast ratio requirement applies. Both tokens are perceptible against all surfaces in the system by visual inspection.

### Keyboard interaction

Divider is not focusable and must not receive keyboard focus. It is a structural boundary, not a control.

---

## 8. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API and TypeScript types

interface DividerProps {
  /**
   * Orientation of the separator rule.
   * - "horizontal" (default): renders a full-width top-border rule. Root is <hr>.
   * - "vertical": renders a 1px left-border column. Root is <div>. Requires a
   *   flex or grid parent to stretch to the container's cross-axis height.
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Visual tone.
   * - "default" (default): --hairline (#D2D2D7 light / #2C2C2E dark). Standard structural separator.
   * - "muted": --hairline-soft (#E5E5EA light / #3A3A3C dark). Quieter decorative separator.
   */
  tone?: "default" | "muted";

  /**
   * Root element override.
   * - "hr" (default for horizontal): semantic thematic-break element, implicit role="separator".
   * - "div": required for vertical orientation; also valid for horizontal when
   *   the <hr> semantic is inappropriate in context (e.g. inside a <table> cell).
   *
   * When as="div" the engineer must apply role="separator" and aria-orientation
   * matching the orientation prop.
   *
   * This is a closed polymorphic prop: only "hr" and "div" are valid.
   */
  as?: "hr" | "div";

  /**
   * Additional CSS class. Merged via clsx, consistent with all DS atoms.
   */
  className?: string;

  /**
   * All remaining HTML attributes forwarded to the root element.
   * The root type is HTMLHRElement (as="hr") or HTMLDivElement (as="div").
   * The engineer handles the conditional ref/props typing.
   */
  [rest: string]: unknown;
}
```

**`as` defaults.** The engineer should default `as` based on `orientation`:

- `orientation="horizontal"` → `as` defaults to `"hr"`
- `orientation="vertical"` → `as` defaults to `"div"`

The consumer may override: `orientation="horizontal" as="div"` is valid for cases where an `<hr>` would be semantically wrong (e.g. a visual separator inside a flex toolbar that is not a thematic break).

**No `size`, `weight`, or `thickness` prop.** The separator is always 1px (`--hairline-w`). Thickness is a brand token decision, not a per-instance prop. If a 2px or 3px rule is needed in a specific molecule, that is a CSS override at the molecule level — not a Divider prop.

**No `color` prop.** Color is controlled entirely by the `tone` prop routing through tokens. Hardcoded colors are not permitted on any DS atom.

**No `label` prop.** A labeled divider ("Or", "Then") is a distinct pattern — a `DividerLabel` molecule — not a prop on this atom. Out of scope for this version.

---

## 9. Composition rules

### Call sites this atom replaces

The following existing inline border rules are candidates for Divider adoption once the component is implemented. They are documented here as the migration contract:

| File                                 | Rule                                                                                            | Orientation | Suggested tone |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `FailureMode/FailureMode.module.css` | `border-top: var(--hairline-w) solid var(--hairline)` on `.root` and `.root:last-child`         | horizontal  | default        |
| `Principle/Principle.module.css`     | `border-top` on `.root`, `border-bottom` on `.root:last-child`                                  | horizontal  | default        |
| `Statement/Statement.module.css`     | `border-top` on `.hairline` modifier                                                            | horizontal  | default        |
| `RoleCard/RoleCard.module.css`       | `border-top` on `.footer` slot                                                                  | horizontal  | muted          |
| `LinkCard/LinkCard.module.css`       | `border-top` on `.variantList`                                                                  | horizontal  | default        |
| `Quote/Quote.module.css`             | `border-top` on `.figcaption`                                                                   | horizontal  | muted          |
| `SiteShell/SiteShell.module.css`     | `border-top` on `.footer`                                                                       | horizontal  | default        |
| `Footer/Footer.module.css`           | `border-top` on `.root[data-standalone="true"]`                                                 | horizontal  | default        |
| `Tabs/Tabs.module.css`               | `border-bottom` on `.list` (horizontal), `border-right` on `.list[data-orientation="vertical"]` | both        | default        |
| `Dialog/Dialog.module.css`           | `border-top` on `.divider`                                                                      | horizontal  | default        |

**Migration note.** These are not breaking changes — the inline CSS rules continue to work and are not deprecated by this spec. Migration to `<Divider>` is a follow-up engineering task. The priority call sites are `FailureMode`, `Principle`, and `RoleCard` where the pattern repeats most predictably and where a single `<Divider>` atom placement is a clean one-to-one swap.

### How Divider composes

- **In a `flex-direction: column` container**: a horizontal `<Divider>` placed between siblings creates a full-width structural boundary. The container's `gap` should be set to 0 if the Divider is meant to be flush — or the Divider sits inside a `gap`-spaced flow and serves as a visual accent without controlling spacing.
- **In a `flex-direction: row` container**: a vertical `<Divider>` with `align-self: stretch` grows to the container's height automatically. The container must have `align-items` set (default `stretch` suffices).
- **In block flow**: only horizontal Divider is meaningful. Vertical Divider in block flow produces a 1px × 0px invisible element — document this as a constraint in JSDoc.
- **Divider does not compose with `<Tag>`, `<Button>`, or any interactive atom.** It is a layout boundary element.
- **Divider inside list molecules** (`FailureMode`, `Principle`): the molecule manages the Divider's surrounding spacing. The Divider has zero margin by design.

---

## 10. Out of scope

- **Labeled divider** ("Or", "And then", "—"): a `DividerLabel` molecule — separate spec if needed.
- **Gradient or ornamental dividers**: not in the brand register. The Pouākai system uses hairlines, not decorative rules.
- **Dashed or dotted style variants**: no use case identified. One line style — solid.
- **`thickness` prop or multi-pixel variants**: Pull's 3px rule is a molecule-level brand decision, not a Divider variant. Divider is always 1px (`--hairline-w`).
- **Spacing props** (`my`, `mx`, `spacing`): Divider has no self-margin by design. Adding spacing props would undermine the principle that parent layout controls rhythm.
- **Dark-mode per-component overrides**: `--hairline` and `--hairline-soft` resolve correctly via the global dark-mode token block. No per-component `@media` needed.
- **Animated divider** (grow-in, fade-in): if an entrance animation is ever needed in a specific context, that is an animation class applied by the parent, not a Divider prop.
- **RTL**: `border-inline-start` is already logical-property correct. No additional RTL work needed for horizontal. Vertical uses `border-inline-start` which is the correct logical equivalent of `border-left` — RTL consumers get the mirrored placement automatically.

---

## 11. Engineer handoff

**To `poukai-ds-engineer`:**

This is a straightforward atom. Key implementation notes:

1. **Token addition first.** `--hairline-soft` is a new token proposed in this spec. It must be added to `src/tokens/tokens.css` under the `--hairline` declaration in both the `:root` light block and the `@media (prefers-color-scheme: dark)` block before the component CSS module references it. Light: `#E5E5EA`. Dark: `#3A3A3C`. The `meta/brand.md` decision log is updated in the same commit.

2. **CSS module structure.** The component needs four rule combinations: horizontal × default, horizontal × muted, vertical × default, vertical × muted. Use data attributes or CSS class modifiers — whichever is consistent with the rest of the DS atom pattern. The tone token swap is the only difference between default and muted within each orientation.

3. **`<hr>` reset.** Browser UA stylesheets apply `border: 1px inset` (or similar) to `<hr>`. The module must apply `border: 0` before the `border-top` override to prevent double-line rendering in some browsers (notably Firefox). This is documented in §4.

4. **Vertical `align-self: stretch` requires flex/grid parent.** Add a JSDoc comment to the component documenting this constraint. In block flow, a vertical Divider is invisible.

5. **ARIA.** When `as="div"`, apply `role="separator"` and `aria-orientation` dynamically. When `as="hr"`, omit both — they are implicit. See §7.

6. **`as` default logic.** Default `as` from `orientation` as described in §8 — do not make consumers always specify both props.

7. **`forwardRef`.** The ref type is conditional on `as` — `HTMLHRElement` for `"hr"`, `HTMLDivElement` for `"div"`. Use an overloaded or union approach consistent with how other polymorphic atoms in the DS handle this.

8. **`displayName = "Divider"`.** Required, consistent with every DS atom convention.

9. **Story matrix minimum:** Default horizontal / Muted horizontal / Default vertical (in a flex row context) / Muted vertical. An AllVariants story showing all four in a single canvas is strongly preferred.

10. **Migration is not part of the implementation ticket.** Ship the atom. Migration of existing call sites is a follow-up.
