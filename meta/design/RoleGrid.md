# RoleGrid

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

RoleGrid is a Section-framed organism that arranges a set of `RoleCard` molecules into a responsive grid. Its single job is the "who this is for" / "teams we serve" pattern on marketing and editorial surfaces — a heading that names the audience, followed by a grid of role cards each describing one persona. The grid handles column count and responsive collapse; it owns nothing about the cards themselves.

## 2. Anatomy

```
<section>  ← Section organism (eyebrow + heading + children)
  <div class="grid">
    <RoleCard />   ← slot × n
    <RoleCard />
    <RoleCard />
    …
  </div>
</section>
```

- **Section wrapper** — provides the outer `<section>`, optional eyebrow label, heading, and section background via the `Section` organism's existing props.
- **Grid container** — `<div>` with CSS grid layout; owns column count, gap, and responsive behaviour.
- **Card slots** — unordered children, each expected to be a `RoleCard`. The component does not enforce this at runtime but the design contract assumes it.

## 3. Tokens

- `--space-6` (1.5rem / 24px) — column and row gap between cards at mobile
- `--space-8` (2rem / 32px) — column and row gap between cards at `--bp-md` and above
- `--bg` — page background inherited from Section; no override
- `--surface-section` — optional section band background passed to Section via `surface` prop
- `--content-max` (64rem) — outer width ceiling; inherited from Section
- `--page-pad` — horizontal padding; inherited from Section
- `--bp-md` (768px) — breakpoint at which grid expands from 1 to 2 columns
- `--space-12` (3rem / 48px) — top padding of the Section band (Section default; not overridden)
- `--space-16` (4rem / 64px) — bottom padding of the Section band (Section default; not overridden)

## 4. Variants / Props

| Prop       | Type                     | Default     | Rationale                                                                                                       |
| ---------- | ------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `heading`  | `string`                 | required    | Section heading; names the audience group ("Who it's for").                                                     |
| `eyebrow`  | `string`                 | `undefined` | Optional eyebrow label above the heading; passed through to Section.                                            |
| `surface`  | `"default" \| "section"` | `"default"` | `"section"` applies `--surface-section` band background via Section's surface prop.                             |
| `columns`  | `2 \| 3 \| 4`            | `3`         | Max column count at `--bp-md` and above. Below `--bp-md` always 1 column; at `sm+` 2 columns if `columns >= 2`. |
| `children` | `ReactNode`              | required    | The `RoleCard` instances.                                                                                       |

`columns` defaults to `3` because three cards is the canonical "who this is for" trio in the design reference. Two is valid for a binary audience split; four is the ceiling before the cards become visually narrow at `--content-max`.

## 5. Interaction

Static organism. No interactive states on the grid container itself. Individual `RoleCard` children own their own hover/focus states. Keyboard navigation follows natural DOM tab order through each card's interactive elements (if any).

## 6. A11y

- Outer element is `<section>` via the `Section` organism; carries an implicit `region` landmark when the heading is present (the heading provides the accessible name).
- Grid container is a plain `<div>` — no ARIA role needed; it is a layout container, not a semantic list. Cards are not choices or selectable items.
- The `heading` prop renders as an `<h2>` inside Section (Section's standard heading level). Page must not use RoleGrid as the sole `<h1>` source.
- No `role="list"` or `role="listitem"` wrapping — RoleCard instances are not a list of navigable items; they are content blocks.
- Contrast is delegated to `RoleCard` and `Section`; RoleGrid introduces no new text nodes.

## 7. Motion

None — static organism. `RoleCard` children may carry their own entrance or hover motion; RoleGrid does not add or suppress it. The global `prefers-reduced-motion: reduce` block in `tokens.css` covers any inherited transitions from child components.

## 8. Anti-patterns

- **Do not use RoleGrid to display selectable options** (e.g. a plan picker or a role-chooser form). It is editorial display only — no selection state, no `onChange`.
- **Do not mix non-RoleCard children** into the grid. The grid gap and column sizing are calibrated for RoleCard's proportions. Inserting arbitrary cards or text blocks breaks the rhythm.
- **Do not use RoleGrid for team member bios** — that is `TeamGrid`'s domain. RoleGrid cards describe audience personas, not people.
- **Do not force four columns at narrow viewports** — the `columns` prop governs the desktop max; mobile is always 1 column.
- **Do not use RoleGrid as the page's primary heading container** — it renders an `<h2>`, not an `<h1>`. A `Hero` must appear above it for correct document outline.
- **Do not nest RoleGrid inside another Section** — double Section framing creates redundant landmark nesting and inconsistent padding.

## 9. Depends on

- `Section` — provides the outer `<section>` element, eyebrow, heading, and band padding.
- `RoleCard` — the card molecule that populates the grid slots.
