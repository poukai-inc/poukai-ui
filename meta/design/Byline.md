# Byline

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`Byline` is the attribution row that appears beneath article headers, testimonial blocks, and case-study intros. It composes an Avatar, an author name, an optional role label, and an optional publication time + read-time annotation into a single compact horizontal strip. Its job is to answer "who wrote this and when" in one scan line — consistent across every editorial surface that carries a human author signal.

## 2. Anatomy

```
[ Avatar ] [ Name · Role ]
           [ time · read-time ]
```

- **Avatar slot** — `<img>` wrapped by the `Avatar` atom. Accepts `src` + `alt`. Optional; when absent, name + role shift to the left edge.
- **Name** — `<span>` rendered in `--fg` at `--fs-meta`. Primary identity signal.
- **Role** — `<span>` rendered in `--fg-muted` at `--fs-meta`. Separated from name by a mid-dot (·). Optional.
- **Meta row** — second line below name/role. Contains `<time>` (publishedAt) and plain `<span>` (readTime), separated by a mid-dot. Both optional; meta row suppressed when neither is present.
- **Root** — `<div>` with `display: flex`, `align-items: center`, `gap: var(--space-3)`.

## 3. Tokens

- `--font-sans` — name, role, and meta text family
- `--fs-meta` — name and role font-size (14px)
- `--fs-micro` — time and read-time font-size (12px); paired with `letter-spacing: var(--tracking-micro)` per brand rule
- `--fg` — name text color
- `--fg-muted` — role, time, and read-time text color
- `--space-1` — vertical gap between name/role line and meta row
- `--space-2` — gap between mid-dot segments within each line
- `--space-3` — gap between avatar and text column
- `--lh-meta` — line-height for name/role line (1.2)

## 4. Variants / Props

| Prop          | Type      | Default     | Rationale |
|---------------|-----------|-------------|-----------|
| `avatar`      | `string`  | —           | `src` passed to Avatar. Omit to hide avatar. |
| `avatarAlt`   | `string`  | `""`        | Alt text for avatar image. Empty string marks it decorative when name is visible. |
| `name`        | `string`  | (required)  | Author display name. Always visible. |
| `role`        | `string`  | —           | Job title or affiliation. Optional. |
| `publishedAt` | `Date`    | —           | Rendered as `<time dateTime={ISO}>`. Optional. |
| `readTime`    | `string`  | —           | e.g. `"6 min read"`. Plain string; no unit enforcement. Optional. |

No size ladder. No tone variants. The byline register is fixed at `--fs-meta` / `--fs-micro` — it is always subordinate to the heading it follows.

## 5. Interaction

Static. No hover, active, or focus states on the container or text. If `name` or `role` need to link to an author profile, the consumer wraps the relevant content in an `<a>` — the DS does not add link semantics to Byline's props. The `<a>` inherits the system link underline treatment from `tokens.css`.

## 6. A11y

- Root is `<div>` — no landmark role; Byline is editorial metadata, not navigation.
- `publishedAt` renders as `<time dateTime={date.toISOString()}>` with a human-readable display string (e.g. `"22 May 2026"`). The `dateTime` attribute provides the machine-readable form.
- Avatar `alt` should be empty (`""`) when `name` is present and visible — the name already identifies the author; a duplicate alt string creates redundant announcements for screen reader users.
- Mid-dot separators (·) are rendered as `aria-hidden="true"` spans to prevent screen readers from announcing "middle dot" between segments.
- Contrast: `--fg` (#1D1D1F) on `--bg` (#FBFBFD) = 16.29:1 (AAA). `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.56:1 — passes AA at 12px (threshold 4.5:1).

## 7. Motion

None. Static component. `prefers-reduced-motion` has no effect — there is nothing to suppress.

## 8. Anti-patterns

- **Not for nav attribution** — do not use Byline in header or footer nav rows. It is an editorial inline atom, not a user identity widget.
- **Not for team cards** — `TeamCard` has its own portrait + name + role layout at display scale. Byline is compact subordinate metadata, not a featured profile.
- **Not a status indicator** — do not render `StatusBadge` inside Byline. Role and availability are different concepts.
- **Not a multi-author row** — Byline renders one author. Two authors sharing a byline are a future variant; do not pass arrays into `name`.
- **Not for long bios** — Byline carries a name, a role label, and a timestamp. Extended prose belongs in a separate bio block.

## 9. Depends on

- `Avatar` atom — for the circular portrait slot.
- `Text` atom (or semantic HTML equivalents) — for name, role, and meta copy.
- `Time` atom (if available in DS) — or native `<time>` element with `dateTime` attribute.
