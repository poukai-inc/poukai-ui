---
"@poukai-inc/ui": minor
---

feat(molecule): add TableOfContents

Sticky `<nav aria-label="Table of contents">` molecule for long-form article right-rail navigation. Tracks scroll position via `IntersectionObserver` and highlights the currently visible section with an accent left-border and `aria-current="true"`.

Props: `items` (required anchor list), `heading` (optional "On this page" label), `activeId` (controlled override), `onActiveChange` (escape hatch), `offset` (IntersectionObserver rootMargin top).

Supports `depth: 1 | 2` for H2/H3 hierarchy. All styles are token-only. Zero axe violations.
