---
"@poukai-inc/ui": minor
---

feat(Hero): add `entrance="stagger"` prop — CSS-only staggered reveal on load

Adds an opt-in `entrance` prop to `<Hero>`. When `entrance="stagger"` is set,
status, title, lede, and CTA animate in with a staggered top-down rise (8–12px
translateY + fade, ~1.05 s total). Pure CSS @keyframes — zero JS, no
IntersectionObserver, static-render-compatible.

Default `entrance={undefined}` preserves existing static behavior; no changes
for existing consumers.

Accessibility: `prefers-reduced-motion: reduce` disables all animations via
an explicit `animation: none` override in the component CSS module.

Closes #47.
