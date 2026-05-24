# TeamGrid

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`<TeamGrid>` is a Section-framed responsive grid of `TeamCard` molecules. Its single job is to present an "about the team" surface — a group of portrait + name + role cards — with consistent column rhythm, shared spacing, and correct semantic structure. It serves marketing pages, about pages, and any surface that introduces the people behind a product.

## 2. Anatomy

```
<section>                         ← Section organism (owns eyebrow, heading, lede, bg)
  <div class="grid">              ← CSS grid wrapper; 1 → 2 → 3 columns
    <TeamCard />                  ← repeated slot; consumer provides each card
    <TeamCard />
    …
  </div>
</section>
```

- **Section wrapper**: delegates to the `Section` organism for heading, optional eyebrow, optional lede, and section background. TeamGrid passes `heading` (and optionally `eyebrow`, `lede`) straight through to Section.
- **Grid container**: a `<div>` inside Section's content slot. Applies CSS grid with `minmax` column sizing and gap tokens.
- **Card slots**: `children` — each child is expected to be a `TeamCard`. TeamGrid does not validate or wrap individual cards; it positions whatever is slotted.

## 3. Tokens

- `--space-6` (1.5rem) — column and row gap between cards at all breakpoints
- `--space-16` (4rem) — top margin between the Section heading block and the grid
- `--space-24` (6rem) — Section padding-block (owned by Section, referenced here for rhythm context)
- `--surface-section` — optional recessed background when `tone="section"` is passed to Section
- `--content-max` (64rem) — max-width of the Section content column (owned by Section)
- `--bp-md` (768px) — breakpoint at which the grid expands from 1 to 2 columns
- `--font-sans` — inherited by TeamCard children; not directly applied at grid level
- `--fg` — inherited text color; not directly applied at grid level

## 4. Variants / Props

| Prop       | Type                     | Default     | Rationale                                                                                                                                                                                                                                                   |
| ---------- | ------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heading`  | `string`                 | required    | Section heading — e.g. `"The team"`. Required; a nameless team grid is not a valid surface.                                                                                                                                                                 |
| `eyebrow`  | `string`                 | `undefined` | Optional micro-label above the heading, passed to Section.                                                                                                                                                                                                  |
| `lede`     | `string`                 | `undefined` | Optional supporting sentence below heading, passed to Section.                                                                                                                                                                                              |
| `columns`  | `2 \| 3`                 | `3`         | Maximum column count at wide viewports. `2` for small teams (2–4 people); `3` for larger rosters. Below `--bp-md` the grid is always 1 column. Between `--bp-md` and a secondary breakpoint (~1024px) it is always 2 columns regardless of `columns` value. |
| `tone`     | `"default" \| "section"` | `"default"` | Passed to Section. `"section"` applies `--surface-section` band background for visual rhythm against adjacent default-bg sections.                                                                                                                          |
| `children` | `ReactNode`              | required    | The `TeamCard` instances. Count is the consumer's responsibility.                                                                                                                                                                                           |

## 5. Interaction

TeamGrid itself has no interaction. The grid container is a non-interactive layout wrapper.

If individual `TeamCard` children include links (e.g. a LinkedIn or personal site URL), focus order follows DOM order left-to-right, top-to-bottom through the card grid. No custom keyboard management is needed at the grid level — each card's interactive elements handle their own tab stops.

No hover, active, or selected state at the grid level.

## 6. A11y

- The Section organism provides a semantic `<section>` element with an accessible heading (`<h2>` by default). No additional landmark role is needed.
- The grid `<div>` is a non-semantic layout container — no `role` attribute required.
- Card count and column layout are purely visual; no `aria-*` attributes are needed on the grid container.
- Heading level passed to Section should be consistent with the page's document outline — the consumer controls this via Section's `headingLevel` prop.
- axe rules in play: `region` (Section must have an accessible name — the `heading` prop satisfies this), `color-contrast` (owned by TeamCard, not TeamGrid), `landmark-unique` (one `<section>` per TeamGrid instance; multiple TeamGrids on a page should each have a distinct heading).

## 7. Motion

None at the grid level. TeamGrid is a static layout organism.

If staggered card entrance animation is desired in a future iteration, it would be authored in TeamGrid via CSS `animation-delay` per child index. That animation would consume `--dur-stagger-step` and `--easing`, and must set `animation-play-state: paused` under `prefers-reduced-motion: reduce`. Not in scope for this version.

## 8. Anti-patterns

- **Do not use TeamGrid for non-person content.** A grid of feature cards belongs in `FeatureGrid`; a grid of role/audience cards belongs in `RoleGrid`. TeamGrid is specifically for people: portrait + name + role.
- **Do not exceed ~12 cards without a filtering or pagination mechanism.** TeamGrid has no overflow management. A roster of 20+ cards needs a separate pattern.
- **Do not pass arbitrary content as children.** The children slot is designed for `TeamCard` instances. Mixing in unrelated molecules produces inconsistent grid sizing and broken rhythm.
- **Do not use TeamGrid as a standalone atom.** It requires `Section` as its structural frame; stripping the Section wrapper to save space defeats the heading/landmark contract.
- **Do not set `columns={3}` for a 2-person team.** Two cards in a 3-column grid leaves a visually awkward orphan span. Use `columns={2}` for small rosters.
- **Do not center-align a single orphan card.** If an odd card count leaves a lone card in the final row, the grid aligns it to the start of the row (left-aligned). Do not override this with `justify-items: center` at the grid level — it conflicts with the editorial left-aligned register.

## 9. Depends on

- `Section` — provides the `<section>` semantic wrapper, heading, eyebrow, lede, and band background.
- `TeamCard` — the repeated child molecule. TeamGrid does not implement TeamCard; it composes it.
