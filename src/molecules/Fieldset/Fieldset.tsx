import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Fieldset.module.css";

export interface FieldsetProps extends ComponentPropsWithoutRef<"fieldset"> {
  /**
   * The group label text. Rendered as `<legend>` — the first child of `<fieldset>`
   * so AT announces the group context before the individual fields.
   * Required — a Fieldset without a legend has no accessible group name.
   */
  legend: string;

  /**
   * Controls the vertical gap between Field children.
   * `"default"` → `--space-4` (16 px); `"spacious"` → `--space-6` (24 px).
   * @default "default"
   */
  spacing?: "default" | "spacious";

  /**
   * When true: adds `--surface` background, `--hairline` border, `--radius-3`
   * corner, and `--space-8` / `--space-6` block / inline padding.
   * Use for visually contained groups (e.g. payment block inside a larger form).
   * @default false
   */
  bordered?: boolean;

  /**
   * Controls the legend text color.
   * `"default"` → `--fg`; `"muted"` → `--fg-muted` (secondary / optional sections).
   * @default "default"
   */
  legendTone?: "default" | "muted";

  /**
   * Maps to native `<fieldset disabled>`, which propagates the disabled state to
   * all descendant form controls automatically — no per-field prop threading needed.
   * @default false
   */
  disabled?: boolean;

  /**
   * `<Field>` molecules or `<FormRow>` molecules that belong to this group.
   */
  children: ReactNode;
}

/**
 * Groups related `<Field>` molecules under a shared semantic `<legend>`,
 * enforcing consistent vertical spacing between fields and a clear visual
 * boundary around the group.
 *
 * Root element: `<fieldset>`. Ref forwarded to the root `<fieldset>`.
 * `...rest` spread passes `data-*`, `aria-*`, `className`, `style`, etc.
 *
 * @example
 * // Billing address block:
 * <Fieldset legend="Billing address">
 *   <Field label="Street" id="street"><Input /></Field>
 *   <Field label="City" id="city"><Input /></Field>
 *   <Field label="Postal code" id="postal"><Input /></Field>
 * </Fieldset>
 *
 * @example
 * // Contained payment block with spacious spacing:
 * <Fieldset legend="Payment details" bordered spacing="spacious">
 *   <Field label="Card number" id="card"><Input /></Field>
 *   <Field label="Expiry" id="expiry"><Input /></Field>
 * </Fieldset>
 */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  {
    legend,
    spacing = "default",
    bordered = false,
    legendTone = "default",
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <fieldset
      ref={ref}
      disabled={disabled}
      className={clsx(styles.root, bordered && styles.bordered, className)}
      {...rest}
    >
      <legend className={clsx(styles.legend, legendTone === "muted" && styles.legendMuted)}>
        {legend}
      </legend>
      <div className={clsx(styles.fields, spacing === "spacious" && styles.spacious)}>
        {children}
      </div>
    </fieldset>
  );
});

Fieldset.displayName = "Fieldset";
