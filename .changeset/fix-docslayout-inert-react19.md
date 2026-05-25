---
"@poukai-inc/ui": patch
---

DocsLayout: fix React 19 + axe `landmark-unique` regression on the mobile drawer

The mobile drawer used a JSX-spread of `{ inert: "" }` to mark itself
inert while hidden. React 19 dropped the attribute when the value
serialized to an empty string, so the closed drawer's `<nav>` landmark
re-entered the accessibility tree alongside the desktop sidebar's
landmark — axe flagged it as a `landmark-unique` violation, and the
"drawer drops inert attribute" test never saw the initial `inert=""`.

Replace the JSX-spread with an imperative `ref` callback that toggles
the attribute via `setAttribute` / `removeAttribute`. This sidesteps
React's version-specific prop coercion and works the same on React 18
and 19.
