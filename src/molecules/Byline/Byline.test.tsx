import { test, expect } from "@playwright/experimental-ct-react";
import { Byline } from "./Byline.js";

test("renders name", async ({ mount }) => {
  const component = await mount(<Byline name="Jane Doe" />);
  await expect(component).toContainText("Jane Doe");
});

test("renders role when provided", async ({ mount }) => {
  const component = await mount(<Byline name="Jane Doe" role="Editor" />);
  await expect(component).toContainText("Editor");
});

test("omits role when absent", async ({ mount }) => {
  const component = await mount(<Byline name="Jane Doe" />);
  await expect(component).toContainText("Jane Doe");
  await expect(component).not.toContainText("Editor");
});

test("renders time when publishedAt provided", async ({ mount }) => {
  const component = await mount(<Byline name="Jane Doe" publishedAt="2026-05-21T10:00:00Z" />);
  await expect(component.locator("time")).toHaveCount(1);
});

test("renders readTime when provided", async ({ mount }) => {
  const component = await mount(<Byline name="Jane Doe" readTime="6 min read" />);
  await expect(component).toContainText("6 min read");
});

test("omits trailing section when no publishedAt and no readTime", async ({ mount }) => {
  const component = await mount(<Byline name="Jane Doe" />);
  await expect(component.locator("time")).toHaveCount(0);
  // Dots are scoped to spans containing the middle-dot only (Avatar aria-hidden span excluded)
  const dots = component.locator('span[aria-hidden="true"]', { hasText: /^\s*·\s*$/ });
  await expect(dots).toHaveCount(0);
});

test("dots are aria-hidden", async ({ mount }) => {
  const component = await mount(
    <Byline name="Jane Doe" publishedAt="2026-05-21T10:00:00Z" readTime="6 min read" />,
  );
  const dots = component.locator('span[aria-hidden="true"]', { hasText: /^\s*·\s*$/ });
  const count = await dots.count();
  expect(count).toBe(2);
  for (const dot of await dots.all()) {
    await expect(dot).toHaveAttribute("aria-hidden", "true");
  }
});

test("renders both time and readTime with two separator dots", async ({ mount }) => {
  const component = await mount(
    <Byline name="Jane Doe" publishedAt="2026-05-21T10:00:00Z" readTime="6 min read" />,
  );
  await expect(component.locator("time")).toHaveCount(1);
  await expect(component).toContainText("6 min read");
  const dots = component.locator('span[aria-hidden="true"]', { hasText: /^\s*·\s*$/ });
  await expect(dots).toHaveCount(2);
});

test("renders only one dot when publishedAt present but no readTime", async ({ mount }) => {
  const component = await mount(<Byline name="Jane Doe" publishedAt="2026-05-21T10:00:00Z" />);
  const dots = component.locator('span[aria-hidden="true"]', { hasText: /^\s*·\s*$/ });
  await expect(dots).toHaveCount(1);
});

test("forwards ref to root div", async ({ mount }) => {
  const component = await mount(<Byline name="Jane Doe" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("forwards data-testid to root div", async ({ mount }) => {
  const component = await mount(<Byline name="Jane Doe" data-testid="byline-root" />);
  await expect(component).toHaveAttribute("data-testid", "byline-root");
});

test("merges consumer className", async ({ mount }) => {
  const component = await mount(<Byline name="Jane Doe" className="my-byline" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-byline/);
});
