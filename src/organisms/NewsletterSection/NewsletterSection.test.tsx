import { test, expect } from "@playwright/experimental-ct-react";
import { NewsletterSection } from "./NewsletterSection";
import { NewsletterField } from "../../molecules/NewsletterField";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const field = <NewsletterField action="/api/subscribe" />;

const defaultProps = {
  heading: "Get monthly updates",
  field,
};

// ---------------------------------------------------------------------------
// Rendering: section landmark + heading
// ---------------------------------------------------------------------------

test("renders a section landmark", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} />);
  // Section molecule defaults to <section> — the mounted root IS the section
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("renders the heading as h2 by default", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} />);
  const h2 = component.locator("h2");
  await expect(h2).toBeVisible();
  await expect(h2).toContainText("Get monthly updates");
});

test("renders heading as h3 when titleAs=h3", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} titleAs="h3" />);
  await expect(component.locator("h3")).toBeVisible();
  await expect(component.locator("h2")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Rendering: body (lede) slot
// ---------------------------------------------------------------------------

test("renders body text when provided", async ({ mount }) => {
  const component = await mount(
    <NewsletterSection {...defaultProps} body="One email a month. No spam." />,
  );
  await expect(component.getByText("One email a month. No spam.")).toBeVisible();
});

test("does not render lede element when body is omitted", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} />);
  // Section only emits a <p class="lede"> when lede is provided
  await expect(component.locator(".lede, [class*='lede']")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Rendering: eyebrow slot
// ---------------------------------------------------------------------------

test("renders eyebrow when provided", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} eyebrow="Stay in the loop" />);
  await expect(component.getByText("Stay in the loop")).toBeVisible();
});

test("does not render eyebrow when omitted", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} />);
  // Heading text is still present but no eyebrow sibling
  await expect(component.locator("[class*='eyebrow']")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Rendering: NewsletterField slot
// ---------------------------------------------------------------------------

test("renders the field slot", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} />);
  // NewsletterField renders a <form> with aria-label
  const form = component.locator("form");
  await expect(form).toBeVisible();
});

test("renders email input inside field slot", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} />);
  const input = component.locator("input[type='email']");
  await expect(input).toBeVisible();
});

// ---------------------------------------------------------------------------
// surface prop
// ---------------------------------------------------------------------------

test("applies surface class when surface=true", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} surface />);
  await expect(component).toHaveClass(/surface/);
});

test("does not apply surface class when surface=false (default)", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} />);
  await expect(component).not.toHaveClass(/surface/);
});

// ---------------------------------------------------------------------------
// size variants
// ---------------------------------------------------------------------------

test("applies sizeTight class when size=tight", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} size="tight" />);
  await expect(component).toHaveClass(/sizeTight/);
});

test("does not apply sizeTight class when size=default", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} size="default" />);
  await expect(component).not.toHaveClass(/sizeTight/);
});

// ---------------------------------------------------------------------------
// Polymorphic `as` prop
// ---------------------------------------------------------------------------

test("renders as article when as=article", async ({ mount }) => {
  const component = await mount(<NewsletterSection as="article" {...defaultProps} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("article");
});

test("renders as div when as=div", async ({ mount }) => {
  const component = await mount(<NewsletterSection as="div" {...defaultProps} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

// ---------------------------------------------------------------------------
// aria-labelledby wiring
// ---------------------------------------------------------------------------

test("section landmark has aria-labelledby pointing at heading", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} />);
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  // Use [id="..."] selector to avoid CSS.escape — React useId generates ids with ':'
  const labeled = component.locator(`[id="${labelledById}"]`);
  await expect(labeled).toBeVisible();
  await expect(labeled).toContainText("Get monthly updates");
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <NewsletterSection {...defaultProps} className="custom-newsletter" />,
  );
  await expect(component).toHaveClass(/custom-newsletter/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<NewsletterSection {...defaultProps} data-testid="ns-root" />);
  await expect(component).toHaveAttribute("data-testid", "ns-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <NewsletterSection as="div" {...defaultProps} aria-label="Newsletter band" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Newsletter band");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
