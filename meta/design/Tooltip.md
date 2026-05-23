# Tooltip

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`<Tooltip>` is the system's canonical hover-hint primitive — a brief, non-interactive label that surfaces on pointer hover or keyboard focus to clarify an unlabelled or space-constrained control. Its primary surfaces in the pouk.ai ecosystem are icon-only `IconButton` instances throughout the dashboard (where `aria-label` serves screen readers but sighted users need a visible hint), truncated content previews, status-badge micro-explanations, and disabled-button reasons. It wraps `@radix-ui/react-tooltip` to inherit correct portal rendering, positioning, delay, and keyboard semantics without reimplementing them.

## 2. Anatomy

```
┌─────────────────────┐
│  Tooltip.Content    │  ← floating panel, portalled
│  ┌───────────────┐  │
│  │  label text   │  │
│  └───────────────┘  │
└─────────────────────┘
         ↑
  Tooltip.Trigger (consumer element)
```

- **Provider** (`TooltipProvider`): wraps the app root once; controls global `delayDuration` and `skipDelayDuration`. Matches `ToastProvider` pattern already in the DS.
- **Root** (`Tooltip` / `Tooltip.Root`): Radix `Tooltip.Root` — manages open/closed state.
- **Trigger** (`Tooltip.Trigger`): Radix `Tooltip.Trigger`, always rendered `asChild` so it composes onto any existing element without adding a wrapper DOM node.
- **Content** (`Tooltip.Content`): floating panel. Renders into a portal above all other layers. Contains the label text. No close button, no arrow by default, no interactive children.

Convenience wrapper: a `<Tooltip content="…">` single-component form (wrapping Root + Trigger asChild + Content internally) for the common icon-button case.

## 3. Tokens

- `--bg-elevated` — Content panel background (front-most layer; `#ffffff` light / `#1c1c1e` dark)
- `--fg` — label text color
- `--hairline` — 1px border on Content panel
- `--hairline-w` — border width
- `--radius-2` — Content panel corner radius (4px)
- `--font-sans` — label typeface (Geist)
- `--fs-meta` — label font size (14px)
- `--lh-meta` — label line-height (1.2)
- `--space-2` — vertical padding inside Content (8px)
- `--space-3` — horizontal padding inside Content (12px)
- `--dur-fast` — open/close transition duration (180ms)
- `--easing` — open/close easing (expo-out)

## 4. Variants / Props

| Prop | Type | Default | Rationale |
|---|---|---|---|
| `content` | `ReactNode` | — | Label text for the simple wrapper form. Required when using `<Tooltip content="…">`. |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Preferred placement; Radix auto-flips on viewport collision. Top is the canonical hover-hint position. |
| `sideOffset` | `number` | `6` | px gap between trigger and Content panel. 6px sits within `--space-2` ballpark without needing a new token. |
| `delayDuration` | `number` | `700` | ms before tooltip opens on hover. 700ms is the Radix default and matches platform conventions. |
| `open` | `boolean` | — | Controlled open state (compound form only). |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial state. |
| `onOpenChange` | `(open: boolean) => void` | — | Open-state callback. |

The compound form (`Tooltip.Root` / `Tooltip.Trigger` / `Tooltip.Content`) accepts all Radix props verbatim on each sub-component, forwarding them through.

## 5. Interaction

- **Hover**: opens after `delayDuration` (default 700ms). Closes immediately on pointer-leave.
- **Focus**: opens immediately when the trigger receives keyboard focus (`focus-visible`). Closes on blur.
- **Escape**: closes the tooltip and returns focus to the trigger. Radix handles this natively.
- **Click**: tooltip closes; the trigger's own click handler fires normally. Tooltip does not intercept clicks.
- **Disabled triggers**: Radix wraps a disabled element in a `<span>` to allow pointer events. The DS spec explicitly supports this pattern for the "disabled button reason" use case.
- **Touch**: Radix surfaces no hover on touch; tooltip does not open on tap. Touch users rely on the `aria-label` of the trigger element.

## 6. A11y

- **Trigger**: the consumer's element, unchanged. Must carry its own accessible name (`aria-label` for icon-only buttons). Tooltip does not substitute for `aria-label`.
- **Content panel**: Radix assigns `role="tooltip"` and wires `aria-describedby` from the trigger to the Content panel automatically. No manual ARIA needed.
- **Screen readers**: tooltip content is read as a description of the trigger, not as a replacement label. The trigger's `aria-label` is still the primary accessible name.
- **Keyboard**: fully keyboard-accessible via Radix — focus opens, Escape closes, no tab-stop inside the tooltip panel itself (tooltip content is non-interactive by design).
- **Contrast**: `--fg` (#1D1D1F) on `--bg-elevated` (#FFFFFF) = 16.1:1 (AAA). Dark mode: `--fg` (#F5F5F7) on `--bg-elevated` (#1C1C1E) = 18.9:1 (AAA).
- **axe**: `aria-describedby` pairing is managed by Radix. Tooltip content must not contain interactive elements (links, buttons) — doing so breaks the `role="tooltip"` contract and would violate WCAG 1.3.1.

## 7. Motion

- **Open**: Content panel fades in (`opacity: 0 → 1`) and scales up subtly from the trigger (`scale: 0.96 → 1`) using `--dur-fast` (180ms) with `--easing` (expo-out).
- **Close**: reverse — fade out and scale down over `--dur-fast`.
- **`prefers-reduced-motion: reduce`**: the global tokens.css block clamps all `transition-duration` and `animation-duration` to `0.01ms`. No per-component reduced-motion override needed; the global clamp handles it.

## 8. Anti-patterns

- **Do not put interactive content inside a tooltip.** No buttons, links, or inputs. Use a `Popover` for interactive content.
- **Do not use a tooltip as the sole label for a control.** The trigger must carry its own `aria-label`; the tooltip supplements with a visible hint but is invisible to screen readers until hover/focus, and invisible on touch.
- **Do not use for long-form content.** Tooltip is for a single short phrase (ideally under 80 characters). For longer explanations, use an inline `FieldNote`, `Alert`, or `Popover`.
- **Do not nest tooltips.** One tooltip per trigger. Nested tooltips violate the non-interactive content rule and create unpredictable Radix state.
- **Do not use to replace a visible label.** If a label can be made visible (even truncated with a `title` attr), prefer that over always-hidden tooltip UI.
- **Do not use `Tooltip` as a status indicator.** `StatusBadge` is for liveness state; `Tooltip` is a hint delivery mechanism.

## 9. Depends on

- `@radix-ui/react-tooltip` — required; provides Root, Trigger, Content, Provider, Portal.
- No other DS components. The Content panel is self-contained. Consumers compose `Tooltip` around their own atoms (e.g. `IconButton`, `Button`, `StatusBadge`).
