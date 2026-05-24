# Alert

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`Alert` is the system's inline semantic banner — a contained message block that communicates feedback with a defined emotional register: `info`, `success`, `warn`, `error`, or `note`. It is distinct from `FieldNote`, which is an editorial aside with no live-region semantics; `Alert` carries an explicit ARIA live region role (`role="status"` for non-urgent feedback, `role="alert"` for urgent errors) so assistive technology announces the content without requiring focus. It serves product surfaces: form submission outcomes, validation summaries, trial/billing notices, system-state warnings, and inline guidance callouts.

## 2. Anatomy

```
┌─────────────────────────────────────────────────┐
│ [Icon]  Title text (optional)                   │
│         Body / children content                 │
└─────────────────────────────────────────────────┘
```

- **Root**: `<div>` with role assignment per variant
- **Icon slot** (leading, optional): lucide-react icon at `--icon-sm` (16px); decorative (`aria-hidden`)
- **Content column**: flex-column holding title + body
- **Title** (optional): rendered as `<p>` or `<strong>` — short, scannable label
- **Body**: `children` — inline copy, ReactNode; rendered inside a `<p>` or directly as children

## 3. Tokens

- `--bg-success`, `--fg-on-success` — success variant surface and text
- `--bg-danger`, `--fg-on-danger` — error variant surface and text
- `--bg-warning`, `--fg-on-warning` — warn variant surface and text
- `--surface` — info and note variant background (neutral recessed surface)
- `--fg` — info and note variant primary text
- `--fg-muted` — note variant muted text (body copy register)
- `--hairline` — border color for all variants (1px rule)
- `--hairline-w` — border width (`1px`)
- `--success` — icon/accent color for success variant
- `--danger` — icon/accent color for error variant
- `--warning` — icon/accent color for warn variant
- `--accent` — icon/accent color for info variant
- `--font-sans` — body and title typeface
- `--fs-meta` (14px) — title and body font size
- `--lh-body` (1.55) — body line-height
- `--space-2` (8px) — gap between icon and content column; vertical gap between title and body
- `--space-3` (12px) — block padding
- `--space-4` (16px) — inline padding
- `--radius-2` (4px) — corner radius
- `--icon-sm` (16px) — icon size

## 4. Variants / Props

| Prop       | Type                                                 | Default  | Rationale                                                        |
| ---------- | ---------------------------------------------------- | -------- | ---------------------------------------------------------------- |
| `variant`  | `"info" \| "success" \| "warn" \| "error" \| "note"` | `"info"` | Maps to semantic color tier + ARIA role                          |
| `title`    | `string`                                             | —        | Optional scannable label above body; omit for single-line alerts |
| `children` | `ReactNode`                                          | required | Body copy; typically a string or short prose                     |
| `icon`     | `ReactNode`                                          | auto     | Consumer can override the default icon; pass `null` to suppress  |

**Variant mapping:**

| Variant   | Background     | Text color        | Icon color   | ARIA role       |
| --------- | -------------- | ----------------- | ------------ | --------------- |
| `info`    | `--surface`    | `--fg`            | `--accent`   | `role="status"` |
| `success` | `--bg-success` | `--fg-on-success` | `--success`  | `role="status"` |
| `warn`    | `--bg-warning` | `--fg-on-warning` | `--warning`  | `role="status"` |
| `error`   | `--bg-danger`  | `--fg-on-danger`  | `--danger`   | `role="alert"`  |
| `note`    | `--surface`    | `--fg-muted`      | `--fg-muted` | `role="note"`   |

`error` uses `role="alert"` (assertive live region — announced immediately). All other variants use `role="status"` or `role="note"` (polite — announced when idle). `note` uses `role="note"` (non-live landmark, content is static annotation).

## 5. Interaction

Alert is a non-interactive display component. No hover, active, or focus states on the container itself. If `children` contains a link or button, those elements receive their standard focus treatment from the DS (`--accent` outline, 2px offset). No dismiss/close affordance in this version — see §8.

## 6. A11y

- Root element is `<div>` with explicit `role` per variant (see §4 variant mapping).
- `role="alert"` is an assertive ARIA live region; it announces content to screen readers immediately on mount. Use only for `error` — avoid repurposing for non-urgent messages.
- `role="status"` is a polite live region; screen readers announce when idle. Correct for `info`, `success`, `warn`.
- `role="note"` is a static landmark. Screen readers do not auto-announce; content is reachable by navigation. Correct for editorial `note` callouts.
- The leading icon must carry `aria-hidden="true"` — it is decorative and the variant text conveys the semantic register.
- Title (when present) is not a heading element. It is rendered as `<strong>` or `<p>` — Alert is not a section landmark, and heading levels inside inline banners disrupt document outline.
- Contrast verified: `--fg-on-success` / `--bg-success` ≥ 10.5:1 (AAA); `--fg-on-danger` / `--bg-danger` ≥ 9.1:1 (AAA); `--fg-on-warning` / `--bg-warning` ≥ 10.2:1 (AAA); `--fg` / `--surface` ≥ 15:1 (AAA); `--fg-muted` / `--surface` ≥ 4.9:1 (AA).

## 7. Motion

None — Alert is a static display component. No entrance animation, no transition on mount or unmount.

`@media (prefers-reduced-motion: reduce)` in `tokens.css` is respected globally; since Alert has no authored transitions, reduced-motion has no specific effect here.

If a parent component animates Alert in (e.g., a form validation summary sliding into view), motion ownership stays with the parent. Alert does not contribute its own timing.

## 8. Anti-patterns

- **Do not use Alert for toast / transient notifications.** Toasts float above content, auto-dismiss, and are positioned outside flow. Alert is inline and persistent until the consumer unmounts it.
- **Do not use Alert to replace FieldNote.** FieldNote is an editorial inline aside with no live-region semantics. Alert is for product feedback (form errors, billing warnings, system state). The distinction is semantic, not visual.
- **Do not use `role="alert"` for non-urgent messages.** Assertive live regions interrupt screen reader narration. Only `error` variant warrants this; using it for `info` or `success` is an a11y regression.
- **Do not nest an Alert inside a `<p>`.** Alert is a block-level region. It must sit in block context, not inline prose.
- **Do not use Alert as a page-wide system banner.** Full-width announcement bars belong to `AnnouncementBar` (organism), which adds dismissal, localStorage persistence, and page-top positioning.
- **Do not use the `note` variant for urgent feedback.** `role="note"` is a non-live region; urgent errors will not be announced. Use `error` variant for errors.

## 9. Depends on

- `Icon` atom — for the leading icon slot (lucide-react icon wrapped to DS size tokens)
- `Text` atom — for body copy rendering (if/when the `Text` atom lands; inline `<p>` acceptable until then)
