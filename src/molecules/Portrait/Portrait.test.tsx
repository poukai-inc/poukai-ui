import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Portrait } from "./Portrait";

const VALID_SRC = "https://picsum.photos/seed/portrait/1800/2400";
const VALID_ALT = "Arian Becker, founder of Poukai — headshot in natural light";

test("renders picture root element", async ({ mount }) => {
  const component = await mount(
    <Portrait src={VALID_SRC} alt={VALID_ALT} aspect="3:4" width={1800} />,
  );
  await expect(component).toBeVisible();
  // The root is a picture element — Playwright locates it as the mounted element
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("picture");
});

test("renders AVIF source with correct type", async ({ mount }) => {
  const component = await mount(
    <Portrait src={VALID_SRC} alt={VALID_ALT} aspect="3:4" width={1800} />,
  );
  const avifSource = component.locator('source[type="image/avif"]');
  await expect(avifSource).toHaveCount(1);
});

test("renders WebP source with correct type", async ({ mount }) => {
  const component = await mount(
    <Portrait src={VALID_SRC} alt={VALID_ALT} aspect="3:4" width={1800} />,
  );
  const webpSource = component.locator('source[type="image/webp"]');
  await expect(webpSource).toHaveCount(1);
});

test("img has correct alt, width, and height attributes", async ({ mount }) => {
  const component = await mount(
    <Portrait src={VALID_SRC} alt={VALID_ALT} aspect="3:4" width={1800} />,
  );
  const img = component.locator("img");
  await expect(img).toHaveAttribute("alt", VALID_ALT);
  await expect(img).toHaveAttribute("width", "1800");
  await expect(img).toHaveAttribute("height", "2400");
});

test("computed height for aspect 3:4 and width 1800 equals 2400", async ({ mount }) => {
  const component = await mount(
    <Portrait src={VALID_SRC} alt={VALID_ALT} aspect="3:4" width={1800} />,
  );
  const img = component.locator("img");
  const height = await img.getAttribute("height");
  expect(Number(height)).toBe(2400);
});

test("AVIF srcset contains the four expected breakpoint widths", async ({ mount }) => {
  const component = await mount(
    <Portrait src={VALID_SRC} alt={VALID_ALT} aspect="3:4" width={1800} />,
  );
  const avifSource = component.locator('source[type="image/avif"]');
  const srcset = await avifSource.getAttribute("srcSet");
  expect(srcset).toContain("?w=1800");
  expect(srcset).toContain("?w=1200");
  expect(srcset).toContain("?w=768");
  expect(srcset).toContain("?w=480");
});

test("loading and fetchpriority attributes are set correctly on img", async ({ mount }) => {
  const component = await mount(
    <Portrait
      src={VALID_SRC}
      alt={VALID_ALT}
      aspect="3:4"
      width={1800}
      loading="eager"
      fetchPriority="high"
    />,
  );
  const img = component.locator("img");
  await expect(img).toHaveAttribute("loading", "eager");
  await expect(img).toHaveAttribute("fetchpriority", "high");
});

test("dev-mode throws on empty alt — guard actually fires", async ({ mount }) => {
  // playwright-ct.config.ts sets `define: { "import.meta.env.DEV": "true" }` so
  // the guard executes in CT builds. This test confirms the throw path is active:
  // mounting with alt="" must reject. If the guard is removed this test will fail
  // because mount() will resolve instead of rejecting.
  await expect(
    mount(<Portrait src={VALID_SRC} alt="" aspect="3:4" width={1800} />),
  ).rejects.toThrow();
});

test("sizes prop flows through to both source elements", async ({ mount }) => {
  const component = await mount(
    <Portrait
      src={VALID_SRC}
      alt={VALID_ALT}
      aspect="3:4"
      width={1800}
      sizes="(max-width: 768px) 100vw, 50vw"
    />,
  );
  const avifSource = component.locator('source[type="image/avif"]');
  const webpSource = component.locator('source[type="image/webp"]');
  await expect(avifSource).toHaveAttribute("sizes", "(max-width: 768px) 100vw, 50vw");
  await expect(webpSource).toHaveAttribute("sizes", "(max-width: 768px) 100vw, 50vw");
});

test("objectPosition is reflected in img inline style", async ({ mount }) => {
  const component = await mount(
    <Portrait src={VALID_SRC} alt={VALID_ALT} aspect="3:4" width={1800} objectPosition="20% 30%" />,
  );
  const img = component.locator("img");
  // Use getAttribute('style') to check the literal inline style value before browser normalization.
  const style = await img.getAttribute("style");
  expect(style).toContain("20% 30%");
});

test("forwards arbitrary props to the picture root", async ({ mount }) => {
  const component = await mount(
    <Portrait src={VALID_SRC} alt={VALID_ALT} aspect="3:4" width={1800} data-testid="portrait" />,
  );
  await expect(component).toHaveAttribute("data-testid", "portrait");
});

test("accepts Astro ImageMetadata-shaped src object", async ({ mount }) => {
  const component = await mount(
    <Portrait
      src={{ src: VALID_SRC, width: 1800, height: 2400 }}
      alt={VALID_ALT}
      aspect="3:4"
      width={1800}
    />,
  );
  const img = component.locator("img");
  await expect(img).toHaveAttribute("src", VALID_SRC);
});

test("a11y — zero violations on EagerAboveFold variant", async ({ mount, page }) => {
  await mount(
    <Portrait
      src={VALID_SRC}
      alt={VALID_ALT}
      aspect="3:4"
      width={1800}
      loading="eager"
      fetchPriority="high"
    />,
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
