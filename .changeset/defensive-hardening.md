---
"@poukai-inc/ui": patch
---

Defensive hardening for consumer-supplied input in media components.

- **`VideoEmbed` now sandboxes its iframe (#377).** A new `sandbox` prop
  defaults to `"allow-scripts allow-same-origin allow-presentation allow-popups"`
  — enough for YouTube/Vimeo while restricting top-level navigation and form
  submission. Pass a custom token string to adjust, or `sandbox={false}` to
  restore the previous no-sandbox behaviour. `src` is still rendered verbatim
  and should be treated as trusted; this is defence-in-depth.
- **`AudioPlayer` rejects unsafe `transcriptHref` schemes (#378).** A
  `javascript:`/`data:`/`vbscript:` transcript URL is no longer rendered as a
  link; only schemeless URLs and an `http(s)`/`mailto`/`tel` allowlist pass
  through.
