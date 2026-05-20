# Design spec: Wordmark

**Atomic layer**: atom
**Status**: Shipped in v0.1.0
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Status

Shipped in v0.1.0. Geometry revised in v0.3.0 (restored to horizontal isotype + wordtype lockup, viewBox aspect ratio change), v0.3.1 (letter-group shift so isotype renders flush-left), and v0.3.2 (proportions revised, inverted variant confirmed working).

---

## 2. Purpose & non-goals

`<Wordmark>` is the canonical brand mark for the pouk.ai design system. It renders the full horizontal lockup — isotype (the eagle glyph) left-anchored beside the wordtype (POUKAI letterforms) — as an inline SVG at a caller-specified height. Width scales proportionally from the viewBox aspect ratio.

The mark uses `fill="currentColor"` throughout, so it inherits whatever foreground color is in scope. This makes light-on-dark inversion effortless: wrap the Wordmark in a parent that sets `color: var(--bg)` and the mark inverts. No `color` prop, no `variant` prop, no additional style override is needed. The approach is consistent with how SiteShell uses the mark: it sets `color: var(--fg)` on the brand link, and the Wordmark inherits.

**Distinguishing Wordmark from Portrait.** `Portrait` is a photograph of a person — a `<picture>` element with AVIF/WebP/JPEG source stacking, `srcset`, and an enforced non-empty `alt`. Wordmark is a geometric SVG glyph set. Portrait is editorial content; Wordmark is brand chrome. They are never composed together; they operate in different slots on different surfaces.

**Non-goals:**

- Wordmark does not ship the isotype, stacked lockup, banner, or avatar-format assets. Those are in `src/brand/` as static files (`lockup-stacked.svg`, `isotype.png`, `banner.png`, `avatar-lockup.png`, `avatar-isotype.png`). Wordmark is specifically the inline-SVG React component for the horizontal lockup.
- Wordmark does not manage its own color. Color is always inherited via `currentColor`.
- Wordmark does not render as a navigational element. Wrapping it in an `<a>` is the caller's job (see SiteShell's `.brand` anchor). The component is a `<span>` root — it has no interactive semantics of its own.
- Wordmark does not support arbitrary SVG transforms or path overrides. The geometry is frozen code generated from the source SVG.

---

## 3. Anatomy

- **Root element**: `<span>` — `display: inline-flex`. A `<span>` (inline-level) rather than a `<div>` (block-level) so the mark can sit inline with text or inside an `<a>` without forcing a block formatting context.
- **SVG element**: `<svg viewBox="0 0 1184 290">` — the full horizontal lockup. `fill="currentColor"`. `aria-hidden="true"` and `focusable="false"` (the latter prevents IE11 and legacy Edge from making the SVG focusable). `height` is set inline via the `height` prop; `width` is `auto` so the aspect ratio is always preserved.
- **Geometry**: Two path groups inlined from `wordmark-geometry.ts`:
  - The eagle isotype — a complex multi-path glyph derived from the Pouākai eagle, abstract and geometric. It occupies the left portion of the 1184×290 viewBox.
  - The POUKAI letterforms (P, O, U, K, A, I) — each character as a path, scaled to 1.8× via transform matrices.
- **Screen-reader label**: a visually-hidden `<span className={styles.sr}>` containing the `label` prop value. This span uses the canonical `.sr-only` technique: `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0`. The SVG itself is `aria-hidden` — the `<span>` carries the accessible name.

### Geometry is inline, not external

The SVG paths are compiled into `wordmark-geometry.ts` by `scripts/build-wordmark.mjs` from `src/atoms/Wordmark/poukai-logo.svg`. The compiled string is injected via `dangerouslySetInnerHTML`. This approach:

1. Makes the component self-contained — no `<symbol>` sprite, no separate image request, no external SVG file to serve.
2. Freezes the geometry at build time — consumers cannot accidentally hotlink or override the mark.
3. Allows the mark to appear at arbitrary sizes without a second network request.

`dangerouslySetInnerHTML` is safe here because the value is a static string constant from the build, not user-supplied data.

---

## 4. Props API

```tsx
interface WordmarkProps extends ComponentPropsWithoutRef<"span"> {
  height?: number; // default 64
  label?: string; // default "Poukai"
}
```

**`height`** (number, default `64`): The rendered SVG height in pixels. Width scales proportionally via `width: auto` on the SVG and the 1184×290 viewBox aspect ratio (~4.08:1). Default 64px is sized for general editorial use. SiteShell sets `height={56}` for the nav chrome — the caller chooses the right rung for the context. There is no set of named size tokens for the Wordmark height — the caller passes a pixel value directly, because the correct height varies by context (nav bar, hero, print, etc.) and is not a brand token concern.

**`label`** (string, default `"Poukai"`): The visually-hidden accessible label announced by screen readers. Default `"Poukai"` is the brand name without the `.ai` domain extension — consistent with the `aria-label="Poukai — home"` SiteShell applies to the brand link wrapper. Callers may override to `"Poukai — home"` or `"pouk.ai"` if the context requires a more descriptive label. When Wordmark is inside an already-labeled link (`<a aria-label="…">`), the label content is redundant but harmless.

**Standard HTML spread** (`ComponentPropsWithoutRef<"span">`): `id`, `data-*`, `className`, event handlers, etc. are forwarded to the root `<span>`. `style` is accepted and forwarded — callers who need to position the mark use `style` or `className`.

**What was not exposed as a prop:**

- `color` — not needed. `currentColor` inheritance handles all cases, including inversion.
- `variant` (`"light" | "dark"`) — not needed. Same reason as `color`.
- `width` — not needed. Width is always derived from height and the fixed aspect ratio. Exposing `width` independently would allow callers to distort the mark.
- `paths` or any geometry override — the mark geometry is frozen. No override surface.

---

## 5. Token contract

Wordmark consumes no design tokens directly. It has one indirect dependency:

| Dependency       | Source            | Role                                                                                                                                                                  |
| ---------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `currentColor`   | cascaded from ancestor | All SVG paths use `fill="currentColor"`. The effective color is whatever `color` value the parent sets — typically `var(--fg)` (`#1D1D1F`) at rest, or `var(--bg)` for an inverted treatment. |

The CSS module contributes no token references. `.root` is `display: inline-flex` only. `.svg` is `display: block; height: 100%; width: auto; flex-shrink: 0`. `.sr` is the `.sr-only` clip pattern — no tokens.

**`--fs-wordmark` note.** A token `--fs-wordmark: clamp(1.0625rem, 0.95rem + 0.6vw, 1.25rem)` exists in `tokens.css` and appears to have been intended for a text-based Wordmark variant. It is currently unreferenced — the component uses the `height` prop instead. This is flagged as an orphaned token in BACKLOG.md.

---

## 6. States & motion

**Static.** Wordmark has no interactive states of its own. It is a display element.

**Hover / focus / active**: No states on the Wordmark component. When wrapped in an `<a>` by the caller (e.g. SiteShell's brand link), the anchor's states apply. SiteShell's `.brand` rule suppresses the global underline-grow animation (`background-image: none; padding-bottom: 0`) so the wordmark link does not get the body-link underline treatment — it is a logo, not a prose link. The focus ring on the brand anchor is `outline: 2px solid var(--accent); outline-offset: 4px; border-radius: var(--radius-1)` — that rule lives in `SiteShell.module.css`, not in Wordmark.

**Reduced motion**: Not applicable. Wordmark is static.

---

## 7. Responsive behavior

Wordmark has no responsive behavior of its own. It renders at the `height` specified by the caller at all viewport widths. Responsive size changes (e.g. smaller in mobile nav) are the caller's responsibility — pass a smaller `height` value or use a container query/media query at the call site.

SiteShell uses `height={56}` at all breakpoints. If a mobile-specific size is needed in the future, SiteShell is the right place to apply the conditional, not Wordmark.

---

## 8. A11y

- The SVG has `aria-hidden="true"` and `focusable="false"`. It is not in the accessibility tree.
- The visually-hidden `<span>{label}</span>` carries the accessible name. Screen readers announce the label when they encounter the component.
- When Wordmark is inside a link (`<a>`), the link's accessible name is computed from its contents — the visually-hidden span text contributes to that name. In SiteShell, the brand anchor has `aria-label="Poukai — home"` which overrides the computed name; the `<span>` text is then redundant but does not conflict.
- No keyboard interaction. Wordmark is not focusable.
- Contrast: the mark uses `currentColor`, so contrast depends on the caller's context. In the standard SiteShell context, `--fg` (`#1D1D1F`) on `--bg` (`#FBFBFD`) = 16.29:1 (AAA). The inverted case (`--bg` on a dark surface) provides equivalent contrast — the caller is responsible for ensuring an accessible pairing when overriding the inherited color.

---

## 9. Worked examples

### (a) Default — editorial use

```jsx
import { Wordmark } from "@poukai-inc/ui";

// 64px tall, "Poukai" label — general editorial placement
<Wordmark />
```

### (b) SiteShell nav bar (canonical)

```jsx
import { Wordmark } from "@poukai-inc/ui";

// SiteShell wraps Wordmark in its own branded anchor:
<a href="/" className={styles.brand} aria-label="Poukai — home">
  <Wordmark height={56} />
</a>
```

The `aria-label` on the anchor provides the full accessible name for the link. The Wordmark's own label (`"Poukai"`) is supplementary and does not cause a duplicate announcement because the anchor's `aria-label` takes precedence.

### (c) Inverted mark on a dark editorial band

```jsx
import { Wordmark } from "@poukai-inc/ui";

// Parent sets color: var(--bg) — Wordmark inherits and renders in near-white
<div style={{ background: "var(--fg)", color: "var(--bg)", padding: "var(--space-8)" }}>
  <Wordmark height={48} label="Poukai" />
</div>
```

No prop change needed on Wordmark — `currentColor` does the work.

---

## 10. Open questions

None. The component is stable. The orphaned `--fs-wordmark` token in `tokens.css` is tracked separately in BACKLOG.md (Low hygiene item) and is not a Wordmark component concern — it predates the `height` prop approach and can be dropped or repurposed.
