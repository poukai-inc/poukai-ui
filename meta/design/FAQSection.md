# FAQSection

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`<FAQSection>` is the system's canonical organism for presenting a list of frequently asked questions on marketing and pricing pages. It composes a `Section` framing block with an `Accordion` of `FAQItem` molecules, giving each question–answer pair a consistent collapsible treatment and ensuring the FAQ block inherits the same vertical rhythm and heading hierarchy as every other page section. It is the correct primitive whenever a page surface needs a numbered or unnumbered list of collapsible Q&A content.

## 2. Anatomy

```
<section aria-labelledby="faq-title">          ← Section (organism root)
  [Section header block]
    <Eyebrow>                                   ← optional eyebrow slot
    <h2 id="faq-title">Frequently asked</h2>    ← Section title
    <p class="lede">…</p>                       ← optional lede slot
  [Section children slot]
    <Accordion type="single" collapsible>       ← Accordion molecule
      <FAQItem question="…">                    ← FAQItem × n
        <Prose>…</Prose>
      </FAQItem>
      …
    </Accordion>
</section>
```

- **Root**: `<Section>` organism. Provides landmark, heading, eyebrow, lede, and block padding.
- **Accordion wrapper**: a single `<Accordion type="single" collapsible>` (or `type="multiple"`) containing all items. Owned by the consumer or composed internally — see §4.
- **FAQItem rows**: each row is a `<FAQItem>` molecule wrapping an `Accordion.Item`. Question is the trigger; answer is the collapsible content.
- **Dividers**: hairline rules between items rendered by Accordion's internal CSS using `--hairline` and `--hairline-w`.

## 3. Tokens

- `--space-16` — Section block padding (top + bottom), `size="default"`
- `--space-12` — Section block padding, `size="tight"`
- `--space-2` — eyebrow → title gap (Section header block)
- `--space-4` — title → lede gap (Section header block)
- `--space-12` — header block → Accordion gap (Section children gap)
- `--space-6` — vertical padding inside each FAQItem trigger row (top + bottom)
- `--fs-h3` — question text size (`1.125rem` / 18px) — FAQItem trigger heading
- `--fs-body` — answer prose font size (inherited from body)
- `--lh-body` — answer prose line-height (`1.55`)
- `--fg` — question text color; answer text color
- `--fg-muted` — Accordion chevron icon color at rest
- `--hairline` — 1px divider between items
- `--hairline-w` — divider width (`1px`)
- `--font-sans` — question and answer typeface
- `--dur-mid` — Accordion panel expand/collapse transition duration (`240ms`)
- `--easing` — expand/collapse easing (`cubic-bezier(0.16, 1, 0.3, 1)`)
- `--accent` — focus ring on trigger
- `--radius-1` — focus ring border-radius

## 4. Variants / Props

| Prop | Type | Default | Rationale |
|---|---|---|---|
| `eyebrow` | `string \| ReactNode` | — | Optional Section eyebrow — e.g. `"FAQ"`. Passed through to `Section`. |
| `title` | `ReactNode` | `"Frequently asked questions"` | Section `h2`. A default value prevents empty landmark if consumer forgets. |
| `titleAs` | `"h1" \| "h2" \| "h3"` | `"h2"` | Heading level, delegated to Section. Override to `"h3"` if nested below another `h2`. |
| `lede` | `ReactNode` | — | Optional supporting copy below the title. |
| `size` | `"default" \| "tight"` | `"default"` | Section block padding — 64px or 48px. |
| `type` | `"single" \| "multiple"` | `"single"` | Passed to `Accordion`. `"single"` collapses sibling when one opens. `"multiple"` allows concurrent open items. |
| `defaultValue` | `string \| string[]` | — | Pre-opened item(s). Passed to `Accordion`. |
| `children` | `ReactNode` | — | Required. One or more `<FAQItem>` elements. |

`collapsible` on the Accordion is always `true` when `type="single"` — all items can be closed so users are never trapped in an expanded state.

## 5. Interaction

- **Click / pointer**: clicking the `FAQItem` trigger row toggles the answer panel.
- **Keyboard**: `Space` or `Enter` on the focused trigger opens or closes the panel. Arrow keys (`↓` / `↑`) move focus between triggers — handled by Accordion (Radix).
- **Focus order**: triggers receive focus in DOM order. Focus ring: 2px `--accent` outline, `4px` offset, `--radius-1` border-radius. The focus ring must not be suppressed inside FAQSection.
- **Hover**: trigger row background shifts to `--surface` on `@media (hover: hover)` — a subtle fill signal that the row is interactive.
- **Reduced motion**: the `@media (prefers-reduced-motion: reduce)` block in `tokens.css` collapses the panel transition to `0.01ms` globally. No additional per-component override needed.

## 6. A11y

- `Section` root renders `<section aria-labelledby={titleId}>` when `title` is present — the FAQ block is a named region landmark.
- `Accordion` implements the ARIA Accordion pattern: each trigger is a `<button aria-expanded aria-controls>` inside a heading element; each panel is `role="region" aria-labelledby`.
- The `FAQItem` question heading must render as a heading element (`h3` by default, or matching the document outline) so the FAQ trigger is also a heading landmark — screen reader users can navigate questions by heading.
- No `role="list"` needed on the Accordion container — the Radix-rendered markup is sufficient.
- Axe rules in play: `aria-required-parent`, `button-name`, `heading-order`, `region`.
- Contrast: `--fg` on `--bg` = 16.29:1 (AAA); `--fg-muted` on `--bg` = 4.91:1 (AA).

## 7. Motion

- Panel expand: `height` animates from `0` to `auto` using CSS `grid-template-rows: 0fr → 1fr` (Radix Accordion's approach) over `--dur-mid` (`240ms`) with `--easing`.
- Panel collapse: reverse of expand, same duration and easing.
- Chevron rotation: `transform: rotate(0deg) → rotate(180deg)` over `--dur-mid` with `--easing`.
- `prefers-reduced-motion: reduce`: `tokens.css` global block collapses all `transition-duration` to `0.01ms`. Panels snap open/closed; chevron does not animate. No per-component override required.

## 8. Anti-patterns

- **Do not use FAQSection for non-collapsible content.** If all answers should be visible simultaneously, use a `Section` with `Prose` or a `PrincipleList` instead.
- **Do not nest FAQSection inside another FAQSection.** Nested accordions produce confusing keyboard navigation and heading hierarchy violations.
- **Do not use FAQSection as a general-purpose settings or form accordion.** FAQSection is for editorial Q&A content on marketing surfaces. App-level settings groups belong to a `Disclosure` or a plain `Accordion` without the Section framing.
- **Do not pass non-FAQItem children directly into the Accordion.** Each child must be a `<FAQItem>` so the Accordion trigger/panel structure is consistent. Arbitrary children inside the Accordion break the keyboard pattern.
- **Do not use FAQSection to encode status or liveness signals.** Questions are static editorial content; StatusBadge or Alert carry dynamic state.

## 9. Depends on

- `Section` — page framing, vertical rhythm, landmark semantics
- `Accordion` — collapsible panel primitive (Radix-backed keyboard + a11y)
- `FAQItem` — individual question/answer row (composed from Accordion.Item + Heading + Prose)
