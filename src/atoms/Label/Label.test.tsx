import { test, expect } from "@playwright/experimental-ct-react";
import { Label } from "./Label";

/* ---------- Render ---------- */

test("renders text content", async ({ mount }) => {
  const component = await mount(<Label htmlFor="ctrl">Email address</Label>);
  await expect(component.getByText("Email address")).toBeVisible();
});

/* ---------- htmlFor / click-to-focus ---------- */

test("htmlFor attribute is forwarded to the root label element", async ({ mount }) => {
  const component = await mount(
    <div>
      <Label htmlFor="target-input">Name</Label>
      <input id="target-input" type="text" />
    </div>,
  );
  const label = component.locator("label");
  await expect(label).toHaveAttribute("for", "target-input");
});

test("clicking the label focuses the bound input", async ({ mount }) => {
  const component = await mount(
    <div>
      <Label htmlFor="focus-input">Name</Label>
      <input id="focus-input" type="text" />
    </div>,
  );
  const label = component.locator("label");
  const input = component.locator("input");
  await label.click();
  await expect(input).toBeFocused();
});

/* ---------- Required indicator ---------- */

test("required asterisk renders when required={true}", async ({ mount }) => {
  const component = await mount(
    <Label htmlFor="req-ctrl" required>
      Full name
    </Label>,
  );
  await expect(component.getByText("*")).toBeVisible();
});

test("required asterisk carries aria-hidden=true", async ({ mount }) => {
  const component = await mount(
    <Label htmlFor="req-ctrl" required>
      Full name
    </Label>,
  );
  const mark = component.locator("span");
  await expect(mark).toHaveAttribute("aria-hidden", "true");
});

test("required asterisk is absent when required is false (default)", async ({ mount }) => {
  const component = await mount(<Label htmlFor="ctrl">Email</Label>);
  // No span descendant when required is omitted
  await expect(component.locator("span")).toHaveCount(0);
});

/* ---------- Tone ---------- */

test("tone=muted adds the toneMuted CSS module class", async ({ mount }) => {
  const component = await mount(
    <Label htmlFor="ctrl" tone="muted">
      Timezone
    </Label>,
  );
  const className = await component.getAttribute("class");
  // CSS Modules scopes the class name — verify it contains the module identifier fragment
  expect(className).toMatch(/toneMuted/);
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the HTMLLabelElement", async ({ mount }) => {
  // Verify ref reach via data-testid forwarded as rest prop
  const component = await mount(
    <Label htmlFor="ctrl" data-testid="label-ref-target">
      Name
    </Label>,
  );
  await expect(component).toHaveAttribute("data-testid", "label-ref-target");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("label");
});

/* ---------- className merge ---------- */

test("merges consumer className with root module class", async ({ mount }) => {
  const component = await mount(
    <Label htmlFor="ctrl" className="custom-spacing">
      Name
    </Label>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-spacing/);
  // Root module class is also present
  expect(className).toMatch(/root/);
});

/* ---------- a11y (isolated per-component scans) ---------- */

// Full a11y matrix lives in src/a11y.test.tsx (central gate).
// These two targeted scans verify the component in isolation.

test("a11y — no violations when required=false", async ({ mount, page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await mount(
    <div>
      <Label htmlFor="a11y-ctrl-default">Email address</Label>
      <input id="a11y-ctrl-default" type="email" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — no violations when required=true", async ({ mount, page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await mount(
    <div>
      <Label htmlFor="a11y-ctrl-required" required>
        Email address
      </Label>
      <input id="a11y-ctrl-required" type="email" aria-required="true" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
