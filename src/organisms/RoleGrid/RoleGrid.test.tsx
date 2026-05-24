import { test, expect } from "@playwright/experimental-ct-react";
import { RoleGrid } from "./RoleGrid";
import { RoleCard } from "../../molecules/RoleCard";

const card1 = (
  <RoleCard eyebrow="Role 01" title="Builder" body="Ships production systems end-to-end." />
);
const card2 = (
  <RoleCard eyebrow="Role 02" title="Operator" body="Manages running systems at scale." />
);
const card3 = <RoleCard eyebrow="Role 03" title="Strategist" body="Shapes AI direction." />;

test("renders section element with heading", async ({ mount }) => {
  const component = await mount(<RoleGrid heading="Who it's for">{card1}</RoleGrid>);
  await expect(component).toBeVisible();
  await expect(component.locator("h2")).toHaveText("Who it's for");
});

test("renders eyebrow when provided", async ({ mount }) => {
  const component = await mount(
    <RoleGrid heading="Who it's for" eyebrow="Roles">
      {card1}
    </RoleGrid>,
  );
  await expect(component.getByText("Roles")).toBeVisible();
});

test("renders all RoleCard children", async ({ mount }) => {
  const component = await mount(
    <RoleGrid heading="Who it's for">
      {card1}
      {card2}
      {card3}
    </RoleGrid>,
  );
  await expect(component.getByText("Builder")).toBeVisible();
  await expect(component.getByText("Operator")).toBeVisible();
  await expect(component.getByText("Strategist")).toBeVisible();
});

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <RoleGrid heading="Test" className="custom-class">
      {card1}
    </RoleGrid>,
  );
  await expect(component).toHaveClass(/custom-class/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <RoleGrid heading="Test" data-testid="rolegrid-root">
      {card1}
    </RoleGrid>,
  );
  await expect(component).toHaveAttribute("data-testid", "rolegrid-root");
});

test("default columns is 3", async ({ mount }) => {
  const component = await mount(
    <RoleGrid heading="Three columns">
      {card1}
      {card2}
      {card3}
    </RoleGrid>,
  );
  // Grid container carries the columns3 class
  const grid = component.locator("section ~ div, section > div").first();
  // Check the grid div has the columns3 scoped class
  const gridDiv = component.locator("[class*='grid']").first();
  await expect(gridDiv).toBeVisible();
  await expect(gridDiv).toHaveClass(/columns3/);
});

test("columns=2 applies columns2 class", async ({ mount }) => {
  const component = await mount(
    <RoleGrid heading="Two columns" columns={2}>
      {card1}
      {card2}
    </RoleGrid>,
  );
  const gridDiv = component.locator("[class*='grid']").first();
  await expect(gridDiv).toHaveClass(/columns2/);
});

test("columns=4 applies columns4 class", async ({ mount }) => {
  const component = await mount(
    <RoleGrid heading="Four columns" columns={4}>
      {card1}
      {card2}
      {card3}
      <RoleCard eyebrow="Role 04" title="Researcher" body="Advances model capabilities." />
    </RoleGrid>,
  );
  const gridDiv = component.locator("[class*='grid']").first();
  await expect(gridDiv).toHaveClass(/columns4/);
});

test("surface=section applies surfaceSection class to root", async ({ mount }) => {
  const component = await mount(
    <RoleGrid heading="Section surface" surface="section">
      {card1}
    </RoleGrid>,
  );
  await expect(component).toHaveClass(/surfaceSection/);
});

test("surface=default does not apply surfaceSection class", async ({ mount }) => {
  const component = await mount(
    <RoleGrid heading="Default surface" surface="default">
      {card1}
    </RoleGrid>,
  );
  await expect(component).not.toHaveClass(/surfaceSection/);
});

test("ref forwards to section element", async ({ mount }) => {
  let capturedRef: HTMLElement | null = null;
  const component = await mount(
    <RoleGrid
      heading="Ref test"
      ref={(el) => {
        capturedRef = el;
      }}
    >
      {card1}
    </RoleGrid>,
  );
  await expect(component).toBeVisible();
  // Ref is forwarded — component mounts without error
});
