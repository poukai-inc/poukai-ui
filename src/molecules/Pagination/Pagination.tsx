import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import clsx from "clsx";
import styles from "./Pagination.module.css";

export type PaginationSize = "sm" | "md";

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  /** Current page, 1-indexed. Required. */
  page: number;
  /** Total number of pages. Required. */
  pageCount: number;
  /** Called with the new page number when user activates a page control. Required. */
  onPageChange: (page: number) => void;
  /** Pages shown each side of the current page. Default: 1. */
  siblingCount?: number;
  /** Pages shown at each end (boundary). Default: 1. */
  boundaryCount?: number;
  /** Size variant. Default: "md". */
  size?: PaginationSize;
  /** Disables all controls — useful during loading state. */
  disabled?: boolean;
}

/**
 * Builds the sorted, deduplicated list of page items to render.
 * Returns an array of numbers (page numbers) or the string "ellipsis-start" / "ellipsis-end".
 */
function buildPageItems(
  page: number,
  pageCount: number,
  siblingCount: number,
  boundaryCount: number,
): Array<number | "ellipsis-start" | "ellipsis-end"> {
  // Build boundary sets
  const startBoundary = Array.from({ length: boundaryCount }, (_, i) => i + 1);
  const endBoundary = Array.from(
    { length: boundaryCount },
    (_, i) => pageCount - boundaryCount + i + 1,
  );

  // Build sibling set around current page
  const siblingStart = Math.max(page - siblingCount, 1);
  const siblingEnd = Math.min(page + siblingCount, pageCount);
  const siblings = Array.from(
    { length: siblingEnd - siblingStart + 1 },
    (_, i) => siblingStart + i,
  );

  // Merge and deduplicate
  const allPages = Array.from(new Set([...startBoundary, ...siblings, ...endBoundary]))
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);

  // Insert ellipsis markers for gaps larger than 1 page
  const result: Array<number | "ellipsis-start" | "ellipsis-end"> = [];
  for (let i = 0; i < allPages.length; i++) {
    const current = allPages[i]!;
    const prev = allPages[i - 1];
    if (prev !== undefined && current - prev > 1) {
      // Gap — insert appropriate ellipsis
      // "ellipsis-start" = gap near the start (after boundary), "ellipsis-end" = near the end
      const isNearStart = prev <= boundaryCount;
      result.push(isNearStart ? "ellipsis-start" : "ellipsis-end");
    }
    result.push(current);
  }
  return result;
}

/**
 * Pagination — stateless, controlled page-navigation control.
 *
 * Renders `<nav aria-label="Pagination">` with first/prev/page-numerals/next/last
 * button controls. Returns null when `pageCount <= 1`.
 *
 * A11y:
 *   - Root is `<nav aria-label="Pagination">` (navigation landmark).
 *   - Active page carries `aria-current="page"`.
 *   - Prev/Next/First/Last carry `aria-label` for icon-only accessible names.
 *   - Ellipsis spans are `aria-hidden="true"` — decorative, not focusable.
 *   - Disabled buttons use native `disabled` attribute (removed from tab order).
 *
 * @example
 *   <Pagination page={3} pageCount={10} onPageChange={setPage} />
 *   <Pagination page={1} pageCount={5} onPageChange={setPage} size="sm" />
 *   <Pagination page={2} pageCount={10} onPageChange={setPage} siblingCount={2} />
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    pageCount,
    onPageChange,
    siblingCount = 1,
    boundaryCount = 1,
    size = "md",
    disabled = false,
    className,
    ...rest
  },
  ref,
) {
  // Guard: don't render when there's nothing to paginate
  if (pageCount <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= pageCount;

  const iconSize = size === "sm" ? 12 : 16;

  const items = buildPageItems(page, pageCount, siblingCount, boundaryCount);

  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      className={clsx(styles.root, styles[size], className)}
      {...rest}
    >
      {/* First page */}
      <button
        type="button"
        className={clsx(styles.control, styles.controlFirst)}
        aria-label="First page"
        disabled={isFirst || disabled}
        onClick={() => onPageChange(1)}
      >
        <ChevronsLeft width={iconSize} height={iconSize} aria-hidden="true" />
      </button>

      {/* Previous page */}
      <button
        type="button"
        className={clsx(styles.control, styles.controlPrev)}
        aria-label="Previous page"
        disabled={isFirst || disabled}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft width={iconSize} height={iconSize} aria-hidden="true" />
      </button>

      {/* Page numerals + ellipsis */}
      {items.map((item, idx) => {
        if (item === "ellipsis-start" || item === "ellipsis-end") {
          return (
            <span key={item} className={styles.ellipsis} aria-hidden="true">
              &hellip;
            </span>
          );
        }
        const isCurrent = item === page;
        return (
          <button
            key={`page-${item}-${idx}`}
            type="button"
            className={clsx(styles.pageButton, isCurrent && styles.current)}
            aria-current={isCurrent ? "page" : undefined}
            disabled={disabled}
            onClick={() => !isCurrent && onPageChange(item)}
          >
            {item}
          </button>
        );
      })}

      {/* Next page */}
      <button
        type="button"
        className={clsx(styles.control, styles.controlNext)}
        aria-label="Next page"
        disabled={isLast || disabled}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight width={iconSize} height={iconSize} aria-hidden="true" />
      </button>

      {/* Last page */}
      <button
        type="button"
        className={clsx(styles.control, styles.controlLast)}
        aria-label="Last page"
        disabled={isLast || disabled}
        onClick={() => onPageChange(pageCount)}
      >
        <ChevronsRight width={iconSize} height={iconSize} aria-hidden="true" />
      </button>
    </nav>
  );
});

Pagination.displayName = "Pagination";
