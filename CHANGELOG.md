# @poukai-inc/ui

## 2.6.0

### Minor Changes

- 852582b: feat(molecule): add StatList — grouped Stat row with rhythm and optional hairline dividers

  Groups two or more `Stat` atoms into a horizontal rhythm with consistent gap cadence (`--space-8` mobile, `--space-12` desktop). Optional `dividers` prop renders CSS-only hairline rules (`--hairline` / `--hairline-w`) between items via `::before` pseudo-elements. Collapses to a single column below `--bp-md`. Root renders `role="list"` with each item in `role="listitem"` for proper AT semantics.

## 2.5.0

### Minor Changes

- 339fc57: feat(molecule): add Caption — muted micro-tracked figure label

  Implements the Caption molecule per the approved spec at `meta/design/Caption.md`.
  Renders `<figcaption>` by default (semantic inside `<figure>`); polymorphic `as` prop
  accepts `"p"` or `"span"` for other contexts. Token-only CSS: `--font-sans`, `--fs-micro`,
  `--lh-meta`, `--tracking-micro`, `--fg-muted`. Zero new tokens introduced.

## 2.4.0

### Minor Changes

- 1a396a8: feat(molecule): add Breadcrumb — hierarchical location trail

  `<Breadcrumb>` renders a `<nav aria-label="Breadcrumb">` + `<ol>` + `<li>` item trail for nested dashboard and product routes. Supports compound `<Breadcrumb.Item>` children and a data-driven `items` prop. Separator is configurable (default `›`). Current (terminal) item carries `aria-current="page"` and is rendered as plain text, not a link. Full axe-core a11y pass, Playwright CT, and Ladle stories included.

  Closes #157.

## 2.3.0

### Minor Changes

- 0c8c980: feat(molecule): add Fieldset — groups related Field molecules under a semantic legend with consistent vertical spacing and optional bordered variant

## 2.2.0

### Minor Changes

- fd5eebf: feat(molecule): add TagList — canonical wrapper for a collection of Tag atoms

  Implements `TagList` per `meta/design/TagList.md` (Phase 2).
  - Flex-wrap layout with configurable `gap` (`"md"` = `--space-2`, `"sm"` = `--space-1`)
  - Optional `max` prop collapses surplus Tags into a `<Tag tone="muted">+{N}</Tag>` overflow pill (surplus children sliced from DOM, not hidden with CSS)
  - `forwardRef` to root `<div>`, full `...rest` spread for `data-*` / `aria-*` pass-through
  - Ladle stories: `Default`, `GapSm`, `WithMax`, `WithMaxExactBoundary`, `MixedTones`, `ArticleTagging`
  - Playwright CT: child rendering, max overflow behavior, overflow count accuracy, ref/className/data-\* forwarding
  - axe-core: 0 violations across default, overflow, and gap=sm mounts
  - No new tokens — consumes existing `--space-1`, `--space-2` from tokens.css

## 2.1.0

### Minor Changes

- 1f2f482: feat(molecule): add Byline — avatar + name + role + optional Time

## 2.0.1

### Patch Changes

- bd3b892: Fix license field: change from `UNLICENSED` to `SEE LICENSE IN LICENSE` and ship `LICENSE` file in the published tarball.

## 2.0.0

### Major Changes

- e8288b9: Drop auto-CSS-injection. Consumers must now import `@poukai-inc/ui/styles.css`.

  **Breaking change.** Prior versions injected each component's CSS into its
  own JS chunk via `vite-plugin-lib-inject-css`. That made every JS chunk
  side-effectful (the chunk contained `import "./Foo.css"`), which forced
  bundlers to retain _every_ component chunk for any single barrel import —
  tree-shaking the public barrel (`@poukai-inc/ui`) was effectively impossible.

  Per `import { NumberFormat } from "@poukai-inc/ui"`, the bundled output went
  from ~32 kB (whole library) to **267 B** in the latest build. The
  size-limit gate's four tree-shaken buckets are all comfortably back under
  budget.

  **Migration.** Add one CSS import at your app root next to the existing
  tokens import:

  ```ts
  // before — tokens only
  import "@poukai-inc/ui/tokens.css";

  // after — tokens + component styles
  import "@poukai-inc/ui/tokens.css";
  import "@poukai-inc/ui/styles.css";
  ```

  `styles.css` is the combined stylesheet for every atom / molecule / organism
  in the library (single file, ~52 kB raw / ~9 kB gzipped). No per-component
  imports are needed. Per-component CSS files are no longer emitted.

  **What also changed:**
  - Removed the `vite-plugin-lib-inject-css` dev dependency.
  - Set `cssCodeSplit: false` in `vite.config.ts` so Vite emits one combined
    `dist/styles.css` instead of per-chunk CSS imports.
  - Filled in missing per-component subpath entries in `vite.config.ts`
    (Code, Divider, Icon, IconButton, Image, Input, Kbd, Label, Link, Logo,
    Mark, ProgressBar, Prose, Radio, Select, Skeleton, SkipLink, Spinner,
    Switch, Text, Time, VisuallyHidden, Banner, Field, Input/Textarea molecule
    shims, Form, Tabs, Toast). Earlier these atoms were being inlined into
    `dist/index.js` instead of emitted as standalone chunks — the
    `package.json` subpath exports already pointed at JS files that did not
    exist on disk. Subpath imports such as
    `import { Radio } from "@poukai-inc/ui/atoms/Radio"` now resolve to a
    real chunk file.

### Minor Changes

- 8b03f7e: Add Radio + RadioGroup atoms — Radix RadioGroup wrap

  Mutually-exclusive selection primitive wrapping `@radix-ui/react-radio-group` (`Root` + `Item` + `Indicator`). Radix supplies `role="radiogroup"` / `role="radio"`, roving-tabindex keyboard navigation (ArrowDown/ArrowUp for vertical, ArrowLeft/ArrowRight for horizontal), and `aria-checked` propagation.

  `RadioGroup` props: `value` / `defaultValue` / `onValueChange`, `name`, `orientation` (`"vertical"` default, `"horizontal"`), `disabled`, `required`, and one of `aria-label` / `aria-labelledby` (dev-mode warning when neither is supplied). `Radio` items take `value` (required), `disabled`, `id`, and forward `data-*` / `aria-*` attributes.

  Indicator dot is a CSS `::after` pseudo on the Radix `Indicator` slot — no Lucide, no SVG, no `<Icon>`. Label pairing is always a consumer responsibility (wrap with `<label>` or pass `aria-label` per item). `forwardRef` to root `<div>` (RadioGroup) and `<button>` (Radio).

  `@radix-ui/react-radio-group@^1.3.8` added to dependencies.

  Subpath export `./atoms/Radio` added to `package.json`. Design spec at `meta/design/Radio.md`.

- 7c82b50: Add Switch atom — Radix Switch wrap

  Boolean-toggle primitive wrapping `@radix-ui/react-switch`. Track (32×18px pill) + thumb (14px circle) animated via `transform: translateX()` only. Token-driven states (off/on/hover/focus/disabled). Reduced-motion handled by global `tokens.css` block. `forwardRef` to root button. Label always external.

## 1.10.0

### Minor Changes

- b3f0008: Add Checkbox atom — Radix Checkbox wrap.

  Wraps `@radix-ui/react-checkbox` (`Checkbox.Root` + `Checkbox.Indicator`). Supports
  unchecked / checked / indeterminate states via Radix `CheckedState` (`boolean | "indeterminate"`).

  `CheckboxCheckedState` is re-exported for consumer convenience.

  Fixed 16×16px (`--icon-sm`) footprint with `--radius-1` (2px). No size variants.
  Token contract: `--bg`, `--fg`, `--hairline`, `--fg-muted`, `--danger`, `--accent`,
  `--radius-1`, `--icon-sm`, `--dur-fast`, `--easing`. No new tokens introduced.

  Visual states: unchecked (resting), hover-unchecked, checked, indeterminate,
  disabled (opacity 0.5), invalid (`aria-invalid="true"` → `--danger` border).
  Transitions on `background-color` and `border-color` at `--dur-fast` only.

  Indicator glyphs: Lucide `Check` (checked, 12px) and `Minus` (indeterminate, 12px),
  both `aria-hidden="true"`. State is announced via Radix-managed `aria-checked`.

  Label-agnostic: supply `aria-label` directly or wire `<label htmlFor={id}>` at the
  molecule layer. `forwardRef` to root `<button>`, `displayName = "Checkbox"`.

  Note: CT assertions use Radix `data-state` attribute (canonical contract) rather than
  Lucide icon DOM presence. See BACKLOG.md §Blocking. Icon-presence assertions deferred
  until the blocker resolves.

  `@radix-ui/react-checkbox@^1.1.0` added to dependencies.

## 1.9.0

### Minor Changes

- 80d18e6: Add `Logo` atom — partner-logo cell with tone + size scale.
  - Composes `<Image>` internally; no extra DOM wrapper — the root is always the `<img>`.
  - `tone` prop (`"color"` | `"mono"` | `"muted"`, default `"mono"`): `"color"` renders as-is; `"mono"` applies `grayscale(1) brightness(0)` for a black silhouette; `"muted"` adds 0.55 opacity at rest with hover/focus-visible reveal to full opacity.
  - `size` prop (`"sm"` | `"md"` | `"lg"`, default `"md"`): constrains rendered height via `max-height` — 24px / 32px / 40px respectively. Width is always auto.
  - `width` / `height` optional props (defaults 200 × 80) passed to `<Image>` for CLS-safe `aspect-ratio` reservation. Override with true intrinsic dimensions when known.
  - Hover/focus-visible contract on `tone="muted"`: `opacity: 1`, transition `opacity var(--dur-fast) var(--easing)`. Reduced-motion handled globally via `tokens.css`.
  - No new tokens introduced — reuses `--dur-fast` and `--easing`.
  - `forwardRef<HTMLImageElement>`, `displayName="Logo"`, full `...rest` spread via `<Image>`.
  - Full Playwright CT suite (14 cases): render, src/alt, default tone/size classes, all tone classes, size max-height values, muted hover opacity, ref forwarding, className merge, width/height defaults.
  - Added to `src/a11y.test.tsx` central gate (4 cases: default, tone=color, tone=muted, all sizes).
  - Subpath export `./atoms/Logo` added to `package.json`.

- e77e5f9: Add `ProgressBar` atom — linear progress with determinate + indeterminate modes.
  - Determinate mode: `value` prop (0–100, clamped). Fill uses `transform: scaleX` driven by a CSS custom property (`--progress-fraction`). Never animates `width` — compositor-only motion contract.
  - Indeterminate mode: two bars (`poukai-progress-bar1` / `poukai-progress-bar2`) sweep left→right using `translateX` keyframes at `--dur-progress-indeterminate` (1400ms) with `--easing` (expo-out). Bar 2 starts at `translateX(-200%)` to eliminate dead-track gaps.
  - Reduced-motion (indeterminate): animated bars hidden; a static `scaleX(0.5)` fill revealed via CSS-only toggle. Reduced-motion (determinate): transition removed (snap).
  - Four tones: `default` (`--fg`), `success` (`--success`), `warning` (`--warning`), `danger` (`--danger`). Two sizes: `sm` (2px track), `md` (4px track, default).
  - Labeling enforced at TypeScript type level: exactly one of `aria-label` / `aria-labelledby` required via discriminated union.
  - `aria-valuenow` omitted entirely when indeterminate (not set to `undefined` — attribute absent from DOM).
  - Full Playwright CT suite: ARIA contract, tone colors, size heights, transform regression guard (no `width`), animation token regression (1400ms), reduced-motion assertions (staticFill at scaleX(0.5), bars hidden), axe scans (aria-label + aria-labelledby × determinate + indeterminate).
  - Added to `src/a11y.test.tsx` central gate (6 cases covering all tones, both labeling strategies, reduced-motion).
  - New tokens added to `src/tokens/tokens.css`:
    - `--success: #248a3d` / `--bg-success: #f0faf3` / `--fg-on-success: #0d3d1e` (light)
    - `--success: #30d158` / `--bg-success: #041a09` / `--fg-on-success: #a8f0be` (dark)
    - `--dur-progress-indeterminate: 1400ms`

- b2ec61a: Add `Select` atom — native styled `<select>` with sm/md/lg sizes and CSS-painted caret.
  - Root is always `<select>`. Non-polymorphic. Ref forwarded to `HTMLSelectElement`. Children are consumer-supplied `<option>` / `<optgroup>` nodes.
  - `size` prop (`"sm"` | `"md"` | `"lg"`, default `"md"`): visual height via shared `--btn-h-*` ladder — aligns with `<Input>` and `<Button>` at matching nominal sizes.
  - `invalid` prop: sets `data-invalid="true"` and `aria-invalid="true"`; border → `--danger`. Wire through `<Field error="…">` for full label + describedby integration.
  - Trailing caret: chevron-down rendered via CSS `background-image` SVG data URL (16×16, 1.5px round stroke). Color hardcoded per color scheme (`#1d1d1f` light, `#f5f5f7` dark) — `currentColor` is unavailable in SVG background images. RTL flips caret to inline-start. `[multiple]` hides caret and restores native appearance.
  - Visual register matches `Input` exactly: same border, radius, focus ring, hover state, disabled treatment, and token surface. No new tokens introduced.
  - `Omit<ComponentPropsWithoutRef<"select">, "size">` spread — native `size` attribute intentionally shadowed by DS `size` prop.
  - Full Playwright CT suite: render, root tag, children, size classes, invalid attrs, disabled, defaultValue, controlled value, className merge, prop forwarding (data-_, aria-_, required, name, multiple), ref forwarding, label association, keyboard arrow navigation, axe clean (default, invalid, disabled, sm, lg, multiple).
  - Added to `src/a11y.test.tsx` central gate (3 cases: default, invalid, Field composition).
  - Subpath export `./atoms/Select` added to `package.json`.
  - Design spec at `meta/design/Select.md`.

- fb79b19: Add `Spacer` atom — explicit-gap element for contexts where flex/grid `gap` cannot reach.

  `Spacer` is a deliberately minimal atom: one required prop (`size`, closed union `"1" | "2" | "3" | "4" | "6" | "8" | "10"` mapped to `--space-1` … `--space-10`), one optional axis (`axis="block"` default, `axis="inline"`), and one optional element variant (`as="div"` default, `as="span"`). It always renders `aria-hidden="true"`, owns no background, border, motion, or content — it occupies space and nothing else.

  The size union is intentionally clamped to atom-tier spacing tokens. Layout-tier values (`--space-12`+) are excluded by design: a 3rem+ explicit gap is the wrong shape for an inline atom — that decision belongs to a section or template primitive.

  Canonical use is inside `<Prose>` long-form HTML where the parent context does not own layout, between conditionally-rendered siblings where a stable spacer slot is needed, and inside legacy block containers where `gap` is architecturally unavailable. Do not use between flex/grid siblings (use `gap`), for section-tier rhythm (use Section padding), or as a vertical typography hack (fix the type ramp).

  No new tokens are introduced.

- 1b39b93: Lift `Input` to the atom layer.

  `Input` is now an atom at `src/atoms/Input/` with a new `size` prop (`"sm" | "md" | "lg"`, default `"md"`) that maps to the shared `--btn-h-*` height ladder, so `<Input>` visually pairs with `<Button>` at matching sizes.

  **Migration:** consumers importing from `@poukai-inc/ui/molecules/Input` should switch to `@poukai-inc/ui/atoms/Input`. The `./molecules/Input` subpath and the root `@poukai-inc/ui` export are unchanged in 1.x. The molecule path will be removed in 2.0.

  ```diff
  - import { Input } from "@poukai-inc/ui/molecules/Input";
  + import { Input } from "@poukai-inc/ui/atoms/Input";
  ```

- be5c0ce: Lift `Textarea` to the atom layer.

  `Textarea` is now a true atom under `src/atoms/Textarea/` — a pure styled `<textarea>` primitive that owns visual register, focus choreography, and invalid styling, and nothing else. Label / helper text / error message continue to live in `<Field>`. Canonical import paths:

  ```ts
  import { Textarea } from "@poukai-inc/ui";
  // or
  import { Textarea } from "@poukai-inc/ui/atoms/Textarea";
  ```

  **New / changed surface**
  - New prop `resize: "vertical" | "none" | "both"` — maps directly to CSS `resize`. Default `"vertical"`.
  - Default `rows` is now `3` (was `4`). Consumers depending on the previous default can pass `rows={4}` explicitly.
  - Padding is symmetric — `--space-3` on all four sides. Previously block/inline padding were asymmetric (`--space-2` / `--space-3`). The new contract gives multi-line content equal vertical headroom and is the only visual delta from the prior molecule.
  - Hard-coded `min-height` rule (4 × line-height of body) is removed. `rows` is now the canonical height knob.
  - Invalid state uses `--danger` (introduced in 1.3.0). Prior molecule already aligned with this token; no consumer-visible change beyond the layer move.

  **Migration**

  `@poukai-inc/ui/molecules/Textarea` is kept as a `@deprecated` re-export shim that points at the atom. Existing imports continue to compile and render identically. The shim will be removed in **v2.0** — migrate to either the root export (`@poukai-inc/ui`) or the atom subpath (`@poukai-inc/ui/atoms/Textarea`).

  **Not included**
  - No autosize / content-height tracking. A future `useAutosizeTextarea` utility hook will compose on top of the atom; tracked separately.
  - No character-count display. Consumer responsibility.

## 1.8.0

### Minor Changes

- 5d80026: Add `Mark` atom — editorial `<mark>` highlight.

  `Mark` is the canonical inline highlight chip for long-form prose. It replaces the ad-hoc inline `<span style="background: …">` overrides that editorial surfaces (Pull, Quote, FieldNote, FeatureCard body, Prose) had been using to flag a run of text as "the part the reader should notice."

  The chip tints the background with `--accent-glow` (the same low-opacity blue the system uses for `::selection`) so the highlight reads as kindred to selected prose rather than as a foreign decoration. Padding is inline-only (`--space-1`) so the highlight preserves text baseline alignment in running prose; the corner is rounded with `--radius-1` (2px) — softer than a selection-rect, far short of a pill. `box-decoration-break: clone` (with the WebKit prefix) ensures the highlight tiles cleanly across line wraps.

  Root is always `<mark>` (non-polymorphic). Non-interactive — no hover, focus, or active states. Inherits `font-family`, `font-size`, `font-weight`, `line-height`, and `color` from the surrounding context, so the chip scales with parent text on every surface and resolves correctly inside the warm editorial band. `--accent-glow` already flips under `prefers-color-scheme: dark` via the global `:root` block, so no per-component dark-mode override is required.

  No new tokens are introduced. Spec: `meta/design/Mark.md`.

- 67313e4: Add `NumberFormat` atom — pure presentational formatter backed by native `Intl.NumberFormat`.

  Renders a `number` value as a locale-correct string and nothing else. Owns no tokens, no CSS, no layout. Lifts the formatter previously inlined in `Stat`/`StatList` consumers into a single canonical primitive so every editorial surface formats numbers identically.

  Props: required `value: number`; optional `notation` (`"standard"` (default — grouped digits) | `"compact"` (`1.2M`) | `"currency"` (requires `currency`) | `"percent"` (multiplies by 100 — pass `0.42` to render `42%`)), `currency` (ISO 4217 — required when `notation="currency"`), `locale` (BCP-47 — pass explicitly for SSR safety), `minimumFractionDigits` / `maximumFractionDigits` passthrough, polymorphic `as` (`"span"` (default) | `"div"` | `"dd"`, closed union). `className`, `data-*`, `aria-*`, `id`, `ref` all forwarded. No `children` (value is the rendered content).

  SSR-safe: output is `new Intl.NumberFormat(locale, options).format(value)` computed once during render — no `useEffect`, no `navigator.language`. Pass `locale` explicitly in i18n-aware surfaces to guarantee server/client parity.

  Edge values: `NaN` → "NaN", `±Infinity` → "∞" / "-∞" (whatever the Intl runtime emits — assertions in the test suite compare against `Intl.NumberFormat(...).format(NaN)` rather than literals, so the atom remains stable across Node and browser engines).

  Follow-up (separate PR): migrate `Stat.value` consumers to use `NumberFormat`.

- 30913f0: Add SkipLink atom — keyboard skip-to-content anchor.

  Visually hidden at rest (canonical sr-only clip pattern), becomes a
  fixed-position high-contrast pill when keyboard-focused. The standard a11y
  primitive for layout shells: lets keyboard users bypass nav and chrome to
  jump straight to the page's main content region.

  Root is always `<a>`, non-polymorphic — fragment navigation is anchor
  semantics, full stop. `href` (required) is the consumer-supplied fragment
  target (e.g. `#main`). `children` defaults to `"Skip to content"`; override
  for layouts with multiple navigable regions.

  Focused pill uses the DS-wide max-contrast inversion pair (`--fg` on `--bg`,
  ~16:1 AAA), `z-index: 9999` so it can never be occluded by Dialog or Toast
  layers, and `outline: none` because the high-contrast pill itself is the
  focus indicator (documented deviation from the global `a:focus-visible`
  accent ring). No motion. No `:hover` style — keyboard-only by design.

  Composes neither `<Link>` nor `<VisuallyHidden>`: owns its own clip + focus
  CSS in one module so the `:focus-visible` un-clip rule does not fight
  cross-module specificity. `forwardRef<HTMLAnchorElement, SkipLinkProps>`,
  `displayName="SkipLink"`.

  Spec: `meta/design/SkipLink.md`.

  **Migration note:** SiteShell consumer migration is a follow-up audit PR —
  this PR ships the atom only and does not modify SiteShell.

- 570d39f: Add `Time` atom — semantic `<time datetime>` with locale-aware formatted label.

  **New exports**: `Time`, `TimeProps`, `TimeFormat`.

  **Four format modes** via native `Intl` only (no external date library):
  - `absolute` (default) — `Intl.DateTimeFormat` short month + day + year: `May 21, 2026`.
  - `relative` — `Intl.RelativeTimeFormat` with descending threshold table (year → month → week → day → hour → minute → "just now" for |diff| < 60 s).
  - `long` — `Intl.DateTimeFormat` long month + year: `May 2026`.
  - `time-only` — `Intl.DateTimeFormat` hour + minute: `02:30 PM`.

  **`dateTime` prop** accepts `string | Date`. String values pass verbatim to the `datetime` attribute (date-only strings such as `"2026-05-21"` are not round-tripped through `new Date()`). `Date` objects serialize via `.toISOString()`.

  **`children` override**: when `children` is provided, it replaces the computed label; `format` and `locale` are ignored. The `datetime` attribute still emits the ISO string.

  **SSR contract**: locale defaults to `navigator.language` in the browser and `"en-US"` on the server. `format="relative"` is not guaranteed to match between server and client; consumers requiring stable SSR for relative labels should provide `children` or use `format="absolute"`.

  **A11y posture**: no `aria-label` injection, no motion, no color variants. The component inherits `color: inherit`. Zero new tokens.

  **Subpath export**: `@poukai-inc/ui/atoms/Time`.

  Downstream consumers: `Byline`, `ArticleHeader`, `TimelineItem`.

## 1.7.0

### Minor Changes

- cdbf290: Add `Image` atom — token-aware plain-image primitive with CLS-safe sizing.

  `Image` is the single-URL static-asset primitive: logos, screenshots, illustrations, decorative photography. Root is `<img>` (non-polymorphic, no wrapper). Required props are `src`, `alt` (empty string allowed for decorative — required at the type level), `width`, and `height` — the numeric dimensions drive both the HTML `width`/`height` attributes and an inline `aspect-ratio` style so the browser reserves the correct vertical slot before any image bytes arrive.

  Optional `loading` defaults to `"lazy"`, `decoding` defaults to `"async"`. `fit` maps to `object-fit` (no DS default — when omitted, the browser's CSS default applies). `radius` (`"none"` | `"sm"` | `"md"` | `"lg"`) maps to the existing `--radius-1`/`--radius-2`/`--radius-3` scale; default is `"none"`.

  Inline-style baseline (always applied): `max-width: 100%`, `height: auto`, `aspect-ratio: width/height` — the minimum contract for CLS-safe responsive images. No new tokens introduced.

  `Image` is intentionally distinct from `Portrait`. Portrait owns editorial photography with AVIF/WebP/JPEG srcset and `<picture>`; `Image` is the plain single-URL atom. Reach for `Portrait` when the asset requires srcset, format negotiation, or editorial photographic semantics.

## 1.6.0

### Minor Changes

- 3d52c5a: Add Label atom — form label primitive that binds to its control via `htmlFor`, with optional `required` indicator and `muted` tone variant.

### Patch Changes

- 2388e3d: Docs/CI: backfill `meta/llms-full.txt` sections for `Heading`, `Text`, `Prose`, `Code`, `Kbd` atoms (previously merged via #111–#114 without llms-sync entries), wire `check-llms-tokens-sync` into CI as `pnpm check:llms`, and fix a silent false-pass in the checker where `### Text` matched `### Textarea` via substring `includes()` — replaced with a line-anchored regex (`^### <Name>(?:\s|$)`). No runtime API change.

## 1.5.0

### Minor Changes

- 077438a: Add IconButton atom — square, icon-only interactive primitive. Composes Button
  (variant / state / focus / disabled), Icon (glyph slot), and VisuallyHidden
  (belt-and-suspenders accessible name).

  Same `variant` union (`primary` / `secondary` / `ghost`) and same `size` ladder
  (`sm` 32 px / `compact` 40 px / `md` 44 px / `lg` 52 px) as Button — driven by
  the shared `--btn-h-*` token rungs so IconButton and Button read as one family
  on a shared surface.

  `aria-label` is **required** at the type level (`Omit<…, "aria-label">` +
  mandatory string field). The same label is rendered into a `VisuallyHidden`
  child for assistive-tech variants that prefer inner text over `aria-label`.
  Icon size resolves automatically per Button size (`sm`→16 px, `compact`/`md`→
  20 px, `lg`→24 px).

  `forwardRef` to the underlying `<button>` host (via Button's ref forwarding);
  `...rest` forwarded so consumers can pass `data-*`, `onClick`, `disabled`, etc.
  No `asChild` in v1 — anchor-as-icon-button is a separate concern (SkipLink).

  Spec: `meta/design/IconButton.md`.

## 1.4.0

### Minor Changes

- 64645b2: Add `Code` and `Kbd` atoms — inline literal-quotation and keyboard-key glyph chips.

  **`Code`** — inline `<code>` chip for variable names, CSS custom properties, HTML element names, shell commands. Root is `<code>` (non-polymorphic). `--surface` background, `--fg` text, no border, `--radius-2` corner, monospace `--font-mono` at `0.9em` so the chip tracks the surrounding text register on any surface (body copy, pull-quote, field note). Inline-only `--space-1` padding preserves text baseline.

  **`Kbd`** — keyboard-key glyph for shortcut hints (`⌘`, `K`, `Enter`, `Esc`). Root is `<kbd>` (non-polymorphic). Same `--surface` family as `Code`, plus a 1px `--hairline` border for the key-cap reading. Monospace at `0.85em` and `font-weight: 500` to disambiguate from `Code` at a glance. `min-width: 1.5em` preserves a square-ish silhouette for single-character keys. Multi-key combinations are composed by the consumer as side-by-side `<Kbd>` instances; the DS does not own combination semantics.

  Both atoms are non-interactive (no hover/focus/active states), non-polymorphic, introduce zero new tokens, and resolve correctly in dark mode via the global `:root` block.

- 64645b2: Add `Divider` atom — hairline separator rule.

  Props: `orientation` (`"horizontal"` | `"vertical"`, default `"horizontal"`), `tone` (`"default"` | `"muted"`), `as` (`"hr"` | `"div"`, defaults from orientation). Horizontal defaults to `<hr>` (implicit `role="separator"`); vertical defaults to `<div role="separator" aria-orientation="vertical">`. Zero self-margin — parent layout controls spacing.

  Introduces `--hairline-soft` token (light: `#E5E5EA`, dark: `#3A3A3C`) for the `tone="muted"` variant.

  **Not included in this PR:** migration of the 10 existing inline-hairline call sites enumerated in `meta/design/Divider.md §9` (`FailureMode`, `Principle`, `Statement`, `RoleCard`, `LinkCard`, `Quote`, `SiteShell`, `Footer`, `Tabs`, `Dialog`). Those remain as-is; migration to `<Divider>` is a follow-up engineering task.

- e3c9aff: Add `Heading` atom — canonical `h1`–`h6` type-ramp wrapper.

  Props: `as` (`"h1"` … `"h6"`, default `"h2"`) drives the rendered HTML element and document outline; `size` (`"h1"` … `"h6"`, defaults to the value of `as`) drives the visual rank. The two are decoupled so consumers can render an `<h1>` styled at H3 visual rank (or vice versa) without breaking accessibility. `forwardRef` to the underlying heading element, plus standard `className` / `id` / `data-*` / `aria-*` forwarding.

  Introduces six new tokens — `--fs-h1` … `--fs-h6` — for the canonical heading ramp. `--fs-h1` aliases `--fs-tagline` (display ceiling shared with `<Hero>`); `--fs-h6` aliases `--fs-meta` (bottom of the ramp = meta-text rung). `--fs-h2` and `--fs-h3` are lifted verbatim from the current `tokens.css` global `h2` / `h3` rules — zero visual drift on existing consumers. `--fs-h4` (`1rem`) and `--fs-h5` (`0.9375rem`) are new rungs.

  **Not included in this PR:** migration of raw `<h1>` / `<h2>` / `<h3>` usage inside molecules (`Hero`, `Section`, `RoleCard`, `Principle`, etc.) to `<Heading>`. The global `tokens.css` heading rules stay in place so existing markup continues to render correctly. Migration is a follow-up engineering task.

- 64645b2: Add Icon atom — thin wrapper over `lucide-react` LucideIcon (consumer brings the icon).

  Accepts any `LucideIcon` via the `icon` prop. Size scale maps `xs/sm/md/lg` to
  `--icon-xs` (12 px) / `--icon-sm` (16 px) / `--icon-md` (20 px) / `--icon-lg` (24 px)
  via token-backed CSS classes. Color is always `currentColor` so icons inherit text
  color from parent. `strokeWidth` defaults to `1.5` per brand spec.

  Accessibility: `decorative={true}` (default) sets `aria-hidden="true"` + `focusable="false"`.
  `decorative={false}` requires `aria-label` and sets `role="img"` + `focusable="false"`;
  omitting the label is a runtime console.error.

  `forwardRef` to SVG root; `...rest` forwarded so consumers can pass `data-*`, `aria-*`,
  and any SVG attribute.

- 64645b2: Add `Link` atom — canonical styled anchor with three variants and `asChild` Radix Slot composition.

  **What ships:**
  - `<Link href variant="default|quiet|muted-link" asChild>` — named, versioned anchor atom in `src/atoms/Link/`.
  - `variant="default"` — two-layer underline grow (accent over hairline), direct transcription of the global `a` rule in `tokens.css`.
  - `variant="quiet"` — single-layer underline on hover only; no hairline at rest. Correct technique: pre-declared 0%-wide accent layer so the grow interpolates rather than snaps.
  - `variant="muted-link"` — `color: var(--fg-muted)` at rest, `color: var(--fg)` on hover, plain `color` transition. Byte-for-byte match of the global `.muted-link` utility class — the migration target for `SiteShell`, `Footer`, and story fixtures.
  - `asChild` via `@radix-ui/react-slot` — compose DS styles onto a framework router Link (Next.js, Remix, etc.).
  - Auto `rel="noopener noreferrer"` when `target="_blank"` and no explicit `rel` is provided; consumer-supplied `rel` always wins.
  - `href` is required at the TypeScript level (`Omit<AnchorHTMLAttributes, 'href'> & { href: string }`).
  - Exported from `@poukai-inc/ui`, `@poukai-inc/ui/atoms`, and `@poukai-inc/ui/atoms/Link` subpath.

  **Migration note — global `.muted-link` class:**
  The `.muted-link` global utility class in `src/tokens/tokens.css` is NOT removed in this PR. Confirmed call sites (`SiteShell.tsx`, `Footer.tsx`, `SiteShell.stories.tsx`, `a11y.test.tsx`, and others) must migrate to `<Link variant="muted-link">` in a follow-up audit PR with Arian's sign-off, after confirming no remaining consumers in the site repo reference the global class directly.

- 92e5401: Add `Prose` atom — typographic context wrapper for long-form HTML.

  **What ships:**
  - `<Prose width="full|reading" asChild>` — named, versioned atom in `src/atoms/Prose/`.
  - Single root class scopes the canonical type contract to descendant HTML primitives: `h1`–`h6`, `p`, `p.lede`, `ul`, `ol`, `li`, `blockquote` (with `cite`), `code`, `pre`, `kbd`, `hr`, `figure`, `figcaption`, `img`, `video`, `table` / `thead` / `th` / `td` / `caption`, `strong`, `em`, `small`. Markdown output and CMS body fields drop in without per-element class plumbing.
  - Element rules authored with `:where(...)` to keep specificity at `0,0,1`; consumer overrides via a single `className` always win.
  - Vertical rhythm declared as **top-margins on adjacent siblings** (`> :where(*) + :where(*)`) rather than bottom-margins on every element — eliminates leading/trailing margin collapse and keeps Prose composable inside flex/grid columns.
  - `width="reading"` opts into the canonical editorial column at `64ch` (inside the 45–75 CPL band) with `margin-inline: auto`. `width="full"` (default) inherits the column from the parent layout.
  - `asChild` via `@radix-ui/react-slot` — compose Prose styles onto `<article>`, `<section>`, or any semantically richer block element.
  - Heading lead-in cadence per `meta/design/Prose.md` §3: `--space-10` before `h1`, `--space-8` before `h2`/`h3`, `--space-6` before `h4`–`h6` and block elements (`blockquote`, `pre`, `figure`, `table`, `hr`); tightened `--space-3` for heading → paragraph transition; `--space-4` default flow.
  - Exported from `@poukai-inc/ui`, `@poukai-inc/ui/atoms`, and `@poukai-inc/ui/atoms/Prose` subpath.

  **No new tokens.** Every value reads from `src/tokens/tokens.css`. The `64ch` reading column is the only `ch`-unit use in the DS — see `meta/design/Prose.md` §3 for the rationale.

  **Design spec:** `meta/design/Prose.md` (10 sections; Approved status).

- 64645b2: Add Skeleton atom — content placeholder for async data loads.

  Single element with `--surface` background fill, opacity pulse animation
  (`poukai-skeleton-pulse` at `--dur-pulse` 1800ms, `ease-in-out`, infinite),
  radius variants (`sm`/`md`/`lg`/`circle`), `as="div"|"span"` for block/inline
  contexts, and explicit reduced-motion final state (`animation: none; opacity: 0.6`).

  NO shimmer. Opacity pulse only, per the motion banlist in BACKLOG.md §Motion:
  "Skeleton shimmer that's prettier than the loaded state." No gradient, no
  background-position animation, no moving gradient layer at any point.

  `aria-hidden="true"` by default — decorative placeholder. Consumer owns
  `aria-busy` on the loading region container.

  Also fixes a pre-existing `TS2322` ref-cast error in `VisuallyHidden`
  (`as unknown as React.Ref<HTMLDivElement>`) that was blocking `tsc`.

- 64645b2: Add `Spinner` atom — indeterminate loading indicator.
  - Inline SVG arc (track at 0.2 opacity + rotating arc at full opacity), `currentColor` throughout so it adapts to any surface without a color prop.
  - Three sizes: `sm` (16px), `md` (20px, default), `lg` (24px) — matched to the icon size token scale (`--icon-sm`, `--icon-md`, `--icon-lg`).
  - Rotation driven by new `--dur-spinner: 800ms` motion token (added to `tokens.css` by `poukai-design`); `linear` easing for a smooth continuous loop.
  - `role="status"` + `aria-live="polite"` + `aria-label` on the host `<span>`; visually-hidden text sibling for virtual browse mode.
  - Reduced-motion fallback: explicit `animation: none` on the arc (belt-and-suspenders over the global `tokens.css` collapse) plus a CSS-only `…` ellipsis revealed only under `prefers-reduced-motion: reduce` — no JS branching, no DOM structure change.
  - Full Playwright CT test suite (render, sizes, label, ref forwarding, className merge, rest props, animation token regression, reduced-motion assertions, axe scans).
  - Added to `src/a11y.test.tsx` central gate (default, all sizes, custom label, reduced-motion).

- e6899a1: Add Text atom — canonical paragraph primitive.

  Resolves the three ad-hoc patterns currently sprinkled across molecules — raw
  `<p>` tags, the `.lede` utility, and inline muted `<p style>` overrides — into
  one component with orthogonal `size` and `tone` axes.

  `size`: `body` (default) / `lede` / `caption` / `micro`. Sizes map to existing
  `--fs-*` and `--lh-*` tokens; `lede` adds `max-inline-size: 36rem` matching the
  current `.lede` utility. No new tokens introduced.

  `tone`: `default` / `muted` / `on-warm` / `on-warm-muted`. Maps to `--fg`,
  `--fg-muted`, `--fg-on-warm`, `--fg-on-warm-muted` respectively. The
  `on-warm-muted` tone is a brand-sanctioned decorative ceiling (~3.9:1 contrast,
  below WCAG AA 4.5:1 for normal text) — its axe scan disables the
  `color-contrast` rule, matching the documented brand-tier exception in
  `meta/brand.md`. All other tone/size pairings meet AA on their intended
  surfaces.

  `as`: closed union `p` (default) / `span` / `div` / `dt` / `dd` / `li`.
  Headings excluded — reserved for a future `<Heading>` atom. Polymorphic
  implementation follows the `<Eyebrow>` switch-based pattern.

  `margin: 0` invariant — consumer owns vertical rhythm via parent layout.
  No `text-transform: uppercase` — the uppercase-tracked register belongs to
  `<Eyebrow>`; `<Text size="micro">` is lowercase footnote scale.

  Spec: `meta/design/Text.md`. Molecule adoption (Hero, FieldNote, RoleCard,
  Footer, FailureMode) is a separate follow-up PR — this change only ships the
  atom and registers it in `src/index.ts`, `src/atoms.ts`, and the
  `./atoms/Text` subpath export.

- 64645b2: Add `VisuallyHidden` atom — the canonical sr-only clip-pattern primitive for `@poukai-inc/ui`.

  Renders children in the accessibility tree (screen-reader-readable, announced by assistive technology) while remaining completely invisible to sighted users via the WCAG/Bootstrap/Tailwind canonical clip pattern. Invariant: no tokens, no variants, no motion.
  - `as?: "span" | "div"` closed union (default `"span"`) for inline vs block-level contexts
  - `...rest` forwarded to root — use `id` for `aria-labelledby`/`aria-describedby`, `aria-live` for live-region announcements
  - `className` merged additively; internal clip class has dedicated specificity
  - Zero axe violations across default span, div variant, and `aria-live` usage
  - First-party consumers: `IconButton`, `Dialog` close label, `SkipLink` (hidden base), `Carousel` slide counter

## 1.3.0

### Minor Changes

- 9bddd36: Add `Divider` atom — hairline separator rule.

  Props: `orientation` (`"horizontal"` | `"vertical"`, default `"horizontal"`), `tone` (`"default"` | `"muted"`), `as` (`"hr"` | `"div"`, defaults from orientation). Horizontal defaults to `<hr>` (implicit `role="separator"`); vertical defaults to `<div role="separator" aria-orientation="vertical">`. Zero self-margin — parent layout controls spacing.

  Introduces `--hairline-soft` token (light: `#E5E5EA`, dark: `#3A3A3C`) for the `tone="muted"` variant.

  **Not included in this PR:** migration of the 10 existing inline-hairline call sites enumerated in `meta/design/Divider.md §9` (`FailureMode`, `Principle`, `Statement`, `RoleCard`, `LinkCard`, `Quote`, `SiteShell`, `Footer`, `Tabs`, `Dialog`). Those remain as-is; migration to `<Divider>` is a follow-up engineering task.

- 9bddd36: Add Icon atom — thin wrapper over `lucide-react` LucideIcon (consumer brings the icon).

  Accepts any `LucideIcon` via the `icon` prop. Size scale maps `xs/sm/md/lg` to
  `--icon-xs` (12 px) / `--icon-sm` (16 px) / `--icon-md` (20 px) / `--icon-lg` (24 px)
  via token-backed CSS classes. Color is always `currentColor` so icons inherit text
  color from parent. `strokeWidth` defaults to `1.5` per brand spec.

  Accessibility: `decorative={true}` (default) sets `aria-hidden="true"` + `focusable="false"`.
  `decorative={false}` requires `aria-label` and sets `role="img"` + `focusable="false"`;
  omitting the label is a runtime console.error.

  `forwardRef` to SVG root; `...rest` forwarded so consumers can pass `data-*`, `aria-*`,
  and any SVG attribute.

- 9bddd36: Add `Link` atom — canonical styled anchor with three variants and `asChild` Radix Slot composition.

  **What ships:**
  - `<Link href variant="default|quiet|muted-link" asChild>` — named, versioned anchor atom in `src/atoms/Link/`.
  - `variant="default"` — two-layer underline grow (accent over hairline), direct transcription of the global `a` rule in `tokens.css`.
  - `variant="quiet"` — single-layer underline on hover only; no hairline at rest. Correct technique: pre-declared 0%-wide accent layer so the grow interpolates rather than snaps.
  - `variant="muted-link"` — `color: var(--fg-muted)` at rest, `color: var(--fg)` on hover, plain `color` transition. Byte-for-byte match of the global `.muted-link` utility class — the migration target for `SiteShell`, `Footer`, and story fixtures.
  - `asChild` via `@radix-ui/react-slot` — compose DS styles onto a framework router Link (Next.js, Remix, etc.).
  - Auto `rel="noopener noreferrer"` when `target="_blank"` and no explicit `rel` is provided; consumer-supplied `rel` always wins.
  - `href` is required at the TypeScript level (`Omit<AnchorHTMLAttributes, 'href'> & { href: string }`).
  - Exported from `@poukai-inc/ui`, `@poukai-inc/ui/atoms`, and `@poukai-inc/ui/atoms/Link` subpath.

  **Migration note — global `.muted-link` class:**
  The `.muted-link` global utility class in `src/tokens/tokens.css` is NOT removed in this PR. Confirmed call sites (`SiteShell.tsx`, `Footer.tsx`, `SiteShell.stories.tsx`, `a11y.test.tsx`, and others) must migrate to `<Link variant="muted-link">` in a follow-up audit PR with Arian's sign-off, after confirming no remaining consumers in the site repo reference the global class directly.

- 9bddd36: Add Skeleton atom — content placeholder for async data loads.

  Single element with `--surface` background fill, opacity pulse animation
  (`poukai-skeleton-pulse` at `--dur-pulse` 1800ms, `ease-in-out`, infinite),
  radius variants (`sm`/`md`/`lg`/`circle`), `as="div"|"span"` for block/inline
  contexts, and explicit reduced-motion final state (`animation: none; opacity: 0.6`).

  NO shimmer. Opacity pulse only, per the motion banlist in BACKLOG.md §Motion:
  "Skeleton shimmer that's prettier than the loaded state." No gradient, no
  background-position animation, no moving gradient layer at any point.

  `aria-hidden="true"` by default — decorative placeholder. Consumer owns
  `aria-busy` on the loading region container.

  Also fixes a pre-existing `TS2322` ref-cast error in `VisuallyHidden`
  (`as unknown as React.Ref<HTMLDivElement>`) that was blocking `tsc`.

- 9bddd36: Add `Spinner` atom — indeterminate loading indicator.
  - Inline SVG arc (track at 0.2 opacity + rotating arc at full opacity), `currentColor` throughout so it adapts to any surface without a color prop.
  - Three sizes: `sm` (16px), `md` (20px, default), `lg` (24px) — matched to the icon size token scale (`--icon-sm`, `--icon-md`, `--icon-lg`).
  - Rotation driven by new `--dur-spinner: 800ms` motion token (added to `tokens.css` by `poukai-design`); `linear` easing for a smooth continuous loop.
  - `role="status"` + `aria-live="polite"` + `aria-label` on the host `<span>`; visually-hidden text sibling for virtual browse mode.
  - Reduced-motion fallback: explicit `animation: none` on the arc (belt-and-suspenders over the global `tokens.css` collapse) plus a CSS-only `…` ellipsis revealed only under `prefers-reduced-motion: reduce` — no JS branching, no DOM structure change.
  - Full Playwright CT test suite (render, sizes, label, ref forwarding, className merge, rest props, animation token regression, reduced-motion assertions, axe scans).
  - Added to `src/a11y.test.tsx` central gate (default, all sizes, custom label, reduced-motion).

- 9bddd36: Add `VisuallyHidden` atom — the canonical sr-only clip-pattern primitive for `@poukai-inc/ui`.

  Renders children in the accessibility tree (screen-reader-readable, announced by assistive technology) while remaining completely invisible to sighted users via the WCAG/Bootstrap/Tailwind canonical clip pattern. Invariant: no tokens, no variants, no motion.
  - `as?: "span" | "div"` closed union (default `"span"`) for inline vs block-level contexts
  - `...rest` forwarded to root — use `id` for `aria-labelledby`/`aria-describedby`, `aria-live` for live-region announcements
  - `className` merged additively; internal clip class has dedicated specificity
  - Zero axe violations across default span, div variant, and `aria-live` usage
  - First-party consumers: `IconButton`, `Dialog` close label, `SkipLink` (hidden base), `Carousel` slide counter

### Patch Changes

- b2fb30f: Fix Avatar accessibility and CSS spec compliance; ratify 6 Draft design specs.
  - Avatar: add `aria-hidden="true"` on decorative instances (no `name`, no `alt`)
  - Avatar: fix `shape="square"` border-radius to `--radius-1` (2px, was 4px)
  - Avatar: move `user-select: none` to root element
  - Dialog: remove redundant `clsx(className)` wrapping in DialogBasic
  - Design specs: promote Avatar, Tag, FieldNote, Quote, Dialog, Footer from Draft → Approved

- 801dc75: Fix animation token discipline: replace all raw `ease` literals with `var(--easing)` across tokens.css and Dialog.module.css. Add component-level reduced-motion suppression block to Dialog. Add reduced-motion CT tests for StatusBadge, Hero, and Dialog.

## 1.2.0

### Minor Changes

- f7193c7: Stack alignment (issue #105):
  - **D1 — React 19 dual-peer support.** Widen `peerDependencies.react` and `peerDependencies.react-dom` from `>=18` to `>=18 || >=19`, and broaden `@types/react` / `@types/react-dom` ranges to `>=18.3.0 <20`. CI now runs Playwright component tests under React 18 _and_ React 19 via a `ct-react-matrix` job so both peer surfaces stay green.
  - **D4 — lucide-react alignment.** Tighten `peerDependencies.lucide-react` floor from `>=0.400.0` to `>=0.500.0` to match org-wide consumer versions (`autopost` 0.562, `poukai` 0.511). Bump devDep to `^0.577.0` (latest 0.5xx). Icons used internally (`ArrowUpRight`, `Mail`, `Heart`, `Check`, `AlertCircle`, `X`, `LucideIcon`) are stable across the 0.4xx → 0.5xx range — no rename impact.

  No public-API changes. Consumer migration: install on a host with React 18 or 19 and `lucide-react ≥ 0.500.0`.

## 1.1.0

### Minor Changes

- 09691fd: Add `useFieldErrors` — validation-lib-agnostic error-state hook for Form surfaces.

  Exports `useFieldErrors(initial?)` and `type FieldErrors` from `@poukai-inc/ui` (and the `molecules` subpath). The hook owns field-keyed error state with stable imperative setters (`setErrors`, `setFieldError`, `clearAll`). No validation library dependency introduced — compatible with Zod, React Hook Form, Yup, and hand-rolled validators.

## 1.0.0

### Major Changes

- 924ce6a: # 1.0.0 — API freeze

  See `CHANGELOG.md` 1.0.0 entry and `meta/milestones/1.0.0.md` for the
  scope, rationale, and post-1.0 semver policy.

  No prop renames, no token removals, no export changes. The major bump
  marks the API freeze — future X.0.0 bumps will follow
  `meta/migrations/template.md`.

## 1.0.0 — 2026-05-20

### The freeze

1.0.0 freezes the API surface. Prop signatures, token names, and subpath exports
lock in per `meta/semver-policy.md`. Any removal or rename of a prop, CSS custom
property, or subpath export is a major version bump from this point forward. Adding
a new optional prop, a new token, or a new component remains a minor bump.

What stays evolvable: CSS visual output, internal implementation, DOM structure that
does not alter accessible roles. A token value can shift in a patch release if the
delta is imperceptible; a deliberate visible change is minor. New components continue
to ship as minor bumps. The deprecation lifecycle — warn in development for at least
one minor release before removal — is documented in `meta/semver-policy.md` and
enforced by review.

The shipped surface at freeze: 31 components across 3 atomic layers; a dark-mode
token tier via `@media (prefers-color-scheme: dark)`; 34 CSS custom properties in
`src/tokens/tokens.css`; an Apple-aligned neutral + accent palette; Playwright
component tests across Chromium, Firefox, and WebKit with an axe-core a11y gate;
per-subpath bundle-size budgets enforced in CI; and an auto-merge pipeline. See
`meta/milestones/1.0.0.md` for the full gate criteria. Future breaking changes
follow the template at `meta/migrations/template.md`.

### What you get

#### Component surface (31 shipped)

**Atoms (8)**

- `Wordmark` (`0.1.0`) — SVG brand mark, geometry inlined at build time, inherits `currentColor`.
- `StatusBadge` (`0.1.0`) — availability indicator: `available` / `idle` / `closed`. Animated pulse for `available`.
- `Button` (`0.1.0`) — primary action atom. Variants: `primary`, `secondary`, `ghost`. Sizes: `sm`, `compact`, `md`, `lg`. `asChild` via Radix Slot.
- `Stat` (`0.1.0`) — display numeral + caption + optional source line. Inherits `currentColor`; invertable on dark surfaces.
- `EmailLink` (`0.17.0`) — canonical `mailto:` affordance. Variants: `default`, `muted`. Optional leading icon and trailing qualifier.
- `Eyebrow` (`0.17.0`) — canonical micro-label. Variants: `muted`, `solid`, `numbered`. Polymorphic `as` prop.
- `Tag` (`0.18.0`) — inline categorical pill. Tones: `default`, `muted`. Optional leading icon slot.
- `Avatar` (`0.18.0`) — three modes via discriminated union: `image`, `initials`, `empty`. Sizes: `sm`, `md`, `lg`. Shapes: `circle`, `square`.

**Molecules (17)**

- `Hero` (`0.1.0`) — doorway section with hand-tuned vertical rhythm. Variants: `default`, `no-title`. Sizes: `display`, `intimate`. Entrance: `stagger`. Bleed: `none`, `full`. Illustration slot for two-column layout.
- `RoleCard` (`0.1.0`) — surface + hairline card recipe with editorial typography. Optional icon slot; footer bottom-pinned for grid alignment.
- `Principle` (`0.1.0`) — editorial numbered block. Margin numeral on desktop.
- `FailureMode` (`0.1.0`) — zero-padded index block. Visually distinct from `Principle`; the failure is the subject.
- `Statement` (`0.10.0`) — italic-serif editorial block with optional supporting line and hairline.
- `Portrait` (`0.13.0`) — photography primitive with AVIF/WebP/JPEG `<picture>` fallback chain, srcset generation, and CLS-safe aspect-ratio.
- `Pull` (`0.17.0`) — left-ruled blockquote accent. Variants: `serif` (Instrument Serif italic), `sans` (Geist roman). Polymorphic `as` prop.
- `Section` (`0.17.0`) — page-section wrapper. Owns vertical rhythm around eyebrow + title + lede. `aria-labelledby` wired on landmark roots.
- `FeatureCard` (`0.17.0`) — structural feature-grid tile. Variants: `default`, `bordered`. Polymorphic `as` prop.
- `LinkCard` (`0.17.0`) — interactive card primitive; entire surface is a single `<a>` click target. Variants: `default`, `quiet`. `asChild` via Radix Slot.
- `TeamCard` (`0.17.0`) — person tile: portrait, name, role, optional bio, optional contact affordance. Layouts: `stacked`, `horizontal`.
- `FieldNote` (`0.18.0`) — inline technical-aside: 1px left hairline rule, body-register type. Distinct from `Pull` and `FailureMode`.
- `Quote` (`0.18.0`) — attributed customer testimonial. `<figure>` + `<blockquote>` + `<figcaption>` semantic structure. Optional avatar slot.
- `Banner` (`0.21.0`) — persistent inline notice. Tones: `info`, `warning`, `danger`, `success`. Optional leading icon and trailing action slots.
- `Field` (`0.20.0`) — composition wrapper: auto-wires label association, `aria-describedby`, `aria-invalid`, and `required` onto its child control.
- `Input` (`0.20.0`) — single-line text input. Composed inside `Field`.
- `Textarea` (`0.20.0`) — multi-line text input. Composed inside `Field`.

**Organisms (6)**

- `SiteShell` (`0.1.0`) — top nav (linked wordmark + route list) + main slot + hairline footer. No router awareness; emits plain `<a href>`.
- `Dialog` + `DialogBasic` (`0.18.0`) — compound modal overlay on `@radix-ui/react-dialog`. `DialogBasic` is a convenience wrapper with built-in close, title, optional description, body, and footer row.
- `Footer` (`0.18.0`) — site-footer content block. Copyright + `EmailLink` + optional nav link row. `as` prop prevents double-`<footer>` landmark problem.
- `Tabs` (`0.19.0`) — compound tabbed interface on `@radix-ui/react-tabs`. `TabsBasic` convenience wrapper. Horizontal and vertical orientations.
- `Toast` + `useToast` (`0.22.0`) — imperative notification portal on `@radix-ui/react-toast`. Tones: `info`, `success`, `warning`, `danger`. `ToastProvider` with position, duration, and max controls.
- `Form` (`0.22.0`) — form layout organism wrapping `Field`, `Input`, and `Textarea` primitives.

#### Brand contract

The token contract is in `src/tokens/tokens.css`. Engineers consume tokens; they never edit the file directly. All 34 CSS custom properties are documented in `meta/llms-full.txt` and `meta/design/foundations.md`.

Color: Apple-aligned neutral ramp — `--bg` (`#FBFBFD`, never pure white), `--bg-elevated` (`#FFFFFF`, reserved for popovers and the front-most layer), `--surface`, `--surface-section`, `--fg`, `--fg-muted`, `--hairline`, `--accent`, `--accent-glow`. Dark mode overrides via `@media (prefers-color-scheme: dark)` — Apple-HIG values throughout; `--fg` at 19.58:1 on `--bg` (AAA). Status tier (`--danger`, `--warning`, `--success` with matching surface and foreground pairs) is distinct from the editorial warm-accent tier (`--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted`).

Typography: Geist (sans-serif, body and UI) and Instrument Serif (italic editorial accents). Self-hosted in `src/tokens/fonts/`. Type scale: `--fs-meta` (14px) through `--fs-display` (48–88px fluid), with named rungs for body, card-title, statement, tagline, stat, and display.

Spacing: 4px grid, 11 named rungs (`--space-1` through `--space-12`). Consuming contexts own spacing; components carry `margin: 0` on their roots.

Motion: 7 duration tokens (`--dur-instant` through `--dur-pulse`) and 2 easing tokens (`--easing`, `--easing-link`). `prefers-reduced-motion: reduce` is honored via a global override block in `tokens.css`; no component-level workarounds required.

#### Composition patterns

Four patterns are documented in `meta/conventions/polymorphic-props.md`:

- `asChild` (Radix Slot) — the component's root element is replaced by the consumer's child element. Used on `Button` and `LinkCard`.
- `as` (closed root swap) — the root HTML element changes within an explicit allowed union. Used on `Eyebrow`, `Statement`, `Section`, `Pull`, `FeatureCard`, `TeamCard`, `Footer`.
- `<slot>As` (named inner slot swap) — a named interior element changes semantic level. Used on `Hero` (`titleAs`), `Section` (`titleAs`), `FeatureCard` (`titleAs`), `LinkCard` (`titleAs`).
- No polymorphism — pure content, fixed root element. Used on atoms with a fixed semantic contract.

Compound APIs: `Dialog` and `Tabs` expose Radix-wrapped sub-component namespaces. Imperative API: `Toast` via `useToast()`. Structural wrappers with explicit child slots: `Form`, `Field`, `SiteShell`, `Footer`.

#### Accessibility

WCAG 2.1 AA is the baseline on all components. The axe-core gate (`src/a11y.test.tsx`) runs in CI and blocks on any violation across all 31 components. Three-browser coverage: Chromium, Firefox, WebKit — all 1572 tests passing. Dark-mode body text (`--fg` on `--bg`) meets AAA at 19.58:1. `aria-labelledby` is wired automatically on landmark roots (`article`, `section`) where the `as` prop resolves to a landmark element.

#### Tooling

Auto-merge is the default on every non-draft PR. Six per-subpath bundle-size budgets are enforced in CI (`pnpm size` after build, exit 1 on regression). Source maps (`*.js.map`, `*.cjs.map`) are published with the package — stack traces in consumer debuggers resolve to real source lines. A bundle visualizer artifact (`dist/stats.html`) is uploaded on every CI run and retained 30 days. The Ladle showcase auto-deploys to <https://poukai-inc.github.io/poukai-ui/> on every push to `main`.

#### Documentation

Every component has a design spec in `meta/design/`. `meta/llms-full.txt` (mirrored to `dist/llms-full.txt`) is the brand and component contract for LLM consumers; a CI sync check (`scripts/check-llms-tokens-sync.mjs`) blocks if any color token or component directory is undocumented. `CONTRIBUTING.md` covers the full contribution loop. `meta/semver-policy.md` defines the versioning contract. `meta/migrations/template.md` is the format for documenting future breaking changes.

### Breaking changes from 0.x

No prop renames or removals occurred during the 0.x line. The 0.x series was purely additive — every release added props, tokens, or components; nothing was taken away or renamed. The two internal CSS property removals in `0.3.2` (hardcoded `color: var(--fg)` override on `Wordmark` root; `min-height: 100%` on `RoleCard` root) corrected bugs and did not alter any public prop or token contract.

Consumers on 0.22.x adopt 1.0.0 without code changes.

### Migration path

This 1.0.0 release is non-breaking. No migration steps are required for consumers upgrading from 0.22.x.

Future major bumps (2.0.0 and beyond) will follow the template at `meta/migrations/template.md`. Each guide documents the exact set of props, tokens, and exports that changed, the mechanical upgrade steps, and the design rationale.

### Acknowledgements

The 0.x line was largely solo-author work. The brand contract lived in `meta/brand.md` from day one and drove every token decision, palette choice, and typographic rule in the system. The 1.0.0 milestone closes Phase 1 of the migration plan and establishes the stable floor that the pouk.ai site rebuild and future product surfaces depend on.

---

## 0.22.1

### Patch Changes

- 6080f6a: build: ship source maps, bundle visualizer, and unify Wordmark story namespace
  - Source maps (`*.js.map`, `*.cjs.map`) are now emitted to `dist/` on every
    lib build (`sourcemap: true` was already set; confirmed present in output).
    Consumers debugging into `@poukai-inc/ui` will now see real
    `src/<Component>/<Component>.tsx` lines in stack traces.
  - Added `rollup-plugin-visualizer` (devDep). Every `pnpm build` now writes
    `dist/stats.html` — a gzip- and brotli-annotated treemap showing per-module
    size attribution. Gated to `BUILD_TARGET=lib` so Ladle showcase builds are
    unaffected. `dist/stats.html` added to `.gitignore` (build artifact).
  - CI (`ci.yml`) uploads `dist/stats.html` as a `bundle-stats` artifact
    (retained 30 days) after every `pnpm build` step, so the treemap is
    downloadable from every CI run.
  - Unified all three Wordmark story files under `"Components / Wordmark"`
    (was `"Brand / Wordmark"`). Sidebar navigation is now consistent across
    all 33+ components. No runtime or API change.

  No size-limit budget changes — visualizer adds zero runtime weight; source
  maps are excluded from size-limit measurement.

## 0.22.0

### Minor Changes

- 797d9f1: Add Toast organism — `ToastProvider`, `useToast` hook, and `ToastPayload` type.

  Imperative notification portal built on `@radix-ui/react-toast`. Features:
  - Four tones: `info`, `success`, `warning`, `danger` — reuses the Banner status palette.
  - `ToastProvider` props: `defaultDuration` (5000ms), `max` (4), `position` (bottom-right / top-right / top-center / bottom-center), `closeLabel`.
  - `useToast()` hook: `show(payload)` returns id; `dismiss(id)` removes imperatively.
  - Optional `title`, `action` slot (Radix `Toast.Action` + `<Button variant="ghost" size="sm">`), and built-in close button.
  - Auto-dismiss via Radix's internal timer; `onOpenChange` bridge to `dismiss`.
  - `z-index: 200` — above Dialog overlay (100) and content (101).
  - Entrance/exit animations at `--dur-fast` with `--easing`; respects `prefers-reduced-motion` via global tokens block.
  - Playwright CT tests + axe-core a11y gate (all four tones).
  - Ladle stories: all tones, with action, with title+body, multiple stacked, all position variants.

- 797d9f1: Add dark-mode token tier via `prefers-color-scheme: dark` media block.

  Appends a `@media (prefers-color-scheme: dark)` block to `src/tokens/tokens.css` that overrides all 16 color tokens with Apple-HIG-aligned dark values. The light-mode `:root` block is unchanged. Also updates `html { color-scheme }` from `light` to `light dark` so browser-native controls (scrollbars, form inputs, selection) match the token-driven scheme.

  Every component that consumes only `var(--token)` references gains dark mode automatically — zero component code changes required.

  **Token values and contrast (all WCAG thresholds met):**
  - `--bg: #000000` — page floor (Apple canonical dark canvas)
  - `--bg-elevated: #1C1C1E` — overlays/dialogs (Apple `systemBackground` dark)
  - `--surface: #1C1C1E` — recessed inline blocks
  - `--surface-section: #161618` — section bands
  - `--fg: #F5F5F7` — primary text, 19.58:1 on `--bg` (AAA)
  - `--fg-muted: #86868B` — secondary text, 6.10:1 on `--bg` (AA)
  - `--hairline: #2C2C2E` — dividers (Apple `separator` dark)
  - `--accent: #0A84FF` — links/focus, 5.86:1 on `--bg` (AA; ≥3:1 required)
  - `--accent-glow: rgba(10,132,255,0.24)` — halos/selection
  - `--bg-warm-accent: #8A2E1C` — editorial band (~55% luminance of light value)
  - `--fg-on-warm: #FDF5F0` — 7.75:1 on `--bg-warm-accent` (AAA; unchanged from light)
  - `--fg-on-warm-muted: #D6B9A8` — ~4.8:1 on `--bg-warm-accent` (AA)
  - `--danger: #FF453A` — Apple `systemRed` dark
  - `--bg-danger: #1C0A0A` — tinted dark surface
  - `--fg-on-danger: #FFB4B0` — 11.63:1 on `--bg-danger` (AAA)
  - `--warning: #FF9F0A` — Apple `systemOrange` dark
  - `--bg-warning: #1C1408` — tinted dark surface
  - `--fg-on-warning: #FFD6A0` — 13.74:1 on `--bg-warning` (AAA)

  **Component CSS audit:** all shipped atoms/molecules/organisms consume only token references. One known hardcoded value kept: `Dialog.module.css` scrim `rgb(0 0 0 / 0.4)` — intentional per Dialog spec, flagged for future opacity review in dark mode.

## 0.21.0

### Minor Changes

- f3d41dd: Add `Banner` molecule — persistent inline notice component with four tones: `info`, `warning`, `danger`, and `success`. Anatomy: optional leading icon slot, required body content, optional trailing action slot. `role="status"` (polite) for info/success; `role="alert"` (assertive) for warning/danger. Zero new tokens; re-uses existing warm-accent tier for warning/danger and accent border for success. Static and persistent — consumer controls mount/unmount.

  Toast (ephemeral overlay notification) is intentionally deferred to a follow-up PR. Toast requires a state container (Provider), queue management, timing logic, and a portal — scoping it separately keeps this PR focused and reviewable. Banner ships first as the brand-appropriate persistent surface.

## 0.20.0

### Minor Changes

- 4c057f4: Add `Field`, `Input`, and `Textarea` form primitives — a coherent set of single-line input, multi-line textarea, and composition-wrapper molecules. `Field` auto-wires label association, `aria-describedby`, `aria-invalid`, and `required` onto its child control via `cloneElement`. Zero new tokens. Unblocks waitlist surfaces, contact forms inside Dialog, and settings panes.

## 0.19.0

### Minor Changes

- 72b3ca0: Add `Tabs` organism — compound tabbed interface wrapping `@radix-ui/react-tabs` with brand styling. Ships `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content` compound subcomponents and a `TabsBasic` convenience wrapper. Horizontal and vertical orientations supported. Zero new tokens.

## 0.18.0

### Minor Changes

- 942e06c: feat(Avatar): add Avatar atom

  New `<Avatar>` atom supporting three modes via discriminated union:
  - `mode="image"` — renders `<img loading="lazy">` with `src` and optional `alt`
  - `mode="initials"` — renders 1–2 character text label
  - `mode="empty"` (default) — blank placeholder

  Props: `size` (sm/md/lg → 24/32/40px), `shape` (circle/square), `name` (accessible label).

  A11y: `name` prop produces `role="img"` + `aria-label` on the root span for initials and
  empty modes, and for image mode when `alt` is omitted. Image with `alt` is self-labelling.

  Stateless by design — no `onError` fallback, no `imgLoading` prop, no initials derivation.

- 6e3facd: Add `Dialog` organism — compound modal overlay built on `@radix-ui/react-dialog`.

  Exports:
  - `Dialog` namespace: `Dialog.Root`, `Dialog.Trigger`, `Dialog.Portal`, `Dialog.Overlay`, `Dialog.Content`, `Dialog.Title`, `Dialog.Description`, `Dialog.Close`
  - `DialogBasic` — convenience wrapper with built-in X close button (lucide `X`), title, optional description, body slot, and optional footer action row

  Token contract: `--bg-elevated`, `--fg`, `--fg-muted`, `--hairline`, `--hairline-w`, `--accent`, `--radius-3`, `--radius-1`, `--space-2`–`--space-8`, `--font-sans`, `--fs-body`, `--fs-meta`, `--dur-fast`, `--easing`, `--page-pad`, `--surface`.

  All accessibility plumbing (focus trap, `aria-modal`, `aria-labelledby`, ESC dismiss, return focus) delegated to Radix. DS adds brand styling only.

  Available via `@poukai-inc/ui`, `@poukai-inc/ui/organisms`.

- bbd0329: feat: add FieldNote molecule

  Adds `<FieldNote>` — the canonical inline technical-aside primitive for long-form prose surfaces.

  A short parenthetical callout (a sentence or two) that sits inline with body copy and provides a factual clarification, caveat, or data footnote without interrupting reading flow. Renders as `<aside>` with a 1px left hairline rule (`--hairline-w solid --hairline`), `--space-3` (12px) inset, and `--space-6` (24px) block margin.

  Optional `label` prop (string) renders a single `<p>` above the body text in the Eyebrow typographic register (`--fs-meta`, `--fg-muted`, uppercase, `--tracking-eyebrow`). Defaults to `undefined` — the left rule is the primary signal.

  Distinct from `<Pull>` (3px rule, 20–26px serif-italic, editorial accent) and `<FailureMode>` (section-level, titled, indexed). FieldNote is body-register: `--fs-body` (17–19px), Geist roman, 1px rule.

  New exports: `FieldNote`, `FieldNoteProps`.

  No new tokens introduced. No breaking changes.

- 421cdf5: feat: add Footer organism

  Adds `<Footer>` — the canonical site-footer content block for pouk.ai surfaces.

  Composes copyright string + `<EmailLink variant="muted">` + an optional secondary `<nav>` link row. The `as` prop (`"div"` | `"footer"`, default `"div"`) prevents the double-`<footer>` landmark problem when Footer is slotted into SiteShell's `footer` prop. When `as="footer"` (standalone), Footer applies its own hairline rule and padding mirroring SiteShell's `.footer` CSS.

  New exports: `Footer`, `FooterProps`, `FooterLink`.

  No new tokens introduced. No breaking changes.

- 77b13d8: feat: add Quote molecule

  Adds `<Quote>` — the canonical attributed customer testimonial block.

  A short prose body (1–4 sentences) from a named person, rendered at `--fs-pull` (20–26px fluid) in Geist sans-serif roman weight — the typographic differentiator from `<Pull>` (Instrument Serif italic) and `<Statement>`. Consumers can tell Quote from Pull at a glance without reading the attribution.

  Root element is `<figure>` with `<blockquote>` for the quoted body and `<figcaption>` for the attribution row — the HTML5-recommended structure for attributed quotations. No extra ARIA required; the semantic structure does the work.

  Props:
  - `quote` (required ReactNode) — quoted body text; accepts inline `<em>`/`<strong>`; no block-level children.
  - `name` (required string) — attributed person's name; `font-weight: 500`, `--fg`, `--fs-meta`.
  - `role` (optional string) — role or title; `font-weight: 400`, `--fg-muted`, `--fs-meta`. Omit to suppress.
  - `avatar` (optional ReactNode) — leftmost element of the attribution row; accepts any ReactNode. DS does not ship an Avatar atom. Convention: 40×40px, `border-radius: 50%` (documented in JSDoc; not enforced).

  Hairline rule (`border-top: var(--hairline-w) solid var(--hairline)`) above `<figcaption>` is always on. Use `className` to suppress if needed.

  New exports: `Quote`, `QuoteProps`.

  No new tokens introduced. No breaking changes.

- ce0de62: feat: add Tag atom

  Adds `<Tag>` — the system's canonical inline categorical pill.

  A compact label that communicates type, category, topic, or metadata classification of adjacent content. Answers "what kind of thing is this?" inline with content flow: inside a card, in a topic list, beside a title, or inside a sentence.

  Root element is `<span>` (non-polymorphic). Non-interactive — no hover, focus, active, or disabled states. `forwardRef<HTMLSpanElement, TagProps>` with `...rest` spread.

  Props:
  - `children` (required ReactNode) — label text; plain string is idiomatic; ReactNode accepted for rare inline `<strong>` emphasis.
  - `tone` (`"default"` | `"muted"`, default `"default"`) — two tones only. `"default"`: `--surface` fill, `--fg` text, no border. `"muted"`: transparent background, `--hairline` border (1px), `--fg-muted` text.
  - `icon` (optional ReactNode) — optional leading icon slot. When present, root shifts to `inline-flex` for optical alignment. Recommended icon size: 12px (JSDoc guidance; not type-enforced). Pass `aria-hidden="true"` on decorative icons.

  Typography: `--font-sans`, `--fs-meta` (14px fixed), `font-weight: 400`, `line-height: var(--lh-meta)` (1.2), `letter-spacing: normal`. Geometry: `border-radius: 999px` (pill constant per spec §3), `padding-block: var(--space-1)`, `padding-inline: var(--space-2)`, `box-sizing: border-box`.

  Contrast: `"default"` 15.46:1 AAA. `"muted"` 4.91:1 AA normal at 14px — passes WCAG 2.1 4.5:1 threshold.

  New exports: `Tag`, `TagProps`.

  No new tokens introduced. No breaking changes.

## 0.17.0

### Minor Changes

- a1557c0: feat(atoms): add EmailLink atom

  New `<EmailLink>` atom — the canonical `mailto:` affordance for the Poukai design system.
  - `email` prop computes `href="mailto:${email}"` — consumers never pass `href` directly.
  - `label` prop (optional) overrides visible text; defaults to the email string.
  - `icon` prop (optional leading ReactNode) — shifts root to `inline-flex` when present.
  - `qualifier` prop (optional) renders a trailing muted ` (qualifier)` span inside the anchor.
  - `variant="default"` (default) — `--fg` → `--accent` on hover.
  - `variant="muted"` — `--fg-muted` → `--fg` on hover; matches existing SiteShell `.muted-link` treatment.
  - Persistent `text-decoration: underline` (intentional brand override of the global animated grow-underline — a `mailto:` is not a navigational link).
  - Focus ring: 2px solid `--accent`, 4px offset (link convention, not button).
  - No new tokens — built entirely from the existing token vocabulary.
  - Exports: `EmailLink`, `EmailLinkProps`, `EmailLinkVariant` from `@poukai-inc/ui` and `@poukai-inc/ui/atoms`.

- a1557c0: Add `Eyebrow` atom, `--tracking-eyebrow` + `--lh-meta` tokens, and `displayName` backfill.

  **New component — `Eyebrow`**

  Canonical micro-label atom (`src/atoms/Eyebrow/`). Resolves the three independently-authored eyebrow patterns in `RoleCard`, `FailureMode`, and the global `.micro` utility into one shape: `--tracking-eyebrow: 0.06em`, `--fs-meta` (14px), `--font-sans`, weight 500.
  - `variant` prop: `"muted"` (default, `--fg-muted`), `"solid"` (`--fg`), `"numbered"` (muted + inline numeral slot).
  - `numeral` prop (string): leading index rendered with `font-variant-numeric: tabular-nums` and `--space-2` gap.
  - `as` prop: polymorphic root element (`span` default; `p`, `div`, `dt`, `h2`–`h6`, `li`). Follows the Statement pattern.
  - `margin: 0` — consuming context owns spacing.
  - Exports: `Eyebrow`, `EyebrowProps`, `EyebrowVariant` from root, `./atoms` subpath.

  **New tokens** (additive — minor bump)
  - `--tracking-eyebrow: 0.06em` — Canonical letter-spacing for Eyebrow labels. Resolves the 0.04/0.06/0.08em drift across existing molecules.
  - `--lh-meta: 1.2` — First named line-height token in the system, scoped to the meta/eyebrow register.

  **`displayName` backfill** (no API change — patch-level, bundled here for cleanliness)

  Added `Component.displayName = "Component"` to: `Button`, `Stat`, `StatusBadge`, `Wordmark`, `FailureMode`, `Principle`, `RoleCard`, `SiteShell`. Matches the pattern already on `Hero`, `Statement`, `Portrait`, and the new `Eyebrow`.

  **Migration notes**

  `RoleCard`, `FailureMode` inline eyebrow patterns will adopt `<Eyebrow>` in a follow-up PR. No existing molecule output changes in this release.

- 935f64d: Add `FeatureCard` molecule — canonical structural feature-grid tile.

  New component `<FeatureCard>` at `src/molecules/FeatureCard/`. Canonical primitive for capability and service grids. Presents a single feature as a bounded content object: optional icon, optional eyebrow, required title, required body, optional footer. Polymorphic via `as` prop (`"article"` | `"section"` | `"div"` | `"li"`). Two variants: `"default"` (transparent, no border) and `"bordered"` (`--surface` bg, `--hairline` border, `--radius-3`). `aria-labelledby` wired on `article`/`section` roots; omitted for `div`/`li` per spec. Icon slot wrapped in `aria-hidden="true"` span. String eyebrow auto-wrapped in `<Eyebrow variant="muted">`; ReactNode eyebrow passed through. String body auto-wrapped in `<p style="margin:0">`. No new tokens — built entirely from the existing vocabulary.

- 935f64d: Add `LinkCard` molecule — canonical interactive card primitive.

  The entire card surface is a single `<a>` click target. Designed for navigational index pages (`/work`, `/posts`, `/case-studies`) where each grid item routes to a destination.

  **Props:** `href`, `asChild` (Radix Slot, identical to `Button` pattern), `eyebrow` (string → auto-wraps in `<Eyebrow variant="muted">`; ReactNode → pass-through), `title` (required), `titleAs` (`"h2" | "h3" | "h4"`, default `"h3"`), `body`, `footer`, `icon`, `external`, `variant`.

  **Variants:**
  - `default` — `--surface` background, `1px solid --hairline` border, `--radius-3` corners, `--space-8` inset padding. Use in grid contexts.
  - `quiet` — `--bg` background, hairline rule top only, no radius, block padding only. Use in dense vertical list contexts.

  **Interactions:** hover shifts border-color to `--accent` (`--dur-mid` / `--easing-link`); `:active` presses `translateY(1px)` at `--dur-press`; `:focus-visible` ring 2px solid `--accent` with `outline-offset: 4px`.

  **Accessibility:** `external` prop adds `target="_blank"`, `rel="noopener noreferrer"`, and a visually-hidden `(opens in new tab)` span. Global `<a>` underline animation is suppressed on the card root. No nested interactive elements — documented as a hard constraint.

  **New utility:** `.sr-only` visually-hidden class shipped in `LinkCard.module.css` (not yet in `tokens.css`; surfaced to `poukai-design` for a future token pass).

- 935f64d: Link resting-state discoverability + atom inversion fixes.

  **Global `<a>` rule** — links now carry a persistent `--hairline`-colored
  underline at rest. On hover, an `--accent`-colored underline grows over the
  top via a two-layer CSS gradient. This gives every link a visible affordance
  in its resting state without violating the `--accent`-is-signal-only rule.
  Cascade-affects every anchor in the system (EmailLink, SiteShell nav, Hero
  CTAs). Components that suppress the global rule via `background-image: none`
  (LinkCard root + title, SiteShell Wordmark, `.muted-link`) are unaffected.
  Brand decision logged in `meta/brand.md`.

  **Stat** — `.value`, `.caption`, and `.source` now inherit `currentColor`
  (captions via `color-mix(in srgb, currentColor 65%, transparent)` for the
  muted register). Stat is now invertable: wrap with `color: var(--bg)` on a
  `background: var(--fg)` parent and the numeral + caption render correctly
  on the dark surface. Previously hardcoded `--fg` / `--fg-muted` on children
  suppressed inheritance.

  **EmailLink** — dropped the persistent underline override. EmailLink now
  inherits the global `<a>` two-layer underline behavior. Removes the brand
  divergence between mailto links and every other link in the system.

- a1557c0: Add `Pull` molecule — inline editorial pull-quote primitive.

  New component `<Pull>` at `src/molecules/Pull/`. Left-ruled blockquote accent for inline long-form prose. Supports `variant="serif"` (Instrument Serif italic, default) and `variant="sans"` (Geist roman), polymorphic `as="blockquote" | "aside"`, optional `attribution` slot (renders as `<footer>` in blockquote, `<p>` in aside), and native `cite` attribute pass-through.

  New token `--fs-pull: clamp(1.25rem, 1rem + 1vw, 1.625rem)` (20–26px fluid) fills the gap between `--fs-body` (17–19px) and `--fs-statement` (28–44px).

- a1557c0: Add Section molecule — canonical page-section wrapper consuming Eyebrow atom.

  `<Section>` owns the vertical rhythm around a section's header block (eyebrow + title + lede) and exposes a children slot for body content. Polymorphic `as` prop (`section` / `article` / `aside` / `div`), `titleAs` heading-level swap, `size="tight"` padding variant, automatic `aria-labelledby` wiring for landmark elements, and empty-header guard. Constructed entirely from the existing token vocabulary — no new tokens.

- 935f64d: Add `TeamCard` molecule — canonical person tile.

  `<TeamCard>` surfaces a single team member as a brand object: portrait, name, role, optional bio, and optional contact affordance. Intended for /about and /team page contexts.

  **API surface:**

  ```tsx
  <TeamCard
    portrait={<Portrait src="…" alt="…" aspect="1:1" width={800} />}
    name="Arian Zargaran"
    role="Founder, Engineering"
    bio="Builds production AI systems end-to-end."
    contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
    eyebrow="Founding team"
    layout="stacked" // "stacked" | "horizontal"
    nameAs="h3" // "h2" | "h3" | "h4"
    as="article" // "article" | "section" | "div"
  />
  ```

  **Key design decisions:**
  - No padding, no border, no background — content tile, not chrome tile. Consumer's grid owns the column gutter.
  - `layout="horizontal"` pins portrait at `5rem` width; collapses to stacked below 768px.
  - `aria-labelledby` wired automatically on landmark roots (`article`, `section`); omitted on `div`.
  - Eyebrow string convention (auto-wrap in `<Eyebrow variant="muted">`) matches `<Section>` and `<Pull>`.
  - `portrait` slot accepts `ReactNode` only — no `portraitSrc` shortcut. Portrait's API is authoritative.
  - No new tokens. Constructed entirely from the existing vocabulary.

## 0.16.1

### Patch Changes

- 81437c5: Internal: dedupe ESLint config. Inlined the rule set into `eslint.config.mjs` and removed the now-redundant `.eslintrc.cjs`. Zero behavior change — same rules, same plugins, same ignore patterns. The flat config still routes through `FlatCompat` so the legacy plugin shapes (`plugin:@typescript-eslint/recommended`, etc.) continue to work. No consumer impact.

## 0.16.0

### Minor Changes

- 39a6151: Code-side cleanup pass closing the remaining 🟠 High items from the 2026-05-18 consistency audit. Per ADR-0003, token additions are a minor bump; this changeset is additive only and contains no breaking changes.

  **New tokens (additive)**
  - `--space-10: 2.5rem` — fills the previously-phantom rung between `--space-8` and `--space-12`. Used by Hero CTA desktop margin, FailureMode top padding, h1 desktop bottom margin (all of which previously consumed `var(--space-10, 2.5rem)` with a fallback).
  - `--dur-press: 80ms` — tactile click/press feedback duration, deliberately shorter than `--dur-fast` so `:active` transforms feel immediate. Used by `<Button>` transform transition.
  - `--dur-pulse: 1800ms` — `<StatusBadge status="available">` halo pulse. Replaces the previously-hardcoded `1800ms` literal.
  - `--fs-card-title: clamp(1.5rem, 1.15rem + 1.2vw, 2rem)` (24–32px) — card-title rung shared by `<RoleCard>`, `<Principle>`, `<FailureMode>` titles. Replaces three duplicated `clamp(...)` declarations.

  **Wider subpath surface (additive)**
  - `@poukai-inc/ui/molecules` now re-exports `Statement` and `StatementProps` (previously only reachable via the root barrel) and the full Hero discriminated-union types: `HeroDefaultProps`, `HeroNoTitleProps`, `HeroSize`, `HeroEntrance`, `HeroVariant`, `HeroBleed`.
  - Root barrel `@poukai-inc/ui` adds the three Hero types that were missing for parity with `Hero/index.ts`: `HeroDefaultProps`, `HeroNoTitleProps`, `HeroVariant`.

  **Token-consumer migrations**
  - `<Button>`: transitions now read `var(--dur-fast)` / `var(--easing)` for color and border; `var(--dur-press)` for transform. The wrong `var(--radius-2, 8px)` fallback (token is `4px`) is replaced with a plain `var(--radius-2)`.
  - `<StatusBadge>`: pulse animation reads `var(--dur-pulse)`.
  - `<RoleCard>`, `<Principle>`, `<FailureMode>`: title `font-size` reads `var(--fs-card-title)`.

  **Test backfill**
  - `<Button>`: variant assertions (primary/secondary/ghost class application); sm + lg size class + min-height assertions; className-merge and arbitrary-prop forwarding tests.
  - `<StatusBadge>`: idle-status coverage; default-status coverage; dot `aria-hidden` assertion; pulse-element count guard for available vs idle/closed; CSS regression guard pinning `animation-duration: 1.8s` + `animation-iteration-count: infinite`; className-merge and arbitrary-prop forwarding tests.

  CT suite goes from 242 to 270 passing tests with no fixtures or production-code regressions.

### Patch Changes

- 6f1ae83: Sync the LLM contract and consumer-facing docs with the components that have actually shipped, and extend the CI sync check so new components can no longer ship undocumented.
  - `meta/llms-full.txt` (mirrored to `dist/llms-full.txt`) gains `### Statement` and `### Portrait` component sections, an `illustration` slot bullet under `### Hero`, the `--fs-statement` and `--hero-illustration-max` token entries, and the three previously-undocumented warm-accent color tokens (`--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted`) that the extended sync check surfaced.
  - `scripts/build-llms-txt.mjs`: `COMPONENTS.molecules` now includes `Statement` and `Portrait` (generated `dist/llms.txt` reports 11 components, not 9). Also fixes a pre-existing path-emission bug where the Exports list rendered `@poukai-inc/ui./atoms` instead of `@poukai-inc/ui/atoms`.
  - `README.md`: "Components shipped today" table gains the `Statement` and `Portrait` rows.
  - `scripts/check-llms-tokens-sync.mjs`: in addition to the existing color-token assertion, the script now fails CI when a component directory under `src/{atoms,molecules,organisms}/` has no matching `### ComponentName` heading in `meta/llms-full.txt`.

  No runtime or public-API change; this is documentation, generated-asset, and CI-guard hardening.

## 0.15.1

### Patch Changes

- 1307b41: Define two tokens that shipped components were consuming without a fallback in `0.15.0`. Both were referenced in component CSS but absent from `src/tokens/tokens.css`, leaving the values undefined at runtime.
  - `--fs-statement: clamp(1.75rem, 1.25rem + 2vw, 2.75rem)` (28–44px). Italic-serif editorial Statement block; sits between `h2` and `--fs-tagline-intimate`. Consumed by `<Statement>` (`Statement.module.css`), which previously fell back to the browser-default font-size.
  - `--hero-illustration-max: 25rem`. Cap for the Hero illustration column in the two-column layout. Consumed by `<Hero illustration>` (`Hero.module.css`) and previously claimed in the `0.15.0` CHANGELOG as already-added, but never landed; without it the illustration column rendered without a width cap.

## 0.15.0

### Minor Changes

- 1908c99: Add `illustration` slot to `<Hero>` molecule. When provided, Hero switches to a two-column layout (text left, illustration right) above 720px; the illustration column hides below that breakpoint. Default `undefined` preserves the current single-column layout with zero regression for existing consumers. The illustration column animates as the fifth element when `entrance="stagger"` is active. Uses the `--hero-illustration-max` token (25rem) added to `tokens.css` by `poukai-design`.

## 0.14.0

### Minor Changes

- 70c8998: Add `--fs-display: clamp(3rem, 1.75rem + 4vw, 5.5rem)` (48–88px). Editorial display rung above `--fs-tagline` (max 68px), 8px below `--fs-stat-large` (max 96px) so numerals stay loudest. Reserved for editorial display moments where the page opens on a single statement and the Hero pattern is being deliberately replaced — at most once per page, not a heading replacement.

  Triaged from [poukai-ui#55](https://github.com/poukai-inc/poukai-ui/issues/55) (pouk.ai `/about` v2 Direction A). Consumer asked for two tokens (`--fs-display` 48–120px + `--fs-display-lg` 64–192px); designer counter-proposed one token at a tighter ceiling. See `meta/brand.md` Decision history (2026-05-18) and `meta/proposals/type-display-scale.md` for full rationale.

## 0.13.0

### Minor Changes

- 5071580: Add `Portrait` molecule — editorial photography primitive with AVIF/WebP/JPEG `<picture>` fallback chain, srcset generation, CLS-safe aspect-ratio, and enforced non-empty alt contract (WCAG 1.1.1).
- d6acfab: Add warm accent token tier: `--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted`.

  Saturated orange-vermillion editorial band tokens for the `/about` portrait section. Value is locked post-ship — the portrait asset is graded to match `--bg-warm-accent` (#C0452C). Restraint rules documented in `meta/brand.md` and `meta/llms-full.txt`. Contrast verified: `--fg-on-warm` 4.72 : 1 (AA), `--fg-on-warm-muted` 3.91 : 1 (AA-large, display/heading >= 24px).

## 0.12.0

### Minor Changes

- ecc5fac: Add `bleed="full"` prop to Hero and `--content-max-bleed` layout permission token.

  `bleed="none"` is the default — existing consumers are unaffected. `bleed="full"` extends the Hero section to `100vw` with inner content centered at `--content-max`. The `--content-max-bleed: 100vw` token is available for site-side compositions that need full-bleed without the Hero overlay.

  Closes #57.

## 0.11.0

### Minor Changes

- 0069cab: **Hero**: add `variant="no-title"` for editorial doorway pages without a heading in the doorway band.

  Editorial pages (starting with `/about`) want an eyebrow + lede opener with **no `<h1>`** in the doorway region — the page's heading lives in body content. The new variant provides a first-class DS primitive for this composition.

  ```tsx
  <Hero variant="no-title" eyebrow="About" lede="One to two sentences setting up the page." />
  ```

  - Renders an eyebrow `<p>` at `--fs-micro`, uppercase, `letter-spacing: 0.04em`, `--fg-muted`, then a lede `<p>` — no heading element emitted.
  - **Non-breaking**: all existing `<Hero>` invocations are unaffected. `variant` defaults to `"default"`.
  - TypeScript: discriminated union — `title` and `status` are excluded from the `"no-title"` variant's type; `eyebrow` is excluded from the default variant.
  - `align`, `entrance`, and `cta` remain available in both variants.
  - `entrance="stagger"` stagger sequence adapts to three slots (eyebrow → lede → cta) with compressed delays.
  - Consumer obligation: every page using `variant="no-title"` must place an `<h1>` in body content. The molecule does not emit one.

## 0.10.0

### Minor Changes

- b23ba8f: feat(Statement): add Statement molecule — editorial statement block with optional supporting line, hairline, and blockquote semantics
- 282e889: Add `--surface-section` token (`#F8F8FA`) — a fourth elevation tier for full-width alternating section bands on editorial pages. Positioned between `--surface` (#F5F5F7) and `--bg` (#FBFBFD). Additive; all existing consumers unaffected.

## 0.9.0

### Minor Changes

- 3b62bf4: feat(Button): add `size="compact"` — 40px rung between `sm` and `md` (issue #42)

  Adds a fourth size to `<Button>`. `compact` (40px min-height, `--fs-body`,
  9/16 padding) sits between `sm` (32px) and `md` (44px) — the editorial-CTA
  rung where `md` reads too heavy and `sm` reads too small. Aligned to Apple's
  "Compact" control register and the 4px spacing grid.

  The full Button height ladder is now exposed as tokens (`--btn-h-sm`,
  `--btn-h-compact`, `--btn-h-md`, `--btn-h-lg`) in `src/tokens/tokens.css`.
  The previously inline literals (32 / 44 / 52) are refactored to consume
  the tokens — same runtime values, named contract.

  Accessibility: `compact` passes WCAG 2.5.8 AA (24×24) but fails 2.5.5 AAA
  (44×44) — same posture as `sm`. Consumers on strict-AAA surfaces must use
  `md` or `lg`.

  Default `size="md"` is unchanged; every existing consumer is zero-regression.

  Closes #42.

## 0.8.0

### Minor Changes

- 445deeb: feat(Hero): add `entrance="stagger"` prop — CSS-only staggered reveal on load

  Adds an opt-in `entrance` prop to `<Hero>`. When `entrance="stagger"` is set,
  status, title, lede, and CTA animate in with a staggered top-down rise (8–12px
  translateY + fade, ~1.05 s total). Pure CSS @keyframes — zero JS, no
  IntersectionObserver, static-render-compatible.

  Default `entrance={undefined}` preserves existing static behavior; no changes
  for existing consumers.

  Accessibility: `prefers-reduced-motion: reduce` disables all animations via
  an explicit `animation: none` override in the component CSS module.

  Closes #47.

## 0.7.1

### Patch Changes

- f555833: Hero: compress vertical rhythm at size=intimate

  At size="intimate", status→title gap shrinks to --space-3 (12px) and title→lede gap shrinks to --space-4/--space-6 (mobile/desktop). Resolves disproportionate spacing flagged in live audit. No API change; display variant is unchanged.

## 0.7.0

### Minor Changes

- 8d8e792: Add `size` prop to `<Hero>` molecule with `"display"` (default) and `"intimate"` values.

  The `"display"` default preserves all existing consumer behavior byte-for-byte. `"intimate"` lowers the title clamp from `--fs-tagline` (36–68 px) to `--fs-tagline-intimate` (32–52 px) — a quieter register for low-density doorway pages. All other Hero rhythm (gaps, lede, CTA, color, font family, em accent) is unchanged across both values. New token `--fs-tagline-intimate` added to `tokens.css`.

## 0.6.1

### Patch Changes

- 0c25711: docs: sync llms-full.txt with 0.6.0 color tokens

  Documents `--bg-elevated` (#FFFFFF, front-most layer), corrects `--bg` value to `#FBFBFD`, and adds the three-step elevation rhythm and "never pure edges" rule. Adds a CI gate (`scripts/check-llms-tokens-sync.mjs`) that fails the build if a color token is defined in `tokens.css` but absent from `meta/llms-full.txt`.

## 0.6.0

### Minor Changes

- 60c67cf: Apple-aligned palette refinement: `--bg` shifts off pure white to `#FBFBFD` (apple.com canvas), and `#FFFFFF` becomes the reserved value of a new `--bg-elevated` token for popovers / sheets / front-most layers. Establishes a three-step elevation rhythm (`--surface < --bg < --bg-elevated`) and the "never pure edges" rule that makes the palette invert cleanly to dark mode. Page contrast remains AAA: `--fg` on `--bg` ≈ 16.3:1. See `meta/brand.md` for the full decision entry, contrast math, and dark-mode direction sketch.

## 0.5.0

### Minor Changes

- 3bfc703: Ship `llms.txt` + `llms-full.txt` as package exports — the design system's living rules for LLM consumers. Adds CI gate requiring `llms-full.txt` updates on component/token changes.

## 0.4.0

### Minor Changes

- e4f13cc: Add six brand assets under `brand/` for use cases beyond the horizontal `<Wordmark>` lockup: stacked lockup (SVG vector + transparent PNG), isotype-only transparent PNG, wide wordtype banner, plus avatar-sized stacked and isotype-only renders on a light-grey background. All available via the existing `@poukai-inc/ui/brand/*` subpath.
- 072d3bd: Ship `llms.txt` — a single LLM-consumable context file (llmstxt.org convention) built from `meta/decisions/*.md` + `src/tokens/tokens.css` + the curated component surface. Available via subpath `@poukai-inc/ui/llms.txt`. Regenerated on every `pnpm build` via the new `build:llms` script.

## 0.3.2

### Patch Changes

- 7e3c8c6: Visual polish pass:

  **Wordmark horizontal lockup proportions revised.** Three coupled changes to rebalance the mark's visual weight:
  - Gap between isotype and wordtype: 24 → 120 SVG units (~25 rendered px at SiteShell's 56px height).
  - Wordtype scale: 1× → 1.8× (cap-height ≈28px → ≈50px).
  - Isotype scale: 1× → 1.25× to give the feather more presence over the lettering.

  `viewBox` `0 0 662 274` → `0 0 1184 290` (aspect ratio 2.4:1 → ~4.08:1). Consumers sizing the mark by container width should re-check layouts. No prop API change. Supersedes the geometry lock from ADR-0009; see ADR-0011 for the full derivation, including the same-day corrections of the initial 40-SVG-unit gap and the subsequent isotype scale-up.

  **Wordmark inverted variant now actually inverts.** Removed the hardcoded `color: var(--fg)` on `.root` that was overriding the parent's color context. The SVG's `fill="currentColor"` now inherits from whatever color is in scope — so an inverted wrapper that sets `color: var(--bg)` actually produces a light mark on a dark background.

  **RoleCard grid overlap fixed.** Removed `min-height: 100%` from `.root`. CSS Grid items already stretch to the row height via the default `align-items: stretch`; the percentage height was resolving against an undefined parent context in some grid layouts and causing second-row cards to overflow into the first row.

  **StatusBadge `available` pulse made visible.** Keyframes: `scale(1 → 4)` (was `1 → 2.2`); `opacity(0.7 → 0 by 70%)` (was `0.6 → 0`). Duration `2400ms → 1800ms` with `ease-out` (was `ease-in-out`). Pulse background stays `--accent-glow`. The dot itself gains a static 2px `--accent-glow` halo so it reads as "lit" between pulses rather than going dark. The motion now reads as a soft heartbeat rather than a flicker.

## 0.3.1

### Patch Changes

- b3f854d: Re-shift POUKAI letter groups so the feather isotype renders flush-left of the full wordmark rather than overlapping the 'O' position.

## 0.3.0

### Minor Changes

- b3d9876: Restore Wordmark to horizontal lockup (isotype left, POUKAI lettering right, side-by-side).

  The SVG geometry in `brand/poukai-logo.svg` was rearranged: the isotype group's translate-y was shifted by +82 so the mark sits on the wordtype's cap-height midline, and the six letter-group tx values were each shifted by +140 to place the lettering flush-right of the isotype with a ~24 px optical gap.

  The viewBox changed from `0 0 518.67 274.41` (aspect ratio ~1.9:1) to `0 0 662 274` (aspect ratio ~2.4:1). Consumers who sized containers around the old aspect ratio should re-check their layouts. No prop API change — `height`, `label`, and `className` are unchanged.

## 0.2.3

### Patch Changes

- a51a926: Raise SiteShell brand-mark height from 28px to 56px so the wordmark reads as the page identity anchor.

## 0.2.2

### Patch Changes

- 12e7959: Fix: component CSS never reached the browser. Auto-inject per-entry CSS via side-effect imports in the library bundles.

  The DS built `dist/style.css` correctly, but neither the package `exports` nor the entry JS files referenced it. Consumers got the scoped class names on the DOM (`<header class="poukai_YcL9S7">`) but no rules — header nav rendered as a default bulleted list, `RoleCard` had no card recipe, no hairline separators, no per-component layout. Only `tokens.css` (explicitly imported by consumers) worked.

  Fixed by enabling `cssCodeSplit: true` in `vite.config.ts` and adding `vite-plugin-lib-inject-css`, which makes each library entry emit a sibling CSS file and injects a side-effect `import "./<entry>.css"` at the top of the JS. Consumers' bundlers (Vite, Astro, Next, etc.) pick the CSS up automatically — no new explicit import required.

  Per-entry CSS also means subpath imports (`@poukai-inc/ui/atoms`, etc.) only pull in the CSS for components they ship.

## 0.2.1

### Patch Changes

- b91efc8: Fix: `build:tokens` copies `tokens.css` to `dist/src/tokens/tokens.css` instead of `dist/tokens.css`.

  Without `--flat`, `cpy` preserves the source path, so the file lands at
  `dist/src/tokens/tokens.css`. The package `exports` map points to `./dist/tokens.css`,
  so any registry-installed consumer doing `import "@poukai-inc/ui/tokens.css"` got a 404. Workspace-linked consumers worked only because the path was manually corrected
  locally. Fixed by adding `--flat` to the `cpy` command for the tokens entry.

## 0.2.0

### Minor Changes

- 5fcb576: Ship favicon set + OpenGraph image as runtime brand assets.

  New `./brand/*` export — drop-in social/favicon files referenced by the
  consuming repo's `<head>`:
  - `favicon.svg` (vector, `prefers-color-scheme`-aware fill)
  - `favicon-32.png`, `favicon-16.png` (raster fallbacks)
  - `apple-touch-icon.png` (180×180, iOS home screen)
  - `og.png` (1200×630, OpenGraph + Twitter card)

  ```html
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta property="og:image" content="https://pouk.ai/og.png" />
  ```

  In a Next.js / Vite consumer the files resolve as URL imports:

  ```ts
  import faviconSvg from "@poukai-inc/ui/brand/favicon.svg";
  import og from "@poukai-inc/ui/brand/og.png";
  ```

  Build pipeline: new `build:brand` script copies `src/brand/**` into
  `dist/brand`; the root `build` now chains `build:tokens` and `build:brand`
  so a single `pnpm build` produces a publish-ready `dist/` (previously the
  tokens copy had to be invoked separately).

  Source files live in `src/brand/`. The package-root `brand/poukai-logo.svg`
  remains the build-time source for the inlined Wordmark geometry and is
  unchanged.

## 0.1.0

### Minor Changes

- e8b1b83: `0.1.0` — Phase 1 complete. Atomic-Design taxonomy with six new components.

  **Atoms**
  - **`Stat`** — display numeral + caption + optional source line. Pure typography.
    Props: `value`, `caption`, `source?`, `align?: "start" | "end"`, `size?: "md" | "lg"`.
    Uses new tokens `--fs-stat`, `--fs-stat-large`, `--tracking-stat`.

  **Molecules**
  - **`Hero`** — owns the hand-tuned vertical rhythm from the holding page.
    Props: `title`, `lede`, `status?`, `cta?`, `align?: "start" | "center"`,
    `titleAs?: "h1" | "h2"`. `status` and `cta` are `ReactNode` slots — the
    molecule does **not** import `StatusBadge` or `Button` itself.
  - **`RoleCard`** — surface + hairline + `--radius-3` card recipe with editorial
    typography. Props: `eyebrow`, `title`, `body`, `hiredBy?`, `icon?`. `icon`
    is a slot; the DS does not import `lucide-react`. `hiredBy` footer is
    bottom-pinned so cards in a grid align regardless of body length.
  - **`Principle`** — editorial numbered block (`/principles` recipe). Margin
    numeral on desktop, numeral above title on mobile. Props: `numeral` (free-form
    string), `title`, `children`. Numeral is `aria-hidden` (decorative).
  - **`FailureMode`** — `/why-ai` recipe. Zero-padded index above the title.
    Props: `index: number`, `indexLabel?: string`, `title`, `children`.
    Visually distinct from `Principle`: the failure is the subject, the number
    is just a reference.

  **Organisms**
  - **`SiteShell`** — top nav (linked wordmark + route list) + main slot +
    hairline footer. Props: `currentRoute?`, `routes?`, `footer?`, `homeHref?`,
    `navLabel?`, `children`. **No router awareness** — emits plain `<a href>`.
    Composes `Wordmark` from `atoms/` (organisms may know about chrome).
    Active route is marked with `aria-current="page"`.

  **Tokens**
  - Additive only. New: `--fs-stat`, `--fs-stat-large`, `--tracking-stat`.
    No existing token changed.

  **Structure**
  - First entries in `src/molecules/` and `src/organisms/` — both directories
    are now real, not just reserved.

  Public import paths (`@poukai-inc/ui`) unchanged. No breaking changes.

  This release unblocks Phase 2 of the migration plan — `poukai-inc/pouk.ai`
  can consume `@poukai-inc/ui@0.1.0` for the Astro site rebuild.

- e8b1b83: Restructure `src/` under Atomic-Design taxonomy.
  - `src/components/Wordmark` -> `src/atoms/Wordmark`
  - `src/components/StatusBadge` -> `src/atoms/StatusBadge`
  - `src/components/Button` -> `src/atoms/Button`
  - New empty folders reserved for `src/molecules/` and `src/organisms/`.
  - Path aliases updated: `@atoms/*`, `@molecules/*`, `@organisms/*`.

  Public import paths (`@poukai-inc/ui`) are unchanged; this is a contributor-facing
  move only. No API changes.

### Patch Changes

- 5eed86a: DX + CI improvements.

  **a11y gate**
  - New `src/a11y.test.tsx` mounts every shipped component and scans with
    `@axe-core/playwright`. Runs as part of `pnpm test` (same Playwright
    suite) and on every PR via the existing CI job.
  - `@axe-core/playwright` added as a dev dep.
  - New `pnpm test:a11y` script for running just the a11y leg locally.

  **Per-subpath size budgets**
  - `size-limit` now measures each subpath entry independently:
    `dist/atoms.js`, `dist/molecules.js`, `dist/organisms.js`. Catches
    accidental cross-layer imports (e.g. an atom pulling in a molecule).

  **Wordmark regeneration script**
  - `scripts/build-wordmark.mjs` regenerates `wordmark-geometry.ts` from
    `brand/poukai-logo.svg`. The header of the generated file references the
    command so the next contributor doesn't hand-edit.
  - New `pnpm build:wordmark` script.
  - `brand/poukai-logo.svg` is now committed inside the package so the script
    has its source colocated.

  **README**
  - New "Subpath imports" section showing the per-layer entry points.

  No public API changes.

- e8b1b83: Fix: `Wordmark` renders empty.

  The component referenced an external SVG symbol via
  `<use href="#poukai-wordmark-geometry" />`, but no consumer or DS-internal
  sprite ever defined that symbol. The mark rendered as an empty box.

  Geometry is now **inlined** at build time from a generated
  `wordmark-geometry.ts` (regenerated from `brand/poukai-logo.svg`, with the
  verbose per-path styling stripped — `fill="currentColor"` on the parent
  `<svg>` handles colour). Self-contained; no consumer setup required.

  Adds a regression test that asserts at least six `<path>` elements render.
  Bundle grows by ~9 kB (the path data itself is incompressible); within the
  size-limit budget.

  No API change.
