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

const STATUS_TONE_MAP: Record<StatusBadgeStatus, StatusBadgeTone> = {
  available: "accent",
  idle: "neutral",
  closed: "neutral",
};

/**
 * Inline availability badge — a colored dot plus a short caption.
 *
 * The `tone` prop is the primary API. The legacy `status` prop is still
 * supported and maps to a tone internally — `status="available"` is
 * equivalent to `tone="accent" pulse`. When both `tone` and `status` are
 * provided, `tone` wins.
 */
export const StatusBadge = forwardRef<HTMLParagraphElement, StatusBadgeProps>(function StatusBadge(
  { status, tone, pulse, className, children, ...rest },
  ref,
) {
  // Resolve tone: explicit `tone` wins; otherwise map from `status`.
  const resolvedTone: StatusBadgeTone = tone ?? (status ? STATUS_TONE_MAP[status] : "accent");

  // Resolve pulse: explicit `pulse` prop wins; otherwise pulse for the legacy
  // availability default — no explicit tone AND status is "available" or absent
  // (no-prop legacy behavior: status defaulted to "available").
  const resolvedPulse: boolean =
    pulse !== undefined
      ? pulse
      : tone === undefined && (status === undefined || status === "available");

  return (
    <p ref={ref} className={clsx(styles.root, className)} {...rest}>
      <span className={styles.dot} data-tone={resolvedTone} aria-hidden="true">
        {resolvedPulse && <span className={styles.pulse} />}
      </span>
      <span>{children}</span>
    </p>
  );
});

StatusBadge.displayName = "StatusBadge";
