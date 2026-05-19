import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Section } from "./Section";
import { Eyebrow } from "../../atoms/Eyebrow";

/* ---------- Root element ---------- */

test("renders default <section> root", async ({ mount }) => {
  const component = await mount(<Section title="The approach" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("polymorphic as='article' renders <article> root", async ({ mount }) => {
  const component = await mount(<Section as="article" title="Press mention" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("article");
});

test("polymorphic as='aside' renders <aside> root", async ({ mount }) => {
  const component = await mount(<Section as="aside" title="Related content" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("aside");
});

test("polymorphic as='div' renders <div> root", async ({ mount }) => {
  const component = await mount(<Section as="div" title="Grouped content" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- Eyebrow slot ---------- */

test("string eyebrow wraps in Eyebrow atom", async ({ mount }) => {
  const component = await mount(<Section eyebrow="01 · Approach" title="The approach" />);
  // Eyebrow renders text as uppercase — verify the text content is present
  await expect(component.getByText("01 · Approach")).toBeVisible();
});

test("ReactNode eyebrow renders as-is", async ({ mount }) => {
  const component = await mount(
    <Section
      eyebrow={
        <Eyebrow numeral="01" variant="numbered" data-testid="custom-eyebrow">
          Approach
        </Eyebrow>
      }
      title="The approach"
    />,
  );
  // The ReactNode eyebrow should render its testid directly
  await expect(component.getByTestId("custom-eyebrow")).toBeVisible();
  // Scope text lookup to the eyebrow element to avoid matching the title "The approach"
  await expect(component.getByTestId("custom-eyebrow").getByText("Approach")).toBeVisible();
});

test("absent eyebrow renders no eyebrow slot", async ({ mount }) => {
  const component = await mount(<Section title="The approach" />);
  // No Eyebrow-style text — just the title
  await expect(component.getByRole("heading")).toBeVisible();
});

/* ---------- Title slot ---------- */

test("title renders as h2 by default", async ({ mount }) => {
  const component = await mount(<Section title="The approach" />);
  const heading = component.getByRole("heading", { level: 2 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText("The approach");
});

test("titleAs='h1' renders title as h1", async ({ mount }) => {
  const component = await mount(<Section titleAs="h1" title="Page heading" />);
  const heading = component.getByRole("heading", { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText("Page heading");
});

test("titleAs='h3' renders title as h3", async ({ mount }) => {
  const component = await mount(<Section titleAs="h3" title="Sub-section" />);
  const heading = component.getByRole("heading", { level: 3 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText("Sub-section");
});

test("absent title renders no heading element", async ({ mount }) => {
  const component = await mount(<Section lede="Supporting copy only." />);
  await expect(component.getByRole("heading")).toHaveCount(0);
});

/* ---------- Lede slot ---------- */

test("string lede wraps in <p>", async ({ mount }) => {
  const component = await mount(<Section title="The approach" lede="Supporting copy." />);
  await expect(component.getByText("Supporting copy.")).toBeVisible();
  // It should be inside a <p> element
  const ledeEl = component.getByText("Supporting copy.");
  const tag = await ledeEl.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("p");
});

test("ReactNode lede renders as-is", async ({ mount }) => {
  const component = await mount(
    <Section title="The approach" lede={<p data-testid="custom-lede">Custom lede node.</p>} />,
  );
  await expect(component.getByTestId("custom-lede")).toBeVisible();
});

/* ---------- Empty header guard ---------- */

test("no header wrapper rendered when all three slots absent", async ({ mount }) => {
  const component = await mount(
    <Section>
      <p>Body only.</p>
    </Section>,
  );
  // The header div should not be present — no eyebrow, no title, no lede
  // Body content should still render
  await expect(component.getByText("Body only.")).toBeVisible();
  // No heading elements
  await expect(component.getByRole("heading")).toHaveCount(0);
});

/* ---------- aria-labelledby wiring ---------- */

test("aria-labelledby is set when title present and as='section'", async ({ mount, page }) => {
  const component = await mount(<Section title="Labelled section" />);
  const labelledBy = await component.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
  // useId() generates IDs with colons (e.g. ":r0:-title") which are invalid in CSS
  // selectors. Use page.evaluate to find the element by id attribute directly.
  const titleText = await page.evaluate(
    (id) => document.getElementById(id)?.textContent ?? null,
    labelledBy!,
  );
  expect(titleText).toBe("Labelled section");
});

test("aria-labelledby is set when title present and as='article'", async ({ mount }) => {
  const component = await mount(<Section as="article" title="Article heading" />);
  const labelledBy = await component.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
});

test("aria-labelledby is set when title present and as='aside'", async ({ mount }) => {
  const component = await mount(<Section as="aside" title="Aside heading" />);
  const labelledBy = await component.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
});

test("aria-labelledby is absent when as='div'", async ({ mount }) => {
  const component = await mount(<Section as="div" title="Div content" />);
  const labelledBy = await component.getAttribute("aria-labelledby");
  expect(labelledBy).toBeNull();
});

test("aria-labelledby is absent when title is not provided", async ({ mount }) => {
  const component = await mount(<Section lede="No title here." />);
  const labelledBy = await component.getAttribute("aria-labelledby");
  expect(labelledBy).toBeNull();
});

/* ---------- Size variant ---------- */

test("size='default' applies root class without sizeTight modifier", async ({ mount }) => {
  const component = await mount(<Section size="default" title="Default size" />);
  const className = await component.getAttribute("class");
  expect(className).not.toMatch(/sizeTight/);
});

test("size='tight' applies sizeTight class", async ({ mount }) => {
  const component = await mount(<Section size="tight" title="Tight size" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/sizeTight/);
});

/* ---------- className merge + arbitrary-prop forwarding ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Section className="custom-section-class" title="Classy" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-section-class/);
});

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(<Section data-testid="section-root" title="Forwarded" />);
  await expect(component).toHaveAttribute("data-testid", "section-root");
});

test("forwards aria-label to root element", async ({ mount }) => {
  const component = await mount(<Section as="div" aria-label="Custom label" />);
  await expect(component).toHaveAttribute("aria-label", "Custom label");
});

/* ---------- Children ---------- */

test("renders children below header block", async ({ mount }) => {
  const component = await mount(
    <Section title="With children">
      <p>Child content here.</p>
    </Section>,
  );
  await expect(component.getByText("Child content here.")).toBeVisible();
  await expect(component.getByRole("heading", { level: 2 })).toBeVisible();
});

/* ---------- a11y ---------- */

test("a11y — titled section (default)", async ({ mount, page }) => {
  await mount(
    <Section eyebrow="01 · Approach" title="The rules we ship by." lede="Supporting copy.">
      <p>Body content.</p>
    </Section>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — tight variant", async ({ mount, page }) => {
  await mount(<Section size="tight" title="Tight section" lede="Supporting copy." />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — as='article'", async ({ mount, page }) => {
  await mount(<Section as="article" title="Article heading" lede="Article lede." />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — no title (unlabeled section)", async ({ mount, page }) => {
  await mount(
    <Section lede="No title section.">
      <p>Body content.</p>
    </Section>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — ReactNode eyebrow with numeral", async ({ mount, page }) => {
  await mount(
    <Section
      eyebrow={
        <Eyebrow numeral="FM-03" variant="numbered">
          Failure Mode
        </Eyebrow>
      }
      title="The chatbot plateau."
      lede="Supporting copy."
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
