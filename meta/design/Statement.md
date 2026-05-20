# Design spec: Statement

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-20

---

## 1. Purpose

`<Statement>` is the editorial brand-assertion block. It sets a passage in oversized Instrument Serif italic — `--fs-statement` (28–44px fluid) — as a deliberate pause in the page's visual rhythm. Where `<Hero>` opens a page with a structural heading and `<Pull>` accents an inline passage within body copy, Statement is a standalone declaration that interrupts the surface and asserts authorial voice. It appears once or twice per page surface, never deep inside a reading column.

### Explicit contrast with adjacent components

**Statement vs. Hero.** `<Hero>` is the page's display heading — it carries the `<h1>` (or `<h2>` via `titleAs`), owns the above-the-fold band, and is used once per page. Statement is not a heading; it emits no `<h1>`–`<h6>`. It is editorial content that belongs in the body of the page after the Hero has established context. A consumer who reaches for Statement to replace their `<h1>` is using the wrong component.

**Statement vs. Pull.** `<Pull>` is an inline editorial accent anchored to a reading column by a left rule, at a smaller scale (20–26px), and may appear multiple times on a single page. Statement is page-level: centered in the available column, no left rule, larger type (28–44px floor-to-ceiling), and functions as a brand assertion rather than a quotation. They must not look alike at first glance. Pull sharpens the reading flow; Statement stops it.

**Statement vs. Quote.** `<Quote>` is an attributed customer testimonial with identity (name, role, company). Statement carries no attribution by design — it is the author's voice, not a customer's. If attribution is required, reach for `<Quote>`.

**Non-goals.** Statement does not:

- Emit any heading element. It is editorial content.
- Own page structure. It does not participate in the document outline.
- Replace `<Hero>` for page openers.
- Accept an attribution line (use `<Quote>` for attributed voice).
- Manage its own outer spacing — the consuming surface owns margin above and below.

---

## 2. Anatomy

- **Root element**: `<div>` by default (`as="p"`). `<blockquote>` when `as="blockquote"`. Controlled by the `as` prop — see §3. The root is a flex column container with `gap: var(--space-4)` separating the statement `<p>` from the optional supporting `<p>`.

- **Statement paragraph**: always rendered as `<p className={styles.statement}>`. Typography: `--font-serif` (Instrument Serif), italic, `--fs-statement` (28–44px fluid), `line-height: 1.2`, `letter-spacing: -0.005em`, `color: --fg`, `text-wrap: balance`. The `statement` prop feeds this slot. Accepts `ReactNode` to support inline `<em>` or other inline markup within the passage.

- **Supporting paragraph** (optional): rendered as `<p className={styles.supporting}>` when the `supporting` prop is provided. Typography: `--font-sans` (Geist), `--fs-body` (17–19px fluid), `line-height: var(--lh-body)` (1.55), `color: --fg-muted`. This is a subordinate clarifying line — a sentence that contextualizes or expands the statement without repeating it.

- **Hairline rule** (optional): a `1px` top border in `--hairline` color, activated by `hairline={true}`. When present, the root also gains `padding-top: var(--space-12)` (48px) to create vertical breathing room between the rule and the statement text. The hairline is purely decorative — a structural visual anchor that grounds a Statement used mid-page after substantial whitespace.

---

## 3. The `as` prop — semantic intent

Statement follows the closed `as` pattern documented in `meta/conventions/polymorphic-props.md` §2. The valid values are `"p"` (default) and `"blockquote"`.

**Important:** the value `"p"` is the prop label for the default — it signals "this is a paragraph-register editorial statement." Internally the root renders as a `<div>` (not a literal `<p>`) because the component nests two `<p>` elements inside it and `<p>` cannot contain `<p>` in HTML. The prop value names the semantic intent, not the emitted element.

**`as="p"` (default):** Root is `<div>`. Use for all standard editorial assertions — a piece of authorial voice that is not quoting an external source. This is correct for the vast majority of use cases.

\*\*`as="blockquote"`: Root is `<blockquote>`. Use only when the statement text is a verbatim quotation from an attributed external source (a founder, a client, a document). When using `as="blockquote"`, consider whether `<Quote>` is a better fit — Quote adds an identity block and is specifically built for testimonials. Use `as="blockquote"` on Statement when you want the editorial scale and italic treatment but do not need the attribution identity row.

The `ref` is typed as `Ref<HTMLQuoteElement>` when `as="blockquote"` and `Ref<HTMLDivElement>` otherwise; the implementation casts appropriately.

---

## 4. Tokens used

No new tokens. Statement consumes only existing vocabulary.

| Token            | Value                                       | Role                                           |
| ---------------- | ------------------------------------------- | ---------------------------------------------- |
| `--font-serif`   | Instrument Serif stack                      | Statement paragraph font family                |
| `--font-sans`    | Geist stack                                 | Supporting paragraph font family               |
| `--fs-statement` | `clamp(1.75rem, 1.25rem + 2vw, 2.75rem)`    | Statement paragraph font size (28–44px fluid)  |
| `--fs-body`      | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Supporting paragraph font size (17–19px)       |
| `--lh-body`      | `1.55`                                      | Supporting paragraph line-height               |
| `--fg`           | `#1D1D1F`                                   | Statement paragraph color                      |
| `--fg-muted`     | `#6E6E73`                                   | Supporting paragraph color                     |
| `--hairline`     | `#D2D2D7`                                   | Hairline rule color                            |
| `--hairline-w`   | `1px`                                       | Hairline rule width                            |
| `--space-4`      | `1rem` (16px)                               | Gap between statement and supporting paragraph |
| `--space-12`     | `3rem` (48px)                               | Padding-top when hairline is active            |

**Why `--fs-statement` sits where it does.** The type scale has `--fs-body` (17–19px) below and `--fs-tagline-intimate` (32–52px) above. Statement at 28–44px occupies a distinct rung between article-scale headings and display headings: large enough to stop the eye and declare a voice, quiet enough not to compete with the Hero. The clamp keeps it in the same register at all viewport widths — the floor (28px) is large on mobile without feeling crowded; the ceiling (44px) is present on desktop without approaching the Hero's `--fs-tagline` territory.

---

## 5. Layout and rhythm

### Root container

| Property         | Value                                     | Notes                                                                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `display`        | `flex`                                    | Column flex container                                                                             |
| `flex-direction` | `column`                                  |                                                                                                   |
| `gap`            | `var(--space-4)`                          | 16px between statement `<p>` and supporting `<p>` when both are present                           |
| `margin`         | `0`                                       | Statement owns no block margin. The consuming surface controls spacing above and below.           |
| `border-top`     | `var(--hairline-w) solid var(--hairline)` | Present only when `hairline={true}`                                                               |
| `padding-top`    | `var(--space-12)`                         | Present only when `hairline={true}` — 48px breathing room between the rule and the statement text |

### Statement paragraph

| Property         | Value                 | Notes                                                                         |
| ---------------- | --------------------- | ----------------------------------------------------------------------------- |
| `font-family`    | `var(--font-serif)`   | Instrument Serif — the brand's editorial voice face                           |
| `font-style`     | `italic`              | All weights; italic is non-negotiable in this register                        |
| `font-size`      | `var(--fs-statement)` | 28–44px fluid                                                                 |
| `line-height`    | `1.2`                 | Tighter than body (1.55) — large italic serif sets best at tighter leading    |
| `letter-spacing` | `-0.005em`            | Slight optical tightening for headline-scale text; consistent with Hero title |
| `color`          | `var(--fg)`           |                                                                               |
| `margin`         | `0`                   | No default `<p>` margin — container gap handles spacing                       |
| `padding-bottom` | `0.04em`              | Optical correction for Instrument Serif's descender clipping at display scale |
| `text-wrap`      | `balance`             | Browser-native text balancing at headline scale — reduces orphan lines        |

### Supporting paragraph

| Property      | Value              | Notes                                                              |
| ------------- | ------------------ | ------------------------------------------------------------------ |
| `font-family` | `var(--font-sans)` | Geist — returns the voice register to prose after the serif accent |
| `font-size`   | `var(--fs-body)`   | 17–19px fluid — same scale as surrounding body copy                |
| `line-height` | `var(--lh-body)`   | 1.55 — canonical body line-height                                  |
| `color`       | `var(--fg-muted)`  | Muted — subordinate to the statement, not competing with it        |
| `margin`      | `0`                |                                                                    |

---

## 6. States and motion

**States.** Statement is a static typography component. No hover, active, focused, disabled, or loading states are defined. It introduces no interactive affordance.

**Motion.** None. Statement renders in place without entrance animation. Scroll-driven reveal (if desired by a surface) is the responsibility of the page composition layer, not of Statement itself. No `@keyframes`, no `transition`, no `animation` properties are in `Statement.module.css`.

**Reduced motion.** No reduced-motion override is needed because no animation is present.

---

## 7. Responsive behavior

`--fs-statement` is a fluid clamp and handles font-size scaling automatically across the full viewport range without a breakpoint override. The root container is full-width of whatever column the consumer places it in — Statement owns no `max-width`.

**Consuming context width convention.** Statement is most commonly placed inside a `<Section>` or a prose column bounded by `--hero-max` (38rem / 608px). The DS does not enforce this max-width on Statement itself — that is the consuming surface's responsibility. This keeps Statement composable in wide-column grid contexts where the prose max-width would be wrong.

**At `--bp-md` (768px) and above.** `--fs-statement` scales from its fluid interpolation. No layout change occurs. The gap, padding-top (when hairline), and supporting paragraph remain identical.

**Below `--bp-md`.** The floor of `--fs-statement` is `1.75rem` (28px). At 320px viewport this reads as a confident assertion — large relative to the 17px body copy but not overwhelming on a 320px column. `text-wrap: balance` prevents single-word last lines at all viewport widths.

---

## 8. Accessibility

**Statement emits no heading element.** The `statement` slot renders inside a `<p>` tag, not an `<h1>`–`<h6>`. Consumers must not use Statement as their page's `<h1>`. The page heading lives in `<Hero>`. Statement is editorial voice content — visually prominent but structurally inert in the document outline. A screen reader reading through the page will encounter Statement as a paragraph, not as a navigation landmark.

**`as="blockquote"`.** When the root is `<blockquote>`, screen readers announce it as a blockquote or quoted region. No additional ARIA is required. Consumers should only use `as="blockquote"` for verbatim external quotations — misusing it for authorial assertions misrepresents the content's origin to assistive technology users.

**Contrast ratios.**

| Pair                                       | Ratio     | Verdict   |
| ------------------------------------------ | --------- | --------- |
| `--fg` (#1D1D1F) on `--bg` (#FBFBFD)       | 16.29 : 1 | AAA       |
| `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) | 4.91 : 1  | AA normal |

`--fs-body` (17–19px) at `--fg-muted` is normal-weight text, so the 4.5:1 AA normal threshold applies. 4.91:1 passes. `--fs-statement` (28–44px) at `--fg` is large text — the 3:1 threshold applies, far exceeded at 16.29:1.

**Hairline rule.** The top border is decorative. No `aria-hidden` is required on a CSS border.

**Keyboard interaction.** None — Statement is not interactive. Links placed inside the `statement` or `supporting` slots by the consumer inherit the system focus ring from `tokens.css`.

---

## 9. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API
interface StatementProps extends Omit<ComponentPropsWithoutRef<"div">, "as"> {
  /** Editorial statement. Rendered in a <p>. Not a heading. Required. */
  statement: ReactNode;
  /** Optional clarifying line. Rendered in a <p>, muted sans-serif. */
  supporting?: ReactNode;
  /** Decorative 1px top rule + --space-12 padding-top. Default false. */
  hairline?: boolean;
  /**
   * Root element semantics.
   * "p" (default) → <div> root (cannot be <p> because it contains <p> children).
   * "blockquote" → <blockquote> root — use only for verbatim external quotations.
   */
  as?: "p" | "blockquote";
}
```

**Prop-by-prop intent:**

- `statement` — required. The primary editorial text. Renders inside `<p className={styles.statement}>`. Accepts `ReactNode` to support inline markup (`<em>`, `<strong>`). Must not be an empty string or a heading element — the DS does not validate this, but the spec prohibits it.

- `supporting` — optional. A subordinate clarifying sentence. Renders inside `<p className={styles.supporting}>` only when provided. Accepts `ReactNode`. When absent, the second paragraph is not emitted — no empty `<p>` in the DOM.

- `hairline` — optional boolean, default `false`. When `true`, adds `border-top: var(--hairline-w) solid var(--hairline)` and `padding-top: var(--space-12)` to the root. The hairline is a structural visual anchor, not a separator between content — it sits above the statement, not between the statement and the supporting line.

- `as` — optional, default `"p"`. Controls root element. `"p"` renders `<div>`; `"blockquote"` renders `<blockquote>`. The prop name `"p"` signals paragraph-register intent, consistent with the component's position in editorial prose flow. See §3 for full rationale. The engineer handles the `ref` type cast per the implementation pattern in `meta/conventions/polymorphic-props.md` §2.

- `className` — available via `Omit<ComponentPropsWithoutRef<"div">, "as">` spread. For layout overrides at the consumer layer. Statement has no margin of its own; the consumer positions it.

- Standard HTML attributes (`id`, `data-*`, `aria-*`) are spreadable via the base interface.

**What was not added and why:**

- `size` variant — Statement is one scale. If a consumer needs larger type, they are in `<Hero>` territory. If smaller, they are in `<Pull>` territory. One scale is the correct choice for a brand-assertion component that appears once or twice per page.
- `align` prop — Statement is always left-aligned, consistent with the editorial register. Center alignment is not in the Apple-adjacent brand vocabulary for body-level content (it is reserved for Hero with `align="center"` in specific landing contexts).
- `variant` prop — no serif/sans toggle. Statement is defined by Instrument Serif italic. Removing the italic would make it visually indistinguishable from a large `<Pull variant="sans">`. The italic is non-negotiable.

---

## 10. Worked examples

### (a) Minimal — statement only

```jsx
import { Statement } from "@poukai-inc/ui";

<Statement statement="Custom AI builds. Automations. Advisory engagements." />;
```

Renders a single italic-serif paragraph at 28–44px. No supporting line, no hairline.

### (b) With supporting line

```jsx
import { Statement } from "@poukai-inc/ui";

<Statement
  statement={
    <>
      Custom AI builds. <em>Automations.</em> Advisory engagements.
    </>
  }
  supporting={<>For teams who&rsquo;d rather ship than speculate.</>}
/>;
```

The supporting line renders in muted Geist below the statement, separated by `--space-4`.

### (c) Full variant — hairline + supporting

```jsx
import { Statement } from "@poukai-inc/ui";

<Statement
  hairline
  statement={
    <>
      Custom AI builds. <em>Automations.</em> Advisory engagements.
    </>
  }
  supporting={<>For teams who&rsquo;d rather ship than speculate.</>}
/>;
```

The hairline rule and 48px padding-top ground the Statement visually when placed mid-page after a content section.

### (d) Blockquote semantics — verbatim external quotation

```jsx
import { Statement } from "@poukai-inc/ui";

<Statement
  as="blockquote"
  statement={
    <>
      Custom AI builds. <em>Automations.</em> Advisory engagements.
    </>
  }
  supporting={<>For teams who&rsquo;d rather ship than speculate.</>}
/>;
```

Root is `<blockquote>`. Use only for verbatim quotations from an external source. For authorial assertions, use the default `as="p"`.

---

## 11. Composition rules

- **Statement composes inside `<Section>` or a prose column.** It is not page-opening content. It follows a Hero and accompanies body content.
- **Do not nest Statement inside `<Hero>`.** Hero owns the page's display moment; Statement is a mid-page editorial assertion.
- **Do not compose Statement with `<Pull>` on the same surface section.** They occupy different scopes (page-level vs. paragraph-level) and using both in close proximity creates visual hierarchy confusion. On a single page, use Statement for the one brand assertion and Pull for inline accents.
- **Statement does not compose with `<Quote>`.** Quote is a testimonial with identity; Statement is authorial voice. Use them on different page sections.
- **Hairline placement.** The hairline is most useful when Statement follows a substantial block of content and the whitespace alone is insufficient to signal the transition. Do not use the hairline when Statement opens a section — it creates a visual non-sequitur (a rule with nothing above it).
- **Use Statement once or twice per surface.** More than two uses per page dilutes the impact. Each instance should feel like a deliberate pause, not a repeating pattern element.

---

## 12. Out of scope

- **Heading semantics.** Statement will not emit `<h1>`–`<h6>`. Consumers who need a visually prominent heading use `<Hero>` or a heading element directly.
- **Attribution row.** A named person attribution (avatar, name, role) is `<Quote>`'s domain. Statement carries no attribution slot.
- **`size` variant.** One scale only. Rationale in §9.
- **`align` prop (center / right).** Left alignment is the brand convention for editorial content at this layer. Not introduced.
- **Entrance animation.** Statement is static typography. Scroll-driven reveals are the surface layer's responsibility.
- **Per-component dark-mode override.** `--fg`, `--fg-muted`, `--hairline`, and `--font-serif` all flip cleanly via the global dark-mode token block in `tokens.css`. No Statement-specific override is needed.
- **`max-width` on the root.** Statement does not own its column width — the consuming surface does. Introducing a default `max-width` would break wide-column grid compositions.
