import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Select.module.css";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps extends Omit<ComponentPropsWithoutRef<"select">, "size"> {
  /**
   * Visual size — maps to the shared `--btn-h-*` height ladder so Select
   * visually pairs with Input and Button at the same nominal size.
   * @default "md"
   */
  size?: SelectSize;

  /**
   * When true, applies error-state styling via `data-invalid="true"` and
   * `aria-invalid="true"` on the root element.
   *
   * Prefer wiring through `<Field error="…">` — Field handles both the visual
   * state and the aria-describedby link.
   */
  invalid?: boolean;
}

const sizeClass: Record<SelectSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
};

/**
 * Atom-layer native `<select>` primitive.
 *
 * Non-polymorphic — root is always `<select>`. Ref forwarded to the select element.
 * Children are consumer-supplied `<option>` / `<optgroup>` nodes.
 * Label, helper text, and error message are owned by `<Field>` (molecule).
 *
 * The trailing caret is rendered via a CSS `background-image` SVG data URL —
 * it cannot be a child Icon because platform menus discard arbitrary children
 * inside `<select>`. The native `size` attribute is shadowed by the DS `size`
 * prop; use `multiple` for a multi-row listbox.
 *
 * @example
 * // Inside Field (recommended):
 * <Field label="Country" id="country">
 *   <Select name="country" defaultValue="us">
 *     <option value="us">United States</option>
 *     <option value="ca">Canada</option>
 *   </Select>
 * </Field>
 *
 * @example
 * // Standalone (consumer owns label):
 * <label htmlFor="sort">Sort by</label>
 * <Select id="sort" size="sm">
 *   <option value="recent">Most recent</option>
 *   <option value="popular">Most popular</option>
 * </Select>
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size = "md", invalid, className, children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={clsx(styles.root, sizeClass[size], className)}
      data-invalid={invalid ? "true" : undefined}
      aria-invalid={invalid ? "true" : undefined}
      {...rest}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";
