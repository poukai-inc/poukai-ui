---
"@poukai-inc/ui": minor
---

Add `LinkCard` molecule — canonical interactive card primitive.

The entire card surface is a single `<a>` click target. Designed for navigational index pages (`/work`, `/posts`, `/case-studies`) where each grid item routes to a destination.

**Props:** `href`, `asChild` (Radix Slot, identical to `Button` pattern), `eyebrow` (string → auto-wraps in `<Eyebrow variant="muted">`; ReactNode → pass-through), `title` (required), `titleAs` (`"h2" | "h3" | "h4"`, default `"h3"`), `body`, `footer`, `icon`, `external`, `variant`.

**Variants:**

- `default` — `--surface` background, `1px solid --hairline` border, `--radius-3` corners, `--space-8` inset padding. Use in grid contexts.
- `quiet` — `--bg` background, hairline rule top only, no radius, block padding only. Use in dense vertical list contexts.

**Interactions:** hover shifts border-color to `--accent` (`--dur-mid` / `--easing-link`); `:active` presses `translateY(1px)` at `--dur-press`; `:focus-visible` ring 2px solid `--accent` with `outline-offset: 4px`.

**Accessibility:** `external` prop adds `target="_blank"`, `rel="noopener noreferrer"`, and a visually-hidden `(opens in new tab)` span. Global `<a>` underline animation is suppressed on the card root. No nested interactive elements — documented as a hard constraint.

**New utility:** `.sr-only` visually-hidden class shipped in `LinkCard.module.css` (not yet in `tokens.css`; surfaced to `poukai-design` for a future token pass).
