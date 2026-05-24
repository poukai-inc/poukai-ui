# FeatureGrid

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`<FeatureGrid>` is the organism that frames a responsive grid of `FeatureCard` molecules inside a `Section` wrapper. It owns the heading slot, the grid layout (1 → 2 → 3 columns driven by CSS `minmax`), and the gap rhythm between cards. It serves marketing landing pages and feature-overview surfaces where a set of benefit or capability cards must be presented in a scannable, evenly-spaced grid with an optional section heading.

## 2. Anatomy

```
<Section as="section" title={heading} titleAs="h2">
  <div class="grid">           ← CSS grid container
    <FeatureCard />            ← slot children, 1–N cards
    <FeatureCard />
    <FeatureCard />
  </div>
</Section>
```

- **Root**: `Section` molecule — owns eyebrow, heading, lede, and block padding. FeatureGrid forwards `eyebrow`, `heading` (→ `title`), and `lede` to Section.
- **Grid container**: `<div>` — `display: grid` with fluid `repeat(auto-fit, minmax(…, 1fr))` columns. Not a semantic element; Section provides the landmark.
- **Card slot**: `children` — any `ReactNode`, idiomatic usage is one or more `<FeatureCard>` instances.

## 3. Tokens

- `--space-6` (1.5rem / 24px) — grid gap at narrow viewport (≤ `--bp-md`)
- `--space-8` (2rem / 32px) — grid gap at wide viewport (> `--bp-md`)
- `--space-16` (4rem / 64px) — Section block padding (default size)
- `--bg` — page background, inherited via Section
- `--fg` — heading color, inherited via Section h2
- `--fg-muted` — lede color, inherited via Section lede
- `--font-serif` — heading font, inherited via Section h2 global rule
- `--fs-body` — lede size, inherited from body
- `--hero-max` — Section header block max-width (38rem)
- `--hairline` / `--hairline-w` — optional Section divider if consumer adds `as="article"`
- `--bp-md` (768px) — breakpoint for gap and column-count shift

## 4. Variants / Props

| Prop       | Type                   | Default     | Rationale                                                                                                                                                     |
| ---------- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heading`  | `string`               | —           | Optional. Forwarded to `Section` as `title`. Omit for anonymous grid blocks (e.g. embedded inside another Section).                                           |
| `eyebrow`  | `string \| ReactNode`  | —           | Optional. Forwarded to `Section` as `eyebrow`.                                                                                                                |
| `lede`     | `string \| ReactNode`  | —           | Optional. Forwarded to `Section` as `lede`.                                                                                                                   |
| `columns`  | `2 \| 3`               | `3`         | Max column count at widest viewport. `2` for wider cards (e.g. dense copy); `3` is the standard feature grid. `1` is always the mobile fallback via `minmax`. |
| `size`     | `"default" \| "tight"` | `"default"` | Forwarded to Section. `"tight"` for dense in-product surfaces.                                                                                                |
| `children` | `ReactNode`            | required    | `FeatureCard` instances. Any count — `auto-fit` fills available columns.                                                                                      |

Column `minmax` thresholds (not a new token — inline values expressing the grid intent):

- `columns=3`: `minmax(16rem, 1fr)` — yields 3 columns above ~560px, 2 above ~320px, 1 below
- `columns=2`: `minmax(20rem, 1fr)` — yields 2 columns above ~440px, 1 below

## 5. Interaction

None. FeatureGrid is a static layout organism. All interactive behavior (if any) lives inside individual `FeatureCard` children. No keyboard-managed composite widget; tab order follows natural DOM order through cards.

## 6. A11y

- Root renders as `<section>` via Section (landmark: region, when titled via `aria-labelledby`).
- `heading` prop → `Section`'s `title` wires `aria-labelledby` on the `<section>` root — ensures the region is announced as "What you get — region" to screen readers.
- When `heading` is omitted, Section falls back to an unlabeled `<section>` (degrades to generic container per spec). Consumer should pass `heading` or use `as="div"` via a future escape hatch if no region landmark is wanted.
- Grid container `<div>` is non-semantic — no role needed; it is purely presentational layout.
- `FeatureCard` children own their own semantic structure and contrast.
- axe rules in play: `region` (landmark labeling), `heading-order` (consumer responsibility for `titleAs`).

## 7. Motion

No entrance animation on FeatureGrid itself. `--dur-fast` and `--easing` are available to `FeatureCard` children for their own hover/focus transitions.

`prefers-reduced-motion`: the global block in `tokens.css` suppresses all child transitions — no per-organism override needed.

## 8. Anti-patterns

- Do not use FeatureGrid for a single card — use `FeatureCard` inline or inside a plain `Section` children slot.
- Do not use FeatureGrid for non-feature content grids (team members → `TeamGrid`, roles → `RoleGrid`). Each grid organism is semantically scoped.
- Do not nest FeatureGrid inside another FeatureGrid — the double Section padding would produce excessive vertical rhythm.
- Do not pass heterogeneous card types (mix of `FeatureCard` + `RoleCard`) — grid rows assume uniform card height rhythm; mixed card shapes will produce ragged rows.
- Do not use FeatureGrid as a general-purpose card layout utility — it is scoped to feature/capability grids. A generic `CardGrid` can be spec'd separately if needed.

## 9. Depends on

- `Section` molecule — provides the Section wrapper, eyebrow, heading, lede, and block padding.
- `FeatureCard` molecule — the idiomatic child card. FeatureGrid does not import or enforce `FeatureCard` at the type level; children is `ReactNode`.
