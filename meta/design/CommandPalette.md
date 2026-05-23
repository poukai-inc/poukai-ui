# CommandPalette

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`CommandPalette` is a full-screen keyboard-driven search and navigation overlay triggered by ⌘K (or Ctrl+K). It gives users a single entry point to jump to any page, execute an action, or surface a record — without leaving the keyboard. It serves dense app surfaces (dashboards, docs, editor shells) where pointer navigation across many routes is slow. Rendered inside a `Dialog` so focus trapping, backdrop dismissal, and portal behaviour are inherited without re-implementation.

> Status: deferred / demand-pull. Do not implement until a consumer
> surface explicitly requests it.

## 2. Anatomy

```
┌─ Dialog overlay (--bg-elevated, full-screen backdrop) ──────────┐
│  ┌─ Panel (max-w ~640px, centered, rounded, elevated shadow) ──┐ │
│  │  [SearchIcon]  [Input ─────────────────────────] [Kbd Esc]  │ │
│  │  ── hairline rule ─────────────────────────────────────────  │ │
│  │  ┌─ List (scroll region, max-h ~360px) ────────────────┐    │ │
│  │  │  Group heading: "Pages"                              │    │ │
│  │  │    Item row: [LeadIcon]  Label          [Kbd ⌘→]    │    │ │
│  │  │    Item row: [LeadIcon]  Label                       │    │ │
│  │  │  Group heading: "Actions"                            │    │ │
│  │  │    Item row: [LeadIcon]  Label          [Kbd ⌘D]    │    │ │
│  │  └──────────────────────────────────────────────────────┘    │ │
│  │  ── hairline rule ─────────────────────────────────────────  │ │
│  │  Footer: [Kbd ↑↓] Navigate  [Kbd ↵] Select  [Kbd Esc] Close │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

- **Overlay**: `Dialog` backdrop — semi-transparent `--bg` wash; click outside dismisses.
- **Panel**: elevated surface card (`--bg-elevated`), `--radius-3` corners, `--hairline` border.
- **Input row**: leading search icon (`--icon-sm`), plain text input, trailing `Kbd` hint ("Esc").
- **Divider**: `--hairline` / `--hairline-w` rule between input row and list, and between list and footer.
- **List**: scrollable region. Contains one or more `Group` sections each with a heading label and `Item` rows.
- **Item row**: optional leading icon slot (`--icon-sm`), label text, optional trailing `Kbd` shortcut hint.
- **Footer hint row**: small `Kbd` legend — navigate, select, close affordances.

## 3. Tokens

- `--bg-elevated` — panel background (front-most layer, dialogs)
- `--bg` — backdrop wash (at reduced opacity)
- `--surface` — hovered/focused item row background
- `--fg` — input text, item label text
- `--fg-muted` — group heading text, footer legend text, input placeholder
- `--hairline` — panel border, horizontal divider rules
- `--hairline-w` — border/rule thickness
- `--accent` — focus ring on the panel, input caret
- `--font-sans` — all text
- `--font-mono` — `Kbd` shortcut hints
- `--fs-meta` — group heading, item label, footer legend
- `--fs-micro` — group heading uppercase label register
- `--lh-meta` — item row line-height
- `--tracking-micro` — group heading letter-spacing
- `--radius-1` — focus ring border-radius
- `--radius-2` — item row hover background radius
- `--radius-3` — panel corner radius
- `--space-1` — item row vertical padding
- `--space-2` — icon-to-label gap, item row inline padding
- `--space-3` — input row block padding
- `--space-4` — panel padding inline; group heading block margin
- `--space-6` — panel padding block
- `--dur-fast` — panel enter/exit transition
- `--easing` — panel entrance easing (expo-out)

## 4. Variants / Props

| Prop | Type | Default | Rationale |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state forwarded to `Dialog` |
| `onOpenChange` | `(open: boolean) => void` | — | Dismiss callback |
| `placeholder` | `string` | `"Search…"` | Input hint text |
| `children` | `ReactNode` | — | `CommandPalette.Group` + `CommandPalette.Item` nodes |

Compound sub-components:

- `CommandPalette.Input` — the search field; consumer may omit if a custom input is passed.
- `CommandPalette.List` — the scrollable list wrapper; receives filtered results.
- `CommandPalette.Group` — labelled item group; `heading` prop (string).
- `CommandPalette.Item` — single selectable row; `onSelect` callback, optional `icon` and `shortcut` slots.
- `CommandPalette.Empty` — zero-results message slot.

## 5. Interaction

- **Trigger**: ⌘K / Ctrl+K at the app level (consumer wires the `keydown` listener; DS provides the overlay only).
- **Open**: panel animates in (scale + fade); focus lands on the `Input` immediately.
- **Filtering**: `cmdk` handles fuzzy filtering client-side as the user types; no DS logic needed.
- **Navigation**: `↑` / `↓` move highlight between `Item` rows; `cmdk` owns this loop.
- **Selection**: `Enter` fires the focused item's `onSelect`; closes the overlay.
- **Dismiss**: `Esc`, backdrop click, or `onOpenChange(false)` from the consumer.
- **Hover**: item row background transitions to `--surface` at `--dur-fast`.
- **Mouse**: pointer hover moves the `cmdk` highlight in sync with keyboard highlight.
- **Scroll**: list region scrolls independently; panel height is capped (see §4 anatomy).

## 6. A11y

- `Dialog` supplies `role="dialog"`, `aria-modal="true"`, focus trap, and scroll lock — no re-implementation needed.
- `Dialog.Title` (visually hidden or visible) provides an accessible name: `"Command palette"`.
- The `Input` carries `role="combobox"`, `aria-expanded="true"`, `aria-autocomplete="list"`, and `aria-controls` pointing to the list element — these are emitted by `cmdk` primitives; verify the version in use emits them correctly.
- `CommandPalette.List` receives `role="listbox"`.
- Each `CommandPalette.Item` receives `role="option"` and `aria-selected` for the highlighted state.
- Group headings use `role="group"` with `aria-label` matching the `heading` prop.
- `Kbd` hint elements inside items are `aria-hidden="true"` — they are visual affordances, not assistive information.
- Focus ring on the panel: `outline: 2px solid var(--accent); outline-offset: 4px; border-radius: var(--radius-1)`.
- Contrast: `--fg` on `--bg-elevated` ≥ 16:1 (AAA). `--fg-muted` on `--bg-elevated` ≥ 4.6:1 (AA).

## 7. Motion

- **Panel entrance**: `opacity: 0 → 1` + `scale(0.97) → scale(1)`; duration `--dur-fast`; easing `--easing`.
- **Panel exit**: reverse; duration `--dur-fast`; `--easing` (expo-out reads naturally on exit at this duration).
- **Item hover background**: `background-color` transition at `--dur-fast` ease.
- **`prefers-reduced-motion`**: the global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` clamps all transition/animation durations to `0.01ms` — no per-component override needed. The panel appears/disappears instantly; item hover is instant.

## 8. Anti-patterns

- **Not a permanent UI element.** CommandPalette is an ephemeral keyboard overlay. Do not mount it persistently or embed it inline in a page layout.
- **Not a replacement for primary navigation.** NavLinks and Sidebar are always-visible navigation; CommandPalette augments them for power users, it does not replace them.
- **Not a form.** Do not place multi-field forms, date pickers, or compound inputs inside the panel. The input is a single search field.
- **Not a notification surface.** Do not use it to surface alerts, toasts, or status messages. Those have dedicated primitives (`Alert`, `Toast`).
- **Not for deferred-load content without a loading state.** If results are fetched async, the consumer must supply a loading indicator inside `CommandPalette.List`; the DS does not ship one in this primitive.
- **Not appropriate on marketing or editorial pages.** This is a product-surface organism. Marketing pages have no keyboard nav density that justifies a command palette.

## 9. Depends on

- `Dialog` (organism) — focus trap, backdrop, portal, dismiss semantics
- `Input` (atom) — search field base styles
- `MenuItem` (molecule) — item row shape (icon + label + shortcut)
- `Kbd` (atom) — shortcut hint chips in item rows and footer legend
- `cmdk` (external) — fuzzy filtering, keyboard navigation loop, ARIA emission

## Open questions

- **`cmdk` version pin.** The `cmdk` package API changed significantly between v0.x and v1.x. The spec assumes v1.x compound API (`Command`, `Command.Input`, `Command.List`, `Command.Group`, `Command.Item`). Confirm the version before implementation to avoid an API mismatch with the DS compound shape described here.
- **Token gap — panel shadow.** An elevated panel at this prominence typically needs a drop shadow beyond what `--bg-elevated` border alone provides. No shadow token exists in `tokens.css`. A `--shadow-overlay` token (e.g. `0 8px 32px rgba(0,0,0,0.12)`) should be proposed in a separate token PR before implementation. Do not hardcode the value.
- **`Kbd` atom status.** The spec depends on a `Kbd` atom. Confirm `Kbd` has an approved spec and implementation before implementing `CommandPalette`.
