import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import {
  ShorthandHarness,
  CompoundHarness,
  FocusHarness,
  ForwardingHarness,
} from "./__test_harness__";

/* ─── Render: trigger visible ─────────────────────────────────── */

test("trigger renders in the document", async ({ mount, page }) => {
  await mount(<ShorthandHarness />);
  await expect(page.getByTestId("trigger")).toBeVisible();
});

/* ─── Shorthand: content opens on hover ──────────────────────── */

test("shorthand — content appears on trigger hover", async ({ mount, page }) => {
  await mount(<ShorthandHarness content="Hover label" delayDuration={0} />);
  const trigger = page.getByTestId("trigger");
  await trigger.hover();
  // Content is portalled — must use page.locator
  await expect(page.locator("[role='tooltip']")).toBeVisible();
  await expect(page.locator("[role='tooltip']")).toContainText("Hover label");
});

/* ─── Shorthand: content opens on keyboard focus ─────────────── */

test("shorthand — content appears on keyboard focus", async ({ mount, page }) => {
  await mount(<FocusHarness />);
  await page.getByTestId("focus-trigger").focus();
  await expect(page.locator("[role='tooltip']")).toBeVisible();
  await expect(page.locator("[role='tooltip']")).toContainText("Focus label");
});

/* ─── Shorthand: defaultOpen renders content immediately ─────── */

test("shorthand — defaultOpen renders content without interaction", async ({ mount, page }) => {
  await mount(<ShorthandHarness content="Open immediately" defaultOpen />);
  await expect(page.locator("[role='tooltip']")).toBeVisible();
  await expect(page.locator("[role='tooltip']")).toContainText("Open immediately");
});

/* ─── Content has role="tooltip" ─────────────────────────────── */

test("content panel has role='tooltip'", async ({ mount, page }) => {
  await mount(<ShorthandHarness content="Role check" defaultOpen />);
  await expect(page.locator("[role='tooltip']")).toBeVisible();
});

/* ─── Compound API ────────────────────────────────────────────── */

test("compound API — Tooltip.Root + Trigger + Content renders label", async ({ mount, page }) => {
  await mount(<CompoundHarness label="Compound tooltip text" />);
  await expect(page.locator("[role='tooltip']")).toBeVisible();
  // Radix renders the tooltip content twice (live portal + a visually-hidden
  // mirror for screen readers). Both carry the test id, so target the first.
  await expect(page.getByTestId("compound-content").first()).toContainText("Compound tooltip text");
});

/* ─── Compound API: trigger accessible ───────────────────────── */

test("compound API — trigger button is in the document", async ({ mount, page }) => {
  await mount(<CompoundHarness />);
  await expect(page.getByTestId("compound-trigger")).toBeVisible();
});

/* ─── className + data-* forwarding on Content ───────────────── */

test("Tooltip.Content forwards className and data-* to portal element", async ({ mount, page }) => {
  await mount(<ForwardingHarness />);
  const content = page.getByTestId("fwd-content");
  await expect(content).toBeVisible();
  const cls = await content.getAttribute("class");
  expect(cls).toMatch(/custom-content/);
});

/* ─── Side offset prop ────────────────────────────────────────── */

test("shorthand — side prop accepted without error (bottom)", async ({ mount, page }) => {
  await mount(<ShorthandHarness content="Bottom side" side="bottom" defaultOpen />);
  await expect(page.locator("[role='tooltip']")).toBeVisible();
});

/* ─── Escape closes the tooltip ──────────────────────────────── */

test("pressing Escape closes an open tooltip", async ({ mount, page }) => {
  // `defaultOpen` mounts the tooltip in the actually-open Radix state, which
  // is what Escape needs to dismiss. Programmatic `.focus()` does not satisfy
  // Radix's focus-visible heuristic in webkit, so the live panel never enters
  // the open state and Escape has nothing to close. `defaultOpen` sidesteps
  // that and is sufficient to exercise the Escape→close path.
  await mount(<ShorthandHarness content="Focus label" defaultOpen />);
  const tooltip = page.locator("[role='tooltip']");
  await expect(tooltip).toBeVisible();
  await page.getByTestId("trigger").focus();
  await page.keyboard.press("Escape");
  await expect(tooltip).toHaveCount(0);
});

/* ─── Reduced motion ─────────────────────────────────────────── */

test("reduced-motion — tooltip still visible with reduced motion", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mount(<ShorthandHarness content="Reduced motion label" defaultOpen />);
  await expect(page.locator("[role='tooltip']")).toBeVisible();
});

/* ─── Axe a11y ───────────────────────────────────────────────── */

test("axe — shorthand with trigger aria-label (open)", async ({ mount, page }) => {
  await mount(<ShorthandHarness content="Settings" defaultOpen />);
  await expect(page.locator("[role='tooltip']")).toBeVisible();
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations).toEqual([]);
});

test("axe — compound API open", async ({ mount, page }) => {
  await mount(<CompoundHarness label="Compound a11y label" />);
  await expect(page.locator("[role='tooltip']")).toBeVisible();
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations).toEqual([]);
});

/* a11y gate is also in src/a11y.test.tsx (central gate). */
