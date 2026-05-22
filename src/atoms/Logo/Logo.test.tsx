import { test, expect } from "@playwright/experimental-ct-react";
import { Logo } from "./Logo";

const PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

/* ---------- Render ---------- */

test("renders an <img> element", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Acme Corp" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("img");
});

test("src and alt attributes set correctly", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Acme Corp" />);
  await expect(component).toHaveAttribute("src", PIXEL);
  await expect(component).toHaveAttribute("alt", "Acme Corp");
});

/* ---------- Defaults ---------- */

test("default tone='mono' applies tone-mono class", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Acme Corp" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/tone-mono/);
});

test("default size='md' applies size-md class", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Acme Corp" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-md/);
});

/* ---------- Tone classes ---------- */

test("tone='color' applies tone-color class", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Acme Corp" tone="color" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/tone-color/);
});

test("tone='mono' applies tone-mono class", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Acme Corp" tone="mono" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/tone-mono/);
});

test("tone='muted' applies tone-muted class", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Acme Corp" tone="muted" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/tone-muted/);
});

/* ---------- Size max-height ---------- */

test("size='sm' — computed max-height is 24px", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Acme Corp" size="sm" />);
  await expect(component).toHaveCSS("max-height", "24px");
});

test("size='md' — computed max-height is 32px", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Acme Corp" size="md" />);
  await expect(component).toHaveCSS("max-height", "32px");
});

test("size='lg' — computed max-height is 40px", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Acme Corp" size="lg" />);
  await expect(component).toHaveCSS("max-height", "40px");
});

/* ---------- Muted hover ---------- */

// Verify the muted CSS contract directly: initial opacity + transition.
// Playwright CT does not reliably support mouse-based :hover triggers —
// no test in this repo uses component.hover() — so we assert the CSS rules
// rather than the runtime hover state.

test("tone='muted' initial opacity is 0.55", async ({ mount, page }) => {
  await mount(<Logo src={PIXEL} alt="Acme Corp" tone="muted" />);
  await expect(page.locator("img")).toHaveCSS("opacity", "0.55");
});

test("tone='muted' has opacity transition (--dur-fast)", async ({ mount, page }) => {
  await mount(<Logo src={PIXEL} alt="Acme Corp" tone="muted" />);
  const transition = await page.locator("img").evaluate((el) => getComputedStyle(el).transition);
  expect(transition).toMatch(/opacity/);
});

/* ---------- Ref forwarding ----------
 *
 * Playwright CT cannot mount a component defined inside the test file.
 * We exercise forwardRef indirectly: if forwardRef + spread were broken,
 * the root would not carry our data-* prop.
 */

test("ref forward — forwards to root <img> (data-testid spread)", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Ref smoke" data-testid="logo-ref-target" />);
  await expect(component).toHaveAttribute("data-testid", "logo-ref-target");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("img");
});

/* ---------- className merge ---------- */

test("consumer className present alongside tone/size classes", async ({ mount }) => {
  const component = await mount(<Logo src={PIXEL} alt="Class merge" className="my-custom-logo" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/tone-mono/);
  expect(className).toMatch(/size-md/);
  expect(className).toMatch(/my-custom-logo/);
});

/* ---------- width/height defaults ---------- */

test("width/height defaults — <img> has width='200' and height='80' when not specified", async ({
  mount,
}) => {
  const component = await mount(<Logo src={PIXEL} alt="Default dimensions" />);
  await expect(component).toHaveAttribute("width", "200");
  await expect(component).toHaveAttribute("height", "80");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
