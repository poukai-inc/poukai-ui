import { test, expect } from "@playwright/experimental-ct-react";
import {
  DefaultHarness,
  DefaultOpenHarness,
  WithIconsHarness,
  WithDisabledHarness,
  PropForwardingHarness,
  IconTriggerHarness,
  BasicHarness,
} from "./__test_harness__";

/* ─── Trigger renders ─────────────────────────────────────── */

test("DropdownMenu: trigger renders and is a button", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  const trigger = page.locator('[data-testid="trigger"]');
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute("type", "button");
});

test("DropdownMenu: trigger has aria-haspopup=menu", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  const trigger = page.locator('[data-testid="trigger"]');
  await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
});

test("DropdownMenu: trigger aria-expanded is false when closed", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  const trigger = page.locator('[data-testid="trigger"]');
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

/* ─── Click opens content ─────────────────────────────────── */

test("DropdownMenu: click trigger opens menu content", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  // Content not visible before click
  await expect(page.getByRole("menu")).toHaveCount(0);
  // Click trigger
  await page.locator('[data-testid="trigger"]').click();
  // Content portalled to document.body — use page-level locator
  await expect(page.getByRole("menu")).toBeVisible();
});

test("DropdownMenu: trigger aria-expanded is true when open", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  await page.locator('[data-testid="trigger"]').click();
  await expect(page.getByRole("menu")).toBeVisible();
  const trigger = page.locator('[data-testid="trigger"]');
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});

test("DropdownMenu: menu items are visible when open", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  await page.locator('[data-testid="trigger"]').click();
  await expect(page.getByRole("menuitem", { name: "Edit" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Duplicate" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Delete" })).toBeVisible();
});

/* ─── defaultOpen ─────────────────────────────────────────── */

test("DropdownMenu: defaultOpen renders menu immediately", async ({ mount, page }) => {
  await mount(<DefaultOpenHarness />);
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Edit" })).toBeVisible();
});

/* ─── Escape closes ───────────────────────────────────────── */

test("DropdownMenu: Escape key closes menu", async ({ mount, page }) => {
  await mount(<DefaultOpenHarness />);
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
});

/* ─── Separator ───────────────────────────────────────────── */

test("DropdownMenu: separator renders with role=separator", async ({ mount, page }) => {
  await mount(<DefaultOpenHarness />);
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("separator")).toBeVisible();
});

/* ─── Disabled item ───────────────────────────────────────── */

test("DropdownMenu: disabled item has aria-disabled", async ({ mount, page }) => {
  await mount(<WithDisabledHarness />);
  await expect(page.getByRole("menu")).toBeVisible();
  const disabledItem = page.getByRole("menuitem", { name: "Share" });
  await expect(disabledItem).toHaveAttribute("aria-disabled", "true");
});

/* ─── Icons ───────────────────────────────────────────────── */

test("DropdownMenu: items with icons render labels", async ({ mount, page }) => {
  await mount(<WithIconsHarness />);
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Edit" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Copy" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Delete" })).toBeVisible();
});

/* ─── Prop forwarding ─────────────────────────────────────── */

test("DropdownMenu.Content: className forwarded", async ({ mount, page }) => {
  await mount(<PropForwardingHarness />);
  await expect(page.getByRole("menu")).toBeVisible();
  const panel = page.locator('[data-testid="content-panel"]');
  await expect(panel).toBeVisible();
  const cls = await panel.getAttribute("class");
  expect(cls).toContain("consumer-class");
});

test("DropdownMenu.Content: data-testid forwarded", async ({ mount, page }) => {
  await mount(<PropForwardingHarness />);
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.locator('[data-testid="content-panel"]')).toBeVisible();
});

test("DropdownMenu.Item: data-custom forwarded", async ({ mount, page }) => {
  await mount(<PropForwardingHarness />);
  await expect(page.getByRole("menu")).toBeVisible();
  const item = page.locator('[data-testid="item-forward"]');
  await expect(item).toHaveAttribute("data-custom", "yes");
});

/* ─── IconButton trigger (asChild) ────────────────────────── */

test("DropdownMenu: IconButton asChild trigger renders and has aria-haspopup", async ({
  mount,
  page,
}) => {
  await mount(<IconTriggerHarness />);
  const trigger = page.locator('[data-testid="icon-trigger"]');
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
});

test("DropdownMenu: IconButton trigger click opens menu", async ({ mount, page }) => {
  await mount(<IconTriggerHarness />);
  await page.locator('[data-testid="icon-trigger"]').click();
  await expect(page.getByRole("menu")).toBeVisible();
});

/* ─── DropdownMenuBasic ───────────────────────────────────── */

test("DropdownMenuBasic: trigger renders", async ({ mount, page }) => {
  await mount(<BasicHarness />);
  const trigger = page.locator('[data-testid="basic-trigger"]');
  await expect(trigger).toBeVisible();
});

test("DropdownMenuBasic: click opens items", async ({ mount, page }) => {
  await mount(<BasicHarness />);
  await page.locator('[data-testid="basic-trigger"]').click();
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Edit" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Copy" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Delete" })).toBeVisible();
});

/* ─── role="menu" ARIA ────────────────────────────────────── */

test("DropdownMenu.Content: has role=menu", async ({ mount, page }) => {
  await mount(<DefaultOpenHarness />);
  await expect(page.getByRole("menu")).toBeVisible();
});

test("DropdownMenu items have role=menuitem", async ({ mount, page }) => {
  await mount(<DefaultOpenHarness />);
  const items = page.getByRole("menuitem");
  await expect(items).toHaveCount(2);
});
