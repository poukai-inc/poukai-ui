import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Code.module.css";

export interface CodeProps extends ComponentPropsWithoutRef<"code"> {
  /**
   * The literal content. Typically a plain string.
   * ReactNode is accepted for parity with the rest of the atomic system;
   * idiomatic usage is a plain string.
   * Required.
   */
  children: ReactNode;
}

/**
 * Inline code chip — communicates that the wrapped content is a literal
 * token (variable name, CSS custom property, HTML element, shell command,
 * config key).
 *
 * Root is always `<code>` (non-polymorphic). Non-interactive — no hover,
 * focus, or active states. Font size is relative (`0.9em`) so the chip
 * tracks the surrounding text register on any surface.
 *
 * @example
 *   <p>Override <Code>--accent</Code> in your theme.</p>
 */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { className, children, ...rest },
  ref,
) {
  return (
    <code ref={ref} className={clsx(styles.root, className)} {...rest}>
      {children}
    </code>
  );
});

Code.displayName = "Code";
