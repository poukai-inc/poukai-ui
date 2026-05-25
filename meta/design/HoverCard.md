# HoverCard

**Status**: Approved

## 1. Intent

`<HoverCard>` is the system's hover-triggered preview card — an anchored floating surface that reveals a compact summary (avatar, name, bio, metadata) when a user hovers over a trigger element such as an author link, profile mention, or project reference. It solves the "who is this?" micro-moment without navigating away from the current surface. Primary consumers: editorial article bylines, team grids, mention text in prose, and any surface that links to a person or resource. Built on `@radix-ui/react-hover-card` for pointer-delay management, positioning, and keyboard dismissal.

## 2. Anatomy

```
┌─ HoverCard.Root ──────────────────────────┐
│  HoverCard.Trigger (asChild → any node)   │
│                                           │
│  HoverCard.Content  ┌───────────────────┐ │
│                     │ [Avatar] [Name   ] │ │
│                     │ [Role / eyebrow  ] │ │
│                     │ [Summary body    ] │ │
│                     │ [Meta row (time)] │ │
│                     └───────────────────┘ │
└───────────────────────────────────────────┘
```

- **Root**: context provider; owns open/close delays.
- **Trigger**: `asChild` slot — renders any DS component (Link, Avatar, text) as the trigger; no added wrapper element.
- **Content**: the floating card surface. Elevated layer using `--bg-elevated`. Contains a header row (Avatar + name + role), optional body (short bio / description), and an optional meta row (timestamp, stat).
- **Arrow**: optional Radix `HoverCard.Arrow` — a small directional caret that anchors the card visually to the trigger. Filled with `--bg-elevated`, stroked with `--hairline`.

## 3. Tokens

- `--bg-elevated` — card surface (front-most layer; white light / `#1C1C1E` dark)
- `--fg` — name text, primary body copy
- `--fg-muted` — role label, meta row, body copy secondary
- `--hairline` — card border, arrow stroke
- `--hairline-w` — 1px card border width
- `--radius-3` — 8px card corner radius
- `--space-3` — 12px gap between avatar and name/role column
- `--space-4` — 16px card internal padding; gap between header and body
- `--space-2` — 8px gap between name and role within header column; meta row gap
- `--fs-meta` — 14px role label and meta text
- `--fs-body` — body copy font size
- `--lh-meta` — 1.2 line-height for name and role
- `--lh-body` — 1.55 line-height for body copy
- `--font-sans` — all text in the card
- `--dur-fast` — 180ms open/close fade duration
- `--easing` — expo-out easing for entrance
- `--accent` — focus ring on trigger

## 4. Variants / Props

| Prop         | Type                                     | Default    | Rationale                                                                    |
| ------------ | ---------------------------------------- | ---------- | ---------------------------------------------------------------------------- |
| `openDelay`  | `number` (ms)                            | `700`      | Radix default; long enough to prevent accidental opens on fast mouse-through |
| `closeDelay` | `number` (ms)                            | `300`      | Short enough to feel responsive when moving cursor away                      |
| `side`       | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Radix positioning; bottom is natural for inline text triggers                |
| `align`      | `"start" \| "center" \| "end"`           | `"start"`  | Aligns card edge to trigger edge; `start` keeps card near trigger origin     |
| `showArrow`  | `boolean`                                | `true`     | Directional caret visually anchors card to trigger                           |
| `width`      | `"sm" \| "md"`                           | `"md"`     | `sm` = 220px (avatar-only previews), `md` = 280px (full profile card)        |

Content shape inside `HoverCard.Content` is consumer-controlled; no enforced slot API on the content node — consumers compose Avatar, Text, StatusBadge, etc. freely.

## 5. Interaction

- **Open**: pointer enters trigger after `openDelay` ms; card opens.
- **Stay open**: pointer moves from trigger into the card content area — Radix keeps the card open while pointer is within either the trigger or the content.
- **Close**: pointer leaves both trigger and content; card closes after `closeDelay` ms. Pressing `Escape` closes immediately.
- **Keyboard**: HoverCard is pointer-only by design (Radix spec). It does not open on focus. Keyboard users reach the trigger link normally and navigate away via Tab/Enter. No `aria-haspopup` or `aria-expanded` is emitted on the trigger.
- **Touch**: Radix suppresses hover-card open on touch devices — the trigger's native tap behavior is unaffected.
- **Focus within content**: if the card contains interactive elements (links, buttons), they are reachable only via pointer. Do not place critical actions inside HoverCard content — use Popover or Dialog for actionable overlays.

## 6. A11y

- **Trigger**: rendered `asChild` so semantic role is entirely the trigger element's own (e.g. `<a>` remains `<a>`). No ARIA attributes added by HoverCard to the trigger.
- **Content**: `role="dialog"` is NOT appropriate — this is non-modal, pointer-triggered supplementary content. Radix renders the content with no explicit role; the content is visually and functionally supplementary. Assistive technologies that do not support hover interactions will rely on the trigger's own accessible name and destination.
- **Dismissal**: `Escape` closes; handled by Radix.
- **Contrast**: `--fg` on `--bg-elevated` = 16.29:1 (AAA); `--fg-muted` on `--bg-elevated` = 4.91:1 (AA normal). Card border (`--hairline`) is decorative.
- **Portal**: Radix renders content in a portal; it does not disrupt document reading order for AT.
- **Do not rely on HoverCard for critical information** — content inside the card is invisible to keyboard-only and touch users. All essential info must also be accessible via the trigger destination.

## 7. Motion

- **Entrance**: `opacity: 0 → 1`, `translateY: 4px → 0` (bottom side; direction-aware for other sides). Duration `--dur-fast` (180ms), easing `--easing`.
- **Exit**: `opacity: 1 → 0`. Duration `--dur-fast`.
- **`prefers-reduced-motion: reduce`**: the global `*` rule in `tokens.css` clamps all `transition-duration` and `animation-duration` to `0.01ms`. No per-component reduced-motion block needed — the global rule covers it. The card still appears/disappears; only the tween is suppressed.

## 8. Anti-patterns

- **Not a Tooltip.** HoverCard is for rich preview content (avatar, bio, metadata). Tooltip is for a single short label on an icon button. Do not use HoverCard to show a text hint — use Tooltip.
- **Not a Popover.** HoverCard is pointer-triggered and non-actionable. If the card needs interactive controls (buttons, forms, checkboxes), use Popover which supports focus-within and keyboard open/close.
- **Not a Dialog.** HoverCard is never modal. Never place critical-path actions or confirmations inside it.
- **Not for touch-primary surfaces.** HoverCard content is unreachable on touch. Do not put information that mobile users need inside a HoverCard without a tap-accessible alternative.
- **Not a navigation menu.** HoverCard is not a dropdown menu; use DropdownMenu or NavigationMenu for lists of actions or routes.
- **Not for status.** Use StatusBadge for liveness/availability state. HoverCard is a preview surface, not a status indicator.

## 9. Depends on

- `@radix-ui/react-hover-card` — Radix primitive (portal, delay management, positioning, Escape dismiss).
- `Avatar` atom — for person/entity preview header (when used in profile-card pattern).
- `Link` atom — idiomatic trigger element.
- `StatusBadge` atom — optional within card content for availability state.
