import { test, expect } from "@playwright/experimental-ct-react";
import { Wordmark } from "./Wordmark";

// ---------------------------------------------------------------------------
// Bundled SVG path (no src prop) — existing contract, must stay byte-identical
// ---------------------------------------------------------------------------

test("renders with default height", async ({ mount }) => {
  const component = await mount(<Wordmark />);
  await expect(component.locator("svg")).toBeVisible();
  await expect(component.locator("svg")).toHaveAttribute("aria-hidden", "true");
});

test("respects custom height", async ({ mount }) => {
  const component = await mount(<Wordmark height={128} />);
  const svg = component.locator("svg");
  await expect(svg).toHaveCSS("height", "128px");
});

test("announces accessible label", async ({ mount }) => {
  const component = await mount(<Wordmark label="Poukai design" />);
  await expect(component.getByText("Poukai design")).toBeAttached();
});

test("inherits color via currentColor", async ({ mount }) => {
  const component = await mount(<Wordmark style={{ color: "rgb(255, 0, 0)" }} />);
  await expect(component.locator("svg")).toHaveCSS("fill", "rgb(255, 0, 0)");
});

test("renders inlined path geometry (no external symbol reference)", async ({ mount }) => {
  const component = await mount(<Wordmark />);
  // Geometry is inlined; at least one <path> must render. Catches the
  // previous regression where the component referenced an undefined
  // <symbol> via <use href="#…"/> and rendered empty.
  const paths = component.locator("svg path");
  await expect(paths.first()).toBeAttached();
  const count = await paths.count();
  if (count < 6) {
    throw new Error(
      `Expected the wordmark to render multiple paths (mark + letters), got ${count}.`,
    );
  }
});

// ---------------------------------------------------------------------------
// White-label path (src prop present)
// ---------------------------------------------------------------------------

test("renders img when src is a valid https URL", async ({ mount }) => {
  const component = await mount(
    <Wordmark height={48} label="Acme" src="https://example.com/logo.png" />,
  );
  // <img> must be present; no <svg> in this branch
  const img = component.locator("img");
  await expect(img).toBeAttached();
  await expect(img).toHaveAttribute("src", "https://example.com/logo.png");
  await expect(img).toHaveAttribute("alt", "Acme");
  await expect(img).toHaveAttribute("height", "48");
  await expect(img).toHaveAttribute("width", "auto");
  await expect(component.locator("svg")).not.toBeAttached();
});

test("renders img when src is a relative path", async ({ mount }) => {
  const component = await mount(<Wordmark height={40} label="Brand" src="/assets/logo.svg" />);
  const img = component.locator("img");
  await expect(img).toBeAttached();
  await expect(img).toHaveAttribute("src", "/assets/logo.svg");
  await expect(img).toHaveAttribute("alt", "Brand");
  await expect(component.locator("svg")).not.toBeAttached();
});

test("uses label as img alt text", async ({ mount }) => {
  const component = await mount(
    <Wordmark height={64} label="Custom Brand Name" src="https://example.com/logo.svg" />,
  );
  await expect(component.locator("img")).toHaveAttribute("alt", "Custom Brand Name");
});

test("does NOT render visually-hidden span in img branch", async ({ mount }) => {
  const component = await mount(
    <Wordmark height={64} label="Acme" src="https://example.com/logo.svg" />,
  );
  // The sr-only span must not appear — alt on <img> carries the accessible name
  await expect(component.locator("span")).not.toBeAttached();
});

// ---------------------------------------------------------------------------
// Unsafe-scheme blocking — fallback to bundled SVG mark
// ---------------------------------------------------------------------------

test("blocks javascript: scheme — falls back to bundled SVG", async ({ mount }) => {
  // eslint-disable-next-line no-script-url
  const component = await mount(<Wordmark height={64} src="javascript:void(0)" />);
  // No <img> must be rendered; the bundled SVG mark is the fallback
  await expect(component.locator("img")).not.toBeAttached();
  await expect(component.locator("svg")).toBeAttached();
});

test("blocks data: scheme — falls back to bundled SVG", async ({ mount }) => {
  const component = await mount(
    <Wordmark height={64} src="data:text/html,<script>alert(1)</script>" />,
  );
  await expect(component.locator("img")).not.toBeAttached();
  await expect(component.locator("svg")).toBeAttached();
});

test("blocks vbscript: scheme — falls back to bundled SVG", async ({ mount }) => {
  const component = await mount(<Wordmark height={64} src="vbscript:MsgBox(1)" />);
  await expect(component.locator("img")).not.toBeAttached();
  await expect(component.locator("svg")).toBeAttached();
});
