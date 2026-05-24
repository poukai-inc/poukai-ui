# TestimonialBlock

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`TestimonialBlock` is a single-testimonial editorial moment: one `Quote`, one `Byline`, and an optional `Portrait` slot, framed inside a recessed section band. It serves marketing-page surfaces where a customer voice needs to occupy its own compositional beat — not lost inside a grid or list, but given the full width of the reading column and the visual weight of a section break. The primary surfaces are landing pages, about pages, and case-study pages where one high-signal quote should stand on its own.

## 2. Anatomy

```
<section>  ← Section wrapper, --surface-section background
  [optional Portrait]   — avatar or headshot, centered above or beside quote
  <blockquote>          ← Quote atom
    "Changed how our team ships."
  </blockquote>
  <footer>              ← Byline atom (name + role + optional time)
    Jane Doe · Head of Design, Acme
  </footer>
</section>
```

- **Section frame**: `Section` organism wrapper using `--surface-section` token for the recessed band.
- **Portrait slot** (optional): `Portrait` atom — avatar or headshot. Centered above the quote in stacked layout; left-aligned beside Byline in horizontal layout. Decorative; `aria-hidden` or `alt=""` unless the image adds information not in the Byline.
- **Quote**: `Quote` atom — the testimonial text. Rendered as `<blockquote>`. Instrument Serif. Consumer passes the quote string including any punctuation.
- **Byline**: `Byline` atom — `name` + `role` row, optional `publishedAt`/`readTime` slots suppressed in this context (name + role only is the canonical testimonial Byline shape).

## 3. Tokens

- `--surface-section` — recessed band background for the Section frame
- `--fg` — Quote text color
- `--fg-muted` — Byline name/role color
- `--font-serif` — Quote typeface (Instrument Serif)
- `--font-sans` — Byline typeface (Geist)
- `--fs-statement` — Quote font-size (clamp 28–44px); editorial weight for a single-voice moment
- `--fs-meta` — Byline name/role font-size (14px)
- `--lh-body` — Quote line-height (1.55)
- `--lh-meta` — Byline line-height (1.2)
- `--space-4` — Portrait-to-Quote gap (16px)
- `--space-6` — Quote-to-Byline gap (24px)
- `--space-8` — Section vertical padding, mobile (32px)
- `--space-12` — Section vertical padding, desktop (48px)
- `--page-pad` — Section horizontal padding (clamp 1.5rem–3rem)
- `--content-max` — maximum width of the inner column (64rem)
- `--hairline` — optional decorative leading rule above the Quote
- `--hairline-w` — 1px rule width

## 4. Variants / Props

| Prop          | Type                        | Default     | Rationale                                                                                                                                                                                                                               |
| ------------- | --------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `quote`       | `ReactNode`                 | required    | The testimonial text. ReactNode to allow `<em>` emphasis within the quote string.                                                                                                                                                       |
| `byline`      | `ReactNode`                 | required    | A `Byline` instance (name + role). Required — an unattributed quote is not a testimonial.                                                                                                                                               |
| `portrait`    | `ReactNode`                 | `undefined` | Optional `Portrait` or `<img>`. When absent, layout collapses to quote + byline only.                                                                                                                                                   |
| `orientation` | `"stacked" \| "horizontal"` | `"stacked"` | `"stacked"`: portrait above quote, all centered. `"horizontal"`: portrait left-aligned beside byline below the quote. `"stacked"` is the canonical testimonial moment; `"horizontal"` is for surfaces with sufficient horizontal width. |
| `align`       | `"start" \| "center"`       | `"center"`  | Text alignment of quote and byline within the column. Center is the editorial default for a single isolated testimonial. `"start"` for left-rail or card-adjacent contexts.                                                             |

## 5. Interaction

Static organism. No interactive states.

Focus passes through to any interactive elements inside `Byline` (e.g. a linked name). No custom keyboard management is needed.

## 6. A11y

- The `Section` frame renders as a `<section>` element. If the page contains multiple sections, the engineer should ensure a visible heading or `aria-label` distinguishes this landmark — `TestimonialBlock` does not emit a heading of its own.
- `Quote` renders as `<blockquote>`. The `cite` attribute may be populated by the `Quote` atom if a source URL is available; not required for testimonials.
- `Byline` renders as `<footer>` inside the `<blockquote>` per HTML spec for `<blockquote>` attribution, or as a sibling `<p>` depending on Quote atom's DOM shape — engineer follows Quote atom's spec contract.
- Portrait image: when the portrait is purely decorative (the Byline already names the person), pass `alt=""` or wrap with `aria-hidden="true"`. When it carries distinct information, provide a descriptive `alt`.
- Contrast: `--fg` on `--surface-section` (#1D1D1F on #F8F8FA) = ~15.6:1 AAA. `--fg-muted` on `--surface-section` (#6E6E73 on #F8F8FA) = ~4.7:1 AA normal.
- No custom ARIA roles. Semantic HTML is sufficient.

## 7. Motion

None — static organism. No entrance animation on `TestimonialBlock` itself.

If a parent organism stagger sequence includes this block, the parent owns the timing. `TestimonialBlock` does not add or modify animation behavior.

`prefers-reduced-motion: reduce` is handled globally by `tokens.css`. No per-component override needed.

## 8. Anti-patterns

- **Do not use for multiple testimonials.** A carousel or grid of quotes is a different organism (`TestimonialCarousel`, `TestimonialGrid`). This component is explicitly single-voice.
- **Do not omit the Byline.** A `<blockquote>` without attribution is a pull-quote, not a testimonial. Use a `Quote`/`Statement` atom directly for unattributed editorial quotes.
- **Do not use for internal marketing copy.** This component is for real customer or user voices. Using it for first-party copy blurs the register and misuses the `<blockquote>` semantic.
- **Do not place inside a card or narrow column.** `TestimonialBlock` expects full reading-column width (`--content-max`). Inside a card or sidebar column the quote type size becomes cramped. Use a plain `Quote` + `Byline` composition inline instead.
- **Do not stack multiple `TestimonialBlock` instances back-to-back.** Sequential full-width testimonial bands produce rhythm fatigue. If more than one testimonial is needed, use a carousel or grid organism.
- **Do not pass heading content as the quote.** The quote slot is for the spoken testimonial string, not a section heading. Section context (if needed) is provided by the surrounding page structure.

## 9. Depends on

- `Section` — outer band framing and `--surface-section` background
- `Quote` — `<blockquote>` semantic wrapper and Instrument Serif type treatment
- `Byline` — attribution row (name + role + optional Portrait)
- `Portrait` — optional avatar/headshot slot (passed through Byline or as a standalone slot depending on `orientation`)
