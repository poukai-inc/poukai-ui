import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { IconFixture } from "./Icon.fixtures";

/**
 * Tests use `IconFixture` (a wrapper exported from `Icon.fixtures.tsx`) rather
 * than `<Icon icon={Mail} />` directly. Playwright CT serializes props passed
 * via `mount()` — Lucide icon components cannot survive that boundary, so the
 * icon must be bound inside a non-test module. The fixture takes a string
 * `name` (serializable) and resolves it to a Lucide component internally.
 *
 * The Icon component itself still renders the Lucide SVG as its root element.
 */

/* ---------- Size rendering ---------- */

test("size xs renders with correct computed dimensions", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" size="xs" data-testid="icon-xs" />);
  const svg = page.locator("[data-testid='icon-xs']");
  const width = await svg.evaluate((el) => el.getAttribute("width"));
  const height = await svg.evaluate((el) => el.getAttribute("height"));
  expect(width).toBe("12");
  expect(height).toBe("12");
});

test("size sm renders with correct computed dimensions", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" size="sm" data-testid="icon-sm" />);
  const svg = page.locator("[data-testid='icon-sm']");
  const width = await svg.evaluate((el) => el.getAttribute("width"));
  const height = await svg.evaluate((el) => el.getAttribute("height"));
  expect(width).toBe("16");
  expect(height).toBe("16");
});

test("size md renders with correct computed dimensions", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" size="md" data-testid="icon-md" />);
  const svg = page.locator("[data-testid='icon-md']");
  const width = await svg.evaluate((el) => el.getAttribute("width"));
  const height = await svg.evaluate((el) => el.getAttribute("height"));
  expect(width).toBe("20");
  expect(height).toBe("20");
});

test("size lg renders with correct computed dimensions", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" size="lg" data-testid="icon-lg" />);
  const svg = page.locator("[data-testid='icon-lg']");
  const width = await svg.evaluate((el) => el.getAttribute("width"));
  const height = await svg.evaluate((el) => el.getAttribute("height"));
  expect(width).toBe("24");
  expect(height).toBe("24");
});

test("default size is sm (16px)", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" data-testid="icon-default" />);
  const svg = page.locator("[data-testid='icon-default']");
  const width = await svg.evaluate((el) => el.getAttribute("width"));
  expect(width).toBe("16");
});

/* ---------- Size CSS classes ---------- */

test("size xs applies sizeXs class", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" size="xs" data-testid="icon-cls-xs" />);
  const svg = page.locator("[data-testid='icon-cls-xs']");
  const className = await svg.getAttribute("class");
  expect(className).toMatch(/sizeXs/);
});

test("size sm applies sizeSm class", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" size="sm" data-testid="icon-cls-sm" />);
  const svg = page.locator("[data-testid='icon-cls-sm']");
  const className = await svg.getAttribute("class");
  expect(className).toMatch(/sizeSm/);
});

test("size md applies sizeMd class", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" size="md" data-testid="icon-cls-md" />);
  const svg = page.locator("[data-testid='icon-cls-md']");
  const className = await svg.getAttribute("class");
  expect(className).toMatch(/sizeMd/);
});

test("size lg applies sizeLg class", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" size="lg" data-testid="icon-cls-lg" />);
  const svg = page.locator("[data-testid='icon-cls-lg']");
  const className = await svg.getAttribute("class");
  expect(className).toMatch(/sizeLg/);
});

/* ---------- Decorative (default) ---------- */

test("decorative default applies aria-hidden=true", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" data-testid="icon-dec-default" />);
  const svg = page.locator("[data-testid='icon-dec-default']");
  await expect(svg).toHaveAttribute("aria-hidden", "true");
});

test("decorative=true explicitly applies aria-hidden=true", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" decorative={true} data-testid="icon-dec-true" />);
  const svg = page.locator("[data-testid='icon-dec-true']");
  await expect(svg).toHaveAttribute("aria-hidden", "true");
});

test("decorative default does not set role=img", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" data-testid="icon-dec-no-role" />);
  const svg = page.locator("[data-testid='icon-dec-no-role']");
  const role = await svg.getAttribute("role");
  expect(role).toBeNull();
});

test("decorative default applies focusable=false", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" data-testid="icon-dec-focusable" />);
  const svg = page.locator("[data-testid='icon-dec-focusable']");
  await expect(svg).toHaveAttribute("focusable", "false");
});

/* ---------- Semantic (non-decorative) ---------- */

test("decorative=false with aria-label applies role=img", async ({ mount, page }) => {
  await mount(
    <IconFixture
      name="heart"
      decorative={false}
      aria-label="Favourite"
      data-testid="icon-sem-role"
    />,
  );
  const svg = page.locator("[data-testid='icon-sem-role']");
  await expect(svg).toHaveAttribute("role", "img");
});

test("decorative=false with aria-label applies the label", async ({ mount, page }) => {
  await mount(
    <IconFixture
      name="heart"
      decorative={false}
      aria-label="Favourite"
      data-testid="icon-sem-label"
    />,
  );
  const svg = page.locator("[data-testid='icon-sem-label']");
  await expect(svg).toHaveAttribute("aria-label", "Favourite");
});

test("decorative=false does not set aria-hidden", async ({ mount, page }) => {
  await mount(
    <IconFixture
      name="heart"
      decorative={false}
      aria-label="Favourite"
      data-testid="icon-sem-nohidden"
    />,
  );
  const svg = page.locator("[data-testid='icon-sem-nohidden']");
  const ariaHidden = await svg.getAttribute("aria-hidden");
  expect(ariaHidden).toBeNull();
});

test("decorative=false applies focusable=false", async ({ mount, page }) => {
  await mount(
    <IconFixture
      name="heart"
      decorative={false}
      aria-label="Favourite"
      data-testid="icon-sem-focusable"
    />,
  );
  const svg = page.locator("[data-testid='icon-sem-focusable']");
  await expect(svg).toHaveAttribute("focusable", "false");
});

/* ---------- Ref forwarding ---------- */

test("ref forwards to the SVG element", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" data-testid="icon-ref" />);
  const svg = page.locator("[data-testid='icon-ref']");
  await expect(svg).toBeVisible();
  const tag = await svg.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("svg");
});

/* ---------- className merge ---------- */

test("merges consumer className with internal size class", async ({ mount, page }) => {
  await mount(
    <IconFixture
      name="mail"
      size="sm"
      className="custom-icon-class"
      data-testid="icon-cls-merge"
    />,
  );
  const svg = page.locator("[data-testid='icon-cls-merge']");
  const className = await svg.getAttribute("class");
  expect(className).toMatch(/custom-icon-class/);
  expect(className).toMatch(/sizeSm/);
});

/* ---------- ...rest forwarding ---------- */

test("forwards data-* props to the SVG element", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" data-testid="icon-data" data-category="contact" />);
  const svg = page.locator("[data-testid='icon-data']");
  await expect(svg).toHaveAttribute("data-testid", "icon-data");
  await expect(svg).toHaveAttribute("data-category", "contact");
});

test("forwards id prop to the SVG element", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" id="my-icon" data-testid="icon-id-fwd" />);
  const svg = page.locator("[data-testid='icon-id-fwd']");
  await expect(svg).toHaveAttribute("id", "my-icon");
});

/* ---------- a11y scans ---------- */

test("a11y — decorative default (aria-hidden)", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" size="sm" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — semantic with aria-label", async ({ mount, page }) => {
  await mount(
    <IconFixture name="heart" size="md" decorative={false} aria-label="Add to favourites" />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
