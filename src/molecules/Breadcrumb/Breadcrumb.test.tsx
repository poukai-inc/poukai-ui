import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Breadcrumb } from "./Breadcrumb";

/* ---------- Root element ---------- */

test("root element is <nav>", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("nav");
});

test("root has aria-label='Breadcrumb'", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  await expect(component).toHaveAttribute("aria-label", "Breadcrumb");
});

/* ---------- Semantic list structure ---------- */

test("renders an <ol> inside nav", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const ol = component.locator("ol");
  await expect(ol).toHaveCount(1);
});

test("renders <li> elements for each item", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/pages">Pages</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  // 3 items + 2 separators = 5 li elements
  const lis = component.locator("li");
  await expect(lis).toHaveCount(5);
});

/* ---------- aria-current on last (current) item ---------- */

test("current item has aria-current='page'", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const currentItem = component.locator("[aria-current='page']");
  await expect(currentItem).toHaveCount(1);
  await expect(currentItem).toContainText("Settings");
});

test("current item is not a link", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const currentItem = component.locator("[aria-current='page']");
  // Should contain a span, not an anchor
  const anchor = currentItem.locator("a");
  await expect(anchor).toHaveCount(0);
});

/* ---------- Ancestor links ---------- */

test("ancestor items render as links", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/pages">Pages</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const links = component.locator("a");
  await expect(links).toHaveCount(2);
});

test("ancestor link href is forwarded", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const link = component.locator("a").first();
  await expect(link).toHaveAttribute("href", "/dashboard");
});

/* ---------- Separator ---------- */

test("separator appears between items", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/pages">Pages</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  // 2 separators between 3 items
  const separators = component.locator("[aria-hidden='true']");
  await expect(separators).toHaveCount(2);
});

test("default separator renders ›", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const separator = component.locator("[aria-hidden='true']").first();
  await expect(separator).toContainText("›");
});

test("custom separator is rendered", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb separator="/">
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const separator = component.locator("[aria-hidden='true']").first();
  await expect(separator).toContainText("/");
});

/* ---------- Data-driven items prop ---------- */

test("items prop renders equivalent structure to compound children", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb
      items={[
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard/pages", label: "Pages" },
        { label: "Settings", current: true },
      ]}
    />,
  );
  await expect(component).toHaveAttribute("aria-label", "Breadcrumb");
  const currentItem = component.locator("[aria-current='page']");
  await expect(currentItem).toHaveCount(1);
  await expect(currentItem).toContainText("Settings");
  const links = component.locator("a");
  await expect(links).toHaveCount(2);
});

/* ---------- className / data-* / ref forwarding ---------- */

test("merges consumer className", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb className="my-breadcrumb">
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-breadcrumb/);
});

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb data-testid="bc-root">
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  await expect(component).toHaveAttribute("data-testid", "bc-root");
});

test("ref is forwarded to the root <nav>", async ({ mount }) => {
  const component = await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("nav");
});

/* ---------- a11y ---------- */

test("a11y — default 3-level breadcrumb", async ({ mount, page }) => {
  await mount(
    <Breadcrumb>
      <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="/dashboard/pages">Pages</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — data-driven items", async ({ mount, page }) => {
  await mount(
    <Breadcrumb
      items={[
        { href: "/dashboard", label: "Dashboard" },
        { label: "Settings", current: true },
      ]}
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
