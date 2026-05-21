import { test, expect } from "@playwright/experimental-ct-react";
import { Kbd } from "./Kbd";

/* ---------- Render ---------- */

test("renders children", async ({ mount }) => {
  const component = await mount(<Kbd>K</Kbd>);
  await expect(component.getByText("K")).toBeVisible();
});

test("root element is kbd", async ({ mount }) => {
  const component = await mount(<Kbd>K</Kbd>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("kbd");
});

test("renders symbol content", async ({ mount }) => {
  const component = await mount(<Kbd aria-label="Command">⌘</Kbd>);
  await expect(component).toHaveText("⌘");
  await expect(component).toHaveAttribute("aria-label", "Command");
});

test("renders word-key content", async ({ mount }) => {
  const component = await mount(<Kbd>Enter</Kbd>);
  await expect(component).toHaveText("Enter");
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Kbd className="custom-kbd-class">K</Kbd>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-kbd-class/);
  expect(className).toMatch(/root/);
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards data-* props to the root element", async ({ mount }) => {
  const component = await mount(
    <Kbd data-testid="kbd-1" data-key="meta">
      ⌘
    </Kbd>,
  );
  await expect(component).toHaveAttribute("data-testid", "kbd-1");
  await expect(component).toHaveAttribute("data-key", "meta");
});

test("forwards aria-* props to the root element", async ({ mount }) => {
  const component = await mount(<Kbd aria-label="Command">⌘</Kbd>);
  await expect(component).toHaveAttribute("aria-label", "Command");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the root kbd element", async ({ mount }) => {
  const component = await mount(<Kbd data-testid="kbd-ref-target">K</Kbd>);
  await expect(component).toHaveAttribute("data-testid", "kbd-ref-target");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("kbd");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
