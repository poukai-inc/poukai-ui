# PriceTier

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`PriceTier` is the molecule that represents a single pricing plan on a pricing page. It holds a tier name, a price display, a feature bullet list, and a CTA slot. An optional `featured` flag elevates the recommended tier visually above its siblings. It is consumed directly by a `PricingTable` organism that lays out multiple tiers in a grid.

## 2. Anatomy

```
┌─────────────────────────────┐
│  [name]          (eyebrow)  │
│  [price]  /[per]  (stat)    │
│  ─────────────────────────  │
│  • bullet 1                 │
│  • bullet 2                 │
│  • bullet 3                 │
│  ─────────────────────────  │
│  [CTA slot]                 │
└─────────────────────────────┘
```

- **Card root** — `<article>`. Carries `--surface` background by default; `--bg-elevated` when `featured`.
- **Name** — tier label, rendered as `<h3>`. Geist sans, `--fs-h3`, `--fg`.
- **Price block** — numeric price at `--fs-stat` (Instrument Serif) + `per` period label at `--fs-meta` / `--fg-muted`. Composes visually as a Stat-like display unit; does not import the `<Stat>` atom directly (different rhythm contract).
- **Divider** — `1px` hairline rule separating the price block from the bullet list. Uses `--hairline` / `--hairline-w`.
- **Bullet list** — `<ul>` of feature strings. Each `<li>` carries a leading check icon slot (optional; consumer provides via `bulletIcon` prop) or a plain bullet.
- **CTA slot** — accepts any `ReactNode`; typically a `<Button>`. Full-width inside the card.
- **Featured badge** — when `featured`, an inline label ("Recommended" or consumer-supplied string) rendered above the name as a micro-uppercase eyebrow. Uses `--accent` color on `--bg-elevated`.

## 3. Tokens

- `--bg` — default card background
- `--bg-elevated` — featured card background (elevated surface; see brand.md: pure `#fff` is reserved for this front-most layer)
- `--surface` — recessed-tier card background (non-featured alternate; consumer choice)
- `--fg` — tier name color, bullet text color
- `--fg-muted` — `per` period label color, bullet secondary text
- `--accent` — featured badge text color; optional featured border accent
- `--hairline` — divider color
- `--hairline-w` — divider thickness (`1px`)
- `--font-serif` — price numeral font family
- `--font-sans` — name, bullets, badge font family
- `--fs-stat` — price numeral font size (`clamp(2.75rem, 2rem + 3vw, 4.5rem)`)
- `--fs-h3` — tier name font size (`1.125rem`)
- `--fs-meta` — `per` label font size (`0.875rem`)
- `--fs-micro` — featured badge font size (`0.75rem`)
- `--tracking-micro` — featured badge letter-spacing (`0.04em`)
- `--tracking-stat` — price numeral tracking (`-0.015em`)
- `--fs-body` — bullet list font size
- `--lh-body` — bullet list line-height
- `--space-2` — name → price gap; bullet list item gap
- `--space-4` — price block → divider gap; divider → bullet list gap; bullet list → CTA gap
- `--space-6` — featured badge → name gap
- `--space-8` — card internal block padding (top + bottom)
- `--space-6` — card internal inline padding
- `--radius-3` — card border-radius (`8px`)

## 4. Variants / Props

| Prop            | Type        | Default         | Rationale                                                                       |
| --------------- | ----------- | --------------- | ------------------------------------------------------------------------------- |
| `name`          | `string`    | — (required)    | Tier label rendered as `<h3>`                                                   |
| `price`         | `string`    | — (required)    | Displayed at stat scale; e.g. `"$29"`, `"Free"`, `"Custom"`                     |
| `per`           | `string`    | `undefined`     | Period label below price; e.g. `"month"`, `"year"`. Omit for free/custom tiers. |
| `bullets`       | `string[]`  | `[]`            | Feature list rendered as `<ul>` items                                           |
| `bulletIcon`    | `ReactNode` | `undefined`     | Leading icon per bullet; typically a lucide check icon. Optional.               |
| `cta`           | `ReactNode` | — (required)    | CTA button slot; renders full-width at card bottom                              |
| `featured`      | `boolean`   | `false`         | Elevates card to `--bg-elevated`, shows featured badge                          |
| `featuredLabel` | `string`    | `"Recommended"` | Override badge text when `featured`                                             |

## 5. Interaction

Stateless container. No hover or click behavior on the card itself. Interactive behavior delegated entirely to the `cta` slot. Focus moves through the CTA button naturally in tab order.

## 6. A11y

- Root element is `<article>` — each tier is an independently meaningful unit; `article` landmark is correct.
- `aria-label` on the root is derived from the `name` prop (e.g. `aria-label="Pro plan"`) so screen reader users can distinguish tiers when navigating by landmark.
- Bullet list is `<ul>` / `<li>` — correct list semantics; screen readers announce item count.
- Price numeral is plain text, not an image or icon font — reads correctly without ARIA.
- Featured badge renders as `<p aria-label="Recommended">` — no heading semantics; it is a visual annotation.
- Contrast: `--fg` on `--bg-elevated` = `#1d1d1f` on `#ffffff` — 19.05:1 (AAA). `--fg-muted` on `--bg-elevated` — 4.73:1 (AA normal). `--accent` featured badge on `--bg-elevated` = `#0071e3` on `#ffffff` — 4.52:1 (AA normal).

## 7. Motion

None — static component. The `cta` slot inherits Button's own press feedback (`--dur-press`, `--easing`). No card-level entrance animation; if a stagger is needed, the parent `PricingTable` organism owns it.

`prefers-reduced-motion`: no component-level override needed; no animation is defined here.

## 8. Anti-patterns

- Do not use `PriceTier` as a general feature card — it is pricing-specific. Use `FeatureCard` for non-pricing feature grids.
- Do not embed multiple CTAs inside one tier — the slot is singular. Footnote links (e.g. "See all features") belong outside the card or as a plain text link below the CTA, not as a second Button.
- Do not render `PriceTier` in isolation at full page width — it is designed to live inside a `PricingTable` grid that constrains its column width.
- Do not put long prose in `bullets` — each item should be a short (≤ 8 words) feature claim. Paragraph-length text breaks the scan rhythm.
- Do not set `featured` on more than one tier in a group — semantic ambiguity; exactly one tier can be recommended.

## 9. Depends on

- `Button` — canonical `cta` slot occupant
- `Heading` — if the engineer chooses to compose the name via the `<Heading>` atom (optional; a plain `<h3>` is also correct)

Note: the proposal lists `Stat` and `LinkList` as dependencies. On review, neither is a true dependency: the price display uses `--fs-stat` tokens directly (different layout contract than the `<Stat>` atom), and the bullet list is a simple `<ul>` (not a `LinkList`, which is for navigational links). The engineer should not import `Stat` or `LinkList` into this component.

## Open questions

- **Featured card border.** The spec calls for `--bg-elevated` surface elevation on the featured card. Whether a subtle `--hairline` or `--accent`-colored 1px border should reinforce the elevation (as Apple's pricing cards use) is undecided. A hairline border would require no new token (`--hairline` exists). An accent-colored border would also use the existing `--accent` token. Decision to be made during implementation review with Arian.
- **`bulletIcon` default.** If no `bulletIcon` is passed, should the bullet render as a plain `<li>` list marker or as a specific check icon? A default icon (e.g. lucide `check`) baked into the component would produce consistent output but couples the component to a specific icon shape. Leaving it as a plain list marker avoids coupling. Recommend plain marker as default; consumer opts into icon via the prop.
