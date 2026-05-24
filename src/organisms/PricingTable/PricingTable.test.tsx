import { test, expect } from "@playwright/experimental-ct-react";
import { PricingTable } from "./PricingTable";
import { PriceTier } from "../../molecules/PriceTier";
import { ThreeTiers } from "./__test_harness__";

// ---------------------------------------------------------------------------
// Rendering: section wrapper
// ---------------------------------------------------------------------------

test("renders a section landmark", async ({ mount }) => {
  const component = await mount(<ThreeTiers />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("renders all PriceTier children", async ({ mount }) => {
  const component = await mount(<ThreeTiers />);
  await expect(component.getByText("Starter")).toBeVisible();
  await expect(component.getByText("Pro")).toBeVisible();
  await expect(component.getByText("Enterprise")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Heading slot
// ---------------------------------------------------------------------------

test("renders heading slot when provided", async ({ mount }) => {
  const component = await mount(
    <PricingTable heading={<h2>Choose your plan</h2>}>
      <PriceTier name="Starter" price="$0" />
      <PriceTier featured name="Pro" price="$49" />
    </PricingTable>,
  );
  await expect(component.getByText("Choose your plan")).toBeVisible();
});

test("does not render heading slot when omitted", async ({ mount }) => {
  const component = await mount(
    <PricingTable>
      <PriceTier name="Starter" price="$0" />
    </PricingTable>,
  );
  await expect(component.locator("h2")).toHaveCount(0);
});

test("section has aria-labelledby when heading is provided", async ({ mount }) => {
  const component = await mount(
    <PricingTable heading={<h2>Pricing</h2>}>
      <PriceTier name="Starter" price="$0" />
    </PricingTable>,
  );
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  const labeled = component.locator(`[id="${labelledById}"]`);
  await expect(labeled).toBeVisible();
  await expect(labeled).toContainText("Pricing");
});

test("section does not have aria-labelledby when heading is omitted", async ({ mount }) => {
  const component = await mount(
    <PricingTable>
      <PriceTier name="Starter" price="$0" />
    </PricingTable>,
  );
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeNull();
});

// ---------------------------------------------------------------------------
// Grid class
// ---------------------------------------------------------------------------

test("applies grid class to the tier container", async ({ mount }) => {
  const component = await mount(<ThreeTiers />);
  await expect(component.locator("[class*='grid']").first()).toBeVisible();
});

test("applies columns2 class when columns=2", async ({ mount }) => {
  const component = await mount(
    <PricingTable columns={2}>
      <PriceTier name="A" price="$0" />
      <PriceTier name="B" price="$9" />
    </PricingTable>,
  );
  await expect(component.locator("[class*='columns2']")).toBeVisible();
});

test("applies columns3 class when columns=3", async ({ mount }) => {
  const component = await mount(
    <PricingTable columns={3}>
      <PriceTier name="A" price="$0" />
      <PriceTier name="B" price="$9" />
      <PriceTier name="C" price="$49" />
    </PricingTable>,
  );
  await expect(component.locator("[class*='columns3']")).toBeVisible();
});

test("applies alignTop class when align=top", async ({ mount }) => {
  const component = await mount(
    <PricingTable align="top">
      <PriceTier name="A" price="$0" />
    </PricingTable>,
  );
  await expect(component.locator("[class*='alignTop']")).toBeVisible();
});

test("does not apply alignTop class when align=stretch (default)", async ({ mount }) => {
  const component = await mount(
    <PricingTable>
      <PriceTier name="A" price="$0" />
    </PricingTable>,
  );
  await expect(component.locator("[class*='alignTop']")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Comparison slot
// ---------------------------------------------------------------------------

test("renders comparison slot when provided", async ({ mount }) => {
  const component = await mount(
    <PricingTable comparison={<div data-testid="comparison-body">Comparison content</div>}>
      <PriceTier name="Starter" price="$0" />
    </PricingTable>,
  );
  await expect(component.getByTestId("comparison-body")).toBeVisible();
  await expect(component.getByText("Comparison content")).toBeVisible();
});

test("does not render comparison slot when omitted", async ({ mount }) => {
  const component = await mount(
    <PricingTable>
      <PriceTier name="Starter" price="$0" />
    </PricingTable>,
  );
  await expect(component.locator("[class*='comparisonSlot']")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <PricingTable className="custom-pricing">
      <PriceTier name="A" price="$0" />
    </PricingTable>,
  );
  await expect(component).toHaveClass(/custom-pricing/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <PricingTable data-testid="pricing-root">
      <PriceTier name="A" price="$0" />
    </PricingTable>,
  );
  await expect(component).toHaveAttribute("data-testid", "pricing-root");
});

test("forwards aria-label to root element when no heading", async ({ mount }) => {
  const component = await mount(
    <PricingTable aria-label="Pricing plans">
      <PriceTier name="A" price="$0" />
    </PricingTable>,
  );
  await expect(component).toHaveAttribute("aria-label", "Pricing plans");
});
