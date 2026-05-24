# TimelineSection

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`TimelineSection` is the Section-framed vertical list of `TimelineItem` molecules. Its single job is to provide the Section header (eyebrow, heading, optional lede) and the left-rail marker rhythm for changelog, company-milestones, and process-explainer surfaces. It owns the rail line and item spacing so consumers never re-roll the vertical track layout across pages.

## 2. Anatomy

```
<section>                        ← Section root (organism wrapper)
  [Section header block]         ← eyebrow + heading + lede via Section
  <ol>                           ← ordered list; semantic time sequence
    <li> × n                     ← each wraps a TimelineItem
      [left rail]                ← ::before pseudo-element: marker dot + connecting line
      [TimelineItem content]     ← date + title + body
```

- **Section header block** — delegated entirely to `Section` (eyebrow, h2, lede).
- **Track list** (`<ol>`) — an ordered list carrying the sequence. `list-style: none`.
- **Rail marker** — each `<li>` carries a `::before` pseudo-element: a `--space-2` diameter circle dot in `--hairline` (resting) or `--fg-muted` (last / featured item). A vertical `--hairline-w` line connects dots; the last item suppresses the connecting line.
- **TimelineItem** — molecule; owns date + title + body rendering. Receives no rail styling from the item itself — the `<li>` wrapper in TimelineSection owns the rail.

## 3. Tokens

- `--space-16` — Section block padding (default size)
- `--space-12` — gap: Section header → track list; Section block padding (tight size)
- `--space-8` — gap between `<li>` items (vertical rhythm between entries)
- `--space-4` — left offset: gap between rail line and TimelineItem content column
- `--space-2` — marker dot diameter (approximate; set via width/height on `::before`)
- `--hairline` — rail line color; marker dot resting color
- `--hairline-w` — rail line stroke width (1px)
- `--fg-muted` — marker dot accent on featured/last item; date text color (delegated to TimelineItem)
- `--fg` — title text color (delegated to TimelineItem)
- `--font-sans` — date and body text (delegated to TimelineItem)
- `--font-serif` — entry title (delegated to TimelineItem)
- `--fs-meta` — date text scale (delegated to TimelineItem)
- `--fs-h2` — Section heading
- `--dur-fast` — no transitions on TimelineSection itself; TimelineItem inherits global rules

## 4. Variants / Props

| Prop        | Type                   | Default     | Rationale                                                                                                                                                                              |
| ----------- | ---------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eyebrow`   | `string \| ReactNode`  | `undefined` | Delegated to Section eyebrow slot                                                                                                                                                      |
| `heading`   | `ReactNode`            | `undefined` | Delegated to Section title slot (h2 by default)                                                                                                                                        |
| `headingAs` | `"h1" \| "h2" \| "h3"` | `"h2"`      | Delegated to Section titleAs; `h2` correct below a Hero h1                                                                                                                             |
| `lede`      | `ReactNode`            | `undefined` | Delegated to Section lede slot                                                                                                                                                         |
| `size`      | `"default" \| "tight"` | `"default"` | Delegated to Section size; `tight` for denser editorial contexts                                                                                                                       |
| `children`  | `ReactNode`            | required    | One or more `TimelineItem` elements; rendered inside the `<ol>` track                                                                                                                  |
| `reversed`  | `boolean`              | `false`     | When true, renders the list in reverse DOM order (newest-first). Consumers pass items oldest-first; `reversed` flips display without changing source order. Uses HTML `<ol reversed>`. |

No `orientation` prop — horizontal timelines are a different layout pattern outside this spec.

## 5. Interaction

Static organism. No hover, active, or dismiss states on the organism itself. Individual `TimelineItem` entries are non-interactive unless a consumer composes an anchor or button inside the item's body slot (TimelineItem spec governs that). Tab order follows natural DOM sequence through any interactive children.

## 6. A11y

- Root element: `<section>` via Section; receives `aria-labelledby` wired to the heading id when heading is present (Section handles this).
- Track list: `<ol>` — the ordered list communicates sequence semantics to screen readers ("list, N items").
- Each `<li>` wraps a TimelineItem; no additional ARIA attributes needed on the `<li>` wrapper.
- The rail `::before` pseudo-element is purely decorative; CSS pseudo-elements are ignored by the accessibility tree by default.
- Connecting line pseudo-element: decorative — no ARIA needed.
- Date values inside TimelineItem must use `<time dateTime="YYYY-MM">` for machine-readable semantics (TimelineItem spec responsibility).
- When `reversed` is used, the HTML `<ol reversed>` attribute correctly communicates reversed numbering to AT.
- Contrast: all text colors delegated to TimelineItem and Section, which consume verified tokens (`--fg`, `--fg-muted`).

## 7. Motion

None owned by TimelineSection. The organism is static.

Scroll-triggered entrance (staggered `<li>` fade-up) is an explicit enhancement a consumer may layer via `IntersectionObserver` + CSS custom properties — but TimelineSection does not ship it. `@media (prefers-reduced-motion: reduce)` in `tokens.css` suppresses any transitions globally.

## 8. Anti-patterns

- **Do not use for a single item.** A lone timeline entry is a `TimelineItem` inline in a `Section`, not a `TimelineSection`.
- **Do not use for horizontal step flows.** That is `StepsSection` / `Stepper`. TimelineSection is a vertical chronological track.
- **Do not put navigational links in the rail.** The left rail is a decorative meter, not a jump-link list. Use `TableOfContents` for on-page anchor navigation.
- **Do not mix unrelated content types.** TimelineSection expects `TimelineItem` children. Placing arbitrary cards or blocks inside the `<ol>` breaks the rail alignment and semantic list structure.
- **Do not use as a process explainer with numbered steps.** Numbered process steps belong in `StepsSection`. TimelineSection communicates dates and events, not procedure order.

## 9. Depends on

- `Section` — provides the organism wrapper, header block, block padding, and landmark semantics.
- `TimelineItem` — the molecule that renders each dated entry (date, title, body).
