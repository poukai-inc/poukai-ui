---
id: "0004"
title: "Playwright Component Testing + axe-core for a11y enforcement"
date: "2026-05-14"
status: "accepted"
deciders: ["poukai-design", "poukai-ds-engineer"]
---

## Context

Design system components need automated testing that runs in a real browser context and enforces accessibility. Unit-test frameworks that use a virtual DOM miss rendering edge cases; a11y linting alone misses runtime violations.

## Decision

**Playwright Component Testing** (`@playwright/experimental-ct-react`) is the primary test runner. Every component gets a `*.test.tsx` file with:

1. Visual/structural assertions (rendered output, prop variations).
2. An axe-core pass via `@axe-core/playwright` — zero violations is a hard gate.

### Quality bar (hard gates)

A PR that fails any of these does not land:

- `pnpm build` green, zero TypeScript errors, zero warnings.
- Playwright CT 100 % passing.
- axe-core 0 violations on every component story.
- size-limit budgets not exceeded (see ADR-0003 for budgets).
- Every component has a Ladle story.
- Every component has a test file.
- Every PR has a changeset.

### Test file convention

```
src/<layer>/<ComponentName>/<ComponentName>.test.tsx
```

Each test file mounts the component via `@playwright/experimental-ct-react`, asserts structure, and runs `checkA11y` from `@axe-core/playwright`.

## Consequences

- Test runs require a Chromium (and optionally WebKit) install: `pnpm playwright:install`.
- CI runs `pnpm test` and `pnpm test:a11y` as separate steps so a11y failures are surfaced distinctly.
- Components with interactive states (focus, hover) are tested at the component level, not the story level.
