# Fieldset

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`<Fieldset>` groups a set of related `<Field>` molecules under a shared semantic `<legend>`, enforcing consistent vertical spacing between fields and a clear visual boundary around the group. It serves form surfaces where multiple inputs share a single conceptual scope — billing address blocks, payment details, profile sections, notification preference groups. A Fieldset communicates to sighted and assistive-technology users alike that these fields belong together and should be understood as a unit.

## 2. Anatomy

```
<fieldset>                    ← root; resets browser default border
  <legend>                    ← legend slot; visually styled as a section label
    Billing address
  </legend>
  <div class="fields">        ← field stack; owns vertical gap between Field children
    <Field label="Street" … />
    <Field label="City" … />
    <Field label="Postal code" … />
  </div>
</fieldset>
```

- **Root**: native `<fieldset>` — inherits browser grouping semantics; border reset to `none`.
- **Legend slot**: native `<legend>` styled at `--fs-meta` weight 500, `--fg` color. Renders the group label for screen readers and visually.
- **Fields container**: a `<div>` wrapping `children` (the Field instances), using flexbox column with `--space-4` gap by default; `--space-6` gap for the `spacious` variant.
- **Children slot**: accepts any number of `<Field>` molecules or `<FormRow>` molecules as direct children.

## 3. Tokens

- `--fs-meta` — legend font size (14px; subordinate to section headings, clearly a group label)
- `--font-sans` — legend font family
- `--fg` — legend text color
- `--fg-muted` — optional legend muted variant (when legend is secondary / assistive)
- `--hairline` — optional top border rule separating the fieldset from preceding content
- `--hairline-w` — border width for the optional rule
- `--space-1` — legend bottom margin (tight coupling to the field stack below)
- `--space-4` — default gap between Field children (16px)
- `--space-6` — spacious gap between Field children (24px)
- `--space-8` — fieldset block padding when `bordered` variant is used (top + bottom)
- `--space-6` — fieldset inline padding when `bordered` variant is used (left + right)
- `--radius-3` — border radius for `bordered` variant container (8px)
- `--surface` — background for `bordered` variant (recessed surface fill)

## 4. Variants / Props

| Prop       | Type                          | Default       | Rationale                                                                                              |
| ---------- | ----------------------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `legend`   | `string`                      | required      | The group label text. Always a string; structural legend markup belongs in the legend element itself.  |
| `spacing`  | `"default" \| "spacious"`     | `"default"`   | `default` uses `--space-4` gap; `spacious` uses `--space-6` for forms with more visual breathing room. |
| `bordered` | `boolean`                     | `false`       | Adds `--surface` background, `--hairline` border, `--radius-3` corner, and `--space-8`/`--space-6` padding for visually contained groups (e.g. a payment block inside a larger form). |
| `legendTone` | `"default" \| "muted"`      | `"default"`   | `"muted"` renders the legend in `--fg-muted` — for secondary/optional sections that should recede.    |
| `disabled` | `boolean`                     | `false`       | Maps to the native `<fieldset disabled>` attribute, which propagates the disabled state to all descendant form controls automatically. |

No `size` prop: field sizing is owned by individual `<Field>` instances. No `columns` prop: multi-column layout is delegated to `<FormRow>`.

## 5. Interaction

- **Keyboard nav**: all tab stops belong to individual `<Field>` descendants. `<Fieldset>` itself is not focusable and adds no tab stops.
- **Disabled propagation**: when `disabled` is `true`, the native `<fieldset disabled>` attribute disables all descendant inputs, selects, and buttons without requiring per-field prop threading. Screen readers announce each control as disabled within the group context.
- **No hover, focus, or active states** on the Fieldset container itself — it is structural scaffolding, not an interactive surface.

## 6. A11y

- Root element `<fieldset>` provides a native grouping role (`role="group"` equivalent) with the `<legend>` as its accessible name. No `aria-labelledby` or `aria-label` needed — the browser and AT compute the name from `<legend>` natively.
- `<legend>` must be the **first child** of `<fieldset>` for correct AT announcement; the engineer must preserve this DOM order regardless of visual reordering attempts.
- `disabled` attribute on `<fieldset>` propagates to descendants per HTML spec — no JS coordination needed.
- axe rules in play: `landmark-unique` (not applicable — fieldset is not a landmark), `label` (each descendant Field must have its own label; Fieldset does not supply per-field labels), `color-contrast` on legend text: `--fg` (#1D1D1F) on `--bg` (#FBFBFD) = 16.29:1 (AAA); `--fg-muted` (#6E6E73) on `--bg` = 4.91:1 (AA).

## 7. Motion

None. Fieldset is a static structural container. No entrance animation, no transition on any property. `prefers-reduced-motion` has no effect on this component.

## 8. Anti-patterns

- **Not a page section.** `<Fieldset>` is scoped to form context. Use `<Section>` for page-level structural groupings outside a `<form>`.
- **Not a card or surface container.** Even the `bordered` variant is form-scoped. Do not use Fieldset as a general-purpose bordered box for non-form content.
- **Not a substitute for `<FormRow>`.** Fieldset handles vertical grouping + legend. Horizontal multi-column field rows belong to `<FormRow>`, which can be a child of Fieldset.
- **Not for single fields.** A Fieldset around one `<Field>` adds legend overhead with no semantic benefit. Use a plain `<Field>` directly.
- **Not a heading replacement.** The legend label is a form-group label, not a page heading. Do not use it as an `<h2>` equivalent for page sectioning.
- **Not a radio/checkbox group substitute.** A set of related radio buttons or checkboxes should still use Fieldset, but those controls carry their own ARIA group semantics. Fieldset is the correct container; the individual controls must still be individually labelled.

## 9. Depends on

- `Field` molecule — the primary child unit; Fieldset owns spacing between Field instances, not their internal layout.
- `FormRow` molecule — an optional child for horizontal multi-column field rows within a Fieldset.
