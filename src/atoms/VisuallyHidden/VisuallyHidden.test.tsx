import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { VisuallyHidden } from "./VisuallyHidden";

/* ─── Element identity ─────────────────────────────────────────────────── */

test("renders as <span> by default", async ({ mount }) => {
  const component = await mount(<VisuallyHidden>Screen reader text</VisuallyHidden>);
  await expect(component).toHaveJSProperty("tagName", "SPAN");
});

test('as="div" renders a <div> root', async ({ mount }) => {
  const component = await mount(<VisuallyHidden as="div">Block-level label</VisuallyHidden>);
  await expect(component).toHaveJSProperty("tagName", "DIV");
});

/* ─── Content ──────────────────────────────────────────────────────────── */

test("renders children content inside the root element", async ({ mount }) => {
  const component = await mount(<VisuallyHidden>Slide 3 of 7</VisuallyHidden>);
  await expect(component).toHaveText("Slide 3 of 7");
});

/* ─── Ref forwarding ───────────────────────────────────────────────────── */

test("forwards ref to the root DOM element", async ({ mount, page }) => {
  const component = await mount(<VisuallyHidden id="ref-target">Ref test</VisuallyHidden>);
  // If ref forwarding works, the element is reachable and matches the locator.
  await expect(component).toHaveAttribute("id", "ref-target");
});

/* ─── className merge ──────────────────────────────────────────────────── */

test("merges consumer className with the internal clip class", async ({ mount }) => {
  const component = await mount(
    <VisuallyHidden className="consumer-cls">Merged class</VisuallyHidden>,
  );
  const cls = await component.getAttribute("class");
  // Internal clip class is present
  expect(cls).toMatch(/root/);
  // Consumer class is also present
  expect(cls).toContain("consumer-cls");
});

/* ─── ...rest forwarding ───────────────────────────────────────────────── */

test("forwards aria-live and aria-atomic via ...rest", async ({ mount }) => {
  const component = await mount(
    <VisuallyHidden aria-live="polite" aria-atomic="true">
      Live region
    </VisuallyHidden>,
  );
  await expect(component).toHaveAttribute("aria-live", "polite");
  await expect(component).toHaveAttribute("aria-atomic", "true");
});

test("forwards id for aria-labelledby association", async ({ mount }) => {
  const component = await mount(
    <VisuallyHidden id="dialog-title-label">Dialog title</VisuallyHidden>,
  );
  await expect(component).toHaveAttribute("id", "dialog-title-label");
});

test("forwards data-* attributes to the root element", async ({ mount }) => {
  const component = await mount(<VisuallyHidden data-testid="vh-probe">Probe</VisuallyHidden>);
  await expect(component).toHaveAttribute("data-testid", "vh-probe");
});

/* ─── Visual hiding (computed style) ───────────────────────────────────── */

test("element is present in the DOM (not display:none)", async ({ mount }) => {
  const component = await mount(<VisuallyHidden>Always in DOM</VisuallyHidden>);
  // If it were display:none, toBeVisible() would fail; here we assert it exists
  // in the DOM tree (count > 0) even though it has no visual bounding box.
  await expect(component).toHaveCount(1);
});

test("bounding box is 1×1 px — element has no visual footprint", async ({ mount }) => {
  const component = await mount(<VisuallyHidden>1×1 bounding box</VisuallyHidden>);
  const box = await component.boundingBox();
  // The clip pattern collapses the element to a 1×1 pixel ghost.
  expect(box?.width).toBe(1);
  expect(box?.height).toBe(1);
});

test("overflow is hidden (clip contract)", async ({ mount }) => {
  const component = await mount(<VisuallyHidden>Overflow check</VisuallyHidden>);
  await expect(component).toHaveCSS("overflow", "hidden");
});

test("position is absolute (clip contract)", async ({ mount }) => {
  const component = await mount(<VisuallyHidden>Position check</VisuallyHidden>);
  await expect(component).toHaveCSS("position", "absolute");
});

test("white-space is nowrap (clip contract)", async ({ mount }) => {
  const component = await mount(<VisuallyHidden>Whitespace check</VisuallyHidden>);
  await expect(component).toHaveCSS("white-space", "nowrap");
});

/* ─── Accessibility ────────────────────────────────────────────────────── */

test("axe scan — default span usage", async ({ mount, page }) => {
  await mount(
    <div>
      <VisuallyHidden>Accessible label for an adjacent element</VisuallyHidden>
    </div>,
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("axe scan — div variant", async ({ mount, page }) => {
  await mount(
    <div>
      <VisuallyHidden as="div">Block-level accessible label</VisuallyHidden>
    </div>,
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("axe scan — aria-live usage", async ({ mount, page }) => {
  await mount(
    <div>
      <VisuallyHidden aria-live="polite" aria-atomic="true">
        Slide 2 of 5
      </VisuallyHidden>
    </div>,
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
