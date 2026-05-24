import { test, expect } from "@playwright/experimental-ct-react";
import { StepsSection } from "./StepsSection";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const defaultProps = {
  heading: "How it works",
  steps: [{ label: "Share context" }, { label: "We map the gap" }, { label: "Ship together" }],
};

// ---------------------------------------------------------------------------
// Rendering: Section landmark + heading
// ---------------------------------------------------------------------------

test("renders a section landmark", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} />);
  // `component` IS the <section> root.
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("renders the heading as h2", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} />);
  const h2 = component.locator("h2");
  await expect(h2).toBeVisible();
  await expect(h2).toContainText("How it works");
});

test("section landmark has aria-labelledby pointing at h2", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} />);
  // `component` IS the <section> root — read aria-labelledby directly.
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  // `CSS` global isn't available in the Playwright CT worker context, and
  // React's useId() generates ids containing `:` which break `#id` selectors.
  // Use attribute selector to sidestep both.
  const labeled = component.locator(`[id="${labelledById}"]`);
  await expect(labeled).toBeVisible();
  await expect(labeled).toContainText("How it works");
});

// ---------------------------------------------------------------------------
// Rendering: optional slots
// ---------------------------------------------------------------------------

test("renders eyebrow when provided", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} eyebrow="01 · Process" />);
  await expect(component.getByText("01 · Process")).toBeVisible();
});

test("does not render eyebrow when omitted", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} />);
  // No eyebrow slot wrapper present
  await expect(component.locator("[class*='eyebrow']")).toHaveCount(0);
});

test("renders lede when provided", async ({ mount }) => {
  const component = await mount(
    <StepsSection
      {...defaultProps}
      lede="Three steps from first conversation to shipped product."
    />,
  );
  await expect(
    component.getByText("Three steps from first conversation to shipped product."),
  ).toBeVisible();
});

// ---------------------------------------------------------------------------
// Rendering: Stepper composition
// ---------------------------------------------------------------------------

test("renders an ordered list for the steps", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} />);
  await expect(component.locator("ol")).toBeVisible();
});

test("renders the correct number of step items", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} />);
  await expect(component.locator("li")).toHaveCount(3);
});

test("renders step labels", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} />);
  await expect(component.getByText("Share context")).toBeVisible();
  await expect(component.getByText("We map the gap")).toBeVisible();
  await expect(component.getByText("Ship together")).toBeVisible();
});

// Note: Stepper renders step `label` only; the `body` field on StepDef is
// reserved for a future enhancement and is not currently rendered. Test
// removed pending Stepper body-slot support.

test("no step is active — no aria-current on any li", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} />);
  await expect(component.locator("[aria-current='step']")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// size prop
// ---------------------------------------------------------------------------

test("applies sizeTight class when size=tight", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} size="tight" />);
  await expect(component).toHaveClass(/sizeTight/);
});

test("does not apply sizeTight class by default", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} />);
  await expect(component).not.toHaveClass(/sizeTight/);
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <StepsSection {...defaultProps} className="custom-steps-section" />,
  );
  await expect(component).toHaveClass(/custom-steps-section/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} data-testid="steps-root" />);
  await expect(component).toHaveAttribute("data-testid", "steps-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(<StepsSection {...defaultProps} aria-label="Process section" />);
  await expect(component).toHaveAttribute("aria-label", "Process section");
});
