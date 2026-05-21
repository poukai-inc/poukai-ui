---
"@poukai-inc/ui": minor
---

Add IconButton atom — square, icon-only interactive primitive. Composes Button
(variant / state / focus / disabled), Icon (glyph slot), and VisuallyHidden
(belt-and-suspenders accessible name).

Same `variant` union (`primary` / `secondary` / `ghost`) and same `size` ladder
(`sm` 32 px / `compact` 40 px / `md` 44 px / `lg` 52 px) as Button — driven by
the shared `--btn-h-*` token rungs so IconButton and Button read as one family
on a shared surface.

`aria-label` is **required** at the type level (`Omit<…, "aria-label">` +
mandatory string field). The same label is rendered into a `VisuallyHidden`
child for assistive-tech variants that prefer inner text over `aria-label`.
Icon size resolves automatically per Button size (`sm`→16 px, `compact`/`md`→
20 px, `lg`→24 px).

`forwardRef` to the underlying `<button>` host (via Button's ref forwarding);
`...rest` forwarded so consumers can pass `data-*`, `onClick`, `disabled`, etc.
No `asChild` in v1 — anchor-as-icon-button is a separate concern (SkipLink).

Spec: `meta/design/IconButton.md`.
