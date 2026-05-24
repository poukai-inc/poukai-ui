import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./ComparisonTable.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Full-form tier descriptor. */
export interface TierDef {
  /** Tier name displayed in the column header. */
  label: string;
  /** Optional sub-label beneath the tier name (e.g. "/month"). */
  subtext?: string;
  /** When true, renders the tier name in `--accent`. */
  featured?: boolean;
}

/** A data row: one feature label + one value cell per tier. */
export interface ComparisonRow {
  /** Feature label rendered as `<th scope="row">`. */
  feature: string;
  /**
   * One value string per tier in the same order as `tiers`.
   * Use `"—"` for absent features. Values are consumer-supplied strings.
   */
  values: string[];
}

/** A group-heading separator row. Discriminated by the `group` key. */
export interface ComparisonGroupHeading {
  /** Cluster label text. Rendered as a full-colspan `<th>`. */
  group: string;
}

export type ComparisonTableRow = ComparisonRow | ComparisonGroupHeading;

function isGroupHeading(row: ComparisonTableRow): row is ComparisonGroupHeading {
  return "group" in row;
}

export interface ComparisonTableProps extends ComponentPropsWithoutRef<"section"> {
  /**
   * Column headers. Accepts either plain `string[]` (shorthand) or
   * `TierDef[]` (full form with optional `featured` + `subtext`).
   */
  tiers: string[] | TierDef[];
  /**
   * Table rows. Mix `ComparisonRow` and `ComparisonGroupHeading` freely.
   * `ComparisonGroupHeading` rows (`{ group: string }`) are rendered as
   * full-colspan cluster-label rows between data rows.
   */
  rows: ComparisonTableRow[];
  /**
   * Alternate row fill via `--surface`. Off by default — the brand
   * prefers hairlines over fills for table rhythm.
   */
  striped?: boolean;
  /**
   * Sticky `<thead>`. Disable only when the table sits inside a container
   * with `overflow: hidden` that breaks `position: sticky`.
   * @default true
   */
  stickyHeader?: boolean;
  /**
   * Visible or visually-hidden `<caption>` for accessibility.
   * When absent, supply `aria-label` on the root element.
   */
  caption?: string;
  /**
   * Controls `<caption>` visibility.
   * - `"visible"` (default) — caption is visible.
   * - `"sr-only"` — caption is visually hidden but accessible.
   */
  captionVisibility?: "visible" | "sr-only";
  /** Optional section heading rendered above the table via `Section`. */
  heading?: ReactNode;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeTiers(tiers: string[] | TierDef[]): TierDef[] {
  if (tiers.length === 0) return [];
  return typeof tiers[0] === "string"
    ? (tiers as string[]).map((label) => ({ label }))
    : (tiers as TierDef[]);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ComparisonTable — feature × tier pricing matrix organism.
 *
 * Renders a semantic `<table>` with a sticky `<thead>` of tier names and a
 * scrollable `<tbody>` of feature rows. Supports optional row-group heading
 * rows to cluster related features.
 *
 * @example
 * ```tsx
 * <ComparisonTable
 *   caption="Plan feature comparison"
 *   tiers={[
 *     { label: "Free" },
 *     { label: "Pro", featured: true },
 *     { label: "Team" },
 *   ]}
 *   rows={[
 *     { group: "Storage" },
 *     { feature: "Projects", values: ["3", "Unlimited", "Unlimited"] },
 *     { feature: "Members", values: ["1", "5", "Unlimited"] },
 *     { group: "Support" },
 *     { feature: "SLA", values: ["—", "Email", "Priority"] },
 *   ]}
 * />
 * ```
 */
export const ComparisonTable = forwardRef<HTMLElement, ComparisonTableProps>(
  function ComparisonTable(
    {
      tiers,
      rows,
      striped = false,
      stickyHeader = true,
      caption,
      captionVisibility = "visible",
      heading,
      className,
      ...rest
    },
    ref,
  ) {
    const normalizedTiers = normalizeTiers(tiers);
    const colCount = normalizedTiers.length + 1; // feature col + one per tier

    // Build tbody groups: split rows on group headings.
    // Each group = { heading?: string; rows: ComparisonRow[] }
    type RowGroup = { heading?: string; dataRows: ComparisonRow[] };
    const groups: RowGroup[] = [];
    let current: RowGroup = { dataRows: [] };

    for (const row of rows) {
      if (isGroupHeading(row)) {
        if (current.dataRows.length > 0 || current.heading !== undefined) {
          groups.push(current);
        }
        current = { heading: row.group, dataRows: [] };
      } else {
        current.dataRows.push(row);
      }
    }
    if (current.dataRows.length > 0 || current.heading !== undefined) {
      groups.push(current);
    }

    return (
      <section ref={ref} className={clsx(styles.root, className)} {...rest}>
        {heading != null && <div className={styles.heading}>{heading}</div>}
        <div className={styles.scrollContainer}>
          <table
            className={clsx(styles.table, striped && styles.striped)}
            {...(caption == null ? {} : {})}
          >
            {caption != null && (
              <caption
                className={clsx(styles.caption, captionVisibility === "sr-only" && styles.srOnly)}
              >
                {caption}
              </caption>
            )}

            <thead className={clsx(styles.thead, stickyHeader && styles.stickyHeader)}>
              <tr>
                {/* Leading empty cell for the feature-label column.
                    Visually-hidden text satisfies the empty-table-header axe
                    rule while keeping the corner cell visually blank. */}
                <th scope="col" className={clsx(styles.th, styles.thFeatureCorner)}>
                  <span className={styles.srOnly}>Feature</span>
                </th>
                {normalizedTiers.map((tier) => (
                  <th
                    key={tier.label}
                    scope="col"
                    className={clsx(styles.th, styles.thTier, tier.featured && styles.thFeatured)}
                  >
                    <span className={styles.tierLabel}>{tier.label}</span>
                    {tier.subtext != null && (
                      <span className={styles.tierSubtext}>{tier.subtext}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {groups.map((group, groupIndex) => (
              <tbody key={groupIndex} className={styles.tbody}>
                {group.heading != null && (
                  <tr className={styles.groupRow}>
                    <th
                      scope="colgroup"
                      colSpan={colCount}
                      className={clsx(styles.th, styles.thGroup)}
                    >
                      {group.heading}
                    </th>
                  </tr>
                )}
                {group.dataRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={styles.dataRow}>
                    <th scope="row" className={clsx(styles.th, styles.thFeature)}>
                      {row.feature}
                    </th>
                    {row.values.map((value, colIndex) => (
                      <td key={colIndex} className={styles.td}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>
    );
  },
);

ComparisonTable.displayName = "ComparisonTable";
