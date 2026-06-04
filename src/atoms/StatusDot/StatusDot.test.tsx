import { test, expect } from "@playwright/experimental-ct-react";
import { StatusDot } from "./StatusDot";

/* ---- rendering ---- */

test("renders as a span element", async ({ mount }) => {
  const component = await mount(<StatusDot aria-label="Status" />);
  await expect(component).toBeVisible();
  await expect(component).toHaveRole("img");
});

test("default tone is neutral — sets data-tone='neutral'", async ({ mount }) => {
  const component = await mount(<StatusDot aria-label="Neutral status" />);
  await expect(component).toHaveAttribute("data-tone", "neutral");
});

test("default size is md — sets data-size='md'", async ({ mount }) => {
  const component = await mount(<StatusDot aria-label="Status" />);
  await expect(component).toHaveAttribute("data-size", "md");
});

/* ---- tone prop ---- */

test("tone='neutral' sets data-tone='neutral'", async ({ mount }) => {
  const component = await mount(<StatusDot tone="neutral" aria-label="Neutral" />);
  await expect(component).toHaveAttribute("data-tone", "neutral");
});

test("tone='info' sets data-tone='info'", async ({ mount }) => {
  const component = await mount(<StatusDot tone="info" aria-label="Info" />);
  await expect(component).toHaveAttribute("data-tone", "info");
});

test("tone='success' sets data-tone='success'", async ({ mount }) => {
  const component = await mount(<StatusDot tone="success" aria-label="Success" />);
  await expect(component).toHaveAttribute("data-tone", "success");
});

test("tone='warning' sets data-tone='warning'", async ({ mount }) => {
  const component = await mount(<StatusDot tone="warning" aria-label="Warning" />);
  await expect(component).toHaveAttribute("data-tone", "warning");
});

test("tone='danger' sets data-tone='danger'", async ({ mount }) => {
  const component = await mount(<StatusDot tone="danger" aria-label="Danger" />);
  await expect(component).toHaveAttribute("data-tone", "danger");
});

test("tone='accent' sets data-tone='accent'", async ({ mount }) => {
  const component = await mount(<StatusDot tone="accent" aria-label="Active" />);
  await expect(component).toHaveAttribute("data-tone", "accent");
});

/* ---- size prop ---- */

test("size='sm' sets data-size='sm' and renders 8px", async ({ mount }) => {
  const component = await mount(<StatusDot size="sm" aria-label="Small status" />);
  await expect(component).toHaveAttribute("data-size", "sm");
  await expect(component).toHaveCSS("width", "8px");
  await expect(component).toHaveCSS("height", "8px");
});

test("size='md' sets data-size='md' and renders 10px", async ({ mount }) => {
  const component = await mount(<StatusDot size="md" aria-label="Medium status" />);
  await expect(component).toHaveAttribute("data-size", "md");
  await expect(component).toHaveCSS("width", "10px");
  await expect(component).toHaveCSS("height", "10px");
});

/* ---- disabled prop ---- */

test("disabled=true applies opacity 0.4", async ({ mount }) => {
  const component = await mount(<StatusDot disabled aria-label="Disabled status" />);
  // React renders boolean true data attributes as "true" strings in the DOM.
  await expect(component).toHaveAttribute("data-disabled", "true");
  await expect(component).toHaveCSS("opacity", "0.4");
});

test("disabled=false does not apply data-disabled attribute", async ({ mount }) => {
  const component = await mount(<StatusDot disabled={false} aria-label="Active status" />);
  await expect(component).not.toHaveAttribute("data-disabled");
});

/* ---- accessibility ---- */

test("standalone pattern: renders role='img' with aria-label", async ({ mount }) => {
  const component = await mount(<StatusDot tone="success" aria-label="Published" />);
  await expect(component).toHaveRole("img");
  await expect(component).toHaveAttribute("aria-label", "Published");
  await expect(component).not.toHaveAttribute("aria-hidden");
});

test("decorative pattern: aria-hidden suppresses role", async ({ mount }) => {
  const component = await mount(<StatusDot tone="success" aria-hidden />);
  // role should NOT be present when aria-hidden is set
  const role = await component.getAttribute("role");
  expect(role).toBeNull();
  await expect(component).toHaveAttribute("aria-hidden", "true");
});

test("decorative pattern: aria-hidden='true' (string) suppresses role", async ({ mount }) => {
  const component = await mount(
    <StatusDot tone="danger" aria-hidden={"true" as unknown as boolean} />,
  );
  const role = await component.getAttribute("role");
  expect(role).toBeNull();
  await expect(component).toHaveAttribute("aria-hidden", "true");
});

/* ---- prop forwarding ---- */

test("merges consumer className with internal styles", async ({ mount }) => {
  const component = await mount(
    <StatusDot tone="neutral" aria-label="Status" className="custom-class" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-class/);
});

test("forwards data-* attributes to the root element", async ({ mount }) => {
  const component = await mount(
    <StatusDot tone="success" aria-label="Published" data-testid="dot" />,
  );
  await expect(component).toHaveAttribute("data-testid", "dot");
});

test("forwards id attribute to the root element", async ({ mount }) => {
  const component = await mount(
    <StatusDot tone="warning" aria-label="Pending" id="status-dot-1" />,
  );
  await expect(component).toHaveAttribute("id", "status-dot-1");
});

/* ---- visual: circle shape ---- */

test("renders as a circle (border-radius 50%)", async ({ mount }) => {
  const component = await mount(<StatusDot aria-label="Status" />);
  await expect(component).toHaveCSS("border-radius", "50%");
});

/* ---- tone fills (CSS) ---- */

test("accent tone renders box-shadow halo", async ({ mount }) => {
  const component = await mount(<StatusDot tone="accent" aria-label="Active" />);
  // box-shadow is not "none" for accent
  const shadow = await component.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(shadow).not.toBe("none");
});

test("neutral tone renders no box-shadow", async ({ mount }) => {
  const component = await mount(<StatusDot tone="neutral" aria-label="Inactive" />);
  await expect(component).toHaveCSS("box-shadow", "none");
});
