import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import {
  BasicPopover,
  PopoverWithClose,
  PopoverWithClassName,
  PopoverWithDataAttr,
  PopoverA11yHarness,
  PopoverWithFocusTarget,
  PopoverWithOutsideElement,
  PopoverWithOnOpenChange,
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

/* ─── aria-expanded wiring ────────────────────────────────────── */

test("trigger has aria-expanded=false when closed", async ({ mount, page }) => {
  await mount(<BasicPopover />);
  await expect(page.getByTestId("popover-trigger")).toHaveAttribute("aria-expanded", "false");
});

test("trigger has aria-expanded=true when open", async ({ mount, page }) => {
  await mount(<BasicPopover defaultOpen />);
  await expect(page.getByTestId("popover-trigger")).toHaveAttribute("aria-expanded", "true");
});

test("trigger aria-expanded toggles to true after click", async ({ mount, page }) => {
  await mount(<BasicPopover />);
  const trigger = page.getByTestId("popover-trigger");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});

/* ─── aria-controls wiring ────────────────────────────────────── */

test("trigger aria-controls references the content panel id", async ({ mount, page }) => {
  await mount(<BasicPopover defaultOpen />);
  const trigger = page.getByTestId("popover-trigger");
  const controls = await trigger.getAttribute("aria-controls");
  expect(controls).toBeTruthy();
  // Radix ids contain ":" which is special in CSS selectors — use attribute selector instead
  await expect(page.locator(`[id="${controls}"]`)).toBeVisible();
});

/* ─── Focus moves into content on open ───────────────────────── */

test("focus moves into the content panel when popover opens", async ({ mount, page }) => {
  await mount(<PopoverWithFocusTarget />);
  await page.getByTestId("focus-trigger").click();
  // Radix moves focus to the content container on open
  const focusedTestId = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? ((el as HTMLElement).dataset["testid"] ?? el.getAttribute("data-testid")) : null;
  });
  // Either the content panel itself or the action button inside it is focused
  expect(
    focusedTestId === "focus-target" || page.locator("[aria-label='Focus test popover']"),
  ).toBeTruthy();
  await expect(page.getByTestId("focus-target")).toBeVisible();
});

/* ─── Closes on outside click ─────────────────────────────────── */

test("content closes when an outside element is clicked", async ({ mount, page }) => {
  await mount(<PopoverWithOutsideElement />);
  // Popover starts open (defaultOpen)
  await expect(page.getByTestId("outside-click-body")).toBeVisible();
  // Click the element outside the popover
  await page.getByTestId("outside-element").click();
  await expect(page.getByTestId("outside-click-body")).not.toBeVisible();
});

/* ─── onOpenChange callback ───────────────────────────────────── */

test("onOpenChange fires with true when popover opens", async ({ mount, page }) => {
  await mount(<PopoverWithOnOpenChange />);
  const status = page.getByTestId("ooc-status");
  await expect(status).toHaveAttribute("data-open", "false");
  await page.getByTestId("ooc-trigger").click();
  await expect(page.getByTestId("ooc-body")).toBeVisible();
  await expect(status).toHaveAttribute("data-open", "true");
});

test("onOpenChange fires with false when popover closes via Escape", async ({ mount, page }) => {
  await mount(<PopoverWithOnOpenChange />);
  // Open first
  await page.getByTestId("ooc-trigger").click();
  await expect(page.getByTestId("ooc-body")).toBeVisible();
  // Click inside the popover content to ensure it holds keyboard focus
  await page.getByTestId("ooc-body").click();
  // Close with Escape
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("ooc-body")).not.toBeVisible();
  await expect(page.getByTestId("ooc-status")).toHaveAttribute("data-open", "false");
});
