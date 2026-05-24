import { test, expect } from "@playwright/experimental-ct-react";
import { FailureModeList } from "./FailureModeList";
import { FailureMode } from "../../molecules/FailureMode";
import { TwoItems, WithAllSlots } from "./__test_harness__";

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

test("renders FailureMode children", async ({ mount }) => {
  const component = await mount(<TwoItems />);
  await expect(component.getByText("First failure mode.")).toBeVisible();
  await expect(component.getByText("Second failure mode.")).toBeVisible();
  await expect(component.getByText("Body text one.")).toBeVisible();
  await expect(component.getByText("Body text two.")).toBeVisible();
});

test("renders heading when provided", async ({ mount }) => {
  const component = await mount(<TwoItems />);
  await expect(component.getByText("How this breaks")).toBeVisible();
});

test("renders eyebrow, lede when provided", async ({ mount }) => {
  const component = await mount(<WithAllSlots />);
  await expect(component.getByText("Where things fail")).toBeVisible();
  await expect(component.getByText("Supporting copy for the section.")).toBeVisible();
});

test("renders without heading (no-heading variant)", async ({ mount }) => {
  const component = await mount(
    <FailureModeList>
      <FailureMode index={1} title="Solo item.">
        <p>Solo body.</p>
      </FailureMode>
    </FailureModeList>,
  );
  await expect(component.getByText("Solo item.")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Root element — component IS the section root
// ---------------------------------------------------------------------------

test("root element is a section", async ({ mount }) => {
  const component = await mount(<TwoItems />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

// ---------------------------------------------------------------------------
// Vertical layout — list container
// ---------------------------------------------------------------------------

test("list container renders as a div wrapping children", async ({ mount }) => {
  const component = await mount(<TwoItems />);
  // component IS the root section; locator searches INSIDE it, finding 2 child FailureMode sections
  const sections = component.locator("section");
  await expect(sections).toHaveCount(2);
});

// ---------------------------------------------------------------------------
// Prop forwarding
// ---------------------------------------------------------------------------

test("forwards className to root", async ({ mount }) => {
  const component = await mount(
    <FailureModeList heading="Test" className="custom-class">
      <FailureMode index={1} title="Item.">
        <p>Body.</p>
      </FailureMode>
    </FailureModeList>,
  );
  await expect(component).toHaveClass(/custom-class/);
});

test("forwards data-* attributes to root", async ({ mount }) => {
  const component = await mount(
    <FailureModeList heading="Test" data-testid="fml-root">
      <FailureMode index={1} title="Item.">
        <p>Body.</p>
      </FailureMode>
    </FailureModeList>,
  );
  await expect(component).toHaveAttribute("data-testid", "fml-root");
});

test("forwards ref to root element", async ({ mount }) => {
  const component = await mount(
    <FailureModeList heading="Test">
      <FailureMode index={1} title="Item.">
        <p>Body.</p>
      </FailureMode>
    </FailureModeList>,
  );
  // Verify the root is accessible as a DOM element (ref target)
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

// ---------------------------------------------------------------------------
// Size variants
// ---------------------------------------------------------------------------

test("renders with size=tight without error", async ({ mount }) => {
  const component = await mount(
    <FailureModeList heading="Tight" size="tight">
      <FailureMode index={1} title="Item.">
        <p>Body.</p>
      </FailureMode>
    </FailureModeList>,
  );
  await expect(component.getByText("Tight")).toBeVisible();
});

// ---------------------------------------------------------------------------
// titleAs
// ---------------------------------------------------------------------------

test("renders heading with titleAs=h1", async ({ mount }) => {
  const component = await mount(
    <FailureModeList heading="Page heading" titleAs="h1">
      <FailureMode index={1} title="Item.">
        <p>Body.</p>
      </FailureMode>
    </FailureModeList>,
  );
  const h1 = component.locator("h1");
  await expect(h1).toHaveText("Page heading");
});

test("renders heading as h2 by default", async ({ mount }) => {
  const component = await mount(<TwoItems />);
  const h2 = component.locator("h2");
  await expect(h2).toHaveText("How this breaks");
});
