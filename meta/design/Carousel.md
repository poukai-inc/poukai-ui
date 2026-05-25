# Carousel

**Status**: Approved

## 1. Intent

`<Carousel>` is the system's scroll-snap slide container — a compound molecule for sequencing a set of discrete content panels (slides) in a horizontally scrollable track with prev/next navigation and dot indicators. It serves editorial surfaces that need to present multiple items in constrained horizontal space: testimonial sequences, feature highlight rows, image galleries, and step-by-step process flows. It does not replace a grid or a tab list; it is for ordered, sequential content where one slide is in focus at a time.

## 2. Anatomy

```
┌──────────────────────────────────────┐
│  [←]  [ Slide content …………………… ]  [→]  │
│         ●  ○  ○  ○                   │
└──────────────────────────────────────┘
```

- **`Carousel.Root`** — `<section>` (or polymorphic `as`); the scroll context and compound provider. Holds scroll-snap container state.
- **`Carousel.Track`** — `<ul>` with `scroll-snap-type: x mandatory`; the scrollable viewport that clips slides.
- **`Carousel.Slide`** — `<li>` with `scroll-snap-align: start`; one discrete panel. Accepts any `ReactNode` as children. Width is 100% of the track by default.
- **`Carousel.Prev`** / **`Carousel.Next`** — `<IconButton>` instances. Decrement/increment the active slide index; scroll the track to the target slide via `scrollTo`. Visually overlaid or flanking the track; exact placement is consumer-overridable via `className`.
- **`Carousel.Indicators`** — `<div role="tablist">`; a row of dot buttons, one per slide. Each dot: `<button role="tab">` with `aria-label="Slide N of M"` and `aria-selected` mirroring the active index.

## 3. Tokens

- `--bg` — track background (transparent by default; parent surface shows through)
- `--surface` — individual slide background when no custom surface is passed
- `--fg` — slide content primary text
- `--fg-muted` — indicator dot inactive fill
- `--accent` — indicator dot active fill; focus ring on Prev/Next
- `--hairline` — inactive indicator dot border when using outlined style
- `--space-2` — gap between indicator dots
- `--space-4` — padding between slide content and slide edges (inline)
- `--space-8` — vertical padding inside slide; gap between track and indicators row
- `--radius-3` — slide border-radius (8px)
- `--dur-mid` — scroll-behavior transition (240ms) when JS-driven scroll is used
- `--easing` — timing function for any JS-driven scroll animation
- `--dur-stagger-step` — delay increment if autoplay timer reset uses stagger logic

## 4. Variants / Props

| Prop            | Type          | Default     | Rationale                                                          |
| --------------- | ------------- | ----------- | ------------------------------------------------------------------ |
| `autoplay`      | `boolean`     | `false`     | Off by default; motion must be opt-in per reduced-motion principle |
| `loop`          | `boolean`     | `false`     | Linear navigation is the safe default; loop risks disorientation   |
| `slidesVisible` | `number`      | `1`         | Full-width single slide is the common case                         |
| `gap`           | keyof spacing | `--space-4` | Inter-slide gap inside the track                                   |
| `indicators`    | `boolean`     | `true`      | Dots shown by default; can suppress for minimal presentations      |
| `className`     | `string`      | —           | Root override for layout positioning of controls                   |

`autoplay` must pause on `:hover`, `:focus-within`, and under `prefers-reduced-motion: reduce` (via `animation-play-state: paused` or timer clearance). The interval is fixed at 4 000 ms — no token exists for `--dur-carousel-interval`; see Open questions.

## 5. Interaction

**Keyboard navigation**

- `Carousel.Prev` / `Carousel.Next`: standard button focus (`Tab`), activated by `Enter` / `Space`.
- `Carousel.Indicators` (`role="tablist"`): arrow-key navigation within the tablist (`ArrowLeft` / `ArrowRight`); `Tab` exits the tablist.
- Each indicator dot (`role="tab"`) activates its slide on `Enter` / `Space` and via pointer click.
- When the active slide changes (any mechanism), focus does not move automatically — the slide content is not a focus target unless it contains interactive elements.

**Pointer / touch**

- CSS `scroll-snap` handles swipe natively; no JS drag logic needed.
- `overscroll-behavior-x: contain` on the track prevents page scroll bleed-through on touch.

**Loop boundary**

When `loop={false}` (default): Prev is `disabled` on the first slide; Next is `disabled` on the last slide. `disabled` `<IconButton>` instances receive `aria-disabled="true"` and `pointer-events: none`.

**Autoplay**

- Timer starts on mount, clears on unmount.
- Pauses on `:hover` / `:focus-within` via JS event listeners (CSS `animation-play-state` is not sufficient alone for a JS interval).
- Always cleared under `prefers-reduced-motion: reduce` — check `window.matchMedia("(prefers-reduced-motion: reduce)")` on mount; do not start the timer if the media query matches.

## 6. A11y

- **`Carousel.Root`**: `<section aria-roledescription="carousel" aria-label="…">`; consumers must pass a label via `aria-label` or `aria-labelledby`.
- **`Carousel.Track`**: `<ul>` (list of slides); no extra ARIA needed.
- **`Carousel.Slide`**: `<li aria-roledescription="slide" aria-label="Slide N of M">`.
- **`Carousel.Indicators`**: `role="tablist"` with `aria-label="Slide indicators"`. Each dot: `role="tab"`, `aria-selected`, `aria-label="Slide N of M"`, `aria-controls` pointing to the corresponding slide `id`.
- **Live region**: a `<div aria-live="polite" aria-atomic="true">` visually hidden inside Root announces the current slide (`"Slide N of M"`) on change — covers users who do not navigate by tab panel.
- **Contrast**: `--accent` (#0071e3) on `--bg` (#fbfbfd) = 4.56:1 (AA). Inactive dots use `--fg-muted` (#6e6e73) on `--bg` = 4.91:1 (AA). Both clear the 3:1 non-text threshold for UI components.
- **axe rules in play**: `aria-required-children`, `aria-allowed-role`, `scrollable-region-focusable` (track must be focusable when overflow is present: `tabindex="0"` on the track, or ensure keyboard scroll is possible via the indicator/button controls).

## 7. Motion

- **Slide transition**: `scroll-behavior: smooth` on the track under `prefers-reduced-motion: no-preference`. Under `prefers-reduced-motion: reduce`, `scroll-behavior: auto` — instant snap, no animation.
- **Autoplay**: when `autoplay={true}` and `prefers-reduced-motion: reduce` matches, the autoplay timer must not start (JS guard on mount, not CSS alone).
- **Tokens consumed**: `--dur-mid` (240ms) for any JS-driven `scrollTo` duration fallback; `--easing` as the timing function.
- No keyframe animations are authored by Carousel itself. Slide content animations are owned by children.

## 8. Anti-patterns

- **Not a tab list for switching views.** Tabs show/hide panels without spatial movement. Carousel slides have a spatial relationship (left → right). Use `<Tabs>` when content panels are conceptually parallel, not sequential.
- **Not a video or audio player.** Carousel advances discrete slides. Media controls (play/pause/seek) belong to `AudioPlayer` or `VideoEmbed`.
- **Not a data carousel for dynamic feeds.** Carousel manages a fixed, author-defined slide set. Infinite scroll, paginated API results, and live feeds are data patterns outside this component's scope.
- **Not a full-page scroll hijacker.** Carousel operates within a bounded track. It must never intercept page-level scroll behavior — `overscroll-behavior-x: contain` is the boundary.
- **Not a replacement for a grid.** When all items should be visible simultaneously, use a grid layout. Carousel is for one-at-a-time sequential viewing.

## 9. Depends on

- `IconButton` — for `Carousel.Prev` and `Carousel.Next` controls.
- `Icon` — chevron icons passed into `IconButton` slots (consumer-supplied from `lucide-react`).
- `VisuallyHidden` — for the `aria-live` announcement region and any screen-reader-only labels.

## Open questions

1. **`--dur-carousel-interval` token.** The proposal names this token (4 000 ms autoplay interval) but it does not exist in `tokens.css`. If autoplay ships, this token must be added to `tokens.css` with a `meta/brand.md` decision-log entry before implementation. Phase 1 spec records the gap; token addition is a separate PR requiring Arian's sign-off.
2. **`embla-carousel-react` threshold.** The proposal permits reaching for `embla-carousel-react` if native scroll-snap proves insufficient (e.g., partial-slide `slidesVisible > 1` with gap, loop momentum, or touch inertia edge cases). Decision deferred to implementation. If `embla` is adopted, it must be listed as a peer dependency, and this spec updated with the exact package name and version range.
