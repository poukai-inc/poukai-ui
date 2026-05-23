# CopyButton

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`CopyButton` is a single-purpose affordance that copies a string value to the clipboard and confirms the action with a transient success state. It serves inline product surfaces — API key displays, code snippets, share URLs, token readouts — where the user needs a zero-friction copy action without leaving the page. It composes into `CodeBlock` as its built-in copy control and stands alone wherever a clipboard action is the right micro-interaction.

## 2. Anatomy

```
[ Icon ] [ Label? ]
  idle:    <Copy icon>   "Copy"   (label optional)
  success: <Check icon>  "Copied" (auto-reverts after ~1.5 s)
```

- **Root**: `<button type="button">` — interactive, keyboard-activatable.
- **Icon slot**: leading icon, swaps between idle and success states. Idle: copy icon (`lucide-react`). Success: checkmark icon (`lucide-react`). Both rendered `aria-hidden`.
- **Label** (optional): visible text beside the icon. When omitted, consumer must supply `aria-label` on the root for screen-reader access.
- **State layer**: no visible background at rest (`ghost` register); subtle surface fill on hover.

## 3. Tokens

- `--font-sans` — button label typography
- `--fs-meta` — label size (14px; CopyButton is a secondary affordance, not a primary CTA)
- `--fg-muted` — idle icon + label color; recedes behind primary content
- `--fg` — success state icon + label color; momentary positive emphasis
- `--accent` — `:focus-visible` outline color
- `--surface` — hover background fill
- `--hairline` — optional border for outlined variant
- `--hairline-w` — border width (1px)
- `--radius-2` — corner radius (4px)
- `--space-1` — block padding
- `--space-2` — inline padding; gap between icon and label
- `--dur-fast` — success-state color transition (180ms)
- `--dur-slow` — revert timeout reference (~600ms; actual 1.5 s is JS-driven, not CSS)
- `--icon-xs` — icon size inside compact pill register (12px)
- `--easing` — transition easing

## 4. Variants / Props

| Prop | Type | Default | Rationale |
|---|---|---|---|
| `value` | `string` | — (required) | The string written to the clipboard. |
| `label` | `string \| false` | `"Copy"` | Visible label. Pass `false` to render icon-only (requires `aria-label` on root). |
| `successLabel` | `string` | `"Copied"` | Label shown during success state. |
| `timeout` | `number` | `1500` | Ms before reverting from success to idle. Keeps the positive signal brief. |
| `size` | `"sm" \| "md"` | `"sm"` | `sm` uses `--fs-meta` + `--icon-xs`; `md` uses `--fs-body` + `--icon-sm`. Default `sm` — CopyButton is a secondary affordance. |
| `onCopy` | `(value: string) => void` | — | Optional callback fired after a successful write. Useful for analytics or toast coordination. |
| `onError` | `(err: unknown) => void` | — | Called when `navigator.clipboard.writeText` rejects. Consumer decides whether to surface a toast. |

## 5. Interaction

- **Click / `Enter` / `Space`**: calls `navigator.clipboard.writeText(value)`. On success, transitions to success state. On failure, calls `onError` if provided; component stays in idle state (no error UI owned by CopyButton itself).
- **Clipboard API fallback**: when `navigator.clipboard` is unavailable (insecure context, blocked permission), the component falls back to `document.execCommand('copy')` via a temporary textarea. If both paths fail, `onError` is invoked.
- **Hover**: background fills to `--surface`. Cursor: `pointer`.
- **Focus**: `:focus-visible` outline — 2px solid `--accent`, 2px offset, `--radius-1` radius. Matches Button focus contract.
- **Active**: `transform: translateY(1px)` at `--dur-press` (80ms) for tactile press feedback.
- **Disabled**: `opacity: 0.5`, `pointer-events: none`. No clipboard action fires.
- **Success auto-revert**: after `timeout` ms, component transitions back to idle. Revert is cancelled and restarted on repeated clicks during the success window.

## 6. A11y

- Root is `<button type="button">` — native keyboard activation, correct implicit role.
- When `label` is visible: the text is the accessible name. No additional `aria-label` needed.
- When `label={false}` (icon-only): consumer must supply `aria-label="Copy"` (or contextual equivalent) on the root. This is documented as a required contract; the DS cannot enforce it via types but should warn in JSDoc.
- Icon elements carry `aria-hidden="true"` — they are decorative; the label or `aria-label` carries the name.
- Success state uses `aria-live="polite"` on the label node so screen readers announce "Copied" without interrupting ongoing narration. On revert, the announcement returns to "Copy".
- Contrast — idle `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD): 4.91:1 — AA normal at 14px. Success `--fg` (#1D1D1F) on `--bg`: 16.29:1 — AAA.
- Tap target: `sm` min-height aligns with `--btn-h-sm` (32px) — meets WCAG 2.5.8 AA (24px minimum).

## 7. Motion

- Icon swap: `opacity` fade + `transform: scale(0.85→1)` on entering icon; `--dur-fast` (180ms) `--easing`.
- Color transition (idle ↔ success): `color var(--dur-fast) ease`, `background-color var(--dur-fast) ease`.
- Press: `transform: translateY(1px)` at `--dur-press` (80ms).
- `@media (prefers-reduced-motion: reduce)`: the global clamp in `tokens.css` collapses all transition durations to 0.01ms. The JS timeout (revert after `timeout` ms) is unaffected — the state still reverts, just without the visual animation.

## 8. Anti-patterns

- **Not a primary CTA.** Never use CopyButton as the main action on a page. It is a secondary micro-affordance.
- **Not for copying rich content.** `value` is a plain string. Clipboard HTML, images, or multi-format writes are outside scope.
- **Not a Toast trigger.** CopyButton's own success state is the confirmation signal. If a consumer also needs a Toast, they wire it via `onCopy` — the DS does not couple the two.
- **Not for destructive or async actions.** The clipboard write is instant and reversible. Do not use CopyButton for submit, delete, or fetch-triggering patterns.
- **Not a substitute for a form field with a copy action.** An `<input readonly>` + CopyButton beside it is a valid composition; do not hide the value entirely and rely solely on the button.
- **Not icon-only without an accessible name.** Omitting `label` without supplying `aria-label` produces an inaccessible button.

## 9. Depends on

- `Button` — shares focus-ring contract, press-state motion, and size ladder conventions. CopyButton is not a variant of Button but inherits its interaction model.
- `Icon` (conceptually) — icon rendering comes from `lucide-react` peer dep, consistent with DS icon convention.
