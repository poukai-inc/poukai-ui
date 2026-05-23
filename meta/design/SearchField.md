# SearchField

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`SearchField` is the system's canonical table-filter and dashboard-search molecule — an `Input` with a leading search `Icon` and a trailing clear `IconButton` that appears only when the field has a non-empty value. It solves the repeated pattern of wrapping a plain `Input` with icon decoration and clear affordance at each call site, replacing ~30–50 LoC of one-off composition with a single controlled primitive.

## 2. Anatomy

```
┌─────────────────────────────────────────────┐
│  [search icon]  [input text         ]  [×]  │
└─────────────────────────────────────────────┘
 └─ leading slot  └─ <input type="search">    └─ clear button (value non-empty only)
```

- **Root**: `<div role="search">` — landmark wrapping the input and its decorations.
- **Leading icon**: `Icon` atom at `--icon-sm` (16px), `--fg-muted`, decorative (`aria-hidden`). Fixed; not a slot.
- **Input**: `<input type="search">` — renders inside a `Field` molecule for label + note support. Inherits all `Input` atom sizing and token usage.
- **Clear button**: `IconButton` with a close/x icon; renders only when `value` is non-empty. Positioned as an inline-end overlay or trailing flex child.

## 3. Tokens

- `--font-sans` — input text
- `--fs-body` — input text size (md default)
- `--fs-meta` — input text size (sm variant)
- `--fg` — input text color
- `--fg-muted` — placeholder text and leading icon color
- `--bg` — input background
- `--surface` — input background on recessed surfaces
- `--hairline` — input border at rest
- `--accent` — focus ring color
- `--hairline-w` — border width
- `--radius-2` — input corner radius (4px)
- `--icon-sm` — leading search icon size (16px)
- `--icon-xs` — clear button icon size (12px)
- `--space-2` — gap between leading icon and input text; internal horizontal padding
- `--space-3` — inline padding between input edge and icon/clear positions
- `--btn-h-sm` — height when `size="sm"` (32px)
- `--btn-h-md` — height when `size="md"` (44px)
- `--dur-fast` — clear button fade transition duration (180ms)
- `--easing` — clear button fade easing

## 4. Variants / Props

| Prop            | Type                   | Default       | Rationale |
|-----------------|------------------------|---------------|-----------|
| `value`         | `string`               | —             | Controlled value; pair with `onValueChange` |
| `defaultValue`  | `string`               | `""`          | Uncontrolled initial value |
| `onValueChange` | `(v: string) => void`  | —             | Change handler; receives the new string on every keystroke |
| `placeholder`   | `string`               | `"Search…"`   | Default matches the most common usage; consumers override |
| `size`          | `"sm" \| "md"`         | `"md"`        | Aligns with `--btn-h-sm` / `--btn-h-md` for height-consistent rows |
| `disabled`      | `boolean`              | `false`       | Disables input and suppresses clear button |
| `label`         | `string`               | —             | Passed to the `Field` wrapper; visually hidden by default via `Field` convention |
| `name`          | `string`               | —             | Form field name for native form submission |

No `tone`, `variant`, or `invalid` prop in this version — search fields are filter controls, not form validation targets. The `disabled` state follows `Input` atom conventions (`opacity: 0.5`, `pointer-events: none`).

## 5. Interaction

- **Typing**: each keystroke fires `onValueChange` with the current input value.
- **Clear button**: renders when `value.length > 0`; click clears `value` and returns focus to the input. Keyboard-accessible (`Enter` / `Space` activate).
- **Focus**: `:focus-visible` on the `<input>` renders a 2px solid `--accent` outline with 2px offset, consistent with `Input` atom.
- **Escape key**: clears the field value when the input is focused (UX convention for search fields; consumer may suppress by calling `e.preventDefault()`).
- **Tab order**: leading icon is `aria-hidden` and non-focusable. Tab lands on the input, then on the clear button (when visible).
- **Hover**: clear button applies the `IconButton` hover treatment from its own spec; the input border steps to `--fg-muted` on hover (inherited from `Input` atom).

## 6. A11y

- **Root**: `<div role="search">` establishes the ARIA landmark so screen readers can navigate to "search" directly.
- **Input**: `<input type="search">` — browser supplies "search" role implicitly; `type="search"` also provides native clear affordance on some platforms (suppressed visually if DS clear button is rendered to avoid duplication).
- **Label**: always present; visually hidden via `Field`'s `srOnly` convention when no visible label is desired. Connects to input via `htmlFor`/`id`. Do not omit.
- **Leading icon**: `aria-hidden="true"`, non-focusable. Decorative only.
- **Clear button**: `aria-label="Clear search"` (via `IconButton`'s `aria-label` prop). Only in the DOM when value is non-empty.
- **Contrast**: `--fg` on `--bg` ≈ 16.29:1 (AAA); `--fg-muted` on `--bg` ≈ 4.91:1 (AA). Meets WCAG 2.1 AA at all sizes.
- **axe rules**: `label` required (enforced by `Field` wrapper), `color-contrast` passes on both token pairs.

## 7. Motion

- **Clear button appearance**: `opacity` fade-in from `0` → `1` over `--dur-fast` (180ms) with `--easing`. Fade-out mirrors.
- **`prefers-reduced-motion`**: the global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` clamps all `transition-duration` to `0.01ms` — the clear button appears/disappears instantly with no authored override needed.

## 8. Anti-patterns

- **Not a form search.** `SearchField` is for live-filter / instant-search UX. For a submit-on-enter site search form, use a plain `Input` inside a `<form>` with a submit `Button`.
- **Not a Combobox.** `SearchField` does not render a dropdown of suggestions. If autocomplete results are needed, compose with a `Popover` or use `Combobox`.
- **Not for structured filter state.** Multi-criteria filters (status + date + assignee) belong to a dedicated filter panel — not a chain of `SearchField` instances.
- **Not a navigation search bar.** The global site-wide search that opens a modal belongs in a `CommandPalette` or similar organism, not this molecule.
- **Not a replacement for `Input`.** Do not use `SearchField` for email, password, or any non-search input — the `role="search"` landmark and leading icon carry semantic meaning that would mislead screen readers.

## 9. Depends on

- `Field` — label, note, layout wrapper
- `Icon` — leading search icon (lucide `Search`)
- `IconButton` — trailing clear button (lucide `X`)
