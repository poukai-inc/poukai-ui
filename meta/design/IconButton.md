# Design spec: IconButton

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21
**Composes**: [`Button`](./Button.md), [`Icon`](./Icon.md), [`VisuallyHidden`](./VisuallyHidden.md)

---

## 1. Purpose

`<IconButton>` is the icon-only interactive primitive — the square-aspect sibling of `<Button>`. It exists for surfaces where an action is unambiguous from its glyph alone (close, copy, more, prev/next, expand) and a text label would crowd the chrome. It carries the same three variant registers (`primary` / `secondary` / `ghost`) and the same four-rung height ladder (`sm` / `compact` / `md` / `lg`) as `<Button>`, so the two atoms read as one family on a shared surface. The contract difference is geometric (square, no padding) and accessibility (icon-only is mute without a label — `aria-label` is therefore non-optional).

## 2. Anatomy

- **Container**: a square `<button>` element. Width equals height — the height ladder `--btn-h-*` drives both axes. No padding. Same `inline-flex` row, same focus ring, same state model as `<Button>`. The DS implements this by rendering `<Button>` internally with a geometry-override class; variant / state / focus / disabled behavior is inherited unchanged.
- **Icon slot**: exactly one `lucide-react` icon, rendered via `<Icon>`. Size is fixed per IconButton size (see §4). Consumer supplies the icon component; consumer does not author width / height / color.
- **Accessible name**: provided via the mandatory `aria-label` prop on the `<button>` host. Belt-and-suspenders: the same string is also rendered inside a `<VisuallyHidden>` child, so assistive technologies that prefer inner text over `aria-label` (legacy AT, virtual browse modes) still pick up the name.
- **Focus ring**: 2px solid `--accent` outline with 2px offset on `:focus-visible`. Inherited verbatim from `<Button>`.

## 3. Tokens used

**Existing tokens (no change):**

- `--btn-h-sm` (32px), `--btn-h-compact` (40px), `--btn-h-md` (44px), `--btn-h-lg` (52px) — square dimension per size, sourced from the Button height ladder.
- `--icon-sm` (16px), `--icon-md` (20px), `--icon-lg` (24px) — icon dimension per size (see §4 mapping table).
- `--radius-2`, `--fg`, `--bg`, `--surface`, `--hairline`, `--accent` — inherited via Button's variant rules.
- `--easing`, `--dur-fast`, `--dur-press` — inherited via Button's transitions.

**No new tokens.** IconButton is geometric reuse over an existing token stack. Introducing `--icon-btn-*` would fork the height ladder from Button and re-create the same set of accidental tokens the Button spec collapsed in 2026-05-17.

## 4. Layout & rhythm

| Size      | Square (width = height)       | Icon size | Icon px | Effective hit area |
| --------- | ----------------------------- | --------- | ------- | ------------------ |
| `sm`      | `var(--btn-h-sm)` = 32px      | `Icon sm` | 16px    | 32 × 32            |
| `compact` | `var(--btn-h-compact)` = 40px | `Icon md` | 20px    | 40 × 40            |
| `md`      | `var(--btn-h-md)` = 44px      | `Icon md` | 20px    | 44 × 44            |
| `lg`      | `var(--btn-h-lg)` = 52px      | `Icon lg` | 24px    | 52 × 52            |

**Icon-to-button ratio:** ~50% across the ladder. The icon is the only content; it sits at the optical center via `inline-flex` centering inherited from Button's root rule. The ratio is consciously kept under 60% so the glyph never crowds the border-box — IconButton reads as "a button with a glyph", not "a glyph in a frame".

**Why `compact` uses `Icon md` (20px), not `Icon sm` (16px):**

The Icon scale has no 18px rung — the gap between `sm` (16) and `md` (20) is wider than the gap between Button `compact` (40) and `md` (44). 16px in a 40px frame reads underweight (40% ratio); 20px reads correct (50%). Same icon size on `compact` and `md` is intentional — those two sizes are intentionally adjacent registers; differentiating them by icon size would over-articulate a 4px height delta.

**Why `lg` steps the icon up to `Icon lg` (24px):**

`lg` is the loud register. 20px in a 52px frame reads understated (38% ratio); 24px (46%) preserves the visual weight `lg` is selected for.

## 5. States

| State            | Visual                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Default          | Per variant (inherited from Button §5).                                                                                                 |
| Hover            | Same as Button — primary lightens, secondary / ghost fill surface. Icon inherits via `currentColor` — no separate icon hover treatment. |
| `:focus-visible` | 2px solid `--accent` outline, 2px offset. Outside the border-box. No size shift.                                                        |
| Active (primary) | `transform: translateY(1px)` — inherited from Button's primary active rule.                                                             |
| Disabled         | `opacity: 0.5`, `pointer-events: none`. Same square, same icon, same colors. Reads as "the same control, off".                          |

States are size-agnostic and variant-orthogonal. IconButton does not introduce any state, treatment, or hover affordance distinct from Button.

## 6. Motion

- Transitions inherited from Button: `background`, `color`, `border-color`, `transform` at `--dur-fast` / `--dur-press`.
- No size-specific motion. No icon-rotation, icon-swap, or press scale.
- Reduced-motion: handled by the global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` (transitions clamped to 0.01ms). No per-IconButton override.

## 7. Accessibility

- **Semantic element**: `<button type="button">`. No `asChild` in v1 — IconButton renders a `<button>`. Anchor-as-icon-button is a separate concern (will surface if `SkipLink` doesn't cover the cases).
- **Accessible name**: `aria-label` is **required** at the type level. An IconButton without a name is an a11y violation; the DS makes that violation a type error rather than a runtime drift. The same string is mirrored into a `<VisuallyHidden>` child for assistive-tech variants that prefer inner text.
- **Focus**: 2px solid `--accent` ring with 2px offset on `:focus-visible`. Outline contrast vs `--bg` ≈ 4.54 : 1 (AA non-text).
- **Tap target (WCAG 2.5.8 AA, 24 × 24)**: all four sizes pass. `sm` 32×32, `compact` 40×40, `md` 44×44, `lg` 52×52.
- **Tap target (WCAG 2.5.5 AAA, 44 × 44)**: `sm` (32) fails. `compact` (40) fails. `md` (44) passes at threshold. `lg` (52) passes.
- **AAA posture**: consumers requiring strict AAA on a specific surface select `md` or `lg`. `sm` and `compact` are AA-only tiers — the DS is honest about that and won't auto-upgrade silently.
- **Color contrast**: inherited from Button's variants — `primary` ≈ 16.29 : 1, `secondary` ≈ 15.46 : 1, `ghost` ≈ 16.29 : 1 (all AAA, against the canonical palette in `meta/brand.md`).
- **Icon a11y posture**: the inner `<Icon>` is rendered with `decorative={true}` (default) — `aria-hidden="true"`. The accessible name lives on the button host, never on the icon. This avoids double-announcement.
- **Keyboard**: native `<button>` behavior — `Enter` and `Space` activate. No custom key handlers.

## 8. Prop intent

- Consumers must declare the icon (`icon: LucideIcon`) and the accessible name (`aria-label: string`). Both are required.
- Consumers must choose the visual weight register: `variant` ∈ {`primary`, `secondary`, `ghost`} — same union as Button.
- Consumers must choose the height register: `size` ∈ {`sm`, `compact`, `md`, `lg`} — same union as Button.
- Defaults: `variant="primary"`, `size="md"` — matching Button's defaults so the two atoms feel interchangeable on a shared surface.
- The DS does not let consumers override icon dimensions; the size→icon mapping is fixed (see §4). If a consumer needs a non-canonical icon size, the answer is `<button><Icon /></button>`, not a new IconButton prop.
- The DS does not validate variant × size combinations. All 4 × 3 = 12 must render cleanly.
- No `asChild` in v1. Re-evaluate if a real `<a>`-as-IconButton consumer surfaces (most candidates are SkipLink, which is its own atom).

## 9. Composition rules

- IconButton sits inside `<Dialog>` headers (close), `<Toast>` (dismiss), `<Banner>` (dismiss), pagination chrome (prev / next), and copy / share affordances. Each composing surface owns the pairing; the DS does not enforce.
- IconButton + Button on the same surface: same `size` is the default convention. Different sizes are permitted (e.g. `compact` IconButton alongside `md` Button in a card header), but the burden is on the consumer.
- Two IconButtons adjacent: `--space-2` gap between siblings. Not enforced; recommended.
- IconButton inside `<SiteShell>` chrome: use `sm` or `compact`. Never `md` or `lg` in chrome — same posture rule as Button.
- IconButton inside form rows: `compact` is the canonical pairing with `<Input>` (which the form atoms will resolve at 40px height in the next iteration).

## 10. Out of scope

- **`size="xs"` below 32px.** Tap-target AA (24px) would still pass, but the brand register doesn't support icon-only affordances that small. Revisit only for form-density consumers, and only after Button revisits the same rung.
- **`size="xl"` above 52px.** `lg` covers the loud need. No consumer.
- **`destructive` variant.** Same posture as Button — file a proposal when the first destructive icon-only surface appears.
- **`asChild` (Slot composition).** Out of scope in v1. SkipLink and link-styled affordances have their own atoms.
- **`loading` / `pending` state.** Same posture as Button — separate proposal.
- **Tooltip-on-hover affordance.** Tooltip is its own primitive (not yet shipped); pairing IconButton × Tooltip is composition, not contract. Until Tooltip lands, the `aria-label` carries the full naming load.
- **Icon-position prop / dual-icon variants.** IconButton is single-icon by definition. Multi-icon and icon+label are Button's concern.
- **Dark-mode variant treatment.** Handled by the global dark-mode token override in `tokens.css` — variants consume `--fg` / `--bg` / `--surface` / `--accent` which flip cleanly. No per-IconButton dark-mode rule.
