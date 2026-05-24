import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { LinkList } from "./LinkList";

/* ---------- Root element ---------- */

test("root element is <div>", async ({ mount }) => {
  const component = await mount(
    <LinkList>
      <LinkList.Item href="/about">About</LinkList.Item>
    </LinkList>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- Semantic list structure ---------- */

test("renders a semantic <ul> containing <li> items", async ({ mount }) => {
  const component = await mount(
    <LinkList>
      <LinkList.Item href="/about">About</LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
    </LinkList>,
  );
  const ul = component.locator("ul");
  await expect(ul).toHaveCount(1);
  const items = component.locator("li");
  await expect(items).toHaveCount(2);
});

test("each item wraps a Link anchor", async ({ mount }) => {
  const component = await mount(
    <LinkList>
      <LinkList.Item href="/about">About</LinkList.Item>
    </LinkList>,
  );
  const anchor = component.locator("a[href='/about']");
  await expect(anchor).toHaveCount(1);
  await expect(anchor).toContainText("About");
});

/* ---------- Heading ---------- */

test("renders no heading element when heading prop is omitted", async ({ mount }) => {
  const component = await mount(
    <LinkList>
      <LinkList.Item href="/about">About</LinkList.Item>
    </LinkList>,
  );
  const headings = component.locator("h1,h2,h3,h4,h5,h6");
  await expect(headings).toHaveCount(0);
});

test("renders h3 by default when heading prop is provided", async ({ mount }) => {
  const component = await mount(
    <LinkList heading="Company">
      <LinkList.Item href="/about">About</LinkList.Item>
    </LinkList>,
  );
  const h3 = component.locator("h3");
  await expect(h3).toHaveCount(1);
  await expect(h3).toContainText("Company");
});

test("renders h2 when headingLevel={2}", async ({ mount }) => {
  const component = await mount(
    <LinkList heading="On this page" headingLevel={2}>
      <LinkList.Item href="#intro">Introduction</LinkList.Item>
    </LinkList>,
  );
  const h2 = component.locator("h2");
  await expect(h2).toHaveCount(1);
  await expect(h2).toContainText("On this page");
});

test("renders h4 when headingLevel={4}", async ({ mount }) => {
  const component = await mount(
    <LinkList heading="Resources" headingLevel={4}>
      <LinkList.Item href="/docs">Docs</LinkList.Item>
    </LinkList>,
  );
  const h4 = component.locator("h4");
  await expect(h4).toHaveCount(1);
});

/* ---------- current item ---------- */

test("current item has aria-current='page'", async ({ mount }) => {
  const component = await mount(
    <LinkList>
      <LinkList.Item href="/about" current>
        About
      </LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
    </LinkList>,
  );
  const currentLink = component.locator("a[aria-current='page']");
  await expect(currentLink).toHaveCount(1);
  await expect(currentLink).toContainText("About");
});

test("non-current items do not have aria-current", async ({ mount }) => {
  const component = await mount(
    <LinkList>
      <LinkList.Item href="/about">About</LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
    </LinkList>,
  );
  const currentLinks = component.locator("a[aria-current]");
  await expect(currentLinks).toHaveCount(0);
});

/* ---------- external link ---------- */

test("external item has target='_blank' and rel='noopener noreferrer'", async ({ mount }) => {
  const component = await mount(
    <LinkList>
      <LinkList.Item href="https://example.com" external>
        External
      </LinkList.Item>
    </LinkList>,
  );
  const anchor = component.locator("a[href='https://example.com']");
  await expect(anchor).toHaveAttribute("target", "_blank");
  await expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
});

test("external item includes visually-hidden new-tab text", async ({ mount }) => {
  const component = await mount(
    <LinkList>
      <LinkList.Item href="https://example.com" external>
        External
      </LinkList.Item>
    </LinkList>,
  );
  // The visually-hidden span is in the DOM even if not visible
  const anchor = component.locator("a[href='https://example.com']");
  await expect(anchor).toContainText("opens in new tab");
});

/* ---------- className + data-* forwarding ---------- */

test("merges consumer className on root element", async ({ mount }) => {
  const component = await mount(
    <LinkList className="my-list">
      <LinkList.Item href="/about">About</LinkList.Item>
    </LinkList>,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/my-list/);
});

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(
    <LinkList data-testid="footer-col">
      <LinkList.Item href="/about">About</LinkList.Item>
    </LinkList>,
  );
  await expect(component).toHaveAttribute("data-testid", "footer-col");
});

/* ---------- Ref forwarding ---------- */

test("ref is forwarded to the root <div>", async ({ mount }) => {
  const component = await mount(
    <LinkList>
      <LinkList.Item href="/about">About</LinkList.Item>
    </LinkList>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- a11y ---------- */

test("a11y — default (no heading)", async ({ mount, page }) => {
  await mount(
    <LinkList>
      <LinkList.Item href="/about">About</LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
      <LinkList.Item href="/writing">Writing</LinkList.Item>
    </LinkList>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with heading and divider", async ({ mount, page }) => {
  await mount(
    <LinkList heading="Company" headingLevel={3} divider>
      <LinkList.Item href="/about">About</LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
    </LinkList>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with current item", async ({ mount, page }) => {
  await mount(
    <LinkList>
      <LinkList.Item href="/about" current>
        About
      </LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
    </LinkList>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with external link", async ({ mount, page }) => {
  await mount(
    <LinkList>
      <LinkList.Item href="/about">About</LinkList.Item>
      <LinkList.Item href="https://example.com" external>
        External reference
      </LinkList.Item>
    </LinkList>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — size='md' TOC composition", async ({ mount, page }) => {
  await mount(
    <LinkList heading="On this page" headingLevel={2} size="md">
      <LinkList.Item href="#intro">Introduction</LinkList.Item>
      <LinkList.Item href="#anatomy" current>
        Anatomy
      </LinkList.Item>
      <LinkList.Item href="#tokens">Tokens</LinkList.Item>
    </LinkList>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
