import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { DataTable } from "./DataTable";
import type { ColumnDef, SortState } from "./DataTable";

/* ---------- Shared fixtures ---------- */

interface Row {
  id: string;
  name: string;
  role: string;
}

const COLUMNS: ColumnDef<Row>[] = [
  { id: "name", header: "Name", accessor: (r) => r.name, sortable: true },
  { id: "role", header: "Role", accessor: (r) => r.role },
];

const ROWS: Row[] = [
  { id: "1", name: "Arian", role: "Founder" },
  { id: "2", name: "Sam", role: "Engineer" },
  { id: "3", name: "Morgan", role: "Designer" },
];

/* ---------- Root element ---------- */

test("root element is <section>", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" />,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("root has aria-label from caption", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team members" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Team members");
});

/* ---------- Table rendering ---------- */

test("renders a <table> inside", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" />,
  );
  expect(await component.locator("table").count()).toBe(1);
});

test("renders correct number of header cells", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" />,
  );
  expect(await component.locator("th").count()).toBe(COLUMNS.length);
});

test("renders correct number of data rows", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" />,
  );
  // tbody rows only
  expect(await component.locator("tbody tr").count()).toBe(ROWS.length);
});

test("renders cell values from accessor", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" />,
  );
  await expect(component.getByText("Arian")).toBeVisible();
  await expect(component.getByText("Founder")).toBeVisible();
});

/* ---------- Sort ---------- */

test("sortable column has a sort button", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" />,
  );
  // "Name" column is sortable
  expect(await component.locator("thead button").count()).toBeGreaterThanOrEqual(1);
});

test("non-sortable column has no button in header", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" />,
  );
  // "Role" column is not sortable — check th[2] has no button
  const secondTh = component.locator("th").nth(1);
  expect(await secondTh.locator("button").count()).toBe(0);
});

test("clicking sortable header calls onSortChange with asc", async ({ mount }) => {
  const events: (SortState | null)[] = [];
  const component = await mount(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      pageCount={1}
      caption="Team"
      sortState={null}
      onSortChange={(s) => events.push(s)}
    />,
  );
  await component.locator("thead button").first().click();
  expect(events).toHaveLength(1);
  expect(events[0]).toEqual({ columnId: "name", direction: "asc" });
});

test("clicking same sorted column toggles to desc", async ({ mount }) => {
  const events: (SortState | null)[] = [];
  const component = await mount(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      pageCount={1}
      caption="Team"
      sortState={{ columnId: "name", direction: "asc" }}
      onSortChange={(s) => events.push(s)}
    />,
  );
  await component.locator("thead button").first().click();
  expect(events[0]).toEqual({ columnId: "name", direction: "desc" });
});

test("clicking desc-sorted column resets to null", async ({ mount }) => {
  const events: (SortState | null)[] = [];
  const component = await mount(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      pageCount={1}
      caption="Team"
      sortState={{ columnId: "name", direction: "desc" }}
      onSortChange={(s) => events.push(s)}
    />,
  );
  await component.locator("thead button").first().click();
  expect(events[0]).toBeNull();
});

test("sorted asc header has aria-sort='ascending'", async ({ mount }) => {
  const component = await mount(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      pageCount={1}
      caption="Team"
      sortState={{ columnId: "name", direction: "asc" }}
    />,
  );
  const nameTh = component.locator("th").first();
  await expect(nameTh).toHaveAttribute("aria-sort", "ascending");
});

test("sorted desc header has aria-sort='descending'", async ({ mount }) => {
  const component = await mount(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      pageCount={1}
      caption="Team"
      sortState={{ columnId: "name", direction: "desc" }}
    />,
  );
  const nameTh = component.locator("th").first();
  await expect(nameTh).toHaveAttribute("aria-sort", "descending");
});

test("unsorted sortable header has aria-sort='none'", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" sortState={null} />,
  );
  const nameTh = component.locator("th").first();
  await expect(nameTh).toHaveAttribute("aria-sort", "none");
});

test("non-sortable header has no aria-sort", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" />,
  );
  const roleTh = component.locator("th").nth(1);
  const val = await roleTh.getAttribute("aria-sort");
  expect(val).toBeNull();
});

/* ---------- Empty state ---------- */

test("shows default empty state when rows is empty", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={[]} pageCount={0} caption="Team" />,
  );
  // No table rendered
  expect(await component.locator("table").count()).toBe(0);
  // Default EmptyState title visible
  await expect(component.getByText("No results")).toBeVisible();
});

test("shows custom emptyState slot", async ({ mount }) => {
  const component = await mount(
    <DataTable
      columns={COLUMNS}
      rows={[]}
      pageCount={0}
      caption="Team"
      emptyState={<p>Nothing here yet.</p>}
    />,
  );
  await expect(component.getByText("Nothing here yet.")).toBeVisible();
});

/* ---------- Pagination ---------- */

test("pagination is not rendered when pageCount <= 1", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" />,
  );
  expect(await component.locator("nav[aria-label='Pagination']").count()).toBe(0);
});

test("pagination is not rendered without onPageChange", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={5} caption="Team" />,
  );
  expect(await component.locator("nav[aria-label='Pagination']").count()).toBe(0);
});

test("pagination renders when pageCount > 1 and onPageChange provided", async ({ mount }) => {
  const component = await mount(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      pageCount={5}
      page={1}
      caption="Team"
      onPageChange={() => undefined}
    />,
  );
  expect(await component.locator("nav[aria-label='Pagination']").count()).toBe(1);
});

test("clicking next page calls onPageChange", async ({ mount }) => {
  const events: number[] = [];
  const component = await mount(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      pageCount={5}
      page={1}
      caption="Team"
      onPageChange={(p) => events.push(p)}
    />,
  );
  await component.getByRole("button", { name: "Next page" }).click();
  expect(events).toEqual([2]);
});

/* ---------- Toolbar slot ---------- */

test("renders toolbar slot above the table", async ({ mount }) => {
  const component = await mount(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      pageCount={1}
      caption="Team"
      toolbar={<input aria-label="Search" placeholder="Search…" />}
    />,
  );
  await expect(component.getByRole("textbox", { name: "Search" })).toBeVisible();
});

/* ---------- aria-live region ---------- */

test("aria-live polite region is present", async ({ mount }) => {
  const component = await mount(
    <DataTable columns={COLUMNS} rows={ROWS} pageCount={1} caption="Team" />,
  );
  expect(await component.locator("[aria-live='polite']").count()).toBeGreaterThanOrEqual(1);
});

/* ---------- A11y ---------- */

test("a11y — DataTable with rows", async ({ mount, page }) => {
  await mount(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      pageCount={1}
      caption="Team members"
      totalRows={ROWS.length}
    />,
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("a11y — DataTable empty state", async ({ mount, page }) => {
  await mount(<DataTable columns={COLUMNS} rows={[]} pageCount={0} caption="Team members" />);
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("a11y — DataTable with pagination", async ({ mount, page }) => {
  await mount(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      pageCount={5}
      page={2}
      caption="Team members"
      totalRows={15}
      onPageChange={() => undefined}
    />,
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations).toEqual([]);
});
