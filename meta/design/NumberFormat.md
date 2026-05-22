# Design spec: NumberFormat

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-21

---

## 1. Purpose

`<NumberFormat>` is the system's canonical number-formatting atom — a pure
presentational wrapper that renders a `number` value as a locale-correct,
consistently formatted string inside a `<span>` (or a polymorphic sibling via
`as`). It delegates all numeric logic to the native `Intl.NumberFormat` API and
emits nothing but the resulting text node.

The system currently has no shared formatting contract. `<Stat>` accepts a
pre-formatted `ReactNode` `value`, so every consumer inlines its own
`Intl.NumberFormat` call with its own grouping and rounding choices. As more
editorial primitives arrive — `StatList` rows, `FieldNote` supporting figures,
`Footer` copy referencing counts — the drift compounds: one surface uses
`"compact"`, another omits grouping, a third hardcodes `"en-US"` regardless of
locale context. `<NumberFormat>` lifts the formatter out once so every surface
shares the same output for the same inputs.

`<NumberFormat>` carries no visual treatment of its own. It introduces no
tokens, no layout, no color, no size. It is a text-emitting utility atom whose
only job is to produce a string identical to `new Intl.NumberFormat(locale,
options).format(value)` — in a composable, ref-forwardable `<span>`.

**Note on `<Stat>` migration.** `src/atoms/Stat/Stat.tsx` currently accepts a
pre-formatted `ReactNode` for its `value` prop so consumers supply the
formatting themselves. Migrating `Stat` to accept a raw `number` and format it
via `<NumberFormat>` internally is the immediate follow-up to this spec. That
migration is **explicitly out of scope for this PR** — it warrants its own
changeset so the Stat output can be verified against the previous baseline.

### What NumberFormat is not

**Not a date or time formatter.** `Intl.DateTimeFormat` is a different surface
concern; see the `<Time>` atom (landed in this branch) for temporal formatting.

**Not a chart numeral.** Data-visualisation axes have their own density and
truncation rules that belong in the chart layer, not the DS atom.

**Not a units library.** `Intl.NumberFormat`'s `style: "unit"` is intentionally
excluded from this spec (see §9). Currency and percent cover the current surface
need; unit formatting adds locale complexity (short/long/narrow unit display)
without a concrete DS use case today.

**Not an animated counter.** Counting animations (counting-up from 0 to a
target) are an interaction pattern, not a formatting atom. NumberFormat is
static — value in, string out, once, during render.

**Not interactive.** No copy-on-click, no tooltip, no hover state.

---

## 2. Anatomy

- **Root element**: `<span>` by default. Polymorphic via a closed `as` union:
  `"span" | "div" | "dd"`. The three variants cover the dominant layout
  contexts: `span` for inline use, `div` for block-level figures in flex/grid
  containers, `dd` for definition-list values (the canonical pairing with a
  `<dt>` label when surface area is `FieldNote` or a stats table).
- **Content**: the formatted string produced by `Intl.NumberFormat`. No
  `children` prop — the rendered text is computed entirely from `value` +
  formatting options. `children` is disallowed at the type layer.
- **No leading or trailing slot.** No icon, no currency symbol override, no
  separator element beyond what `Intl` emits. Consumers who need a leading
  label or trailing unit compose `<NumberFormat>` alongside their own markup.

---

## 3. Tokens used

None. `<NumberFormat>` introduces no visual tokens and applies no CSS of its
own. It inherits `font-family`, `font-size`, `color`, and `line-height` from
its parent. If a consumer needs to visually distinguish a formatted figure
(e.g. render it in `--fg` at `--fs-pull` scale), they apply those tokens via
`className` or a wrapping component such as `<Stat>` or `<Text>`.

---

## 4. Layout & rhythm

`<NumberFormat>` applies no layout CSS. It renders as a plain inline `<span>`
(or the chosen `as` element) inheriting all typographic context from its
parent. The engineer should confirm `display` is not overridden in the module
CSS — the component must not introduce `block` or `flex` on the root element.

---

## 5. States

Non-interactive. No hover, focus, active, or disabled states. The CSS module
(if any) contains no interaction rules.

---

## 6. Motion

None. Value changes do not animate. A static re-render with a new `value` prop
replaces the previous string immediately. Animated transitions between numeric
values are an interaction concern owned by a future `CountUp` or similar motion
primitive.

---

## 7. Props

Full TypeScript-shape intent. The engineer translates this into types; the
table below defines the contract.

| Prop                    | Type                                                          | Default      | Notes                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`                 | `number`                                                      | **required** | The number to format. `NaN` and `±Infinity` are allowed — `Intl` handles them deterministically (see §8).                                                |
| `notation`              | `"standard" \| "compact" \| "currency" \| "percent"`         | `"standard"` | Controls the `Intl.NumberFormat` style and notation. `"percent"` multiplies the value by 100 and appends the locale percent sign (e.g. `0.42` → `42%`). |
| `currency`              | `string`                                                      | `undefined`  | ISO 4217 code (e.g. `"USD"`, `"EUR"`, `"JPY"`). Required when `notation="currency"`; ignored for all other notations. See §8 for the Intl throw behavior. |
| `locale`                | `string \| string[]`                                         | `undefined`  | BCP-47 tag(s), e.g. `"en-US"`, `"de-DE"`, `["en-GB","en"]`. When omitted, the Intl runtime default is used. See §SSR below for the implications.        |
| `minimumFractionDigits` | `number`                                                      | `undefined`  | Passed directly to `Intl.NumberFormat`. When omitted, Intl's notation-appropriate default applies.                                                        |
| `maximumFractionDigits` | `number`                                                      | `undefined`  | Passed directly to `Intl.NumberFormat`. When omitted, Intl's notation-appropriate default applies.                                                        |
| `as`                    | `"span" \| "div" \| "dd"`                                    | `"span"`     | Root element. Closed union — no heading elements, no interactive elements.                                                                                |
| `className`             | `string`                                                      | —            | Forwarded to the root element.                                                                                                                            |
| `id`                    | `string`                                                      | —            | Forwarded to the root element.                                                                                                                            |
| `ref`                   | `Ref<HTMLElement>`                                            | —            | Forwarded via `forwardRef`. `HTMLElement` is the correct ref type for `span`, `div`, and `dd`.                                                           |
| `data-*`, `aria-*`      | `HTMLAttributes`                                              | —            | Standard HTML attributes forwarded to the root. No `children` — disallowed at the type layer.                                                            |

### SSR / hydration contract

`Intl.NumberFormat` with no explicit `locale` uses the JS runtime's default
locale — typically the system locale on Node and the browser locale on the
client. In an SSR context where the server locale differs from the browser
locale the formatted string will differ between server render and client
hydration, producing a React hydration mismatch.

**Rule: for any i18n-aware application, pass `locale` explicitly.**

When `locale` is omitted, `<NumberFormat>` uses the Intl runtime default
identically on server and client **only** when the environments share the same
locale (e.g. a server configured to `en-US` deployed to a US-only audience).
For any other case, the consumer must pass `locale`. This is documented in the
component JSDoc and is not enforced at the type layer (omitting `locale` is not
an error; it is a deliberate escape hatch for simple contexts).

`<NumberFormat>` does **not** read `navigator.language` or any other
browser-only global. The Intl call runs once during render, synchronously,
with no `useEffect` reformatting. Output is stable.

---

## 8. Behavior

### Edge values

| Input value | `notation`   | Output                              | Notes                                                                    |
| ----------- | ------------ | ----------------------------------- | ------------------------------------------------------------------------ |
| `NaN`       | any          | `"NaN"`                             | `Intl.NumberFormat` returns the string `"NaN"`.                          |
| `Infinity`  | any          | `"∞"`                               | `Intl.NumberFormat` returns the infinity symbol.                         |
| `-Infinity` | any          | `"-∞"`                              | `Intl.NumberFormat` returns the negative infinity form.                  |
| `-0`        | `"standard"` | `"0"`                               | Intl normalises negative zero to `"0"` in standard notation by default.  |

### `notation="percent"`

Pass the decimal fraction, not the integer percentage. `value={0.42}` renders
`"42%"`. `value={1}` renders `"100%"`. This mirrors `Intl.NumberFormat` style
`"percent"` exactly — no custom multiplication is performed by the atom; the
Intl API handles it.

### `notation="currency"` and the missing `currency` prop

`Intl.NumberFormat` throws a `RangeError` when `style: "currency"` is specified
without a valid currency code. When `notation="currency"` and `currency` is
`undefined` or an invalid ISO 4217 string, the atom will throw during render.
This is intentional — a silent fallback to `"USD"` or an empty string would
mask a consumer error. The thrown error surfaces in React's error boundary, which
is the correct signal for a mis-configured prop. The engineer should not add a
try/catch inside the component.

### Locale-aware currency display

The currency symbol and decimal separator both respect `locale`. Examples at
`value={1234.56}`, `notation="currency"`, `currency="EUR"`:

- `locale="en-US"` → `€1,234.56`
- `locale="de-DE"` → `1.234,56 €`
- `locale="fr-FR"` → `1 234,56 €`

The atom does not override or normalize these. The locale-correct form is always
emitted.

### JPY and other zero-fraction currencies

`JPY` has no fractional unit. `Intl.NumberFormat` defaults `maximumFractionDigits`
to `0` for `"JPY"`. Passing `value={1234}`, `notation="currency"`,
`currency="JPY"`, `locale="ja-JP"` correctly emits `¥1,234` with no decimal.
Consumers who want to override this may pass `maximumFractionDigits` explicitly.

---

## 9. Accessibility

`<NumberFormat>` emits plain text. No ARIA attributes are needed on the atom
itself — the formatted string is the accessible name of any `<span>` or `<div>`
that contains it, and `<dd>` in a `<dl>` carries its semantics from the `<dt>`
label.

**Screen-reader expansion for compact notation.** `"compact"` produces strings
like `"1.2M"` or `"4.5K"`. Screen readers announce these as-is; `"1.2M"` may
be read "one point two M" rather than "one point two million." For surfaces
where this ambiguity matters (financial figures, large counts), the recommended
pattern is to compose `<NumberFormat>` with `<VisuallyHidden>`:

```tsx
<>
  <NumberFormat value={1_200_000} notation="compact" aria-hidden />
  <VisuallyHidden>1.2 million</VisuallyHidden>
</>
```

This is a consumer-side composition responsibility — it is not built into the
atom. `<NumberFormat>` does not generate the expanded form automatically.

**Contrast.** The atom inherits its parent's color. It introduces no color of
its own, so there is nothing to verify at the atom level. Each editorial
surface using `<NumberFormat>` is responsible for its own contrast.

---

## 10. API typing sketch

```tsx
// INTENT ONLY — engineer designs the actual API

interface NumberFormatBaseProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** The number to format. NaN and ±Infinity are allowed. */
  value: number;
  /** Default: "standard". "percent" multiplies by 100. */
  notation?: "standard" | "compact" | "currency" | "percent";
  /**
   * ISO 4217 currency code. Required when notation="currency".
   * Intl.NumberFormat throws a RangeError if this is missing
   * when notation="currency" — callers must provide it.
   */
  currency?: string;
  /** BCP-47 locale tag(s). Omit at SSR risk — see §7 SSR contract. */
  locale?: string | string[];
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  /** Root element. Default: "span". */
  as?: "span" | "div" | "dd";
}
```

A discriminated union that makes `currency` required when `notation="currency"`
is possible but produces a noisy consumer experience (`Type '"standard"' is not
assignable...` errors when the prop is absent). The simpler `currency?: string`
shape with clear JSDoc is preferred — the Intl runtime throw is a sufficient
runtime signal.

`forwardRef<HTMLElement, NumberFormatBaseProps>` is the correct signature.
`HTMLElement` covers all three `as` variants (`HTMLSpanElement`,
`HTMLDivElement`, `HTMLElement` for `dd`) without needing per-branch ref
casting beyond what the switch already provides.

**`displayName = "NumberFormat"`** on the `forwardRef` result.

---

## 11. Worked examples

### (a) Standard integer — grouped digits

```tsx
import { NumberFormat } from "@poukai-inc/ui";

<NumberFormat value={1_234_567} locale="en-US" />
// → "1,234,567"
```

### (b) Standard decimal with explicit fractions

```tsx
<NumberFormat
  value={3.14159}
  locale="en-US"
  minimumFractionDigits={2}
  maximumFractionDigits={2}
/>
// → "3.14"
```

### (c) Compact notation

```tsx
<NumberFormat value={4_500_000} notation="compact" locale="en-US" />
// → "4.5M"
```

### (d) Currency — USD

```tsx
<NumberFormat
  value={1_234.56}
  notation="currency"
  currency="USD"
  locale="en-US"
/>
// → "$1,234.56"
```

### (e) Currency — EUR, English locale

```tsx
<NumberFormat
  value={1_234.56}
  notation="currency"
  currency="EUR"
  locale="en-US"
/>
// → "€1,234.56"
```

### (f) Currency — EUR, German locale

```tsx
<NumberFormat
  value={1_234.56}
  notation="currency"
  currency="EUR"
  locale="de-DE"
/>
// → "1.234,56 €"
```

### (g) Currency — JPY (zero fractional digits by default)

```tsx
<NumberFormat
  value={1_234}
  notation="currency"
  currency="JPY"
  locale="ja-JP"
/>
// → "¥1,234"
```

### (h) Percent

```tsx
<NumberFormat value={0.857} notation="percent" locale="en-US" />
// → "86%"
// (Intl rounds to the nearest integer by default for percent)
```

### (i) Percent with explicit decimal

```tsx
<NumberFormat
  value={0.857}
  notation="percent"
  locale="en-US"
  minimumFractionDigits={1}
  maximumFractionDigits={1}
/>
// → "85.7%"
```

### (j) Custom locale — German grouping

```tsx
<NumberFormat value={1_234_567} locale="de-DE" />
// → "1.234.567"
```

### (k) `as="dd"` inside a definition list

```tsx
<dl>
  <dt>Total users</dt>
  <NumberFormat as="dd" value={48_921} locale="en-US" />
</dl>
// renders <dd>48,921</dd>
```

### (l) Compact with screen-reader expansion

```tsx
<>
  <NumberFormat
    value={1_200_000}
    notation="compact"
    locale="en-US"
    aria-hidden
  />
  <VisuallyHidden>1.2 million</VisuallyHidden>
</>
```

---

## 12. Composition rules

- `<NumberFormat>` is a leaf atom. It composes as the `value` display element
  inside any editorial surface that needs a formatted figure.
- **Inside `<Stat>` (follow-up migration)**: `<Stat>` will accept a raw `number`
  and render it via `<NumberFormat>` internally. Until that migration lands,
  `<Stat>` remains pre-formatted.
- **Inside a `<dl>` / definition list**: use `as="dd"` so the rendered element
  carries correct definition-list semantics alongside its `<dt>` label.
- **Inside `<Text>` or `<p>` body copy**: use the default `as="span"` so the
  formatted figure flows inline with prose.
- **Inside a flex/grid figure container**: use `as="div"` when a block-level
  root is needed for alignment within a grid cell.
- `<NumberFormat>` does not compose with `<Stat>` in the same visual slot
  during this PR — they are parallel primitives until the Stat migration
  follow-up lands.

---

## 13. Out of scope

- **Date and time formatting.** Covered by `<Time>`. The two atoms are
  complementary siblings, not competitors.
- **Signed display (`+42`, `−3`).** No `signDisplay` prop in this PR.
  Attribution surfaces (Pull stats, comparative figures) may need explicit `+`
  signs; `signDisplay` is a clean addition in a future prop extension.
- **Scientific and engineering notation.** `Intl.NumberFormat` supports
  `notation: "scientific"` and `notation: "engineering"`. Neither has a current
  DS use case. Excluded to keep the prop surface minimal.
- **Unit formatting.** `Intl.NumberFormat` `style: "unit"` supports values like
  `"kilometer"`, `"byte"`. Excluded: the locale complexity (short/long/narrow
  unit display) is non-trivial and there is no concrete DS surface needing it.
- **Animated counters.** Counting-up animations are an interaction pattern, not
  this atom's concern.
- **Copy-to-clipboard.** Not a concern of a plain text atom.
- **Dark mode per-component overrides.** `<NumberFormat>` inherits color from
  its parent; no component-level dark mode CSS applies.
- **RTL.** The formatted string respects Intl's locale-aware number direction.
  The component emits no directional CSS.

---

## 14. Open questions / future work

1. **Stat migration.** Immediate follow-up: update `src/atoms/Stat/Stat.tsx`
   to accept `value: number` and render it via `<NumberFormat>` internally.
   Consumers who currently pass a pre-formatted ReactNode will need a migration
   path — the Stat spec update should define that contract.
2. **`signDisplay` prop.** If Pull, Quote, or attribution surfaces need
   explicit `+3.2%` or `−1.1M` display, `signDisplay` is a clean addition:
   `signDisplay?: "always" | "exceptZero" | "never"`, passed through to
   `Intl.NumberFormat`. No current surface need — hold until one surfaces.
3. **`compactDisplay` prop.** `Intl` supports `compactDisplay: "short" | "long"`
   (`"4.5M"` vs `"4.5 million"`). Could be added alongside a future
   screen-reader expansion built-in if the consumer-composition pattern in §9
   proves too cumbersome.
4. **Locale provider context.** For i18n applications, passing `locale`
   explicitly to every `<NumberFormat>` is verbose. A future `LocaleProvider`
   context that sets a default locale for the subtree would be ergonomic.
   Out of scope for the atom itself.
