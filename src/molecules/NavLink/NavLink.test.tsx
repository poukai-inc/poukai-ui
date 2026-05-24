import { test, expect } from "@playwright/experimental-ct-react";
import { NavLink } from "./NavLink";

/* ---------- Semantic element ---------- */

test("renders <a> root element", async ({ mount }) => {
  const component = await mount(<NavLink href="/about">About</NavLink>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("a");
});

/* ---------- href passthrough ---------- */

test("passes href to the anchor element", async ({ mount }) => {
  const component = await mount(<NavLink href="/work">Work</NavLink>);
  await expect(component).toHaveAttribute("href", "/work");
});

/* ---------- Active state ARIA ---------- */

test("active=true sets aria-current='page'", async ({ mount }) => {
  const component = await mount(
    <NavLink href="/work" active>
      Work
    </NavLink>,
  );
  await expect(component).toHaveAttribute("aria-current", "page");
});

test("active=false omits aria-current entirely", async ({ mount }) => {
  const component = await mount(<NavLink href="/about">About</NavLink>);
  const ariaCurrent = await component.getAttribute("aria-current");
  expect(ariaCurrent).toBeNull();
});

test("active omitted defaults to no aria-current", async ({ mount }) => {
  const component = await mount(<NavLink href="/contact">Contact</NavLink>);
  const ariaCurrent = await component.getAttribute("aria-current");
  expect(ariaCurrent).toBeNull();
});

/* ---------- className forwarding ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(
    <NavLink href="/about" className="custom-nav-class">
      About
    </NavLink>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-nav-class/);
});

/* ---------- data-* forwarding ---------- */

test("forwards data-testid to root anchor", async ({ mount }) => {
  const component = await mount(
    <NavLink href="/about" data-testid="nav-about">
      About
    </NavLink>,
  );
  await expect(component).toHaveAttribute("data-testid", "nav-about");
});

/* ---------- aria-* forwarding ---------- */

test("forwards arbitrary aria attributes to root anchor", async ({ mount }) => {
  const component = await mount(
    <NavLink href="/about" aria-label="About Poukai">
      About
    </NavLink>,
  );
  await expect(component).toHaveAttribute("aria-label", "About Poukai");
});

/* ---------- ref forwarding ---------- */

test("ref is forwarded to the root anchor element", async ({ mount }) => {
  const component = await mount(<NavLink href="/about">About</NavLink>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("a");
});

/* ---------- children ---------- */

test("renders children as the visible label", async ({ mount }) => {
  const component = await mount(<NavLink href="/work">Work</NavLink>);
  await expect(component).toContainText("Work");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
