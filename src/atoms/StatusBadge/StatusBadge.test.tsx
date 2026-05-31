import { test, expect } from "@playwright/experimental-ct-react";
import { StatusBadge } from "./StatusBadge";

/* ---- legacy status prop — back-compat ---- */

test("renders available status with pulse", async ({ mount }) => {
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  await expect(component.getByText("Open")).toBeVisible();
  await expect(component.locator("[data-tone='accent']")).toBeVisible();
});

test("available status emits a single pulse element inside the dot", async ({ mount }) => {
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  const dot = component.locator("[data-tone='accent']");
  await expect(dot.locator("> span")).toHaveCount(1);
});

test("hides pulse on non-available status", async ({ mount }) => {
  const component = await mount(<StatusBadge status="closed">Closed</StatusBadge>);
  const dot = component.locator("[data-tone='neutral']");
  await expect(dot).toBeVisible();
  await expect(dot.locator("> span")).toHaveCount(0);
});

test("idle status renders the dot but no pulse element", async ({ mount }) => {
  const component = await mount(<StatusBadge status="idle">On a break</StatusBadge>);
  await expect(component.getByText("On a break")).toBeVisible();
  const dot = component.locator("[data-tone='neutral']");
  await expect(dot).toBeVisible();
  await expect(dot.locator("> span")).toHaveCount(0);
});

test('default status (no prop) resolves to "available" with pulse', async ({ mount }) => {
  const component = await mount(<StatusBadge>Taking conversations</StatusBadge>);
  const dot = component.locator("[data-tone='accent']");
  await expect(dot).toBeVisible();
  await expect(dot.locator("> span")).toHaveCount(1);
});

test("dot carries aria-hidden so the colored circle is not announced", async ({ mount }) => {
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  const dot = component.locator("[data-tone='accent']");
  await expect(dot).toHaveAttribute("aria-hidden", "true");
});

test("pulse animation uses the --dur-pulse token (1800ms) — regression guard", async ({
  mount,
}) => {
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  const pulse = component.locator("[data-tone='accent'] > span");
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

test("reduced-motion: pulse animation is suppressed when prefers-reduced-motion is reduce", async ({
  mount,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  const pulse = component.locator("[data-tone='accent'] > span");
  await expect(pulse).toHaveCSS("animation-name", "none");
});

/* ---- new tone prop tests ---- */

test("tone='neutral' sets data-tone='neutral' on the dot", async ({ mount }) => {
  const component = await mount(<StatusBadge tone="neutral">Neutral</StatusBadge>);
  await expect(component.locator("[data-tone='neutral']")).toBeVisible();
});

test("tone='info' sets data-tone='info' on the dot", async ({ mount }) => {
  const component = await mount(<StatusBadge tone="info">Info</StatusBadge>);
  await expect(component.locator("[data-tone='info']")).toBeVisible();
});

test("tone='success' sets data-tone='success' on the dot", async ({ mount }) => {
  const component = await mount(<StatusBadge tone="success">Success</StatusBadge>);
  await expect(component.locator("[data-tone='success']")).toBeVisible();
});

test("tone='warning' sets data-tone='warning' on the dot", async ({ mount }) => {
  const component = await mount(<StatusBadge tone="warning">Warning</StatusBadge>);
  await expect(component.locator("[data-tone='warning']")).toBeVisible();
});

test("tone='danger' sets data-tone='danger' on the dot", async ({ mount }) => {
  const component = await mount(<StatusBadge tone="danger">Danger</StatusBadge>);
  await expect(component.locator("[data-tone='danger']")).toBeVisible();
});

test("tone='accent' sets data-tone='accent' on the dot", async ({ mount }) => {
  const component = await mount(<StatusBadge tone="accent">Accent</StatusBadge>);
  await expect(component.locator("[data-tone='accent']")).toBeVisible();
});

test("tone takes precedence over status when both are set", async ({ mount }) => {
  const component = await mount(
    <StatusBadge status="available" tone="danger">
      Override
    </StatusBadge>,
  );
  // tone="danger" wins — dot is danger, not accent
  await expect(component.locator("[data-tone='danger']")).toBeVisible();
  await expect(component.locator("[data-tone='accent']")).toHaveCount(0);
});

test("tone overrides status and pulse defaults: tone='success' status='available' has no pulse by default", async ({
  mount,
}) => {
  const component = await mount(
    <StatusBadge status="available" tone="success">
      Override pulse
    </StatusBadge>,
  );
  const dot = component.locator("[data-tone='success']");
  // tone is set, so status-derived pulse=true is suppressed
  await expect(dot.locator("> span")).toHaveCount(0);
});

test("explicit pulse=true renders pulse ring regardless of tone", async ({ mount }) => {
  const component = await mount(
    <StatusBadge tone="success" pulse>
      Pulsing success
    </StatusBadge>,
  );
  const dot = component.locator("[data-tone='success']");
  await expect(dot.locator("> span")).toHaveCount(1);
});

test("explicit pulse=false suppresses pulse even on status='available'", async ({ mount }) => {
  const component = await mount(
    <StatusBadge status="available" pulse={false}>
      No pulse
    </StatusBadge>,
  );
  const dot = component.locator("[data-tone='accent']");
  await expect(dot.locator("> span")).toHaveCount(0);
});

test("status='available' still pulses with no tone prop (back-compat)", async ({ mount }) => {
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  const dot = component.locator("[data-tone='accent']");
  await expect(dot.locator("> span")).toHaveCount(1);
});

test("tone-only badge (no status) has no pulse by default", async ({ mount }) => {
  const component = await mount(<StatusBadge tone="warning">Warning note</StatusBadge>);
  const dot = component.locator("[data-tone='warning']");
  await expect(dot.locator("> span")).toHaveCount(0);
});
