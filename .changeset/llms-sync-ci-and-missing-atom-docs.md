---
"@poukai-inc/ui": patch
---

Docs/CI: backfill `meta/llms-full.txt` sections for `Heading`, `Text`, `Prose`, `Code`, `Kbd` atoms (previously merged via #111–#114 without llms-sync entries), wire `check-llms-tokens-sync` into CI as `pnpm check:llms`, and fix a silent false-pass in the checker where `### Text` matched `### Textarea` via substring `includes()` — replaced with a line-anchored regex (`^### <Name>(?:\s|$)`). No runtime API change.
