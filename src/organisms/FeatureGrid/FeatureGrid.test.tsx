import { test, expect } from "@playwright/experimental-ct-react";
import { FeatureGrid } from "./FeatureGrid";
import { FeatureCard } from "../../molecules/FeatureCard";

/* ---------- Root element / Section integration ---------- */

test("renders a <section> root element by default", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid heading="Features">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("renders heading as h2 inside Section", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid heading="What you get">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  const heading = component.getByRole("heading", { level: 2 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText("What you get");
});

test("renders eyebrow when provided", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid eyebrow="Platform" heading="Features">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  await expect(component.getByText("Platform")).toBeVisible();
});

test("renders lede when provided", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid heading="Features" lede="Supporting copy.">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  await expect(component.getByText("Supporting copy.")).toBeVisible();
});

test("renders without heading (anonymous grid)", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid>
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  // FeatureCard renders its title as an h3 — only the Section h2 should be absent.
  await expect(component.getByRole("heading", { level: 2 })).toHaveCount(0);
  await expect(component.getByText("Body A")).toBeVisible();
});

/* ---------- Children (FeatureCard) rendering ---------- */

test("renders all FeatureCard children", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid heading="Grid">
      <FeatureCard title="Card One" body="Body one." />
      <FeatureCard title="Card Two" body="Body two." />
      <FeatureCard title="Card Three" body="Body three." />
    </FeatureGrid>,
  );
  await expect(component.getByText("Card One")).toBeVisible();
  await expect(component.getByText("Card Two")).toBeVisible();
  await expect(component.getByText("Card Three")).toBeVisible();
});

test("renders six FeatureCard children", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid heading="Six cards">
      <FeatureCard title="One" body="Body 1." />
      <FeatureCard title="Two" body="Body 2." />
      <FeatureCard title="Three" body="Body 3." />
      <FeatureCard title="Four" body="Body 4." />
      <FeatureCard title="Five" body="Body 5." />
      <FeatureCard title="Six" body="Body 6." />
    </FeatureGrid>,
  );
  const articles = component.locator("article");
  await expect(articles).toHaveCount(6);
});

/* ---------- CSS grid class assertions ---------- */

test("columns=3 (default) applies colsThree class to grid div", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid heading="Three cols">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  // Locate the grid container by its CSS module class substring (camelCase: colsThree).
  const gridDiv = component.locator("div[class*='colsThree']");
  await expect(gridDiv).toHaveCount(1);
});

test("columns=2 applies colsTwo class to grid div", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid columns={2} heading="Two cols">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  const gridDiv = component.locator("div[class*='colsTwo']");
  await expect(gridDiv).toHaveCount(1);
  await expect(component.locator("div[class*='colsThree']")).toHaveCount(0);
});

test("columns=3 grid div does not have colsTwo class", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid columns={3} heading="Three cols">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  await expect(component.locator("div[class*='colsTwo']")).toHaveCount(0);
  await expect(component.locator("div[class*='colsThree']")).toHaveCount(1);
});

/* ---------- Size variant ---------- */

test("size='tight' is forwarded to Section (sizeTight class on root)", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid size="tight" heading="Tight">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/sizeTight/);
});

test("size='default' does not apply sizeTight class", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid size="default" heading="Default">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  const className = await component.getAttribute("class");
  expect(className).not.toMatch(/sizeTight/);
});

/* ---------- aria-labelledby ---------- */

test("aria-labelledby is set when heading is provided", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid heading="Labelled region">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  const labelledBy = await component.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
});

test("aria-labelledby is absent when heading is omitted", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid>
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  const labelledBy = await component.getAttribute("aria-labelledby");
  expect(labelledBy).toBeNull();
});

/* ---------- Prop forwarding ---------- */

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid className="my-grid" heading="Grid">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-grid/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid data-testid="fg-root" heading="Grid">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  await expect(component).toHaveAttribute("data-testid", "fg-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <FeatureGrid aria-label="Custom region label">
      <FeatureCard title="A" body="Body A" />
    </FeatureGrid>,
  );
  await expect(component).toHaveAttribute("aria-label", "Custom region label");
});
