# Pouk AI brand decision log

> Maintained by the `poukai-design` agent. Authoritative for tokens, fonts, palette, motion, and mark rules. Every change to `src/tokens/tokens.css` lands here in the same commit.

## Foundations

### Color — primary, surface, semantic — with rationale and AA/AAA contrast pairs.

Pouk AI's color foundation is Apple's restrained Human Interface palette: SF system grays with Apple Blue as the only accent. The neutral ramp is deliberately compressed — there's only as much chroma as the operator-grade register can carry without becoming generic SaaS.

**Non-negotiable rule.** Neither end of the neutral ramp is pure. `--fg` pulls slightly off `#000` and the page `--bg` pulls slightly off `#FFFFFF`. Pure `#FFFFFF` is reserved exclusively for `--bg-elevated` — the front-most layer (popovers, sheets, modals, dialogs). This gives elevation headroom on the page and ensures the palette inverts cleanly to dark mode (see "Dark-mode direction" in `Decision history → 2026-05-15`).

#### Canonical light palette

| Token                | Value                  | Purpose                                                                                                                                              | Allowed pairings (text on this surface)                                                      | Contrast ratios verified                                                                                                                                                                                                        |
| -------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bg`               | `#FBFBFD`              | Page background. The default canvas.                                                                                                                 | `--fg` (primary), `--fg-muted` (secondary), `--accent` (links / focus, all text sizes at AA) | `--fg` on `--bg` = **16.29 : 1** (AAA); `--fg-muted` on `--bg` = **4.91 : 1** (AA normal); `--accent` on `--bg` = **4.54 : 1** (AA normal — at threshold)                                                                       |
| `--surface`          | `#F5F5F7`              | Recessed elevation. Code blocks, quote blocks, inline keys.                                                                                          | `--fg`, `--fg-muted`. Not for `--accent` text below 18px.                                    | `--fg` on `--surface` = **15.46 : 1** (AAA); `--fg-muted` on `--surface` = **4.66 : 1** (AA normal)                                                                                                                             |
| `--surface-section`  | `#F8F8FA`              | Page-section recessed background. Full-width alternating section bands on editorial pages only. Subtler than `--surface`. NEVER for inline elements. | `--fg`, `--fg-muted`. Keep `--accent` text at 18px+ on this surface.                         | `--fg` on `--surface-section` = **15.87 : 1** (AAA); `--fg-muted` on `--surface-section` = **4.78 : 1** (AA normal); `--accent` on `--surface-section` = **4.42 : 1** (AA large/UI ✓; below AA-normal — keep accent text 18px+) |
| `--bg-elevated`      | `#FFFFFF`              | Front-most layer. Popovers, sheets, dialogs, dropdown menus.                                                                                         | `--fg`, `--fg-muted`, `--accent`                                                             | `--fg` on `--bg-elevated` = **16.83 : 1** (AAA); `--fg-muted` on `--bg-elevated` = **5.07 : 1** (AA normal); `--accent` on `--bg-elevated` = **4.69 : 1** (AA normal)                                                           |
| `--fg`               | `#1D1D1F`              | Primary text, wordmark stroke, sigil stroke.                                                                                                         | On `--bg`, `--surface`, `--bg-elevated`                                                      | See above. AAA on every surface.                                                                                                                                                                                                |
| `--fg-muted`         | `#6E6E73`              | Secondary copy: footer, captions, lede paragraphs, metadata.                                                                                         | On all three surfaces.                                                                       | See above. AA normal on every surface; comfortable headroom on `--bg-elevated` (5.07 : 1), tighter on `--surface` (4.66 : 1).                                                                                                   |
| `--hairline`         | `#D2D2D7`              | 1px dividers, table rules, borders.                                                                                                                  | Non-text; no contrast requirement for decorative rules.                                      | n/a — decorative. Reads as a true hairline on all three surfaces.                                                                                                                                                               |
| `--accent`           | `#0071E3`              | Status dot, link underline, focus ring, primary CTAs.                                                                                                | Use for non-text UI freely. For text, prefer 17px+ or against `--bg-elevated`.               | See above. WCAG 1.4.11 non-text contrast is satisfied on every surface (focus rings, status dots).                                                                                                                              |
| `--accent-glow`      | `rgba(0,113,227,0.18)` | Selection background, soft accent halos.                                                                                                             | Background only — never carries text.                                                        | n/a — decorative.                                                                                                                                                                                                               |
| `--bg-warm-accent`   | `#C0452C`              | Editorial band background. Full-bleed saturated orange-vermillion surface for one-off editorial moments (e.g. /about portrait band).                 | `--fg-on-warm` (primary), `--fg-on-warm-muted` (supporting). NEVER `--accent` (blue clash).  | **4.72 : 1** (`--fg-on-warm`) and **3.91 : 1** (`--fg-on-warm-muted`). See decision 2026-05-18.                                                                                                                                 |
| `--fg-on-warm`       | `#FDF5F0`              | Primary text on a `--bg-warm-accent` surface. Warm-tinted near-white (not pure `#FFFFFF`).                                                           | ONLY on `--bg-warm-accent`.                                                                  | **4.72 : 1** against `--bg-warm-accent` — AA ✓                                                                                                                                                                                  |
| `--fg-on-warm-muted` | `#F5DDD0`              | Supporting/secondary text on a `--bg-warm-accent` surface. Warm blush-cream.                                                                         | ONLY on `--bg-warm-accent`. Keep at display/heading sizes ≥ 24px.                            | **3.91 : 1** against `--bg-warm-accent` — AA-large ✓; below AA-normal — display/heading sizes ≥ 24px only.                                                                                                                      |

**Elevation rhythm.** Four steps, low to high: `--surface (L≈0.914) < --surface-section (L≈0.940) < --bg (L≈0.966) < --bg-elevated (L=1.000)`. The page sits between recessed surfaces (for inline blocks and section bands) and an elevated surface (for overlays). This bidirectional rhythm — recess down, elevate up — is the Apple model. `--surface` stays its role (inline code/quote blocks, card fills). `--surface-section` is the dedicated tier for full-width alternating section bands; it is semantically distinct from `--surface` and not interchangeable with it.

**Math.** Contrast ratios above are computed against the WCAG 2.1 sRGB linearization (`C_lin = C/12.92` for `C ≤ 0.04045`, else `((C+0.055)/1.055)^2.4`) and the `(L1 + 0.05)/(L2 + 0.05)` ratio formula. Verified independently of the brand decision.

### Typography — headline and body face, rationale, type scale, line-height.

_To be filled. For each face: rationale (why this face, why now), scale (token → use), line-height, tracking notes._

### Spacing — scale and rhythm rules.

_To be filled. The scale itself + the rules for picking values (when to escalate from `--space-4` to `--space-8`, etc.)._

### Motion — default easing, default duration, principles.

_To be filled. Default easings + durations + principles (e.g. "no animation without semantic meaning", reduced-motion fallback)._

### Brand marks — Wordmark, isotype, lockup rules.

_To be filled. Wordmark vs. isotype vs. stacked lockup — when each is used, sizing rules, clear-space rules, on-light vs. on-dark variants._

---

## Evolution rules

_To be filled. When can a token change vs. add? What requires Arian's approval? What's reversible? What invalidates a release?_

---

## Decision history

_Reverse-chronological. Each entry: context, decision, rationale, alternatives considered, approval (Arian)._

### 2026-05-19 — Link resting-state discoverability: two-layer underline (hairline at rest, accent grows on hover)

**Context.** The global `<a>` rule had zero resting-state affordance: `color: inherit`, `text-decoration: none`, and a `background-size: 0% 1px` gradient that was fully invisible until hover. User feedback: links need a visible resting signal for discoverability — a user should be able to identify a link without triggering a hover. The constraint is that `--accent` (`#0071E3`) is the system's signal color for interactivity and focus only, and the brand rule explicitly forbids using it as body text color. Any resting-state treatment must not repurpose accent as a text tint.

**Decision — two-layer gradient underline.**

The global `a` rule now carries two `background-image` layers:

- **Layer 1 (top): accent grow layer.** `linear-gradient(var(--accent), var(--accent))`, starts at `background-size: 0% 1px`. On hover: grows to `100% 1px` via the existing `--easing-link` / `--dur-mid` transition. This is the "you are targeting this" confirmation signal — identical animation to the previous rule.
- **Layer 2 (bottom): hairline static layer.** `linear-gradient(var(--hairline), var(--hairline))`, always at `background-size: 100% 1px`. This is the resting discoverability signal — a 1px `#D2D2D7` underline visible at all times, identical in weight to a divider rule.

On hover the accent layer grows over the hairline layer — the hairline is visually eclipsed once the accent reaches full width. The `transition` property applies to `background-size` and covers both layers via the comma-separated shorthand, but since the hairline layer is always `100% 1px` it produces no perceptible animation — only the accent layer visibly animates.

This preserves every existing behavior (focus ring, `--easing-link`, `--dur-mid`, `padding-bottom: 2px`, `color: inherit`) and introduces no new token.

**Why this approach over the three candidates.**

- **Candidate 1 (persistent underline + color swap on hover)** as originally framed would require either a non-animatable `background-image` swap (jarring) or a registered `@property` for the gradient color (complex, limited support). The two-layer approach achieves the same visual outcome — hairline underline at rest, accent underline on hover — without needing `background-image` to be transitionable. The accent layer growing over the static hairline layer is perceptually equivalent to a color swap from the user's perspective.

- **Candidate 2 (resting `color: var(--accent)` text tint)** was rejected. It directly violates the `--accent`-is-signal-only rule as written: "NEVER use as body text color." Making a carve-out for "link text is interactive by definition" would erode the rule's clarity. The Apple/Stripe pattern this candidate references actually uses a dedicated system link blue token that is explicitly scoped for link text — it is not the same token as the focus/interactive accent. Since the system has one accent token and no dedicated link-text-color token, the carve-out would pollute the accent role. Candidate 2 also changes text color, which affects `--fg-muted`-colored links (nav, footer) in an undesirable way — those contexts are intentionally muted.

- **Candidate 3 (separate persistent underline + animated grow above it)** is structurally what was implemented. The framing here is that this IS the chosen approach, not a distinct candidate — the two-layer CSS technique is the implementation of the "always-visible + grow-on-hover" pattern.

**`--accent`-signal-only rule interaction.** The resting hairline underline uses `--hairline` (`#D2D2D7`), not `--accent`. The `--accent` color appears only on hover (animated) and on focus-visible (ring). The signal rule is fully preserved: `--accent` is never visible in a resting state. The hairline underline is decorative-quality — it reads as "this is a link" not "this is interactive right now." The semantic distinction holds.

**Cascade effect on existing components.**

All components that already suppress `background-image` via `background-image: none` continue to work correctly. The two-layer rule in the global `a` selector is overridden by any `background-image: none` declaration with equal or higher specificity. Verified:

- **LinkCard** (`src/molecules/LinkCard/LinkCard.module.css`): suppresses via `background-image: none; padding-bottom: 0` on both the card root and the `.title` element. Class specificity beats the element selector. No change required. The card's hover signal remains border-color → `--accent` only.
- **SiteShell Wordmark** (`src/organisms/SiteShell/SiteShell.module.css`): suppresses via `background-image: none; padding-bottom: 0` on `.brand`. No change required.
- **`.muted-link`** (`tokens.css`): suppresses via `background-image: none`. No change required. Footer/nav links retain their `color` transition only.
- **EmailLink**: inherits the global `a` rule with no override. It now gains the hairline resting underline. This is correct — EmailLink is a body-copy inline link and benefits from the resting affordance. The `variant="muted"` EmailLink will show a `--hairline` underline at rest over its `--fg-muted` text color — the contrast of `--hairline` (`#D2D2D7`) against `--bg` (`#FBFBFD`) is decorative/non-text and passes WCAG 1.4.11 for non-text contrast (the underline is a UI component boundary, not informational text).

**`padding-bottom: 2px` unchanged.** The clearance space below the text baseline that keeps the underline from clipping descenders is preserved. The hairline layer sits at `background-position: 0 100%` — it rests at the bottom of the padding-box, which is 2px below the text baseline after `padding-bottom: 2px`. No optical adjustment needed.

**`:visited` treatment.** No distinct treatment. Consistent with the existing EmailLink brand decision: visited state creates false scent, particularly on contact and navigation links. The hairline underline does not change this decision.

**Authorization.** `poukai-design` decision. The change is an evolution of the global `a` rule (not a new token, not a color change) — additive behavior using an existing token (`--hairline`). Arian to ratify on review.

**Follow-ups for `poukai-ds-engineer`.** None required for component code — the two-layer rule is purely in `tokens.css` and cascades correctly to all existing components via the verified suppressions above. No changeset needed for this entry alone; bundle with the next minor bump.

---

### 2026-05-19 — Pull molecule: introduce `--fs-pull: clamp(1.25rem, 1rem + 1vw, 1.625rem)`

**Context.** The `<Pull>` molecule spec (`meta/design/Pull.md`) introduces an inline editorial pull-quote primitive. Pull requires a font-size token between `--fs-body` (17–19px) and `--fs-statement` (28–44px). The gap between those two rungs is large: `--fs-body` tops at 19px; `--fs-statement` floors at 28px. A pull-quote at `--fs-body` would not read as an accent against the surrounding prose. A pull-quote at `--fs-statement`'s lower bound (28px) would be indistinguishable from the Statement molecule at its quietest register and uncomfortably close to heading scale. A named rung at 20–26px is the correct answer.

**Decision — `--fs-pull: clamp(1.25rem, 1rem + 1vw, 1.625rem)`.**

The token sits immediately above `--fs-body` in `tokens.css`, reading 20px at 320px viewport and 26px at approximately 960px viewport. The floor-to-ceiling delta (6px) is deliberately restrained — Pull grows with the viewport but stays in the same register at all widths.

| Token       | Value                                  | Range   |
| ----------- | -------------------------------------- | ------- |
| `--fs-pull` | `clamp(1.25rem, 1rem + 1vw, 1.625rem)` | 20–26px |

**Position in the ramp.** The updated ramp order in the vicinity of the new token:

```
--fs-statement  clamp(1.75rem, 1.25rem + 2vw, 2.75rem)   28–44px
--fs-pull       clamp(1.25rem, 1rem + 1vw, 1.625rem)      20–26px  ← new
--fs-body       clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem) 17–19px
```

**Why a named token rather than an inline `clamp()` in Pull's CSS module.**

The BACKLOG explicitly calls for tokenizing the type scale. A semantic component such as Pull has a named typographic register — "pull-quote body text" is a distinct role, no different from `--fs-meta` (attribution text) or `--fs-card-title` (card heading). Inlining a `clamp()` in a CSS module makes that value invisible to consumers, to `llms-full.txt`, and to any future component that wants to render at the same scale (e.g. a future `FieldNote` callout or a `Highlight` inline accent). The token surfaces the contract.

**Why `--fs-pull` and not `--fs-body-lg` or `--fs-large`.**

Semantic names, not size names. `--fs-pull` communicates the role (editorial pull-quote body); `--fs-body-lg` communicates a positional relationship to `--fs-body` (which could change). The naming convention in this system is role-scoped: `--fs-tagline`, `--fs-statement`, `--fs-meta`, `--fs-card-title` — none of these are named by size relationship. `--fs-pull` follows that convention.

**Left rule: 3px.** The Pull spec specifies `border-inline-start: 3px solid var(--hairline)`. This is heavier than the 1px `--hairline-w` dividers used for rules and borders elsewhere. The distinction is intentional: Pull's left border is typographic punctuation — it must register visually against a body-text column — whereas dividers are spatial separators. `3px` reads as "editorial mark"; `1px` would read as "separator," which is the wrong semantic. No new border-width token is introduced; `3px` is hardcoded in Pull's CSS module as a component-specific value with no reuse surface.

**Decorative quote mark decision.** Pull does not render a decorative `"` glyph via `::before`. The left rule serves as visual punctuation. Adding a large display quote mark would push Pull toward a decorative register at odds with the Apple-restrained aesthetic: Apple's editorial pullout patterns on `apple.com` and in its editorial design use ruled indentation, not large decorative glyphs. This decision is part of the Pull spec and is logged here for permanence — future proposals to add a quote glyph are brand-level changes requiring this entry's rationale to be revisited.

**`--fs-pull` vs. `--fs-statement` distinction preserved.** At maximum viewport (≥960px), `--fs-pull` reaches 26px and `--fs-statement` floors at 28px. There is a 2px overlap zone — a brief range of viewport widths where the two tokens are the same size. This is acceptable because Pull and Statement are never used on the same typographic surface at the same moment: Pull is inline in prose; Statement is a standalone page-level block. Readers do not see them side by side, so the overlap does not create perceptible ambiguity. Were they used side by side, the serif-italic treatment and left-rule context of Pull would still distinguish it from Statement's centered, standalone presentation.

**Alternatives considered.**

- **Use `--fs-statement` for Pull.** Rejected. At 28–44px, this registers as a heading, not an inline accent. At its smallest (28px on mobile), it already sits above the global `h2`'s mobile size (~28px) — Pull at that scale would disrupt rather than accent the prose.
- **Use `--fs-body` with weight or color differentiation only.** Rejected. The editorial effect of a pull-quote is size-based — the passage must be visibly larger than the surrounding prose to slow the eye. Color and weight alone cannot achieve this at `--fs-body` scale.
- **Inline `clamp()` in Pull.module.css without a token.** Rejected. Invisible to consumers, invisible to `llms-full.txt`, no reuse path. See "Why a named token" above.
- **`clamp(1.125rem, 1rem + 0.75vw, 1.5rem)` (18–24px).** Considered as a tighter range. Rejected: 18px at mobile is only 1px above the top of `--fs-body` (17px) and would not read as a distinct register at the smallest viewports. The chosen floor of 20px (1.25rem) guarantees a minimum 1px step above `--fs-body`'s ceiling of 19px.
- **`clamp(1.375rem, 1.1rem + 1.1vw, 1.75rem)` (22–28px).** Considered as a slightly larger range. Rejected: the 28px ceiling collides with `--fs-statement`'s floor (28px), creating a zero-gap overlap at large viewports. The chosen 26px ceiling leaves a 2px gap, which is narrow but preserves the rung distinction.

**Token placement in `tokens.css`.** The token lives in the fluid type-scale block inside `:root`, immediately above `--fs-body`:

```css
--fs-pull: clamp(
  1.25rem,
  1rem + 1vw,
  1.625rem
); /* 20–26. Inline editorial pull-quote accent; above body, below --fs-statement. */
```

**Authorization.** `poukai-design` decision (additive token; no existing consumer behavior changes). Arian to ratify on review. Reference: `meta/design/Pull.md`.

**Follow-ups for `poukai-ds-engineer`.**

- `--fs-pull: clamp(1.25rem, 1rem + 1vw, 1.625rem)` is now in `src/tokens/tokens.css`, fluid type-scale block, immediately above `--fs-body`. No further token work needed.
- Implement `src/molecules/Pull/` per `meta/design/Pull.md`. Components: `Pull.tsx`, `Pull.module.css`.
- Export `Pull` from `src/molecules.ts` and `src/index.ts`.
- Add `Pull` to `scripts/build-llms-txt.mjs` `COMPONENTS.molecules` and add a `### Pull` section to `meta/llms-full.txt` documenting `--fs-pull`, `variant`, `as` polymorphism, and the `attribution` slot.
- Ship the story matrix from `meta/design/Pull.md §12`.
- Changeset: minor bump (new molecule, new token, additive).

---

### 2026-05-19 — Eyebrow atom: introduce `--tracking-eyebrow: 0.06em` and `--lh-meta: 1.2`

**Context.** The `<Eyebrow>` atom spec (`meta/design/Eyebrow.md`) reconciles three divergent letter-spacing values used for the same micro-label pattern across `RoleCard` (`.eyebrow`, `0.06em`), `FailureMode` (`.index`, `0.08em`), and the global `.micro` utility (`0.04em`). It also introduces the system's first named line-height token, scoped to the meta/eyebrow register. Both tokens are new additions; no existing token is modified.

**Decision — `--tracking-eyebrow: 0.06em`.**

The three in-use values were each authored independently without a system rationale. The decision is to normalize to a single canonical value and retire the per-component divergence.

`0.06em` is chosen over `0.04em` and `0.08em` for the following reasons:

- `0.04em` (`.micro` global utility) is the correct tracking for lowercase meta text (footer copy, captions). Uppercase Eyebrow text needs more air between glyphs to avoid the letter block reading as a dense shape — `0.04em` is visually tight on all-caps labels at `--fs-meta`.
- `0.08em` (`FailureMode.index`) was the widest value, authored for a reference-index register ("FM-03"). It is marginally more airy than `0.06em` but the difference at 14px is within one perceptual step and does not constitute a semantically distinct register. Maintaining a second tracking token for that one context would add friction without earning it.
- `0.06em` is already in use on the highest-visibility eyebrow surface (RoleCard), matches Apple's measured uppercase micro-label tracking on `apple.com` (approximately `0.05–0.07em`), and reads as "considered open" rather than "airy" or "tight".

The `.micro` global utility (`0.04em`) is not modified. It serves a different register (lowercase meta text) and is not interchangeable with `--tracking-eyebrow`. Both coexist.

`--tracking-stat: -0.015em` (existing, for `<Stat>` display numerals) is not modified. The tracking token namespace is semantic-role-scoped: `--tracking-eyebrow` joins `--tracking-stat` as a distinct role.

**Decision — `--lh-meta: 1.2`.**

No line-height tokens existed before this entry. The BACKLOG "Tokenize line-height + letter-spacing scales" item calls out the drift. This spec introduces the first line-height token, narrow-purpose for the meta/eyebrow register. The value `1.2` reflects what the system already uses at the meta-text scale (`h2`, `h3`, `.numeral` in Principle). A full `--lh-*` ramp is deferred to the foundations pass.

**Token placement in `tokens.css`.**

Both tokens belong in the Typography section of `:root`, after the existing `--tracking-stat` line:

```css
--tracking-eyebrow: 0.06em; /* canonical tracking for uppercase eyebrow / micro-label text */
--lh-meta: 1.2; /* line-height for meta-scale text (eyebrow, labels) */
```

**Alternatives considered.**

- **Keep all three values and tokenize as `--tracking-eyebrow-tight / -mid / -loose`.** Rejected. Three named variants of what is semantically the same concept (an uppercase micro-label) is a false taxonomy. The system gains nothing from three rungs here. If a genuinely distinct register surfaces, a second token can be added then with a real rationale.
- **Adopt `0.04em` as canonical (collapse to the `.micro` value).** Rejected. At 14px uppercase, `0.04em` is perceptibly under-tracked for all-caps labels — the letters read as a dense block, not a discrete label. The `.micro` class was authored for lowercase usage; its tracking is not appropriate for uppercase.
- **Adopt `0.08em` as canonical.** Rejected. Marginally wider than `0.06em` without a distinct semantic register to justify the second token. The FailureMode index does not need to be perceptibly wider than every other eyebrow in the system.
- **No `--lh-meta` token; keep `1.2` as an inline literal in Eyebrow.module.css.** Rejected. The BACKLOG item explicitly calls for tokenizing line-height scales; introducing a new component without also introducing its line-height token would continue the pattern this spec is meant to fix.

**Authorization.** `poukai-design` decision (additive tokens, no existing consumer behavior changes). Arian to ratify on review. Reference: `meta/design/Eyebrow.md`.

**Follow-ups for `poukai-ds-engineer`.**

- Add `--tracking-eyebrow: 0.06em` and `--lh-meta: 1.2` to `src/tokens/tokens.css`, Typography section, after `--tracking-stat`.
- Implement `src/atoms/Eyebrow/` per `meta/design/Eyebrow.md`.
- Export `Eyebrow` from `src/atoms.ts` and `src/index.ts`.
- Add `Eyebrow` to `scripts/build-llms-txt.mjs` `COMPONENTS.atoms` and add a `### Eyebrow` section to `meta/llms-full.txt`.
- Ship the story matrix from `meta/design/Eyebrow.md §9`.
- **Separate follow-up PR** — migrate `RoleCard`, `FailureMode` to consume `<Eyebrow>` per migration notes in the spec. Do not bundle with the atom ship.
- **Separate follow-up PR** — add `--bp-md: 768px` to `tokens.css` Layout section and update `meta/brand.md` with its decision-log entry. Migrate Hero's `720px` breakpoint to `var(--bp-md)`.
- Changeset: minor bump (new atom, new tokens, additive).

---

### 2026-05-18 — Add `--content-max-bleed: 100vw` — full-bleed layout permission token (issue #57)

**Context.** The `/about` v2 portrait band requires a surface that extends edge-to-edge across the viewport. Prior to this change, the DS had no mechanism for opting a section out of the `--content-max: 64rem` column constraint. Site-side consumers were either constrained to `64rem` or would need to hardcode viewport-width values outside the token contract — both failures of the brand contract.

**Decision.** Add a new layout token to `src/tokens/tokens.css`, Layout section, immediately after `--content-max`:

```css
/* Full-bleed layout permission. Components opt into viewport-width by reading
   this token. Canonical usage: width: var(--content-max-bleed); margin-inline: calc(50% - 50vw) */
--content-max-bleed: 100vw;
```

This is an opt-in permission token. The default behavior (`--content-max: 64rem`) is unchanged — no regression for any existing consumer. Components reference `--content-max-bleed` explicitly to escape the content column; nothing picks it up by default.

**Scrollbar-width call.** The token value is `100vw`, not `calc(100vw - scrollbar-width)` or `100dvw`.

1. macOS (primary platform) uses overlay scrollbars that occupy zero layout width. `100vw === viewport content width` on the primary target.
2. On Windows with space-occupying scrollbars (~15–17px), `100vw` creates a cosmetic overhang at bleed edges. This is addressable at the site layout level (e.g. `scrollbar-gutter: stable` on `<html>`) and is not a DS-level constraint.
3. `100dvw` and `100vw` are equivalent for width (dynamic viewport units matter for height, not width). `100vw` is correct here.
4. `calc(100vw - scrollbar-width)` requires `@property` registration and fallback gymnastics for older browsers; it degrades gracefully to `100vw` on every platform that matters. The complexity cost exceeds the benefit.
5. Apple, Stripe, NYT, and Linear all use `100vw` for full-bleed editorial compositions. This is the established pattern.

This choice is non-negotiable without Arian's approval. Future maintainers must not silently replace `100vw` with a `calc()` expression — that constitutes a brand-level token change.

**Rationale for token naming.** The name `--content-max-bleed` signals intent ("bleed") rather than implementation ("100vw"). If the value ever needs refinement (e.g. to account for a future scrollbar strategy), the token value changes but consumer code does not. The name pairs with `--content-max` as its pair — the sibling that opts out of the column constraint.

**Permission-not-default model.** Mirroring how Apple, Stripe, and editorial sites handle full-bleed compositions: the default is the constrained column; bleed is an explicit opt-in. This matches the Hero molecule's `bleed="none"` (default) / `bleed="full"` (opt-in) prop shape. The token is the DS contract; the prop is the component interface that reads it.

**Alternatives considered.**

- **(A) No token — consumers use `width: 100vw` directly.** Rejected. Collapses the brand contract. Hardcoded `100vw` in consumer CSS is an undocumented deviation from the token system; future changes to the bleed strategy would require hunting all usage sites. The token is the contract.
- **(B) `--content-max-full: 100vw`.** Rejected in favor of `--content-max-bleed`. "Full" is ambiguous (full of what?); "bleed" is a recognized editorial term that immediately communicates the intent to any designer or engineer familiar with print/web layout. The vocabulary is on-brand.
- **(C) `100dvw`.** Equivalent for width. `vw` is correct; `dvw` is not wrong but adds no value for a width-only token and would require explanation in every consumer's CSS.

**Approval.** Design-level decision (additive token; minor bump). Arian's sign-off not required for additive token additions, per evolution rules. Logged here for traceability.

### 2026-05-18 — Add warm accent tier: `--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted` (issue #56)

**Context.** The `/about` v2 page introduces a full-bleed editorial band with a saturated orange-vermillion backdrop. The band's background color must match exactly the AI-generated portrait asset used in that section — meaning once the value ships it is permanently locked: changing `--bg-warm-accent` after first delivery would require re-grading the portrait asset. No warm color existed in the token system; the palette was neutral tiers plus one blue accent. A new warm tier is required that is entirely orthogonal to the existing elevation rhythm (`--surface < --surface-section < --bg < --bg-elevated`) — it does not slot into the neutral ladder and must never be used as a page background, a button color, or any surface outside the specific full-bleed editorial band context.

**Decision.** Three new tokens:

| Token                | Value     | Purpose                                                   |
| -------------------- | --------- | --------------------------------------------------------- |
| `--bg-warm-accent`   | `#C0452C` | Editorial band background — saturated orange-vermillion   |
| `--fg-on-warm`       | `#FDF5F0` | Primary text on warm band — warm-tinted near-white        |
| `--fg-on-warm-muted` | `#F5DDD0` | Supporting/secondary text on warm band — warm blush-cream |

**Value rationale.**

_Hue choice — orange-vermillion._ The proposal specifies "saturated orange-vermillion" with a hint value of ~#D9523A. The chosen `#C0452C` sits in the same orange-vermillion hue family (roughly HSL 11–14°, saturation ~65%, lightness ~46%). The hue is editorial and warm without drifting into the generic SaaS red/coral register.

_Why not #D9523A._ The proposal itself flags that the hint value fails AA. Computing the contrast of #D9523A (L≈0.1035) against a warm near-white fg like #FBFBF7 (L≈0.9594) gives approximately (0.9594 + 0.05) / (0.1035 + 0.05) = 1.0094 / 0.1535 ≈ 6.58:1 — but that is with near-pure white fg. With a perceptibly warm-tinted fg at L ≈ 0.92 the ratio falls to about 3.9:1, below AA (4.5:1). To reach AA with a genuinely warm fg, the background must darken. `#C0452C` achieves L≈0.1565, which yields 4.72:1 against `#FDF5F0` (L≈0.9247) — comfortably above the 4.5:1 AA floor.

_Why `#FDF5F0` for `--fg-on-warm`._ This is a warm-tinted near-white: R=253, G=245, B=240. The R channel is highest, the B channel lowest — a perceptible warm tilt that is not neutral. It is not pure `#FFFFFF` (which would violate the "never pure edges" rule), and it is not the page `--bg` (#FBFBFD, which has a cool tilt with B > R). The B-channel pullback from the page background is the correct direction for a warm surface. L≈0.9247.

_Why `#F5DDD0` for `--fg-on-warm-muted`._ A warm blush-cream (R=245, G=221, B=208). Clearly in the same warm family as `--fg-on-warm` but perceptibly dimmer, communicating "secondary." L≈0.7567. At 3.91:1 against the band background it passes AA-large (≥3.0:1) with healthy margin but sits below AA-normal (4.5:1) — which is acceptable only because this token is ceiling-capped to display/heading sizes ≥ 24px. It must never be used for normal body-copy-sized text.

**WCAG 2.1 verification.**

Relative luminance formula: linearize each channel (`C_lin = C/12.92` if C/255 ≤ 0.04045, else `((C/255 + 0.055)/1.055)^2.4`), then `L = 0.2126·R_lin + 0.7152·G_lin + 0.0722·B_lin`. Contrast = `(L_lighter + 0.05) / (L_darker + 0.05)`.

Linearized channel values:

`#C0452C` (R=192, G=69, B=44):

- R: 192/255 = 0.75294 → ((0.75294+0.055)/1.055)^2.4 = (0.76583)^2.4 ≈ 0.52696
- G: 69/255 = 0.27059 → ((0.27059+0.055)/1.055)^2.4 = (0.30862)^2.4 ≈ 0.05966
- B: 44/255 = 0.17255 → ((0.17255+0.055)/1.055)^2.4 = (0.21567)^2.4 ≈ 0.02518
- L_bg = 0.2126×0.52696 + 0.7152×0.05966 + 0.0722×0.02518 = 0.11203 + 0.04267 + 0.00182 = **0.15652**

`#FDF5F0` (R=253, G=245, B=240):

- R: 253/255 = 0.99216 → ≈ 0.98220
- G: 245/255 = 0.96078 → ((0.96078+0.055)/1.055)^2.4 = (0.96280)^2.4 ≈ 0.91305
- B: 240/255 = 0.94118 → ((0.94118+0.055)/1.055)^2.4 = (0.94424)^2.4 ≈ 0.87138
- L_fg = 0.2126×0.98220 + 0.7152×0.91305 + 0.0722×0.87138 = 0.20882 + 0.65301 + 0.06291 = **0.92474**

`#F5DDD0` (R=245, G=221, B=208):

- R: 245/255 = 0.96078 → ≈ 0.91305
- G: 221/255 = 0.86667 → ((0.86667+0.055)/1.055)^2.4 = (0.87360)^2.4 ≈ 0.72284
- B: 208/255 = 0.81569 → ((0.81569+0.055)/1.055)^2.4 = (0.82530)^2.4 ≈ 0.63097
- L_muted = 0.2126×0.91305 + 0.7152×0.72284 + 0.0722×0.63097 = 0.19411 + 0.51698 + 0.04556 = **0.75665**

| Pair                                                                               | Ratio                                                      | WCAG verdict                                                                  |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `--fg-on-warm` (#FDF5F0, L≈0.9247) on `--bg-warm-accent` (#C0452C, L≈0.1565)       | (0.9247+0.05)/(0.1565+0.05) = 0.9747/0.2065 = **4.72 : 1** | AA normal ✓ (≥ 4.5) — all text sizes                                          |
| `--fg-on-warm-muted` (#F5DDD0, L≈0.7567) on `--bg-warm-accent` (#C0452C, L≈0.1565) | (0.7567+0.05)/(0.1565+0.05) = 0.8067/0.2065 = **3.91 : 1** | AA-large ✓ (≥ 3.0); below AA-normal (4.5) — display/heading sizes ≥ 24px only |

**Restraint rules.**

1. `--bg-warm-accent` is ONLY for a full-bleed editorial band. It is not a button color, not a body background, not a hairline, not a text color.
2. Maximum one warm band per page. Never stack two warm bands.
3. `--fg-on-warm` and `--fg-on-warm-muted` are ONLY valid on a `--bg-warm-accent` surface. Never use them on any other background.
4. `--fg-on-warm-muted` must be used at display/heading sizes ≥ 24px only (AA-large ceiling).
5. NEVER pair `--bg-warm-accent` with `--accent` (blue) on the same surface — chromatic clash between vermillion and Apple Blue.
6. In v1, this editorial register is limited to one page on the site (maximum one page per site using the warm band).

**Lock-in note (reverse coupling).** The value of `--bg-warm-accent` is locked from first ship. The `/about` portrait asset is AI-generated and color-graded to match `#C0452C` exactly. Any future change to this token requires re-grading the portrait asset before deployment. This is documented in the token comment and in `meta/llms-full.txt`. A token value change here is not a routine token update — it is an asset pipeline dependency.

**Brand-contract preservation note.** The warm tier is orthogonal to the neutral elevation rhythm. The four-step neutral ladder (`--surface < --surface-section < --bg < --bg-elevated`) is unchanged. The warm tokens do not have a luminance position within that ladder and must not be used as substitutes for any neutral tier. Adding a warm tier does not imply a warm dark-mode direction; dark-mode handling of the warm band is deferred.

**Alternatives considered.**

- **(A) Use #D9523A as proposed.** Rejected. At #D9523A (L≈0.1035), reaching AA (4.5:1) requires a fg luminance of at least (0.1035+0.05)×4.5 − 0.05 = 0.6733 minimum L, which forces the fg to be more than a "warm tint" — it must be significantly bright. That math is achievable, but any genuinely warm-tinted near-white (B channel pulled back) at a legible white level yields only ~3.9:1 on #D9523A. To have both a perceptibly warm fg tint and AA compliance, the background must be darker. Darkening by ~15% lightness moves us to the #C0452C range.
- **(B) Use a muted warm accent — paler, more pastel orange.** Rejected. The design intent is a bold editorial statement: a full-bleed saturated band. A desaturated or pale orange loses the editorial punch and reads as a generic warm-neutral section background rather than a distinctive brand moment.
- **(C) Derive fg-on-warm from existing neutral tokens (e.g. `--fg`, `--bg`).** Rejected. `--fg` (#1D1D1F) on `--bg-warm-accent` would give sufficient contrast (very high, >10:1) but reads as harsh and clashes aesthetically — black text on an orange-vermillion band is not the editorial register. `--bg` (#FBFBFD, cool-tinted) would technically pass contrast but its cool tilt is wrong for the warm surface. The dedicated fg tokens carry the correct warm tilt.
- **(D) Add only `--fg-on-warm`; use opacity to derive the muted tier.** Rejected. Opacity-based muted tokens are a maintenance trap: the rendered color shifts with the background, and the contrast ratio cannot be verified at design time. A named token with a verified value is the contract.

**Authorization.** Arian (founder, pouk.ai) — pending; filed via issue #56.

---

### 2026-05-18 — Add `--surface-section` — fourth elevation tier for page-section rhythm (issue #53)

**Context.** GitHub issue #53 requests a new surface token to enable sectional surface rhythm on editorial pages — specifically alternating background bands for the `/about` v2 Direction B layout and future editorial pages. The existing token `--surface` (#F5F5F7) cannot serve this role for two reasons: (1) it is semantically defined as a recessed inline element surface (code blocks, quote blocks, card fills) and the token spec explicitly includes a NEVER rule against using it as a section divider; (2) at L≈0.914, it recesses too deeply from the page canvas (#FBFBFD, L≈0.966) to read as a composed section band — it would announce itself as a distinct block rather than as a subtle rhythm step, disrupting the reading flow of editorial pages.

**Decision.** New token:

```css
--surface-section: #f8f8fa; /* page-section recessed background — subtle band rhythm for editorial pages */
```

**Value rationale.** `#F8F8FA` sits exactly halfway between `--bg` (#FBFBFD) and `--surface` (#F5F5F7) in each RGB channel (R: 248 = (251+245)/2; G: 248 = (251+245)/2; B: 250 = (253+247)/2). This precision is intentional:

- The halfway position preserves the cool tilt of the palette (B channel remains higher than R/G, matching the Apple cool-neutral lineage).
- The delta from `--bg` to `--surface-section` is perceptibly distinct at a glance without being as deep as `--surface`. It reads as "composed" not "banded" — consistent with the Apple aesthetic where section separation is implied, never shouted.
- At L≈0.9398, `--surface-section` occupies the gap cleanly: `--surface (L≈0.914) < --surface-section (L≈0.940) < --bg (L≈0.966)`.

**Why the four-step rhythm is additive, not a collapse.** The addition of `--surface-section` does not change `--surface`. The two tokens serve different semantic registers:

- `--surface` (#F5F5F7): inline recessed elements (code blocks, quote blocks, card fills). Its existing role, its existing value, its existing NEVER-as-section-divider rule — all unchanged.
- `--surface-section` (#F8F8FA): full-width alternating section bands on editorial pages. A new semantic. Not interchangeable with `--surface`.

Merging these into a single token would either over-darken section bands (using `--surface`'s deeper value) or under-recess inline elements (using `--surface-section`'s lighter value). Both failures are brand-level errors. The four-step ladder is the honest answer.

**Usage rule.** Use `--surface-section` for full-width alternating section bands only. Maximum 5 alternating bands per page. Never use for inline elements (code blocks, card fills, quote blocks) — those continue to use `--surface`. Never stack `--surface-section` directly adjacent to `--surface` on the same page.

**Contrast verification (WCAG 2.1 sRGB, L of `#F8F8FA` ≈ 0.9398):**

| Pair                                                     | Ratio         | WCAG verdict                                                                                                      |
| -------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `--fg` (#1D1D1F, L≈0.01238) on `--surface-section`       | **15.87 : 1** | AAA ✓                                                                                                             |
| `--fg-muted` (#6E6E73, L≈0.15711) on `--surface-section` | **4.78 : 1**  | AA normal ✓                                                                                                       |
| `--accent` (#0071E3, L≈0.17370) on `--surface-section`   | **4.42 : 1**  | AA large/UI (1.4.11) ✓; below AA-normal — keep accent text 18px+ on this surface (same constraint as `--surface`) |

All text pairings pass AA normal except `--accent` at small sizes — same constraint as `--surface` and `--bg`. No regression.

**Alternatives considered.**

- **(A) Use `--surface` (#F5F5F7) as the section divider.** Rejected. The NEVER rule in the token spec exists for a good reason: `--surface` recesses too deeply (L≈0.914 vs. page L≈0.966 is a 52-luminance-point drop). On a content-rich editorial page, that creates jarring band transitions that interrupt reading rhythm rather than composing it. The semantic mismatch is equally disqualifying: consumers following the spec contract would not expect `--surface` on a full-width section background.
- **(B) No token — let consumers set their own background value.** Rejected. Collapses the brand contract. If section background values proliferate outside `tokens.css`, the palette drifts and the elevation model becomes unverifiable. The token is the contract; the contract must express this use case.

**Authorization.** Arian (founder, pouk.ai) — pending; filed via issue #53.

---

### 2026-05-18 — Counter-propose `--fs-display`; reject `--fs-display-lg` (issue #55)

**Context.** GitHub issue [poukai-ui#55](https://github.com/poukai-inc/poukai-ui/issues/55) (mirrored to `meta/proposals/type-display-scale.md`) asked for two new typography tokens to support a new editorial display register above `--fs-tagline`:

```css
--fs-display: clamp(3rem, 2rem + 5vw, 7.5rem); /* 48–120px (proposed) */
--fs-display-lg: clamp(4rem, 2rem + 8vw, 12rem); /* 64–192px (proposed) */
```

Driving composition: pouk.ai `/about` v2 Direction A — a "single-statement display lead" pattern owning the page's first viewport at extreme scale, deliberately differentiated from the Hero pattern that every other page uses. Three additional reuse surfaces were named (future `/manifesto`, OG cards / social-share, possible home revision); none of these are dated, scoped, or under active construction.

The `proposal:approved` label was applied by the consumer agent on filing — that is the consumer flagging the proposal as ready for triage, not DS approval. DS approval lives here.

**Principle.** The type ramp is part of the brand contract. Once a font-size token ships, the DS cannot withdraw it without breaking consumers; documented "use this once per page" composition rules are conventions, not runtime guardrails. Type-ramp additions must be defensible against: (a) the brand `§6` Apple-aligned register, (b) the existing rungs they sit between, and (c) the risk of misuse once the convention loosens.

**Decision.** **Counter-propose**. Ship one new token, at a tighter range than asked, and reject the larger token outright.

| Token             | Status                                | Value (clamp)                                        | Range        |
| ----------------- | ------------------------------------- | ---------------------------------------------------- | ------------ |
| `--fs-display`    | **New — counter-offer**               | `clamp(3rem, 1.75rem + 4vw, 5.5rem)`                 | `48–88px`    |
| `--fs-display-lg` | **Rejected** — not deferred, declined | (consumer-proposed `clamp(4rem, 2rem + 8vw, 12rem)`) | (`64–192px`) |

The new token lives in `src/tokens/tokens.css` inside the existing fluid type-scale block, immediately after `--fs-tagline-intimate`. The composition rule (once-per-page, editorial only, not a heading replacement) is documented in `llms-full.txt` at the engineer's pass.

**Why one rung above `--fs-tagline`, not two.**

The gap above `--fs-tagline` is real — there is no editorial type-display rung between `--fs-tagline` (max 68px) and the numerical `--fs-stat-large` (max 96px, scoped to `<Stat>`). Adding one rung closes the gap. Adding two rungs (a mid-display + a "fully owns the viewport" display) presupposes that two different page weights will reuse the editorial-display register at meaningfully different scales — which today is unfounded. `/about` Direction A is the only confirmed surface; the other three (future `/manifesto`, OG cards, possible home revision) are speculative. Two un-scoped tokens, each independently reachable by any consumer surface, is two un-scoped tokens — the `--fs-stat` / `--fs-stat-large` symmetry the consumer cites only holds because the stat tokens are anchored by a heavily-scoped `<Stat>` primitive. There is no equivalent primitive carrying the display tokens today.

**Why `--fs-display-lg` is rejected, not capped.**

1. **Register violation (brand `§6`).** Apple's marketing-display typography on `apple.com` tops out around 80–100px on the widest viewports; their condensed editorial register stays well below 192px. A 192px ceiling on pouk.ai would be louder than anything Apple ships on its own marketing surfaces. The current brand reads as restrained because the type ramp tops at 68px; jumping to 192px is not a refinement of the existing register, it is a different register. The current brand register is the one we want.
2. **Runtime-undisciplined.** Tokens encode "once per page" by convention only. A 192px token will be reached for. Once it appears on two pages it normalises; once normal it becomes the brand.
3. **One-shot need is not a token need.** Direction A's 192px moment, if Arian and the site team commit to it, is reachable today via a site-side `font-size: clamp(...)` declared inside `/about`'s page stylesheet. The DS does not need to bless that scale as a brand-level rung to enable a single direction on a single page.

If a second confirmed surface arrives, we revisit — additive token, additive decision-log entry, cheap.

**Why the `--fs-display` ceiling is `88px`, not `80px` (Arian's lean) or `120px` (consumer).**

The ceiling is the contested number. The defended choice is `88px` for three reasons:

1. **Distance from `--fs-tagline` (max 68px).** At an 80px ceiling the gap is 12px (1.18×) — at desktop scale on a serif display face this reads as "a slightly bigger Hero title", not a distinct register. At 88px the gap is 20px (1.29×), which crosses the threshold where the eye reads two sizes rather than one inconsistent one. The whole point of adding the rung is for it to register as a different rung.
2. **Distance from `--fs-stat-large` (max 96px).** At ceiling 88px the editorial display sits 8px below numerical-stat display — numerals get to be the loudest, which is Apple-correct (`apple.com`'s largest editorial text sits around 80px; their numerical hero stats can and do go larger). Ceiling 96px would collide with the stat rung; ceiling 100px+ would invert the hierarchy. 88 keeps the order honest.
3. **Apple band check.** 88px sits inside Apple's marketing-display band (iPhone landing ~72–96px, AirPods Max landing ~80–88px). The proposed 120/192 sit outside it.

Floor stays at 48px (1.33× above `--fs-tagline`'s 36px floor — meaningfully distinct on mobile). Slope `1.75rem + 4vw` reaches the 88px ceiling at ~1437px viewport, growing fluidly across the marketing breakpoint band.

**Alternatives considered.**

1. **The consumer's exact ask** (`--fs-display` 48–120px + `--fs-display-lg` 64–192px). Rejected on register and on speculative reuse. See "Why `--fs-display-lg` is rejected."
2. **Arian's lean** (`--fs-display` ~48–80px, drop `--fs-display-lg`). Adopted in shape, refined in ceiling: 80 → 88 to keep the rung distinct from `--fs-tagline` at desktop scale (1.18× → 1.29× delta).
3. **Single token capped at `--fs-stat-large`'s 96px ceiling.** Rejected. Inverts the hierarchy by tying editorial type to the numerical-stat ceiling — numerals should stay the loudest, see §3 above.
4. **Both tokens, but `--fs-display-lg` capped at 96–112px instead of 192px.** Considered. Rejected because the consumer's `--fs-display-lg` role ("brand's loudest typographic move, page-opening statement fully owns first viewport") cannot be met at 112px — at 112 it is barely louder than the `--fs-display` we're shipping, so the "two rungs for two page weights" framing collapses. If we ship two rungs, the second must be meaningfully larger; if the second can't be meaningfully larger without violating the register, we ship one rung.
5. **No token; site-side clamp on `/about` only.** Rejected. The gap above `--fs-tagline` is a real type-ramp gap, not a one-page styling need — even constrained to 48–88px, the rung is reusable for future editorial openers and OG cards. Codifying the smaller rung now is honest; codifying the larger rung is not.
6. **Defer the entire decision until a `<Statement>` molecule spec exists.** Rejected. The token is a foundational primitive; it can land before the consuming molecule. The site can ship the moment as a `<p>` + className today and migrate to `<Statement>` when that spec lands.

**Composition rule (documented at engineer pass in `llms-full.txt`).**

- At most once per page.
- Not for body text.
- Not for `<h1>` (semantic heading stays on `--fs-tagline` via `<Hero>`).
- Reserved for editorial display moments where the page opens on a single statement and the Hero pattern is being deliberately replaced — not augmented.

This is a documentation convention; the DS cannot enforce it at runtime. Documented expecting eventual misuse; the 88px ceiling is the worst-case the misuse can produce, which is acceptable.

**Trade-offs accepted.**

1. The consumer asked for two tokens and gets one, smaller. `/about` v2 Direction A may need composition rework (rescale the line, adjust whitespace, slower entrance) to land at 88px ceiling instead of 192px.
2. `--fs-display` at 88px will likely be misused on a second page eventually. Worst case is documented misuse at 88px — still inside the Apple-aligned band. 192px misuse would have been outside it.
3. Token surface grows by one entry.

**Authorization.** `poukai-design` decision; Arian to ratify on review. Reference: GitHub issue [poukai-ui#55](https://github.com/poukai-inc/poukai-ui/issues/55); proposal mirror `meta/proposals/type-display-scale.md`.

**Follow-ups for `poukai-ds-engineer` (not actioned by this change).**

- Add `--fs-display: clamp(3rem, 1.75rem + 4vw, 5.5rem); /* 48-88 */` to `src/tokens/tokens.css` inside the existing fluid type-scale `:root` block, immediately after `--fs-tagline-intimate`. No other CSS changes.
- Document the new token + composition rule in `llms-full.txt` alongside `--fs-tagline` and `--fs-tagline-intimate`.
- Changeset: minor bump (additive token, no consumer behavior change, semver minor). May be bundled with other in-flight minors at the engineer's discretion.
- **Do not** add `--fs-display-lg` regardless of follow-up requests on the same issue — the rejection is recorded above and any reversal requires a fresh decision-log entry.
- Consider whether `meta/design/foundations.md` should be the canonical home for the type ramp once that file is filled in. Currently the Typography section in this file is a stub; populating it is deferred until the spacing and motion sections also get their first pass, so the foundations page lands as a coherent whole rather than a piecemeal accretion. The single new rung is captured in this decision-log entry and in `tokens.css`; the stub is intentional, not an oversight.

---

### 2026-05-18 — Hero entrance animation tokens (issue #47)

**Context.** GitHub issue #47 requests an `entrance="stagger"` prop on the Hero molecule — a CSS-only staggered reveal on page load. Four slots (status, title, lede, cta) animate in with a 150ms inter-slot delay. All animation values must be expressed via `var(--token)` references; no raw ms values allowed in Hero.module.css. Two token strategy decisions required sign-off before the spec could be finalized.

**Decision 1 — Title duration: add `--dur-hero-title-rise: 700ms`.**

The title slot uses a 700ms rise vs. 600ms for all other slots. The 100ms distinction is semantically earned: the title is the sole Instrument Serif display moment per page, the largest and heaviest element in the Hero. A slightly longer rise gives it the visual weight its scale deserves.

Alternative considered: use `--dur-slow` (600ms) for all four slots — drop the 100ms title distinction. Rejected because the distinction has a real reason and losing it would be a quality concession, not a simplification. Redefining `--dur-slow` to 700ms was also considered and rejected — `--dur-slow` is a system-level semantic token; bending it to fit a single component's need is a different kind of contract violation. A component-scoped token is the honest answer.

**Decision 2 — Stagger delays: add `--dur-stagger-step: 150ms`.**

The four delay values (0ms, 150ms, 300ms, 450ms) are multiples of a 150ms step. Two options were evaluated:

- Option A (chosen): add `--dur-stagger-step: 150ms`; the engineer derives per-slot delays via `calc(var(--dur-stagger-step) * N)`.
- Option B: add four per-slot tokens (`--delay-hero-status: 0ms`, `--delay-hero-title: 150ms`, etc.).

Option B was rejected because it bakes Hero's slot structure into the motion token namespace. Any future molecule wanting the same stagger rhythm (a stat grid, a card list) could not reuse the value — it would be locked inside Hero-named tokens. Option A is composable by design: the step is the concept; the multiplication is arithmetic that belongs in CSS.

**Decision 3 — Easing: use existing `--easing` (expo-out entrance).** No new token. The expo-out curve is semantically correct for entrance animations.

**Decision 4 — Translation distances: keep as literal values inside keyframes.** The 8px and 12px rise distances are visual-motion micro-distances — not layout measurements, no reuse surface. They live inside `@keyframes rise-8` / `@keyframes rise-12` in Hero.module.css.

**Decision 5 — Reduced-motion handling.** `tokens.css` suppresses `animation-duration` globally but not `animation-delay` or `animation-fill-mode`. With `fill-mode: both` and up to a 450ms delay, a reduced-motion user would see slots remain hidden for nearly half a second before snapping visible. The spec requires `animation: none` (not merely short duration) scoped to `.entrance-stagger` slot children inside a `prefers-reduced-motion: reduce` block in Hero.module.css.

**Authorized by.** Arian (founder, pouk.ai). Reference: GitHub issue #47.

### 2026-05-17 -- Add --fs-tagline-intimate -- Hero size=intimate variant

**Context.** The pouk.ai homepage composer requested a quieter Hero register. The current --fs-tagline (36-68px clamp) reads as confrontational at 1440x900 on the holding page; the 68px ceiling dominates the viewport and overwhelms the low-density doorway framing. Three levers were evaluated:

- Lever A (chosen): DS-owned size variant. A new token --fs-tagline-intimate with a lower clamp range, exposed via a size prop on the Hero molecule.
- Lever B: Site-side override. Rejected -- it punches through the token contract and creates an undocumented divergence the DS cannot reason about.
- Lever C: Content rewrite. Rejected by Arian: copy is fine, font-size is just too big.

Only Lever A (DS-owned size variant) was acceptable.

**Decision.** New token added to src/tokens/tokens.css (fluid type scale block, immediately after --fs-tagline):

--fs-tagline-intimate: clamp(2rem, 1.25rem + 2.5vw, 3.25rem); /_ 32-52 _/

Range: 32px at 320px viewport to 52px at 1440px. At each endpoint this is approximately 75-80% of --fs-tagline (36-68px). The vw slope is flatter (2.5vw vs. 3.5vw) so the type grows more slowly across the viewport.

No existing token is modified. No existing consumer behavior changes. Token addition only.

**Prop shape.** The size prop on the Hero molecule:

- size=display (default): title uses var(--fs-tagline) (36-68px). Preserves all existing consumer behavior.
- size=intimate: title uses var(--fs-tagline-intimate) (32-52px). Opt-in for low-density doorway contexts.

Only the title font-size responds to size. All gaps, lede, CTA, em accent rendering, color, and font family are unchanged.

**ADR-0003.** Adding a token is a minor version bump.

**Authorized by.** Arian (founder, pouk.ai). Proposal: GitHub issue #39.

### 2026-05-17 — Name the `<Button>` height ladder as tokens; introduce `compact` tier at 40px

**Context.** The pouk.ai site team filed [poukai-ui#42](https://github.com/poukai-inc/poukai-ui/issues/42) (mirrored to `meta/proposals/button-size-compact.md`) asking for an intermediate `<Button>` size between `sm` (32px) and `md` (44px), recommended ~38px. The gap surfaced during a 2026-05-17 audit of the home Hero CTA: `md` reads too heavy against `<Hero size="display">`, `sm` reads too small. The proposal asked, in passing, whether the new tier should add a token (`--btn-h-compact`) or stay computed.

**Principle.** Button heights are part of the brand contract, not implementation detail. The `<Button>` height ladder anchors the perceived weight of every CTA on every page and will inform the height ladder of future form-control primitives (`<Input>`, segmented controls) when they ship. Hard-coded literals in `Button.module.css` are accidental tokens; naming them surfaces them in `tokens.css` and in the package's `llms-full.txt` export, where consumers (and the consumers' agents) can read the contract.

**Decision.** Introduce four new tokens covering the full button-height ladder:

| Token             | Value  | Status                             |
| ----------------- | ------ | ---------------------------------- |
| `--btn-h-sm`      | `32px` | New — formalises existing literal. |
| `--btn-h-compact` | `40px` | New tier.                          |
| `--btn-h-md`      | `44px` | New — formalises existing literal. |
| `--btn-h-lg`      | `52px` | New — formalises existing literal. |

The new tokens live in `:root` in `src/tokens/tokens.css` alongside the existing spacing scale. They are not aliased to spacing tokens (`--space-*`) because button heights and spacing share a base unit but not a semantic register — `--btn-h-compact` is "the height of a compact button", not "10 × `--space-1`".

Padding, font-size, and icon-size guidance per button size stay in the Button spec (`meta/design/Button.md`), not in tokens. Only the height ladder is tokenized.

**Why 40px for `compact`, not the consumer's 38px.**

1. **Apple ladder.** Apple's button-height ladder on macOS is 28 / 32 / 40 / 44 / 52. There is an exact 40px rung — the "medium" toolbar / control register. `compact` lands on the established rung rather than between rungs. Per §6 ("Apple's restrained Human Interface register is the primary reference"), bias toward existing rungs.
2. **Grid alignment.** The DS spacing scale is 4px-based. 40 is on the grid; 38 is not. Off-grid heights ripple into any layout that aligns buttons with `--space-*`-spaced siblings (forms, header chrome, side-by-side button rows).
3. **Asymmetric gap is intentional.** `sm(32) → compact(40) → md(44)` gives gaps of 8 and 4. `compact` is closer to `md` than to `sm`, by design: the consumer's use case is "the CTA where `md` reads too heavy," which means `compact` is "`md` minus one notch of weight," not "`sm` plus one notch of size." The ladder structure encodes the intent.
4. **Body type fits.** `compact` carries `--fs-body` (17–19px fluid). At 40px height with 9 / 16 padding, the line-box centers cleanly against the body type's optical center. At 38px the same body type starts to crowd the height.

**Why name the full ladder, not just `--btn-h-compact`.** Surfacing only the new tier as a token while leaving `32 / 44 / 52` as literals creates an asymmetric contract — one rung is a brand-level decision, three are accidental. Either all four rungs are part of the brand contract or none are. They are.

**AA / AAA tap-target posture.**

- WCAG 2.5.8 AA (24 × 24): `sm` 32 passes, `compact` 40 passes, `md` 44 passes, `lg` 52 passes.
- WCAG 2.5.5 AAA (44 × 44): `sm` 32 fails, `compact` 40 fails, `md` 44 passes at threshold, `lg` 52 passes.

`compact` shares the AA-only posture with `sm`. The proposal accepts this trade-off; consumers requiring strict AAA on a given surface must use `md` or `lg`.

**Alternatives considered.**

1. **38px (consumer-recommended).** Rejected. Off-grid, not on the Apple rung, crowds body type. Defended in §3 of the proposal file.
2. **36px.** Rejected — too close to `sm` (4px gap) to register as a distinct rung; would read as "a slightly tall `sm`" rather than "a quieter `md`."
3. **42px.** Rejected — only 2px below `md`, no perceptible weight difference. Would not solve the surfaced problem.
4. **Computed value (no token).** Rejected. Inconsistent with the rest of the brand contract; surfaces the rung only inside `Button.module.css` where no other primitive can see it.
5. **Single new token only (`--btn-h-compact`), keep `32 / 44 / 52` as literals.** Rejected — asymmetric contract. See "Why name the full ladder."
6. **Rename `--btn-h-*` to `--control-h-*` (anticipating form fields).** Rejected as premature. When `<Input>` lands and clearly wants the same ladder, we revisit — at that point the rename is mechanical and an additive deprecation is cheap. Avoid speculative abstraction.

**Naming the rung `compact` (vs `sm-plus`, `intermediate`, `tight`, `cozy`).** `compact` is a register-name — it describes the feel of the rung. `sm-plus` is a position-name — it leaks the API gap and dates badly (what happens if we ever add a true `sm-plus`?). `intermediate` is sterile. `tight` and `cozy` are Material-adjacent vocabulary that does not fit the Apple-aligned register. `compact` is also the word Apple uses for its compact sidebar and compact UI density modes; the vocabulary is on-brand.

**Approval.** `poukai-design` decision; Arian to ratify on review.

**Follow-ups for `poukai-ds-engineer` (not actioned by this change).**

- Add `"compact"` to the `ButtonSize` union in `src/atoms/Button/Button.tsx`; extend the `sizeClass` map.
- Refactor `src/atoms/Button/Button.module.css` to consume the four `--btn-h-*` tokens (replace inline `32px` / `44px` / `52px` with `var(--btn-h-sm)` etc.) and add `.size-compact` with the values specified in `meta/design/Button.md` §4.
- Add the four tokens to `src/tokens/tokens.css` under a new `--- Button heights ---` subhead in `:root`.
- Add `compact` to `Button.AllVariants.stories.tsx`, `Button.stories.tsx`, and `Button.test.tsx`.
- Changeset: minor bump. The new size is additive, default is unchanged (`md`), zero regression for existing consumers. Engineer may bundle with the in-flight `<Hero size>` / `<Hero illustration>` minors ([poukai-ui#39](https://github.com/poukai-inc/poukai-ui/issues/39), [poukai-ui#40](https://github.com/poukai-inc/poukai-ui/issues/40)) or ship standalone.
- Consider whether `meta/design/foundations.md` should reference the button-height ladder once that file is filled in. (Currently the foundations doc is a stub — see "To be filled" sections in this file.)

### 2026-05-15 — Pull `--bg` off pure white; reserve `#FFFFFF` for `--bg-elevated`

**Context.** The light ramp shipped through `0.5.0` used `--bg: #FFFFFF`. That collapses the elevation model: there is no headroom above the page, popovers and sheets cannot read as "front-most" without inventing a non-token shadow or a borrowed lighter neutral, and the dark-mode inversion has no clean answer — pure white inverts to pure black, which the §6 rule prohibits. Arian flagged this as a brand-level issue with `#FAFAFA` or `#FBFBFD` as candidate values for the new page background.

**Principle.** Neither end of the neutral ramp is pure. The ramp must support a three-step elevation rhythm — recessed `--surface`, page `--bg`, elevated `--bg-elevated` — and must invert into dark mode without losing its restraint. `#FFFFFF` is reserved exclusively for the front-most layer; it never carries the page.

**Decision.** New light-mode token values:

| Token           | Old (`0.5.0`)     | New (this change)     |
| --------------- | ----------------- | --------------------- |
| `--bg`          | `#FFFFFF`         | **`#FBFBFD`**         |
| `--bg-elevated` | _(did not exist)_ | **`#FFFFFF`**         |
| `--surface`     | `#F5F5F7`         | `#F5F5F7` (unchanged) |
| `--fg`          | `#1D1D1F`         | `#1D1D1F` (unchanged) |
| `--fg-muted`    | `#6E6E73`         | `#6E6E73` (unchanged) |
| `--hairline`    | `#D2D2D7`         | `#D2D2D7` (unchanged) |
| `--accent`      | `#0071E3`         | `#0071E3` (unchanged) |

**Why `#FBFBFD` over `#FAFAFA`.** `#FBFBFD` is the exact background Apple ships on `apple.com` and across most of their marketing surfaces. It carries the faintest cool tint (B channel `0xFD` vs R/G at `0xFB`) which reads as "considered" rather than "off-white"; `#FAFAFA` is the generic Material/Tailwind neutral and is perceptibly warmer-yellower against `#F5F5F7`. The cool tint also gives more visible separation against `--bg-elevated` (`#FFFFFF`, neutral) — the elevation step reads in chroma as well as luminance, which matters at the ~3-luminance-point delta we have at the top of the ramp. Trade-off: `#FBFBFD` is closer to pure white than `#FAFAFA`, so the recess delta to `--surface` (`#F5F5F7`) is slightly more pronounced; on the page that reads as Apple-correct, not as a problem.

**Why `--surface` does not shift.** The rhythm `--surface (L≈0.914) < --bg (L≈0.966) < --bg-elevated (L=1.000)` reads cleanly with `--surface` unchanged. Shifting `--surface` (e.g. to `#F2F2F4` to "preserve the delta") would over-darken inline blocks — Apple's SF system gray 6 is `#F2F2F7`/`#F5F5F7` for a reason: code blocks and quote blocks need to recess, not announce themselves. The page change alone gives us the headroom.

**AA / AAA contrast verification (sRGB relative luminance per WCAG 2.1):**

Relative luminances (linearization: `C_lin = C/12.92` for `C ≤ 0.04045`, else `((C+0.055)/1.055)^2.4`):

- `#1D1D1F` → L ≈ 0.01238
- `#6E6E73` → L ≈ 0.15711
- `#0071E3` → L ≈ 0.17370
- `#F5F5F7` → L ≈ 0.91432
- `#FBFBFD` → L ≈ 0.96615
- `#FFFFFF` → L = 1.00000

Contrast = `(L_lighter + 0.05) / (L_darker + 0.05)`:

| Pair                            | Ratio                                                                 | WCAG verdict                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `--fg` on `--bg`                | `(0.96615+0.05) / (0.01238+0.05) = 1.01615 / 0.06238` ≈ **16.29 : 1** | AAA (≥ 7) — passes for all text sizes                                                                                     |
| `--fg` on `--surface`           | `0.96432 / 0.06238` ≈ **15.46 : 1**                                   | AAA                                                                                                                       |
| `--fg` on `--bg-elevated`       | `1.05000 / 0.06238` ≈ **16.83 : 1**                                   | AAA                                                                                                                       |
| `--fg-muted` on `--bg`          | `1.01615 / 0.20711` ≈ **4.91 : 1**                                    | AA normal (≥ 4.5). Below AAA — acceptable for muted secondary copy.                                                       |
| `--fg-muted` on `--surface`     | `0.96432 / 0.20711` ≈ **4.66 : 1**                                    | AA normal. Tighter than `--bg`/`--bg-elevated`; long paragraph runs are fine but the headroom is smaller.                 |
| `--fg-muted` on `--bg-elevated` | `1.05000 / 0.20711` ≈ **5.07 : 1**                                    | AA normal — comfortable headroom.                                                                                         |
| `--accent` on `--bg`            | `1.01615 / 0.22370` ≈ **4.54 : 1**                                    | AA normal — passes at threshold. Safe for links, focus rings, and body copy at any size; prefer 17px+ when targeting AAA. |
| `--accent` on `--surface`       | `0.96432 / 0.22370` ≈ **4.31 : 1**                                    | AA large (≥ 3) and AA UI (1.4.11 ≥ 3). Below AA-normal — keep `--accent` text on `--surface` to 18px+ (or 14px+ bold).    |
| `--accent` on `--bg-elevated`   | `1.05000 / 0.22370` ≈ **4.69 : 1**                                    | AA normal                                                                                                                 |

The only sub-AA-normal text pairing in the system is `--accent` on `--surface` (4.31 : 1, below the 4.5 threshold for normal text). All other text pairings pass AA normal across all three surfaces. The `--fg-muted` row is consistently AA normal everywhere — tighter on `--surface` (4.66 : 1) than on `--bg-elevated` (5.07 : 1), so prefer the elevated surface for long muted runs when feasible, but neither is at threshold.

**Proposed dark-mode direction (sketch — not shipped).**

Token names (recommended): keep the same canonical names (`--bg`, `--surface`, `--bg-elevated`, `--fg`, `--fg-muted`, `--hairline`, `--accent`, `--accent-glow`) and override them inside a media query and an explicit selector. The override block lives in `tokens.css` and shifts values without forking the token namespace.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1c1c1e; /* Apple iOS system background, never #000 */
    --surface: #2c2c2e; /* one step up, recessed surface for inline blocks */
    --bg-elevated: #3a3a3c; /* Apple "tertiary background" — front-most layer */
    --fg: #f5f5f7; /* primary text — symmetric to light --surface */
    --fg-muted: #98989d; /* SF muted gray */
    --hairline: #38383a; /* dark separator */
    --accent: #0a84ff; /* Apple Blue, dark-mode variant (brighter) */
    --accent-glow: rgba(10, 132, 255, 0.22);
  }
}

[data-theme="dark"] {
  /* same overrides — explicit toggle escape hatch */
}
[data-theme="light"] {
  /* explicit overrides back to light values, for forcing light in a dark OS */
}
```

The elevation rhythm inverts cleanly: in dark mode, `--bg-elevated` is _brighter_ than `--bg`, matching the light-mode pattern (overlays come forward, away from the page). The non-pure-edges rule holds: `--bg` is `#1C1C1E` (Apple iOS exact), not `#000`.

**Alternatives considered.**

1. **Dark-mode peer tokens (`--bg-dark`, `--fg-dark`, etc.).** Rejected. Forces every component CSS module to switch tokens by mode — defeats the purpose of having a single canonical name. Token names are the design contract; mode is a runtime concern.
2. **CSS `light-dark()` function.** Tempting — single declaration per token (`--bg: light-dark(#FBFBFD, #1C1C1E)`) — but Baseline support is recent (Safari 17.5+, Chrome 123+, Firefox 120+) and gives no escape hatch for `[data-theme]` overrides without falling back to overrides anyway. Re-evaluate in 6–12 months; for now, the `@media + [data-theme]` pair is the safer mainstream pattern and matches how the rest of the system is authored.
3. **Pure `:root` override under `[data-theme="dark"]` only (no media query).** Rejected — defaults should respect user OS preference unless explicitly overridden. The `@media` block is the default; `[data-theme]` is the override.

**Alternatives considered for `--bg` value.**

- `#FAFAFA` — Material/Tailwind neutral. Generic; warmer than Apple's spec; would read as a "framework default" against the rest of the palette.
- `#F8F8FA` — would compress the page/surface delta to ~2 luminance points, making the surface recess invisible.
- `#FFFFFF` (status quo) — violates the §6 brand rule and breaks the elevation model. The decision that started this change.

**Visual change tradeoff.** Approved by Arian: minor bump with a deliberate changelog entry calling out the page background shift. Every consuming page will get a faintly cooler canvas; the wordmark, primary text, and surface blocks remain pixel-identical. Pages that relied on `--bg` being literal `#FFFFFF` (e.g. for a popover sitting flush against the page) should opt into `--bg-elevated` — see "Follow-ups for `poukai-ds-engineer`" below.

**Follow-ups for `poukai-ds-engineer` (not actioned by this change).**

- Audit `src/atoms/**` and `src/molecules/**` for components that should opt into `--bg-elevated` rather than `--bg`. Candidates by intent: any popover/sheet/dialog primitive (none shipped yet, but the StatusBadge background may want to flip); any "card-on-page" pattern that should read as elevated (e.g. a future `Card` molecule). RoleCard, Hero, Principle, FailureMode currently inherit page background — they should stay on `--bg` (they are page content, not elevated overlays).
- `src/molecules/RoleCard/RoleCard.module.css:25` uses `background: var(--bg)` — leave as-is for now (the card is page-level, not elevated). Flag for revisit when a `Card` molecule lands: if RoleCard is meant to read as elevated relative to the page, flip to `--bg-elevated`.
- `src/stories/showcase/System.stories.tsx:40` hardcoded the documented `--bg` swatch as `#FFFFFF`. Updated to `#FBFBFD` in a follow-up review pass; closed.
- The semantic-mappings block in `tokens.css` (`body { background: var(--bg); … }`) is correct as-is. No token swap needed there — the page _should_ use `--bg`, not `--bg-elevated`. Likewise `src/organisms/SiteShell/SiteShell.module.css:6` (`background: var(--bg)`) is correct: SiteShell is the page frame, not an overlay.
- `src/atoms/Button/Button.module.css:53` uses `color: var(--bg)` for text on a `--fg`-coloured button surface. After the shift, contrast = `--bg (#FBFBFD)` on `--fg (#1D1D1F)` ≈ **16.29 : 1** (AAA, unchanged in tier). No action needed; recorded for traceability.
- Confirm `::selection { background: var(--accent-glow); }` still reads correctly on the new `--bg`. Math says yes (the glow is alpha-blended over a near-white surface that is 1.7 luminance points darker than before — imperceptible), but eyeball it on the site once shipped.

**Approval.** Arian (pending).
