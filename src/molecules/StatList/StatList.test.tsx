import { test, expect } from "@playwright/experimental-ct-react";
import { Stat } from "../../atoms/Stat";
import { StatList } from "./StatList";

test("renders Stat children inside listitem wrappers", async ({ mount }) => {
  const component = await mount(
    <StatList>
      <Stat value="85%" caption="plateau rate" />
      <Stat value="$300B" caption="annual spend" />
    </StatList>,
  );
  await expect(component.getByText("85%")).toBeVisible();
  await expect(component.getByText("plateau rate")).toBeVisible();
  await expect(component.getByText("$300B")).toBeVisible();
  await expect(component.getByText("annual spend")).toBeVisible();
});

test("root has role=list and items have role=listitem", async ({ mount }) => {
  const component = await mount(
    <StatList>
      <Stat value="12k" caption="Users" />
      <Stat value="200" caption="Customers" />
    </StatList>,
  );
  await expect(component).toHaveAttribute("role", "list");
  const items = component.locator("[role='listitem']");
  await expect(items).toHaveCount(2);
});

test("dividers=false renders no ::before pseudo content class", async ({ mount }) => {
  const component = await mount(
    <StatList dividers={false}>
      <Stat value="85%" caption="rate" />
      <Stat value="3.2×" caption="multiplier" />
    </StatList>,
  );
  // The root element should not include the dividers class
  const className = await component.getAttribute("class");
  expect(className).not.toMatch(/dividers/);
});

test("dividers=true applies dividers class to root", async ({ mount }) => {
  const component = await mount(
    <StatList dividers>
      <Stat value="85%" caption="rate" />
      <Stat value="3.2×" caption="multiplier" />
    </StatList>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/dividers/);
});

test("three Stat children produce three listitem wrappers", async ({ mount }) => {
  const component = await mount(
    <StatList>
      <Stat value="12k" caption="Users" />
      <Stat value="200" caption="Customers" />
      <Stat value="99.9%" caption="Uptime" />
    </StatList>,
  );
  await expect(component.locator("[role='listitem']")).toHaveCount(3);
});

test("forwards ref to root element", async ({ mount }) => {
  const component = await mount(
    <StatList data-testid="statlist-root">
      <Stat value="1" caption="one" />
    </StatList>,
  );
  await expect(component).toHaveAttribute("data-testid", "statlist-root");
});

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(
    <StatList className="custom-layout">
      <Stat value="1" caption="one" />
    </StatList>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-layout/);
  expect(className).toMatch(/root/);
});

test("forwards data-* and aria-* props to root", async ({ mount }) => {
  const component = await mount(
    <StatList data-testid="sl" aria-label="Key metrics">
      <Stat value="1" caption="one" />
    </StatList>,
  );
  await expect(component).toHaveAttribute("data-testid", "sl");
  await expect(component).toHaveAttribute("aria-label", "Key metrics");
});

test("align=start applies alignStart class", async ({ mount }) => {
  const component = await mount(
    <StatList align="start">
      <Stat value="1" caption="one" />
      <Stat value="2" caption="two" />
    </StatList>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/alignStart/);
});

test("align=center (default) applies alignCenter class", async ({ mount }) => {
  const component = await mount(
    <StatList>
      <Stat value="1" caption="one" />
      <Stat value="2" caption="two" />
    </StatList>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/alignCenter/);
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
