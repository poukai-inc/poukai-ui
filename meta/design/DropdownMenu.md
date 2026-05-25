# DropdownMenu

**Status**: Approved

## 1. Intent

`DropdownMenu` is the system's canonical triggered menu — a compound Radix-wrapped primitive that renders a floating list of labelled actions anchored to a trigger element. It replaces ad-hoc `useState` + `useRef` + outside-click listener patterns (currently in autopost's `components/navbar.tsx` and `components/post-card.tsx`) with a single portable primitive that ships correct keyboard navigation, portal rendering, and focus management out of the box. Primary surfaces: dashboard chrome "More" overflow menus, per-row post-card action menus, and any page-settings menu that presents a list of distinct actions from a single trigger.

## 2. Anatomy

```
<DropdownMenu>                  — root context provider (Radix Root)
  <DropdownMenu.Trigger>        — the anchor element (asChild-capable)
  <DropdownMenu.Content>        — floating panel, portalled to <body>
    <DropdownMenu.Item>         — single action row
    <DropdownMenu.Separator />  — 1px hairline rule between groups
    <DropdownMenu.Item tone="danger"> — destructive action row
```

- **Root**: context provider; no DOM output of its own.
- **Trigger**: wraps the activating element. `asChild` delegates styling to the child (e.g. `<IconButton>`).
- **Content**: floating panel — `--bg-elevated` surface, `--radius-3` corners, `--hairline` border, drop shadow. Portalled; z-index outside the component's scope.
- **Item**: `<div role="menuitem">` row. Optional leading icon slot and trailing `<Kbd>` shortcut slot.
- **Separator**: `<div role="separator">` — 1px `--hairline` rule. Full content width.

A `DropdownMenuBasic` convenience wrapper (parallel to `DialogBasic`) flattens common trigger + items into a single declarative prop set for consumers who do not need the compound API.

## 3. Tokens

- `--bg-elevated` — Content panel background (popovers, dialogs, front-most layer)
- `--hairline` — Content border + Separator line
- `--hairline-w` — Separator and border width (1px)
- `--fg` — Item label text, default state
- `--fg-muted` — Shortcut hint text, disabled item text
- `--surface` — Item hover background
- `--danger` — Item label text, `tone="danger"`
- `--bg-danger` — Item hover background, `tone="danger"`
- `--font-sans` — Item label typeface
- `--fs-meta` — Item label font size (14px)
- `--lh-meta` — Item row line-height (1.2)
- `--space-1` — Separator vertical margin
- `--space-2` — Item icon–label gap; Content vertical padding
- `--space-3` — Item padding-inline
- `--space-4` — Item padding-block per row; Content min-width leading edge
- `--radius-3` — Content panel corner radius (8px)
- `--dur-fast` — Content open/close transition duration (180ms)
- `--easing` — Content scale + fade easing (expo-out)

## 4. Variants / Props

**DropdownMenu.Content**

| Prop         | Default    | Notes                                                                                                             |
| ------------ | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| `align`      | `"start"`  | Radix align: `"start"` \| `"center"` \| `"end"`. End-aligned for action menus anchored to a trailing icon button. |
| `side`       | `"bottom"` | Radix side: `"top"` \| `"bottom"` \| `"left"` \| `"right"`. Auto-flips when viewport edge is hit.                 |
| `sideOffset` | `4`        | Pixel gap between trigger and Content panel.                                                                      |
| `minWidth`   | `160px`    | Inline literal — prevents undersized panels on short labels.                                                      |

**DropdownMenu.Item**

| Prop       | Default     | Notes                                                                            |
| ---------- | ----------- | -------------------------------------------------------------------------------- |
| `tone`     | `"default"` | `"default"` \| `"danger"`. Danger renders `--danger` text + `--bg-danger` hover. |
| `disabled` | `false`     | Disables Radix item; `--fg-muted` text, `pointer-events: none`.                  |
| `onSelect` | —           | Radix `onSelect` — called on pointer click or keyboard `Enter`/`Space`.          |
| `icon`     | —           | Optional leading `ReactNode` slot (lucide-react icon, `--icon-sm` / 16px).       |
| `shortcut` | —           | Optional trailing shortcut string or `<Kbd>` node rendered at `--fg-muted`.      |

**DropdownMenuBasic** (convenience)

| Prop      | Default   | Notes                                                            |
| --------- | --------- | ---------------------------------------------------------------- |
| `trigger` | —         | `ReactNode` for the trigger slot                                 |
| `items`   | —         | `Array<{ label, onSelect, tone?, disabled?, icon?, shortcut? }>` |
| `align`   | `"start"` | Forwarded to Content                                             |

## 5. Interaction

- **Open**: pointer click on Trigger; `Enter` or `Space` on focused Trigger.
- **Navigation**: `ArrowDown` / `ArrowUp` move focus through Items. `Home` / `End` jump to first / last item.
- **Select**: `Enter` on focused Item calls `onSelect`; panel closes.
- **Dismiss**: `Escape` closes and returns focus to Trigger. Pointer click outside Content (Radix outside-click) closes.
- **Disabled items**: skipped in keyboard navigation, not selectable.
- **Separator**: non-interactive; skipped entirely by keyboard nav.
- Focus is trapped inside Content while open — managed by Radix; no custom focus logic needed.

## 6. A11y

- **Root**: Radix `DropdownMenu.Root` — manages open state and ARIA.
- **Trigger**: receives `aria-haspopup="menu"` and `aria-expanded` from Radix.
- **Content**: renders `role="menu"` in a portal.
- **Item**: `role="menuitem"`. Disabled items receive `aria-disabled="true"`.
- **Separator**: `role="separator"`.
- **Icon slot**: decorative — consumer must pass `aria-hidden="true"` on icon elements.
- **Contrast**: `--fg` on `--bg-elevated` ≈ 16.29:1 (AAA). `--danger` (#b3261e) on `--bg-elevated` (#ffffff) ≈ 7.2:1 (AAA). `--fg-muted` on `--bg-elevated` ≈ 4.91:1 (AA).
- Radix handles `aria-expanded`, focus return on close, and keyboard roving tabindex.

## 7. Motion

- **Open**: Content enters with `scale(0.97) → scale(1)` + `opacity: 0 → 1`, duration `--dur-fast` (180ms), easing `--easing` (expo-out).
- **Close**: Content exits with the inverse, `--dur-fast`.
- **Reduced motion**: global `prefers-reduced-motion: reduce` block in `tokens.css` clamps all `transition-duration` to `0.01ms`. No per-component override needed — the scale + fade collapse to instant.
- Item hover background: `background-color` transition at `80ms ease` (sub-`--dur-press`, feels immediate).

## 8. Anti-patterns

- **Not for navigation.** Items that navigate to a new route should use a nav element or a link list, not DropdownMenu. `onSelect` is for actions, not routing.
- **Not for form controls.** Do not embed inputs, toggles, or checkboxes inside Item rows. That is a future `DropdownMenu.CheckboxItem` / `DropdownMenu.RadioGroup` extension and requires its own spec.
- **Not for long option lists.** More than ~10 items signals a `Combobox` or `Select` is the right primitive. DropdownMenu is for a bounded set of named actions.
- **Not as a replacement for `Select`.** A `Select` controls a form value; DropdownMenu fires one-shot actions. Conflating them creates form-submission bugs and wrong ARIA semantics.
- **Not for primary navigation.** The dashboard's primary nav links belong in a `Sidebar` or `Header`, not a DropdownMenu.
- **Not always-visible menus.** DropdownMenu requires a Trigger. Persistent action lists belong in a `Sidebar` or an inline action row.

## 9. Depends on

- `@radix-ui/react-dropdown-menu` — the wrapping primitive (existing transitive dep via Dialog/Tabs ecosystem).
- `MenuItem` molecule — the canonical item row with icon + shortcut slot. DropdownMenu.Item may compose MenuItem or mirror its layout directly; engineer decides.
- `IconButton` atom — the idiomatic Trigger child for icon-anchored menus.
