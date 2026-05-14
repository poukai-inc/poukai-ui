---
"@poukai-inc/ui": patch
---

Fix: component CSS never reached the browser. Auto-inject per-entry CSS via side-effect imports in the library bundles.

The DS built `dist/style.css` correctly, but neither the package `exports` nor the entry JS files referenced it. Consumers got the scoped class names on the DOM (`<header class="poukai_YcL9S7">`) but no rules — header nav rendered as a default bulleted list, `RoleCard` had no card recipe, no hairline separators, no per-component layout. Only `tokens.css` (explicitly imported by consumers) worked.

Fixed by enabling `cssCodeSplit: true` in `vite.config.ts` and adding `vite-plugin-lib-inject-css`, which makes each library entry emit a sibling CSS file and injects a side-effect `import "./<entry>.css"` at the top of the JS. Consumers' bundlers (Vite, Astro, Next, etc.) pick the CSS up automatically — no new explicit import required.

Per-entry CSS also means subpath imports (`@poukai-inc/ui/atoms`, etc.) only pull in the CSS for components they ship.
