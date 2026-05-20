import {
  forwardRef,
  useId,
  cloneElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from "react";
import clsx from "clsx";
import styles from "./Field.module.css";

export interface FieldProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Visible label text. Rendered as `<label htmlFor={id}>`.
   * Required — every form field must have a visible label.
   */
  label: string;

  /**
   * The id of the input control. Used to wire `<label htmlFor>`.
   * Auto-generated via `useId` when not provided.
   */
  id?: string;

  /**
   * Optional helper text rendered below the control.
   * Uses `--fg-muted` typography (secondary register).
   * When both `helper` and `error` are present, `error` replaces `helper` visually
   * and the helper text is not rendered.
   */
  helper?: string;

  /**
   * Error message text. When set:
   *   - Replaces helper text visually.
   *   - Forces `invalid={true}` on the child control (via cloneElement).
   *   - Links the error message via `aria-describedby` on the child.
   */
  error?: string;

  /**
   * When true:
   *   - Adds a visible `*` indicator next to the label (aria-hidden).
   *   - Injects `required` onto the child control (via cloneElement).
   */
  required?: boolean;

  /**
   * Exactly one form control element (Input, Textarea, or any HTML form element).
   * Field clones this element to inject `id`, `aria-describedby`, `aria-invalid`,
   * and `required` props as needed.
   */
  children: ReactElement;
}

/**
 * Composition wrapper that wires a visible label, helper text, and error message
 * to a single form control.
 *
 * Field clones its `children` element to inject:
 *   - `id` (matches `<label htmlFor>`)
 *   - `aria-describedby` (points at helper and/or error message ids)
 *   - `aria-invalid="true"` (when `error` is set)
 *   - `required` (when `required` is set)
 *
 * Root is `<div>`. Ref forwarded to the root div.
 *
 * @example
 * // Email field with helper text:
 * <Field label="Email" id="email" helper="We'll never share your email.">
 *   <Input type="email" placeholder="you@example.com" />
 * </Field>
 *
 * @example
 * // Message field with error:
 * <Field label="Message" id="message" error="Message is required." required>
 *   <Textarea />
 * </Field>
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, id: idProp, helper, error, required, className, children, ...rest },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  // Build aria-describedby: include error id when error is set,
  // helper id when helper is set and there is no error.
  const describedByIds: string[] = [];
  if (error) {
    describedByIds.push(errorId);
  } else if (helper) {
    describedByIds.push(helperId);
  }

  const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(" ") : undefined;

  // Inject props into the child control via cloneElement.
  // Consumer-supplied props on the child take lower priority than Field-injected ones
  // for id and aria wiring; invalid and required are merged so both Field and direct
  // child props can set them.
  const childProps: Record<string, unknown> = {
    id,
  };
  if (ariaDescribedBy) {
    childProps["aria-describedby"] = ariaDescribedBy;
  }
  if (error) {
    childProps["invalid"] = true;
    childProps["aria-invalid"] = "true";
  }
  if (required) {
    childProps["required"] = true;
  }

  const clonedChild = cloneElement(children, childProps);

  return (
    <div ref={ref} className={clsx(styles.root, className)} {...rest}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>

      {clonedChild}

      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className={styles.helper}>
          {helper}
        </p>
      ) : null}
    </div>
  );
});

Field.displayName = "Field";
