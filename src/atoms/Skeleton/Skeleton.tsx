import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import clsx from "clsx";
import styles from "./Skeleton.module.css";

export type SkeletonRadius = "sm" | "md" | "lg" | "circle";

type DivProps = ComponentPropsWithoutRef<"div">;
type SpanProps = ComponentPropsWithoutRef<"span">;

export interface SkeletonProps extends Omit<DivProps & SpanProps, "children"> {
  /** Rendered width. Number → px; string passes through (e.g. "100%", "12rem"). */
  width?: string | number;
  /** Rendered height. Number → px; string passes through. */
  height?: string | number;
  /**
   * Corner-radius variant.
   * sm → `--radius-1` (2px) | md → `--radius-2` (4px, default) | lg → `--radius-3` (8px) | circle → 50%
   */
  radius?: SkeletonRadius;
  /**
   * Root HTML element.
   * `"div"` (default) for block contexts; `"span"` for inline contexts (applies `display: inline-block`).
   * Closed union — only div and span are supported.
   */
  as?: "div" | "span";
}

function normaliseDimension(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * Skeleton atom — content placeholder for async data loads.
 *
 * Renders a rounded rectangle filled with `--surface`, animated by a slow
 * opacity pulse (`--dur-pulse`) that signals "loading in progress."
 * Purely decorative — `aria-hidden="true"` by default.
 * Consumer owns the `aria-busy` contract on the loading region container.
 *
 * No shimmer. Opacity pulse only.
 *
 * @example
 *   // Block placeholder
 *   <Skeleton width="100%" height={24} radius="sm" />
 *
 *   // Avatar placeholder
 *   <Skeleton width={40} height={40} radius="circle" />
 *
 *   // Inline text placeholder
 *   <p>Posted by <Skeleton as="span" width={80} height={14} radius="sm" /></p>
 */
export const Skeleton = forwardRef<HTMLElement, SkeletonProps>(function Skeleton(
  {
    width,
    height,
    radius = "md",
    as = "div",
    className,
    style,
    "aria-hidden": ariaHidden = "true",
    ...rest
  },
  ref,
) {
  const Tag = as as "div";

  const inlineStyle: CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: normaliseDimension(width) } : {}),
    ...(height !== undefined ? { height: normaliseDimension(height) } : {}),
  };

  return (
    <Tag
      ref={ref as unknown as React.Ref<HTMLDivElement>}
      className={clsx(styles.root, className)}
      data-radius={radius}
      data-as={as}
      aria-hidden={ariaHidden}
      style={inlineStyle}
      {...rest}
    />
  );
});

Skeleton.displayName = "Skeleton";
