# Backlog

Living to-do for `@poukai-inc/ui`. PRs that close an item should tick its box.
Items removed when stale or migrated to an issue.

**Last reviewed:** 2026-05-15

---

## 🔴 Blocking

Nothing right now — `0.2.1` is published to GitHub Packages and the registry
path works end-to-end for consumers.

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
  - Ships favicon set + OG image as runtime brand assets via `./brand/*`.
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
