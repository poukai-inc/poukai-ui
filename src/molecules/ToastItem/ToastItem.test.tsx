import { test, expect } from "@playwright/experimental-ct-react";
import { BasicToastItem } from "./__test_harness__";
import { ToastItemWithTitle } from "./__test_harness__";
import { ToastItemWithClose } from "./__test_harness__";
import { ToastItemWithAction } from "./__test_harness__";
import { ToastItemWithClassName } from "./__test_harness__";

/* ─── Root element ────────────────────────────────────────────── */

test("root element is <li> (Radix Toast.Root renders as li)", async ({ mount, page }) => {
  await mount(<BasicToastItem />);
  const root = page.getByTestId("toast-root");
  const tag = await root.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("li");
});

/* ─── Open state ──────────────────────────────────────────────── */

test("toast is visible when open=true", async ({ mount, page }) => {
  await mount(<BasicToastItem />);
  await expect(page.getByTestId("toast-root")).toBeVisible();
});

/* ─── Tone CSS classes ────────────────────────────────────────── */

test("applies tone-info class for info tone", async ({ mount, page }) => {
  await mount(<BasicToastItem tone="info" />);
  const cls = await page.getByTestId("toast-root").getAttribute("class");
  expect(cls).toMatch(/toneInfo/);
});

test("applies tone-success class for success tone", async ({ mount, page }) => {
  await mount(<BasicToastItem tone="success" />);
  const cls = await page.getByTestId("toast-root").getAttribute("class");
  expect(cls).toMatch(/toneSuccess/);
});

test("applies tone-warning class for warning tone", async ({ mount, page }) => {
  await mount(<BasicToastItem tone="warning" />);
  const cls = await page.getByTestId("toast-root").getAttribute("class");
  expect(cls).toMatch(/toneWarning/);
});

test("applies tone-danger class for danger tone", async ({ mount, page }) => {
  await mount(<BasicToastItem tone="danger" />);
  const cls = await page.getByTestId("toast-root").getAttribute("class");
  expect(cls).toMatch(/toneDanger/);
});

test("defaults to tone-info when no tone prop supplied", async ({ mount, page }) => {
  await mount(<BasicToastItem />);
  const cls = await page.getByTestId("toast-root").getAttribute("class");
  expect(cls).toMatch(/toneInfo/);
});

/* ─── Title sub-part ──────────────────────────────────────────── */

test("renders Title when provided", async ({ mount, page }) => {
  await mount(<ToastItemWithTitle />);
  await expect(page.getByTestId("toast-title")).toBeVisible();
  await expect(page.getByTestId("toast-title")).toHaveText("Saved");
});

/* ─── Description sub-part ───────────────────────────────────── */

test("renders Description text", async ({ mount, page }) => {
  await mount(<ToastItemWithTitle />);
  await expect(page.getByTestId("toast-description")).toBeVisible();
  await expect(page.getByTestId("toast-description")).toHaveText("Your changes have been saved.");
});

/* ─── Close button ────────────────────────────────────────────── */

test("renders Close button with aria-label=Close", async ({ mount, page }) => {
  await mount(<ToastItemWithClose />);
  const closeBtn = page.getByTestId("toast-close");
  await expect(closeBtn).toBeVisible();
  await expect(closeBtn).toHaveAttribute("aria-label", "Close");
});

test("Close button contains X icon (svg)", async ({ mount, page }) => {
  await mount(<ToastItemWithClose />);
  const svg = page.getByTestId("toast-close").locator("svg");
  await expect(svg).toHaveCount(1);
});

/* ─── Action sub-part ─────────────────────────────────────────── */

test("renders Action button when provided", async ({ mount, page }) => {
  await mount(<ToastItemWithAction />);
  await expect(page.getByTestId("toast-action")).toBeVisible();
  await expect(page.getByTestId("toast-action")).toHaveText("Retry");
});

/* ─── className forwarding ────────────────────────────────────── */

test("merges consumer className onto root", async ({ mount, page }) => {
  await mount(<ToastItemWithClassName />);
  const cls = await page.getByTestId("toast-root").getAttribute("class");
  expect(cls).toMatch(/custom-toast/);
});

/* ─── a11y ────────────────────────────────────────────────────── */

/* Full axe scan lives in src/a11y.test.tsx (central gate). */
