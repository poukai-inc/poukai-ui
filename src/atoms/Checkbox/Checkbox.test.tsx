/**
 * Checkbox CT tests.
 *
 * State assertions use Radix's `data-state` attribute — the canonical contract.
 * See spec §9: "Lucide CT blocker" — icon-presence assertions are deferred until
 * the lucide-react/Playwright CT blocker resolves (BACKLOG.md §Blocking).
 * `data-state` is correct regardless: it is derived from the same source as
 * `aria-checked` and is resilient to icon-library changes.
 */
import { test, expect } from "@playwright/experimental-ct-react";
import { Checkbox } from "./Checkbox";

/* ---------- Initial state rendering ---------- */

test("unchecked: data-state is 'unchecked' by default", async ({ mount }) => {
  const component = await mount(<Checkbox aria-label="Test" />);
  await expect(component).toHaveAttribute("data-state", "unchecked");
});

test("checked: data-state is 'checked' when checked={true}", async ({ mount }) => {
  const component = await mount(<Checkbox checked aria-label="Test" />);
  await expect(component).toHaveAttribute("data-state", "checked");
});

test("indeterminate: data-state is 'indeterminate' when checked='indeterminate'", async ({
  mount,
}) => {
  const component = await mount(<Checkbox checked="indeterminate" aria-label="Test" />);
  await expect(component).toHaveAttribute("data-state", "indeterminate");
});

/* ---------- DOM semantics ---------- */

test("renders as a <button> with role='checkbox'", async ({ mount }) => {
  const component = await mount(<Checkbox aria-label="Test" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("button");
  await expect(component).toHaveAttribute("role", "checkbox");
});

test("aria-checked reflects unchecked state", async ({ mount }) => {
  const component = await mount(<Checkbox aria-label="Test" />);
  await expect(component).toHaveAttribute("aria-checked", "false");
});

test("aria-checked reflects checked state", async ({ mount }) => {
  const component = await mount(<Checkbox checked aria-label="Test" />);
  await expect(component).toHaveAttribute("aria-checked", "true");
});

test("aria-checked reflects indeterminate state", async ({ mount }) => {
  const component = await mount(<Checkbox checked="indeterminate" aria-label="Test" />);
  await expect(component).toHaveAttribute("aria-checked", "mixed");
});

/* ---------- Controlled toggle ---------- */

test("controlled: clicking a controlled checkbox calls onCheckedChange", async ({ mount }) => {
  let lastValue: boolean | "indeterminate" | undefined;
  const component = await mount(
    <Checkbox
      checked={false}
      onCheckedChange={(val) => {
        lastValue = val;
      }}
      aria-label="Test"
    />,
  );
  await component.click();
  expect(lastValue).toBe(true);
});

test("controlled: data-state updates when checked prop changes", async ({ mount }) => {
  const component = await mount(<Checkbox checked={false} aria-label="Test" />);
  await expect(component).toHaveAttribute("data-state", "unchecked");
  await component.update(<Checkbox checked={true} aria-label="Test" />);
  await expect(component).toHaveAttribute("data-state", "checked");
});

/* ---------- Uncontrolled toggle ---------- */

test("uncontrolled: clicking toggles data-state from unchecked to checked", async ({ mount }) => {
  const component = await mount(<Checkbox aria-label="Test" />);
  await expect(component).toHaveAttribute("data-state", "unchecked");
  await component.click();
  await expect(component).toHaveAttribute("data-state", "checked");
});

test("uncontrolled: defaultChecked starts as checked", async ({ mount }) => {
  const component = await mount(<Checkbox defaultChecked aria-label="Test" />);
  await expect(component).toHaveAttribute("data-state", "checked");
});

test("uncontrolled: clicking toggles back to unchecked", async ({ mount }) => {
  const component = await mount(<Checkbox defaultChecked aria-label="Test" />);
  await component.click();
  await expect(component).toHaveAttribute("data-state", "unchecked");
});

/* ---------- Disabled state ---------- */

test("disabled: button has data-disabled attribute", async ({ mount }) => {
  const component = await mount(<Checkbox disabled aria-label="Test" />);
  await expect(component).toHaveAttribute("data-disabled");
});

test("disabled: clicking a disabled unchecked checkbox does not change state", async ({
  mount,
}) => {
  const component = await mount(<Checkbox disabled aria-label="Test" />);
  await expect(component).toHaveAttribute("data-state", "unchecked");
  await component.click({ force: true });
  await expect(component).toHaveAttribute("data-state", "unchecked");
});

test("disabled: clicking a disabled checked checkbox does not change state", async ({ mount }) => {
  const component = await mount(<Checkbox defaultChecked disabled aria-label="Test" />);
  await expect(component).toHaveAttribute("data-state", "checked");
  await component.click({ force: true });
  await expect(component).toHaveAttribute("data-state", "checked");
});

test("disabled indeterminate: data-state is 'indeterminate'", async ({ mount }) => {
  const component = await mount(<Checkbox checked="indeterminate" disabled aria-label="Test" />);
  await expect(component).toHaveAttribute("data-state", "indeterminate");
});

/* ---------- aria-invalid ---------- */

test("aria-invalid='true': attribute is present on root button", async ({ mount }) => {
  const component = await mount(<Checkbox aria-invalid="true" aria-label="Test" />);
  await expect(component).toHaveAttribute("aria-invalid", "true");
});

/* ---------- Prop forwarding ---------- */

test("forwards data-* props to the root button", async ({ mount }) => {
  const component = await mount(
    <Checkbox aria-label="Test" data-testid="cb-test" data-group="options" />,
  );
  await expect(component).toHaveAttribute("data-testid", "cb-test");
  await expect(component).toHaveAttribute("data-group", "options");
});

test("forwards id to the root button", async ({ mount }) => {
  const component = await mount(<Checkbox id="my-checkbox" aria-label="Test" />);
  await expect(component).toHaveAttribute("id", "my-checkbox");
});

test("merges a consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Checkbox aria-label="Test" className="my-custom" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/my-custom/);
});

/* ---------- Size (16x16) ---------- */

test("root resolves to 16x16px", async ({ mount }) => {
  const component = await mount(<Checkbox aria-label="Test" />);
  await expect(component).toHaveCSS("width", "16px");
  await expect(component).toHaveCSS("height", "16px");
});
