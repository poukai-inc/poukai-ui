import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { Section } from "../../molecules/Section";
import { StatList } from "../../molecules/StatList";
import styles from "./StatsSection.module.css";

export interface StatsSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Optional section heading. Rendered as `<h2>` via Section's heading slot.
   * Omit on pure-data surfaces; include for editorial "By the numbers" moments.
   */
  heading?: string;
  /**
   * Hairline rules between stat items. Use when stat count ≥ 3.
   * Default: `false`.
   */
  dividers?: boolean;
  /**
   * Applies `--surface-section` background to the band.
   * Default: `false` (transparent — `--bg`).
   */
  fill?: boolean;
  /**
   * One or more `Stat` atoms composed inside StatList.
   */
  children: ReactNode;
}

/**
 * Marketing-surface organism that frames a `StatList` inside a `Section` band.
 *
 * Owns the "by the numbers" editorial moment on landing pages — an optional heading
 * above a horizontal row of `Stat` atoms with optional dividers. Adds no layout logic
 * beyond what `Section` already provides; its value is in composing the two primitives
 * with the correct spacing contract and semantic heading hierarchy.
 *
 * @example Default (no heading, no fill)
 *   <StatsSection>
 *     <Stat value="12k" caption="Users" />
 *     <Stat value="99.9%" caption="Uptime" />
 *     <Stat value="200" caption="Customers" />
 *   </StatsSection>
 *
 * @example "By the numbers" editorial moment
 *   <StatsSection heading="By the numbers" dividers fill>
 *     <Stat value="12k" caption="Users onboarded" />
 *     <Stat value="99.9%" caption="Uptime SLA" />
 *     <Stat value="< 48h" caption="Median time-to-value" />
 *   </StatsSection>
 */
export const StatsSection = forwardRef<HTMLElement, StatsSectionProps>(function StatsSection(
  { heading, dividers = false, fill = false, className, children, ...rest },
  ref,
) {
  return (
    <Section
      ref={ref}
      title={heading}
      className={clsx(styles.root, fill && styles.fill, className)}
      {...rest}
    >
      <StatList dividers={dividers} align="center">
        {children}
      </StatList>
    </Section>
  );
});

StatsSection.displayName = "StatsSection";
