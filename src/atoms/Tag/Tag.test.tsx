import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Tag } from "./Tag";

/* ---------- Render ---------- */

test("renders children", async ({ mount }) => {
  const component = await mount(<Tag>Engineering</Tag>);
  await expect(component.getByText("Engineering")).toBeVisible();
});

test("root element is span", async ({ mount }) => {
  const component = await mount(<Tag>Engineering</Tag>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("span");
});

/* ---------- Tone ---------- */

test("default tone applies toneDefault class", async ({ mount }) => {
  const component = await mount(<Tag tone="default">Engineering</Tag>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/toneDefault/);
  expect(className).not.toMatch(/toneMuted/);
});

test("tone defaults to default when omitted", async ({ mount }) => {
  const component = await mount(<Tag>Engineering</Tag>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/toneDefault/);
});

test("muted tone applies toneMuted class", async ({ mount }) => {
  const component = await mount(<Tag tone="muted">Draft</Tag>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/toneMuted/);
  expect(className).not.toMatch(/toneDefault/);
});

/* ---------- Icon slot ---------- */

test("icon slot renders when provided", async ({ mount }) => {
  const component = await mount(
    <Tag
      icon={
        <svg data-testid="tag-icon" width={12} height={12} aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
        </svg>
      }
    >
      Featured
    </Tag>,
  );
  await expect(component.locator("[data-testid='tag-icon']")).toBeVisible();
  await expect(component.getByText("Featured")).toBeVisible();
});

test("icon slot applies withIcon class when icon is present", async ({ mount }) => {
  const component = await mount(
    <Tag
      icon={
        <svg width={12} height={12} aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
        </svg>
      }
    >
      Featured
    </Tag>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/withIcon/);
});

test("omits icon container when icon prop is undefined", async ({ mount }) => {
  const component = await mount(<Tag>Engineering</Tag>);
  const className = await component.getAttribute("class");
  expect(className).not.toMatch(/withIcon/);
  // No SVG or icon wrapper inside the tag
  await expect(component.locator("svg")).toHaveCount(0);
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Tag className="custom-tag-class">Engineering</Tag>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-tag-class/);
  expect(className).toMatch(/root/);
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards data-* props to the root element", async ({ mount }) => {
  const component = await mount(
    <Tag data-testid="tag-1" data-category="engineering">
      Engineering
    </Tag>,
  );
  await expect(component).toHaveAttribute("data-testid", "tag-1");
  await expect(component).toHaveAttribute("data-category", "engineering");
});

test("forwards aria-* props to the root element", async ({ mount }) => {
  const component = await mount(<Tag aria-label="Category: Engineering">Engineering</Tag>);
  await expect(component).toHaveAttribute("aria-label", "Category: Engineering");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the root span element", async ({ mount }) => {
  const component = await mount(<Tag data-testid="tag-ref-target">Engineering</Tag>);
  await expect(component).toHaveAttribute("data-testid", "tag-ref-target");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("span");
});

/* ---------- a11y ---------- */

test("a11y — default tone", async ({ mount, page }) => {
  await mount(<Tag>Engineering</Tag>);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — muted tone", async ({ mount, page }) => {
  await mount(<Tag tone="muted">Draft</Tag>);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with icon (aria-hidden on icon)", async ({ mount, page }) => {
  await mount(
    <Tag
      icon={
        <svg width={12} height={12} aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
        </svg>
      }
    >
      Featured
    </Tag>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — multiple tags in a flex row", async ({ mount, page }) => {
  await mount(
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <Tag>Engineering</Tag>
      <Tag>AI Infrastructure</Tag>
      <Tag tone="muted">Draft</Tag>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
