import {
  forwardRef,
  useCallback,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  type TableDensity,
} from "../Table";
import { Pagination } from "../Pagination";
import { EmptyState } from "../EmptyState";
import styles from "./DataTable.module.css";

/* ---------- Types ---------- */

export type SortDirection = "asc" | "desc";

export interface SortState {
  columnId: string;
  direction: SortDirection;
}

export type FilterState = Record<string, string[]>;

export interface ColumnDef<TRow = unknown> {
  /** Unique identifier for the column. */
  id: string;
  /** Header label string or ReactNode. */
  header: ReactNode;
  /** Render function: given a row, returns the cell content. */
  accessor: (row: TRow) => ReactNode;
  /** Whether this column supports sort. Default: false. */
  sortable?: boolean;
  /** Metadata flag: column supports filtering. Filter UI lives in consumer toolbar. */
  filterable?: boolean;
}

export interface DataTableProps<TRow = unknown> extends Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> {
  /** Column definitions. */
  columns: ColumnDef<TRow>[];
  /** Data rows for the current page. DataTable does not slice — consumer passes the page slice. */
  rows: TRow[];
  /** Controlled sort state. Pass null for unsorted. */
  sortState?: SortState | null;
  /** Called with next SortState (or null to clear) when a sortable header is clicked. */
  onSortChange?: (next: SortState | null) => void;
  /** Active filter values per columnId. */
  filterState?: FilterState;
  /** Called when filter state changes. */
  onFilterChange?: (next: FilterState) => void;
  /** Current 1-based page number. */
  page?: number;
  /** Rows per page — informational only; consumer slices data. Default: 20. */
  pageSize?: number;
  /** Total number of pages. Drives Pagination. */
  pageCount: number;
  /** Called with next page number. */
  onPageChange?: (page: number) => void;
  /** Shown when rows.length === 0. */
  emptyState?: ReactNode;
  /** Slot above the table for filter/search controls. */
  toolbar?: ReactNode;
  /** Forwarded to Table molecule. */
  density?: TableDensity;
  /**
   * Accessible label for the region and table caption.
   * Required for a11y when multiple tables are on the page.
   */
  caption?: string;
  /** Total row count across all pages — used for aria-live announcement. */
  totalRows?: number;
}

/* ---------- Sort icon ---------- */

function SortIcon({ direction, active }: { direction: SortDirection | null; active: boolean }) {
  const size = 14;
  if (!active || direction === null) {
    return (
      <ChevronsUpDown
        width={size}
        height={size}
        aria-hidden="true"
        className={styles.sortIconIdle}
      />
    );
  }
  if (direction === "asc") {
    return (
      <ChevronUp width={size} height={size} aria-hidden="true" className={styles.sortIconActive} />
    );
  }
  return (
    <ChevronDown width={size} height={size} aria-hidden="true" className={styles.sortIconActive} />
  );
}

/* ---------- Component ---------- */

/**
 * DataTable — sortable, filterable, paginated table molecule.
 *
 * Composes Table + Pagination + EmptyState. Pure React, no external table lib.
 * Consumer owns data slicing and filter/sort logic — DataTable wires state and
 * renders the composed UI.
 *
 * A11y:
 *   - Root is `<section aria-label>` — complementary landmark.
 *   - `<caption>` is always present in DOM (visually hidden if caption prop omitted).
 *   - `aria-sort` on sortable headers: "ascending" / "descending" / "none".
 *   - `aria-live="polite"` region announces row count on state changes.
 *   - Focus moves to table body on page change.
 */
export const DataTable = forwardRef<HTMLElement, DataTableProps>(function DataTable(
  {
    columns,
    rows,
    sortState = null,
    onSortChange,
    filterState: _filterState = {},
    onFilterChange: _onFilterChange,
    page = 1,
    pageSize: _pageSize = 20,
    pageCount,
    onPageChange,
    emptyState,
    toolbar,
    density = "comfortable",
    caption,
    totalRows,
    className,
    ...rest
  },
  ref,
) {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const handleSortClick = useCallback(
    (columnId: string) => {
      if (!onSortChange) return;
      if (sortState === null || sortState.columnId !== columnId) {
        onSortChange({ columnId, direction: "asc" });
      } else if (sortState.direction === "asc") {
        onSortChange({ columnId, direction: "desc" });
      } else {
        // desc → reset
        onSortChange(null);
      }
    },
    [sortState, onSortChange],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      onPageChange?.(nextPage);
      // Focus first focusable element in tbody, or the tbody itself
      requestAnimationFrame(() => {
        if (!tbodyRef.current) return;
        const first = tbodyRef.current.querySelector<HTMLElement>(
          "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (first) {
          first.focus();
        } else {
          tbodyRef.current.setAttribute("tabindex", "-1");
          tbodyRef.current.focus();
          tbodyRef.current.removeAttribute("tabindex");
        }
      });
    },
    [onPageChange],
  );

  const label = caption ?? "Data table";

  // Build announcement string for aria-live region
  const rowCount = rows.length;
  const announcement =
    totalRows !== undefined
      ? `Showing ${rowCount} of ${totalRows} results`
      : `Showing ${rowCount} result${rowCount !== 1 ? "s" : ""}`;

  const isEmpty = rows.length === 0;

  return (
    <section ref={ref} aria-label={label} className={clsx(styles.root, className)} {...rest}>
      {toolbar !== undefined && <div className={styles.toolbar}>{toolbar}</div>}

      {/* aria-live region for row count announcements */}
      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {announcement}
      </div>

      {isEmpty ? (
        <div className={styles.emptyWrap}>
          {emptyState ?? (
            <EmptyState title="No results" description="Try adjusting your filters." />
          )}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <Table density={density} aria-label={label}>
            <caption className={styles.caption}>{caption ?? label}</caption>
            <TableHead>
              <TableRow>
                {columns.map((col) => {
                  const isSorted = sortState !== null && sortState.columnId === col.id;
                  const ariaSortValue = !col.sortable
                    ? undefined
                    : isSorted
                      ? sortState!.direction === "asc"
                        ? ("ascending" as const)
                        : ("descending" as const)
                      : ("none" as const);

                  return (
                    <TableHeaderCell
                      key={col.id}
                      {...(ariaSortValue !== undefined ? { "aria-sort": ariaSortValue } : {})}
                    >
                      {col.sortable ? (
                        <button
                          type="button"
                          className={styles.sortButton}
                          onClick={() => handleSortClick(col.id)}
                        >
                          <span>{col.header}</span>
                          <SortIcon
                            direction={isSorted ? sortState!.direction : null}
                            active={isSorted}
                          />
                        </button>
                      ) : (
                        col.header
                      )}
                    </TableHeaderCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody ref={tbodyRef}>
              {rows.map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                  {columns.map((col) => (
                    <TableCell key={col.id}>{col.accessor(row)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!isEmpty && pageCount > 1 && onPageChange !== undefined && (
        <div className={styles.paginationWrap}>
          <Pagination page={page} pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
      )}
    </section>
  );
});

DataTable.displayName = "DataTable";
