# Caption

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`Caption` is the system's canonical muted micro-label for supplementary attribution or contextual annotation beneath a visual or content block. It serves figure captions, code block source lines, audio player labels, and any other surface where a short subordinate line follows a primary artifact. When nested inside a `<figure>`, it renders as `<figcaption>`; otherwise it renders as a `<p>` (or polymorphically via `as`). Distinct from `FieldNote`, which is an editorial inline aside with no semantic figure relationship.

## 2. Anatomy

```
┌──────────────────────────────────┐
│  [text content — single line or  │
│   short wrap]                    │
└──────────────────────────────────┘
<figcaption> or <p>
```

- **Root element**: `<figcaption>` when inside `<figure>`, `<p>` otherwise. Polymorphic `as` prop allows override.
- **Text content**: `children` — plain string expected; `ReactNode` accepted.
- No leading icon, no close button, no trailing action. Caption is text only.

## 3. Tokens

- `--font-sans` — Geist stack
- `--fs-micro` (`0.75rem` / 12px) — smallest legible register; captions sit clearly below body
- `--lh-meta` (`1.2`) — tight leading; captions are short, rarely wrap beyond two lines
- `--fg-muted` (`#6E6E73` light / `#86868b` dark) — muted foreground; de-emphasised relative to body
- `--tracking-micro` (`0.04em`) — micro-scale tracking, consistent with other `--fs-micro` usages
- `--space-2` (`0.5rem`) — top margin separating caption from its preceding element (owned by parent, documented here as guidance)

## 4. Variants / Props

| Prop        | Type                            | Default        | Rationale                                                                                  |
| ----------- | ------------------------------- | -------------- | ------------------------------------------------------------------------------------------ |
| `as`        | `"figcaption" \| "p" \| "span"` | `"figcaption"` | `figcaption` is semantically correct inside `<figure>`; `p` for standalone use outside one |
| `children`  | `ReactNode`                     | —              | The caption text. Plain string is idiomatic.                                               |
| `className` | `string`                        | —              | Merge via `clsx`; follows DS atom convention.                                              |

No `tone` prop — there is only one visual register for a caption. No `size` prop — `--fs-micro` is fixed. No `icon` slot — captions are text primitives.

## 5. Interaction

None. Caption is a static non-interactive text element. No hover, focus, active, or keyboard state. It is not a tab stop.

If a consumer places a link inside `children`, that link inherits global `a` styles from `tokens.css` (hairline-to-accent underline transition). The Caption component itself authors no link styles.

## 6. A11y

- Semantic element: `<figcaption>` inside `<figure>` is natively associated with the figure content — no ARIA needed.
- When rendered as `<p>` outside a figure, it is a regular paragraph in the content flow; no additional role required.
- `--fg-muted` on `--bg`: `#6E6E73` on `#FBFBFD` = 4.91:1 — passes WCAG 2.1 AA for normal text at 12px (threshold 4.5:1). Dark mode: `#86868b` on `#000000` = 6.10:1 — AA.
- `axe` rules in play: `color-contrast` (passes), no `aria-*` attributes needed.

## 7. Motion

None. Static text element. No transitions, no entrance animation. The global `prefers-reduced-motion` block in `tokens.css` has no effect here.

## 8. Anti-patterns

- **Not a substitute for `FieldNote`.** `FieldNote` is an editorial inline aside that appears inside prose flow. Caption is a below-artifact label, not an inline annotation.
- **Not a heading or label.** Do not use Caption for field labels, section headings, or any text that precedes content rather than follows it.
- **Not for long-form body copy.** If the annotation exceeds two lines, reconsider whether body text (`<p>`) at `--fs-body` is more appropriate.
- **Not a `StatusBadge` or `Tag`.** Caption does not encode categorical metadata or liveness state.
- **Not for interactive affordances.** Caption carries no click, dismiss, or expand semantics. Use `Button` or `Link` for actions.

## 9. Depends on

- **Text** (DS atom) — Caption is a thin wrapper; the `Text` atom's base styles (font-family, color) cascade through `tokens.css` globals. If a dedicated `Text` atom exists in the DS, Caption may delegate to it internally — engineer's call.
- No other DS components required.
