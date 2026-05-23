# EmptyState

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`EmptyState` is the molecule for zero-data placeholders — the visual and textual moment shown when a list, table, or content region has no records to display. It composes an optional icon slot, a required title, an optional description, and an optional action slot into a centered vertical stack. Its primary consumer surface is `autopost` dashboard pages (scheduled posts, approvals, comments, conversations, blog, engagements, pages list, per-page cards), where ~10 sites each roll their own centered flex column today at roughly 50 LoC apiece.

## 2. Anatomy

```
┌─────────────────────────────────┐
│         [icon slot]             │  optional — any ReactNode (lucide icon)
│           Title                 │  required — short, scannable string
│        description              │  optional — supporting sentence or ReactNode
│        [action slot]            │  optional — Button or equivalent
└─────────────────────────────────┘
```

- **Root**: `<div>` — flex column, centered, `role="status"` when tone is default (inert informational region); plain `<div>` otherwise.
- **Icon wrapper**: `<span aria-hidden="true">` — decorative, suppressed from the a11y tree.
- **Title**: `<p>` rendered at `--fs-body` weight 500 — not a heading, because EmptyState appears inside regions that already have headings; emitting an additional heading level would pollute the document outline.
- **Description**: `<p>` rendered at `--fs-body`, `--fg-muted`.
- **Action wrapper**: `<div>` — hosts any ReactNode (typically a `Button`).

## 3. Tokens

- `--fg` — title text color
- `--fg-muted` — description text color; icon color when no explicit color is set on the passed icon
- `--fs-body` — title and description font size
- `--font-sans` — font family (both title and description)
- `--lh-body` — line-height (description paragraph)
- `--space-3` — gap between icon and title (12px)
- `--space-2` — gap between title and description (8px)
- `--space-6` — gap between description (or title when no description) and action (24px)
- `--space-16` — vertical padding top/bottom for the root container (4rem — breathing room inside a data region)
- `--surface` — background for `tone="subtle"` variant
- `--radius-3` — border-radius for `tone="subtle"` container (8px)
- `--icon-lg` — recommended icon render size (24px) when the consumer uses the `<Icon>` atom

## 4. Variants / Props

| Prop          | Type                           | Default       | Rationale                                                                                     |
| ------------- | ------------------------------ | ------------- | --------------------------------------------------------------------------------------------- |
| `icon`        | `ReactNode`                    | `undefined`   | Decorative slot. Lucide icon at `--icon-lg` (24px) is the idiomatic usage.                   |
| `title`       | `string`                       | — (required)  | The primary message. Short, scannable, present tense ("No scheduled posts").                  |
| `description` | `string \| ReactNode`          | `undefined`   | Supporting sentence. Accepts ReactNode to allow inline `<a>` / `<strong>` where needed.       |
| `action`      | `ReactNode`                    | `undefined`   | CTA slot. Consumer owns the Button variant and handler.                                       |
| `tone`        | `"default" \| "subtle"`        | `"default"`   | `default`: transparent background, sits on any parent surface. `subtle`: `--surface` fill + `--radius-3` for use inside card or panel contexts where a contained visual is preferred. |

## 5. Interaction

EmptyState is a static informational region — it contains no interactive elements of its own. The `action` slot may receive a `Button`, which carries its own focus, hover, and active states. No keyboard navigation is authored inside `EmptyState` itself. Tab order passes through to whatever focusable element the consumer places in the action slot.

## 6. A11y

- Root is a plain `<div>`. Do not use `role="alert"` — empty states are not urgent. `role="status"` is appropriate when the region updates live (e.g. a list empties after a delete), but is opt-in at the consumer level; the DS does not apply it unconditionally.
- Title is a `<p>`, not a heading. Document outline is the consumer's responsibility.
- Icon wrapper uses `aria-hidden="true"` — always decorative.
- Description `ReactNode` usage: if inline links are present, they inherit the global `<a>` focus ring (`outline: 2px solid var(--accent)`).
- Contrast: `--fg` (#1D1D1F) on `--bg` (#FBFBFD) = 16.29:1 (AAA) for title. `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.56:1 (AA) for description at `--fs-body` (17–19px).
- `tone="subtle"` description contrast: `--fg-muted` on `--surface` (#F5F5F7) = 4.25:1. At 17px this marginally misses AA normal (4.5:1). The engineer must verify; if confirmed below threshold, description in `tone="subtle"` should use `--fg` instead of `--fg-muted`.

## 7. Motion

None. EmptyState is a static placeholder. No entrance animation. No transition on any property.

The global `prefers-reduced-motion: reduce` block in `tokens.css` has no effect here since no transitions or animations are authored.

If a consumer wraps EmptyState in a parent with a stagger or fade entrance, the parent owns that timing entirely.

## 8. Anti-patterns

- **Do not use EmptyState as a loading skeleton.** Zero-data and in-flight states are different moments; use a dedicated skeleton or spinner for loading.
- **Do not use EmptyState for error states.** An API error is not empty data — it warrants an `Alert` with `variant="error"` and a retry action, not a neutral placeholder.
- **Do not pass a heading element into the `icon` slot.** The icon slot is decorative; placing text or heading nodes there bypasses the intended visual hierarchy.
- **Do not omit `title`.** A description-only or action-only empty state lacks the primary message. `title` is required.
- **Do not use EmptyState inside a full-page layout as the only content.** Page-level first-run flows warrant a dedicated onboarding surface (e.g. Hero + CTA), not a molecule-sized placeholder.
- **Do not hardcode color on the icon.** Pass the icon without an explicit `color` prop so it inherits `--fg-muted` from the wrapper; this ensures dark-mode correctness.

## 9. Depends on

- `Button` atom — the idiomatic action slot consumer.
- `Icon` atom (optional) — for the icon slot when a DS-managed icon is preferred over a raw Lucide import.

No Radix dependency. Pure CSS + DS tokens.
