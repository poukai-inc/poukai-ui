---
"@poukai-inc/ui": minor
---

Add Skeleton atom — content placeholder for async data loads.

Single element with `--surface` background fill, opacity pulse animation
(`poukai-skeleton-pulse` at `--dur-pulse` 1800ms, `ease-in-out`, infinite),
radius variants (`sm`/`md`/`lg`/`circle`), `as="div"|"span"` for block/inline
contexts, and explicit reduced-motion final state (`animation: none; opacity: 0.6`).

NO shimmer. Opacity pulse only, per the motion banlist in BACKLOG.md §Motion:
"Skeleton shimmer that's prettier than the loaded state." No gradient, no
background-position animation, no moving gradient layer at any point.

`aria-hidden="true"` by default — decorative placeholder. Consumer owns
`aria-busy` on the loading region container.

Also fixes a pre-existing `TS2322` ref-cast error in `VisuallyHidden`
(`as unknown as React.Ref<HTMLDivElement>`) that was blocking `tsc`.
