# Design spec: Skeleton

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-20

---

## 1. Purpose

`<Skeleton>` is the canonical content placeholder for async data loads. It renders a rounded rectangle at a caller-specified size, filled with `--surface`, animated through a slow opacity pulse that signals "loading in progress" without drawing attention away from the surrounding chrome.

The problem it solves: every async surface in the system needs a load state. Without a shared primitive, individual surfaces implement their own rectangles — inconsistent corner radii, incompatible pulse durations, and ad-hoc reduced-motion handling. `Skeleton` centralises that contract in one place.

The component is purely decorative. It communicates nothing to the accessibility tree on its own; the consumer owns the loading region semantics.

---

## 2. Anatomy

- **Root element**: `<div>` (or `<span>` when `as="span"`). The entire component is a single element — no children, no inner structure. Its visual contract is entirely CSS: size, corner radius, background color, and animation.

---

## 3. Tokens used

| Token         | Value             | Role                                                                                            |
| ------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| `--surface`   | `#f5f5f7` (light) | Fill color — always the recessed surface tier, never `--bg` or `--bg-elevated`. No `tone` prop. |
| `--radius-1`  | `2px`             | Corner radius when `radius="sm"`                                                                |
| `--radius-2`  | `4px`             | Corner radius when `radius="md"` (default)                                                      |
| `--radius-3`  | `8px`             | Corner radius when `radius="lg"`                                                                |
| `--dur-pulse` | `1800ms`          | Pulse animation duration — the same meditative cadence as `StatusBadge`                         |

`50%` is applied directly (not via a token) when `radius="circle"`. It is a geometric instruction, not a design decision requiring a token.

**No new tokens are introduced by this component.**

---

## 4. Layout and rhythm

`Skeleton` is a display-replacement element. It occupies exactly the space specified by the caller via `width` and `height` props (or CSS applied via `className` / `style`). The component has no intrinsic size of its own — if neither `width` nor `height` is passed, the element renders at `display: block` and collapses. Consumers must provide explicit sizing.

`display: block` on the root by default. If `as="span"` is used (e.g. inline alongside text), `display: inline-block` is applied so width/height are respected.

There is no internal padding, gap, or margin. All spacing is the caller's responsibility.

---

## 5. States

| State          | Visual                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------- |
| Default        | `--surface` background, `border-radius` per `radius` prop, opacity pulse animation at `--dur-pulse` |
| Reduced-motion | Static, `opacity: 0.6`, no animation. Final state is immediately visible.                           |

No hover, focus, active, or disabled states. The component is not interactive and does not receive focus.

---

## 6. Motion

### Pulse keyframe

```css
@keyframes poukai-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
```

A symmetrical in-out fade. The skeleton breathes between full opacity and 0.4, creating a gentle, periodic signal that the content is pending. The cycle is 1800ms — the same `--dur-pulse` value that drives `StatusBadge`'s available-state ring. This is intentional: both tokens signal "live but calm," and using the same duration keeps the ambient rhythm consistent across surfaces.

**Animation declaration:**

```css
animation: poukai-skeleton-pulse var(--dur-pulse) ease-in-out infinite;
```

`ease-in-out` is used (not `--easing`) because `--easing` is an expo-out entrance curve designed for state transitions, not symmetrical ambient cycles. `ease-in-out` is built-in and produces the meditative, unhurried symmetry the pulse requires.

**Property animated:** `opacity` only. This is compositor-cheap — no layout reflow, no paint invalidation. The motion property contract in BACKLOG.md §Motion explicitly permits `opacity` for this purpose.

### What is prohibited

No gradient shimmer. No `background-position` animation. No moving gradients. No `background-size` animation. The banlist in BACKLOG.md §Motion reads: "Skeleton shimmer that's prettier than the loaded state." The opacity-only pulse is never prettier than the loaded state — it is a neutral, recessive signal.

### Reduced-motion override

Per the reduced-motion contract in BACKLOG.md §Motion, every animated component must declare its reduced-motion final state explicitly (the global `tokens.css` block collapses `animation-duration` to `0.01ms` but that alone does not set the correct resting `opacity`).

```css
@media (prefers-reduced-motion: reduce) {
  .root {
    animation: none;
    opacity: 0.6;
  }
}
```

`opacity: 0.6` is chosen as the static fallback: visually distinct from a loaded state (which has full opacity content) but not so faint as to be invisible or to read as disabled. This is a deliberate, explicit value — not the default `1.0` — because a skeleton at full opacity with no animation would be visually indistinguishable from loaded placeholder content on some surfaces.

---

## 7. Accessibility

- **`aria-hidden="true"` by default.** The skeleton is a decorative placeholder. It communicates nothing semantically — it has no text, no role, and no state the screen reader needs. `aria-hidden` prevents it from appearing in the accessibility tree as an empty or meaningless node.
- **Consumer responsibility for `aria-busy`.** The consumer wrapping a loading region must apply `aria-busy="true"` to the container while skeletons are visible. When content loads, `aria-busy="false"` (or removal of the attribute) signals completion. `Skeleton` does not manage this — it cannot know whether a region is partially or fully loaded.
- **No keyboard interaction.** The component is not focusable (`tabIndex` is not set, no `role` is applied).
- **Contrast.** `--surface` (`#f5f5f7`) on `--bg` (`#fbfbfd`) = approximately 1.07:1. This is intentionally low — the skeleton is a fill placeholder occupying content space, not a text element. WCAG 1.4.3 (minimum contrast) applies to text and images of text; a geometric placeholder is not in scope. The pulse animation further distinguishes it from static content at all contrast sensitivities.
- **Color independence.** The loading signal is communicated by motion (pulse) and by the absence of real content, not by color alone. Under reduced motion, the static `opacity: 0.6` provides a secondary signal. No information is conveyed by color alone.

---

## 8. Prop intent

- **`width`** (`string | number`, optional): Sets the rendered width. A bare number is interpreted as pixels (e.g. `120` → `120px`). A string is used verbatim (e.g. `"100%"`, `"12rem"`). If omitted, the element fills its block context (`display: block`).
- **`height`** (`string | number`, optional): Sets the rendered height. Same value semantics as `width`. If omitted, the element collapses (no intrinsic height) — callers must provide explicit height or the skeleton will be invisible.
- **`radius`** (`"sm" | "md" | "lg" | "circle"`, default `"md"`): Maps to the following corner-radius values:
  - `"sm"` → `var(--radius-1)` (2px) — for very small inline placeholders (tag chips, avatar initials, inline badges)
  - `"md"` → `var(--radius-2)` (4px) — default; matches card, button, and input corner radius
  - `"lg"` → `var(--radius-3)` (8px) — for larger card-level or image placeholders
  - `"circle"` → `border-radius: 50%` — for avatar or icon placeholders
- **`as`** (`"div" | "span"`, default `"div"`): Controls the root HTML element. A closed union — no arbitrary element names. `"span"` is provided for inline contexts (e.g. inside a `<p>` or `<label>` during text loading). When `as="span"`, `display: inline-block` applies so width/height are respected.
- **`className`** (string, optional): Merged onto the root element. Consumers may pass sizing classes here (e.g. Tailwind utility classes on the consuming site) as an alternative to `width`/`height` props.
- **`...rest`**: All remaining HTML attributes are forwarded to the root element. `aria-hidden="true"` is the default but can be overridden via `...rest` if a consumer has a specific reason to expose the element (e.g. a skeleton with a text equivalent — unusual but not forbidden).

**`tone` prop: not provided.** The background color is always `--surface`. There is no semantic distinction between skeleton tones. If a surface needs a different background, it must override via `className` or `style` — the design system does not define a vocabulary of skeleton tones.

---

## 9. Composition rules

**Replacing content during load.** The canonical usage is a `Skeleton` replacing each content element at the same dimensions, rendered in the parent component's load branch:

```jsx
// Loading state
<div aria-busy="true">
  <Skeleton width="100%" height={24} radius="sm" />
  <Skeleton width="60%" height={24} radius="sm" />
</div>

// Loaded state
<div>
  <h3>{title}</h3>
  <p>{body}</p>
</div>
```

**Avatar placeholder.** Use `radius="circle"` at the same dimensions as the `Avatar` component:

```jsx
<Skeleton width={40} height={40} radius="circle" />
```

**Card placeholder.** A `Skeleton` at `radius="lg"` replacing a `FeatureCard` or `LinkCard` during a grid load:

```jsx
<Skeleton width="100%" height={220} radius="lg" />
```

**Inline text placeholder.** Use `as="span"` with `radius="sm"` when a skeleton appears inside inline content:

```jsx
<p>
  Posted by <Skeleton as="span" width={80} height={14} radius="sm" />
</p>
```

**Grid of skeletons.** Render the same number of `Skeleton` instances as the expected loaded item count. This sets a spatial expectation for the user — they can see "three cards are coming" rather than a single undifferentiated placeholder.

**Nesting.** `Skeleton` has no children and must not be used as a wrapper. If a complex molecule needs a placeholder, compose multiple `Skeleton` instances positioned to approximate the molecule's layout.

---

## 10. Out of scope

- **Shimmer / sweep gradient animation.** Forbidden by the motion banlist. Opacity pulse only.
- **Themed color variants (`tone` prop).** Always `--surface`. No exceptions in this version.
- **Transition on mount/unmount.** The skeleton appears and disappears instantly (the fade-out on content load is the consumer's concern, not the skeleton's). A mount/unmount transition on `Skeleton` itself would require the consumer to manage the animation lifecycle — too much coupling.
- **Width/height defaults.** No default intrinsic size. Collapsed-to-zero is deliberate: silent failure (invisible skeleton) is easier to debug than a wrong-size rectangle that ships to production.
- **`as` open union.** `as` accepts only `"div"` and `"span"`. No `"li"`, `"td"`, `"article"`, etc. If the context demands a specific element, the consumer wraps.
- **`aria-label`.** Decorative placeholder — no label is needed. If a consumer needs to describe the loading region, they label the `aria-busy` container, not individual skeletons.

---

## Banlist reminder (for the engineer)

The motion banlist in `BACKLOG.md §Motion` explicitly prohibits:

> "Skeleton shimmer that's prettier than the loaded state."

This spec implements `opacity` pulse only. Do not implement a gradient shimmer, a sweep highlight, a `background-position` animation, or any moving gradient layer at any point. The pulse is the entire animation. Any PR that adds shimmer should be rejected at review.

---

## Hand-off note for poukai-ds-engineer

**What to build:**

Single file pair: `src/atoms/Skeleton/Skeleton.tsx` + `src/atoms/Skeleton/Skeleton.module.css`.

**CSS contract (translate this into the module):**

```css
/* Default */
.root {
  display: block;
  background-color: var(--surface);
  border-radius: var(--radius-2); /* md default */
  animation: poukai-skeleton-pulse var(--dur-pulse) ease-in-out infinite;
}

/* radius variants via data attribute */
.root[data-radius="sm"] {
  border-radius: var(--radius-1);
}
.root[data-radius="md"] {
  border-radius: var(--radius-2);
}
.root[data-radius="lg"] {
  border-radius: var(--radius-3);
}
.root[data-radius="circle"] {
  border-radius: 50%;
}

/* inline context */
.root[data-as="span"] {
  display: inline-block;
}

@keyframes poukai-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .root {
    animation: none;
    opacity: 0.6;
  }
}
```

**`width` and `height` props** should be applied as inline `style` (e.g. `style={{ width, height }}`), normalising bare numbers to `px`. Do not create CSS classes for arbitrary sizes.

**`aria-hidden="true"`** is the default. Forward `...rest` so it can be overridden.

**Exports:** add `Skeleton` to `src/atoms.ts` and the root `src/index.ts` barrel.

**Tests required (per reduced-motion contract in BACKLOG §Motion):**

- Assert default render: element present, `aria-hidden="true"`, correct `data-radius`.
- Assert each `radius` value maps to the correct CSS class / data attribute.
- Assert `as="span"` renders a `<span>`.
- Assert reduced-motion: under emulated `prefers-reduced-motion: reduce`, the element has `animation: none` and `opacity: 0.6` (static final state, not animated).
- Assert `aria-busy` is NOT set on the skeleton itself (it belongs on the consumer container).

**Story:** one story per `radius` variant, one demonstrating `as="span"` inline, one showing a composed card-shape placeholder (three stacked skeletons approximating a `FeatureCard`).
