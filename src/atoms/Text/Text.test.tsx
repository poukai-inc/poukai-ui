import { test, expect } from "@playwright/experimental-ct-react";
import { Text } from "./Text";

/* ---------- Render ---------- */

test("renders children", async ({ mount }) => {
  const component = await mount(<Text>Hello world</Text>);
  await expect(component.getByText("Hello world")).toBeVisible();
});

test("renders as <p> by default", async ({ mount }) => {
  const component = await mount(<Text>Default</Text>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("p");
});

/* ---------- `as` prop ---------- */

test("renders as <span> when as='span'", async ({ mount }) => {
  const component = await mount(<Text as="span">Inline</Text>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("span");
});

test("renders as <div> when as='div'", async ({ mount }) => {
  const component = await mount(<Text as="div">Div</Text>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("renders as <dt> when as='dt'", async ({ mount }) => {
  const component = await mount(<Text as="dt">Term</Text>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("dt");
});

test("renders as <dd> when as='dd'", async ({ mount }) => {
  const component = await mount(<Text as="dd">Definition</Text>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("dd");
});

test("renders as <li> when as='li'", async ({ mount }) => {
  const component = await mount(<Text as="li">Item</Text>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("li");
});

/* ---------- Sizes ---------- */

test('size="body" (default) applies the size-body class', async ({ mount }) => {
  const component = await mount(<Text>Default body</Text>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-body/);
});

test('size="lede" applies size-lede class and 36rem max-inline-size', async ({ mount }) => {
  const component = await mount(<Text size="lede">Lede paragraph</Text>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-lede/);
  await expect(component).toHaveCSS("max-inline-size", "576px"); /* 36rem at 16px root */
});

test('size="caption" applies the size-caption class', async ({ mount }) => {
  const component = await mount(<Text size="caption">Caption</Text>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-caption/);
});

test('size="micro" applies the size-micro class and 12px font-size', async ({ mount }) => {
  const component = await mount(<Text size="micro">Micro</Text>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-micro/);
  await expect(component).toHaveCSS("font-size", "12px");
});

test('size="micro" does NOT apply text-transform: uppercase — regression guard', async ({
  mount,
}) => {
  const component = await mount(<Text size="micro">lowercase footnote</Text>);
  await expect(component).toHaveCSS("text-transform", "none");
});

/* ---------- Tones ---------- */

test('tone="default" (default) applies the tone-default class', async ({ mount }) => {
  const component = await mount(<Text>Default tone</Text>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/tone-default/);
});

test('tone="muted" applies the tone-muted class', async ({ mount }) => {
  const component = await mount(<Text tone="muted">Muted tone</Text>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/tone-muted/);
});

test('tone="on-warm" applies the tone-on-warm class', async ({ mount }) => {
  const component = await mount(<Text tone="on-warm">On warm</Text>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/tone-on-warm/);
});

test('tone="on-warm-muted" applies the tone-on-warm-muted class', async ({ mount }) => {
  const component = await mount(<Text tone="on-warm-muted">On warm muted</Text>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/tone-on-warm-muted/);
});

/* ---------- Layout invariants ---------- */

test("margin is zero on the root — consumer owns rhythm", async ({ mount }) => {
  const component = await mount(<Text>Margin check</Text>);
  await expect(component).toHaveCSS("margin-top", "0px");
  await expect(component).toHaveCSS("margin-bottom", "0px");
});

/* ---------- className merge ---------- */

test("merges a consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(<Text className="custom-x">X</Text>);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/size-body/);
  expect(className).toMatch(/tone-default/);
  expect(className).toMatch(/custom-x/);
});

/* ---------- Arbitrary prop forwarding ---------- */

test("forwards data-* and aria-* props to the root", async ({ mount }) => {
  const component = await mount(
    <Text data-testid="copy" aria-label="Body paragraph">
      Forward
    </Text>,
  );
  await expect(component).toHaveAttribute("data-testid", "copy");
  await expect(component).toHaveAttribute("aria-label", "Body paragraph");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
