# Bundle size gate

CI enforces six per-subpath bundle budgets on every PR. A regression blocks the merge.

Verified end-to-end on 2026-05-20: temporarily lowering the `ESM — full bundle` limit to `20 kB` produced the failure output below; restoring `33 kB` produced clean green output.

## What the gate measures

Six entries in `package.json` `size-limit`:

| Entry                                           | What it measures                     | Current budget |
| ----------------------------------------------- | ------------------------------------ | -------------- |
| ESM — full bundle                               | Sum of everything in `dist/index.js` | 33 kB          |
| ESM — atoms subpath                             | `dist/atoms.js`                      | 16 kB          |
| ESM — molecules subpath                         | `dist/molecules.js`                  | 9 kB           |
| ESM — organisms subpath                         | `dist/organisms.js`                  | 25 kB          |
| ESM — tree-shaken (Wordmark + Button)           | The two-atom bundle                  | 14 kB          |
| ESM — tree-shaken (Hero + RoleCard + Principle) | Three-molecule combo                 | 11 kB          |

All numbers are **brotli-compressed**. The gate measures what consumers actually pay over the wire.

## CI wiring

`.github/workflows/ci.yml` runs `pnpm size` after `pnpm build` in the `ci` job. No `continue-on-error`. A regression returns exit code 1 and fails the job, which blocks merge via the `ci` required check on the `main` branch protection rule.

## Reading a regression

When a PR fails the gate, the output looks like this:

```
ESM — full bundle
Package size limit has exceeded by 11.86 kB
Size limit: 20 kB
Size:       31.86 kB with all dependencies, minified and brotlied
...
Try to reduce size or increase limit in "size-limit" section of package.json
ELIFECYCLE  Command failed with exit code 1.
```

Two kinds of regression to triage:

1. **Real growth.** The PR added code that legitimately enlarges the bundle. New component, new dependency, new feature surface. Bump the budget _with a PR-description paragraph stating the new floor + what added the weight._ Do NOT silently bump. See the existing pattern in PRs that landed Dialog, Tabs, Form, Toast — each bumped a specific subpath budget with one-sentence justification.

2. **Shared-chunk overhead from module-graph changes.** Adding a new top-level export to `src/index.ts` grows the shared chunk emitted by Vite even when the new component is tree-shaken out of a specific entry. This shows up as a tiny regression (10–500 B) on the `tree-shaken (Hero + RoleCard + Principle)` entry when Dialog or Toast land. The new bytes are not code the entry uses — they are bundler bookkeeping. Bump the budget and note "shared-chunk overhead from module-graph growth; X/Y/Z themselves unchanged" in the PR description.

## Updating a budget

Every PR that touches `size-limit` MUST justify the change in the PR description. Acceptable patterns:

- **Bumping up.** "Bumped organisms subpath 21 → 25 kB. Toast adds Radix Toast (~3.7 kB)."
- **Ratcheting down.** Rare. Only after a refactor genuinely reduced size. Locks the win against future drift. PR description: "Ratcheted full bundle 33 → 31 kB after removing internal X. New floor."

Never:

- Silent bumps with no description
- Bumping to a value comfortably above current size "just in case" (gives drift room; defeats the gate)
- Disabling `pnpm size` from CI

## Local pre-flight

Before pushing, run:

```sh
pnpm build && pnpm size
```

Exit code 0 = green. Exit code 1 = at least one regression; the output names the offending entry and the bytes over.

## When to ratchet down

After a refactor that legitimately reduced size: lock the win. Open a small PR that bumps the budget DOWN to (current actual + 100–500 B of headroom). Stops future PRs from quietly using the freed space.

## When to ratchet up

When a new component lands. Use the one-paragraph-justification pattern above.

## Failure verified

The smoke test on 2026-05-20 confirmed: with `ESM — full bundle` limit set to `20 kB` (actual: 31.86 kB), the gate failed with exit code 1 and the "Package size limit has exceeded by 11.86 kB" message. Restoring the limit to `33 kB` returned clean output and exit code 0. The gate is active and blocking.
