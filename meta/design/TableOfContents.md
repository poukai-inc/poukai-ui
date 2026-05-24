# TableOfContents

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`TableOfContents` is the molecule for long-form-article right-rail navigation: a sticky anchor list that tracks the reader's scroll position and highlights the currently visible section. It serves editorial article surfaces, docs pages, and any long-form layout where readers need orientation and jump-navigation without leaving the page.

## 2. Anatomy

```
┌─────────────────────────┐
│  [optional heading]      │  ← "On this page" — --fs-meta, --fg-muted
│  ─────────────────────  │  ← --hairline rule (optional)
│  • Introduction          │  ← LinkList.Item, default state
│  • Approach              │  ← LinkList.Item, active state (--accent)
│  • Results               │  ← LinkList.Item, default state
└─────────────────────────┘
```

- **Root**: `<nav aria-label="Table of contents">` — landmark with explicit label.
- **Heading** (optional): a `<p>` in the micro/meta register — "On this page". Not a heading element; avoids polluting the document outline.
- **Item list**: delegated to `LinkList` — renders a `<ul>` of `<li>` + `<a href="#id">` anchors.
- **Active indicator**: the active item's anchor receives a distinct color and optional left-border accent set via a data attribute or className toggled by the IntersectionObserver callback.
- **Sticky container**: `position: sticky; top: var(--toc-offset, var(--space-8))` — consumer sets `--toc-offset` to match their shell's header height.

## 3. Tokens

- `--fg-muted` — heading text and inactive item color
- `--fg` — hovered item color
- `--accent` — active item text color and left-border accent
- `--fs-meta` — item font size (14px)
- `--fs-micro` — optional heading font size (12px, uppercase)
- `--font-sans` — font family
- `--lh-meta` — line-height for item labels
- `--space-1` — item padding-block (4px)
- `--space-2` — gap between items (8px); left-border accent offset
- `--space-3` — left padding offset to accommodate active left-border (12px)
- `--space-4` — gap between optional heading and item list (16px)
- `--space-8` — default sticky top offset fallback (2rem)
- `--hairline` — optional separator below heading; active left-border color fallback
- `--hairline-w` — 1px active left-border width
- `--dur-fast` — transition duration for active color change (180ms)
- `--easing` — transition easing

## 4. Variants / Props

| Prop             | Type                                                   | Default     | Rationale                                                                                                                                      |
| ---------------- | ------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`          | `Array<{ id: string; label: string; depth?: 1 \| 2 }>` | required    | Anchor list. `depth` enables sub-item indent for H3-level sections.                                                                            |
| `heading`        | `string`                                               | `undefined` | Optional "On this page" label above the list. Omit on narrow contexts.                                                                         |
| `activeId`       | `string`                                               | `undefined` | Controlled active item. When provided, overrides IntersectionObserver.                                                                         |
| `onActiveChange` | `(id: string) => void`                                 | `undefined` | Escape hatch for controlled consumers.                                                                                                         |
| `offset`         | `number`                                               | `0`         | Pixel offset for IntersectionObserver `rootMargin` top — matches sticky header height so the active item fires at the correct scroll position. |
| `className`      | `string`                                               | `undefined` | Layout override; sticky positioning is the consumer's grid column concern.                                                                     |

`depth=2` items indent by `--space-4` (16px) and render at `--fs-micro` to signal sub-section hierarchy. Maximum supported depth: 2.

## 5. Interaction

- **Scroll tracking**: an internal `useIntersectionObserver` hook watches all `[id]` targets listed in `items`. The topmost intersecting entry wins — its `id` becomes the active item. On unmount, all observers are disconnected.
- **Click**: clicking an item scrolls the viewport to `#id` via native anchor behavior (`<a href="#id">`). No JS needed for navigation.
- **Keyboard**: Tab moves focus through each anchor; Enter/Space activates the focused anchor (native behavior). Focus ring: `2px solid var(--accent)`, `outline-offset: 4px`, `border-radius: var(--radius-1)`.
- **Hover**: inactive item color transitions from `--fg-muted` to `--fg` over `--dur-fast` / `--easing`.
- **Active**: active anchor color switches to `--accent`; a `2px solid var(--accent)` left-border appears. Transition: color over `--dur-fast`.
- **No active item**: when scroll position is above all headings (top of article), no item is highlighted.

## 6. A11y

- Root is `<nav aria-label="Table of contents">` — named navigation landmark, distinct from `<nav aria-label="Primary">`.
- Items are `<a href="#id">` inside `<ul>` / `<li>`. No role overrides needed — native list + anchor semantics are correct.
- The currently active anchor receives `aria-current="true"` toggled by the observer callback; screen readers announce it as selected/current.
- Heading (if present) is a `<p>` not a heading element — it does not create an extra heading level in the document outline.
- Contrast: `--accent` (#0071e3) on `--bg` (#FBFBFD) = 4.64:1 — AA normal at 14px. `--fg-muted` on `--bg` = 4.91:1 — AA normal. All pass WCAG 2.1 AA.
- axe rules in play: `landmark-unique`, `link-name`, `color-contrast`.

## 7. Motion

- Active item color: `transition: color var(--dur-fast) var(--easing)` (180ms expo-out).
- Active left-border: `transition: opacity var(--dur-fast) var(--easing)` — border is always present at `opacity: 0`; transitions to `opacity: 1` on activation. Avoids layout shift from border appearing.
- `prefers-reduced-motion: reduce`: the global token block in `tokens.css` clamps all transition durations to `0.01ms` — active state switches are instant with no visible flash.

## 8. Anti-patterns

- **Not a page-level nav**: do not use as a site navigation or header nav. Use `<Header>` / `<Sidebar>` for those.
- **Not a tab or segmented control**: items are anchor links, not tab panels. They do not show/hide content — they scroll to it.
- **Not for short pages**: fewer than 3 headings does not justify the chrome. Omit on short content.
- **Not a substitute for heading hierarchy**: TOC renders what headings exist — it does not create structure. The document's heading order must be correct first.
- **Not for cross-page navigation**: all `id` values must resolve to anchors on the current page. Cross-page links belong in `LinkList` or `Sidebar`.

## 9. Depends on

- `LinkList` — provides the `<ul>` / `<li>` / `<a>` structure and the `.muted-link` color treatment.

## Open questions

- **`--toc-offset` token**: sticky top offset currently falls back to `var(--space-8)` (2rem / 32px). A named token `--toc-offset` would let shell-level CSS set the value once and have all TOC instances respond. No such token exists in `tokens.css`. If `Header` / `DocsLayout` ship with a fixed header height token, that value should be used here — track as a follow-up when those organisms are specced.
- **Sub-item max depth**: spec allows `depth: 1 | 2`. If a consumer surface (e.g. docs) has H4-level TOC entries, depth-3 is needed. Defer until a real surface asks.
