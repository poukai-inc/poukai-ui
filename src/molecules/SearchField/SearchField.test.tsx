import { test, expect } from "@playwright/experimental-ct-react";
import { SearchField } from "./SearchField";

/* ---------- Root structure ---------- */

test("root element has role=search", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" />);
  await expect(component).toHaveAttribute("role", "search");
});

test("root element is a div", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" />);
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

/* ---------- Input ---------- */

test("input has type=search", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" />);
  await expect(component.getByRole("searchbox")).toHaveAttribute("type", "search");
});

test("input renders with correct placeholder", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" placeholder="Find something…" />);
  await expect(component.getByRole("searchbox")).toHaveAttribute("placeholder", "Find something…");
});

test("default placeholder is Search…", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" />);
  await expect(component.getByRole("searchbox")).toHaveAttribute("placeholder", "Search…");
});

/* ---------- Leading icon ---------- */

test("leading search icon is present and aria-hidden", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" />);
  // The icon span wrapping the SVG is aria-hidden="true"
  const iconWrap = component.locator("[aria-hidden='true']").first();
  await expect(iconWrap).toBeVisible();
});

/* ---------- Clear button — controlled mode ---------- */

test("clear button not visible when controlled value is empty", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" value="" onValueChange={() => {}} />);
  // No button with aria-label="Clear search" should be in the DOM
  await expect(component.getByRole("button", { name: "Clear search" })).not.toBeVisible();
});

test("clear button visible when controlled value is non-empty", async ({ mount }) => {
  const component = await mount(
    <SearchField label="Search" value="hello" onValueChange={() => {}} />,
  );
  await expect(component.getByRole("button", { name: "Clear search" })).toBeVisible();
});

/* ---------- onValueChange ---------- */

test("onValueChange fires on keystroke", async ({ mount }) => {
  const values: string[] = [];
  const component = await mount(
    <SearchField label="Search" value="" onValueChange={(v) => values.push(v)} />,
  );
  await component.getByRole("searchbox").fill("hello");
  expect(values.length).toBeGreaterThan(0);
  expect(values[values.length - 1]).toBe("hello");
});

/* ---------- Clear button interaction ---------- */

test("clicking clear button calls onValueChange with empty string", async ({ mount }) => {
  const values: string[] = [];
  const component = await mount(
    <SearchField label="Search" value="hello" onValueChange={(v) => values.push(v)} />,
  );
  await component.getByRole("button", { name: "Clear search" }).click();
  expect(values).toContain("");
});

test("after clear, focus returns to the input", async ({ mount, page }) => {
  const component = await mount(
    <SearchField label="Search" value="hello" onValueChange={() => {}} />,
  );
  await component.getByRole("button", { name: "Clear search" }).click();
  // Input should be focused
  await expect(component.getByRole("searchbox")).toBeFocused();
});

/* ---------- Disabled state ---------- */

test("disabled input is not interactive", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" value="" disabled />);
  await expect(component.getByRole("searchbox")).toBeDisabled();
});

/* ---------- Forwarding ---------- */

test("forwards ref to root div", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" data-testid="sf-root" />);
  await expect(component).toHaveAttribute("data-testid", "sf-root");
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

test("merges consumer className onto root", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" className="my-search" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/my-search/);
});

test("forwards data-* props to root element", async ({ mount }) => {
  const component = await mount(<SearchField label="Search" data-analytics="search-field" />);
  await expect(component).toHaveAttribute("data-analytics", "search-field");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
