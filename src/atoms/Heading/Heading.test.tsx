import { test, expect } from "@playwright/experimental-ct-react";
import { Heading } from "./Heading";

/* ---------- Render ---------- */

test("renders text content", async ({ mount }) => {
  const component = await mount(<Heading>Why we build</Heading>);
  await expect(component.getByText("Why we build")).toBeVisible();
});

/* ---------- `as` prop — semantic element ---------- */

test("renders as <h2> by default", async ({ mount }) => {
  const component = await mount(<Heading>Default</Heading>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("h2");
});

test("renders as <h1> when as='h1'", async ({ mount }) => {
  const component = await mount(<Heading as="h1">Display</Heading>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("h1");
});

test("renders as <h3> when as='h3'", async ({ mount }) => {
  const component = await mount(<Heading as="h3">Subhead</Heading>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("h3");
});

test("renders as <h4> when as='h4'", async ({ mount }) => {
  const component = await mount(<Heading as="h4">Four</Heading>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("h4");
});

test("renders as <h5> when as='h5'", async ({ mount }) => {
  const component = await mount(<Heading as="h5">Five</Heading>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("h5");
});

test("renders as <h6> when as='h6'", async ({ mount }) => {
  const component = await mount(<Heading as="h6">Six</Heading>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("h6");
});

/* ---------- `size` prop — visual rank ---------- */

test("default size mirrors as: as='h4' applies sizeH4 class", async ({ mount }) => {
  const component = await mount(<Heading as="h4">Four</Heading>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/sizeH4/);
});

test("size overrides as for visual rank — as='h1' size='h3' renders <h1> with sizeH3 class", async ({
  mount,
}) => {
  const component = await mount(
    <Heading as="h1" size="h3">
      Title
    </Heading>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("h1");
  const className = await component.getAttribute("class");
  expect(className).toMatch(/sizeH3/);
  expect(className).not.toMatch(/sizeH1/);
});

test("size='h5' applies sizeH5 class regardless of as", async ({ mount }) => {
  const component = await mount(
    <Heading as="h2" size="h5">
      Small heading
    </Heading>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/sizeH5/);
});

/* ---------- Size → font-size regression guards ---------- */

test("size='h3' resolves to 18px (--fs-h3) computed font-size", async ({ mount }) => {
  const component = await mount(<Heading size="h3">Rank H3</Heading>);
  await expect(component).toHaveCSS("font-size", "18px");
});

test("size='h4' resolves to 16px (--fs-h4) computed font-size", async ({ mount }) => {
  const component = await mount(<Heading size="h4">Rank H4</Heading>);
  await expect(component).toHaveCSS("font-size", "16px");
});

test("size='h6' resolves to 14px (--fs-meta alias) computed font-size", async ({ mount }) => {
  const component = await mount(<Heading size="h6">Rank H6</Heading>);
  await expect(component).toHaveCSS("font-size", "14px");
});

/* ---------- Margin reset ---------- */

test("root has zero margin — consumer owns rhythm", async ({ mount }) => {
  const component = await mount(<Heading>Reset</Heading>);
  await expect(component).toHaveCSS("margin-top", "0px");
  await expect(component).toHaveCSS("margin-bottom", "0px");
});

/* ---------- className merge ---------- */

test("merges a consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(<Heading className="custom-heading-x">Label</Heading>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-heading-x/);
  expect(className).toMatch(/sizeH2/);
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards id to the root element (anchor links)", async ({ mount }) => {
  const component = await mount(
    <Heading as="h2" id="why-we-build">
      Why we build
    </Heading>,
  );
  await expect(component).toHaveAttribute("id", "why-we-build");
});

test("forwards data-* and aria-* props to the root element", async ({ mount }) => {
  const component = await mount(
    <Heading data-testid="hd-1" aria-label="Section title">
      Title
    </Heading>,
  );
  await expect(component).toHaveAttribute("data-testid", "hd-1");
  await expect(component).toHaveAttribute("aria-label", "Section title");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
