# Sheet

**Status:** Approved (Phase 2 — orchestrator sign-off for pilot wave; poukai-design human review pending).

## 1. Intent

`<Sheet>` is the DS's side-anchored overlay primitive — a `Dialog` variant that slides in from a viewport edge (`right` / `left` / `top` / `bottom`) rather than centering. It serves mobile navigation drawers, settings panels, filter panels, and secondary detail views where a full modal would feel too disruptive and an inline expansion would collapse the page layout. The side-in motion reinforces spatial continuity: the panel arrives from the direction it semantically belongs to (right for detail, bottom for mobile-nav).

## 2. Anatomy

```
<Sheet>                          ← compound root (context provider)
  <Sheet.Trigger asChild>        ← Radix trigger, no own DOM
    <Button>Open</Button>
  </Sheet.Trigger>
  <Sheet.Content side="right">   ← portal + overlay + panel
    <Sheet.Title>Settings</Sheet.Title>
    <Sheet.Description>…</Sheet.Description>
    {children}
    <Sheet.Close asChild>        ← optional; Radix auto-wires Escape
      <Button variant="ghost">Close</Button>
    </Sheet.Close>
  </Sheet.Content>
</Sheet>
```

DOM shape inside the portal:

```
<div> (Radix overlay — full-viewport scrim)
<div role="dialog" aria-modal="true" aria-labelledby aria-describedby>
  ├── Sheet.Title   → <h2> (visually-hidden when design hides it)
  ├── Sheet.Description → <p>
  └── children slot
```

Named sub-components: `Sheet`, `Sheet.Trigger`, `Sheet.Content`, `Sheet.Title`, `Sheet.Description`, `Sheet.Close`.

## 3. Tokens

- `--bg-elevated` — panel background (front-most layer: `#ffffff` light / `#1c1c1e` dark)
- `--fg` — panel text color
- `--fg-muted` — secondary text inside panel
- `--hairline` — edge border between panel and page content
- `--hairline-w` — border width (`1px`)
- `--surface` — scrim tint base color (used at reduced opacity for the overlay)
- `--accent` — focus ring color on interactive elements
- `--radius-1` — focus ring border-radius
- `--radius-3` — panel corner radius on the inward-facing corner(s)
- `--space-6` — default panel padding (block and inline)
- `--space-4` — gap between Title and Description
- `--dur-mid` — slide transition duration (`240ms`)
- `--easing` — slide entrance easing (`cubic-bezier(0.16, 1, 0.3, 1)`, expo-out)
- `--dur-fast` — exit transition duration (`180ms`) — exits should feel quicker than entrances

## 4. Variants / Props

| Prop           | Type                                     | Default   | Rationale                                                                                           |
| -------------- | ---------------------------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `side`         | `"right" \| "left" \| "top" \| "bottom"` | `"right"` | Right is the most common: detail panels, settings. Bottom serves mobile-nav sheets.                 |
| `size`         | `"sm" \| "md" \| "lg" \| "full"`         | `"md"`    | Controls panel width (right/left) or height (top/bottom). See size ladder below.                    |
| `open`         | `boolean`                                | —         | Controlled open state.                                                                              |
| `defaultOpen`  | `boolean`                                | `false`   | Uncontrolled initial state.                                                                         |
| `onOpenChange` | `(open: boolean) => void`                | —         | Controlled state callback.                                                                          |
| `modal`        | `boolean`                                | `true`    | `false` disables the scrim and allows background interaction — use only for persistent side panels. |

Size ladder for `right` / `left` panels (panel width):

| Size   | Width   |
| ------ | ------- |
| `sm`   | `320px` |
| `md`   | `400px` |
| `lg`   | `560px` |
| `full` | `100vw` |

For `top` / `bottom` panels height follows the same ladder mapped to viewport height fractions: `sm` → `40vh`, `md` → `60vh`, `lg` → `80vh`, `full` → `100vh`.

## 5. Interaction

- **Trigger**: any focusable element via `Sheet.Trigger asChild`. Radix handles wiring.
- **Close**: `Escape` key closes unconditionally. Clicking the overlay scrim closes (Radix default; disable via `onInteractOutside`). `Sheet.Close` renders a close button; position and label are consumer-authored.
- **Focus trap**: Radix manages focus trap and restores focus to the trigger on close.
- **Focus order inside panel**: natural DOM order. `Sheet.Title` should be the first heading; interactive controls follow.
- **Scroll**: panel body scrolls independently when content overflows. The panel header (Title area) should be sticky if the consumer needs it — no DS-level sticky header prescribed.
- **Drag-to-dismiss**: out of scope for this spec. A bottom-sheet drag handle is a future extension.

## 6. A11y

- Root renders `role="dialog"` with `aria-modal="true"` via Radix.
- `Sheet.Title` maps to `<h2>` and is wired as `aria-labelledby` on the dialog root.
- `Sheet.Description` maps to `<p>` and is wired as `aria-describedby`.
- Both `Sheet.Title` and `Sheet.Description` are required in the DOM (may be visually hidden via Radix `VisuallyHidden` if the design omits them visually) — a dialog without an accessible name fails axe `aria-dialog-name`.
- Overlay scrim carries `aria-hidden="true"` — it is a visual affordance, not an interactive element.
- `Sheet.Close` renders a `<button>` with a visible label or `aria-label="Close"` when icon-only.
- Contrast: panel text (`--fg` on `--bg-elevated`) — `#1D1D1F` on `#ffffff` = 19.04:1 (AAA). Dark mode: `#f5f5f7` on `#1c1c1e` = 16.75:1 (AAA).

## 7. Motion

Entrance: panel translates in from the `side` edge to `translate(0, 0)` over `--dur-mid` (`240ms`) using `--easing` (`cubic-bezier(0.16, 1, 0.3, 1)`). Overlay fades from `opacity: 0` to `opacity: 1` in parallel.

Exit: panel translates back out and overlay fades over `--dur-fast` (`180ms`). Exits are faster than entrances — the user has decided to close; don't make them wait.

Slide axes by side:

| Side     | Entrance from       |
| -------- | ------------------- |
| `right`  | `translateX(100%)`  |
| `left`   | `translateX(-100%)` |
| `bottom` | `translateY(100%)`  |
| `top`    | `translateY(-100%)` |

`prefers-reduced-motion: reduce`: the global `tokens.css` block clamps all `transition-duration` to `0.01ms`. No per-component override needed — the panel appears and disappears instantly. Radix respects the clamped duration automatically.

## 8. Anti-patterns

- **Don't use Sheet for destructive confirmations.** Destructive actions (delete, revoke) belong in a centered `Dialog` where the modal weight signals gravity.
- **Don't use Sheet as an inline expansion.** If the panel content is directly related to an item in the page and the page should remain interactive, consider a Disclosure or an inline drawer pattern instead.
- **Don't stack Sheets.** Opening a Sheet from within a Sheet creates nested focus traps and layering ambiguity. Compose the second step within the same Sheet panel.
- **Don't use Sheet for long editorial forms.** A multi-section form with many fields is better served by a dedicated page. Sheet is for contained, bounded interactions.
- **Don't suppress `Sheet.Title`.** Visually hide it with `VisuallyHidden` if the design doesn't show a heading, but never omit it from the DOM — the dialog accessible name depends on it.

## 9. Depends on

- `Dialog` (DS atom — Sheet reuses Dialog's overlay, portal, and focus-trap infrastructure via Radix; Sheet is not built on the DS `Dialog` component directly but on the same `@radix-ui/react-dialog` primitive).
- `@radix-ui/react-dialog` — the Radix primitive that provides portal, focus trap, `aria-modal`, and keyboard dismissal.
- `Button` (DS atom) — canonical trigger and close affordance.

## Open questions

- **Overlay opacity token gap.** The scrim needs a semi-transparent background (typically `rgba(0,0,0,0.4)`). No token exists for overlay/scrim opacity. The engineer should use `rgba(0,0,0,0.4)` inline for now; a `--overlay-bg` token should be proposed as a follow-up if a second overlay surface (Dialog, Sheet) converges on the same value.
- **`modal: false` panel border.** When `modal` is `false` (no scrim), the panel edge needs a visible border to separate it from page content. `--hairline` at `--hairline-w` is the natural candidate, but the exact edge (inward-facing only vs. all sides) needs a decision at implementation time.
