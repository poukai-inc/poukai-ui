import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Statement } from "./Statement";

test("renders statement text", async ({ mount }) => {
  const component = await mount(
    <Statement statement="Custom AI builds. Automations. Advisory engagements." />,
  );
  await expect(
    component.getByText("Custom AI builds. Automations. Advisory engagements."),
  ).toBeVisible();
});

test("renders supporting when provided", async ({ mount }) => {
  const component = await mount(
    <Statement
      statement="Custom AI builds."
      supporting="For teams who'd rather ship than speculate."
    />,
  );
  await expect(component.getByText("For teams who'd rather ship than speculate.")).toBeVisible();
});

test("does NOT render supporting element when omitted", async ({ mount }) => {
  const component = await mount(<Statement statement="Custom AI builds." />);
  const paragraphs = component.locator("p");
  await expect(paragraphs).toHaveCount(1);
});

test("adds hairline class when hairline=true", async ({ mount }) => {
  const component = await mount(<Statement statement="Custom AI builds." hairline />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/hairline/);
});

test("does NOT add hairline class when hairline=false (default)", async ({ mount }) => {
  const component = await mount(<Statement statement="Custom AI builds." />);
  const className = await component.getAttribute("class");
  expect(className).not.toMatch(/hairline/);
});

test("renders as div by default (as='p')", async ({ mount }) => {
  const component = await mount(<Statement statement="Custom AI builds." />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("renders as blockquote when as='blockquote'", async ({ mount }) => {
  const component = await mount(<Statement as="blockquote" statement="Custom AI builds." />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("blockquote");
});

test("forwards ref to root element", async ({ mount }) => {
  const component = await mount(
    <Statement statement="Custom AI builds." data-testid="statement-root" />,
  );
  await expect(component).toHaveAttribute("data-testid", "statement-root");
});

test("passes arbitrary props to root (data-testid, aria-*)", async ({ mount }) => {
  const component = await mount(
    <Statement statement="Custom AI builds." data-testid="stmt" aria-label="Editorial statement" />,
  );
  await expect(component).toHaveAttribute("data-testid", "stmt");
  await expect(component).toHaveAttribute("aria-label", "Editorial statement");
});

test("axe a11y: no violations on full variant", async ({ mount, page }) => {
  await mount(
    <Statement
      hairline
      statement={
        <>
          Custom AI builds. <em>Automations.</em> Advisory engagements.
        </>
      }
      supporting="For teams who'd rather ship than speculate."
    />,
  );
  // Suppress document-level best-practice rules that fire in isolated CT mounts
  // (no <main>, no <h1>) — same pattern as src/a11y.test.tsx.
  const results = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(results.violations).toEqual([]);
});
