import { forwardRef, Children, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./StatList.module.css";

export type StatListAlign = "start" | "center";

export interface StatListProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Opt-in hairline rules between items. Off by default so StatList can be
   * used without visual separators in tighter contexts.
   */
  dividers?: boolean;
  /**
   * Center-aligns the row in its container — the marketing default.
   * `"start"` for left-docked layouts (docs, sidebars).
   */
  align?: StatListAlign;
  /** Required. Expects `Stat` atoms; consumer owns composition. */
  children: ReactNode;
}

/**
 * StatList — groups two or more `Stat` atoms into a shared horizontal rhythm
 * with consistent gap cadence and optional hairline dividers between items.
 *
 * @example
 *   <StatList dividers>
 *     <Stat value="12k" caption="Users" />
 *     <Stat value="200" caption="Customers" />
 *     <Stat value="99.9%" caption="Uptime" />
 *   </StatList>
 */
export const StatList = forwardRef<HTMLDivElement, StatListProps>(function StatList(
  { dividers = false, align = "center", className, children, ...rest },
  ref,
) {
  const items = Children.toArray(children);

  return (
    <div
      ref={ref}
      role="list"
      className={clsx(
        styles.root,
        dividers && styles.dividers,
        align === "start" ? styles.alignStart : styles.alignCenter,
        className,
      )}
      {...rest}
    >
      {items.map((child, index) => (
        <div key={index} role="listitem" className={styles.item}>
          {child}
        </div>
      ))}
    </div>
  );
});

StatList.displayName = "StatList";
