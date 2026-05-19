---
"@poukai-inc/ui": minor
---

Add `Pull` molecule — inline editorial pull-quote primitive.

New component `<Pull>` at `src/molecules/Pull/`. Left-ruled blockquote accent for inline long-form prose. Supports `variant="serif"` (Instrument Serif italic, default) and `variant="sans"` (Geist roman), polymorphic `as="blockquote" | "aside"`, optional `attribution` slot (renders as `<footer>` in blockquote, `<p>` in aside), and native `cite` attribute pass-through.

New token `--fs-pull: clamp(1.25rem, 1rem + 1vw, 1.625rem)` (20–26px fluid) fills the gap between `--fs-body` (17–19px) and `--fs-statement` (28–44px).
