import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { Section } from "../../molecules/Section";
import styles from "./LogoCloud.module.css";

export type LogoCloudVariant = "grid" | "strip";
export type LogoCloudColumns = 2 | 3 | 4 | 5 | 6;

export interface LogoCloudProps extends HTMLAttributes<HTMLElement> {
  /**
   * Layout mode.
   * - `"grid"` (default): static CSS grid. Ideal for curated sets of 4–12 logos.
   * - `"strip"`: continuously scrolling horizontal marquee. Ideal for larger sets.
   */
  variant?: LogoCloudVariant;
  /**
   * Number of columns in grid variant.
   * Has no effect when `variant="strip"`.
   * Responsive: halved automatically at viewports narrower than `--bp-md`.
   * Default: 4.
   */
  columns?: LogoCloudColumns;
  /**
   * Render a 1px `--hairline` rule above the logo container.
   * Separates the cloud from an adjacent hero band.
   * Default: false.
   */
  divider?: boolean;
  /**
   * Section heading. Passed to Section's `title` slot.
   */
  heading?: string | ReactNode;
  /**
   * Section eyebrow. Passed to Section's `eyebrow` slot.
   */
  eyebrow?: string | ReactNode;
  /**
   * Section lede. Passed to Section's `lede` slot.
   */
  lede?: string | ReactNode;
  /**
   * Section size. Logo clouds typically sit in dense marketing rows.
   * Default: `"tight"`.
   */
  size?: "default" | "tight";
  /**
   * `Logo` atoms. Consumer is responsible for correct count and ordering.
   */
  children: ReactNode;
}

const COLUMN_CLASS: Record<LogoCloudColumns, string> = {
  2: styles.cols2!,
  3: styles.cols3!,
  4: styles.cols4!,
  5: styles.cols5!,
  6: styles.cols6!,
};

/**
 * Canonical "trusted by" / partner logo surface.
 *
 * Renders a Section-framed collection of `Logo` atoms as either a static
 * responsive grid or a continuously scrolling horizontal strip.
 *
 * @example Grid (default)
 *   <LogoCloud heading="Trusted by" eyebrow="Customers">
 *     <Logo src="/logos/acme.svg" alt="Acme" />
 *     <Logo src="/logos/globex.svg" alt="Globex" />
 *   </LogoCloud>
 *
 * @example Strip
 *   <LogoCloud variant="strip" aria-label="Our partners">
 *     <Logo src="/logos/acme.svg" alt="Acme" />
 *     <Logo src="/logos/globex.svg" alt="Globex" />
 *   </LogoCloud>
 */
export const LogoCloud = forwardRef<HTMLElement, LogoCloudProps>(function LogoCloud(
  {
    variant = "grid",
    columns = 4,
    divider = false,
    heading,
    eyebrow,
    lede,
    size = "tight",
    className,
    children,
    ...rest
  },
  ref,
) {
  const isStrip = variant === "strip";
  const isGrid = variant === "grid";

  const containerClass = clsx(
    styles.container,
    isGrid ? styles.variantGrid : styles.variantStrip,
    isGrid && COLUMN_CLASS[columns],
    divider && styles.hasDivider,
  );

  const body = isStrip ? (
    <div className={containerClass}>
      {/* First track: real content, read by screen readers */}
      <div className={styles.track} aria-hidden="false">
        {children}
      </div>
      {/* Second track: duplicate for seamless loop, hidden from AT */}
      <div className={styles.track} aria-hidden="true">
        {children}
      </div>
    </div>
  ) : (
    <div className={containerClass}>{children}</div>
  );

  return (
    <Section
      ref={ref}
      eyebrow={eyebrow}
      title={heading}
      lede={lede}
      size={size}
      className={clsx(styles.root, className)}
      {...rest}
    >
      {body}
    </Section>
  );
});

LogoCloud.displayName = "LogoCloud";
