# CTASection

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`CTASection` is the full-width, end-of-page conversion organism for pouk.ai marketing surfaces. It wraps a `CtaBlock` molecule in a `Section` frame with an optional bleed surface band, creating the page-closing moment — the last persuasive beat before the visitor leaves or converts. Distinct from inline `CtaBlock` use: this organism owns the Section framing, the bleed-band surface, and the centered layout mode that signals "this is the conclusion of the page." Serves marketing pages (landing, features, pricing) and blog/article footers.

## 2. Anatomy

```
<section aria-labelledby="cta-title">          ← Section root
  <div class="inner">                          ← max-width container (--content-max)
    <CtaBlock                                  ← heading + body + actions
      heading="Ready to start?"
      body="Spin up your first project in minutes."
      actions={<Button>Get a demo</Button>}
      orientation="stacked"
    />
  </div>
</section>
```

- **Root**: `<section>` with optional `--surface-section` background (bleed variant).
- **Inner container**: centers content, caps at `--content-max`, applies `--page-pad` horizontal padding.
- **CtaBlock slot**: heading + body paragraph + actions row. Orientation fixed to `"stacked"` at this organism scale — horizontal layout is the molecule's concern, not the organism's.
- **Actions slot**: one or two `Button` instances passed through `CtaBlock`'s `actions` prop.

## 3. Tokens

- `--surface-section` — optional bleed background (`surface` variant only)
- `--bg` — default (no background override)
- `--fg` — heading color (via `CtaBlock` → `h2` element default)
- `--fg-muted` — body copy color (via `CtaBlock` → `.lede`)
- `--font-serif` — heading typeface (via `h2` element default)
- `--fs-h2` — heading size (`clamp(1.75rem, 1.25rem + 2vw, 2.5rem)`)
- `--fs-body` — body copy size
- `--space-4` — heading → body gap (via `CtaBlock`)
- `--space-8` — body → actions gap (via `CtaBlock`)
- `--space-16` — section block padding top + bottom (default size)
- `--space-12` — section block padding top + bottom (tight size)
- `--page-pad` — horizontal padding on inner container
- `--content-max` — max-width of inner container
- `--hairline` — optional top border rule (surface variant)
- `--hairline-w` — border width for top rule

## 4. Variants / Props

| Prop          | Type                        | Default       | Rationale                                                                                 |
| ------------- | --------------------------- | ------------- | ----------------------------------------------------------------------------------------- |
| `heading`     | `string`                    | —             | Required. The conversion headline.                                                        |
| `body`        | `string \| ReactNode`       | —             | Optional. Supporting copy below the heading.                                              |
| `actions`     | `ReactNode`                 | —             | Required. One or two `Button` instances. DS does not prescribe Button variant — consumer chooses. |
| `surface`     | `"default" \| "recessed"`   | `"default"`   | `"default"` = page `--bg`, no band. `"recessed"` = `--surface-section` band + hairline rule on top. |
| `size`        | `"default" \| "tight"`      | `"default"`   | Maps directly to `Section` size prop — controls block padding.                            |
| `align`       | `"center" \| "start"`       | `"center"`    | Header block alignment. `"center"` is the CTA-section convention (closing moment, bilateral symmetry). `"start"` for editorial surfaces that want left-aligned rhythm continuity. |

**`align="center"` default rationale.** This is the one place in the DS where centering is the brand-correct default. End-of-page CTA moments use bilateral symmetry across every reference system (Apple, Stripe, Linear). It signals "this is the conclusion." The standard Section spec explicitly rejects center-alignment as a general variant — this organism is the scoped exception, which is why the centering lives here, not in Section or CtaBlock.

## 5. Interaction

No interactive states on the organism itself. All interaction is delegated to the `actions` slot content (`Button`). Tab order: natural DOM order through the actions slot. No custom keyboard management required.

## 6. A11y

- Root renders as `<section aria-labelledby="{id}-title">` — a named region landmark.
- Heading (`h2` by default via `CtaBlock`) receives the matching `id` for the `aria-labelledby` wiring.
- Heading level should remain `h2` on full-page surfaces where a `Hero` owns the `h1`. Engineer should expose a `titleAs` passthrough prop (`"h2" | "h3"`) for edge cases.
- `--fg` on `--bg` = 16.29:1 (AAA). `--fg-muted` on `--bg` = 4.91:1 (AA). `--fg` on `--surface-section` verified AA on both light and dark tokens.
- No ARIA live regions — this is a static conversion block, not a feedback surface.

## 7. Motion

None. CTASection is a static content band. No entrance animation at the organism level. If the consumer wants a scroll-triggered fade-in on the actions or heading, that is their composition concern, not the organism's. `@media (prefers-reduced-motion: reduce)` in `tokens.css` handles any animation within the `actions` slot globally — no per-component override needed.

## 8. Anti-patterns

- **Do not use CTASection mid-page.** It is an end-of-page closing moment. For inline conversion prompts between content sections, use `CtaBlock` directly inside a `Section`.
- **Do not pass a heading longer than ~60 characters.** The centered `h2` at `--fs-h2` reads well up to a short declarative phrase. Long headings break the bilateral symmetry and read as body copy.
- **Do not nest inside another Section.** CTASection owns its own `Section` frame. Wrapping it in an outer `<Section>` doubles the block padding.
- **Do not use the `surface="recessed"` variant at the very top of a page.** The hairline rule is designed to register as a visual closing separator — it reads incorrectly as an opening when placed at the page start.
- **Do not use more than two actions.** The `actions` slot is for a primary + optional secondary CTA. Three or more buttons in a closing conversion moment dilutes the persuasive focus.

## 9. Depends on

- `Section` — page-section frame, block padding, accessible landmark wiring.
- `CtaBlock` — heading + body + actions composition with orientation and gap rhythm.
- `Button` — passed by consumers into the `actions` slot; not imported by CTASection itself.

## Open questions

- **`align` prop on `CtaBlock`.** The `CtaBlock` spec (issue #170) does not yet document an `align` prop — it defines `orientation` (stacked vs horizontal) but not text alignment. CTASection needs to pass `align="center"` down to `CtaBlock`'s internal heading and body. If `CtaBlock` does not expose an `align` prop, CTASection will need to override alignment via a CSS wrapper class (`text-align: center` on the inner container). This should be resolved when the `CtaBlock` spec is written — no new token needed, but the prop contract between the two components is undecided.
