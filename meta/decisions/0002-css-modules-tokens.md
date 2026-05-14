---
id: "0002"
title: "CSS Modules scoped to components; all values via design tokens"
date: "2026-05-14"
status: "accepted"
deciders: ["poukai-design", "poukai-ds-engineer"]
---

## Context

We need a CSS authoring strategy that keeps styles co-located with components, prevents class collisions across the tree, and enforces the single source of truth for all visual values.

## Decision

Every component gets a `.module.css` file. No global stylesheets beyond `tokens.css`.

**Hard rules:**

1. Every CSS value must resolve to a `var(--token)` reference. No hex colours, no raw pixel sizes, no magic numbers.
2. No `:global` selectors or global class leaks in `.module.css` files.
3. `tokens.css` is owned exclusively by `poukai-design`. Component engineers read tokens; they never modify the token file.
4. If a spec requires a value that has no token, work stops and `poukai-design` is asked to add the token before implementation continues.

## Token categories

| Prefix | Purpose |
|--------|---------|
| `--bg`, `--fg`, `--surface`, `--hairline`, `--accent` | Colour |
| `--font-*` | Font families |
| `--fs-*` | Type scale |
| `--space-*` | Spacing (4px base grid) |
| `--radius-*` | Border radii |
| `--dur-*`, `--easing*` | Motion |
| `--page-pad`, `--content-max`, `--hero-max` | Layout |

## Consequences

- Bundle consumers import `@poukai-inc/ui/tokens.css` once at their app root; components rely on those custom properties being in scope.
- Updating a token value propagates everywhere without touching component code.
- The constraint surfaces missing tokens early, keeping the token file complete and intentional.
