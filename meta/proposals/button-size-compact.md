# Proposal: `<Button size="compact">` — intermediate size between `sm` and `md`

**Target**: `@poukai-inc/ui` `<Button>` atom
**Status**: Approved (extend existing primitive)
**Author**: pouk.ai site team (filed via GH issue [poukai-ui#42](https://github.com/poukai-inc/poukai-ui/issues/42), authored by `pouk-ai-designer` per composition §6, audit verdict 2026-05-17)
**Mirrored into the proposal log by**: `poukai-design`
**Filed**: 2026-05-17
**Decision**: 2026-05-17
**Decided by**: `poukai-design` (Arian to ratify on review)
**Implements proposal in spec**: [`meta/design/Button.md`](../design/Button.md)

---

## 1. Problem (from consumer)

`<Button>` currently exposes three sizes (from `@poukai-inc/ui@0.6.1`):

| Size | Min height     |
| ---- | -------------- |
| `sm` | 32px           |
| `md` | 44px (default) |
| `lg` | 52px           |

The 12px gap between `sm` and `md` is too coarse for editorial / brand-restrained surfaces where the CTA must read as an _actionable affordance_ — but also must not disappear into the page. On pouk.ai `/`, the Hero CTA at `md` (44px) reads too heavy against the brand's restraint-as-credential intent; at `sm` (32px) it reads too small against `<Hero size="display">`. The consumer is asking for an intermediate size, recommended ~38px.

Full proposal text lives on the GitHub issue. This file is the canonical in-tree record per `meta/proposals/README.md`.

---

## 2. Decision

**Outcome**: **Extend `<Button>`** with a new size, named `compact`, sitting between `sm` and `md`.

**Exact min-height**: **40px** (not the 38px the consumer recommended — defended below).

**Naming**: `compact`. Keep the consumer's choice.

**Token strategy**: introduce explicit height tokens for the full ladder (`--btn-h-sm`, `--btn-h-compact`, `--btn-h-md`, `--btn-h-lg`) so the new tier reads as a real rung rather than a magic number. Padding and font-size stay hand-tuned per size (existing convention — no new padding tokens).

**Scale-interpolation method**: hand-tuned, not linear. See §4.

Full design spec: [`meta/design/Button.md`](../design/Button.md). The engineer (`poukai-ds-engineer`) implements from that spec.

---

## 3. Why 40px, not 38px

The consumer recommended 38px as "the midpoint" between 32 and 44. I'm pushing to 40. Reasoning:

1. **Apple-aligned aesthetic (brand `§6`).** Apple's own button-height ladder on macOS is 28 / 32 / 40 / 44 / 52. There is an exact 40px tier — it's the "medium" toolbar / control register. `compact` should sit on that established rung, not float between rungs.
2. **4px grid alignment.** The DS spacing scale is 4px-based (`--space-1 = 4px`). 40 is a grid value; 38 is not. Heights that fall off the grid create alignment debt (icons inside the button, accompanying inputs, vertically-centered labels in flex rows all derive from the same 4px module).
3. **Asymmetric gap is intentional.** `sm(32) → compact(40) → md(44)` gives gaps of 8 and 4. `compact` is closer to `md` than to `sm` — by design. The use case (consumer's framing) is "the CTA where `md` reads too heavy", which means `compact` is "`md` minus one notch of weight", not "`sm` plus one notch of size". The gap structure reflects the intent.
4. **Body copy fits.** `compact` carries `--fs-body` (17–19px fluid). At 40px height with 11/15 padding, line-box sits cleanly. At 38px with 10/14 padding, the body type starts to crowd the height — the button reads as "too short for the text it carries". Verified by laying out the type box: 19px font × 1.25 baseline-to-baseline ≈ 24px line; 38 − 2×10 = 18 (under-tall by 6); 40 − 2×11 = 18 (under-tall by 6 but the extra surrounding margin reads as breathing room).
5. **AA tap target unaffected.** Both 38 and 40 pass WCAG 2.5.8 (24×24); both fail 2.5.5 AAA (44). No a11y delta.

The consumer's instinct ("somewhere between sm and md") is right; the specific value of 38 was hand-waved as the midpoint. 40 is the Apple rung and the grid value. Take 40.

---

## 4. Position on the consumer's 5 open questions

| #   | Question                                                       | Decision                                | Rationale (one line)                                                                                                                                                                                                                                                                                                                                          |
| --- | -------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Exact min-height (36 / 38 / 40)?                               | **40px**                                | Apple ladder + 4px grid + intentional asymmetry. See §3.                                                                                                                                                                                                                                                                                                      |
| 2   | Naming (`compact` / `sm-plus` / `intermediate`)?               | **`compact`**                           | Register-name, not position-name. Matches Apple's "Compact" UI vocabulary. `sm-plus` leaks the API gap; `intermediate` is sterile.                                                                                                                                                                                                                            |
| 3   | Scale interpolation — linear or hand-tuned?                    | **Hand-tuned**                          | Existing sizes are hand-tuned (padding 6/12, 10/18, 14/24 is not a linear function of height). `compact` joins the same regime. Specific values in §4 of the spec.                                                                                                                                                                                            |
| 4   | Token introduction (`--btn-h-compact` vs computed)?            | **Explicit tokens for the full ladder** | The `<Button>` height ladder is part of the brand contract, not an implementation detail. Naming the rungs surfaces them in `tokens.css` (and `llms-full.txt`) so other primitives that need to align (form fields, segmented controls) can read the same source of truth. New tokens: `--btn-h-sm`, `--btn-h-compact`, `--btn-h-md`, `--btn-h-lg`.           |
| 5   | Should DS docs surface a Button × Hero pairing recommendation? | **No**                                  | Pairing is composition-level convention, owned by the consumer (per `meta/compositions/pages/home.md` on the site side). The DS exposes primitives and their intrinsic properties; pairing rules are emergent and surface-specific. Adding pairing prescription to DS docs would create a maintenance contract the DS cannot honor across N future consumers. |

---

## 5. Trade-offs accepted

1. **API surface widens from 3 to 4 sizes.** Accepted: the gap between `sm` and `md` is functionally too coarse for restrained-brand surfaces, and the second-most-likely default (after `md`) deserves a name.
2. **AAA tap target (44px) not met at 40px.** Same trade-off as `sm`. Consumers needing strict AAA must use `md` or `lg`. This is a per-consumer call, not a DS-enforced rule.
3. **Token surface adds 4 entries.** Minor. The tokens already exist as hard-coded values inside `Button.module.css`; we're surfacing them as named tokens, not inventing new ones.
4. **DS does not validate Hero × Button pairings.** Status quo. The risk of `<Hero size="display"> + <Button size="sm">` (the misfire that started this proposal) is unchanged.

---

## 6. Out of scope (deferred)

- `size="xs"` below 32px — tap-target AA would fail; brand surfaces don't need it.
- `size="xl"` above 52px — existing `lg` covers loud-CTA need.
- Per-pairing validation in `<Hero>` — pairing stays composition-level.
- Responsive size shorthand (`size={{ mobile: "sm", desktop: "compact" }}`) — separate proposal if a consumer surfaces the need.
- Width tokens (`--btn-min-w-*`) — current sizing is content-driven; no consumer has asked for fixed-width buttons.

---

## 7. Hand-off

The design spec at [`meta/design/Button.md`](../design/Button.md) is **Approved**. Picked up by `poukai-ds-engineer` for implementation. Implementation surface:

- `src/atoms/Button/Button.tsx` — add `"compact"` to `ButtonSize` union, extend `sizeClass` map.
- `src/atoms/Button/Button.module.css` — add `.size-compact` rule with the values in §4 of the spec.
- `src/tokens/tokens.css` — introduce the four `--btn-h-*` tokens; refactor existing `.size-*` rules to consume them.
- `src/atoms/Button/Button.AllVariants.stories.tsx` + `Button.stories.tsx` — add `compact` to the size matrix.
- `src/atoms/Button/Button.test.tsx` — add coverage for the new size.
- Changeset: minor bump (`0.7.x` → `0.8.0`, or bundle with the in-flight `<Hero size>` / `<Hero illustration>` minor — engineer's call).

Engineer's domain — not authored by `poukai-design`.

---

## 8. Links

- GitHub issue: <https://github.com/poukai-inc/poukai-ui/issues/42>
- Companion proposals (open at time of decision):
  - [poukai-ui#39](https://github.com/poukai-inc/poukai-ui/issues/39) — `<Hero size>`
  - [poukai-ui#40](https://github.com/poukai-inc/poukai-ui/issues/40) — `<Hero illustration>`
- Brand decision log entry: `meta/brand.md` → "2026-05-17 — Name the `<Button>` height ladder as tokens; introduce `compact` tier at 40px"
