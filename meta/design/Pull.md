# Design spec: Pull

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<Pull>` is the editorial pull-quote primitive. It extracts a sentence or short passage from body copy and gives it disproportionate visual weight — slowing the reader's eye and signaling that the passage carries particular resonance. It lives inside long-form content, inline with the article rhythm.

### Explicit contrast with adjacent components

**Pull vs. Statement.** `<Statement>` (not yet shipped; planned molecule) is a page-level editorial moment — centered, Instrument Serif italic, `--fs-statement` (28–44px fluid), used once per page as an authorial assertion that stands alone outside the body flow. Pull is inline — left-flush, anchored to the reading column by a left rule, at a smaller type size (20–26px), and can appear multiple times in a single article. They must not look alike at first glance: Statement is a declaration that interrupts the page; Pull is an accent that sharpens the flow.

**Pull vs. Quote.** `<Quote>` (not yet shipped; planned molecule) is an attributed customer testimonial with an avatar, name, and role block — a social-proof primitive. Pull can carry an optional attribution, but that attribution is a brief textual note (e.g. "— from §3, Engineering culture"), not a person-and-company identity block. Pull is an editorial device; Quote is a testimonial device. They serve different surfaces and must not be used interchangeably.

---

## 2. Anatomy

- **Root element**: `<blockquote>` by default. Polymorphic via `as` prop — valid values: `"blockquote" | "aside"`. This follows the Section/Statement polymorphic pattern. `<blockquote>` is the correct default: it is the HTML element for quoted material, semantically recognized as a quote by screen readers and browsers. `"aside"` is the override when Pull is used for an extracted editorial accent that is not a literal quote from the text — a distinction the author can make by switching the root element.

- **Left rule**: a `3px` left border in `--hairline`. This is decorative visual punctuation that anchors the block in the reading column and immediately distinguishes Pull from surrounding prose. It is not a layout line or a separator — it is purely typographic punctuation. `padding-inline-start: var(--space-4)` (16px) separates the rule from the body text. No decorative quote mark (`"`) is rendered — the rule serves this function and stays within Apple's restrained surface vocabulary. See §10 for the rationale.

- **Body slot**: the pull text. Required. Accepts `React.ReactNode` to support inline `<em>` or `<strong>` spans within the passage. Typography: `--fs-pull` (20–26px fluid), Instrument Serif italic by default (`variant="serif"`), or Geist roman at weight 400 for `variant="sans"`. Color: `--fg`. The body slot has no max-width of its own; the Pull container constrains to `--hero-max` (see §4).

- **Attribution slot** (optional): a short trailing line rendered below the body text. Typography: `--fs-meta` (14px), `--fg-muted`, italic (both variants). Example text: "— from §3, Engineering culture" or "— The Lean Startup, §4". This is a textual note, not a person block. It is separated from the body text by `var(--space-2)` (8px). The `attribution` prop accepts `React.ReactNode` — inline markup is allowed (e.g. a `<cite>` element or an emphasized phrase).

- **`cite` attribute** (optional): when the root is `<blockquote>`, the HTML `cite` attribute can be set to a URL pointing to the source document. This is a machine-readable attribution for the browser and crawlers — distinct from the visible `attribution` slot. When `as="aside"` this prop is silently ignored (the `cite` attribute is not valid on `<aside>`).

---

## 3. Tokens used

### Existing tokens (no new additions beyond `--fs-pull`)

| Token          | Value                                  | Role                                                          |
| -------------- | -------------------------------------- | ------------------------------------------------------------- |
| `--fs-pull`    | `clamp(1.25rem, 1rem + 1vw, 1.625rem)` | Pull body font size (20–26px fluid). **New token — see §10.** |
| `--fs-meta`    | `0.875rem` (14px)                      | Attribution font size                                         |
| `--font-serif` | Instrument Serif stack                 | Body font family in `variant="serif"`                         |
| `--font-sans`  | Geist stack                            | Body font family in `variant="sans"`                          |
| `--fg`         | `#1D1D1F`                              | Body text color                                               |
| `--fg-muted`   | `#6E6E73`                              | Attribution color                                             |
| `--hairline`   | `#D2D2D7`                              | Left rule color                                               |
| `--space-2`    | `0.5rem` (8px)                         | Gap: body → attribution                                       |
| `--space-4`    | `1rem` (16px)                          | Padding-inline-start: rule → body text                        |
| `--space-8`    | `2rem` (32px)                          | Block margin top + bottom (Pull ↔ surrounding paragraphs)     |
| `--hero-max`   | `38rem` (608px)                        | Container max-width                                           |
| `--lh-meta`    | `1.2`                                  | Attribution line-height                                       |

### New token: `--fs-pull`

One new token is introduced. See §10 in `meta/brand.md` for the full decision rationale. Summary:

The existing type ramp has a significant gap between `--fs-body` (17–19px) and `--fs-statement` (28–44px floor). A pull-quote at `--fs-body` would not read as an accent; at `--fs-statement`'s lower bound (28px) it would be indistinguishable from the Statement molecule at its quietest register and far too close to a heading. A distinct rung at 20–26px is the honest answer: clearly above body, clearly below Statement, a named semantic role with reuse potential (future inline callout components, FieldNote, chapter openers).

`clamp(1.25rem, 1rem + 1vw, 1.625rem)` reaches 20px at 320px viewport and 26px at approximately 960px, growing modestly across the article breakpoint band. The floor-to-ceiling delta (6px) is intentionally restrained — Pull grows with the viewport but stays in the same register at all widths.

---

## 4. Layout & rhythm

### Container

| Property               | Value                                | Notes                                                                                                                                                                                                                                           |
| ---------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max-width`            | `var(--hero-max)` (38rem / 608px)    | Matches the article text column cap used by Hero and Section. Pull should not exceed the prose measure.                                                                                                                                         |
| `margin-block`         | `var(--space-8)` (32px) top + bottom | Breathing room between Pull and surrounding paragraphs. Matches the `<hr>` rhythm in `tokens.css`.                                                                                                                                              |
| `padding-inline-start` | `var(--space-4)` (16px)              | Distance from the left rule to the body text.                                                                                                                                                                                                   |
| `border-inline-start`  | `3px solid var(--hairline)`          | The left rule. 3px is visually heavier than the 1px `--hairline-w` dividers used elsewhere — Pull is not a divider, it is a typographic accent requiring more mass. `--hairline` color keeps it neutral and within the DS vocabulary.           |
| `margin-inline-start`  | `0`                                  | Pull is left-flush with the body column. No inset from the left margin — the left rule itself provides the visual offset from the prose. Centering or symmetric indentation is not in the Apple-adjacent editorial register for this component. |

### Body text

| Property      | Value                                                                            | Notes                                                                                                                                                                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `font-size`   | `var(--fs-pull)`                                                                 | 20–26px fluid                                                                                                                                                                                                                                                            |
| `font-family` | `var(--font-serif)` (`variant="serif"`) or `var(--font-sans)` (`variant="sans"`) |                                                                                                                                                                                                                                                                          |
| `font-style`  | `italic` (`variant="serif"`), `normal` (`variant="sans"`)                        | Instrument Serif Italic is the editorial register. Geist italic exists but the sans variant is roman — it reads as a quotation mark in weight, not in slant.                                                                                                             |
| `line-height` | `1.45`                                                                           | Slightly tighter than body (`1.55`) because the larger type size provides its own optical spacing. This is an inline value, not a token, because `1.45` is a proportional multiplier at this scale and does not need a name — it is not a new line-height semantic role. |
| `color`       | `var(--fg)`                                                                      | Full-weight primary color. Pull is the loudest element on the line, not a muted one.                                                                                                                                                                                     |
| `margin`      | `0`                                                                              | No default paragraph margin — the container's `padding-inline-start` and `margin-block` own all spacing.                                                                                                                                                                 |

### Attribution line

| Property      | Value                   | Notes                                                                                                                        |
| ------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `margin-top`  | `var(--space-2)` (8px)  | Tight coupling to body text — it reads as trailing context, not a separate block.                                            |
| `font-size`   | `var(--fs-meta)` (14px) |                                                                                                                              |
| `font-style`  | `italic`                | Both variants. Attribution is always italic regardless of the body variant — it is a citation register, not a body register. |
| `color`       | `var(--fg-muted)`       |                                                                                                                              |
| `line-height` | `var(--lh-meta)` (1.2)  | Meta-scale text with tight line-height.                                                                                      |

---

## 5. Variants

Two variants: `variant="serif"` (default) and `variant="sans"`.

| Variant                     | Font family                       | Font style | When to use                                                                                                                                                                                                                                         |
| --------------------------- | --------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant="serif"` (default) | `--font-serif` (Instrument Serif) | italic     | Editorial long-form content, article pages, customer stories, any context where the serif italic accent reads as authorial voice. This is the correct default — it is perceptibly different from the surrounding Geist roman body copy at a glance. |
| `variant="sans"`            | `--font-sans` (Geist)             | normal     | Technical or operator-grade content where Instrument Serif feels mismatched — engineering docs, process writeups, `/why-ai` style pages. The sans Pull reads heavier and more declarative than the serif; it is still an accent by size alone.      |

No `size` variant is introduced. `--fs-pull` (20–26px) carries the full register. A `large` variant was considered and rejected: the one likely use case (a hero-pull at the top of an article) is better served by `<Statement>`, which owns the page-level editorial declaration register at a larger scale. Adding `size="large"` to Pull would push it toward Statement territory and blur the distinction between the two components. If a genuinely distinct third scale is needed between Pull and Statement, it deserves its own decision-log entry — not a variant added speculatively.

---

## 6. States

None. Pull is a typography component with no interactive states. No hover, focus, disabled, or empty states are defined. Focus can reach the container if it receives keyboard focus via a parent scroll container, but Pull itself introduces no interactive affordance.

---

## 7. Accessibility

**Semantic element.**

`<blockquote>` is the correct default. It is the HTML element explicitly defined for material quoted from another source. Most screen readers announce it as a blockquote or indented quotation. It does not carry a landmark role (it is not a `region`, `complementary`, or `article`), so there is no "too many landmarks" noise risk.

`as="aside"` changes the semantics to `complementary` landmark. Use this when the Pull content is an extracted editorial accent (a sentence the author has chosen to highlight) rather than a literal quotation from an external source — the semantic distinction maps to the HTML spec's intent for each element. Screen readers will announce an `<aside>` as "complementary" and include it in the landmark navigation list; consumers should be aware that every Pull rendered as `aside` adds a landmark. For articles with multiple Pulls, `"blockquote"` is almost always the right choice.

**`cite` attribute.**

When `as="blockquote"`, the `cite` prop maps to the HTML `cite` attribute. This is a URL value — machine-readable, not user-visible. It is distinct from the visible `attribution` slot. Browsers do not currently surface it in a visible way, but it is valid and semantically useful for crawlers and future tooling. When `as="aside"`, the `cite` prop is silently ignored (not a valid attribute on `<aside>`).

**Decorative left rule.**

The `border-inline-start` rule is CSS-rendered and carries no content. No `aria-hidden` is needed on a CSS border. If a future design revision adds a `::before` pseudo-element with visible content (quote glyph, dash, etc.), that pseudo-element's `content` value must be set to `""` or a space — never a visible glyph string — to avoid it being announced by screen readers. Pull's current spec uses a CSS border only; this case does not apply.

**Attribution element.**

The attribution line should be rendered as a `<footer>` element inside `<blockquote>` per the HTML spec's recommendation for blockquote attribution: `<blockquote><p>...</p><footer>...</footer></blockquote>`. The `<footer>` inside a `<blockquote>` is not a `contentinfo` landmark — it is scoped to the blockquote's context, which is correct. When `as="aside"`, the attribution can render as a `<p>` since `<footer>` inside `<aside>` would introduce a landmark hierarchy that is harder to justify.

**Contrast ratios (verified against `meta/brand.md` values).**

| Pair                                       | Ratio     | Verdict   |
| ------------------------------------------ | --------- | --------- |
| `--fg` (#1D1D1F) on `--bg` (#FBFBFD)       | 16.29 : 1 | AAA       |
| `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) | 4.91 : 1  | AA normal |

No new color pairings are introduced. The left rule (`--hairline` on `--bg`) is decorative and has no contrast requirement.

**Keyboard interaction.** None. Pull is not interactive. If a consumer places a link inside the body or attribution slot, that link inherits the system's standard focus ring (`--accent` outline, `2px`, `4px` offset) from `tokens.css`.

---

## 8. Motion

None. Pull is editorial typography. It is static on render. No entrance animation, no hover transition, no reduced-motion variant needed. Any scroll-driven reveal would be authored by the page composition layer, not by Pull itself.

---

## 9. Prop intent

Final proposed signature:

```tsx
// INTENT ONLY — engineer designs the actual API
interface PullProps extends Omit<React.HTMLAttributes<HTMLElement>, "cite"> {
  as?: "blockquote" | "aside";
  cite?: string; // maps to HTML cite attribute; ignored when as="aside"
  attribution?: React.ReactNode; // visible trailing attribution line
  variant?: "serif" | "sans"; // default: "serif"
}
```

**What was trimmed and why:**

- `size?: "default" | "large"` — removed. Rationale in §5: one scale carries; `large` blurs the Pull/Statement distinction. Cut.
- The `children` slot is implicit via `React.HTMLAttributes` and carries the body text. No explicit `body` prop — the children convention is consistent with other DS molecules (Hero lede is a prop, but body-text molecules use children).

**Prop-by-prop intent:**

- `as` — root element semantic. Default `"blockquote"` for literal quotations. `"aside"` for extracted editorial accents that are not literal quotes. Engineer: `cite` attribute must be omitted from the rendered element when `as="aside"`.
- `cite` — URL of the quoted source. Mapped directly to the HTML `cite` attribute on `<blockquote>`. Machine-readable. Not rendered visibly. Ignored when `as="aside"`. Typed as `string` (URL); no runtime URL validation required.
- `attribution` — visible attribution line below the body. Renders as `<footer>` when `as="blockquote"`, as `<p>` when `as="aside"`. Accepts `React.ReactNode` for inline markup (`<cite>`, `<em>`, etc.).
- `variant` — typographic register. Default `"serif"`. `"sans"` for technical contexts. Controls `font-family` and `font-style` of the body slot only; attribution is always `--fs-meta`, `--fg-muted`, italic regardless of variant.
- `className` — standard escape hatch. Consumer can apply custom `max-width` overrides, margin adjustments for unusual layout contexts.
- Standard HTML attributes (`id`, `data-*`, `aria-*`, event handlers) spread onto the root element.

---

## 10. Composition rules

- Pull composes inside long-form prose — between paragraphs, after a section break, before a conclusion. It is not a page-level molecule (unlike Hero or Statement). Its natural parent is an article body, a `<Section>` children slot, or a prose column.
- Pull should not be placed inside a `<Hero>`. Hero owns the page's display moment; Pull is an inline article accent.
- Pull does not compose with `<Statement>`. Statement is a page-level interruption; Pull is a paragraph-level accent. They occupy different scopes in the reading hierarchy. Stacking them on the same surface is a composition error.
- Pull should not be used as a decorative background element or as a page-opening statement. For page-opening editorial statements, use `<Statement>` (once shipped). For page-level h1 moments, use `<Hero>`.
- Multiple Pulls may appear on a single article page. Spacing between them (`margin-block: var(--space-8)`) creates natural breathing room. Using more than three Pulls in a single article is an editorial judgment, not a design-system constraint — the spec does not enforce a count limit.
- Attribution is for brief textual references, not for person identity. A person's name, role, and company belongs in `<Quote>` (once shipped). Pull attribution is for source references like "— from §3, Engineering culture" or "— originally published in the team handbook". If a consumer uses Pull to attribute a named person without an avatar, they are using it correctly as a typographic citation, but should migrate to `<Quote>` once that component ships.

---

## 11. Out of scope

- **`size="large"` variant.** Explicitly excluded. Rationale in §5.
- **Decorative quote mark (`"` glyph via CSS `::before`).** Not in this spec. The left rule is sufficient typographic punctuation. Adding a large display quote mark would push Pull toward a decorative register that does not match the Apple-restrained aesthetic. Future consumer surface can request it with a rationale.
- **Dark mode.** Pull introduces no per-component dark-mode overrides. `--fg`, `--fg-muted`, `--hairline`, and all consumed tokens flip cleanly via the global dark-mode override block in `tokens.css` (when it ships). No action needed here.
- **`size="small"` or a condensed variant for sidebar asides.** Not introduced. `<FieldNote>` (planned molecule) will serve the tight technical-aside register at smaller scale.
- **`variant="serif"` bold variant (pull with weight contrast).** Instrument Serif Regular italic is the correct register; bold serif would read as a heading, not a pull. Excluded.
- **Entrance animation.** Static typography. Deferred entirely.
- **RTL support.** `border-inline-start` and `padding-inline-start` are logical properties and are RTL-correct by default. No additional work needed.

---

## 12. Story matrix

| Story file                     | Story name          | Description                                                                                                                                                                                                                                                 |
| ------------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Pull.stories.tsx`             | `Default`           | Body text only, `variant="serif"` (default). No attribution, no cite. Verifies font, size, left rule, and block margin.                                                                                                                                     |
| `Pull.stories.tsx`             | `WithAttribution`   | Body text + attribution line. Verifies `--space-2` gap, attribution color (`--fg-muted`), italic style, `--fs-meta` size.                                                                                                                                   |
| `Pull.stories.tsx`             | `LongBody`          | A multi-sentence pull (2–3 sentences, ~40 words). Verifies line-height (`1.45`) and that the max-width (`--hero-max`) constrains the block correctly at wide viewports.                                                                                     |
| `Pull.stories.tsx`             | `SansVariant`       | `variant="sans"`, body only. Verifies Geist roman renders at `--fs-pull`, no italic. Place serif and sans side-by-side in the same story for direct comparison.                                                                                             |
| `Pull.stories.tsx`             | `AsidePolymorphism` | `as="aside"` + body + attribution. Verifies root element is `<aside>`, that the `cite` prop is not rendered as an attribute, and that the attribution renders as `<p>` (not `<footer>`).                                                                    |
| `Pull.AllVariants.stories.tsx` | `AllVariants`       | Serif default, serif with attribution, sans default, sans with attribution — stacked vertically. Design-matrix story.                                                                                                                                       |
| `Pull.AllVariants.stories.tsx` | `InArticleRhythm`   | Two paragraphs of lorem prose above the Pull, two paragraphs below. Verifies that `margin-block: var(--space-8)` reads as natural breathing room and that Pull does not disrupt the article flow. The primary smoke test for the component's raison d'être. |

---

## 13. Open questions for the engineer

1. **`<footer>` inside `<blockquote>` for attribution.** The HTML spec recommends `<footer>` for blockquote attribution. Verify this does not trigger a lint warning in the project's HTML validator config — some older setups flag `<footer>` as a sectioning element and warn about unexpected nesting. If it does, `<p>` is the acceptable fallback; mark the choice in a code comment.

2. **`cite` attribute validation.** The `cite` prop is typed as `string`. The HTML spec says `cite` should be a valid URL, but does not require browsers to validate it. No runtime URL validation is needed unless the project has a policy. If the engineer wants to be safe, a `process.env.NODE_ENV === 'development'` warning for non-URL strings is reasonable but not required by this spec.

3. **Left rule: `border-inline-start` vs `padding` approach.** `border-inline-start: 3px solid var(--hairline)` is the spec. If the project's CSS reset or `normalize.css` strips `<blockquote>` default margin/padding (which most resets do), verify the border still renders correctly and that `padding-inline-start: var(--space-4)` correctly spaces the body from the border. The default `blockquote` user-agent styling includes padding and margin; these should be zeroed in Pull's CSS module so the spec-defined values are the only source of truth.

4. **`margin-block` and article prose margin stacking.** When Pull is placed between two `<p>` elements, the `margin-block: var(--space-8)` on Pull will sit adjacent to `p { margin-bottom: var(--space-4) }` from `tokens.css`. This is not CSS margin-collapse (different block context), so the gap between a `<p>` and the Pull will be `--space-4 + --space-8 = 48px` (16 + 32). Verify this reads correctly in the `InArticleRhythm` story — if it is too large, the margin-block on Pull can be reduced or the consumer can set `margin-block-start: 0` when Pull immediately follows a `<p>`. Document the outcome in a code comment.

5. **Attribution element when `as="aside"`.** The spec says attribution renders as `<footer>` inside `<blockquote>` and as `<p>` inside `<aside>`. The engineer should implement this as a conditional: `const AttributionTag = as === 'blockquote' ? 'footer' : 'p'`. Confirm this is the correct approach or propose an alternative at implementation time.
