import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import {
  BasicPopover,
  PopoverWithClose,
  PopoverWithClassName,
  PopoverWithDataAttr,
  PopoverA11yHarness,
} from "./__test_harness__";

/* ─── Trigger renders ─────────────────────────────────────────── */

test("trigger renders in the DOM", async ({ mount, page }) => {
  await mount(<BasicPopover />);
  await expect(page.getByTestId("popover-trigger")).toBeVisible();
});

/* ─── Content opens on click ─────────────────────────────────── */

test("content is hidden before trigger click", async ({ mount, page }) => {
  await mount(<BasicPopover />);
  await expect(page.locator("[data-testid='popover-content']")).not.toBeVisible();
});

test("content opens when trigger is clicked", async ({ mount, page }) => {
  await mount(<BasicPopover />);
  await page.getByTestId("popover-trigger").click();
  await expect(page.locator("[data-testid='popover-body']")).toBeVisible();
});

test("content is visible when defaultOpen=true", async ({ mount, page }) => {
  await mount(<BasicPopover defaultOpen />);
  await expect(page.locator("[data-testid='popover-body']")).toBeVisible();
});

/* ─── Content closes on Escape ───────────────────────────────── */

test("content closes when Escape is pressed", async ({ mount, page }) => {
  await mount(<BasicPopover defaultOpen />);
  await expect(page.locator("[data-testid='popover-body']")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-testid='popover-body']")).not.toBeVisible();
});

/* ─── Close button ────────────────────────────────────────────── */

test("content closes when Close button is clicked", async ({ mount, page }) => {
  await mount(<PopoverWithClose />);
  const closeBtn = page.getByTestId("popover-close");
  await expect(closeBtn).toBeVisible();
  await closeBtn.click();
  await expect(closeBtn).not.toBeVisible();
});

/* ─── className forwarding ────────────────────────────────────── */

test("merges consumer className onto Content panel", async ({ mount, page }) => {
  await mount(<PopoverWithClassName contentClassName="my-custom-popover" />);
  const content = page.locator(".my-custom-popover");
  await expect(content).toBeVisible();
});

/* ─── data-* forwarding ───────────────────────────────────────── */

test("forwards data-* to Content element", async ({ mount, page }) => {
  await mount(<PopoverWithDataAttr />);
  await expect(page.locator("[data-testid='content-data-attr']")).toBeVisible();
});

/* ─── a11y ─────────────────────────────────────────────────────── */

test("a11y — Popover open (compound API)", async ({ mount, page }) => {
  await mount(<PopoverA11yHarness />);
  await expect(page.locator("[aria-label='Accessibility test popover']")).toBeVisible();
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
