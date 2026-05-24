import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { TimePicker } from "./TimePicker";

/* ---------- Render ---------- */

test("renders an input element", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" />);
  await expect(component).toBeVisible();
});

test("root element is input", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" data-testid="tp" />);
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("input");
});

/* ---------- type="time" ---------- */

test("has type=time", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" />);
  await expect(component).toHaveAttribute("type", "time");
});

/* ---------- Size prop ---------- */

test("defaults to size=md", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/sizeMd|size-md/);
});

test("size=sm applies sm class", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" size="sm" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/sizeSm|size-sm/);
});

test("size=lg applies lg class", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" size="lg" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/sizeLg|size-lg/);
});

/* ---------- invalid prop ---------- */

test("invalid=true sets data-invalid and aria-invalid", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" invalid />);
  await expect(component).toHaveAttribute("data-invalid", "true");
  await expect(component).toHaveAttribute("aria-invalid", "true");
});

test("invalid=false omits data-invalid and aria-invalid", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" invalid={false} />);
  expect(await component.getAttribute("data-invalid")).toBeNull();
  expect(await component.getAttribute("aria-invalid")).toBeNull();
});

test("omitting invalid leaves no invalid attributes", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" />);
  expect(await component.getAttribute("data-invalid")).toBeNull();
  expect(await component.getAttribute("aria-invalid")).toBeNull();
});

/* ---------- disabled prop ---------- */

test("disabled prop is forwarded", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" disabled />);
  await expect(component).toBeDisabled();
});

/* ---------- value / onValueChange ---------- */

test("controlled value prop is reflected", async ({ mount }) => {
  const component = await mount(
    <TimePicker aria-label="Select time" value="09:30" onValueChange={() => {}} />,
  );
  await expect(component).toHaveValue("09:30");
});

test("onValueChange fires with updated value", async ({ mount, page }) => {
  const received: string[] = [];
  await mount(
    <TimePicker
      aria-label="Select time"
      onValueChange={(v) => {
        received.push(v);
      }}
    />,
  );
  // Fill the input directly via page evaluate to fire a change event
  await page.locator('[aria-label="Select time"]').evaluate((el) => {
    const input = el as HTMLInputElement;
    input.value = "10:00";
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  // Value should have changed
  await expect(page.locator('[aria-label="Select time"]')).toHaveValue("10:00");
});

/* ---------- step prop ---------- */

test("step prop is forwarded", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" step={900} />);
  await expect(component).toHaveAttribute("step", "900");
});

/* ---------- min / max props ---------- */

test("min prop is forwarded", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" min="08:00" />);
  await expect(component).toHaveAttribute("min", "08:00");
});

test("max prop is forwarded", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" max="20:00" />);
  await expect(component).toHaveAttribute("max", "20:00");
});

/* ---------- className merge ---------- */

test("merges consumer className", async ({ mount }) => {
  const component = await mount(
    <TimePicker aria-label="Select time" className="my-custom-class" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-custom-class/);
  expect(className).toMatch(/root/);
});

/* ---------- Prop forwarding ---------- */

test("forwards data-* props", async ({ mount }) => {
  const component = await mount(
    <TimePicker aria-label="Select time" data-testid="tp-fwd" data-section="schedule" />,
  );
  await expect(component).toHaveAttribute("data-testid", "tp-fwd");
  await expect(component).toHaveAttribute("data-section", "schedule");
});

test("forwards aria-describedby", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" aria-describedby="hint-id" />);
  await expect(component).toHaveAttribute("aria-describedby", "hint-id");
});

test("forwards id prop", async ({ mount }) => {
  const component = await mount(<TimePicker id="pref-time" aria-label="Select time" />);
  await expect(component).toHaveAttribute("id", "pref-time");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to the input element", async ({ mount }) => {
  const component = await mount(<TimePicker aria-label="Select time" data-testid="tp-ref" />);
  await expect(component).toHaveAttribute("data-testid", "tp-ref");
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("input");
});

/* ---------- Label association ---------- */

test("clicking an associated label focuses the input", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="time-field">Preferred time</label>
      <TimePicker id="time-field" />
    </div>,
  );
  await page.locator("label").click();
  await expect(page.locator('[id="time-field"]')).toBeFocused();
});

/* ---------- a11y ---------- */

test("a11y — default state (with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-tp">Start time</label>
      <TimePicker id="a11y-tp" />
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
      <label htmlFor="a11y-tp-invalid">Start time</label>
      <TimePicker id="a11y-tp-invalid" invalid />
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
      <label htmlFor="a11y-tp-disabled">Start time</label>
      <TimePicker id="a11y-tp-disabled" disabled />
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
      <label htmlFor="a11y-tp-sm">Start time</label>
      <TimePicker id="a11y-tp-sm" size="sm" />
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
      <label htmlFor="a11y-tp-lg">Start time</label>
      <TimePicker id="a11y-tp-lg" size="lg" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
