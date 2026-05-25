---
"@poukai-inc/ui": minor
---

feat(organism): add Header — standalone site nav-bar organism

Implements `Header` per `meta/design/Header.md`. Compound API: `Header`,
`Header.Brand`, `Header.Nav`, `Header.Actions`. Composes `Wordmark`,
`NavLink`, and `Button`. Props: `homeHref`, `logo`, `navLabel`, `sticky`,
`bordered`, `constrained`. Sticky scroll detection via `IntersectionObserver`.
Mobile nav hidden below 768px (Sheet/Drawer deferred). Closes #194.
