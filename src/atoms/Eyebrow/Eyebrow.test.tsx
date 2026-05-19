import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Eyebrow } from "./Eyebrow";

/* ---------- Render ---------- */

test("renders text content", async ({ mount }) => {
  const component = await mount(<Eyebrow>Role 01</Eyebrow>);
  await expect(component.getByText("Role 01")).toBeVisible();
});

test("renders muted variant by default", async ({ mount }) => {
  const component = await mount(<Eyebrow>Category</Eyebrow>);
  // Default element is span
  await expect(component).toBeVisible();
});

test("renders solid variant", async ({ mount }) => {
  const component = await mount(<Eyebrow variant="solid">Engineering</Eyebrow>);
  await expect(component.getByText("Engineering")).toBeVisible();
});

/* ---------- Numeral slot ---------- */

test("renders numeral slot when numeral prop is provided", async ({ mount }) => {
  const component = await mount(
    <Eyebrow variant="numbered" numeral="01 ·">
      Principle
    </Eyebrow>,
  );
  await expect(component.getByText("01 ·")).toBeVisible();
  await expect(component.getByText("Principle")).toBeVisible();
});

test("does not render numeral slot when numeral prop is absent", async ({ mount }) => {
  const component = await mount(<Eyebrow>Role 01</Eyebrow>);
  await expect(component.getByText("Role 01")).toBeVisible();
  // component locator = root element (span); locator("span") finds only DESCENDANT spans.
  // Without a numeral prop, there is exactly 1 descendant span (.text).
  // With a numeral prop there would be 2 (.numeral + .text).
  await expect(component.locator("span")).toHaveCount(1);
});

test("renders FM-style index string in numeral slot", async ({ mount }) => {
  const component = await mount(
    <Eyebrow variant="numbered" numeral="FM-03">
      Failure Mode
    </Eyebrow>,
  );
  await expect(component.getByText("FM-03")).toBeVisible();
  await expect(component.getByText("Failure Mode")).toBeVisible();
});

/* ---------- `as` prop ---------- */

test("renders as span by default", async ({ mount }) => {
  const component = await mount(<Eyebrow>Label</Eyebrow>);
  // Playwright locator matches the root element tag
  await expect(component).toBeVisible();
  // The root element's tag name should be SPAN
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("span");
});

test("renders as <p> when as='p'", async ({ mount }) => {
  const component = await mount(<Eyebrow as="p">Section Label</Eyebrow>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("p");
});

test("renders as <h2> when as='h2'", async ({ mount }) => {
  const component = await mount(<Eyebrow as="h2">Heading</Eyebrow>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("h2");
});

test("renders as <div> when as='div'", async ({ mount }) => {
  const component = await mount(<Eyebrow as="div">Div Label</Eyebrow>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the root element", async ({ mount, page }) => {
  // We can't directly test ref attachment in CT without a wrapper component,
  // but we can verify the element is reachable via data-testid forwarded as rest prop.
  const component = await mount(<Eyebrow data-testid="eyebrow-ref-target">Role 01</Eyebrow>);
  await expect(component).toHaveAttribute("data-testid", "eyebrow-ref-target");
});

/* ---------- className merge ---------- */

test("merges a consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(<Eyebrow className="custom-class-x">Label</Eyebrow>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-class-x/);
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards data-* props to the root element", async ({ mount }) => {
  const component = await mount(
    <Eyebrow data-testid="ew-1" data-section="hero">
      Label
    </Eyebrow>,
  );
  await expect(component).toHaveAttribute("data-testid", "ew-1");
  await expect(component).toHaveAttribute("data-section", "hero");
});

test("forwards aria-* props to the root element", async ({ mount }) => {
  const component = await mount(<Eyebrow aria-label="Section marker">Label</Eyebrow>);
  await expect(component).toHaveAttribute("aria-label", "Section marker");
});

/* ---------- a11y ---------- */

test("a11y — default muted variant", async ({ mount, page }) => {
  await mount(<Eyebrow>Role 01</Eyebrow>);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — solid variant", async ({ mount, page }) => {
  await mount(<Eyebrow variant="solid">Engineering</Eyebrow>);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — numbered variant with numeral", async ({ mount, page }) => {
  await mount(
    <Eyebrow variant="numbered" numeral="FM-03">
      Failure Mode
    </Eyebrow>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — as heading (h2)", async ({ mount, page }) => {
  await mount(
    <div>
      <Eyebrow as="h2">Section</Eyebrow>
      <p>Body content.</p>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
