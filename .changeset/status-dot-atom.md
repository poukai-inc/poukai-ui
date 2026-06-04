---
"@poukai-inc/ui": minor
---

feat(StatusDot): new atom — standalone status dot resolves #407

Adds `StatusDot`, a text-free colored circle for communicating semantic state in space-constrained
surfaces (kanban card indicators, fit badge dots, compact compound components).

**API**

- `tone`: `"neutral" | "info" | "success" | "warning" | "danger" | "accent"` — default `"neutral"`.
  Uses `--line-success`, `--line-warning`, `--line-danger` for the three semantic tones and `--accent`
  with a `--accent-glow` halo for `accent`. `neutral` and `info` both use `--fg-muted`.
- `size`: `"sm" | "md"` — `sm` = 8 px (inline label rows), `md` = 10 px (kanban/standalone). Default `"md"`.
- `disabled`: boolean — sets `opacity: 0.4`. Default `false`.
- Forwards all `<span>` attributes (`id`, `className`, `style`, `data-*`, `aria-*`).

**Accessibility**

Two permitted patterns: standalone (`role="img"` + `aria-label`) or decorative (`aria-hidden`, no role).
Dev-mode warning when neither is supplied.

**Tokens added (authored by poukai-design, approved in meta/brand.md 2026-06-02)**

- `--line-success: #1a7533` / dark: `#30d158`
- `--line-warning: #9a5200` / dark: `#ff9f0a`
- `--line-danger: #b3261e` / dark: `#ff453a`

**Subpath export**: `@poukai-inc/ui/atoms/StatusDot`
