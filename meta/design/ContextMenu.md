# ContextMenu

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`ContextMenu` is the DS-sanctioned right-click (or long-press) contextual menu for files, table rows, canvas items, and any surface where a secondary action menu must appear at the pointer position without a visible trigger. It wraps `@radix-ui/react-context-menu` in DS tokens so all menu surfaces — dropdown, context — share the same visual contract (elevation, type, motion, focus ring).

## 2. Anatomy

```
ContextMenu.Root
└── ContextMenu.Trigger   — wraps the target region (asChild)
└── ContextMenu.Content   — floating panel, portal-rendered
    ├── MenuItem          — action row (icon + label + optional Kbd shortcut)
    ├── ContextMenu.Separator — --hairline rule
    └── ContextMenu.Sub   — (future) nested sub-menu
```

- **Root**: Radix `ContextMenu.Root` — state owner, no DOM output.
- **Trigger**: `asChild` wrapper around the consumer's target region. No visual change; adds `data-state` for potential consumer styling.
- **Content**: floating `<div role="menu">` portalled to `document.body`. Background `--bg-elevated`, border `--hairline`, radius `--radius-3`, shadow via `--accent-glow` fallback.
- **MenuItem**: DS `MenuItem` molecule — icon slot + label + optional `Kbd` shortcut. See `meta/design/MenuItem.md`.
- **Separator**: `<div role="separator">` styled with `--hairline` / `--hairline-w`.

## 3. Tokens

- `--bg-elevated` — Content panel background (front-most surface layer)
- `--hairline` — Content border + Separator color
- `--hairline-w` — Border width (1px)
- `--radius-3` — Content panel corner radius (8px)
- `--fg` — MenuItem label text color (default state)
- `--fg-muted` — MenuItem label text color (disabled state)
- `--surface` — MenuItem hover/focus background fill
- `--accent` — Focus-visible ring on MenuItem
- `--fs-meta` — MenuItem label font size (14px)
- `--font-sans` — MenuItem label typeface
- `--space-1` — Separator block margin
- `--space-2` — MenuItem padding-block; gap between icon and label
- `--space-3` — MenuItem padding-inline
- `--space-4` — Content panel padding-block
- `--dur-fast` — Content enter/exit transition duration (180ms)
- `--easing` — Content scale/fade easing (expo-out)

## 4. Variants / Props

| Prop / Part | Default | Notes |
|---|---|---|
| `ContextMenu.Root` | — | Stateless wrapper; no visual props |
| `ContextMenu.Trigger asChild` | `true` | Always `asChild` — DS never adds a visible trigger element |
| `ContextMenu.Content align` | `"start"` | Radix alignment; `"start" \| "center" \| "end"` |
| `ContextMenu.Content sideOffset` | `4` | px gap between pointer and panel edge |
| `MenuItem tone` | `"default"` | `"default" \| "danger"` — danger uses `--danger` for label + icon |

`tone="danger"` on a `MenuItem` replaces `--fg` with `--danger`. No additional token needed; `--danger` is in the existing vocabulary.

## 5. Interaction

- **Trigger**: right-click (desktop) or long-press (mobile) on the Trigger region opens Content at pointer coordinates. Radix handles this natively.
- **Keyboard**: `ArrowDown` / `ArrowUp` move focus between items; `Enter` or `Space` activates; `Escape` closes; `Tab` closes (Radix default). Home/End jump to first/last item.
- **Focus order**: Content receives focus on open; focus is trapped within the menu until dismissed. First item receives focus on keyboard open.
- **Hover**: MenuItem background transitions to `--surface` fill on pointer enter.
- **Dismiss**: click outside, `Escape`, or item activation closes the panel. Radix handles all dismiss paths.
- **Disabled items**: `pointer-events: none`, label color `--fg-muted`, no hover fill.

## 6. A11y

- `ContextMenu.Content` renders `role="menu"`.
- Each `MenuItem` renders `role="menuitem"`.
- `ContextMenu.Separator` renders `role="separator"`.
- `aria-disabled="true"` on disabled MenuItems (Radix sets this automatically when `disabled` prop is passed).
- Focus is trapped inside Content while open — Radix `ContextMenu.Content` handles this.
- Screen readers announce the menu on open via Radix's built-in focus management.
- Contrast: `--fg` on `--bg-elevated` ≈ 16.29:1 (AAA). `--fg-muted` on `--bg-elevated` ≈ 5.0:1 (AA). `--danger` on `--bg-elevated` ≈ 7.2:1 (AA).

## 7. Motion

- **Enter**: Content scales from `0.95` → `1` and fades opacity `0` → `1`. Duration `--dur-fast` (180ms), easing `--easing` (expo-out).
- **Exit**: reverse scale + fade. Duration `--dur-fast`.
- **`prefers-reduced-motion`**: the global `tokens.css` reduced-motion block clamps all `transition-duration` and `animation-duration` to `0.01ms`. No per-component override needed.

## 8. Anti-patterns

- **Not a DropdownMenu.** `DropdownMenu` is triggered by a visible button; `ContextMenu` is triggered by right-click/long-press on an arbitrary region. Use `DropdownMenu` wherever a visible affordance exists.
- **Not for navigation menus.** Top-nav, sidebar, and breadcrumb navigation belong to `Header`, `Sidebar`, and `Breadcrumb` — not a context menu.
- **Not for form controls.** Do not place `<input>`, `<select>`, or other form fields inside `ContextMenu.Content`.
- **Not a notification surface.** `Toast` handles transient feedback; `Alert` handles inline semantic banners. A context menu is an action surface only.
- **Not a substitute for a primary action.** Discoverable primary actions belong in visible buttons. Context menus are supplemental; relying on them as the only path to a primary action fails keyboard and touch users who may not discover right-click.

## 9. Depends on

- `MenuItem` (DS molecule — `meta/design/MenuItem.md`)
- `@radix-ui/react-context-menu` (Radix primitive — engineer adds to `peerDependencies`)
