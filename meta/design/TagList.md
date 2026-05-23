# TagList

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`TagList` is the system's canonical wrapper for a collection of `Tag` atoms. It owns the flex-wrap layout and gap rhythm that a raw flex container would otherwise require every call-site to re-specify, and it enforces a consistent overflow strategy via an optional `max` count — collapsing surplus Tags into a single `+N` overflow pill. Its primary surface is the tag row beneath article titles, case-study cards, and editorial list items: `#a11y #design-systems #ds`. Consumers pass `<Tag>` children directly; `TagList` provides the container contract only.

## 2. Anatomy

```
┌─────────────────────────────────────────────────┐
│  [Tag]  [Tag]  [Tag]  [Tag]  [+N]               │
└─────────────────────────────────────────────────┘
```

- **Root element**: `<div>` — generic wrapper; no landmark semantics needed for a tag row.
- **Tag slot** (`children`): one or more `<Tag>` atoms passed as `ReactNode`. `TagList` does not render or clone Tags itself — it wraps whatever is passed.
- **Overflow pill** (conditional): when `max` is set and the child count exceeds it, `TagList` renders the first `max` children followed by a `<Tag tone="muted">+{N}</Tag>` overflow pill. Hidden Tags are not rendered to the DOM — they are sliced off, not hidden with CSS.

## 3. Tokens

- `--space-2` (`0.5rem` / 8px) — gap between Tag pills (inline and block axis)
- `--fg-muted` — text color of the `+N` overflow pill (inherits from `Tag tone="muted"`)
- `--hairline` — border of the `+N` overflow pill (inherits from `Tag tone="muted"`)
- `--hairline-w` — border width of the `+N` overflow pill (inherits from `Tag tone="muted"`)
- `--surface` — background of default-tone Tags passed as children (owned by Tag, not TagList)

No new tokens.

## 4. Variants / Props

| Prop        | Type           | Default     | Rationale                                                                                                        |
| ----------- | -------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `max`       | `number`       | `undefined` | When set, renders only the first `max` children; surplus collapses into a `+N` muted Tag. Omit to show all Tags. |
| `gap`       | `"sm" \| "md"` | `"md"`      | `"md"` = `--space-2` (8px); `"sm"` = `--space-1` (4px) for denser contexts (table cells, compact card footers).  |
| `children`  | `ReactNode`    | required    | One or more `<Tag>` elements. TagList does not enforce child type — the engineer documents the expected child.   |
| `className` | `string`       | `undefined` | Layout overrides by consumer (margin, alignment). TagList has no self-margin.                                    |

`gap="md"` is the correct default for editorial article tag rows. `gap="sm"` exists for dense surfaces where 8px gaps push adjacent Tags too wide.

## 5. Interaction

TagList is non-interactive. Its Tag children are static labels (see Tag spec §5). No hover, click, focus, or drag semantics are authored by TagList.

If a consumer passes interactive Tags (wrapped in anchors or future `TagButton` atoms), the interactive behavior is entirely owned by those children — TagList has no knowledge of it and adds no interaction handling of its own.

Keyboard: no tab stop on the container. Focus passes through to any focusable children per natural document order.

## 6. A11y

- **Root `<div>`** — no implicit ARIA role; correct for a presentational flex row of inline labels.
- No `role`, `aria-label`, or `aria-live` needed on TagList itself. The Tags' text content is read inline by screen readers as part of surrounding content flow.
- **Overflow pill**: the `+N` overflow Tag must have a visually hidden accessible name that communicates the hidden count — the muted `+N` text is sufficient for sighted users, and the same text is readable by screen readers without additional markup. If a consumer needs to expose the full hidden list to assistive technology, they should render all Tags with `aria-hidden="true"` on surplus ones and a visually hidden `<ul>` with full label text — this is outside TagList's scope.
- axe rules: no violations expected. `<div>` with inline `<span>` children (Tags) has no landmark or heading expectations that could be violated.

## 7. Motion

None — TagList is a static layout wrapper. No entrance animation, no transition on any property.

When Tags appear or disappear (e.g. during a filter operation), any entrance/exit animation is the responsibility of the parent page layer, not TagList. `@media (prefers-reduced-motion: reduce)` has no effect on TagList itself since no transitions are authored.

## 8. Anti-patterns

- **Do not use TagList to group StatusBadges.** StatusBadge encodes liveness; Tag encodes category. They are distinct semantic registers and must not share a container that implies visual equivalence.
- **Do not use TagList as a navigation row.** TagList has no link semantics. Use `LinkList` for vertically stacked links or a `<nav>` with anchor children.
- **Do not pass non-Tag children.** TagList expects `<Tag>` atoms. Passing Buttons, Badges, or arbitrary elements breaks the visual contract of the pill row and the `max` overflow logic.
- **Do not use TagList for a single Tag.** A lone Tag does not need a wrapper — place it inline. TagList earns its keep only when there are two or more Tags.
- **Do not use `max` as a substitute for content curation.** The `+N` overflow pill is an ergonomic safety valve, not a content strategy. Prefer curating the tag list to a reasonable count (~5) rather than relying on collapse to hide poor choices.

## 9. Depends on

- `Tag` atom — the sole expected child type.

## Open questions

None.
