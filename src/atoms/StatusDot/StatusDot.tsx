import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./StatusDot.module.css";

export type StatusDotTone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";
export type StatusDotSize = "sm" | "md";

export interface StatusDotProps extends ComponentPropsWithoutRef<"span"> {
  /** Semantic tone controlling the dot color. Default: "neutral". */
  tone?: StatusDotTone;
  /** Dot size: "sm" = 8px, "md" = 10px. Default: "md". */
  size?: StatusDotSize;
  /** Dims the dot to opacity 0.4. Default: false. */
  disabled?: boolean;
}

/**
 * Standalone colored circle that communicates semantic state without a text label.
 *
 * Accessibility contract:
 * - Standalone use: provide `aria-label` describing the state (e.g. aria-label="Published").
 *   The component renders role="img" by default so screen readers announce the label.
 * - Decorative use (alongside visible text): pass `aria-hidden` to suppress announcement.
 *   No role is rendered when aria-hidden is set.
 *
 * Dev-mode warning is emitted when neither aria-label nor aria-hidden is present.
 */
export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot(
  {
    tone = "neutral",
    size = "md",
    disabled = false,
    className,
    "aria-hidden": ariaHidden,
    ...rest
  },
  ref,
) {
  // aria-hidden prop type from React DOM: boolean | "true" | "false" | undefined
  const isDecorative = ariaHidden === true || ariaHidden === "true";

  if (process.env.NODE_ENV !== "production") {
    const hasLabel = Boolean(rest["aria-label"]);
    if (!hasLabel && !isDecorative) {
      console.warn(
        "[StatusDot] Accessibility: provide aria-label to describe the state, " +
          'or aria-hidden="true" if adjacent text already describes it.',
      );
    }
  }

  // When aria-hidden is set to any truthy form, omit role="img".
  const role = isDecorative ? undefined : "img";
  // Normalise aria-hidden to "true" string when set (DOM attribute is always a string).
  const ariaHiddenProp: "true" | undefined = isDecorative ? "true" : undefined;

  return (
    <span
      ref={ref}
      role={role}
      aria-hidden={ariaHiddenProp}
      className={clsx(styles.root, className)}
      data-tone={tone}
      data-size={size}
      data-disabled={disabled || undefined}
      {...rest}
    />
  );
});

StatusDot.displayName = "StatusDot";
