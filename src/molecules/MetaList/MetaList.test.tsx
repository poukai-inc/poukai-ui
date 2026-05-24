import { test, expect } from "@playwright/experimental-ct-react";
import { MetaList } from "./MetaList";

const ITEMS = [
  { label: "Published", value: "2026-05-22" },
  { label: "Reading time", value: "6 min" },
];

test("renders a <dl> root element", async ({ mount }) => {
  const component = await mount(<MetaList items={ITEMS} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("dl");
});

test("renders dt and dd elements for each item", async ({ mount }) => {
  const component = await mount(<MetaList items={ITEMS} />);
  await expect(component.locator("dt")).toHaveCount(2);
  await expect(component.locator("dd")).toHaveCount(2);
});

test("renders correct label text in dt elements", async ({ mount }) => {
  const component = await mount(<MetaList items={ITEMS} />);
  await expect(component.locator("dt").nth(0)).toHaveText("Published");
  await expect(component.locator("dt").nth(1)).toHaveText("Reading time");
});

test("renders correct value text in dd elements", async ({ mount }) => {
  const component = await mount(<MetaList items={ITEMS} />);
  await expect(component.locator("dd").nth(0)).toHaveText("2026-05-22");
  await expect(component.locator("dd").nth(1)).toHaveText("6 min");
});

test("wraps each pair in a div row", async ({ mount }) => {
  const component = await mount(<MetaList items={ITEMS} />);
  await expect(component.locator("div")).toHaveCount(2);
});

test("renders ReactNode values", async ({ mount }) => {
  const component = await mount(
    <MetaList items={[{ label: "Status", value: <span data-testid="node-value">Active</span> }]} />,
  );
  await expect(component.locator("[data-testid='node-value']")).toBeVisible();
  await expect(component.locator("[data-testid='node-value']")).toHaveText("Active");
});

test("renders empty list with no rows", async ({ mount }) => {
  const component = await mount(<MetaList items={[]} />);
  await expect(component.locator("div")).toHaveCount(0);
  await expect(component.locator("dt")).toHaveCount(0);
  await expect(component.locator("dd")).toHaveCount(0);
});

test("forwards ref to dl element", async ({ mount }) => {
  const component = await mount(<MetaList items={ITEMS} data-testid="meta-dl" />);
  await expect(component).toHaveAttribute("data-testid", "meta-dl");
});

test("forwards className to root dl", async ({ mount }) => {
  const component = await mount(<MetaList items={ITEMS} className="custom-class" />);
  await expect(component).toHaveClass(/custom-class/);
});

test("forwards aria-label to root dl", async ({ mount }) => {
  const component = await mount(<MetaList items={ITEMS} aria-label="Article metadata" />);
  await expect(component).toHaveAttribute("aria-label", "Article metadata");
});

test("forwards data-* props to root dl", async ({ mount }) => {
  const component = await mount(<MetaList items={ITEMS} data-section="meta" />);
  await expect(component).toHaveAttribute("data-section", "meta");
});
