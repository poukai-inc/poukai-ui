---
"@poukai-inc/ui": minor
---

`StatusBadge` gains a generic `tone` API (#392).

Adds `tone` ("neutral" | "info" | "success" | "warning" | "danger" | "accent")
plus an opt-in `pulse` prop, so the atom can render arbitrary status indicators
(e.g. a consumer's post statuses) without forking. The legacy `status`
("available" | "idle" | "closed") API is preserved and maps onto tones
internally — `status="available"` is equivalent to `tone="accent"` + pulse, and
existing `status`-only usage renders identically.

- `tone` takes precedence over `status` when both are set.
- `pulse` defaults to false; `status="available"` enables it automatically.
- No new tokens — all six tones use existing color tokens (`--fg-muted`,
  `--accent`, `--success`, `--warning`, `--danger`, `--accent-glow`). `info`
  shares the neutral dot color this pass (text carries the distinction).
