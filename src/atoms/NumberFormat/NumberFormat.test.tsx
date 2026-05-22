import { test, expect, type Page } from "@playwright/experimental-ct-react";
import { NumberFormat } from "./NumberFormat";

/**
 * Compute the expected Intl output inside the browser page context. This
 * sidesteps cross-engine ICU drift between Node (test runner) and the
 * browser runtimes (Chromium / Firefox / WebKit) — e.g. WebKit emits `¥`
 * for `ja-JP` JPY where Node emits `￥`. Both are valid; the test must
 * compare against whatever the same engine that renders the component
 * computes.
 */
async function intlFormat(
  page: Page,
  value: number,
  locale: string | string[] | undefined,
  options: Intl.NumberFormatOptions,
): Promise<string> {
  return page.evaluate(
    ({ value, locale, options }) => new Intl.NumberFormat(locale, options).format(value),
    { value, locale, options },
  );
}

/* ------------------------------------------------------------------ */
/* Intl output parity (computed inside the browser runtime)            */
/* ------------------------------------------------------------------ */

test("standard notation matches Intl output (en-US integer)", async ({ mount, page }) => {
  const expected = await intlFormat(page, 1_234_567, "en-US", {});
  const component = await mount(<NumberFormat value={1_234_567} locale="en-US" />);
  await expect(component).toContainText(expected);
});

test("compact notation matches Intl output", async ({ mount, page }) => {
  const expected = await intlFormat(page, 4_500_000, "en-US", { notation: "compact" });
  const component = await mount(
    <NumberFormat value={4_500_000} notation="compact" locale="en-US" />,
  );
  await expect(component).toContainText(expected);
});

test("currency USD matches Intl output", async ({ mount, page }) => {
  const expected = await intlFormat(page, 1_234.56, "en-US", {
    style: "currency",
    currency: "USD",
  });
  const component = await mount(
    <NumberFormat value={1_234.56} notation="currency" currency="USD" locale="en-US" />,
  );
  await expect(component).toContainText(expected);
});

test("currency EUR en-US matches Intl output", async ({ mount, page }) => {
  const expected = await intlFormat(page, 1_234.56, "en-US", {
    style: "currency",
    currency: "EUR",
  });
  const component = await mount(
    <NumberFormat value={1_234.56} notation="currency" currency="EUR" locale="en-US" />,
  );
  await expect(component).toContainText(expected);
});

test("currency JPY matches Intl output (zero fraction digits)", async ({ mount, page }) => {
  const expected = await intlFormat(page, 1_234, "ja-JP", {
    style: "currency",
    currency: "JPY",
  });
  const component = await mount(
    <NumberFormat value={1_234} notation="currency" currency="JPY" locale="ja-JP" />,
  );
  await expect(component).toContainText(expected);
});

test("percent notation matches Intl output", async ({ mount, page }) => {
  const expected = await intlFormat(page, 0.42, "en-US", { style: "percent" });
  const component = await mount(<NumberFormat value={0.42} notation="percent" locale="en-US" />);
  await expect(component).toContainText(expected);
});

/* ------------------------------------------------------------------ */
/* Root element / polymorphism                                         */
/* ------------------------------------------------------------------ */

test('as="span" (default) renders a <span>', async ({ mount }) => {
  const component = await mount(<NumberFormat value={42} locale="en-US" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("span");
});

test('as="span" explicit renders a <span>', async ({ mount }) => {
  const component = await mount(<NumberFormat value={42} as="span" locale="en-US" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("span");
});

test('as="div" renders a <div>', async ({ mount }) => {
  const component = await mount(<NumberFormat value={42} as="div" locale="en-US" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test('as="dd" renders a <dd>', async ({ mount }) => {
  const component = await mount(
    <dl>
      <dt>Count</dt>
      <NumberFormat as="dd" value={42} locale="en-US" />
    </dl>,
  );
  const dd = component.locator("dd");
  const tag = await dd.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("dd");
});

/* ------------------------------------------------------------------ */
/* currency ignored outside notation="currency"                       */
/* ------------------------------------------------------------------ */

test("currency prop is ignored when notation is standard", async ({ mount, page }) => {
  const expected = await intlFormat(page, 1_234, "en-US", {});
  const component = await mount(
    <NumberFormat value={1_234} notation="standard" currency="USD" locale="en-US" />,
  );
  await expect(component).toContainText(expected);
  const text = await component.innerText();
  expect(text).not.toMatch(/\$|USD/);
});

/* ------------------------------------------------------------------ */
/* locale prop changes output                                          */
/* ------------------------------------------------------------------ */

test("de-DE locale formats 1234.5 with German separators", async ({ mount, page }) => {
  const expected = await intlFormat(page, 1234.5, "de-DE", {});
  const component = await mount(<NumberFormat value={1234.5} locale="de-DE" />);
  await expect(component).toContainText(expected);
});

/* ------------------------------------------------------------------ */
/* minimumFractionDigits / maximumFractionDigits passthrough          */
/* ------------------------------------------------------------------ */

test("minimumFractionDigits pads fraction digits", async ({ mount, page }) => {
  const expected = await intlFormat(page, 1.5, "en-US", { minimumFractionDigits: 3 });
  const component = await mount(
    <NumberFormat value={1.5} locale="en-US" minimumFractionDigits={3} />,
  );
  await expect(component).toContainText(expected);
});

test("maximumFractionDigits clamps fraction digits", async ({ mount, page }) => {
  const expected = await intlFormat(page, 3.14159, "en-US", { maximumFractionDigits: 2 });
  const component = await mount(
    <NumberFormat value={3.14159} locale="en-US" maximumFractionDigits={2} />,
  );
  await expect(component).toContainText(expected);
});

/* ------------------------------------------------------------------ */
/* Ref forwarding / tagName                                            */
/* ------------------------------------------------------------------ */

test("forwards data-testid and renders span by default", async ({ mount }) => {
  const component = await mount(<NumberFormat value={42} locale="en-US" data-testid="nf-span" />);
  await expect(component).toHaveAttribute("data-testid", "nf-span");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("span");
});

test("forwards data-testid and renders div for as='div'", async ({ mount }) => {
  const component = await mount(
    <NumberFormat value={42} as="div" locale="en-US" data-testid="nf-div" />,
  );
  await expect(component).toHaveAttribute("data-testid", "nf-div");
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ------------------------------------------------------------------ */
/* className forwarding                                                */
/* ------------------------------------------------------------------ */

test("forwards consumer className to root element", async ({ mount }) => {
  const component = await mount(
    <NumberFormat value={42} locale="en-US" className="custom-class" />,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toContain("custom-class");
});

/* ------------------------------------------------------------------ */
/* data-* / aria-* / id forwarding                                    */
/* ------------------------------------------------------------------ */

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <NumberFormat value={42} locale="en-US" data-testid="nf-test" data-context="stat" />,
  );
  await expect(component).toHaveAttribute("data-testid", "nf-test");
  await expect(component).toHaveAttribute("data-context", "stat");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <NumberFormat value={42} locale="en-US" aria-label="Total users" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Total users");
});

test("forwards id to root element", async ({ mount }) => {
  const component = await mount(<NumberFormat value={42} locale="en-US" id="nf-id" />);
  await expect(component).toHaveAttribute("id", "nf-id");
});

/* ------------------------------------------------------------------ */
/* Edge values — assert against Intl in-browser                       */
/* ------------------------------------------------------------------ */

test("NaN renders as Intl.NumberFormat().format(NaN)", async ({ mount, page }) => {
  const expected = await intlFormat(page, NaN, "en-US", {});
  const component = await mount(<NumberFormat value={NaN} locale="en-US" />);
  await expect(component).toContainText(expected);
});

test("Infinity renders as Intl.NumberFormat().format(Infinity)", async ({ mount, page }) => {
  const expected = await intlFormat(page, Infinity, "en-US", {});
  const component = await mount(<NumberFormat value={Infinity} locale="en-US" />);
  await expect(component).toContainText(expected);
});

test("-Infinity renders as Intl.NumberFormat().format(-Infinity)", async ({ mount, page }) => {
  const expected = await intlFormat(page, -Infinity, "en-US", {});
  const component = await mount(<NumberFormat value={-Infinity} locale="en-US" />);
  await expect(component).toContainText(expected);
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
