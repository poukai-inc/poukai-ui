---
"@poukai-inc/ui": minor
---

Add SkipLink atom — keyboard skip-to-content anchor.

Visually hidden at rest (canonical sr-only clip pattern), becomes a
fixed-position high-contrast pill when keyboard-focused. The standard a11y
primitive for layout shells: lets keyboard users bypass nav and chrome to
jump straight to the page's main content region.

Root is always `<a>`, non-polymorphic — fragment navigation is anchor
semantics, full stop. `href` (required) is the consumer-supplied fragment
target (e.g. `#main`). `children` defaults to `"Skip to content"`; override
for layouts with multiple navigable regions.

Focused pill uses the DS-wide max-contrast inversion pair (`--fg` on `--bg`,
~16:1 AAA), `z-index: 9999` so it can never be occluded by Dialog or Toast
layers, and `outline: none` because the high-contrast pill itself is the
focus indicator (documented deviation from the global `a:focus-visible`
accent ring). No motion. No `:hover` style — keyboard-only by design.

Composes neither `<Link>` nor `<VisuallyHidden>`: owns its own clip + focus
CSS in one module so the `:focus-visible` un-clip rule does not fight
cross-module specificity. `forwardRef<HTMLAnchorElement, SkipLinkProps>`,
`displayName="SkipLink"`.

Spec: `meta/design/SkipLink.md`.

**Migration note:** SiteShell consumer migration is a follow-up audit PR —
this PR ships the atom only and does not modify SiteShell.
