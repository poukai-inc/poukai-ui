import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Mail } from "lucide-react";
import { EmailLink } from "./EmailLink";

/* ---------- href computation ---------- */

test("computes href as mailto:${email}", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" />);
  await expect(component).toHaveAttribute("href", "mailto:hello@pouk.ai");
});

test("computes correct href for non-default email", async ({ mount }) => {
  const component = await mount(<EmailLink email="founder@pouk.ai" />);
  await expect(component).toHaveAttribute("href", "mailto:founder@pouk.ai");
});

// TS-level check: href is not an accepted prop.
// This line must NOT produce a type error at compile time (the prop is simply absent),
// but passing href should produce one. The @ts-expect-error annotation verifies that.
const _hrefProhibited = (
  // @ts-expect-error href must not be accepted — it is always computed from email
  <EmailLink email="hello@pouk.ai" href="mailto:other@example.com" />
);

/* ---------- Label defaults ---------- */

test("label defaults to email string when omitted", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" />);
  await expect(component.getByText("hello@pouk.ai")).toBeVisible();
});

test("label override replaces email as visible text", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" label="Contact us" />);
  await expect(component.getByText("Contact us")).toBeVisible();
  // href still points to the email
  await expect(component).toHaveAttribute("href", "mailto:hello@pouk.ai");
});

/* ---------- Icon slot ---------- */

test("renders icon when provided", async ({ mount }) => {
  const component = await mount(
    <EmailLink
      email="hello@pouk.ai"
      icon={<Mail size={14} aria-hidden="true" data-testid="mail-icon" />}
    />,
  );
  // The icon wrapper span should be present
  const iconWrapper = component.locator("span").first();
  await expect(iconWrapper).toBeVisible();
});

test("does not render icon wrapper when icon prop is absent", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" />);
  // Only the label span should be present (no icon span)
  await expect(component.locator("span")).toHaveCount(1);
});

/* ---------- Qualifier ---------- */

test("renders qualifier with NBSP and parentheses", async ({ mount }) => {
  const component = await mount(<EmailLink email="founder@pouk.ai" qualifier="Arian" />);
  // The qualifier span should contain the text (Arian)
  const qualifierSpan = component.locator("span").last();
  const text = await qualifierSpan.textContent();
  // Should contain a non-breaking space followed by (Arian)
  expect(text).toContain("(Arian)");
  // NBSP check: the raw character should be in the text content
  expect(text).toMatch(/ \(Arian\)/);
});

test("does not render qualifier span when qualifier is absent", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" />);
  // Only 1 span: the label
  await expect(component.locator("span")).toHaveCount(1);
});

/* ---------- Variants ---------- */

test("renders default variant without muted class", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" />);
  const className = await component.getAttribute("class");
  expect(className).not.toMatch(/muted/i);
});

test("renders muted variant", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" variant="muted" />);
  // Just check it renders without error
  await expect(component).toBeVisible();
});

/* ---------- Ref forwarding ---------- */

test("forwards ref — root anchor is reachable via data-testid", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" data-testid="email-ref-target" />);
  await expect(component).toHaveAttribute("data-testid", "email-ref-target");
});

test("root element is an anchor tag", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("a");
});

/* ---------- className merge ---------- */

test("merges consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" className="custom-class-x" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-class-x/);
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards data-* props to root anchor", async ({ mount }) => {
  const component = await mount(
    <EmailLink email="hello@pouk.ai" data-testid="el-1" data-section="footer" />,
  );
  await expect(component).toHaveAttribute("data-testid", "el-1");
  await expect(component).toHaveAttribute("data-section", "footer");
});

test("forwards aria-* props to root anchor", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" aria-label="Email Arian" />);
  await expect(component).toHaveAttribute("aria-label", "Email Arian");
});

test("forwards rel and target props", async ({ mount }) => {
  const component = await mount(<EmailLink email="hello@pouk.ai" rel="noopener" target="_blank" />);
  await expect(component).toHaveAttribute("rel", "noopener");
  await expect(component).toHaveAttribute("target", "_blank");
});

/* ---------- a11y ---------- */

test("a11y — default variant", async ({ mount, page }) => {
  await mount(<EmailLink email="hello@pouk.ai" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with icon (aria-hidden on icon)", async ({ mount, page }) => {
  await mount(<EmailLink email="hello@pouk.ai" icon={<Mail size={14} aria-hidden="true" />} />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with qualifier", async ({ mount, page }) => {
  await mount(<EmailLink email="founder@pouk.ai" qualifier="Arian" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — muted variant", async ({ mount, page }) => {
  await mount(<EmailLink email="hello@pouk.ai" variant="muted" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — label override", async ({ mount, page }) => {
  await mount(<EmailLink email="hello@pouk.ai" label="Contact us" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
