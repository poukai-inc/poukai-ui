import {
  forwardRef,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import clsx from "clsx";
import styles from "./FormRow.module.css";

export type FormRowGap = "default" | "tight";

export interface FormRowProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Column gap between Fields.
   * - `"default"` — `--space-4` (1rem). Matches the vertical gap between stacked Fields.
   * - `"tight"` — `--space-2` (0.5rem). For utility-dense contexts (address lines, filter bars).
   *
   * @default "default"
   */
  gap?: FormRowGap;

  /**
   * Explicit column count. When provided, forces this many equal-width columns
   * regardless of child count. Defaults to `auto-fill` (1fr per child, auto-placed).
   */
  columns?: number;

  /**
   * One or more `Field` molecule instances.
   * 2–4 children recommended; more than 4 reads as cramped.
   */
  children: ReactNode;
}

/**
 * Horizontal multi-Field layout molecule.
 *
 * Places two or more `Field` instances side-by-side with consistent column
 * widths and gap rhythm, then collapses to a single-column stack below the
 * `--bp-md` breakpoint.
 *
 * Root element: `<div>`. No landmark semantics — purely a layout wrapper.
 * Ref forwarded to `HTMLDivElement`.
 *
 * @example
 * // First name / Last name row
 * <FormRow>
 *   <Field label="First name" id="first-name"><Input /></Field>
 *   <Field label="Last name" id="last-name"><Input /></Field>
 * </FormRow>
 *
 * @example
 * // City / State / Zip with tight gap
 * <FormRow gap="tight" columns={3}>
 *   <Field label="City" id="city"><Input /></Field>
 *   <Field label="State" id="state"><Input /></Field>
 *   <Field label="ZIP" id="zip"><Input /></Field>
 * </FormRow>
 */
export const FormRow = forwardRef<HTMLDivElement, FormRowProps>(function FormRow(
  { gap = "default", columns, className, style, children, ...rest },
  ref,
) {
  const hasExplicitColumns = columns != null;
  const columnVars = hasExplicitColumns
    ? ({ "--formrow-columns": String(columns) } as CSSProperties)
    : undefined;

  return (
    <div
      ref={ref}
      className={clsx(
        styles.root,
        hasExplicitColumns && styles.columns,
        gap === "tight" && styles.gapTight,
        className,
      )}
      style={columnVars != null ? { ...columnVars, ...style } : style}
      {...rest}
    >
      {children}
    </div>
  );
});

FormRow.displayName = "FormRow";
