---
"@poukai-inc/ui": minor
---

Fix broken `./molecules/Input` subpath export and harden `CodeBlock` copy timer.

- **`./molecules/Input` now resolves (#371).** The advertised subpath had no
  matching `vite.config.ts` `build.lib.entry`, so `dist/molecules/Input.js` was
  never emitted and importing `@poukai-inc/ui/molecules/Input` failed. Added the
  Rollup entry so the `@deprecated` re-export shim emits. Added the matching
  `./molecules/Textarea` subpath export + entry for parity (both shims forward to
  the atom-layer primitives).
- **`CodeBlock` copy-reset timer is now cleaned up (#374).** The 1.5s
  `setTimeout` that resets the "Copied" label ran without cleanup, firing
  `setState` after unmount. It is now tracked in a ref, cleared on re-copy, and
  cleared on unmount — mirroring `CopyButton`.
