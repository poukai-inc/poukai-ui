import { test, expect } from "@playwright/experimental-ct-react";
import { StatusBadge } from "./StatusBadge";

test("renders available status with pulse", async ({ mount }) => {
  const component = await mount(<StatusBadge status="available">Open</StatusBadge>);
  await expect(component.getByText("Open")).toBeVisible();
  await expect(component.locator("[data-status='available']")).toBeVisible();
});

test("hides pulse on non-available status", async ({ mount }) => {
  const component = await mount(<StatusBadge status="closed">Closed</StatusBadge>);
  const dot = component.locator("[data-status='closed']");
  await expect(dot).toBeVisible();
  await expect(dot.locator("> span")).toHaveCount(0);
});
