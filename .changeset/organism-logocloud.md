---
"@poukai-inc/ui": minor
---

feat(organism): add LogoCloud — partner/customer logo grid or strip

New `LogoCloud` organism: Section-framed collection of `Logo` atoms rendered
as a static responsive grid (`variant="grid"`, default) or a continuously
scrolling horizontal strip (`variant="strip"`).

Props: `variant`, `columns` (2–6, grid only, responsive halved at `--bp-md`),
`divider`, `heading`, `eyebrow`, `lede`, `size`. All Section slots pass through.

Strip uses CSS `animation: logoScroll calc(var(--dur-slow) * 10) linear infinite`
with seamless loop via duplicated `aria-hidden` track. Pauses on hover /
focus-within. Reduced-motion: `animation: none` + `overflow-x: auto`.

Exported from `@poukai-inc/ui`, `@poukai-inc/ui/organisms`, and
`@poukai-inc/ui/organisms/LogoCloud` subpath.
