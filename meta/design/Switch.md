# Design spec: Switch

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-22
**Implements**: `@radix-ui/react-switch`

---

## 1. Purpose

`<Switch>` is the canonical boolean-toggle primitive. It wraps `@radix-ui/react-switch` for accessible semantics and keyboard handling, then applies brand tokens via CSS Modules.

Use Switch when a setting has a persistent on/off state that takes effect immediately. Not for one-shot confirmations (use `<Button>`), not for single-item form selection (use `<Checkbox>`).

Primary use cases: settings panes, feature flag toggles, notification preferences, sticky "I agree" affordances.

---

## 2. Anatomy

- **Root** (`Switch.Root`): renders `<button role="switch">`. The track — the pill-shaped housing. Radix applies `data-state="checked" | "unchecked"` and `data-disabled` automatically.
- **Thumb** (`Switch.Thumb`): renders `<span>` inside Root. The circular knob. Positioned via `transform: translateX()` keyed to `[data-state]` on the Root.
- **Label** (not owned by Switch): external — `<label htmlFor={id}>` or `aria-label`.

---

## 3. Tokens used

No new tokens.

| Token        | Role                             |
| ------------ | -------------------------------- |
| `--surface`  | Track bg — unchecked             |
| `--hairline` | Track border — unchecked         |
| `--fg-muted` | Track border — hover (unchecked) |
| `--fg`       | Track bg — checked               |
| `--bg`       | Thumb fill (both states)         |
| `--dur-fast` | Transition duration              |
| `--easing`   | Transition easing                |
| `--accent`   | Focus-visible outline            |

> `--shadow-1` is not yet a token. The thumb uses an inline `box-shadow: 0 1px 3px rgb(0 0 0 / 0.18)` matching the soft-elevation intent.

---

## 4. Layout

```
Track: 32px × 18px, border-radius 999px, padding 0 2px
Thumb: 14px × 14px, border-radius 50%
Travel: translateX(0) → translateX(14px)
```

Travel = 32 − 14 − 2 − 2 = 14px. Thumb flush at both poles.

---

## 5. States

| State         | Track bg    | Track border | Thumb transform     |
| ------------- | ----------- | ------------ | ------------------- |
| Off           | `--surface` | `--hairline` | `translateX(0)`     |
| Off + hover   | `--surface` | `--fg-muted` | `translateX(0)`     |
| On            | `--fg`      | transparent  | `translateX(14px)`  |
| On + hover    | `--fg`      | transparent  | `translateX(14px)`  |
| Focus-visible | per state   | per state    | outline on track    |
| Disabled      | per state   | per state    | opacity 0.5 on root |

Border stays `transparent` (not removed) on the checked track — preserves box-model stability, no layout shift on toggle.

---

## 6. Motion

**Transform only.** Do not animate `left`, `right`, `margin`, or `width`.

```css
/* Track */
transition:
  background-color var(--dur-fast) var(--easing),
  border-color var(--dur-fast) var(--easing);

/* Thumb */
transition: transform var(--dur-fast) var(--easing);
```

Reduced motion: handled by global `tokens.css` block — clamps all `transition-duration` to `0.01ms`. No per-Switch override needed.

---

## 7. Accessibility

- `role="switch"` with `aria-checked` managed by Radix.
- `Space` toggles (ARIA spec requirement). `Enter` also fires via native `<button>` click semantics.
- Focus ring: `2px solid var(--accent)`, `outline-offset: 2px` on the track.
- Label always external. Unlabelled Switch = a11y violation.
- `disabled` attribute handled by native button. `opacity: 0.5` dims the root subtree visually.

---

## 8. Out of scope (v1)

- Size variants
- Label prop (label is compositional)
- Loading/pending state
- Color variants (green on-state)
- Indeterminate state (`role="switch"` has none)
