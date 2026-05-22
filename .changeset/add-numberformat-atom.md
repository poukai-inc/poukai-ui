---
"@poukai-inc/ui": minor
---

Add `NumberFormat` atom — pure presentational formatter backed by native `Intl.NumberFormat`.

Renders a `number` value as a locale-correct string and nothing else. Owns no tokens, no CSS, no layout. Lifts the formatter previously inlined in `Stat`/`StatList` consumers into a single canonical primitive so every editorial surface formats numbers identically.

Props: required `value: number`; optional `notation` (`"standard"` (default — grouped digits) | `"compact"` (`1.2M`) | `"currency"` (requires `currency`) | `"percent"` (multiplies by 100 — pass `0.42` to render `42%`)), `currency` (ISO 4217 — required when `notation="currency"`), `locale` (BCP-47 — pass explicitly for SSR safety), `minimumFractionDigits` / `maximumFractionDigits` passthrough, polymorphic `as` (`"span"` (default) | `"div"` | `"dd"`, closed union). `className`, `data-*`, `aria-*`, `id`, `ref` all forwarded. No `children` (value is the rendered content).

SSR-safe: output is `new Intl.NumberFormat(locale, options).format(value)` computed once during render — no `useEffect`, no `navigator.language`. Pass `locale` explicitly in i18n-aware surfaces to guarantee server/client parity.

Edge values: `NaN` → "NaN", `±Infinity` → "∞" / "-∞" (whatever the Intl runtime emits — assertions in the test suite compare against `Intl.NumberFormat(...).format(NaN)` rather than literals, so the atom remains stable across Node and browser engines).

Follow-up (separate PR): migrate `Stat.value` consumers to use `NumberFormat`.
