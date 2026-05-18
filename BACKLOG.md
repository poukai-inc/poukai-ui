# Backlog

Living to-do for `@poukai-inc/ui`. PRs that close an item should tick its box.
Items removed when stale or migrated to an issue.

**Last reviewed:** 2026-05-18

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

- [ ] **Phase 2 — Astro site rebuild in `poukai-inc/pouk.ai`.**
  - Scaffolded in `apps/pouk-ai-site/` for reference; the canonical version
    lives in the site repo and is the user's to build.
  - Reference materials in the scaffold:
    - `BaseLayout.astro` — head/meta/JSON-LD/font-preload contract
    - `src/content/{roles,principles,failure-modes}.json` — draft copy,
      replace with canonical text from `meta/backlog.md` before launch
    - Four `pages/*.astro` files using `SiteShell` + the molecules

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

- [ ] **Export `Statement` from `src/molecules.ts` subpath barrel.**
      Currently only reachable via root `@poukai-inc/ui`; `import { Statement }
    from "@poukai-inc/ui/molecules"` fails.
- [ ] **Widen Hero type re-exports in `src/molecules.ts`** to include
      `HeroSize`, `HeroEntrance`, `HeroBleed`, `HeroVariant`, `HeroDefaultProps`,
      `HeroNoTitleProps` (currently only `HeroProps` + `HeroAlign`).
- [ ] **Add `Portrait` and `Statement` to `scripts/build-llms-txt.mjs`
      `COMPONENTS.molecules`** so the generated `dist/llms.txt` lists all
      shipped components (currently undercounts 9 vs 11).
- [ ] **Add `### Portrait` and `### Statement` sections to
      `meta/llms-full.txt`** with usage rules + constraints. Both shipped in
      `0.10.0` / `0.13.0` and are absent from the authoritative LLM contract.
- [ ] **Add `Portrait` and `Statement` rows to the "Components shipped today"
      table in `README.md:55`.**
- [ ] **Replace hardcoded transition values in `src/atoms/Button/Button.module.css:13`**
      (`120ms`, `80ms`, raw `ease`) with `var(--dur-fast)` and `var(--easing)`.
- [ ] **Tokenize StatusBadge pulse duration.**
      `src/atoms/StatusBadge/StatusBadge.module.css:38` hardcodes
      `1800ms ease-out`; add `--dur-pulse` or reuse an existing duration token.
- [ ] **Tokenize the repeated card-title clamp.**
      `clamp(1.5rem, 1.15rem + 1.2vw, 2rem)` is duplicated in `RoleCard.module.css:44`,
      `Principle.module.css:51`, `FailureMode.module.css:28`. Add e.g.
      `--fs-card-title` to the type scale so changes propagate.
- [ ] **Define `--space-10: 2.5rem`** (or drop the phantom). Used with
      `var(--space-10, 2.5rem)` fallback in `tokens.css:171`, `Hero.module.css:57`,
      `FailureMode.module.css:5`; scale currently jumps `--space-8 → --space-12`.
- [ ] **Add per-variant assertions to `src/atoms/Button/Button.test.tsx`.**
      Tests never verify which `variant` (primary/secondary/ghost) class is
      applied.
- [ ] **Backfill `StatusBadge` tests.** Only 2 tests today; `idle`/`closed`
      statuses never mounted; pulse-halo CSS regression (from `0.3.2`) is
      unguarded.
- [ ] **Extend `scripts/check-llms-tokens-sync.mjs` to assert each
      `src/{atoms,molecules,organisms}/*` has a matching `### ComponentName`
      heading in `meta/llms-full.txt`** — current CI gate only checks color
      tokens, so new components ship undocumented (Portrait/Statement proof).

### Medium — API + token + docs polish

- [ ] **Root barrel `src/index.ts:23` Hero type completeness** — add
      `HeroVariant`, `HeroDefaultProps`, `HeroNoTitleProps` to match
      `Hero/index.ts`.
- [ ] **Fix wrong fallback in `src/atoms/Button/Button.module.css:10`.**
      `var(--radius-2, 8px)` — `--radius-2` is `4px`; fallback would silently
      shift radius if the token vanished.
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
- [ ] **lint-staged worktree bug — `pre-commit` corrupts commits when run
      from a git worktree.** Reproduced 2026-05-15: committing through the
      husky `pre-commit` (`npx lint-staged`, pinned `^15.2.0`) from
      `.claude/worktrees/<name>/` causes lint-staged's partial-stage stash
      cycle to record file deletions for tracked files it never touched
      (verified against [lint-staged#1762](https://github.com/lint-staged/lint-staged/issues/1762),
      closed without a fix; symptom present through v16.4.0). Workaround:
      commit with `--no-verify` after running `prettier --write` manually,
      or commit from the primary worktree. Options to investigate when
      this comes up again: (a) bump to v16.2+ and add `--hide-unstaged` to
      the husky invocation, (b) replace `npx lint-staged` in
      `.husky/pre-commit` with a hand-rolled prettier+eslint script that
      doesn't stash, (c) wait for an upstream fix and watch
      [lint-staged#1402](https://github.com/lint-staged/lint-staged/issues/1402).
      Low priority — `--no-verify` works fine for now.

---

## How to use this file

- Tick the box in the same PR that lands the work.
- New work that surfaces mid-flight: add it under 🟡 In flight or 🔵 Next,
  not 🔴 Blocking, unless it actually blocks a published artifact.
- "Done" stays for ~one release for context, then gets pruned.
- ROADMAP.md is for _what to ship later_; this file is for _what's in motion now_.
  Keep them distinct.
