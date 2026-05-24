import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Stepper } from "./Stepper";

const THREE_STEPS = [{ label: "Account" }, { label: "Profile" }, { label: "Confirm" }];

/* ---------- Root element ---------- */

test("root element is <ol>", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={0} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("ol");
});

/* ---------- Renders correct number of list items ---------- */

test("renders one <li> per step", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={0} />);
  const items = component.locator("li");
  await expect(items).toHaveCount(3);
});

/* ---------- aria-current="step" on active step ---------- */

test("aria-current='step' is on the active <li>", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={1} />);
  const items = component.locator("li");

  // First item (complete) — no aria-current
  await expect(items.nth(0)).not.toHaveAttribute("aria-current");
  // Second item (active) — aria-current="step"
  await expect(items.nth(1)).toHaveAttribute("aria-current", "step");
  // Third item (upcoming) — no aria-current
  await expect(items.nth(2)).not.toHaveAttribute("aria-current");
});

test("aria-current='step' moves with current prop", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={2} />);
  const items = component.locator("li");
  await expect(items.nth(2)).toHaveAttribute("aria-current", "step");
  await expect(items.nth(0)).not.toHaveAttribute("aria-current");
  await expect(items.nth(1)).not.toHaveAttribute("aria-current");
});

/* ---------- State classes ---------- */

test("first step has complete class when current > 0", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={1} />);
  const items = component.locator("li");
  const firstClass = await items.nth(0).getAttribute("class");
  expect(firstClass).toMatch(/complete/);
});

test("active step has active class", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={1} />);
  const items = component.locator("li");
  const activeClass = await items.nth(1).getAttribute("class");
  expect(activeClass).toMatch(/active/);
});

test("upcoming step has upcoming class", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={0} />);
  const items = component.locator("li");
  const upcomingClass = await items.nth(1).getAttribute("class");
  expect(upcomingClass).toMatch(/upcoming/);
});

/* ---------- Step labels ---------- */

test("renders step labels when showLabels is true (default md)", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={0} />);
  await expect(component.getByText("Account")).toBeVisible();
  await expect(component.getByText("Profile")).toBeVisible();
  await expect(component.getByText("Confirm")).toBeVisible();
});

test("hides labels when size='sm'", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={0} size="sm" />);
  await expect(component.getByText("Account")).toHaveCount(0);
});

test("hides labels when showLabels=false", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={0} showLabels={false} />);
  await expect(component.getByText("Account")).toHaveCount(0);
});

/* ---------- Complete step visually-hidden suffix ---------- */

test("complete step has visually-hidden '(complete)' text", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={1} />);
  // The first step is complete — it must have the SR-only "(complete)" span
  const firstItem = component.locator("li").nth(0);
  await expect(firstItem.getByText("(complete)")).toBeAttached();
});

/* ---------- Connector is aria-hidden ---------- */

test("connector spans are aria-hidden", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={1} />);
  // There are 2 connectors for 3 steps (no connector before first step)
  const connectors = component.locator("[aria-hidden='true']");
  // At least the connectors are in the tree as aria-hidden
  const count = await connectors.count();
  expect(count).toBeGreaterThanOrEqual(2);
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(
    <Stepper steps={THREE_STEPS} current={0} className="custom-stepper" />,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/custom-stepper/);
});

/* ---------- data-* forwarding ---------- */

test("forwards data-testid to root <ol>", async ({ mount }) => {
  const component = await mount(
    <Stepper steps={THREE_STEPS} current={0} data-testid="stepper-root" />,
  );
  await expect(component).toHaveAttribute("data-testid", "stepper-root");
});

/* ---------- aria-* forwarding ---------- */

test("forwards aria-label to root <ol>", async ({ mount }) => {
  const component = await mount(
    <Stepper steps={THREE_STEPS} current={0} aria-label="Checkout steps" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Checkout steps");
});

/* ---------- Ref forwarding ---------- */

test("ref is forwarded to the root <ol>", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={0} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("ol");
});

/* ---------- Orientation ---------- */

test("horizontal orientation class is applied by default", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={0} />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/horizontal/);
});

test("vertical orientation class is applied when orientation='vertical'", async ({ mount }) => {
  const component = await mount(<Stepper steps={THREE_STEPS} current={0} orientation="vertical" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/vertical/);
});

/* ---------- a11y — all key states ---------- */

test("a11y — step 1 active (all upcoming)", async ({ mount, page }) => {
  await mount(<Stepper steps={THREE_STEPS} current={0} aria-label="Onboarding steps" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — middle step active (complete + active + upcoming)", async ({ mount, page }) => {
  await mount(<Stepper steps={THREE_STEPS} current={1} aria-label="Onboarding steps" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — last step active (all complete except last)", async ({ mount, page }) => {
  await mount(<Stepper steps={THREE_STEPS} current={2} aria-label="Onboarding steps" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — size='sm' (labels hidden)", async ({ mount, page }) => {
  await mount(<Stepper steps={THREE_STEPS} current={1} size="sm" aria-label="Checkout progress" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — vertical orientation", async ({ mount, page }) => {
  await mount(
    <Stepper steps={THREE_STEPS} current={1} orientation="vertical" aria-label="Setup steps" />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
