import { test, expect } from "@playwright/experimental-ct-react";
import { PriceTier } from "./PriceTier";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const defaultProps = {
  name: "Pro",
  price: "$49",
  cadence: "per month",
};

// ---------------------------------------------------------------------------
// Rendering: basic anatomy
// ---------------------------------------------------------------------------

test("renders the tier name", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.getByText("Pro")).toBeVisible();
});

test("renders the price", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.getByText("$49")).toBeVisible();
});

test("renders the cadence label", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.getByText("per month")).toBeVisible();
});

test("renders description when provided", async ({ mount }) => {
  const component = await mount(
    <PriceTier {...defaultProps} description="For teams that need more." />,
  );
  await expect(component.getByText("For teams that need more.")).toBeVisible();
});

test("does not render description when omitted", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.locator("p")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Features list
// ---------------------------------------------------------------------------

test("renders features as a list", async ({ mount }) => {
  const component = await mount(
    <PriceTier {...defaultProps} features={["Feature A", "Feature B", "Feature C"]} />,
  );
  await expect(component.locator("ul")).toBeVisible();
  await expect(component.locator("li")).toHaveCount(3);
  await expect(component.getByText("Feature A")).toBeVisible();
  await expect(component.getByText("Feature C")).toBeVisible();
});

test("does not render feature list when features omitted", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.locator("ul")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// CTA slot
// ---------------------------------------------------------------------------

test("renders CTA slot when provided", async ({ mount }) => {
  const component = await mount(
    <PriceTier {...defaultProps} cta={<button type="button">Get started with Pro</button>} />,
  );
  await expect(component.getByText("Get started with Pro")).toBeVisible();
});

test("does not render CTA slot when omitted", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.locator("button")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Featured variant
// ---------------------------------------------------------------------------

test("renders Recommended label when featured", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} featured />);
  await expect(component.getByText("Recommended")).toBeVisible();
});

test("does not render Recommended label when not featured", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.getByText("Recommended")).toHaveCount(0);
});

test("applies featured class when featured=true", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} featured />);
  await expect(component).toHaveClass(/featured/);
});

test("does not apply featured class when featured=false", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component).not.toHaveClass(/featured/);
});

// ---------------------------------------------------------------------------
// Semantics: article + aria-labelledby
// ---------------------------------------------------------------------------

test("root element is article", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("article");
});

test("root has aria-labelledby pointing to the name heading", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  const labeled = component.locator(`[id="${labelledById}"]`);
  await expect(labeled).toBeVisible();
  await expect(labeled).toContainText("Pro");
});

test("name is rendered as h3", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  const h3 = component.locator("h3");
  await expect(h3).toBeVisible();
  await expect(h3).toContainText("Pro");
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} className="custom-tier" />);
  await expect(component).toHaveClass(/custom-tier/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} data-testid="tier-root" />);
  await expect(component).toHaveAttribute("data-testid", "tier-root");
});
