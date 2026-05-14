---
"@poukai-inc/ui": patch
---

Fix: `build:tokens` copies `tokens.css` to `dist/src/tokens/tokens.css` instead of `dist/tokens.css`.

Without `--flat`, `cpy` preserves the source path, so the file lands at
`dist/src/tokens/tokens.css`. The package `exports` map points to `./dist/tokens.css`,
so any registry-installed consumer doing `import "@poukai-inc/ui/tokens.css"` got a 404. Workspace-linked consumers worked only because the path was manually corrected
locally. Fixed by adding `--flat` to the `cpy` command for the tokens entry.
