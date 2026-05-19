import { test, expect } from "@playwright/experimental-ct-react";
import { StatusBadge } from "./StatusBadge";

test("renders available status with pulse", async ({ mount }) => {
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  await expect(component.getByText("Open")).toBeVisible();
  await expect(component.locator("[data-status='available']")).toBeVisible();
});

test("available status emits a single pulse element inside the dot", async ({ mount }) => {
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  const dot = component.locator("[data-status='available']");
  await expect(dot.locator("> span")).toHaveCount(1);
});

test("hides pulse on non-available status", async ({ mount }) => {
  const component = await mount(<StatusBadge status="closed">Closed</StatusBadge>);
  const dot = component.locator("[data-status='closed']");
  await expect(dot).toBeVisible();
  await expect(dot.locator("> span")).toHaveCount(0);
});

test("idle status renders the dot but no pulse element", async ({ mount }) => {
  const component = await mount(<StatusBadge status="idle">On a break</StatusBadge>);
  await expect(component.getByText("On a break")).toBeVisible();
  const dot = component.locator("[data-status='idle']");
  await expect(dot).toBeVisible();
  await expect(dot.locator("> span")).toHaveCount(0);
});

test('default status (no prop) resolves to "available" with pulse', async ({ mount }) => {
  const component = await mount(<StatusBadge>Taking conversations</StatusBadge>);
  const dot = component.locator("[data-status='available']");
  await expect(dot).toBeVisible();
  await expect(dot.locator("> span")).toHaveCount(1);
});

test("dot carries aria-hidden so the colored circle is not announced", async ({ mount }) => {
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  const dot = component.locator("[data-status='available']");
  await expect(dot).toHaveAttribute("aria-hidden", "true");
});

test("pulse animation uses the --dur-pulse token (1800ms) — regression guard", async ({
  mount,
}) => {
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  const pulse = component.locator("[data-status='available'] > span");
  // Browsers normalise animation-duration to seconds.
  await expect(pulse).toHaveCSS("animation-duration", "1.8s");
  await expect(pulse).toHaveCSS("animation-iteration-count", "infinite");
});

test("merges a consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(
    <StatusBadge status="available" className="custom-x">
      Open
    </StatusBadge>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-x/);
});

test("forwards arbitrary data-* and aria-* props to the root", async ({ mount }) => {
  const component = await mount(
    <StatusBadge status="available" data-testid="badge" aria-live="polite">
      Open
    </StatusBadge>,
  );
  await expect(component).toHaveAttribute("data-testid", "badge");
  await expect(component).toHaveAttribute("aria-live", "polite");
});
