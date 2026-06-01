import { test, expect } from "@playwright/experimental-ct-react";
import { Stat } from "./Stat";

test("renders value and caption", async ({ mount }) => {
  const component = await mount(
    <Stat value="85%" caption="of AI pilots never reach production." />,
  );
  await expect(component.getByText("85%")).toBeVisible();
  await expect(component.getByText("of AI pilots never reach production.")).toBeVisible();
});

test("renders icon in an aria-hidden wrapper when provided", async ({ mount }) => {
  const component = await mount(
    <Stat
      icon={<svg data-testid="stat-icon" width={24} height={24} viewBox="0 0 24 24" />}
      value="3.2×"
      caption="faster delivery."
    />,
  );
  const iconWrapper = component.locator("span[aria-hidden='true']");
  await expect(iconWrapper).toHaveCount(1);
  await expect(iconWrapper.locator("[data-testid='stat-icon']")).toBeVisible();
});

test("omits the icon wrapper when no icon prop is passed", async ({ mount }) => {
  const component = await mount(<Stat value="85%" caption="of teams." />);
  await expect(component.locator("span[aria-hidden='true']")).toHaveCount(0);
});

test("renders source line when provided", async ({ mount }) => {
  const component = await mount(
    <Stat value="$300B" caption="annual AI spend." source="IDC, 2025" />,
  );
  await expect(component.getByText("IDC, 2025")).toBeVisible();
});

test("omits source line when not provided", async ({ mount }) => {
  const component = await mount(<Stat value="3.2×" caption="faster delivery." />);
  await expect(component.locator("span")).toHaveCount(2);
});

test("applies end alignment", async ({ mount }) => {
  const component = await mount(<Stat value="85%" caption="of teams." align="end" />);
  await expect(component).toHaveCSS("align-items", "flex-end");
});

test("forwards arbitrary props to the root element", async ({ mount }) => {
  const component = await mount(
    <Stat value="1" caption="thing." data-testid="stat-1" aria-label="metric" />,
  );
  await expect(component).toBeVisible();
  await expect(component).toHaveAttribute("data-testid", "stat-1");
  await expect(component).toHaveAttribute("aria-label", "metric");
});
