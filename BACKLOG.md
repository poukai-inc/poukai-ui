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

- [x] **`0.18.0`** — `Tag` atom, `Avatar` atom, `Dialog` + `DialogBasic`
      organism, `FieldNote` molecule, `Footer` organism, `Quote` molecule.
      `@radix-ui/react-dialog` dep is now in use.
- [x] **`0.17.0`** — `EmailLink`, `Eyebrow` atoms; `Pull`, `Section`,
      `FeatureCard`, `LinkCard`, `TeamCard` molecules. New tokens
      `--tracking-eyebrow`, `--lh-meta`, `--fs-pull`. Global `<a>`
      resting-state underline + Stat color inheritance fix. `displayName`
      backfill across all `forwardRef` components.
- [x] **`0.16.1`** — internal ESLint config dedupe; no consumer impact.
- [x] **`0.16.0`** — High-severity audit cleanup. New tokens `--space-10`,
      `--dur-press`, `--dur-pulse`, `--fs-card-title`. `Statement` +
      full Hero discriminated union re-exported from `./molecules`.
      Button / StatusBadge token-consumer migrations + test backfill.
- [x] **`0.15.1`** — defined `--fs-statement` and `--hero-illustration-max`
      that shipped components were already consuming without a fallback.
- [x] **`0.15.0`** — Hero `illustration` slot (two-column layout above 720px).
- [x] **`0.14.0`** — `--fs-display` editorial display rung (48–88px).
- [x] **`0.13.0`** — `Portrait` molecule (AVIF/WebP/JPEG `<picture>`,
      srcset, enforced non-empty alt). Warm-accent token tier
      (`--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted`).
- [x] **`0.12.0`** — Hero `bleed="full"` + `--content-max-bleed` token.
- [x] **`0.11.0`** — Hero `variant="no-title"` for editorial doorway pages.
- [x] **`0.10.0`** — `Statement` molecule (editorial statement block).
      `--surface-section` token (fourth elevation tier).
- [x] **`0.9.0`** — Button `size="compact"` (40px rung). Button height
      ladder exposed as `--btn-h-*` tokens.
- [x] **`0.8.0`** — Hero `entrance="stagger"` (CSS-only staggered reveal,
      `prefers-reduced-motion` honored).
- [x] **`0.7.1`** — Hero compressed vertical rhythm at `size="intimate"`.
- [x] **`0.7.0`** — Hero `size` prop with `"display"` / `"intimate"`. New
      token `--fs-tagline-intimate`.
- [x] **`0.6.1`** — docs: `llms-full.txt` synced with 0.6.0 color tokens;
      CI gate added.
- [x] **`0.6.0`** — Apple-aligned palette: `--bg` → `#FBFBFD`,
      `--bg-elevated` (`#FFFFFF`) added. Three-step elevation rhythm.
- [x] **`0.5.0`** — ship `llms.txt` + `llms-full.txt` as package exports.
- [x] **`0.4.0`** — six additional brand assets under `brand/`; `llms.txt`
      first cut.
- [x] **`0.3.2`** — Wordmark proportions revised; inverted variant
      actually inverts; RoleCard grid overlap fix; StatusBadge pulse
      made visible.
- [x] **`0.3.1`** — Wordmark letter-group shift so isotype renders
      flush-left.
- [x] **`0.3.0`** — Wordmark restored to horizontal lockup (isotype +
      wordtype side-by-side). viewBox aspect ratio change.
- [x] **`0.2.3`** — SiteShell brand-mark height 28 → 56px.
- [x] **`0.2.2`** — fix: component CSS never reached the browser.
      Per-entry CSS auto-injection via `vite-plugin-lib-inject-css`.
- [x] **`0.2.1`** — fixed `build:tokens` flatten bug so `dist/tokens.css`
      lands at the root (was at `dist/src/tokens/tokens.css`).
- [x] **`0.2.0`** — first real publish to GitHub Packages. Org rename
      `Pouk-AI-INC` → `poukai-inc`; scope `@poukai/ui` → `@poukai-inc/ui`.
      Stacked lockup, isotype, banner, avatars via `./brand/*`.
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
- [x] **Add `displayName` to all `forwardRef` components.** Exhaustive sweep
      confirmed all 25 forwardRef components already carry displayName: atoms —
      Button, Stat, Avatar, Eyebrow, EmailLink, Wordmark, Tag, StatusBadge;
      molecules — RoleCard, Section, FieldNote, Quote, LinkCard, FeatureCard,
      Pull, Portrait, Statement, Principle, TeamCard, FailureMode, Hero;
      organisms — Footer, Dialog (Root/Trigger/Portal/Overlay/Content/Title/
      Description/Close), DialogBasic, SiteShell. No code changes required;
      the BACKLOG entry was stale.
- [x] **Document polymorphic-prop conventions.** Documented in `meta/conventions/polymorphic-props.md`.
- [x] **Add `args` / `argTypes` to story default exports** — Added
      `args`/`argTypes` Playground knobs to the six story files: FailureMode,
      Portrait, Principle, RoleCard, Statement, SiteShell.
- [ ] **Decide Wordmark story namespace.** `"Brand / Wordmark"` vs
      `"Components / *"` for the other ten. Either document the split or
      unify under `Components/`.
- [ ] **Spread axe-core coverage.** Inline `AxeBuilder` exists in
      Hero/Portrait/Statement tests only; either standardize on the central
      `src/a11y.test.tsx` or add inline scans everywhere — current pattern is
      asymmetric.
- [ ] **Add `Portrait` to the centralized `src/a11y.test.tsx` gate.**
- [x] **Reconcile letter-spacing.** Resolved by adding `--tracking-micro: 0.04em`,
      `--tracking-eyebrow: 0.06em` (already existed), and `--tracking-numeric: 0.08em`
      tokens. Literals swept from `Stat.source`, `Hero.eyebrow`, `RoleCard.eyebrow`,
      `FailureMode.index`.
- [x] **Reconcile responsive breakpoint.** Resolved by adding `--bp-md: 768px`
      token and `@custom-media --bp-md (min-width: 768px)` declaration in
      `tokens.css`. Hero illustration breakpoint changed from `720px` → `768px`
      (paired `max-width: 719px` → `767px`). All `@media (min-width: 768px)`
      queries in Hero and Principle converted to `@media (--bp-md)`. h1 rule
      in tokens.css likewise converted.
- [ ] **Tokenize / document Button paddings.** `Button.module.css:34,40,46,52`
      hardcodes four px-pair values. Brand decision says padding stays in the
      spec, not in tokens — link the spec from the file or move to tokens.
- [ ] **Tokenize StatusBadge dot dimensions (`8px`) and RoleCard icon box
      (`44px`)** or reference the existing `--btn-h-md` token where it lines up.
- [ ] **Document `illustration` slot in `meta/llms-full.txt` Hero section.**
      Added `0.15.0`, missing from the constraints list.
- [x] **Prune stale `ROADMAP.md` "Shipped" block.** Done in this same pass —
      see ROADMAP.md.
- [x] **Prune stale `BACKLOG.md` "Done" entries** Done in this same pass.
- [x] **Decide on `@radix-ui/react-dialog` dependency.** Resolved by shipping
      `Dialog` + `DialogBasic` organism in v0.18.0. The dep is now used.
- [x] **Reconcile sequential-marker prop names.** `FailureMode.index` +
      `indexLabel` vs `Principle.numeral` — kept as-is; the semantic difference is
      intentional. `Principle.numeral` uses Roman numerals (i, ii, iii) for editorial /
      philosophical sequencing; `FailureMode.index` + `indexLabel` use Arabic-numeral
      integer indices with optional formatted labels (e.g. "FM-01") for enumerated
      failure cases. Documented the distinction in both `### Principle` and
      `### FailureMode` sections of `meta/llms-full.txt`.
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
- [x] **Fix `.ladle/config.mjs` `defaultStory: "showcase-overview--index"`** —
      Fixed: `System.stories.tsx` has `title: "System / Reference"` and exports `All`,
      giving the Ladle id `system-reference--all`. Updated `defaultStory` to that value.
- [x] **Resolve orphaned tokens** — Grepped all of `src/` for `var(--fs-wordmark)`,
      `var(--space-32)`, `var(--fs-display)` outside `tokens.css`.
      `--fs-wordmark` and `--space-32` are referenced in showcase stories
      (`TypeScale.tsx`, `SpacingScale.tsx`, `Tokens.stories.tsx`) — kept.
      `--fs-display` had zero references anywhere outside `tokens.css`; dropped from
      `tokens.css` and from `meta/llms-full.txt`.
- [x] **Pick one body line-height.** Resolved by tokenizing both values:
      `--lh-body: 1.55` (canonical — global body, RoleCard, Statement, FieldNote,
      LinkCard, FeatureCard, TeamCard, Dialog) and `--lh-body-relaxed: 1.6`
      (intentional relaxed variant for editorial prose — Principle, FailureMode).
      All inline `1.55` / `1.6` literals replaced with the appropriate token.
- [x] **Fill `meta/brand.md` Typography / Spacing / Motion / Brand-mark
      sections** — Filled the four sections (Typography / Spacing / Motion / Brand-mark).
- [x] **Author missing design specs under `meta/design/`** — Authored 7 missing specs
      (Wordmark, StatusBadge, Stat, RoleCard, Principle, FailureMode, SiteShell) from
      existing source. Backfill — not a re-design.
- [ ] **Decide on Firefox CT coverage.** `playwright-ct.config.ts` runs only
      Chromium + WebKit; add Firefox or document the omission.
- [x] **Tokenize line-height + letter-spacing scales** — resolved by the two
      items above. Tokens added: `--tracking-micro`, `--tracking-numeric`,
      `--lh-body`, `--lh-body-relaxed`. (`--tracking-eyebrow` pre-existed.)

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
