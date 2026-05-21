import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Spinner.module.css";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends ComponentPropsWithoutRef<"span"> {
  /** Visual size. sm=16px, md=20px (default), lg=24px. */
  size?: SpinnerSize;
  /** Accessible label announced to screen readers. Default: "Loading". */
  label?: string;
}

const sizeClass: Record<SpinnerSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
};

/**
 * Indeterminate loading indicator. Signals that an async operation is in
 * progress when the duration is unknown. Uses `currentColor` throughout —
 * place inside any colored context without a separate color prop.
 *
 * Under `prefers-reduced-motion: reduce` the rotation stops and a static
 * ellipsis (…) is revealed alongside the static arc.
 *
 * @example
 *   <Spinner />
 *   <Spinner size="sm" label="Submitting form" />
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "md", label = "Loading", className, ...rest },
  ref,
) {
  // SVG geometry: viewBox 0 0 24 24, r=10, cx=cy=12, strokeWidth=2.
  // circumference = 2π × 10 ≈ 62.83
  // dasharray ≈ 47.12 (75% of circumference) gives the ~270° arc.
  const circumference = 2 * Math.PI * 10;
  const dashArray = circumference * 0.75;

  return (
    <span
      ref={ref}
      role="status"
      aria-live="polite"
      aria-label={label}
      className={clsx(styles.root, sizeClass[size], className)}
      {...rest}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.svg}>
        {/* Track arc — static ring at reduced opacity */}
        <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" opacity="0.2" />
        {/* Rotating arc — animated partial arc */}
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={`${dashArray} ${circumference}`}
          strokeDashoffset="0"
          className={styles.arc}
        />
      </svg>
      {/* Visually-hidden label: belt-and-suspenders for virtual browse mode */}
      <span className={styles.srOnly}>{label}</span>
      {/* Reduced-motion ellipsis: revealed only under prefers-reduced-motion: reduce */}
      <span className={styles.ellipsis} aria-hidden="true">
        …
      </span>
    </span>
  );
});

Spinner.displayName = "Spinner";
