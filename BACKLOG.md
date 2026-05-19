# Backlog

Living to-do for `@poukai-inc/ui`. PRs that close an item should tick its box.
Items removed when stale or migrated to an issue.

**Last reviewed:** 2026-05-19 (lint-staged worktree bug fixed same day)

---

## 🔴 Blocking

Real bugs in published `0.15.0` surfaced by the 2026-05-18 consistency audit.

- [x] **Define `--fs-statement` in `src/tokens/tokens.css`.**
      Added as `clamp(1.75rem, 1.25rem + 2vw, 2.75rem)` (28–44px) — italic-serif
      editorial Statement block; sits between h2 and `--fs-tagline-intimate`.
- [x] **Define `--hero-illustration-max` in `src/tokens/tokens.css`.**
      Added as `25rem` per `CHANGELOG.md:7` stated intent.

---

## 🟡 In flight

Work the user is driving, where I'm a passenger.

- [ ] **Phase 2 — Astro site rebuild.** Lives in `poukai-inc/pouk.ai`, not
      here. Tracked from this repo only so consumer-facing gaps surface against
      the published package surface. (The earlier `apps/pouk-ai-site/` scaffold
      reference is gone — it never landed in this repo's git history; the site
      repo is canonical.)

---

## 🟢 Done — recent ships

Kept for ~one release as context, then pruned.

- [x] **`0.2.1`** — fixed `build:tokens` flatten bug so `dist/tokens.css`
      lands at the root (was at `dist/src/tokens/tokens.css`). Unblocks
      `import "@poukai-inc/ui/tokens.css"` for registry-installed consumers.
- [x] **`0.2.0`** — first real publish to GitHub Packages.
  - Required removing `"private": true` from `package.json`.
  - Required renaming the GitHub org `Pouk-AI-INC` → `poukai-inc` and
    the package scope `@poukai/ui` → `@poukai-inc/ui` (GitHub Packages
    enforces npm-scope == owner-login).
  - Ships stacked lockup, isotype, banner, and avatars as runtime brand
    assets via `./brand/*`. (Favicon + OG image placeholders that lived in
    `src/brand/` at this release were never wired to the build; dropped in
    a 0.6.x reorg — they were never part of the published surface.)
- [x] **`0.1.0`** — Phase 1 of the migration plan: atomic restructure
      (`atoms/` / `molecules/` / `organisms/`), eight components, a11y CI
      gate, per-subpath size budgets, inline Wordmark geometry, subpath
      exports.

---

## 🔵 Next

Things to pick up while the site consumes the package. Not committed;
ordering by likely demand.

- [ ] **Replace draft copy in `apps/pouk-ai-site/src/content/*.json`** (site repo).
      Files are tagged `_draft: true`. Source canonical copy from
      `meta/backlog.md` in the brand repo.
- [ ] **Re-evaluate Lucide icon picks** — Hammer / Bot / BookOpen / Sparkles.
      Done quickly inside `roles.astro`; just needs founder sign-off.
- [ ] **PWA + OG assets** — favicon set (svg + 16/32/192/512 + apple-touch),
      `site.webmanifest`, and a real `og.png` (1200×630). Placeholders that
      previously sat in `src/brand/` were dropped in the 0.6.x reorg since
      nothing in-tree consumed them. Site repo will need them; author fresh
      in `src/brand/` if they should ship via `./brand/*`, or keep them in
      the site repo if they're truly site-only.
- [ ] **Ladle showcase deploy.** `pnpm showcase:build` already produces a
      static site; deploying to GitHub Pages on every release gives the site
      team a stable reference URL. Not in the plan but cheap.
- [ ] **CI: lighthouse-ci in the site repo** — required for the Phase 4
      parity matrix (Lighthouse 100 on every page).
- [ ] **Phase 3 activation** — write the workspace-sibling setup
      (`pnpm-workspace.yaml` in the parent folder) once the site repo is
      consuming the published package end-to-end. Docs already in
      `apps/pouk-ai-site/README.md`.
- [ ] **Phase 4 cutover** — run the parity matrix from migration plan §6.1,
      then DNS swap on Vercel. Last step.

---

## 🟠 Consistency audit (2026-05-18)

Sourced from a four-lane OMC review: component API, token contract,
build/exports, docs/coverage. CRITICALs already promoted to 🔴 Blocking.

### High — consumer-visible or contract-breaking

- [x] **Export `Statement` from `src/molecules.ts` subpath barrel.**
      Now reachable via `@poukai-inc/ui/molecules`.
- [x] **Widen Hero type re-exports in `src/molecules.ts`** to include the full
      union: `HeroSize`, `HeroEntrance`, `HeroBleed`, `HeroVariant`,
      `HeroDefaultProps`, `HeroNoTitleProps`. Root barrel widened to match
      (closes the matching Medium item).
- [x] **Add `Portrait` and `Statement` to `scripts/build-llms-txt.mjs`
      `COMPONENTS.molecules`** so the generated `dist/llms.txt` lists all
      shipped components. Also fixed a pre-existing path-emission bug
      (`@poukai-inc/ui./atoms` → `@poukai-inc/ui/atoms`).
- [x] **Add `### Portrait` and `### Statement` sections to
      `meta/llms-full.txt`**, plus the `--fs-statement` typography token,
      `--hero-illustration-max` layout token, the Hero `illustration` slot,
      and the three previously-undocumented warm-accent color tokens
      (`--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted`) surfaced by
      the extended sync check.
- [x] **Add `Portrait` and `Statement` rows to the "Components shipped today"
      table in `README.md`.**
- [x] **Replace hardcoded transition values in `src/atoms/Button/Button.module.css`**.
      Color/background/border use `var(--dur-fast) var(--easing)`; transform uses
      the new `--dur-press: 80ms` token so the click feedback stays tactile
      without lying about durations.
- [x] **Tokenize StatusBadge pulse duration.** Added `--dur-pulse: 1800ms`
      and switched `StatusBadge.module.css` to consume it.
- [x] **Tokenize the repeated card-title clamp.** Added
      `--fs-card-title: clamp(1.5rem, 1.15rem + 1.2vw, 2rem)` and replaced the
      duplicated value in `RoleCard`, `Principle`, `FailureMode` titles.
- [x] **Define `--space-10: 2.5rem`.** Added to the spacing scale between
      `--space-8` and `--space-12`. Existing `var(--space-10, 2.5rem)` fallback
      uses (Hero CTA margin, FailureMode top padding, h1 desktop margin) now
      resolve through the real token. Fallbacks left in place; trivial follow-up
      to remove them.
- [x] **Add per-variant assertions to `src/atoms/Button/Button.test.tsx`.**
      All three variants (primary default, secondary, ghost) and the missing
      sizes (sm/lg) now have class + min-height assertions. Added className
      merge + arbitrary-prop forwarding tests.
- [x] **Backfill `StatusBadge` tests.** Adds idle status coverage, default-status
      coverage, dot `aria-hidden` assertion, pulse-element count guard, and a
      CSS regression guard on `animation-duration: 1.8s` + `animation-iteration-count: infinite`.
      Plus className merge + arbitrary-prop forwarding tests.
- [x] **Extend `scripts/check-llms-tokens-sync.mjs` to assert each
      `src/{atoms,molecules,organisms}/*` has a matching `### ComponentName`
      heading in `meta/llms-full.txt`.** Now passes for 11 colors + 11
      components; new components without a doc section will fail CI before
      shipping.

### Medium — API + token + docs polish

- [x] **Root barrel `src/index.ts` Hero type completeness** — `HeroVariant`,
      `HeroDefaultProps`, `HeroNoTitleProps` now exported alongside the rest.
- [x] **Fix wrong fallback in `src/atoms/Button/Button.module.css`.**
      Replaced `var(--radius-2, 8px)` with `var(--radius-2)` so the token is
      authoritative; the wrong 8px fallback is gone.
- [ ] **Add `displayName` to all `forwardRef` components.** Currently set on
      Hero/Statement/Portrait only; missing on Button, Stat, StatusBadge,
      Wordmark, FailureMode, Principle, RoleCard, SiteShell.
- [ ] **Document polymorphic-prop conventions.** Three patterns coexist
      undocumented: `asChild` (Button via Radix Slot), `as` (Statement root
      swap), `titleAs` (Hero child-slot swap). Codify in `meta/brand.md` or
      a CONTRIBUTING note.
- [ ] **Add `args` / `argTypes` to story default exports** for FailureMode,
      Portrait, Principle, RoleCard, Statement, SiteShell — currently only
      Button/Stat/StatusBadge/Hero expose Playground knobs.
- [ ] **Decide Wordmark story namespace.** `"Brand / Wordmark"` vs
      `"Components / *"` for the other ten. Either document the split or
      unify under `Components/`.
- [ ] **Spread axe-core coverage.** Inline `AxeBuilder` exists in
      Hero/Portrait/Statement tests only; either standardize on the central
      `src/a11y.test.tsx` or add inline scans everywhere — current pattern is
      asymmetric.
- [ ] **Add `Portrait` to the centralized `src/a11y.test.tsx` gate.**
- [ ] **Reconcile letter-spacing.** Canonical `.micro` uses `0.04em`; RoleCard
      eyebrow uses `0.06em`, FailureMode index uses `0.08em`. Pick or tokenize.
- [ ] **Reconcile responsive breakpoint.** Hero uses `720px` while the rest of
      the repo (Principle grid, tokens.css h1) uses `768px`. Tokenize
      breakpoints or align Hero.
- [ ] **Tokenize / document Button paddings.** `Button.module.css:34,40,46,52`
      hardcodes four px-pair values. Brand decision says padding stays in the
      spec, not in tokens — link the spec from the file or move to tokens.
- [ ] **Tokenize StatusBadge dot dimensions (`8px`) and RoleCard icon box
      (`44px`)** or reference the existing `--btn-h-md` token where it lines up.
- [ ] **Document `illustration` slot in `meta/llms-full.txt` Hero section.**
      Added `0.15.0`, missing from the constraints list.
- [ ] **Prune stale `ROADMAP.md` "Shipped" block.** Stuck at `0.1.0`; misses
      14 releases including Statement (`0.10.0`), Portrait (`0.13.0`),
      illustration slot (`0.15.0`).
- [ ] **Prune stale `BACKLOG.md` "Done" entries** (currently references
      `0.2.1` / `0.2.0` only — handled as part of this audit pass; remove
      this item once the historical Done block is rewritten).
- [ ] **Decide on `@radix-ui/react-dialog` dependency.** No Dialog component
      ships; ROADMAP says "maybe / no current need". Drop or wire up.
- [ ] **Reconcile sequential-marker prop names.** `FailureMode.index` +
      `indexLabel` vs `Principle.numeral` for the same concept.
- [ ] **Make the Portrait dev-mode-guard test non-vacuous.** Current test
      passes trivially under `NODE_ENV=test` without exercising the guard.

### Low — hygiene + future-proofing

- [x] **Dedupe ESLint config.** Inlined the rule set into `eslint.config.mjs`
      and removed `.eslintrc.cjs` so the project has a single ESLint source of
      truth (still routed through `FlatCompat` for the legacy plugin shapes;
      zero behavior change).
- [ ] **Move `lede` (`Hero.tsx:136`) and `muted-link` (`SiteShell.tsx:86`)
      global classes into their respective CSS Modules** — only places where
      a global utility leaks into component JSX.
- [ ] **Fix `.ladle/config.mjs` `defaultStory: "showcase-overview--index"`** —
      route doesn't exist (`System.stories.tsx` exports `All`), so `pnpm dev`
      lands on 404.
- [ ] **Resolve orphaned tokens** — `--fs-wordmark`, `--space-32`, `--fs-display`
      defined but unreferenced. Drop or wire up (`--fs-wordmark` likely
      intended for the Wordmark atom, which uses a `height` prop instead).
- [ ] **Pick one body line-height.** `1.6` (Principle/FailureMode) vs `1.55`
      (RoleCard/global body) — either reconcile or tokenize as
      `--lh-body-tight` / `--lh-body-relaxed`.
- [ ] **Fill `meta/brand.md` Typography / Spacing / Motion / Brand-mark
      sections** (currently `_To be filled._` stubs) — the token contract is
      enforced in code but the rationale is undocumented.
- [ ] **Author missing design specs under `meta/design/`** for Wordmark,
      StatusBadge, Stat, RoleCard, Principle, FailureMode, Statement, SiteShell
      (specs exist for Button, Hero, Portrait only).
- [ ] **Decide on Firefox CT coverage.** `playwright-ct.config.ts` runs only
      Chromium + WebKit; add Firefox or document the omission.
- [ ] **Tokenize line-height + letter-spacing scales** to stop the per-file
      drift identified above (`--lh-*`, `--tracking-*`).

---

## ⚪ Parked / open questions

- [ ] **CHANGELOG bootstrap.** Currently auto-created by `changesets/action`
      on the first Version Packages merge. If we want a cleaner first-PR
      diff, pre-commit an empty `CHANGELOG.md`. Low priority.
- [ ] **Token for Vercel (Phase 3).** Use a separate fine-grained PAT with
      `read:packages` only for the site repo's Vercel env var, to keep blast
      radius small. The repo's `NPM_TOKEN` (which needs `write:packages`)
      should not be reused there.
- [x] **lint-staged worktree bug — `pre-commit` corrupts commits when run
      from a git worktree.** Fixed by two coordinated changes:
      (1) Replaced `npx lint-staged` with a hand-rolled
      `scripts/pre-commit.mjs` that lists staged files via
      `git diff --cached --diff-filter=ACMR`, runs `eslint --fix` +
      `prettier --write` against them, and re-stages the originally-staged
      paths. No stash cycle = no phantom deletions. The `lint-staged`
      devDep and its config block are gone from `package.json`; the
      pattern groups are encoded directly in the script. Trade-off
      documented in the script header: lints the whole file, not just the
      staged hunks, which matches the standard pre-commit behavior outside
      lint-staged and is safe across worktrees.
      (2) Made `.husky/pre-commit` worktree-aware by `cd`-ing to
      `git rev-parse --show-toplevel` instead of `$(dirname "$0")/..`.
      Husky pins `core.hooksPath` to the main repo's `.husky/_/`, so
      `$0` always resolves to the main worktree even when committing
      from a secondary worktree — without this change, the hook would
      `cd` into the wrong tree and `scripts/pre-commit.mjs` would resolve
      to the wrong branch's content. The new `git rev-parse` form makes
      the hook follow whichever worktree triggered the commit.

---

## How to use this file

- Tick the box in the same PR that lands the work.
- New work that surfaces mid-flight: add it under 🟡 In flight or 🔵 Next,
  not 🔴 Blocking, unless it actually blocks a published artifact.
- "Done" stays for ~one release for context, then gets pruned.
- ROADMAP.md is for _what to ship later_; this file is for _what's in motion now_.
  Keep them distinct.
