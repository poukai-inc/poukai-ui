---
"@poukai-inc/ui": minor
---

feat(organism): add AnnouncementBar — dismissable page-top banner

New `AnnouncementBar` organism for product announcements, maintenance
notices, and time-sensitive promotions. Renders full-width above the
Header organism. Dismissal state persisted via `localStorage` keyed by
`id`. SSR-safe: visible by default, hidden post-hydration if dismissed.

Props: `id` (required), `tone` (warm | neutral | success | danger |
warning, default warm), `dismissable` (bool, default true), `action`
(ReactNode slot), `onDismiss` callback.

Exports: `AnnouncementBar`, `AnnouncementBarProps`, `AnnouncementBarTone`.
Subpath: `@poukai-inc/ui/organisms/AnnouncementBar`.
