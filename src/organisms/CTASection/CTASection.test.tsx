import { test, expect } from "@playwright/experimental-ct-react";
import { CTASection } from "./CTASection";
import { Button } from "../../atoms/Button";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const defaultProps = {
  heading: "Ready to start?",
  body: "Spin up your first project in minutes.",
  actions: <Button>Get a demo</Button>,
};

// ---------------------------------------------------------------------------
// Rendering: CtaBlock composition
// ---------------------------------------------------------------------------

test("renders the heading text", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} />);
  await expect(component.getByText("Ready to start?")).toBeVisible();
});

test("renders body text when provided", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} />);
  await expect(component.getByText("Spin up your first project in minutes.")).toBeVisible();
});

test("renders actions slot", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} />);
  await expect(component.getByText("Get a demo")).toBeVisible();
});

test("does not render body when omitted", async ({ mount }) => {
  const component = await mount(
    <CTASection heading="Ready to start?" actions={<Button>Get a demo</Button>} />,
  );
  await expect(component.locator("p")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Rendering: landmark and heading element
// ---------------------------------------------------------------------------

test("renders a section landmark by default", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("renders as div when as=div", async ({ mount }) => {
  const component = await mount(<CTASection as="div" {...defaultProps} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("renders heading as h2 by default", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} />);
  const h2 = component.locator("h2");
  await expect(h2).toBeVisible();
  await expect(h2).toContainText("Ready to start?");
});

test("renders heading as h3 when headingAs=h3", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} headingAs="h3" />);
  const h3 = component.locator("h3");
  await expect(h3).toBeVisible();
  await expect(h3).toContainText("Ready to start?");
  await expect(component.locator("h2")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Surface variants
// ---------------------------------------------------------------------------

test("applies surfaceRecessed class when surface=recessed", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} surface="recessed" />);
  await expect(component).toHaveClass(/surfaceRecessed/);
});

test("does not apply surfaceRecessed class when surface=default", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} surface="default" />);
  await expect(component).not.toHaveClass(/surfaceRecessed/);
});

// ---------------------------------------------------------------------------
// Size variants
// ---------------------------------------------------------------------------

test("applies sizeTight class when size=tight", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} size="tight" />);
  await expect(component).toHaveClass(/sizeTight/);
});

test("does not apply sizeTight class when size=default", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} size="default" />);
  await expect(component).not.toHaveClass(/sizeTight/);
});

// ---------------------------------------------------------------------------
// aria-labelledby wiring
// ---------------------------------------------------------------------------

test("section has aria-labelledby pointing at the heading element", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} />);
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  const labeled = component.locator(`[id="${labelledById}"]`);
  await expect(labeled).toBeVisible();
  await expect(labeled).toContainText("Ready to start?");
});

test("as=div does not get aria-labelledby", async ({ mount }) => {
  const component = await mount(<CTASection as="div" {...defaultProps} />);
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeNull();
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} className="custom-cta-section" />);
  await expect(component).toHaveClass(/custom-cta-section/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<CTASection {...defaultProps} data-testid="cta-root" />);
  await expect(component).toHaveAttribute("data-testid", "cta-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(<CTASection as="div" {...defaultProps} aria-label="Page CTA" />);
  await expect(component).toHaveAttribute("aria-label", "Page CTA");
});
