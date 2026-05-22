# Design spec: Spacer

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21
**Implements proposal**: n/a — explicit-gap utility for non-flex/grid layout contexts

---

## 1. Purpose

`<Spacer>` is an explicit-gap atom for contexts where `flex`/`grid` `gap` cannot reach. It renders an invisible, aria-hidden block (or inline) element whose sole dimension is a single spacing token — no background, no border, no content. It is not a general-purpose spacing utility and should not be the default tool for rhythm; the vast majority of spacing in the DS is owned by `gap`, section padding, or component-internal tokens. Spacer exists for the narrow set of cases where none of those mechanisms are available to the consumer — primarily inside `<Prose>` long-form HTML flow and inside legacy block containers where `gap` is architecturally unavailable.

The component is deliberately small. One required prop (`size`), one optional axis prop (`axis`), one optional element variant (`as`). No tokens are introduced. No motion. No visual output beyond occupying space.

---

## 2. Anatomy

- **Root element**: `<div aria-hidden="true">` by default. Swappable to `<span aria-hidden="true">` via the `as` prop for inline-flow contexts.
- **No children**: Spacer is self-closing in usage. Passing children is valid HTML but semantically meaningless — the engineer may add a dev-mode warning if children are detected.
- **No visible output**: no background, no border, no content. The element is invisible to sighted users and silenced from the accessibility tree via `aria-hidden="true"`.
- **Dimension**: controlled entirely by CSS class. `axis="block"` → `height: var(--space-N); width: 100%`. `axis="inline"` → `width: var(--space-N); height: 1em; display: inline-block`.

---

## 3. Tokens used

No new tokens are introduced. Spacer consumes only the existing atom-tier spacing scale.

| Token        | Value   | px equivalent |
| ------------ | ------- | ------------- |
| `--space-1`  | 0.25rem | 4px           |
| `--space-2`  | 0.5rem  | 8px           |
| `--space-3`  | 0.75rem | 12px          |
| `--space-4`  | 1rem    | 16px          |
| `--space-6`  | 1.5rem  | 24px          |
| `--space-8`  | 2rem    | 32px          |
| `--space-10` | 2.5rem  | 40px          |

`--space-12`, `--space-16`, `--space-24`, and `--space-32` are excluded by design. Those are layout-tier values — section padding, page-rhythm, and outer margin decisions belong to the template or section primitive, not to an inline spacer atom. Any call site that needs a 3rem+ explicit gap is almost certainly the wrong shape for this component; the correct fix is to own the layout via `gap` or section padding tokens.

---

## 4. Sizes table

| `size` prop | Token        | px   | Canonical use                                     |
| ----------- | ------------ | ---- | ------------------------------------------------- |
| `"1"`       | `--space-1`  | 4px  | Sub-baseline micro-nudge inside dense Prose flow  |
| `"2"`       | `--space-2`  | 8px  | Tight beat between inline clusters in Prose       |
| `"3"`       | `--space-3`  | 12px | Minor editorial beat — tighter than paragraph gap |
| `"4"`       | `--space-4`  | 16px | Standard paragraph-equivalent gap                 |
| `"6"`       | `--space-6`  | 24px | Section-within-Prose beat                         |
| `"8"`       | `--space-8`  | 32px | Strong editorial pause inside a content block     |
| `"10"`      | `--space-10` | 40px | Maximum atom-tier gap; use sparingly              |

The `size` prop is a closed union of string literals — not a number, not a CSS length. This ensures every Spacer value maps to a token and no off-scale value can be passed.

---

## 5. Axis behavior

### `axis="block"` (default)

The element occupies vertical space in block flow.

```
┌─────────────────────────────────┐
│ [preceding sibling]             │
│                                 │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← Spacer: height=var(--space-N), width=100%
│                                 │
│ [following sibling]             │
└─────────────────────────────────┘
```

CSS contract:

```css
display: block;
height: var(--space-N);
width: 100%;
```

The width is `100%` rather than `0` to prevent the element from collapsing in some layout contexts. The height is the authoritative dimension.

### `axis="inline"`

The element occupies horizontal space in inline flow. Useful for nudging inline siblings apart inside a `<p>` or inline editorial context.

```
[word] ░░░ [word]
          ↑ Spacer: width=var(--space-N), display=inline-block, height=1em
```

CSS contract:

```css
display: inline-block;
width: var(--space-N);
height: 1em;
vertical-align: bottom;
```

`height: 1em` prevents the inline-block from contributing a different baseline offset than its siblings. `vertical-align: bottom` aligns the spacer element to the line's bottom edge, which is the least disruptive alignment for most inline contexts.

**When `as="span"`, `axis="inline"` is the expected pairing.** Using `as="div"` with `axis="inline"` is technically valid but will produce a block-inside-inline context; the engineer may emit a dev-mode warning for this combination.

---

## 6. When to use vs. flex gap

This section is the most important part of the spec. Read it before reaching for `<Spacer>`.

### Use Spacer when

1. **Inside `<Prose>` long-form HTML where the parent context does not own layout.** This is the canonical use case. Prose's rhythm is declared via adjacent-sibling selectors on element types. When an editorial beat needs to deviate from that rhythm — an extra pause before a pull-quote, a tighter gap between a heading and a specific paragraph — a `<Spacer>` dropped into the HTML stream is the correct override. Modifying Prose's global margin ramp for a single editorial beat is wrong.

2. **Between two `<Prose>`-rendered siblings where the natural margin rhythm is wrong for a specific editorial beat.** The Prose `h2` top-margin is `--space-8` globally. If a specific `h2` needs more breathing room because it follows a dense code block, a `<Spacer size="4">` before the heading is a surgical adjustment that leaves the global ramp intact.

3. **Where a sibling is conditionally rendered and you need a stable spacer slot.** When an element appears or disappears based on state, `gap` distributes evenly across whatever children exist at render time. A `<Spacer>` that conditionally renders alongside the optional sibling preserves the spacing contract when the sibling is present without affecting layout when it is absent. This pattern is cleaner than toggling negative-margin compensators.

4. **Where the layout primitive is `<p>` or another non-flex/grid container and `gap` is unavailable.** Inline editorial flow, inside table cells, inside `<blockquote>` bodies, inside older template structures that predate the DS layout primitives — these are block flow contexts where `gap` literally does not apply. Spacer is the right tool.

### Do not use Spacer when

- **Between flex or grid siblings.** Set `gap` on the container. Spacer inside a `gap`-capable layout is redundant and creates a second source of truth for the spacing value.
- **For section-tier rhythm.** Use the section padding tokens directly on the layout primitive. A `<Spacer size="10">` standing in for a section's top padding is a misuse — it is fragile, invisible to future editors, and breaks when the layout changes.
- **For component-internal padding.** If a component needs more breathing room inside its own box, adjust its own padding tokens. Spacer is an interstitial, not an internal padding mechanism.
- **As a vertical offset hack for typography.** If the type ramp produces the wrong visual gap between elements, fix the ramp (`line-height`, `margin`, the font metrics). Spacer does not fix a broken type contract — it hides it.

---

## 7. States

None. Spacer is a static, non-interactive layout utility. There are no hover, focus, active, disabled, or empty states.

`@media (prefers-reduced-motion: reduce)` has no effect — Spacer has no transitions or animations.

---

## 8. Motion

None. Static component.

---

## 9. Accessibility

- `aria-hidden="true"` is applied unconditionally on the root element regardless of `as`, `axis`, or `size`. Spacer is decorative layout infrastructure. It must never be announced by a screen reader; it carries no semantic meaning.
- No `role` attribute. The element is removed from the accessibility tree entirely via `aria-hidden`.
- Not focusable. Spacer must never receive keyboard focus. No `tabIndex` is accepted.
- No children should be passed to Spacer. If a consumer passes children, those children are also hidden because the `aria-hidden` is on the root — any content inside is silently invisible to assistive technology. The engineer may add a dev-mode invariant warning if `children` is detected.
- `<span aria-hidden="true">` is valid. An `aria-hidden` span at the inline level is a legitimate pattern for decorative inline spacing.

---

## 10. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API and TypeScript types

interface SpacerProps {
  /**
   * Required. Spacing amount, resolved to a DS space token.
   * Closed union — only atom-tier steps. Layout-tier values (12, 16, 24, 32)
   * are intentionally excluded; those decisions belong to the template layer.
   */
  size: "1" | "2" | "3" | "4" | "6" | "8" | "10";

  /**
   * Layout axis.
   * - "block" (default): height = var(--space-N), width = 100%.
   *   Root must be "div" (block element).
   * - "inline": width = var(--space-N), display = inline-block, height = 1em.
   *   Root should be "span" in this case; pairing as="div" with axis="inline"
   *   is a block-in-inline context and should emit a dev-mode warning.
   */
  axis?: "block" | "inline";

  /**
   * Root element override.
   * - "div" (default): block-level element. Correct for axis="block".
   * - "span": inline element. Correct for axis="inline" inside Prose or
   *   inline flow containers.
   *
   * Closed union — no other elements are permitted.
   */
  as?: "div" | "span";

  /**
   * Additional CSS class. Merged with the size+axis class. Consistent
   * with all DS atoms.
   */
  className?: string;

  /**
   * Forwarded ref. Type is HTMLDivElement when as="div",
   * HTMLSpanElement when as="span".
   */
  ref?: React.Ref<HTMLDivElement | HTMLSpanElement>;
}
```

`size` is required. There is no default — a Spacer with no declared size has no purpose. The engineer should not add a fallback; callers must be explicit.

`aria-hidden="true"` is always applied by the component. The consumer cannot override it to `false` — doing so would expose a dimensionless, contentless element to the accessibility tree, which would confuse assistive technology. The engineer should absorb and discard any `aria-hidden` passed via `...rest`.

---

## 11. Composition rules

- `<Spacer>` inside `<Prose>`: the canonical composition. Drop a `<Spacer size="8">` between a code block and a heading in a markdown-rendered body to produce an editorial beat that overrides the global Prose ramp without touching the ramp.
- `<Spacer>` between conditionally rendered siblings: compose with any component that may or may not render. The Spacer renders when the sibling renders; the spacing contract remains correct in both states.
- `<Spacer>` does not compose with `<Divider>`. They solve adjacent but distinct problems: Divider is a visible separator; Spacer is invisible gap. If a separator and a gap are both needed, place a `<Spacer>` before and/or after a `<Divider>` — but consider whether the Divider's parent layout could handle this with `gap` first.
- `<Spacer>` does not compose with interactive atoms (`Button`, `Tag`, `Link`, etc.). It is a passive layout utility.
- Nesting one `<Spacer>` inside another has no meaning and should not be done.

---

## 12. Rationale — why an atom at all when gap exists 95% of the time

The question is worth answering explicitly because the DS has a standing preference for `gap`-based spacing.

Three things make Spacer worth existing as a named atom rather than a utility class or an inline `style`:

1. **Token enforcement.** An inline `style={{ height: "40px" }}` is off-scale and invisible to future token changes. A `<Spacer size="10">` is tied to `--space-10` — if the scale changes, the Spacer changes with it. This is the same argument that justifies every token-consuming atom in the system.

2. **The Prose context is real and recurring.** Prose's descendant-selector rhythm is deliberately global. The only escape hatch without Spacer is either (a) modifying the global ramp for a single editorial beat (wrong), (b) wrapping content in an extra `<div>` with custom margin (valid but noisy), or (c) using inline `style` (off-scale). Spacer is cleaner than all three.

3. **Conditional sibling spacing.** The `gap` property distributes between all present siblings — it cannot be made conditional on one specific sibling appearing. Spacer tied to a conditional sibling's render is the right structural expression of "add this gap only when that element exists."

This is not a general-purpose margin utility. The `size` prop is deliberately constrained to the atom tier. If a use case calls for a larger value, the answer is to promote the layout decision to the appropriate template or section primitive.

---

## 13. Decisions and rejected alternatives

### Numeric `size` prop (e.g. `size={4}`)

Rejected. A numeric prop implies an arbitrary scale and makes it trivially easy to pass off-scale values (e.g. `size={5}`, `size={7}`) that have no token. String literals `"1" | "2" | "3" | "4" | "6" | "8" | "10"` match the token naming convention exactly and TypeScript will flag any gap in the sequence at the call site.

### Arbitrary CSS length prop (e.g. `height="1.25rem"`)

Rejected unconditionally. This breaks the token contract, makes the component useless as a system primitive, and opens a vector for one-off values that compound over time.

### Including `--space-12` / `--space-16` / `--space-24` / `--space-32`

Rejected. These are layout-tier values. Any consumer reaching for a 3rem+ explicit spacer is expressing a layout or section-rhythm decision that belongs in the template layer, not an inline atom. Excluding them from the union is intentional pressure to use the right tool.

### Inline `style` with a CSS custom property (e.g. `style={{ "--spacer-size": "var(--space-N)" }}`)

Considered and rejected in favor of class-per-size. A CSS custom property approach produces a single CSS rule that reads the property at runtime, which is flexible but verbose in the DOM (`style="--spacer-size: var(--space-10)"`). Class-per-size produces static, predictable CSS: seven classes, each with a hard-coded `height` value resolved from a token. This matches the precedent established by `Divider` (which uses class modifiers rather than runtime custom properties) and produces a smaller, more cacheable stylesheet. The seven classes are small enough that static generation has no cost downside.

### `display: none` / `visibility: hidden` for `aria-hidden`

Rejected. `aria-hidden="true"` on a visible (block-level) element is the correct pattern for decorative spatial elements. `display: none` would collapse the height to zero, defeating the component's only purpose.

---

## 14. Visual examples

### Block spacer between two Prose segments

```
┌─────────────────────────────────────────────┐
│ The extraction rate improved by 34% in      │
│ the first quarter following deployment.     │   ← <p>
│                                             │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │   ← <Spacer size="8" /> (2rem of height)
│                                             │
│ What followed was less expected.            │   ← <h2> (no top-margin override needed;
│                                             │     the Spacer above provides the beat)
└─────────────────────────────────────────────┘
```

### Conditional sibling with stable spacer

```
{showCallout && (
  <>
    <Spacer size="4" />
    <Callout>...</Callout>
  </>
)}
```

When `showCallout` is false: no space, no element. When true: 16px gap before the callout. The parent's `gap` is unaffected.

### Inline axis between two inline clusters

```
<p>
  Released <strong>Q2 2025</strong>
  <Spacer as="span" axis="inline" size="3" />
  <Tag>stable</Tag>
</p>
```

Produces 12px of inline horizontal space between the strong element and the tag without altering the paragraph's line-height.

---

## 15. Out of scope

- **Named semantic sizes** (`"xs"`, `"sm"`, `"md"`, `"lg"`): rejected. Named sizes are a layer of abstraction over token names that adds friction without adding clarity. The token step numbers are already the canonical vocabulary in this DS.
- **`flex` / `flexGrow` props** for filling remaining space in a flex container. If a consumer needs a flex-grow spacer ("push remaining siblings to the far end"), that is a CSS `flex: 1` applied to a plain `<div>` — not this component's job.
- **`maxSize` or `minSize` clamp variants.** Not needed; Spacer is a fixed spatial value.
- **Multiple axes in one instance** (both horizontal and vertical gap simultaneously). Use two Spacers or, better, use `gap` on the container.
- **Responsive size prop** (different size per breakpoint). If a layout gap needs to change per breakpoint, the layout primitive — not a Spacer — is the right place for that decision.

---

## 16. Engineer handoff

**To `poukai-ds-engineer`:**

This is a small, zero-token atom. Implementation should be proportionally minimal.

1. **No token additions.** Spacer consumes only existing `--space-1` through `--space-10` from `src/tokens/tokens.css`. No changes to the token file or `meta/brand.md` are needed.

2. **Class-per-size pattern.** Generate fourteen static CSS classes: seven sizes × two axes. Each class is a named modifier (e.g. `.size1Block`, `.size1Inline`, `.size4Block`, `.size4Inline`, etc.). This is the precedent from `Divider` which uses class modifiers rather than runtime custom properties. No dynamic `style` attribute is needed. The CSS module is small.

   ```css
   /* Block axis — height is the authoritative dimension */
   .size1Block {
     display: block;
     height: var(--space-1);
     width: 100%;
   }
   .size2Block {
     display: block;
     height: var(--space-2);
     width: 100%;
   }
   .size3Block {
     display: block;
     height: var(--space-3);
     width: 100%;
   }
   .size4Block {
     display: block;
     height: var(--space-4);
     width: 100%;
   }
   .size6Block {
     display: block;
     height: var(--space-6);
     width: 100%;
   }
   .size8Block {
     display: block;
     height: var(--space-8);
     width: 100%;
   }
   .size10Block {
     display: block;
     height: var(--space-10);
     width: 100%;
   }

   /* Inline axis — width is the authoritative dimension */
   .size1Inline {
     display: inline-block;
     width: var(--space-1);
     height: 1em;
     vertical-align: bottom;
   }
   .size2Inline {
     display: inline-block;
     width: var(--space-2);
     height: 1em;
     vertical-align: bottom;
   }
   .size3Inline {
     display: inline-block;
     width: var(--space-3);
     height: 1em;
     vertical-align: bottom;
   }
   .size4Inline {
     display: inline-block;
     width: var(--space-4);
     height: 1em;
     vertical-align: bottom;
   }
   .size6Inline {
     display: inline-block;
     width: var(--space-6);
     height: 1em;
     vertical-align: bottom;
   }
   .size8Inline {
     display: inline-block;
     width: var(--space-8);
     height: 1em;
     vertical-align: bottom;
   }
   .size10Inline {
     display: inline-block;
     width: var(--space-10);
     height: 1em;
     vertical-align: bottom;
   }
   ```

3. **`forwardRef` on a union element.** The ref type depends on `as`: `HTMLDivElement` for `"div"`, `HTMLSpanElement` for `"span"`. Use an overloaded forwardRef or a union type approach consistent with how `VisuallyHidden` handles its `"span" | "div"` union — check that component for the exact pattern used in the DS.

4. **`aria-hidden="true"` always.** Apply it in the component, not via a default prop that can be overridden. If `aria-hidden` appears in `...rest`, the component should absorb and ignore it (the component's own value takes precedence). The engineer may achieve this by destructuring `aria-hidden` out of rest and discarding it, then spreading the remainder.

5. **Dev-mode warnings (optional but recommended):**
   - `children` passed: emit a warning. Spacer has no content slot.
   - `as="div"` + `axis="inline"`: emit a warning. Block element in inline flow.

6. **`displayName = "Spacer"`.** Required, consistent with every DS atom convention.

7. **Story matrix minimum:** all seven `size` values at `axis="block"` in a vertical stack; all seven at `axis="inline"` in a single paragraph of text; one conditional-sibling example showing the spacer toggling with a sibling. A size-ruler overlay comparing the rendered heights to the token values is a useful developer story.

8. **No `aria-label`, `role`, or `tabIndex` should be accepted or forwarded.** Strip these from `...rest` in the same way as `aria-hidden` — or document clearly in JSDoc that they are discarded.
