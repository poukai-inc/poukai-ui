import { test, expect } from "@playwright/experimental-ct-react";
import { Header } from "./Header";
import { NavLink } from "../../molecules/NavLink";
import { Button } from "../../atoms/Button";

/* ── Brand slot ────────────────────────────────────────────────── */

test("renders a Wordmark by default in the brand slot", async ({ mount }) => {
  const component = await mount(<Header homeHref="/" />);
  // Wordmark renders an SVG; verify the brand anchor is present
  const brand = component.locator('a[aria-label="Poukai — home"]');
  await expect(brand).toBeVisible();
  await expect(brand).toHaveAttribute("href", "/");
});

test("brand anchor has aria-label Poukai — home", async ({ mount }) => {
  const component = await mount(<Header homeHref="/" />);
  await expect(component.locator('a[aria-label="Poukai — home"]')).toHaveAttribute(
    "aria-label",
    "Poukai — home",
  );
});

test("custom logo prop replaces Wordmark in the brand slot", async ({ mount }) => {
  const component = await mount(
    <Header homeHref="/" logo={<span data-testid="custom-logo">Acme</span>} />,
  );
  await expect(component.locator('[data-testid="custom-logo"]')).toBeVisible();
  await expect(component.locator('[data-testid="custom-logo"]')).toHaveText("Acme");
});

test("homeHref prop is forwarded to the brand anchor", async ({ mount }) => {
  const component = await mount(<Header homeHref="/dashboard" />);
  await expect(component.locator('a[aria-label="Poukai — home"]')).toHaveAttribute(
    "href",
    "/dashboard",
  );
});

/* ── Nav slot ──────────────────────────────────────────────────── */

test("renders Header.Nav as a <nav> element", async ({ mount }) => {
  const component = await mount(
    <Header homeHref="/">
      <Header.Nav>
        <li>
          <NavLink href="/about">About</NavLink>
        </li>
      </Header.Nav>
    </Header>,
  );
  await expect(component.locator("nav")).toBeVisible();
});

test("Header.Nav has default aria-label Primary", async ({ mount }) => {
  const component = await mount(
    <Header homeHref="/">
      <Header.Nav>
        <li>
          <NavLink href="/about">About</NavLink>
        </li>
      </Header.Nav>
    </Header>,
  );
  await expect(component.locator("nav")).toHaveAttribute("aria-label", "Primary");
});

test("Header.Nav aria-label is overridable", async ({ mount }) => {
  const component = await mount(
    <Header homeHref="/">
      <Header.Nav aria-label="Main navigation">
        <li>
          <NavLink href="/about">About</NavLink>
        </li>
      </Header.Nav>
    </Header>,
  );
  await expect(component.locator("nav")).toHaveAttribute("aria-label", "Main navigation");
});

test("NavLink children render inside Header.Nav", async ({ mount }) => {
  const component = await mount(
    <Header homeHref="/">
      <Header.Nav>
        <li>
          <NavLink href="/why-ai">Why AI</NavLink>
        </li>
        <li>
          <NavLink href="/roles" active>
            Roles
          </NavLink>
        </li>
      </Header.Nav>
    </Header>,
  );
  await expect(component.locator('a[href="/why-ai"]')).toHaveText("Why AI");
  await expect(component.locator('a[href="/roles"]')).toHaveText("Roles");
  await expect(component.locator('a[href="/roles"]')).toHaveAttribute("aria-current", "page");
});

/* ── Actions slot ──────────────────────────────────────────────── */

test("renders Header.Actions children", async ({ mount }) => {
  const component = await mount(
    <Header homeHref="/">
      <Header.Actions>
        <Button asChild variant="primary">
          <a href="mailto:hello@pouk.ai" data-testid="cta">
            Contact
          </a>
        </Button>
      </Header.Actions>
    </Header>,
  );
  await expect(component.locator('[data-testid="cta"]')).toBeVisible();
  await expect(component.locator('[data-testid="cta"]')).toHaveText("Contact");
});

test("Header.Actions renders multiple children", async ({ mount }) => {
  const component = await mount(
    <Header homeHref="/">
      <Header.Actions>
        <Button variant="ghost" data-testid="login">
          Log in
        </Button>
        <Button variant="primary" data-testid="signup">
          Get started
        </Button>
      </Header.Actions>
    </Header>,
  );
  await expect(component.locator('[data-testid="login"]')).toBeVisible();
  await expect(component.locator('[data-testid="signup"]')).toBeVisible();
});

/* ── Semantic HTML ─────────────────────────────────────────────── */

test("root element is a <header>", async ({ mount }) => {
  const component = await mount(<Header homeHref="/" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("header");
});

/* ── Variants ──────────────────────────────────────────────────── */

test("bordered prop adds bordered class", async ({ mount }) => {
  const component = await mount(<Header homeHref="/" bordered />);
  await expect(component).toHaveClass(/bordered/);
});

test("no bordered class by default", async ({ mount }) => {
  const component = await mount(<Header homeHref="/" />);
  await expect(component).not.toHaveClass(/bordered/);
});

test("sticky prop adds sticky class", async ({ mount }) => {
  // When sticky is true, Header renders a fragment with a sentinel + <header>,
  // so `component` is the fragment wrapper. Target the inner <header> directly.
  const component = await mount(<Header homeHref="/" sticky />);
  await expect(component.locator("header")).toHaveClass(/sticky/);
});

test("constrained prop adds constrained class", async ({ mount }) => {
  const component = await mount(<Header homeHref="/" constrained />);
  await expect(component).toHaveClass(/constrained/);
});

/* ── ref / className / data-* forwarding ──────────────────────── */

test("forwards className to root header element", async ({ mount }) => {
  const component = await mount(<Header homeHref="/" className="custom-header" />);
  await expect(component).toHaveClass(/custom-header/);
});

test("forwards data-* attributes to root header element", async ({ mount }) => {
  const component = await mount(<Header homeHref="/" data-testid="header-root" />);
  await expect(component).toHaveAttribute("data-testid", "header-root");
});

test("forwards aria-* attributes to root header element", async ({ mount }) => {
  const component = await mount(<Header homeHref="/" aria-label="Site header" />);
  await expect(component).toHaveAttribute("aria-label", "Site header");
});

test("ref forwarding — root element has data-testid via prop spread", async ({ mount, page }) => {
  const component = await mount(<Header homeHref="/" data-testid="ref-header" />);
  await expect(component).toHaveAttribute("data-testid", "ref-header");
  await expect(page.locator('[data-testid="ref-header"]')).toBeVisible();
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
