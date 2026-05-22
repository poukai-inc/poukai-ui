# Time

**Status**: Approved
**Layer**: atom
**Element**: `<time>` (non-polymorphic)
**Version added**: next (minor)

---

## 1. Purpose

`Time` is the canonical semantic timestamp primitive for `@poukai-inc/ui`. It wraps the native `<time>` element with a `dateTime` prop that accepts `string | Date`, four locale-aware format modes, and an escape hatch via `children`.

Downstream consumers: `Byline`, `ArticleHeader`, `TimelineItem`.

---

## 2. Usage examples

### Absolute (default)

```tsx
<Time dateTime="2026-05-21T10:00:00Z" />
// → <time datetime="2026-05-21T10:00:00.000Z">May 21, 2026</time>
```

### Relative

```tsx
<Time dateTime={new Date(Date.now() - 3 * 3600 * 1000)} format="relative" />
// → <time datetime="...">3 hours ago</time>
```

### Long

```tsx
<Time dateTime="2026-05-21T10:00:00Z" format="long" />
// → <time datetime="2026-05-21T10:00:00.000Z">May 2026</time>
```

### Time-only

```tsx
<Time dateTime="2026-05-21T14:30:00Z" format="time-only" />
// → <time datetime="2026-05-21T14:30:00.000Z">02:30 PM</time>
```

### Children override

When `children` is provided, it replaces the computed label entirely. `format` and `locale` are ignored. The `datetime` attribute still emits the ISO string.

```tsx
<Time dateTime="2026-05-21T10:00:00Z">Last Wednesday</Time>
// → <time datetime="2026-05-21T10:00:00.000Z">Last Wednesday</time>
```

### Date-only string — passes verbatim

A date-only string (no time component) is passed directly to the `datetime` attribute without being round-tripped through `new Date()`. This avoids timezone shifting on the attribute value.

```tsx
<Time dateTime="2026-05-21" />
// → <time datetime="2026-05-21">May 21, 2026</time>
//   Note: the label is still computed via new Date("2026-05-21") internally,
//   but the datetime attribute preserves the original string.
```

---

## 3. Props

| Prop        | Type                                          | Default      | Required | Notes                                                                                  |
| ----------- | --------------------------------------------- | ------------ | -------- | -------------------------------------------------------------------------------------- |
| `dateTime`  | `string \| Date`                              | —            | Yes      | String: passed verbatim to `datetime`. Date: `.toISOString()`.                         |
| `format`    | `"absolute" \| "relative" \| "long" \| "time-only"` | `"absolute"` | No  | Ignored when `children` is provided.                                                   |
| `locale`    | `string`                                      | see §6       | No       | BCP 47 locale tag. Defaults to `navigator.language` (browser) or `"en-US"` (server).  |
| `children`  | `ReactNode`                                   | —            | No       | When present, renders as the visible label instead of any computed string.             |
| `...rest`   | `ComponentPropsWithoutRef<"time">` (minus `dateTime`) | — | No   | Spread to root `<time>`. Supports `className`, `data-*`, `aria-*`, etc.                |

---

## 4. Format modes

### `absolute` (default)

`Intl.DateTimeFormat` with `{ year: "numeric", month: "short", day: "numeric" }`.

Example: `May 21, 2026`

### `relative`

`Intl.RelativeTimeFormat` with `{ numeric: "auto" }`. Falls back to English `"just now"` when `|diff| < 60s`.

See §5 for threshold table.

### `long`

`Intl.DateTimeFormat` with `{ year: "numeric", month: "long" }`.

Example: `May 2026`

### `time-only`

`Intl.DateTimeFormat` with `{ hour: "2-digit", minute: "2-digit" }`.

Example: `02:30 PM` (en-US) / `14:30` (fr-FR)

---

## 5. Relative-time threshold table

Thresholds are evaluated in descending order against the absolute difference in seconds between `dateTime` and `Date.now()` at render time.

| Condition              | Unit used  |
| ---------------------- | ---------- |
| `|diff| < 60s`         | `"just now"` (English literal, no Intl call) |
| `|diff| >= 345 × 86400s` | `year`   |
| `|diff| >= 28 × 86400s`  | `month`  |
| `|diff| >= 7 × 86400s`   | `week`   |
| `|diff| >= 86400s`       | `day`    |
| `|diff| >= 3600s`        | `hour`   |
| `|diff| >= 60s`          | `minute` |

The signed value passed to `RelativeTimeFormat.format()` is `Math.round(diffSeconds / thresholdSeconds)`, preserving future vs. past direction.

---

## 6. SSR / locale resolution

```
locale prop present?  → use prop value
browser (typeof navigator !== "undefined")?  → navigator.language
server fallback  → "en-US"
```

No hydration mismatch guarantee is provided for `format="relative"` — the label is computed at render time on both server and client. Consumers requiring stable SSR output for relative labels should provide `children` or use `format="absolute"`.

---

## 7. Accessibility

- No `aria-label` injection. The visible text is the accessible label — screen readers read it directly from the `<time>` element's text content.
- No `role` override. `<time>` carries no implicit ARIA role; that is intentional.
- `datetime` attribute is always present and always ISO format — this is the machine-readable complement to the human-readable text content.
- No motion, no animation.
- No color variants — `Time` inherits `color: inherit` from the parent flow.

---

## 8. Anti-patterns

- Do NOT use `Time` for purely decorative timestamps where semantics are irrelevant — use a plain `<span>` instead.
- Do NOT pass `datetime` via `...rest` — the `dateTime` prop is required and controls both the attribute and label computation.
- Do NOT rely on `format="relative"` for SSR-consistent output without providing `children`.
- Do NOT add motion or color state to `Time` — it is a presentational primitive with no interactive state.
- Do NOT introduce `aria-label` — the visible text content is the accessible label.

---

## 9. Downstream consumers

| Consumer        | Typical usage                                         |
| --------------- | ----------------------------------------------------- |
| `Byline`        | `format="absolute"` with author line publication date |
| `ArticleHeader` | `format="long"` for month/year publish context        |
| `TimelineItem`  | `format="relative"` for recency signal, or `format="absolute"` for precision |

---

## 10. Token usage

`Time` introduces zero new tokens. It inherits `color: inherit` and `font: inherit` from the parent context. No CSS module is required.
