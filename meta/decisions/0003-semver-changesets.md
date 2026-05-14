---
id: "0003"
title: "Strict semver enforced by Changesets; phases ship in order"
date: "2026-05-14"
status: "accepted"
deciders: ["poukai-design", "poukai-ds-engineer"]
---

## Context

A design system published to GitHub Packages needs versioning discipline so consuming repos can adopt updates safely. We also need a release sequence that coordinates with the site roadmap.

## Decision

**Changesets** (`@changesets/cli`) manages version bumps and changelog generation. No manual `package.json` version edits.

### Bump rules

| Change | Bump |
|--------|------|
| Bug fix in existing component, no API change | patch |
| New component, new optional prop, new variant, additive token | minor |
| Removed prop, renamed component, changed required-prop type, removed token | major |

### Nuances

- Moving a component between atomic folders is **not breaking** as long as the root barrel import path is unchanged.
- Optional prop additions are **minor**. Required prop additions are **major**.
- Token additions are **minor**; removals are **major**.

### Release sequence (from masterplan)

| Version | Contents |
|---------|---------|
| `0.1.0-alpha.0` | Atomic restructure (shipped) |
| `0.1.0-alpha.1` | `Stat`, `Hero`, `RoleCard`, `Principle` |
| `0.1.0` | `FailureMode`, `SiteShell` — first stable |
| `0.1.x` | Patches and additions during site rollout |

Never skip phases. If a site spec depends on a component from a later release, flag it and propose a sequence change before building.

## Consequences

- Every PR must include a changeset file; PRs without one are blocked from merging.
- The release workflow (`pnpm release`) publishes to `npm.pkg.github.com` automatically from the changeset.
- Pre-release tags (`-alpha.N`) are used until the first stable API is confirmed.
