# Stepper

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`Stepper` is the system's numbered step indicator for multi-step flows and process explainers. It renders an ordered sequence of labeled steps — each in one of three states: complete, active, or upcoming — so a user can orient themselves within a linear progression. Primary surfaces: onboarding wizards, checkout sequences, settings setup flows, and editorial "how it works" process diagrams.

## 2. Anatomy

```
[1] ——————— [2] ——————— [3]
Account      Profile      Confirm
```

- **Root**: `<ol>` — ordered list, semantic sequence.
- **Step item**: `<li>` per step. The active item carries `aria-current="step"`.
- **Step marker**: `<span>` containing the step number (or a checkmark icon when complete). Circular, token-driven size.
- **Connector**: `<span aria-hidden="true">` horizontal rule between adjacent markers. Decorative, hidden from the a11y tree.
- **Step label**: `<span>` below the marker. Short string; wraps are acceptable but discouraged.
- **Step wrapper**: flex column (marker + label) inside the `<li>`.

The root `<ol>` uses `display: flex; align-items: flex-start` to lay the steps and connectors in a horizontal row. Connectors are flex children placed between step `<li>` elements via CSS (adjacent sibling selector or explicit connector elements).

## 3. Tokens

- `--fg` — active step marker text and border; complete step marker fill text
- `--fg-muted` — upcoming step marker text and border; step label text for upcoming steps
- `--accent` — active step marker border ring (2px solid)
- `--surface` — upcoming step marker background
- `--bg-elevated` — complete and active step marker background
- `--hairline` — connector line color (upcoming segment)
- `--hairline-w` — connector line thickness (1px)
- `--font-sans` — all text
- `--fs-meta` — step label font size (14px)
- `--fs-micro` — step marker numeral font size (12px)
- `--lh-meta` — step label line-height
- `--space-1` — vertical gap between marker and label (4px)
- `--space-2` — padding inside step marker (8px, optical centering)
- `--space-4` — minimum connector width between adjacent steps (16px)
- `--space-8` — minimum gap between step items on mobile (32px)
- `--radius-3` — not used; marker is circular via `border-radius: 50%`
- `--tracking-micro` — letter-spacing on step numerals (0.04em, consistent with micro label register)

## 4. Variants / Props

| Prop          | Type                         | Default        | Rationale                                                                                                                         |
| ------------- | ---------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `steps`       | `Array<{ label: string }>`   | required       | Ordered step definitions. Label is the visible text below each marker.                                                            |
| `current`     | `number` (0-based index)     | required       | Index of the active step. Steps before `current` are complete; steps after are upcoming.                                          |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Horizontal for wizard headers; vertical for sidebar process lists.                                                                |
| `size`        | `"sm" \| "md"`               | `"md"`         | `"sm"` reduces marker diameter and hides labels — useful for space-constrained wizard headers. `"md"` shows labels.               |
| `showLabels`  | `boolean`                    | `true`         | Explicit override; `size="sm"` sets this to `false` by default. Consumers may want `size="md"` without labels in narrow contexts. |

**State derivation** (no explicit per-step `state` prop — state is derived from `current`):

- Index `< current` → complete. Marker shows a checkmark icon (`aria-hidden`); `aria-label` on the `<li>` appends "(complete)".
- Index `=== current` → active. Marker shows the 1-based numeral. `aria-current="step"` on the `<li>`.
- Index `> current` → upcoming. Marker shows the 1-based numeral in muted register.

## 5. Interaction

Stepper is a **display-only indicator** — it has no interactive states by default. It does not navigate between steps; the consumer's flow controller does that.

- No click handlers on step items.
- No hover styles — adding them would falsely imply navigability.
- No focus ring on step items (they are not focusable elements).
- Keyboard navigation is irrelevant to the indicator itself; the consumer's form/wizard handles Tab order through actual form controls.
- If a consumer needs clickable steps (for non-linear flows), they must wrap step labels in `<a>` or `<button>` elements; the DS does not author that variant here.

## 6. A11y

- Root element: `<ol>` — correct for an ordered sequence.
- Each `<li>` has an implicit `listitem` role.
- Active step: `aria-current="step"` on the active `<li>`.
- Complete steps: visually display a checkmark icon; the icon must carry `aria-hidden="true"`. The `<li>` receives a visually-hidden suffix "(complete)" via CSS generated content or a `<span class="visually-hidden">` so screen readers announce step state.
- Connector spans: `aria-hidden="true"` — purely decorative.
- Contrast:
  - Active numeral `--fg` (#1D1D1F) on `--bg-elevated` (#FFFFFF): 19.56:1 — AAA.
  - Upcoming numeral `--fg-muted` (#6E6E73) on `--surface` (#F5F5F7): 4.57:1 — AA (passes at 12px, which is `--fs-micro`; WCAG normal-text AA threshold = 4.5:1).
  - Step label `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD): 4.91:1 — AA.
- `axe-core` rules in play: `list`, `listitem`, `aria-current` on non-interactive elements is permitted (ARIA spec allows `aria-current` on any element).

## 7. Motion

None by default. Stepper is a static indicator. State transitions (e.g., step 1 becoming complete when the user advances) are owned by the consumer's state update — the component re-renders with a new `current` value. No CSS transition is authored on the marker or connector.

`@media (prefers-reduced-motion: reduce)` has no effect since no transitions are defined.

If a future revision adds a transition on the connector fill (complete-segment accent line), it must respect `prefers-reduced-motion` by setting `transition-duration: 0.01ms` — but this is out of scope for Phase 1.

## 8. Anti-patterns

- **Do not use Stepper as a navigation tab bar.** It has no interactive semantics. Use `Tabs` for switching between independent views.
- **Do not use Stepper for non-linear processes.** It implies strict sequence. If steps can be completed in any order, a checklist pattern is more appropriate.
- **Do not put more than ~7 steps in a single horizontal Stepper.** Beyond that, markers and connectors become illegible on mobile; split the flow or use `orientation="vertical"`.
- **Do not use Stepper as a progress bar.** `ProgressBar` encodes indeterminate or percentage-based progress; Stepper encodes discrete named steps. They are different affordances.
- **Do not use Stepper for editorial "timeline" sequences.** `TimelineItem` / a future `Timeline` organism owns date-indexed chronological lists.
- **Do not rely on color alone to communicate state.** The numeral, checkmark icon, and `aria-current` carry the state signal independently of color.

## 9. Depends on

- `Divider` — the horizontal connector rule between steps can reuse the `--hairline` token treatment defined by Divider's spec; no import dependency required, but the visual logic is consistent with it.
- `NumberFormat` — cited in the issue as a dependency; in practice, step numerals are simple 1-based integers rendered as text, so a full `NumberFormat` atom is not required for Phase 1. If locale-aware numeral formatting is needed later, `NumberFormat` is the correct composition.

## Open questions

- **Complete-step connector color.** The spec uses `--hairline` for all connectors. A common pattern fills the connector between complete steps with `--accent` to show progress visually. This would require no new token (`--accent` exists) but is a visual decision not made here. Confirm with Arian whether connectors should be accent-filled for complete segments or remain hairline throughout.
- **Marker diameter.** A circular marker needs a fixed diameter. The current token set has no `--size-*` or `--icon-*` diameter token appropriate for a step marker circle (the `--icon-*` tokens are for icon glyphs, not container circles). `size="md"` marker: 28px diameter; `size="sm"` marker: 20px diameter. These values would be hardcoded in `Stepper.module.css`. Confirm whether a `--step-marker-size` token should be introduced (requires a `meta/brand.md` entry and a separate token PR) or whether inline values are acceptable here.
