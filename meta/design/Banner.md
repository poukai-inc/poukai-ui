# Banner — design spec

**Status**: Approved
**Layer:** molecule
**Owner:** poukai-design
**Authored:** 2026-05-19

---

## 1. Purpose

Persistent inline notice — info, success, warning, danger register. Sits in document flow; not a toast, not a modal, not a status indicator. Consumer controls mount/unmount; Banner has no dismissal logic in v1.

---

## 2. Anatomy

```
┌─ root (div, role="status"|"alert") ─────────────────────────┐
│ [icon slot] [body (children)] [action slot]                  │
└──────────────────────────────────────────────────────────────┘
```

- **Leading icon slot** (`icon?: ReactNode`) — optional. No auto-icon. Consumer passes an SVG with `aria-hidden="true"` for decorative icons.
- **Body** (`children: ReactNode`) — required. Any inline ReactNode.
- **Trailing action slot** (`action?: ReactNode`) — optional. Typically `<Button variant="ghost">`. Natural focus order after body.
- **Decorative left rule** — present on all tones. Width and color vary per tone (see §4).

---

## 3. Props API

| Prop        | Type                                           | Default  | Notes                                    |
| ----------- | ---------------------------------------------- | -------- | ---------------------------------------- |
| `tone`      | `"info" \| "warning" \| "danger" \| "success"` | `"info"` | Controls color, role, and left rule.     |
| `icon`      | `ReactNode`                                    | —        | Optional leading slot. No auto-icon.     |
| `action`    | `ReactNode`                                    | —        | Optional trailing slot.                  |
| `children`  | `ReactNode`                                    | required | Body content.                            |
| `...rest`   | `ComponentPropsWithoutRef<"div">`              | —        | Forwarded to root `<div>`.               |
| `ref`       | `Ref<HTMLDivElement>`                          | —        | Forwarded to root `<div>`.               |
| `className` | `string`                                       | —        | Merged with internal CSS Module classes. |

- `forwardRef<HTMLDivElement, BannerProps>`, root `<div>`.
- `displayName = "Banner"`.
- `clsx` for className merging.

---

## 4. Tone colors

| Tone      | Background         | Text           | Left rule                     | Full border                       | ARIA role       |
| --------- | ------------------ | -------------- | ----------------------------- | --------------------------------- | --------------- |
| `info`    | `--bg`             | `--fg`         | `--hairline-w` / `--hairline` | `--hairline-w` solid `--hairline` | `role="status"` |
| `warning` | `--bg-warm-accent` | `--fg-on-warm` | `2px` / `--fg-on-warm-muted`  | none                              | `role="alert"`  |
| `danger`  | `--bg-warm-accent` | `--fg-on-warm` | `2px` / `--fg-on-warm-muted`  | none                              | `role="alert"`  |
| `success` | `--bg-elevated`    | `--fg`         | `2px` / `--accent`            | `--hairline-w` solid `--hairline` | `role="status"` |

No new tokens introduced. No danger/warning/success color tokens added.

---

## 5. Tokens consumed

`--bg`, `--bg-elevated`, `--bg-warm-accent`, `--fg`, `--fg-on-warm`, `--fg-on-warm-muted`, `--hairline`, `--hairline-w`, `--accent`, `--font-sans`, `--fs-body`, `--lh-body`, `--space-2`, `--space-3`, `--space-4`, `--radius-2`.

---

## 5b. Action slot contrast constraint

`<Button variant="ghost">` uses `--fg` (`#1d1d1f`) as its text color. Over `--bg-warm-accent` (`#c0452c`), this gives a contrast ratio of 3.3:1 — below the WCAG AA threshold of 4.5:1. On `warning` and `danger` tones, action slot elements **must** use `--fg-on-warm` (`#fdf5f0`) for text. Consumers should either style their action elements with `color: var(--fg-on-warm)` or use a variant of Button that supports on-warm coloring when one is designed. A `variant="ghost-on-warm"` Button variant is a candidate for a future spec. This constraint is surfaced here to inform the Button spec evolution.

On `info` and `success` tones, `<Button variant="ghost">` composes cleanly — both use `--bg`/`--bg-elevated` backgrounds with sufficient contrast against `--fg`.

## 6. Accessibility

- `role="status"` (polite live region) for `info` and `success` tones.
- `role="alert"` (assertive live region) for `warning` and `danger` tones.
- Icon slot wrapped in `aria-hidden="true"` — decorative; consumer is responsible for accessible icon markup.
- Action slot receives natural DOM focus order after body content.
- No focus management in v1 — Banner is static and persistent.

---

## 7. Layout & responsive

- Flex row: `icon | body | action`. `flex-wrap: wrap` for narrow viewports.
- Body (`flex: 1`) takes remaining space; icon and action are `flex-shrink: 0`.
- No max-width constraint — Banner fills its container. Consumer controls width via layout context.
- Same layout across all breakpoints.

---

## 8. States

Static. No hover, active, or disabled states. No dismissal animation in v1. Consumer controls mount/unmount.

---

## 9. Out of scope (v1)

- Toast / ephemeral overlay — deferred. Requires a Provider for queue + timing + portal.
- Dismissal animation or auto-dismiss timing.
- Auto-icon per tone.
- Dark-mode token overrides.
