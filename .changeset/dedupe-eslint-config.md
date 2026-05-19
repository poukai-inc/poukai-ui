---
"@poukai-inc/ui": patch
---

Internal: dedupe ESLint config. Inlined the rule set into `eslint.config.mjs` and removed the now-redundant `.eslintrc.cjs`. Zero behavior change — same rules, same plugins, same ignore patterns. The flat config still routes through `FlatCompat` so the legacy plugin shapes (`plugin:@typescript-eslint/recommended`, etc.) continue to work. No consumer impact.
