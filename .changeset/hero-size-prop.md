---
"@poukai-inc/ui": minor
---

Add `size` prop to `<Hero>` molecule with `"display"` (default) and `"intimate"` values.

The `"display"` default preserves all existing consumer behavior byte-for-byte. `"intimate"` lowers the title clamp from `--fs-tagline` (36–68 px) to `--fs-tagline-intimate` (32–52 px) — a quieter register for low-density doorway pages. All other Hero rhythm (gaps, lede, CTA, color, font family, em accent) is unchanged across both values. New token `--fs-tagline-intimate` added to `tokens.css`.
