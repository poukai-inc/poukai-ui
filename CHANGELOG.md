# @poukai-inc/ui

## 0.20.0

### Minor Changes

- 4c057f4: Add `Field`, `Input`, and `Textarea` form primitives — a coherent set of single-line input, multi-line textarea, and composition-wrapper molecules. `Field` auto-wires label association, `aria-describedby`, `aria-invalid`, and `required` onto its child control via `cloneElement`. Zero new tokens. Unblocks waitlist surfaces, contact forms inside Dialog, and settings panes.

## 0.19.0

### Minor Changes

- 72b3ca0: Add `Tabs` organism — compound tabbed interface wrapping `@radix-ui/react-tabs` with brand styling. Ships `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content` compound subcomponents and a `TabsBasic` convenience wrapper. Horizontal and vertical orientations supported. Zero new tokens.

## 0.18.0

### Minor Changes

- 942e06c: feat(Avatar): add Avatar atom

  New `<Avatar>` atom supporting three modes via discriminated union:
  - `mode="image"` — renders `<img loading="lazy">` with `src` and optional `alt`
  - `mode="initials"` — renders 1–2 character text label
  - `mode="empty"` (default) — blank placeholder

  Props: `size` (sm/md/lg → 24/32/40px), `shape` (circle/square), `name` (accessible label).

  A11y: `name` prop produces `role="img"` + `aria-label` on the root span for initials and
  empty modes, and for image mode when `alt` is omitted. Image with `alt` is self-labelling.

  Stateless by design — no `onError` fallback, no `imgLoading` prop, no initials derivation.

- 6e3facd: Add `Dialog` organism — compound modal overlay built on `@radix-ui/react-dialog`.

  Exports:
  - `Dialog` namespace: `Dialog.Root`, `Dialog.Trigger`, `Dialog.Portal`, `Dialog.Overlay`, `Dialog.Content`, `Dialog.Title`, `Dialog.Description`, `Dialog.Close`
  - `DialogBasic` — convenience wrapper with built-in X close button (lucide `X`), title, optional description, body slot, and optional footer action row

  Token contract: `--bg-elevated`, `--fg`, `--fg-muted`, `--hairline`, `--hairline-w`, `--accent`, `--radius-3`, `--radius-1`, `--space-2`–`--space-8`, `--font-sans`, `--fs-body`, `--fs-meta`, `--dur-fast`, `--easing`, `--page-pad`, `--surface`.

  All accessibility plumbing (focus trap, `aria-modal`, `aria-labelledby`, ESC dismiss, return focus) delegated to Radix. DS adds brand styling only.

  Available via `@poukai-inc/ui`, `@poukai-inc/ui/organisms`.

- bbd0329: feat: add FieldNote molecule

  Adds `<FieldNote>` — the canonical inline technical-aside primitive for long-form prose surfaces.

  A short parenthetical callout (a sentence or two) that sits inline with body copy and provides a factual clarification, caveat, or data footnote without interrupting reading flow. Renders as `<aside>` with a 1px left hairline rule (`--hairline-w solid --hairline`), `--space-3` (12px) inset, and `--space-6` (24px) block margin.

  Optional `label` prop (string) renders a single `<p>` above the body text in the Eyebrow typographic register (`--fs-meta`, `--fg-muted`, uppercase, `--tracking-eyebrow`). Defaults to `undefined` — the left rule is the primary signal.

  Distinct from `<Pull>` (3px rule, 20–26px serif-italic, editorial accent) and `<FailureMode>` (section-level, titled, indexed). FieldNote is body-register: `--fs-body` (17–19px), Geist roman, 1px rule.

  New exports: `FieldNote`, `FieldNoteProps`.

  No new tokens introduced. No breaking changes.

- 421cdf5: feat: add Footer organism

  Adds `<Footer>` — the canonical site-footer content block for pouk.ai surfaces.

  Composes copyright string + `<EmailLink variant="muted">` + an optional secondary `<nav>` link row. The `as` prop (`"div"` | `"footer"`, default `"div"`) prevents the double-`<footer>` landmark problem when Footer is slotted into SiteShell's `footer` prop. When `as="footer"` (standalone), Footer applies its own hairline rule and padding mirroring SiteShell's `.footer` CSS.

  New exports: `Footer`, `FooterProps`, `FooterLink`.

  No new tokens introduced. No breaking changes.

- 77b13d8: feat: add Quote molecule

  Adds `<Quote>` — the canonical attributed customer testimonial block.

  A short prose body (1–4 sentences) from a named person, rendered at `--fs-pull` (20–26px fluid) in Geist sans-serif roman weight — the typographic differentiator from `<Pull>` (Instrument Serif italic) and `<Statement>`. Consumers can tell Quote from Pull at a glance without reading the attribution.

  Root element is `<figure>` with `<blockquote>` for the quoted body and `<figcaption>` for the attribution row — the HTML5-recommended structure for attributed quotations. No extra ARIA required; the semantic structure does the work.

  Props:
  - `quote` (required ReactNode) — quoted body text; accepts inline `<em>`/`<strong>`; no block-level children.
  - `name` (required string) — attributed person's name; `font-weight: 500`, `--fg`, `--fs-meta`.
  - `role` (optional string) — role or title; `font-weight: 400`, `--fg-muted`, `--fs-meta`. Omit to suppress.
  - `avatar` (optional ReactNode) — leftmost element of the attribution row; accepts any ReactNode. DS does not ship an Avatar atom. Convention: 40×40px, `border-radius: 50%` (documented in JSDoc; not enforced).

  Hairline rule (`border-top: var(--hairline-w) solid var(--hairline)`) above `<figcaption>` is always on. Use `className` to suppress if needed.

  New exports: `Quote`, `QuoteProps`.

  No new tokens introduced. No breaking changes.

- ce0de62: feat: add Tag atom

  Adds `<Tag>` — the system's canonical inline categorical pill.

  A compact label that communicates type, category, topic, or metadata classification of adjacent content. Answers "what kind of thing is this?" inline with content flow: inside a card, in a topic list, beside a title, or inside a sentence.

  Root element is `<span>` (non-polymorphic). Non-interactive — no hover, focus, active, or disabled states. `forwardRef<HTMLSpanElement, TagProps>` with `...rest` spread.

  Props:
  - `children` (required ReactNode) — label text; plain string is idiomatic; ReactNode accepted for rare inline `<strong>` emphasis.
  - `tone` (`"default"` | `"muted"`, default `"default"`) — two tones only. `"default"`: `--surface` fill, `--fg` text, no border. `"muted"`: transparent background, `--hairline` border (1px), `--fg-muted` text.
  - `icon` (optional ReactNode) — optional leading icon slot. When present, root shifts to `inline-flex` for optical alignment. Recommended icon size: 12px (JSDoc guidance; not type-enforced). Pass `aria-hidden="true"` on decorative icons.

  Typography: `--font-sans`, `--fs-meta` (14px fixed), `font-weight: 400`, `line-height: var(--lh-meta)` (1.2), `letter-spacing: normal`. Geometry: `border-radius: 999px` (pill constant per spec §3), `padding-block: var(--space-1)`, `padding-inline: var(--space-2)`, `box-sizing: border-box`.

  Contrast: `"default"` 15.46:1 AAA. `"muted"` 4.91:1 AA normal at 14px — passes WCAG 2.1 4.5:1 threshold.

  New exports: `Tag`, `TagProps`.

  No new tokens introduced. No breaking changes.

## 0.17.0

### Minor Changes

- a1557c0: feat(atoms): add EmailLink atom

  New `<EmailLink>` atom — the canonical `mailto:` affordance for the Poukai design system.
  - `email` prop computes `href="mailto:${email}"` — consumers never pass `href` directly.
  - `label` prop (optional) overrides visible text; defaults to the email string.
  - `icon` prop (optional leading ReactNode) — shifts root to `inline-flex` when present.
  - `qualifier` prop (optional) renders a trailing muted ` (qualifier)` span inside the anchor.
  - `variant="default"` (default) — `--fg` → `--accent` on hover.
  - `variant="muted"` — `--fg-muted` → `--fg` on hover; matches existing SiteShell `.muted-link` treatment.
  - Persistent `text-decoration: underline` (intentional brand override of the global animated grow-underline — a `mailto:` is not a navigational link).
  - Focus ring: 2px solid `--accent`, 4px offset (link convention, not button).
  - No new tokens — built entirely from the existing token vocabulary.
  - Exports: `EmailLink`, `EmailLinkProps`, `EmailLinkVariant` from `@poukai-inc/ui` and `@poukai-inc/ui/atoms`.

- a1557c0: Add `Eyebrow` atom, `--tracking-eyebrow` + `--lh-meta` tokens, and `displayName` backfill.

  **New component — `Eyebrow`**

  Canonical micro-label atom (`src/atoms/Eyebrow/`). Resolves the three independently-authored eyebrow patterns in `RoleCard`, `FailureMode`, and the global `.micro` utility into one shape: `--tracking-eyebrow: 0.06em`, `--fs-meta` (14px), `--font-sans`, weight 500.
  - `variant` prop: `"muted"` (default, `--fg-muted`), `"solid"` (`--fg`), `"numbered"` (muted + inline numeral slot).
  - `numeral` prop (string): leading index rendered with `font-variant-numeric: tabular-nums` and `--space-2` gap.
  - `as` prop: polymorphic root element (`span` default; `p`, `div`, `dt`, `h2`–`h6`, `li`). Follows the Statement pattern.
  - `margin: 0` — consuming context owns spacing.
  - Exports: `Eyebrow`, `EyebrowProps`, `EyebrowVariant` from root, `./atoms` subpath.

  **New tokens** (additive — minor bump)
  - `--tracking-eyebrow: 0.06em` — Canonical letter-spacing for Eyebrow labels. Resolves the 0.04/0.06/0.08em drift across existing molecules.
  - `--lh-meta: 1.2` — First named line-height token in the system, scoped to the meta/eyebrow register.

  **`displayName` backfill** (no API change — patch-level, bundled here for cleanliness)

  Added `Component.displayName = "Component"` to: `Button`, `Stat`, `StatusBadge`, `Wordmark`, `FailureMode`, `Principle`, `RoleCard`, `SiteShell`. Matches the pattern already on `Hero`, `Statement`, `Portrait`, and the new `Eyebrow`.

  **Migration notes**

  `RoleCard`, `FailureMode` inline eyebrow patterns will adopt `<Eyebrow>` in a follow-up PR. No existing molecule output changes in this release.

- 935f64d: Add `FeatureCard` molecule — canonical structural feature-grid tile.

  New component `<FeatureCard>` at `src/molecules/FeatureCard/`. Canonical primitive for capability and service grids. Presents a single feature as a bounded content object: optional icon, optional eyebrow, required title, required body, optional footer. Polymorphic via `as` prop (`"article"` | `"section"` | `"div"` | `"li"`). Two variants: `"default"` (transparent, no border) and `"bordered"` (`--surface` bg, `--hairline` border, `--radius-3`). `aria-labelledby` wired on `article`/`section` roots; omitted for `div`/`li` per spec. Icon slot wrapped in `aria-hidden="true"` span. String eyebrow auto-wrapped in `<Eyebrow variant="muted">`; ReactNode eyebrow passed through. String body auto-wrapped in `<p style="margin:0">`. No new tokens — built entirely from the existing vocabulary.

- 935f64d: Add `LinkCard` molecule — canonical interactive card primitive.

  The entire card surface is a single `<a>` click target. Designed for navigational index pages (`/work`, `/posts`, `/case-studies`) where each grid item routes to a destination.

  **Props:** `href`, `asChild` (Radix Slot, identical to `Button` pattern), `eyebrow` (string → auto-wraps in `<Eyebrow variant="muted">`; ReactNode → pass-through), `title` (required), `titleAs` (`"h2" | "h3" | "h4"`, default `"h3"`), `body`, `footer`, `icon`, `external`, `variant`.

  **Variants:**
  - `default` — `--surface` background, `1px solid --hairline` border, `--radius-3` corners, `--space-8` inset padding. Use in grid contexts.
  - `quiet` — `--bg` background, hairline rule top only, no radius, block padding only. Use in dense vertical list contexts.

  **Interactions:** hover shifts border-color to `--accent` (`--dur-mid` / `--easing-link`); `:active` presses `translateY(1px)` at `--dur-press`; `:focus-visible` ring 2px solid `--accent` with `outline-offset: 4px`.

  **Accessibility:** `external` prop adds `target="_blank"`, `rel="noopener noreferrer"`, and a visually-hidden `(opens in new tab)` span. Global `<a>` underline animation is suppressed on the card root. No nested interactive elements — documented as a hard constraint.

  **New utility:** `.sr-only` visually-hidden class shipped in `LinkCard.module.css` (not yet in `tokens.css`; surfaced to `poukai-design` for a future token pass).

- 935f64d: Link resting-state discoverability + atom inversion fixes.

  **Global `<a>` rule** — links now carry a persistent `--hairline`-colored
  underline at rest. On hover, an `--accent`-colored underline grows over the
  top via a two-layer CSS gradient. This gives every link a visible affordance
  in its resting state without violating the `--accent`-is-signal-only rule.
  Cascade-affects every anchor in the system (EmailLink, SiteShell nav, Hero
  CTAs). Components that suppress the global rule via `background-image: none`
  (LinkCard root + title, SiteShell Wordmark, `.muted-link`) are unaffected.
  Brand decision logged in `meta/brand.md`.

  **Stat** — `.value`, `.caption`, and `.source` now inherit `currentColor`
  (captions via `color-mix(in srgb, currentColor 65%, transparent)` for the
  muted register). Stat is now invertable: wrap with `color: var(--bg)` on a
  `background: var(--fg)` parent and the numeral + caption render correctly
  on the dark surface. Previously hardcoded `--fg` / `--fg-muted` on children
  suppressed inheritance.

  **EmailLink** — dropped the persistent underline override. EmailLink now
  inherits the global `<a>` two-layer underline behavior. Removes the brand
  divergence between mailto links and every other link in the system.

- a1557c0: Add `Pull` molecule — inline editorial pull-quote primitive.

  New component `<Pull>` at `src/molecules/Pull/`. Left-ruled blockquote accent for inline long-form prose. Supports `variant="serif"` (Instrument Serif italic, default) and `variant="sans"` (Geist roman), polymorphic `as="blockquote" | "aside"`, optional `attribution` slot (renders as `<footer>` in blockquote, `<p>` in aside), and native `cite` attribute pass-through.

  New token `--fs-pull: clamp(1.25rem, 1rem + 1vw, 1.625rem)` (20–26px fluid) fills the gap between `--fs-body` (17–19px) and `--fs-statement` (28–44px).

- a1557c0: Add Section molecule — canonical page-section wrapper consuming Eyebrow atom.

  `<Section>` owns the vertical rhythm around a section's header block (eyebrow + title + lede) and exposes a children slot for body content. Polymorphic `as` prop (`section` / `article` / `aside` / `div`), `titleAs` heading-level swap, `size="tight"` padding variant, automatic `aria-labelledby` wiring for landmark elements, and empty-header guard. Constructed entirely from the existing token vocabulary — no new tokens.

- 935f64d: Add `TeamCard` molecule — canonical person tile.

  `<TeamCard>` surfaces a single team member as a brand object: portrait, name, role, optional bio, and optional contact affordance. Intended for /about and /team page contexts.

  **API surface:**

  ```tsx
  <TeamCard
    portrait={<Portrait src="…" alt="…" aspect="1:1" width={800} />}
    name="Arian Zargaran"
    role="Founder, Engineering"
    bio="Builds production AI systems end-to-end."
    contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
    eyebrow="Founding team"
    layout="stacked" // "stacked" | "horizontal"
    nameAs="h3" // "h2" | "h3" | "h4"
    as="article" // "article" | "section" | "div"
  />
  ```

  **Key design decisions:**
  - No padding, no border, no background — content tile, not chrome tile. Consumer's grid owns the column gutter.
  - `layout="horizontal"` pins portrait at `5rem` width; collapses to stacked below 768px.
  - `aria-labelledby` wired automatically on landmark roots (`article`, `section`); omitted on `div`.
  - Eyebrow string convention (auto-wrap in `<Eyebrow variant="muted">`) matches `<Section>` and `<Pull>`.
  - `portrait` slot accepts `ReactNode` only — no `portraitSrc` shortcut. Portrait's API is authoritative.
  - No new tokens. Constructed entirely from the existing vocabulary.

## 0.16.1

### Patch Changes

- 81437c5: Internal: dedupe ESLint config. Inlined the rule set into `eslint.config.mjs` and removed the now-redundant `.eslintrc.cjs`. Zero behavior change — same rules, same plugins, same ignore patterns. The flat config still routes through `FlatCompat` so the legacy plugin shapes (`plugin:@typescript-eslint/recommended`, etc.) continue to work. No consumer impact.

## 0.16.0

### Minor Changes

- 39a6151: Code-side cleanup pass closing the remaining 🟠 High items from the 2026-05-18 consistency audit. Per ADR-0003, token additions are a minor bump; this changeset is additive only and contains no breaking changes.

  **New tokens (additive)**
  - `--space-10: 2.5rem` — fills the previously-phantom rung between `--space-8` and `--space-12`. Used by Hero CTA desktop margin, FailureMode top padding, h1 desktop bottom margin (all of which previously consumed `var(--space-10, 2.5rem)` with a fallback).
  - `--dur-press: 80ms` — tactile click/press feedback duration, deliberately shorter than `--dur-fast` so `:active` transforms feel immediate. Used by `<Button>` transform transition.
  - `--dur-pulse: 1800ms` — `<StatusBadge status="available">` halo pulse. Replaces the previously-hardcoded `1800ms` literal.
  - `--fs-card-title: clamp(1.5rem, 1.15rem + 1.2vw, 2rem)` (24–32px) — card-title rung shared by `<RoleCard>`, `<Principle>`, `<FailureMode>` titles. Replaces three duplicated `clamp(...)` declarations.

  **Wider subpath surface (additive)**
  - `@poukai-inc/ui/molecules` now re-exports `Statement` and `StatementProps` (previously only reachable via the root barrel) and the full Hero discriminated-union types: `HeroDefaultProps`, `HeroNoTitleProps`, `HeroSize`, `HeroEntrance`, `HeroVariant`, `HeroBleed`.
  - Root barrel `@poukai-inc/ui` adds the three Hero types that were missing for parity with `Hero/index.ts`: `HeroDefaultProps`, `HeroNoTitleProps`, `HeroVariant`.

  **Token-consumer migrations**
  - `<Button>`: transitions now read `var(--dur-fast)` / `var(--easing)` for color and border; `var(--dur-press)` for transform. The wrong `var(--radius-2, 8px)` fallback (token is `4px`) is replaced with a plain `var(--radius-2)`.
  - `<StatusBadge>`: pulse animation reads `var(--dur-pulse)`.
  - `<RoleCard>`, `<Principle>`, `<FailureMode>`: title `font-size` reads `var(--fs-card-title)`.

  **Test backfill**
  - `<Button>`: variant assertions (primary/secondary/ghost class application); sm + lg size class + min-height assertions; className-merge and arbitrary-prop forwarding tests.
  - `<StatusBadge>`: idle-status coverage; default-status coverage; dot `aria-hidden` assertion; pulse-element count guard for available vs idle/closed; CSS regression guard pinning `animation-duration: 1.8s` + `animation-iteration-count: infinite`; className-merge and arbitrary-prop forwarding tests.

  CT suite goes from 242 to 270 passing tests with no fixtures or production-code regressions.

### Patch Changes

- 6f1ae83: Sync the LLM contract and consumer-facing docs with the components that have actually shipped, and extend the CI sync check so new components can no longer ship undocumented.
  - `meta/llms-full.txt` (mirrored to `dist/llms-full.txt`) gains `### Statement` and `### Portrait` component sections, an `illustration` slot bullet under `### Hero`, the `--fs-statement` and `--hero-illustration-max` token entries, and the three previously-undocumented warm-accent color tokens (`--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted`) that the extended sync check surfaced.
  - `scripts/build-llms-txt.mjs`: `COMPONENTS.molecules` now includes `Statement` and `Portrait` (generated `dist/llms.txt` reports 11 components, not 9). Also fixes a pre-existing path-emission bug where the Exports list rendered `@poukai-inc/ui./atoms` instead of `@poukai-inc/ui/atoms`.
  - `README.md`: "Components shipped today" table gains the `Statement` and `Portrait` rows.
  - `scripts/check-llms-tokens-sync.mjs`: in addition to the existing color-token assertion, the script now fails CI when a component directory under `src/{atoms,molecules,organisms}/` has no matching `### ComponentName` heading in `meta/llms-full.txt`.

  No runtime or public-API change; this is documentation, generated-asset, and CI-guard hardening.

## 0.15.1

### Patch Changes

- 1307b41: Define two tokens that shipped components were consuming without a fallback in `0.15.0`. Both were referenced in component CSS but absent from `src/tokens/tokens.css`, leaving the values undefined at runtime.
  - `--fs-statement: clamp(1.75rem, 1.25rem + 2vw, 2.75rem)` (28–44px). Italic-serif editorial Statement block; sits between `h2` and `--fs-tagline-intimate`. Consumed by `<Statement>` (`Statement.module.css`), which previously fell back to the browser-default font-size.
  - `--hero-illustration-max: 25rem`. Cap for the Hero illustration column in the two-column layout. Consumed by `<Hero illustration>` (`Hero.module.css`) and previously claimed in the `0.15.0` CHANGELOG as already-added, but never landed; without it the illustration column rendered without a width cap.

## 0.15.0

### Minor Changes

- 1908c99: Add `illustration` slot to `<Hero>` molecule. When provided, Hero switches to a two-column layout (text left, illustration right) above 720px; the illustration column hides below that breakpoint. Default `undefined` preserves the current single-column layout with zero regression for existing consumers. The illustration column animates as the fifth element when `entrance="stagger"` is active. Uses the `--hero-illustration-max` token (25rem) added to `tokens.css` by `poukai-design`.

## 0.14.0

### Minor Changes

- 70c8998: Add `--fs-display: clamp(3rem, 1.75rem + 4vw, 5.5rem)` (48–88px). Editorial display rung above `--fs-tagline` (max 68px), 8px below `--fs-stat-large` (max 96px) so numerals stay loudest. Reserved for editorial display moments where the page opens on a single statement and the Hero pattern is being deliberately replaced — at most once per page, not a heading replacement.

  Triaged from [poukai-ui#55](https://github.com/poukai-inc/poukai-ui/issues/55) (pouk.ai `/about` v2 Direction A). Consumer asked for two tokens (`--fs-display` 48–120px + `--fs-display-lg` 64–192px); designer counter-proposed one token at a tighter ceiling. See `meta/brand.md` Decision history (2026-05-18) and `meta/proposals/type-display-scale.md` for full rationale.

## 0.13.0

### Minor Changes

- 5071580: Add `Portrait` molecule — editorial photography primitive with AVIF/WebP/JPEG `<picture>` fallback chain, srcset generation, CLS-safe aspect-ratio, and enforced non-empty alt contract (WCAG 1.1.1).
- d6acfab: Add warm accent token tier: `--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted`.

  Saturated orange-vermillion editorial band tokens for the `/about` portrait section. Value is locked post-ship — the portrait asset is graded to match `--bg-warm-accent` (#C0452C). Restraint rules documented in `meta/brand.md` and `meta/llms-full.txt`. Contrast verified: `--fg-on-warm` 4.72 : 1 (AA), `--fg-on-warm-muted` 3.91 : 1 (AA-large, display/heading >= 24px).

## 0.12.0

### Minor Changes

- ecc5fac: Add `bleed="full"` prop to Hero and `--content-max-bleed` layout permission token.

  `bleed="none"` is the default — existing consumers are unaffected. `bleed="full"` extends the Hero section to `100vw` with inner content centered at `--content-max`. The `--content-max-bleed: 100vw` token is available for site-side compositions that need full-bleed without the Hero overlay.

  Closes #57.

## 0.11.0

### Minor Changes

- 0069cab: **Hero**: add `variant="no-title"` for editorial doorway pages without a heading in the doorway band.

  Editorial pages (starting with `/about`) want an eyebrow + lede opener with **no `<h1>`** in the doorway region — the page's heading lives in body content. The new variant provides a first-class DS primitive for this composition.

  ```tsx
  <Hero variant="no-title" eyebrow="About" lede="One to two sentences setting up the page." />
  ```

  - Renders an eyebrow `<p>` at `--fs-micro`, uppercase, `letter-spacing: 0.04em`, `--fg-muted`, then a lede `<p>` — no heading element emitted.
  - **Non-breaking**: all existing `<Hero>` invocations are unaffected. `variant` defaults to `"default"`.
  - TypeScript: discriminated union — `title` and `status` are excluded from the `"no-title"` variant's type; `eyebrow` is excluded from the default variant.
  - `align`, `entrance`, and `cta` remain available in both variants.
  - `entrance="stagger"` stagger sequence adapts to three slots (eyebrow → lede → cta) with compressed delays.
  - Consumer obligation: every page using `variant="no-title"` must place an `<h1>` in body content. The molecule does not emit one.

## 0.10.0

### Minor Changes

- b23ba8f: feat(Statement): add Statement molecule — editorial statement block with optional supporting line, hairline, and blockquote semantics
- 282e889: Add `--surface-section` token (`#F8F8FA`) — a fourth elevation tier for full-width alternating section bands on editorial pages. Positioned between `--surface` (#F5F5F7) and `--bg` (#FBFBFD). Additive; all existing consumers unaffected.

## 0.9.0

### Minor Changes

- 3b62bf4: feat(Button): add `size="compact"` — 40px rung between `sm` and `md` (issue #42)

  Adds a fourth size to `<Button>`. `compact` (40px min-height, `--fs-body`,
  9/16 padding) sits between `sm` (32px) and `md` (44px) — the editorial-CTA
  rung where `md` reads too heavy and `sm` reads too small. Aligned to Apple's
  "Compact" control register and the 4px spacing grid.

  The full Button height ladder is now exposed as tokens (`--btn-h-sm`,
  `--btn-h-compact`, `--btn-h-md`, `--btn-h-lg`) in `src/tokens/tokens.css`.
  The previously inline literals (32 / 44 / 52) are refactored to consume
  the tokens — same runtime values, named contract.

  Accessibility: `compact` passes WCAG 2.5.8 AA (24×24) but fails 2.5.5 AAA
  (44×44) — same posture as `sm`. Consumers on strict-AAA surfaces must use
  `md` or `lg`.

  Default `size="md"` is unchanged; every existing consumer is zero-regression.

  Closes #42.

## 0.8.0

### Minor Changes

- 445deeb: feat(Hero): add `entrance="stagger"` prop — CSS-only staggered reveal on load

  Adds an opt-in `entrance` prop to `<Hero>`. When `entrance="stagger"` is set,
  status, title, lede, and CTA animate in with a staggered top-down rise (8–12px
  translateY + fade, ~1.05 s total). Pure CSS @keyframes — zero JS, no
  IntersectionObserver, static-render-compatible.

  Default `entrance={undefined}` preserves existing static behavior; no changes
  for existing consumers.

  Accessibility: `prefers-reduced-motion: reduce` disables all animations via
  an explicit `animation: none` override in the component CSS module.

  Closes #47.

## 0.7.1

### Patch Changes

- f555833: Hero: compress vertical rhythm at size=intimate

  At size="intimate", status→title gap shrinks to --space-3 (12px) and title→lede gap shrinks to --space-4/--space-6 (mobile/desktop). Resolves disproportionate spacing flagged in live audit. No API change; display variant is unchanged.

## 0.7.0

### Minor Changes

- 8d8e792: Add `size` prop to `<Hero>` molecule with `"display"` (default) and `"intimate"` values.

  The `"display"` default preserves all existing consumer behavior byte-for-byte. `"intimate"` lowers the title clamp from `--fs-tagline` (36–68 px) to `--fs-tagline-intimate` (32–52 px) — a quieter register for low-density doorway pages. All other Hero rhythm (gaps, lede, CTA, color, font family, em accent) is unchanged across both values. New token `--fs-tagline-intimate` added to `tokens.css`.

## 0.6.1

### Patch Changes

- 0c25711: docs: sync llms-full.txt with 0.6.0 color tokens

  Documents `--bg-elevated` (#FFFFFF, front-most layer), corrects `--bg` value to `#FBFBFD`, and adds the three-step elevation rhythm and "never pure edges" rule. Adds a CI gate (`scripts/check-llms-tokens-sync.mjs`) that fails the build if a color token is defined in `tokens.css` but absent from `meta/llms-full.txt`.

## 0.6.0

### Minor Changes

- 60c67cf: Apple-aligned palette refinement: `--bg` shifts off pure white to `#FBFBFD` (apple.com canvas), and `#FFFFFF` becomes the reserved value of a new `--bg-elevated` token for popovers / sheets / front-most layers. Establishes a three-step elevation rhythm (`--surface < --bg < --bg-elevated`) and the "never pure edges" rule that makes the palette invert cleanly to dark mode. Page contrast remains AAA: `--fg` on `--bg` ≈ 16.3:1. See `meta/brand.md` for the full decision entry, contrast math, and dark-mode direction sketch.

## 0.5.0

### Minor Changes

- 3bfc703: Ship `llms.txt` + `llms-full.txt` as package exports — the design system's living rules for LLM consumers. Adds CI gate requiring `llms-full.txt` updates on component/token changes.

## 0.4.0

### Minor Changes

- e4f13cc: Add six brand assets under `brand/` for use cases beyond the horizontal `<Wordmark>` lockup: stacked lockup (SVG vector + transparent PNG), isotype-only transparent PNG, wide wordtype banner, plus avatar-sized stacked and isotype-only renders on a light-grey background. All available via the existing `@poukai-inc/ui/brand/*` subpath.
- 072d3bd: Ship `llms.txt` — a single LLM-consumable context file (llmstxt.org convention) built from `meta/decisions/*.md` + `src/tokens/tokens.css` + the curated component surface. Available via subpath `@poukai-inc/ui/llms.txt`. Regenerated on every `pnpm build` via the new `build:llms` script.

## 0.3.2

### Patch Changes

- 7e3c8c6: Visual polish pass:

  **Wordmark horizontal lockup proportions revised.** Three coupled changes to rebalance the mark's visual weight:
  - Gap between isotype and wordtype: 24 → 120 SVG units (~25 rendered px at SiteShell's 56px height).
  - Wordtype scale: 1× → 1.8× (cap-height ≈28px → ≈50px).
  - Isotype scale: 1× → 1.25× to give the feather more presence over the lettering.

  `viewBox` `0 0 662 274` → `0 0 1184 290` (aspect ratio 2.4:1 → ~4.08:1). Consumers sizing the mark by container width should re-check layouts. No prop API change. Supersedes the geometry lock from ADR-0009; see ADR-0011 for the full derivation, including the same-day corrections of the initial 40-SVG-unit gap and the subsequent isotype scale-up.

  **Wordmark inverted variant now actually inverts.** Removed the hardcoded `color: var(--fg)` on `.root` that was overriding the parent's color context. The SVG's `fill="currentColor"` now inherits from whatever color is in scope — so an inverted wrapper that sets `color: var(--bg)` actually produces a light mark on a dark background.

  **RoleCard grid overlap fixed.** Removed `min-height: 100%` from `.root`. CSS Grid items already stretch to the row height via the default `align-items: stretch`; the percentage height was resolving against an undefined parent context in some grid layouts and causing second-row cards to overflow into the first row.

  **StatusBadge `available` pulse made visible.** Keyframes: `scale(1 → 4)` (was `1 → 2.2`); `opacity(0.7 → 0 by 70%)` (was `0.6 → 0`). Duration `2400ms → 1800ms` with `ease-out` (was `ease-in-out`). Pulse background stays `--accent-glow`. The dot itself gains a static 2px `--accent-glow` halo so it reads as "lit" between pulses rather than going dark. The motion now reads as a soft heartbeat rather than a flicker.

## 0.3.1

### Patch Changes

- b3f854d: Re-shift POUKAI letter groups so the feather isotype renders flush-left of the full wordmark rather than overlapping the 'O' position.

## 0.3.0

### Minor Changes

- b3d9876: Restore Wordmark to horizontal lockup (isotype left, POUKAI lettering right, side-by-side).

  The SVG geometry in `brand/poukai-logo.svg` was rearranged: the isotype group's translate-y was shifted by +82 so the mark sits on the wordtype's cap-height midline, and the six letter-group tx values were each shifted by +140 to place the lettering flush-right of the isotype with a ~24 px optical gap.

  The viewBox changed from `0 0 518.67 274.41` (aspect ratio ~1.9:1) to `0 0 662 274` (aspect ratio ~2.4:1). Consumers who sized containers around the old aspect ratio should re-check their layouts. No prop API change — `height`, `label`, and `className` are unchanged.

## 0.2.3

### Patch Changes

- a51a926: Raise SiteShell brand-mark height from 28px to 56px so the wordmark reads as the page identity anchor.

## 0.2.2

### Patch Changes

- 12e7959: Fix: component CSS never reached the browser. Auto-inject per-entry CSS via side-effect imports in the library bundles.

  The DS built `dist/style.css` correctly, but neither the package `exports` nor the entry JS files referenced it. Consumers got the scoped class names on the DOM (`<header class="poukai_YcL9S7">`) but no rules — header nav rendered as a default bulleted list, `RoleCard` had no card recipe, no hairline separators, no per-component layout. Only `tokens.css` (explicitly imported by consumers) worked.

  Fixed by enabling `cssCodeSplit: true` in `vite.config.ts` and adding `vite-plugin-lib-inject-css`, which makes each library entry emit a sibling CSS file and injects a side-effect `import "./<entry>.css"` at the top of the JS. Consumers' bundlers (Vite, Astro, Next, etc.) pick the CSS up automatically — no new explicit import required.

  Per-entry CSS also means subpath imports (`@poukai-inc/ui/atoms`, etc.) only pull in the CSS for components they ship.

## 0.2.1

### Patch Changes

- b91efc8: Fix: `build:tokens` copies `tokens.css` to `dist/src/tokens/tokens.css` instead of `dist/tokens.css`.

  Without `--flat`, `cpy` preserves the source path, so the file lands at
  `dist/src/tokens/tokens.css`. The package `exports` map points to `./dist/tokens.css`,
  so any registry-installed consumer doing `import "@poukai-inc/ui/tokens.css"` got a 404. Workspace-linked consumers worked only because the path was manually corrected
  locally. Fixed by adding `--flat` to the `cpy` command for the tokens entry.

## 0.2.0

### Minor Changes

- 5fcb576: Ship favicon set + OpenGraph image as runtime brand assets.

  New `./brand/*` export — drop-in social/favicon files referenced by the
  consuming repo's `<head>`:
  - `favicon.svg` (vector, `prefers-color-scheme`-aware fill)
  - `favicon-32.png`, `favicon-16.png` (raster fallbacks)
  - `apple-touch-icon.png` (180×180, iOS home screen)
  - `og.png` (1200×630, OpenGraph + Twitter card)

  ```html
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta property="og:image" content="https://pouk.ai/og.png" />
  ```

  In a Next.js / Vite consumer the files resolve as URL imports:

  ```ts
  import faviconSvg from "@poukai-inc/ui/brand/favicon.svg";
  import og from "@poukai-inc/ui/brand/og.png";
  ```

  Build pipeline: new `build:brand` script copies `src/brand/**` into
  `dist/brand`; the root `build` now chains `build:tokens` and `build:brand`
  so a single `pnpm build` produces a publish-ready `dist/` (previously the
  tokens copy had to be invoked separately).

  Source files live in `src/brand/`. The package-root `brand/poukai-logo.svg`
  remains the build-time source for the inlined Wordmark geometry and is
  unchanged.

## 0.1.0

### Minor Changes

- e8b1b83: `0.1.0` — Phase 1 complete. Atomic-Design taxonomy with six new components.

  **Atoms**
  - **`Stat`** — display numeral + caption + optional source line. Pure typography.
    Props: `value`, `caption`, `source?`, `align?: "start" | "end"`, `size?: "md" | "lg"`.
    Uses new tokens `--fs-stat`, `--fs-stat-large`, `--tracking-stat`.

  **Molecules**
  - **`Hero`** — owns the hand-tuned vertical rhythm from the holding page.
    Props: `title`, `lede`, `status?`, `cta?`, `align?: "start" | "center"`,
    `titleAs?: "h1" | "h2"`. `status` and `cta` are `ReactNode` slots — the
    molecule does **not** import `StatusBadge` or `Button` itself.
  - **`RoleCard`** — surface + hairline + `--radius-3` card recipe with editorial
    typography. Props: `eyebrow`, `title`, `body`, `hiredBy?`, `icon?`. `icon`
    is a slot; the DS does not import `lucide-react`. `hiredBy` footer is
    bottom-pinned so cards in a grid align regardless of body length.
  - **`Principle`** — editorial numbered block (`/principles` recipe). Margin
    numeral on desktop, numeral above title on mobile. Props: `numeral` (free-form
    string), `title`, `children`. Numeral is `aria-hidden` (decorative).
  - **`FailureMode`** — `/why-ai` recipe. Zero-padded index above the title.
    Props: `index: number`, `indexLabel?: string`, `title`, `children`.
    Visually distinct from `Principle`: the failure is the subject, the number
    is just a reference.

  **Organisms**
  - **`SiteShell`** — top nav (linked wordmark + route list) + main slot +
    hairline footer. Props: `currentRoute?`, `routes?`, `footer?`, `homeHref?`,
    `navLabel?`, `children`. **No router awareness** — emits plain `<a href>`.
    Composes `Wordmark` from `atoms/` (organisms may know about chrome).
    Active route is marked with `aria-current="page"`.

  **Tokens**
  - Additive only. New: `--fs-stat`, `--fs-stat-large`, `--tracking-stat`.
    No existing token changed.

  **Structure**
  - First entries in `src/molecules/` and `src/organisms/` — both directories
    are now real, not just reserved.

  Public import paths (`@poukai-inc/ui`) unchanged. No breaking changes.

  This release unblocks Phase 2 of the migration plan — `poukai-inc/pouk.ai`
  can consume `@poukai-inc/ui@0.1.0` for the Astro site rebuild.

- e8b1b83: Restructure `src/` under Atomic-Design taxonomy.
  - `src/components/Wordmark` -> `src/atoms/Wordmark`
  - `src/components/StatusBadge` -> `src/atoms/StatusBadge`
  - `src/components/Button` -> `src/atoms/Button`
  - New empty folders reserved for `src/molecules/` and `src/organisms/`.
  - Path aliases updated: `@atoms/*`, `@molecules/*`, `@organisms/*`.

  Public import paths (`@poukai-inc/ui`) are unchanged; this is a contributor-facing
  move only. No API changes.

### Patch Changes

- 5eed86a: DX + CI improvements.

  **a11y gate**
  - New `src/a11y.test.tsx` mounts every shipped component and scans with
    `@axe-core/playwright`. Runs as part of `pnpm test` (same Playwright
    suite) and on every PR via the existing CI job.
  - `@axe-core/playwright` added as a dev dep.
  - New `pnpm test:a11y` script for running just the a11y leg locally.

  **Per-subpath size budgets**
  - `size-limit` now measures each subpath entry independently:
    `dist/atoms.js`, `dist/molecules.js`, `dist/organisms.js`. Catches
    accidental cross-layer imports (e.g. an atom pulling in a molecule).

  **Wordmark regeneration script**
  - `scripts/build-wordmark.mjs` regenerates `wordmark-geometry.ts` from
    `brand/poukai-logo.svg`. The header of the generated file references the
    command so the next contributor doesn't hand-edit.
  - New `pnpm build:wordmark` script.
  - `brand/poukai-logo.svg` is now committed inside the package so the script
    has its source colocated.

  **README**
  - New "Subpath imports" section showing the per-layer entry points.

  No public API changes.

- e8b1b83: Fix: `Wordmark` renders empty.

  The component referenced an external SVG symbol via
  `<use href="#poukai-wordmark-geometry" />`, but no consumer or DS-internal
  sprite ever defined that symbol. The mark rendered as an empty box.

  Geometry is now **inlined** at build time from a generated
  `wordmark-geometry.ts` (regenerated from `brand/poukai-logo.svg`, with the
  verbose per-path styling stripped — `fill="currentColor"` on the parent
  `<svg>` handles colour). Self-contained; no consumer setup required.

  Adds a regression test that asserts at least six `<path>` elements render.
  Bundle grows by ~9 kB (the path data itself is incompressible); within the
  size-limit budget.

  No API change.
