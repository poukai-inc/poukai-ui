# NavLink

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`NavLink` is the top-nav anchor primitive — a styled link that carries an `active` / `current` state to signal the visitor's current location within the site's primary navigation. It is consumed exclusively by Header / TopNav organisms and renders `aria-current="page"` when active. It is distinct from the base `Link` atom in that it owns the nav-context interaction register: restrained `--fg-muted` at rest, full `--fg` on active, and a discrete underline accent on hover.

## 2. Anatomy

```
<a href="…" aria-current="page"? class="navlink [navlink--active]">
  {children}          ← label text
</a>
```

- **Root**: semantic `<a>` wrapping consumer-supplied label text.
- **Label**: `children` — plain string in virtually all uses.
- **Active indicator**: a 2px bottom border in `--accent` rendered when `active` is true; suppressed when false. Not a pseudo-element background-trick — it uses `border-bottom` so it participates in the line-box and does not shift adjacent items.
- No icon slot; no badge slot. NavLink is a single-purpose nav label.

## 3. Tokens

- `--font-sans` — label font family
- `--fs-meta` — label font size (14px); nav labels are subordinate to page content
- `--fg` — label color at rest and when active
- `--fg-muted` — label color at rest (default; shifts to `--fg` on hover/active)
- `--accent` — active indicator border color; focus ring color
- `--hairline` — resting underline layer (background-gradient underline, consistent with global `<a>` rule)
- `--hairline-w` — 1px border width for active indicator
- `--dur-fast` — hover color transition duration (180ms)
- `--dur-mid` — underline grow transition duration (240ms); matches global link easing
- `--easing` — transition easing for color shift
- `--easing-link` — transition easing for underline grow
- `--radius-1` — focus ring border-radius (2px)
- `--space-2` — horizontal padding between adjacent NavLink siblings (owned by parent, not self)
- `--space-3` — vertical padding (block axis) — sufficient tap area at nav density

## 4. Variants / Props

| Prop       | Type        | Default  | Rationale                                                                                                                         |
| ---------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `href`     | `string`    | required | The destination URL. Passed through to `<a>`.                                                                                     |
| `active`   | `boolean`   | `false`  | Drives `aria-current="page"` and the active indicator. Consumer computes from routing context (e.g. `pathname.startsWith(href)`). |
| `children` | `ReactNode` | required | The visible label. Short plain string is idiomatic.                                                                               |

No `size` prop. Nav labels are fixed at `--fs-meta` (14px) — the single correct register for top-nav chrome. No `tone` prop; NavLink has one visual register. No `external` prop; icon treatment for external links is the consumer's responsibility.

## 5. Interaction

- **Rest**: label in `--fg-muted`; hairline underline at 0% width (invisible but ready).
- **Hover** (`@media (hover: hover)`): label shifts to `--fg` over `--dur-fast`; accent underline grows 0%→100% over `--dur-mid` via `background-size` transition — identical mechanic to the global `<a>` rule in `tokens.css`.
- **Active (`active=true`)**: label in `--fg`; 2px `border-bottom` in `--accent` always visible; no further hover change needed (underline is static in this state).
- **`:focus-visible`**: 2px solid `--accent` outline, 4px offset, `--radius-1` radius. Matches the global link focus treatment in `tokens.css`.
- **Keyboard**: standard anchor behavior — `Tab` to focus, `Enter` to navigate. No custom key handling.
- **Active + hover**: active state wins; underline stays as `border-bottom`, accent grow is suppressed to avoid double-underline.

## 6. A11y

- Semantic element: `<a href="…">`. Not a `<button>`. Navigation must use real anchors for correct AT behavior and CMD+click / middle-click support.
- `aria-current="page"` is set when `active` is true; omitted (not `"false"`) when inactive, per ARIA spec convention.
- Parent nav organism wraps the NavLink set in `<nav aria-label="Primary">` — NavLink itself does not own the landmark.
- Contrast (rest): `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.91:1 — AA normal at 14px.
- Contrast (active): `--fg` (#1D1D1F) on `--bg` (#FBFBFD) = 15.46:1 — AAA.
- Active indicator: `--accent` (#0071E3) border — non-text UI indicator; ≥3:1 required. `--accent` on `--bg` ≈ 4.54:1 — passes AA non-text.
- Focus ring: `--accent` outline — same contrast as active indicator. Passes AA non-text.
- No `aria-label` needed; label text is the accessible name.

## 7. Motion

- **Underline grow**: `background-size` transition, `--dur-mid` (240ms), `--easing-link`. Matches global `<a>` rule.
- **Color shift** (rest → hover): `color` transition, `--dur-fast` (180ms), `--easing`.
- **`prefers-reduced-motion: reduce`**: global clamp in `tokens.css` sets all `transition-duration` to 0.01ms — both transitions collapse to instant. No NavLink-specific override needed.

## 8. Anti-patterns

- **Not for sidebar or docs navigation.** NavLink is a top-nav chrome primitive. Vertical doc-sidebar links use `LinkList.Item`, which has its own left-rail active indicator.
- **Not for footer links.** Footer anchors use the `.muted-link` global class or a bare `<a>` — they are not navigational landmarks.
- **Not for primary CTAs.** NavLink carries no button weight. "Sign in" or "Get started" in the header actions slot are `<Button>` instances, not NavLinks.
- **Not for breadcrumb trails.** Breadcrumb has its own `aria-current` convention and separator rhythm — a distinct molecule.
- **Not for in-page anchors (`#section`).** Scroll-to-section links are body-copy links, not primary nav items.
- **Do not compute `active` inside NavLink.** The component accepts `active` as a prop; routing context (Next.js `usePathname`, React Router `useMatch`, etc.) is the consumer's responsibility.

## 9. Depends on

- `Link` atom — NavLink extends the base link's underline mechanic and focus treatment. The engineer may compose directly from `<a>` with tokens, or forward through the `Link` atom if `Link` exposes an unstyled base. The relationship is semantic extension, not visual override.

## Open questions

- **Active indicator shape.** The spec describes a `border-bottom` (2px line). An alternative is a small centered dot below the label (dot-nav pattern). The line is consistent with the global underline system and costs no new tokens. Confirm preferred indicator shape before implementation.
- **`active` vs. routing-library integration.** Some consumers may want NavLink to auto-detect `active` from a router context (e.g. a `NavLink` wrapper for Next.js that reads `usePathname`). Phase 1 spec is prop-driven only; auto-detection would be a consumer-layer wrapper, not a DS primitive. Confirm whether a router-aware variant is in scope.
