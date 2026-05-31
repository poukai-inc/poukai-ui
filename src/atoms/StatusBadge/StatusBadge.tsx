import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./StatusBadge.module.css";

export type StatusBadgeStatus = "available" | "idle" | "closed";
export type StatusBadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";

export interface StatusBadgeProps extends ComponentPropsWithoutRef<"p"> {
  /** Legacy status prop. Maps to tone internally. `tone` takes precedence when both are set. */
  status?: StatusBadgeStatus;
  /** Semantic tone controlling dot color. Takes precedence over `status` when both are set. */
  tone?: StatusBadgeTone;
  /** Whether the pulse animation plays. Defaults false; `status="available"` sets it true unless overridden. */
  pulse?: boolean;
  children: ReactNode;
}

/**
 * Inline status badge — a colored dot plus a short caption.
 *
 * Two parallel APIs share one atom:
 * - **`tone`** (primary, generic): drives the dot color via `data-tone` across
 *   the six tones. Use this for arbitrary status indicators.
 * - **`status`** (legacy availability): drives the dot via `data-status` with
 *   the original three colors (`available` blue + halo + pulse, `idle` muted,
 *   `closed` near-black). Preserved unchanged for back-compat.
 *
 * When both are set, `tone` wins (the `status` path is skipped). With neither,
 * the legacy default is `status="available"`.
 */
export const StatusBadge = forwardRef<HTMLParagraphElement, StatusBadgeProps>(function StatusBadge(
  { status, tone, pulse, className, children, ...rest },
  ref,
) {
  const usingTone = tone !== undefined;
  // Legacy availability default — absent status behaves as "available".
  const resolvedStatus: StatusBadgeStatus = status ?? "available";

  // Pulse: explicit `pulse` wins; otherwise only the legacy available state pulses.
  const resolvedPulse: boolean =
    pulse !== undefined ? pulse : !usingTone && resolvedStatus === "available";

  // One attribute per path: tone → data-tone (6 generic tones), status →
  // data-status (3 legacy availability colors). CSS keys off whichever is set.
  const dotAttr = usingTone ? { "data-tone": tone } : { "data-status": resolvedStatus };

  return (
    <p ref={ref} className={clsx(styles.root, className)} {...rest}>
      <span className={styles.dot} {...dotAttr} aria-hidden="true">
        {resolvedPulse && <span className={styles.pulse} />}
      </span>
      <span>{children}</span>
    </p>
  );
});

StatusBadge.displayName = "StatusBadge";
