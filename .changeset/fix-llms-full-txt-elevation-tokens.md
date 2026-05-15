---
"@poukai-inc/ui": patch
---

docs: sync llms-full.txt with 0.6.0 color tokens

Documents `--bg-elevated` (#FFFFFF, front-most layer), corrects `--bg` value to `#FBFBFD`, and adds the three-step elevation rhythm and "never pure edges" rule. Adds a CI gate (`scripts/check-llms-tokens-sync.mjs`) that fails the build if a color token is defined in `tokens.css` but absent from `meta/llms-full.txt`.
