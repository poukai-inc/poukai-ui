# MetaList

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`MetaList` renders a semantic `<dl>` of label/value pairs for surfaces that need to expose structured metadata at a glance — article sidebars (published date, reading time, author), project spec panels (version, license, size), and pricing detail blocks (billing cycle, seats, support tier). It is the system's canonical answer to the "key: value, stacked" pattern, replacing ad-hoc `<p>` pairs and table-in-disguise layouts with a single, accessible primitive.

## 2. Anatomy

```
<dl>                          ← root — MetaList
  <div>                       ← row wrapper (dt + dd pair)
    <dt>Published</dt>        ← label
    <dd>2026-05-22</dd>       ← value
  </div>
  <div>
    <dt>Reading time</dt>
    <dd>6 min</dd>
  </div>
</dl>
```

- **Root**: `<dl>` — native definition list; carries `role="list"` semantics automatically.
- **Row**: `<div>` wrapper per pair — required for CSS grid/flex alignment across dt and dd without extra specificity.
- **Label (`<dt>`)**: the term/key. Geist sans, `--fs-meta`, `--fg-muted`. Never bold.
- **Value (`<dd>`)**: the definition/value. Geist sans, `--fs-meta`, `--fg`. `margin-inline-start: 0` resets browser default indent.
- **Divider** (optional): a `<hr>`-equivalent `border-top` on each row when `dividers` is true, using `--hairline` and `--hairline-w`.

## 3. Tokens

- `--font-sans` — both dt and dd font family
- `--fs-meta` — 14px; correct meta register for label/value rows
- `--fg-muted` — dt (label) color
- `--fg` — dd (value) color
- `--lh-meta` — 1.2; tight leading, single-line register
- `--space-2` — row gap (vertical rhythm between pairs)
- `--space-3` — dt-to-dd gap when `orientation="horizontal"` (inline axis)
- `--hairline` — row divider color
- `--hairline-w` — 1px divider thickness

## 4. Variants / Props

| Prop          | Type                                            | Default     | Rationale                                                                                                                                                      |
| ------------- | ----------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`       | `Array<{ label: ReactNode; value: ReactNode }>` | required    | Data-driven API matches the spec usage pattern; avoids verbose compound child syntax for a simple list.                                                        |
| `orientation` | `"stacked" \| "horizontal"`                     | `"stacked"` | Stacked (dt above dd) suits narrow sidebars; horizontal (dt inline with dd) suits wider panels.                                                                |
| `dividers`    | `boolean`                                       | `false`     | Opt-in hairline between rows; off by default so the component reads quietly without chrome.                                                                    |
| `labelWidth`  | `string`                                        | `undefined` | CSS value (e.g. `"8rem"`) for the dt column width in horizontal mode. Consumer-controlled; no token default forces a fixed width across unknown label lengths. |

No size ladder. `--fs-meta` is the only correct register for this component.

## 5. Interaction

Static. No hover, focus, or interactive states on the component itself. Individual value slots may contain interactive children (e.g. a Link) — those elements carry their own interaction handling and are not authored by MetaList.

## 6. A11y

- `<dl>` / `<dt>` / `<dd>` are native HTML definition list semantics. Screen readers announce term/definition pairs correctly without any ARIA additions.
- `margin-inline-start: 0` on `<dd>` resets the browser's default 40px indent, which would otherwise disrupt visual alignment without affecting semantics.
- Each `<dt>` and `<dd>` pair is wrapped in a `<div>` to satisfy the HTML5 spec's permitted content model (`<dl>` may contain `<div>` wrappers when each `<div>` contains one or more `<dt>` elements followed by one or more `<dd>` elements).
- Contrast: `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.56:1 — AA at 14px. `--fg` (#1D1D1F) on `--bg` = 16.29:1 — AAA.
- When `value` contains a ReactNode (e.g. a Link or StatusBadge), the consumer is responsible for that child's accessible name and focus semantics.

## 7. Motion

None — static component. The global `prefers-reduced-motion` block in `tokens.css` has no effect here.

## 8. Anti-patterns

- **Not for tabular data with multiple columns.** Use `Table` for rows with more than two related values — MetaList is a label/value pair list, not a grid of comparable entities.
- **Not for navigation.** Use `LinkList` for vertical anchor rows. MetaList renders non-interactive metadata; navigation intent requires a different semantic container.
- **Not a form layout.** Use `Field` / `Fieldset` for editable inputs. MetaList is read-only display; it has no input, label-for, or error-message roles.
- **Not for status signals.** A MetaList item whose value is a colored semantic indicator should use `StatusBadge` as the value ReactNode — MetaList itself carries no semantic color logic.
- **Not for long-form prose values.** Each value should be a short string or inline element. Paragraphs of text belong in `Prose` or a `Disclosure`.

## 9. Depends on

- `Text` (if the DS ships a Text primitive for the label/value typography; otherwise pure semantic HTML with token classes)

## Open questions

- **`labelWidth` default in horizontal mode.** There is no token for a canonical dt column width. The current spec leaves width consumer-controlled. If a standard width (e.g. `8rem`) emerges across multiple uses, a `--meta-list-label-w` token could be introduced in a follow-up — but Phase 1 defers this to avoid speculating on a value without real consumer data.
