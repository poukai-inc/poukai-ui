import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { X, Copy, Heart } from "lucide-react";
import { IconButton } from "./IconButton";

/* ---------- Default render ---------- */

test("renders as a <button> with type=button", async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" />);
  await expect(component).toHaveAttribute("type", "button");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("button");
});

test("exposes the aria-label on the button host", async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close dialog" />);
  await expect(component).toHaveAttribute("aria-label", "Close dialog");
});

test("renders the icon as an inner SVG", async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" />);
  const svg = component.locator("svg");
  await expect(svg).toBeVisible();
});

test("inner Icon is rendered as decorative (aria-hidden=true)", async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" />);
  const svg = component.locator("svg");
  await expect(svg).toHaveAttribute("aria-hidden", "true");
});

test("renders a VisuallyHidden span containing the label", async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Dismiss" />);
  const hidden = component.locator("span").filter({ hasText: "Dismiss" }).first();
  await expect(hidden).toBeAttached();
});

/* ---------- Square geometry ---------- */

test("default size resolves to a 44×44 square (md)", async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" />);
  await expect(component).toHaveCSS("min-height", "44px");
  await expect(component).toHaveCSS("width", "44px");
});

test('size="sm" resolves to a 32×32 square', async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" size="sm" />);
  await expect(component).toHaveCSS("min-height", "32px");
  await expect(component).toHaveCSS("width", "32px");
});

test('size="compact" resolves to a 40×40 square', async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" size="compact" />);
  await expect(component).toHaveCSS("min-height", "40px");
  await expect(component).toHaveCSS("width", "40px");
});

test('size="lg" resolves to a 52×52 square', async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" size="lg" />);
  await expect(component).toHaveCSS("min-height", "52px");
  await expect(component).toHaveCSS("width", "52px");
});

test("padding collapses to 0 (square geometry override)", async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" />);
  await expect(component).toHaveCSS("padding-left", "0px");
  await expect(component).toHaveCSS("padding-right", "0px");
  await expect(component).toHaveCSS("padding-top", "0px");
  await expect(component).toHaveCSS("padding-bottom", "0px");
});

/* ---------- Icon size mapping ---------- */

test('size="sm" renders a 16px icon', async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" size="sm" />);
  const svg = component.locator("svg");
  await expect(svg).toHaveAttribute("width", "16");
  await expect(svg).toHaveAttribute("height", "16");
});

test('size="compact" renders a 20px icon', async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" size="compact" />);
  const svg = component.locator("svg");
  await expect(svg).toHaveAttribute("width", "20");
  await expect(svg).toHaveAttribute("height", "20");
});

test('size="md" renders a 20px icon', async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" size="md" />);
  const svg = component.locator("svg");
  await expect(svg).toHaveAttribute("width", "20");
  await expect(svg).toHaveAttribute("height", "20");
});

test('size="lg" renders a 24px icon', async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" size="lg" />);
  const svg = component.locator("svg");
  await expect(svg).toHaveAttribute("width", "24");
  await expect(svg).toHaveAttribute("height", "24");
});

/* ---------- Variants ---------- */

test('variant="primary" (default) applies the variant-primary class', async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/variant-primary/);
});

test('variant="secondary" applies the variant-secondary class', async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" variant="secondary" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/variant-secondary/);
});

test('variant="ghost" applies the variant-ghost class', async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" variant="ghost" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/variant-ghost/);
});

/* ---------- State ---------- */

test("disabled state is propagated to the button host", async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" disabled />);
  await expect(component).toBeDisabled();
});

test("fires onClick handler", async ({ mount }) => {
  let clicks = 0;
  const component = await mount(
    <IconButton icon={X} aria-label="Close" onClick={() => clicks++} />,
  );
  await component.click();
  await component.click();
  expect(clicks).toBe(2);
});

/* ---------- Forwarding ---------- */

test("merges a consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(<IconButton icon={X} aria-label="Close" className="custom-x" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/variant-primary/);
  expect(className).toMatch(/custom-x/);
});

test("forwards arbitrary data-* props to the button host", async ({ mount }) => {
  const component = await mount(
    <IconButton icon={X} aria-label="Close" data-testid="close-btn" data-category="chrome" />,
  );
  await expect(component).toHaveAttribute("data-testid", "close-btn");
  await expect(component).toHaveAttribute("data-category", "chrome");
});

/* ---------- A11y (axe) ---------- */

test("a11y — default IconButton", async ({ mount, page }) => {
  await mount(<IconButton icon={X} aria-label="Close dialog" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — all variants at md", async ({ mount, page }) => {
  await mount(
    <div>
      <IconButton icon={X} aria-label="Close (primary)" variant="primary" />
      <IconButton icon={Copy} aria-label="Copy (secondary)" variant="secondary" />
      <IconButton icon={Heart} aria-label="Favourite (ghost)" variant="ghost" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — all sizes at primary", async ({ mount, page }) => {
  await mount(
    <div>
      <IconButton icon={X} aria-label="Close (sm)" size="sm" />
      <IconButton icon={X} aria-label="Close (compact)" size="compact" />
      <IconButton icon={X} aria-label="Close (md)" size="md" />
      <IconButton icon={X} aria-label="Close (lg)" size="lg" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
