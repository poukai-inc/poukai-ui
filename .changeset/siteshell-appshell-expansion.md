---
"@poukai-inc/ui": minor
---

feat(SiteShell): app-shell expansion — sticky header, end slot, nested dropdown nav, mobile hamburger panel (#391)

Additive extension of SiteShell. All existing flat-routes + footer marketing usage renders identically when new props are absent.

New props:

- `sticky` (boolean, default `false`) — makes the header `position: sticky; top: 0` with a hairline `border-bottom` and compact block padding (`--space-4`).
- `end` (ReactNode, optional) — right-edge slot for consumer-supplied controls (avatar, sign-out, theme toggle). SiteShell is auth-unaware; consumers compose via `routes` and `end`.
- `mobileMenuLabel` / `mobileCloseLabel` (string) — i18n-friendly accessible names for the hamburger/close buttons.

Extended `SiteShellRoute`:

- `href` is now optional (group labels have no href).
- `items?: SiteShellRoute[]` — one level of nesting. On desktop renders via existing `DropdownMenu` atom (`modal={false}`). On mobile renders as an inline disclosure (no Radix dependency).

Mobile behaviour:

- Below 768px: nav collapses to hamburger button. Panel slides in with `translateY`/opacity transition at `--dur-mid`/`--easing`. Respects `prefers-reduced-motion`.
- Focus management: moves to first panel item on open; returns to hamburger on Escape or close.
- NOT modal — no focus trap.

No new tokens. Z-index `100` (sticky header + mobile panel) is the DS's documented raw-value exception — matches `Header.module.css` and the informal scale in `DropdownMenu.module.css`.
No lucide-react — all icons are inline SVG per spec §6.

Size-limit: the `dist/organisms.js` budget is raised from 44 kB → 58 kB (Arian-approved). SiteShell now adopts the `DropdownMenu` atom (which wraps `@radix-ui/react-dropdown-menu`) for nested/"More" desktop nav items. Radix dropdown was already a library dependency present in `dist/atoms.js`; the barrel import of `organisms.js` now includes it. Per-component subpath imports (`/organisms/SiteShell`) are unaffected and remain small.
