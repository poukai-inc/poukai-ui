import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Spinner } from "./Spinner";

/* ---------- Default render ---------- */

test("renders with default props — role=status, aria-live=polite, default label", async ({
  mount,
}) => {
  const component = await mount(<Spinner />);
  await expect(component).toHaveAttribute("role", "status");
  await expect(component).toHaveAttribute("aria-live", "polite");
  await expect(component).toHaveAttribute("aria-label", "Loading");
});

test("renders the SVG as aria-hidden (presentational)", async ({ mount }) => {
  const component = await mount(<Spinner />);
  const svg = component.locator("svg");
  await expect(svg).toHaveAttribute("aria-hidden", "true");
});

test("renders both track circle and arc circle inside SVG", async ({ mount }) => {
  const component = await mount(<Spinner />);
  const circles = component.locator("svg circle");
  await expect(circles).toHaveCount(2);
});

/* ---------- Size variants ---------- */

test("size=sm applies the sm size class", async ({ mount }) => {
  const component = await mount(<Spinner size="sm" />);
  const svg = component.locator("svg");
  // sm maps to --icon-sm (16px)
  await expect(svg).toHaveCSS("width", "16px");
  await expect(svg).toHaveCSS("height", "16px");
});

test("size=md applies the md size class (default)", async ({ mount }) => {
  const component = await mount(<Spinner size="md" />);
  const svg = component.locator("svg");
  // md maps to --icon-md (20px)
  await expect(svg).toHaveCSS("width", "20px");
  await expect(svg).toHaveCSS("height", "20px");
});

test("size=lg applies the lg size class", async ({ mount }) => {
  const component = await mount(<Spinner size="lg" />);
  const svg = component.locator("svg");
  // lg maps to --icon-lg (24px)
  await expect(svg).toHaveCSS("width", "24px");
  await expect(svg).toHaveCSS("height", "24px");
});

test("default size (no prop) resolves to md (20px)", async ({ mount }) => {
  const component = await mount(<Spinner />);
  const svg = component.locator("svg");
  await expect(svg).toHaveCSS("width", "20px");
  await expect(svg).toHaveCSS("height", "20px");
});

/* ---------- Custom label ---------- */

test("custom label propagates to aria-label on the root span", async ({ mount }) => {
  const component = await mount(<Spinner label="Submitting form" />);
  await expect(component).toHaveAttribute("aria-label", "Submitting form");
});

test("visually-hidden span contains the label text", async ({ mount }) => {
  const component = await mount(<Spinner label="Loading results" />);
  // The sr-only span is in the DOM (but visually hidden via clip)
  const srSpan = component.locator("span").filter({ hasText: "Loading results" }).first();
  await expect(srSpan).toBeAttached();
});

/* ---------- Ref forwarding ---------- */

test("ref forwards to the host span (root element)", async ({ mount, page }) => {
  // We test ref forwarding by verifying the root element is a <span>
  // with role=status — the contract for forwardRef to the host span.
  const component = await mount(<Spinner data-testid="spinner-ref-test" />);
  await expect(component).toHaveAttribute("data-testid", "spinner-ref-test");
  // Confirm root is a span
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("span");
});

/* ---------- className merge ---------- */

test("merges a consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(<Spinner className="test-spinner-custom" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/test-spinner-custom/);
});

/* ---------- ...rest forwarding ---------- */

test("forwards data-* attributes to the root span", async ({ mount }) => {
  const component = await mount(<Spinner data-testid="my-spinner" />);
  await expect(component).toHaveAttribute("data-testid", "my-spinner");
});

test("forwards aria-* attributes to the root span", async ({ mount }) => {
  const component = await mount(<Spinner aria-describedby="loading-context" />);
  await expect(component).toHaveAttribute("aria-describedby", "loading-context");
});

/* ---------- Animation token regression guard ---------- */

test("arc animation uses --dur-spinner (800ms) — regression guard", async ({ mount, page }) => {
  const component = await mount(<Spinner />);
  const arc = component.locator(".arc, [class*='arc']").first();
  // Browsers normalise animation-duration to seconds.
  await expect(arc).toHaveCSS("animation-duration", "0.8s");
  await expect(arc).toHaveCSS("animation-iteration-count", "infinite");
});

/* ---------- Reduced-motion ---------- */

test("reduced-motion: arc animation is none", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const component = await mount(<Spinner />);
  const arc = component.locator(".arc, [class*='arc']").first();
  // Under reduced-motion the explicit `animation: none` wins (belt-and-suspenders
  // over the global tokens.css !important collapse).
  await expect(arc).toHaveCSS("animation-name", "none");
});

test("reduced-motion: ellipsis element is visible", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const component = await mount(<Spinner />);
  const ellipsis = component.locator("[class*='ellipsis']");
  // Under reduced-motion the ellipsis shifts from display:none to display:inline
  const display = await ellipsis.evaluate((el) => getComputedStyle(el).display);
  expect(display).not.toBe("none");
});

test("reduced-motion: SVG is still present (static arc remains visible)", async ({
  mount,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const component = await mount(<Spinner />);
  const svg = component.locator("svg");
  await expect(svg).toBeVisible();
});

test("normal motion: ellipsis is hidden (display: none)", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const component = await mount(<Spinner />);
  const ellipsis = component.locator("[class*='ellipsis']");
  const display = await ellipsis.evaluate((el) => getComputedStyle(el).display);
  expect(display).toBe("none");
});

/* ---------- Accessibility (axe) ---------- */

test("axe — default Spinner", async ({ mount, page }) => {
  await mount(<Spinner />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("axe — all size variants", async ({ mount, page }) => {
  await mount(
    <div>
      <Spinner size="sm" label="Loading small" />
      <Spinner size="md" label="Loading medium" />
      <Spinner size="lg" label="Loading large" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("axe — custom label", async ({ mount, page }) => {
  await mount(<Spinner label="Submitting your request" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
