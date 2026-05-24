# PricingTable

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`PricingTable` is the pricing-page organism that frames a grid of `PriceTier` molecules and optionally pairs them with a `ComparisonRow` feature-matrix body below. It owns the Section wrapper, the tier grid layout, and the visual elevation of the featured (recommended) tier. Its job is to make plan differentiation scannable at a glance on a marketing or SaaS pricing surface.

## 2. Anatomy

```
<section>                         ← Section wrapper (page-section framing)
  [optional heading slot]
  <div class="tier-grid">         ← CSS grid, 1/2/3 columns responsive
    <PriceTier … />               ← standard tier
    <PriceTier … featured />      ← elevated tier (raised surface, accent border)
    <PriceTier … />
  </div>
  [optional ComparisonRow body]   ← feature × tier matrix below the grid
</section>
```

Parts:

- **Section wrapper** — `<section>` with `--surface-section` band; handles outer padding via `--page-pad`.
- **Heading slot** — optional, accepts a ReactNode above the grid (e.g. a `<Heading>` + billing-period toggle).
- **Tier grid** — CSS grid; each cell is a `PriceTier`. Featured tier is visually elevated.
- **Comparison body** — optional slot; intended for a `ComparisonTable` or `ComparisonRow` organism beneath the grid.

## 3. Tokens

- `--surface-section` — section band background (`#f8f8fa` light, `#161618` dark)
- `--bg-elevated` — featured tier card surface (`#ffffff` light, `#1c1c1e` dark)
- `--accent` — featured tier border / highlight stroke (`#0071e3` / `#0a84ff`)
- `--hairline` — standard tier card border (`#d2d2d7` / `#2c2c2e`)
- `--hairline-w` — 1px border width
- `--fg` — heading and tier-name color
- `--fg-muted` — per-description text, bullet list items
- `--font-sans` — all non-price text
- `--font-serif` — price numeral (editorial display register, matches `Stat`)
- `--fs-h2` — optional section heading (28–40px fluid)
- `--fs-card-title` — tier name (24–32px fluid)
- `--fs-stat` — price numeral (44–72px fluid)
- `--fs-body` — bullet text, per-description
- `--fs-meta` — "per month" / billing cadence label
- `--space-2` — gap between bullet items (8px)
- `--space-4` — inner card padding unit, label-to-value gaps (16px)
- `--space-6` — tier name to price gap (24px)
- `--space-8` — card internal vertical padding (32px)
- `--space-12` — grid-to-comparison-body gap (48px)
- `--space-16` — section vertical padding (64px)
- `--page-pad` — horizontal padding at section edges
- `--radius-3` — card corner radius (8px)
- `--radius-2` — inner element radius (4px)
- `--easing` — featured-tier entrance / hover lift
- `--dur-fast` — hover transition duration (180ms)

## 4. Variants / Props

| Prop         | Type                 | Default     | Rationale                                                                                                |
| ------------ | -------------------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `heading`    | `ReactNode`          | `undefined` | Optional section headline + toggle slot above the grid                                                   |
| `children`   | `ReactNode`          | required    | One or more `PriceTier` children                                                                         |
| `comparison` | `ReactNode`          | `undefined` | Slot for `ComparisonTable` / `ComparisonRow` below the grid                                              |
| `columns`    | `2 \| 3 \| "auto"`   | `"auto"`    | `"auto"` uses CSS `minmax` to collapse 3-up to 1-up responsively; explicit values lock column count      |
| `align`      | `"top" \| "stretch"` | `"stretch"` | `"stretch"` equalizes card heights so CTA buttons align across tiers; `"top"` lets cards size to content |

`columns="auto"` is the dominant use case (pricing pages rarely know column count at design time). Explicit values are escape hatches for locked editorial layouts.

## 5. Interaction

- **Billing toggle**: if a heading slot includes a billing-period toggle (monthly/annually), the toggle and the price updates it drives are the consumer's responsibility — `PricingTable` provides no built-in toggle state. The heading slot accepts any ReactNode.
- **Hover on PriceTier**: each `PriceTier` may lift slightly on hover (subtle `box-shadow` or `translateY(-2px)` via `--dur-fast`). The featured tier is already elevated; its hover lift is suppressed to avoid competing with the static elevation signal.
- **Keyboard**: standard tab order through tier CTAs and any comparison interactive elements. No custom keyboard management at the organism level.
- **Focus**: each tier's CTA `Button` carries the global `:focus-visible` ring (`--accent`, 2px, 4px offset).

## 6. A11y

- Semantic `<section>` wraps the organism; consumer adds `aria-labelledby` pointing to the heading if one is present.
- Tier grid is a presentational layout container (`<div>`) — no ARIA grid role; `PriceTier` cards are not `role="gridcell"`. Pricing cards are informational, not interactive grid cells.
- Each `PriceTier`'s CTA `Button` must have a descriptive accessible name — e.g. `"Get started with Pro"` not just `"Get started"` — so SR users can distinguish CTAs across tiers. This is a `PriceTier` contract, documented here as a composition rule.
- If bullet lists use `<ul>` / `<li>`, screen readers announce them as lists; consumer must not suppress this with `list-style: none` alone without also removing the role (`role="list"` or `list-style: none` only on Safari where the UA removes role, so prefer explicit `<ul>` markup).
- Featured tier visual distinction must not rely on color alone. The elevated surface + accent border + any "Recommended" label together satisfy this. The label text ("Recommended" or "Most popular") should be in the DOM, not only in a CSS `::before` pseudo-element.
- Contrast: `--fg` on `--bg-elevated` (featured card) = 16.29:1 (AAA). `--fg-muted` on `--bg-elevated` = 4.91:1 (AA). Both pass at all text sizes.

## 7. Motion

- Featured tier entrance: subtle `translateY` from 4px → 0 using `--easing` at `--dur-fast` (180ms) on page load. This is minimal — the pricing page is a high-intent surface, not an editorial showcase. Reduced-motion: `animation: none`.
- Tier hover lift: `transform: translateY(-2px)` + `box-shadow` step up, transition `--dur-fast` (180ms) with `--easing`. Featured tier: lift suppressed (already at elevated state).
- `@media (prefers-reduced-motion: reduce)`: all transforms and transitions collapse to instant via the global token block in `tokens.css`. No per-component override required beyond the featured-tier entrance animation (`animation: none` in that media query).

## 8. Anti-patterns

- **Do not use PricingTable for feature comparison only.** A feature-by-tier matrix without pricing belongs in `ComparisonTable` alone.
- **Do not use PricingTable for a single tier.** A solo card is a `PriceTier` placed inside a `Section`, not a `PricingTable`.
- **Do not encode billing-period state inside PricingTable.** Price toggling is a consumer concern; the DS provides the slot, not the state machine.
- **Do not nest PricingTable inside another PricingTable.** One pricing grid per page section.
- **Do not pass more than four PriceTier children.** Beyond four, the grid becomes unreadable on tablet widths. Four tiers is the upper bound; three is the canonical pattern.
- **Do not use for plan upsell banners or in-product upgrade prompts.** Those are Alert or a modal composition, not a pricing grid.

## 9. Depends on

- `Section` — outer page-section framing and `--surface-section` band
- `PriceTier` — the molecule that supplies each tier card (name, price, bullets, CTA, featured flag)
- `Button` — CTA inside each `PriceTier`
- `ComparisonTable` (optional, separate organism) — comparison body slot beneath the grid
