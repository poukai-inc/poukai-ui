# Design spec: Eyebrow

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`<Eyebrow>` is the system's canonical micro-label: a small, uppercase, tracked-out text fragment that signals "what kind of thing follows this" — a role category ("Role 01"), a section marker ("01 · Principle"), a discipline label ("Engineering"), an ordered index ("FM-03"). It is decorative-semantic: it does not replace a heading, it precedes or accompanies one. Its job is to give the reader's eye an orientation peg before they commit to the larger type below it.

Today this pattern is inlined independently in three molecules — `RoleCard` (`.eyebrow`, `0.06em`, `--fs-micro`, `--font-mono`), `FailureMode` (`.index`, `0.08em`, `--fs-meta`, `--font-sans` weight 500), and the global `.micro` utility in `tokens.css` (`0.04em`, `--fs-micro`, `--font-sans`) — with three different letter-spacings, two different font families, and two different font sizes. `<Eyebrow>` resolves that drift by establishing one canonical shape.

---

## 2. Anatomy

- **Root element**: `<span>` by default. Polymorphic via an `as` prop (the Statement pattern: swap the root element without forking styling — e.g. `as="p"`, `as="div"`, `as="dt"` for a definition list context). The engineer implements the `as` prop following the same pattern as `Statement`.
- **Numeral slot** (optional): a leading label rendered before the text content, visually separated by a gap. Used for ordered-list or indexed patterns ("01 ·", "FM-03"). When present, the root shifts to `inline-flex` with `align-items: baseline` to keep the numeral and text on the same optical axis.
- **Text content slot**: the label string. Always uppercase. Consumer provides the string; the component applies `text-transform: uppercase`.

---

## 3. Tokens used

### Existing tokens (no change)

| Token         | Value             | Role                                |
| ------------- | ----------------- | ----------------------------------- |
| `--fs-meta`   | `0.875rem` (14px) | Font size for all variants          |
| `--font-sans` | Geist stack       | Font family                         |
| `--fg-muted`  | `#6E6E73`         | Default text color (muted register) |
| `--fg`        | `#1D1D1F`         | Text color for `solid` variant      |
| `--space-2`   | `0.5rem` (8px)    | Gap between numeral slot and text   |

### New tokens introduced by this spec

| Token                | Value    | Purpose                                 |
| -------------------- | -------- | --------------------------------------- |
| `--tracking-eyebrow` | `0.06em` | Canonical Eyebrow letter-spacing        |
| `--lh-meta`          | `1.2`    | Line-height for meta/eyebrow-scale text |

**Tracking scale decision — one canonical value, not three.**

The three values in the wild (`0.04em` / `0.06em` / `0.08em`) each came from independent authoring decisions without a system rationale. This spec resolves them to a single token: `--tracking-eyebrow: 0.06em`.

Rationale:

- `0.04em` (`.micro` in `tokens.css`) is the global utility class tracking. It is appropriate for lowercase micro-utility text (footer annotations, inline metadata labels) but insufficient for all-caps eyebrow text, where the optical weight of uppercase letters requires more air between glyphs to avoid the text reading as a block. The `.micro` class is not being retired — it serves a different register — but it is not the right value for Eyebrow.
- `0.08em` (`FailureMode.index`) is the widest value. It was authored in context of a monospaced-feeling reference label (`FM-03`), where maximum letter-air reinforces the "reference index" feel. At 14px (`--fs-meta`), `0.08em` = 1.12px of air per letter — wide enough to feel open but starting to tip toward separated. This is an acceptable register for the indexed variant specifically.
- `0.06em` (`RoleCard.eyebrow`) sits between the two and reads as "considered" rather than "airy" or "tight". It is already in use on the most prominent eyebrow surface in the shipped system. At `--fs-meta` (14px), `0.06em` = 0.84px of air per letter — enough to communicate uppercase structure without becoming decorative. It is the value Apple uses on `apple.com` marketing-page category labels (measured at approximately `0.05–0.07em` across their uppercase micro-labels).

The `0.08em` value (FailureMode's indexed register) is within one perceptual step of `0.06em` at `--fs-meta`. In a side-by-side comparison the difference is present but not semantically meaningful — both read as "tracked uppercase label". Maintaining the wider value only for FailureMode indexes would require either a second token or a per-instance override, either of which adds friction without earning it. The normalized value `0.06em` is close enough that the FailureMode register is not materially harmed.

The `--tracking-stat: -0.015em` token (existing, for `<Stat>` display numerals) is not modified. Tracking tokens are semantic-role-scoped, not position-scoped; `--tracking-eyebrow` joins `--tracking-stat` in that namespace.

**Line-height token — `--lh-meta: 1.2`.**

No line-height tokens exist in the current token set. `tokens.css` hard-codes `1.15` on `h1`, `1.2` on `h2` / `h3` / `.numeral`, `1.55` on `body`, `1.3` on `h3`, and `1.6` on component body copy. The BACKLOG "Tokenize line-height + letter-spacing scales" item calls out this drift.

This spec introduces the first line-height token, scoped narrowly to the meta/eyebrow register. `--lh-meta: 1.2` reflects the value already used at the meta-text scale throughout the system (h2, h3, numeral) and is appropriate for single-line or very short uppercase labels where tight leading is visually correct. This token is narrow-purpose for now; a full `--lh-*` ramp is deferred to the foundations pass.

---

## 4. Layout & rhythm

| Property         | Value                                                          | Notes                                                  |
| ---------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| `display`        | `inline` (default) / `inline-flex` (when numeral slot present) | Flex only when numeral slot is used                    |
| `align-items`    | `baseline` (when `inline-flex`)                                | Keeps numeral + text on the same optical axis          |
| `gap`            | `var(--space-2)` (8px)                                         | Between numeral slot and text content                  |
| `font-family`    | `var(--font-sans)`                                             | Geist. Replaces the Mono variant used in RoleCard      |
| `font-size`      | `var(--fs-meta)`                                               | 14px across all variants                               |
| `font-weight`    | `500`                                                          | Medium weight. Uppercase + tracking = no need for bold |
| `line-height`    | `var(--lh-meta)`                                               | 1.2                                                    |
| `letter-spacing` | `var(--tracking-eyebrow)`                                      | `0.06em`                                               |
| `text-transform` | `uppercase`                                                    | Applied by the component; consumer writes natural case |
| `color`          | `var(--fg-muted)` for `muted`; `var(--fg)` for `solid`         | See §5                                                 |
| `margin`         | `0` — consumer owns margin via layout context                  | Not the Eyebrow's responsibility                       |

**Why `--font-sans` replaces `--font-mono` for RoleCard's eyebrow.**

`RoleCard.eyebrow` currently uses `--font-mono` (Geist Mono). The intent was likely to reinforce the "role index" character — monospaced characters can read as technical or systematic. However, Geist Mono at `--fs-micro` with `text-transform: uppercase` creates a noticeably different texture from every other meta-label in the system, which all use Geist (sans). The resulting inconsistency — one card using a different font family for the same semantic role — is harder to justify than the register nuance the mono choice was presumably trying to achieve. `--font-sans` at `0.06em` tracking already communicates "systematic label" cleanly. The engineer will need to remove `font-family: var(--font-mono)` from `RoleCard.module.css` when adopting Eyebrow (see §10).

**Font size unified at `--fs-meta` (14px).**

RoleCard's eyebrow used `--fs-micro` (12px); FailureMode's index used `--fs-meta` (14px). `--fs-meta` is the correct size. At 12px, uppercase tracked text starts to lose legibility on non-Retina displays and can register as too fine relative to the body type below it. At 14px it reads as a distinct register without competing with the body copy it precedes.

---

## 5. Variants

| Variant           | Color             | When to use                                                                                                                                                                                               |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `muted` (default) | `var(--fg-muted)` | Section markers, role labels, category labels — the standard "this is a label, not content" register                                                                                                      |
| `solid`           | `var(--fg)`       | When the Eyebrow must read at full contrast — e.g. on `--surface` or `--surface-section` backgrounds where `--fg-muted` might feel too receded, or when the label carries more semantic weight than usual |
| `numbered`        | `var(--fg-muted)` | Activates the numeral slot; the visual rendering is otherwise identical to `muted`. The distinction is structural (presence of the numeral slot), not colorimetric                                        |

Three variants, not two, because `numbered` is a structural variant (it activates the inline-flex + numeral slot layout) and it is worth naming explicitly rather than leaving consumers to figure out the flex composition themselves. However, `muted` + `solid` are the only color variants. No `accent` variant — Eyebrow is a label, not a link or a status indicator; using `--accent` for a decorative label would dilute the accent's semantic weight.

---

## 6. States

Eyebrow is decorative text. It has no interactive states. No hover, focus, active, or disabled treatment is specified or intended. If a consumer places an `<Eyebrow>` inside an interactive element (e.g. a button or a link), the Eyebrow inherits that element's cursor and interaction — but the DS does not author or test that composition.

---

## 7. Accessibility

**Default usage — label preceding content.**

In the most common pattern, `<Eyebrow>` is a visual label that immediately precedes a heading or a title element. In this case no ARIA scaffolding is needed: the heading itself provides the semantic structure, and the Eyebrow is supplementary context. The markup is:

```html
<span class="eyebrow">Role 01</span>
<h3>Senior Frontend Engineer</h3>
```

The heading is the semantically meaningful element; the Eyebrow is presentational context.

**When used as the sole section label (no heading below it).**

If an `<Eyebrow>` is the only label for a content region — i.e. it functions as a heading but renders at eyebrow scale — the consumer must either:

1. Use a semantic heading element as the root via the `as` prop: `<Eyebrow as="h2">Section Label</Eyebrow>`. This puts the visual eyebrow treatment on an element with proper heading semantics.
2. Or keep `<span>` and add `role="heading" aria-level="2"` at the consumer's discretion when heading semantics are genuinely required but the visual weight of an `<h2>` is unwanted.

The DS recommends option 1 when heading semantics are needed, because it avoids ARIA redundancy and keeps the a11y contract in the HTML rather than in attributes.

**Contrast.**

- `muted` variant: `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.91 : 1 — AA normal. Sufficient for 14px uppercase text (which reads as bold/loud due to letter-spacing and caps, improving perceived contrast).
- `solid` variant: `--fg` (#1D1D1F) on `--bg` = 16.29 : 1 — AAA.
- Both variants on `--surface` (#F5F5F7): `--fg-muted` = 4.66 : 1 (AA), `--fg` = 15.46 : 1 (AAA).
- All verified against WCAG 2.1 sRGB linearization; ratios inherited from `meta/brand.md` canonical palette table.

**`text-transform: uppercase` and screen readers.**

CSS `text-transform: uppercase` does not affect screen reader pronunciation — screen readers read the source text, not the rendered text. Consumers should write the source content in natural case (e.g. `Role 01`, not `ROLE 01`) so screen readers announce it naturally.

---

## 8. Motion

None. Eyebrow is a static label. If it appears within a parent that has an entrance animation (e.g. `<Hero entrance="stagger">`), the parent controls the reveal timing; Eyebrow does not add its own animation. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` handles suppression globally.

---

## 9. Prop intent

- Consumers must be able to supply any short text string as the label. The component applies `text-transform: uppercase`; consumers write natural case.
- Consumers must be able to choose between `muted` (default) and `solid` color registers.
- Consumers must be able to activate the numeral slot by passing a numeral/index string, which the component renders inline-left of the text content with `--space-2` gap.
- Consumers must be able to swap the root element via an `as` prop (following the Statement pattern), with `span` as the default. Common overrides: `p`, `div`, `dt`, `h2`, `h3`.
- The default variant is `muted`. No existing inline usage changes by default — when molecules adopt `<Eyebrow>`, they explicitly pass variant or accept the muted default.
- The DS does not enforce minimum or maximum text length. Eyebrow is intended for short labels (one to four words or a short alphanumeric index); very long strings will wrap and look wrong, but the DS does not truncate or clip.

The engineer translates these intents into TypeScript prop types. The `as` prop pattern should follow the existing `Statement` component implementation.

---

## 10. Composition rules

- `<Eyebrow>` precedes or accompanies heading or title content. It does not replace it.
- Inside `<RoleCard>`: the existing `.eyebrow` span becomes `<Eyebrow>` with default `muted` variant. The `numbered` variant is not applicable to RoleCard (role labels are not indexed).
- Inside `<FailureMode>`: the existing `.index` paragraph becomes `<Eyebrow as="p" variant="muted" numeral="FM-03">` or equivalent. The `numbered` variant handles the structural presence of the index.
- Inside `<Principle>`: `<Principle>` uses a `numeral` prop rendered via `.numeral` (serif italic, `--fg-muted`) — this is a different semantic register (an editorial numeral, not an eyebrow label) and should **not** be migrated to `<Eyebrow>`. The Principle numeral is display-weight serif italic; Eyebrow is sans-serif uppercase. They are distinct.
- Inside a section header pattern: `<Eyebrow>` sits above an `<h2>` or `<h3>` as a section marker. Gap between Eyebrow and its sibling heading: `--space-2` (8px) is the minimum; `--space-3` (12px) is preferred when the section marker is a standalone block element.
- `<Eyebrow>` does not compose with `<Button>`, `<Stat>`, or `<StatusBadge>`. It is a label atom, not an interactive or data atom.

---

## 11. Out of scope

- **`accent` color variant.** Eyebrow is a label, not a link or status indicator. No `--accent` variant.
- **Responsive size change.** `--fs-meta` (14px) is a fixed size, not fluid. No per-breakpoint size change for Eyebrow.
- **Icon slot.** If a consumer needs an icon-prefixed label, that is a composite at the consumer layer, not a DS slot.
- **Trailing punctuation or separator slot.** "01 ·" patterns are consumer-authored in the numeral string, not a DS-managed separator character.
- **Animated entrance.** Eyebrow does not own its own entrance animation; it participates in parent-owned stagger sequences (see §8).
- **Truncation / clamp.** One-line overflow is the consumer's responsibility; the DS does not add `text-overflow: ellipsis`.
- **Dark-mode variant overrides.** `--fg-muted` and `--fg` flip cleanly via the global dark-mode token override block. No per-component dark mode overrides needed.

---

## Breakpoint token note

**`--bp-md: 768px` should be added to `tokens.css`** in a follow-up change. The BACKLOG "Reconcile responsive breakpoint" item documents the split: Hero uses `720px`, while Principle, `FailureMode`, `tokens.css h1`, and all non-Hero components use `768px`. The `768px` value is the majority convention and the Apple-standard marketing breakpoint band. Adding `--bp-md: 768px` as a CSS custom property to the Layout section of `tokens.css` (after `--content-max-bleed`) formalizes it as a brand token. Hero's `720px` breakpoint should migrate to `var(--bp-md)` in the same or a subsequent change — this is a Hero spec update, not an Eyebrow spec update, and is not actioned here. The token itself is purely additive; no consumer behavior changes until Hero opts in.

This spec does not introduce `--bp-md` because doing so requires a `brand.md` decision-log entry and is orthogonal to the Eyebrow component shape. It is recommended as a paired follow-up, not bundled here.

---

## Story matrix

| Story file                        | Stories                                                                               | Notes                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Eyebrow.stories.tsx`             | `Default` — `muted` variant, plain text label                                         | Minimal; no numeral slot                                                                             |
| `Eyebrow.stories.tsx`             | `Solid` — `solid` variant                                                             | Color contrast comparison                                                                            |
| `Eyebrow.stories.tsx`             | `Numbered` — `numbered` variant with a numeral string                                 | Shows inline-flex layout                                                                             |
| `Eyebrow.AllVariants.stories.tsx` | `AllVariants` — all three variants stacked                                            | This is the `*.AllVariants.stories.tsx` story; shows the full matrix                                 |
| `Eyebrow.AllVariants.stories.tsx` | `TrackingComparison` — three instances at `0.04em` / `0.06em` / `0.08em` side by side | For the design decision record — demonstrates why `0.06em` was chosen. Can be removed after sign-off |
| `Eyebrow.AllVariants.stories.tsx` | `InsideRoleCard` — Eyebrow + `--fs-card-title` title mock, on `--surface` background  | Verifies the composition before RoleCard adopts Eyebrow                                              |
| `Eyebrow.AllVariants.stories.tsx` | `InsideSection` — Eyebrow above an `<h2>`, with `--space-3` gap, on page background   | Section marker pattern; verifies the heading pairing                                                 |

---

## Migration notes

`RoleCard`, `Principle`, and `FailureMode` will adopt `<Eyebrow>` in a **follow-up PR**, not this one. This spec establishes the atom; migration is a separate change that must not regress any existing molecule's rendered output.

**`RoleCard.module.css` — `.eyebrow` (line 32–39)**

```css
/* CURRENT — to be replaced */
.eyebrow {
  font-family: var(--font-mono); /* → font-family: var(--font-sans)  */
  font-size: var(--fs-micro); /* → font-size: var(--fs-meta)       */
  letter-spacing: 0.06em; /* → letter-spacing: var(--tracking-eyebrow) */
  text-transform: uppercase;
  color: var(--fg-muted);
  margin: 0 0 var(--space-2);
}
```

Visual delta when migrating: font size increases from 12px (`--fs-micro`) to 14px (`--fs-meta`); font family shifts from Geist Mono to Geist. The letter-spacing value is unchanged (both are `0.06em`). Engineer must verify the card layout still holds at the slightly larger eyebrow size — specifically that the margin `0 0 var(--space-2)` between eyebrow and title still reads correctly.

**`FailureMode.module.css` — `.index` (line 14–23)**

```css
/* CURRENT — to be replaced */
.index {
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: var(--fs-meta);
  letter-spacing: 0.08em; /* → var(--tracking-eyebrow): 0.06em */
  color: var(--fg-muted);
  font-variant-numeric: tabular-nums;
  margin: 0;
}
```

Visual delta when migrating: letter-spacing reduces from `0.08em` to `0.06em`. This is the only perceptible change; the index labels will read very slightly less airy. `font-variant-numeric: tabular-nums` should be retained on the numeral slot inside `<Eyebrow>` when used in the FailureMode numbered context — pass this as a consumer-side class or as an internal detail of the `numbered` variant (engineer decision).

**`Principle.module.css` — `.numeral` (line 23–38)**

No migration. The Principle numeral is serif italic at `--fs-body` / `1.25rem` — a display numeral, not an eyebrow label. It is a different semantic register and must not be replaced by `<Eyebrow>`. Left in place.

**Global `.micro` utility in `tokens.css` (line 223–228)**

No migration. The `.micro` utility class (`0.04em`, `--fs-micro`, sans-serif, `--fg-muted`) serves inline metadata in a lowercase context — footer copy, captions, inline keys. It is not an eyebrow and does not adopt `--tracking-eyebrow`. The token `--tracking-eyebrow` is a new addition; it does not replace or alias `0.04em`. Both coexist with distinct purposes.

---

## Open questions for the engineer

1. **`font-variant-numeric: tabular-nums` on the numeral slot.** The FailureMode index used this property to ensure numeric characters align in lists. Should the `numbered` variant always apply `tabular-nums` to the numeral slot, or should it be a consumer-opt-in? Recommendation: apply it by default on the numeral slot only (not the text slot) — the cost is zero for non-numeric numerals, and the alignment benefit is real when used as intended.

2. **`as` prop and the TypeScript polymorphic pattern.** The engineer should follow the Statement component's existing `as` prop implementation. If that implementation has constraints (e.g. only a subset of HTML elements is typed), apply the same constraints here for consistency. Do not invent a new polymorphic pattern.

3. **Numeral slot vs. children composition.** The numeral slot could be a named prop (`numeral="01"`) or a named child slot. The Statement precedent uses a prop for its primary content; a `numeral` prop is the recommended shape here. Confirm with the Statement implementation pattern.

4. **`margin` ownership.** The spec says `margin: 0` on the Eyebrow root. Existing inline usages (`RoleCard.eyebrow` has `margin: 0 0 var(--space-2)`) carry the below-gap as the molecule's responsibility. When migrating, confirm that the consuming molecule's layout CSS (not Eyebrow's CSS) owns the gap between Eyebrow and its sibling title — the Eyebrow atom must not bake in any directional margin.

5. **`--bp-md` token.** This spec notes that `--bp-md: 768px` should be added in a follow-up. No action required for the Eyebrow implementation itself. Flagged so the engineer is aware it is coming and can plan the Hero breakpoint migration at the same time.
