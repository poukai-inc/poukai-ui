import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Table.module.css";

/* ---------- Types ---------- */

export type TableDensity = "compact" | "comfortable";
export type TableTone = "default" | "subtle";
export type TableAlign = "start" | "center" | "end";

const ALIGN_CLASS: Record<TableAlign, "alignStart" | "alignCenter" | "alignEnd"> = {
  start: "alignStart",
  center: "alignCenter",
  end: "alignEnd",
};

/* ---------- Table root ---------- */

export interface TableProps extends ComponentPropsWithoutRef<"table"> {
  /** Controls vertical cell padding. `"comfortable"` (default) for dashboards; `"compact"` for dense audit tables. */
  density?: TableDensity;
  /** Row-hover background register. `"default"` uses `--surface`; `"subtle"` uses `--surface-section` for tables embedded inside section bands. */
  tone?: TableTone;
}

const TableRoot = forwardRef<HTMLTableElement, TableProps>(function Table(
  { density = "comfortable", tone = "default", className, children, ...rest },
  ref,
) {
  return (
    <table
      ref={ref}
      className={clsx(styles.root, styles[density], styles[tone], className)}
      {...rest}
    >
      {children}
    </table>
  );
});
TableRoot.displayName = "Table";

/* ---------- Table.Head ---------- */

export interface TableHeadProps extends ComponentPropsWithoutRef<"thead"> {
  children?: ReactNode;
}

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(function TableHead(
  { className, children, ...rest },
  ref,
) {
  return (
    <thead ref={ref} className={clsx(styles.head, className)} {...rest}>
      {children}
    </thead>
  );
});
TableHead.displayName = "Table.Head";

/* ---------- Table.Body ---------- */

export interface TableBodyProps extends ComponentPropsWithoutRef<"tbody"> {
  children?: ReactNode;
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <tbody ref={ref} className={clsx(styles.body, className)} {...rest}>
      {children}
    </tbody>
  );
});
TableBody.displayName = "Table.Body";

/* ---------- Table.Row ---------- */

export interface TableRowProps extends ComponentPropsWithoutRef<"tr"> {
  children?: ReactNode;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, children, ...rest },
  ref,
) {
  return (
    <tr ref={ref} className={clsx(styles.row, className)} {...rest}>
      {children}
    </tr>
  );
});
TableRow.displayName = "Table.Row";

/* ---------- Table.HeaderCell ---------- */

export interface TableHeaderCellProps extends Omit<ComponentPropsWithoutRef<"th">, "align"> {
  /** Text alignment for the column. `"start"` (default) for text; `"end"` for numeric columns. */
  align?: TableAlign;
  children?: ReactNode;
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell({ align = "start", className, children, ...rest }, ref) {
    return (
      <th
        ref={ref}
        scope="col"
        className={clsx(styles.headerCell, styles[ALIGN_CLASS[align]], className)}
        {...rest}
      >
        {children}
      </th>
    );
  },
);
TableHeaderCell.displayName = "Table.HeaderCell";

/* ---------- Table.Cell ---------- */

export interface TableCellProps extends Omit<ComponentPropsWithoutRef<"td">, "align"> {
  /** Text alignment for the cell. `"start"` (default); `"end"` for numeric values. */
  align?: TableAlign;
  children?: ReactNode;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align = "start", className, children, ...rest },
  ref,
) {
  return (
    <td ref={ref} className={clsx(styles.cell, styles[ALIGN_CLASS[align]], className)} {...rest}>
      {children}
    </td>
  );
});
TableCell.displayName = "Table.Cell";

/* ---------- Compound export ----------
 *
 * `Table` is the root component with sub-components attached as static
 * properties, enabling both the flat API (`<TableHead>`) and the compound
 * API (`<Table.Head>`).
 */
export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});
