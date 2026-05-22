import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Switch } from "./Switch";

/* ---------- Default render ---------- */

test("renders <button role='switch'> with data-state=unchecked by default", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("button");
  await expect(component).toHaveAttribute("role", "switch");
  await expect(component).toHaveAttribute("data-state", "unchecked");
  await expect(component).toHaveAttribute("aria-checked", "false");
});

test("defaultChecked — data-state=checked on mount", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" defaultChecked />);
  await expect(component).toHaveAttribute("data-state", "checked");
  await expect(component).toHaveAttribute("aria-checked", "true");
});

/* ---------- data-state transitions ---------- */

test("click toggles unchecked → checked", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" />);
  await component.click();
  await expect(component).toHaveAttribute("data-state", "checked");
  await expect(component).toHaveAttribute("aria-checked", "true");
});

test("click toggles checked → unchecked", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" defaultChecked />);
  await component.click();
  await expect(component).toHaveAttribute("data-state", "unchecked");
  await expect(component).toHaveAttribute("aria-checked", "false");
});

/* ---------- Keyboard ---------- */

test("Space key toggles the switch", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" />);
  await component.focus();
  await component.press(" ");
  await expect(component).toHaveAttribute("data-state", "checked");
  await component.press(" ");
  await expect(component).toHaveAttribute("data-state", "unchecked");
});

test("Enter key toggles via native button click semantics", async ({ mount }) => {
  // Radix renders a native <button>; browsers fire click on Enter for buttons.
  // ARIA spec for role="switch" only requires Space, but Enter works via the
  // native button contract — pinned here as the actual behaviour.
  const component = await mount(<Switch aria-label="Test" />);
  await component.focus();
  await component.press("Enter");
  await expect(component).toHaveAttribute("data-state", "checked");
});

/* ---------- Transform snapshots ---------- */

test("thumb translateX(0) when unchecked", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" />);
  const thumb = component.locator("span").first();
  const transform = await thumb.evaluate((el) => getComputedStyle(el).transform);
  // translateX(0) resolves to none or matrix identity
  expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
});

test("thumb translateX(14px) when checked", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" defaultChecked />);
  const thumb = component.locator("span").first();
  // toHaveCSS retries until the transition settles — safer than one-shot evaluate.
  await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 14, 0)");
});

/* ---------- Reduced-motion ---------- */

test("reduced-motion: final-state transform still resolves to translateX(14px)", async ({
  mount,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const component = await mount(<Switch aria-label="Test" />);
  await component.click();
  await expect(component).toHaveAttribute("data-state", "checked");
  const thumb = component.locator("span").first();
  // Global tokens.css clamps transition-duration to 0.01ms — thumb jumps instantly.
  // Semantic state is preserved; only animation is suppressed.
  // toHaveCSS retries until the style settles, avoiding a race on the 0.01ms transition.
  await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 14, 0)");
});

/* ---------- Disabled ---------- */

test("disabled — data-disabled present, native disabled set", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" disabled />);
  await expect(component).toHaveAttribute("data-disabled", "");
  await expect(component).toBeDisabled();
});

test("disabled — click does not toggle state", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" disabled />);
  await component.click({ force: true });
  await expect(component).toHaveAttribute("data-state", "unchecked");
});

/* ---------- Ref forwarding ---------- */

test("forwards data-* to root button (ref-forward proxy)", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" data-testid="sw" />);
  await expect(component).toHaveAttribute("data-testid", "sw");
  await expect(component).toHaveAttribute("role", "switch");
});

/* ---------- className merge ---------- */

test("merges consumer className with internal class", async ({ mount }) => {
  const component = await mount(<Switch aria-label="Test" className="custom-x" />);
  const cls = await component.getAttribute("class");
  expect(cls).toContain("custom-x");
});

/* ---------- Accessibility (axe) ---------- */

test("axe — labelled via htmlFor", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="sw-axe">Enable notifications</label>
      <Switch id="sw-axe" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations).toEqual([]);
});

test("axe — aria-label only", async ({ mount, page }) => {
  await mount(<Switch aria-label="Enable feature" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations).toEqual([]);
});

test("axe — checked + disabled", async ({ mount, page }) => {
  await mount(<Switch aria-label="Toggle" defaultChecked disabled />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations).toEqual([]);
});
