---
"@poukai-inc/ui": minor
---

Add `Time` atom — semantic `<time datetime>` with locale-aware formatted label.

**New exports**: `Time`, `TimeProps`, `TimeFormat`.

**Four format modes** via native `Intl` only (no external date library):

- `absolute` (default) — `Intl.DateTimeFormat` short month + day + year: `May 21, 2026`.
- `relative` — `Intl.RelativeTimeFormat` with descending threshold table (year → month → week → day → hour → minute → "just now" for |diff| < 60 s).
- `long` — `Intl.DateTimeFormat` long month + year: `May 2026`.
- `time-only` — `Intl.DateTimeFormat` hour + minute: `02:30 PM`.

**`dateTime` prop** accepts `string | Date`. String values pass verbatim to the `datetime` attribute (date-only strings such as `"2026-05-21"` are not round-tripped through `new Date()`). `Date` objects serialize via `.toISOString()`.

**`children` override**: when `children` is provided, it replaces the computed label; `format` and `locale` are ignored. The `datetime` attribute still emits the ISO string.

**SSR contract**: locale defaults to `navigator.language` in the browser and `"en-US"` on the server. `format="relative"` is not guaranteed to match between server and client; consumers requiring stable SSR for relative labels should provide `children` or use `format="absolute"`.

**A11y posture**: no `aria-label` injection, no motion, no color variants. The component inherits `color: inherit`. Zero new tokens.

**Subpath export**: `@poukai-inc/ui/atoms/Time`.

Downstream consumers: `Byline`, `ArticleHeader`, `TimelineItem`.
