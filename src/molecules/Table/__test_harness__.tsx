/**
 * Test harnesses for Table CT tests.
 *
 * Playwright CT serializes the JSX argument to `mount()` and cannot
 * mount wrapper components defined inline inside test files. Anything
 * needed across multiple tests as a composed structure must live here.
 */
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "./Table";

/** Minimal accessible table used across most assertions. */
export const BasicTable = () => (
  <Table aria-label="Test table">
    <TableHead>
      <TableRow>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Role</TableHeaderCell>
        <TableHeaderCell align="end">Year</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Arian</TableCell>
        <TableCell>Founder</TableCell>
        <TableCell align="end">2023</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

/** Table with align=end on a HeaderCell, used to assert alignEnd class. */
export const HeaderCellAlignEnd = () => (
  <Table aria-label="Header align test">
    <TableHead>
      <TableRow>
        <TableHeaderCell align="end" data-testid="hc">
          Year
        </TableHeaderCell>
      </TableRow>
    </TableHead>
  </Table>
);

/** Table with align=end on a body Cell, used to assert alignEnd class. */
export const CellAlignEnd = () => (
  <Table aria-label="Cell align test">
    <TableBody>
      <TableRow>
        <TableCell align="end" data-testid="bc">
          2023
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
