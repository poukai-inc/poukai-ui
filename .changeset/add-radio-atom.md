---
"@poukai-inc/ui": minor
---

Add Radio + RadioGroup atoms — Radix RadioGroup wrap

Mutually-exclusive selection primitive wrapping `@radix-ui/react-radio-group` (`Root` + `Item` + `Indicator`). Radix supplies `role="radiogroup"` / `role="radio"`, roving-tabindex keyboard navigation (ArrowDown/ArrowUp for vertical, ArrowLeft/ArrowRight for horizontal), and `aria-checked` propagation.

`RadioGroup` props: `value` / `defaultValue` / `onValueChange`, `name`, `orientation` (`"vertical"` default, `"horizontal"`), `disabled`, `required`, and one of `aria-label` / `aria-labelledby` (dev-mode warning when neither is supplied). `Radio` items take `value` (required), `disabled`, `id`, and forward `data-*` / `aria-*` attributes.

Indicator dot is a CSS `::after` pseudo on the Radix `Indicator` slot — no Lucide, no SVG, no `<Icon>`. Label pairing is always a consumer responsibility (wrap with `<label>` or pass `aria-label` per item). `forwardRef` to root `<div>` (RadioGroup) and `<button>` (Radio).

`@radix-ui/react-radio-group@^1.3.8` added to dependencies.

Subpath export `./atoms/Radio` added to `package.json`. Design spec at `meta/design/Radio.md`.
