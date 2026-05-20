import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Textarea.module.css";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  /**
   * When true, applies error-state styling via `data-invalid="true"` and
   * `aria-invalid="true"` on the root element.
   *
   * Prefer wiring this through `<Field error="…">` rather than setting it
   * directly — Field handles both the visual state and the aria-describedby link.
   */
  invalid?: boolean;
}

/**
 * Multi-line textarea primitive.
 *
 * Non-polymorphic — root is always `<textarea>`. Ref forwarded to the textarea element.
 * Defaults to `rows={4}` and `resize: vertical`.
 *
 * Idiomatic usage wraps this in `<Field>` which auto-wires `id`, `aria-invalid`,
 * `aria-describedby`, and `required`. Standalone usage is valid when the consumer
 * owns label association.
 *
 * @example
 * // Inside Field (recommended):
 * <Field label="Message" id="message">
 *   <Textarea placeholder="Tell us about your project…" rows={6} />
 * </Field>
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, rows = 4, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={clsx(styles.root, className)}
      data-invalid={invalid ? "true" : undefined}
      aria-invalid={invalid ? "true" : undefined}
      {...rest}
    />
  );
});

Textarea.displayName = "Textarea";
