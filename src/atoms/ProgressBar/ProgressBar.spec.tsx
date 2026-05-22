import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { ProgressBar } from "./ProgressBar";

/* ============================================================
   Helpers
   ============================================================ */

const AXE_ISOLATED = ["landmark-one-main", "page-has-heading-one", "region"] as const;

/* ============================================================
   ARIA — determinate
   ============================================================ */

test("determinate: aria-valuenow equals clamped value", async ({ mount }) => {
  const component = await mount(<ProgressBar value={60} aria-label="Upload progress" />);
  await expect(component).toHaveAttribute("aria-valuenow", "60");
});

test("determinate: aria-valuenow clamps value=-10 to 0", async ({ mount }) => {
  const component = await mount(<ProgressBar value={-10} aria-label="Clamped negative" />);
  await expect(component).toHaveAttribute("aria-valuenow", "0");
});

test("determinate: aria-valuenow clamps value=150 to 100", async ({ mount }) => {
  const component = await mount(<ProgressBar value={150} aria-label="Clamped over-range" />);
  await expect(component).toHaveAttribute("aria-valuenow", "100");
});

test("determinate: aria-valuemin=0 and aria-valuemax=100 always present", async ({ mount }) => {
  const component = await mount(<ProgressBar value={50} aria-label="Min max check" />);
  await expect(component).toHaveAttribute("aria-valuemin", "0");
  await expect(component).toHaveAttribute("aria-valuemax", "100");
});

/* ============================================================
   ARIA — indeterminate
   ============================================================ */

test("indeterminate: aria-valuenow attribute is absent (not just empty)", async ({ mount }) => {
  const component = await mount(<ProgressBar aria-label="Loading results" />);
  // Attribute must not exist at all — not serialised as "undefined" or ""
  const attrValue = await component.getAttribute("aria-valuenow");
  expect(attrValue).toBeNull();
});

test("indeterminate: aria-valuemin and aria-valuemax still present", async ({ mount }) => {
  const component = await mount(<ProgressBar aria-label="Background sync" />);
  await expect(component).toHaveAttribute("aria-valuemin", "0");
  await expect(component).toHaveAttribute("aria-valuemax", "100");
});

/* ============================================================
   Tone — fill background-color
   ============================================================ */

test("tone=default: fill uses --fg color", async ({ mount }) => {
  const component = await mount(
    <div style={{ colorScheme: "light" }}>
      <ProgressBar value={50} tone="default" aria-label="Default tone" />
    </div>,
  );
  const fill = component.locator("[class*='fill']").first();
  const bg = await fill.evaluate((el) => getComputedStyle(el).backgroundColor);
  // --fg light: #1d1d1f → rgb(29, 29, 31)
  expect(bg).toBe("rgb(29, 29, 31)");
});

test("tone=success: fill uses --success color", async ({ mount }) => {
  const component = await mount(
    <div style={{ colorScheme: "light" }}>
      <ProgressBar value={50} tone="success" aria-label="Success tone" />
    </div>,
  );
  const fill = component.locator("[class*='fill']").first();
  const bg = await fill.evaluate((el) => getComputedStyle(el).backgroundColor);
  // --success light: #248a3d → rgb(36, 138, 61)
  expect(bg).toBe("rgb(36, 138, 61)");
});

test("tone=warning: fill uses --warning color", async ({ mount }) => {
  const component = await mount(
    <div style={{ colorScheme: "light" }}>
      <ProgressBar value={50} tone="warning" aria-label="Warning tone" />
    </div>,
  );
  const fill = component.locator("[class*='fill']").first();
  const bg = await fill.evaluate((el) => getComputedStyle(el).backgroundColor);
  // --warning light: #b46100 → rgb(180, 97, 0)
  expect(bg).toBe("rgb(180, 97, 0)");
});

test("tone=danger: fill uses --danger color", async ({ mount }) => {
  const component = await mount(
    <div style={{ colorScheme: "light" }}>
      <ProgressBar value={50} tone="danger" aria-label="Danger tone" />
    </div>,
  );
  const fill = component.locator("[class*='fill']").first();
  const bg = await fill.evaluate((el) => getComputedStyle(el).backgroundColor);
  // --danger light: #b3261e → rgb(179, 38, 30)
  expect(bg).toBe("rgb(179, 38, 30)");
});

/* ============================================================
   Size — track height
   ============================================================ */

test("size=md: track height is 4px (default)", async ({ mount }) => {
  const component = await mount(<ProgressBar value={50} aria-label="Size md" />);
  const track = component.locator("[class*='track']").first();
  await expect(track).toHaveCSS("height", "4px");
});

test("size=sm: track height is 2px", async ({ mount }) => {
  const component = await mount(<ProgressBar value={50} size="sm" aria-label="Size sm" />);
  const track = component.locator("[class*='track']").first();
  await expect(track).toHaveCSS("height", "2px");
});

/* ============================================================
   Motion contract — determinate fill uses scaleX, not width
   ============================================================ */

test("determinate: fill transform is scaleX matching value/100", async ({ mount }) => {
  const component = await mount(<ProgressBar value={60} aria-label="Transform check" />);
  const fill = component.locator("[class*='fill']").first();
  const transform = await fill.evaluate((el) => getComputedStyle(el).transform);
  // scaleX(0.6) → matrix(0.6, 0, 0, 1, 0, 0)
  expect(transform).toContain("matrix(0.6");
});

test("determinate: fill has no inline width style (motion-contract regression guard)", async ({
  mount,
}) => {
  const component = await mount(<ProgressBar value={75} aria-label="No-width regression" />);
  const fill = component.locator("[class*='fill']").first();
  // Inline style must not contain width — only transform via CSS custom property
  const inlineStyle = await fill.getAttribute("style");
  expect(inlineStyle).not.toMatch(/\bwidth\b/);
});

test("determinate: fill at value=0 gives scaleX(0)", async ({ mount }) => {
  const component = await mount(<ProgressBar value={0} aria-label="Zero progress" />);
  const fill = component.locator("[class*='fill']").first();
  const transform = await fill.evaluate((el) => getComputedStyle(el).transform);
  // scaleX(0) → matrix(0, 0, 0, 1, 0, 0)
  expect(transform).toMatch(/matrix\(0[,\s]/);
});

test("determinate: fill at value=100 gives scaleX(1) or identity", async ({ mount }) => {
  const component = await mount(<ProgressBar value={100} aria-label="Full progress" />);
  const fill = component.locator("[class*='fill']").first();
  const transform = await fill.evaluate((el) => getComputedStyle(el).transform);
  // scaleX(1) → matrix(1, 0, 0, 1, 0, 0) or "none"
  const isIdentityOrScaleOne =
    transform === "none" || transform.startsWith("matrix(1,") || transform.startsWith("matrix(1 ");
  expect(isIdentityOrScaleOne).toBe(true);
});

/* ============================================================
   Animation token regression
   ============================================================ */

test("indeterminate bar1: animation-duration resolves to 1400ms", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const component = await mount(<ProgressBar aria-label="Animation token check" />);
  const bar1 = component.locator("[class*='bar1']").first();
  // Browsers normalise to seconds
  await expect(bar1).toHaveCSS("animation-duration", "1.4s");
});

test("indeterminate bar2: animation-duration resolves to 1400ms", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const component = await mount(<ProgressBar aria-label="Animation token check bar2" />);
  const bar2 = component.locator("[class*='bar2']").first();
  await expect(bar2).toHaveCSS("animation-duration", "1.4s");
});

test("indeterminate bars: animation-iteration-count is infinite", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const component = await mount(<ProgressBar aria-label="Animation infinite check" />);
  const bar1 = component.locator("[class*='bar1']").first();
  await expect(bar1).toHaveCSS("animation-iteration-count", "infinite");
});

/* ============================================================
   Reduced-motion — indeterminate static fallback
   ============================================================ */

test("reduced-motion indeterminate: bar1 and bar2 have animation-name none", async ({
  mount,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const component = await mount(<ProgressBar aria-label="Reduced motion bars" />);
  const bar1 = component.locator("[class*='bar1']").first();
  const bar2 = component.locator("[class*='bar2']").first();
  await expect(bar1).toHaveCSS("animation-name", "none");
  await expect(bar2).toHaveCSS("animation-name", "none");
});

test("reduced-motion indeterminate: animated bars are hidden (display none)", async ({
  mount,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const component = await mount(<ProgressBar aria-label="Reduced motion hidden bars" />);
  const bar1 = component.locator("[class*='bar1']").first();
  const bar2 = component.locator("[class*='bar2']").first();
  const d1 = await bar1.evaluate((el) => getComputedStyle(el).display);
  const d2 = await bar2.evaluate((el) => getComputedStyle(el).display);
  expect(d1).toBe("none");
  expect(d2).toBe("none");
});

test("reduced-motion indeterminate: staticFill is displayed (not none)", async ({
  mount,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const component = await mount(<ProgressBar aria-label="Reduced motion static fill" />);
  const staticFill = component.locator("[class*='staticFill']").first();
  const display = await staticFill.evaluate((el) => getComputedStyle(el).display);
  expect(display).not.toBe("none");
});

test("reduced-motion indeterminate: staticFill transform is scaleX(0.5)", async ({
  mount,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const component = await mount(<ProgressBar aria-label="Reduced motion scale check" />);
  const staticFill = component.locator("[class*='staticFill']").first();
  const transform = await staticFill.evaluate((el) => getComputedStyle(el).transform);
  // scaleX(0.5) → matrix(0.5, 0, 0, 1, 0, 0)
  expect(transform).toContain("matrix(0.5");
});

test("reduced-motion determinate: fill transition is none (snap)", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const component = await mount(<ProgressBar value={75} aria-label="Reduced motion determinate" />);
  const fill = component.locator("[class*='fill']").first();
  await expect(fill).toHaveCSS("transition-duration", "0s");
});

/* ============================================================
   Normal motion — indeterminate animated bars are visible
   ============================================================ */

test("normal motion: bar1 and bar2 are not display:none", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const component = await mount(<ProgressBar aria-label="Normal motion bars visible" />);
  const bar1 = component.locator("[class*='bar1']").first();
  const bar2 = component.locator("[class*='bar2']").first();
  const d1 = await bar1.evaluate((el) => getComputedStyle(el).display);
  const d2 = await bar2.evaluate((el) => getComputedStyle(el).display);
  expect(d1).not.toBe("none");
  expect(d2).not.toBe("none");
});

test("normal motion: staticFill is display:none", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const component = await mount(<ProgressBar aria-label="Normal motion static hidden" />);
  const staticFill = component.locator("[class*='staticFill']").first();
  const display = await staticFill.evaluate((el) => getComputedStyle(el).display);
  expect(display).toBe("none");
});

/* ============================================================
   Ref forwarding
   ============================================================ */

test("ref forwards to the root div (instanceof HTMLDivElement)", async ({ mount }) => {
  const component = await mount(
    <ProgressBar value={50} aria-label="Ref test" data-testid="pb-ref" />,
  );
  await expect(component).toHaveAttribute("data-testid", "pb-ref");
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

/* ============================================================
   Rest prop forwarding
   ============================================================ */

test("forwards data-* attributes to the root div", async ({ mount }) => {
  const component = await mount(
    <ProgressBar value={50} aria-label="Rest props" data-testid="my-progress" />,
  );
  await expect(component).toHaveAttribute("data-testid", "my-progress");
});

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(
    <ProgressBar value={50} aria-label="Class merge" className="custom-class" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-class/);
});

/* ============================================================
   Labeling
   ============================================================ */

test("aria-label propagates to root div", async ({ mount }) => {
  const component = await mount(<ProgressBar value={30} aria-label="Uploading report" />);
  await expect(component).toHaveAttribute("aria-label", "Uploading report");
});

test("aria-labelledby propagates to root div", async ({ mount }) => {
  const component = await mount(
    <div>
      <p id="pb-label-test">Step 2 of 4</p>
      <ProgressBar value={50} aria-labelledby="pb-label-test" />
    </div>,
  );
  const pb = component.locator("[role='progressbar']");
  await expect(pb).toHaveAttribute("aria-labelledby", "pb-label-test");
});

/* ============================================================
   Accessibility (axe)
   ============================================================ */

test("axe — determinate with aria-label", async ({ mount, page }) => {
  await mount(<ProgressBar value={60} aria-label="Uploading report" />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("axe — determinate with aria-labelledby", async ({ mount, page }) => {
  await mount(
    <div>
      <p id="pb-axe-label">Generating AI response</p>
      <ProgressBar value={42} aria-labelledby="pb-axe-label" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("axe — indeterminate with aria-label", async ({ mount, page }) => {
  await mount(<ProgressBar aria-label="Generating response" />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("axe — indeterminate with aria-labelledby", async ({ mount, page }) => {
  await mount(
    <div>
      <p id="pb-axe-indet-label">Loading results</p>
      <ProgressBar aria-labelledby="pb-axe-indet-label" />
    </div>,
  );
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("axe — reduced-motion indeterminate", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mount(<ProgressBar aria-label="Reduced motion a11y check" />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
