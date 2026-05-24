import { test, expect } from "@playwright/experimental-ct-react";
import { Figure } from "./Figure";

/* ---------- Root element ---------- */

test("renders semantic <figure> root", async ({ mount }) => {
  const component = await mount(
    <Figure>
      <img src="https://placehold.co/400x300" alt="Test image" />
    </Figure>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figure");
});

/* ---------- Caption rendering ---------- */

test("renders <figcaption> when caption prop is provided", async ({ mount }) => {
  const component = await mount(
    <Figure caption="Photographer: Jane Doe">
      <img src="https://placehold.co/400x300" alt="Test image" />
    </Figure>,
  );
  const figcaption = component.locator("figcaption");
  await expect(figcaption).toHaveCount(1);
  await expect(figcaption).toContainText("Photographer: Jane Doe");
});

test("does not render <figcaption> when caption prop is absent", async ({ mount }) => {
  const component = await mount(
    <Figure>
      <img src="https://placehold.co/400x300" alt="Test image" />
    </Figure>,
  );
  await expect(component.locator("figcaption")).toHaveCount(0);
});

test("renders <figcaption> via Figure.Caption compound sub-component", async ({ mount }) => {
  const component = await mount(
    <Figure>
      <img src="https://placehold.co/400x300" alt="Test image" />
      <Figure.Caption>Photo by Jane Doe</Figure.Caption>
    </Figure>,
  );
  const figcaption = component.locator("figcaption");
  await expect(figcaption).toHaveCount(1);
  await expect(figcaption).toContainText("Photo by Jane Doe");
});

/* ---------- align prop ---------- */

test("default align='start' applies start text-align on figcaption", async ({ mount }) => {
  const component = await mount(
    <Figure caption="Caption text">
      <img src="https://placehold.co/400x300" alt="Test image" />
    </Figure>,
  );
  // Root has no alignCenter class by default
  const className = await component.getAttribute("class");
  expect(className).not.toMatch(/alignCenter/);
});

test("align='center' applies center alignment class to root", async ({ mount }) => {
  const component = await mount(
    <Figure align="center" caption="Caption text">
      <img src="https://placehold.co/400x300" alt="Test image" />
    </Figure>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/alignCenter/);
});

/* ---------- Ref, className, data-* forwarding ---------- */

test("merges consumer className onto root figure", async ({ mount }) => {
  const component = await mount(
    <Figure className="custom-figure">
      <img src="https://placehold.co/400x300" alt="Test image" />
    </Figure>,
  );
  await expect(component).toHaveClass(/custom-figure/);
});

test("forwards data-testid to root figure element", async ({ mount }) => {
  const component = await mount(
    <Figure data-testid="figure-root">
      <img src="https://placehold.co/400x300" alt="Test image" />
    </Figure>,
  );
  await expect(component).toHaveAttribute("data-testid", "figure-root");
});

test("forwards aria-label to root figure element", async ({ mount }) => {
  const component = await mount(
    <Figure aria-label="Team photo">
      <img src="https://placehold.co/400x300" alt="Test image" />
    </Figure>,
  );
  await expect(component).toHaveAttribute("aria-label", "Team photo");
});

/* ---------- Children ---------- */

test("renders children inside figure", async ({ mount }) => {
  const component = await mount(
    <Figure>
      <img src="https://placehold.co/400x300" alt="Sample content image" />
    </Figure>,
  );
  await expect(component.locator("img")).toHaveCount(1);
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
