---
"@poukai-inc/ui": minor
---

Add `Dialog` organism — compound modal overlay built on `@radix-ui/react-dialog`.

Exports:

- `Dialog` namespace: `Dialog.Root`, `Dialog.Trigger`, `Dialog.Portal`, `Dialog.Overlay`, `Dialog.Content`, `Dialog.Title`, `Dialog.Description`, `Dialog.Close`
- `DialogBasic` — convenience wrapper with built-in X close button (lucide `X`), title, optional description, body slot, and optional footer action row

Token contract: `--bg-elevated`, `--fg`, `--fg-muted`, `--hairline`, `--hairline-w`, `--accent`, `--radius-3`, `--radius-1`, `--space-2`–`--space-8`, `--font-sans`, `--fs-body`, `--fs-meta`, `--dur-fast`, `--easing`, `--page-pad`, `--surface`.

All accessibility plumbing (focus trap, `aria-modal`, `aria-labelledby`, ESC dismiss, return focus) delegated to Radix. DS adds brand styling only.

Available via `@poukai-inc/ui`, `@poukai-inc/ui/organisms`.
