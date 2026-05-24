# HeroSection

**Status:** Approved (Phase 2 pilot — user-stakeholder sign-off; pending poukai-design canonical pass).

## 1. Intent

`HeroSection` is the marketing-page primary hero band — a `Section` wrapper composing a `Hero` molecule with an optional media slot (illustration or portrait). It serves the first content moment on any marketing or product landing surface, combining the `Section` organism's structural scaffolding (block padding, landmark semantics, responsive container) with the `Hero` molecule's display title, eyebrow, lede, and CTA stack. The two-column layout (text left, media right) lands at `md+` (≥ 768px) and collapses to a single stacked column below that breakpoint.

## 2. Anatomy

```
<section aria-labelledby="hero-section-title">        ← Section root, landmark
  ├── [text column — flex column, max-width: --hero-max]
  │     ├── <StatusBadge /> or equivalent              ← status slot (optional)
  │     ├── <h1 id="hero-section-title">…</h1>         ← Hero title (Instrument Serif)
  │     ├── <p class="lede">…</p>                      ← lede (--fg-muted)
  │     └── [CTA slot]                                 ← Button or equivalent (optional)
  └── [media column — max-width: --hero-illustration-max] (optional)
        └── <Portrait /> or any ReactNode
```

- Root: `<section>` (polymorphic via `as` if needed; `"section"` is the correct default for a page hero band).
- Inner layout: CSS grid / flex row at `md+`; single column below. The text column always leads in DOM order.
- Text column: delegates entirely to the `Hero` molecule. `HeroSection` owns the outer two-column structure; `Hero` owns the inner text stack.
- Media column: an optional slot. When absent the text column expands to full width (consistent with standalone `Hero` behavior).

## 3. Tokens

- `--space-16` — section block padding top + bottom (`size="default"`, matches `Section`)
- `--space-12` — section block padding when `size="tight"`
- `--space-12` — gap between text column and media column at `md+`
- `--hero-max` — max-width of the text column (38rem / 608px)
- `--hero-illustration-max` — max-width of the media column (25rem)
- `--content-max` — outer container max-width (64rem)
- `--page-pad` — horizontal padding when the organism is used outside `SiteShell`'s `<main>` centering
- `--bp-md` — 768px breakpoint (custom media query `@custom-media --bp-md`)
- `--bg` — section background (default; no separate surface token unless `surface` prop is added)
- `--fg` — title color (via `Hero`)
- `--fg-muted` — lede color (via `Hero`)
- `--font-serif` — title font family (via `Hero`)
- `--fs-tagline` — display title size, `size="display"` (via `Hero`)
- `--fs-tagline-intimate` — display title size, `size="intimate"` (via `Hero`)
- `--fs-body` — lede font size (via `Hero`)
- `--easing`, `--dur-slow`, `--dur-hero-title-rise`, `--dur-stagger-step` — entrance stagger tokens (via `Hero`, when `entrance="stagger"`)

## 4. Variants / Props

| Prop          | Type                              | Default     | Rationale                                                                                                                  |
| ------------- | --------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `status`      | `ReactNode`                       | —           | StatusBadge or equivalent; forwarded to `Hero`                                                                             |
| `title`       | `ReactNode`                       | required    | Page `<h1>`; forwarded to `Hero`                                                                                           |
| `lede`        | `string \| ReactNode`             | —           | Supporting copy; forwarded to `Hero`                                                                                       |
| `cta`         | `ReactNode`                       | —           | Button(s) or equivalent; forwarded to `Hero`                                                                               |
| `media`       | `ReactNode`                       | —           | Portrait, illustration, or any media ReactNode; occupies the right column at `md+`. When absent, text column is full-width |
| `size`        | `"display" \| "intimate"`         | `"display"` | Forwarded to `Hero`; controls title type scale and vertical rhythm                                                         |
| `entrance`    | `"stagger" \| undefined`          | —           | Forwarded to `Hero`; CSS-only stagger on page load                                                                         |
| `sectionSize` | `"default" \| "tight"`            | `"default"` | Controls block padding — `--space-16` (default) or `--space-12` (tight)                                                    |
| `as`          | `"section" \| "article" \| "div"` | `"section"` | Root landmark element                                                                                                      |

`sectionSize` is named to avoid collision with `Hero`'s `size` prop — both are passed down but govern distinct dimensions.

## 5. Interaction

Static organism. No interactive states on the container or columns. All interactive behavior (hover, focus, active) is delegated to slotted components (`Button`, `StatusBadge`, etc.). Keyboard tab order: status → title (non-interactive) → lede (non-interactive) → CTA slot → media slot (if interactive). Media slot follows text column in DOM order; on narrow viewports the media stacks below the CTA, maintaining logical reading order.

## 6. A11y

- Root `<section>` is a region landmark. The `Hero` title (`<h1>`) provides the accessible name via `aria-labelledby` on the root element — the engineer must wire `aria-labelledby={titleId}` where `titleId` is the `id` of the `<h1>` rendered by `Hero`.
- One `<h1>` per page. `HeroSection` is the sole h1 moment; never place a second `HeroSection` on a page.
- Media slot: any `<img>` passed via the `media` slot must carry a non-empty `alt`. `HeroSection` does not enforce this; it is a consumer obligation documented here.
- Decorative portraits (where the image adds no semantic information) may pass `alt=""` — screen readers skip them. Consumer decides.
- Contrast: all text pairs inherited from `Hero` — `--fg` on `--bg` = 16.29:1 (AAA), `--fg-muted` on `--bg` = 4.91:1 (AA).
- Column reorder: the media column is visually on the right at `md+` but must follow the text column in DOM order. Do not use `order` CSS to place media before text in source — screen readers and keyboard users encounter DOM order, not visual order.

## 7. Motion

Entrance animation is owned entirely by the `Hero` molecule inside the text column. When `entrance="stagger"` is passed, `Hero` fires its four-slot CSS stagger (`--dur-slow`, `--dur-hero-title-rise`, `--dur-stagger-step`, `--easing`). `HeroSection` itself has no additional motion.

Media column: no entrance animation in this spec. A future `mediaEntrance` prop could add a fade-in or slide-in; deferred until a consumer surface requests it.

`prefers-reduced-motion`: fully handled by `Hero`'s module CSS (`animation: none` on all stagger slots) and the global `tokens.css` suppression block. `HeroSection` adds no motion of its own and requires no additional reduced-motion override.

## 8. Anti-patterns

- Do not use `HeroSection` for interior page heroes (a sub-page `<h2>` moment). Use `Section` with a `Hero` child if a section-level hero is needed; reserve `HeroSection` for the page-level `<h1>` band.
- Do not nest `HeroSection` inside another `HeroSection` or inside a `Section`. It is a top-level page organism.
- Do not pass a `<video>` or `<iframe>` directly into the `media` slot without an accessible title/label — the slot accepts any ReactNode but does not guarantee accessible naming for embedded media.
- Do not use `HeroSection` when no title is needed. The `Hero` no-title variant (`variant="no-title"`) serves that case and belongs in a custom composition, not inside `HeroSection`.
- Do not override the text column's `max-width` to exceed `--hero-max`. The 38rem cap is the editorial reading measure; wider text columns degrade legibility and break the brand register.

## 9. Depends on

- `Section` (molecule) — outer structural wrapper, block padding, landmark semantics
- `Hero` (molecule) — text column: title, status, lede, CTA, entrance animation
- `Portrait` (atom, optional) — canonical media slot occupant; any ReactNode is accepted
