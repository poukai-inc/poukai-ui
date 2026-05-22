import { forwardRef } from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import styles from "./Checkbox.module.css";

/** Mirrors Radix CheckedState: boolean | "indeterminate" */
export type CheckboxCheckedState = RadixCheckbox.CheckedState;

// All Radix Checkbox.Root props forwarded:
//   checked, defaultChecked, onCheckedChange, disabled, required,
//   name, value, id, aria-label, aria-labelledby, aria-describedby,
//   aria-invalid, className, data-*, etc.
//
// There is no `size` prop — 16x16px is the only size.
// There is no indicator slot — Check/Minus icons are fixed by the DS.
export type CheckboxProps = Omit<RadixCheckbox.CheckboxProps, "asChild">;

/**
 * Checkbox atom — boolean-selection control with unchecked / checked /
 * indeterminate states. Wraps `@radix-ui/react-checkbox`.
 *
 * Label-agnostic: supply an `aria-label` directly or wire an external
 * `<label htmlFor={id}>` at the molecule layer.
 *
 * @example
 *   // Uncontrolled
 *   <Checkbox defaultChecked id="agree" aria-label="I agree to the terms" />
 *
 *   // Controlled
 *   <Checkbox checked={isChecked} onCheckedChange={setIsChecked} aria-label="Select all" />
 *
 *   // Indeterminate
 *   <Checkbox checked="indeterminate" aria-label="Select all (partial)" />
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { className, ...rest },
  ref,
) {
  return (
    <RadixCheckbox.Root
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <RadixCheckbox.Indicator className={styles.indicator}>
        {/* Lucide icons are decorative — state is communicated by aria-checked on root */}
        <Check
          aria-hidden="true"
          className={styles.iconCheck}
          width={12}
          height={12}
          strokeWidth={2.5}
        />
        <Minus
          aria-hidden="true"
          className={styles.iconMinus}
          width={12}
          height={12}
          strokeWidth={2.5}
        />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
});

Checkbox.displayName = "Checkbox";
