---
"@poukai-inc/ui": minor
---

Add `useFieldErrors` — validation-lib-agnostic error-state hook for Form surfaces.

Exports `useFieldErrors(initial?)` and `type FieldErrors` from `@poukai-inc/ui` (and the `molecules` subpath). The hook owns field-keyed error state with stable imperative setters (`setErrors`, `setFieldError`, `clearAll`). No validation library dependency introduced — compatible with Zod, React Hook Form, Yup, and hand-rolled validators.
