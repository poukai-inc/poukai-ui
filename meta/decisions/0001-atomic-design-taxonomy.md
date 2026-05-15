---
id: "0001"
title: "Adopt atomic design taxonomy for component organisation"
date: "2026-05-14"
status: "accepted"
deciders: ["poukai-design", "poukai-ds-engineer"]
---

## Context

The design system needs a clear, scalable way to organise components so that contributors understand where new work lives and consumers can tree-shake predictably.

## Decision

We adopt atomic design taxonomy — **atoms**, **molecules**, **organisms** — as the three public layers of `@poukai-inc/ui`.

- **Atoms** (`src/atoms/`): single-responsibility primitives that render one semantic idea. No children of their own. Examples: `Wordmark`, `Button`, `StatusBadge`, `Stat`.
- **Molecules** (`src/molecules/`): atoms composed into a self-contained unit of meaning. Examples: `Hero`, `RoleCard`, `Principle`, `FailureMode`.
- **Organisms** (`src/organisms/`): molecules plus layout intent; may know about page chrome. Examples: `SiteShell`.

Templates and pages live in the consuming repo (`Pouk-AI-INC/pouk.ai`), not here.

## Subpath exports

Each layer is published as a subpath export so consumers can import only what they need:

```
@poukai-inc/ui          → full barrel
@poukai-inc/ui/atoms    → atoms only
@poukai-inc/ui/molecules → molecules only
@poukai-inc/ui/organisms → organisms only
```

## Consequences

- Moving a component between layers is not a breaking change as long as the root barrel export path is unchanged.
- The three-layer cap prevents scope creep; if a component doesn't fit, the taxonomy must be reconsidered before adding a fourth layer.
