# Design spec: StatusBadge

**Atomic layer**: atom
**Status**: Shipped in v0.1.0
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Status

Shipped in v0.1.0. Pulse animation fixed in v0.3.2 (pulse was invisible prior to that release). `--dur-pulse` token added and StatusBadge migrated to consume it in v0.16.0 (consistency audit). Test coverage backfilled in v0.16.0.

---

## 2. Purpose & non-goals

`<StatusBadge>` is the canonical availability-state indicator for pouk.ai surfaces. It pairs a colored dot with a short text caption to communicate whether the operator is currently taking engagements. It originates from the holding-page hero pattern and is the single source of truth for that visual idiom across all surfaces.

Three states are defined: `available` (blue pulsing dot — open for work), `idle` (muted gray dot — reviewing scope, not immediately available), and `closed` (near-black dot — booked out).

**Why a separate atom and not a plain `<p>` with inline styles.** The pulse animation (`poukai-pulse` keyframe, `--dur-pulse` duration, `--accent-glow` color) requires coordinated CSS that would be duplicated on every surface if not extracted. The dot size (8px), the 2px halo (`box-shadow: 0 0 0 2px var(--accent-glow)`), the `aria-hidden` on the dot, and the reduced-motion suppression are brand-level decisions that belong in one place.

**Non-goals:**

- StatusBadge is not a chip or tag — it does not convey category or type metadata. Use `<Tag>` for that.
- StatusBadge is not a notification dot (unread count, alert indicator). It conveys operator availability, not system events.
- StatusBadge is not interactive. It has no click handler, no `href`, no `role="button"`. It is a display element.
- StatusBadge does not own its label text. The caller passes `children` — any caption string is valid. The component enforces no vocabulary.
- StatusBadge does not handle loading or unknown states. The three defined statuses are exhaustive for the current product.

---

## 3. Anatomy

- **Root element**: `<p>` — `display: inline-flex; align-items: center; gap: var(--space-3)`. A `<p>` because the badge is always a short piece of prose — a sentence fragment describing availability status. Using `<p>` is semantically more honest than `<span>` (which implies inline phrasing content that can be embedded mid-sentence) or `<div>` (which is a block container). In practice, the badge appears as a standalone line in the Hero slot.
- **Dot container**: `<span className={styles.dot} data-status={status} aria-hidden="true">` — 8px × 8px circle, `border-radius: 50%`, `flex-shrink: 0`. The `data-status` attribute drives the CSS color rules (via attribute selectors) rather than a class-per-status approach. This keeps the status logic in CSS and avoids a classname lookup table in JS for a purely visual concern. `aria-hidden="true"` — the dot is decorative; the adjacent text label is the accessible content.
- **Pulse ring** (available only): `<span className={styles.pulse} />` — a child of the dot container, rendered only when `status === "available"`. It is `position: absolute; inset: 0; border-radius: 50%; background: var(--accent-glow)`, animated via `poukai-pulse`. At scale(1) opacity 0.7 → scale(4) opacity 0 — a slow, meditative bloom that signals "live." Suppressed entirely under `prefers-reduced-motion: reduce` (the `animation` property is set to `none` in the media query block).
- **Static halo** (available only): `box-shadow: 0 0 0 2px var(--accent-glow)` on the dot container — present even between pulses so the badge reads as "lit" throughout. This is a separate visual cue from the animated ring; it is always visible when `status="available"`.
- **Label**: `<span>{children}</span>` — plain sans-serif text in `--fs-meta` / `--fg` / `--font-sans`. No transformation, no color override. The children span has no class; it inherits the root's `font-family`, `font-size`, and `color`.

---

## 4. Props API

```tsx
type StatusBadgeStatus = "available" | "idle" | "closed";

interface StatusBadgeProps extends ComponentPropsWithoutRef<"p"> {
  status?: StatusBadgeStatus; // default "available"
  children: ReactNode; // the caption text
}
```

**`status`** (`"available" | "idle" | "closed"`, default `"available"`): Controls the dot color, the halo, and whether the pulse ring is rendered. The default is `"available"` — on the holding page, the badge almost always communicates openness; this is the primary use case. The three values are a closed enum: the component does not accept arbitrary status strings.

- `"available"` — dot: `var(--accent)` (blue), halo: `box-shadow: 0 0 0 2px var(--accent-glow)`, pulse ring: rendered and animating.
- `"idle"` — dot: `var(--fg-muted)` (gray), no halo, no pulse ring.
- `"closed"` — dot: `var(--fg)` (near-black), no halo, no pulse ring.

**`children`** (ReactNode, required in practice): The caption text rendered beside the dot. Idiomatic usage is a plain string: `"Taking conversations for Q3."` The component does not enforce a maximum length, but long captions will wrap — the root is `inline-flex` which wraps naturally. Callers are responsible for keeping captions concise.

**Standard HTML spread** (`ComponentPropsWithoutRef<"p">`): `id`, `data-*`, `className`, `style`, event handlers forwarded to the root `<p>`. `className` merges via `clsx`.

---

## 5. Token contract

| Token           | Value                     | Role                                                                   |
| --------------- | ------------------------- | ---------------------------------------------------------------------- |
| `--font-sans`   | Geist stack               | Root font-family (inherited by label span)                             |
| `--fs-meta`     | `0.875rem` (14px)         | Root font-size — badge text in the meta/caption register               |
| `--fg`          | `#1D1D1F`                 | Root text color (label); also `closed` dot color                       |
| `--fg-muted`    | `#6E6E73`                 | `idle` dot color                                                       |
| `--accent`      | `#0071E3`                 | `available` dot background                                             |
| `--accent-glow` | `rgba(0, 113, 227, 0.18)` | `available` dot halo (`box-shadow`) and pulse ring background          |
| `--dur-pulse`   | `1800ms`                  | Pulse animation duration — intentionally slow and meditative           |
| `--space-3`     | `0.75rem` (12px)          | Gap between dot and label text                                         |

**`--dur-pulse` rationale.** 1800ms is deliberately slower than any other motion token in the system (`--dur-slow` is 600ms). The pulse is not a UI response to user action — it is an ambient signal, a heartbeat. A fast pulse would read as urgency or alerting. The slow, meditative cycle communicates "live but calm." This is a brand-level decision documented in `tokens.css`.

**Dot dimensions (8px) are not tokenized.** The BACKLOG notes a follow-up to tokenize this value (or reference `--btn-h-md`). As shipped, `width: 8px; height: 8px` are inline values in `StatusBadge.module.css`.

---

## 6. States & motion

### Status states (visual)

| Status      | Dot color     | Halo                              | Pulse ring |
| ----------- | ------------- | --------------------------------- | ---------- |
| `available` | `--accent`    | `0 0 0 2px var(--accent-glow)`   | Animated   |
| `idle`      | `--fg-muted`  | None                              | None       |
| `closed`    | `--fg`        | None                              | None       |

### Pulse animation

```css
@keyframes poukai-pulse {
  0%   { transform: scale(1);  opacity: 0.7; }
  70%  {                        opacity: 0;   }
  100% { transform: scale(4);  opacity: 0;   }
}
```

The ring expands from 8px (scale 1) to 32px (scale 4) over 1800ms, fading from 0.7 to 0 opacity. Iteration: `infinite`. Easing: `ease-out`. The ring is positioned `inset: 0` relative to the dot container — it starts at the same size as the dot and grows outward.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .pulse {
    animation: none;
  }
}
```

The pulse ring element is still rendered in the DOM when `status="available"` under reduced motion, but its animation is suppressed — `animation: none` removes both the keyframe and any transform. The static halo (`box-shadow`) on the dot container remains visible, so the `available` state is still visually distinct from `idle` and `closed` without motion.

### Interactive states

None. StatusBadge is not interactive.

---

## 7. Responsive behavior

StatusBadge has no responsive behavior. It is an `inline-flex` element that fits its content at all viewport widths. The `--fs-meta` (14px) fixed size does not scale with the viewport — it is always 14px, the minimum readable size for a non-large text element.

If the badge appears inside a `<Hero>` or `<Section>` that has responsive padding adjustments, those adjustments are on the container, not on StatusBadge.

---

## 8. A11y

- Root element is `<p>` — a phrasing-content landmark. No additional ARIA role is needed.
- The dot container has `aria-hidden="true"` — it is decorative. The color information (available/idle/closed) is not communicated by color alone: the children text label carries the semantic content. A screen reader hears only the label text, e.g. `"Taking conversations for Q3."` — no color, no dot description. This satisfies WCAG 1.4.1 (use of color).
- The pulse ring `<span>` is inside the `aria-hidden` dot container — it is also hidden from the accessibility tree.
- Contrast: label text is `--fg` (`#1D1D1F`) on `--bg` (`#FBFBFD`) = **16.29:1** (AAA). `--fs-meta` (14px) is normal text — the applicable threshold is 4.5:1. Passes with significant margin.
- No keyboard interaction. The component is not focusable.

---

## 9. Worked examples

### (a) Available — primary use case (holding page hero)

```jsx
import { StatusBadge } from "@poukai-inc/ui";

<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>
```

Renders a blue pulsing dot + label. Default `status="available"` — the prop can be omitted.

### (b) Idle state

```jsx
<StatusBadge status="idle">Reviewing scope — next intake in two weeks.</StatusBadge>
```

Muted gray dot, no pulse, no halo.

### (c) Closed state

```jsx
<StatusBadge status="closed">Booked through end of year.</StatusBadge>
```

Near-black dot, no pulse, no halo. The dark dot on a light background reads as "off" — visually distinct from both active states.

### (d) Inside a Hero slot

```jsx
import { Hero, StatusBadge } from "@poukai-inc/ui";

<Hero
  status={<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>}
  title="Technical consulting for teams shipping with AI."
  lede="We work alongside founders and platform teams to close the gap between pilot and production."
  cta={<Button asChild><a href="mailto:hello@pouk.ai">hello@pouk.ai</a></Button>}
/>
```

The `Hero` component accepts any `ReactNode` in its `status` slot. `StatusBadge` is the canonical occupant of that slot.

---

## 10. Open questions

None. The component is stable. The BACKLOG item to tokenize the 8px dot dimension and the 44px RoleCard icon box together is a hygiene follow-up — it does not affect the shipped API or visual output.
