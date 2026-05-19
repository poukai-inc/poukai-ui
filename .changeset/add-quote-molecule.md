---
"@poukai-inc/ui": minor
---

feat: add Quote molecule

Adds `<Quote>` — the canonical attributed customer testimonial block.

A short prose body (1–4 sentences) from a named person, rendered at `--fs-pull` (20–26px fluid) in Geist sans-serif roman weight — the typographic differentiator from `<Pull>` (Instrument Serif italic) and `<Statement>`. Consumers can tell Quote from Pull at a glance without reading the attribution.

Root element is `<figure>` with `<blockquote>` for the quoted body and `<figcaption>` for the attribution row — the HTML5-recommended structure for attributed quotations. No extra ARIA required; the semantic structure does the work.

Props:

- `quote` (required ReactNode) — quoted body text; accepts inline `<em>`/`<strong>`; no block-level children.
- `name` (required string) — attributed person's name; `font-weight: 500`, `--fg`, `--fs-meta`.
- `role` (optional string) — role or title; `font-weight: 400`, `--fg-muted`, `--fs-meta`. Omit to suppress.
- `avatar` (optional ReactNode) — leftmost element of the attribution row; accepts any ReactNode. DS does not ship an Avatar atom. Convention: 40×40px, `border-radius: 50%` (documented in JSDoc; not enforced).

Hairline rule (`border-top: var(--hairline-w) solid var(--hairline)`) above `<figcaption>` is always on. Use `className` to suppress if needed.

New exports: `Quote`, `QuoteProps`.

No new tokens introduced. No breaking changes.
