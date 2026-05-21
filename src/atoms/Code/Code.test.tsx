import { test, expect } from "@playwright/experimental-ct-react";
import { Code } from "./Code";

/* ---------- Render ---------- */

test("renders children", async ({ mount }) => {
  const component = await mount(<Code>--accent</Code>);
  await expect(component.getByText("--accent")).toBeVisible();
});

test("root element is code", async ({ mount }) => {
  const component = await mount(<Code>--accent</Code>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("code");
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Code className="custom-code-class">x</Code>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-code-class/);
  expect(className).toMatch(/root/);
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards data-* props to the root element", async ({ mount }) => {
  const component = await mount(
    <Code data-testid="code-1" data-token="accent">
      --accent
    </Code>,
  );
  await expect(component).toHaveAttribute("data-testid", "code-1");
  await expect(component).toHaveAttribute("data-token", "accent");
});

test("forwards aria-* props to the root element", async ({ mount }) => {
  const component = await mount(<Code aria-label="CSS custom property">--accent</Code>);
  await expect(component).toHaveAttribute("aria-label", "CSS custom property");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the root code element", async ({ mount }) => {
  const component = await mount(<Code data-testid="code-ref-target">--accent</Code>);
  await expect(component).toHaveAttribute("data-testid", "code-ref-target");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("code");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
