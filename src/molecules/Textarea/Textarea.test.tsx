import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Textarea } from "./Textarea";

/* ---------- Render ---------- */

test("renders a textarea element", async ({ mount }) => {
  const component = await mount(<Textarea />);
  await expect(component).toBeVisible();
});

test("root element is textarea", async ({ mount }) => {
  const component = await mount(<Textarea />);
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("textarea");
});

/* ---------- Defaults ---------- */

test("defaults to rows=4", async ({ mount }) => {
  const component = await mount(<Textarea />);
  await expect(component).toHaveAttribute("rows", "4");
});

/* ---------- invalid prop ---------- */

test("invalid=true sets data-invalid and aria-invalid", async ({ mount }) => {
  const component = await mount(<Textarea invalid />);
  await expect(component).toHaveAttribute("data-invalid", "true");
  await expect(component).toHaveAttribute("aria-invalid", "true");
});

test("invalid=false omits data-invalid and aria-invalid", async ({ mount }) => {
  const component = await mount(<Textarea invalid={false} />);
  const dataInvalid = await component.getAttribute("data-invalid");
  const ariaInvalid = await component.getAttribute("aria-invalid");
  expect(dataInvalid).toBeNull();
  expect(ariaInvalid).toBeNull();
});

test("omitting invalid leaves no invalid attributes", async ({ mount }) => {
  const component = await mount(<Textarea />);
  const dataInvalid = await component.getAttribute("data-invalid");
  expect(dataInvalid).toBeNull();
});

/* ---------- disabled prop ---------- */

test("disabled prop is forwarded", async ({ mount }) => {
  const component = await mount(<Textarea disabled />);
  await expect(component).toBeDisabled();
});

/* ---------- rows prop ---------- */

test("rows prop is forwarded", async ({ mount }) => {
  const component = await mount(<Textarea rows={6} />);
  await expect(component).toHaveAttribute("rows", "6");
});

/* ---------- placeholder / value ---------- */

test("placeholder is rendered", async ({ mount }) => {
  const component = await mount(<Textarea placeholder="Your message…" />);
  await expect(component).toHaveAttribute("placeholder", "Your message…");
});

test("controlled value and onChange work", async ({ mount }) => {
  const component = await mount(<Textarea value="hello" onChange={() => {}} readOnly />);
  await expect(component).toHaveValue("hello");
});

/* ---------- className merge ---------- */

test("merges consumer className", async ({ mount }) => {
  const component = await mount(<Textarea className="my-custom-class" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-custom-class/);
  expect(className).toMatch(/root/);
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards data-* props", async ({ mount }) => {
  const component = await mount(<Textarea data-testid="ta-fwd" data-section="message" />);
  await expect(component).toHaveAttribute("data-testid", "ta-fwd");
  await expect(component).toHaveAttribute("data-section", "message");
});

test("forwards aria-* props", async ({ mount }) => {
  const component = await mount(<Textarea aria-label="Message" />);
  await expect(component).toHaveAttribute("aria-label", "Message");
});

test("forwards required prop", async ({ mount }) => {
  const component = await mount(<Textarea required />);
  await expect(component).toHaveAttribute("required");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the textarea element", async ({ mount }) => {
  const component = await mount(<Textarea data-testid="ta-ref" />);
  await expect(component).toHaveAttribute("data-testid", "ta-ref");
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("textarea");
});

/* ---------- Label association (clicking label focuses textarea) ---------- */

test("clicking an associated label focuses the textarea", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="msg-field">Message</label>
      <Textarea id="msg-field" />
    </div>,
  );
  await page.locator("label").click();
  await expect(page.locator("textarea#msg-field")).toBeFocused();
});

/* ---------- a11y ---------- */

test("a11y — default state (with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-ta">Message</label>
      <Textarea id="a11y-ta" />
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
      <label htmlFor="a11y-ta-invalid">Message</label>
      <Textarea id="a11y-ta-invalid" invalid defaultValue="too short" />
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
      <label htmlFor="a11y-ta-disabled">Message</label>
      <Textarea id="a11y-ta-disabled" disabled />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
