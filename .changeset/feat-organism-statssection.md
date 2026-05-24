---
"@poukai-inc/ui": minor
---

feat(organism): add StatsSection — StatList in section frame

Implements the StatsSection organism per `meta/design/StatsSection.md` (Phase 2 pilot).

StatsSection composes a `Section` molecule (band wrapper, heading slot, block padding)
with a `StatList` molecule (horizontal stat row, optional hairline dividers) to create
the canonical "by the numbers" marketing band.

Props: `heading` (optional string — renders as `<h2>` via Section), `dividers` (boolean,
default false), `fill` (boolean — applies `--surface-section` band background), `children`
(required — one or more `Stat` atoms).

Closes #207.
