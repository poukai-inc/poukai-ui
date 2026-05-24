import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./PricingTable.module.css";

export type PricingTableColumns = 2 | 3 | "auto";
export type PricingTableAlign = "top" | "stretch";

export interface PricingTableProps extends ComponentPropsWithoutRef<"section"> {
  /**
   * Optional section heading slot. Rendered above the tier grid.
   * Accepts any ReactNode — typically a `<Heading>` and/or billing-period toggle.
   * When provided, consumers should add `aria-labelledby` on the root `<section>`
   * pointing to the heading element's id for proper region labelling.
   */
  heading?: ReactNode;
  /**
   * One or more `PriceTier` children — required.
   * Canonical pattern is 2–3 tiers; 4 is the upper bound.
   */
  children: ReactNode;
  /**
   * Optional comparison body slot beneath the tier grid.
   * Intended for a `ComparisonTable` or `ComparisonRow` organism.
   */
  comparison?: ReactNode;
  /**
   * Grid column count.
   * - `"auto"` (default) — CSS `minmax` collapses 3-up to 1-up responsively.
   * - `2` / `3` — locks the column count regardless of viewport.
   */
  columns?: PricingTableColumns;
  /**
   * Card alignment within each grid row.
   * - `"stretch"` (default) — equalises card heights so CTA buttons align.
   * - `"top"` — lets cards size to their content.
   */
  align?: PricingTableAlign;
}

/**
 * Pricing page organism — frames a grid of `PriceTier` molecules.
 *
 * Owns the `<section>` wrapper, the responsive tier grid, and an optional
 * comparison body slot beneath the grid. Featured-tier visual elevation is
 * delegated to `PriceTier`'s own `featured` prop.
 *
 * A11y: the root `<section>` is a region landmark. Provide `aria-labelledby`
 * (or `aria-label`) via spread props when a visible heading is present.
 *
 * @example Default 3-tier layout
 *   <PricingTable heading={<h2>Choose your plan</h2>}>
 *     <PriceTier name="Starter" price="$0" cadence="free forever" ... />
 *     <PriceTier featured name="Pro" price="$49" cadence="per month" ... />
 *     <PriceTier name="Enterprise" price="Custom" ... />
 *   </PricingTable>
 *
 * @example Locked 2-column layout with comparison body
 *   <PricingTable columns={2} comparison={<ComparisonTable ... />}>
 *     <PriceTier name="Starter" price="$0" ... />
 *     <PriceTier featured name="Pro" price="$49" ... />
 *   </PricingTable>
 */
export const PricingTable = forwardRef<HTMLElement, PricingTableProps>(function PricingTable(
  { heading, children, comparison, columns = "auto", align = "stretch", className, ...rest },
  ref,
) {
  const generatedId = useId();
  const headingId = `${generatedId}-heading`;

  const gridClassName = clsx(
    styles.grid,
    columns === 2 && styles.columns2,
    columns === 3 && styles.columns3,
    align === "top" && styles.alignTop,
  );

  return (
    <section
      ref={ref}
      className={clsx(styles.root, className)}
      aria-labelledby={heading !== undefined ? headingId : undefined}
      {...(rest as ComponentPropsWithoutRef<"section">)}
    >
      <div className={styles.container}>
        {heading !== undefined && (
          <div id={headingId} className={styles.headingSlot}>
            {heading}
          </div>
        )}
        <div className={gridClassName}>{children}</div>
        {comparison !== undefined && <div className={styles.comparisonSlot}>{comparison}</div>}
      </div>
    </section>
  );
});

PricingTable.displayName = "PricingTable";
