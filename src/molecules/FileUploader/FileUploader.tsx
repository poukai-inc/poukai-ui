import {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
  useId,
  type ComponentPropsWithoutRef,
  type DragEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import clsx from "clsx";
import { ProgressBar } from "../../atoms/ProgressBar";
import styles from "./FileUploader.module.css";

/* ─────────────────────────── Types ───────────────────────────── */

export interface FileEntry {
  /** Stable identifier. Auto-generated via crypto.randomUUID or module counter. */
  id: string;
  /** The native File object. Never serialised to a URL or href. */
  file: File;
  /**
   * Upload progress 0–100. Undefined = no bar rendered.
   * Tone is "danger" when error is also set; "default" otherwise.
   */
  progress?: number;
  /**
   * Per-file validation or upload error message.
   * Triggers danger styling on the row.
   */
  error?: string;
}

export interface FileUploaderProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "required"
> {
  /** Forwarded to the hidden <input accept>. Also used for drop validation. */
  accept?: string;
  /** Maximum individual file size in bytes. Files exceeding this are rejected. */
  maxSizeBytes?: number;
  /** Allow selecting multiple files at once. @default true */
  multiple?: boolean;
  /** When true, the entire component is inert. @default false */
  disabled?: boolean;
  /**
   * Controlled file list. When provided, component is fully controlled.
   * When omitted, component manages its own internal state (uncontrolled).
   */
  files?: FileEntry[];
  /** Called when one or more new valid files have been added. */
  onFilesAdded?: (entries: FileEntry[]) => void;
  /** Called when the user removes a file by clicking its remove button. */
  onFileRemoved?: (id: string) => void;
  /**
   * Called for every file that fails accept or maxSizeBytes validation.
   * The FileEntry is fully constructed with error set and is NOT added to the accepted list.
   */
  onFileRejected?: (entry: FileEntry) => void;
  /** Override the primary instruction line in the drop zone. */
  dropZoneLabel?: string;
  /** Merged onto the root <div> via clsx. Consumer owns width. */
  className?: string;
  /**
   * Forwarded to the hidden <input required>.
   * Injected by <Field required> via cloneElement.
   */
  required?: boolean;
}

/* ─────────────────────── ID generation ─────────────────────── */

let _counter = 0;
function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `file-entry-${++_counter}`;
}

/* ──────────────────── Validation helpers ───────────────────── */

function humanReadableSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function matchesAccept(file: File, accept: string): boolean {
  const parts = accept
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return true;

  for (const part of parts) {
    if (part.startsWith(".")) {
      // Extension check
      if (file.name.toLowerCase().endsWith(part.toLowerCase())) return true;
    } else if (part.endsWith("/*")) {
      // MIME wildcard, e.g. "image/*"
      const category = part.slice(0, -2);
      if (file.type.startsWith(category + "/")) return true;
    } else {
      // Exact MIME match
      if (file.type === part) return true;
    }
  }
  return false;
}

function validateFile(
  file: File,
  accept: string | undefined,
  maxSizeBytes: number | undefined,
): string | null {
  if (accept && !matchesAccept(file, accept)) {
    return "File type not supported";
  }
  if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
    return `File exceeds maximum size of ${humanReadableSize(maxSizeBytes)}`;
  }
  return null;
}

/* ──────────────────────── Inline SVGs ─────────────────────────
   All three are module-level constants — no re-creation on render.
   All are aria-hidden="true" and use currentColor.
─────────────────────────────────────────────────────────────── */

const UploadGlyph = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    width="24"
    height="24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="currentColor"
  >
    <line x1="12" y1="16" x2="12" y2="4" />
    <polyline points="8 8 12 4 16 8" />
    <line x1="4" y1="20" x2="20" y2="20" />
  </svg>
);

const FileGlyph = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    width="16"
    height="16"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="currentColor"
  >
    <path d="M3 2 L11 2 L13 4 L13 14 L3 14 Z" />
    <polyline points="11 2 11 4 13 4" />
  </svg>
);

const RemoveGlyph = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    width="16"
    height="16"
    strokeWidth="1.5"
    strokeLinecap="round"
    stroke="currentColor"
  >
    <line x1="4" y1="4" x2="12" y2="12" />
    <line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

/* ──────────────────────── Component ───────────────────────── */

/**
 * FileUploader — drag-and-drop file selection with per-file progress and validation.
 *
 * Uncontrolled by default (manages its own FileEntry[] state).
 * Controlled when `files` prop is provided.
 * Both modes fire onFilesAdded / onFileRemoved / onFileRejected.
 *
 * No remote upload logic. The component collects local File objects only.
 * The caller owns the upload transport.
 *
 * @example
 * // Zero-config uncontrolled:
 * <FileUploader accept="image/*,application/pdf" maxSizeBytes={10485760} />
 *
 * @example
 * // Controlled (React Hook Form):
 * <FileUploader files={files} onFilesAdded={(e) => setFiles((p) => [...p, ...e])} onFileRemoved={(id) => setFiles((p) => p.filter((f) => f.id !== id))} />
 *
 * @example
 * // Inside Field:
 * <Field label="Attach media" helper="JPEG, PNG · max 5 MB" id="media-upload">
 *   <FileUploader accept="image/*" maxSizeBytes={5242880} />
 * </Field>
 */
export const FileUploader = forwardRef<HTMLDivElement, FileUploaderProps>(function FileUploader(
  {
    accept,
    maxSizeBytes,
    multiple = true,
    disabled = false,
    files: controlledFiles,
    onFilesAdded,
    onFileRemoved,
    onFileRejected,
    dropZoneLabel = "Drag files here, or click to browse",
    className,
    // Accept Field-injected props and forward to the hidden input
    id: idProp,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    required,
    ...rest
  },
  ref,
) {
  const isControlled = controlledFiles !== undefined;

  const [internalFiles, setInternalFiles] = useState<FileEntry[]>([]);
  const files = isControlled ? controlledFiles : internalFiles;

  const [dragState, setDragState] = useState<"idle" | "valid" | "invalid">("idle");
  const [zoneError, setZoneError] = useState<string | null>(null);

  // Live region announcements
  const [liveMessage, setLiveMessage] = useState<string>("");
  // Drag-state live region (assertive)
  const [dragLiveMessage, setDragLiveMessage] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const liveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for remove-button focus management: keyed by entry id
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const autoId = useId();
  const inputId = idProp ?? `file-uploader-input-${autoId}`;
  const zoneInstructionId = `file-uploader-label-${autoId}`;

  // Clear live message timer on unmount
  useEffect(() => {
    return () => {
      if (liveTimerRef.current !== null) {
        clearTimeout(liveTimerRef.current);
      }
    };
  }, []);

  function announce(message: string) {
    setLiveMessage(message);
    if (liveTimerRef.current !== null) clearTimeout(liveTimerRef.current);
    liveTimerRef.current = setTimeout(() => {
      setLiveMessage("");
      liveTimerRef.current = null;
    }, 3000);
  }

  const processFiles = useCallback(
    (rawFiles: File[]) => {
      const accepted: FileEntry[] = [];
      const rejected: FileEntry[] = [];

      for (const file of rawFiles) {
        const error = validateFile(file, accept, maxSizeBytes);
        const entry: FileEntry = { id: generateId(), file };
        if (error) {
          rejected.push({ ...entry, error });
        } else {
          accepted.push(entry);
        }
      }

      // Handle multiple=false: only accept first file, zone-error for multi-drop
      if (!multiple && rawFiles.length > 1) {
        setZoneError("Only one file can be selected at a time");
        const firstRaw = rawFiles[0];
        if (firstRaw) {
          const singleError = validateFile(firstRaw, accept, maxSizeBytes);
          const singleEntry: FileEntry = { id: generateId(), file: firstRaw };
          if (singleError) {
            rejected.push({ ...singleEntry, error: singleError });
          } else {
            accepted.splice(0, accepted.length, singleEntry);
          }
        }
        accepted.splice(1); // keep at most one
      } else if (accepted.length > 0 || rejected.length === 0) {
        setZoneError(null);
      }

      for (const entry of rejected) {
        onFileRejected?.(entry);
        announce(`${entry.file.name} rejected: ${entry.error ?? "File not accepted"}`);
      }

      if (accepted.length > 0) {
        if (!isControlled) {
          setInternalFiles((prev) => [...prev, ...accepted]);
        }
        onFilesAdded?.(accepted);
        for (const entry of accepted) {
          announce(`${entry.file.name} added`);
        }
      }
    },
    [accept, maxSizeBytes, multiple, isControlled, onFilesAdded, onFileRejected],
  );

  /* ─── Drag handlers ─── */

  function checkDragValidity(dt: DataTransfer): boolean {
    const items = Array.from(dt.items);
    if (items.length === 0) return true;
    if (!accept) return true;
    // Best-effort check on drag (types may be empty for security reasons)
    return items.every((item) => {
      if (item.kind !== "file") return false;
      if (!item.type) return true; // type unknown during drag, allow
      return matchesAccept({ name: "", type: item.type } as File, accept);
    });
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const valid = checkDragValidity(e.dataTransfer);
    setDragState(valid ? "valid" : "invalid");
    setDragLiveMessage("Drop files here");
  }

  function handleDragEnter(e: DragEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const valid = checkDragValidity(e.dataTransfer);
    setDragState(valid ? "valid" : "invalid");
    setDragLiveMessage("Drop files here");
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    if (disabled) return;
    e.stopPropagation();
    // Only clear if leaving the zone itself (not a child)
    if (zoneRef.current && !zoneRef.current.contains(e.relatedTarget as Node)) {
      setDragState("idle");
      setDragLiveMessage("");
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setDragState("idle");
    setDragLiveMessage("");
    setZoneError(null);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }

  /* ─── Input change ─── */

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input value so the same file can be re-selected
    e.target.value = "";
  }

  /* ─── Zone click/key ─── */

  function openFileDialog() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function handleZoneKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFileDialog();
    }
  }

  /* ─── Remove ─── */

  function handleRemove(id: string, fileName: string) {
    // Find current index for focus management
    const currentIndex = files.findIndex((f) => f.id === id);
    const remaining = files.filter((f) => f.id !== id);

    if (!isControlled) {
      setInternalFiles(remaining);
    }
    onFileRemoved?.(id);
    announce(`${fileName} removed`);

    // Move focus: to next row's remove button, or previous, or drop zone
    // Use rAF to wait for re-render
    requestAnimationFrame(() => {
      if (remaining.length === 0) {
        zoneRef.current?.focus();
        return;
      }
      // Prefer next, fall back to previous
      const targetIndex = currentIndex < remaining.length ? currentIndex : currentIndex - 1;
      const targetId = remaining[targetIndex]?.id;
      if (targetId) {
        const btn = removeButtonRefs.current.get(targetId);
        btn?.focus();
      } else {
        zoneRef.current?.focus();
      }
    });
  }

  /* ─── Hint text ─── */

  const hintParts: string[] = [];
  if (accept) hintParts.push(accept);
  if (maxSizeBytes !== undefined) hintParts.push(`max ${humanReadableSize(maxSizeBytes)}`);
  const hintText = hintParts.join("  ·  ");

  /* ─── Zone class ─── */

  const zoneClass = clsx(
    styles.zone,
    dragState === "valid" && styles.zoneValid,
    dragState === "invalid" && styles.zoneInvalid,
    disabled && styles.zoneDisabled,
  );

  /* ─── Render ─── */

  return (
    <div ref={ref} className={clsx(styles.root, className)} {...rest}>
      {/* Drop zone */}
      <div
        ref={zoneRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-labelledby={zoneInstructionId}
        className={zoneClass}
        onClick={openFileDialog}
        onKeyDown={handleZoneKeyDown}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className={styles.zoneGlyph}>{UploadGlyph}</span>

        <span id={zoneInstructionId} className={styles.zoneLabel}>
          {dropZoneLabel}
        </span>

        {hintText && <span className={styles.zoneHint}>{hintText}</span>}
      </div>

      {/* Visually hidden file input — outside role="button" to avoid nested-interactive.
          Labelled via zoneInstructionId so axe sees a valid label association.
          tabIndex={-1} keeps it out of the tab order (the zone div handles keyboard). */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className={styles.hiddenInput}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-labelledby={zoneInstructionId}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        required={required}
        onChange={handleInputChange}
        tabIndex={-1}
      />

      {/* Zone-level error */}
      {zoneError && (
        <p role="alert" className={styles.zoneError}>
          {zoneError}
        </p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <ul className={styles.fileList} aria-label="Selected files">
          {files.map((entry) => {
            const hasError = Boolean(entry.error);
            const hasProgress = entry.progress !== undefined;
            const sizeText = humanReadableSize(entry.file.size);
            const progressBarLabelId = `file-name-${entry.id}`;

            return (
              <li key={entry.id} className={clsx(styles.fileRow, hasError && styles.fileRowError)}>
                {/* Top sub-row: glyph + name + size + remove */}
                <div className={styles.fileRowTop}>
                  <span className={styles.fileGlyph} aria-hidden="true">
                    {FileGlyph}
                  </span>
                  <span id={progressBarLabelId} className={styles.fileName} title={entry.file.name}>
                    {entry.file.name}
                  </span>
                  <span className={styles.fileSize}>{sizeText}</span>
                  <button
                    ref={(el) => {
                      if (el) {
                        removeButtonRefs.current.set(entry.id, el);
                      } else {
                        removeButtonRefs.current.delete(entry.id);
                      }
                    }}
                    type="button"
                    aria-label={`Remove ${entry.file.name}`}
                    className={styles.removeButton}
                    disabled={disabled}
                    onClick={() => handleRemove(entry.id, entry.file.name)}
                  >
                    {RemoveGlyph}
                  </button>
                </div>

                {/* ProgressBar — labelled by the filename span when name is
                    non-empty; falls back to a static aria-label when the name
                    is empty (e.g. controlled entries passed through a
                    serialisation boundary in tests, or a genuinely unnamed
                    File object). Both paths satisfy the aria-progressbar-name
                    axe rule in production and in CT. */}
                {hasProgress &&
                  entry.progress !== undefined &&
                  (entry.file.name ? (
                    <ProgressBar
                      value={entry.progress}
                      size="sm"
                      tone={hasError ? "danger" : "default"}
                      aria-labelledby={progressBarLabelId}
                      className={styles.progressBar}
                    />
                  ) : (
                    <ProgressBar
                      value={entry.progress}
                      size="sm"
                      tone={hasError ? "danger" : "default"}
                      aria-label="Upload progress"
                      className={styles.progressBar}
                    />
                  ))}

                {/* Per-file error */}
                {hasError && (
                  <span className={styles.fileError} role="alert">
                    {entry.error}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Polite live region for file add/remove/reject announcements */}
      <div aria-live="polite" aria-atomic="false" className={styles.liveRegion}>
        {liveMessage}
      </div>

      {/* Assertive live region for time-sensitive drag-state announcement */}
      <div aria-live="assertive" aria-atomic="true" className={styles.liveRegion}>
        {dragLiveMessage}
      </div>
    </div>
  );
});

FileUploader.displayName = "FileUploader";
