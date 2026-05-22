---
"@poukai-inc/ui": minor
---

Add `Select` atom — native styled `<select>` with sm/md/lg sizes and CSS-painted caret.

- Root is always `<select>`. Non-polymorphic. Ref forwarded to `HTMLSelectElement`. Children are consumer-supplied `<option>` / `<optgroup>` nodes.
- `size` prop (`"sm"` | `"md"` | `"lg"`, default `"md"`): visual height via shared `--btn-h-*` ladder — aligns with `<Input>` and `<Button>` at matching nominal sizes.
- `invalid` prop: sets `data-invalid="true"` and `aria-invalid="true"`; border → `--danger`. Wire through `<Field error="…">` for full label + describedby integration.
- Trailing caret: chevron-down rendered via CSS `background-image` SVG data URL (16×16, 1.5px round stroke). Color hardcoded per color scheme (`#1d1d1f` light, `#f5f5f7` dark) — `currentColor` is unavailable in SVG background images. RTL flips caret to inline-start. `[multiple]` hides caret and restores native appearance.
- Visual register matches `Input` exactly: same border, radius, focus ring, hover state, disabled treatment, and token surface. No new tokens introduced.
- `Omit<ComponentPropsWithoutRef<"select">, "size">` spread — native `size` attribute intentionally shadowed by DS `size` prop.
- Full Playwright CT suite: render, root tag, children, size classes, invalid attrs, disabled, defaultValue, controlled value, className merge, prop forwarding (data-_, aria-_, required, name, multiple), ref forwarding, label association, keyboard arrow navigation, axe clean (default, invalid, disabled, sm, lg, multiple).
- Added to `src/a11y.test.tsx` central gate (3 cases: default, invalid, Field composition).
- Subpath export `./atoms/Select` added to `package.json`.
- Design spec at `meta/design/Select.md`.
