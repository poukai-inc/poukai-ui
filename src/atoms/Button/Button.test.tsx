import { test, expect } from "@playwright/experimental-ct-react";
import { Button } from "./Button";

test("renders as a button by default with type=button", async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>);
  await expect(component).toHaveAttribute("type", "button");
});

test("composes onto an anchor via asChild", async ({ mount }) => {
  const component = await mount(
    <Button asChild>
      <a href="https://pouk.ai">Visit</a>
    </Button>,
  );
  await expect(component).toHaveAttribute("href", "https://pouk.ai");
});

test("respects disabled state", async ({ mount }) => {
  const component = await mount(<Button disabled>Off</Button>);
  await expect(component).toBeDisabled();
});

test("fires click handler", async ({ mount }) => {
  let clicks = 0;
  const component = await mount(<Button onClick={() => clicks++}>Tap</Button>);
  await component.click();
  await component.click();
  expect(clicks).toBe(2);
});

test("default size resolves to md min-height (44px) — regression guard", async ({ mount }) => {
  const component = await mount(<Button>Default</Button>);
  await expect(component).toHaveCSS("min-height", "44px");
});

test('size="compact" applies the size-compact class', async ({ mount }) => {
  const component = await mount(<Button size="compact">Compact</Button>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-compact/);
});

test('size="compact" min-height resolves to 40px', async ({ mount }) => {
  const component = await mount(<Button size="compact">Compact</Button>);
  await expect(component).toHaveCSS("min-height", "40px");
});

test('size="sm" applies the size-sm class and 32px min-height', async ({ mount }) => {
  const component = await mount(<Button size="sm">Small</Button>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-sm/);
  await expect(component).toHaveCSS("min-height", "32px");
});

test('size="lg" applies the size-lg class and 52px min-height', async ({ mount }) => {
  const component = await mount(<Button size="lg">Large</Button>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-lg/);
  await expect(component).toHaveCSS("min-height", "52px");
});

test('variant="primary" (default) applies the variant-primary class', async ({ mount }) => {
  const component = await mount(<Button>Default primary</Button>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/variant-primary/);
});

test('variant="secondary" applies the variant-secondary class', async ({ mount }) => {
  const component = await mount(<Button variant="secondary">Secondary</Button>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/variant-secondary/);
});

test('variant="ghost" applies the variant-ghost class', async ({ mount }) => {
  const component = await mount(<Button variant="ghost">Ghost</Button>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/variant-ghost/);
});

test("merges a consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(<Button className="custom-x">X</Button>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/variant-primary/);
  expect(className).toMatch(/size-md/);
  expect(className).toMatch(/custom-x/);
});

test("forwards arbitrary data-* and aria-* props to the root", async ({ mount }) => {
  const component = await mount(
    <Button data-testid="cta" aria-label="Send message">
      Send
    </Button>,
  );
  await expect(component).toHaveAttribute("data-testid", "cta");
  await expect(component).toHaveAttribute("aria-label", "Send message");
});
