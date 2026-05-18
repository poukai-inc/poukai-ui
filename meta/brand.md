# Pouk AI brand decision log

> Maintained by the `poukai-design` agent. Authoritative for tokens, fonts, palette, motion, and mark rules. Every change to `src/tokens/tokens.css` lands here in the same commit.

## Foundations

### Color — primary, surface, semantic — with rationale and AA/AAA contrast pairs.

Pouk AI's color foundation is Apple's restrained Human Interface palette: SF system grays with Apple Blue as the only accent. The neutral ramp is deliberately compressed — there's only as much chroma as the operator-grade register can carry without becoming generic SaaS.

**Non-negotiable rule.** Neither end of the neutral ramp is pure. `--fg` pulls slightly off `#000` and the page `--bg` pulls slightly off `#FFFFFF`. Pure `#FFFFFF` is reserved exclusively for `--bg-elevated` — the front-most layer (popovers, sheets, modals, dialogs). This gives elevation headroom on the page and ensures the palette inverts cleanly to dark mode (see "Dark-mode direction" in `Decision history → 2026-05-15`).

#### Canonical light palette

| Token               | Value                  | Purpose                                                                                                                                              | Allowed pairings (text on this surface)                                                      | Contrast ratios verified                                                                                                                                                                                                        |
| ------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bg`              | `#FBFBFD`              | Page background. The default canvas.                                                                                                                 | `--fg` (primary), `--fg-muted` (secondary), `--accent` (links / focus, all text sizes at AA) | `--fg` on `--bg` = **16.29 : 1** (AAA); `--fg-muted` on `--bg` = **4.91 : 1** (AA normal); `--accent` on `--bg` = **4.54 : 1** (AA normal — at threshold)                                                                       |
| `--surface`         | `#F5F5F7`              | Recessed elevation. Code blocks, quote blocks, inline keys.                                                                                          | `--fg`, `--fg-muted`. Not for `--accent` text below 18px.                                    | `--fg` on `--surface` = **15.46 : 1** (AAA); `--fg-muted` on `--surface` = **4.66 : 1** (AA normal)                                                                                                                             |
| `--surface-section` | `#F8F8FA`              | Page-section recessed background. Full-width alternating section bands on editorial pages only. Subtler than `--surface`. NEVER for inline elements. | `--fg`, `--fg-muted`. Keep `--accent` text at 18px+ on this surface.                         | `--fg` on `--surface-section` = **15.87 : 1** (AAA); `--fg-muted` on `--surface-section` = **4.78 : 1** (AA normal); `--accent` on `--surface-section` = **4.42 : 1** (AA large/UI ✓; below AA-normal — keep accent text 18px+) |
| `--bg-elevated`     | `#FFFFFF`              | Front-most layer. Popovers, sheets, dialogs, dropdown menus.                                                                                         | `--fg`, `--fg-muted`, `--accent`                                                             | `--fg` on `--bg-elevated` = **16.83 : 1** (AAA); `--fg-muted` on `--bg-elevated` = **5.07 : 1** (AA normal); `--accent` on `--bg-elevated` = **4.69 : 1** (AA normal)                                                           |
| `--fg`              | `#1D1D1F`              | Primary text, wordmark stroke, sigil stroke.                                                                                                         | On `--bg`, `--surface`, `--bg-elevated`                                                      | See above. AAA on every surface.                                                                                                                                                                                                |
| `--fg-muted`        | `#6E6E73`              | Secondary copy: footer, captions, lede paragraphs, metadata.                                                                                         | On all three surfaces.                                                                       | See above. AA normal on every surface; comfortable headroom on `--bg-elevated` (5.07 : 1), tighter on `--surface` (4.66 : 1).                                                                                                   |
| `--hairline`        | `#D2D2D7`              | 1px dividers, table rules, borders.                                                                                                                  | Non-text; no contrast requirement for decorative rules.                                      | n/a — decorative. Reads as a true hairline on all three surfaces.                                                                                                                                                               |
| `--accent`          | `#0071E3`              | Status dot, link underline, focus ring, primary CTAs.                                                                                                | Use for non-text UI freely. For text, prefer 17px+ or against `--bg-elevated`.               | See above. WCAG 1.4.11 non-text contrast is satisfied on every surface (focus rings, status dots).                                                                                                                              |
| `--accent-glow`     | `rgba(0,113,227,0.18)` | Selection background, soft accent halos.                                                                                                             | Background only — never carries text.                                                        | n/a — decorative.                                                                                                                                                                                                               |

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
