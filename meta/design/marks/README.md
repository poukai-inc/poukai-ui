# Brand marks — SVG sources

Vector sources for every brand mark: full `Wordmark` lockup, isotype, banner glyphs, and any branded marks that ship under `@poukai-inc/ui/brand/*`. Authored by the `poukai-design` agent.

Each mark file has a sibling `<name>.md` one-pager covering:

- Purpose (when this mark is used)
- Construction rationale (proportions, why this geometry)
- Sizing & clear-space rules
- On-light vs. on-dark variants
- What this mark is NOT for

The mark SVG is the source of truth. The runtime component in `src/atoms/Wordmark/` re-derives its geometry from these files; never edit `wordmark-geometry.ts` by hand — re-run `pnpm build:wordmark`.
