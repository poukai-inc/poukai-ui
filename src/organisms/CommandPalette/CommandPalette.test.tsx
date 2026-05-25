import { test, expect } from "@playwright/experimental-ct-react";

// PW-CT 1.45 multi-named import bug: import one per line from harness.
import { BasicOpenHarness } from "./__test_harness__";
import { ToggleHarness } from "./__test_harness__";
import { SelectHarness } from "./__test_harness__";
import { ClosedHarness } from "./__test_harness__";
import { EmptySlotHarness } from "./__test_harness__";

/* ─── Open state ────────────────────────────────────────────── */

test("renders dialog when open=true", async ({ mount, page }) => {
  await mount(<BasicOpenHarness />);
  // Radix Dialog sets data-state="open" on the content
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("data-state", "open");
});

test("does not render dialog content when open=false", async ({ mount, page }) => {
  await mount(<ClosedHarness />);
  // Radix unmounts content when closed (no forceMount)
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toHaveCount(0);
});

/* ─── Toggle open ────────────────────────────────────────────── */

test("opens palette when trigger is clicked", async ({ mount, page }) => {
  await mount(<ToggleHarness />);
  await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  await page.getByTestId("open-trigger").click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
});

/* ─── Input ──────────────────────────────────────────────────── */

test("renders search input inside palette", async ({ mount, page }) => {
  await mount(<BasicOpenHarness />);
  const input = page.locator('[role="combobox"]');
  await expect(input).toBeVisible();
});

test("input placeholder is rendered", async ({ mount, page }) => {
  await mount(<BasicOpenHarness />);
  const input = page.locator('[role="combobox"]');
  await expect(input).toHaveAttribute("placeholder", "Search…");
});

/* ─── Items ──────────────────────────────────────────────────── */

test("renders item labels", async ({ mount, page }) => {
  await mount(<BasicOpenHarness />);
  await expect(page.getByText("Dashboard")).toBeVisible();
  await expect(page.getByText("Documents")).toBeVisible();
  await expect(page.getByText("Settings")).toBeVisible();
});

test("renders group headings", async ({ mount, page }) => {
  await mount(<BasicOpenHarness />);
  await expect(page.getByText("Pages")).toBeVisible();
  await expect(page.getByText("Actions")).toBeVisible();
});

/* ─── Item selection ─────────────────────────────────────────── */

test("clicking item fires onSelect and closes palette", async ({ mount, page }) => {
  await mount(<SelectHarness />);
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  // Click the Dashboard item
  await page.getByText("Dashboard").click();
  // Selected value is reflected
  await expect(page.getByTestId("selected-value")).toHaveText("dashboard");
  // Dialog closes
  await expect(page.locator('[role="dialog"]')).toHaveCount(0);
});

/* ─── Filtering ──────────────────────────────────────────────── */

test("typing filters items", async ({ mount, page }) => {
  await mount(<BasicOpenHarness />);
  const input = page.locator('[role="combobox"]');
  await input.fill("Settings");
  await expect(page.getByRole("option", { name: "Settings" })).toBeVisible();
});

/* ─── Empty state ────────────────────────────────────────────── */

test("renders empty slot when no items match", async ({ mount, page }) => {
  await mount(<EmptySlotHarness />);
  await expect(page.getByText("No results found.")).toBeVisible();
});

/* ─── Escape key ─────────────────────────────────────────────── */

test("Escape key closes the palette", async ({ mount, page }) => {
  await mount(<ToggleHarness />);
  await page.getByTestId("open-trigger").click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator('[role="dialog"]')).toHaveCount(0);
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
