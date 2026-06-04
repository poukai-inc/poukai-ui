---
"@poukai-inc/ui": patch
---

fix(SiteShell): close-panel aria-hidden-focus a11y regression (#410)

The 2.15.0 mobile panel rendered with `aria-hidden="true"` on the closed panel while
simultaneously keeping it in the DOM as `display:flex` with `opacity:0`. The `<a>` links
inside were still focusable, triggering the axe `aria-hidden-focus` rule at every mobile
viewport, which drops the Lighthouse mobile accessibility score below 100.

**Root-cause fix**: Replace `aria-hidden` with `visibility:hidden` on the closed panel.
`visibility:hidden` removes contained elements from the accessibility tree and tab order
without using `aria-hidden`, so the axe rule cannot fire. A `transition-delay` keeps
`visibility` visible until the fade-out completes and snaps to hidden only after the
element is no longer on-screen.

**Zero-JS / no-JS fallback**: The hamburger button and mobile panel now mount only after
JS hydration (progressive enhancement via a `hydrated` `useState` guard). Before
hydration the desktop nav is visible at all viewport widths (flex-wrapped), so zero-JS
consumers (marketing site with no client bundle) always have an accessible navigation
landmark at every viewport.

**Tap-target improvement**: `padding-block: var(--space-2)` added to `.nav-link` so
links shown in the no-JS mobile fallback meet the WCAG 2.5.8 24 px minimum target size.

No new tokens. No API changes. All existing prop defaults preserved.
