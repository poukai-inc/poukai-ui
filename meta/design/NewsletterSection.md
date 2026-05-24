# NewsletterSection

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`<NewsletterSection>` is the Section-framed email signup surface for pouk.ai editorial and marketing pages. It frames a `NewsletterField` molecule with a heading and optional supporting body copy, producing the canonical "end-of-post / footer signup" moment. Its single job is to give the inline `NewsletterField` the vertical breathing room, semantic landmark, and copy hierarchy it needs to read as a considered editorial pause rather than a utility widget dropped into a page.

## 2. Anatomy

```
<section aria-labelledby="newsletter-title">        ← Section root (landmark)
  ┌─ header block ──────────────────────────────┐
  │  [eyebrow?]  e.g. "Stay in the loop"        │
  │  <h2 id="newsletter-title">{heading}</h2>    │
  │  <p class="lede">{body}</p>                  │
  └─────────────────────────────────────────────┘
  ┌─ field slot ────────────────────────────────┐
  │  <NewsletterField action="…" />             │
  └─────────────────────────────────────────────┘
</section>
```

- **Root**: `<Section>` molecule (`as="section"` default, polymorphic via the Section `as` prop).
- **Heading**: `<h2>` by default via `Section`'s `titleAs`. Override to `h3` when nested below another `h2` surface.
- **Body copy**: optional lede paragraph. Rendered via `Section`'s `lede` prop (`.lede` class — `--fg-muted`, `max-width: 36rem`).
- **Eyebrow**: optional. Passed through `Section`'s `eyebrow` prop.
- **Field slot**: `<NewsletterField>` passed as `children` or via a dedicated `field` prop slot. Section applies no styling to the field; it inherits `NewsletterField`'s own layout.

## 3. Tokens

All tokens are consumed transitively via `Section` and `NewsletterField`. `NewsletterSection` introduces no CSS of its own beyond the composition.

- `--space-16` — Section block padding (default size, 64px top + bottom)
- `--space-12` — Section block padding (tight size); also header-to-field gap
- `--space-2` — eyebrow → heading gap (owned by Section)
- `--space-4` — heading → lede gap (owned by Section)
- `--hero-max` — header block max-width cap (38rem, owned by Section)
- `--fg` — heading color (h2 global rule)
- `--fg-muted` — lede color (`.lede` global class)
- `--font-serif` — heading typeface (h2 global rule)
- `--font-sans` — body / field typeface
- `--fs-body` — lede font size
- `--accent` — focus ring on field inputs (owned by NewsletterField / Button)
- `--surface-section` — optional tinted background when `surface` prop is set

## 4. Variants / Props

```tsx
// INTENT ONLY — engineer designs the actual API
interface NewsletterSectionProps {
  heading: string; // required — h2 text; e.g. "Get monthly updates"
  body?: string | React.ReactNode; // optional lede; string auto-wrapped in <p class="lede">
  eyebrow?: string | React.ReactNode; // optional eyebrow; passed to Section
  field: React.ReactNode; // required — the <NewsletterField> instance
  size?: "default" | "tight"; // default "default" — maps to Section's size prop
  surface?: boolean; // default false — when true, applies --surface-section bg
  titleAs?: "h2" | "h3"; // default "h2"; "h3" when nested below existing h2
  as?: "section" | "article" | "div"; // default "section"; passed through to Section
}
```

- **`heading`** — required. The subscription moment's primary label. Kept to one short phrase ("Get monthly updates", "Stay in the loop").
- **`body`** — optional supporting copy. One sentence maximum in the brand register; "One email a month. No spam." is the canonical example.
- **`eyebrow`** — optional. Rarely needed; most signup moments need no eyebrow. Available for editorial pages that use eyebrow numeral rhythm throughout.
- **`field`** — required. A `<NewsletterField>` instance. The consumer owns the `action`, `placeholder`, and `cta` props on the field. NewsletterSection does not proxy them — keeping concerns separated avoids a prop-explosion pattern where the organism absorbs all of its child's API surface.
- **`size`** — maps directly to `Section`'s `size` prop. Use `"tight"` at the end of long-form articles where `"default"` spacing would feel heavy.
- **`surface`** — when `true`, adds `background: var(--surface-section)` to the Section root. Useful when the signup band needs to stand out from the page canvas without introducing a new token. Default `false` (transparent / inherits `--bg`).
- **`titleAs`** — heading level override. Default `"h2"`. Pass `"h3"` when the section sits inside an `<article>` that already uses `h2` for its own title.

## 5. Interaction

No interactions are owned by `NewsletterSection` itself. All interaction is delegated:

- **Field input and submit**: handled by `NewsletterField` (keyboard, submit, validation states).
- **Focus order**: tab enters the Section, moves through heading (non-interactive), reaches the email input in `NewsletterField`, then the submit button.
- No dismiss, drag, or reveal behavior. The section is always visible in-flow.

## 6. A11y

- Root `<section>` is a region landmark when the heading is present (wired via `aria-labelledby` — Section molecule handles this automatically).
- Heading is always present (`heading` is required) so the landmark is always named. Screen readers announce "Get monthly updates — region" in landmark navigation.
- `<NewsletterField>` must provide its own `<label>` for the email input (its own spec responsibility). `NewsletterSection` does not double-label the field.
- `body` text uses the `.lede` class — `--fg-muted` on `--bg` = 4.91:1 (AA normal at `--fs-body`).
- Heading: `--fg` on `--bg` = 16.29:1 (AAA).
- When `surface` is `true`: `--fg-muted` on `--surface-section` (#F8F8FA) — contrast gap is negligible vs `--bg`; remains AA.
- axe rule in play: `region` label via `aria-labelledby`.

## 7. Motion

None owned by `NewsletterSection`. The organism is structural.

- Any success/error state animation after form submission is owned by `NewsletterField`.
- `@media (prefers-reduced-motion: reduce)` in `tokens.css` handles suppression globally for child transitions.

## 8. Anti-patterns

- **Do not use for product signup flows** (account creation, trial signup). Those are form organisms with field validation, multi-step state, and legal copy. This organism is for single-field newsletter / waitlist subscriptions only.
- **Do not pass multiple fields as children**. The field slot is for one `NewsletterField`. Multi-field forms belong in a `Form` organism.
- **Do not use as a primary page hero**. `HeroSection` is the h1 moment. `NewsletterSection` is always an interior or closing h2/h3 moment.
- **Do not proxy `NewsletterField` props** through this organism. Keep the API boundary clean — the consumer configures the field directly and passes the instance.
- **Do not center-align heading or body copy**. Left-alignment is the brand register. Center-aligned newsletter CTAs are a generic SaaS pattern that contradicts the Apple-adjacent editorial aesthetic.
- **Do not introduce a background color outside `--surface-section`** via the `surface` prop. The `surface` boolean maps to exactly one token. Any other tinting is a brand escalation.

## 9. Depends on

- `Section` (molecule) — provides landmark, header block, vertical rhythm, padding.
- `NewsletterField` (molecule) — the inline email + submit form.

## Open questions

None — token vocabulary is sufficient. No new tokens required.
