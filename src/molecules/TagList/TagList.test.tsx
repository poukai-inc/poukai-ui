import { test, expect } from "@playwright/experimental-ct-react";
import { TagList } from "./TagList.js";
import { Tag } from "../../atoms/Tag/index.js";

test("renders Tag children", async ({ mount }) => {
  const component = await mount(
    <TagList>
      <Tag>Engineering</Tag>
      <Tag>Design Systems</Tag>
    </TagList>,
  );
  await expect(component).toContainText("Engineering");
  await expect(component).toContainText("Design Systems");
});

test("renders all children when max is not set", async ({ mount }) => {
  const component = await mount(
    <TagList>
      <Tag>One</Tag>
      <Tag>Two</Tag>
      <Tag>Three</Tag>
      <Tag>Four</Tag>
      <Tag>Five</Tag>
    </TagList>,
  );
  await expect(component).toContainText("One");
  await expect(component).toContainText("Five");
  await expect(component).not.toContainText("+");
});

test("max prop: shows only first N children and overflow pill", async ({ mount }) => {
  const component = await mount(
    <TagList max={3}>
      <Tag>One</Tag>
      <Tag>Two</Tag>
      <Tag>Three</Tag>
      <Tag>Four</Tag>
      <Tag>Five</Tag>
    </TagList>,
  );
  await expect(component).toContainText("One");
  await expect(component).toContainText("Two");
  await expect(component).toContainText("Three");
  await expect(component).not.toContainText("Four");
  await expect(component).not.toContainText("Five");
  await expect(component).toContainText("+2");
});

test("max prop: no overflow pill when child count equals max", async ({ mount }) => {
  const component = await mount(
    <TagList max={3}>
      <Tag>One</Tag>
      <Tag>Two</Tag>
      <Tag>Three</Tag>
    </TagList>,
  );
  await expect(component).toContainText("One");
  await expect(component).toContainText("Two");
  await expect(component).toContainText("Three");
  await expect(component).not.toContainText("+");
});

test("max prop: no overflow pill when child count is less than max", async ({ mount }) => {
  const component = await mount(
    <TagList max={5}>
      <Tag>One</Tag>
      <Tag>Two</Tag>
    </TagList>,
  );
  await expect(component).toContainText("One");
  await expect(component).toContainText("Two");
  await expect(component).not.toContainText("+");
});

test("overflow count is correct for various child counts", async ({ mount }) => {
  const component = await mount(
    <TagList max={2}>
      <Tag>One</Tag>
      <Tag>Two</Tag>
      <Tag>Three</Tag>
      <Tag>Four</Tag>
      <Tag>Five</Tag>
    </TagList>,
  );
  await expect(component).toContainText("+3");
});

test("root element is a div", async ({ mount }) => {
  const component = await mount(
    <TagList>
      <Tag>Engineering</Tag>
    </TagList>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("forwards ref to root div", async ({ mount }) => {
  const component = await mount(
    <TagList>
      <Tag>Engineering</Tag>
    </TagList>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("forwards data-testid to root", async ({ mount }) => {
  const component = await mount(
    <TagList data-testid="taglist-root">
      <Tag>Engineering</Tag>
    </TagList>,
  );
  await expect(component).toHaveAttribute("data-testid", "taglist-root");
});

test("merges consumer className", async ({ mount }) => {
  const component = await mount(
    <TagList className="custom-taglist">
      <Tag>Engineering</Tag>
    </TagList>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-taglist/);
});

test("forwards arbitrary data-* attributes", async ({ mount }) => {
  const component = await mount(
    <TagList data-section="article-tags">
      <Tag>Engineering</Tag>
    </TagList>,
  );
  await expect(component).toHaveAttribute("data-section", "article-tags");
});
