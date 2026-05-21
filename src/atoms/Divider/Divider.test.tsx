import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Divider } from "./Divider";

/* ---------- Default render (horizontal / default / hr) ---------- */

test("renders without children", async ({ mount }) => {
  const component = await mount(<Divider />);
  await expect(component).toBeVisible();
});

test("default root element is hr", async ({ mount }) => {
  const component = await mount(<Divider />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("hr");
});

test("default orientation is horizontal", async ({ mount }) => {
  const component = await mount(<Divider />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/horizontal/);
  expect(className).not.toMatch(/vertical/);
});

test("default tone is default (not muted)", async ({ mount }) => {
  const component = await mount(<Divider />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/toneDefault/);
  expect(className).not.toMatch(/toneMuted/);
});

/* ---------- Orientation ---------- */

test("orientation=vertical renders a div by default", async ({ mount }) => {
  const component = await mount(
    <div style={{ display: "flex", height: "40px" }}>
      <Divider orientation="vertical" />
    </div>,
  );
  const divider = component.locator("[role='separator']");
  const tag = await divider.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("orientation=vertical applies vertical class", async ({ mount }) => {
  const component = await mount(
    <div style={{ display: "flex", height: "40px" }}>
      <Divider orientation="vertical" data-testid="v-divider" />
    </div>,
  );
  const divider = component.locator("[data-testid='v-divider']");
  const className = await divider.getAttribute("class");
  expect(className).toMatch(/vertical/);
  expect(className).not.toMatch(/horizontal/);
});

/* ---------- Tone ---------- */

test("tone=muted applies toneMuted class", async ({ mount }) => {
  const component = await mount(<Divider tone="muted" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/toneMuted/);
  expect(className).not.toMatch(/toneDefault/);
});

test("tone=default applies toneDefault class", async ({ mount }) => {
  const component = await mount(<Divider tone="default" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/toneDefault/);
  expect(className).not.toMatch(/toneMuted/);
});

/* ---------- `as` override ---------- */

test("as=div renders a div element", async ({ mount }) => {
  const component = await mount(<Divider as="div" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("as=hr renders an hr element", async ({ mount }) => {
  const component = await mount(<Divider as="hr" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("hr");
});

test("orientation=vertical with as=hr renders hr", async ({ mount }) => {
  const component = await mount(<Divider orientation="vertical" as="hr" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("hr");
});

/* ---------- ARIA semantics ---------- */

test("hr has no explicit role attribute (implicit separator)", async ({ mount }) => {
  const component = await mount(<Divider />);
  const role = await component.getAttribute("role");
  expect(role).toBeNull();
});

test("as=div gets role=separator", async ({ mount }) => {
  const component = await mount(<Divider as="div" />);
  await expect(component).toHaveAttribute("role", "separator");
});

test("vertical div gets aria-orientation=vertical", async ({ mount }) => {
  const component = await mount(
    <div style={{ display: "flex", height: "40px" }}>
      <Divider orientation="vertical" data-testid="aria-v" />
    </div>,
  );
  const divider = component.locator("[data-testid='aria-v']");
  await expect(divider).toHaveAttribute("aria-orientation", "vertical");
});

test("horizontal as=div gets aria-orientation=horizontal", async ({ mount }) => {
  const component = await mount(<Divider as="div" />);
  await expect(component).toHaveAttribute("aria-orientation", "horizontal");
});

/* ---------- Ref forwarding ---------- */

test("forwards ref to hr element", async ({ mount }) => {
  const component = await mount(<Divider data-testid="ref-hr" />);
  await expect(component).toHaveAttribute("data-testid", "ref-hr");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("hr");
});

test("forwards ref to div element", async ({ mount }) => {
  const component = await mount(<Divider as="div" data-testid="ref-div" />);
  await expect(component).toHaveAttribute("data-testid", "ref-div");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Divider className="custom-rule" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-rule/);
  expect(className).toMatch(/root/);
});

/* ---------- ...rest forwarding ---------- */

test("forwards data-* props to root element", async ({ mount }) => {
  const component = await mount(<Divider data-testid="divider-rest" data-section="intro" />);
  await expect(component).toHaveAttribute("data-testid", "divider-rest");
  await expect(component).toHaveAttribute("data-section", "intro");
});

test("forwards aria-label to root element on div", async ({ mount }) => {
  const component = await mount(<Divider as="div" aria-label="End of section" />);
  await expect(component).toHaveAttribute("aria-label", "End of section");
});

/* ---------- axe a11y ---------- */

test("a11y — horizontal default (hr)", async ({ mount, page }) => {
  await mount(
    <div>
      <p>Above</p>
      <Divider />
      <p>Below</p>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — vertical default (div)", async ({ mount, page }) => {
  await mount(
    <div style={{ display: "flex", height: "3rem" }}>
      <span>Left</span>
      <Divider orientation="vertical" />
      <span>Right</span>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — muted tone horizontal", async ({ mount, page }) => {
  await mount(
    <div>
      <p>Above</p>
      <Divider tone="muted" />
      <p>Below</p>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — as=div horizontal", async ({ mount, page }) => {
  await mount(
    <div>
      <p>Above</p>
      <Divider as="div" />
      <p>Below</p>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

/* a11y gate also covered in src/a11y.test.tsx (central gate). */
