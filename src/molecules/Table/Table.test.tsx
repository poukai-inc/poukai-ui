import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "./Table";
import { BasicTable } from "./__test_harness__";

/* Playwright CT cannot mount wrapper components defined inline in test
   files (the JSX must reference statically-importable components). All
   shared fixtures live in `__test_harness__.tsx`. */

/* ---------- Root element ---------- */

test("root element is <table>", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("table");
});

/* ---------- Semantic structure ---------- */

test("renders <thead>", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  const thead = component.locator("thead");
  await expect(thead).toHaveCount(1);
});

test("renders <tbody>", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  const tbody = component.locator("tbody");
  await expect(tbody).toHaveCount(1);
});

test("renders <tr> elements inside thead and tbody", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  const rows = component.locator("tr");
  // 1 header row + 1 body row
  await expect(rows).toHaveCount(2);
});

test("renders <th> elements inside thead", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  const ths = component.locator("th");
  await expect(ths).toHaveCount(3);
});

test("renders <td> elements inside tbody", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  const tds = component.locator("td");
  await expect(tds).toHaveCount(3);
});

/* ---------- scope="col" on HeaderCell ---------- */

test("Table.HeaderCell has scope='col'", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  const ths = component.locator("th");
  const count = await ths.count();
  for (let i = 0; i < count; i++) {
    await expect(ths.nth(i)).toHaveAttribute("scope", "col");
  }
});

/* ---------- Alignment modifiers ---------- */

test("Table.HeaderCell align='end' forwards text-align token class", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  // Third header cell has align="end"
  const th = component.locator("th").nth(2);
  const cls = await th.getAttribute("class");
  expect(cls).toMatch(/align-end/);
});

test("Table.Cell align='end' forwards text-align token class", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  // Third body cell has align="end"
  const td = component.locator("td").nth(2);
  const cls = await td.getAttribute("class");
  expect(cls).toMatch(/align-end/);
});

/* ---------- Props: density ---------- */

test("root has density class 'comfortable' by default", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/comfortable/);
});

test("root has density class 'compact' when density='compact'", async ({ mount }) => {
  const component = await mount(
    <Table aria-label="Compact table" density="compact">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Col</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Val</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/compact/);
});

/* ---------- Props: tone ---------- */

test("root has tone class 'default' by default", async ({ mount }) => {
  const component = await mount(<BasicTable />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/default/);
});

test("root has tone class 'subtle' when tone='subtle'", async ({ mount }) => {
  const component = await mount(
    <Table aria-label="Subtle table" tone="subtle">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Col</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Val</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/subtle/);
});

/* ---------- className merge ---------- */

test("merges consumer className on Table root", async ({ mount }) => {
  const component = await mount(
    <Table aria-label="cls test" className="consumer-table">
      <TableBody>
        <TableRow>
          <TableCell>x</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/consumer-table/);
});

/* ---------- data-* forwarding ---------- */

test("forwards data-testid to Table root", async ({ mount }) => {
  const component = await mount(
    <Table aria-label="fwd test" data-testid="table-root">
      <TableBody>
        <TableRow>
          <TableCell>x</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  await expect(component).toHaveAttribute("data-testid", "table-root");
});

test("forwards data-* to TableHeaderCell", async ({ mount }) => {
  const component = await mount(
    <Table aria-label="fwd th">
      <TableHead>
        <TableRow>
          <TableHeaderCell data-testid="th-name">Name</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>x</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  await expect(component.locator("th")).toHaveAttribute("data-testid", "th-name");
});

test("forwards data-* to TableCell", async ({ mount }) => {
  const component = await mount(
    <Table aria-label="fwd td">
      <TableBody>
        <TableRow>
          <TableCell data-testid="td-cell">Value</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  await expect(component.locator("td")).toHaveAttribute("data-testid", "td-cell");
});

/* ---------- aria-* forwarding ---------- */

test("forwards aria-label to Table root", async ({ mount }) => {
  const component = await mount(
    <Table aria-label="My data table">
      <TableBody>
        <TableRow>
          <TableCell>x</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  await expect(component).toHaveAttribute("aria-label", "My data table");
});

/* ---------- Compound API via Table.Head / Table.Body / Table.Row / Table.HeaderCell / Table.Cell ---------- */

test("compound API renders correct semantic elements", async ({ mount }) => {
  const component = await mount(
    <Table aria-label="Compound API test">
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Title</Table.HeaderCell>
          <Table.HeaderCell>Platform</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Post A</Table.Cell>
          <Table.Cell>LinkedIn</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>,
  );
  await expect(component.locator("thead")).toHaveCount(1);
  await expect(component.locator("tbody")).toHaveCount(1);
  await expect(component.locator("th")).toHaveCount(2);
  await expect(component.locator("td")).toHaveCount(2);
});

/* ---------- a11y ---------- */

test("a11y — default comfortable table", async ({ mount, page }) => {
  await mount(
    <Table aria-label="A11y test table">
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
        <TableRow>
          <TableCell>Sam</TableCell>
          <TableCell>Engineer</TableCell>
          <TableCell align="end">2024</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — compact density, subtle tone", async ({ mount, page }) => {
  await mount(
    <Table aria-label="Compact subtle table" density="compact" tone="subtle">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Post</TableHeaderCell>
          <TableHeaderCell align="end">Views</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Why AI fails</TableCell>
          <TableCell align="end">12,400</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
