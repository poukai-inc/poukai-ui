import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./ProgressBar.module.css";

export type ProgressBarSize = "sm" | "md";
export type ProgressBarTone = "default" | "success" | "warning" | "danger";

/**
 * Labeling constraint: exactly one of `aria-label` or `aria-labelledby` must
 * be provided. Enforced at the TypeScript type level via discriminated union.
 */
type WithAriaLabel = {
  "aria-label": string;
  "aria-labelledby"?: never;
};

type WithAriaLabelledBy = {
  "aria-label"?: never;
  "aria-labelledby": string;
};

type LabelingProps = WithAriaLabel | WithAriaLabelledBy;

type ProgressBarBaseProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "aria-label" | "aria-labelledby" | "role" | "aria-valuemin" | "aria-valuemax" | "aria-valuenow"
> & {
  /**
   * 0–100. Omitting activates indeterminate mode.
   * Out-of-range values are clamped to [0, 100].
   */
  value?: number;
  /** Track height: sm=2px, md=4px. Default: "md". */
  size?: ProgressBarSize;
  /** Fill color. Default: "default" (uses --fg). */
  tone?: ProgressBarTone;
};

export type ProgressBarProps = ProgressBarBaseProps & LabelingProps;

const toneClass: Record<ProgressBarTone, string> = {
  default: styles.toneDefault!,
  success: styles.toneSuccess!,
  warning: styles.toneWarning!,
  danger: styles.toneDanger!,
};

const sizeClass: Record<ProgressBarSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
};

/**
 * Linear progress indicator for known-length operations (determinate) or
 * unknown-length operations (indeterminate).
 *
 * - Determinate: pass `value` (0–100). Fill scales via `transform: scaleX` —
 *   never `width`. Transition uses `--dur-mid` and `--easing`.
 * - Indeterminate: omit `value`. Two bars sweep left→right via keyframes
 *   `poukai-progress-bar1` / `poukai-progress-bar2`.
 * - Labeling: exactly one of `aria-label` or `aria-labelledby` is required.
 *   Both absent is a TypeScript type error.
 * - Under `prefers-reduced-motion: reduce`: determinate snaps (no transition);
 *   indeterminate shows a static half-filled bar.
 *
 * @example
 *   <ProgressBar value={60} aria-label="Uploading report" />
 *   <ProgressBar aria-label="Generating response" />
 *   <ProgressBar value={42} tone="success" aria-labelledby="upload-label" />
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  {
    value,
    size = "md",
    tone = "default",
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const isDeterminate = value !== undefined;
  const clamped = isDeterminate ? Math.min(100, Math.max(0, value)) : undefined;

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      data-size={size}
      data-tone={tone}
      className={clsx(styles.root, sizeClass[size], toneClass[tone], className)}
      {...rest}
    >
      <div className={styles.track}>
        {isDeterminate ? (
          /* Determinate: single fill scaled via CSS custom property */
          <div
            className={styles.fill}
            style={
              { "--progress-fraction": clamped! / 100 } as React.CSSProperties & {
                "--progress-fraction": number;
              }
            }
          />
        ) : (
          /* Indeterminate: two animated bars + one static fallback for reduced-motion */
          <>
            <div className={clsx(styles.bar, styles.bar1)} />
            <div className={clsx(styles.bar, styles.bar2)} />
            {/* staticFill: hidden under normal motion; revealed under prefers-reduced-motion */}
            <div className={styles.staticFill} aria-hidden="true" />
          </>
        )}
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";
