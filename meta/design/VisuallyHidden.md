# Design spec: VisuallyHidden

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-20

---

## 1. Purpose

`<VisuallyHidden>` is the system's canonical a11y plumbing primitive. It renders its children in the accessibility tree — readable by screen readers, announced by assistive technology — while remaining completely invisible to sighted users via the canonical clip pattern. It is invariant: one shape, no variants, no tokens, no motion.

Its sole job is to give components a single, audited implementation of the sr-only pattern rather than each component re-inventing inline CSS or a local utility class. First-party consumers: `Wordmark` (already inlines this pattern as a local `<span>`), `IconButton` (mandatory `aria-label` alternative), `Dialog` (close button label), `SkipLink` (uses VisuallyHidden as its hidden-state base, overriding on `:focus`), `Carousel` (slide counter announcement).

---

## 2. Anatomy

- **Root element**: `<span>` by default. Swappable to `<div>` via the `as` prop for block-level contexts (see §6). The element is always in the normal document flow — not `display: none`, not `visibility: hidden` — so it is not hidden from the accessibility tree.
- **Content slot**: `children`. Whatever is passed renders inside the root element. Typically a short string or a formatted phrase for screen reader announcement.

---

## 3. Tokens used

None. The clip pattern is a fixed a11y technique, not a brand expression. No design tokens are consumed or introduced by this component. The CSS values are invariant constants drawn from the WCAG / Bootstrap / Tailwind canonical sr-only pattern.

---

## 4. Layout & rhythm

The component applies the following fixed CSS to its root element. These values are not tokens and must not be replaced with token references — they are an a11y technique, not a design decision.

```css
position: absolute;
width: 1px;
height: 1px;
padding: 0;
margin: -1px;
overflow: hidden;
clip: rect(0, 0, 0, 0);
white-space: nowrap;
border: 0;
```

`clip` is the legacy property for older browser compat. `clip-path: inset(50%)` is the modern equivalent; the engineer may use both in tandem (`clip` + `clip-path`) for maximum coverage — implementation detail, not spec-level.

The `margin: -1px` is load-bearing: it prevents the 1×1px ghost element from contributing to scroll dimensions in some browser/layout combinations. Do not remove it.

No margin, padding, or spacing is owned or consumed from the parent context. The component is invisible to layout.

---

## 5. States

None. `VisuallyHidden` is a static, invariant display primitive. There is no hover, focus, active, or disabled state.

The `focusable` variant — making the element visible on `:focus` for skip-link use — is explicitly out of scope here. That behavior belongs to `SkipLink`, which wraps or composes with `VisuallyHidden` and applies its own `:focus` override. See §10.

---

## 6. Motion

None. Static component.

---

## 7. Accessibility

This component is the a11y primitive. When used correctly, no axe violation should be possible.

- The root element remains in the DOM and in the accessibility tree. Assistive technology reads it; sighted users do not see it. This is the intended contract.
- `display: none` and `visibility: hidden` must never be used — they remove the element from the accessibility tree entirely and defeat the purpose.
- The element is not focusable by default (no `tabIndex`). It is a passive announcement surface, not an interactive element.
- Callers are responsible for the quality of the string they pass as `children` — the component cannot validate that the text is meaningful or correctly describes the associated visual element.
- When `as="div"` is used inside an inline formatting context (e.g. inside a `<button>`), the resulting block element inside an inline context is invalid HTML. The `as` prop is provided for block-level cases only; the engineer may add a dev-mode warning if `as="div"` is detected inside an inline container, though this is an implementation detail.

---

## 8. Prop intent

- `as?: "span" | "div"` — closed union, default `"span"`. `"span"` covers the vast majority of cases (inside buttons, links, inline icon labels). `"div"` is available for block-level contexts where a `<span>` would be invalid (e.g. a visually-hidden landmark label that must wrap block children). No other elements are permitted — this is a closed union, not a generic polymorphic `as`.
- `children` — required. The content to surface to the accessibility tree. Typically a string; may be any renderable ReactNode (e.g. a formatted phrase with a `<time>` element inside).
- `className` — forwarded to the root element. Allows consumers to add supplementary CSS without overriding the sr-only contract. The engineer should apply the clip CSS with high enough specificity (a dedicated class) that consumer `className` additions do not accidentally break the hiding technique.
- `...rest` — remaining HTML attributes forwarded to the root element (`id`, `data-*`, `aria-*`, etc.). Allows callers to add `id` for `aria-describedby` / `aria-labelledby` associations.

No `variant` prop. No `size` prop. No `hidden` toggle prop. This component is invariant — it is always visually hidden. If a consumer needs conditional visibility, they compose: render `VisuallyHidden` or the visible element based on their own state.

---

## 9. Composition rules

- `Wordmark`: the existing local `<span className={styles.sr}>` inside `Wordmark` should migrate to `<VisuallyHidden>` in a follow-up change. The rendered output is identical; the benefit is a single audited implementation.
- `IconButton`: wraps the mandatory `aria-label` text in `<VisuallyHidden>` so the button has an accessible name without visible text.
- `Dialog`: the close button's accessible label ("Close dialog" or equivalent) uses `<VisuallyHidden>` alongside the × icon.
- `SkipLink`: uses `VisuallyHidden` as its hidden base. When the SkipLink receives focus, its own `:focus` CSS overrides the clip pattern to reveal the link visually. `VisuallyHidden` does not own or know about this override — it is `SkipLink`'s responsibility.
- `Carousel`: slide-count announcements ("Slide 2 of 5") use `<VisuallyHidden>` with `aria-live="polite"` set via `...rest`.

`VisuallyHidden` does not compose with `Button`, `Stat`, `StatusBadge`, `Eyebrow`, or any display-layer atom. It is plumbing only.

---

## 10. Out of scope

- **`focusable` variant** (skip-link pattern). A `focusable` prop that reveals the element on `:focus` is explicitly excluded. The skip-link pattern requires its own component — `SkipLink` — which can use `VisuallyHidden` internally and apply its own `:focus` override. Conflating the two in one component would make `VisuallyHidden`'s contract ambiguous and add interactive complexity to a static primitive.
- **`aria-live` or `role` props**. These are forwarded via `...rest` — the component does not bake in announcement behavior. Callers opt in when needed (e.g. `<VisuallyHidden aria-live="polite">`).
- **Conditional visibility toggle**. If a consumer needs to switch between hidden and visible, they manage that state themselves and conditionally render `VisuallyHidden` or nothing.
- **Animation on reveal**. No transition from hidden to visible. That is `SkipLink`'s domain.

---

## Hand-off note for poukai-ds-engineer

This is a minimal invariant atom — the implementation should be proportionally small.

**What the component must do:**

1. Apply the canonical clip CSS (§4) via a dedicated CSS module class on the root element. The clip class must have clear specificity so that consumer `className` additions cannot accidentally override `position: absolute` or `overflow: hidden`.
2. Accept `as?: "span" | "div"` (closed union, `"span"` default) and render accordingly.
3. Forward `className`, `children`, and `...rest` to the root element.

**What it must not do:**

- Add any margin, padding, color, or typography. Zero brand CSS.
- Accept or handle a `focusable` prop.
- Use `display: none` or `visibility: hidden` at any point.

**Existing usage to migrate (follow-up, not this PR):**

- `Wordmark`'s local `<span className={styles.sr}>` — the clip CSS there is identical to this spec. Migration is a direct substitution with no visual delta.

**No stories are required for this atom** beyond a minimal accessibility-verification story confirming the element is present in the DOM and not visible. The engineer should add an axe audit assertion to the component test.
