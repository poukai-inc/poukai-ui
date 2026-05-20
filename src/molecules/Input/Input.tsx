import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  /**
   * HTML input type. Constrained to single-line text-like types.
   * @default "text"
   */
  type?: "text" | "email" | "url" | "tel" | "password" | "search" | "number";

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
 * Single-line text input primitive.
 *
 * Non-polymorphic — root is always `<input>`. Ref forwarded to the input element.
 *
 * Idiomatic usage wraps this in `<Field>` which auto-wires `id`, `aria-invalid`,
 * `aria-describedby`, and `required`. Standalone usage is valid when the consumer
 * owns label association.
 *
 * @example
 * // Inside Field (recommended):
 * <Field label="Email" id="email">
 *   <Input type="email" placeholder="you@example.com" />
 * </Field>
 *
 * @example
 * // Standalone (consumer owns label):
 * <label htmlFor="search">Search</label>
 * <Input id="search" type="search" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = "text", invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={clsx(styles.root, className)}
      data-invalid={invalid ? "true" : undefined}
      aria-invalid={invalid ? "true" : undefined}
      {...rest}
    />
  );
});

Input.displayName = "Input";
