import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { DefaultHarness, RefHarness } from "./__test_harness__";

/**
 * ContextMenu CT suite.
 *
 * Radix portals content to document.body — all assertions on the menu panel
 * and items use page.locator(), not component.locator().
 *
 * The harness opens the menu via defaultOpen so right-click simulation is
 * not required for structural / prop-forwarding tests.
 */

/* ---------- Content renders when open ---------- */

test("content panel renders when defaultOpen", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  // Radix renders role="menu" on the Content panel
  const menu = page.locator('[role="menu"]');
  await expect(menu).toBeVisible();
});

test("trigger zone renders", async ({ mount }) => {
  const component = await mount(<DefaultHarness />);
  // The mounted root IS the trigger zone (Trigger asChild forwards to the div)
  await expect(component).toHaveAttribute("data-testid", "trigger-zone");
});

/* ---------- Items render ---------- */

test("items render inside content panel", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  const itemOne = page.locator('[data-testid="item-one"]');
  const itemTwo = page.locator('[data-testid="item-two"]');
  await expect(itemOne).toBeVisible();
  await expect(itemTwo).toBeVisible();
});

test("item label text is visible", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  await expect(page.getByText("Copy")).toBeVisible();
  await expect(page.getByText("Paste")).toBeVisible();
});

/* ---------- Separator ---------- */

test("separator renders with role='separator'", async ({ mount, page }) => {
  await mount(<DefaultHarness separator />);
  const sep = page.locator('[role="separator"]');
  await expect(sep).toBeVisible();
});

test("separator absent when separator prop is false", async ({ mount, page }) => {
  await mount(<DefaultHarness separator={false} />);
  const sep = page.locator('[role="separator"]');
  await expect(sep).toHaveCount(0);
});

/* ---------- tone="danger" ---------- */

test("tone='danger' item renders visibly", async ({ mount, page }) => {
  await mount(<DefaultHarness tone="danger" />);
  const item = page.locator('[data-testid="item-one"]');
  await expect(item).toBeVisible();
});

/* ---------- disabled ---------- */

test("disabled item renders with aria-disabled", async ({ mount, page }) => {
  await mount(<DefaultHarness disabled />);
  // Radix sets aria-disabled on the Radix Item host which wraps our MenuItem
  const item = page.locator('[data-testid="item-one"]');
  await expect(item).toBeVisible();
  await expect(item).toHaveAttribute("aria-disabled", "true");
});

/* ---------- icon slot ---------- */

test("icon slot renders svg when icon prop provided", async ({ mount, page }) => {
  const icon = (
    <svg width={16} height={16} aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
    </svg>
  );
  await mount(<DefaultHarness icon={icon} />);
  const item = page.locator('[data-testid="item-one"]');
  const svg = item.locator("svg");
  await expect(svg).toBeVisible();
});

/* ---------- shortcut ---------- */

test("shortcut renders Kbd inside the item", async ({ mount, page }) => {
  await mount(<DefaultHarness shortcut="⌘C" />);
  const item = page.locator('[data-testid="item-one"]');
  const kbd = item.locator("kbd");
  await expect(kbd).toBeVisible();
  await expect(kbd).toContainText("⌘C");
});

/* ---------- className forwarding ---------- */

test("merges consumer className on Content panel", async ({ mount, page }) => {
  await mount(<RefHarness className="my-content-panel" />);
  const menu = page.locator('[role="menu"]');
  const cls = await menu.getAttribute("class");
  expect(cls).toMatch(/my-content-panel/);
});

/* ---------- data-* forwarding ---------- */

test("forwards data-testid to Content panel", async ({ mount, page }) => {
  await mount(<RefHarness dataTestId="ctx-panel" />);
  const menu = page.locator('[data-testid="ctx-panel"]');
  await expect(menu).toBeVisible();
});

/* ---------- a11y ---------- */

test("a11y — default open state", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  // Wait for menu to be visible before scanning
  await page.locator('[role="menu"]').waitFor({ state: "visible" });
  // Wait for the enter animation (opacity 0 → 1) to finish so axe scans the
  // final color, not a blended mid-animation value.
  await page
    .locator('[role="menu"]')
    .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with separator", async ({ mount, page }) => {
  await mount(<DefaultHarness separator />);
  await page.locator('[role="menu"]').waitFor({ state: "visible" });
  // Wait for the enter animation (opacity 0 → 1) to finish so axe scans the
  // final color, not a blended mid-animation value.
  await page
    .locator('[role="menu"]')
    .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — tone danger", async ({ mount, page }) => {
  await mount(<DefaultHarness tone="danger" />);
  await page.locator('[role="menu"]').waitFor({ state: "visible" });
  // Wait for the enter animation (opacity 0 → 1) to finish so axe scans the
  // final color, not a blended mid-animation value.
  await page
    .locator('[role="menu"]')
    .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — disabled item (color-contrast suppressed for disabled state)", async ({
  mount,
  page,
}) => {
  await mount(<DefaultHarness disabled />);
  await page.locator('[role="menu"]').waitFor({ state: "visible" });
  await page
    .locator('[role="menu"]')
    .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region", "color-contrast"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
