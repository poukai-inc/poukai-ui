import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  /**
   * HTML input type. Constrained to single-line text-like types.
   * @default "text"
   */
  type?: "text" | "email" | "url" | "tel" | "password" | "search" | "number";

  /**
   * Visual size — maps to the shared `--btn-h-*` height ladder so Input
   * visually pairs with Button at the same nominal size.
   * @default "md"
   */
  size?: InputSize;

  /**
   * When true, applies error-state styling via `data-invalid="true"` and
   * `aria-invalid="true"` on the root element.
   *
   * Prefer wiring through `<Field error="…">` — Field handles both the visual
   * state and the aria-describedby link.
   */
  invalid?: boolean;
}

const sizeClass: Record<InputSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
};

/**
 * Atom-layer single-line text input primitive.
 *
 * Non-polymorphic — root is always `<input>`. Ref forwarded to the input element.
 * Label, helper text, and error message are owned by `<Field>` (molecule).
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
 *
 * @example
 * // Paired with Button at matching size:
 * <div style={{ display: "flex", gap: "var(--space-2)" }}>
 *   <Input size="sm" placeholder="sm input" />
 *   <Button size="sm">Go</Button>
 * </div>
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = "text", size = "md", invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={clsx(styles.root, sizeClass[size], className)}
      data-invalid={invalid ? "true" : undefined}
      aria-invalid={invalid ? "true" : undefined}
      {...rest}
    />
  );
});

Input.displayName = "Input";
