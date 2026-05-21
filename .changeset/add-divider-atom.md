---
"@poukai-inc/ui": minor
---

Add `Divider` atom — hairline separator rule.

Props: `orientation` (`"horizontal"` | `"vertical"`, default `"horizontal"`), `tone` (`"default"` | `"muted"`), `as` (`"hr"` | `"div"`, defaults from orientation). Horizontal defaults to `<hr>` (implicit `role="separator"`); vertical defaults to `<div role="separator" aria-orientation="vertical">`. Zero self-margin — parent layout controls spacing.

Introduces `--hairline-soft` token (light: `#E5E5EA`, dark: `#3A3A3C`) for the `tone="muted"` variant.

**Not included in this PR:** migration of the 10 existing inline-hairline call sites enumerated in `meta/design/Divider.md §9` (`FailureMode`, `Principle`, `Statement`, `RoleCard`, `LinkCard`, `Quote`, `SiteShell`, `Footer`, `Tabs`, `Dialog`). Those remain as-is; migration to `<Divider>` is a follow-up engineering task.
