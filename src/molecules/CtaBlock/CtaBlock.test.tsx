import { test, expect } from "@playwright/experimental-ct-react";
import { CtaBlock } from "./CtaBlock";
import { Button } from "../../atoms/Button";

/* ---------- Rendering ---------- */

test("CtaBlock — renders heading and body", async ({ mount }) => {
  const component = await mount(
    <CtaBlock
      heading="Ready to start?"
      body="Senior-only teams."
      actions={<Button variant="primary">Get a demo</Button>}
    />,
  );
  await expect(component.getByRole("heading", { level: 2 })).toHaveText("Ready to start?");
  await expect(component.getByText("Senior-only teams.")).toBeVisible();
});

test("CtaBlock — renders actions slot", async ({ mount }) => {
  const component = await mount(
    <CtaBlock heading="Ready to start?" actions={<Button variant="primary">Get a demo</Button>} />,
  );
  await expect(component.getByRole("button", { name: "Get a demo" })).toBeVisible();
});

test("CtaBlock — body is optional; renders without it", async ({ mount }) => {
  const component = await mount(
    <CtaBlock heading="Start here." actions={<Button variant="primary">Begin</Button>} />,
  );
  await expect(component.getByRole("heading", { level: 2 })).toHaveText("Start here.");
  // No body paragraph should be rendered
  await expect(component.locator("p")).not.toBeVisible();
});

test("CtaBlock — headingAs overrides heading element", async ({ mount }) => {
  const component = await mount(
    <CtaBlock
      heading="Section CTA"
      headingAs="h3"
      actions={<Button variant="primary">Act</Button>}
    />,
  );
  await expect(component.getByRole("heading", { level: 3 })).toHaveText("Section CTA");
});

test("CtaBlock — headingAs h1", async ({ mount }) => {
  const component = await mount(
    <CtaBlock
      heading="Primary CTA"
      headingAs="h1"
      actions={<Button variant="primary">Act</Button>}
    />,
  );
  await expect(component.getByRole("heading", { level: 1 })).toHaveText("Primary CTA");
});

/* ---------- Orientation prop ---------- */

test("CtaBlock — orientation=stacked applies stacked class", async ({ mount }) => {
  const component = await mount(
    <CtaBlock
      orientation="stacked"
      heading="Stacked CTA"
      body="Body text."
      actions={<Button variant="primary">Act</Button>}
    />,
  );
  await expect(component).toHaveClass(/stacked/);
});

test("CtaBlock — orientation=horizontal applies horizontal class", async ({ mount }) => {
  const component = await mount(
    <CtaBlock
      orientation="horizontal"
      heading="Horizontal CTA"
      body="Body text."
      actions={<Button variant="primary">Act</Button>}
    />,
  );
  await expect(component).toHaveClass(/horizontal/);
});

test("CtaBlock — default orientation is stacked", async ({ mount }) => {
  const component = await mount(
    <CtaBlock heading="Default" actions={<Button variant="primary">Act</Button>} />,
  );
  await expect(component).toHaveClass(/stacked/);
});

/* ---------- Align prop ---------- */

test("CtaBlock — align=center applies alignCenter class", async ({ mount }) => {
  const component = await mount(
    <CtaBlock
      align="center"
      heading="Centered CTA"
      actions={<Button variant="primary">Act</Button>}
    />,
  );
  await expect(component).toHaveClass(/alignCenter/);
});

/* ---------- Ref forwarding ---------- */

test("CtaBlock — forwards ref to root div", async ({ mount, page }) => {
  await mount(
    <CtaBlock
      data-testid="ctablock-root"
      heading="Ref test"
      actions={<Button variant="primary">Act</Button>}
    />,
  );
  const el = page.getByTestId("ctablock-root");
  await expect(el).toBeVisible();
  const tagName = await el.evaluate((node) => node.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

/* ---------- className and data-* forwarding ---------- */

test("CtaBlock — forwards className via ...rest", async ({ mount }) => {
  const component = await mount(
    <CtaBlock
      heading="Class test"
      actions={<Button variant="primary">Act</Button>}
      className="custom-class"
    />,
  );
  await expect(component).toHaveClass(/custom-class/);
});

test("CtaBlock — forwards data-* attributes via ...rest", async ({ mount, page }) => {
  await mount(
    <CtaBlock
      heading="Data attr test"
      actions={<Button variant="primary">Act</Button>}
      data-testid="cta-data-test"
      data-section="footer"
    />,
  );
  const el = page.getByTestId("cta-data-test");
  await expect(el).toHaveAttribute("data-section", "footer");
});

/* ---------- Multiple actions ---------- */

test("CtaBlock — renders two actions in the actions slot", async ({ mount }) => {
  const component = await mount(
    <CtaBlock
      heading="Two actions"
      actions={
        <>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </>
      }
    />,
  );
  await expect(component.getByRole("button", { name: "Primary" })).toBeVisible();
  await expect(component.getByRole("button", { name: "Secondary" })).toBeVisible();
});
