import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Mark.module.css";

export interface MarkProps extends HTMLAttributes<HTMLElement> {
  /**
   * The highlighted content. Typically a short prose fragment.
   * ReactNode is accepted for parity with the rest of the atomic system;
   * idiomatic usage is a plain string or inline-flow markup.
   * Required.
   */
  children: ReactNode;
}

/**
 * Editorial highlight chip — an inline `<mark>` that flags a run of prose
 * as the part the reader should notice. The chip tints the background
 * with `--accent-glow` (the same value the system uses for text
 * selection) so the highlight reads as kindred to selected prose rather
 * than as a foreign decoration.
 *
 * Root is always `<mark>` (non-polymorphic). Non-interactive — no hover,
 * focus, or active states. Inherits `font-family`, `font-size`,
 * `font-weight`, `line-height`, and `color` from the surrounding
 * context, so the chip scales with parent text on every surface.
 *
 * `box-decoration-break: clone` ensures the highlight tiles cleanly
 * across line wraps.
 *
 * @example
 *   <p>The first deployment teaches more than <Mark>six months of staging</Mark>.</p>
 */
export const Mark = forwardRef<HTMLElement, MarkProps>(function Mark(
  { className, children, ...rest },
  ref,
) {
  return (
    <mark ref={ref} className={clsx(styles.root, className)} {...rest}>
      {children}
    </mark>
  );
});

Mark.displayName = "Mark";
