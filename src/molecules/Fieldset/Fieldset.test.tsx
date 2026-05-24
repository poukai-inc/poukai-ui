import { test, expect } from "@playwright/experimental-ct-react";
import { Fieldset } from "./Fieldset";
import { Field } from "../Field/Field";
import { Input } from "../../atoms/Input/Input";

/* ---------- Semantic structure ---------- */

test("root element is fieldset", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Billing address">
      <Field label="Street" id="test-street">
        <Input />
      </Field>
    </Fieldset>,
  );
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("fieldset");
});

test("renders legend element with correct text", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Billing address">
      <Field label="Street" id="test-legend-street">
        <Input />
      </Field>
    </Fieldset>,
  );
  const legend = component.locator("legend");
  await expect(legend).toBeVisible();
  await expect(legend).toHaveText("Billing address");
});

test("legend is the first child of fieldset", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="My Group">
      <Field label="Name" id="test-first-child">
        <Input />
      </Field>
    </Fieldset>,
  );
  const firstChildTag = await component.evaluate((el) =>
    el.firstElementChild?.tagName.toLowerCase(),
  );
  expect(firstChildTag).toBe("legend");
});

test("renders Field children inside fields container", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Contact">
      <Field label="Email" id="test-email-child">
        <Input type="email" />
      </Field>
      <Field label="Phone" id="test-phone-child">
        <Input type="tel" />
      </Field>
    </Fieldset>,
  );
  await expect(component.getByText("Email")).toBeVisible();
  await expect(component.getByText("Phone")).toBeVisible();
  await expect(component.locator("input")).toHaveCount(2);
});

/* ---------- Native disabled propagation ---------- */

test("disabled=true sets disabled attribute on fieldset", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Disabled group" disabled>
      <Field label="Name" id="test-disabled-name">
        <Input />
      </Field>
    </Fieldset>,
  );
  await expect(component).toHaveAttribute("disabled");
});

test("disabled=true propagates to descendant inputs", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Disabled group" disabled>
      <Field label="Name" id="test-dis-input">
        <Input />
      </Field>
    </Fieldset>,
  );
  await expect(component.locator("input")).toBeDisabled();
});

/* ---------- Variants ---------- */

test("bordered variant adds bordered class", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Payment" bordered>
      <Field label="Card" id="test-bordered-card">
        <Input />
      </Field>
    </Fieldset>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/bordered/);
});

test("spacious spacing adds spacious class to fields container", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Spacious group" spacing="spacious">
      <Field label="Name" id="test-spacious-name">
        <Input />
      </Field>
    </Fieldset>,
  );
  // The fields div should have the spacious class
  const fieldsDiv = component.locator("div").first();
  const className = await fieldsDiv.getAttribute("class");
  expect(className).toMatch(/spacious/);
});

test("legendTone=muted adds legendMuted class to legend", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Optional section" legendTone="muted">
      <Field label="Name" id="test-muted-name">
        <Input />
      </Field>
    </Fieldset>,
  );
  const legend = component.locator("legend");
  const className = await legend.getAttribute("class");
  expect(className).toMatch(/legendMuted/);
});

/* ---------- Ref and prop forwarding ---------- */

test("forwards ref to root fieldset element", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Ref test" data-testid="fieldset-root">
      <Field label="Name" id="test-ref-name">
        <Input />
      </Field>
    </Fieldset>,
  );
  await expect(component).toHaveAttribute("data-testid", "fieldset-root");
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("fieldset");
});

test("merges consumer className on root fieldset", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Class merge" className="my-custom-fieldset">
      <Field label="Name" id="test-class-name">
        <Input />
      </Field>
    </Fieldset>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-custom-fieldset/);
  expect(className).toMatch(/root/);
});

test("forwards data-* attributes to root fieldset", async ({ mount }) => {
  const component = await mount(
    <Fieldset legend="Data attrs" data-analytics="fieldset-billing">
      <Field label="Street" id="test-data-street">
        <Input />
      </Field>
    </Fieldset>,
  );
  await expect(component).toHaveAttribute("data-analytics", "fieldset-billing");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
