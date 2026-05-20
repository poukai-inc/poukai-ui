# Design spec: FailureMode

**Atomic layer**: molecule
**Status**: Shipped in v0.1.0
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Status

Shipped in v0.1.0. `--fs-card-title` token added and FailureMode migrated in v0.16.0 (consistency audit — card-title clamp was previously duplicated inline). `--tracking-numeric` token added and wired to the index element in v0.17.0 (was a hardcoded literal). `--lh-body-relaxed` token added and wired in v0.17.0 (replacing inline `1.6` literal — relaxed line-height is intentional for editorial long-form prose). `--space-10` token added in v0.16.0 and the top padding of `.root` now resolves through it (was `var(--space-10, 2.5rem)` with a fallback; token now defined).

---

## 2. Purpose & non-goals

`<FailureMode>` is the numbered failure-mode block for the `/why-ai` surface. It presents a catalog of named AI adoption failure patterns — each with a reference index, a serif title, and a body slot that accepts paragraphs, lists, and callouts. The component encodes the visual pattern of a structured catalog entry: a reference number, a named phenomenon, and its description.

**Differentiating FailureMode from Principle.** See the comparison table in `meta/design/Principle.md §2`. Key distinctions: the FailureMode index is a sans-serif, weight-500 reference label stacked above the title at all breakpoints; the Principle numeral is a serif-italic editorial companion in a separate left-margin column on desktop. FailureMode is structured catalog; Principle is editorial enumeration.

**Differentiating FailureMode from FieldNote.** FieldNote is a single inline aside — a parenthetical sentence, `--fs-body` scale, 1px left rule, no heading, no index. FailureMode is a section-level structured block with a heading-scale title, a numeric reference, and a body slot that accepts multiple paragraphs. FailureMode is a page-level section; FieldNote is a prose-level parenthetical.

**`index` + `indexLabel` prop naming.** The component accepts a numeric `index` prop (e.g. `1`, `2`, `3`) and derives a default display label by zero-padding to two digits (`"01"`, `"02"`, `"03"`). The `indexLabel` prop overrides this derived label with an arbitrary string — e.g. `"A1"`, `"§ 1"`, or `"i."`. This two-prop design separates the machine-meaningful sequence number from the display format. See §10 for the open question about reconciling this with `Principle.numeral`.

**Non-goals:**

- FailureMode is not a card. It has no background fill, no border box, no padding box. It is open typography on the page surface.
- FailureMode is not interactive. No `href`, no click handler, no hover state.
- FailureMode does not manage its container layout — callers arrange multiple items in a container; `:last-child` provides the closing bottom border.
- FailureMode does not enforce a maximum count. The `/why-ai` page uses five; the showcase uses three. The component is count-agnostic.

---

## 3. Anatomy

- **Root element**: `<section>` — `display: flex; flex-direction: column; gap: var(--space-4); padding: var(--space-10) 0 var(--space-12); border-top: var(--hairline-w) solid var(--hairline); max-width: 44rem`. `border-bottom: var(--hairline-w) solid var(--hairline)` on `:last-child`. The `max-width: 44rem` on the root (wider than Principle's `38rem` body column) gives failure-mode body copy slightly more horizontal room — these entries are more technical and may include `<ul>` lists and nested callouts.
- **Index**: `<span className={styles.index} aria-hidden="true">` — Geist sans-serif, weight 500, `--fs-meta` (14px), `letter-spacing: var(--tracking-numeric)` (0.08em), `font-variant-numeric: tabular-nums`, `color: var(--fg-muted)`. `aria-hidden="true"` — the index is a visual reference label; screen readers go directly to the title. The wider `--tracking-numeric` (0.08em) distinguishes numeric reference labels from eyebrow labels (`--tracking-eyebrow`: 0.06em) — a subtle but intentional system differentiation.
- **Title**: `<h3 className={styles.title}>` — Instrument Serif, weight 400, `--fs-card-title` (24–32px), `line-height: 1.2`, `letter-spacing: -0.005em`, `color: var(--fg)`, `margin: 0`, `padding-bottom: 0.04em`, `text-wrap: balance`.
- **Body**: `<div className={styles.body}>{children}</div>` — Geist sans-serif, `--fs-body` (17–19px), `line-height: var(--lh-body-relaxed)` (1.6), `color: var(--fg)`. First and last child margins zeroed so the root `gap: var(--space-4)` controls all vertical rhythm between index, title, and body.

### Index rendering logic

```ts
function defaultIndexLabel(n: number): string {
  return n.toString().padStart(2, "0");
}
// index=1 → "01"
// index=2 → "02"
// index=12 → "12"
```

When `indexLabel` is provided, `defaultIndexLabel` is bypassed entirely — the provided string is rendered verbatim. This allows callers to use any format without JS transformation.

---

## 4. Props API

```tsx
interface FailureModeProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  index: number;         // required — sequence number; drives default label
  indexLabel?: string;   // optional — overrides the derived "01" label
  title: ReactNode;      // required — failure-mode name
  children: ReactNode;   // required — body copy (paragraphs, lists, callouts)
}
```

**`index`** (number, required): The sequence position — `1`, `2`, `3`, etc. Used to compute the default display label via `defaultIndexLabel`. Also serves as the React key in list rendering (`key={m.title}` or `key={index}` at the caller level — the caller chooses).

**`indexLabel`** (string, optional): An override for the rendered label. When provided, `index` is still accepted (for potential programmatic use — e.g. `aria-*` attributes, sorting) but the visual output is `indexLabel`. Example overrides: `"A1"`, `"§ 1"`, `"i."`. When absent, the component renders `defaultIndexLabel(index)`.

**`title`** (ReactNode, required): The failure-mode name — e.g. `"The chatbot-on-top-of-RAG plateau."` `ReactNode` for inline mark support; plain string is idiomatic.

**`children`** (ReactNode, required): The body content. Accepts `<p>`, `<ul>`, `<ol>`, `<FieldNote>`, or any block-level content appropriate to a technical description.

**Standard HTML spread** (`ComponentPropsWithoutRef<"section">`, `"title"` omitted): `id`, `data-*`, `className`, `style`, event handlers forwarded to the root `<section>`. `className` merges via `clsx`.

---

## 5. Token contract

| Token               | Value                                       | Role                                                               |
| ------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| `--font-serif`      | Instrument Serif                            | Title typeface                                                     |
| `--font-sans`       | Geist stack                                 | Index, body typeface                                               |
| `--fs-card-title`   | `clamp(1.5rem, 1.15rem + 1.2vw, 2rem)`     | Title font-size (24–32px)                                          |
| `--fs-meta`         | `0.875rem` (14px)                           | Index font-size                                                    |
| `--fs-body`         | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | Body font-size (17–19px)                                           |
| `--tracking-numeric`| `0.08em`                                    | Index letter-spacing — wider than eyebrow, signals numeric reference |
| `--fg`              | `#1D1D1F`                                   | Title color; body color                                            |
| `--fg-muted`        | `#6E6E73`                                   | Index color                                                        |
| `--hairline`        | `#D2D2D7`                                   | Top border; last-child bottom border                               |
| `--hairline-w`      | `1px`                                       | Border width                                                       |
| `--lh-body-relaxed` | `1.6`                                       | Body line-height — intentional relaxed value for prose reading     |
| `--space-4`         | `1rem` (16px)                               | Root flex gap between index, title, body                           |
| `--space-10`        | `2.5rem` (40px)                             | Root top padding                                                   |
| `--space-12`        | `3rem` (48px)                               | Root bottom padding                                                |

---

## 6. States & motion

**Static.** FailureMode has no interactive states and no motion. It is an editorial catalog block.

No hover, focus, active, or disabled states. Any scroll-triggered entrance is the caller's concern.

---

## 7. Responsive behavior

FailureMode has no internal breakpoint logic. Its layout is a single vertical flex column at all viewport widths. The `max-width: 44rem` on the root constrains the block at wide viewports — it does not expand beyond a comfortable reading measure.

The root `max-width: 44rem` is slightly wider than Principle's `38rem` body column — this is intentional. FailureMode entries are more technical and may include structured lists (`<ul>`, `<ol>`). The extra 6rem (96px) of horizontal room accommodates this without requiring the content to wrap awkwardly.

---

## 8. A11y

- Root element is `<section>`. Each failure mode is a discrete section of the `/why-ai` page, headed by an `<h3>` title. Correct sectioning structure.
- Index is `aria-hidden="true"`. Screen readers encounter the title directly: `"heading level 3, The chatbot-on-top-of-RAG plateau."` The `"01"` index is a visual reference label — omitting it from the accessibility tree avoids the announcement `"zero one — The chatbot…"`, which reads awkwardly.
- Title is `<h3>`. Same heading-level caveat as RoleCard and Principle — callers in different heading hierarchies may need a polymorphic heading prop.
- `font-variant-numeric: tabular-nums` on the index is visual only — no accessibility impact.
- Contrast:
  - Title (`--fg` on `--bg`): **16.29:1** (AAA)
  - Body (`--fg` on `--bg`): **16.29:1** (AAA)
  - Index (`--fg-muted` on `--bg`): **4.91:1** at `--fs-meta` 14px — AA normal ✓
- No keyboard interaction.

---

## 9. Worked examples

### (a) Single failure mode

```jsx
import { FailureMode } from "@poukai-inc/ui";

<FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
  <p>
    Most teams stop here. The demo dazzles; the production loop never closes; quality degrades
    silently and nobody has the eval harness to see it.
  </p>
</FailureMode>
```

Default index rendering: `index={1}` → displays `"01"`.

### (b) Three-item list — `/why-ai` page recipe

```jsx
import { FailureMode } from "@poukai-inc/ui";

const modes = [
  {
    title: "The chatbot-on-top-of-RAG plateau.",
    body: "Most teams stop here. The demo dazzles; the production loop never closes.",
  },
  {
    title: "Eval theatre.",
    body: "Vibes-based evaluation. Spreadsheets that nobody updates.",
  },
  {
    title: "The agent that ships nothing.",
    body: "Loops forever, calls every tool, returns plausible-sounding nonsense.",
  },
];

<div>
  {modes.map((m, i) => (
    <FailureMode key={m.title} index={i + 1} title={m.title}>
      <p>{m.body}</p>
    </FailureMode>
  ))}
</div>
```

The first item gets a top border from its own rule. The last item (index `3`) gets a bottom border via `:last-child`. Interior rules are shared.

### (c) Custom `indexLabel`

```jsx
<FailureMode index={1} indexLabel="§ 1" title="The chatbot-on-top-of-RAG plateau.">
  <p>…</p>
</FailureMode>
```

Renders `"§ 1"` instead of `"01"`. `index` is still required and consumed by `defaultIndexLabel` logic internally — the derived value is discarded in favor of `indexLabel`.

---

## 10. Open questions

**Reconcile sequential-marker prop names: `FailureMode.index` + `indexLabel` vs. `Principle.numeral`.** Both components present a sequential marker beside a titled block. They use different prop designs:

- `Principle`: single `numeral: string` — the caller owns the format entirely.
- `FailureMode`: `index: number` + optional `indexLabel: string` — the component derives a default zero-padded label from the number; the caller can override.

The two approaches reflect different editorial intentions: Principle numerals are authored by hand (Roman numerals require manual composition); FailureMode indices are computed from a list position (Arabic numerals are programmatically derivable). However, the API asymmetry may cause confusion when using both components on the same page.

**Possible resolution options:**
1. Keep as-is — the semantic difference justifies the API difference. Document clearly.
2. Align FailureMode to `Principle`'s `numeral: string` pattern — simplifies the API, moves formatting to the caller everywhere.
3. Align Principle to FailureMode's `index: number` + `indexLabel?: string` pattern — allows programmatic generation of Principle lists.

This is flagged in BACKLOG.md as a Medium consistency item. Resolution requires Arian's sign-off before any API change (it would be a breaking change for callers of either component).
