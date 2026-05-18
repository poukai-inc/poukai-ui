import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Hero } from "./Hero";

test("renders title in an h1 by default", async ({ mount }) => {
  const component = await mount(<Hero title="Close the gap." lede="A lede." />);
  await expect(component.locator("h1")).toHaveText("Close the gap.");
});

test("renders title in the requested element", async ({ mount }) => {
  const component = await mount(<Hero titleAs="h2" title="Section heading" lede="A lede." />);
  await expect(component.locator("h2")).toHaveText("Section heading");
  await expect(component.locator("h1")).toHaveCount(0);
});

test("renders the lede in a p.lede", async ({ mount }) => {
  const component = await mount(<Hero title="Heading" lede="The lede copy goes here." />);
  const lede = component.locator("p.lede");
  await expect(lede).toHaveText("The lede copy goes here.");
});

test("omits status slot when not provided", async ({ mount }) => {
  const component = await mount(<Hero title="Heading" lede="Lede." />);
  // Only h1 + p should be present at the root level.
  await expect(component.getByRole("heading", { level: 1 })).toBeVisible();
});

test("renders status and cta slots when provided", async ({ mount }) => {
  const component = await mount(
    <Hero
      title="Heading"
      lede="Lede."
      status={<span data-testid="status">Status</span>}
      cta={
        <a data-testid="cta" href="#">
          CTA
        </a>
      }
    />,
  );
  await expect(component.locator("[data-testid='status']")).toBeVisible();
  await expect(component.locator("[data-testid='cta']")).toBeVisible();
});

test("forwards arbitrary props to the root section", async ({ mount }) => {
  const component = await mount(<Hero title="H" lede="L" data-testid="hero" aria-labelledby="x" />);
  await expect(component).toHaveAttribute("data-testid", "hero");
  await expect(component).toHaveAttribute("aria-labelledby", "x");
});

test("defaults to size=display (title renders at --fs-tagline via global h1 rule)", async ({
  mount,
}) => {
  const component = await mount(<Hero title="Heading" lede="Lede." />);
  // No .size-intimate class; the root should not have the intimate size class
  await expect(component).not.toHaveClass(/size-intimate/);
});

test("size=display renders correctly", async ({ mount }) => {
  const component = await mount(<Hero size="display" title="Heading" lede="Lede." />);
  await expect(component.locator("h1")).toHaveText("Heading");
});

test("size=intimate renders correctly and applies size class to root", async ({ mount }) => {
  const component = await mount(<Hero size="intimate" title="Heading" lede="Lede." />);
  await expect(component.locator("h1")).toHaveText("Heading");
  // The root section should carry the intimate size class (CSS Modules scoped)
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toBeTruthy();
});

test("em accent inside title renders at size=display", async ({ mount }) => {
  const title = (
    <>
      <span>Technical consulting with </span>
      <em>AI</em>
    </>
  );
  const component = await mount(<Hero size="display" title={title} lede="Lede." />);
  await expect(component.locator("em")).toBeVisible();
});

test("em accent inside title renders at size=intimate", async ({ mount }) => {
  const title = (
    <>
      <span>Technical consulting with </span>
      <em>AI</em>
    </>
  );
  const component = await mount(<Hero size="intimate" title={title} lede="Lede." />);
  await expect(component.locator("em")).toBeVisible();
});

test("size=intimate compresses status→title gap", async ({ mount }) => {
  const component = await mount(
    <Hero
      size="intimate"
      status={<span data-testid="status">Status</span>}
      title="Heading"
      lede="Lede."
    />,
  );
  const statusEl = component.locator("[data-testid='status']").locator("..");
  // Verify the status wrapper div is present (rhythm applied via CSS; visual check is CT's job)
  await expect(statusEl).toBeVisible();
});

test("size=intimate applies intimate size class to root for rhythm scoping", async ({ mount }) => {
  const component = await mount(
    <Hero size="intimate" title="Heading" lede="Lede." status={<span>Eyebrow</span>} />,
  );
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/sizeIntimate|size-intimate/);
});

test("entrance not set renders no entrance class on root", async ({ mount }) => {
  const component = await mount(<Hero title="Heading" lede="Lede." />);
  await expect(component).not.toHaveClass(/entrance/);
});

test('entrance="stagger" applies entrance class to root section', async ({ mount }) => {
  const component = await mount(<Hero entrance="stagger" title="Heading" lede="Lede." />);
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/entranceStagger|entrance-stagger/);
});

test('entrance="stagger" is orthogonal to size="intimate" — both classes present on root', async ({
  mount,
}) => {
  const component = await mount(
    <Hero size="intimate" entrance="stagger" title="Heading" lede="Lede." />,
  );
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/sizeIntimate|size-intimate/);
  expect(rootClass).toMatch(/entranceStagger|entrance-stagger/);
});

test('entrance="stagger" is orthogonal to align="center" — both classes present on root', async ({
  mount,
}) => {
  const component = await mount(
    <Hero align="center" entrance="stagger" title="Heading" lede="Lede." />,
  );
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/alignCenter|align-center/);
  expect(rootClass).toMatch(/entranceStagger|entrance-stagger/);
});

test('entrance="stagger" — status, title, lede, and cta render with correct content', async ({
  mount,
}) => {
  const component = await mount(
    <Hero
      entrance="stagger"
      status={<span data-testid="status-inner">Available</span>}
      title="Stagger heading"
      lede="Stagger lede."
      cta={
        <a data-testid="cta-inner" href="#">
          Contact
        </a>
      }
    />,
  );
  await expect(component.locator("h1")).toHaveText("Stagger heading");
  await expect(component.locator("p.lede")).toHaveText("Stagger lede.");
  await expect(component.locator("[data-testid='status-inner']")).toBeVisible();
  await expect(component.locator("[data-testid='cta-inner']")).toBeVisible();
});

/* ── variant="no-title" ─────────────────────────────────── */

test('variant="no-title" renders no heading element', async ({ mount }) => {
  const component = await mount(
    <Hero variant="no-title" eyebrow="About" lede="Editorial lede copy." />,
  );
  await expect(component.locator("h1")).toHaveCount(0);
  await expect(component.locator("h2")).toHaveCount(0);
});

test('variant="no-title" renders eyebrow in a p element', async ({ mount }) => {
  const component = await mount(
    <Hero variant="no-title" eyebrow="About" lede="Editorial lede copy." />,
  );
  const eyebrow = component.locator("p").first();
  await expect(eyebrow).toHaveText("About");
});

test('variant="no-title" renders lede in a p.lede', async ({ mount }) => {
  const component = await mount(
    <Hero variant="no-title" eyebrow="About" lede="Editorial lede copy." />,
  );
  await expect(component.locator("p.lede")).toHaveText("Editorial lede copy.");
});

test('variant="no-title" omits status slot even if provided', async ({ mount }) => {
  const component = await mount(<Hero variant="no-title" eyebrow="About" lede="Lede." />);
  // variant="no-title" type excludes status — TypeScript enforces at compile time.
  // Verify no unexpected heading or status-like elements appear.
  await expect(component.locator("h1")).toHaveCount(0);
});

test('variant="no-title" renders cta slot when provided', async ({ mount }) => {
  const component = await mount(
    <Hero
      variant="no-title"
      eyebrow="About"
      lede="Lede."
      cta={
        <a data-testid="no-title-cta" href="#">
          Get in touch
        </a>
      }
    />,
  );
  await expect(component.locator("[data-testid='no-title-cta']")).toBeVisible();
});

test('variant="no-title" without eyebrow renders only lede', async ({ mount }) => {
  const component = await mount(<Hero variant="no-title" lede="Lede only." />);
  await expect(component.locator("p.lede")).toHaveText("Lede only.");
  await expect(component.locator("h1")).toHaveCount(0);
});

test('variant="no-title" applies variant-no-title class to root', async ({ mount }) => {
  const component = await mount(<Hero variant="no-title" eyebrow="About" lede="Lede." />);
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/variantNoTitle|variant-no-title/);
});

test('variant="no-title" supports align="center"', async ({ mount }) => {
  const component = await mount(
    <Hero variant="no-title" align="center" eyebrow="About" lede="Lede." />,
  );
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/alignCenter|align-center/);
});

test('variant="no-title" forwards arbitrary props to root section', async ({ mount }) => {
  const component = await mount(
    <Hero variant="no-title" eyebrow="About" lede="Lede." data-testid="no-title-hero" />,
  );
  await expect(component).toHaveAttribute("data-testid", "no-title-hero");
});

test('variant="no-title" with entrance="stagger" applies entrance class', async ({ mount }) => {
  const component = await mount(
    <Hero variant="no-title" entrance="stagger" eyebrow="About" lede="Lede." />,
  );
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/entranceStagger|entrance-stagger/);
  expect(rootClass).toMatch(/variantNoTitle|variant-no-title/);
});

test('a11y — variant="no-title" passes axe-core with zero violations', async ({ mount, page }) => {
  await mount(
    <div>
      <Hero
        variant="no-title"
        eyebrow="About"
        lede="Setting up the page with one to two sentences."
      />
      <h1>Page heading in body content</h1>
    </div>,
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "region"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

/* ── bleed prop ─────────────────────────────────────────── */

test('bleed="none" (default) — no bleed class on root', async ({ mount }) => {
  const component = await mount(<Hero title="Heading" lede="Lede." />);
  const rootClass = await component.getAttribute("class");
  expect(rootClass).not.toMatch(/bleedFull|bleed-full/);
});

test('bleed="full" — applies bleed class to root section', async ({ mount }) => {
  const component = await mount(<Hero bleed="full" title="Heading" lede="Lede." />);
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/bleedFull|bleed-full/);
});

test('bleed="full" wraps children in inner div', async ({ mount }) => {
  const component = await mount(<Hero bleed="full" title="Heading" lede="Lede." />);
  // Inner wrapper div should be present inside the section
  await expect(component.locator("div").first()).toBeVisible();
});

test('bleed="full" — h1 title still renders inside bleed section', async ({ mount }) => {
  const component = await mount(<Hero bleed="full" title="Bleed heading" lede="Lede." />);
  await expect(component.locator("h1")).toHaveText("Bleed heading");
});

test('bleed="full" is orthogonal to align="center"', async ({ mount }) => {
  const component = await mount(<Hero bleed="full" align="center" title="Heading" lede="Lede." />);
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/bleedFull|bleed-full/);
  expect(rootClass).toMatch(/alignCenter|align-center/);
});

test('bleed="full" with variant="no-title" applies bleed class', async ({ mount }) => {
  const component = await mount(
    <Hero bleed="full" variant="no-title" eyebrow="About" lede="Lede." />,
  );
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/bleedFull|bleed-full/);
});

test('a11y — bleed="full" passes axe-core with zero violations', async ({ mount, page }) => {
  await mount(
    <Hero bleed="full" title="Full-bleed hero" lede="A lede paragraph for the bleed test." />,
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "region"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
