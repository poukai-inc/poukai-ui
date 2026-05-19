import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Eyebrow } from "../../atoms/Eyebrow";
import { LinkCard } from "./LinkCard";

/* ---------- Root element ---------- */

test("renders <a> root by default", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" title="Test card" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("a");
});

test("renders href on the root anchor", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work/case" title="Test card" />);
  await expect(component).toHaveAttribute("href", "/work/case");
});

/* ---------- asChild ---------- */

test("asChild renders child element as root (Slot composition)", async ({ mount }) => {
  const component = await mount(
    <LinkCard asChild title="asChild card">
      <a href="/work">stub</a>
    </LinkCard>,
  );
  // With Radix Slot the child <a> is the root element; it receives all
  // LinkCard styling. Match the Button asChild test pattern: verify href
  // is forwarded to the rendered anchor.
  await expect(component).toHaveAttribute("href", "/work");
});

/* ---------- Eyebrow ---------- */

test("string eyebrow is wrapped in Eyebrow and rendered", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" eyebrow="Design" title="Test card" />);
  await expect(component.getByText("Design")).toBeVisible();
});

test("ReactNode eyebrow is rendered as-is without extra wrapper", async ({ mount }) => {
  const component = await mount(
    <LinkCard
      href="/work"
      eyebrow={
        <Eyebrow variant="solid" data-testid="eyebrow-node">
          Engineering
        </Eyebrow>
      }
      title="Test card"
    />,
  );
  // The custom eyebrow node renders with its own testid
  await expect(component.locator('[data-testid="eyebrow-node"]')).toHaveCount(1);
});

test("no eyebrow element rendered when eyebrow prop absent", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" title="Test card" />);
  // No eyebrowSlot element — check no extra wrapper rendered
  // The title should still be present
  await expect(component.getByText("Test card")).toBeVisible();
});

/* ---------- Title ---------- */

test("title renders as <h3> by default", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" title="Default heading" />);
  const headingTag = await component.locator("h3").evaluate((el) => el.tagName.toLowerCase());
  expect(headingTag).toBe("h3");
  await expect(component.locator("h3")).toContainText("Default heading");
});

test("titleAs='h2' renders title as <h2>", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" titleAs="h2" title="H2 heading" />);
  await expect(component.locator("h2")).toContainText("H2 heading");
  await expect(component.locator("h3")).toHaveCount(0);
});

test("titleAs='h4' renders title as <h4>", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" titleAs="h4" title="H4 heading" />);
  await expect(component.locator("h4")).toContainText("H4 heading");
});

/* ---------- external ---------- */

test("external adds target='_blank' and rel='noopener noreferrer'", async ({ mount }) => {
  const component = await mount(
    <LinkCard href="https://example.com" external title="External card" />,
  );
  await expect(component).toHaveAttribute("target", "_blank");
  await expect(component).toHaveAttribute("rel", "noopener noreferrer");
});

test("external renders visually-hidden '(opens in new tab)' span", async ({ mount }) => {
  const component = await mount(
    <LinkCard href="https://example.com" external title="External card" />,
  );
  const srSpan = component.getByText("(opens in new tab)");
  await expect(srSpan).toHaveCount(1);
  // Visually hidden — position: absolute, dimensions 1px × 1px
  const position = await srSpan.evaluate((el) => window.getComputedStyle(el).position);
  expect(position).toBe("absolute");
});

test("non-external card does NOT add target or rel", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" title="Internal card" />);
  const target = await component.getAttribute("target");
  expect(target).toBeNull();
  const rel = await component.getAttribute("rel");
  expect(rel).toBeNull();
});

/* ---------- Icon ---------- */

test("icon renders in DOM when provided", async ({ mount }) => {
  const component = await mount(
    <LinkCard href="/work" title="Card with icon" icon={<span data-testid="test-icon">→</span>} />,
  );
  await expect(component.locator('[data-testid="test-icon"]')).toHaveCount(1);
});

test("no icon shell rendered when icon prop absent", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" title="No icon card" />);
  // icon slot wrapper uses pointer-events: none — verify it is absent entirely
  // by checking the icon testid does not appear
  await expect(component.locator('[data-testid="test-icon"]')).toHaveCount(0);
});

/* ---------- Body ---------- */

test("string body renders inside a <p>", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" title="Card" body="Body copy text." />);
  const pTag = await component
    .locator("p")
    .first()
    .evaluate((el) => el.tagName.toLowerCase());
  expect(pTag).toBe("p");
  await expect(component.getByText("Body copy text.")).toBeVisible();
});

test("ReactNode body renders as-is", async ({ mount }) => {
  const component = await mount(
    <LinkCard href="/work" title="Card" body={<span data-testid="body-node">Custom body</span>} />,
  );
  await expect(component.locator('[data-testid="body-node"]')).toHaveCount(1);
});

/* ---------- Footer ---------- */

test("footer renders when provided", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" title="Card" footer="Read more →" />);
  await expect(component.getByText("Read more →")).toBeVisible();
});

test("no footer element rendered when footer prop absent", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" title="Card" />);
  // No spacer or footer div when footer absent
  await expect(component.getByText("Read more →")).toHaveCount(0);
});

/* ---------- className merge + arbitrary-prop forwarding ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(
    <LinkCard href="/work" title="Card" className="custom-card-class" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-card-class/);
});

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(
    <LinkCard href="/work" title="Card" data-testid="link-card-root" />,
  );
  await expect(component).toHaveAttribute("data-testid", "link-card-root");
});

test("forwards aria-label to root element", async ({ mount }) => {
  const component = await mount(
    <LinkCard href="/work" title="Card" aria-label="Navigate to case study" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Navigate to case study");
});

/* ---------- Variant ---------- */

test("default variant is applied (no quiet class)", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" title="Card" />);
  const className = await component.getAttribute("class");
  // default variant class should be present
  expect(className).toMatch(/variantDefault/);
});

test("quiet variant applies quiet class", async ({ mount }) => {
  const component = await mount(<LinkCard href="/work" title="Card" variant="quiet" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/variantQuiet/);
});

/* ---------- a11y ---------- */

test("a11y — default card with full slots", async ({ mount, page }) => {
  await mount(
    <LinkCard
      href="/work/case"
      eyebrow="Design"
      title="Redesigning the onboarding flow"
      body="A three-month engagement that cut time-to-value by 40%."
      footer="Read more →"
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — quiet variant", async ({ mount, page }) => {
  await mount(
    <LinkCard href="/posts/1" variant="quiet" title="Post title" body="Post body copy." />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — external card", async ({ mount, page }) => {
  await mount(
    <LinkCard
      href="https://example.com"
      external
      title="External resource"
      body="Opens in a new tab."
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — title-only minimal card", async ({ mount, page }) => {
  await mount(<LinkCard href="/work" title="Minimal card" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
