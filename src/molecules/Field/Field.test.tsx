import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Field } from "./Field";
import { Input } from "../Input/Input";
import { Textarea } from "../Textarea/Textarea";

/* ---------- Render ---------- */

test("renders label and input", async ({ mount }) => {
  const component = await mount(
    <Field label="Email" id="test-email">
      <Input type="email" />
    </Field>,
  );
  await expect(component.getByText("Email")).toBeVisible();
  await expect(component.locator("input")).toBeVisible();
});

test("root element is div", async ({ mount }) => {
  const component = await mount(
    <Field label="Name" id="test-name">
      <Input />
    </Field>,
  );
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

/* ---------- Label association ---------- */

test("clicking label focuses the input", async ({ mount, page }) => {
  await mount(
    <Field label="Full name" id="label-focus-input">
      <Input />
    </Field>,
  );
  await page.locator("label").click();
  await expect(page.locator("input#label-focus-input")).toBeFocused();
});

test("clicking label focuses the textarea", async ({ mount, page }) => {
  await mount(
    <Field label="Message" id="label-focus-ta">
      <Textarea />
    </Field>,
  );
  await page.locator("label").click();
  await expect(page.locator("textarea#label-focus-ta")).toBeFocused();
});

test("label htmlFor matches input id", async ({ mount, page }) => {
  await mount(
    <Field label="Email" id="test-for-email">
      <Input type="email" />
    </Field>,
  );
  const forAttr = await page.locator("label").getAttribute("for");
  expect(forAttr).toBe("test-for-email");
  const inputId = await page.locator("input").getAttribute("id");
  expect(inputId).toBe("test-for-email");
});

/* ---------- Auto-generated id ---------- */

test("auto-generates id when not provided — label for matches input id", async ({
  mount,
  page,
}) => {
  await mount(
    <Field label="Phone">
      <Input type="tel" />
    </Field>,
  );
  const forAttr = await page.locator("label").getAttribute("for");
  const inputId = await page.locator("input").getAttribute("id");
  expect(forAttr).toBeTruthy();
  expect(forAttr).toBe(inputId);
});

/* ---------- helper text ---------- */

test("renders helper text when provided", async ({ mount }) => {
  const component = await mount(
    <Field label="Email" id="test-helper" helper="We'll never share your email.">
      <Input type="email" />
    </Field>,
  );
  await expect(component.getByText("We'll never share your email.")).toBeVisible();
});

test("helper text has correct aria-describedby wiring", async ({ mount, page }) => {
  await mount(
    <Field label="Email" id="test-describedby-helper" helper="Helper text here.">
      <Input type="email" />
    </Field>,
  );
  const describedBy = await page.locator("input").getAttribute("aria-describedby");
  expect(describedBy).toBe("test-describedby-helper-helper");

  const helperId = await page.locator("p").getAttribute("id");
  expect(helperId).toBe("test-describedby-helper-helper");
});

/* ---------- error state ---------- */

test("renders error message when provided", async ({ mount }) => {
  const component = await mount(
    <Field label="Email" id="test-error" error="Please enter a valid email.">
      <Input type="email" />
    </Field>,
  );
  await expect(component.getByText("Please enter a valid email.")).toBeVisible();
});

test("error forces aria-invalid=true on child input", async ({ mount, page }) => {
  await mount(
    <Field label="Email" id="test-aria-invalid" error="Invalid email.">
      <Input type="email" />
    </Field>,
  );
  await expect(page.locator("input")).toHaveAttribute("aria-invalid", "true");
});

test("error aria-describedby points at error element", async ({ mount, page }) => {
  await mount(
    <Field label="Email" id="test-describedby-error" error="Error message here.">
      <Input type="email" />
    </Field>,
  );
  const describedBy = await page.locator("input").getAttribute("aria-describedby");
  expect(describedBy).toBe("test-describedby-error-error");

  const errorId = await page.locator("[role='alert']").getAttribute("id");
  expect(errorId).toBe("test-describedby-error-error");
});

test("error replaces helper text — helper not rendered when error is set", async ({ mount }) => {
  const component = await mount(
    <Field
      label="Email"
      id="test-error-replaces-helper"
      error="Error message."
      helper="Helper text."
    >
      <Input type="email" />
    </Field>,
  );
  await expect(component.getByText("Error message.")).toBeVisible();
  await expect(component.getByText("Helper text.")).not.toBeVisible();
});

/* ---------- required ---------- */

test("required=true shows * indicator", async ({ mount }) => {
  const component = await mount(
    <Field label="Name" id="test-required" required>
      <Input />
    </Field>,
  );
  await expect(component.locator("[aria-hidden='true']").filter({ hasText: "*" })).toBeVisible();
});

test("required=true injects required on child input", async ({ mount, page }) => {
  await mount(
    <Field label="Name" id="test-required-input" required>
      <Input />
    </Field>,
  );
  await expect(page.locator("input")).toHaveAttribute("required");
});

test("required=true injects required on child textarea", async ({ mount, page }) => {
  await mount(
    <Field label="Message" id="test-required-ta" required>
      <Textarea />
    </Field>,
  );
  await expect(page.locator("textarea")).toHaveAttribute("required");
});

/* ---------- className merge ---------- */

test("merges consumer className on root div", async ({ mount }) => {
  const component = await mount(
    <Field label="Name" id="test-classname" className="my-custom-field">
      <Input />
    </Field>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-custom-field/);
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to root div", async ({ mount }) => {
  const component = await mount(
    <Field label="Name" id="test-ref" data-testid="field-root">
      <Input />
    </Field>,
  );
  await expect(component).toHaveAttribute("data-testid", "field-root");
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

/* ---------- a11y ---------- */

test("a11y — Field + Input (email)", async ({ mount, page }) => {
  await mount(
    <Field label="Email address" id="a11y-field-email" helper="We'll never share your email.">
      <Input type="email" placeholder="you@example.com" />
    </Field>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — Field + Textarea (message)", async ({ mount, page }) => {
  await mount(
    <Field label="Message" id="a11y-field-message" helper="Tell us about your project.">
      <Textarea placeholder="Your message…" />
    </Field>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — Field with error state", async ({ mount, page }) => {
  await mount(
    <Field label="Email address" id="a11y-field-error" error="Please enter a valid email address.">
      <Input type="email" defaultValue="bad-email" />
    </Field>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — Field required + Input", async ({ mount, page }) => {
  await mount(
    <Field label="Full name" id="a11y-field-required" required>
      <Input placeholder="Arian Zargaran" />
    </Field>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
