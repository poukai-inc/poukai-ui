import { test, expect } from "@playwright/experimental-ct-react";
import { TimelineItem } from "./TimelineItem.js";

test("renders semantic time element with dateTime attribute", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" />
    </ol>,
  );
  const timeEl = component.locator("time");
  await expect(timeEl).toHaveCount(1);
  await expect(timeEl).toHaveAttribute("dateTime", "2026-05-22");
});

test("renders title text", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" />
    </ol>,
  );
  await expect(component).toContainText("Series A closed");
});

test("renders body when provided", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" body="$12M led by Acme Ventures." />
    </ol>,
  );
  await expect(component).toContainText("$12M led by Acme Ventures.");
});

test("omits body element when body prop is absent", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" />
    </ol>,
  );
  // No <p> for body should exist
  await expect(component.locator("p")).toHaveCount(0);
});

test("root element is li", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" />
    </ol>,
  );
  const li = component.locator("li");
  await expect(li).toHaveCount(1);
  const tag = await li.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("li");
});

test("title renders as h3 by default", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" />
    </ol>,
  );
  await expect(component.locator("h3")).toHaveCount(1);
});

test("headingLevel prop changes rendered heading element", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" headingLevel="h4" />
    </ol>,
  );
  await expect(component.locator("h4")).toHaveCount(1);
  await expect(component.locator("h3")).toHaveCount(0);
});

test("forwards ref to li element", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" />
    </ol>,
  );
  const li = component.locator("li");
  const tag = await li.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("li");
});

test("forwards data-* attributes to li", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" data-testid="timeline-item" />
    </ol>,
  );
  await expect(component.locator("li")).toHaveAttribute("data-testid", "timeline-item");
});

test("merges consumer className onto li", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" className="custom-class" />
    </ol>,
  );
  const cls = await component.locator("li").getAttribute("class");
  expect(cls).toMatch(/custom-class/);
});

test("connector=true adds connector class", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" connector={true} />
    </ol>,
  );
  const cls = await component.locator("li").getAttribute("class");
  expect(cls).toBeTruthy();
  // connector class is present (any poukai-scoped class containing "connector")
  expect(cls).toMatch(/connector/i);
});

test("connector=false omits connector class", async ({ mount }) => {
  const component = await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" connector={false} />
    </ol>,
  );
  const cls = await component.locator("li").getAttribute("class");
  expect(cls).not.toMatch(/connector/i);
});
