# Design spec: FileUploader

**Atomic layer**: molecule
**Status**: Approved
**Author**: poukai-design
**Last updated**: 2026-05-31
**GitHub issue**: #399

---

## 1. Purpose

`FileUploader` is the file-selection primitive for `@poukai-inc/ui`. It provides a drag-and-drop zone plus a click-to-browse affordance, a selected-file list with per-file remove and optional progress, and a validation surface for `accept`/`maxSizeBytes` violations — all in a single self-contained molecule.

It was identified in the #390 triage as the only genuine component gap for the autopost dashboard consumer: no existing primitive handles `File` object collection, drag state, per-file progress, or inline file-rejection messaging.

**Non-goals (v1):**

- No remote upload logic. The component collects local `File` objects only. The caller owns the upload transport (fetch, XHR, signed URL, etc.).
- No URL rendering. File objects are never serialised to `href` attributes — security boundary, not a feature gap.
- No image preview / thumbnail. The list shows filename + size only; image previews are a consumer concern.
- No folder/directory upload (`webkitdirectory`). Out of scope for v1.
- No drag-to-reorder of the file list.
- No chunked-upload progress orchestration. The optional `progress` field on `FileEntry` is populated by the caller; the component displays it via `<ProgressBar>`.

---

## 2. Anatomy

```
┌──────────────────────────────────────────────────────────────┐
│  [Drop zone — <div role="button">]                           │
│                                                              │
│       [Upload glyph — inline SVG, 24×24]                     │
│       "Drag files here, or click to browse"                  │
│       "[accept types hint]  ·  [maxSize hint]"               │
│                                                              │
│  [<input type="file" class="sr-only"> — visually hidden]     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  [File list — <ul>]                                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [File icon — inline SVG, 16×16]  filename.pdf  1.2 MB  │  │
│  │ [ProgressBar — optional, tone="default"|"danger"]      │  │
│  │ [error message — when rejected]                        │  │
│  │                           [Remove — inline ×  SVG btn] │  │
│  └────────────────────────────────────────────────────────┘  │
│  … (one row per FileEntry)                                   │
└──────────────────────────────────────────────────────────────┘

[Zone-level error — <p role="alert">]   — e.g. "File type not supported"
```

**Named parts:**

- **Root** (`<div>`): outer wrapper, no visual styling of its own. Accepts `className` for layout override.
- **Drop zone** (`<div role="button" tabIndex={0}`): the interactive drag target and click activator. See §5.
- **Upload glyph**: inline SVG arrow-up-from-tray icon. 24×24 viewBox. `aria-hidden="true"`. See §10.
- **Zone hint text**: two lines — primary instruction + secondary hint (accept types, max size). Both Geist, `--fs-meta`, `--fg-muted`.
- **Hidden input** (`<input type="file">`): rendered with `VisuallyHidden`-equivalent CSS (not `display:none` — must remain in the accessibility tree as an activatable form control). Connected to the drop zone via `ref`; the drop zone click handler calls `inputRef.current.click()`.
- **File list** (`<ul>`): one `<li>` per `FileEntry`. Absent from the DOM when `files` is empty.
- **File row** (`<li>`): file glyph + name + size + optional ProgressBar + optional per-file error + remove button.
- **File glyph**: inline SVG page-with-corner-fold icon. 16×16 viewBox. `aria-hidden="true"`. See §10.
- **Remove button** (`<button type="button">`): inline × SVG. `aria-label="Remove [filename]"`. See §10.
- **Zone-level error** (`<p role="alert">`): shown when the entire drop operation fails a validation rule that applies zone-wide (e.g. `multiple={false}` and user drops 3 files).
- **Live region** (`<div aria-live="polite" aria-atomic="false">`): visually hidden, announces add/remove/reject events to AT. See §9.

---

## 3. File wrapper type

```ts
interface FileEntry {
  /** Stable identifier. Caller-supplied or auto-generated (crypto.randomUUID / Date.now fallback). */
  id: string;
  /** The native File object. Never serialised to a URL or href. */
  file: File;
  /**
   * Upload progress 0–100. Undefined = no bar rendered.
   * When present, <ProgressBar value={progress}> is rendered below the filename row.
   * Tone is "danger" when error is also set; "default" otherwise.
   */
  progress?: number;
  /**
   * Per-file validation or upload error message.
   * Triggers danger styling on the row and a ProgressBar tone="danger" if progress is also set.
   */
  error?: string;
}
```

**Why a wrapper type and not raw `File[]`.**
`File` objects are immutable browser primitives with no fields for upload state. The component needs to track `id` (stable React key, enables precise removal), `progress` (per-file bar), and `error` (per-file rejection reason) alongside the native object. A wrapper type is the minimum surface that keeps all three co-located without inventing hidden internal state the caller cannot inspect.

---

## 4. Props API

```ts
interface FileUploaderProps {
  // ── Constraints ────────────────────────────────────────────────────────────

  /**
   * Forwarded to the hidden <input accept="…">.
   * Also used for drop validation: files not matching are rejected with a per-file error.
   * Standard MIME type list or extension list: "image/*,application/pdf" or ".jpg,.pdf".
   * @default undefined — all file types accepted
   */
  accept?: string;

  /**
   * Maximum individual file size in bytes. Files exceeding this are rejected
   * with a per-file error message.
   * @default undefined — no size limit
   */
  maxSizeBytes?: number;

  /**
   * Allow selecting multiple files at once.
   * Forwarded to the hidden <input multiple>.
   * When false, dropping/selecting more than one file shows a zone-level error;
   * only the first file is accepted.
   * @default true
   */
  multiple?: boolean;

  /**
   * When true, the entire component is inert: no drag interaction, no file dialog,
   * no remove actions. Visual opacity reduction applied.
   * @default false
   */
  disabled?: boolean;

  // ── File model — uncontrolled by default, optionally controlled ────────────

  /**
   * Controlled file list. When provided, the component is fully controlled:
   * it does not maintain internal state. The caller must update this prop in
   * response to onFilesAdded / onFileRemoved callbacks.
   *
   * When omitted, the component manages its own internal FileEntry[] state
   * (uncontrolled). onFilesAdded / onFileRemoved still fire.
   */
  files?: FileEntry[];

  /**
   * Called when one or more new valid files have been added (via drop or browse).
   * Receives only the newly accepted entries — not the full accumulated list.
   * In uncontrolled mode: component has already appended these to internal state.
   * In controlled mode: caller must merge into its own state.
   */
  onFilesAdded?: (entries: FileEntry[]) => void;

  /**
   * Called when the user removes a file by clicking its remove button.
   * Receives the id of the removed entry.
   * In uncontrolled mode: component has already removed this entry from internal state.
   * In controlled mode: caller must remove from its own state.
   */
  onFileRemoved?: (id: string) => void;

  /**
   * Called for every file that fails accept or maxSizeBytes validation.
   * The FileEntry is fully constructed (with error message set) and is NOT
   * added to the accepted list. Callers can use this for analytics or to
   * surface a Toast alongside the inline per-file error.
   */
  onFileRejected?: (entry: FileEntry) => void;

  // ── Hint text overrides ───────────────────────────────────────────────────

  /**
   * Override the primary instruction line in the drop zone.
   * @default "Drag files here, or click to browse"
   */
  dropZoneLabel?: string;

  // ── Layout ────────────────────────────────────────────────────────────────

  /** Merged onto the root <div> via clsx. Consumer owns width. */
  className?: string;
}
```

**Prop model justification — uncontrolled-first with controlled escape hatch.**

The DS form atoms (`Input`, `Textarea`, `Select`, `Switch`, `Checkbox`) are all uncontrolled-first: they work without any external state, and React's `defaultValue`/`onChange` pattern lets callers go controlled when needed. `FileUploader` follows the same discipline. The default is zero-ceremony: drop files, they appear in the list, remove them with the × button, read them back via `onFilesAdded`. The `files` prop promotes the component to controlled when the caller needs to drive state from outside (e.g. React Hook Form integration, optimistic upload state).

The `files` prop is a controlled override, not a `defaultFiles` seed. When `files` is provided the component renders it directly and does not touch internal state. When `files` is omitted the component is uncontrolled. Both modes fire `onFilesAdded` / `onFileRemoved` — this is the observable surface regardless of control mode, consistent with how `Input.onChange` fires whether or not `value` is controlled.

---

## 5. States

### Drop zone states

| State                                    | Visual treatment                                                                                                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Idle**                                 | `--bg` background; 1px dashed `--hairline` border; `--radius-3` corners; glyph + hint text in `--fg-muted`                                                                         |
| **Drag-over** (valid)                    | Background → `--accent-glow`; border → 1px dashed `--accent`; glyph + hint text → `--accent`; transition: `background-color`, `border-color`, `color` at `--dur-fast` / `--easing` |
| **Drag-over** (invalid, e.g. wrong type) | Background → `--bg-danger`; border → 1px dashed `--danger`; glyph + hint text → `--danger`; transition same                                                                        |
| **Focus-visible**                        | 2px solid `--accent` outline, 2px offset, `--radius-1` radius. Matches Button/Input focus contract.                                                                                |
| **Disabled**                             | `opacity: 0.5`; `pointer-events: none`; `cursor: not-allowed`; no hover/drag interaction                                                                                           |
| **With files**                           | Zone remains visible above the file list at normal opacity. Zone does not collapse when files are present — allows adding more files when `multiple={true}`.                       |

### File row states

| State             | Visual treatment                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Default**       | `--bg-elevated` background, `--hairline` border, `--radius-2` corners, `--space-3` padding. Filename in `--fg` at `--fs-meta`. Size in `--fg-muted` at `--fs-meta`. |
| **With progress** | `<ProgressBar>` rendered below filename row, full width of the row, `size="sm"`, `tone="default"`                                                                   |
| **With error**    | Row border → `--danger`; per-file error text below filename in `--danger` at `--fs-meta`; `<ProgressBar tone="danger">` if progress is also set                     |
| **Remove hover**  | Remove button background → `--surface` at `--dur-fast`. No row-level hover state — the row is not interactive as a unit.                                            |

### Zone-level error

Rendered below the drop zone (above the file list) when a zone-wide validation fails (e.g. `multiple={false}` + multi-file drop). Uses `role="alert"`. Styled identically to `<Field error>`: `--danger` left-rule border, `--danger` text color, `--fs-meta`, `--space-2` inline padding. Dismissed when the zone returns to idle (next drag event or successful drop).

---

## 6. Tokens used

| Token           | Role                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `--bg`          | Drop zone idle background                                                                                                                 |
| `--surface`     | ProgressBar track; remove-button hover background                                                                                         |
| `--bg-elevated` | File row background                                                                                                                       |
| `--bg-danger`   | Drop zone drag-over-invalid background                                                                                                    |
| `--accent`      | Drop zone drag-over-valid border + text; focus ring                                                                                       |
| `--accent-glow` | Drop zone drag-over-valid background fill                                                                                                 |
| `--danger`      | Drop zone drag-over-invalid border + text; per-file error text; error row border; zone-level error text/border; ProgressBar tone="danger" |
| `--fg`          | Filename text color; remove button color                                                                                                  |
| `--fg-muted`    | Hint text; file size text; idle zone glyph                                                                                                |
| `--hairline`    | Drop zone idle border (dashed); file row resting border                                                                                   |
| `--hairline-w`  | Border width (1px)                                                                                                                        |
| `--radius-2`    | File row corner radius                                                                                                                    |
| `--radius-3`    | Drop zone corner radius                                                                                                                   |
| `--font-sans`   | All text                                                                                                                                  |
| `--fs-meta`     | Hint text, filename, size, error messages (14px)                                                                                          |
| `--lh-meta`     | Line-height for all meta-scale text in this component                                                                                     |
| `--space-1`     | Glyph-to-text gap in file row; icon-to-filename gap                                                                                       |
| `--space-2`     | Zone hint text line gap; error message inline padding; file row element gap                                                               |
| `--space-3`     | File row padding-inline; drop zone padding-inline                                                                                         |
| `--space-4`     | Drop zone padding-block; gap between zone and file list                                                                                   |
| `--space-6`     | Drop zone min-height contribution (padding + content)                                                                                     |
| `--dur-fast`    | Drag-over color transitions (180ms)                                                                                                       |
| `--easing`      | Transition easing (expo-out)                                                                                                              |

**No new tokens introduced.** Every visual decision above maps to an existing token. The only potential gap flagged for stop-and-ask is documented in §11.

---

## 7. Layout and rhythm

### Drop zone

- `display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center`
- `padding: var(--space-4) var(--space-3)`
- `min-height: 120px` — expressed as `calc(var(--space-6) * 5)` = 120px. This is within the spacing grid (120 = 30 × 4px). **Stop-and-ask flag: if this value cannot be cleanly expressed via the spacing scale, see §11.**
- `border: var(--hairline-w) dashed var(--hairline)` at idle
- `border-radius: var(--radius-3)` (8px)
- `cursor: pointer` (not disabled)
- Upload glyph: `--icon-lg` (24px), `margin-bottom: var(--space-2)`
- Primary instruction: `--fs-meta`, `--fg-muted`, `margin-bottom: var(--space-1)`
- Secondary hint (accept types + max size): `--fs-meta`, `--fg-muted`, rendered as a single line, `opacity: 0.8` of `--fg-muted` for further subordination. Absent when neither `accept` nor `maxSizeBytes` is provided.

### File list

- `margin-top: var(--space-4)` from drop zone
- `list-style: none; padding: 0; margin: 0`
- `display: flex; flex-direction: column; gap: var(--space-2)`

### File row

- `display: flex; flex-direction: column; gap: var(--space-1)`
- `padding: var(--space-2) var(--space-3)`
- `border: var(--hairline-w) solid var(--hairline)`
- `border-radius: var(--radius-2)` (4px)
- `background: var(--bg-elevated)`
- Top sub-row: `display: flex; align-items: center; gap: var(--space-2)` — file glyph + filename + size (flex-grow on name) + remove button
- Filename: `--fg`, `--fs-meta`, truncated with `text-overflow: ellipsis; overflow: hidden; white-space: nowrap; min-width: 0`
- Size: `--fg-muted`, `--fs-meta`, `white-space: nowrap; flex-shrink: 0`
- ProgressBar: full width of the row, `size="sm"`, below the top sub-row
- Per-file error: `--danger`, `--fs-meta`, below ProgressBar (or below top sub-row if no progress)

### Remove button

- `display: inline-flex; align-items: center; justify-content: center`
- `width: var(--btn-h-sm); height: var(--btn-h-sm)` = 32px tap target (WCAG 2.5.8 AA)
- `flex-shrink: 0`
- `background: transparent`
- `border: none`
- `border-radius: var(--radius-2)`
- `color: var(--fg-muted)` at rest; `color: var(--fg)` on hover
- `cursor: pointer`
- Transition: `color var(--dur-fast) var(--easing)`, `background-color var(--dur-fast) var(--easing)`
- Hover: `background-color: var(--surface)`

---

## 8. Motion

### Drag-over feedback

The drop zone transitions three properties simultaneously on `dragenter` / `dragleave`:

```
transition:
  background-color var(--dur-fast) var(--easing),
  border-color var(--dur-fast) var(--easing),
  color var(--dur-fast) var(--easing);
```

`--dur-fast` (180ms) is the correct rung: this is a state change, not an entrance animation. The feedback must feel immediate without being jarring.

**Reduced-motion.** The global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` collapses `transition-duration` to 0.01ms — the drag-over color change becomes an instant snap. No per-component override required (no staggered entrance or fill-mode is involved). The state change is still communicated; motion is simply instant.

### File row entrance

No entrance animation on file rows. Rows snap into existence on add and snap out on remove. Animated list reflows violate the motion property contract (no `height` animation) and the subtlety bias. The live region (§9) covers the announcement gap.

### Remove feedback

Standard press feedback: `transform: scale(0.95)` at `--dur-press` (80ms) on the remove button `:active`. Matches the Button/IconButton press contract.

---

## 9. Accessibility

### Drop zone keyboard operation

The drop zone has `role="button"` and `tabIndex={0}`. Keyboard contract:

- `Enter` or `Space`: opens the file dialog (calls `inputRef.current.click()`). This mirrors the `<Button>` keyboard contract.
- No other keys are handled on the zone itself.

The visually-hidden `<input type="file">` is the true interactive form control. It must not have `display: none` or `visibility: hidden` — those remove it from the accessibility tree. Use the `VisuallyHidden` CSS pattern (position absolute, 1px clip, overflow hidden) so it remains activatable via the zone's click delegation and discoverable by AT in form browse mode.

### Input labelling

The hidden `<input type="file">` must be labelled. Two options (engineer chooses based on composition context):

- When used inside `<Field>`: `<Field>` wires `aria-labelledby` via `cloneElement` to the visible `<label>`. This is the canonical pattern — `FileUploader` should be `<Field>`-compatible as a child.
- When used standalone: the drop zone's visible instruction text acts as the label. Wire it via `aria-labelledby` pointing at the instruction text's `id`. The engineer must ensure this relationship is set when `<Field>` is not the parent.

### Drag state announcement

When drag-over begins, set `aria-label` on the drop zone to `"Drop files here"` (appended to the base label). On dragleave / drop, restore the base label. This gives AT users who have the zone focused an updated cue when another user's physical drag approaches the zone.

Alternatively (simpler, preferred): add a visually-hidden `<span aria-live="assertive">` that updates its text content to `"Drop files here"` on dragenter and clears on dragleave/drop. `assertive` (not polite) is correct here because the drag state is time-sensitive — the user needs to know immediately whether the zone is targeted.

### Live region for file events

A `<div aria-live="polite" aria-atomic="false">` rendered visually hidden announces:

- File added: `"[filename] added"` (one announcement per file, even for multi-file drops)
- File removed: `"[filename] removed"`
- File rejected: `"[filename] rejected: [reason]"` (e.g. "logo.exe rejected: File type not supported")

`aria-atomic="false"` allows each message to be announced individually. The region is cleared (empty string) 3 seconds after each announcement to prevent stale content re-reads. The 3-second clear is JS-driven (setTimeout); the global reduced-motion block does not affect JS timers.

### Remove button accessible name

Each remove button carries `aria-label="Remove [filename]"` where `[filename]` is the `file.name` value. This makes each button distinctly identifiable in AT button-list navigation. The × glyph is `aria-hidden="true"`.

### Contrast

- `--fg-muted` on `--bg` (drop zone hint text): 4.91:1 — AA normal at 14px.
- `--accent` on `--bg` (drag-over zone text): 4.54:1 — AA normal at 14px.
- `--danger` on `--bg` (error text): 7.2:1 — AAA.
- `--fg` on `--bg-elevated` (filename text): 16.83:1 — AAA.
- `--accent-glow` background with `--accent` text (drag-over state): `--accent` (#0071E3) on `rgba(0,113,227,0.18)` blended over `--bg` (#FBFBFD) ≈ #E4EEFA effective. Contrast `--accent` on #E4EEFA ≈ 3.2:1 — AA large/UI ✓. Non-text UI component (drag indicator); WCAG 1.4.11 ≥ 3:1 satisfied.
- Remove button glyph (`--fg-muted` on `--bg-elevated`): 5.07:1 — AA ✓ (non-text contrast requirement for UI components).

### Focus management

On file removal, focus must not be lost. If the removed row was the last in the list, move focus to the drop zone. If rows remain, move focus to the next row's remove button (or the previous, if removing the last row). Engineer uses `useRef` to track the previous focus target.

---

## 10. Inline SVG glyphs

No `lucide-react`. All three glyphs are inline SVG, `aria-hidden="true"`, `currentColor` fill/stroke. Pattern matches `Spinner.tsx` exactly: SVG as a sibling element inside the containing element, no wrapper component.

### Upload glyph (drop zone, 24×24)

Arrow-up from a tray/base line. Minimal geometry: a vertical shaft ending in an arrowhead, a horizontal base line below. Conveys "send up / deliver." Engineer renders as `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">` with `stroke="currentColor"` paths.

Suggested path geometry (engineer may adjust within the 24×24 grid):

```
Shaft:   M12 4 L12 16          (vertical line, arrow shaft)
Head:    M8 8 L12 4 L16 8      (chevron arrowhead, pointing up)
Base:    M4 20 L20 20           (horizontal tray base)
```

`strokeWidth="1.5"`, `strokeLinecap="round"`, `strokeLinejoin="round"`.

### File glyph (file row, 16×16)

Page with folded top-right corner. Standard document icon. Conveys "this is a file."

```
Body:   M3 2 L11 2 L13 4 L13 14 L3 14 Z   (page outline with corner)
Fold:   M11 2 L11 4 L13 4                  (corner fold)
```

Scale down to 16×16 viewBox. `strokeWidth="1.5"`, `fill="none"`, `stroke="currentColor"`.

### Remove glyph (remove button, 16×16)

Minimal × (close). Two diagonal lines crossing at center.

```
M4 4 L12 12
M12 4 L4 12
```

`strokeWidth="1.5"`, `strokeLinecap="round"`, `stroke="currentColor"`.

**All three SVGs** are defined once as local constants in `FileUploader.tsx`, not extracted to a separate geometry file (unlike `Wordmark` which has generated path data). The geometry is simple enough to live inline. Engineer uses `React.memo` or module-level `const` to avoid re-creation on render.

---

## 11. Stop-and-ask open question

**Drop zone `min-height` token expression.** The spec calls for a 120px minimum height on the drop zone. This is `6 × --space-4` (6 × 16px = 96px) or `5 × --space-4` + `--space-4` padding above/below = composable from existing tokens via `calc()` in CSS. However, a raw `120px` value in a CSS module is a brand violation (spacing scale rule). The correct expression is `calc(var(--space-4) * 7.5)` which is not on a whole-step grid boundary, or the engineer sets padding + content height naturally and the 120px minimum emerges organically from the layout.

**Recommendation**: set `padding: var(--space-6) var(--space-4)` (24px top/bottom, 16px left/right) on the drop zone. With the glyph (24px), `--space-2` gap, two lines of `--fs-meta` text (2 × ~20px line boxes with `--lh-meta` 1.2), and the padding, the natural height lands at approximately 108–120px without a `min-height` token. The engineer should verify this renders correctly and not hardcode 120px. If the natural height falls below 120px and a floor is needed, **stop and ask poukai-design** before introducing a hardcoded value.

---

## 12. Validation logic (component-owned)

The component performs two validation checks on every file before creating a `FileEntry`:

**1. `accept` check.** Parse the `accept` string into MIME type patterns and extension strings. For each file, check `file.type` against MIME patterns (supporting `*` wildcard, e.g. `image/*`) and `file.name` against extension patterns (e.g. `.pdf`). If neither matches, reject the file with `error: "File type not supported"`. No external library — the logic is a small pure function.

**2. `maxSizeBytes` check.** `file.size > maxSizeBytes` → reject with `error: "File exceeds maximum size of [humanReadable(maxSizeBytes)]"`. Human-readable conversion: bytes < 1024 → "X B"; < 1024² → "X KB"; < 1024³ → "X MB"; otherwise "X GB". Rounded to one decimal place.

Rejected files are NOT added to the file list. They fire `onFileRejected` only. Per-file errors (for accepted files that fail during upload) are set by the caller via the controlled `files` prop or via a follow-up update in uncontrolled mode — the component has no knowledge of upload-phase errors.

---

## 13. Prop intent (for the engineer)

- "Consumers must be able to use the component with zero props and have a working file picker." (Zero-config uncontrolled mode.)
- "Consumers using React Hook Form or similar must be able to drive the file list entirely from external state via `files` + `onFilesAdded` + `onFileRemoved`."
- "The `files` prop, when present, is the source of truth — the component renders it directly. When absent, the component manages its own state."
- "The `accept` prop is forwarded verbatim to the hidden input's `accept` attribute AND used for drop-event client-side validation."
- "The `onFileRejected` callback receives a `FileEntry` with `error` set but with `progress: undefined`. The caller decides whether to surface it (e.g. fire a Toast)."
- "Each `FileEntry.id` is stable for the lifetime of the entry. Callers may use `id` as a React key and as the key in an upload-state map."
- "The component must be usable as a child of `<Field>` for label/error wiring — it must accept `id`, `aria-describedby`, `aria-invalid`, and `required` props that `Field.cloneElement` injects, and forward them to the hidden `<input>`."
- "The hidden `<input>` must be visually hidden but remain in the accessibility tree."
- "The engineer must not use `lucide-react` for any glyph in this component."

---

## 14. Composition rules

**Inside `<Field>`**: `FileUploader` as the child of `<Field>` is the canonical integration. `Field` wires the label, helper, and error message. `FileUploader` accepts the injected `id`, `aria-describedby`, `aria-invalid`, `required` and forwards them to its hidden `<input>`.

```tsx
<Field label="Attach media" helper="JPEG, PNG, MP4 · max 25 MB each" id="media-upload">
  <FileUploader accept="image/*,video/mp4" maxSizeBytes={26214400} />
</Field>
```

**Standalone**: without `<Field>`, the consumer supplies an accessible label. The drop zone's built-in instruction text is not a substitute for a formal label in a form context.

**With ProgressBar reuse**: `ProgressBar` is already a shipped atom. The engineer imports it directly — no duplication of progress bar logic. `aria-labelledby` on each `<ProgressBar>` should reference the filename element's `id`.

**Not inside another drag context**: do not nest `FileUploader` inside another component that handles `dragover`/`drop` events. The drop event handlers call `event.stopPropagation()` to prevent bubbling, but nested drag contexts create unpredictable UX.

---

## 15. Out of scope

- Image thumbnail previews in the file list.
- Drag-to-reorder of listed files.
- Folder/directory upload (`webkitdirectory` attribute).
- Chunked or resumable upload logic.
- Remote URL input (paste a URL, download the file).
- File type icon differentiation (PDF vs image vs video glyph variants) — one generic file glyph for all types in v1.
- Inline progress percentage label (the bar communicates progress visually; a text percentage is the caller's responsibility if needed).
- A "clear all" affordance — consumers compose their own from `onFileRemoved` callbacks.
- `maxFiles` constraint — the autopost consumer does not require it; defer to v2 if a real surface needs it.

---

## Changelog

- **vNEXT** — new molecule, issue #399. No prior version.
