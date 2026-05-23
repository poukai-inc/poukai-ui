# TimelineItem

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`TimelineItem` renders a single entry in a sequential chronological list: a date, a title, and supporting body copy. It is the repeating unit composed by a `Timeline` organism for changelog pages, company-milestones sections, and process-step explainers. It handles its own left-rail marker and connector line slot so each entry reads as part of an ordered sequence without the consumer managing visual continuity.

## 2. Anatomy

```
┌─────────────────────────────────────┐
│  ●  ──────────────────────          │  ← marker (dot) + connector line
│     <time> 2026-05-22               │  ← date (--fs-meta, --fg-muted)
│     Series A closed                 │  ← title (--fs-h3, --fg)
│     $12M led by Acme Ventures.      │  ← body (--fs-body, --fg-muted)
└─────────────────────────────────────┘
```

- **Marker**: a small circle (`8px`) on the left rail rendered via CSS `::before`. Uses `--accent` fill.
- **Connector line**: vertical `--hairline` rule extending downward from the marker, drawn by the parent `Timeline` organism. `TimelineItem` reserves the left-rail gutter via padding; it does not own the line itself.
- **Date**: semantic `<time>` element with a `dateTime` attribute. `--fs-meta`, `--fg-muted`, uppercase micro treatment.
- **Title**: rendered as `<h3>` by default. `--fs-h3`, `--fg`.
- **Body**: `<p>` or `ReactNode` slot. `--fs-body`, `--fg-muted`.

## 3. Tokens

- `--fs-meta` — date font-size (14px)
- `--fs-h3` — title font-size (18px)
- `--fs-body` — body font-size (17–19px fluid)
- `--font-sans` — date and title font family
- `--fg` — title color
- `--fg-muted` — date and body color
- `--accent` — marker dot fill
- `--hairline` — connector line color (owned by parent Timeline)
- `--hairline-w` — connector line width
- `--lh-body` — body line-height (1.55)
- `--lh-meta` — date line-height (1.2)
- `--space-1` — date margin-bottom (4px, tight label-to-title coupling)
- `--space-2` — title margin-bottom (8px)
- `--space-6` — left-rail gutter (24px, accommodates marker + breathing room)
- `--space-8` — bottom margin between entries (32px)
- `--tracking-micro` — date letter-spacing (0.04em, uppercase micro register)

## 4. Variants / Props

| Prop        | Type        | Default     | Rationale                                                                 |
| ----------- | ----------- | ----------- | ------------------------------------------------------------------------- |
| `date`      | `string`    | —           | ISO 8601 string; becomes `dateTime` attr on `<time>`. Required.           |
| `title`     | `ReactNode` | —           | Entry heading. Required.                                                  |
| `body`      | `ReactNode` | `undefined` | Supporting copy. Optional — some milestone entries are title-only.        |
| `connector` | `boolean`   | `true`      | Whether to render the downward connector stub. Last item passes `false`.  |

No `size` or `tone` variants in this version. Single register matches the brand's restraint rule.

## 5. Interaction

Static display molecule. No hover, active, or focus states on the item itself.

If `title` or `body` contains an anchor (`<a>`), that element inherits the global link styles from `tokens.css` (hairline underline at rest, accent underline on hover, focus-visible ring). The `TimelineItem` container adds no interaction of its own.

## 6. A11y

- Outer element: `<li>` — `TimelineItem` must live inside a `<ol>` supplied by the parent `Timeline` organism.
- Date: `<time datetime="{isoDate}">` — machine-readable date for assistive tech and parsers.
- Title: `<h3>` by default, matching the heading hierarchy for section-level use. If consumers need a different heading level, the engineer may expose a `headingLevel` prop (default `3`).
- Marker (`::before` pseudo): purely decorative CSS — no content, no ARIA needed.
- Connector line: CSS only, no DOM node.
- Contrast: `--fg` (#1D1D1F) on `--bg` (#FBFBFD) = 16.29:1 AAA. `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.56:1 AA.

## 7. Motion

None — static component.

The global `prefers-reduced-motion` block in `tokens.css` has no effect here. If a parent `Timeline` applies a stagger entrance animation to its `<li>` children, that is the organism's concern; `TimelineItem` does not own or add entrance timing.

## 8. Anti-patterns

- Do not use `TimelineItem` standalone outside a `Timeline` organism — the left-rail gutter and connector semantics assume sibling context.
- Do not use for status feeds or activity streams with live updates — this is a static editorial primitive, not a real-time log.
- Do not place more than one sentence in `date` — the date slot is `--fs-meta` uppercase micro; it is a label, not a paragraph.
- Do not use for navigation menus or step indicators — use `Stepper` for interactive multi-step flows.
- Do not use `title` for long-form headings — entries with titles beyond ~8 words should be rethought as a `Section` + prose pattern instead.

## 9. Depends on

- `Time` atom — semantic `<time>` wrapper with `dateTime` formatting.
- `Heading` atom — for the title slot at the appropriate heading level.
- `Text` atom — for the body slot.
- Parent: `Timeline` organism (to be specced separately) — owns the `<ol>`, the connector line, and the stagger rhythm.
