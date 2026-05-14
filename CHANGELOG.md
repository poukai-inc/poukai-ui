# @poukai-inc/ui

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
