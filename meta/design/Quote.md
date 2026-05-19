# Design spec: Quote

**Atomic layer**: molecule
**Status**: Draft
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<Quote>` is the canonical customer-story attribution block. It renders a body of quoted text — typically 1–4 sentences from a named person — alongside a small attribution row carrying that person's name, optional role or title, and an optional avatar slot. Its primary surface is the customer story page and any social-proof section on the site.

Quote is the attributed sibling in a three-component family. The distinctions are load-bearing and must be preserved:

- **Pull** — unattributed editorial pull-quote. Inline with body prose. Instrument Serif italic. No person identity. Typographic accent, not a testimonial.
- **Statement** (planned) — authorial brand assertion. Page-level, once per page. Instrument Serif italic. No attribution. Brand voice, not a testimonial.
- **Quote** (this component) — attributed customer testimonial. Body text in Geist sans-serif, roman weight. Attribution row with name, optional role, optional avatar. Social-proof device, not an editorial accent.

The sans-serif body is the clearest typographic differentiator from Pull and Statement, both of which are defined by Instrument Serif italic. A consumer or reviewer should be able to tell Quote from Pull at a glance without reading the attribution.

### Non-goals (explicit exclusions)

- Quote does not replace Pull. If there is no named person, use Pull.
- Quote does not ship its own Avatar atom. The DS does not have one; the `avatar` slot accepts any `ReactNode` the consumer provides.
- Quote does not accept headings, lists, or block-level children inside the body. It is a short prose block — one continuous thought.
- Quote is not a generic card or feature block. It contains one attributed quotation per instance. Composing multiple Quotes is the page's responsibility.
- Quote does not handle multi-quote carousels or sliders. That is a page-composition concern.

---

## 2. Anatomy

### Layout decision: stacked (body above attribution row)

Two layouts were evaluated:

**Option A — body above attribution row (chosen).** The quoted text sits at the top of the component. The attribution row — avatar (optional) + name + role — sits below, separated by `var(--space-4)` (16px). This is the canonical print and web pattern for attributed blockquotes: the quote speaks first, the person contextualizes it after. It maps directly to the HTML `<figure>` / `<blockquote>` / `<figcaption>` pattern recommended by the spec.

**Option B — sidebar layout (avatar-left of body, attribution below-left).** Rejected. A sidebar layout implies the avatar is load-bearing visual information at the time of reading the quote — it implies the person's face is needed to understand the content. In most customer story contexts, the face supports the quote; it does not precede it. Sidebar layouts also create awkward reflow at narrow viewports when the avatar is absent. The stacked layout degrades more gracefully when the avatar slot is empty.

**Decision: stacked layout, body on top, attribution row below.**

### Named anatomy parts

- **Root element**: `<figure>` — see §8 for rationale. The forwarded ref targets this element.
- **Blockquote**: a `<blockquote>` inside `<figure>`. Contains the quote body text. The HTML spec's recommended structure for attributed quotations is `<figure><blockquote>…</blockquote><figcaption>…</figcaption></figure>`.
- **Body slot**: the quoted text. Required. Renders as the direct child (text node or inline elements) inside `<blockquote>`. Typography: `var(--fs-pull)` (20–26px fluid). Geist sans-serif, roman weight 400. Color: `var(--fg)`. This size gives the quote visual presence above body prose without reaching editorial display territory. See §3 for font-size decision rationale.
- **Figcaption**: a `<figcaption>` inside `<figure>`, below the blockquote. Contains the attribution row. Semantically associates the attribution with the quoted content per the HTML spec.
- **Attribution row**: the horizontal flex container inside `<figcaption>`. Holds the avatar slot (if provided) and the name/role column.
- **Avatar slot** (optional): the leftmost element of the attribution row. Accepts any `ReactNode`. No DS-level sizing or clipping is applied — the consumer is responsible for rendering a correctly-sized, correctly-shaped element. The spec recommends consumers size the avatar to 40×40px and clip to a circle, but does not enforce it. When absent, the name/role column is the only content in the row.
- **Name**: required. A single line of text in `var(--fs-meta)` (14px), `var(--fg)`, font-weight 500. Slightly heavier than the surrounding role text to give the name prominence in the attribution row.
- **Role** (optional): a single line of text in `var(--fs-meta)` (14px), `var(--fg-muted)`. Appears below the name when provided. Format example: "VP Engineering, Acme Corp".

---

## 3. Tokens used

No new tokens are introduced. Quote is built entirely from the existing vocabulary.

| Token         | Value                                  | Role                                                                                             |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `--fs-pull`   | `clamp(1.25rem, 1rem + 1vw, 1.625rem)` | Body font size (20–26px fluid). Chosen to give the quote presence without reaching heading scale |
| `--fs-meta`   | `0.875rem` (14px)                      | Name and role font size                                                                          |
| `--font-sans` | Geist stack                            | All text in Quote — the typographic differentiator from Pull/Statement                           |
| `--fg`        | `#1D1D1F`                              | Body text color; name color                                                                      |
| `--fg-muted`  | `#6E6E73`                              | Role/title color                                                                                 |
| `--hairline`  | `#D2D2D7`                              | Optional rule above the attribution row                                                          |
| `--space-1`   | `0.25rem` (4px)                        | Gap: name → role within the name/role column                                                     |
| `--space-3`   | `0.75rem` (12px)                       | Gap: avatar → name/role column within the attribution row                                        |
| `--space-4`   | `1rem` (16px)                          | Gap: blockquote body → figcaption attribution row                                                |
| `--space-8`   | `2rem` (32px)                          | `margin-block` on the root `<figure>`: breathing room from surrounding content                   |
| `--lh-meta`   | `1.2`                                  | Line-height for name and role lines                                                              |
| `--hero-max`  | `38rem` (608px)                        | `max-width` on the root: matches the prose column cap                                            |

### Font-size decision: `--fs-pull` for the body

Three candidates were considered:

- **`--fs-body` (17–19px)**: Too quiet. At body size the quote blends into surrounding prose — it loses the typographic presence a customer testimonial needs to signal "this person said something worth stopping for." Social-proof blocks need a slight visual promotion above the prose register.
- **`--fs-pull` (20–26px)** (chosen): The correct rung. It sits between body and heading scale. It is the same scale Pull uses for its editorial accent — it is the right size for a "quote worth pausing on." Using `--fs-pull` here is semantically appropriate: both Pull and Quote are quoted-content primitives at slightly elevated scale. The difference between them is typographic register (sans vs. serif), not size.
- **`--fs-card-title` (24–32px)** or larger: Too loud. At card-title scale, the body would visually compete with heading landmarks on the page and would overwhelm a short testimonial sentence. Pull-quote size is the natural ceiling for inline attributed prose.

`--fs-pull` is the reuse of a legitimately parallel token. It does not introduce a new semantic role.

### Font-weight decision: 400 (roman) for the body

Pull uses `--font-serif` at italic. Quote uses `--font-sans` at weight 400, roman. No bold, no medium, no italic. The quote body is not an accent — it is content. Its weight matches the global body weight. The visual differentiation from surrounding prose comes from size (`--fs-pull` vs. `--fs-body`) and semantic placement (inside a `<figure>` block), not from typographic styling.

### New tokens required

None. The zero-new-token target is met.

---

## 4. Layout & rhythm

### Root `<figure>`

| Property       | Value                             | Notes                                                                                                             |
| -------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `margin`       | `0`                               | Remove default UA margin on `<figure>`. The component's own `margin-block` owns all vertical spacing.             |
| `margin-block` | `var(--space-8)` (32px)           | Breathing room from surrounding content. Matches Pull's block margin — they are in the same scale family.         |
| `max-width`    | `var(--hero-max)` (38rem / 608px) | Matches the prose column cap used by Pull, Hero, Section, and FieldNote. Quote lives in the same column register. |
| `padding`      | `0`                               | No padding on the figure root. Internal spacing is owned by the blockquote and figcaption elements.               |

### `<blockquote>` body

| Property      | Value                            | Notes                                                                                                                                                                             |
| ------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `margin`      | `0`                              | Remove default UA `margin: 1em 40px` on `<blockquote>`. All spacing is owned by the figure.                                                                                       |
| `padding`     | `0`                              | No padding on blockquote. Content is flush.                                                                                                                                       |
| `font-size`   | `var(--fs-pull)` (20–26px fluid) | Presence above body prose. See §3 for rationale.                                                                                                                                  |
| `font-family` | `var(--font-sans)`               | Geist. Distinguishes Quote from Pull/Statement at a glance.                                                                                                                       |
| `font-weight` | `400`                            | Roman. Not italic. Not medium. Weight matching global body; size provides the visual elevation.                                                                                   |
| `font-style`  | `normal`                         | Explicitly not italic. Italic is Pull/Statement territory.                                                                                                                        |
| `line-height` | `1.45`                           | Slightly tighter than global body (1.55) because the larger size provides optical spacing. Consistent with Pull's body line-height at this scale. Inline value — not a new token. |
| `color`       | `var(--fg)`                      | Full-weight primary text.                                                                                                                                                         |

### `<figcaption>` and attribution row

| Property      | Value                                     | Notes                                                                                                                                                                                                                                                                      |
| ------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `margin-top`  | `var(--space-4)` (16px)                   | Gap between blockquote body and attribution.                                                                                                                                                                                                                               |
| `display`     | `flex`                                    | Horizontal flex container.                                                                                                                                                                                                                                                 |
| `align-items` | `center`                                  | Vertically center avatar with the name/role column. Correct when avatar is ~40px and name+role is ~32px combined.                                                                                                                                                          |
| `gap`         | `var(--space-3)` (12px)                   | Space between avatar slot and name/role column. Tight but clear separation.                                                                                                                                                                                                |
| `padding-top` | `var(--space-4)` (16px)                   | Space above figcaption content. Combined with the hairline rule (see below), this creates a clean break between quote and attribution.                                                                                                                                     |
| `border-top`  | `var(--hairline-w) solid var(--hairline)` | 1px hairline rule above the attribution row. Provides a quiet visual boundary that separates the quoted content from the attributing person. This is the DS's standard rule weight — not the 3px editorial weight used by Pull's left rule, which would be too heavy here. |

### Name and role column

| Property         | Value                  | Notes                                                    |
| ---------------- | ---------------------- | -------------------------------------------------------- |
| `display`        | `flex`                 |                                                          |
| `flex-direction` | `column`               |                                                          |
| `gap`            | `var(--space-1)` (4px) | Tight coupling: name and role read as one identity unit. |

### Name element

| Property      | Value              | Notes                                                                |
| ------------- | ------------------ | -------------------------------------------------------------------- |
| `font-size`   | `var(--fs-meta)`   | 14px — attribution register.                                         |
| `font-family` | `var(--font-sans)` | Geist — inherited from root.                                         |
| `font-weight` | `500`              | Slightly heavier than the role line. Gives the name modest emphasis. |
| `line-height` | `var(--lh-meta)`   | 1.2 — tight meta-scale.                                              |
| `color`       | `var(--fg)`        |                                                                      |
| `margin`      | `0`                | No default `<p>` margin.                                             |

### Role element (when present)

| Property      | Value              | Notes                                       |
| ------------- | ------------------ | ------------------------------------------- |
| `font-size`   | `var(--fs-meta)`   | 14px — same scale as name.                  |
| `font-family` | `var(--font-sans)` | Geist — inherited from root.                |
| `font-weight` | `400`              | Regular — lighter than name.                |
| `line-height` | `var(--lh-meta)`   | 1.2.                                        |
| `color`       | `var(--fg-muted)`  | Muted — supporting context, not the signal. |
| `margin`      | `0`                | No default `<p>` margin.                    |

---

## 5. States & motion

### States

Quote is a static content block. No interactive states are defined for the component itself.

**Inline links within the body.** If a consumer passes an `<a>` inside the `quote` ReactNode, that link inherits the global `<a>` rule from `tokens.css` — hairline underline at rest, accent underline grows on hover, `--dur-mid` transition via `--easing-link`. Focus-visible inherits `outline: 2px solid var(--accent)`, `outline-offset: 4px`, `border-radius: var(--radius-1)`. No override is needed inside Quote's CSS module.

**Avatar slot.** The `avatar` prop is a `ReactNode`. If the consumer passes an interactive element (a linked avatar), that element's interactive states are the consumer's responsibility. The DS does not style the avatar slot's contents.

### Motion

None. Quote is a static content block. No entrance animation, no hover transition on the container, no reduced-motion variant required at the component level. Any scroll-driven reveal is the page composition layer's concern.

---

## 6. Responsive behavior

Quote's layout is identical on both sides of the 768px breakpoint. No responsive changes are defined.

**Rationale.** The stacked layout (body above attribution row) is the correct layout at both narrow and wide viewports. There is no sidebar layout to collapse from. The `max-width: var(--hero-max)` constraint (38rem / 608px) means Quote is already narrower than a typical desktop content column — it is always in "prose column" mode. The attribution row's flex layout (avatar + name/role column) is compact enough at narrow viewports: an avatar at ~40px and two lines of `--fs-meta` (14px) text fit comfortably inside even a 320px viewport after `--page-pad` inset.

If a live audit reveals the `--space-8` margin-block is heavy on narrow viewports, a reduction to `var(--space-6)` (24px) at mobile scale is a rhythm calibration and does not require a brand-level decision-log entry.

---

## 7. Accessibility

### Root element: `<figure>` with `<blockquote>` and `<figcaption>`

The HTML5 spec explicitly recommends this pattern for attributed quotations:

> "If a `figure` element contains a `blockquote` element, then the `figcaption` element, if any, serves as the caption for the block quote."

This structure correctly associates the attribution (name, role) with the quoted content at the HTML semantic level. Screen readers that announce figure/figcaption associations will correctly link the person to the quotation. No extra ARIA is needed — the semantic structure does the work.

**Why not `<blockquote>` + `<footer>` directly (without `<figure>`)?**

The `<blockquote>` + `<footer>` pattern (used by Pull's attribution) is valid for editorial pull-quotes where the attribution is a brief textual note. For Quote, the attribution is a person identity block — it is structurally richer and more semantically distinct from the quoted body. The `<figure>` + `<figcaption>` pattern expresses this relationship more clearly and maps to the HTML spec's explicit recommendation for attributed quotations. The decision also keeps Quote visually and semantically distinct from Pull at the implementation level, reinforcing the conceptual separation.

**Why not `<div>` root?**

A `<div>` root carries no semantic meaning. The component's purpose — attributed quotation — is expressible in HTML semantics. Using `<div>` here is a step backward from `<figure>`.

**`<blockquote>` inside `<figure>`.**

The `<blockquote>` inside the figure is the correct semantic element for the quoted material. It announces as a blockquote or indented quotation to assistive technology. It does not carry a landmark role.

**Avatar as decorative when attribution is present.**

The avatar visually reinforces the named person in the attribution row, but the name itself is the text alternative. When the consumer passes an `<img>` in the avatar slot, the img's `alt` attribute should be `""` (empty, marking it decorative) because the person is already named in the attribution row. This expectation is documented here but is the consumer's responsibility — Quote does not wrap or control the avatar slot's internals.

**No `aria-label` on `<figure>`.**

Adding an `aria-label` like `aria-label="Customer quote"` to `<figure>` would add a labeled landmark (figure with accessible name), which may be announced by some screen readers. For a customer story page with multiple quotes, this creates repetitive landmark noise. No `aria-label` is added by default. The `<figure>` / `<blockquote>` / `<figcaption>` structure is self-describing.

### Contrast ratios (verified against `meta/brand.md` values)

| Pair                                       | Ratio     | Verdict     |
| ------------------------------------------ | --------- | ----------- |
| `--fg` (#1D1D1F) on `--bg` (#FBFBFD)       | 16.29 : 1 | AAA         |
| `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) | 4.91 : 1  | AA normal ✓ |

Name at `--fg` / 14px: AAA. Role at `--fg-muted` / 14px: 4.91:1 — AA normal (threshold 4.5:1). No exception needed.

The hairline rule (`--hairline` on `--bg`) is decorative. No contrast requirement.

### Keyboard interaction

Quote is not interactive. If the consumer places a link in the quote body or avatar slot, that element is a standard focusable element and receives the global focus ring. No custom keyboard management is required.

---

## 8. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API
interface QuoteProps extends ComponentPropsWithoutRef<"figure"> {
  /**
   * The quoted body text. Required.
   * Accepts ReactNode to support inline <em> or <strong> within the passage.
   * No block-level elements — no headings, lists, or nested paragraphs.
   * Rendered as the direct child of <blockquote>.
   */
  quote: ReactNode;
  /**
   * The attributed person's name. Required.
   * Plain string. Rendered at --fs-meta, font-weight 500, --fg.
   */
  name: string;
  /**
   * The attributed person's role or title. Optional.
   * Plain string. Example: "VP Engineering, Acme Corp".
   * Rendered at --fs-meta, font-weight 400, --fg-muted.
   * When omitted, no role element is rendered.
   */
  role?: string;
  /**
   * Avatar slot. Optional. Accepts any ReactNode.
   * Consumers pass <img>, an Avatar component from another library,
   * or a <div> with initials. The DS does not ship an Avatar atom.
   * When present, rendered as the leftmost element of the attribution row.
   * When omitted, the attribution row contains only the name/role column.
   * If the consumer passes an <img>, its alt attribute should be ""
   * (decorative) because the name already provides the text alternative.
   */
  avatar?: ReactNode;
}
```

**`quote: ReactNode` — not `string`.**

The body is typed as `ReactNode`, not `string`. Rationale: customer story quotes often benefit from inline `<em>` for emphasis within the quoted passage ("We went from _weeks_ to hours"). Accepting only `string` would force consumers to pass unstructured text without inline markup. `ReactNode` enables inline emphasis while the block-level restriction (no headings, lists, etc.) is documented and relies on consumer discipline, consistent with how Pull, FieldNote, and other body-slot molecules are specified.

**`name: string`, `role?: string` — not `ReactNode`.**

The attribution slots are typed as `string` because they are single-line metadata labels in the meta register. Accepting `ReactNode` would allow block elements, composed components, or multi-line markup into slots that are visually and semantically constrained to one short line each. `string` enforces that constraint at the type level.

**`avatar?: ReactNode`.**

The DS does not ship an Avatar atom. The slot is an escape hatch — it accepts any consumer-provided element. This is the correct approach for a DS that does not want to own avatar rendering logic (image sizing, initials fallback, skeleton states) within a molecule. If a DS Avatar atom is introduced in the future, `avatar` becomes the natural slot for it.

**Root element: `<figure>`.**

The engineer uses `ComponentPropsWithoutRef<"figure">` as the base type. The root is not polymorphic — `<figure>` is the single correct semantic choice for this component. A polymorphic `as` prop would imply multiple valid root elements, but there are not.

**`forwardRef` and `displayName`.**

The component uses `forwardRef` (consistent with Pull, FieldNote, Portrait, Section — all molecules use `forwardRef`). `displayName = "Quote"` must be set explicitly on the `forwardRef` result.

**`className` merges via `clsx`.**

Standard escape hatch. Consumer can apply custom `max-width` overrides, margin adjustments, or contextual theming.

**Standard HTML attributes spread onto root.**

`ComponentPropsWithoutRef<"figure">` gives consumers access to `id`, `data-*`, `aria-*`, `className`, and event handlers. These spread onto the `<figure>` root.

**What was trimmed:**

- `variant` prop — rejected. Quote has one typographic register (sans-serif, roman) and one layout (stacked). No variant adds value without blurring the component's identity.
- `size` prop — rejected. `--fs-pull` is the correct and only body size. A `size="large"` variant would push into Statement territory. A `size="small"` variant would push into body-text territory and lose the quote's presence.
- `as` polymorphic prop — rejected. `<figure>` is the single correct root.
- `cite` on the blockquote — noted but not exposed as a prop in this version. The machine-readable HTML `cite` attribute on `<blockquote>` could be useful for crawlers. It is deferred to a later revision — the `quote` body and `name` attribution are the load-bearing information. If Arian wants `cite` exposed, it is a trivial addition: add `cite?: string` to the interface, pass it through to the inner `<blockquote>` element. See §10 Open questions.

---

## 9. Composition rules

- Quote composes inside long-form editorial surfaces — customer story pages, `/about` feature sections, social-proof panels. Its natural host is a `<Section>` children slot or a direct page column.
- Multiple Quotes may appear on a single page (e.g. a customer grid with three quotes). The `margin-block: var(--space-8)` spacing creates breathing room. No enforced count limit.
- Quote should not be placed inside a `<Hero>`. Hero owns the page's display moment; Quote is a supporting content block.
- Quote should not be used as a Pull substitute. Pull is for unattributed editorial text in article flow. Quote is for named person testimonials on story or marketing surfaces.
- Quote does not compose with Pull on the same surface without careful editorial judgment. Using both a Pull and a Quote for the same person's words on the same page is likely a composition error — pick the register.
- Quote renders well inside `<Section size="tight">` or a section with a warm-accent background band — the sans-serif body and `--fg` color are compatible with `--surface-section` and `--bg` surfaces. Do not render Quote on a `--bg-warm-accent` band (the palette interaction is untested and warm-accent text tokens have restricted usage).

---

## 10. Out of scope

- **Avatar atom.** The DS does not ship an Avatar atom in this version. The `avatar` prop is a `ReactNode` slot. A future `Avatar` atom (with initials fallback, skeleton, circle clipping) is a separate DS primitive if and when the product warrants it.
- **`cite` attribute on the inner `<blockquote>`.** Machine-readable URL attribution for the quoted source. Deferred from v1 — see Open questions §11.
- **Dark mode per-component overrides.** All consumed tokens (`--fg`, `--fg-muted`, `--hairline`, `--font-sans`) flip cleanly via the global dark-mode override block in `tokens.css` when it ships. No per-component dark-mode CSS is needed.
- **Entrance animation.** Static component. Any scroll-triggered reveal is the page composition layer's concern.
- **RTL support.** The component uses no directional properties. `flex` layout with `gap` is direction-neutral. RTL-correct by default.
- **Quote carousel / slider.** Composing multiple Quote instances into a rotating carousel is a page-level concern, not a DS primitive.
- **Multi-paragraph body.** Quote is a single continuous thought — 1–4 sentences. Multi-paragraph attributed content belongs in a structured content block (a future `Testimonial` organism, if needed), not a Quote molecule.
- **Italic body variant.** Explicitly excluded. Italic body is Pull's register. Quote is san-serif roman only. Any request to add italic body to Quote requires a brand-level escalation — it would blur the Pull/Quote distinction at the typographic level.

---

## 11. Worked examples

### (a) Full Quote — avatar, name, and role

```jsx
import { Quote } from "@poukai-inc/ui";

<Quote
  quote="We went from weeks to hours. The tooling handled what we used to staff an entire team for."
  name="Sarah Chen"
  role="VP Engineering, Meridian Labs"
  avatar={
    <img
      src="https://cdn.example.com/avatars/sarah-chen.jpg"
      alt=""
      width={40}
      height={40}
      style={{ borderRadius: "50%", display: "block" }}
    />
  }
/>;
```

Renders:

```html
<figure class="root">
  <blockquote class="blockquote">
    We went from weeks to hours. The tooling handled what we used to staff an entire team for.
  </blockquote>
  <figcaption class="figcaption">
    <div class="avatarSlot">
      <img src="…" alt="" width="40" height="40" style="border-radius: 50%; display: block;" />
    </div>
    <div class="nameRole">
      <p class="name">Sarah Chen</p>
      <p class="role">VP Engineering, Meridian Labs</p>
    </div>
  </figcaption>
</figure>
```

### (b) Quote without avatar

```jsx
<Quote
  quote="The accuracy improvements were immediate and measurable. We rolled it out to the full team within a week."
  name="James Okonkwo"
  role="Head of Data, Fieldwork AI"
/>
```

Renders:

```html
<figure class="root">
  <blockquote class="blockquote">
    The accuracy improvements were immediate and measurable. We rolled it out to the full team
    within a week.
  </blockquote>
  <figcaption class="figcaption">
    <div class="nameRole">
      <p class="name">James Okonkwo</p>
      <p class="role">Head of Data, Fieldwork AI</p>
    </div>
  </figcaption>
</figure>
```

Note: when `avatar` is absent, the `avatarSlot` wrapper is not rendered. The `nameRole` column sits flush at the start of the attribution row.

### (c) Quote with no role — name only

```jsx
<Quote
  quote="Exactly what we needed. Nothing we didn't."
  name="Priya Mehta"
  avatar={
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
      }}
    >
      PM
    </div>
  }
/>
```

Renders:

```html
<figure class="root">
  <blockquote class="blockquote">Exactly what we needed. Nothing we didn't.</blockquote>
  <figcaption class="figcaption">
    <div class="avatarSlot"><!-- initials div --></div>
    <div class="nameRole">
      <p class="name">Priya Mehta</p>
      <!-- no role element rendered -->
    </div>
  </figcaption>
</figure>
```

---

## 12. Story matrix

| Story file                      | Story name        | Description                                                                                                                                                                                    |
| ------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Quote.stories.tsx`             | `Default`         | Full Quote: `quote`, `name`, `role`, `avatar` (img). Verifies: `<figure>` root, `<blockquote>`, `<figcaption>`, attribution row flex layout, hairline rule above figcaption, all token values. |
| `Quote.stories.tsx`             | `NoAvatar`        | `quote`, `name`, `role`, no avatar. Verifies: attribution row without avatar slot, name+role column layout, gap collapses correctly.                                                           |
| `Quote.stories.tsx`             | `NoRole`          | `quote`, `name`, avatar. No `role`. Verifies: role element is not rendered; name-only attribution row is correct.                                                                              |
| `Quote.stories.tsx`             | `NameOnly`        | `quote`, `name` only. No role, no avatar. Verifies: minimal attribution — name alone in figcaption.                                                                                            |
| `Quote.stories.tsx`             | `WithInitials`    | Avatar slot using a `<div>` with initials (no `<img>`). Verifies slot accepts arbitrary ReactNode; no DS-level avatar constraint.                                                              |
| `Quote.stories.tsx`             | `LongQuote`       | A 3–4 sentence quote body (~60 words). Verifies `max-width: var(--hero-max)` constrains the block; `line-height: 1.45` reads correctly at full measure; attribution row does not wrap.         |
| `Quote.stories.tsx`             | `InlineEmphasis`  | `quote` contains `<em>` inline. Verifies inline ReactNode renders correctly inside `<blockquote>`; no layout shift; italic em reads within the roman body.                                     |
| `Quote.AllVariants.stories.tsx` | `AllVariants`     | Four Quotes stacked: full (avatar+name+role), no avatar, no role, name only. Design-matrix story.                                                                                              |
| `Quote.AllVariants.stories.tsx` | `InSectionRhythm` | A `<Section>` containing two paragraphs of prose, then a `<Quote>`, then two more paragraphs. Verifies `margin-block: --space-8` reads correctly and Quote does not disrupt the prose column.  |
| `Quote.AllVariants.stories.tsx` | `AlongsidePull`   | A `<Pull>` followed by a `<Quote>`. Verifies they are visually distinct at a glance: serif italic vs. sans roman, left rule vs. hairline top-border, editorial vs. testimonial register.       |

---

## 13. Open questions for Arian

1. **`cite` prop on the inner `<blockquote>`.** The HTML spec supports a `cite` attribute on `<blockquote>` — a machine-readable URL pointing to the source of the quotation. Customer story quotes rarely have a URL source (they are spoken/written for the purpose), so this is low-priority. Should it be exposed as an optional `cite?: string` prop in v1? It is a trivial addition if wanted. Current stance: deferred.

2. **Avatar sizing convention.** The spec recommends consumers size the avatar to 40×40px and clip to a circle but does not enforce it. Should the DS add a wrapper `<div>` with `width: 40px; height: 40px; border-radius: 50%; overflow: hidden` to create a default avatar container shape, or does this over-constrain the slot? The trade-off: a container gives consumers a predictable fallback shape; without it, a raw `<img>` at the wrong size will break the attribution row layout. Current stance: no container — document the 40px expectation in the prop JSDoc and let consumers handle it.

3. **Hairline rule above figcaption: always on or prop-controlled?** The spec defines `border-top: var(--hairline-w) solid var(--hairline)` as always present on the figcaption. On a warm-accent or tinted surface this rule may not read correctly. Should the rule be a prop (`showRule?: boolean`) or always on? Current stance: always on — the rule is part of the canonical Quote anatomy, not a configurable option. Consumers who need to suppress it can use `className` override. This is an open question if Arian disagrees with "always on."
