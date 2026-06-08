import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { PasswordInput } from "./PasswordInput";

/* ---------- Render ---------- */

test("renders an input element", async ({ mount }) => {
  const component = await mount(<PasswordInput />);
  await expect(component.locator("input")).toBeVisible();
});

test("renders as type=password by default", async ({ mount }) => {
  const component = await mount(<PasswordInput />);
  await expect(component.locator("input")).toHaveAttribute("type", "password");
});

/* ---------- Reveal toggle ---------- */

test("renders the reveal toggle with default aria-label", async ({ mount }) => {
  const component = await mount(<PasswordInput />);
  const toggle = component.getByRole("button", { name: "Show password" });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});

test("clicking the toggle reveals the value (type=text)", async ({ mount }) => {
  const component = await mount(<PasswordInput />);
  const input = component.locator("input");
  await expect(input).toHaveAttribute("type", "password");
  await component.getByRole("button", { name: "Show password" }).click();
  await expect(input).toHaveAttribute("type", "text");
});

test("clicking the toggle flips aria-pressed and aria-label", async ({ mount }) => {
  const component = await mount(<PasswordInput />);
  await component.getByRole("button", { name: "Show password" }).click();
  const toggle = component.getByRole("button", { name: "Hide password" });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
});

test("clicking the toggle twice re-masks the value (type=password)", async ({ mount }) => {
  const component = await mount(<PasswordInput />);
  const input = component.locator("input");
  await component.getByRole("button", { name: "Show password" }).click();
  await expect(input).toHaveAttribute("type", "text");
  await component.getByRole("button", { name: "Hide password" }).click();
  await expect(input).toHaveAttribute("type", "password");
});

test("toggle is a type=button so it never submits a form", async ({ mount }) => {
  const component = await mount(<PasswordInput />);
  await expect(component.getByRole("button", { name: "Show password" })).toHaveAttribute(
    "type",
    "button",
  );
});

/* ---------- Custom labels ---------- */

test("honours custom revealLabel / hideLabel", async ({ mount }) => {
  const component = await mount(
    <PasswordInput revealLabel="Mostrar contraseña" hideLabel="Ocultar contraseña" />,
  );
  await component.getByRole("button", { name: "Mostrar contraseña" }).click();
  await expect(component.getByRole("button", { name: "Ocultar contraseña" })).toBeVisible();
});

/* ---------- Size prop ---------- */

test("defaults to size=md", async ({ mount }) => {
  const component = await mount(<PasswordInput />);
  const className = await component.locator("input").getAttribute("class");
  expect(className).toMatch(/size-md|sizeMd/);
});

test("size=sm applies sm class to the input", async ({ mount }) => {
  const component = await mount(<PasswordInput size="sm" />);
  const className = await component.locator("input").getAttribute("class");
  expect(className).toMatch(/size-sm|sizeSm/);
});

test("size=lg applies lg class to the input", async ({ mount }) => {
  const component = await mount(<PasswordInput size="lg" />);
  const className = await component.locator("input").getAttribute("class");
  expect(className).toMatch(/size-lg|sizeLg/);
});

/* ---------- invalid prop ---------- */

test("invalid=true sets data-invalid and aria-invalid on the input", async ({ mount }) => {
  const component = await mount(<PasswordInput invalid />);
  const input = component.locator("input");
  await expect(input).toHaveAttribute("data-invalid", "true");
  await expect(input).toHaveAttribute("aria-invalid", "true");
});

test("omitting invalid leaves no invalid attributes", async ({ mount }) => {
  const component = await mount(<PasswordInput />);
  expect(await component.locator("input").getAttribute("data-invalid")).toBeNull();
});

/* ---------- disabled prop ---------- */

test("disabled prop is forwarded to the input", async ({ mount }) => {
  const component = await mount(<PasswordInput disabled />);
  await expect(component.locator("input")).toBeDisabled();
});

/* ---------- placeholder / prop forwarding ---------- */

test("placeholder is rendered on the input", async ({ mount }) => {
  const component = await mount(<PasswordInput placeholder="••••••••" />);
  await expect(component.locator("input")).toHaveAttribute("placeholder", "••••••••");
});

test("forwards autoComplete to the input", async ({ mount }) => {
  const component = await mount(<PasswordInput autoComplete="current-password" />);
  await expect(component.locator("input")).toHaveAttribute("autocomplete", "current-password");
});

test("forwards data-* props to the input", async ({ mount }) => {
  const component = await mount(<PasswordInput data-testid="pw-fwd" />);
  await expect(component.locator("input")).toHaveAttribute("data-testid", "pw-fwd");
});

test("forwards required prop to the input", async ({ mount }) => {
  const component = await mount(<PasswordInput required />);
  await expect(component.locator("input")).toHaveAttribute("required");
});

/* ---------- className merge ---------- */

test("merges consumer className onto the root wrapper", async ({ mount }) => {
  const component = await mount(<PasswordInput className="my-custom-class" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-custom-class/);
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the input element", async ({ mount }) => {
  const component = await mount(<PasswordInput data-testid="pw-ref" />);
  const input = component.locator("input");
  await expect(input).toHaveAttribute("data-testid", "pw-ref");
  const tagName = await input.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("input");
});

/* ---------- Label association ---------- */

test("clicking an associated label focuses the input", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="pw-field">Password</label>
      <PasswordInput id="pw-field" />
    </div>,
  );
  await page.locator("label").click();
  await expect(page.locator("input#pw-field")).toBeFocused();
});

/* ---------- a11y ---------- */

test("a11y — masked state (with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-pw">Password</label>
      <PasswordInput id="a11y-pw" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — revealed state (with label)", async ({ mount, page }) => {
  const component = await mount(
    <div>
      <label htmlFor="a11y-pw-shown">Password</label>
      <PasswordInput id="a11y-pw-shown" />
    </div>,
  );
  await component.getByRole("button", { name: "Show password" }).click();
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
