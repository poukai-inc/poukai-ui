import { test, expect } from "@playwright/experimental-ct-react";
import { ComparisonTable } from "./ComparisonTable";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const tiers = [{ label: "Free" }, { label: "Pro", featured: true }, { label: "Team" }];

const rows = [
  { group: "Storage" },
  { feature: "Projects", values: ["3", "Unlimited", "Unlimited"] },
  { feature: "Members", values: ["1", "5", "Unlimited"] },
  { group: "Support" },
  { feature: "SLA", values: ["—", "Email", "Priority"] },
];

const simpleRows = [
  { feature: "Projects", values: ["3", "Unlimited", "Unlimited"] },
  { feature: "Members", values: ["1", "5", "Unlimited"] },
];

// ---------------------------------------------------------------------------
// Semantic structure
// ---------------------------------------------------------------------------

test("renders a <table> element", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} />);
  await expect(component.locator("table")).toBeVisible();
});

test("renders <thead> and <tbody>", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} />);
  await expect(component.locator("thead")).toBeVisible();
  await expect(component.locator("tbody")).toBeVisible();
});

test("renders <tr> elements inside thead and tbody", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} />);
  // thead row
  await expect(component.locator("thead tr")).toHaveCount(1);
  // tbody rows = simpleRows.length
  await expect(component.locator("tbody tr")).toHaveCount(simpleRows.length);
});

test("renders <th scope='col'> for each tier plus empty corner cell", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} />);
  // 3 tier cols + 1 empty corner = 4 col-scoped th cells in thead
  const colThs = component.locator("thead th[scope='col']");
  await expect(colThs).toHaveCount(4);
});

test("renders tier labels in column header cells", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} />);
  await expect(component.locator("thead")).toContainText("Free");
  await expect(component.locator("thead")).toContainText("Pro");
  await expect(component.locator("thead")).toContainText("Team");
});

test("renders <th scope='row'> for each feature label", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} />);
  const rowThs = component.locator("tbody th[scope='row']");
  await expect(rowThs).toHaveCount(simpleRows.length);
  await expect(rowThs.nth(0)).toContainText("Projects");
  await expect(rowThs.nth(1)).toContainText("Members");
});

test("renders <td> cells for each value", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} />);
  // 2 rows × 3 tiers = 6 td cells
  await expect(component.locator("tbody td")).toHaveCount(6);
});

test("renders value text in td cells", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} />);
  const tds = component.locator("tbody td");
  await expect(tds.nth(0)).toContainText("3");
  await expect(tds.nth(1)).toContainText("Unlimited");
});

// ---------------------------------------------------------------------------
// Group headings
// ---------------------------------------------------------------------------

test("renders group heading rows with correct colspan", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={rows} />);
  // Two group headings: "Storage" and "Support"
  const groupThs = component.locator("tbody th[scope='colgroup']");
  await expect(groupThs).toHaveCount(2);
  await expect(groupThs.nth(0)).toContainText("Storage");
  await expect(groupThs.nth(1)).toContainText("Support");
});

test("group heading <th> has colspan spanning all columns", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={rows} />);
  const groupTh = component.locator("tbody th[scope='colgroup']").first();
  // colCount = tiers.length + 1 = 4
  await expect(groupTh).toHaveAttribute("colspan", "4");
});

// ---------------------------------------------------------------------------
// Caption
// ---------------------------------------------------------------------------

test("renders visible <caption> when caption prop provided", async ({ mount }) => {
  const component = await mount(
    <ComparisonTable caption="Plan comparison" tiers={tiers} rows={simpleRows} />,
  );
  await expect(component.locator("caption")).toBeVisible();
  await expect(component.locator("caption")).toContainText("Plan comparison");
});

test("does not render <caption> when caption prop is absent", async ({ mount }) => {
  const component = await mount(
    <ComparisonTable aria-label="Plan comparison" tiers={tiers} rows={simpleRows} />,
  );
  await expect(component.locator("caption")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Root element is <section>
// ---------------------------------------------------------------------------

test("root element is a <section>", async ({ mount }) => {
  const component = await mount(<ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

// ---------------------------------------------------------------------------
// Shorthand tiers (string[])
// ---------------------------------------------------------------------------

test("accepts string[] shorthand for tiers", async ({ mount }) => {
  const component = await mount(
    <ComparisonTable caption="Test" tiers={["Free", "Pro", "Team"]} rows={simpleRows} />,
  );
  await expect(component.locator("thead")).toContainText("Free");
  await expect(component.locator("thead")).toContainText("Pro");
  await expect(component.locator("thead")).toContainText("Team");
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} className="custom-ct" />,
  );
  await expect(component).toHaveClass(/custom-ct/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <ComparisonTable caption="Test" tiers={tiers} rows={simpleRows} data-testid="ct-root" />,
  );
  await expect(component).toHaveAttribute("data-testid", "ct-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <ComparisonTable tiers={tiers} rows={simpleRows} aria-label="Plan comparison table" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Plan comparison table");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
