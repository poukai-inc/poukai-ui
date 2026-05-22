import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Textarea.module.css";

export type TextareaResize = "vertical" | "none" | "both";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  /**
   * Number of visible text lines. Drives the natural rendered height.
   * @default 3
   */
  rows?: number;

  /**
   * Controls the CSS `resize` axis on the root element.
   *
   * - `"vertical"` (default) — user can grow/shrink height; width locked.
   * - `"none"` — resize handle hidden; height fixed by `rows`.
   * - `"both"` — both axes draggable; use sparingly.
   *
   * @default "vertical"
   */
  resize?: TextareaResize;

  /**
   * When true, applies error-state styling via `data-invalid="true"` and
   * `aria-invalid="true"` on the root element.
   *
   * Prefer wiring this through `<Field error="…">` rather than setting it
   * directly — Field handles both the visual state and the aria-describedby link.
   */
  invalid?: boolean;
}

const resizeClass: Record<TextareaResize, string> = {
  vertical: styles.resizeVertical!,
  none: styles.resizeNone!,
  both: styles.resizeBoth!,
};

/**
 * Multi-line textarea primitive (atom).
 *
 * Non-polymorphic — root is always `<textarea>`. Ref forwarded to the textarea element.
 * Defaults: `rows={3}`, `resize="vertical"`. Padding is symmetric (`--space-3` on all
 * four sides) — the only visual delta from the `Input` atom, which uses asymmetric
 * block/inline padding.
 *
 * Label, helper text, and error message live in `<Field>`, never on the Textarea
 * itself. Standalone usage is valid when the consumer owns label association.
 *
 * No autosize behavior in v1 — track that as a future utility hook.
 *
 * @example
 * // Inside Field (recommended):
 * <Field label="Message" id="message">
 *   <Textarea placeholder="Tell us about your project…" rows={6} />
 * </Field>
 *
 * @example
 * // Standalone (consumer owns label):
 * <label htmlFor="notes">Notes</label>
 * <Textarea id="notes" rows={4} />
 *
 * @example
 * // Resize locked:
 * <Textarea rows={2} resize="none" />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, rows = 3, resize = "vertical", className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={clsx(styles.root, resizeClass[resize], className)}
      data-invalid={invalid ? "true" : undefined}
      aria-invalid={invalid ? "true" : undefined}
      {...rest}
    />
  );
});

Textarea.displayName = "Textarea";
