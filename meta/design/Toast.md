# Design spec: Toast

**Atomic layer**: organism
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-20

---

## 1. Purpose

`Toast` is the imperative notification organism for the pouk.ai design system. It surfaces time-limited feedback messages to users without blocking interaction with the page. Unlike `Dialog` (modal, blocking) and `Banner` (persistent, inline), a Toast is:

- **Non-blocking** — rendered in a fixed portal viewport; page content remains interactive.
- **Auto-dismissing** — each toast has a configurable duration after which it removes itself.
- **Imperatively triggered** — consumers call `useToast().show(payload)` from anywhere in the tree without the notification needing to live in the render tree.

**Primary use cases**: deployment status, save confirmations, API key warnings, error summaries, success feedback.

**Non-goals:**

- **Not a Dialog.** Dialogs are modal and blocking. Toasts are non-blocking.
- **Not a Banner.** Banners are persistent, inline, and document-flow. Toasts are time-limited, portaled, and fixed.
- **Not an alert dialog.** For destructive confirmation requiring acknowledgment, use `Dialog`.

---

## 2. Anatomy

### API shape: Provider + imperative hook

Two primitives are exported:

**`ToastProvider`** — context provider. Wraps the app (or a subtree). Manages the active toast queue, renders the Radix viewport portal, and renders each active toast as a `@radix-ui/react-toast` `Root`.

**`useToast()`** — returns `{ show(payload: ToastPayload): string; dismiss(id: string): void }`. Consumers imperatively trigger toasts without needing to own state.

### `ToastPayload` type

```ts
interface ToastPayload {
  tone?: "info" | "danger" | "warning" | "success"; // default "info"
  title?: string;
  body: string;
  duration?: number; // ms; overrides provider defaultDuration
  action?: { label: string; onClick: () => void };
}
```

### Internal architecture

- `ToastProvider` holds `{ id, payload }[]` in `useState`.
- `show()` pushes a new entry and enforces the `max` cap (oldest entries dropped).
- `dismiss()` removes by id.
- Each entry renders as `<Toast.Root duration={…} onOpenChange={(open) => !open && dismiss(id)}>` — Radix's internal timer calls `onOpenChange(false)` when duration expires, which triggers our `dismiss()`.
- Radix `Provider` + `Viewport` handle the portal and ARIA live region. No third-party portal library.

---

## 3. Tokens used

No new tokens required. The status palette (`--danger`, `--bg-danger`, `--fg-on-danger`, `--warning`, `--bg-warning`, `--fg-on-warning`) was shipped alongside `Banner`.

| Token             | Value                             | Role                                       |
| ----------------- | --------------------------------- | ------------------------------------------ |
| `--bg-elevated`   | `#ffffff`                         | Toast background (info + success tones)    |
| `--fg`            | `#1d1d1f`                         | Text color (info + success tones)          |
| `--accent`        | `#0071e3`                         | Success left-rule; focus rings             |
| `--bg-danger`     | `#fef0f0`                         | Danger tone background                     |
| `--danger`        | `#b3261e`                         | Danger left-rule                           |
| `--fg-on-danger`  | `#5c1310`                         | Danger tone text                           |
| `--bg-warning`    | `#fff7e6`                         | Warning tone background                    |
| `--warning`       | `#b46100`                         | Warning left-rule                          |
| `--fg-on-warning` | `#4a2900`                         | Warning tone text                          |
| `--hairline`      | `#d2d2d7`                         | Border (info + success tones)              |
| `--hairline-w`    | `1px`                             | Border width                               |
| `--radius-2`      | `4px`                             | Toast corner radius                        |
| `--font-sans`     | Geist stack                       | All text                                   |
| `--fs-meta`       | `0.875rem` (14px)                 | Body and title text size                   |
| `--lh-meta`       | `1.2`                             | Title line-height                          |
| `--lh-body`       | `1.55`                            | Body line-height                           |
| `--space-1`       | `0.25rem` (4px)                   | Title→body gap                             |
| `--space-2`       | `0.5rem` (8px)                    | Toast stack gap; controls gap              |
| `--space-3`       | `0.75rem` (12px)                  | Toast padding block; text/controls gap     |
| `--space-4`       | `1rem` (16px)                     | Toast padding inline                       |
| `--space-6`       | `1.5rem` (24px)                   | Viewport edge offset                       |
| `--dur-fast`      | `180ms`                           | Entrance/exit animation                    |
| `--easing`        | `cubic-bezier(0.16, 1, 0.3, 1)`   | Entrance easing (expo-out)                 |
| `--radius-1`      | `2px`                             | Close button focus ring radius             |
| `--page-pad`      | `clamp(1.5rem, 2vw + 1rem, 3rem)` | Toast width side inset on narrow viewports |

**Box-shadow**: `0 4px 12px rgb(0 0 0 / 0.08)` — inline value. No shadow token exists in the DS vocabulary. Consistent with Dialog's rationale (meta/design/Dialog.md §6). The shadow provides the primary elevation signal on the toast surface.

---

## 4. Tone contract

| Tone      | Background      | Left rule (2px)  | Text color        | Radix type     | ARIA live |
| --------- | --------------- | ---------------- | ----------------- | -------------- | --------- |
| `info`    | `--bg-elevated` | — (hairline all) | `--fg`            | `"background"` | polite    |
| `success` | `--bg-elevated` | `--accent`       | `--fg`            | `"background"` | polite    |
| `warning` | `--bg-warning`  | `--warning`      | `--fg-on-warning` | `"foreground"` | assertive |
| `danger`  | `--bg-danger`   | `--danger`       | `--fg-on-danger`  | `"foreground"` | assertive |

`tone="info"` uses a full hairline border (no left-rule accent) — consistent with Banner's info treatment.

Radix maps `type="foreground"` to `aria-live="assertive"` and `type="background"` to `aria-live="polite"`. Warning and danger interrupt the screen reader immediately; info and success are polite.

---

## 5. Layout & geometry

### Viewport

```
position: fixed
z-index: 200   ← above Dialog overlay (100) and content (101)
width: min(420px, calc(100vw - 2 * var(--page-pad)))
display: flex; flex-direction: column; gap: var(--space-2)
pointer-events: none  ← only individual toast roots are pointer-interactive
```

### Viewport positions

| Position        | CSS                                                         |
| --------------- | ----------------------------------------------------------- |
| `top-right`     | `top: --space-6; right: --space-6`                          |
| `bottom-right`  | `bottom: --space-6; right: --space-6`                       |
| `top-center`    | `top: --space-6; left: 50%; transform: translateX(-50%)`    |
| `bottom-center` | `bottom: --space-6; left: 50%; transform: translateX(-50%)` |

### Toast root

```
width: min(420px, calc(100vw - 2 * var(--page-pad)))
padding: var(--space-3) var(--space-4)
border-radius: var(--radius-2)
box-shadow: 0 4px 12px rgb(0 0 0 / 0.08)
pointer-events: auto
```

### Inner layout

```
[inner — flex row, align-items: flex-start, gap: --space-3]
  ├── [textBlock — flex: 1, min-width: 0]
  │     ├── [title — optional, --fs-meta, weight 500]
  │     └── [body — --fs-meta, weight 400]
  └── [controls — flex-shrink: 0, gap: --space-2]
        ├── [Action button — optional, <Button variant="ghost" size="sm">]
        └── [Close button — 20×20, X icon (14px), aria-label="Close"]
```

---

## 6. States & motion

### Entrance animation (bottom-right / top-right)

```
[data-state="open"]  → slide in from right: translateX(100% + --space-6) → translateX(0)
                        opacity 0 → 1; duration: --dur-fast; easing: --easing
[data-state="closed"] → fade out: opacity 1 → 0; duration: --dur-fast; easing: ease
```

### Reduced motion

The global block in `tokens.css` collapses all `animation-duration` to `0.01ms !important`. Toasts appear and disappear instantly for users who prefer reduced motion. No per-component override needed.

### z-index rationale

Dialog overlay: z-index 100. Dialog content: z-index 101. Toast viewport: z-index 200. Toasts render above open dialogs — a deliberate hierarchy since a toast triggered by an action inside a dialog should remain visible above the overlay.

---

## 7. Accessibility

Radix handles all ARIA plumbing:

- `role="status"` via `aria-live="polite"` for `type="background"` (info, success).
- `role="alert"` via `aria-live="assertive"` for `type="foreground"` (warning, danger).
- `aria-atomic="true"` — the entire toast is announced as a unit.
- Swipe-to-dismiss: Radix implements swipe gesture for touch users.
- Reduced motion: handled at the token level.

**Close button**: `aria-label="Close"` (default). Overridable via `closeLabel` prop on `ToastProvider`.

**Action button**: Uses Radix's `<Toast.Action altText={action.label}>` — the `altText` prop is required by Radix to provide an accessible alternative text for screen readers when the visual action is not available. Wraps a `<Button variant="ghost" size="sm">` from the DS.

**Contrast:**

| Pair                                                    | Ratio   | Verdict |
| ------------------------------------------------------- | ------- | ------- |
| `--fg` (#1D1D1F) on `--bg-elevated` (#FFFFFF)           | 19.32:1 | AAA     |
| `--fg-on-warning` (#4A2900) on `--bg-warning` (#FFF7E6) | ~10.2:1 | AAA     |
| `--fg-on-danger` (#5C1310) on `--bg-danger` (#FEF0F0)   | ~9.1:1  | AAA     |

---

## 8. Prop interface

### `ToastProvider`

| Prop              | Type                                                               | Default          | Description                                         |
| ----------------- | ------------------------------------------------------------------ | ---------------- | --------------------------------------------------- |
| `children`        | `ReactNode`                                                        | required         | App subtree                                         |
| `defaultDuration` | `number`                                                           | `5000`           | Default auto-dismiss duration in ms                 |
| `max`             | `number`                                                           | `4`              | Max simultaneous toasts; oldest dropped if exceeded |
| `position`        | `"top-right" \| "bottom-right" \| "top-center" \| "bottom-center"` | `"bottom-right"` | Viewport anchor position                            |
| `closeLabel`      | `string`                                                           | `"Close"`        | Accessible label for the close button on each toast |

### `useToast()` return value

| Key       | Type                                | Description                                         |
| --------- | ----------------------------------- | --------------------------------------------------- |
| `show`    | `(payload: ToastPayload) => string` | Adds a toast to the queue; returns the generated id |
| `dismiss` | `(id: string) => void`              | Imperatively removes a toast by id                  |

---

## 9. Composition rules

- **One `ToastProvider` per app.** Multiple nested providers create separate queues and separate viewports — this is almost never desired. Wrap the app root once.
- **`useToast()` must be called inside `ToastProvider`.** Throws if called outside.
- **Toast does not compose with `SiteShell`.** `SiteShell` does not include a `ToastProvider` — that is the consuming app's concern.
- **`action` fires once and does not auto-dismiss.** The action's `onClick` is the consumer's responsibility. Clicking the action button does not automatically dismiss the toast; the consumer calls `dismiss(id)` explicitly if desired.
- **No nested interactive content beyond action + close.** Following WCAG and Radix constraints — only one action button plus the close button.

---

## 10. Out of scope

- **Persistent / undismissable toasts.** Every toast auto-dismisses. For a persistent notice, use `Banner`.
- **Progress toasts.** A toast with an in-progress state (loading spinner, then success) is a future variant.
- **Undo action.** A common pattern (snackbar with Undo) is achievable with the `action` prop today. No special undo handling.
- **Toast queuing beyond max.** Exceeding `max` drops the oldest; there is no backlog queue.
- **Custom entrance animation per position.** The spec ships slide-in-from-right as the default. Position-specific animations (slide-from-top for top-center) are defined as keyframes but not wired per-toast-root via position context — this is a future enhancement.
