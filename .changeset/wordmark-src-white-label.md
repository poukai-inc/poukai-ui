---
"@poukai-inc/ui": minor
---

`Wordmark` gains an optional `src` prop for white-label deployments (#394).

When `src` is provided, `Wordmark` renders `<img src alt={label} height width="auto">`
instead of the bundled POUKAI inline SVG — letting consumers ship a per-deployment
logo without forking the atom. The bundled mark is unchanged when `src` is omitted
(zero breaking change).

Notes:

- The white-label image does **not** inherit `currentColor` (colors are baked into
  the asset); supply a separate dark-mode asset and swap `src` at the call site if
  needed. The bundled mark still inverts via `currentColor`.
- `javascript:`/`data:` scheme URLs are rejected at the attribute boundary and fall
  back to the bundled mark (same posture as `AudioPlayer`/`VideoEmbed`).
- `label` is used as the `<img>` `alt` when `src` is set.
