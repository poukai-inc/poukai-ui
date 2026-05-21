# Design spec: Heading

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<Heading>` is the canonical display-text atom for the design system. It owns the visual type ramp from H1 to H6 and lets the consumer pick the **semantic heading level** (`as`) and the **visual rank** (`size`) independently. Today, headings in the codebase rely on raw `<h1>` / `<h2>` / `<h3>` elements styled by the global rules in `src/tokens/tokens.css:204-242`. Consumers either inherit those global rules (and can't downshift visual rank without breaking outline semantics) or override them ad-hoc in their own CSS (`Section.module.css`, `Hero.module.css`, etc.). The ramp drifts across surfaces and document outlines get distorted in service of size.

`<Heading>` resolves both problems: one component owns the type ramp; the document outline is decided by `as`; the on-screen weight is decided by `size`. Consumers stop reaching for raw heading tags and stop hand-rolling overrides.

## 2. Anatomy

- **Root element**: an HTML heading element (`h1` … `h6`) chosen by the `as` prop. Polymorphic in the same posture as `<Eyebrow>` — explicit switch over allowed tag names so TypeScript stays exact and the rendered element is always one of `h1` … `h6`.
- **Text content slot**: the heading string. The component does not transform case. Consumers write the case they want.
- **Optional inline `<em>`**: italic-serif inflection on H1 / H2 ranks is preserved by inheriting the existing `tokens.css` rule (`h1 em { font-style: italic }`). The component does not own this — consumers write `<em>` inside `children`.

## 3. Tokens used

### Existing tokens (no change)

| Token          | Value                      | Role                              |
| -------------- | -------------------------- | --------------------------------- |
| `--font-serif` | Instrument Serif           | H1 / H2 (display register)        |
| `--font-sans`  | Geist                      | H3 / H4 / H5 / H6 (UI register)   |
| `--fg`         | `#1d1d1f` / dark `#f5f5f7` | Heading text color                |
| `--fs-meta`    | `0.875rem` (14px)          | Reused as the H6 size             |
| `--lh-meta`    | `1.2`                      | Reused as the H5 / H6 line-height |
| `--lh-body`    | `1.55`                     | Reference only — not used here    |

### New tokens introduced by this spec

The Heading ramp is the brand's display-rank vocabulary; it deserves named tokens, not literal sizes inside `Heading.module.css`. Six tokens, mapped to existing or hand-tuned values:

| Token     | Value                                                           | Source                                                                                                            |
| --------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `--fs-h1` | `var(--fs-tagline)` → `clamp(2.25rem, 1.5rem + 3.5vw, 4.25rem)` | Reuses the existing tagline ramp (36–68px). H1 = "the page's display moment", same scale as `<Hero>` tagline.     |
| `--fs-h2` | `clamp(1.75rem, 1.25rem + 2vw, 2.5rem)`                         | Lifted verbatim from the current global `h2` rule in `tokens.css:228`. No visual drift.                           |
| `--fs-h3` | `1.125rem`                                                      | Lifted verbatim from the current global `h3` rule in `tokens.css:237`. No visual drift.                           |
| `--fs-h4` | `1rem`                                                          | New rung. Matches `--fs-body` lower bound; sits between H3 and the meta-text floor.                               |
| `--fs-h5` | `0.9375rem`                                                     | New rung. One step under body (15px) — distinct from `--fs-meta` (14px) so the ramp doesn't collapse at the foot. |
| `--fs-h6` | `var(--fs-meta)` → `0.875rem`                                   | Reuses `--fs-meta`. H6 is the bottom rung — same size as captions / meta.                                         |

**Why six tokens, not three.** The backlog item `Heading — h1–h6 wrapper enforcing the canonical type scale` calls for the full `--fs-h1` … `--fs-h6` set explicitly. Naming the full ramp (even the rungs that map to existing tokens) makes the ramp readable from `tokens.css` as a single block and exportable to `llms-full.txt`. Consumers who want "the H3 size" reach for `--fs-h3` directly, not `1.125rem`.

**Why H1 reuses `--fs-tagline` instead of getting its own value.** `--fs-tagline` is already the brand's biggest display rung — used by `<Hero>` and the global `<h1>` rule. Forking H1 to a different value would either contradict `<Hero>` or contradict the existing global rule. Heading's H1 _is_ the tagline scale; the alias `--fs-h1 → var(--fs-tagline)` keeps both consumers reading the same value.

**Why H6 reuses `--fs-meta`.** The bottom of the heading ramp lands exactly where meta-text lives (`Eyebrow`, captions). Giving H6 its own 14px-near value would invent a difference the eye can't see. The alias preserves the contract: "H6 is the meta-text rung used as a heading".

### Line-height per rung

| Size | Line-height              | Notes                                                                         |
| ---- | ------------------------ | ----------------------------------------------------------------------------- |
| H1   | `1.15`                   | Lifted from current `tokens.css:208` global `h1` rule. Tight display leading. |
| H2   | `1.2`                    | Lifted from current `tokens.css:229` global `h2` rule.                        |
| H3   | `1.3`                    | Lifted from current `tokens.css:238` global `h3` rule.                        |
| H4   | `1.35`                   | New value. One micro-step below H3; H4 is shorter copy, slightly more air.    |
| H5   | `var(--lh-meta)` (`1.2`) | Reuses the meta-text leading.                                                 |
| H6   | `var(--lh-meta)` (`1.2`) | Reuses the meta-text leading.                                                 |

Line-heights are inlined inside `Heading.module.css` for the rungs that don't have a token yet (H1 / H2 / H3 / H4). A full `--lh-*` ramp is deferred to the foundations pass (BACKLOG: "Tokenize line-height + letter-spacing scales").

### Letter-spacing per rung

| Size | Letter-spacing | Notes                                                                                       |
| ---- | -------------- | ------------------------------------------------------------------------------------------- |
| H1   | `-0.005em`     | Lifted from current `tokens.css:209` global `h1` rule. Optical tightening of serif display. |
| H2   | `normal`       | Matches current global `h2` rule (no letter-spacing set).                                   |
| H3   | `-0.005em`     | Lifted from current `tokens.css:239` global `h3` rule.                                      |
| H4   | `normal`       | New rung.                                                                                   |
| H5   | `normal`       | New rung.                                                                                   |
| H6   | `normal`       | New rung.                                                                                   |

### Font-weight per rung

| Size | Font-weight | Notes                                                                                 |
| ---- | ----------- | ------------------------------------------------------------------------------------- |
| H1   | `400`       | Serif. Lifted from current `tokens.css:206` global `h1` rule.                         |
| H2   | `400`       | Serif. Lifted from current `tokens.css:227` global `h2` rule.                         |
| H3   | `500`       | Sans-medium. Lifted from current `tokens.css:236` global `h3` rule.                   |
| H4   | `600`       | Sans-semibold. H4 carries more semantic weight per character; semibold > medium here. |
| H5   | `600`       | Sans-semibold.                                                                        |
| H6   | `600`       | Sans-semibold.                                                                        |

## 4. Layout & rhythm

- `display: block` for every rung — the rendered element is always a block-level heading tag.
- `margin: 0` — the consumer owns spacing. The global `tokens.css` `h1` / `h2` / `h3` rules ship with `margin: 0 0 <space>` baked in; `<Heading>` deliberately resets that so layout context (stack / flow / grid) determines rhythm. This is the canonical position across the system (`<Eyebrow>` does the same).
- `color: var(--fg)` — every rung. No muted heading register; muted text is `<Eyebrow>` or future `<Text tone="muted">`.
- H1: `text-wrap: balance` — preserved from the current global `h1` rule (`tokens.css:210`). Improves wrap quality on multi-line display titles.
- H1: `padding-bottom: 0.08em` — preserved from the current global `h1` rule (`tokens.css:211`). Italic-serif descender clearance.

## 5. Variants

The Heading atom has no `variant` prop. The visual register is fully encoded by `size`. The semantic register is fully encoded by `as`. Color, tone, and case are not in scope — they belong to future `<Text>` (tone) and the consumer (case).

## 6. Decoupled `as` and `size`

The whole point of this atom is to separate the document outline from the visual ramp:

- `as` ∈ `{ "h1", "h2", "h3", "h4", "h5", "h6" }` — the rendered element. Drives accessibility and document outline. Default: `"h2"` (an explicit H1 should be deliberate on most pages).
- `size` ∈ `{ "h1", "h2", "h3", "h4", "h5", "h6" }` — the visual rank. Drives the rendered type styling. Default: **same value as `as`** (so the common case is one prop).

Examples:

```tsx
// H2 element, default H2 styling — the common case
<Heading>Why we build</Heading>

// H1 element styled at H2 visual rank — common on long-form pages
//   where the page title shouldn't be the loudest type
<Heading as="h1" size="h2">Field notes</Heading>

// H3 element styled at H5 rank — section subheading inside a card
<Heading as="h3" size="h5">Last updated</Heading>

// H1 element styled at the display ramp — the canonical hero usage
<Heading as="h1" size="h1">The platform for working agents.</Heading>
```

`<Heading>` does **not** ship a separate `display` rank above H1 — `--fs-h1` already maps to `--fs-tagline`, which is the brand's display ceiling. Consumers wanting "bigger than H1" should reach for `<Hero>` (which owns the page-display moment with its own tokens and entrance motion).

## 7. States

`<Heading>` has no states. It is not interactive. No hover, focus, active, or disabled treatment.

## 8. Motion

`<Heading>` does not animate. Entrance animation belongs to the surface (`<Hero>` entrance stagger, `<Section>` entrance fade) — the heading rides on the surface's animation if any.

## 9. Accessibility

- **Semantic element**: always a real heading tag (`h1` … `h6`) — never a `<div role="heading">`. The component refuses non-heading `as` values at the TypeScript level.
- **Document outline**: the consumer is responsible for the heading hierarchy on the page. The component does not enforce H1 → H2 → H3 nesting; that's the page's job. The component _does_ let the consumer downshift visual rank without breaking the outline, which is the whole point.
- **Color contrast**: `--fg` on `--bg` ≈ 16.29 : 1 (AAA, light mode). Dark mode `--fg` (`#f5f5f7`) on `--bg` (`#000`) ≈ 19.58 : 1 (AAA). Contrast verified in `meta/design/dark-mode.md`.
- **Reduced motion**: nothing to do — no animation.

## 10. Prop intent

- Consumers must be able to choose any of `h1` … `h6` as both the rendered element and the visual rank — independently.
- Consumers must be able to pass `children`, `className`, and any standard heading-element prop (`id` for in-page anchors, `aria-*`, `data-*`).
- Consumers must be able to forward a ref to the underlying heading element (so `<Heading>` plays nicely with `Hero` entrance refs, intersection observers, and anchor-scroll behavior).
- The default rendered element is `h2`. The default size mirrors `as`.
- There is no `variant`, no `tone`, no `align`, no `weight` prop. Heading is the **type ramp atom**; tone and alignment are layout decisions owned by the surface above.

## 11. Migration notes (informational)

Future molecules / organisms should migrate raw heading tags to `<Heading>` over time. The global `tokens.css` `h1` / `h2` / `h3` rules stay in place during the migration so consumer apps that import `@poukai-inc/ui/tokens.css` continue to get sensible defaults on raw HTML. Once the codebase converges on `<Heading>` everywhere, the global rules can be retired in a separate change (out of scope for this spec).

## 12. Out of scope

- A `display` / hero-tagline rank above H1 — owned by `<Hero>`.
- Tone variants (muted, on-warm) — owned by future `<Text>` and the canonical `Eyebrow` atom.
- Numbered headings — owned by `<Eyebrow variant="numbered">`.
- Anchor links / "copy-link-to-heading" affordances — composable on top of `<Heading>` by consumers (pass an `id`; render a sibling anchor button).
