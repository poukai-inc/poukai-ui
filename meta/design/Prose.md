# Design spec: Prose

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<Prose>` is a typographic context wrapper for long-form HTML that the design system does not author element-by-element — markdown output, CMS body fields, embedded help copy, the bodies of editorial pages. It scopes a single class around its descendants and applies the canonical type contract to every primitive HTML element that may appear inside (`h1`–`h6`, `p`, `ul`, `ol`, `li`, `blockquote`, `code`, `pre`, `hr`, `figure`, `figcaption`, `img`, `table`, `strong`, `em`). Consumers drop raw HTML inside `<Prose>` and the typography behaves correctly without per-element class plumbing.

This is the second of three typography primitives (Heading → Prose → Text). It differs from Heading and Text because it does not own a single element — it owns the **flow** of mixed content.

## 2. Anatomy

- **Root**: a single block-level container. Renders as `<div>` by default. Renders as a Radix `Slot` when `asChild` is set so consumers can attach Prose styles to `<article>`, `<section>`, or any semantically richer wrapper without forking CSS.
- **Descendants**: not authored by Prose. Whatever HTML the consumer passes — paragraphs, headings, lists, quotes, code, images — is styled via `:where(...)` descendant selectors. Specificity is kept low so consumer overrides win.
- **Reading-column constraint**: optional. The Prose root does not set `max-width` by default; consumers compose Prose inside whatever layout they own. A `width="reading"` prop opts into the canonical reading column (`64ch`) when the consumer wants Prose to constrain itself.

## 3. Tokens used

**Typography**

- `--font-serif` — `h1`, `h2`, `blockquote` (display register)
- `--font-sans` — `h3`–`h6`, `p`, `li`, body flow
- `--font-mono` — `code`, `pre`, `kbd`
- `--fs-tagline`, `--fs-stat` — _not used_; Prose is a body-flow primitive, not a hero
- `--fs-body` — `p`, `li`, default flow text
- `--fs-meta` — `figcaption`, `small`, `table caption`
- `--lh-body-relaxed` (1.6) — long-form paragraph rhythm; intentionally looser than `--lh-body` (1.55) used in UI chrome
- `--lh-body` — list items (denser than paragraphs to keep list shape readable)
- `--tracking-stat` (−0.015em) — `h1`, `h2` (matches global heading rule)

**Heading scale (consumed; not new)**

`h1` and `h2` inherit the global serif rules already defined in `tokens.css` lines 204–233. Prose re-declares them inside its scope to keep the local margin rhythm tight and to override the global default-block margin (`margin: 0 0 var(--space-8)` for `h1`, `--space-4` for `h2`) with the Prose-specific cadence below. `h3` continues the global sans rule. `h4`–`h6` are new — the global stylesheet does not define them.

**Color**

- `--fg` — primary text
- `--fg-muted` — `figcaption`, `caption`, `blockquote` cite, `.lede` paragraphs
- `--accent` — link color (inherits global `a` rule)
- `--hairline` — `hr`, `blockquote` border, `table` borders
- `--surface` — `code`, `pre` background, `blockquote` background
- `--hairline-soft` — table row borders, lighter rules

**Spacing & rhythm**

Prose declares **vertical rhythm via top-margins on subsequent siblings** rather than bottom-margins on every element. The pattern `> :where(...) + :where(...) { margin-top: ... }` produces predictable rhythm and zero leading/trailing margin collapse, which matters because the consumer often wraps Prose in a flex column that already controls outer spacing.

| Cadence rung            | Token                 | Used between                                              |
| ----------------------- | --------------------- | --------------------------------------------------------- |
| Default flow            | `--space-4` (1rem)    | paragraph → paragraph, paragraph → list, list → paragraph |
| Heading lead-in         | `--space-8` (2rem)    | _anything_ → `h2`, `h3`                                   |
| Section heading lead-in | `--space-10` (2.5rem) | _anything_ → `h1` after the first                         |
| Subheading              | `--space-6` (1.5rem)  | _anything_ → `h4`, `h5`, `h6`                             |
| Block element           | `--space-6` (1.5rem)  | _anything_ → `blockquote`, `pre`, `figure`, `table`, `hr` |

Lists use `--space-2` between adjacent `<li>` siblings — denser than paragraph rhythm; preserves list shape.

**Radius**

- `--radius-2` (4px) — `code` chip, `pre` block
- `--radius-3` (8px) — `figure > img` rounding (decorative; not enforced if `img` is unconstrained)

**Width**

- `--content-max` is **not** used. The reading-column ceiling is `64ch` — a typographic unit derived from the character count, not a layout unit derived from the breakpoint ladder. Setting it in `ch` keeps the column self-correcting across font-size scales (a future denser body type would still produce a comfortable 64-character measure). This is the only place in the DS where `ch` is the right unit.

## 4. Layout & rhythm

| Width prop         | `max-width` | Centering             | Used for                                                          |
| ------------------ | ----------- | --------------------- | ----------------------------------------------------------------- |
| `"full"` (default) | none        | none                  | Prose composed inside a layout that already owns the column width |
| `"reading"`        | `64ch`      | `margin-inline: auto` | Standalone editorial pages, full-width article bodies             |

Vertical rhythm is declared on the root via `> :where(...) + :where(...)` adjacent-sibling rules. Direct-child selector is intentional: nested elements (e.g. a paragraph inside a `<figure>`, or a list inside a `<blockquote>`) inherit their parent's flow context and are not double-margined.

Tap and reading targets are governed by the type and color tokens; Prose adds no new geometric tokens. The `figure > img` rule applies `max-width: 100%` and `height: auto` so images stay within the reading column regardless of intrinsic dimensions.

## 5. States

`<Prose>` has no interactive state of its own. State belongs to the descendants (links, code, etc.), which inherit the canonical state rules already in `tokens.css` (`a:hover`, `a:focus-visible`, `::selection`).

The only Prose-specific state surface is the `lede` modifier on a first paragraph: `<p className="lede">` inside Prose renders at `--fg-muted` with a relaxed measure. This matches the global `p.lede` rule and is re-declared inside Prose scope for explicitness — readers of `Prose.module.css` should not have to cross-reference `tokens.css` to learn that `.lede` is a real affordance.

## 6. Motion

No Prose-specific motion. Links inside Prose carry the global two-layer underline grow. `prefers-reduced-motion: reduce` is handled by the global block in `tokens.css`.

## 7. Accessibility

- **Semantic element**: `<div>` by default; `<article>` is the recommended `asChild` target for standalone editorial bodies. Prose does not impose `article` because not every Prose context is an article — a paragraph of help copy inside a Dialog is Prose flow but not an article.
- **Heading hierarchy**: Prose styles `h1`–`h6` but does **not** validate that they appear in order. Heading hierarchy is the consumer's responsibility (and is checked by axe at the page level, not the component level).
- **Links**: inherit the global focus-ring contract (2px `--accent`, 2px offset).
- **Code blocks**: `pre` is keyboard-scrollable when content overflows; `overflow: auto` is applied so long lines do not break out of the reading column.
- **Color contrast**: every token combination used inside Prose already passes AA on `--bg` (verified in `meta/brand.md` → canonical palette).
- **Tables**: `<table>` is styled but not made responsive — tables that overflow the reading column should be wrapped in a `<div role="region" aria-label="…">` with `overflow-x: auto` by the consumer. Prose does not introduce a wrapper because the wrapper requires an accessible label that Prose cannot author.
- **Reading width**: when `width="reading"` is set, the column is `64ch` — within the 45–75 CPL range recommended for sustained reading (Bringhurst, _The Elements of Typographic Style_).

## 8. Prop intent

- Consumers must be able to pass arbitrary HTML inside Prose and have it rendered with the DS type contract.
- Consumers must be able to render Prose on `<article>`, `<section>`, or any other block element via `asChild`.
- Consumers must be able to opt into the canonical reading-column constraint (`width="reading"`) without writing `max-width: 64ch; margin-inline: auto;` inline.
- The default `width` is `"full"` — Prose does not constrain itself unless asked. Existing consumers that already own column width through their layout primitives (Section, page chrome) are unaffected.
- Prose forwards all standard `HTMLAttributes<HTMLDivElement>` to the root, including `data-*`, `aria-*`, `id`, `lang`, etc.
- Prose does not own its own variant axis (no `size`, no `tone`). If a use case appears that needs a quieter or denser Prose, file a proposal — the contract for that variant will be authored then.

## 9. Composition rules

- `<Prose>` inside `<Section>` is the canonical pattern for editorial pages — Section owns the page-rhythm and band background; Prose owns the body-flow typography.
- `<Prose>` should not be nested inside another `<Prose>`. The descendant selectors would double-apply and the cascade would become brittle. If you find yourself nesting, refactor so only the outermost wrapper is Prose.
- `<Heading>` and `<Text>` (the sibling typography atoms, when they ship) are for individual elements outside Prose flow — a single hero heading, a single muted caption. Prose is for **mixed** flow. Inside Prose, use plain `<h2>`, `<p>`, etc. — do not nest Heading or Text components inside Prose.
- `<Pull>` and `<Quote>` are editorial molecules that already own their own typography contract. They may sit inside Prose flow; their styles win because they are more specific.
- `<Code>`, `<Kbd>`, `<Mark>` atoms (when they ship) override Prose's element-level rules through component-class specificity. Until they exist, the Prose `code` element-level rule is the canonical inline-code register.

## 10. Out of scope

- **`size` variant** (e.g. `"compact"`, `"relaxed"`). One register for now. If a use case appears that needs a quieter or denser Prose, file a proposal.
- **`tone` variant** (e.g. `"on-warm"` for the editorial warm band). The warm-band foreground tokens (`--fg-on-warm`, `--fg-on-warm-muted`) are not auto-applied; consumers wrap Prose inside a warm-band Section and override colors at that layer.
- **Heading anchor links** (clickable `#` next to headings). That is a content-pipeline concern, not a typography contract — handled by the consumer's markdown renderer.
- **Syntax highlighting inside `pre`**. Out of scope; consumer's renderer owns it. Prose only owns the `pre` block container styling (background, padding, scroll behavior).
- **Drop caps, first-line small-caps, ornaments.** Editorial flourishes belong on a per-page or per-template basis, not a global Prose primitive.
- **Table responsiveness wrapper.** Discussed in §7. Out of scope; consumer must wrap.
- **Footnote / endnote styling.** Specialist need; out of scope for v1.
- **Dark-mode variant treatment.** Handled by the global dark-mode override in `tokens.css` lines 347–385. The Prose rules consume `--fg` / `--fg-muted` / `--surface` / `--hairline` / `--accent`, which flip automatically.
