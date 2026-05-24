# Combobox

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`<Combobox>` is a searchable single-select input for option lists too large to scan in a plain `<Select>` — timezone pickers (400+ IANA entries), page/org pickers with user-scale growth, and data-source selectors on the autopost dashboard. It replaces native `<select>` wherever the option count makes scrolling without search a UX failure, and pairs with `<Field>` as its standard label/note container. Multi-select is explicitly deferred to a future variant.

## 2. Anatomy

```
┌─────────────────────────────────────────┐
│ [Selected label or placeholder]      ▼  │  ← Trigger (button, --btn-h-md height)
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 🔍 [Search input]                        │  ← Search row (inside popover)
├─────────────────────────────────────────┤
│   Group heading (optional)              │
│   Option row                            │  ← List item (role="option")
│ ✓ Selected option row                   │
│   Option row                            │
│   …                                     │
└─────────────────────────────────────────┘
```

- **Trigger**: styled `<button>` showing the selected label or placeholder; chevron icon on the trailing edge.
- **Popover**: elevated panel (`--bg-elevated`) anchored below/above the trigger via `cmdk` or Radix Popover.
- **Search input**: undecorated `<input type="text">` inside the popover, receives focus on open.
- **Option list**: scrollable `<ul role="listbox">` of `<li role="option">` items; optional group headings (`<li role="group">`).
- **Empty state**: single row shown when filter matches nothing — plain `--fg-muted` text.
- **Check mark**: leading icon on the selected option row (lucide `Check`, `--icon-xs`).

## 3. Tokens

- `--bg-elevated` — popover surface
- `--bg` — search input background
- `--surface` — hovered / focused option row background
- `--fg` — trigger label, option text, search input text
- `--fg-muted` — placeholder text, group headings, empty-state message
- `--hairline` — trigger border (rest), popover border
- `--hairline-soft` — divider between search row and option list
- `--hairline-w` — 1px border width
- `--accent` — focus ring on trigger; selected-option check mark color
- `--accent-glow` — focus ring glow (outline-offset layer, optional)
- `--font-sans` — all text
- `--fs-body` — trigger label, option text
- `--fs-meta` — group headings, empty-state message
- `--btn-h-md` — trigger height (44px); aligns with Input/Button md tier
- `--radius-2` — trigger corner radius (4px)
- `--radius-3` — popover corner radius (8px)
- `--space-2` — option row padding-block; search-input padding-block
- `--space-3` — option row padding-inline
- `--space-4` — popover internal padding-block at top/bottom
- `--space-6` — gap between trigger and popover (offset)
- `--dur-fast` — popover open/close transition duration
- `--easing` — popover entrance easing (expo-out)

## 4. Variants / Props

| Prop            | Type                                                                   | Default                    | Rationale                                                                                    |
| --------------- | ---------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| `options`       | `Array<{ value: string; label: string; group?: string }>`              | required                   | Flat array; groups derived from `group` field                                                |
| `value`         | `string \| undefined`                                                  | —                          | Controlled selected value                                                                    |
| `defaultValue`  | `string \| undefined`                                                  | `undefined`                | Uncontrolled initial value                                                                   |
| `onValueChange` | `(value: string) => void`                                              | —                          | Selection callback                                                                           |
| `placeholder`   | `string`                                                               | `"Select…"`                | Shown in trigger when no value selected                                                      |
| `disabled`      | `boolean`                                                              | `false`                    | Disables trigger; `opacity: 0.5`, no pointer events                                          |
| `invalid`       | `boolean`                                                              | `false`                    | Applies `--danger` border to trigger; pairs with Field error state                           |
| `size`          | `"sm" \| "md"`                                                         | `"md"`                     | `sm` uses `--btn-h-sm` (32px) and `--fs-meta`; `md` uses `--btn-h-md` (44px) and `--fs-body` |
| `filter`        | `(option: { value: string; label: string }, query: string) => boolean` | substring match on `label` | Custom filter for locale-sensitive or transliterated search                                  |
| `name`          | `string`                                                               | —                          | Hidden `<input type="hidden">` for native form submission                                    |

No `open` / `onOpenChange` controlled-popover prop in Phase 1 — uncontrolled open state only. Add when a consumer surface requires programmatic control.

## 5. Interaction

**Mouse / touch:**

- Click trigger → opens popover, focuses search input.
- Click option → selects, closes popover, returns focus to trigger.
- Click outside popover → closes, no selection change.

**Keyboard (trigger focused):**

- `Enter` / `Space` / `ArrowDown` → opens popover, focuses search input.
- `Escape` → closes popover, returns focus to trigger.

**Keyboard (popover open):**

- `ArrowDown` / `ArrowUp` → moves focus through option list.
- `Enter` → selects focused option, closes, returns focus to trigger.
- `Escape` → closes, no selection change, returns focus to trigger.
- `Tab` → closes popover, advances focus to next page element.
- Typing in search input filters options in real time; filter is debounce-free (immediate).

**Scroll:** option list scrolls independently; trigger and search row are sticky within the popover.

## 6. A11y

- **Trigger**: `<button role="combobox" aria-haspopup="listbox" aria-expanded aria-controls="{listbox-id}">`.
- **Listbox**: `<ul role="listbox" id="{listbox-id}" aria-label="{field label}">`.
- **Options**: `<li role="option" aria-selected>` — `aria-selected="true"` on the currently selected item.
- **Groups**: `<li role="group" aria-label="{group name}">` wrapping grouped options.
- **Search input**: `<input type="text" aria-label="Search" aria-autocomplete="list" aria-controls="{listbox-id}">`.
- **Focus management**: popover open → focus moves to search input; popover close → focus returns to trigger.
- **Contrast**: `--fg` on `--bg-elevated` ≥ 16:1 (AAA). `--fg-muted` on `--bg-elevated` ≥ 4.8:1 (AA). `--accent` focus ring on `--bg` ≈ 4.54:1 (AA non-text).
- **`cmdk`** (recommended base) provides keyboard navigation and ARIA wiring out of the box; the DS layer skins it with tokens.

## 7. Motion

- **Popover open**: `opacity 0 → 1` + `transform: translateY(-4px) → translateY(0)` over `--dur-fast` (180ms) with `--easing` (expo-out).
- **Popover close**: `opacity 1 → 0` over `--dur-fast`; no translate on exit.
- **`prefers-reduced-motion: reduce`**: the global token block in `tokens.css` clamps all `transition-duration` to `0.01ms`. No per-component override needed.
- Option row hover highlight: `background-color` transition `80ms ease` (matches `--dur-press` register — felt, not watched).

## 8. Anti-patterns

- **Not a replacement for `<Select>` with fewer than ~10 options.** Native select is cheaper, more accessible on mobile, and requires no JS. Use Combobox only when search is genuinely needed.
- **Not a multi-select.** Do not add `multiple` behavior to this component; that requires a distinct interaction model (chips, checkboxes, separate close affordance).
- **Not a command palette.** Command palettes have heterogeneous item types, actions, keyboard shortcuts, and section grouping at a different scale. Use `cmdk` directly for that surface.
- **Not a free-text input with suggestions (autocomplete).** Combobox always selects from a bounded options list. If the user's typed text should itself be a valid value, that is an `Autocomplete` primitive with a different contract.
- **Not for navigation menus.** Option selection triggers a value callback, not a route change. Routing is a consumer concern; the DS does not prescribe `onValueChange` to a router.
- **Not compositionally equivalent to `DropdownMenu`.** DropdownMenu is for actions; Combobox is for value selection. Never substitute one for the other.

## 9. Depends on

- `cmdk` — command-menu primitive; provides filtered listbox, keyboard navigation, and ARIA semantics. Wrap: `Command`, `Command.Input`, `Command.List`, `Command.Item`, `Command.Group`, `Command.Empty`.
- `Field` — label / error note container. Combobox is always rendered inside a `<Field>` in standard usage.
- `lucide-react` — `ChevronsUpDown` (trigger trailing icon), `Check` (selected-option mark). Peer dep, not re-exported.

## Open questions

- **`cmdk` as a declared dependency vs. `@radix-ui/react-popover` from scratch.** The proposal names `cmdk` as preferred. `cmdk` brings its own DOM structure; the DS skin layer must be verified to not conflict with existing Radix peers. Confirm peer-dep addition (`cmdk`) before implementation begins.
- **`size="sm"` trigger height.** `--btn-h-sm` is 32px. At that height the trigger label is `--fs-meta` (14px) with 6px block padding — same as `Button sm`. Verify the chevron icon (`--icon-xs` 12px) centers correctly at 32px height before approving the `sm` size tier.
