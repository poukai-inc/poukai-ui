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
