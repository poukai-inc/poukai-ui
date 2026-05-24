---
"@poukai-inc/ui": minor
---

feat(molecule): add NewsletterField — inline email + submit form

Adds the `NewsletterField` molecule: a single-row `<form>` pairing an email
`<Input>` with a `<Button type="submit">`. Supports both uncontrolled native
POST (via `action` prop) and controlled JS submission (via `onSubmit`).

Props: `action`, `method`, `onSubmit`, `name`, `placeholder`, `cta`,
`disabled`, `note`, `size` (`"compact"` | `"md"`), `formAriaLabel`.

A11y: visually hidden `<label>` via `VisuallyHidden`; `<form aria-label>`;
`type="submit"` button; browser-native email validation.

Closes #180.
