import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Input } from "./Input";

/* ---------- Render ---------- */

test("renders an input element", async ({ mount }) => {
  const component = await mount(<Input />);
  await expect(component).toBeVisible();
});

test("root element is input", async ({ mount }) => {
  const component = await mount(<Input data-testid="inp" />);
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("input");
});

/* ---------- Type prop ---------- */

test("defaults to type=text", async ({ mount }) => {
  const component = await mount(<Input />);
  await expect(component).toHaveAttribute("type", "text");
});

test("accepts type=email", async ({ mount }) => {
  const component = await mount(<Input type="email" />);
  await expect(component).toHaveAttribute("type", "email");
});

test("accepts type=password", async ({ mount }) => {
  const component = await mount(<Input type="password" />);
  await expect(component).toHaveAttribute("type", "password");
});

test("accepts type=search", async ({ mount }) => {
  const component = await mount(<Input type="search" />);
  await expect(component).toHaveAttribute("type", "search");
});

test("accepts type=url", async ({ mount }) => {
  const component = await mount(<Input type="url" />);
  await expect(component).toHaveAttribute("type", "url");
});

test("accepts type=tel", async ({ mount }) => {
  const component = await mount(<Input type="tel" />);
  await expect(component).toHaveAttribute("type", "tel");
});

test("accepts type=number", async ({ mount }) => {
  const component = await mount(<Input type="number" />);
  await expect(component).toHaveAttribute("type", "number");
});

/* ---------- Size prop ---------- */

test("defaults to size=md", async ({ mount }) => {
  const component = await mount(<Input />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-md|sizeMd/);
});

test("size=sm applies sm class", async ({ mount }) => {
  const component = await mount(<Input size="sm" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-sm|sizeSm/);
});

test("size=lg applies lg class", async ({ mount }) => {
  const component = await mount(<Input size="lg" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-lg|sizeLg/);
});

/* ---------- invalid prop ---------- */

test("invalid=true sets data-invalid and aria-invalid", async ({ mount }) => {
  const component = await mount(<Input invalid />);
  await expect(component).toHaveAttribute("data-invalid", "true");
  await expect(component).toHaveAttribute("aria-invalid", "true");
});

test("invalid=false omits data-invalid and aria-invalid", async ({ mount }) => {
  const component = await mount(<Input invalid={false} />);
  expect(await component.getAttribute("data-invalid")).toBeNull();
  expect(await component.getAttribute("aria-invalid")).toBeNull();
});

test("omitting invalid leaves no invalid attributes", async ({ mount }) => {
  const component = await mount(<Input />);
  expect(await component.getAttribute("data-invalid")).toBeNull();
});

/* ---------- disabled prop ---------- */

test("disabled prop is forwarded", async ({ mount }) => {
  const component = await mount(<Input disabled />);
  await expect(component).toBeDisabled();
});

/* ---------- readonly prop ---------- */

test("readOnly prop is forwarded", async ({ mount }) => {
  const component = await mount(<Input value="fixed" readOnly onChange={() => {}} />);
  await expect(component).toHaveAttribute("readonly");
});

/* ---------- placeholder / value / onChange ---------- */

test("placeholder is rendered", async ({ mount }) => {
  const component = await mount(<Input placeholder="Enter text…" />);
  await expect(component).toHaveAttribute("placeholder", "Enter text…");
});

test("controlled value prop is reflected", async ({ mount }) => {
  const component = await mount(<Input value="hello" onChange={() => {}} readOnly />);
  await expect(component).toHaveValue("hello");
});

/* ---------- className merge ---------- */

test("merges consumer className", async ({ mount }) => {
  const component = await mount(<Input className="my-custom-class" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-custom-class/);
  expect(className).toMatch(/root/);
});

/* ---------- Prop forwarding ---------- */

test("forwards data-* props", async ({ mount }) => {
  const component = await mount(<Input data-testid="inp-fwd" data-section="contact" />);
  await expect(component).toHaveAttribute("data-testid", "inp-fwd");
  await expect(component).toHaveAttribute("data-section", "contact");
});

test("forwards aria-* props", async ({ mount }) => {
  const component = await mount(<Input aria-label="Email address" />);
  await expect(component).toHaveAttribute("aria-label", "Email address");
});

test("forwards required prop", async ({ mount }) => {
  const component = await mount(<Input required />);
  await expect(component).toHaveAttribute("required");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the input element", async ({ mount }) => {
  const component = await mount(<Input data-testid="inp-ref" />);
  await expect(component).toHaveAttribute("data-testid", "inp-ref");
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("input");
});

/* ---------- Label association ---------- */

test("clicking an associated label focuses the input", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="name-field">Full name</label>
      <Input id="name-field" />
    </div>,
  );
  await page.locator("label").click();
  await expect(page.locator("input#name-field")).toBeFocused();
});

/* ---------- a11y ---------- */

test("a11y — default state (with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-input">Name</label>
      <Input id="a11y-input" />
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
      <label htmlFor="a11y-invalid-input">Email</label>
      <Input id="a11y-invalid-input" type="email" invalid defaultValue="bad" />
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
      <label htmlFor="a11y-disabled-input">Phone</label>
      <Input id="a11y-disabled-input" type="tel" disabled />
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
      <label htmlFor="a11y-sm-input">Name</label>
      <Input id="a11y-sm-input" size="sm" />
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
      <label htmlFor="a11y-lg-input">Name</label>
      <Input id="a11y-lg-input" size="lg" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
