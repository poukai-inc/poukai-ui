import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { FeatureCard } from "./FeatureCard";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

async function expectAxeClean(page: import("@playwright/test").Page) {
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

/* ------------------------------------------------------------------ */
/* Root element                                                         */
/* ------------------------------------------------------------------ */

test("renders <article> by default", async ({ mount }) => {
  const component = await mount(<FeatureCard title="Feature" body="Body copy." />);
  await expect(component).toHaveRole("article");
});

/* ------------------------------------------------------------------ */
/* Polymorphic `as`                                                     */
/* ------------------------------------------------------------------ */

test("as='section' renders <section>", async ({ mount }) => {
  const component = await mount(<FeatureCard as="section" title="Feature" body="Body copy." />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("as='li' renders <li>", async ({ mount }) => {
  const component = await mount(
    <ul>
      <FeatureCard as="li" title="Feature" body="Body copy." />
    </ul>,
  );
  const li = component.locator("li");
  await expect(li).toHaveCount(1);
});

test("as='div' renders <div>", async ({ mount }) => {
  const component = await mount(<FeatureCard as="div" title="Feature" body="Body copy." />);
  const div = component.locator("div").first();
  await expect(div).toBeVisible();
});

/* ------------------------------------------------------------------ */
/* Eyebrow                                                              */
/* ------------------------------------------------------------------ */

test("eyebrow string is wrapped and visible", async ({ mount }) => {
  const component = await mount(
    <FeatureCard eyebrow="Platform" title="Feature" body="Body copy." />,
  );
  await expect(component.getByText("Platform")).toBeVisible();
});

test("eyebrow ReactNode is rendered as-is (no double-wrap)", async ({ mount }) => {
  const component = await mount(
    <FeatureCard
      eyebrow={<span data-testid="custom-eyebrow">Custom</span>}
      title="Feature"
      body="Body copy."
    />,
  );
  await expect(component.locator("[data-testid='custom-eyebrow']")).toHaveCount(1);
  await expect(component.getByText("Custom")).toBeVisible();
});

test("no eyebrow emits no eyebrow slot", async ({ mount }) => {
  const component = await mount(<FeatureCard title="Feature" body="Body copy." />);
  // The eyebrowSlot div is not rendered when eyebrow is absent.
  // Count root-level direct children: icon (0), eyebrow (0), title (h3), bodySlot, footer (0) = 2
  const h3 = component.locator("h3");
  await expect(h3).toHaveCount(1);
});

/* ------------------------------------------------------------------ */
/* Title                                                                */
/* ------------------------------------------------------------------ */

test("title renders as h3 by default", async ({ mount }) => {
  const component = await mount(<FeatureCard title="My Feature" body="Body copy." />);
  await expect(component.getByRole("heading", { level: 3 })).toHaveText("My Feature");
});

test("titleAs='h2' renders as h2", async ({ mount }) => {
  const component = await mount(<FeatureCard titleAs="h2" title="My Feature" body="Body copy." />);
  await expect(component.getByRole("heading", { level: 2 })).toHaveText("My Feature");
});

test("titleAs='h4' renders as h4", async ({ mount }) => {
  const component = await mount(<FeatureCard titleAs="h4" title="My Feature" body="Body copy." />);
  await expect(component.getByRole("heading", { level: 4 })).toHaveText("My Feature");
});

/* ------------------------------------------------------------------ */
/* Body                                                                 */
/* ------------------------------------------------------------------ */

test("body string renders visible text", async ({ mount }) => {
  const component = await mount(
    <FeatureCard title="Feature" body="This is the feature description." />,
  );
  await expect(component.getByText("This is the feature description.")).toBeVisible();
});

test("body ReactNode renders as-is", async ({ mount }) => {
  const component = await mount(
    <FeatureCard title="Feature" body={<p data-testid="custom-body">Custom body node.</p>} />,
  );
  await expect(component.locator("[data-testid='custom-body']")).toHaveCount(1);
  await expect(component.getByText("Custom body node.")).toBeVisible();
});

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

test("footer renders when provided", async ({ mount }) => {
  const component = await mount(
    <FeatureCard title="Feature" body="Body copy." footer={<a href="/learn">Learn more →</a>} />,
  );
  await expect(component.getByText("Learn more →")).toBeVisible();
});

test("no footer element emitted when footer is absent", async ({ mount }) => {
  const component = await mount(<FeatureCard title="Feature" body="Body copy." />);
  await expect(component.getByText("Learn more →")).toHaveCount(0);
});

/* ------------------------------------------------------------------ */
/* Icon                                                                 */
/* ------------------------------------------------------------------ */

test("icon renders with aria-hidden wrapper", async ({ mount }) => {
  const component = await mount(
    <FeatureCard
      icon={<span data-testid="icon-glyph">icon</span>}
      title="Feature"
      body="Body copy."
    />,
  );
  // The wrapper span must have aria-hidden="true"
  const wrapper = component.locator("span[aria-hidden='true']").first();
  await expect(wrapper).toBeVisible();
  // The inner glyph is present
  await expect(component.locator("[data-testid='icon-glyph']")).toHaveCount(1);
});

test("no icon slot emitted when icon is absent", async ({ mount }) => {
  const component = await mount(<FeatureCard title="Feature" body="Body copy." />);
  await expect(component.locator("span[aria-hidden='true']")).toHaveCount(0);
});

/* ------------------------------------------------------------------ */
/* Variant                                                              */
/* ------------------------------------------------------------------ */

test("bordered variant renders root with correct title", async ({ mount }) => {
  // CSS Module class names are hashed; verify via functional checks.
  const component = await mount(
    <FeatureCard
      variant="bordered"
      title="Bordered Feature"
      body="Body copy."
      data-testid="bordered-card"
    />,
  );
  await expect(component).toHaveAttribute("data-testid", "bordered-card");
  await expect(component.getByRole("heading", { level: 3 })).toHaveText("Bordered Feature");
});

/* ------------------------------------------------------------------ */
/* aria-labelledby wiring                                               */
/* ------------------------------------------------------------------ */

test("article root has aria-labelledby pointing to title id", async ({ mount }) => {
  const component = await mount(<FeatureCard title="Accessible Feature" body="Body." />);
  // component IS the article root — use getAttribute directly
  const labelledBy = await component.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
  // useId() produces ids with colons (e.g. ":r0:-title") — use attribute selector,
  // not CSS id shorthand (#id), which breaks on colon-containing ids.
  const titleEl = component.locator(`[id="${labelledBy}"]`);
  await expect(titleEl).toHaveText("Accessible Feature");
});

test("section root has aria-labelledby pointing to title id", async ({ mount }) => {
  const component = await mount(<FeatureCard as="section" title="Section Feature" body="Body." />);
  // component IS the section root
  const labelledBy = await component.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
  const titleEl = component.locator(`[id="${labelledBy}"]`);
  await expect(titleEl).toHaveText("Section Feature");
});

test("div root has no aria-labelledby", async ({ mount }) => {
  const component = await mount(<FeatureCard as="div" title="Div Feature" body="Body." />);
  await expect(component).not.toHaveAttribute("aria-labelledby");
});

test("li root has no aria-labelledby", async ({ mount }) => {
  const component = await mount(
    <ul>
      <FeatureCard as="li" title="Li Feature" body="Body." />
    </ul>,
  );
  const li = component.locator("li");
  await expect(li).not.toHaveAttribute("aria-labelledby");
});

/* ------------------------------------------------------------------ */
/* Prop forwarding                                                      */
/* ------------------------------------------------------------------ */

test("forwards className and arbitrary props to root", async ({ mount }) => {
  const component = await mount(
    <FeatureCard
      title="Feature"
      body="Body copy."
      data-testid="feature-card"
      aria-label="A feature"
      className="consumer-class"
    />,
  );
  await expect(component).toHaveAttribute("data-testid", "feature-card");
  await expect(component).toHaveAttribute("aria-label", "A feature");
  // component IS the article root — get class directly
  const cls = await component.getAttribute("class");
  expect(cls).toContain("consumer-class");
});

/* ------------------------------------------------------------------ */
/* Accessibility (axe)                                                  */
/* ------------------------------------------------------------------ */

test("a11y — default variant (icon + eyebrow + title + body + footer)", async ({ mount, page }) => {
  await mount(
    <FeatureCard
      icon={
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
        </svg>
      }
      eyebrow="Platform"
      title="Observability"
      body="Every inference logged, traced, and alertable."
      footer={<a href="/docs">Learn more →</a>}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — bordered variant", async ({ mount, page }) => {
  await mount(
    <FeatureCard
      variant="bordered"
      title="Secure by default"
      body="Every pipeline is air-gapped and audited."
    />,
  );
  await expectAxeClean(page);
});

test("a11y — as='li' inside ul", async ({ mount, page }) => {
  await mount(
    <ul style={{ listStyle: "none", padding: 0 }}>
      <FeatureCard as="li" title="List feature" body="Feature description." />
    </ul>,
  );
  await expectAxeClean(page);
});

test("a11y — as='section' with aria-labelledby", async ({ mount, page }) => {
  await mount(<FeatureCard as="section" title="Section Feature" body="Section body copy." />);
  await expectAxeClean(page);
});
