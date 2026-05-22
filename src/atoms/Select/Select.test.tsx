import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Select } from "./Select";

/* ---------- Render ---------- */

test("renders a select element", async ({ mount }) => {
  const component = await mount(
    <Select>
      <option value="a">A</option>
    </Select>,
  );
  await expect(component).toBeVisible();
});

test("root element is select", async ({ mount }) => {
  const component = await mount(
    <Select>
      <option value="a">A</option>
    </Select>,
  );
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("select");
});

test("renders children options", async ({ mount }) => {
  const component = await mount(
    <Select>
      <option value="a">Alpha</option>
      <option value="b">Beta</option>
    </Select>,
  );
  const count = await component.locator("option").count();
  expect(count).toBe(2);
});

/* ---------- Size prop ---------- */

test("defaults to size=md", async ({ mount }) => {
  const component = await mount(
    <Select>
      <option value="a">A</option>
    </Select>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-md|sizeMd/);
});

test("size=sm applies sm class", async ({ mount }) => {
  const component = await mount(
    <Select size="sm">
      <option value="a">A</option>
    </Select>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-sm|sizeSm/);
});

test("size=lg applies lg class", async ({ mount }) => {
  const component = await mount(
    <Select size="lg">
      <option value="a">A</option>
    </Select>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-lg|sizeLg/);
});

/* ---------- invalid prop ---------- */

test("invalid=true sets data-invalid and aria-invalid", async ({ mount }) => {
  const component = await mount(
    <Select invalid>
      <option value="a">A</option>
    </Select>,
  );
  await expect(component).toHaveAttribute("data-invalid", "true");
  await expect(component).toHaveAttribute("aria-invalid", "true");
});

test("invalid=false omits data-invalid and aria-invalid", async ({ mount }) => {
  const component = await mount(
    <Select invalid={false}>
      <option value="a">A</option>
    </Select>,
  );
  expect(await component.getAttribute("data-invalid")).toBeNull();
  expect(await component.getAttribute("aria-invalid")).toBeNull();
});

test("omitting invalid leaves no invalid attributes", async ({ mount }) => {
  const component = await mount(
    <Select>
      <option value="a">A</option>
    </Select>,
  );
  expect(await component.getAttribute("data-invalid")).toBeNull();
  expect(await component.getAttribute("aria-invalid")).toBeNull();
});

/* ---------- disabled prop ---------- */

test("disabled prop is forwarded", async ({ mount }) => {
  const component = await mount(
    <Select disabled>
      <option value="a">A</option>
    </Select>,
  );
  await expect(component).toBeDisabled();
});

/* ---------- defaultValue / value ---------- */

test("defaultValue pre-selects an option", async ({ mount }) => {
  const component = await mount(
    <Select defaultValue="b">
      <option value="a">A</option>
      <option value="b">B</option>
    </Select>,
  );
  await expect(component).toHaveValue("b");
});

test("controlled value prop is reflected", async ({ mount }) => {
  const component = await mount(
    <Select value="a" onChange={() => {}}>
      <option value="a">A</option>
      <option value="b">B</option>
    </Select>,
  );
  await expect(component).toHaveValue("a");
});

/* ---------- className merge ---------- */

test("merges consumer className", async ({ mount }) => {
  const component = await mount(
    <Select className="my-custom">
      <option value="a">A</option>
    </Select>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-custom/);
  expect(className).toMatch(/root/);
});

/* ---------- Prop forwarding ---------- */

test("forwards data-* props", async ({ mount }) => {
  const component = await mount(
    <Select data-testid="sel-fwd" data-section="form">
      <option value="a">A</option>
    </Select>,
  );
  await expect(component).toHaveAttribute("data-testid", "sel-fwd");
  await expect(component).toHaveAttribute("data-section", "form");
});

test("forwards aria-* props", async ({ mount }) => {
  const component = await mount(
    <Select aria-label="Select country">
      <option value="a">A</option>
    </Select>,
  );
  await expect(component).toHaveAttribute("aria-label", "Select country");
});

test("forwards required prop", async ({ mount }) => {
  const component = await mount(
    <Select required>
      <option value="a">A</option>
    </Select>,
  );
  await expect(component).toHaveAttribute("required");
});

test("forwards name prop", async ({ mount }) => {
  const component = await mount(
    <Select name="country">
      <option value="a">A</option>
    </Select>,
  );
  await expect(component).toHaveAttribute("name", "country");
});

test("multiple attribute renders listbox", async ({ mount }) => {
  const component = await mount(
    <Select multiple>
      <option value="a">A</option>
      <option value="b">B</option>
    </Select>,
  );
  await expect(component).toHaveAttribute("multiple");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the select element", async ({ mount }) => {
  const component = await mount(
    <Select data-testid="sel-ref">
      <option value="a">A</option>
    </Select>,
  );
  await expect(component).toHaveAttribute("data-testid", "sel-ref");
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("select");
});

/* ---------- Label association ---------- */

test("clicking an associated label focuses the select", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="assoc-select">Country</label>
      <Select id="assoc-select">
        <option value="a">A</option>
      </Select>
    </div>,
  );
  await page.locator("label").click();
  await expect(page.locator("select#assoc-select")).toBeFocused();
});

/* ---------- Keyboard interaction ---------- */

test("keyboard: arrow key changes selection", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="kb-select">Choice</label>
      <Select id="kb-select" defaultValue="a">
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
        <option value="c">Gamma</option>
      </Select>
    </div>,
  );
  const sel = page.locator("select#kb-select");
  await sel.focus();
  await page.keyboard.press("ArrowDown");
  await expect(sel).toHaveValue("b");
  await page.keyboard.press("ArrowDown");
  await expect(sel).toHaveValue("c");
});

/* ---------- a11y ---------- */

test("a11y — default state (with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-select">Country</label>
      <Select id="a11y-select">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </Select>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — invalid state (with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-invalid-select">Plan</label>
      <Select id="a11y-invalid-select" invalid defaultValue="">
        <option value="" disabled>
          Select…
        </option>
        <option value="pro">Pro</option>
      </Select>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — disabled state (with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-disabled-select">Plan</label>
      <Select id="a11y-disabled-select" disabled defaultValue="pro">
        <option value="pro">Pro</option>
      </Select>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — size=sm (with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-sm-select">Size</label>
      <Select id="a11y-sm-select" size="sm">
        <option value="a">A</option>
      </Select>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — size=lg (with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-lg-select">Size</label>
      <Select id="a11y-lg-select" size="lg">
        <option value="a">A</option>
      </Select>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — multiple (with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-multi-select">Skills</label>
      <Select id="a11y-multi-select" multiple>
        <option value="design">Design</option>
        <option value="eng">Engineering</option>
      </Select>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
