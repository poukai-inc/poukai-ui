---
"@poukai-inc/ui": minor
---

Add `ToastItem` molecule — declarative compound Toast item.

Compound API: `ToastItem`, `ToastItem.Title`, `ToastItem.Description`, `ToastItem.Close`, `ToastItem.Action`. Wraps `@radix-ui/react-toast` primitives with DS tokens and tone variants (`info`, `success`, `warning`, `danger`). Complements the existing imperative `Toast` organism (`ToastProvider` + `useToast()`).

Closes #187.
