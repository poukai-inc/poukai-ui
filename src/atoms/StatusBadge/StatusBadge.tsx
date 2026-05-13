import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./StatusBadge.module.css";

export type StatusBadgeStatus = "available" | "idle" | "closed";

export interface StatusBadgeProps extends ComponentPropsWithoutRef<"p"> {
  /** Visual + semantic state. */
  status?: StatusBadgeStatus;
}

/**
 * Inline availability badge — a colored dot plus a short caption.
 * Matches the pattern from the holding page hero. Pulse only animates
 * when `status="available"` and the user hasn't requested reduced motion.
 */
export const StatusBadge = forwardRef<HTMLParagraphElement, StatusBadgeProps>(function StatusBadge(
  { status = "available", className, children, ...rest },
  ref,
) {
  return (
    <p ref={ref} className={clsx(styles.root, className)} {...rest}>
      <span className={styles.dot} data-status={status} aria-hidden="true">
        {status === "available" && <span className={styles.pulse} />}
      </span>
      <span>{children}</span>
    </p>
  );
});
