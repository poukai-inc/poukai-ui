import { test, expect } from "@playwright/experimental-ct-react";
import { TimelineSection } from "./TimelineSection";
import { TimelineItem } from "../../molecules/TimelineItem";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const ThreeItems = (
  <>
    <TimelineItem date="2024-01" title="Item one" body="First body." connector />
    <TimelineItem date="2024-06" title="Item two" body="Second body." connector />
    <TimelineItem date="2025-01" title="Item three" connector={false} />
  </>
);

// ---------------------------------------------------------------------------
// Rendering: basic structure
// ---------------------------------------------------------------------------

test("renders a section landmark", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Our story">{ThreeItems}</TimelineSection>,
  );
  // Section molecule renders <section> as root — component IS the root element
  await expect(component).toBeVisible();
  // Verify aria-labelledby is wired to the heading (Section's a11y contract)
  const labelledBy = await component.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
});

test("renders an ordered list track", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Our story">{ThreeItems}</TimelineSection>,
  );
  await expect(component.locator("ol")).toBeVisible();
});

test("renders correct number of TimelineItem entries", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Our story">{ThreeItems}</TimelineSection>,
  );
  await expect(component.locator("li")).toHaveCount(3);
});

// ---------------------------------------------------------------------------
// Rendering: header slots
// ---------------------------------------------------------------------------

test("renders heading when provided", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Our story">{ThreeItems}</TimelineSection>,
  );
  await expect(component.locator("h2")).toContainText("Our story");
});

test("renders h1 when headingAs=h1", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Page title" headingAs="h1">
      {ThreeItems}
    </TimelineSection>,
  );
  await expect(component.locator("h1")).toContainText("Page title");
});

test("renders h3 when headingAs=h3", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Sub section" headingAs="h3">
      {ThreeItems}
    </TimelineSection>,
  );
  // TimelineItem children also render h3 by default — use text match to target the section heading
  await expect(component.locator("h3").filter({ hasText: "Sub section" })).toBeVisible();
});

test("renders eyebrow text when provided", async ({ mount }) => {
  const component = await mount(
    <TimelineSection eyebrow="History" heading="Our story">
      {ThreeItems}
    </TimelineSection>,
  );
  await expect(component.getByText("History")).toBeVisible();
});

test("renders lede when provided", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Our story" lede="Supporting copy for the timeline.">
      {ThreeItems}
    </TimelineSection>,
  );
  await expect(component.getByText("Supporting copy for the timeline.")).toBeVisible();
});

test("renders without header slots", async ({ mount }) => {
  const component = await mount(<TimelineSection>{ThreeItems}</TimelineSection>);
  await expect(component.locator("ol")).toBeVisible();
  await expect(component.locator("li")).toHaveCount(3);
});

// ---------------------------------------------------------------------------
// Rendering: TimelineItem content
// ---------------------------------------------------------------------------

test("renders TimelineItem title", async ({ mount }) => {
  const component = await mount(<TimelineSection heading="History">{ThreeItems}</TimelineSection>);
  await expect(component.getByText("Item one")).toBeVisible();
  await expect(component.getByText("Item two")).toBeVisible();
  await expect(component.getByText("Item three")).toBeVisible();
});

test("renders TimelineItem body when provided", async ({ mount }) => {
  const component = await mount(<TimelineSection heading="History">{ThreeItems}</TimelineSection>);
  await expect(component.getByText("First body.")).toBeVisible();
  await expect(component.getByText("Second body.")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Props: reversed
// ---------------------------------------------------------------------------

test("ol has reversed attribute when reversed=true", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Changelog" reversed>
      {ThreeItems}
    </TimelineSection>,
  );
  const ol = component.locator("ol");
  await expect(ol).toHaveAttribute("reversed");
});

test("ol does not have reversed attribute by default", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Changelog">{ThreeItems}</TimelineSection>,
  );
  const ol = component.locator("ol");
  await expect(ol).not.toHaveAttribute("reversed");
});

// ---------------------------------------------------------------------------
// Props: ref, className, data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Our story" className="test-custom-class">
      {ThreeItems}
    </TimelineSection>,
  );
  await expect(component).toHaveClass(/test-custom-class/);
});

test("forwards data-* attributes to root", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Our story" data-testid="ts-root">
      {ThreeItems}
    </TimelineSection>,
  );
  await expect(component).toHaveAttribute("data-testid", "ts-root");
});

test("forwards aria-label to root", async ({ mount }) => {
  const component = await mount(
    <TimelineSection aria-label="Company milestones timeline">{ThreeItems}</TimelineSection>,
  );
  await expect(component).toHaveAttribute("aria-label", "Company milestones timeline");
});

// ---------------------------------------------------------------------------
// Vertical layout
// ---------------------------------------------------------------------------

test("track list renders items in a column", async ({ mount }) => {
  const component = await mount(
    <TimelineSection heading="Our story">{ThreeItems}</TimelineSection>,
  );
  const items = component.locator("li");
  const count = await items.count();
  expect(count).toBe(3);

  // Verify vertical order by checking bounding boxes
  const boxes = await Promise.all(
    Array.from({ length: count }, (_, i) => items.nth(i).boundingBox()),
  );
  // Each item's top should be below the previous item's top
  for (let i = 1; i < boxes.length; i++) {
    const prev = boxes[i - 1];
    const curr = boxes[i];
    if (prev !== null && curr !== null) {
      expect(curr.y).toBeGreaterThan(prev.y);
    }
  }
});
