# Design spec: Wordmark

**Atomic layer**: atom
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-31

---

## 1. Status

Shipped in v0.1.0. Geometry revised in v0.3.0 (restored to horizontal isotype + wordtype lockup, viewBox aspect ratio change), v0.3.1 (letter-group shift so isotype renders flush-left), and v0.3.2 (proportions revised, inverted variant confirmed working).

**Revision 2026-05-31 (this spec):** White-label `src` prop added. Tracks GitHub issue #394 and autopost #46. Zero breaking change to existing API.

---

## 2. Purpose & non-goals

`<Wordmark>` is the canonical brand mark for the pouk.ai design system. It renders the full horizontal lockup — isotype (the eagle glyph) left-anchored beside the wordtype (POUKAI letterforms) — as an inline SVG at a caller-specified height. Width scales proportionally from the viewBox aspect ratio.

The mark uses `fill="currentColor"` throughout, so it inherits whatever foreground color is in scope. This makes light-on-dark inversion effortless: wrap the Wordmark in a parent that sets `color: var(--bg)` and the mark inverts. No `color` prop, no `variant` prop, no additional style override is needed.

**White-label extension.** When the optional `src` prop is provided, the component renders an `<img>` element instead of the inline SVG. The caller's logo image is displayed at the same `height`; `width` is `auto`. The `label` prop becomes the `alt` text on the image. This enables per-deployment logo overrides driven by environment variables without forking the component.

**Distinguishing Wordmark from Portrait.** `Portrait` is a photograph of a person — a `<picture>` element with AVIF/WebP/JPEG source stacking, `srcset`, and an enforced non-empty `alt`. Wordmark is a geometric SVG glyph set or a consumer-supplied logo image. Portrait is editorial content; Wordmark is brand chrome. They are never composed together.

**Non-goals:**

- Wordmark does not ship the isotype, stacked lockup, banner, or avatar-format assets. Those are in `src/brand/` as static files. Wordmark is specifically the inline-SVG React component for the horizontal lockup (or its white-label image replacement).
- Wordmark does not manage its own color for the bundled SVG path. Color is always inherited via `currentColor`.
- Wordmark does not render as a navigational element. Wrapping it in an `<a>` is the caller's job.
- Wordmark does not support arbitrary SVG transforms or path overrides. The geometry is frozen code generated from the source SVG.
- A separate `BrandMark` atom is **not warranted** at this time — see §10 for the decision and rationale.

---

## 3. Anatomy

### Bundled path (no `src` prop)

- **Root element**: `<span>` — `display: inline-flex`. A `<span>` (inline-level) rather than a `<div>` so the mark can sit inline or inside an `<a>` without forcing a block formatting context.
- **SVG element**: `<svg viewBox="0 0 1184 290">` — `fill="currentColor"`. `aria-hidden="true"` and `focusable="false"`. `height` is set inline via the `height` prop; `width` is `auto`.
- **Geometry**: Two path groups from `wordmark-geometry.ts` — the eagle isotype and the POUKAI letterforms.
- **Screen-reader label**: visually-hidden `<span className={styles.sr}>` containing the `label` prop. The SVG is `aria-hidden`; the span carries the accessible name.

### White-label path (`src` provided)

- **Root element**: same `<span>` with `display: inline-flex`.
- **Image element**: `<img src={src} alt={label} height={height} width="auto" />` — standard HTML img with explicit `height` and `width="auto"`. The image is **not** `aria-hidden` because the `alt` attribute carries the accessible name directly on the `<img>` itself; the visually-hidden `<span>` is omitted in this path to avoid duplicate announcements.
- **No inline SVG** is rendered. The consumer's raster or vector URL is displayed as-is.

---

## 4. Props API

```tsx
interface WordmarkProps extends ComponentPropsWithoutRef<"span"> {
  height?: number; // default 64
  label?: string; // default "Poukai"
  src?: string; // optional: URL of a white-label logo image
}
```

**`height`** (number, default `64`): The rendered height in pixels. In the bundled SVG path, this sets `height` inline on the `<svg>`; `width: auto` preserves the 4.08:1 viewBox aspect ratio. In the white-label image path, this sets `height` on the `<img>`; `width: auto` allows the browser to derive width from the intrinsic image aspect ratio. In both paths the caller controls the height rung; the width is always derived.

**`label`** (string, default `"Poukai"`): In the bundled SVG path, this populates the visually-hidden `<span>`. In the white-label path, this becomes the `<img alt>`. This is the sole accessible name in both cases. Callers passing `src` should set `label` to a meaningful name for their brand (e.g. `"Acme"` rather than the default `"Poukai"`). The default `"Poukai"` is safe to leave unchanged only for the bundled mark.

**`src`** (string, optional, default `undefined`): A URL to a white-label logo image. Any URL format accepted by a standard `<img src>` is valid — relative paths, absolute paths, CDN URLs, data URIs, inline SVG `data:` URLs. No remote validation or URL pattern restriction is applied on the component side, consistent with `VideoEmbed`/`AudioPlayer` hardening posture. The one exception is that `javascript:` scheme URLs must be blocked by the engineer at the prop boundary (attribute sanitization, not network validation) — this is the same defensive posture as any other user-supplied `src`. The consumer is responsible for trust of the URL origin; the DS does not perform CSP enforcement.

**Standard HTML spread** (`ComponentPropsWithoutRef<"span">`): `id`, `data-*`, `className`, `style`, event handlers forwarded to the root `<span>`.

**What was not exposed as a prop:**

- `color` — not needed. `currentColor` handles the bundled path; the white-label image owns its own colors.
- `variant` (`"light" | "dark"`) — not needed. Same reason as `color`.
- `width` — not needed. Width is always derived in both rendering paths.
- `paths` or any geometry override — the mark geometry is frozen.

---

## 5. Color contract: `currentColor` vs. white-label images

This is the most important design consequence of the `src` prop and must be clearly documented for consumers.

**Bundled mark (no `src`):** All SVG paths use `fill="currentColor"`. The effective color is whatever `color` value the parent sets — typically `var(--fg)` at rest, or `var(--bg)` for an inverted treatment. Light/dark mode inversion is automatic and zero-config.

**White-label image (`src` provided):** The `<img>` element has no `currentColor` relationship. The image file renders exactly as authored — colors are baked into the asset. **White-label marks own their own color and do not inherit `currentColor`.** Consequences:

- Dark-mode inversion does not happen automatically. If the consumer wants a dark-mode logo, they must supply a second asset and swap `src` conditionally (e.g. via a `prefers-color-scheme` media query at the call site, or by passing a dark-mode-appropriate asset directly).
- The DS does not provide a `srcDark` prop. White-label color management is fully the consumer's responsibility. This is by design — the DS cannot know the consumer's brand palette.
- Callers using a white-label mark on a dark background must ensure their image has sufficient contrast against that background. The DS makes no guarantee and issues no warning.

---

## 6. CLS / height behavior

The `height` prop sets a concrete pixel height on both `<svg>` and `<img>`. This prevents Cumulative Layout Shift (CLS) in both paths:

- **SVG path**: The `<svg>` has an explicit `height` attribute. The viewBox aspect ratio drives `width: auto`. Browser reserves the correct block size immediately.
- **Image path**: The `<img>` has an explicit `height` attribute and `width="auto"`. Modern browsers use the declared height to reserve block size before the image loads, preventing reflow. **Note:** CLS prevention for the image path requires that the image's intrinsic aspect ratio is honored. If a consumer passes a `style` override that constrains both dimensions (e.g. `style={{ width: 200, height: 40 }}`), CLS is still prevented because both dimensions are explicit. The component does not block this — it is valid usage.
- **Absent height**: The default `height={64}` ensures a size is always available even if the prop is omitted.

---

## 7. Token contract

The white-label extension introduces no new tokens.

**Bundled path** — unchanged from prior spec:

| Dependency     | Source                 | Role                                                               |
| -------------- | ---------------------- | ------------------------------------------------------------------ |
| `currentColor` | cascaded from ancestor | All SVG paths. Typically `var(--fg)` or `var(--bg)` for inversion. |

**White-label path:**

| Dependency | Source | Role                                   |
| ---------- | ------ | -------------------------------------- |
| None       | —      | Image renders its own embedded colors. |

The CSS module contributes no token references in either path. `.root` is `display: inline-flex` only. `.sr` is the `.sr-only` clip pattern — no tokens.

---

## 8. States & motion

**Static.** Wordmark has no interactive states of its own in either rendering path. It is a display element.

**Hover / focus / active**: No states on Wordmark. When wrapped in an `<a>`, the anchor's states apply. The SiteShell brand link's focus ring (`outline: 2px solid var(--accent); outline-offset: 4px; border-radius: var(--radius-1)`) lives in `SiteShell.module.css`, not in Wordmark.

**Reduced motion**: Not applicable. Wordmark is static.

---

## 9. A11y

**Bundled path (no `src`):**

- The SVG is `aria-hidden="true"` and `focusable="false"`.
- The visually-hidden `<span>{label}</span>` carries the accessible name.
- When Wordmark is inside a link with `aria-label`, the link label takes precedence; the span text is supplementary and harmless.
- No keyboard interaction.
- Contrast: `currentColor` depends on caller's context. Standard SiteShell context: `--fg` on `--bg` = 16.29:1 (AAA).

**White-label path (`src` provided):**

- The `<img>` has `alt={label}`. The `alt` text is the accessible name for the image.
- The visually-hidden `<span>` is NOT rendered — the `alt` attribute on `<img>` makes it redundant; rendering both would cause screen readers to announce the name twice.
- The image is not `aria-hidden`. It is meaningful content with a meaningful `alt`.
- When Wordmark is inside a link, the `<img alt>` contributes to the link's computed accessible name in the normal manner.
- Callers must not pass `label=""` when using `src` — a blank alt on a white-label logo removes the accessible name from the link it lives inside.
- Contrast: owned by the white-label image asset. The DS cannot verify this; the consumer is responsible.

---

## 10. Decision: no separate `BrandMark` atom

**Question.** Should white-label support be a new `BrandMark` atom or an extension of `Wordmark`?

**Decision.** Extend `Wordmark`. No separate `BrandMark`.

**Rationale.** The white-label image path is structurally identical to the bundled SVG path: same root `<span>`, same `height` prop, same `label`/accessible name, same layout contract, same composition rules (wraps in an `<a>`, sits in SiteShell's brand slot). The only difference is the rendering mechanism. A separate atom would:

- Duplicate the height/label prop contract
- Require consumers to conditionally import two different atoms based on deployment config
- Force SiteShell to detect which atom to render

A single `Wordmark` with an optional `src` prop covers both cases with one import. The fallback contract is clean: `src` absent = bundled POUKAI mark; `src` present = consumer's image. Zero breaking change. The additional complexity in the component implementation is one conditional branch — well within the complexity budget of an atom.

**Future consideration.** If white-label requirements grow to include: multi-asset dark/light toggle, animated SVG logos, or a `<picture>` source stack with WebP/AVIF variants, a `BrandMark` atom should be revisited at that point. The current `src: string` API is a deliberate starting point, not a forever ceiling.

---

## 11. Prop intent

- "Consumers must be able to pass a URL for a custom logo that replaces the bundled SVG mark at the same `height`."
- "The accessible name (`label`) must serve as `alt` text when rendering a custom image, and as visually-hidden screen-reader text when rendering the bundled SVG."
- "When `src` is absent, behavior must be byte-for-byte identical to the pre-extension API (zero breaking change)."
- "The component does not validate or transform the `src` URL beyond blocking `javascript:` scheme at the attribute level — this is not a white-list approach, consistent with how `VideoEmbed` and `AudioPlayer` handle consumer-supplied URLs."
- "The `height` prop controls rendered height in both rendering paths. Width is always derived (never independently settable)."
- "Consumers who need dark-mode logo switching supply their own conditional `src` value at the call site. The DS does not manage multi-asset white-label logo variants."

---

## 12. Composition rules

- Wordmark (either path) is never interactive on its own. Wrap in an `<a>` at the call site if navigation is needed.
- In SiteShell, the `<Wordmark>` occupies the brand anchor slot. SiteShell does not need to change when a `src` is passed — the prop is simply forwarded.
- Do not render two Wordmarks inside SiteShell's children area — SiteShell already renders one in its header.
- The white-label `<img>` may display a rectangular logo — the consumer is responsible for appropriate clear-space via padding/margin at the call site. The DS component provides no automatic clear-space token.

---

## 13. Responsive behavior

No responsive behavior in the component itself. Responsive size changes (e.g. smaller in mobile nav) are the caller's responsibility. For white-label images, the caller may also want to supply a compact version of the logo at small sizes — this is entirely a call-site concern.

---

## 14. Out of scope

- `srcDark` prop — dark-mode logo variant switching. Out of scope for this revision. Consumer manages conditionally.
- `<picture>` source stacking for white-label images (WebP/AVIF). Out of scope.
- Animated SVG logos via `src`. The `<img>` element will render animated SVGs if the consumer passes one; no DS-level constraint, but the DS does not explicitly support or test this.
- Any geometry override for the bundled SVG path.

---

## 15. Open questions (founder sign-off not required; decisions made above)

None. The `src` extension is additive and requires no new tokens. The `BrandMark` vs. `Wordmark` question is resolved (extend). The color contract for white-label images is clear (consumer owns it). The `javascript:` blocking posture is consistent with existing DS hardening precedent.
