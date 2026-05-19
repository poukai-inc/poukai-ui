import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Pull } from "./Pull";

/* ---------- Root element ---------- */

test("renders default <blockquote> root", async ({ mount }) => {
  const component = await mount(<Pull>Pull body text.</Pull>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("blockquote");
});

test("polymorphic as='aside' renders <aside> root", async ({ mount }) => {
  const component = await mount(<Pull as="aside">Pull body text.</Pull>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("aside");
});

/* ---------- cite attribute ---------- */

test("cite prop attaches to blockquote native attribute when as='blockquote'", async ({
  mount,
}) => {
  const component = await mount(<Pull cite="https://example.com/source">Pull body text.</Pull>);
  const citeAttr = await component.getAttribute("cite");
  expect(citeAttr).toBe("https://example.com/source");
});

test("cite prop NOT attached as native HTML attr when as='aside'", async ({ mount }) => {
  const component = await mount(
    <Pull as="aside" cite="https://example.com/source">
      Pull body text.
    </Pull>,
  );
  // cite is not a valid attribute on <aside>; it must not be forwarded
  const citeAttr = await component.getAttribute("cite");
  expect(citeAttr).toBeNull();
});

/* ---------- Attribution slot ---------- */

test("attribution renders inside <footer> when as='blockquote'", async ({ mount }) => {
  const component = await mount(
    <Pull attribution="— from §3, Engineering culture">Pull body text.</Pull>,
  );
  const attributionEl = component.getByText("— from §3, Engineering culture");
  await expect(attributionEl).toBeVisible();
  const tag = await attributionEl.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("footer");
});

test("attribution renders inside <p> when as='aside'", async ({ mount }) => {
  const component = await mount(
    <Pull as="aside" attribution="— from §3, Engineering culture">
      Pull body text.
    </Pull>,
  );
  const attributionEl = component.getByText("— from §3, Engineering culture");
  await expect(attributionEl).toBeVisible();
  const tag = await attributionEl.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("p");
});

test("no attribution element rendered when attribution prop is absent", async ({ mount }) => {
  const component = await mount(<Pull>Pull body text.</Pull>);
  // No footer or attribution-class element should be present
  await expect(component.locator("footer")).toHaveCount(0);
});

/* ---------- Variant ---------- */

test("variant='serif' (default) applies serif font-family", async ({ mount }) => {
  const component = await mount(<Pull variant="serif">Pull body text.</Pull>);
  const fontFamily = await component.evaluate((el) => window.getComputedStyle(el).fontFamily);
  // Instrument Serif should be the first declared family
  expect(fontFamily.toLowerCase()).toContain("instrument serif");
});

test("variant='sans' applies sans font-family", async ({ mount }) => {
  const component = await mount(<Pull variant="sans">Pull body text.</Pull>);
  const fontFamily = await component.evaluate((el) => window.getComputedStyle(el).fontFamily);
  // Should not start with Instrument Serif; should resolve to Geist or system sans
  expect(fontFamily.toLowerCase()).not.toContain("instrument serif");
});

/* ---------- className merge + arbitrary-prop forwarding ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Pull className="custom-pull-class">Pull body text.</Pull>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-pull-class/);
});

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(<Pull data-testid="pull-root">Pull body text.</Pull>);
  await expect(component).toHaveAttribute("data-testid", "pull-root");
});

test("forwards aria-label to root element", async ({ mount }) => {
  const component = await mount(<Pull aria-label="Pull quote">Pull body text.</Pull>);
  await expect(component).toHaveAttribute("aria-label", "Pull quote");
});

/* ---------- Children ---------- */

test("renders children as body text", async ({ mount }) => {
  const component = await mount(
    <Pull>The smallest real deployment teaches more than six months of staging.</Pull>,
  );
  await expect(
    component.getByText("The smallest real deployment teaches more than six months of staging."),
  ).toBeVisible();
});

/* ---------- a11y ---------- */

test("a11y — default blockquote with body only", async ({ mount, page }) => {
  await mount(<Pull>The smallest real deployment teaches more than six months of staging.</Pull>);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — blockquote with attribution footer", async ({ mount, page }) => {
  await mount(
    <Pull attribution="— from §3, Engineering culture">
      Pilots fail because they are rehearsals.
    </Pull>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — aside variant with attribution p", async ({ mount, page }) => {
  await mount(
    <Pull as="aside" attribution="— from §3, Engineering culture">
      Pilots fail because they are rehearsals.
    </Pull>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — sans variant", async ({ mount, page }) => {
  await mount(
    <Pull variant="sans" attribution="— from §3, Engineering culture">
      The smallest real deployment teaches more than six months of staging.
    </Pull>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
