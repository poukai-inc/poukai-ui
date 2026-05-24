# BlogList

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`BlogList` is the blog index organism. It renders a vertical sequence of `BlogPostCard` previews and a `Pagination` control below them. It serves blog index, category, and tag pages — any surface that presents a paginated list of post previews. Its job is to own the list container's spacing rhythm and the gap between the card list and pagination; it does not own card layout or pagination logic, which belong to their respective primitives.

## 2. Anatomy

```
<section aria-label="Blog posts">          ← root, semantic landmark
  <ul>                                     ← card list, no list decoration
    <li>                                   ← one per post
      <BlogPostCard … />
    </li>
    …
  </ul>
  <footer>                                 ← pagination row
    <Pagination … />
  </footer>
</section>
```

- **Root**: `<section>` with an `aria-label` (default `"Blog posts"`, overridable via `aria-label` prop). Becomes the region landmark for the post list.
- **Card list**: semantic `<ul>` with `list-style: none`. Each `BlogPostCard` lives in its own `<li>`.
- **Pagination row**: an optional `<footer>` wrapper below the list. Only rendered when the `pagination` slot is populated. Using `<footer>` here is correct — it is the contentually terminal element of the `<section>` region and is not nested inside SiteShell's page-level `<footer>` landmark.

## 3. Tokens

- `--space-4` — gap between individual card `<li>` items
- `--space-12` — gap between the card list and the pagination row
- `--hairline` — optional `border-top` on the pagination row to visually separate it from the cards
- `--hairline-w` — 1px rule weight for the pagination separator
- `--space-16` — block padding top + bottom on the root `<section>` (default size)
- `--space-12` — block padding top + bottom when `size="tight"`
- `--fg` — inherits to card content via cascade
- `--fg-muted` — inherits to card secondary content via cascade

## 4. Variants / Props

| Prop         | Type                   | Default        | Rationale                                                                             |
| ------------ | ---------------------- | -------------- | ------------------------------------------------------------------------------------- |
| `posts`      | `BlogPostCardProps[]`  | required       | Data for each card; BlogList maps them to `<li><BlogPostCard /></li>`                 |
| `pagination` | `ReactNode`            | `undefined`    | Slot for a `<Pagination>` instance; omit on single-page lists                         |
| `size`       | `"default" \| "tight"` | `"default"`    | Mirrors Section's size axis: `--space-16` block padding vs `--space-12`               |
| `aria-label` | `string`               | `"Blog posts"` | Names the region landmark; override for category pages (e.g. `"Posts tagged design"`) |

No `columns` prop in this spec — BlogList is a single-column vertical list. Grid layout belongs to a future `BlogGrid` organism if the need arises.

## 5. Interaction

- No interactive states on the list container itself; all interaction lives inside `BlogPostCard` and `Pagination`.
- Keyboard tab order: natural DOM order — first card → … → last card → pagination controls.
- No scroll-triggered behavior owned by this component.

## 6. A11y

- Root `<section>` with `aria-label` becomes a named region landmark. Screen readers can jump directly to "Blog posts" via landmark navigation.
- `<ul>` / `<li>` semantics give screen readers correct list count announcement ("list, N items").
- `list-style: none` on a `<ul>` removes list semantics in Safari/VoiceOver; mitigate by applying `role="list"` on the `<ul>` explicitly.
- Pagination slot is consumer-owned; `Pagination` spec owns its own ARIA (`aria-label` on nav, `aria-current` on active page).
- No empty list rendered without a fallback — consumers should gate BlogList on `posts.length > 0` and render an `EmptyState` when the array is empty. BlogList does not internally render an empty state.
- axe rules in play: `region` (named landmark), `list` (list/listitem pairing).

## 7. Motion

None. BlogList is a static structural organism. No entrance animations are owned here — if a consumer wants staggered card reveals, that belongs to a page-composition layer or to `BlogPostCard` itself.

`prefers-reduced-motion`: no per-component override needed; the global `animation-duration: 0.01ms` block in `tokens.css` handles any descendant animations.

## 8. Anti-patterns

- **Not for non-blog content.** Use `FeatureGrid`, `RoleGrid`, or a generic card grid for non-editorial content lists.
- **Not a grid layout.** BlogList is strictly vertical. Do not extend it with a `columns` prop — that is a different organism.
- **Not an infinite-scroll container.** Scroll-based pagination and virtual list rendering are out of scope; BlogList is page-based.
- **Not responsible for empty states.** Do not render BlogList with zero posts; use `EmptyState` for the zero-data case.
- **Not a search results surface.** Search results carry different semantics (`role="status"`, result counts, highlight markup) and warrant their own organism.

## 9. Depends on

- `BlogPostCard` — the card primitive this list composes
- `Pagination` — passed as the `pagination` slot; not imported by BlogList directly

## Open questions

- `BlogPostCard` does not yet have an approved spec. BlogList depends on it; both should be specced and approved together before implementation begins.
- The `posts` prop shape (`BlogPostCardProps[]`) is defined by the `BlogPostCard` spec. If `BlogPostCard` opts for a render-prop or compound API instead of a flat props object, the `posts` prop on BlogList may need to become a `ReactNode` children slot instead. Resolve when `BlogPostCard` spec is approved.
