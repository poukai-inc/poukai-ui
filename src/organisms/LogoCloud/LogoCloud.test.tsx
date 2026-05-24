import { test, expect } from "@playwright/experimental-ct-react";
import { LogoCloud } from "./LogoCloud";
import { Logo } from "../../atoms/Logo";

const LOGO_A = <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Acme" alt="Acme" />;
const LOGO_B = <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Globex" alt="Globex" />;

/* ── Rendering ─────────────────────────────────────────────── */

test("renders Logo children", async ({ mount }) => {
  const component = await mount(
    <LogoCloud aria-label="Partners">
      {LOGO_A}
      {LOGO_B}
    </LogoCloud>,
  );
  await expect(component.locator('img[alt="Acme"]')).toBeVisible();
  await expect(component.locator('img[alt="Globex"]')).toBeVisible();
});

test("renders heading when provided", async ({ mount }) => {
  const component = await mount(<LogoCloud heading="Trusted by">{LOGO_A}</LogoCloud>);
  await expect(component.locator("h2")).toContainText("Trusted by");
});

test("renders eyebrow when provided", async ({ mount }) => {
  const component = await mount(<LogoCloud eyebrow="Customers">{LOGO_A}</LogoCloud>);
  await expect(component).toContainText("Customers");
});

test("renders lede when provided", async ({ mount }) => {
  const component = await mount(
    <LogoCloud heading="Trusted by" lede="Supporting copy.">
      {LOGO_A}
    </LogoCloud>,
  );
  await expect(component).toContainText("Supporting copy.");
});

/* ── Variant classes ───────────────────────────────────────── */

test("grid variant: container has variantGrid class", async ({ mount }) => {
  const component = await mount(
    <LogoCloud variant="grid" aria-label="Partners">
      {LOGO_A}
    </LogoCloud>,
  );
  const container = component.locator("[class*='variantGrid']");
  await expect(container).toBeAttached();
});

test("strip variant: container has variantStrip class", async ({ mount }) => {
  const component = await mount(
    <LogoCloud variant="strip" aria-label="Partners">
      {LOGO_A}
    </LogoCloud>,
  );
  const container = component.locator("[class*='variantStrip']");
  await expect(container).toBeAttached();
});

test("grid variant is the default", async ({ mount }) => {
  const component = await mount(<LogoCloud aria-label="Partners">{LOGO_A}</LogoCloud>);
  const container = component.locator("[class*='variantGrid']");
  await expect(container).toBeAttached();
});

/* ── Strip: duplicate track for seamless loop ──────────────── */

test("strip variant renders two tracks", async ({ mount }) => {
  const component = await mount(
    <LogoCloud variant="strip" aria-label="Partners">
      {LOGO_A}
      {LOGO_B}
    </LogoCloud>,
  );
  const tracks = component.locator("[class*='track']");
  await expect(tracks).toHaveCount(2);
});

test("strip: second track has aria-hidden=true", async ({ mount }) => {
  const component = await mount(
    <LogoCloud variant="strip" aria-label="Partners">
      {LOGO_A}
      {LOGO_B}
    </LogoCloud>,
  );
  const hiddenTrack = component.locator('[aria-hidden="true"]');
  await expect(hiddenTrack).toHaveCount(1);
});

/* ── Divider ───────────────────────────────────────────────── */

test("divider prop adds hasDivider class", async ({ mount }) => {
  const component = await mount(
    <LogoCloud divider aria-label="Partners">
      {LOGO_A}
    </LogoCloud>,
  );
  const container = component.locator("[class*='hasDivider']");
  await expect(container).toBeAttached();
});

test("no hasDivider class when divider is false", async ({ mount }) => {
  const component = await mount(<LogoCloud aria-label="Partners">{LOGO_A}</LogoCloud>);
  const container = component.locator("[class*='hasDivider']");
  await expect(container).toHaveCount(0);
});

/* ── Prop forwarding ───────────────────────────────────────── */

test("forwards className to root", async ({ mount }) => {
  const component = await mount(
    <LogoCloud aria-label="Partners" className="custom-class">
      {LOGO_A}
    </LogoCloud>,
  );
  const classes = await component.getAttribute("class");
  expect(classes).toContain("custom-class");
});

test("forwards data-* props to root", async ({ mount }) => {
  const component = await mount(
    <LogoCloud aria-label="Partners" data-testid="logo-cloud-root">
      {LOGO_A}
    </LogoCloud>,
  );
  await expect(component).toHaveAttribute("data-testid", "logo-cloud-root");
});

test("forwards aria-label to root", async ({ mount }) => {
  const component = await mount(<LogoCloud aria-label="Our customers">{LOGO_A}</LogoCloud>);
  await expect(component).toHaveAttribute("aria-label", "Our customers");
});

/* ── Ref forwarding ────────────────────────────────────────── */

test("ref forwarding attaches to root element", async ({ mount, page }) => {
  const component = await mount(
    <LogoCloud aria-label="Partners" data-testid="lc-ref">
      {LOGO_A}
    </LogoCloud>,
  );
  const el = page.locator('[data-testid="lc-ref"]');
  await expect(el).toBeVisible();
});

/* a11y scans are in src/a11y.test.tsx */
