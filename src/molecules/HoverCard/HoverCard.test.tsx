import { test, expect } from "@playwright/experimental-ct-react";
import { DefaultHarness, RefHarness } from "./__test_harness__";

/**
 * HoverCard tests.
 *
 * Key Playwright CT rules for Radix portaled content:
 *  - Mounted `component` IS the root element of the harness wrapper.
 *  - Radix portals content to document.body — use page.locator() for Content,
 *    NOT component.locator(), since the card renders outside the mounted tree.
 *  - Hover-driven open/close is unreliable across Webkit headless. We use
 *    `defaultOpen` on the Root to force-open the card and assert content
 *    state, then have a single targeted hover test for the open behaviour.
 */

/* ─── Trigger renders ─────────────────────────────────────────── */

test("trigger renders as anchor", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  const trigger = page.locator('[data-testid="hc-trigger"]');
  await expect(trigger).toBeVisible();
  const tag = await trigger.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("a");
});

test("trigger text renders correctly", async ({ mount, page }) => {
  await mount(<DefaultHarness triggerText="Arian Zargaran" />);
  await expect(page.locator('[data-testid="hc-trigger"]')).toHaveText("Arian Zargaran");
});

/* ─── Content rendered when defaultOpen ───────────────────────── */

test("content renders when defaultOpen=true", async ({ mount, page }) => {
  await mount(<DefaultHarness defaultOpen />);
  await expect(page.locator('[data-testid="hc-content"]')).toBeVisible();
  await expect(page.locator('[data-testid="hc-body"]')).toBeVisible();
});

test("content body text renders inside card", async ({ mount, page }) => {
  await mount(<DefaultHarness defaultOpen contentText="Author preview card" />);
  await expect(page.locator('[data-testid="hc-body"]')).toHaveText("Author preview card");
});

test("content closed by default", async ({ mount, page }) => {
  await mount(<DefaultHarness />);
  await expect(page.locator('[data-testid="hc-content"]')).not.toBeVisible();
});

/* ─── Hover open (single integration test) ───────────────────── */

test("hover on trigger opens content", async ({ mount, page }) => {
  await mount(<DefaultHarness openDelay={0} closeDelay={0} />);
  await expect(page.locator('[data-testid="hc-content"]')).not.toBeVisible();
  await page.locator('[data-testid="hc-trigger"]').hover();
  await expect(page.locator('[data-testid="hc-content"]')).toBeVisible({ timeout: 3000 });
});

/* ─── Width variants ──────────────────────────────────────────── */

test("width=sm applies sm class", async ({ mount, page }) => {
  await mount(<DefaultHarness defaultOpen width="sm" />);
  const content = page.locator('[data-testid="hc-content"]');
  await expect(content).toBeVisible();
  await expect(content).toHaveClass(/width-sm/);
});

test("width=md applies md class", async ({ mount, page }) => {
  await mount(<DefaultHarness defaultOpen width="md" />);
  const content = page.locator('[data-testid="hc-content"]');
  await expect(content).toBeVisible();
  await expect(content).toHaveClass(/width-md/);
});

/* ─── Arrow ───────────────────────────────────────────────────── */

test("arrow renders when showArrow=true (default)", async ({ mount, page }) => {
  await mount(<DefaultHarness defaultOpen showArrow={true} />);
  await expect(page.locator('[data-testid="hc-content"]')).toBeVisible();
  await expect(page.locator('[data-testid="hc-content"] svg').first()).toBeVisible();
});

test("arrow absent when showArrow=false", async ({ mount, page }) => {
  await mount(<DefaultHarness defaultOpen showArrow={false} />);
  await expect(page.locator('[data-testid="hc-content"]')).toBeVisible();
  await expect(page.locator('[data-testid="hc-content"] svg')).toHaveCount(0);
});

/* ─── className forwarding ────────────────────────────────────── */

test("className is forwarded to content", async ({ mount, page }) => {
  await mount(<DefaultHarness defaultOpen className="custom-card" />);
  const content = page.locator('[data-testid="hc-content"]');
  await expect(content).toBeVisible();
  await expect(content).toHaveClass(/custom-card/);
});

/* ─── data-* forwarding ───────────────────────────────────────── */

test("data-testid forwarded to content root", async ({ mount, page }) => {
  await mount(<DefaultHarness defaultOpen />);
  await expect(page.locator('[data-testid="hc-content"]')).toBeVisible();
});

/* ─── Ref forwarding ──────────────────────────────────────────── */

test("ref/content mounts without error", async ({ mount, page }) => {
  await mount(<RefHarness />);
  // RefHarness does not defaultOpen; just verify the trigger mounts.
  await expect(page.locator('[data-testid="ref-trigger"]')).toBeVisible();
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
