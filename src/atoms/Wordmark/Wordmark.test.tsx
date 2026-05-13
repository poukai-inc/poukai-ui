import { test, expect } from "@playwright/experimental-ct-react";
import { Wordmark } from "./Wordmark";

test("renders with default height", async ({ mount }) => {
  const component = await mount(<Wordmark />);
  await expect(component.locator("svg")).toBeVisible();
  await expect(component.locator("svg")).toHaveAttribute("aria-hidden", "true");
});

test("respects custom height", async ({ mount }) => {
  const component = await mount(<Wordmark height={128} />);
  const svg = component.locator("svg");
  await expect(svg).toHaveCSS("height", "128px");
});

test("announces accessible label", async ({ mount }) => {
  const component = await mount(<Wordmark label="Poukai design" />);
  await expect(component.getByText("Poukai design")).toBeAttached();
});

test("inherits color via currentColor", async ({ mount }) => {
  const component = await mount(<Wordmark style={{ color: "rgb(255, 0, 0)" }} />);
  await expect(component.locator("svg")).toHaveCSS("fill", "rgb(255, 0, 0)");
});

test("renders inlined path geometry (no external symbol reference)", async ({ mount }) => {
  const component = await mount(<Wordmark />);
  // Geometry is inlined; at least one <path> must render. Catches the
  // previous regression where the component referenced an undefined
  // <symbol> via <use href="#…"/> and rendered empty.
  const paths = component.locator("svg path");
  await expect(paths.first()).toBeAttached();
  const count = await paths.count();
  if (count < 6) {
    throw new Error(
      `Expected the wordmark to render multiple paths (mark + letters), got ${count}.`,
    );
  }
});
