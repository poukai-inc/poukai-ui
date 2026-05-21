# Design spec: Text

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<Text>` is the canonical paragraph atom: the system's one and only API for non-heading, non-eyebrow body copy. It resolves the three ad-hoc patterns currently sprinkled through molecules — raw `<p>` tags inheriting the global rule, the `.lede` utility (`--fg-muted` + `max-width: 36rem`), and inline `<p style={{ color: "var(--fg-muted)" }}>` overrides — into a single component with a `size` axis (typographic register) and a `tone` axis (color register).

It is decorative-semantic in the same sense as `<Eyebrow>`: it does not encode meaning beyond "paragraph-scale running copy". The semantic element (`<p>` by default; `<span>` / `<div>` / `<dt>` / `<dd>` / `<li>` via the `as` prop) carries the document semantics; `<Text>` carries the typographic contract.

It is **not** a heading replacement (see `<Heading>` follow-up) and **not** an editorial display register (see `<Statement>`, `<Pull>`, `<Quote>` molecules).

---

## 2. Anatomy

- **Root element**: `<p>` by default. Polymorphic via an `as` prop following the `<Eyebrow>` precedent — closed union of `span`, `p`, `div`, `dt`, `dd`, `li`. No support for headings (`h1`–`h6`); use `<Heading>` (future) or `<Eyebrow as="h*">` for those cases.
- **Single text slot**: the children. No internal structure; `<Text>` is a leaf container around inline content.

---

## 3. Tokens used

All values are sourced from `src/tokens/tokens.css`. No new tokens introduced by this spec.

### Typography (sizes)

| Size      | Font size    | Line-height               | Notes                                                                                  |
| --------- | ------------ | ------------------------- | -------------------------------------------------------------------------------------- |
| `body`    | `--fs-body`  | `--lh-body` (1.55)        | Default running copy. Matches the global `p` rule.                                     |
| `lede`    | `--fs-body`  | `--lh-body-relaxed` (1.6) | Same point size as body; relaxed leading + narrower measure. See §4.                   |
| `caption` | `--fs-meta`  | `--lh-meta` (1.2)         | Captions, helper text, footer copy. Matches the `.meta` utility.                       |
| `micro`   | `--fs-micro` | `--lh-meta` (1.2)         | Footnote scale. Sans-serif, **not** uppercase (unlike the `.micro` utility — see §11). |

### Color (tones)

| Tone            | Color                     | When to use                                                                  |
| --------------- | ------------------------- | ---------------------------------------------------------------------------- |
| `default`       | `var(--fg)`               | Standard text register on `--bg`, `--surface`, or `--bg-elevated`.           |
| `muted`         | `var(--fg-muted)`         | Supporting copy: captions, lede paragraphs, dt labels, footer.               |
| `on-warm`       | `var(--fg-on-warm)`       | Primary text inside the warm editorial band (`--bg-warm-accent` surface).    |
| `on-warm-muted` | `var(--fg-on-warm-muted)` | Supporting text inside the warm editorial band. See `meta/brand.md` ceiling. |

### Layout

| Token  | Value   | Role                                                                                                                                                              |
| ------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (none) | `36rem` | `max-inline-size` for `size="lede"` only. Existing convention from the `.lede` utility; not promoted to a token because no other component uses the same measure. |

---

## 4. Layout & rhythm

| Property          | Value                                      | Notes                                                               |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| `margin`          | `0`                                        | Consumer owns vertical rhythm via parent layout.                    |
| `font-family`     | `var(--font-sans)`                         | Geist. Same family across every size.                               |
| `font-size`       | per-size token (see §3)                    |                                                                     |
| `line-height`     | per-size token (see §3)                    |                                                                     |
| `color`           | per-tone token (see §3)                    |                                                                     |
| `text-transform`  | `none`                                     | Text is natural-case body copy. Uppercase belongs to `<Eyebrow>`.   |
| `max-inline-size` | `36rem` for `size="lede"`; unset otherwise | The lede measure constraint. Consumer can override via `className`. |

**Why `margin: 0`.**
Every other DS atom (`Button`, `Eyebrow`, `Stat`, `Tag`) declares `margin: 0` and lets the consumer's layout context — flex/grid gap, sibling margins on a parent rule, or molecule-owned spacing CSS — control the rhythm. `<Text>` follows the same contract. Adopting `<Text>` inside a molecule will require the molecule to own the inter-paragraph gap, which is the correct ownership boundary.

**Why `lede` is the same point size as `body`.**
The `.lede` utility currently in `tokens.css` reads as a "lede" purely through color (muted) and measure (max-width 36rem) — it does not change the point size. This spec preserves that decision rather than promoting `lede` to a larger size (e.g. `--fs-pull` at 20–26px), because:

1. The point-size escalation register is already owned by `<Statement>` (28–44px) and `<Pull>` (20–26px). Adding a third "slightly larger than body" rung at the `<Text>` atom level would compress the editorial scale.
2. Existing usage of `.lede` across molecules (Hero, FieldNote, RoleCard footer copy) expects body-size text in the muted register with a tighter measure. A point-size change at adoption time would be a visual regression.

`size="lede"` therefore differs from `size="body"` only in line-height (`--lh-body-relaxed` 1.6 vs `--lh-body` 1.55) and `max-inline-size: 36rem`. Combined with the canonical `tone="muted"` pairing, this matches the current `.lede` rendering exactly.

---

## 5. Variants

Two orthogonal axes — `size` and `tone` — yielding 4 × 4 = 16 combinations. Not every combination is meaningful, but the matrix is unconstrained: any size pairs with any tone.

**Size axis** (§3 table).

- `body` (default), `lede`, `caption`, `micro`.

**Tone axis** (§3 table).

- `default` (default), `muted`, `on-warm`, `on-warm-muted`.

**Canonical pairings** (informational, not enforced):

| Pattern               | Recommended props                            |
| --------------------- | -------------------------------------------- |
| Standard paragraph    | `<Text>…</Text>` (body + default)            |
| Hero lede paragraph   | `<Text size="lede" tone="muted">…</Text>`    |
| Caption / footer copy | `<Text size="caption" tone="muted">…</Text>` |
| Footnote              | `<Text size="micro" tone="muted">…</Text>`   |
| Warm band body        | `<Text tone="on-warm">…</Text>`              |

---

## 6. States

`<Text>` is non-interactive. No hover, focus, active, or disabled treatment. If a consumer places interactive elements (`<a>`, `<button>`) inside the text, those children own their interaction states.

---

## 7. Accessibility

- **Default element is `<p>`.** Block-level paragraph semantics are correct in 90% of body-copy contexts. The `as` prop allows the consumer to choose the semantically correct container when `<p>` does not apply (e.g. `<dd>` inside a description list, `<span>` for inline copy that must not break the parent's flow).
- **No ARIA scaffolding.** `<Text>` is a presentational wrapper; the underlying element carries the semantics.
- **Contrast.** All four tones meet WCAG AA on their intended surfaces, sourced from `meta/brand.md`:
  - `default` on `--bg` → 16.29 : 1 (AAA).
  - `muted` on `--bg` → 4.91 : 1 (AA normal).
  - `muted` on `--surface` → 4.66 : 1 (AA normal).
  - `on-warm` on `--bg-warm-accent` → 7.75 : 1 (AAA).
  - `on-warm-muted` on `--bg-warm-accent` → ~3.9 : 1. **Below WCAG AA 4.5:1 for normal text.** This is a brand-sanctioned decorative ceiling tone (see `meta/brand.md` and the `--fg-on-warm-muted` token comment). It must not carry essential information. The a11y gate scopes its scan for this tone to disable the `color-contrast` rule, matching the documented brand-tier exception.
- **No `text-transform: uppercase`.** Unlike `<Eyebrow>`, `<Text>` does not uppercase its content; the source string is read by screen readers exactly as written.

---

## 8. Motion

None. `<Text>` is static. Parent entrance animations (`<Hero entrance="stagger">`) reveal `<Text>` instances by animating the parent; `<Text>` does not add its own animation. Global `prefers-reduced-motion` reduction is handled in `tokens.css`.

---

## 9. Prop intent

- Consumers must be able to choose a typographic size (`body` / `lede` / `caption` / `micro`).
- Consumers must be able to choose a color register (`default` / `muted` / `on-warm` / `on-warm-muted`).
- Consumers must be able to swap the root element via `as` (closed union, no headings).
- Consumers must be able to forward `className`, `style`, `data-*`, `aria-*`, and a `ref` to the root element.
- The component does not own vertical rhythm — `margin: 0` is invariant.
- The component does not own measure for `body` / `caption` / `micro` — only `lede` carries the 36rem max-inline-size constraint.

The engineer translates these intents into TypeScript prop types. The `as` prop pattern should follow the existing `<Eyebrow>` switch-based implementation; do not invent a new polymorphic pattern.

---

## 10. Composition rules

- `<Text>` is the default container for any paragraph-scale running copy inside a molecule. Adoption is a follow-up PR (see §12).
- `<Text>` does **not** replace `<Eyebrow>`. Uppercase tracked micro-labels are Eyebrow's register; `<Text size="micro">` is lowercase footnote text.
- `<Text>` does **not** replace headings. Use `<Heading>` (future) or semantic `<h1>`–`<h6>` for headings.
- `<Text>` does **not** replace editorial display registers (`<Statement>`, `<Pull>`, `<Quote>`).
- `<Text>` may contain inline children (`<a>`, `<strong>`, `<em>`, `<code>`, `<Icon>`); the inline elements own their own styling.

---

## 11. Out of scope

- **Inline-style overrides.** Consumers must not pass `style={{ fontSize: "..." }}` to escape the size axis. If a needed size does not exist, propose a new size variant via a spec amendment.
- **The `.micro` utility's uppercase + tracking treatment.** The `.micro` class in `tokens.css` is a different register (uppercase, tracked, `--fg-muted`) and is **not** absorbed by `<Text size="micro">`. The `.micro` utility serves inline metadata in an uppercase context; it remains in place. The Eyebrow atom covers the uppercase-tracked register at `--fs-meta`. `<Text size="micro">` is the lowercase footnote register at `--fs-micro`.
- **Custom measure for `body` / `caption` / `micro`.** Only `lede` carries an opinionated max-inline-size. Other sizes inherit the parent's measure.
- **Truncation / clamp.** Multi-line ellipsis is consumer-side CSS, not a DS slot.
- **Per-breakpoint size change.** The `--fs-*` tokens are already fluid (clamp-based); `<Text>` inherits that responsiveness without per-component media queries.
- **Heading semantics.** `<Text as="h1">` is intentionally not supported. Headings are a future `<Heading>` atom; mixing the registers in one component would invite misuse.
- **Dark-mode overrides.** All four tone tokens flip cleanly via the global dark-mode token override block. No per-component dark-mode override needed.

---

## 12. Migration notes

`<Text>` ships in this PR as a new atom. The follow-up adoption pass replaces ad-hoc `<p>` and `.lede` usage across molecules. The migration is **not** part of this PR — this spec establishes the atom; adoption is a separate change so each molecule's rendered output can be verified against the previous baseline.

Targets for follow-up adoption (non-exhaustive):

- `Hero` — lede paragraph slot currently uses inline `.lede`-equivalent styling.
- `FieldNote` — supporting copy below the eyebrow.
- `RoleCard` — body copy below the title.
- `Footer` — copy lines and copyright row.
- `FailureMode` — narrative copy below the indexed eyebrow.
- `Statement`, `Pull`, `Quote` — display copy stays as-is (different register).

The migration PR must verify no visual delta: the `body` + `default` and `lede` + `muted` pairings produce identical pixel output to the current raw `<p>` and `.lede` patterns at every supported breakpoint.

---

## Story matrix

| Story file         | Stories                                                                     | Notes                                                     |
| ------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------- |
| `Text.stories.tsx` | `Playground` — radio-controlled `size` × `tone` × `children`                | Standard Ladle playground                                 |
| `Text.stories.tsx` | `Sizes` — four paragraphs stacked, one per size, on `--bg`                  | Size matrix                                               |
| `Text.stories.tsx` | `Tones` — four paragraphs stacked, one per tone, sized to body              | Color matrix; `on-warm` tones mounted on a warm card mock |
| `Text.stories.tsx` | `LedeAfterHeading` — `<h1>` + `<Text size="lede" tone="muted">` composition | Verifies the canonical lede pairing                       |
| `Text.stories.tsx` | `AsSpan` — inline composition inside a parent paragraph                     | Demonstrates the `as="span"` escape hatch                 |

---

## Open questions for the engineer

1. **`as` prop closed union.** Match `<Eyebrow>`'s pattern exactly — switch on the literal `as` value and cast the ref per branch. Permitted values: `span`, `p`, `div`, `dt`, `dd`, `li`. Reject headings at the type layer.
2. **Default `as` value.** `<p>`. Block paragraph semantics are correct for the dominant use case.
3. **`tone="on-warm*"` token validity.** The tokens exist (`--fg-on-warm`, `--fg-on-warm-muted`). Storybook coverage must mount these tones on a `--bg-warm-accent` surface mock so the rendering is verified, not just typechecked.
4. **`lede` measure as inline-only.** `max-inline-size: 36rem` is applied only when `size="lede"`. Consumer-side `className` can override the measure if needed; the DS does not lock it.
5. **`text-wrap` behaviour.** Do not set `text-wrap: balance` — that is a heading-only treatment. `<Text>` runs as natural body copy.
