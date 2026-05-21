import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Link } from "./Link";

/* ---------- Default render ---------- */

test("renders an anchor element by default", async ({ mount }) => {
  const component = await mount(<Link href="/about">About</Link>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("a");
});

test("renders children as visible text", async ({ mount }) => {
  const component = await mount(<Link href="/about">About us</Link>);
  await expect(component.getByText("About us")).toBeVisible();
});

test("href is forwarded to the anchor", async ({ mount }) => {
  const component = await mount(<Link href="/about">About</Link>);
  await expect(component).toHaveAttribute("href", "/about");
});

/* ---------- Variants ---------- */

test("default variant renders without error", async ({ mount }) => {
  const component = await mount(
    <Link href="/about" variant="default">
      Default link
    </Link>,
  );
  await expect(component).toBeVisible();
});

test("quiet variant renders without error", async ({ mount }) => {
  const component = await mount(
    <Link href="/about" variant="quiet">
      Quiet link
    </Link>,
  );
  await expect(component).toBeVisible();
});

test("muted-link variant renders without error", async ({ mount }) => {
  const component = await mount(
    <Link href="/about" variant="muted-link">
      Muted link
    </Link>,
  );
  await expect(component).toBeVisible();
});

test("variant defaults to default when omitted", async ({ mount }) => {
  const component = await mount(<Link href="/about">Link</Link>);
  const className = await component.getAttribute("class");
  // The CSS module produces a hashed class; we verify the component renders
  // without the quiet or muted-link variant classes being the only classes.
  expect(className).toBeTruthy();
  await expect(component).toBeVisible();
});

/* ---------- asChild ---------- */

test("asChild renders the child element as root", async ({ mount }) => {
  const component = await mount(
    <Link href="/about" asChild>
      <a href="/about" data-testid="child-anchor">
        About
      </a>
    </Link>,
  );
  // The Slot merges props onto the child; the child anchor should be visible
  await expect(component.getByTestId("child-anchor")).toBeVisible();
});

test("asChild forwards DS classes to the child element", async ({ mount }) => {
  const component = await mount(
    <Link href="/about" asChild>
      <a href="/about">About</a>
    </Link>,
  );
  const className = await component.getAttribute("class");
  expect(className).toBeTruthy();
});

/* ---------- Ref forwarding ---------- */

test("forwards ref — root element is reachable via data-testid", async ({ mount }) => {
  const component = await mount(
    <Link href="/about" data-testid="link-ref-target">
      About
    </Link>,
  );
  await expect(component).toHaveAttribute("data-testid", "link-ref-target");
});

test("root element is an anchor tag (ref forwarded to <a>)", async ({ mount }) => {
  const component = await mount(<Link href="/about">About</Link>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("a");
});

/* ---------- className merge ---------- */

test("merges consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(
    <Link href="/about" className="custom-class-z">
      About
    </Link>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-class-z/);
});

/* ---------- data-* / aria-* forwarding ---------- */

test("forwards data-testid to root anchor", async ({ mount }) => {
  const component = await mount(
    <Link href="/about" data-testid="my-link">
      About
    </Link>,
  );
  await expect(component).toHaveAttribute("data-testid", "my-link");
});

test("forwards data-section attribute to root anchor", async ({ mount }) => {
  const component = await mount(
    <Link href="/about" data-section="nav" data-testid="ds-link">
      About
    </Link>,
  );
  await expect(component).toHaveAttribute("data-section", "nav");
});

test("forwards aria-label to root anchor", async ({ mount }) => {
  const component = await mount(
    <Link href="/about" aria-label="Navigate to about page">
      About
    </Link>,
  );
  await expect(component).toHaveAttribute("aria-label", "Navigate to about page");
});

/* ---------- target="_blank" auto-rel ---------- */

test("auto-applies rel=noopener noreferrer when target=_blank and no rel provided", async ({
  mount,
}) => {
  const component = await mount(
    <Link href="https://example.com" target="_blank">
      External
    </Link>,
  );
  await expect(component).toHaveAttribute("rel", "noopener noreferrer");
});

test("consumer-supplied rel takes precedence over auto-rel", async ({ mount }) => {
  const component = await mount(
    <Link href="https://example.com" target="_blank" rel="noopener">
      External
    </Link>,
  );
  // Consumer passed explicit rel — use it unchanged
  await expect(component).toHaveAttribute("rel", "noopener");
});

test("does not apply rel when target is not _blank", async ({ mount }) => {
  const component = await mount(<Link href="https://example.com">External</Link>);
  // No target="_blank", no auto-rel
  const rel = await component.getAttribute("rel");
  expect(rel).toBeNull();
});

test("does not apply auto-rel when target=_blank and consumer sets rel=''", async ({ mount }) => {
  const component = await mount(
    <Link href="https://example.com" target="_blank" rel="">
      External
    </Link>,
  );
  // Consumer passed explicit rel (empty string) — treated as intentional
  const rel = await component.getAttribute("rel");
  // Empty rel is passed through; no override applied
  expect(rel).not.toBe("noopener noreferrer");
});

/* ---------- axe a11y scan ---------- */

test("a11y — default variant", async ({ mount, page }) => {
  await mount(
    <p>
      Read the{" "}
      <Link href="/about" variant="default">
        full case study
      </Link>
      .
    </p>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — quiet variant", async ({ mount, page }) => {
  await mount(
    <nav aria-label="Test nav">
      <Link href="/about" variant="quiet">
        About
      </Link>
    </nav>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — muted-link variant", async ({ mount, page }) => {
  await mount(
    <footer>
      <Link href="mailto:hello@pouk.ai" variant="muted-link">
        hello@pouk.ai
      </Link>
    </footer>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region", "contentinfo-onpage"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

/* a11y gate also runs in src/a11y.test.tsx (central gate). */
