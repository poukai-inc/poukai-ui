---
"@poukai/ui": minor
---

Restructure `src/` under Atomic-Design taxonomy.

- `src/components/Wordmark` -> `src/atoms/Wordmark`
- `src/components/StatusBadge` -> `src/atoms/StatusBadge`
- `src/components/Button` -> `src/atoms/Button`
- New empty folders reserved for `src/molecules/` and `src/organisms/`.
- Path aliases updated: `@atoms/*`, `@molecules/*`, `@organisms/*`.

Public import paths (`@poukai/ui`) are unchanged; this is a contributor-facing
move only. No API changes.
