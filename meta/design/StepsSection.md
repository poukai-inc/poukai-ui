# StepsSection

**Status**: Approved

## 1. Intent

`StepsSection` is the organism that frames a `Stepper` molecule inside a `Section` wrapper for marketing and editorial process-explainer surfaces — the canonical "how it works" three-step pattern. It serves one surface type: a numbered, linear sequence of steps where no step is "current" (all steps are equally visible, not progress-tracking a user through a flow). The `current` prop on `Stepper` is set to `-1` (no active step) when used in this context.

## 2. Anatomy

```
<section aria-labelledby="steps-title">          ← Section root (semantic landmark)
  ┌─ header block ──────────────────────────────┐
  │  [eyebrow]   optional                        │
  │  <h2 id="steps-title">How it works</h2>      │
  │  [lede]      optional                        │
  └─────────────────────────────────────────────┘
  ↕ var(--space-12)
  ┌─ Stepper ───────────────────────────────────┐
  │  ① Step label + body                         │
  │  ② Step label + body                         │
  │  ③ Step label + body                         │
  └─────────────────────────────────────────────┘
</section>
```

- **Section wrapper**: semantic `<section>` via the `Section` molecule. Owns the header block (eyebrow, title, lede) and block padding.
- **Stepper slot**: children slot of `Section`. Receives a `Stepper` molecule with `current={-1}` and a `steps` array where each step carries both a `label` and a `body` description string.
- **Step body**: `Stepper` as currently specced carries `label` per step; the marketing context also requires a `body` description per step (short one-sentence explanation). This is a prop extension on `Stepper`, not a new component.

## 3. Tokens

All tokens are pre-existing in `src/tokens/tokens.css`.

- `--space-12` — gap between Section header block and Stepper children slot (owned by Section)
- `--space-16` — Section block padding top + bottom (`size="default"`)
- `--hero-max` — Section header block max-width
- `--fg` — title color (inherited via Section / global `h2` rule)
- `--fg-muted` — lede color and step body copy color
- `--font-serif` — Section title font family (inherited via global `h2` rule)
- `--font-sans` — Stepper label and body font family
- `--fs-body` — lede font size; also step body description font size
- `--fs-meta` — step label font size (subordinate to the numeral)
- `--fs-h2` — Section title font size (via global `h2` rule)
- `--hairline` — Stepper connector line or divider between steps
- `--hairline-w` — 1px connector line weight
- `--space-4` — gap between step numeral and step label/body block
- `--space-8` — gap between sibling steps
- `--lh-body` — step body description line-height

## 4. Variants / Props

`StepsSection` itself carries the minimal prop surface needed for the Section header; all step data is delegated to `Stepper`.

| Prop      | Type                                      | Default     | Rationale                                                                                                      |
| --------- | ----------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `heading` | `string`                                  | —           | Required. Becomes the Section `title` (rendered as `h2`).                                                      |
| `eyebrow` | `string \| ReactNode`                     | `undefined` | Optional. Forwarded to Section `eyebrow` slot. Useful for "01 · Process" style labels.                         |
| `lede`    | `string \| ReactNode`                     | `undefined` | Optional. Supporting copy below the heading.                                                                   |
| `steps`   | `Array<{ label: string; body?: string }>` | —           | Required. Forwarded to the Stepper `steps` prop. `body` is the per-step description for the marketing context. |
| `size`    | `"default" \| "tight"`                    | `"default"` | Forwarded to Section `size`. Use `"tight"` when StepsSection is embedded in a denser page.                     |

`current` on the internal `Stepper` is always `-1` (no active step) in this organism. The organism is not a progress indicator — it is a process explainer. Consumers who need a live progress stepper use `Stepper` directly, not `StepsSection`.

## 5. Interaction

Static organism. No hover, focus, active, or dismiss behavior on the organism itself. The Stepper in the explainer context is not interactive — steps are not clickable, not tabbable as controls. Any focusable elements within step bodies (e.g. a link) follow standard keyboard tab order.

## 6. A11y

- Root element is `<section>` (via Section) with `aria-labelledby` wired to the `<h2>` title element — creates a named region landmark.
- Stepper renders a semantic `<ol>` with each step as `<li>`. `aria-current` is not applied when `current={-1}` (no active step).
- Step numerals are visible ordinal indicators; the `<ol>` list structure conveys sequence to screen readers independently.
- `--fg` on `--bg`: 16.29:1 (AAA). `--fg-muted` on `--bg`: 4.91:1 (AA). Step body at `--fg-muted` passes AA at `--fs-body` (17–19px).
- No ARIA roles beyond what Section and Stepper already establish.

## 7. Motion

None at the organism level. StepsSection is a static composition. If a staggered step-reveal animation is added to Stepper in the future, the organism inherits it automatically. `prefers-reduced-motion` handling lives in `tokens.css` globally and in Stepper's own module CSS.

## 8. Anti-patterns

- **Do not use as a progress indicator.** StepsSection is a marketing explainer, not a multi-step form stepper. For live progress (step 2 of 4), use `Stepper` directly with a meaningful `current` value.
- **Do not nest inside another Section.** StepsSection already wraps a Section — nesting would double block padding and break page rhythm.
- **Do not use for unordered feature lists.** If the items have no sequence dependency, use `FeatureGrid` or `PrincipleList` instead.
- **Do not use for more than ~5 steps.** Beyond five steps the linear strip layout becomes cognitively heavy. A timeline organism is more appropriate for long chronological sequences.
- **Do not place step body copy longer than two sentences.** This organism is scannable marketing content; long-form prose belongs in `ArticleLayout`.

## 9. Depends on

- `Section` (molecule) — owns the header block, block padding, and landmark semantics.
- `Stepper` (molecule) — owns the numbered step strip, `<ol>` structure, and `aria-current` behavior.

## Open questions

1. **`body` on Stepper steps.** The Stepper spec (issue #176) defines `steps` as `Array<{ label: string }>`. The marketing context requires a per-step `body` description string. This spec assumes Stepper's `steps` type is extended to `Array<{ label: string; body?: string }>` — Stepper must be updated in its own spec before this organism can be implemented. Flag for the engineer: do not implement StepsSection until Stepper carries the `body` field.
2. **Stepper layout in explainer mode.** Stepper is specced as a numbered indicator strip (horizontal or vertical TBD). In the marketing context, a vertical stack with numeral + label + body reads most clearly at all viewport widths. If Stepper ships as horizontal-only, a `orientation="vertical"` prop or a distinct layout mode will be needed. Confirm Stepper's orientation API before implementing StepsSection.
