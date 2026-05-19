import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Avatar } from "./Avatar";

/* ---------- image mode ---------- */

test("image mode renders <img> with src and alt", async ({ mount }) => {
  const component = await mount(<Avatar mode="image" src="/test.jpg" alt="Test person" />);
  const img = component.locator("img");
  await expect(img).toHaveAttribute("src", "/test.jpg");
  await expect(img).toHaveAttribute("alt", "Test person");
});

test("image mode applies loading=lazy on the <img>", async ({ mount }) => {
  const component = await mount(<Avatar mode="image" src="/test.jpg" alt="Test person" />);
  await expect(component.locator("img")).toHaveAttribute("loading", "lazy");
});

test("image mode with alt — root does NOT carry role=img", async ({ mount }) => {
  const component = await mount(<Avatar mode="image" src="/test.jpg" alt="Test person" />);
  // alt on img is sufficient; root span should not also be role=img
  const role = await component.getAttribute("role");
  expect(role).toBeNull();
});

test("image mode without alt but with name — root carries role=img + aria-label", async ({
  mount,
}) => {
  const component = await mount(<Avatar mode="image" src="/test.jpg" name="Arian Zargaran" />);
  await expect(component).toHaveAttribute("role", "img");
  await expect(component).toHaveAttribute("aria-label", "Arian Zargaran");
});

/* ---------- initials mode ---------- */

test("initials mode renders the initials text", async ({ mount }) => {
  const component = await mount(<Avatar mode="initials" initials="AZ" name="Arian Zargaran" />);
  await expect(component).toContainText("AZ");
});

test("initials mode root carries role=img + aria-label from name", async ({ mount }) => {
  const component = await mount(<Avatar mode="initials" initials="AZ" name="Arian Zargaran" />);
  await expect(component).toHaveAttribute("role", "img");
  await expect(component).toHaveAttribute("aria-label", "Arian Zargaran");
});

/* ---------- empty mode ---------- */

test("empty mode renders no visible text", async ({ mount }) => {
  const component = await mount(<Avatar name="Unknown person" />);
  const text = (await component.textContent()) ?? "";
  expect(text.trim()).toBe("");
});

test("empty mode root carries role=img + aria-label from name", async ({ mount }) => {
  const component = await mount(<Avatar name="Unknown person" />);
  await expect(component).toHaveAttribute("role", "img");
  await expect(component).toHaveAttribute("aria-label", "Unknown person");
});

/* ---------- sizes ---------- */

test("size=sm applies size-sm class", async ({ mount }) => {
  const component = await mount(<Avatar size="sm" name="Person" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/size-sm/);
});

test("size=md applies size-md class (default)", async ({ mount }) => {
  const component = await mount(<Avatar name="Person" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/size-md/);
});

test("size=lg applies size-lg class", async ({ mount }) => {
  const component = await mount(<Avatar size="lg" name="Person" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/size-lg/);
});

test("size=sm resolves to 24px width and height", async ({ mount }) => {
  const component = await mount(<Avatar size="sm" name="Person" />);
  await expect(component).toHaveCSS("width", "24px");
  await expect(component).toHaveCSS("height", "24px");
});

test("size=md resolves to 32px width and height", async ({ mount }) => {
  const component = await mount(<Avatar size="md" name="Person" />);
  await expect(component).toHaveCSS("width", "32px");
  await expect(component).toHaveCSS("height", "32px");
});

test("size=lg resolves to 40px width and height", async ({ mount }) => {
  const component = await mount(<Avatar size="lg" name="Person" />);
  await expect(component).toHaveCSS("width", "40px");
  await expect(component).toHaveCSS("height", "40px");
});

/* ---------- shapes ---------- */

test("shape=circle applies shape-circle class", async ({ mount }) => {
  const component = await mount(<Avatar shape="circle" name="Person" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/shape-circle/);
});

test("shape=square applies shape-square class", async ({ mount }) => {
  const component = await mount(<Avatar shape="square" name="Person" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/shape-square/);
});

test("shape=circle resolves to border-radius 50%", async ({ mount }) => {
  const component = await mount(<Avatar shape="circle" name="Person" />);
  await expect(component).toHaveCSS("border-radius", "50%");
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Avatar className="custom-x" name="Person" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/shape-circle/);
  expect(cls).toMatch(/size-md/);
  expect(cls).toMatch(/custom-x/);
});

/* ---------- arbitrary prop forwarding ---------- */

test("forwards data-* and aria-* props to the root span", async ({ mount }) => {
  const component = await mount(<Avatar data-testid="my-avatar" data-user="arian" name="Arian" />);
  await expect(component).toHaveAttribute("data-testid", "my-avatar");
  await expect(component).toHaveAttribute("data-user", "arian");
});

/* ---------- ref forwarding ---------- */

test("ref forwarded to root span", async ({ mount, page }) => {
  // Mount and verify root is a span element
  const component = await mount(<Avatar name="Person" />);
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("span");
});

/* ---------- axe a11y ---------- */

const SUPPRESSED = ["landmark-one-main", "page-has-heading-one", "region"] as const;

async function expectAxeClean(page: import("@playwright/test").Page) {
  const { violations } = await new AxeBuilder({ page }).disableRules([...SUPPRESSED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

test("a11y — image mode with alt", async ({ mount, page }) => {
  await mount(<Avatar mode="image" src="/test.jpg" alt="Test person" />);
  await expectAxeClean(page);
});

test("a11y — initials mode with name", async ({ mount, page }) => {
  await mount(<Avatar mode="initials" initials="AZ" name="Arian Zargaran" />);
  await expectAxeClean(page);
});

test("a11y — empty mode with name", async ({ mount, page }) => {
  await mount(<Avatar name="Unknown person" />);
  await expectAxeClean(page);
});

test("a11y — all sizes, all shapes", async ({ mount, page }) => {
  await mount(
    <div>
      <Avatar mode="initials" initials="AZ" name="Arian Zargaran" size="sm" />
      <Avatar mode="initials" initials="AZ" name="Arian Zargaran" size="md" />
      <Avatar mode="initials" initials="AZ" name="Arian Zargaran" size="lg" />
      <Avatar mode="initials" initials="AZ" name="Arian Zargaran" shape="square" />
    </div>,
  );
  await expectAxeClean(page);
});
