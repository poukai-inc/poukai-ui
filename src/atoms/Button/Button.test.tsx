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
