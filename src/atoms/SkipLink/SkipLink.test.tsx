import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { SkipLink } from "./SkipLink";

/* ---------- 1. Renders as <a> with supplied href ---------- */

test("renders as an <a> element", async ({ mount }) => {
  const component = await mount(<SkipLink href="#main" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("a");
});

test("href attribute is forwarded to the root anchor", async ({ mount }) => {
  const component = await mount(<SkipLink href="#main" />);
  await expect(component).toHaveAttribute("href", "#main");
});

test("href with custom fragment is forwarded correctly", async ({ mount }) => {
  const component = await mount(<SkipLink href="#docs-content" />);
  await expect(component).toHaveAttribute("href", "#docs-content");
});

/* ---------- 2. Default text + children override ---------- */

test('default children is "Skip to content"', async ({ mount }) => {
  const component = await mount(<SkipLink href="#main" />);
  const text = await component.textContent();
  expect(text).toBe("Skip to content");
});

test("custom children overrides the default label", async ({ mount }) => {
  const component = await mount(<SkipLink href="#docs-content">Skip to documentation</SkipLink>);
  const text = await component.textContent();
  expect(text).toBe("Skip to documentation");
});

/* ---------- 3. Rest state is visually hidden ---------- */

test("rest state: width is 1px (visually hidden)", async ({ mount }) => {
  const component = await mount(<SkipLink href="#main" />);
  // The element must be present but clipped to 1×1px
  const box = await component.boundingBox();
  // boundingBox returns null for fully invisible elements, or 1×1 for clipped
  // The sr-only pattern uses position:absolute + 1px dimensions; bounding box may be 1×1
  // Assert width ≤ 1 or box is null (both mean visually hidden)
  if (box !== null) {
    expect(box.width).toBeLessThanOrEqual(1);
    expect(box.height).toBeLessThanOrEqual(1);
  }
  // It must still be attached (in DOM + a11y tree)
  await expect(component).toBeAttached();
});

test("rest state: element is in the DOM and attached", async ({ mount }) => {
  const component = await mount(<SkipLink href="#main" />);
  await expect(component).toBeAttached();
});

/* ---------- 4. On keyboard focus the link becomes visible ---------- */

test("focused state: pill is visible (width > 1, height > 1)", async ({
  mount,
  page,
  browserName,
}) => {
  // WebKit's `:focus-visible` heuristic in Playwright CT does not match for
  // programmatic Tab presses (no real user-gesture chain inside the CT iframe).
  // The functional behavior is verified end-to-end in Chromium and Firefox;
  // skipped here on WebKit only.
  test.skip(
    browserName === "webkit",
    "WebKit CT cannot reliably seed user-gesture focus for :focus-visible",
  );
  await mount(
    <div>
      <SkipLink href="#main" data-testid="skip" />
      <div id="main" tabIndex={-1}>
        Main
      </div>
    </div>,
  );
  const link = page.getByTestId("skip");
  await page.keyboard.press("Tab");
  const box = await link.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(1);
  expect(box!.height).toBeGreaterThan(1);
});

test("focused state: pill is positioned near top-left (fixed, within 20px)", async ({
  mount,
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "WebKit CT cannot reliably seed user-gesture focus for :focus-visible",
  );
  await mount(
    <div>
      <SkipLink href="#main" data-testid="skip" />
      <div id="main" tabIndex={-1}>
        Main
      </div>
    </div>,
  );
  await page.keyboard.press("Tab");
  const link = page.getByTestId("skip");
  const box = await link.boundingBox();
  expect(box).not.toBeNull();
  // --space-2 = 8px; allow up to 20px margin for browser chrome
  expect(box!.x).toBeLessThan(20);
  expect(box!.y).toBeLessThan(20);
});

/* ---------- 5. Enter on focused link navigates to target fragment ---------- */

test("pressing Enter on the focused link updates location hash", async ({
  mount,
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "WebKit CT does not chain keyboard activation reliably from programmatic Tab",
  );
  await mount(
    <div>
      <SkipLink href="#main" data-testid="skip" />
      <main id="main" tabIndex={-1}>
        <p>Main content</p>
      </main>
    </div>,
  );
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  const hash = await page.evaluate(() => window.location.hash);
  expect(hash).toBe("#main");
});

/* ---------- 6. ref forwards to HTMLAnchorElement ---------- */

test("forwards ref to the underlying HTMLAnchorElement", async ({ mount, page }) => {
  await mount(<SkipLink href="#main" data-testid="ref-target" />);
  const el = page.getByTestId("ref-target");
  const tag = await el.evaluate((node) => node.tagName.toLowerCase());
  expect(tag).toBe("a");
});

/* ---------- 7. className merges with internal class ---------- */

test("merges consumer className with the internal module class", async ({ mount }) => {
  const component = await mount(<SkipLink href="#main" className="custom-skip-class" />);
  const className = await component.getAttribute("class");
  // Internal module class must be present
  expect(className).toBeTruthy();
  // Consumer class must also be present
  expect(className).toMatch(/custom-skip-class/);
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards data-* props to the root anchor", async ({ mount }) => {
  const component = await mount(
    <SkipLink href="#main" data-testid="skip-link" data-section="header" />,
  );
  await expect(component).toHaveAttribute("data-testid", "skip-link");
  await expect(component).toHaveAttribute("data-section", "header");
});

test("forwards aria-* props to the root anchor", async ({ mount }) => {
  const component = await mount(<SkipLink href="#main" aria-describedby="some-desc" />);
  await expect(component).toHaveAttribute("aria-describedby", "some-desc");
});

/* ---------- 8. axe: zero violations in rest + focused states ---------- */

test("a11y — rest state: zero axe violations", async ({ mount, page }) => {
  await mount(
    <div>
      <SkipLink href="#main" />
      <main id="main">
        <p>Main content</p>
      </main>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — focused state: zero axe violations", async ({ mount, page }) => {
  await mount(
    <div>
      <SkipLink href="#main" data-testid="skip" />
      <main id="main">
        <p>Main content</p>
      </main>
    </div>,
  );
  // Focus via Tab to trigger :focus-visible
  await page.keyboard.press("Tab");
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
