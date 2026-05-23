# MenuItem

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`MenuItem` is the individual row primitive composed inside `DropdownMenu` and `ContextMenu` wrappers. It renders a label with an optional leading Icon and an optional trailing `Kbd` shortcut hint. The component owns the visual shape of a menu row — typography, spacing, icon alignment, shortcut placement — while deferring all keyboard navigation, focus management, ARIA roles, and portal behavior to the parent Radix menu wrapper. `MenuItem` is the leaf node; it never manages menu open/close state itself.

## 2. Anatomy

```
┌─────────────────────────────────────────┐
│  [icon]  Label text              [⌘C]   │
└─────────────────────────────────────────┘
  leading    children (slot)    trailing
  slot                          Kbd slot
  (optional)                    (optional)
```

- **Root**: a single row element (`<div>` role delegated by parent Radix primitive via `asChild`)
- **Icon slot** (optional, leading): `ReactNode` — accepts a lucide-react icon at `--icon-sm` (16px)
- **Label**: `children` — the menu item text; `--fs-meta` (14px), weight 400
- **Kbd slot** (optional, trailing): accepts a `<Kbd>` DS atom; pushed to the row's far right via flex spacer
- **Hover/focus surface**: full-width row highlight using `--surface` background

## 3. Tokens

- `--font-sans` — label typeface
- `--fs-meta` — label font size (14px); menu rows sit in the meta register
- `--lh-meta` — line-height (1.2); single-line label
- `--fg` — default label color
- `--fg-muted` — label color when `tone="muted"` (destructive/secondary rows use this as a starting point; see §4)
- `--danger` — label color for `tone="danger"` rows
- `--surface` — hover/focus-visible row background
- `--bg-elevated` — menu panel surface (consumed by parent wrapper, not MenuItem itself)
- `--space-2` — gap between icon and label; padding-block per row
- `--space-3` — padding-inline on the row
- `--radius-2` — applied to the highlight surface on hover/focus within the panel
- `--icon-sm` — recommended icon size (16px)
- `--dur-fast` — hover background transition duration (180ms)
- `--easing` — transition easing

## 4. Variants / Props

| Prop       | Type                              | Default     | Rationale                                                                                       |
| ---------- | --------------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `children` | `ReactNode`                       | required    | The visible label. Plain string expected; `ReactNode` for occasional `<strong>` emphasis.       |
| `icon`     | `ReactNode`                       | `undefined` | Leading icon slot. Consumer supplies lucide-react icon at `size={16}` with `aria-hidden`.       |
| `shortcut` | `string`                          | `undefined` | Keyboard shortcut hint rendered as `<Kbd>`. Display-only; not a functional key binding.         |
| `tone`     | `"default" \| "danger"`           | `"default"` | `"danger"` shifts label color to `--danger` for destructive actions (Delete, Disconnect, etc.). |
| `disabled` | `boolean`                         | `false`     | `opacity: 0.4`, `pointer-events: none`. Keeps row visible; communicates unavailability.         |

No `size` prop — menu rows are fixed at the meta register. No `variant` beyond `tone` — the DS menu aesthetic is uniform.

## 5. Interaction

- **Hover**: row background fills to `--surface`; transition `background-color var(--dur-fast) var(--easing)`.
- **Focus-visible**: same surface fill as hover; no separate focus ring on the row (parent Radix manages focus indicator within the menu panel via `[data-highlighted]` selector).
- **Active / pressed**: `opacity: 0.85` on the row for 80ms (`--dur-press`) — tactile without transform (rows are inline content, not block CTAs).
- **Disabled**: `opacity: 0.4`, `pointer-events: none`, `cursor: default`. Radix propagates `aria-disabled`.
- **Keyboard**: fully delegated to parent Radix wrapper — `ArrowUp`/`ArrowDown` navigate rows, `Enter`/`Space` selects, `Escape` closes. `MenuItem` adds no key handlers.
- **Click / select**: `onSelect` callback is owned by the Radix primitive the consumer threads through; `MenuItem` itself does not define `onClick`.

## 6. A11y

- **Root element**: `MenuItem` renders via `asChild` into the Radix `DropdownMenu.Item` or `ContextMenu.Item` — the host element carries `role="menuitem"` (or `role="menuitemcheckbox"` / `role="menuitemradio"` if the parent overrides). `MenuItem` itself does not assert a role.
- **Icon**: consumer must pass `aria-hidden="true"` on the icon — it is always decorative; the label text carries the accessible name.
- **Shortcut (`Kbd`)**: rendered with `aria-hidden="true"` on the `Kbd` element — the shortcut is a visual affordance, not additional semantic information. Screen readers read the label; sighted users read the shortcut.
- **Disabled state**: Radix passes `aria-disabled="true"` on the host element; `MenuItem` does not duplicate it.
- **Contrast**: `--fg` (#1D1D1F) on `--surface` (#F5F5F7) hover state = 15.46:1 (AAA). `--danger` (#B3261E) on `--surface` = ~7.2:1 (AAA). `--fg-muted` (#6E6E73) on `--bg-elevated` (#FFFFFF) = 4.60:1 (AA).

## 7. Motion

- `background-color`: `var(--dur-fast)` (180ms) `var(--easing)` on hover/focus entry.
- `opacity`: `var(--dur-press)` (80ms) `ease` on active press.
- `@media (prefers-reduced-motion: reduce)`: global token clamp in `tokens.css` zeroes all `transition-duration` to `0.01ms`. No per-component override needed.

## 8. Anti-patterns

- **Do not use `MenuItem` outside a Radix menu wrapper.** It has no standalone open/close logic, no portal, no positioning. Placed naked in a layout it is inert markup with no interaction contract.
- **Do not put a `<Button>` or `<a>` inside `MenuItem`.** The row is itself the interactive surface via the Radix host. Nesting interactive elements creates duplicate tab stops and ARIA violations.
- **Do not use `MenuItem` for navigation links in a nav bar.** That is `NavLink`. Menu items dismiss on select; nav links persist.
- **Do not encode semantic status in `tone="danger"` alone.** The red color communicates caution visually; consumers must also write clear label copy ("Delete post", not just "Delete") so the action is unambiguous without color.
- **Do not put long prose in a `MenuItem` label.** Menu rows are single-line affordances. Wrapping labels break the row rhythm. Maximum label length: ~40 characters.
- **Do not use `MenuItem` as a container for form controls** (checkboxes, radio buttons, sliders). Those require `DropdownMenu.CheckboxItem` / `DropdownMenu.RadioItem` from Radix — distinct atoms with distinct ARIA roles.

## 9. Depends on

- `Icon` atom (lucide-react via peer dep; consumer supplies, DS does not re-export)
- `Kbd` atom (for the `shortcut` slot)
- Parent Radix wrapper: `DropdownMenu` or `ContextMenu` (separate DS molecules that provide the host `role="menuitem"` element via `asChild`)
