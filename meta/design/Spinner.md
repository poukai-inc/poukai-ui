# Design spec: Spinner

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-20

---

## 1. Purpose

`<Spinner>` is the indeterminate loading affordance for `@poukai-inc/ui`. It signals that an async operation is in progress when the duration is unknown — Button `loading` state, async form submission, deferred data fetches. It is a semantic signal, not decoration: motion doctrine rule 1 ("no motion without semantic meaning") is fully satisfied because the rotation _is_ the meaning. The rotation communicates "active and in progress" in a way that a static glyph cannot.

`<Spinner>` renders an inline SVG arc — a partially-filled circle that rotates continuously. `currentColor` inheritance means it adapts to any surface without a separate color prop. It is never used on an interaction that resolves faster than ~300ms; see §9 for the usage rule.

## 2. Anatomy

- **Root container**: `<span>` — `display: inline-flex; align-items: center; justify-content: center`. Carries `role="status"`, `aria-live="polite"`, and `aria-label`. The span is the a11y container; the SVG inside it is presentational.
- **SVG**: Inline SVG, `viewBox="0 0 24 24"`, dimensions driven by the `size` prop. No `fill`; stroke only. `aria-hidden="true"` — the SVG is decorative; the container carries all a11y attributes.
- **Track arc**: A full `<circle>` at reduced opacity (approx. `0.2`) — the static ring that gives the spinner its circular frame. Rendered in `currentColor`. Provides visual grounding so the rotating arc reads as "in motion on a track" rather than floating.
- **Rotating arc**: A `<circle>` with `stroke-dasharray` set to approximately 75% of the circumference and `stroke-dashoffset` trimming it to a partial arc (roughly 270° of 360°). The SVG group wrapping this arc receives the rotation animation. Rendered in `currentColor`, full opacity.
- **Visually hidden text**: A `<span>` using the VisuallyHidden pattern (position absolute, 1px × 1px, overflow hidden, clip) rendered as a sibling to the SVG inside the root container. Contains the `label` prop value (default `"Loading"`). This is a belt-and-suspenders measure alongside `aria-label` on the root — it ensures the text is also announced in screen reader virtual browse mode, not just in live region mode.

## 3. Tokens used

All existing tokens. One new token introduced by this spec.

| Token           | Value    | Role                                                                                      |
| --------------- | -------- | ----------------------------------------------------------------------------------------- |
| `--dur-spinner` | `800ms`  | **New.** Full-rotation period. Sub-second so the spinner reads as active, not stalled.    |
| `--easing`      | expo-out | Not used for the rotation (see §6 — rotation uses `linear`). Referenced for context only. |

**Color:** `currentColor` throughout — no color token consumed directly by the component. The spinner inherits foreground color from its parent, so it adapts across Button variants, form fields, and any other surface without a color prop.

**Size:** dimension values are not tokenized. The three sizes (16/20/24px) are expressed as inline values inside the component, following the convention established for StatusBadge's 8px dot. The Icon size scale is the reference: 16px maps to the `sm` icon register, 20px to `md`, 24px to `lg`.

**New token added to `src/tokens/tokens.css`:**

```css
--dur-spinner: 800ms;
```

Rationale in `meta/brand.md` § Decision history → 2026-05-20 (Spinner).

## 4. Layout & rhythm

| Size | SVG dimension | Stroke width | Track opacity | Arc coverage |
| ---- | ------------- | ------------ | ------------- | ------------ |
| `sm` | 16 × 16px     | 2px          | 0.2           | ~270° (75%)  |
| `md` | 20 × 20px     | 2px          | 0.2           | ~270° (75%)  |
| `lg` | 24 × 24px     | 2px          | 0.2           | ~270° (75%)  |

The default size is `md` (20px). This matches the `md` Button's icon guidance (18px recommended, 20px is the next clean step and aligns with the `--btn-h-md` visual weight).

**Stroke width is 2px at all sizes.** A thinner stroke (1px) disappears at 16px on non-retina screens. A thicker stroke (3px) reads as heavy against the text weight in a Button label. 2px is the same hairline weight used for focus rings and dividers throughout the system — the spinner visually belongs to that line-weight family.

**Arc coverage ~270°.** The gap (90°) is large enough to read as a gap (not a rendering artifact), small enough that the spinner reads as a nearly-complete ring rather than a C-shape. This is the conventional loading arc form; deviation from it without a reason would make the component harder to recognize as a loading indicator.

**Centering:** the root `<span>` is `inline-flex` with centered axes. When placed inside a `<Button>`, the button's existing `inline-flex` / `align-items: center` / `gap: var(--space-2)` handles placement. The spinner does not manage its own margin; spacing between spinner and label text is the button's gap.

## 5. States

The Spinner has no interactive states. It is a display-only element.

| Condition            | Behavior                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Default (visible)    | Continuous rotation at `--dur-spinner` (800ms per revolution), linear easing, infinite.           |
| Reduced-motion       | Static arc — see §6. The track + arc are still rendered; only animation is suppressed.            |
| Hidden (not mounted) | The component is not rendered. Callers conditionally mount it; it has no hidden/shown state prop. |

The Spinner does not have a `disabled` state — it is either mounted (animating or static under reduced-motion) or not mounted.

## 6. Motion

### Default animation

```css
@keyframes poukai-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

Applied to the SVG element (or a wrapping `<g>` if the engineer structures the SVG with a group):

```
animation: poukai-spin var(--dur-spinner) linear infinite;
transform-origin: center center;
```

**Why linear easing, not `--easing` (expo-out).** The expo-out curve is the entrance easing — deceleration into a resting position. A spinner does not arrive; it loops. Applying expo-out to a continuous loop produces a visually irregular rhythm: each revolution starts fast then stalls. Linear easing produces a smooth, even rotation that reads as "constant activity." No other easing is appropriate for a continuous loop.

**Why `--dur-spinner: 800ms`.** 800ms sits below 1000ms — users read sub-second rotation as "actively working." At 1000ms and above the spinner starts to feel like it has stalled between steps. At 500ms and below it feels urgent or agitated. 800ms is the settled, operator-grade register: active without reading as alarmed. This is a different semantic register than `--dur-pulse` (1800ms, meditative ambient heartbeat) — the spinner communicates active process, not ambient presence.

**Transform property only.** The rotation uses `transform: rotate()`. It never animates `width`, `height`, `stroke-dashoffset`, or any layout property. This satisfies the motion property contract from BACKLOG §Motion: `transform` and `opacity` are the only composited properties; animating them avoids layout recalculation.

### Reduced-motion fallback

The global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` line 317 collapses `animation-duration` to `0.01ms` and `animation-iteration-count` to `1` via `!important`. This effectively freezes the spinner at its initial rotation position — the arc is still rendered, the track is still rendered, but the rotation stops.

**This global collapse is not sufficient on its own.** The concern is that `animation-iteration-count: 1` with `0.01ms` duration means the spinner completes one "rotation" nearly instantly and stops at the `to` keyframe (360°, visually identical to 0°). The resulting static arc is a partially-filled circle — it does communicate "something is in progress" at a glance, but it is ambiguous: it could be read as a progress indicator at a fixed percentage rather than an indeterminate spinner.

**Recommended explicit fallback (implement this).** In the component's CSS module, add:

```css
@media (prefers-reduced-motion: reduce) {
  .arc {
    animation: none;
  }
}
```

And render a supplementary non-animated affordance — a static three-dot string — as a visually-hidden-adjacent sibling that is revealed only under reduced-motion:

```
[visually hidden under normal motion]  →  "…"  (shown under reduced-motion, inline, same currentColor)
```

The three-dot string (`…` — a single Unicode HORIZONTAL ELLIPSIS character, not three periods) sits next to the static arc. Under reduced-motion the user sees: static arc + "…". The ellipsis is a universally-recognized shorthand for "in progress / pending" without requiring motion. It does not replace the arc (which carries the semantic affordance for sighted users), it augments it.

**Implementation note for the engineer:** the ellipsis `<span>` should use `aria-hidden="true"` — the a11y contract is already handled by `role="status"` + `aria-live="polite"` + `aria-label` on the root container. Do not add a second announced string.

**Alternative considered and rejected: swap spinner for a static dot triplet under reduced-motion.** A rendered-in-JS swap (e.g. show `<span>···</span>` instead of the SVG) was considered. Rejected because: (a) it requires conditional rendering logic in the component for a purely visual concern, (b) it changes the DOM structure between motion preferences, which can cause layout shifts inside a `<Button>`, (c) the CSS-only approach (static arc + `…` reveal) achieves the same perceptual result with zero JS branching.

## 7. Accessibility

- **Root element**: `<span>` with `role="status"` and `aria-live="polite"`. `role="status"` is an implicit live region (polite); `aria-live="polite"` is set explicitly as a belt-and-suspenders measure for screen readers that do not fully implement the role's implicit live behavior.
- **`aria-label`**: set from the `label` prop, default `"Loading"`. Callers should override when the context provides a more specific label: `"Submitting form"`, `"Loading results"`. The default `"Loading"` is acceptable for general use; a context-specific label is preferable.
- **SVG**: `aria-hidden="true"`. The SVG is presentational; the container carries all a11y semantics. No `<title>` or `<desc>` inside the SVG — these would be redundant with the container's `aria-label` and some screen readers announce both.
- **Visually hidden text**: see §2. Ensures the label text is reachable in virtual browse mode. Uses the standard visually-hidden CSS pattern (not `display: none` or `visibility: hidden`, which suppress from the a11y tree).
- **Color contrast**: the spinner inherits `currentColor`. In a `primary` Button (white text on `--fg` background), the spinner is white — contrast ≥ 16:1 against `--fg`. In a `secondary` or `ghost` Button, the spinner is `--fg` on `--bg` or `--surface` — contrast ≥ 15:1. All pairings pass AAA. The track arc at 0.2 opacity is decorative (not text, not a meaningful UI element on its own) — WCAG 1.4.11 non-text contrast does not apply to it directly; the rotating arc at full opacity is the functional element and it passes.
- **Keyboard**: not focusable. The Spinner is a status indicator, not an interactive element.
- **WCAG 2.5.8 / 2.5.5 tap target**: not applicable — the Spinner has no interactive target.

## 8. Prop intent

- Consumers must be able to choose a size from three options aligned to the icon scale: `sm` (16px), `md` (20px), `lg` (24px). Default is `md`.
- Consumers must be able to override the accessible label string (default `"Loading"`) to provide context-specific announcement text (e.g. `"Submitting"`, `"Loading search results"`).
- Consumers must be able to pass `className` for layout-level overrides (margin, alignment adjustments in unusual contexts). The component does not enforce its own margin.
- Consumers must be able to spread additional HTML attributes onto the root `<span>` (e.g. `data-testid`, `id`) via rest props.
- The component does not accept a `color` prop. Color is always `currentColor` — the caller controls color by controlling the text color of the parent element.
- The component does not accept a `speed` or `duration` prop. The duration is governed by `--dur-spinner`. Callers who need a different speed override the token via a scoped CSS custom property on a parent element — they do not reach into the component.

The engineer translates these intents into TypeScript prop types.

## 9. Composition rules

**Inside `<Button loading>`.**
The canonical use case. When a Button enters its loading state, the engineer replaces or supplements the button label with `<Spinner size` matched to the button size tier:

| Button size | Spinner size |
| ----------- | ------------ |
| `sm`        | `sm` (16px)  |
| `compact`   | `sm` (16px)  |
| `md`        | `md` (20px)  |
| `lg`        | `md` (20px)  |

The `lg` Button uses a `md` (20px) spinner rather than `lg` (24px) because at 24px the spinner competes visually with the button's text register. 20px reads as "inside the button" while 24px reads as "the same scale as the button." The `sm` and `compact` sizes share the `sm` spinner for the same reason — 20px would overwhelm a 32px or 40px button.

The Button spec (§10) deferred `loading` state as out-of-scope. This Spinner spec does not add a `loading` prop to Button — that remains a separate spec when Button loading state is formally specified. This spec defines only the Spinner atom.

**Inside async forms.**
A `<Spinner>` can be placed adjacent to a submit button (or inside it) during form submission. The `label` prop should be set to `"Submitting"` or the specific action name for the form.

**Standalone (deferred data).**
A `<Spinner>` can appear in a content area while data loads — centered in a card, inside a list slot, inline in a sentence. In this context, `size="md"` is the default. Do not use `size="lg"` inline in body text — 24px breaks text flow.

**Usage rule — do not decorate instant interactions.**
From BACKLOG §Motion banlist: _"Loading spinners as decoration on otherwise-instant interactions."_ This is a hard usage rule for every consumer of this component. If an interaction resolves in under ~300ms under normal network conditions, do not show the Spinner — it will flash and disappear, which reads as a glitch rather than feedback. Reserve the Spinner for genuinely async operations: network requests, file processing, AI generation, deferred data fetches. Instant interactions (local state toggles, menu opens, navigation between already-loaded views) must never trigger a Spinner.

**Never use `<Spinner>` as ambient decoration** (e.g. a permanently-spinning logo element, a "loading" screen that exists purely for brand pacing). The motion doctrine bans ambient motion that has no semantic meaning attached to a real operation.

## 10. Out of scope

- **Determinate progress.** A Spinner is indeterminate by definition. If the percentage of completion is known, use `<ProgressBar>` (BACKLOG item, not yet specified).
- **Color variants.** `currentColor` inheritance handles all color needs. No `color` prop, no `variant` prop.
- **Size below 16px.** At 12px the 2px stroke width consumes too much of the circle area and the arc becomes illegible. No `xs` size.
- **Size above 24px.** The three sizes cover inline-in-button, inline-in-text, and standalone-in-card. Larger spinners (page-level full-screen loading) are an organism-level concern, not this atom.
- **`Button loading` prop.** The Button loading state API is deferred. This spec defines the Spinner atom only; the integration with Button is specified separately.
- **Skeleton.** Related but distinct — `<Skeleton>` is a placeholder for known-shape content (BACKLOG item). Use `<Skeleton>` for layout placeholders; use `<Spinner>` for process feedback.
- **SVG path animation / morphing.** Rotation only. Animating the `stroke-dashoffset` to simulate a "growing and shrinking" arc (the iOS-style elastic spinner) is not in scope — it would require animating a layout property and introduces the elastic/spring register, which is not part of this brand's motion vocabulary.

---

## Hand-off note for poukai-ds-engineer

**New token to add to `src/tokens/tokens.css`** (inside the `/* Motion */` block, after `--dur-pulse`):

```css
--dur-spinner: 800ms; /* Spinner rotation period — sub-second so the spinner reads as active, not stalled */
```

This token is already added to `src/tokens/tokens.css` by this design change. Verify it is present before wiring the component.

**Component location:** `src/atoms/Spinner/` — consistent with the atoms layer convention.

**SVG geometry hint (non-binding).** For a 24px viewBox, `r = 10`, `cx = cy = 12`, `strokeWidth = 2`. `circumference = 2π × 10 ≈ 62.83`. Arc dasharray `≈ 47.12` (75% of circumference) with `dashoffset = 0` gives the ~270° arc. Scale `r` proportionally for 16px and 20px viewBoxes, or keep a single `viewBox="0 0 24 24"` with the SVG element scaled via `width`/`height` attributes — either approach is valid; the engineer decides.

**Keyframe name:** `poukai-spin` — consistent with the `poukai-` prefix convention established by `poukai-pulse` in StatusBadge.

**Reduced-motion:** implement the explicit `animation: none` + `…` ellipsis reveal described in §6. Do not rely solely on the global tokens.css collapse.

**`loading` prop on Button:** not in scope for this ticket. The Spinner atom ships standalone. Button loading state is a separate spec.

**Export:** add `Spinner` to `src/index.ts` exports alongside other atoms.
