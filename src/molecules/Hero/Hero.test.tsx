import { test, expect } from "@playwright/experimental-ct-react";
import { Hero } from "./Hero";

test("renders title in an h1 by default", async ({ mount }) => {
  const component = await mount(<Hero title="Close the gap." lede="A lede." />);
  await expect(component.locator("h1")).toHaveText("Close the gap.");
});

test("renders title in the requested element", async ({ mount }) => {
  const component = await mount(<Hero titleAs="h2" title="Section heading" lede="A lede." />);
  await expect(component.locator("h2")).toHaveText("Section heading");
  await expect(component.locator("h1")).toHaveCount(0);
});

test("renders the lede in a p.lede", async ({ mount }) => {
  const component = await mount(<Hero title="Heading" lede="The lede copy goes here." />);
  const lede = component.locator("p.lede");
  await expect(lede).toHaveText("The lede copy goes here.");
});

test("omits status slot when not provided", async ({ mount }) => {
  const component = await mount(<Hero title="Heading" lede="Lede." />);
  // Only h1 + p should be present at the root level.
  await expect(component.getByRole("heading", { level: 1 })).toBeVisible();
});

test("renders status and cta slots when provided", async ({ mount }) => {
  const component = await mount(
    <Hero
      title="Heading"
      lede="Lede."
      status={<span data-testid="status">Status</span>}
      cta={
        <a data-testid="cta" href="#">
          CTA
        </a>
      }
    />,
  );
  await expect(component.locator("[data-testid='status']")).toBeVisible();
  await expect(component.locator("[data-testid='cta']")).toBeVisible();
});

test("forwards arbitrary props to the root section", async ({ mount }) => {
  const component = await mount(<Hero title="H" lede="L" data-testid="hero" aria-labelledby="x" />);
  await expect(component).toHaveAttribute("data-testid", "hero");
  await expect(component).toHaveAttribute("aria-labelledby", "x");
});
