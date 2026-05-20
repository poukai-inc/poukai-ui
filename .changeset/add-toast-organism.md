---
"@poukai-inc/ui": minor
---

Add Toast organism — `ToastProvider`, `useToast` hook, and `ToastPayload` type.

Imperative notification portal built on `@radix-ui/react-toast`. Features:

- Four tones: `info`, `success`, `warning`, `danger` — reuses the Banner status palette.
- `ToastProvider` props: `defaultDuration` (5000ms), `max` (4), `position` (bottom-right / top-right / top-center / bottom-center), `closeLabel`.
- `useToast()` hook: `show(payload)` returns id; `dismiss(id)` removes imperatively.
- Optional `title`, `action` slot (Radix `Toast.Action` + `<Button variant="ghost" size="sm">`), and built-in close button.
- Auto-dismiss via Radix's internal timer; `onOpenChange` bridge to `dismiss`.
- `z-index: 200` — above Dialog overlay (100) and content (101).
- Entrance/exit animations at `--dur-fast` with `--easing`; respects `prefers-reduced-motion` via global tokens block.
- Playwright CT tests + axe-core a11y gate (all four tones).
- Ladle stories: all tones, with action, with title+body, multiple stacked, all position variants.
