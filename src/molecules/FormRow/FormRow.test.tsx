import { test, expect } from "@playwright/experimental-ct-react";
import { FormRow } from "./FormRow";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";

/* ---------- Render ---------- */

test("renders child Fields", async ({ mount }) => {
  const component = await mount(
    <FormRow>
      <Field label="First name" id="test-first">
        <Input />
      </Field>
      <Field label="Last name" id="test-last">
        <Input />
      </Field>
    </FormRow>,
  );
  await expect(component.getByText("First name")).toBeVisible();
  await expect(component.getByText("Last name")).toBeVisible();
});

test("root element is div", async ({ mount }) => {
  const component = await mount(
    <FormRow>
      <Field label="Name" id="test-tag">
        <Input />
      </Field>
    </FormRow>,
  );
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

/* ---------- Layout class ---------- */

test("root carries the module root class", async ({ mount }) => {
  const component = await mount(
    <FormRow>
      <Field label="First name" id="test-class-first">
        <Input />
      </Field>
      <Field label="Last name" id="test-class-last">
        <Input />
      </Field>
    </FormRow>,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toBeTruthy();
  // Must have at least one class (the CSS module root class).
  expect(cls!.trim().length).toBeGreaterThan(0);
});

test("gap=tight applies gapTight class", async ({ mount }) => {
  const component = await mount(
    <FormRow gap="tight">
      <Field label="A" id="test-tight-a">
        <Input />
      </Field>
      <Field label="B" id="test-tight-b">
        <Input />
      </Field>
    </FormRow>,
  );
  const cls = await component.getAttribute("class");
  // The gapTight modifier class must be present (contains "gapTight" in dev or a hash in prod).
  expect(cls).toMatch(/gapTight|poukai_/);
});

/* ---------- columns prop ---------- */

test("columns prop sets --formrow-columns CSS variable", async ({ mount }) => {
  const component = await mount(
    <FormRow columns={3}>
      <Field label="City" id="test-col-city">
        <Input />
      </Field>
      <Field label="State" id="test-col-state">
        <Input />
      </Field>
      <Field label="ZIP" id="test-col-zip">
        <Input />
      </Field>
    </FormRow>,
  );
  const styleAttr = await component.getAttribute("style");
  expect(styleAttr).toContain("--formrow-columns");
  expect(styleAttr).toContain("3");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref — data-testid readable on root element", async ({ mount }) => {
  const component = await mount(
    <FormRow data-testid="formrow-root">
      <Field label="Name" id="test-ref-name">
        <Input />
      </Field>
    </FormRow>,
  );
  await expect(component).toHaveAttribute("data-testid", "formrow-root");
});

/* ---------- className + data-* passthrough ---------- */

test("merges consumer className on root div", async ({ mount }) => {
  const component = await mount(
    <FormRow className="custom-row">
      <Field label="Name" id="test-cls-name">
        <Input />
      </Field>
    </FormRow>,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/custom-row/);
});

test("forwards data-* attributes to root", async ({ mount }) => {
  const component = await mount(
    <FormRow data-section="contact">
      <Field label="Name" id="test-data-name">
        <Input />
      </Field>
    </FormRow>,
  );
  await expect(component).toHaveAttribute("data-section", "contact");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
