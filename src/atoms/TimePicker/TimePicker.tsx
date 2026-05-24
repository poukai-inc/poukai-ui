import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./TimePicker.module.css";

export type TimePickerSize = "sm" | "md" | "lg";

export interface TimePickerProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "size" | "onChange"
> {
  /**
   * Controlled `HH:mm` value.
   */
  value?: string;

  /**
   * Uncontrolled seed value (`"HH:mm"`).
   */
  defaultValue?: string;

  /**
   * Fires on change; provides current `input.value`.
   */
  onValueChange?: (value: string) => void;

  /**
   * Step in seconds. 900 = 15-min steps, 1800 = 30-min, 3600 = 1h.
   * @default 60
   */
  step?: number;

  /**
   * Minimum time (`"HH:mm"`).
   */
  min?: string;

  /**
   * Maximum time (`"HH:mm"`).
   */
  max?: string;

  /**
   * Dims + blocks interaction; `--surface` bg.
   * @default false
   */
  disabled?: boolean;

  /**
   * Red border via `--danger`; consumer passes after validation.
   * @default false
   */
  invalid?: boolean;

  /**
   * Visual size — maps to the shared `--btn-h-*` height ladder.
   * @default "md"
   */
  size?: TimePickerSize;
}

const sizeClass: Record<TimePickerSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
};

/**
 * Atom-layer time-of-day input primitive.
 *
 * Styled wrapper around native `<input type="time">`. Produces a valid
 * `HH:mm` string. Compose with `<Field>` for label + error anatomy.
 *
 * @example
 * // Inside Field (recommended):
 * <Field label="Preferred time" id="pref-time">
 *   <TimePicker id="pref-time" onValueChange={setTime} />
 * </Field>
 *
 * @example
 * // Controlled:
 * <TimePicker value={time} onValueChange={setTime} step={900} />
 */
export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  { size = "md", invalid, onValueChange, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type="time"
      className={clsx(styles.root, sizeClass[size], className)}
      data-invalid={invalid ? "true" : undefined}
      aria-invalid={invalid ? "true" : undefined}
      onChange={
        onValueChange
          ? (e) => {
              onValueChange(e.currentTarget.value);
            }
          : undefined
      }
      {...rest}
    />
  );
});

TimePicker.displayName = "TimePicker";
