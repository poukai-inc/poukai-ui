# Design spec: Button

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-17
**Implements proposal**: [`meta/proposals/button-size-compact.md`](../proposals/button-size-compact.md) (GitHub: [poukai-ui#42](https://github.com/poukai-inc/poukai-ui/issues/42))

---

## 1. Purpose

`<Button>` is the primary interactive affordance in `@poukai-inc/ui` — the visible commitment to act. It carries three weight registers (`primary` / `secondary` / `ghost`) across a four-rung height ladder (`sm` / `compact` / `md` / `lg`). The ladder exists because button weight is a brand-register signal: a 32px `sm` reads as "minor / inline / secondary", a 44px `md` reads as "the page's CTA", and a 52px `lg` reads as "the loudest CTA on the page". The new `compact` rung (40px) fills the gap that surfaced on editorial / display surfaces, where `md` reads too heavy against `<Hero size="display">` but `sm` reads too small to be the page CTA.

## 2. Anatomy

- **Container**: an `inline-flex` row with centered axis alignment. Renders as `<button>` by default; renders as a `Slot` (Radix) when `asChild` is set, so a consumer can attach the styles to an `<a>` for link-styled buttons.
- **Label slot**: text content. Inherits `--font-sans` (Geist), weight 500, color from the variant.
- **Icon slot** (optional, consumer-supplied via `lucide-react`): zero, one, or two icons composed into `children`. The DS does not own icon rendering; it owns spacing.
- **Gap**: `--space-2` (8px) between any sibling children inside the button — used when an icon precedes or follows the label.
- **Focus ring**: a 2px solid `--accent` outline with a 2px offset on `:focus-visible`. Not a visual layer of the button; sits outside the border-box.

## 3. Tokens used

**Existing tokens (no change):**

- `--font-sans`, weight `500` — label typography
- `--fs-meta` (14px) — label size for `sm`
- `--fs-body` (17–19px fluid) — label size for `compact`, `md`, `lg`
- `--space-2` (8px) — gap between icon and label
- `--radius-2` (4px) — corner radius (existing CSS reads `var(--radius-2, 8px)` with an 8px fallback; spec value is 4px from the radii scale)
- `--fg`, `--bg`, `--surface`, `--hairline`, `--accent` — variant colors
- `--easing` (entrance expo-out, unused here), 120ms ease — state transitions

**New tokens (introduced by this spec):**

| Token             | Value  | Purpose                                             |
| ----------------- | ------ | --------------------------------------------------- |
| `--btn-h-sm`      | `32px` | `sm` button min-height (was inline literal `32px`). |
| `--btn-h-compact` | `40px` | `compact` button min-height (new tier).             |
| `--btn-h-md`      | `44px` | `md` button min-height (was inline literal `44px`). |
| `--btn-h-lg`      | `52px` | `lg` button min-height (was inline literal `52px`). |

**Rationale for naming the full ladder as tokens** (not just the new rung): button heights are part of the brand contract — they anchor the perceived weight of every CTA on every page. Hard-coded literals in `Button.module.css` are accidental tokens; surfacing them as named CSS custom properties makes the height ladder readable from `tokens.css` and exportable to `llms-full.txt`, which the consumer-side proposal already referenced. The same height ladder will inform `<Input>` and segmented-control primitives when they ship.

No new padding tokens. Padding values stay inline per size (existing convention) — they are not part of a separate, reusable scale.

## 4. Layout & rhythm

| Size      | min-height (token)            | Padding (block / inline) | Font-size                  | Effective hit area |
| --------- | ----------------------------- | ------------------------ | -------------------------- | ------------------ |
| `sm`      | `var(--btn-h-sm)` = 32px      | `6px / 12px`             | `var(--fs-meta)` (14px)    | 32 × ≥ 56 typical  |
| `compact` | `var(--btn-h-compact)` = 40px | `9px / 16px`             | `var(--fs-body)` (17–19px) | 40 × ≥ 80 typical  |
| `md`      | `var(--btn-h-md)` = 44px      | `10px / 18px`            | `var(--fs-body)` (17–19px) | 44 × ≥ 96 typical  |
| `lg`      | `var(--btn-h-lg)` = 52px      | `14px / 24px`            | `var(--fs-body)` (17–19px) | 52 × ≥ 112 typical |

**Why the `compact` padding is 9 / 16 (not the linear midpoint 8 / 15):**

- Block padding `9` puts the line-box center at `40/2 = 20`, which lines up cleanly with the optical center of `--fs-body` rendered at its desktop ceiling (~19px). `8px` block padding gives a 24px text area, which crowds the 19px body type against the top and bottom edges.
- Inline padding `16` is a `--space-4` value (a real spacing-scale rung). Inline `15` is off the scale — picking it would create an off-grid horizontal that ripples into any layout that places a button adjacent to a `--space-*`-spaced sibling.
- Padding therefore reads on the 4 + 1 grid (block: 9 is `--space-2 + 1`, intentional optical centering nudge; inline: `--space-4`). The result is whole-number aesthetically and grid-aligned where it matters.

**Why the `compact` font is `--fs-body`, not an in-between size:**

- The type ramp has no rung between `--fs-meta` (14) and `--fs-body` (17). Introducing one for one button size would inflate the type scale for a single use site. `compact` is "a real CTA at a slightly quieter height" — the type is the CTA type (`--fs-body`); only the height steps down.

**Icon slot sizing (consumer-supplied via `lucide-react`):**

Icons inside `<Button>` should match the label x-height optically. Recommended icon `size` prop per Button size (consumer-applied, not enforced by DS):

| Button size | Recommended icon `size` |
| ----------- | ----------------------- |
| `sm`        | `14`                    |
| `compact`   | `16`                    |
| `md`        | `18`                    |
| `lg`        | `20`                    |

These are guidance, not contract — consumers may override.

## 5. States

| State            | Visual                                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Default          | Per variant (see §3).                                                                                                   |
| Hover            | Primary: background lightens via `color-mix(in oklab, var(--fg) 88%, transparent)`. Secondary / ghost: surface fill in. |
| `:focus-visible` | 2px solid `--accent` outline with 2px offset. Outside the border-box. No size shift.                                    |
| Active (primary) | `transform: translateY(1px)` — the only motion-bearing state. Tactile press feedback.                                   |
| Disabled         | `opacity: 0.5`, `pointer-events: none`. Same height; same padding; same type. Reads as "the same control, off".         |

States are size-agnostic — the `compact` size inherits every state behavior unchanged. No size-specific focus, hover, or active treatment.

## 6. Motion

- Default transitions: `background 120ms ease`, `color 120ms ease`, `border-color 120ms ease`, `transform 80ms ease`. Inherited as-is for `compact`.
- Reduced-motion fallback: handled by the global `@media (prefers-reduced-motion: reduce)` block in `tokens.css:243-252` (transitions clamped to 0.01ms).
- No size-specific motion. The `compact` size is a height variant; it carries no animation distinct from `sm` / `md` / `lg`.

## 7. Accessibility

- **Semantic element**: `<button type="button">` by default; `Slot` composition (Radix) when `asChild` is set so consumers can render `<a>` with button styling.
- **Focus**: visible 2px solid `--accent` ring with 2px offset on `:focus-visible`. Outline contrast vs `--bg` ≈ 4.54 : 1 (AA non-text). Outline-offset keeps the ring readable across surfaces.
- **Tap target (WCAG 2.5.8 AA, 24 × 24)**: `sm` 32px passes. `compact` 40px passes. `md` 44px passes. `lg` 52px passes.
- **Tap target (WCAG 2.5.5 AAA, 44 × 44)**: `sm` 32 fails. `compact` 40 fails (same posture as `sm`). `md` 44 passes at threshold. `lg` 52 passes.
- **AAA posture**: consumers requiring strict AAA on any specific surface must use `md` or `lg`. `sm` and `compact` are AA tiers; the DS does not lie about that.
- **Color contrast**: variant colors verified against the canonical palette (`meta/brand.md` → "Canonical light palette"). `primary` text (`--bg` on `--fg`) ≈ 16.29 : 1 (AAA). `secondary` text (`--fg` on `--surface`) ≈ 15.46 : 1 (AAA). `ghost` text (`--fg` on `--bg`) ≈ 16.29 : 1 (AAA). All pass at all sizes.
- **Keyboard**: native `<button>` behavior — `Enter` and `Space` activate. No custom key handlers.
- **Screen reader**: label is the visible text content. No `aria-label` mandate; consumers add one when the button is icon-only (out of scope for this spec).

## 8. Prop intent

- Consumers must be able to pass label content of varying length, plus optional icon children.
- Consumers must be able to choose the visual weight register: `primary` (the page's commitment), `secondary` (an action that doesn't fight `primary` for attention), `ghost` (a tertiary surface action).
- Consumers must be able to choose the height register across **four tiers**: `sm` (32px, minor inline action), `compact` (40px, editorial CTA — quieter than the page default), `md` (44px, the page default CTA), `lg` (52px, the loud CTA).
- The default size is `md` and the default variant is `primary`. The default does not change in this revision — every existing consumer is zero-regression.
- Consumers must be able to render the button styles on a different element (typically `<a>` for link-styled CTAs) without forking the styling. The DS provides this via composition (Radix `Slot`); the engineer designs the prop name.
- The DS does not validate combinations of variant × size. All 4 sizes × 3 variants = 12 combinations are supported and must render cleanly.
- The DS does not prescribe Hero × Button or Stat × Button pairing. Pairing is consumer-owned composition convention.

The engineer translates these intents into TypeScript prop types — including the addition of `"compact"` to the `ButtonSize` union.

## 9. Composition rules

- A `<Button>` may sit inside `<Hero>` as the primary CTA. Pairing convention (Hero × Button size) is **consumer-owned** — the DS does not enforce. Site-side guidance lives at `meta/compositions/pages/home.md` in the site repo.
- Two `<Button>`s side by side: same size, descending variant weight (`primary` then `secondary`, or `secondary` then `ghost`). Gap: `--space-3` between siblings. Not enforced; recommended.
- `<Button>` inside `<SiteShell>` chrome (header / footer): use `sm` or `compact`. Never `md` or `lg` — chrome buttons are minor relative to page content.
- `<Button asChild><a href="…">…</a></Button>` is the canonical link-styled-button pattern. The engineer owns the `asChild` semantics; consumers don't author CSS to make a link look like a button.
- Icons inside the button label come from `lucide-react` (peer dep, not re-exported). Icon sizing guidance in §4; not enforced.

## 10. Out of scope

- **`size="xs"` below 32px.** Tap-target AA (24px) would still pass, but the brand's editorial register doesn't support buttons that small as primary affordances. Revisit only if a form-density consumer files a proposal.
- **`size="xl"` above 52px.** `lg` covers the loud-CTA need.
- **Width tokens / fixed-width buttons (`--btn-min-w-*`).** Buttons size to content. No consumer has asked for fixed-width.
- **Responsive-shorthand size prop** (e.g. `size={{ mobile: "sm", desktop: "compact" }}`). Single value per render. If a consumer needs per-viewport sizes, they switch instances or wrap with a media-query helper at the consumer layer.
- **Per-pairing automatic validation** with `<Hero>`, `<Stat>`, or any other primitive. Pairing remains a composition-level concern.
- **Loading / pending state.** Not yet specified; surfaces as a separate proposal when needed.
- **Icon-only buttons** (square, no label). Separate spec; needs its own a11y story (aria-label, square aspect, possibly a distinct atom).
- **`destructive` variant.** No consumer has asked. When the first destructive surface appears (account deletion, etc.), file a proposal; the contract for `destructive` will be authored then.
- **Dark-mode variant treatment.** Handled by the global dark-mode override sketched in `meta/brand.md` (Decision history → 2026-05-15). No per-button dark-mode overrides; the variant rules consume `--fg` / `--bg` / `--surface` / `--accent` which flip cleanly.
