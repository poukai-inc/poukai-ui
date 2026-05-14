---
id: "0005"
title: "Ladle as the component showcase (over Storybook)"
date: "2026-05-14"
status: "accepted"
deciders: ["poukai-design", "poukai-ds-engineer"]
---

## Context

The design system needs a live component showcase for design review, implementation reference, and the GitHub Pages deploy. The two main candidates were Storybook and Ladle.

## Decision

**Ladle** (`@ladle/react`) is the showcase tool.

### Rationale

| Criterion | Storybook | Ladle |
|-----------|-----------|-------|
| Cold-start time | 10–30 s | < 1 s (Vite-native) |
| Bundle size | Large | Minimal |
| API compatibility | CSF3 | CSF3 (subset) |
| Configuration surface | Complex | Single `config.mjs` |
| GitHub Pages deploy | Requires `storybook build` | `ladle build` → static HTML |

Ladle's Vite-native architecture matches the design system's own Vite build pipeline, so stories share the same module graph as the production bundle with no adapter layer.

### Story convention

```
src/<layer>/<ComponentName>/<ComponentName>.stories.tsx
```

Stories use the Ladle CSF3 format (`Story`, `StoryDefault` from `@ladle/react`). The `title` field uses the pattern `"<Group> / <ComponentName>"`.

### Token injection

`tokens.css` is injected into the Ladle iframe via `appendToHead` in `.ladle/config.mjs`. This mirrors how consumers are expected to import tokens — once at the app root.

### Showcase deploy

`pnpm showcase:build` (`ladle build`) produces a static site in `build/`. The `.github/workflows/showcase.yml` workflow deploys this to GitHub Pages on every push to `main`.

## Consequences

- Ladle does not support all Storybook addons. Controls, actions, and accessibility panel are the only supported addon surfaces; we use only controls.
- Stories must be compatible with server-side rendering constraints (no `window`/`document` access at module scope).
- The showcase URL is the canonical reference for design review; link to it from PRs.
