# poukai-ui — Development Workflow

## Branch policy

Every task cuts a **fresh branch from `origin/main`**. Work in an isolated `git worktree` to avoid shared-worktree branch-thrashing from concurrent tasks.

```bash
git fetch origin main
git worktree add /tmp/poukai-<atom> origin/main
cd /tmp/poukai-<atom>
git checkout -b feat/atom-<name>
```

Never commit directly to `main`. Never work in the shared worktree when sibling tasks are running.

## Mandatory local gate sequence

Run **every** gate before pushing. CI runs the same sequence; a push that fails CI was broken before it left the machine.

```bash
pnpm typecheck       # tsc --noEmit — zero type errors
pnpm lint            # ESLint, max-warnings 0
pnpm format:check    # Prettier — if this fails, run: pnpm format then re-check
pnpm check:llms      # llms-full.txt completeness check
pnpm build           # Vite + tsc --emitDeclarationOnly
pnpm test            # Vitest unit + Playwright CT (requires pnpm exec playwright install first)
pnpm size            # size-limit budget
```

Run these in parallel where independent:

```bash
# Parallel: typecheck + lint + format:check + check:llms (all read-only)
# Sequential: build → test → size (each depends on the prior)
```

**If any gate fails: fix before pushing. Do not push a red gate.**

### Common fix: Prettier violations

```bash
pnpm format          # auto-write all src/**/*.{ts,tsx,css,md}
pnpm format:check    # must be clean before push
```

### Common blocker: missing Radix dep

After merging origin/main, new atoms from other branches may import Radix packages not yet in `node_modules`. Fix:

```bash
# Identify missing: grep -r "@radix-ui" src/atoms/*/index.ts | sort -u
# Then: pnpm add @radix-ui/react-<name>
pnpm install
```

### Conflict resolution

When merging `origin/main` into a feature branch, **always keep both sides** — your new atom exports AND origin/main's new exports. Never drop either side. After resolving, re-run the full gate sequence.

## New atom checklist

- [ ] `src/atoms/<Name>/<Name>.tsx` — `forwardRef` + `displayName`
- [ ] `src/atoms/<Name>/<Name>.module.css` — tokens only, no raw values
- [ ] `src/atoms/<Name>/index.ts` — barrel re-export
- [ ] `src/atoms/<Name>/<Name>.stories.tsx` — Ladle stories
- [ ] `src/atoms/<Name>/<Name>.test.tsx` — Playwright CT (matched by `testMatch: **/*.test.tsx` in `playwright-ct.config.ts`)
- [ ] `src/a11y.test.tsx` — append axe cases (consolidated a11y CT suite — every atom must appear here)
- [ ] `src/index.ts` — append named export
- [ ] `vite.config.ts` — add `"atoms/<Name>": resolve(__dirname, "src/atoms/<Name>/index.ts")` to `build.lib.entry` so Rollup emits a standalone chunk (without this the atom is inlined into the barrel and the `./atoms/<Name>` subpath export resolves to a non-existent file)
- [ ] `package.json` exports — add `./atoms/<Name>` subpath
- [ ] `package.json` deps — add any new Radix peer under `peerDependencies` + `devDependencies`, and as direct `dependencies` if it is a first-class runtime dep
- [ ] `meta/llms-full.txt` — append component doc block
- [ ] `meta/design/<Name>.md` — design spec (status: Approved) must exist before implementation
- [ ] Changeset: `.changeset/<id>.md` with `"@poukai-inc/ui": minor`
- [ ] All gates green locally
- [ ] Push + open PR

## Infrastructural decisions (stop and ask)

Stop and ask the user when you encounter:

- **New token needed** — the spec says no new tokens; if a design invariant cannot be expressed with existing tokens, raise it before writing code.
- **New Radix peer major** — if a required Radix package has a different major than the existing Radix peers, flag before adding.
- **`pnpm-lock.yaml` merge conflict produces checksum errors** — delete `node_modules`, delete `pnpm-lock.yaml`, re-run `pnpm install`, verify all deps resolve correctly before proceeding.
- **`size-limit` budget exceeded** — do not raise the budget silently; raise it with the user.
- **Playwright CT cannot run** (browser install fails, X11 missing, etc.) — do not skip; surface the blocker. CT is not optional.

## CI

CI runs on every PR and push to `main` (`.github/workflows/ci.yml`):

```
pnpm typecheck → pnpm lint → pnpm format:check → pnpm check:llms → pnpm build → pnpm test → pnpm size
```

Followed by a React 18/19 dual-peer CT matrix. All must be green before merge.
