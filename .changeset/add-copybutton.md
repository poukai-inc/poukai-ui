---
"@poukai-inc/ui": minor
---

feat(molecule): add CopyButton — copy-to-clipboard button with transient success state

State machine: idle → success → idle on timeout. Uses `navigator.clipboard.writeText` with `document.execCommand` fallback. Composes `Icon` atom (Copy/Check from lucide-react). Fires `onCopy` and `onError` callbacks. Accessible: `aria-live="polite"` on label, native `<button>`, WCAG 2.5.8-compliant tap target.
