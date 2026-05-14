---
id: "0007"
title: "CSS auto-inject via vite-plugin-lib-inject-css"
date: "2026-05-14"
status: accepted
tags: [build, vite, css, dx]
---

The Vite library build emitted `dist/style.css` but neither the package `exports` map nor any JS entry file referenced it. Consumers importing a component received scoped class names with no corresponding rules, resulting in unstyled output unless they manually imported the stylesheet — a DX contract that was never documented and easy to miss.

Enable `cssCodeSplit: true` in the Vite config and add `vite-plugin-lib-inject-css`, so each chunk emits a sibling CSS file and inserts a side-effect import for it at the top of the chunk. Styles load automatically when the component module is imported. Landed in `0.2.2`.

Each component chunk now carries its own CSS side-effect import, which means bundlers that tree-shake unused chunks will also drop their styles — correct behavior. Consumers who were manually importing `dist/style.css` should remove that import to avoid duplicate rules.
