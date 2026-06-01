# Design spec: Dark mode token tier

**Atomic layer**: foundation
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-06-01
**Implements proposal**: n/a — ROADMAP "Maybe" item promoted to this round; manual toggle promoted from non-goal via ADR-0006 rev (issue #393)

---

## 1. Purpose

Dark mode is not an inversion of the light palette. It is a parallel surface stack where backgrounds darken progressively toward black (the floor), foregrounds brighten toward near-white (never pure), and the elevation rhythm inverts direction — surfaces now RISE through darker grays as they elevate, rather than rising toward white.

This spec authors both the OS-preference mechanism (`@media prefers-color-scheme: dark`) and the explicit manual toggle mechanism (class / data-attribute on `:root`) that overrides every color token in `src/tokens/tokens.css` for dark environments. No component CSS changes. No new component files. The token flip is the entire mechanism — every component that consumes tokens correctly gains dark mode and the manual toggle for free.

**Non-goals.**

- Per-component dark-mode overrides in CSS modules. If a component needs one, that is a signal it has a hardcoded color value that should be a token instead (see §10 Open questions for the current audit list).
- ~~A `data-theme="dark"` class toggle / JavaScript theme switcher. This spec ships OS-preference-only dark mode via the standard `prefers-color-scheme` media query. A manual toggle is a future concern.~~ **Promoted to in-scope — see §3 Manual toggle.**
- Dark-mode motion changes. Motion tokens are unchanged.
- Dark-mode typography changes. Type tokens are unchanged.
- Dark-mode spacing or layout changes. No layout tokens change.

---

## 2. Anatomy

The mechanism is two CSS rule blocks, both appended to the end of `src/tokens/tokens.css`:

**Block A — OS preference (baseline, no JavaScript required):**

```css
@media (prefers-color-scheme: dark) {
  :root:not(.light):not([data-theme="light"]) {
    /* dark color token overrides */
  }
}
```

**Block B — Explicit forced dark (overrides OS):**

```css
:root.dark,
:root[data-theme="dark"] {
  /* same dark color token overrides — see §4 DRY decision */
}
```

**Block C — Explicit forced light (overrides OS on dark-preference systems):**

No new block required. The light values are already the `:root` defaults. The light class/attr selector's only job is to scope Block A's media query via the `:not()` guard — light mode is the default cascade state, not a separate override block.

The browser applies Block A automatically when the OS reports dark preference **and** no explicit light override is set. Block B fires whenever `.dark` or `[data-theme="dark"]` is present on `:root`, regardless of OS preference.

**`color-scheme` declaration.**

`html { color-scheme: light dark; }` must be present in the base token file (already the case). When forced dark is active, this should be reinforced at the site level: if the consumer sets `.dark` on `<html>`, they should also set `color-scheme: dark` inline or via a class rule so that browser chrome (scrollbars, form controls, selection) matches. The DS ships `color-scheme: light dark` unconditionally — the site or app layer is responsible for narrowing it to `dark` or `light` when a forced mode is active. See §6 Consumer usage.

---

## 3. Manual toggle — selector strategy and override precedence

### 3.1 Canonical selectors

The DS recognises two equivalent syntaxes for each forced mode, making integration straightforward for both class-based JS frameworks and data-attribute-based theme systems:

**Forced dark:**

```
:root.dark
:root[data-theme="dark"]
```

**Forced light (opt-out of dark OS preference):**

```
:root.light
:root[data-theme="light"]
```

Both forms are equally canonical. Consumers may use either. There is no preferred form — the two exist to maximise compatibility across frameworks (some prefer class toggling; others prefer data attributes).

The selectors are applied to `:root` (i.e. `<html>`), not to `<body>` or any interior element. Custom-property inheritance means `:root`-scoped overrides cascade to the entire document. Scoping below `:root` is explicitly out of scope for this DS version.

### 3.2 Override precedence

The precedence ladder, from highest to lowest:

1. **Explicit forced dark** — `:root.dark` or `:root[data-theme="dark"]` is present → dark always, OS signal irrelevant.
2. **Explicit forced light** — `:root.light` or `:root[data-theme="light"]` is present → light always, OS signal irrelevant.
3. **OS preference** — no class or attr set → follow `prefers-color-scheme`.
4. **Default (light)** — OS reports light, or no OS signal → `:root` default values apply unchanged.

The critical constraint is **rule 2 vs. rule 3**: the OS `@media (prefers-color-scheme: dark)` block must NOT fire when an explicit light opt-out is set. This is achieved by scoping the media block with `:not()` guards:

```css
@media (prefers-color-scheme: dark) {
  :root:not(.light):not([data-theme="light"]) {
    /* dark token overrides */
  }
}
```

Without the `:not()` guards, a `.light` class on `:root` has lower specificity than the media query + `:root` selector combination — the OS media block would override the explicit light signal and produce incorrect dark rendering. The guards prevent this.

**Specificity accounting:**

| Rule                     | Selector                                                      | Specificity                                |
| ------------------------ | ------------------------------------------------------------- | ------------------------------------------ |
| OS media block (guarded) | `:root:not(.light):not([data-theme="light"])` inside `@media` | `(0,2,1)` — pseudo-class × 2 + element × 1 |
| Forced dark block        | `:root.dark, :root[data-theme="dark"]`                        | `(0,1,1)` — class × 1 + element × 1        |
| Base `:root` defaults    | `:root`                                                       | `(0,0,1)`                                  |

The forced dark selectors at `(0,1,1)` beat the base `:root` at `(0,0,1)` correctly. The OS media block at `(0,2,1)` also beats the base, but only when neither `:not()` guard matches — meaning neither `.light` nor `[data-theme="light"]` is present. When `.light` is present, the `:not(.light)` pseudo-class fails on the `:root` element, the entire `:root:not(.light):not([data-theme="light"])` selector does not match, and the media block produces no output.

This works without any CSS layers, custom-selector plugins, or cascade layers. Pure CSS specificity arithmetic.

### 3.3 No new tokens

The manual toggle mechanism introduces no new color tokens. The dark values are identical to the `@media prefers-color-scheme: dark` block. The mechanism is purely structural — the same values, selectors that activate them.

---

## 4. DRY decision — duplication vs. abstraction

### The constraint

Plain CSS has no mixins. The repo's PostCSS plugins are `postcss-custom-media` and `postcss-nesting` — neither provides a mixin or custom-selector abstraction that would allow writing the dark token block once and referencing it from two selectors (the media block and the explicit-class block).

### Decision: deliberate, documented duplication

The dark token values appear twice in `tokens.css`:

1. Inside `@media (prefers-color-scheme: dark) { :root:not(.light):not([data-theme="light"]) { … } }`
2. Inside `:root.dark, :root[data-theme="dark"] { … }`

**This is the correct choice.** The alternatives are:

- **CSS `@layer`**: does not reduce declaration repetition; it changes cascade ordering, not authoring verbosity. Not applicable.
- **CSS `@apply` (Tailwind extension)**: not available in this PostCSS setup, and standardisation is stalled. Not applicable.
- **Separate custom-properties file (`dark-values.css`) that both blocks reference**: not valid CSS — custom properties cannot be defined outside a selector and then `var()`-referenced into two different selector blocks. Not applicable.
- **PostCSS custom-selector (`@custom-selector`) to unify the two selectors under one name**: `postcss-custom-selector` is NOT in the repo's plugin list. `postcss-nesting` is present, but nesting does not address two distinct top-level selectors. Not applicable without adding a new plugin dependency — which is an engineering-level change outside the design spec's lane.
- **A single umbrella rule that covers both cases via a combined selector**: the OS media block and the explicit class rule fire under different conditions and cannot be merged into a single selector without re-introducing the precedence bug described in §3.2.

**Maintenance discipline to compensate for duplication:**

The two blocks are placed adjacently in `tokens.css`, separated by a single comment:

```css
/* ============================================================
   Dark-mode token tier
   Two equivalent activation paths — values are intentionally
   duplicated. Update BOTH blocks together. See meta/design/dark-mode.md §4.
   ============================================================ */

/* Path 1: OS preference (no JS required) */
@media (prefers-color-scheme: dark) {
  :root:not(.light):not([data-theme="light"]) {
    /* … dark tokens … */
  }
}

/* Path 2: Explicit forced dark (class or data-attribute on <html>) */
:root.dark,
:root[data-theme="dark"] {
  /* … dark tokens (same values) … */
}
```

The comment is mandatory. Any future edit to dark token values must update both blocks. The engineer must verify both blocks are in sync before merging.

---

## 5. Token contract

Full table of every color token's light value and dark counterpart. Typography, spacing, motion, layout, and radius tokens are unchanged and omitted.

| Token                | Light value            | Dark value              | Role in dark mode                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--bg`               | `#FBFBFD`              | `#000000`               | Page floor. Pure black is the canonical dark-mode canvas (Apple iOS / macOS system background). No elevation headroom needed below the floor — there is nothing beneath it.                                                                                                                                                                                                                                                                |
| `--bg-elevated`      | `#FFFFFF`              | `#1C1C1E`               | Front-most surface layer: popovers, sheets, dialogs. Lighter than `--bg` — the elevation direction inverts. `#1C1C1E` is Apple's iOS `systemBackground` dark value.                                                                                                                                                                                                                                                                        |
| `--surface`          | `#F5F5F7`              | `#1C1C1E`               | Recessed inline blocks (code, quote, card fills). In dark mode, `--surface` and `--bg-elevated` share the same raw value; they remain semantically distinct because `--surface` recedes below the page and `--bg-elevated` elevates above it. The visual distinction comes from surrounding context (page vs. overlay). If this conflation creates ambiguity in practice, the next iteration introduces a dedicated `--surface-dark` rung. |
| `--surface-section`  | `#F8F8FA`              | `#161618`               | Full-width alternating section bands. Slightly darker than `--bg` (#000), creating the same subtle recessed-band rhythm as in light mode — but downward instead of upward.                                                                                                                                                                                                                                                                 |
| `--fg`               | `#1D1D1F`              | `#F5F5F7`               | Primary text, wordmark, sigil. Near-white pulled off `#FFFFFF` by 10/255 on each channel. The headroom allows `--bg-elevated` surfaces (which in dark mode are `#1C1C1E`) to eventually use a slightly brighter foreground if needed — preserving the same off-pure convention as light mode.                                                                                                                                              |
| `--fg-muted`         | `#6E6E73`              | `#86868B`               | Secondary text: captions, footer, lede. Apple's `secondaryLabel` dark-mode gray. Contrast against `--bg` (#000): **6.10:1** (AA normal).                                                                                                                                                                                                                                                                                                   |
| `--hairline`         | `#D2D2D7`              | `#2C2C2E`               | 1px dividers. In dark mode hairlines become subtle dark-gray separators — they must be visible as structure without asserting. `#2C2C2E` is Apple's `separator` dark value.                                                                                                                                                                                                                                                                |
| `--hairline-soft`    | `#E5E5EA`              | `#3A3A3C`               | Quieter decorative separator. Sits between `--hairline` and `--surface` in the dark neutral ramp.                                                                                                                                                                                                                                                                                                                                          |
| `--accent`           | `#0071E3`              | `#0A84FF`               | Links, focus rings, status dot. Apple's `systemBlue` dark-mode value. Brighter than the light-mode accent because dark backgrounds demand higher luminance to hit the same perceptual pop. Contrast against `--bg` (#000): **5.86:1** (AA normal; ≥ 3:1 required for focus rings under WCAG 1.4.11).                                                                                                                                       |
| `--accent-glow`      | `rgba(0,113,227,0.18)` | `rgba(10,132,255,0.24)` | Selection background, status dot halo. Slightly higher opacity in dark mode to compensate for the dark surface absorbing more of the tint.                                                                                                                                                                                                                                                                                                 |
| `--bg-warm-accent`   | `#C0452C`              | `#8A2E1C`               | Editorial warm band. Dimmed significantly for dark mode — the light-mode value reads as a bold saturated accent against `#FBFBFD`; against `#000000` it would scorch. `#8A2E1C` is approximately 55% the luminance of the light value, bringing it into a "deep ember" register that reads as warm without overwhelming.                                                                                                                   |
| `--fg-on-warm`       | `#FDF5F0`              | `#FDF5F0`               | Primary text on warm band. Unchanged — the warm near-white reads correctly against both warm-band values. Contrast against dark `--bg-warm-accent` (#8A2E1C): **7.75:1** (AAA).                                                                                                                                                                                                                                                            |
| `--fg-on-warm-muted` | `#F5DDD0`              | `#D6B9A8`               | Supporting text on warm band. Pulled inward (more saturated, less bright) in dark mode to maintain legibility against the dimmed warm band. Contrast against `#8A2E1C`: computed ≈ **4.8:1** (AA normal).                                                                                                                                                                                                                                  |
| `--success`          | `#248A3D`              | `#30D158`               | Apple systemGreen dark. Contrast on `--bg` (#000): ~10.9:1.                                                                                                                                                                                                                                                                                                                                                                                |
| `--bg-success`       | `#F0FAF3`              | `#041A09`               | Near-black with green undertone.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `--fg-on-success`    | `#0D3D1E`              | `#A8F0BE`               | Soft mint. Contrast on `--bg-success`: ~13.1:1 (AAA).                                                                                                                                                                                                                                                                                                                                                                                      |
| `--danger`           | `#B3261E`              | `#FF453A`               | Apple `systemRed` dark. Brighter than light-mode danger to read clearly on dark surfaces.                                                                                                                                                                                                                                                                                                                                                  |
| `--bg-danger`        | `#FEF0F0`              | `#1C0A0A`               | Near-black with a red undertone. "Tinted dark surface" register — reads as danger-toned without being a bright alert background.                                                                                                                                                                                                                                                                                                           |
| `--fg-on-danger`     | `#5C1310`              | `#FFB4B0`               | Softened salmon-pink. Contrast against `--bg-danger` (#1C0A0A): **11.63:1** (AAA).                                                                                                                                                                                                                                                                                                                                                         |
| `--warning`          | `#B46100`              | `#FF9F0A`               | Apple `systemOrange` dark.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `--bg-warning`       | `#FFF7E6`              | `#1C1408`               | Near-black with an amber undertone.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `--fg-on-warning`    | `#4A2900`              | `#FFD6A0`               | Warm straw. Contrast against `--bg-warning` (#1C1408): **13.74:1** (AAA).                                                                                                                                                                                                                                                                                                                                                                  |

### Elevation rhythm in dark mode

Light mode rises toward white: `--surface (#F5F5F7) < --surface-section (#F8F8FA) < --bg (#FBFBFD) < --bg-elevated (#FFFFFF)`

Dark elevation stack, dark to light: `--bg (#000000) < --surface-section (#161618) < --surface (#1C1C1E) = --bg-elevated (#1C1C1E)`

The page floor is the darkest value. Recessed bands sit slightly above it. Inline surfaces and elevated overlays sit at the same rung (`#1C1C1E`). The semantic distinction between `--surface` (recessed inline) and `--bg-elevated` (overlay) is contextual, not chromatic, at this tier. If the two roles need visual separation in future components, `--surface` can be bumped to `#222224`.

---

## 6. Consumer usage

### Setting a forced mode

Add either the class or the data-attribute to `<html>`. Both are canonical; pick one and be consistent within a codebase.

```html
<!-- Forced dark -->
<html class="dark">
  <html data-theme="dark">
    <!-- Forced light (explicit OS override — e.g. always-light product area) -->
    <html class="light">
      <html data-theme="light">
        <!-- No class / attr — OS preference governs -->
        <html></html>
      </html>
    </html>
  </html>
</html>
```

Do not place the class on `<body>` or any interior element. The tokens cascade from `:root`.

### Toggling via JavaScript

A minimal toggle that persists to `localStorage`:

```js
function setTheme(theme) {
  // theme: 'dark' | 'light' | 'system'
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.removeAttribute("data-theme");

  if (theme !== "system") {
    root.classList.add(theme);
    // or: root.setAttribute('data-theme', theme)
  }

  try {
    localStorage.setItem("theme", theme);
  } catch (_) {}
}
```

### SSR / no-flash

To prevent a flash of the wrong theme on page load in server-rendered applications, emit a blocking inline `<script>` in `<head>` before any CSS is parsed:

```html
<script>
  (function () {
    var t = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) || "system";
    var root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else if (t === "light") {
      root.classList.add("light");
    }
    // 'system': no class; OS media query governs
  })();
</script>
```

This script runs synchronously before the browser processes any `<style>` or `<link>` elements that follow it, so no repaint occurs. The DS does not ship this snippet — it is the consuming application's responsibility. The DS contract is the CSS selectors; the JS hydration layer is out of scope.

### `color-scheme` property in forced modes

The `html { color-scheme: light dark; }` declaration in `tokens.css` tells the browser to style native UI elements (scrollbars, form controls, `<select>`, `<input>`, `<textarea>`, date pickers) using whichever of its built-in light/dark themes applies for the current OS preference. When a forced mode is active, the OS preference and the page's visual theme diverge, and `color-scheme: light dark` still delegates the choice to the OS. This means on a light-OS machine with `.dark` forced, form controls may remain light while the token-driven UI is dark.

Consumers that need native controls to match the forced theme should override `color-scheme` on `html` alongside the class:

```js
function setTheme(theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else if (theme === "light") {
    root.classList.add("light");
    root.style.colorScheme = "light";
  } else {
    root.style.colorScheme = ""; // revert to tokens.css declaration
  }
}
```

The DS does not set `color-scheme` via the class selectors in `tokens.css` — doing so would tie a token file to a behavioral override that only applies in forced modes, conflating two separate concerns. The inline `style.colorScheme` approach is the correct separation.

---

## 7. States and motion

No changes to motion tokens in dark mode. All `--dur-*`, `--easing`, and `--easing-link` values are unchanged. The `@media (prefers-reduced-motion: reduce)` block is independent of the color-scheme block and continues to apply in dark mode, including in forced-dark mode.

No changes to component states (hover, focus, active, disabled). Those states are expressed via the same token vocabulary — the token values simply change under the dark block, so states respond correctly automatically.

---

## 8. Responsive behavior

Dark mode is a color scheme, not a layout variant. No responsive layout changes. All three activation paths (OS preference, forced dark, forced light) apply at all viewport sizes.

---

## 9. Accessibility

### Contrast targets and verification

All ratios are computed using WCAG 2.1 relative luminance (`C_lin = C/12.92` for `C ≤ 0.04045`, else `((C+0.055)/1.055)^2.4`) and the `(L1+0.05)/(L2+0.05)` formula. `--bg` in dark mode is `#000000`, so `L2 = 0` and the denominator simplifies to `0.05`.

| Token pair                                                     | Contrast ratio | Threshold                   | Verdict   |
| -------------------------------------------------------------- | -------------- | --------------------------- | --------- |
| `--fg` (#F5F5F7) on `--bg` (#000000)                           | **19.58:1**    | 7:1 (AAA body text)         | AAA       |
| `--fg-muted` (#86868B) on `--bg` (#000000)                     | **6.10:1**     | 4.5:1 (AA normal text)      | AA        |
| `--accent` (#0A84FF) on `--bg` (#000000)                       | **5.86:1**     | 3:1 (non-text: focus rings) | AA normal |
| `--fg-on-warm` (#FDF5F0) on `--bg-warm-accent` (#8A2E1C)       | **7.75:1**     | 4.5:1 (AA normal text)      | AAA       |
| `--fg-on-warm-muted` (#D6B9A8) on `--bg-warm-accent` (#8A2E1C) | **≈4.8:1**     | 4.5:1 (AA normal text)      | AA        |
| `--fg-on-danger` (#FFB4B0) on `--bg-danger` (#1C0A0A)          | **11.63:1**    | 4.5:1 (AA normal text)      | AAA       |
| `--fg-on-warning` (#FFD6A0) on `--bg-warning` (#1C1408)        | **13.74:1**    | 4.5:1 (AA normal text)      | AAA       |

All required thresholds are met. Body text (`--fg` on `--bg`) exceeds AAA. The weakest pairing is `--fg-muted`, which clears AA normal but not AAA — this matches the light-mode behavior (4.91:1 in light) and is acceptable for secondary copy.

The contrast guarantees above hold for all three activation paths (OS preference, forced dark via class, forced dark via data-attribute) because all three produce the same token values.

### `color-scheme` meta

The `html` element declares `color-scheme: light dark` so the browser applies its system-native dark-mode styles to form controls, scrollbars, and selection. In forced modes, consumers override this per §6. Without the override in forced modes, browser-chrome UI may not match the forced token theme.

---

## 10. Worked examples

### Banner danger tone in light mode

A hypothetical danger Banner in light mode renders:

- Background: `--bg-danger` → `#FEF0F0`
- Body text: `--fg-on-danger` → `#5C1310`
- Icon / label: `--danger` → `#B3261E`

### Banner danger tone in dark mode

The same Banner component in dark mode (via OS preference, `.dark` class, or `[data-theme="dark"]`), with zero code changes:

- Background: `--bg-danger` → `#1C0A0A` (deep near-black with red undertone)
- Body text: `--fg-on-danger` → `#FFB4B0` (softened salmon — 11.63:1)
- Icon / label: `--danger` → `#FF453A` (Apple dark-mode red)

No class changes, no prop changes, no component CSS changes. The token flip is the entire mechanism.

### Wordmark in dark mode

`<Wordmark>` uses `fill="currentColor"` on the SVG root. In dark mode (any activation path), the parent CSS inherits `color: var(--fg)` which resolves to `#F5F5F7`. The wordmark renders as near-white on the near-black page. No `currentColor` override needed.

---

## 11. Prop intent

Dark mode is a CSS-only mechanism. No component props change. No new props are introduced. The media block and the class/attr selectors are both extensions of `tokens.css`, not component APIs.

---

## 12. Composition rules

The dark-mode token blocks compose with every existing component automatically. Components that correctly consume only `var(--token)` values require zero changes.

The only composition concern is the `html { color-scheme }` declaration — it must be `color-scheme: light dark` in the base token file so browser chrome (scrollbars, inputs, selects) matches the token-driven color scheme in OS-preference mode. Forced-mode `color-scheme` management is the consumer's responsibility per §6.

---

## 13. Open questions — component dark-mode audit

The following component files contain hardcoded color values that will NOT flip with the token block. These are not emergencies (the values are intentional inline decisions, documented in their respective specs), but they should be reviewed in a follow-up PR:

1. **`src/organisms/Dialog/Dialog.module.css:14`** — `background: rgb(0 0 0 / 0.4)` for the dialog scrim overlay. In dark mode this is visually acceptable (a black scrim over a black background), but the opacity may need adjustment (a lighter scrim might be needed over very dark content). Flagged; not blocking.

2. **`src/stories/showcase/Showcase.module.css:38–39`** — `--fg: #ffffff` and `--fg-muted: rgba(255, 255, 255, 0.62)` are local token overrides for the dark showcase preview bands. These are story-only, not shipped component code. No action required for production dark mode.

**Components with no hardcoded color values (verified clean):**

All atoms, molecules, and organisms in `src/atoms/`, `src/molecules/`, and `src/organisms/` — other than `Dialog.module.css` (scrim noted above) — consume only `var(--token)` references. The audit confirmed zero hardcoded hex values in any shipped component CSS module.

---

## 14. Out of scope

- JavaScript theme toggle UI (a `<ThemeToggle>` component, a button, a Switch atom wired to `setTheme`). The DS ships the CSS contract; the UI layer is the consumer's concern.
- Dark-mode image variants (AVIF/WebP alternatives for dark backgrounds). Site concern, not DS.
- Dark-mode SVG mark variants. The Wordmark uses `currentColor` and inverts cleanly. No action needed.
- Per-component dark-mode overrides. If a component breaks in dark mode, the fix is to replace the hardcoded value with a token, not to add a component-level media query override.
- Dark-mode for the warm-accent band: already handled via `--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted` token overrides.
- Scoping the forced mode below `:root`. All forced-mode activation is at `:root` (`<html>`). Sub-document theming (e.g. a dark widget embedded in a light page) is not in scope for this version.

---

## 15. Changelog

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                   | Author        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 2026-06-01 | Added §3 Manual toggle (selector strategy, override precedence, `:not()` scoping); §4 DRY decision (duplication rationale and maintenance discipline); §6 Consumer usage (JS toggle, SSR no-flash snippet, `color-scheme` handling in forced modes); promoted class toggle from non-goal to in-scope per ADR-0006 rev, issue #393; updated §2 Anatomy, §9 contrast table note, §11 Prop intent, §14 Out of scope; set status 2026-06-01. | poukai-design |
| 2026-05-19 | Initial spec. OS-preference dark mode via `@media prefers-color-scheme: dark`. Token contract, contrast table, elevation rhythm, component audit.                                                                                                                                                                                                                                                                                        | poukai-design |
