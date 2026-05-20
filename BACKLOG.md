# Backlog

Living to-do for `@poukai-inc/ui`. PRs that close an item should tick its box.
Items removed when stale or migrated to an issue.

**Last reviewed:** 2026-05-20 (1.0.0 milestone plan authored; gate items added)

---

## 🔴 Blocking

No current blockers. All `0.22.0`-era blocking items have shipped.

---

## 🟣 1.0.0 milestone gate

Items from `meta/milestones/1.0.0.md` §3 that are not yet met. Tick here and in the milestone doc in the same PR.

- [ ] **Author `meta/design/Statement.md`.** Backfill from existing implementation. Estimated 4–6 hours.
- [ ] **Author `meta/design/Form.md`.** Compound organism; needs full prop-intent section for `Form`, `Field`, `Input`, `Textarea` composition. Estimated 6–8 hours.
- [ ] **Verify `llms-full.txt` sync check passes for all 31 components.** Run `scripts/check-llms-tokens-sync.mjs` after specs land; address any missing `### ComponentName` headings. Estimated 1–2 hours.
- [ ] **Resolve Wordmark story namespace.** Decide `"Brand / Wordmark"` vs. `"Components / *"`; document the split or unify. Arian decides; engineer implements. Estimated < 1 hour once decided.
- [ ] **Verify bundle CI gate is blocking on regression.** Confirm the size-limit step in CI runs on every PR and fails if the 28kB ESM floor is broken. Estimated 2–3 hours.
- [x] **Author `meta/migrations/template.md`.** Migration guide template for future major bumps. See `meta/milestones/1.0.0.md` §4 for structure and worked example. Estimated 2–3 hours.
- [x] **Author `CONTRIBUTING.md`.** Polymorphic-prop conventions, token addition flow, story/test requirements, semver policy. Synthesises `meta/conventions/polymorphic-props.md`. Estimated 1 day.
- [ ] **CHANGELOG hand-rewrite for 0.x → 1.0.** Curated narrative grouping changeset entries by theme. Final step — write after all other gate items are met. Estimated 4–6 hours.

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

- [x] **`0.22.0`** — `Form` organism.
- [x] **`0.21.0`** — `Toast` organism + `useToast` hook.
- [x] **`0.20.0`** — `Tabs` organism, `Field` / `Input` / `Textarea` molecules.
- [x] **`0.19.0`** — Dark-mode tokens; Apple-HIG-aligned dark palette; all contrast budgets met. `Banner` molecule.
- [x] **`0.18.0`** — `Tag` atom, `Avatar` atom, `Dialog` + `DialogBasic`
      organism, `FieldNote` molecule, `Footer` organism, `Quote` molecule.
      `@radix-ui/react-dialog` dep is now in use.
- [x] **`0.17.0`** — `EmailLink`, `Eyebrow` atoms; `Pull`, `Section`,
      `FeatureCard`, `LinkCard`, `TeamCard` molecules. New tokens
      `--tracking-eyebrow`, `--lh-meta`, `--fs-pull`. Global `<a>`
      resting-state underline + Stat color inheritance fix. `displayName`
      backfill across all `forwardRef` components.

---

## 🔵 Next

Things to pick up while the site consumes the package. Not committed;
ordering by likely demand.

- [ ] **PWA + OG assets** — favicon set (svg + 16/32/192/512 + apple-touch),
      `site.webmanifest`, and a real `og.png` (1200×630). Placeholders dropped
      in the 0.6.x reorg; site repo will need them. Author fresh in `src/brand/`
      if they should ship via `./brand/*`, or keep in site repo if site-only.
- [ ] **Re-evaluate Lucide icon picks** — Hammer / Bot / BookOpen / Sparkles.
      Done quickly inside `roles.astro`; needs founder sign-off.
- [ ] **CI: lighthouse-ci in the site repo** — required for the Phase 4
      parity matrix (Lighthouse 100 on every page).
- [ ] **Phase 3 activation** — write the workspace-sibling setup
      (`pnpm-workspace.yaml` in the parent folder) once the site repo is
      consuming the published package end-to-end.
- [ ] **Phase 4 cutover** — run the parity matrix from migration plan §6.1,
      then DNS swap on Vercel. Last step.

---

## 🟠 Consistency audit (2026-05-18)

Sourced from a four-lane OMC review: component API, token contract,
build/exports, docs/coverage. CRITICALs already promoted to 🔴 Blocking.

### High — consumer-visible or contract-breaking

- [x] **Export `Statement` from `src/molecules.ts` subpath barrel.**
- [x] **Widen Hero type re-exports in `src/molecules.ts`** to include the full
      union: `HeroSize`, `HeroEntrance`, `HeroBleed`, `HeroVariant`,
      `HeroDefaultProps`, `HeroNoTitleProps`. Root barrel widened to match.
- [x] **Add `Portrait` and `Statement` to `scripts/build-llms-txt.mjs`
      `COMPONENTS.molecules`** so the generated `dist/llms.txt` lists all
      shipped components. Also fixed a pre-existing path-emission bug.
- [x] **Add `### Portrait` and `### Statement` sections to
      `meta/llms-full.txt`**, plus missing tokens and Hero slots.
- [x] **Add `Portrait` and `Statement` rows to the "Components shipped today"
      table in `README.md`.**
- [x] **Replace hardcoded transition values in `Button.module.css`.**
- [x] **Tokenize StatusBadge pulse duration.** Added `--dur-pulse: 1800ms`.
- [x] **Tokenize the repeated card-title clamp.** Added `--fs-card-title`.
- [x] **Define `--space-10: 2.5rem`.** Added to spacing scale.
- [x] **Add per-variant assertions to `Button.test.tsx`.**
- [x] **Backfill `StatusBadge` tests.**
- [x] **Extend `scripts/check-llms-tokens-sync.mjs`** to assert every component
      directory has a matching heading in `meta/llms-full.txt`.

### Medium — API + token + docs polish

- [x] **Root barrel `src/index.ts` Hero type completeness** — `HeroVariant`,
      `HeroDefaultProps`, `HeroNoTitleProps` now exported alongside the rest.
- [x] **Fix wrong fallback in `src/atoms/Button/Button.module.css`.**
      Replaced `var(--radius-2, 8px)` with `var(--radius-2)` so the token is
      authoritative; the wrong 8px fallback is gone.
- [x] **Add `displayName` to all `forwardRef` components.** Exhaustive sweep
      confirmed all 25 forwardRef components already carry displayName.
- [x] **Document polymorphic-prop conventions.** Documented in `meta/conventions/polymorphic-props.md`.
- [x] **Add `args` / `argTypes` to story default exports** — Added
      `args`/`argTypes` Playground knobs to the six story files: FailureMode,
      Portrait, Principle, RoleCard, Statement, SiteShell.
- [x] **Decide Wordmark story namespace.** Unified under `Components/Wordmark`.
      All three Wordmark story files updated from `"Brand / Wordmark"` to
      `"Components / Wordmark"`.
- [x] **Spread axe-core coverage.** Standardized on the central
      `src/a11y.test.tsx` gate. Inline scans removed from 14 components;
      state-specific inline scans kept for Hero, Portrait, Input, Textarea.
- [x] **Add `Portrait` to the centralized `src/a11y.test.tsx` gate.**
- [x] **Reconcile letter-spacing.** Tokens added: `--tracking-micro`,
      `--tracking-eyebrow`, `--tracking-numeric`.
- [x] **Reconcile responsive breakpoint.** `--bp-md: 768px` token +
      `@custom-media --bp-md` declaration in `tokens.css`. Hero aligned.
- [x] **Tokenize / document Button paddings.** Inline with comment linking
      `meta/design/Button.md §3`.
- [x] **Tokenize StatusBadge dot dimensions and RoleCard icon box.**
      StatusBadge dot stays inline; RoleCard icon swapped to `var(--btn-h-md)`.
- [x] **Document `illustration` slot in `meta/llms-full.txt` Hero section.**
- [x] **Prune stale `ROADMAP.md` "Shipped" block.**
- [x] **Prune stale `BACKLOG.md` "Done" entries.**
- [x] **Decide on `@radix-ui/react-dialog` dependency.** Shipped in `0.18.0`.
- [x] **Reconcile sequential-marker prop names.** Kept as-is; distinction documented.
- [x] **Make Portrait dev-mode-guard test non-vacuous.**

### Low — hygiene + future-proofing

- [x] **Dedupe ESLint config.**
- [ ] **Move `lede` (`Hero.tsx:136`) and `muted-link` (`SiteShell.tsx:86`)
      global classes into their respective CSS Modules.**
- [x] **Fix `.ladle/config.mjs` `defaultStory`.**
- [x] **Resolve orphaned tokens.**
- [x] **Pick one body line-height.** Tokens: `--lh-body`, `--lh-body-relaxed`.
- [x] **Fill `meta/brand.md` Typography / Spacing / Motion / Brand-mark sections.**
- [x] **Author missing design specs under `meta/design/`.** 29 of 31 specs done. `Statement` and `Form` remain — promoted to 🟣 gate.
- [x] **Decide on Firefox CT coverage.** Shipped; all 1572 tests passing.
- [x] **Tokenize line-height + letter-spacing scales.**

---

## ⚪ Parked / open questions

- [ ] **CHANGELOG bootstrap.** Auto-created by `changesets/action` on first
      Version Packages merge. Pre-committing an empty `CHANGELOG.md` would
      give a cleaner first-PR diff. Low priority; superseded by the 1.0.0
      CHANGELOG hand-rewrite gate item.
- [ ] **Token for Vercel (Phase 3).** Use a separate fine-grained PAT with
      `read:packages` only for the site repo's Vercel env var. The repo's
      `NPM_TOKEN` should not be reused there.
- [x] **lint-staged worktree bug** — fixed; `scripts/pre-commit.mjs` in place.

---

## How to use this file

- Tick the box in the same PR that lands the work.
- New work that surfaces mid-flight: add it under 🟡 In flight or 🔵 Next,
  not 🔴 Blocking, unless it actually blocks a published artifact.
- "Done" stays for ~one release for context, then gets pruned.
- ROADMAP.md is for _what to ship later_; this file is for _what's in motion now_.
  Keep them distinct.
