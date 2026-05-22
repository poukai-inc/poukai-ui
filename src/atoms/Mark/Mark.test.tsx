import { test, expect } from "@playwright/experimental-ct-react";
import { Mark } from "./Mark";

/* ---------- Render ---------- */

test("renders children", async ({ mount }) => {
  const component = await mount(<Mark>highlighted phrase</Mark>);
  await expect(component.getByText("highlighted phrase")).toBeVisible();
});

test("root element is mark", async ({ mount }) => {
  const component = await mount(<Mark>highlighted phrase</Mark>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("mark");
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Mark className="custom-mark-class">x</Mark>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-mark-class/);
  expect(className).toMatch(/root/);
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards data-* props to the root element", async ({ mount }) => {
  const component = await mount(
    <Mark data-testid="mark-1" data-emphasis="primary">
      highlighted phrase
    </Mark>,
  );
  await expect(component).toHaveAttribute("data-testid", "mark-1");
  await expect(component).toHaveAttribute("data-emphasis", "primary");
});

test("forwards aria-* props to the root element", async ({ mount }) => {
  const component = await mount(<Mark aria-label="emphasised phrase">highlighted</Mark>);
  await expect(component).toHaveAttribute("aria-label", "emphasised phrase");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the root mark element", async ({ mount }) => {
  const component = await mount(<Mark data-testid="mark-ref-target">highlighted phrase</Mark>);
  await expect(component).toHaveAttribute("data-testid", "mark-ref-target");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("mark");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
