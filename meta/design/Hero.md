# Design spec: Hero

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-18
**Implements proposal**: GitHub issue #39

---

## 1. Purpose

Hero is the primary display moment on any page. It renders one editorial title (Instrument Serif), an optional eyebrow status slot, a lede paragraph, and a CTA slot. It is the single h1 instance allowed per page. Its role is to name the page and create an immediate register.

## 2. Anatomy

- **Status slot** — Accepts a StatusBadge or equivalent. Positioned above the title. Optional.
- **Title** — The h1. Instrument Serif, fluid display type. Italic em spans are supported and render in Instrument Serif Italic.
- **Lede** — Supporting paragraph rendered in --fg-muted. 1-3 sentences. Sits below the title.
- **CTA slot** — Accepts a Button or any interactive element. Sits below the lede.

The text column is capped at --hero-max (38rem / 608px) on all viewport widths.

## 3. Tokens used

- --fs-tagline — title font-size at size=display (default). 36-68px fluid.
- --fs-tagline-intimate — title font-size at size=intimate. 32-52px fluid. Added 2026-05-17.
- --font-serif — title font family (both size values).
- --fg — title color (both size values).
- --space-3 — status to title gap at size=intimate (12px). Added 2026-05-17.
- --space-4 — title to lede gap on mobile at size=intimate (16px). Added 2026-05-17.
- --space-6 — status to title gap at size=display (24px); also title to lede gap on md+ at size=intimate (24px).
- --space-8 — title to lede gap on mobile at size=display; also lede to CTA gap on mobile (both size values).
- --space-10 (fallback 2.5rem) — title to lede and lede to CTA gap on md+ at size=display; lede to CTA gap on md+ (both size values).
- --hero-max — maximum width of the text column (38rem / 608px). Never overridden with a wider value.
- --fs-body — lede font-size.
- --fg-muted — lede color.
- --easing — animation-timing-function for entrance animations (expo-out). Added 2026-05-18.
- --dur-slow — animation-duration for status, lede, and cta slots in entrance stagger (600ms). Added 2026-05-18.
- --dur-hero-title-rise — animation-duration for title slot in entrance stagger (700ms). Added 2026-05-18.
- --dur-stagger-step — base delay increment for entrance stagger sequences (150ms). Added 2026-05-18.

## 4. Layout and rhythm

**Vertical rhythm at size=display (default, unchanged):**

| Gap            | Mobile (<768px)     | Desktop (≥768px)             |
| -------------- | ------------------- | ---------------------------- |
| Status → Title | var(--space-6) 24px | var(--space-6) 24px          |
| Title → Lede   | var(--space-8) 32px | var(--space-10, 2.5rem) 40px |
| Lede → CTA     | var(--space-8) 32px | var(--space-10, 2.5rem) 40px |

**Vertical rhythm at size=intimate (updated 2026-05-17):**

| Gap            | Mobile (<768px)     | Desktop (≥768px)             |
| -------------- | ------------------- | ---------------------------- |
| Status → Title | var(--space-3) 12px | var(--space-3) 12px          |
| Title → Lede   | var(--space-4) 16px | var(--space-6) 24px          |
| Lede → CTA     | var(--space-8) 32px | var(--space-10, 2.5rem) 40px |

Rationale for the two-rung status→title shrink at intimate: the eyebrow does label work for a softened title. Label-to-thing relationships read at ≤25% of the thing's vertical mass. --space-3 (12px) lands at 23% of the intimate-max title height (12/52px). The optical correction overrode the mechanical one-rung pattern — confirmed in live audit with Arian, 2026-05-17.

The CTA gap is unchanged at intimate — live audit confirmed it reads correctly at that scale.

**Title typography (invariant across both size values):**

- font-family: var(--font-serif)
- font-weight: 400
- line-height: 1.15
- letter-spacing: -0.005em
- color: var(--fg)
- text-wrap: balance
- padding-bottom: 0.08em

**Title font-size — the only value that differs by size:**

- size=display (default): font-size: var(--fs-tagline) — clamp(2.25rem, 1.5rem + 3.5vw, 4.25rem) — 36-68px
- size=intimate: font-size: var(--fs-tagline-intimate) — clamp(2rem, 1.25rem + 2.5vw, 3.25rem) — 32-52px

## 5. States

Static. No interactive states on the container or title. Slots delegate to their slotted components.

## 6. Motion

### Default (entrance={undefined})

No animation. Static component. Motion owned by slotted components. All existing consumers are unaffected.

### entrance="stagger"

A CSS-only, JS-free staggered reveal on page load. Four slots animate in sequence: status, title, lede, cta. Each slot rises from a slight vertical offset while fading in from opacity 0.

**Keyframe definitions (defined in Hero.module.css):**

```css
@keyframes rise-8 {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes rise-12 {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

The 8px and 12px translation values are visual-motion micro-distances, not layout tokens. They live inside the keyframe definitions and are not exposed as tokens. The title uses rise-12 (12px) because it is the largest and heaviest element; the extra 4px of rise gives it the lift its scale earns. All other slots use rise-8 (8px).

**Per-slot animation values:**

| Slot   | Keyframe | Duration                           | Delay                                      | Rise |
| ------ | -------- | ---------------------------------- | ------------------------------------------ | ---- |
| status | rise-8   | var(--dur-slow) — 600ms            | 0ms                                        | 8px  |
| title  | rise-12  | var(--dur-hero-title-rise) — 700ms | calc(var(--dur-stagger-step) \* 1) — 150ms | 12px |
| lede   | rise-8   | var(--dur-slow) — 600ms            | calc(var(--dur-stagger-step) \* 2) — 300ms | 8px  |
| cta    | rise-8   | var(--dur-slow) — 600ms            | calc(var(--dur-stagger-step) \* 3) — 450ms | 8px  |

**All slots share:**

- animation-timing-function: var(--easing) — expo-out curve, semantically correct for entrances
- animation-fill-mode: both — required. Ensures slots start at opacity:0 during their delay window and hold at opacity:1 after the animation ends. Without fill-mode:both, slots flash to their natural visible state before animating.

**No JS. No IntersectionObserver. No hooks.** The animation fires once on page load via CSS @keyframes attached to the `.entrance-stagger` modifier class and its slot children.

### Reduced-motion handling

`tokens.css` already suppresses `animation-duration` to 0.01ms globally under `prefers-reduced-motion: reduce`. However, this does NOT suppress `animation-delay` or `animation-fill-mode`. With `fill-mode: both` active and a 450ms delay, the cta slot would remain at `opacity: 0` for 450ms before snapping visible — a severe UX failure for reduced-motion users.

**The engineer must add an explicit override in Hero.module.css:**

```css
@media (prefers-reduced-motion: reduce) {
  .entrance-stagger .status,
  .entrance-stagger .title,
  .entrance-stagger .lede,
  .entrance-stagger .cta {
    animation: none;
  }
}
```

`animation: none` is the only reliable way to clear `animation-delay` and `animation-fill-mode` simultaneously — `animation-duration: 0.01ms` from the global token block is insufficient here.

## 7. Accessibility

- Title renders as h1. One per page.
- em spans inside title are semantically correct; no aria-label workaround needed.
- Contrast: --fg on --bg = 16.29:1 (AAA). Both size values pass — 32px = 24pt, above WCAG large-text threshold.
- size is a visual change only. Heading semantics, tab-order, and ARIA are unchanged.
- entrance="stagger" is a visual enhancement only. No ARIA additions are needed — the content is in the DOM from the first paint; only its visibility is deferred. Screen readers receive the content immediately regardless of animation state.
- Reduced-motion: the component CSS module must apply `animation: none` to all slot children of `.entrance-stagger` under `prefers-reduced-motion: reduce` (see §6). The global `animation-duration: 0.01ms !important` from tokens.css is insufficient because it does not clear `animation-delay` or `animation-fill-mode: both`, leaving delayed slots hidden for up to 450ms.

## 8. Prop intent

- Consumers must be able to choose between display (default, var(--fs-tagline), 36-68px) and intimate (var(--fs-tagline-intimate), 32-52px) title registers.
- The size prop governs title font-size and the status→title and title→lede vertical gaps. The lede→CTA gap, lede font-size, em accent, color, and font family are invariant across size values.
- The size prop is opt-in; every existing consumer without the prop gets display unchanged.
- Consumers must be able to pass status, title (including em spans), lede, and CTA slots.
- Consumers must be able to choose align=start (default) or align=center.
- Consumers must be able to opt into a staggered entrance animation by passing entrance="stagger". The default (entrance={undefined}) preserves current static behavior with no animation — zero regression for existing consumers.
- The entrance prop is independent of size and align. All three are orthogonal axes.

## 9. Composition rules

- One Hero per page. Never nest Hero inside another Hero.
- Status slot accepts StatusBadge or equivalent only.
- When size=intimate, the Hero is still the sole h1. Smaller type is a register choice, not a document-outline demotion.

## 10. Out of scope

- Dark-mode token overrides (tokens resolve correctly when dark-mode overrides land in tokens.css).
- More than two size values (YAGNI; add on demand).
- Background or surface variants (Hero always sits on --bg).
- Responsive align switching.
- Note: "Animated title entrance" was listed as out of scope in the original spec. This restriction was lifted in revision 2026-05-18 (GitHub issue #47). The entrance="stagger" variant is now in scope and fully specified in §6 above.
- Note: the original #39 spec locked vertical rhythm as invariant across both size values. That lock was explicitly reversed after a live audit with Arian on 2026-05-17 (GitHub issue #44). The status→title and title→lede gaps now scale with size as documented in Section 4.
