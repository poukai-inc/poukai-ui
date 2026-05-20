# Design spec: RoleCard

**Atomic layer**: molecule
**Status**: Shipped in v0.1.0
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Status

Shipped in v0.1.0. Grid overlap bug fixed in v0.3.2 (a `min-height` percentage was resolving against an undefined parent height in some grid contexts, causing second-row cards to overflow into the first row — removed). `--fs-card-title` token added and RoleCard migrated in v0.16.0 (consistency audit — the card title clamp was previously duplicated inline). `--lh-body` token added and wired in v0.17.0 (replacing inline `1.55` literal).

---

## 2. Purpose & non-goals

`<RoleCard>` is the card recipe for the `/roles` surface. It presents a named operator role — Builder, Automator, Educator, Creator — as a surface + hairline + radius-3 card with an optional icon slot, an eyebrow label, an editorial Instrument Serif title, body copy, and an optional "hired by" footer. It is the only card variant in the DS that uses the serif card-title rung.

**Differentiating RoleCard from FeatureCard.** `FeatureCard` is a product feature callout — it has a tagline, a short body, and a `<LinkCard>`-style call-to-action href that makes the entire card interactive. RoleCard is informational and never interactive — it has no `href`, no hover state, no click handler. RoleCard is editorial; FeatureCard is navigational.

**Differentiating RoleCard from LinkCard.** `LinkCard` is a navigational primitive — its root is an `<a>` element and the entire card surface is a link target. RoleCard is an `<article>` — a non-interactive, self-contained content block. They are structurally different at the root.

**Non-goals:**

- RoleCard is not interactive. No `href`, no `onClick`, no hover/focus states on the card surface.
- RoleCard does not manage its grid layout. The caller arranges multiple RoleCards in a grid (the `/roles` page uses a 4-column grid with `gap: --space-6`).
- RoleCard does not import or ship icons. The `icon` slot accepts any ReactNode — the caller passes a Lucide glyph, a branded SVG, or `null`. The DS never re-exports icon libraries.
- RoleCard does not enforce eyebrow or title copy format. The caller provides the strings.

---

## 3. Anatomy

- **Root element**: `<article>` — `display: flex; flex-direction: column; padding: var(--space-8); background: var(--surface); border: var(--hairline-w) solid var(--hairline); border-radius: var(--radius-3); color: var(--fg)`. `<article>` is correct because each card is a self-contained editorial unit — a named role with its description. Screen readers expose `<article>` elements in the landmark list as "article."
- **Icon container** (optional): `<span className={styles.icon} aria-hidden="true">` — 44px × 44px square, `border-radius: var(--radius-2)` (4px), `background: var(--bg)`, `border: var(--hairline-w) solid var(--hairline)`. The icon box has a lighter background (`--bg`) than the card surface (`--surface`) — this creates a subtle elevation recession: the card surface recedes from the page, and the icon box reads as flush with the page. `margin: 0 0 var(--space-6)` pushes the eyebrow down. `aria-hidden="true"` wraps the icon — icons passed by callers should themselves be `aria-hidden` if decorative; this wrapper provides a safety net but does not replace correct per-icon labeling by the caller.
- **Eyebrow**: `<p className={styles.eyebrow}>` — Geist Mono, `--fs-micro` (12px), `letter-spacing: var(--tracking-eyebrow)` (0.06em), `text-transform: uppercase`, `color: var(--fg-muted)`, `margin: 0 0 var(--space-2)`. Note: the eyebrow uses `--font-mono` (Geist Mono), not `--font-sans`. This distinguishes the role label (`"Role 01"`, `"Role 02"`) as a reference code — a mono numeric label — rather than a prose phrase. This is the same treatment as `FailureMode`'s index element.
- **Title**: `<h3 className={styles.title}>` — Instrument Serif, weight 400, `--fs-card-title` (24–32px fluid), `line-height: 1.15`, `letter-spacing: -0.005em`, `color: var(--fg)`, `margin: 0 0 var(--space-4)`, `padding-bottom: 0.04em` (optical descender correction).
- **Body**: `<p className={styles.body}>` — Geist sans-serif, `--fs-body` (17–19px), `line-height: var(--lh-body)` (1.55), `color: var(--fg)`, `margin: 0`, `text-wrap: pretty`.
- **Hired-by footer** (optional): `<p className={styles.hiredBy}>` — rendered only when the `hiredBy` prop is provided. Geist sans-serif, `--fs-meta` (14px), `color: var(--fg-muted)`, `border-top: var(--hairline-w) solid var(--hairline)`, `padding-top: var(--space-4)`, `margin-top: auto`. The `margin-top: auto` in a flex column pushes the footer to the bottom of the card regardless of body copy length — cards in the same grid row align their footers at the same vertical position.

---

## 4. Props API

```tsx
interface RoleCardProps extends Omit<ComponentPropsWithoutRef<"article">, "title"> {
  eyebrow: ReactNode;   // required — e.g. "Role 01"
  title: ReactNode;     // required — e.g. "Builder"
  body: ReactNode;      // required — descriptive body copy
  hiredBy?: ReactNode;  // optional — companies that hire this role
  icon?: ReactNode;     // optional — decorative icon (Lucide glyph, SVG, etc.)
}
```

**`eyebrow`** (ReactNode, required): The role label — idiomatic values are `"Role 01"`, `"Role 02"`, etc. `ReactNode` rather than `string` to allow inline marks, though plain string is the expected usage. Rendered in the mono-uppercase micro register.

**`title`** (ReactNode, required): The role name — `"Builder"`, `"Automator"`, `"Educator"`, `"Creator"`. Rendered in Instrument Serif at the card-title scale. `ReactNode` rather than `string` for the same reason. The prop is named `title` (not `heading`) to align with `FailureMode.title` and `Principle.title` — the system uses `title` consistently for the primary named element of a content card. The base `ComponentPropsWithoutRef<"article">` is `Omit`'d for the `"title"` key to avoid a type conflict with the HTML `title` attribute.

**`body`** (ReactNode, required): The descriptive body copy. In practice a short sentence or two. `ReactNode` accepted; plain text is idiomatic.

**`hiredBy`** (ReactNode, optional): A short list of companies — e.g. `"Anthropic · Vercel · Stripe"`. Rendered in the muted footer with a hairline rule above. When omitted, no footer element is rendered and the card has no bottom rule. The prop accepts `ReactNode` so callers can pass styled company names if needed, but the plain dot-separated string is the canonical format.

**`icon`** (ReactNode, optional): A decorative icon slotted into the 44×44px icon box. The DS does not specify which icon to use — callers pass a Lucide glyph at `size={24}` (recommended) or `size={28}`. When omitted, no icon box is rendered. Pass `aria-hidden="true"` on the icon itself if it is decorative (typical). The surrounding `<span aria-hidden="true">` wrapper provides a fallback but is not a substitute for proper icon labeling when the icon carries meaning.

**Standard HTML spread** (`ComponentPropsWithoutRef<"article">`, `"title"` omitted): `id`, `data-*`, `className`, `style`, event handlers forwarded to the root `<article>`. `className` merges via `clsx`.

---

## 5. Token contract

| Token             | Value                                       | Role                                               |
| ----------------- | ------------------------------------------- | -------------------------------------------------- |
| `--surface`       | `#F5F5F7`                                   | Card background                                    |
| `--bg`            | `#FBFBFD`                                   | Icon box background (lighter than surface)         |
| `--fg`            | `#1D1D1F`                                   | Title, body text, icon color                       |
| `--fg-muted`      | `#6E6E73`                                   | Eyebrow color, hiredBy color                       |
| `--hairline`      | `#D2D2D7`                                   | Card border, icon box border, hiredBy top rule     |
| `--hairline-w`    | `1px`                                       | All border widths                                  |
| `--radius-3`      | `8px`                                       | Card corner radius                                 |
| `--radius-2`      | `4px`                                       | Icon box corner radius                             |
| `--font-serif`    | Instrument Serif                            | Title typeface                                     |
| `--font-sans`     | Geist stack                                 | Body, hiredBy typeface                             |
| `--font-mono`     | Geist Mono stack                            | Eyebrow typeface                                   |
| `--fs-card-title` | `clamp(1.5rem, 1.15rem + 1.2vw, 2rem)`     | Title font-size (24–32px)                          |
| `--fs-body`       | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Body font-size (17–19px)                           |
| `--fs-meta`       | `0.875rem` (14px)                           | hiredBy font-size                                  |
| `--fs-micro`      | `0.75rem` (12px)                            | Eyebrow font-size                                  |
| `--tracking-eyebrow` | `0.06em`                                 | Eyebrow letter-spacing                             |
| `--lh-body`       | `1.55`                                      | Body line-height                                   |
| `--space-2`       | `0.5rem` (8px)                              | Eyebrow → title gap                                |
| `--space-4`       | `1rem` (16px)                               | Title → body gap; hiredBy padding-top              |
| `--space-6`       | `1.5rem` (24px)                             | Icon → eyebrow gap                                 |
| `--space-8`       | `2rem` (32px)                               | Card padding (all sides)                           |

**Icon box dimensions (44px) are not tokenized.** A BACKLOG item notes the follow-up to tokenize this value or reference `--btn-h-md` (44px). As shipped, `width: 44px; height: 44px` are inline values in `RoleCard.module.css`.

---

## 6. States & motion

**Static.** RoleCard has no interactive states and no motion. It is a display card.

No hover, focus, active, or disabled states are defined on the card surface. If a future variant needs to be interactive (e.g. clickable for more detail), that is a new component — not an extension of RoleCard. See non-goals.

---

## 7. Responsive behavior

RoleCard itself has no responsive breakpoint logic. Its internal layout is a single vertical flex column at all widths. Width is determined entirely by the grid container the caller provides.

The canonical caller layout is a 4-column grid (`gridTemplateColumns: "repeat(4, 1fr)"`, `gap: var(--space-6)`). Callers are responsible for collapsing this to 2 or 1 column on narrow viewports. A single RoleCard at narrow viewport widths (`≥200px`) renders correctly — the `--fs-card-title` fluid scale and `text-wrap: pretty` on the body handle content reflow without overflow.

---

## 8. A11y

- Root element is `<article>` — a sectioning content element exposed as "article" in the landmark list by screen readers. Each card is an independent, self-contained editorial unit. The `<h3>` title inside the article provides the accessible name for the article landmark in implementations that support this (most do).
- The icon wrapper has `aria-hidden="true"`. Icons passed by callers that are purely decorative should also carry `aria-hidden="true"` on the icon element itself.
- Eyebrow is a `<p>` — not a heading. The role label (`"Role 01"`) is metadata, not document structure. Using `<p>` rather than `<h2>` or an ARIA heading avoids inflating the heading outline.
- Title is `<h3>`. On the `/roles` page, the page `<h1>` is the section title ("Roles" or equivalent). Each role card is a subsection headed by `<h3>` — a reasonable heading hierarchy assuming the page `<h2>` is owned by a `<Section>` wrapper. Callers that use RoleCard in a context with a different heading hierarchy may need to override via a polymorphic heading prop — this is not currently supported (open question: see §10).
- Contrast:
  - Title (`--fg` on `--surface`): `#1D1D1F` on `#F5F5F7` = **15.46:1** (AAA)
  - Body (`--fg` on `--surface`): same = **15.46:1** (AAA)
  - Eyebrow/hiredBy (`--fg-muted` on `--surface`): `#6E6E73` on `#F5F5F7` = **4.66:1** (AA normal at 14px ✓)
- No keyboard interaction on the card. If the card becomes interactive in a future variant, keyboard handling is required.

---

## 9. Worked examples

### (a) Single card — canonical

```jsx
import { RoleCard } from "@poukai-inc/ui";
import { Hammer } from "lucide-react";

<RoleCard
  icon={<Hammer aria-hidden size={24} />}
  eyebrow="Role 01"
  title="Builder"
  body="Ships production systems end-to-end. Comfortable in the codebase from day one; closes the loop between design intent and what runs in prod."
  hiredBy="Anthropic · Vercel · Stripe"
/>
```

### (b) Four-up grid — `/roles` page recipe

```jsx
import { RoleCard } from "@poukai-inc/ui";
import { Hammer, Bot, BookOpen, Sparkles } from "lucide-react";

const roles = [
  { eyebrow: "Role 01", title: "Builder",   icon: <Hammer aria-hidden size={24} />,   body: "…", hiredBy: "Anthropic · Vercel · Stripe" },
  { eyebrow: "Role 02", title: "Automator", icon: <Bot aria-hidden size={24} />,      body: "…", hiredBy: "Linear · Notion" },
  { eyebrow: "Role 03", title: "Educator",  icon: <BookOpen aria-hidden size={24} />, body: "…", hiredBy: "Shopify · Figma" },
  { eyebrow: "Role 04", title: "Creator",   icon: <Sparkles aria-hidden size={24} />, body: "…", hiredBy: "Arc · Raycast" },
];

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "var(--space-6)",
  }}
>
  {roles.map((r) => (
    <RoleCard key={r.title} {...r} />
  ))}
</div>
```

### (c) Without icon or hiredBy

```jsx
<RoleCard
  eyebrow="Role 01"
  title="Builder"
  body="Ships production systems end-to-end."
/>
```

Both `icon` and `hiredBy` are optional. The card renders cleanly without either.

---

## 10. Open questions

One open question: **heading level for `title`.** The title is hardcoded as `<h3>`. This works correctly on the `/roles` page (where `<h1>` is the page title and a `<Section>` provides an implicit `<h2>` level). If RoleCard is used on a page with a different heading hierarchy — e.g. inside a Section that is itself a subsection — the `<h3>` may not be at the correct level. A `titleAs` prop (accepting `"h2" | "h3" | "h4"`) would make RoleCard more portable. This mirrors the `titleAs` pattern used in `Hero`. Not a bug on the current surface, but worth addressing before RoleCard is used outside `/roles`.
