# PrincipleList

**Status**: Approved

## 1. Intent

`<PrincipleList>` is the canonical organism for presenting a sequenced set of editorial principles on a page. It frames a `Section` header (heading + optional lede) above a vertical stack of `Principle` molecules, ensuring that the margin-numeral rhythm and inter-item spacing are applied consistently across every surface that renders a principle set — rather than each page rolling its own `gap` and padding values.

## 2. Anatomy

```
<section>                       ← Section root (aria-labelledby heading)
  [heading block]               ← Section eyebrow / title / lede slots
  <ol>                          ← ordered list; preserves semantic sequencing
    <li> <Principle … /> </li>
    <li> <Principle … /> </li>
    …
  </ol>
</section>
```

- **Root**: `Section` molecule — owns block padding, heading block, and the gap between the heading block and the list.
- **List container**: `<ol>` — semantically ordered; screen readers announce item count and position. `list-style: none` is applied via CSS; the visual numerals are owned by each `Principle`.
- **List items**: each `Principle` is wrapped in `<li>`. `PrincipleList` does not constrain `Principle` props — consumers pass `number`, `title`, and body content directly to each `Principle`.
- **Dividers**: a `border-top: var(--hairline-w) solid var(--hairline)` rule on each `<li>` except the first separates items. This mirrors the hairline treatment already present in the existing `Principle` molecule.

## 3. Tokens

- `--space-12` — gap between `Section` header block and `<ol>` (via `Section` default behavior)
- `--space-16` — `Section` block padding top + bottom (`size="default"`)
- `--hairline` — `<li>` border-top color
- `--hairline-w` — `<li>` border-top width (1px)
- `--space-8` — padding-top on each `<li>` that carries a divider (mobile)
- `--space-12` — padding-top on each `<li>` that carries a divider (desktop, `@media (--bp-md)`)
- `--bg` — inherited page background; no surface override at this layer

## 4. Variants / Props

| Prop       | Type                   | Default     | Rationale                                                                                                                                   |
| ---------- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `heading`  | `ReactNode`            | —           | Section title; passed through to `Section`'s `title` slot. Required in practice — an unlabeled PrincipleList has no accessible region name. |
| `eyebrow`  | `string \| ReactNode`  | —           | Optional; passed through to `Section`'s `eyebrow` slot.                                                                                     |
| `lede`     | `ReactNode`            | —           | Optional supporting copy; passed through to `Section`'s `lede` slot.                                                                        |
| `size`     | `"default" \| "tight"` | `"default"` | Passed through to `Section`. Use `"tight"` on dense editorial pages.                                                                        |
| `children` | `ReactNode`            | —           | Required. The `Principle` molecule instances. Each child is wrapped in a `<li>`.                                                            |

No `dividers` prop — dividers between items are always present. The editorial rhythm of PrincipleList is defined by the separation between numeraled items; toggling dividers off is not a supported variant.

## 5. Interaction

Static organism. No hover, focus, active, or dismiss states at this layer. Keyboard users traverse into individual `Principle` molecules; PrincipleList itself is not a focusable element. Focus order follows DOM order: heading block, then list items top-to-bottom.

## 6. A11y

- `Section` root is `<section aria-labelledby={headingId}>` — exposes a named region landmark when a heading is present.
- `<ol>` conveys sequential list semantics. Screen readers announce "list, N items" — meaningful for a set of sequenced principles.
- Each `Principle`'s `number` prop (Roman numeral) is `aria-hidden` per the Principle molecule spec; the semantic ordering comes from the `<ol>` / `<li>` structure.
- Minimum two children — a single-item "list" is not a list.
- Headings inside each `Principle` default to the level set by the Principle molecule; PrincipleList does not re-override `titleAs`.

## 7. Motion

None — static organism. The global `prefers-reduced-motion: reduce` block in `tokens.css` handles any motion inside child Principle molecules. PrincipleList introduces no additional transitions or entrance animations.

## 8. Anti-patterns

- **Do not use for FailureMode sets.** `FailureModeList` is the correct organism; the two components encode distinct semantic registers (Roman-numeral principles vs. Arabic-indexed failure cases).
- **Do not use for unordered feature grids.** `FeatureGrid` is the correct organism; PrincipleList implies sequenced editorial content, not peer feature tiles.
- **Do not nest PrincipleList inside another PrincipleList.** Section-within-Section doubling applies here too.
- **Do not pass fewer than two Principle children.** A single-item list has no sequential meaning and no rhythm.
- **Do not use as a numbered step/process flow.** `Stepper` is the correct primitive for progress indication; PrincipleList is editorial, not instructional.
- **Do not override the `<ol>` to `<ul>`.** The ordered list is load-bearing for accessibility — it communicates sequence and count to assistive technology.

## 9. Depends on

- `Section` (molecule) — provides the page-section frame, heading block, and block padding.
- `Principle` (molecule) — the sole valid child type; PrincipleList does not style arbitrary children.
