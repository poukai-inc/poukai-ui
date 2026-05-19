---
"@poukai-inc/ui": minor
---

feat: add Tag atom

Adds `<Tag>` — the system's canonical inline categorical pill.

A compact label that communicates type, category, topic, or metadata classification of adjacent content. Answers "what kind of thing is this?" inline with content flow: inside a card, in a topic list, beside a title, or inside a sentence.

Root element is `<span>` (non-polymorphic). Non-interactive — no hover, focus, active, or disabled states. `forwardRef<HTMLSpanElement, TagProps>` with `...rest` spread.

Props:

- `children` (required ReactNode) — label text; plain string is idiomatic; ReactNode accepted for rare inline `<strong>` emphasis.
- `tone` (`"default"` | `"muted"`, default `"default"`) — two tones only. `"default"`: `--surface` fill, `--fg` text, no border. `"muted"`: transparent background, `--hairline` border (1px), `--fg-muted` text.
- `icon` (optional ReactNode) — optional leading icon slot. When present, root shifts to `inline-flex` for optical alignment. Recommended icon size: 12px (JSDoc guidance; not type-enforced). Pass `aria-hidden="true"` on decorative icons.

Typography: `--font-sans`, `--fs-meta` (14px fixed), `font-weight: 400`, `line-height: var(--lh-meta)` (1.2), `letter-spacing: normal`. Geometry: `border-radius: 999px` (pill constant per spec §3), `padding-block: var(--space-1)`, `padding-inline: var(--space-2)`, `box-sizing: border-box`.

Contrast: `"default"` 15.46:1 AAA. `"muted"` 4.91:1 AA normal at 14px — passes WCAG 2.1 4.5:1 threshold.

New exports: `Tag`, `TagProps`.

No new tokens introduced. No breaking changes.
