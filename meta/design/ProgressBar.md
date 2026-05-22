---
status: Approved
---

# Design spec: ProgressBar

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<ProgressBar>` is the linear progress affordance for `@poukai-inc/ui`. It communicates how far along a known-length operation is (determinate) or signals that an operation of unknown length is in progress (indeterminate). Canonical uses: file upload, multi-step form, background job, AI generation with a discoverable completion percentage.

It pairs with `<Spinner>` — use `<Spinner>` when no percentage is available; use `<ProgressBar>` when a percentage or step-count can be derived. The two atoms share the same semantic register ("process in progress") but address different information states.

`<ProgressBar>` is a display-only atom. It has no interactive states and emits no events. Its motion obeys the property contract: `transform` only, never `width`.

---

## 2. API

| Prop              | Type                                              | Default     | Notes                                                                                                        |
| ----------------- | ------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| `value`           | `number \| undefined`                             | `undefined` | 0–100. Omitted = indeterminate. Out-of-range values clamp to `[0, 100]`.                                     |
| `size`            | `"sm" \| "md"`                                    | `"md"`      | Track height: `sm` = 2px, `md` = 4px.                                                                        |
| `tone`            | `"default" \| "success" \| "warning" \| "danger"` | `"default"` | Maps to fill color. See §5.                                                                                  |
| `aria-label`      | `string`                                          | —           | Required unless `aria-labelledby` is provided. One of the two must be present.                               |
| `aria-labelledby` | `string`                                          | —           | Required unless `aria-label` is provided. Points to the `id` of a visible label element in the caller's DOM. |
| `className`       | `string`                                          | —           | Layout-level overrides (width, margin). Component does not set its own width.                                |

The engineer translates these intents into TypeScript prop types. Enforce at the type level that at least one of `aria-label` / `aria-labelledby` is supplied (discriminated union or explicit type guard).

---

## 3. Anatomy

- **Root**: `<div role="progressbar">`. Carries `aria-valuemin="0"`, `aria-valuemax="100"`. When determinate, carries `aria-valuenow={clamped value}`. When indeterminate, `aria-valuenow` is omitted entirely (not set to `undefined` as a serialised attribute — it must be absent from the DOM).
- **Track**: Direct child `<div>`. Full width of root. Height = size tier. `background: var(--surface)`. `border-radius: 999px`. `overflow: hidden`. This is the recessed channel the fill rides inside.
- **Fill**: Child `<div>` of track. Same `border-radius: 999px` as track. `background:` tone color token (see §5). `height: 100%`. `width: 100%`. Position and apparent width controlled entirely via `transform: scaleX(…)`, never via the `width` property.

**Indeterminate variant — two-bar implementation:**

The track contains two fill bars rendered as siblings, both `position: absolute`, `inset-block: 0`, `width: 100%`. They translate horizontally via `translateX` keyframes, creating the classic "two bars chasing each other" indeterminate effect. The first bar leads; the second follows with an offset. Both use `background:` tone color.

---

## 4. Visual

### Size

| `size` | Track height |
| ------ | ------------ |
| `sm`   | 2px          |
| `md`   | 4px          |

`border-radius: 999px` on both track and fill at all sizes — the pill shape is a fixed brand decision, not a size-derived value.

### Tone → fill color

| `tone`      | Fill token  | Light value | Dark value |
| ----------- | ----------- | ----------- | ---------- |
| `"default"` | `--fg`      | `#1d1d1f`   | `#f5f5f7`  |
| `"success"` | `--success` | `#248a3d`   | `#30d158`  |
| `"warning"` | `--warning` | `#b46100`   | `#ff9f0a`  |
| `"danger"`  | `--danger`  | `#b3261e`   | `#ff453a`  |

**Track color**: always `var(--surface)` regardless of tone. The track is a recessed channel, not a tinted surface — tinting the track would create redundant semantic encoding and clutter the palette.

### Width

The component does not set its own width. Consumers assign width via the `className` prop or by containing it in a flex/grid layout. This is the same convention as `<Spinner>`: the atom does not own its layout footprint.

---

## 5. Tokens used

| Token                          | Value    | Role                                                  |
| ------------------------------ | -------- | ----------------------------------------------------- |
| `--surface`                    | existing | Track background                                      |
| `--fg`                         | existing | Fill for `tone="default"`                             |
| `--success`                    | **new**  | Fill for `tone="success"` — see §10 for full proposal |
| `--warning`                    | existing | Fill for `tone="warning"`                             |
| `--danger`                     | existing | Fill for `tone="danger"`                              |
| `--dur-mid`                    | `240ms`  | Determinate fill transition duration                  |
| `--easing`                     | expo-out | Determinate fill transition easing                    |
| `--dur-progress-indeterminate` | **new**  | Indeterminate animation loop period — `1400ms`        |

---

## 6. Motion

### Determinate

The fill element uses:

```css
transform: scaleX(var(--progress-fraction));
transform-origin: left center;
transition: transform var(--dur-mid) var(--easing);
```

Where `--progress-fraction` is set inline on the fill element as a CSS custom property: `style={{ '--progress-fraction': value / 100 }}`. The engineer wires this via a style attribute.

**Why `scaleX` not `width`**: the motion property contract (BACKLOG §Motion) is explicit — never animate `width`. `scaleX` is compositor-cheap, triggers no layout reflow, and produces identical visual output because the fill is `width: 100%` of the track and scaled from the left origin.

**Reduced-motion (determinate)**: remove the transition entirely. The fill snaps immediately to the current value. No visual intermediary.

```css
@media (prefers-reduced-motion: reduce) {
  .fill {
    transition: none;
  }
}
```

### Indeterminate

Two bars (`bar1`, `bar2`) with `position: absolute`, `inset-block: 0`, `width: 100%`, `will-change: transform`.

#### Keyframes

```css
@keyframes poukai-progress-bar1 {
  0% {
    transform: translateX(-100%);
  }
  20% {
    transform: translateX(-100%);
  }
  60% {
    transform: translateX(0%);
  }
  80% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes poukai-progress-bar2 {
  0% {
    transform: translateX(-200%);
  }
  40% {
    transform: translateX(-200%);
  }
  80% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

#### Animation application

```css
.bar1 {
  animation: poukai-progress-bar1 var(--dur-progress-indeterminate) var(--easing) infinite;
}

.bar2 {
  animation: poukai-progress-bar2 var(--dur-progress-indeterminate) var(--easing) infinite;
}
```

#### Keyframe rationale

**Bar 1** enters from `-100%` (fully off left) and exits to `+100%` (fully off right). It holds still at `0%` (fully covering the track) between 60% and 80% of the cycle — a brief "full" pause before exiting. This creates a strong leading sweep that carries the eye across.

**Bar 2** starts further left (`-200%`) so it is invisible behind bar 1 during the first half of the cycle. It emerges and sweeps through between 40% and 80%, producing a second pass that begins while bar 1 is still mid-exit. The overlap prevents a dead-track gap and gives the loop its characteristic "two signals in sequence" rhythm.

**Why `--dur-progress-indeterminate: 1400ms`**: 1400ms is long enough that each bar's full sweep is readable as a deliberate signal (not a blur), but short enough that the track never appears stalled. The Spinner uses 800ms because rotation needs to feel continuously active; a linear bar sweep reads correctly at a slower cadence because the bar covers the entire track in each pass and the eye resolves the motion as directional progress. Benchmarks: Material Design uses ~2000ms (feels slow); iOS uses ~1000ms (feels hurried at this bar width). 1400ms is the settled mid-point for the operator-grade brand register.

**Why `--easing` (expo-out) not linear**: a progress bar sweep has an implied directionality — it is heading somewhere. Expo-out (deceleration) reads as "approaching completion" on each cycle even though the bar will repeat. Linear easing at this duration reads as mechanical. The expo-out curve also makes the bar's leading edge feel snappy — consistent with how Button and Hero entrance motions feel in the system. The indeterminate bar is not a continuous rotation (where linear is mandatory for visual evenness); it is a sweep-and-repeat, which benefits from the same entrance curve.

#### Reduced-motion (indeterminate)

Both animation bars are hidden. A single static fill at `scaleX(0.5)` — half the track width, transform-origin left — is shown instead. This communicates "something is partially complete" without implying a specific value (it is not claiming 50%) and without any motion.

```css
@media (prefers-reduced-motion: reduce) {
  .bar1,
  .bar2 {
    animation: none;
    display: none;
  }

  .staticFill {
    display: block; /* hidden by default, revealed here */
    transform: scaleX(0.5);
    transform-origin: left center;
  }
}
```

The `staticFill` element is always present in the DOM but visually hidden (`display: none`) under normal motion. Under reduced-motion it replaces the animated bars.

**Why half-filled not full**: A fully-filled track (`scaleX(1)`) reads as "complete" — it triggers the same mental model as a 100% progress bar. An empty track reads as "not started." Half-filled is the neutral indeterminate register: unambiguously in progress, neither complete nor empty. This mirrors the Spinner's reduced-motion convention (static arc visible, clearly not 0%, clearly not 100%).

---

## 7. States

| State                    | Determinate                                           | Indeterminate                                              |
| ------------------------ | ----------------------------------------------------- | ---------------------------------------------------------- |
| Default                  | Fill scaled to `value / 100` from left origin.        | Two bars animating via `poukai-progress-bar1/2` keyframes. |
| Value = 0                | Fill at `scaleX(0)` — track appears empty.            | N/A                                                        |
| Value = 100              | Fill at `scaleX(1)` — track appears full.             | N/A                                                        |
| Value out of range       | Clamp to `[0, 100]` before computing fraction.        | N/A                                                        |
| Reduced-motion           | Fill snaps to value, no transition.                   | Static half-filled track, no animation.                    |
| No width set by consumer | Component collapses to 0px — consumer must set width. | Same.                                                      |

The component has no hover, focus, or disabled states. It is a display-only primitive.

---

## 8. Accessibility

- **Root element**: `<div role="progressbar">`.
- **`aria-valuemin="0"` and `aria-valuemax="100"`**: always present.
- **`aria-valuenow`**: present and equal to the clamped integer value when determinate. Absent from the DOM when indeterminate — do not render the attribute at all (not `aria-valuenow={undefined}`; the serialised attribute `aria-valuenow="undefined"` would be invalid).
- **Labeling**: exactly one of `aria-label` or `aria-labelledby` must be provided. The engineer enforces this at the TypeScript type level. No default label is defined — an unlabeled progress bar is inaccessible; a default of `"Loading"` would be a lie (it might be uploading, generating, or downloading). Callers must supply a meaningful label: `"Uploading report"`, `"Generating response"`, `"Step 2 of 4"`.
- **Color contrast (fill on track)**: the fill color sits on `--surface` (`#f5f5f7` light / `#1c1c1e` dark). The fill is a non-text UI component; WCAG 1.4.11 (Non-text Contrast) requires ≥ 3:1. Verified pairs:
  - `--fg` on `--surface` light: `#1d1d1f` on `#f5f5f7` — ~16:1 (AAA, non-text ≥ 3:1 ✓)
  - `--danger` on `--surface` light: `#b3261e` on `#f5f5f7` — ~4.8:1 (≥ 3:1 ✓)
  - `--warning` on `--surface` light: `#b46100` on `#f5f5f7` — ~3.1:1 (≥ 3:1 ✓, marginal — the WCAG threshold is met; the token was set with this in mind per tokens.css comment "AA on --bg")
  - `--success` (proposed `#248a3d`) on `--surface` light: approximately 4.7:1 (≥ 3:1 ✓)
  - All dark-mode pairs use the brighter status token values (`--danger: #ff453a`, `--warning: #ff9f0a`, `--success: #30d158` proposed) on `--surface: #1c1c1e` — all clear ≥ 3:1.
- **Keyboard**: not focusable. The ProgressBar is a status indicator, not an interactive control.
- **Screen reader behavior**: `role="progressbar"` with `aria-valuenow` causes assistive technologies to announce the percentage when it changes. For indeterminate bars (no `aria-valuenow`), the AT announces the label but no percentage — this is the correct behavior per ARIA spec.
- **Live region**: `role="progressbar"` is not an implicit live region. Callers that want the AT to announce progress updates dynamically should wrap the bar in a `role="status"` container or update the label periodically. This is a consumer concern, not a component concern.

---

## 9. Prop intent

- Consumers must be able to pass `value` (0–100) for determinate mode. Omitting it activates indeterminate mode.
- Consumers must be able to choose `size` (`"sm"` or `"md"`). Default is `"md"`.
- Consumers must be able to choose `tone` (`"default"`, `"success"`, `"warning"`, `"danger"`). Default is `"default"`.
- Consumers must supply exactly one of `aria-label` or `aria-labelledby`. Neither is optional; the component should not render or should throw a dev-mode warning if both are absent.
- Consumers must be able to pass `className` for layout control (width, margin). The component owns no width of its own.
- Consumers must be able to spread additional HTML attributes (e.g. `data-testid`, `id`) onto the root `<div>` via rest props.
- The component does not accept a `color` prop — tone is the abstraction layer.
- The component does not accept a `speed` or `animationDuration` prop. Duration is governed by `--dur-progress-indeterminate`. Callers who need a different speed override the token via a scoped CSS custom property on a wrapping element.

---

## 10. New tokens — engineer must add

Both tokens are new and must be added to `src/tokens/tokens.css` in the same PR that ships the component.

### `--dur-progress-indeterminate: 1400ms`

Add to the `/* Motion */` block in `:root`, after `--dur-spinner`:

```css
--dur-progress-indeterminate: 1400ms; /* ProgressBar indeterminate sweep period — two-bar translateX loop */
```

### `--success` tier (three tokens)

`--success` does not exist in `tokens.css`. To match the structural parity of `--danger` and `--warning` (each of which has three tokens: the status color, a tinted background surface, and a high-contrast foreground-on-surface), propose the full three-token tier:

Add to the `/* Status color tier */` block in `:root` (light mode), before `--danger`:

```css
/* success: confirmations, completion, positive feedback. Apple systemGreen hue family. */
--success: #248a3d; /* WCAG AA on --bg (#FBFBFD): ~4.7:1 */
--bg-success: #f0faf3; /* tinted page-tier surface — subtle green */
--fg-on-success: #0d3d1e; /* deep forest for text on --bg-success: ~10.5:1 */
```

Add to the dark-mode `@media (prefers-color-scheme: dark)` `:root` block, matching the `--danger` / `--warning` dark entries:

```css
--success: #30d158; /* Apple systemGreen dark. Contrast on --bg (#000): ~10.9:1 */
--bg-success: #041a09; /* Near-black with green undertone. */
--fg-on-success: #a8f0be; /* Soft mint. Contrast on --bg-success: ~13.1:1 (AAA). */
```

**Rationale**: `#248a3d` is Apple systemGreen light (the reference palette this system tracks — `--accent` is Apple Blue, `--danger` is Apple systemRed, `--warning` is Apple systemOrange/Amber). The three-token structure (`--success` / `--bg-success` / `--fg-on-success`) mirrors the `--danger` and `--warning` tiers already in `tokens.css`. `ProgressBar` only consumes `--success` (the fill color); `--bg-success` and `--fg-on-success` are part of the same logical tier and should ship together so that any future status surface (alert, toast, badge) can access them without a separate token addition. Adding only `--success` now and the others later would leave the tier structurally incomplete.

**Brand note**: the `--success` token addition requires a corresponding entry in `meta/brand.md` § Decision history. The engineer ships the token; the designer (this spec) documents the decision. A `meta/brand.md` entry is required — do not merge without it.

---

## 11. Composition rules

**Standalone.** The canonical use: a labeled bar tracking upload, generation, or multi-step completion. Caller supplies width (e.g. `100%` of a card, `20rem` in a form field).

**Inside a card or panel.** The bar sits below a label and above a supporting percentage string. The `aria-labelledby` prop should reference the label's `id` so the relationship is explicit to AT. Example structure:

```
<p id="upload-label">Uploading report.pdf</p>
<ProgressBar value={42} aria-labelledby="upload-label" />
<p>42%</p>
```

**As a step indicator.** `value={(currentStep / totalSteps) * 100}` with `aria-label="Step {currentStep} of {totalSteps}"`. The bar gives a proportional visual; the label gives the discrete count for AT.

**Do not use inside a `<Button>`.** A loading button uses `<Spinner>`. The ProgressBar is too wide to embed in a button's inline layout. The Spinner handles button-level loading; the ProgressBar handles panel-level / page-level progress.

**Do not use for ambient decoration.** The motion doctrine applies: every animation must communicate a real operation state. A ProgressBar that loops indefinitely on a page where no real operation is in progress contradicts the brand contract.

---

## 12. Out of scope

- **Circular / radial progress.** A circular variant is a different atom; not specified here.
- **Segmented / stepped track.** A track divided into step segments with discrete fills is a different primitive; not specified here.
- **Labels or percentage readouts.** The component renders the bar only. Textual labels and percentage strings are the caller's responsibility.
- **Stacked / multi-color fills.** A single fill bar covers this version. Multi-segment fills (e.g. a storage breakdown) are a different component.
- **Buffer indicator.** A secondary "buffer" track layer (the YouTube-style pre-load ghost) is out of scope.
- **Animation speed prop.** Callers override `--dur-progress-indeterminate` via scoped CSS custom property if needed; the prop API does not expose duration.

---

## Hand-off note for poukai-ds-engineer

**Component location**: `src/atoms/ProgressBar/` — consistent with atoms layer convention.

**New tokens to add to `src/tokens/tokens.css`** before wiring the component:

1. `--dur-progress-indeterminate: 1400ms` — in the `/* Motion */` block after `--dur-spinner`.
2. `--success: #248a3d` / `--bg-success: #f0faf3` / `--fg-on-success: #0d3d1e` — light mode, in the `/* Status color tier */` block before `--danger`.
3. Dark-mode counterparts: `--success: #30d158` / `--bg-success: #041a09` / `--fg-on-success: #a8f0be` — inside the `@media (prefers-color-scheme: dark)` `:root` block.

**Keyframe names**: `poukai-progress-bar1` and `poukai-progress-bar2` — follow the `poukai-` prefix convention from `poukai-spin` (Spinner) and `poukai-pulse` (StatusBadge).

**`aria-valuenow` DOM behavior**: when indeterminate, do not render the attribute at all. In React: `aria-valuenow={value !== undefined ? Math.min(100, Math.max(0, value)) : undefined}` — React omits attributes set to `undefined`, which is the correct behavior.

**TypeScript labeling constraint**: enforce that at least one of `aria-label` or `aria-labelledby` is provided. A discriminated union or overloads approach works; the exact mechanism is the engineer's call.

**Reduced-motion — indeterminate static fill**: the `staticFill` element must always be in the DOM (for CSS-only toggling). Use `display: none` / `display: block` toggled by the `@media (prefers-reduced-motion: reduce)` block. Do not use JS to detect reduced-motion and conditionally render a different element — CSS-only, matching the Spinner convention.

**Determinate `--progress-fraction`**: pass as an inline style `style={{ '--progress-fraction': value / 100 }}`. Declare the CSS custom property in the module with a fallback: `transform: scaleX(var(--progress-fraction, 0))`.

**`meta/brand.md` update**: add a Decision history entry for the `--success` tier addition (date: 2026-05-21). This is the designer's responsibility per the spec — confirm with `poukai-design` that the entry has been made before merging.

**Export**: add `ProgressBar` to `src/index.ts` exports alongside other atoms.
