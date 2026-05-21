---
"@poukai-inc/ui": minor
---

Add `Code` and `Kbd` atoms — inline literal-quotation and keyboard-key glyph chips.

**`Code`** — inline `<code>` chip for variable names, CSS custom properties, HTML element names, shell commands. Root is `<code>` (non-polymorphic). `--surface` background, `--fg` text, no border, `--radius-2` corner, monospace `--font-mono` at `0.9em` so the chip tracks the surrounding text register on any surface (body copy, pull-quote, field note). Inline-only `--space-1` padding preserves text baseline.

**`Kbd`** — keyboard-key glyph for shortcut hints (`⌘`, `K`, `Enter`, `Esc`). Root is `<kbd>` (non-polymorphic). Same `--surface` family as `Code`, plus a 1px `--hairline` border for the key-cap reading. Monospace at `0.85em` and `font-weight: 500` to disambiguate from `Code` at a glance. `min-width: 1.5em` preserves a square-ish silhouette for single-character keys. Multi-key combinations are composed by the consumer as side-by-side `<Kbd>` instances; the DS does not own combination semantics.

Both atoms are non-interactive (no hover/focus/active states), non-polymorphic, introduce zero new tokens, and resolve correctly in dark mode via the global `:root` block.
