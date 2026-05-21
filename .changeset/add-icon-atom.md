---
"@poukai-inc/ui": minor
---

Add Icon atom — thin wrapper over `lucide-react` LucideIcon (consumer brings the icon).

Accepts any `LucideIcon` via the `icon` prop. Size scale maps `xs/sm/md/lg` to
`--icon-xs` (12 px) / `--icon-sm` (16 px) / `--icon-md` (20 px) / `--icon-lg` (24 px)
via token-backed CSS classes. Color is always `currentColor` so icons inherit text
color from parent. `strokeWidth` defaults to `1.5` per brand spec.

Accessibility: `decorative={true}` (default) sets `aria-hidden="true"` + `focusable="false"`.
`decorative={false}` requires `aria-label` and sets `role="img"` + `focusable="false"`;
omitting the label is a runtime console.error.

`forwardRef` to SVG root; `...rest` forwarded so consumers can pass `data-*`, `aria-*`,
and any SVG attribute.
