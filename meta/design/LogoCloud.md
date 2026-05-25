# LogoCloud

**Status**: Approved

## 1. Intent

`<LogoCloud>` is the system's canonical "trusted by" / partners surface: a Section-framed collection of `Logo` atoms rendered either as a static grid or a continuously scrolling horizontal strip. It serves marketing pages (homepage social-proof row, pricing page partner band, about page customer mosaic) where a set of brand marks must be presented with visual restraint — subordinate to page content, never competing with the primary headline.

## 2. Anatomy

```
<section>                          ← Section wrapper (eyebrow + heading + lede)
  <div.logo-container>             ← grid or strip layout shell
    [strip only: div.track]        ← duplicated for seamless scroll loop
      <div.logo-item> × N          ← individual Logo slot, centers the atom
```

- **Section wrapper**: inherits all Section molecule behavior — optional eyebrow, heading (`h2`), lede. Spacing and landmark semantics owned by Section.
- **Logo container**: the direct child of Section's children slot. Switches between `display: grid` (grid variant) and a masked overflow scroll container (strip variant) via a `variant` prop.
- **Track** (strip only): an inner element duplicated in DOM order so the strip loops seamlessly. Both copies are `aria-hidden` on the second instance to avoid double-reading by screen readers.
- **Logo item**: a flex cell that centers a `Logo` atom. The cell does not clip or resize the Logo — the Logo atom controls its own dimensions.

## 3. Tokens

- `--space-8` — column and row gap between logos in `grid` variant (32px)
- `--space-6` — gap between logo items in `strip` variant (24px)
- `--space-12` — vertical padding above and below the logo container within the Section children slot (48px)
- `--fg-muted` — Logo atoms render in muted register by default; contrast detail owned by Logo spec
- `--hairline` — optional thin rule above the strip band when `divider` prop is set
- `--hairline-w` — width of the optional divider rule
- `--dur-slow` — base duration unit; strip scroll period is a multiple: `calc(var(--dur-slow) * 10)` = 6000ms per loop (consumer-overridable via `--logo-cloud-duration` custom property if that token is added; see Open questions)
- `--easing` — not used for strip scroll; strip uses `linear` timing deliberately (constant velocity, no ease in/out)
- `--content-max` — Section inherits this for the outer layout constraint

## 4. Variants / Props

| Prop       | Type                    | Default   | Rationale                                                                                     |
| ---------- | ----------------------- | --------- | --------------------------------------------------------------------------------------------- |
| `variant`  | `"grid" \| "strip"`     | `"grid"`  | Grid for curated small sets (4–12 logos); strip for larger sets or when motion aids browsing  |
| `columns`  | `2 \| 3 \| 4 \| 5 \| 6` | `4`       | Grid only. CSS `grid-template-columns: repeat(N, 1fr)`. Responsive: halved at `< --bp-md`     |
| `divider`  | `boolean`               | `false`   | Renders a 1px `--hairline` rule above the logo container — separates the cloud from hero band |
| `heading`  | `string \| ReactNode`   | —         | Passed through to Section's `title` slot. Optional.                                           |
| `eyebrow`  | `string \| ReactNode`   | —         | Passed through to Section's `eyebrow` slot. Optional.                                         |
| `lede`     | `string \| ReactNode`   | —         | Passed through to Section's `lede` slot. Optional.                                            |
| `size`     | `"default" \| "tight"`  | `"tight"` | Passed to Section's `size` prop. Logo clouds typically sit in dense marketing rows.           |
| `children` | `ReactNode`             | required  | `Logo` atoms. Consumer is responsible for correct count and ordering.                         |

`columns` has no effect when `variant="strip"` — strip lays out logos in a single horizontal row regardless.

## 5. Interaction

**Grid variant**: static. No hover state on the container. Individual `Logo` atoms may carry a hover treatment (opacity shift) per their own spec; LogoCloud does not add to it.

**Strip variant**:

- Scrolls continuously via CSS `animation: scroll linear infinite` on the `.track` element.
- Pauses on `:hover` and `:focus-within` via `animation-play-state: paused` — prevents the strip from moving under a user's pointer or keyboard focus.
- Keyboard: no interactive elements inside the strip by default. If Logo atoms are wrapped in anchor elements, natural tab order applies; the strip pause-on-focus-within ensures the focused logo is visible.

## 6. A11y

- Root renders as `<section>` via Section molecule. When `heading` is provided, Section wires `aria-labelledby` automatically.
- The duplicated track element in strip variant must have `aria-hidden="true"` on the second copy to prevent screen readers from announcing logos twice.
- Individual `Logo` atoms carry their own `alt` text — LogoCloud does not set alt on their behalf.
- If no `heading` is provided, pass `aria-label` on the Section root (via spread props) so the landmark is named for screen reader navigation.
- Strip motion: the auto-scroll is a decorative animation. The `prefers-reduced-motion` override (see §7) collapses it to a static layout so no vestibular discomfort occurs.

## 7. Motion

**Strip variant only.**

```
animation: logo-scroll var(--dur-slow * 10) linear infinite;
```

Keyframe translates the track from `translateX(0)` to `translateX(-50%)` — the track is 2× its visible width (first copy + duplicate), so -50% lands exactly back at the start, producing a seamless loop.

`animation-play-state: paused` on `:hover` and `:focus-within`.

**Reduced-motion:**

```css
@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none;
    /* strip degrades to a static flex row; overflow-x: auto added for scroll if needed */
  }
}
```

The global `animation-duration: 0.01ms !important` in `tokens.css` is insufficient here because an infinite animation with `0.01ms` duration would still loop — it would just loop nearly instantly. The engineer must add an explicit `animation: none` override in `LogoCloud.module.css`, parallel to the Hero reduced-motion pattern.

**Grid variant**: no motion. `prefers-reduced-motion` block has no effect on the grid layout.

## 8. Anti-patterns

- **Do not use LogoCloud to display navigation links.** Logo items are brand marks, not nav affordances. Use `LinkList` or `Footer` for navigation.
- **Do not place more than ~16 logos in the grid variant.** Dense grids of tiny logos produce visual noise. Strip is the correct variant for large sets; grid is for curated sets of 4–12.
- **Do not use LogoCloud as a product feature gallery.** Features with descriptions belong in `FeatureGrid`. LogoCloud is for brand marks only — no titles, no body copy per logo.
- **Do not nest LogoCloud inside another LogoCloud.** One cloud per section. Multiple brand-mark moments on the same page should use separate Section instances.
- **Do not use the strip variant as the page's primary hero animation.** Strip motion is subtle social proof, not a marquee headline. If it is the most visually prominent element on a page, the page hierarchy is wrong.
- **Do not override Logo `alt` text to empty string inside LogoCloud** unless the logo is accompanied by a visible text name. An empty alt leaves screen reader users without the brand name.

## 9. Depends on

- `Section` — outer structure, spacing, landmark semantics, heading slot
- `Logo` — individual brand mark atom (not yet implemented; this spec depends on Logo being specced and approved before LogoCloud ships)

## Open questions

1. **`Logo` atom does not yet exist in the DS.** LogoCloud depends on a `Logo` atom (an `<img>` or `<svg>` wrapper with consistent sizing, muted-on-hover treatment, and required `alt`). A `Logo` spec must be written and approved before LogoCloud can be implemented. This is a blocking dependency.
2. **Strip scroll duration token.** The strip period is currently expressed as `calc(var(--dur-slow) * 10)` using an existing token. If consumers need to tune the speed per-instance, a dedicated `--dur-logo-strip` token should be added to `tokens.css` with a `brand.md` decision-log entry. Recommend adding it at implementation time rather than speculatively.
3. **`columns` responsive halving.** The spec prescribes halving column count at `< --bp-md` (e.g. `columns=4` → 2 columns on mobile). Confirm whether the halving rule should be automatic (built into the component) or whether consumers should pass separate `columns` / `columnsMobile` props.
