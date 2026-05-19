# Design spec: Avatar

**Atomic layer**: atom
**Status**: Draft
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<Avatar>` is the canonical small-scale person-representation atom. It renders a single person's identity mark — either a photograph, a short initials string, or a neutral placeholder — inside a consistently-shaped and consistently-sized disk or rounded square. It is the piece that makes `<Quote>`'s `avatar` slot concrete and consistent, and it is the natural building block for `<TeamCard>` and any future small attribution surfaces (comments rows, user lists, author bylines).

Avatar's job is strictly presentational. It does not fetch user data, derive initials from a name, animate state changes, or carry interactive affordances of its own. It is content — a small face on a surface — not a control.

### Distinction from siblings

Avatar must be understood in contrast to two components that visually overlap with it in surface area or semantic register:

**Avatar vs. Portrait.** Portrait is an editorial photography primitive: full-format figural photographs in fixed aspect ratios (1:1, 3:4, 4:3…), with AVIF/WebP srcset generation, CLS prevention, and a non-decorative alt contract enforced at runtime. Portrait renders at the scale of a content block — a founder photograph in a section, a press headshot in a grid. Avatar renders at attribution scale: 24–40px, circular, used inline. They serve entirely different page moments and must not be swapped. If a surface needs a photograph at card or section scale, use Portrait. If a surface needs a face in a text row, use Avatar.

**Avatar vs. Wordmark.** Wordmark is the brand mark — SVG path geometry, not a person. They share the atom layer but have no conceptual overlap.

### Non-goals (explicit exclusions)

- Avatar does not derive initials from a `name` string. The consumer passes the literal initials value. This avoids locale assumptions, display-name formatting, and multi-word edge cases (hyphenated surnames, mononyms, honorifics). The DS does not know what two letters represent a person best; the consumer does.
- Avatar does not render a status indicator dot, presence badge, or notification count. Any such decoration is the consumer's composition responsibility.
- Avatar does not support group/stack composition (an overlapping row of multiple avatars). That is a molecule-level concern if it ever warrants a primitive.
- Avatar is not interactive. It has no click handler, no hover state, no focus ring of its own.
- Avatar does not ship a skeleton/loading state. The placeholder disk (empty mode) is the resting state when no data has arrived — it is not animated.

---

## 2. Anatomy

Avatar has three rendering modes, mutually exclusive, evaluated in priority order:

### Mode 1 — Image

**Condition:** `src` prop is provided.

A standard `<img>` element, constrained to the disk or rounded-square shape by `border-radius` on the root container, with `overflow: hidden` clipping the image to the shape. The `<img>` fills the container with `object-fit: cover` and `object-position: center` so faces are not distorted.

`alt` is a documented requirement when `src` is provided. The spec cannot enforce a discriminated union at runtime for all consumers, but the prop intent (§8) makes this explicit and the accessibility section (§7) explains the contract.

When `src` is provided and `initials` is also provided, image wins. The DS does not fall back to initials when the image is loading or broken — broken-image browser rendering is the fallback. A future revision may add an `onError` fallback mechanism; it is explicitly out of scope here.

### Mode 2 — Initials

**Condition:** `src` is not provided, `initials` is provided.

A `<span>` root containing a centered `<span>` text node. The background is `--surface` (a recessed neutral disk — see §3 for rationale). The text is rendered in `--font-sans`, `--fs-micro` (12px), font-weight 500, color `--fg-muted`. The initials string is truncated to 3 characters maximum by the CSS module (`overflow: hidden; text-overflow: clip; white-space: nowrap`); the DS does not truncate the prop value in JS.

The consumer is responsible for passing an appropriate 1–3 character string. The DS does not validate the string length beyond the CSS truncation safety net.

### Mode 3 — Empty placeholder

**Condition:** Neither `src` nor `initials` is provided.

A plain disk or rounded square in `--surface` with no text. Acts as a neutral placeholder when consumer data has not arrived or when the person has no image and no known initials. Not animated.

---

## 3. Tokens used

No new tokens are introduced. Avatar is built entirely from the existing vocabulary.

| Token          | Value            | Role                                                                                |
| -------------- | ---------------- | ----------------------------------------------------------------------------------- |
| `--surface`    | `#F5F5F7`        | Background for initials and empty modes — recessed neutral disk                     |
| `--fg-muted`   | `#6E6E73`        | Initials text color — muted, not assertive; the face is the signal, not the letters |
| `--fg`         | `#1D1D1F`        | Used for `aria-label` labeling only; no direct rendering role                       |
| `--hairline`   | `#D2D2D7`        | Optional hairline ring (see §3.1 below)                                             |
| `--hairline-w` | `1px`            | Ring width                                                                          |
| `--radius-1`   | `2px`            | Border-radius for `shape="square"` — the DS's minimum radius; never a hard corner   |
| `--font-sans`  | Geist stack      | Initials typeface                                                                   |
| `--fs-micro`   | `0.75rem` (12px) | Initials font size. Fixed, not fluid — avatar size is fixed px, not responsive      |

### 3.1 Hairline ring decision

Avatar renders a `1px` ring using `box-shadow: 0 0 0 1px var(--hairline)` in all three modes. Rationale: without a ring, a light-background initials disk (`--surface: #F5F5F7` on a `--bg: #FBFBFD` page) has a contrast ratio of approximately 1.7:1 — invisible. The hairline ring provides quiet but clear spatial separation from the page background. This is consistent with how the DS uses `--hairline` as its boundary signal (dividers, table rules, `<FieldNote>` left rule). The ring is non-decorative in function (it is a shape boundary) but decorative in WCAG terms (it is not text). It does not require a contrast check.

`box-shadow` rather than `border` is used so the ring does not add to the element's layout box dimensions. A `border` of `1px` on a `32px` box would change the effective content area; `box-shadow` does not.

### 3.2 Initials background: `--surface` over alternatives

Three candidates were considered for the initials background:

- **`--surface` (`#F5F5F7`)** (chosen). The recessed neutral. It is the correct register for "content that exists in the background of a row" — the same surface used for code blocks and inline keys. Quiet, not a color statement, palette-safe.
- **`--accent-glow` (`rgba(0,113,227,0.18)`)**: Would read as a brand highlight or interactive affordance. Avatar is passive content — accent-register backgrounds imply a selected or active state. Rejected.
- **A per-person color hash**: Consumer-generated background colors (common in product avatar systems) are outside the DS's brand contract. The DS palette is fixed by `meta/brand.md`. Generating colors from name strings would produce values outside the validated palette. Rejected.

### 3.3 Size tokens: inline px, not new tokens

The three size values — 24px (sm), 32px (md), 40px (lg) — are implemented as inline CSS custom properties inside the Avatar CSS module using a `data-size` attribute selector pattern (or equivalent class-per-size approach). They are NOT new tokens in `tokens.css`.

Rationale: the DS has a button height ladder (`--btn-h-sm`, `--btn-h-compact`, `--btn-h-md`, `--btn-h-lg`) because those heights are shared across multiple future form elements. Avatar sizes are not shared with any other current or planned primitive — there is no alignment constraint that requires them to be global tokens. A `--avatar-sm` token that is only ever consumed by `Avatar` is token vocabulary overhead without benefit. If a future `UserRow` molecule or similar needs to align to Avatar's sizing, that is the moment to tokenize.

---

## 4. Layout & rhythm

### Root element (`<span>`)

Avatar's root is `display: inline-flex`. It is an inline atom — it participates in text flow and flexbox attribution rows without requiring a wrapper block element.

| Property          | Value (md default)                          | Notes                                                                                 |
| ----------------- | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `display`         | `inline-flex`                               | Inline participation; flex children center correctly                                  |
| `align-items`     | `center`                                    | Vertical centering of initials or image                                               |
| `justify-content` | `center`                                    | Horizontal centering of initials                                                      |
| `width`           | `32px` (md) / `24px` (sm) / `40px` (lg)     | Fixed. Not responsive. See §7 for responsive note.                                    |
| `height`          | Same as width                               | Avatar is always square in geometry before border-radius rounds it                    |
| `border-radius`   | `50%` (circle) / `var(--radius-1)` (square) | Shape is controlled by the `shape` prop                                               |
| `overflow`        | `hidden`                                    | Clips the `<img>` to the circle or square shape                                       |
| `flex-shrink`     | `0`                                         | Prevents the avatar from shrinking in flex attribution rows (e.g. Quote's figcaption) |
| `box-shadow`      | `0 0 0 var(--hairline-w) var(--hairline)`   | Hairline ring — see §3.1. Applied at all three modes.                                 |
| `background`      | `var(--surface)` when no `src`              | Initials and empty modes only. Image mode: `transparent` (image fills the container)  |
| `user-select`     | `none`                                      | Prevents accidental text selection of initials on long-press / double-click           |

### `<img>` inside image mode

| Property          | Value    | Notes                                                |
| ----------------- | -------- | ---------------------------------------------------- |
| `display`         | `block`  | Removes inline baseline gap beneath the image        |
| `width`           | `100%`   | Fills the root span                                  |
| `height`          | `100%`   | Fills the root span                                  |
| `object-fit`      | `cover`  | Fills the disk without distortion; crops at center   |
| `object-position` | `center` | Default center crop; not overridable in this version |

### Initials `<span>` (inner)

| Property         | Value                    | Notes                                                                                                                                                                                                                  |
| ---------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `font-family`    | `var(--font-sans)`       | Geist — consistent with all meta-register text                                                                                                                                                                         |
| `font-size`      | `var(--fs-micro)` (12px) | Same across all three sizes — the disk shrinks, not the type. Exception: sm (24px) at 12px is tight but still legible for 1–2 characters. If a consumer passes 3 characters in sm, they accept the visual compression. |
| `font-weight`    | `500`                    | Slightly heavier than regular for legibility at micro scale                                                                                                                                                            |
| `color`          | `var(--fg-muted)`        | Muted — initials are a fallback, not a feature                                                                                                                                                                         |
| `line-height`    | `1`                      | Removes vertical rhythm artifact from the line box; flex centering handles placement                                                                                                                                   |
| `letter-spacing` | `0.03em`                 | Slight open-tracking aids legibility at 12px fixed size                                                                                                                                                                |
| `pointer-events` | `none`                   | Prevents text cursor on hover (initials are not selectable)                                                                                                                                                            |

---

## 5. States & motion

### States

Avatar is a non-interactive content atom. No hover, focus, active, or disabled states are defined at the component level.

The three rendering modes (image / initials / empty) are not "states" in the interactive sense — they are determined at render time by which props are provided. There is no animated transition between modes.

**Image loading.** The `<img>` element uses `loading="lazy"` by default (see §6). During the browser's lazy-load deferral, the root span shows its `--surface` background through the `<img>`. This provides a quiet placeholder without additional complexity. There is no explicit skeleton shimmer or fade-in animation — the browser's native image rendering handles the paint, which is consistent with how `<Portrait>` handles loading.

**Image error.** When an image fails to load (`<img>` fires `onerror`), the browser renders the broken-image fallback. Avatar does not intercept this. The `--surface` background of the root span will be visible behind the broken image indicator. This is acceptable for v1. A `fallbackToInitials` mechanism is deferred — see §10.

### Motion

None. Avatar is a static presentational atom. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` covers the entire system; Avatar requires no component-level reduced-motion handling.

---

## 6. Image loading

`loading="lazy"` is the default for the `<img>` element in image mode. This is the correct default for attribution-row avatars: they appear below the fold in most consumer contexts (`<Quote>` on a page with a `<Hero>` above). Lazy loading defers network cost until the avatar is near the viewport.

The consumer can pass `loading="eager"` via the spread mechanism if needed — for example, above-the-fold team grids where all avatars are visible on page load.

`fetchPriority` is intentionally not exposed as a prop in this version. Attribution-scale avatars are never the LCP element. If a consumer needs `fetchpriority="high"`, they can pass it via `...rest` spread onto the root (but Avatar's `<img>` is internal — the spread targets the outer `<span>`). This is documented in §10 as an open question.

---

## 7. Accessibility

### Root element is `<span>`, not `<img>`

Avatar's root is a `<span>` with `role="img"` when a meaningful accessible name is available (from `alt` in image mode, or from `name` in initials/empty modes). When no accessible name is provided, the root carries `aria-hidden="true"` — the component is treated as decorative.

This structure supports the two primary use cases cleanly:

1. **Inside `<Quote>` (decorative).** The `<Quote>` attribution row already names the person via the `name` prop. The avatar is redundant information. The consumer should pass `Avatar` without `name`, which results in `aria-hidden="true"`. This correctly marks it decorative, consistent with the guidance in `Quote.md §7` ("When the consumer passes an `<img>`, its `alt` attribute should be `''` (empty, marking it decorative) because the person is already named in the attribution row").

2. **Standalone / non-decorative.** In a `<TeamCard>` or user list where the avatar carries identity information not supplied by surrounding text, the consumer passes `name="Arian Zargaran"`. This becomes `aria-label="Arian Zargaran"` on the root span, giving the avatar a meaningful accessible name.

### Image mode: `alt` handling

When `src` is provided:

- If `alt` is a non-empty string, the inner `<img>` receives that `alt`. The root `<span>` receives `role="img"` and `aria-label={alt}` — or alternatively, the root span is `aria-hidden="true"` and the `<img>` carries the full accessible description alone (the engineer should choose the simpler of the two and document the choice in the implementation).
- If `alt=""` (explicitly empty, consumer-declared decorative), the `<img>` carries `alt=""` and the root span carries `aria-hidden="true"`.
- If `alt` is absent and `name` is provided, the root span carries `aria-label={name}` and `role="img"`.
- If both `alt` and `name` are absent with `src` provided, the component is treated as decorative: root `aria-hidden="true"`, `<img alt="">`.

The consumer's responsibility is clear: if the avatar conveys non-redundant identity information, provide either `alt` (image mode) or `name` (initials/empty mode). If the identity is provided by surrounding text (as in `<Quote>`), omit both.

### Initials mode: contrast

Initials text: `--fg-muted` (`#6E6E73`) on `--surface` (`#F5F5F7`).

Contrast: 4.66:1 — AA normal (threshold 4.5:1). Passes at 12px. This is the tightest pairing in the system at this size. It is at the threshold, not comfortably above it.

Rationale for accepting this: initials are a fallback, not load-bearing content. The person's identity is always conveyed by the `name` accessible label or surrounding text (the `<Quote>`'s `name` attribution). The initials letters are visual confirmation for sighted users who already know the person — they are not the primary identifier. The AA threshold is met; AAA is not required.

If Arian disagrees with this trade-off, the alternative is `--fg` (`#1D1D1F`) on `--surface` — contrast 15.46:1 (AAA) — at the cost of the initials reading heavier than the surrounding attribution text, which would give the fallback display false prominence.

### Keyboard interaction

Avatar is not focusable. It has `tabIndex` not set (or `tabIndex={-1}` if the engineer finds it cleaner). Interactive wrappers (e.g. a linked avatar in a team card) are the consumer's responsibility — the link element wraps Avatar; Avatar does not become a button or link itself.

---

## 8. Prop intent

```tsx
// INTENT ONLY — engineer designs the actual API

/**
 * Image-mode variant: src provided.
 */
interface AvatarImageProps {
  src: string;
  /** Alt text for the image. Required when src is provided and the avatar is not decorative.
   *  Pass alt="" (empty string) to explicitly mark as decorative (e.g. inside <Quote> where
   *  the person's name is already in the attribution row). */
  alt?: string;
  initials?: never;
}

/**
 * Initials-mode variant: no src, initials provided.
 */
interface AvatarInitialsProps {
  src?: never;
  alt?: never;
  /** 1–3 character string. Consumer provides the literal string — the DS does not
   *  derive initials from a name. Examples: "AZ", "SC", "J". */
  initials: string;
}

/**
 * Empty-mode variant: neither src nor initials provided.
 */
interface AvatarEmptyProps {
  src?: never;
  alt?: never;
  initials?: never;
}

interface AvatarBaseProps extends ComponentPropsWithoutRef<"span"> {
  /** Optional accessible name. Used as aria-label on the root span when provided.
   *  If not provided and alt is also not provided, the component is aria-hidden (decorative).
   *  Use inside <Quote> without name — the Quote component's own name attribution makes
   *  the avatar decorative. Use standalone (TeamCard, user list) with name. */
  name?: string;
  /** Three sizes. sm=24px, md=32px (default), lg=40px.
   *  Sizes are fixed px values — avatars do not reflow. */
  size?: "sm" | "md" | "lg";
  /** Circle (default) or square with --radius-1 corner. */
  shape?: "circle" | "square";
}

type AvatarProps = AvatarBaseProps & (AvatarImageProps | AvatarInitialsProps | AvatarEmptyProps);
```

**Root element: `<span>`, not polymorphic.**

`<span>` is the correct inline root for an atom that participates in flex attribution rows and inline text contexts. It is not `<div>` (block, wrong inline participation), not `<img>` (the `<img>` is internal), not `<button>` or `<a>` (Avatar is not interactive). The root is non-polymorphic — there is no valid alternative root element for this component's purpose.

**Discriminated union prop intent.**

The prop intent above uses a TypeScript discriminated union (with `never`) to express the three modes. This is the correct engineer target: `src` and `initials` are mutually exclusive at the type level; a consumer cannot pass both. The engineer may simplify to a flat interface with optional `src`, `alt`, and `initials` if the discriminated union produces error messages that are unhelpful in practice. The intent is the mutual exclusivity — the implementation form is the engineer's call.

**`alt?: string` when `src` is provided — not required at the type level.**

The type permits `alt` to be omitted even when `src` is provided, because the decorative case (`alt=""`) and the named case (`name="..."`) are both valid alternatives. Requiring `alt` as a non-empty string (like `Portrait` does) would prevent the valid decorative usage inside `<Quote>`. The contract is documented via JSDoc, not enforced via `NonNullable<string>`.

**`size?: "sm" | "md" | "lg"` — three rungs only.**

No `xl`. Attribution-scale avatars do not need a fourth size. If a 48px or 56px avatar is needed (e.g. a profile header), use `Portrait` at a small aspect ratio — that is its domain.

**`forwardRef<HTMLSpanElement, AvatarProps>`, `displayName`, `clsx`.**

Consistent with `StatusBadge`, `Wordmark`, and all atoms in the DS. The forwarded ref targets the root `<span>`.

**What was trimmed:**

- `objectPosition` prop — the `<img>` inside Avatar uses `object-position: center`. Exposing this as a consumer prop was considered (by analogy with Portrait) and rejected: Avatar is a small fixed-size crop and center is the only correct default. No consumer should need to adjust crop position on a 32px circle. Deferred to a future revision if a specific need arises.
- `onError` / `fallbackToInitials` — deferred to v2. See §10.
- `loading` prop — `loading="lazy"` is the default; the consumer can override via `...rest` spread onto the outer span. But `<img>` is internal. The engineer may expose `imgLoading?: "lazy" | "eager"` if they determine this is a common need. Not specified here — see §10.
- `color` or `colorScheme` prop for per-person initials background — explicitly rejected. See §3.2.

---

## 9. Composition rules

- **Inside `<Quote>`.** Pass `<Avatar>` in the `avatar` slot. Size `md` (32px) or `lg` (40px) — Quote's attribution row specifies `align-items: center` against approximately 32px of name+role column height; `md` and `lg` both align correctly. `shape="circle"` is the standard. Do not pass `name` — Quote's own `name` attribution makes the avatar decorative.

- **Inside `<TeamCard>`.** Pass as a visual element above or beside the name. Size `lg` (40px) is the natural rung at card scale. Pass `name` so the avatar is independently labeled if the card is not adequately described by its surrounding text.

- **Inline in prose (author byline, user mention).** Size `sm` (24px). Shape `circle`. Use with the `name` prop if the avatar stands alone; omit `name` if a text label immediately follows.

- **Stacking multiple avatars.** Not a DS primitive. If the consumer builds an overlap stack, Avatar's `flex-shrink: 0` and fixed dimensions make it stack correctly — the consumer applies negative `margin-inline-start` to create overlap. Avatar does not emit margin. The DS does not define an `AvatarGroup` molecule in this version.

- **Avatar must not be used at Portrait scale.** If the surface calls for an image larger than 40×40px, use `Portrait`. The two components are not interchangeable — `Portrait` owns the editorial-format image primitive; Avatar owns the attribution-scale disk.

---

## 10. Out of scope

- **`onError` / `fallbackToInitials`.** When the `<img>` fails to load, falling back to initials rendering is a common product pattern. It requires local state (`useState`, `onError` handler) — which introduces React state into an otherwise pure atom. This is non-trivial and warrants a separate decision. Deferred to v2. The empty placeholder disk is the acceptable v1 broken-image state.

- **Animated skeleton / shimmer.** No loading skeleton. The neutral `--surface` disk is the resting state for all non-image modes and doubles as the placeholder during image load.

- **`fetchPriority` on the internal `<img>`.** Above-the-fold team grids may benefit from `fetchpriority="high"` on the internal image. Not exposed in v1 — deferred.

- **Per-person color backgrounds.** No hash-derived or consumer-supplied background colors. The palette is fixed.

- **`AvatarGroup` (overlapping stack).** A composition molecule, not this atom's scope.

- **Dark mode per-component overrides.** `--surface`, `--fg-muted`, `--hairline` all flip correctly when the global dark-mode token block ships in `tokens.css`. No component-level dark-mode CSS is needed.

- **`shape="square"` with a larger radius.** `--radius-1` (2px) is the only square-mode radius. A rounder square (e.g. `--radius-3` / 8px, the iOS app-icon form) is a distinct aesthetic decision and would need a brand rationale entry. Deferred.

- **RTL support.** Avatar has no directional layout properties. `inline-flex` with `align-items: center` and `justify-content: center` is direction-neutral. RTL is correct by default.

---

## 11. Worked examples

### (a) Image mode — standalone, non-decorative

```jsx
import { Avatar } from "@poukai-inc/ui";

<Avatar
  src="https://cdn.example.com/avatars/arian-zargaran.jpg"
  alt="Arian Zargaran"
  size="lg"
  shape="circle"
/>;
```

Renders approximately:

```html
<span role="img" aria-label="Arian Zargaran" class="root size-lg shape-circle">
  <img
    src="https://cdn.example.com/avatars/arian-zargaran.jpg"
    alt="Arian Zargaran"
    loading="lazy"
    class="img"
  />
</span>
```

### (b) Initials mode — decorative (inside Quote, name provided by Quote)

```jsx
<Avatar initials="AZ" size="md" shape="circle" />
```

Renders approximately:

```html
<span aria-hidden="true" class="root size-md shape-circle">
  <span class="initials">AZ</span>
</span>
```

No `role="img"`, no `aria-label` — decorative. The surrounding `<Quote>` provides `name="Arian Zargaran"` in the figcaption.

### (c) Empty placeholder

```jsx
<Avatar size="md" shape="circle" name="Unknown user" />
```

Renders approximately:

```html
<span role="img" aria-label="Unknown user" class="root size-md shape-circle">
  <!-- no children; --surface background of root is the placeholder disk -->
</span>
```

### (d) Inside `<Quote>`

```jsx
import { Avatar, Quote } from "@poukai-inc/ui";

<Quote
  quote="We went from weeks to hours. The tooling handled what we used to staff an entire team for."
  name="Sarah Chen"
  role="VP Engineering, Meridian Labs"
  avatar={
    <Avatar src="https://cdn.example.com/avatars/sarah-chen.jpg" alt="" size="md" shape="circle" />
  }
/>;
```

`alt=""` marks the avatar decorative — Sarah's name is already present in Quote's attribution row. The avatar reinforces identity visually; the `<figcaption>` text carries the accessible meaning.

---

## 12. Story matrix

| Story file                       | Story name         | Description                                                                                                                                                  |
| -------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Avatar.stories.tsx`             | `ImageMode`        | `src` + `alt`, size `md`, shape `circle`. Verifies: `<img>` renders inside root span, `object-fit: cover`, hairline ring, correct 32×32px dimensions.        |
| `Avatar.stories.tsx`             | `InitialsMode`     | `initials="AZ"`, size `md`, shape `circle`. Verifies: initials span renders, `--surface` bg, `--fg-muted` text, hairline ring, `aria-hidden="true"`.         |
| `Avatar.stories.tsx`             | `EmptyMode`        | No `src`, no `initials`, `name="Unknown"`. Verifies: neutral disk, `role="img"`, `aria-label="Unknown"`, no text child.                                      |
| `Avatar.stories.tsx`             | `Sizes`            | Three instances: sm / md / lg, initials mode. Verifies: 24px / 32px / 40px dimensions respectively.                                                          |
| `Avatar.stories.tsx`             | `ShapeSquare`      | `shape="square"`, initials mode, size `md`. Verifies: `border-radius: var(--radius-1)` (2px), not 50%.                                                       |
| `Avatar.stories.tsx`             | `Decorative`       | `src` + `alt=""`. Verifies: `aria-hidden="true"` on root span, `alt=""` on `<img>`.                                                                          |
| `Avatar.stories.tsx`             | `WithName`         | Initials mode + `name="Sarah Chen"`. Verifies: `role="img"`, `aria-label="Sarah Chen"`, initials text still renders.                                         |
| `Avatar.AllVariants.stories.tsx` | `AllVariants`      | Grid: 3 sizes × 3 modes × 2 shapes. Design-matrix story.                                                                                                     |
| `Avatar.AllVariants.stories.tsx` | `InQuote`          | A `<Quote>` with an `<Avatar>` in the avatar slot. Verifies: attribution row alignment, `align-items: center` with name+role column, `flex-shrink: 0` holds. |
| `Avatar.AllVariants.stories.tsx` | `InAttributionRow` | Three Avatars of descending size in a flex row alongside text labels. Verifies inline participation and flex-shrink behavior.                                |

---

## 13. Open questions for Arian

1. **`onError` / initials fallback in v1.** When a remote image 404s, the browser shows the broken-image indicator inside a 32px disk — which looks wrong on a polished surface. The v1 spec defers `fallbackToInitials`. This means consumers who pass `src` must handle their own error state (e.g. wrapping Avatar in a component that conditionally passes `src` or `initials` based on load result). Is the broken-image state acceptable for v1, or should the engineer add `onError`→fallback as a v1 requirement even though it introduces state into an atom?

2. **Initials text size across all three Avatar sizes.** The spec uses `--fs-micro` (12px fixed) for initials at all three sizes (24px, 32px, 40px). At `sm` (24px), two-character initials at 12px fill approximately 50% of the disk width — which is correct optical proportion. At `lg` (40px), 12px initials look underfilled — approximately 30% disk width. An alternative: scale initials proportionally (10px for sm, 12px for md, 14px for lg). This would require three inline font-size values in the CSS module but no new tokens. Should initials scale with the Avatar size, or should they remain fixed at `--fs-micro` (simpler, more predictable)?

3. **`loading` prop on the internal `<img>`.** The spec locks `loading="lazy"` as the default with no consumer override via the public prop API (the override would need to pass through to the internal `<img>`, which is not reachable via `...rest` spread on the outer `<span>`). Should the engineer expose `imgLoading?: "lazy" | "eager"` as a public prop, or is `lazy` always correct for Avatar's use cases?
