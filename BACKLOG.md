# Backlog

Living to-do for `@poukai-inc/ui`. PRs that close an item should tick its box.
Items removed when stale or migrated to an issue.

**Last reviewed:** 2026-05-13

---

## 🔴 Blocking

Work the rest of the chain depends on. Resolve first.

- [ ] **Publish `@poukai-inc/ui@0.1.0` to GitHub Packages.**
  - State: `package.json` is at `0.0.1`; no `CHANGELOG.md`; four changesets queued
    (`atomic-restructure`, `0-1-0`, `wordmark-inline-geometry`, `dx-and-ci`).
  - The site repo can't install the package from the registry until this lands.
  - Diagnostic checklist before retrying the push:
    - [ ] `.github/workflows/ci.yml` exists at repo root.
    - [ ] `NPM_TOKEN` repository secret is set with `write:packages` scope.
    - [ ] Latest push to `main` has a CI run in the Actions tab.
    - [ ] CI job is green (typecheck / lint / format / build / playwright / size).
    - [ ] `release` job has fired (only runs on `main` branch).
    - [ ] "Version Packages" PR exists (auto-opened by `changesets/action`).
  - Acceptance: `npm view @poukai-inc/ui@0.1.0 --registry=https://npm.pkg.github.com` returns version metadata.

- [ ] **Sync `packages/poukai-ui/.changeset/dx-and-ci.md` into the DS repo.**
  - The DX/CI code changes (a11y test, size budgets, wordmark regen script,
    README subpath section) all landed on `main`, but the corresponding
    changeset file didn't. Without it, the dx-and-ci batch won't appear
    in the auto-generated `0.1.0` CHANGELOG.
  - Must land before the Version Packages PR is generated to be counted.

---

## 🟡 In flight

Work the user is driving, where I'm a passenger.

- [ ] **Phase 2 — Astro site rebuild in `poukai-inc/pouk.ai`.**
  - Scaffolded in `apps/pouk-ai-site/` for reference; the canonical version
    lives in the site repo and is the user's to build.
  - Blocked-by: `0.1.0` publish (this repo).
  - Reference materials in the scaffold:
    - `BaseLayout.astro` — head/meta/JSON-LD/font-preload contract
    - `src/content/{roles,principles,failure-modes}.json` — draft copy,
      replace with canonical text from `meta/backlog.md` before launch
    - Four `pages/*.astro` files using `SiteShell` + the molecules

---

## 🟢 Done — Phase 1 of the migration plan

Kept for ~one release as context; remove after `0.1.0` is published.

- [x] **Phase 1.1** — atomic restructure (`atoms/` / `molecules/` / `organisms/`).
- [x] **Phase 1.2** — `Stat` atom, `Hero` molecule.
- [x] **Phase 1.3a** — `RoleCard`, `Principle` molecules.
- [x] **Phase 1.3b** — `FailureMode` molecule, `SiteShell` organism.
- [x] **Versioning reconcile** — `package.json` reverted to `0.0.1`; changesets
      owns the bump on merge per the plan §3.3.
- [x] **Subpath exports** — `@poukai-inc/ui/atoms`, `/molecules`, `/organisms`.
- [x] **`ROADMAP.md`** — forward-looking, shipped/next/maybe/won't.
- [x] **Wordmark inline geometry fix** — geometry now self-contained in the
      package via `wordmark-geometry.ts`; no consumer setup needed.
- [x] **a11y CI gate** — `src/a11y.test.tsx` mounts every component and
      scans with `@axe-core/playwright`.
- [x] **Per-subpath size budgets** — `dist/atoms.js`, `dist/molecules.js`,
      `dist/organisms.js` measured independently.
- [x] **Wordmark regeneration script** — `pnpm build:wordmark` regenerates
      `wordmark-geometry.ts` from `brand/poukai-logo.svg`.
- [x] **README subpath docs** — "Subpath imports (tree-shaking)" section.

---

## 🔵 Next (post-0.1.0)

Things to pick up after the first publish lands and the site is consuming
the package. Not committed; ordering by likely demand.

- [ ] **Replace draft copy in `apps/pouk-ai-site/src/content/*.json`** (site repo).
      Files are tagged `_draft: true`. Source canonical copy from
      `meta/backlog.md` in the brand repo.
- [ ] **Re-evaluate Lucide icon picks** — Hammer / Bot / BookOpen / Sparkles.
      Done quickly inside `roles.astro`; just needs founder sign-off.
- [ ] **Replace placeholder `favicon.svg`** with the real isotype geometry
      exported from `brand/`.
- [ ] **Source / commission `og.png`.** Until then, falls back to `banner.png`.
      Tracked in migration plan §7 open Qs.
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

## ⚪ Parked / open questions

- [ ] **`og.png` source.** Migration plan §7. Banner.png is the fallback.
- [ ] **CHANGELOG bootstrap.** Currently auto-created by `changesets/action`
      on the first Version Packages merge. If we want a cleaner first-PR
      diff, pre-commit an empty `CHANGELOG.md`. Low priority.
- [ ] **Repository `private: true` flag.** Currently in `package.json`.
      Fine for GitHub Packages publishing; revisit if we ever want public
      npm distribution.
- [ ] **Token for Vercel (Phase 3).** Use a separate fine-grained PAT with
      `read:packages` only for the site repo's Vercel env var, to keep blast
      radius small. The repo's `NPM_TOKEN` (which needs `write:packages`)
      should not be reused there.

---

## How to use this file

- Tick the box in the same PR that lands the work.
- New work that surfaces mid-flight: add it under 🟡 In flight or 🔵 Next,
  not 🔴 Blocking, unless it actually blocks a published artifact.
- "Done" stays for ~one release for context, then gets pruned.
- ROADMAP.md is for _what to ship later_; this file is for _what's in motion now_.
  Keep them distinct.
