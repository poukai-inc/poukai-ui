---
"@poukai-inc/ui": patch
---

Fix `Wordmark` SVG collapsing to 0×0 in zero-JS / SSR environments.

The `.svg` CSS rule previously set `height: 100%`, which requires an ancestor
with a resolved height. When no ancestor had an explicit height the percentage
resolved to 0 (circular dependency). Any consumer-site CSS forcing
`svg { height: 100% }` triggered the same collapse.

Fix: remove the `height: 100%` from the CSS class and expose the `height` prop
value as an inline style on the wrapper `<span>` so the container always
carries a concrete pixel height. The SVG continues to receive its inline
`height` style as before, and is now self-contained regardless of the ancestor
flex context.
