---
"@poukai-inc/ui": minor
---

feat(molecule): add TagList — canonical wrapper for a collection of Tag atoms

Implements `TagList` per `meta/design/TagList.md` (Phase 2).

- Flex-wrap layout with configurable `gap` (`"md"` = `--space-2`, `"sm"` = `--space-1`)
- Optional `max` prop collapses surplus Tags into a `<Tag tone="muted">+{N}</Tag>` overflow pill (surplus children sliced from DOM, not hidden with CSS)
- `forwardRef` to root `<div>`, full `...rest` spread for `data-*` / `aria-*` pass-through
- Ladle stories: `Default`, `GapSm`, `WithMax`, `WithMaxExactBoundary`, `MixedTones`, `ArticleTagging`
- Playwright CT: child rendering, max overflow behavior, overflow count accuracy, ref/className/data-\* forwarding
- axe-core: 0 violations across default, overflow, and gap=sm mounts
- No new tokens — consumes existing `--space-1`, `--space-2` from tokens.css
