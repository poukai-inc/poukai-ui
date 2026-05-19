# Design spec: Dialog

**Atomic layer**: organism
**Status**: Draft
**Author**: poukai-design
**Last updated**: 2026-05-19

---

## 1. Purpose

`Dialog` is the canonical modal overlay primitive for the pouk.ai design system. It blocks interaction with the page behind it, traps keyboard focus, and dismisses on Escape or explicit close action. Wrapping `@radix-ui/react-dialog` (already in `dependencies`) means all accessibility plumbing — focus trap, ARIA roles, keyboard handling — is delegated to a battle-tested library. The DS adds brand styling only.

**Primary use cases**: confirmation prompts, settings panes, lightweight forms (waitlist signup), info overlays.

**Non-goals — these are explicit exclusions from this spec:**

- **Not a toast.** Toasts auto-dismiss and are non-blocking. Dialog does not.
- **Not a popover.** Popovers are non-blocking and do not trap focus. Dialog always blocks (`modal: true`). A future `Popover` primitive will wrap `@radix-ui/react-popover`.
- **Not a fullscreen lightbox.** A lightbox (image zoom, video player occupying the full viewport) is a distinct visual register and a future component.
- **Not a drawer / sheet.** A slide-in panel anchored to a viewport edge is a different motion pattern. File a separate proposal if needed.
- **Not a notification or alert dialog.** `alertdialog` role (for destructive or irreversible actions requiring forced acknowledgment) may be a future variant. The initial spec targets `dialog` role only.

---

## 2. Anatomy

### API shape decision: compound pattern + one convenience wrapper

Two approaches were evaluated:

**Option A — Flat wrapper only.**
`<Dialog title="…" onOpenChange={…}>{body}</Dialog>`. Simple consumer API. Loses composability: there is no clean way to slot a custom trigger, add a footer with two CTA buttons, or control which element receives initial focus. The flat API inevitably grows props (`footerContent`, `initialFocusRef`, `closeLabel`, …) to compensate.

**Option B — Radix compound pattern re-exported as DS subcomponents + one convenience wrapper** (chosen).

Re-export each Radix part under the `Dialog` namespace with DS styling applied. Add a single `DialogBasic` wrapper for the 90% case. This matches how the Radix primitive was designed, aligns with DS convention (SiteShell, Footer both expose typed sub-slots rather than a monolithic component), and keeps the surface area honest — we do not re-invent what Radix already provides correctly.

**Decision: compound subcomponents + `DialogBasic` convenience wrapper.**

Justification against repo convention: `SiteShell.tsx` and `Footer.tsx` both use `forwardRef` + `ComponentPropsWithoutRef` and expose composable slots (nav routes, footer links) rather than flat monoliths. The compound pattern is the natural extension of that convention to a component whose parts genuinely need independent composition (trigger, overlay, content, title, description, close button).

### Named anatomy parts

- **`Dialog.Root`** — State controller. Thin re-export of `Radix.Root`. Accepts `open`, `onOpenChange`, `defaultOpen`, `modal` (always true in our system — see §8).
- **`Dialog.Trigger`** — The element that opens the dialog. Thin re-export of `Radix.Trigger`. Typically a `<Button>` passed via `asChild`.
- **`Dialog.Portal`** — Renders overlay + content outside the DOM tree (into `document.body`). Thin re-export of `Radix.Portal`. The DS does not expose `container` as a commonly-set prop but passes it through.
- **`Dialog.Overlay`** — The backdrop scrim. Styled by the DS (background, opacity, animation). `forceMount` passed through for consumers who need CSS-only exit animations.
- **`Dialog.Content`** — The modal panel. The primary styled surface. `forceMount` and focus callbacks passed through.
- **`Dialog.Title`** — The dialog's accessible title. Required. Radix throws a console warning if absent.
- **`Dialog.Description`** — Optional accessible description. Rendered in the muted register below the title.
- **`Dialog.Close`** — A button that closes the dialog. Thin re-export of `Radix.Close`. Consumers use `asChild` to render it as a `<Button>` or an icon button.

**`DialogBasic`** — Convenience wrapper composing all the above. Covers the 90% case: a single-panel dialog with a title, optional description, body content, and a built-in close button (X) in the top-right. Uses controlled or uncontrolled state through `Dialog.Root`.

---

## 3. Tokens used

No new tokens are required (see §6 for the two candidates evaluated and rejected or minimally approved).

| Token           | Value                               | Role                                                                       |
| --------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| `--bg-elevated` | `#ffffff`                           | Content panel background — the front-most layer token, correct for dialogs |
| `--bg`          | `#fbfbfd`                           | NOT used for content background — that is `--bg-elevated`                  |
| `--fg`          | `#1d1d1f`                           | Title and body text                                                        |
| `--fg-muted`    | `#6e6e73`                           | Description text                                                           |
| `--hairline`    | `#d2d2d7`                           | 1px bottom border under the title band (optional, see §4)                  |
| `--hairline-w`  | `1px`                               | Hairline stroke weight                                                     |
| `--accent`      | `#0071e3`                           | Focus ring on the close button and any interactive elements                |
| `--radius-3`    | `8px`                               | Content panel corner radius (see rationale below)                          |
| `--space-6`     | `1.5rem` (24px)                     | Content panel horizontal padding                                           |
| `--space-5`     | —                                   | Not in scale — use `--space-4` (16px) for title→description gap            |
| `--space-4`     | `1rem` (16px)                       | Gap: title → description; gap: description → body                          |
| `--space-6`     | `1.5rem` (24px)                     | Panel padding (all sides); gap: body → footer action row                   |
| `--space-8`     | `2rem` (32px)                       | Top padding of content panel (slightly more generous above title)          |
| `--font-sans`   | Geist stack                         | All text in the dialog                                                     |
| `--fs-body`     | `clamp(1.0625rem, 1rem + 0.3vw, …)` | Body content text                                                          |
| `--fs-meta`     | `0.875rem` (14px)                   | Description text                                                           |
| `--dur-fast`    | `180ms`                             | Open/close transition duration                                             |
| `--easing`      | `cubic-bezier(0.16, 1, 0.3, 1)`     | Entrance easing (expo-out) for open; reverse for close                     |
| `--radius-1`    | `2px`                               | Focus ring border-radius                                                   |

**Title typography.** The dialog title sits at `--fs-card-title` range (`clamp(1.5rem, 1.15rem + 1.2vw, 2rem)`, 24–32px) for informational dialogs, and at a fixed `1.125rem` / `font-weight: 500` for compact utility dialogs (confirmation prompts, forms). `DialogBasic` defaults to the compact size — it is rarely a display moment. Consumers using raw `Dialog.Title` choose the size via `className`.

**Radius decision: `--radius-3` (8px), not `--radius-2` (4px).**
`--radius-2` (4px) is the DS default for interactive controls (buttons, badges, code blocks). `--radius-3` (8px) is appropriate for a surface that floats above the page — it reads as a sheet, not a button. Apple system dialogs use 13–14px radius; Linear dialogs use 8px; Stripe uses 8px. 8px is the correct register for the brand (restrained, not aggressive). `--radius-3` exists in the token vocabulary and maps directly.

---

## 4. Layout & rhythm

### Overlay

```
[Dialog.Overlay]
  position: fixed; inset: 0
  background: rgb(0 0 0 / 0.4)   ← inline value, no new token (see §6)
  z-index: 100                    ← below content; consumer stacking context controls if needed
```

The 40% black scrim is the standard restraint value — present enough to signal modal context, light enough to maintain the Apple-light palette register. It does not carry the DS token philosophy (tokens are for things that change across themes/surfaces); a scrim at 0.4 opacity is the same in light and dark mode.

### Content panel

```
[Dialog.Content]
  position: fixed
  top: 50%; left: 50%
  transform: translate(-50%, -50%)
  width: min(28rem, calc(100vw - var(--page-pad) * 2))
  max-height: min(85vh, 640px)
  overflow-y: auto
  background: var(--bg-elevated)
  border: var(--hairline-w) solid var(--hairline)
  border-radius: var(--radius-3)
  padding: var(--space-8) var(--space-6) var(--space-6)
  z-index: 101
  outline: none   ← Radix sets focus on Content; suppress the default outline (focus ring not needed on the panel container)
```

**Max-width rationale: 28rem (448px).**
The hero prose column caps at `--hero-max` (38rem / 608px). A dialog at 28rem fits comfortably inside that column reference — it is a dialog, not a page section. Most Apple system dialogs and Linear utility modals land in the 400–500px range. 28rem reads contained without feeling cramped. For forms that genuinely need more width (rare), consumers override via `className`.

**Max-height and scroll.** At `min(85vh, 640px)`, tall body content (e.g. a long form or a terms-of-service block) scrolls inside the panel. The title band stays visible at the top; the panel does not grow taller than the viewport. The engineer may add `overscroll-behavior: contain` to prevent body scroll chaining on mobile.

**Hairline border, no drop shadow.** The brand register is Apple-light: hairline rules do the separation work, not shadows. A `box-shadow` token does not exist in the DS vocabulary (`meta/brand.md` — no `--shadow-*` tokens). The `--bg-elevated` (#ffffff) panel on a `--bg` (#fbfbfd) page already reads as elevated because the background values differ. The hairline border (`--hairline` at `--hairline-w`) adds a clean edge to the panel that is sufficient to define the boundary without a shadow. This is the correct restraint choice.

### `DialogBasic` internal structure

```
[Dialog.Content — panel]
  ├── [header — flex row, align-items: flex-start, justify-content: space-between]
  │     ├── [Dialog.Title]          font-size: 1.125rem; font-weight: 500; color: var(--fg)
  │     └── [Dialog.Close / X button — icon-only, 24×24, aria-label="Close"]
  ├── [Dialog.Description — optional]
  │     font-size: var(--fs-meta); color: var(--fg-muted); margin-top: var(--space-2)
  ├── [hairline rule — border-top: var(--hairline-w) solid var(--hairline)]
  │     margin-top: var(--space-4)
  ├── [body slot — children]
  │     padding-top: var(--space-4); font-size: var(--fs-body)
  └── [footer slot — optional action row]
        margin-top: var(--space-6); display: flex; justify-content: flex-end; gap: var(--space-3)
```

The hairline rule between the title band and body is present when `description` is provided; it is suppressed when `description` is absent (title flows directly into body content). The engineer reads the `description` prop to set a `data-has-description` attribute and controls the rule's visibility via a CSS selector.

---

## 5. States & motion

### Open animation

Radix exposes `[data-state="open"]` and `[data-state="closed"]` on both `Overlay` and `Content`. The DS uses CSS animations scoped to these selectors in `Dialog.module.css`.

**Overlay:**

```
[data-state="open"]  → fade in: opacity 0 → 1, duration: --dur-fast (180ms), easing: ease
[data-state="closed"] → fade out: opacity 1 → 0, duration: --dur-fast (180ms), easing: ease
```

**Content panel:**

```
[data-state="open"]  → fade + scale: opacity 0 → 1, scale(0.96) → scale(1)
                        duration: --dur-fast (180ms), easing: --easing (expo-out)
[data-state="closed"] → fade out: opacity 1 → 0, scale(1) → scale(0.96)
                        duration: --dur-fast (180ms), easing: ease
```

Scale(0.96) → scale(1) on open reads as a gentle materialization — the panel appears to settle into place from slightly smaller. This is the same pattern Apple uses for sheet presentation and Linear uses for modal entrance. The scale is subtle (4%), not dramatic.

**Why `--dur-fast` (180ms) and not `--dur-mid` (240ms).** Dialogs respond to direct user intent (a click). The animation should feel immediate, not theatrical. 180ms is fast enough to feel snappy; long enough for the eye to register the transition. `--dur-mid` (240ms) is appropriate for state changes that are not direct responses to a click (e.g. hover color transitions that dwell). Direct-intent transitions belong at `--dur-fast`.

### Reduced motion

The global block in `tokens.css` handles reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

No per-component override needed. Dialog CSS animations are caught by this rule. The dialog appears and disappears instantly for users who prefer reduced motion.

### Focus states

The close button (X) receives the global focus ring: `outline: 2px solid var(--accent)`, `outline-offset: 4px`, `border-radius: var(--radius-1)`. Any `<Button>` or `<a>` inside the body inherits the same. No custom override needed inside `Dialog.module.css`.

### Dismissal: ESC key

Radix handles ESC to close natively. The `onEscapeKeyDown` callback on `Dialog.Content` is passed through for consumers who need to intercept (e.g. a dirty-form guard that shows a confirmation before dismissing). The DS does not intercept ESC.

### Dismissal: click outside

Radix fires `onPointerDownOutside` on `Dialog.Content`. Default behavior is to close the dialog. Passed through for consumers who need to prevent this (e.g. a form dialog that warns on unsaved changes).

---

## 6. New tokens

Two candidates were evaluated. Neither is adopted as a new token.

**`--scrim` (overlay background color) — not introduced.**
The scrim color `rgb(0 0 0 / 0.4)` is an inline value in `Dialog.module.css`. Tokens are for values that vary across surfaces, themes, or component states. A scrim at 40% black opacity is not a brand expression that varies — it is a universal convention for modal overlays. It would be the only token in the DS defined as a partially-transparent color and it has no plausible reuse outside Dialog. Creating a token here would be cosmetic tokenization, not semantic tokenization. Value stays inline.

**`--shadow-dialog` (drop shadow on the content panel) — not introduced.**
The DS uses hairline borders for surface separation, not shadows. There is no `--shadow-*` token family in the vocabulary and introducing the first one here for a component that does not need it (the `--bg-elevated` background + `--hairline` border already read as elevated) would be a brand-level deviation. If a shadow token family is introduced in the future, it warrants a full brand decision log entry and Arian's sign-off.

**Summary: zero new tokens.**

---

## 7. Responsive behavior

| Viewport | Content panel behavior                                                                                                                                                                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ≥ 768px  | Centered, `width: min(28rem, calc(100vw - var(--page-pad) * 2))`. Floating panel with clear page context.                                                                                                                                                                                                                                                     |
| < 768px  | `width: calc(100vw - var(--page-pad) * 2)`. Panel remains centered (translate(-50%, -50%)), horizontally inset by `--page-pad` on each side. Not full-bleed — the edge gap preserves the sense of the dialog floating above the page, which is the meaning of a modal. Full-bleed bottom-sheet is a different interaction pattern (future `Sheet` primitive). |

**Why not a bottom-sheet on mobile.** A centered dialog at mobile scale (e.g. 375px viewport) at `calc(100vw - var(--page-pad) * 2)` ≈ `calc(375px - 48px)` = `327px` wide — this is comfortable. The vertical centering (`top: 50%; transform: translateY(-50%)`) works correctly on mobile as long as `max-height: 85vh` is respected and the panel scrolls internally rather than extending off-screen. A bottom-sheet treatment was considered (slide up from bottom on mobile) but rejected for this initial spec: it doubles the motion logic, the animation differs by breakpoint, and the use cases (confirmation, short forms) do not demand bottom-sheet ergonomics. The sheet pattern is a future primitive.

**Safe-area inset on iOS.** The engineer should add `padding-bottom: env(safe-area-inset-bottom)` to `Dialog.Content` on mobile to avoid overlap with the home indicator. This is an implementation detail, not a token concern.

---

## 8. Accessibility

Radix Dialog implements the WAI-ARIA Dialog (Modal) pattern. The DS inherits all of this at zero cost:

- `role="dialog"` (or `role="alertdialog"` if `modal` and there is no non-destructive dismiss path — standard dialog role is correct for the initial spec)
- `aria-modal="true"` — informs screen readers that content outside is inert
- `aria-labelledby` — automatically wired to `Dialog.Title`'s id by Radix
- `aria-describedby` — automatically wired to `Dialog.Description`'s id by Radix (when present)
- Focus trap: Tab and Shift+Tab cycle only within the open dialog
- Return focus: Radix returns focus to the trigger element on close
- ESC: Radix closes on Escape natively

**`Dialog.Title` is required.** Radix emits a console warning if `Dialog.Content` renders without a `Dialog.Title` sibling. The DS enforces this at the spec level: every dialog must have a title. If a design calls for a visually untitled dialog (e.g. a media overlay), the engineer uses `Dialog.Title` with a `className` that visually hides the element while keeping it in the accessibility tree (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap`). The DS does not ship a `.sr-only` utility class; the engineer writes this inline on the title element.

**Close button accessible name.** `DialogBasic`'s built-in X button must have `aria-label="Close"`. The raw `Dialog.Close` part accepts `asChild` — if a consumer passes a `<Button>` as the close trigger, that button's `children` or `aria-label` is its accessible name; the DS does not add an extra layer.

**Contrast (all pairs verified against `meta/brand.md`):**

| Pair                                       | Ratio     | Verdict                             |
| ------------------------------------------ | --------- | ----------------------------------- |
| `--fg` (#1D1D1F) on `--bg-elevated` (#fff) | 19.32 : 1 | AAA                                 |
| `--fg-muted` (#6E6E73) on `--bg-elevated`  | 5.74 : 1  | AA normal ✓                         |
| `--accent` focus ring on `--bg-elevated`   | 5.08 : 1  | WCAG 1.4.11 non-text contrast 3:1 ✓ |

**`modal: true` is the only supported mode.** Radix allows `modal={false}` for non-blocking dialogs. The DS does not surface this. A non-blocking dialog is architecturally a popover (non-modal overlay). If a consumer needs `modal={false}`, they use the raw Radix primitive directly, not the DS wrapper.

**`inert` polyfill.** Radix uses the `inert` attribute to disable background content for assistive technology. The engineer should confirm the consuming application's browser target supports `inert` natively (all modern browsers do as of 2024). No polyfill is the DS's concern.

---

## 9. Prop intent

### Compound subcomponents

```tsx
// INTENT ONLY — engineer designs the actual API

// Dialog.Root — thin re-export of Radix.Root
// All Radix props passed through 1:1.
// The DS does not set any default props on Root except documenting
// that `modal` should always be true (default Radix behavior).
interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean; // always true in DS usage; do not set false — see §8
  children: ReactNode;
}

// Dialog.Trigger — thin re-export of Radix.Trigger
// `asChild` is the expected pattern: pass a <Button> as the trigger.
// Without asChild, Radix renders an unstyled <button> — the DS does not style it.
interface DialogTriggerProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}

// Dialog.Portal — thin re-export of Radix.Portal
// `container` is rarely needed; passed through for consumer escape hatch.
// `forceMount` is passed through for consumers who need CSS-only exit animations
// (e.g. Framer Motion).
interface DialogPortalProps {
  container?: HTMLElement;
  forceMount?: boolean;
  children: ReactNode;
}

// Dialog.Overlay — styled by the DS
// `forceMount` passed through; matches Portal's forceMount for animation control.
// `asChild` NOT recommended — the DS overlay CSS targets this element directly.
interface DialogOverlayProps extends ComponentPropsWithoutRef<"div"> {
  forceMount?: boolean;
}

// Dialog.Content — the modal panel. The primary styled surface.
// `asChild` NOT recommended. `forceMount` passed through.
// Focus callbacks passed through for consumer dirty-form guards:
//   onOpenAutoFocus — override which element receives focus on open
//   onCloseAutoFocus — override which element receives focus on close
//   onEscapeKeyDown — intercept ESC (call e.preventDefault() to suppress close)
//   onPointerDownOutside — intercept outside click (call e.preventDefault() to suppress close)
//   onInteractOutside — intercept any interaction outside (general case)
interface DialogContentProps extends ComponentPropsWithoutRef<"div"> {
  forceMount?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onInteractOutside?: (event: Event) => void;
}

// Dialog.Title — required for a11y. Styled at 1.125rem / weight 500 by default.
// `asChild` supported for consumers who want a custom heading element.
interface DialogTitleProps extends ComponentPropsWithoutRef<"h2"> {
  asChild?: boolean;
}

// Dialog.Description — optional. Styled at --fs-meta / --fg-muted.
// `asChild` supported.
interface DialogDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  asChild?: boolean;
}

// Dialog.Close — thin re-export of Radix.Close.
// Use asChild to render as a <Button> or icon button.
interface DialogCloseProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}
```

### `DialogBasic` convenience wrapper

```tsx
// INTENT ONLY — engineer designs the actual API

interface DialogBasicProps {
  /**
   * Controlled open state. Pair with onOpenChange.
   * Omit for uncontrolled behavior (pair with a Dialog.Trigger child or
   * use defaultOpen on the underlying Root via the open/onOpenChange props).
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /**
   * Dialog title. Required. Rendered as <Dialog.Title>.
   * Radix warns (and screen readers fail) if this is absent.
   */
  title: string;

  /**
   * Optional description. Rendered as <Dialog.Description> in the muted register.
   * When provided, a hairline rule separates the title band from body content.
   */
  description?: string;

  /**
   * Body content. Slotted directly below the title band.
   * Accepts any ReactNode — form fields, paragraphs, lists.
   */
  children: ReactNode;

  /**
   * Optional footer action row. Rendered below body, right-aligned.
   * Typically one or two <Button> elements (Cancel + Confirm pattern).
   * When omitted, no footer row is rendered.
   */
  footer?: ReactNode;

  /**
   * Accessible label for the built-in close button (X icon). Default "Close".
   * Override if the consumer's locale or context requires a different string.
   */
  closeLabel?: string;

  /**
   * className forwarded to Dialog.Content for layout overrides.
   * Standard escape hatch. Use sparingly.
   */
  className?: string;
}
```

**Close button: built-in, not slotted.** `DialogBasic` includes an X close button in the top-right of the title band. The engineer uses `Dialog.Close` with `asChild` wrapping a small icon-only `<button>` (not a DS `<Button>` — the close affordance is chrome, not a CTA). Rationale: every dialog in the DS should have a visible close affordance. Requiring consumers to slot it themselves means they might omit it. The `closeLabel` prop allows localization. Consumers who need a completely custom close experience use the compound API.

**`displayName`**: `DialogBasic.displayName = "DialogBasic"`. Each named subcomponent: `Dialog.Root.displayName = "Dialog.Root"`, etc. (The engineer sets `displayName` after assembling the namespace object.)

**`clsx`**: `Dialog.Content` and `DialogBasic` accept `className`; the engineer merges with `clsx(styles.content, className)`.

---

## 10. Composition rules

- **Dialog composes `<Button>` as trigger.** The canonical trigger is `<Dialog.Trigger asChild><Button>Open dialog</Button></Dialog.Trigger>`. The DS does not require any specific `Button` variant; the consumer chooses (primary, secondary, ghost).

- **`DialogBasic` accepts `<Button>` elements in `footer`.** The canonical footer is two `<Button>` elements — a ghost/secondary "Cancel" and a primary "Confirm". The DS does not prescribe which variants; it only right-aligns whatever is in the `footer` slot.

- **Dialog does not nest.** A dialog triggered from within a dialog is an interaction anti-pattern. The DS does not support nested stacking contexts or layered dialogs.

- **Dialog does not compose with `<SiteShell>` in any special way.** Radix renders into `document.body` via `Dialog.Portal` by default. `SiteShell` does not need to know about Dialog. No z-index coordination with `SiteShell` is needed (SiteShell is not positioned).

- **Dialog and `<Section>`.** A `Section` band may contain a trigger that opens a dialog. That is the expected pattern for waitlist signup, feature detail overlays, etc. Section does not need to know about Dialog.

- **`forceMount` and animation libraries.** Consumers using Framer Motion or CSS keyframe exit animations should set `forceMount` on both `Dialog.Portal` and `Dialog.Overlay` to keep elements mounted during exit transitions. This is a known Radix pattern and is explicitly supported by passing `forceMount` through.

---

## 11. Out of scope

- **`alertdialog` role.** For destructive/irreversible actions where the user must acknowledge (no non-destructive dismiss path), ARIA recommends `role="alertdialog"`. Radix does not automatically switch roles. If needed, the engineer sets `role="alertdialog"` on `Dialog.Content` via props. The DS does not provide a separate `AlertDialog` wrapper in this spec — that is a future primitive.

- **Drawer / sheet variant.** A panel that slides in from the left, right, or bottom edge of the viewport is a distinct interaction pattern (Sheet). Not in scope here.

- **Non-modal dialog.** `modal={false}` is explicitly excluded — see §8. Use the raw Radix primitive if truly needed.

- **Full-screen dialog.** A dialog that occupies the full viewport (e.g. mobile image lightbox) is outside the Dialog component's register. That is a future primitive.

- **Dark-mode per-component overrides.** `--bg-elevated`, `--fg`, `--fg-muted`, `--hairline`, `--accent` all flip cleanly via the global dark-mode token override in `tokens.css` when it ships. The panel will read as correctly elevated in dark mode because `--bg-elevated` will be defined as the brightest dark-surface value (brighter than `--bg`), consistent with the elevation model described in `meta/brand.md §6`.

- **Scrollable header / sticky title.** When dialog body is very long, pinning the title band and close button at the top while the body scrolls is a useful pattern. It requires additional CSS (`position: sticky`) inside the panel. Not specified in v1 — the panel's `overflow-y: auto` applies to the whole content box. If a consumer needs sticky title, they override via `className`.

- **Multiple size variants.** Some design systems ship `size="sm" | "md" | "lg"` dialog variants. The DS ships one default size (`min(28rem, …)`). Consumers who need a wider dialog override `max-width` via `className`. If a second named size (e.g. a "wide" variant for data tables) is frequently needed, file a proposal.

- **Animated confetti / success states.** Product-level celebration animations inside a dialog are the application's concern, not a DS primitive.

---

## 12. Worked examples

### (a) Controlled open state — no Trigger

```jsx
import { useState } from "react";
import { DialogBasic, Button } from "@poukai-inc/ui";

function WaitlistSignup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Join waitlist</Button>

      <DialogBasic
        open={open}
        onOpenChange={setOpen}
        title="Join the waitlist"
        description="We'll reach out as soon as your spot is ready."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="waitlist-form">
              Submit
            </Button>
          </>
        }
      >
        <form id="waitlist-form">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" name="email" autoComplete="email" />
        </form>
      </DialogBasic>
    </>
  );
}
```

### (b) Uncontrolled via `Dialog.Trigger` — compound API

```jsx
import { Dialog, Button } from "@poukai-inc/ui";

function InfoOverlay() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="ghost">Learn more</Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>About pouk.ai</Dialog.Title>
          <Dialog.Description>
            pouk.ai gives operators access to enterprise-grade AI tooling.
          </Dialog.Description>
          <p>
            Founded in 2025, pouk.ai builds the infrastructure layer for AI operators. Our design
            system reflects the same editorial restraint we bring to every product decision.
          </p>
          <Dialog.Close asChild>
            <Button variant="ghost">Close</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### (c) Form inside Dialog — `onOpenAutoFocus` override

```jsx
import { useRef } from "react";
import { Dialog, Button } from "@poukai-inc/ui";

function SettingsDialog({ open, onOpenChange }) {
  const firstFieldRef = useRef(null);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          onOpenAutoFocus={(e) => {
            // Focus the first form field, not the panel itself
            e.preventDefault();
            firstFieldRef.current?.focus();
          }}
        >
          <Dialog.Title>Notification settings</Dialog.Title>

          <form>
            <label htmlFor="notify-email">Email notifications</label>
            <input ref={firstFieldRef} id="notify-email" type="checkbox" name="notify-email" />
          </form>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--space-3)",
              marginTop: "var(--space-6)",
            }}
          >
            <Dialog.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### (d) Confirmation dialog — Cancel + Confirm pattern

```jsx
import { DialogBasic, Button } from "@poukai-inc/ui";

function DeleteConfirmation({ open, onOpenChange, onConfirm }) {
  return (
    <DialogBasic
      open={open}
      onOpenChange={onOpenChange}
      title="Delete this project?"
      description="This action cannot be undone. All data associated with the project will be permanently removed."
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete project
          </Button>
        </>
      }
    >
      {/* No additional body content needed for a simple confirmation */}
      {null}
    </DialogBasic>
  );
}
```

**Note on destructive button styling.** The confirmation example above uses `variant="primary"` for the destructive action. The DS does not currently ship a `variant="danger"` button. If a danger/destructive variant is added to `Button`, the confirmation dialog's confirm button should use it. This is an open question — see §13.

---

## 13. Story matrix

| Story file                       | Story name            | Description                                                                                                                                                                      |
| -------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Dialog.stories.tsx`             | `Default`             | `DialogBasic` with title, description, body text, footer (Cancel + Confirm). Verifies panel renders, overlay present, close button visible, `aria-labelledby` wired.             |
| `Dialog.stories.tsx`             | `NoDescription`       | `DialogBasic` with title and body only. Verifies: hairline rule between title and body is suppressed when no description. Title flows directly into body.                        |
| `Dialog.stories.tsx`             | `NoFooter`            | `DialogBasic` with title, description, body only. No `footer` prop. Verifies: no footer row rendered; close button (X) is only dismiss affordance.                               |
| `Dialog.stories.tsx`             | `UncontrolledTrigger` | Compound API: `Dialog.Root` + `Dialog.Trigger asChild Button` + `Dialog.Portal` + overlay + content. Verifies: uncontrolled open/close cycle, focus returns to trigger on close. |
| `Dialog.stories.tsx`             | `FormInDialog`        | Form with two fields inside `DialogBasic`. Verifies: `onOpenAutoFocus` can set focus to first field, Tab cycles through fields, submit works inside dialog.                      |
| `Dialog.stories.tsx`             | `Confirmation`        | Delete confirmation dialog (example d above). Verifies: two buttons in footer, correct accessible name on title, description present.                                            |
| `Dialog.stories.tsx`             | `LongBody`            | Body content ~600 words (simulate terms text). Verifies: panel scrolls internally at `max-height: 85vh`, title and close button remain visible, no viewport overflow.            |
| `Dialog.stories.tsx`             | `MobileViewport`      | Viewport 375px. Verifies: panel uses full width minus `--page-pad` insets, vertically centered, no horizontal scroll on body.                                                    |
| `Dialog.AllVariants.stories.tsx` | `OpenCloseAnimation`  | Storybook interaction test: open dialog, verify `data-state="open"` on overlay and content; close, verify `data-state="closed"` (or element removed if not `forceMount`).        |
| `Dialog.AllVariants.stories.tsx` | `EscapeKey`           | Open dialog, press Escape, verify dialog closes and focus returns to trigger.                                                                                                    |
| `Dialog.AllVariants.stories.tsx` | `FocusTrap`           | Tab from open dialog close button — verify focus cycles within panel; Shift+Tab from first element — verify focus wraps to close button.                                         |
| `Dialog.AllVariants.stories.tsx` | `A11yAudit`           | axe-core run on open `DialogBasic`. Verifies: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` wired to title id, no critical violations.                                 |

---

## 14. Open questions for Arian

1. **Danger/destructive `Button` variant.** The delete-confirmation example (§12d) uses `variant="primary"` for a destructive action. This is technically wrong — a delete button should visually signal danger. Should the DS add `variant="danger"` to `Button` now, coordinated with this Dialog spec? Or defer and accept that the confirmation button is primary-styled until the variant ships?

2. **`DialogBasic` close button: X icon or text.** The spec calls for an icon-only X button (with `aria-label="Close"`) in the top-right of the title band. The DS uses `lucide-react` as a peer dep for icons. Should the engineer pull `X` from `lucide-react` for this close button, or render a plain text "✕" glyph? Using `lucide-react` is cleaner and consistent with the DS icon convention. But it means `DialogBasic` implicitly depends on the consumer having `lucide-react` installed (which they do, since it is a peer dep). Recommend: `lucide-react` `X` icon. Awaiting sign-off.

3. **`modal: false` escape hatch.** The spec explicitly excludes non-modal dialogs (`modal: false`). If the site team has a legitimate use case for a non-blocking info overlay that needs focus trap behavior, should the DS surface a prop to allow `modal={false}`, or is the right answer a future `Popover` primitive? Current stance: the `Popover` primitive handles non-blocking overlays; Dialog is always modal. Confirming this is the intended product split.

4. **`container` prop for `Dialog.Portal`.** By default Radix portals content into `document.body`. Some Next.js or server-rendered apps need to target a specific DOM node (e.g. a `<div id="portal-root">` outside `<main>` for z-index management). The spec passes `container` through as a prop on `Dialog.Portal`. Should the DS document a recommended container pattern, or leave it to consumers to manage?

5. **Width at wide viewports.** The 28rem (448px) max-width was chosen for the common case. If the internal product surfaces (settings panes, data-entry forms) routinely need wider dialogs (e.g. 40rem for a multi-column form), a second named size (`size="wide"` at 40rem) may be warranted. Currently deferred — consumers use `className` to override. Flagging for Arian's awareness.
