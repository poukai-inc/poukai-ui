# Disclosure

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`<Disclosure>` is a single open/close toggle for surfaces where `Accordion` grouping is overkill — "Show details" toggles, expandable card sections, optional supplementary content. It wraps one question/label and one content region; when the trigger is activated the content region expands inline. It serves any surface that needs a standalone collapsible row without importing the full Accordion compound API.

## 2. Anatomy

```
┌─────────────────────────────────────────┐
│ [chevron] Summary label          trigger │  ← <summary> or <button>
├─────────────────────────────────────────┤
│  Content region (expanded only)          │  ← children slot
└─────────────────────────────────────────┘
```

- **Root element**: native `<details>` by default. The browser manages open/closed state without JS. Controlled usage (externally managed `open` prop) is supported via a React-controlled `<details open={open}>` pattern.
- **Trigger**: `<summary>` child — the browser's built-in disclosure trigger. Contains the summary label text and a trailing chevron `Icon`.
- **Chevron**: `Icon` atom (lucide `ChevronDown`), `size={--icon-sm}`. Rotates 180° when open.
- **Content slot**: `children` rendered below the `<summary>`. Accepts any `ReactNode`; idiomatic usage is `<Prose>` or a plain paragraph.

## 3. Tokens

- `--fg` — summary label text color
- `--fg-muted` — muted variant summary label color
- `--font-sans` — trigger font family
- `--fs-body` — summary label font size
- `--lh-body` — summary label line-height
- `--hairline` — optional top border on the root (divider variant)
- `--hairline-w` — border width
- `--space-3` — vertical padding on summary trigger
- `--space-4` — gap between summary and content region
- `--dur-fast` — chevron rotation transition duration
- `--easing` — chevron rotation easing
- `--accent` — focus ring color
- `--radius-1` — focus ring border-radius

## 4. Variants / Props

| Prop           | Type                      | Default      | Rationale                                                                                     |
| -------------- | ------------------------- | ------------ | --------------------------------------------------------------------------------------------- |
| `summary`      | `string`                  | — (required) | Trigger label text                                                                            |
| `open`         | `boolean`                 | `undefined`  | Controlled open state; uncontrolled when omitted                                              |
| `defaultOpen`  | `boolean`                 | `false`      | Uncontrolled initial state                                                                    |
| `onOpenChange` | `(open: boolean) => void` | `undefined`  | Controlled state callback                                                                     |
| `divider`      | `boolean`                 | `false`      | Adds `border-top: var(--hairline-w) solid var(--hairline)` to root — for use in list contexts |
| `tone`         | `"default" \| "muted"`    | `"default"`  | `muted` applies `--fg-muted` to summary label; used when Disclosure must recede               |
| `children`     | `ReactNode`               | — (required) | The revealed content region                                                                   |

## 5. Interaction

- **Click / tap**: toggles open/closed. Native `<details>` handles this without JS; controlled usage calls `onOpenChange`.
- **Keyboard**: `<summary>` receives focus. `Enter` and `Space` toggle the disclosure (browser-native on `<summary>`).
- **Focus order**: trigger is a single tab stop. Content receives natural document-order focus when expanded.
- **Hover**: no visual hover state authored by DS — `<summary>` inherits cursor pointer via `cursor: pointer`.
- **Chevron rotation**: `transform: rotate(0deg)` closed → `rotate(180deg)` open, animated via `--dur-fast` / `--easing`.

## 6. A11y

- **Semantic element**: native `<details>` / `<summary>` pair. Browsers expose this as a `disclosure` widget with built-in `aria-expanded` equivalent — no manual ARIA needed for the open/closed announcement.
- **Role**: `<summary>` has implicit role `button` in most AT implementations. No additional `role` attr required.
- **Focus ring**: `:focus-visible` on `<summary>` → `outline: 2px solid var(--accent); outline-offset: 4px; border-radius: var(--radius-1)`.
- **Content visibility**: hidden content is `display: none` in the collapsed state via `<details>` semantics — not merely visually hidden. Screen readers do not read hidden content.
- **Contrast**: `--fg` on `--bg` = 16.29:1 (AAA); `--fg-muted` on `--bg` = 4.91:1 (AA normal).
- **axe rules in play**: `color-contrast`, `focusable-content`, `summary-name`.

## 7. Motion

- **Chevron rotation**: `transition: transform var(--dur-fast) var(--easing)` — 180ms, expo-out.
- **Content reveal**: no height animation by default. Native `<details>` toggles `display` rather than animating height; a CSS `@starting-style` / `interpolate-size` expansion may be layered in a follow-up when browser support is sufficient.
- **`prefers-reduced-motion`**: the global `tokens.css` rule clamps `transition-duration: 0.01ms !important` — chevron rotation becomes instantaneous. No per-component override needed.

## 8. Anti-patterns

- **Do not use for grouped collapsible sections.** Use `Accordion` (`type="single"` or `type="multiple"`) when two or more related items share the same collapsible pattern — Accordion provides coordinated keyboard navigation and a shared visual rhythm Disclosure cannot.
- **Do not use as a navigation trigger.** Disclosure is not a menu or dropdown. For anchored overlay menus use `DropdownMenu`.
- **Do not nest Disclosures inside Disclosures.** Creates confusing focus order and ambiguous content hierarchy. If nested collapsible content is genuinely needed, reconsider the information architecture.
- **Do not use for modal or overlay content.** Revealed content is inline in document flow. For overlay surfaces use `Dialog` or `Popover`.
- **Do not pass interactive form controls as `summary`.** Only text (+ chevron) belongs in the trigger. Complex trigger shapes belong in a custom button pattern outside this component.

## 9. Depends on

- `Icon` atom (lucide `ChevronDown`, `size={--icon-sm}`)

## Open questions

- **Animated height reveal**: CSS `interpolate-size: allow-keywords` + `height: 0 → auto` animation on `<details>` content is available in Chrome 129+ and Safari 18.2+ but not yet Firefox stable. Decision needed on whether to ship with a static reveal (safe, works everywhere) or progressive enhancement (better UX where supported). Token `--dur-mid` is the candidate duration if animation ships; no new token required.
