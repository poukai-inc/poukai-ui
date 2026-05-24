# AnnouncementBar

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`AnnouncementBar` is a page-top full-width banner for product announcements, maintenance notices, and time-sensitive promotions. It renders above the `Header` organism, is dismissable, and persists dismissal state via a consumer-supplied `id` keyed in `localStorage`. It serves marketing surfaces (pouk.ai landing, blog, docs) anywhere the site needs to surface a single high-priority message without interrupting page content.

## 2. Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  [Icon?]  Message text  [Action link]              [✕ btn]  │
└─────────────────────────────────────────────────────────────┘
```

- **Root**: `<div role="banner">` — full-width, above `<Header>`, renders as `display: none` post-hydration when dismissed.
- **Inner row**: centered content row, max-width `--content-max`, padded `--page-pad`.
- **Message slot**: `children` — short announcement copy.
- **Action slot** (optional): `ReactNode` — typically a `<Link>` or `<Button variant="ghost">`.
- **Dismiss button**: `<IconButton aria-label="Dismiss announcement">` — renders at the trailing edge; always present when `dismissable` is true (default).

## 3. Tokens

- `--bg-warm-accent` — default `info` tone background (editorial band; opt-in per `tone`)
- `--fg-on-warm` — text color on warm-accent band
- `--fg-on-warm-muted` — muted/secondary text and action link color on warm band
- `--surface` — background for `tone="neutral"`
- `--fg` — text color for `tone="neutral"`
- `--fg-muted` — muted text for `tone="neutral"`
- `--success` / `--bg-success` / `--fg-on-success` — success tone
- `--danger` / `--bg-danger` / `--fg-on-danger` — danger tone
- `--warning` / `--bg-warning` / `--fg-on-warning` — warning tone
- `--font-sans` — font family
- `--fs-meta` — 14px, message text register
- `--lh-meta` — 1.2, label-scale leading
- `--space-2` — vertical padding (block axis)
- `--space-4` — gap between message and action slot
- `--space-6` — inner row gap
- `--page-pad` — horizontal padding
- `--content-max` — max-width for inner row
- `--hairline-w` / `--hairline` — bottom border on `tone="neutral"`
- `--dur-fast` — dismiss fade-out transition
- `--easing` — dismiss motion easing

## 4. Variants / Props

| Prop          | Type                                                        | Default      | Rationale                                                                                                                                                                              |
| ------------- | ----------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | `string`                                                    | — (required) | `localStorage` key for dismissal persistence. Required so each bar is independently dismissable.                                                                                       |
| `tone`        | `"warm" \| "neutral" \| "success" \| "danger" \| "warning"` | `"warm"`     | `"warm"` maps to `--bg-warm-accent` — the brand editorial band; the natural register for launch announcements. Other tones use the status color tier for maintenance / outage notices. |
| `dismissable` | `boolean`                                                   | `true`       | When false, no dismiss button is rendered and no `localStorage` entry is written. Useful for mandatory maintenance notices.                                                            |
| `action`      | `ReactNode`                                                 | `undefined`  | Slot for a link or ghost button. Positioned inline after the message.                                                                                                                  |
| `children`    | `ReactNode`                                                 | — (required) | The announcement copy. Short: one sentence target.                                                                                                                                     |
| `onDismiss`   | `() => void`                                                | `undefined`  | Optional callback fired after dismissal animation completes.                                                                                                                           |

## 5. Interaction

- **Dismiss**: clicking the `IconButton` sets a `localStorage` entry keyed by `id`, then fades the bar out (`opacity: 0`, `max-height: 0`, `--dur-fast`). On subsequent page loads, the component reads `localStorage` before first paint (via a `useEffect` on mount) and renders `display: none` if already dismissed. SSR-safe: renders visible by default; hides post-hydration only if dismissed.
- **Focus order**: dismiss button is the last focus stop in the bar (trailing edge). Action link precedes it in DOM order.
- **Keyboard**: `Tab` reaches dismiss `IconButton`; `Enter` / `Space` activates it (native button semantics).
- **Hover on action**: inherits global `<a>` underline-grow behavior from `tokens.css`.

## 6. A11y

- Root element is `<div role="region" aria-label="Announcement">` — not `role="banner"` (that is the `<header>` landmark). A region landmark with a descriptive label surfaces it to assistive technology without conflating it with the page header.
- When `dismissable={true}`, the `IconButton` carries `aria-label="Dismiss announcement"`.
- After dismissal the element is removed from the DOM (not merely hidden via `visibility`) so it does not persist in the accessibility tree.
- Contrast (warm tone): `--fg-on-warm` (#fdf5f0) on `--bg-warm-accent` (#c0452c) — verified ≥ 4.5:1 AA for normal text at `--fs-meta`.
- Contrast (neutral tone): `--fg` (#1D1D1F) on `--surface` (#F5F5F7) — 15.46:1 AAA.
- Status tones use their respective `--fg-on-*` / `--bg-*` pairs, all verified AA in `tokens.css`.

## 7. Motion

- **Dismiss exit**: `opacity` 1→0, `max-height` current→0, `overflow: hidden`, duration `--dur-fast` (180ms), easing `--easing`.
- **`prefers-reduced-motion`**: the global `tokens.css` `prefers-reduced-motion` block clamps all transition durations to `0.01ms`, so the bar disappears instantly. No per-component override needed.
- **Entrance**: none — the bar is present in the initial render; no entrance animation.

## 8. Anti-patterns

- Not for persistent navigation chrome — use `Header` / `SiteShell` for that.
- Not for inline form feedback or field-level errors — use `Alert` for those.
- Not for cookie consent or legal-compliance banners — different interaction model (no persistence via `id`; different ARIA pattern).
- Not for multiple simultaneous announcements — only one `AnnouncementBar` per page.
- Not for long-form copy — the message slot targets one sentence; anything longer belongs in a dedicated page section.
- Not for toasts or ephemeral notifications — use a future `Toast` / `Snackbar` primitive.

## 9. Depends on

- `Alert` molecule — shares the semantic tone vocabulary; `AnnouncementBar` is the page-top, full-width complement to `Alert`'s inline usage.
- `IconButton` atom — dismiss control.

## Open questions

1. **`tone="warm"` action link color.** The action slot on `--bg-warm-accent` should use `--fg-on-warm-muted` for visual hierarchy. However, the global `<a>` underline uses `--accent` (#0071E3) which has insufficient contrast on the warm band. A token for link color on the warm band (`--link-on-warm`) does not exist. For Phase 1, the action slot consumer is responsible for passing a `<Link>` with an explicit `style` override. A `--link-on-warm` token should be proposed as a separate brand-level addition before this component ships.
