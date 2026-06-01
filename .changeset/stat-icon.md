---
"@poukai-inc/ui": minor
---

`Stat` gains an optional `icon` prop (#400).

Renders a decorative icon above the numeral inside an `aria-hidden` wrapper —
mirroring `FeatureCard`'s icon pattern — for dashboard metric cards. Purely
visual; the caption still carries the meaning. Pass a sized element
(e.g. `<Activity size={24} />`); Stat imposes no size. No new tokens; omitting
`icon` renders identically to before.
