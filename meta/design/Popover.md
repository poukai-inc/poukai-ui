# Popover

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`<Popover>` is the DS's anchored, dismissible floating-content primitive — a Radix Popover wrapped to DS tokens. It serves surfaces that need to anchor rich content (filter pickers, inline action panels, hover-cards, color pickers, form field helpers) to a trigger element without blocking the page the way a Dialog would. It sits at the molecule layer because it composes a Radix primitive with DS surface, elevation, motion, and focus tokens; it contains no logic of its own. Every floating-panel surface in the DS that is not a full Dialog and not a Tooltip descends from Popover.

## 2. Anatomy

```
<Popover.Root>           — Radix PopoverRoot; manages open state
  <Popover.Trigger>      — Radix PopoverTrigger; any focusable element
  <Popover.Portal>       — Radix PopoverPortal; renders into body, avoids z clipping
    <Popover.Content>    — floating panel; DS surface, shadow, radius, padding
      [children]         — consumer-supplied content (slot)
      <Popover.Arrow>    — optional 8px caret; uses --hairline fill
      <Popover.Close>    — optional ×-button inside the panel; IconButton sm
```

Trigger is `asChild`-capable so any DS atom (Button, IconButton, a plain `<a>`) becomes the anchor without a wrapper element.

Content renders via a portal so it is never clipped by `overflow: hidden` ancestors.

## 3. Tokens

- `--bg-elevated` — Content background (front-most layer, distinct from page `--bg`)
- `--hairline` — Content border color; also Arrow fill
- `--hairline-w` — Content border width (1px)
- `--radius-3` — Content corner radius (8px)
- `--space-4` — Content padding (all sides)
- `--fg` — Text color within content (inherited)
- `--fg-muted` — Supporting text within content (inherited)
- `--accent` — Focus ring on Trigger and Close button
- `--radius-1` — Focus ring border-radius
- `--easing` — Content enter/exit easing (expo-out)
- `--dur-fast` — Content enter/exit duration (180ms)
- `--fs-meta` — Close button label size if rendered as text
- `--space-2` — Gap between Trigger and Content (Radix `sideOffset`)

## 4. Variants / Props

| Prop           | Type                                     | Default    | Rationale                                                            |
| -------------- | ---------------------------------------- | ---------- | -------------------------------------------------------------------- |
| `open`         | `boolean`                                | —          | Controlled open state                                                |
| `defaultOpen`  | `boolean`                                | `false`    | Uncontrolled initial state                                           |
| `onOpenChange` | `(open: boolean) => void`                | —          | State change callback                                                |
| `side`         | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred placement; Radix auto-flips when viewport-clipped          |
| `align`        | `"start" \| "center" \| "end"`           | `"center"` | Alignment along the cross axis                                       |
| `sideOffset`   | `number` (px)                            | `8`        | Gap between trigger and panel; matches `--space-2`                   |
| `arrow`        | `boolean`                                | `false`    | Renders `<Popover.Arrow>` caret                                      |
| `modal`        | `boolean`                                | `false`    | When true, blocks pointer interaction outside panel (Dialog posture) |

No `size` prop in Phase 1. Content width is set by the consumer's children; the panel has no min/max-width of its own.

## 5. Interaction

- **Open**: trigger `click` (or `Enter` / `Space` on keyboard) toggles open.
- **Close**: click outside content area, `Escape` key, or explicit `<Popover.Close>`.
- **Focus order**: on open, focus moves to the first focusable element inside Content. On close, focus returns to Trigger.
- **Tab trap**: Popover is not a modal by default — Tab exits the panel naturally into the page. Set `modal={true}` only when the content must lock focus (rare; prefer Dialog for that posture).
- **Hover**: no hover-open in this primitive. Hover-triggered floating panels belong to `HoverCard` (separate spec, `@radix-ui/react-hover-card`).
- **Flip / collision**: Radix handles viewport-edge collision detection; `side` is a preference, not a guarantee.

## 6. A11y

- Trigger renders with `aria-haspopup="dialog"` and `aria-expanded` (Radix-managed).
- Content receives `role="dialog"` and `aria-labelledby` pointing to a heading inside Content when one is present; consumer must pass a heading or `aria-label` on `<Popover.Content>` when no visible heading exists.
- `<Popover.Close>` must have an accessible name — pass `aria-label="Close"` or a visually-hidden label.
- Arrow is decorative; `aria-hidden="true"` applied by Radix.
- Contrast: Content text on `--bg-elevated` (#FFFFFF light / #1C1C1E dark) — `--fg` passes AAA in both modes.
- axe rules in play: `aria-required-children`, `focus-trap` (modal mode), `color-contrast`.

## 7. Motion

Enter (Content mounts):

- `opacity: 0 → 1`, duration `--dur-fast` (180ms), easing `--easing` (expo-out).
- `transform: translateY(4px) → translateY(0)` for `side="bottom"`; axis mirrors for other sides.

Exit (Content unmounts):

- `opacity: 1 → 0`, duration `--dur-fast`, easing `ease-in`.
- Transform reverses.

Radix exposes `data-state="open" | "closed"` and `data-side` on Content; CSS targets these attributes directly.

`@media (prefers-reduced-motion: reduce)`: the global rule in `tokens.css` clamps all `transition-duration` to `0.01ms`. No additional per-component reduced-motion block needed.

## 8. Anti-patterns

- **Do not use Popover as a Dialog.** If the content blocks page interaction or requires a backdrop, use `Dialog`. Popover is non-blocking by default.
- **Do not use Popover for hover-only reveals.** Hover-triggered panels belong to `HoverCard`. Popover is click/keyboard-activated.
- **Do not use Popover for single-line hints.** One-line explanations belong to `Tooltip`. Popover is for rich or interactive content.
- **Do not place full navigation trees inside a Popover.** A `DropdownMenu` or `Sidebar` is the correct primitive for navigation lists.
- **Do not rely on Popover for persistent side panels.** Panels that remain visible while the user works elsewhere are Sheet / Drawer patterns — not Popover.

## 9. Depends on

- `@radix-ui/react-popover` — wrap this exact package; do not rebuild anchor logic.
- `Button` or `IconButton` — canonical trigger elements (consumer-supplied via `asChild`).

Wrote meta/design/Popover.md (96 lines)
