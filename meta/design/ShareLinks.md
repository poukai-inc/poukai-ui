# ShareLinks

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`ShareLinks` is a compact share-action row that lives at the end of articles and case studies. Its single job is to give readers a frictionless way to share the current page to X, LinkedIn, or copy the URL — rendered as a horizontal row of icon buttons with a `navigator.share` fast-path when the platform supports it. It serves editorial surfaces (blog posts, case studies, long-form docs) and is not intended for dashboard or product UI.

## 2. Anatomy

```
[ X btn ] [ LinkedIn btn ] [ CopyButton ]
```

- **Root**: `<div role="group" aria-label="Share this article">` — groups the controls without a landmark role that would conflict with surrounding landmarks.
- **Network buttons**: one `IconButton` per entry in `networks` prop. Each renders a recognisable platform icon with a screen-reader label (e.g. `aria-label="Share on X"`). Clicking opens the platform intent URL in a new tab (`target="_blank" rel="noopener noreferrer"`).
- **Copy slot**: `CopyButton` molecule for the `"copy"` network entry. Receives `value={url}`; its own success-state feedback ("Copied!") is owned by `CopyButton`.
- **Native share fast-path**: when `navigator.share` is available the entire row is replaced by a single `IconButton` (share icon, `aria-label="Share"`) that calls `navigator.share({ url, title })`. The `networks` prop is ignored in this path — the OS sheet handles destination choice.

## 3. Tokens

- `--space-2` (0.5rem) — gap between buttons
- `--fg-muted` — icon default color (resting, unemphasised)
- `--fg` — icon color on hover/focus
- `--accent` — focus ring color (via `IconButton` focus-visible rule)
- `--dur-fast` (180ms) — color transition on hover
- `--easing` — transition easing
- `--radius-1` — focus ring radius (via `IconButton`)
- `--hairline-w` — focus outline width (via `IconButton`)

No new tokens needed.

## 4. Variants / Props

| Prop        | Type                                 | Default                   | Rationale                                                                                                   |
| ----------- | ------------------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `url`       | `string`                             | — (required)              | The URL to share / copy.                                                                                    |
| `title`     | `string`                             | `""`                      | Passed to `navigator.share` and pre-filled in intent URLs.                                                  |
| `networks`  | `Array<"x" \| "linkedin" \| "copy">` | `["x","linkedin","copy"]` | Consumers can omit networks irrelevant to their surface. Order in the array determines render order.        |
| `size`      | `"sm" \| "md"`                       | `"md"`                    | Maps to `IconButton` size prop. `"sm"` for compact editorial footers; `"md"` for end-of-article placements. |
| `className` | `string`                             | —                         | Forwarded to the root `div` for layout overrides.                                                           |

Native share fast-path is automatic — no prop needed. When `navigator.share` is defined the component renders the single-button path regardless of the `networks` array.

## 5. Interaction

- **Hover**: icon color transitions from `--fg-muted` to `--fg` over `--dur-fast` with `--easing`. No scale or shadow.
- **Focus-visible**: standard `--accent` outline at 2px / `--radius-1`, inherited from `IconButton`.
- **Active**: icon shifts with `--dur-press` (80ms) scale-down via `IconButton` active state.
- **Click — network button**: opens `window.open(intentUrl, "_blank", "noopener,noreferrer")`.
- **Click — CopyButton**: delegates entirely to `CopyButton` (idle → success → idle revert at ~1.5s).
- **Click — native share button**: calls `navigator.share({ url, title })`. If the promise rejects (user cancels), nothing happens — no error state is surfaced to the user.
- **Keyboard order**: left-to-right tab order matching DOM order; no arrow-key navigation (these are independent buttons, not a toolbar).

## 6. A11y

- Root `<div role="group" aria-label="Share this article">` groups the controls meaningfully without adding a redundant landmark.
- Each `IconButton` carries an explicit `aria-label`: `"Share on X"`, `"Share on LinkedIn"`, `"Copy link"`, `"Share"` (native path).
- Platform icons are `aria-hidden` decorative — the `aria-label` on `IconButton` is the accessible name.
- Network-button anchors open `target="_blank"`; each `aria-label` should include the context ("opens in new tab") — the engineer may append this via a visually-hidden span inside `IconButton` or via the `aria-label` string, consistent with the DS's `IconButton` a11y contract.
- `CopyButton` owns its own live-region announcement on copy success.
- axe rules in play: `button-name`, `color-contrast`, `aria-allowed-role`.

## 7. Motion

- Icon color transition: `var(--dur-fast) var(--easing)` on `color` / `fill` — inherited from `IconButton`.
- `CopyButton` success-state transition is owned by `CopyButton`.
- `@media (prefers-reduced-motion: reduce)`: the global rule in `tokens.css` collapses all `transition-duration` to `0.01ms` — no per-component override needed. The native-share button triggers an OS sheet with its own motion; the DS has no control over that path.

## 8. Anti-patterns

- **Not for primary navigation.** These are share affordances, not nav links. Do not place in a site header or sidebar.
- **Not for in-product dashboards.** ShareLinks is an editorial-surface primitive; use `IconButton` directly for custom share flows inside app UIs.
- **Not a full social-proof strip.** ShareLinks does not display follower counts, like counts, or engagement metrics — those belong to a future `SocialProof` molecule.
- **Not for authenticated sharing flows.** ShareLinks opens platform intent URLs in new tabs. It does not handle OAuth, scheduled sharing, or any `autopost` workflow — that is `autopost`'s domain.
- **Not a replacement for `CopyButton`.** If only a copy-URL affordance is needed, use `CopyButton` directly. `ShareLinks` wraps it alongside network buttons; it is not a container for a single copy button.

## 9. Depends on

- `IconButton` atom — all network buttons and the native-share button.
- `CopyButton` molecule — the `"copy"` network entry.
