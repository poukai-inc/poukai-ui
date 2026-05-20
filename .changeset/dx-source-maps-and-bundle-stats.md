---
"@poukai-inc/ui": patch
---

build: ship source maps, bundle visualizer, and unify Wordmark story namespace

- Source maps (`*.js.map`, `*.cjs.map`) are now emitted to `dist/` on every
  lib build (`sourcemap: true` was already set; confirmed present in output).
  Consumers debugging into `@poukai-inc/ui` will now see real
  `src/<Component>/<Component>.tsx` lines in stack traces.

- Added `rollup-plugin-visualizer` (devDep). Every `pnpm build` now writes
  `dist/stats.html` — a gzip- and brotli-annotated treemap showing per-module
  size attribution. Gated to `BUILD_TARGET=lib` so Ladle showcase builds are
  unaffected. `dist/stats.html` added to `.gitignore` (build artifact).

- CI (`ci.yml`) uploads `dist/stats.html` as a `bundle-stats` artifact
  (retained 30 days) after every `pnpm build` step, so the treemap is
  downloadable from every CI run.

- Unified all three Wordmark story files under `"Components / Wordmark"`
  (was `"Brand / Wordmark"`). Sidebar navigation is now consistent across
  all 33+ components. No runtime or API change.

No size-limit budget changes — visualizer adds zero runtime weight; source
maps are excluded from size-limit measurement.
