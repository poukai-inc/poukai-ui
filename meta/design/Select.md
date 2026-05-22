# Design spec: Select

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-22

---

## 1. Purpose

`Select` is the canonical native-select form primitive for the Poukai design
system. It wraps a `<select>` element, applies brand styling via CSS Modules
and tokens, and exposes the same `size` axis (`sm | md | lg`) and `invalid`
flag as `Input`. The two atoms are visually identical in their rest, hover,
focus, invalid, and disabled states — they share the `--btn-h-*` height
ladder so they pair naturally on the same row.

**Primary use cases**: country, plan, account type, sort order — any picker
with a small, known option set on an editorial surface.

**Non-goals:**

- No Radix Select wrap, no floating listbox, no `cmdk` combobox.
- No custom option rendering — `children` is `<option>` / `<optgroup>`,
  consumer-supplied. The HTML spec forbids arbitrary content inside `<select>`.
- No icon slot. The trailing caret must be a CSS `background-image` SVG data
  URL — the platform discards any non-option children inside `<select>`.
- No validation logic — consumer responsibility.

---

## 2. Anatomy

Root is `<select>`. Non-polymorphic. Children pass through unchanged.

`ComponentPropsWithoutRef<"select">` spread (minus `size` which is shadowed):
`name`, `value`, `defaultValue`, `onChange`, `required`, `disabled`,
`multiple`, `autoComplete`, `aria-*`, `data-*`, etc.

`size` (DS visual prop) shadows the native `size` attribute. Consumers
needing the native row-count behavior in `multiple` mode should not rely on
this prop — the DS `size` is always the visual rung.

---

## 3. Props

```tsx
interface SelectProps extends Omit<ComponentPropsWithoutRef<"select">, "size"> {
  size?: "sm" | "md" | "lg"; // default "md"
  invalid?: boolean;
}
```

Ref: `forwardRef<HTMLSelectElement, SelectProps>`.

---

## 4. Tokens consumed

Same surface as `Input`. No new tokens introduced.

| Token              | Role                                   |
| ------------------ | -------------------------------------- |
| `--bg-elevated`    | Select background                      |
| `--hairline`       | Resting border                         |
| `--fg-muted`       | Hover border                           |
| `--fg`             | Text color; hardcoded hex in caret SVG |
| `--accent`         | Focus ring + border                    |
| `--danger`         | Invalid border                         |
| `--font-sans`      | Font family                            |
| `--fs-body`        | Font size                              |
| `--lh-body`        | Line height                            |
| `--space-2`        | Padding-block                          |
| `--space-3`        | Padding-inline-start + caret inset     |
| `--radius-2`       | Border radius                          |
| `--dur-fast`       | Transition duration                    |
| `--easing`         | Transition easing                      |
| `--btn-h-sm/md/lg` | Min-height per size rung               |

---

## 5. Trailing caret

CSS `background-image` SVG data URL — chevron-down, 16×16, 1.5px round
stroke. Color is hardcoded hex (not `currentColor` — SVG background images
have no cascade context):

- Light mode: `stroke="#1d1d1f"` (= `--fg` light)
- Dark mode (`@media (prefers-color-scheme: dark)`): `stroke="#f5f5f7"` (= `--fg` dark)

Disabled opacity (0.5) applies to the entire element, naturally fading
the caret with the rest of the control.

Position: `background-position: right var(--space-3) center`. Extra
inline-end padding `calc(var(--space-3) + 20px)` (16px caret + 4px gap)
ensures option text never overlaps the caret.

RTL (`[dir="rtl"]`): `background-position: left var(--space-3) center`,
padding swap. `[multiple]`: caret removed, `appearance` restored.

---

## 6. Sizes

Shares the `--btn-h-*` ladder with `Input` and `Button`:

| Size | `min-height`        |
| ---- | ------------------- |
| `sm` | `--btn-h-sm` (32px) |
| `md` | `--btn-h-md` (44px) |
| `lg` | `--btn-h-lg` (52px) |

---

## 7. States

| State         | Treatment                                                         |
| ------------- | ----------------------------------------------------------------- |
| Default       | `--hairline` border, `--bg-elevated` bg                           |
| Hover         | Border → `--fg-muted` (`@media (hover: hover)`, not on disabled)  |
| Focus-visible | 2px `--accent` outline + `outline-offset: 2px`; border `--accent` |
| Invalid       | Border → `--danger` (`data-invalid` + `aria-invalid`)             |
| Disabled      | `opacity: 0.5; cursor: not-allowed`                               |

---

## 8. Accessibility

- Native `<select>` announces its label, current value, and state.
- No aria additions required.
- Consumer responsibility: associate a `<label htmlFor>`, `aria-label`, or
  `aria-labelledby`. `<Field>` auto-wires this.

---

## 9. Non-goals (v1)

Portal/floating listbox, search/filter, multi-tag chip UI, virtualized
options, and a Radix Combobox wrapper are all out of scope. A future
`Listbox` / `Combobox` atom-pair will cover those cases.
