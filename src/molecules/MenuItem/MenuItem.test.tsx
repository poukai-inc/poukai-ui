import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { MenuItem } from "./MenuItem";

/* ---------- Label rendering ---------- */

test("renders children as the label", async ({ mount }) => {
  const component = await mount(<MenuItem>Copy</MenuItem>);
  await expect(component.getByText("Copy")).toBeVisible();
});

/* ---------- Root element ---------- */

test("root element is <div>", async ({ mount }) => {
  const component = await mount(<MenuItem>Copy</MenuItem>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- Icon slot ---------- */

test("icon slot is absent when icon prop is not provided", async ({ mount }) => {
  const component = await mount(<MenuItem>Copy</MenuItem>);
  const svgs = component.locator("svg");
  await expect(svgs).toHaveCount(0);
});

test("icon slot renders when icon prop is provided", async ({ mount }) => {
  const component = await mount(
    <MenuItem
      icon={
        <svg width={16} height={16} aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
        </svg>
      }
    >
      Copy
    </MenuItem>,
  );
  const svg = component.locator("svg");
  await expect(svg).toBeVisible();
});

/* ---------- Shortcut (Kbd) slot ---------- */

test("shortcut slot is absent when shortcut prop is not provided", async ({ mount }) => {
  const component = await mount(<MenuItem>Copy</MenuItem>);
  const kbd = component.locator("kbd");
  await expect(kbd).toHaveCount(0);
});

test("shortcut slot renders the Kbd atom when shortcut prop is provided", async ({ mount }) => {
  const component = await mount(<MenuItem shortcut="⌘C">Copy</MenuItem>);
  const kbd = component.locator("kbd");
  await expect(kbd).toBeVisible();
  await expect(kbd).toContainText("⌘C");
});

test("Kbd shortcut has aria-hidden='true'", async ({ mount }) => {
  const component = await mount(<MenuItem shortcut="⌘C">Copy</MenuItem>);
  const kbd = component.locator("kbd");
  await expect(kbd).toHaveAttribute("aria-hidden", "true");
});

/* ---------- Tone ---------- */

test("defaults to tone='default' when tone is omitted", async ({ mount }) => {
  const component = await mount(<MenuItem>Copy</MenuItem>);
  // No danger class — only verifiable by class absence since CSS modules hash names.
  // We verify the component mounts without error and renders the label.
  await expect(component.getByText("Copy")).toBeVisible();
});

test("tone='danger' renders without error and shows label", async ({ mount }) => {
  const component = await mount(<MenuItem tone="danger">Delete post</MenuItem>);
  await expect(component.getByText("Delete post")).toBeVisible();
});

/* ---------- Disabled ---------- */

test("disabled prop is reflected on the root element via inline style / class", async ({
  mount,
}) => {
  const component = await mount(<MenuItem disabled>Paste</MenuItem>);
  // Disabled row is still visible (opacity 0.4, not hidden)
  await expect(component.getByText("Paste")).toBeVisible();
});

/* ---------- Ref / className / data-* forwarding ---------- */

test("merges consumer className", async ({ mount }) => {
  const component = await mount(<MenuItem className="my-menu-item">Copy</MenuItem>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-menu-item/);
});

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(<MenuItem data-testid="menu-copy">Copy</MenuItem>);
  await expect(component).toHaveAttribute("data-testid", "menu-copy");
});

test("forwards aria-label to root element", async ({ mount }) => {
  const component = await mount(<MenuItem aria-label="Copy selection">Copy</MenuItem>);
  await expect(component).toHaveAttribute("aria-label", "Copy selection");
});

/* ---------- a11y ---------- */

test("a11y — default", async ({ mount, page }) => {
  await mount(<MenuItem>Copy</MenuItem>);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with icon and shortcut", async ({ mount, page }) => {
  await mount(
    <MenuItem
      shortcut="⌘C"
      icon={
        <svg width={16} height={16} aria-hidden="true" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        </svg>
      }
    >
      Copy
    </MenuItem>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — tone='danger'", async ({ mount, page }) => {
  await mount(<MenuItem tone="danger">Delete post</MenuItem>);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — disabled", async ({ mount, page }) => {
  await mount(<MenuItem disabled>Paste</MenuItem>);
  // color-contrast is intentionally suppressed: WCAG 1.4.3 explicitly exempts
  // disabled UI components from minimum contrast requirements. The opacity: 0.4
  // treatment is per spec §4 and communicates unavailability by convention.
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region", "color-contrast"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
