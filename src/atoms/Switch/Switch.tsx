import { forwardRef } from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import styles from "./Switch.module.css";

export type SwitchProps = Omit<RadixSwitch.SwitchProps, "asChild">;

/**
 * Boolean-toggle primitive. Wraps `@radix-ui/react-switch` for accessible
 * semantics (`role="switch"`, `aria-checked`, keyboard via Space).
 *
 * Label is always external — supply a `<label htmlFor={id}>` or `aria-label`.
 *
 * @example
 *   // Uncontrolled
 *   <label htmlFor="notifications">Enable notifications</label>
 *   <Switch id="notifications" defaultChecked />
 *
 *   // Controlled
 *   <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Enable feature" />
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { className, ...rest },
  ref,
) {
  return (
    <RadixSwitch.Root
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <RadixSwitch.Thumb className={styles.thumb} />
    </RadixSwitch.Root>
  );
});

Switch.displayName = "Switch";
