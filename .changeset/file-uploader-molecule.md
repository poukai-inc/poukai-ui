---
"@poukai-inc/ui": minor
---

feat(molecules): add FileUploader component (#399)

New `FileUploader` molecule — drag-and-drop file selection with per-file
progress, validation, and removal.

- Drop zone with drag-over feedback (valid/invalid states), click-to-browse,
  and keyboard operation (Enter/Space opens file dialog).
- Uncontrolled by default; controlled via `files` + `onFilesAdded` /
  `onFileRemoved`. Both modes fire all callbacks.
- Client-side validation: `accept` (MIME types and extensions) and
  `maxSizeBytes`. Rejected files fire `onFileRejected` and are not added
  to the list.
- Per-file `<ProgressBar size="sm">` rendered when `entry.progress` is set;
  tone switches to `"danger"` when `entry.error` is also set.
- Full a11y: `role="button"` drop zone, visually-hidden input (remains in
  a11y tree), polite live region for add/remove/reject, assertive live region
  for drag state, `aria-label="Remove {filename}"` on remove buttons, and
  focus management on removal.
- `<Field>`-compatible: accepts `id`, `aria-describedby`, `aria-invalid`,
  `required` injected by `Field.cloneElement`.
- Zero lucide-react dependency — all glyphs are inline SVG.
- Tokens only: 23 approved tokens from `src/tokens/tokens.css`.
