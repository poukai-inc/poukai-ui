import { forwardRef, type ReactNode } from "react";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import clsx from "clsx";
import styles from "./Radio.module.css";

/* ------------------------------------------------------------------ */
/*  RadioGroup                                                          */
/* ------------------------------------------------------------------ */

export interface RadioGroupProps {
  /** Controlled selected value. */
  value?: string;
  /** Callback when selected value changes. */
  onValueChange?: (value: string) => void;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Native form field name for form submission. */
  name?: string;
  /**
   * Layout orientation.
   * - `"vertical"` (default) — column layout, `--space-2` gap.
   * - `"horizontal"` — row layout, `--space-4` gap.
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Accessible label for the group when no visible heading is nearby.
   * One of `aria-label` or `aria-labelledby` is required for AT users.
   */
  "aria-label"?: string;
  /** ID of the visible element that labels this group. */
  "aria-labelledby"?: string;
  /** Disable all items in the group. */
  disabled?: boolean;
  /** Mark the group as required for form validation. */
  required?: boolean;
  /** Additional class names merged onto the root element. */
  className?: string;
  /** `Radio` items and any wrapping label elements. */
  children: ReactNode;
}

/**
 * Container for a mutually-exclusive radio selection.
 *
 * Wraps `@radix-ui/react-radio-group` Root. Radix provides `role="radiogroup"`,
 * keyboard navigation (roving tabindex), and ARIA propagation at zero cost.
 *
 * **A11y:** pass either `aria-label` or `aria-labelledby` so screen-reader
 * users have group context. In development, a console warning fires when both
 * are absent.
 *
 * @example
 * ```tsx
 * <RadioGroup value={plan} onValueChange={setPlan} aria-label="Billing plan">
 *   <label><Radio value="monthly" /> Monthly</label>
 *   <label><Radio value="annual" /> Annual</label>
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    orientation = "vertical",
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    children,
    ...rest
  },
  ref,
) {
  if (
    process.env.NODE_ENV !== "production" &&
    ariaLabel === undefined &&
    ariaLabelledBy === undefined
  ) {
    console.warn(
      "[RadioGroup] No accessible label supplied. Pass either aria-label or " +
        "aria-labelledby so screen-reader users have group context.",
    );
  }

  return (
    <RadixRadioGroup.Root
      ref={ref}
      orientation={orientation}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={clsx(
        styles.group,
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        className,
      )}
      {...rest}
    >
      {children}
    </RadixRadioGroup.Root>
  );
});

RadioGroup.displayName = "RadioGroup";

/* ------------------------------------------------------------------ */
/*  Radio                                                               */
/* ------------------------------------------------------------------ */

export interface RadioProps {
  /**
   * The value this item represents within the `RadioGroup`.
   * Required — binds checked state to the group value.
   */
  value: string;
  /** Disable this individual item independent of the group. */
  disabled?: boolean;
  /** HTML id — used to pair with an explicit `<label htmlFor>`. */
  id?: string;
  /** Additional class names merged onto the root button element. */
  className?: string;
}

/**
 * Individual radio control inside a `RadioGroup`.
 *
 * Wraps `@radix-ui/react-radio-group` Item. Radix provides `role="radio"`,
 * `aria-checked`, and keyboard routing. The checked indicator is a CSS `::after`
 * pseudo on the Radix `Indicator` slot — no Lucide, no SVG, no `<Icon>`.
 *
 * Label pairing is always a consumer responsibility — see `RadioGroup` docs.
 *
 * @example
 * ```tsx
 * <label>
 *   <Radio value="option-a" />
 *   Option A
 * </label>
 * ```
 */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { value, disabled, id, className, ...rest },
  ref,
) {
  return (
    <RadixRadioGroup.Item
      ref={ref}
      value={value}
      disabled={disabled}
      id={id}
      className={clsx(styles.item, className)}
      {...rest}
    >
      <RadixRadioGroup.Indicator className={styles.indicator} />
    </RadixRadioGroup.Item>
  );
});

Radio.displayName = "Radio";
