# FailureModeList

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`<FailureModeList>` is the Section-framed organism that collects a set of `FailureMode` molecules into a coherent catalog block. Its single job is to own the outer editorial frame — the optional section heading and the vertical container — so callers never re-roll that scaffolding per page. It serves the `/why-ai` surface and any "where things break" or "common pitfalls" editorial section on pouk.ai properties.

## 2. Anatomy

```
<section>                        ← Section (organism wrapper, size="default")
  [eyebrow]                      ← optional, passed through to Section
  <h2>How this breaks</h2>       ← Section title slot
  [lede]                         ← optional, passed through to Section
  <div class="list">             ← children container; no additional styling
    <FailureMode index={1} …/>   ← each child owns its own top border + padding
    <FailureMode index={2} …/>
    <FailureMode index={n} …/>   ← last-child owns its own bottom border
  </div>
</section>
```

- **Root**: `<Section>` organism. `size="default"` unless consumer passes `size="tight"`.
- **List container**: a plain `<div>` wrapping `children`. No max-width, no gap, no padding — `FailureMode` items own their own top/bottom padding and hairline borders via `:last-child`.
- **Children slot**: accepts `<FailureMode>` nodes. The organism does not enforce this type constraint; it is a consumer convention.

## 3. Tokens

All tokens are inherited from `Section` and `FailureMode`. `FailureModeList` introduces no new CSS of its own beyond the list container.

- `--space-16` — Section block padding top + bottom (`size="default"`)
- `--space-12` — Section block padding top + bottom (`size="tight"`); also `FailureMode` bottom padding
- `--space-10` — `FailureMode` top padding
- `--space-4` — `FailureMode` internal gap (index → title → body)
- `--fg` — Section title color; `FailureMode` title + body color
- `--fg-muted` — Section lede color; `FailureMode` index color
- `--hairline` — `FailureMode` top border + last-child bottom border
- `--hairline-w` — border width
- `--font-serif` — Section title + `FailureMode` title typeface
- `--font-sans` — `FailureMode` index + body typeface
- `--fs-h2` — Section title font-size (28–40px)
- `--fs-card-title` — `FailureMode` title font-size (24–32px)
- `--fs-meta` — `FailureMode` index font-size
- `--fs-body` — Section lede + `FailureMode` body font-size
- `--hero-max` — Section header block max-width (38rem)

## 4. Variants / Props

```
heading?    string | ReactNode   — Section title slot; default none
eyebrow?    string | ReactNode   — Section eyebrow slot; default none
lede?       string | ReactNode   — Section lede slot; default none
size?       "default" | "tight"  — Section block padding; default "default"
titleAs?    "h1" | "h2" | "h3"  — heading element for the section title; default "h2"
children    ReactNode            — FailureMode nodes; required
```

- `heading` maps directly to `Section`'s `title` prop. Named `heading` here to avoid confusion with `FailureMode`'s own `title` prop at the call site.
- `eyebrow`, `lede`, `size`, and `titleAs` pass through unchanged to `Section`.
- `children` is required — an empty `FailureModeList` renders nothing useful.
- No `dividers` prop. `FailureMode` owns its own hairline borders; the organism does not double-add them.

## 5. Interaction

None. Static editorial organism. No hover, focus, dismiss, or drag behavior. Child `FailureMode` nodes are equally static.

## 6. A11y

- Root renders as `<Section>` which emits a `<section>` element. When `heading` is provided, `Section` wires `aria-labelledby` on the root to the title element's `id` — the block becomes a named region landmark. Callers should always pass `heading` so the region is accessible.
- `FailureMode` items are `<section>` elements with `<h3>` titles. This nesting is correct: the organism is a named `<section>` (h2), each child is a subsection (h3). Pass `titleAs="h2"` and set `FailureMode` to use `h3` (its default) to maintain the hierarchy.
- If `FailureModeList` sits on a page without a prior `<h1>` or `<h2>`, pass `titleAs="h1"` or `titleAs="h2"` as appropriate.
- No interactive ARIA roles needed — this organism is purely structural.

## 7. Motion

None. `Section` and `FailureMode` are both static. Any scroll-triggered entrance for individual items is owned by the caller or a page-level animation layer. `@media (prefers-reduced-motion: reduce)` in `tokens.css` handles suppression globally.

## 8. Anti-patterns

- **Do not use for a single `FailureMode`.** A lone failure-mode entry does not need the Section wrapper. Render `<FailureMode>` directly and place it inside an existing `<Section>` or page layout.
- **Do not nest inside another Section.** `FailureModeList` already wraps a `Section`; nesting doubles the block padding and breaks page rhythm.
- **Do not place non-`FailureMode` children in the list slot.** The container provides no styling — arbitrary children will appear unstyled and visually inconsistent.
- **Do not use for success patterns or best practices.** Failure modes carry a specific editorial register ("where things break"). For positive counterparts use `PrincipleList`.
- **Do not use as a card grid.** `FailureMode` items are open typography, not card surfaces. If boxed, bordered cards are needed that is a different component.

## 9. Depends on

- `Section` — provides the outer editorial frame, heading, eyebrow, lede, and block padding.
- `FailureMode` — the molecule consumed as children; owns all item-level typography, borders, and spacing.
