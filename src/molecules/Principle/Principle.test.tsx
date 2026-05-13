import { test, expect } from "@playwright/experimental-ct-react";
import { Principle } from "./Principle";

test("renders numeral, title, and children", async ({ mount }) => {
  const component = await mount(
    <Principle numeral="i." title="Ship the smallest real thing.">
      <p>Production is the proving ground.</p>
    </Principle>,
  );
  await expect(component.getByText("i.")).toBeVisible();
  await expect(component.getByRole("heading", { level: 3 })).toHaveText(
    "Ship the smallest real thing.",
  );
  await expect(component.getByText("Production is the proving ground.")).toBeVisible();
});

test("numeral is aria-hidden (decorative)", async ({ mount }) => {
  const component = await mount(
    <Principle numeral="i." title="T">
      <p>Body.</p>
    </Principle>,
  );
  const numeral = component.getByText("i.");
  await expect(numeral).toHaveAttribute("aria-hidden", "true");
});

test("renders arbitrary children (lists)", async ({ mount }) => {
  const component = await mount(
    <Principle numeral="ii." title="T">
      <ul>
        <li>One</li>
        <li>Two</li>
      </ul>
    </Principle>,
  );
  await expect(component.locator("ul li")).toHaveCount(2);
});

test("forwards arbitrary props to the section root", async ({ mount }) => {
  const component = await mount(
    <Principle numeral="i." title="T" data-testid="principle" aria-labelledby="x">
      <p>Body.</p>
    </Principle>,
  );
  const root = component.locator("[data-testid='principle']");
  await expect(root).toHaveAttribute("aria-labelledby", "x");
});
