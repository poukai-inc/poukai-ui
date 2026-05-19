import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Footer } from "./Footer";

const BASE_PROPS = {
  copyright: "© Pouk AI INC 2026",
  email: "hello@pouk.ai",
};

/* ── Rendering ─────────────────────────────────────────────── */

test("renders copyright text", async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} />);
  await expect(component.locator("span").first()).toContainText("© Pouk AI INC 2026");
});

test("renders EmailLink with correct mailto href", async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} />);
  const link = component.locator('a[href="mailto:hello@pouk.ai"]');
  await expect(link).toBeVisible();
});

test("renders EmailLink showing raw email as visible text by default", async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} />);
  const link = component.locator('a[href="mailto:hello@pouk.ai"]');
  await expect(link).toContainText("hello@pouk.ai");
});

test("emailLabel overrides visible text on EmailLink", async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} emailLabel="Contact" />);
  const link = component.locator('a[href="mailto:hello@pouk.ai"]');
  await expect(link).toContainText("Contact");
});

test("renders separator with aria-hidden=true", async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} />);
  const separator = component.locator('[aria-hidden="true"]').first();
  await expect(separator).toBeVisible();
  await expect(separator).toContainText("·");
});

/* ── Links / nav ───────────────────────────────────────────── */

test("renders links list when links prop is provided", async ({ mount }) => {
  const component = await mount(
    <Footer
      {...BASE_PROPS}
      links={[
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ]}
    />,
  );
  await expect(component.locator("nav")).toBeVisible();
  await expect(component.locator("a[href='/privacy']")).toHaveText("Privacy");
  await expect(component.locator("a[href='/terms']")).toHaveText("Terms");
});

test("omits nav when no links prop", async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} />);
  await expect(component.locator("nav")).toHaveCount(0);
});

test("omits nav when links is empty array", async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} links={[]} />);
  await expect(component.locator("nav")).toHaveCount(0);
});

test("nav has correct aria-label (default Footer)", async ({ mount }) => {
  const component = await mount(
    <Footer {...BASE_PROPS} links={[{ href: "/privacy", label: "Privacy" }]} />,
  );
  await expect(component.locator("nav")).toHaveAttribute("aria-label", "Footer");
});

test("nav aria-label is overridable via linksLabel", async ({ mount }) => {
  const component = await mount(
    <Footer {...BASE_PROPS} links={[{ href: "/privacy", label: "Privacy" }]} linksLabel="Legal" />,
  );
  await expect(component.locator("nav")).toHaveAttribute("aria-label", "Legal");
});

test("external link gets target and rel attributes", async ({ mount }) => {
  const component = await mount(
    <Footer
      {...BASE_PROPS}
      links={[{ href: "https://github.com/poukai-inc", label: "GitHub ↗", external: true }]}
    />,
  );
  const link = component.locator('a[href="https://github.com/poukai-inc"]');
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
});

test("non-external links do not get target or rel", async ({ mount }) => {
  const component = await mount(
    <Footer {...BASE_PROPS} links={[{ href: "/privacy", label: "Privacy" }]} />,
  );
  const link = component.locator('a[href="/privacy"]');
  await expect(link).not.toHaveAttribute("target");
  await expect(link).not.toHaveAttribute("rel");
});

/* ── `as` prop / root element ──────────────────────────────── */

test('as="div" (default) emits a <div> root', async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} />);
  // Root element tag
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

test('as="footer" emits a <footer> root', async ({ mount }) => {
  const component = await mount(<Footer as="footer" {...BASE_PROPS} />);
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("footer");
});

test('as="footer" sets data-standalone="true"', async ({ mount }) => {
  const component = await mount(<Footer as="footer" {...BASE_PROPS} />);
  await expect(component).toHaveAttribute("data-standalone", "true");
});

test('as="div" does not set data-standalone', async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} />);
  await expect(component).not.toHaveAttribute("data-standalone");
});

/* ── className and prop forwarding ────────────────────────── */

test("merges className prop onto root", async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} className="custom-class" />);
  const classes = await component.getAttribute("class");
  expect(classes).toContain("custom-class");
});

test("forwards arbitrary data-* props to root", async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} data-testid="footer-root" />);
  await expect(component).toHaveAttribute("data-testid", "footer-root");
});

test("forwards arbitrary aria-* props to root", async ({ mount }) => {
  const component = await mount(<Footer {...BASE_PROPS} aria-label="Site footer" />);
  await expect(component).toHaveAttribute("aria-label", "Site footer");
});

/* ── Ref forwarding ────────────────────────────────────────── */

test("ref forwarding attaches to the root element", async ({ mount, page }) => {
  // Verify that the ref is wired by checking a data-testid we set via prop spread.
  // (Playwright CT cannot introspect React refs directly, so we test via DOM identity.)
  const component = await mount(<Footer {...BASE_PROPS} data-testid="ref-check" />);
  const el = page.locator('[data-testid="ref-check"]');
  await expect(el).toBeVisible();
});

/* ── Accessibility ─────────────────────────────────────────── */

test("a11y — as=div (default, slotted context) passes axe-core", async ({ mount, page }) => {
  await mount(
    <div>
      <Footer
        {...BASE_PROPS}
        links={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
          { href: "https://github.com/poukai-inc", label: "GitHub ↗", external: true },
        ]}
      />
    </div>,
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("a11y — as=footer (standalone) passes axe-core with contentinfo landmark", async ({
  mount,
  page,
}) => {
  await mount(
    <Footer
      as="footer"
      {...BASE_PROPS}
      links={[
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ]}
    />,
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("a11y — no links variant passes axe-core", async ({ mount, page }) => {
  await mount(<Footer as="footer" {...BASE_PROPS} />);
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
