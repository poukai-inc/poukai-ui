import { test, expect } from "@playwright/experimental-ct-react";
import { StatsSection } from "./StatsSection";
import { Stat } from "../../atoms/Stat";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const defaultStats = (
  <>
    <Stat value="12k" caption="Users" />
    <Stat value="99.9%" caption="Uptime" />
    <Stat value="200" caption="Customers" />
  </>
);

// ---------------------------------------------------------------------------
// Rendering: StatList composition
// ---------------------------------------------------------------------------

test("renders a section landmark", async ({ mount }) => {
  const component = await mount(<StatsSection>{defaultStats}</StatsSection>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("renders stat children", async ({ mount }) => {
  const component = await mount(<StatsSection>{defaultStats}</StatsSection>);
  await expect(component.getByText("12k")).toBeVisible();
  await expect(component.getByText("99.9%")).toBeVisible();
  await expect(component.getByText("200")).toBeVisible();
});

test("renders StatList with role=list", async ({ mount }) => {
  const component = await mount(<StatsSection>{defaultStats}</StatsSection>);
  await expect(component.locator('[role="list"]')).toBeVisible();
});

test("renders stat captions", async ({ mount }) => {
  const component = await mount(<StatsSection>{defaultStats}</StatsSection>);
  await expect(component.getByText("Users")).toBeVisible();
  await expect(component.getByText("Uptime")).toBeVisible();
  await expect(component.getByText("Customers")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Heading slot
// ---------------------------------------------------------------------------

test("renders heading as h2 when provided", async ({ mount }) => {
  const component = await mount(
    <StatsSection heading="By the numbers">{defaultStats}</StatsSection>,
  );
  const h2 = component.locator("h2");
  await expect(h2).toBeVisible();
  await expect(h2).toContainText("By the numbers");
});

test("does not render h2 when heading is omitted", async ({ mount }) => {
  const component = await mount(<StatsSection>{defaultStats}</StatsSection>);
  await expect(component.locator("h2")).toHaveCount(0);
});

test("section has aria-labelledby when heading provided", async ({ mount }) => {
  const component = await mount(
    <StatsSection heading="By the numbers">{defaultStats}</StatsSection>,
  );
  // Section wires aria-labelledby to the h2 it renders for the title prop.
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  // The h2 heading should contain the heading text.
  const h2 = component.locator("h2");
  await expect(h2).toBeVisible();
  await expect(h2).toContainText("By the numbers");
});

// ---------------------------------------------------------------------------
// fill variant
// ---------------------------------------------------------------------------

test("applies fill class when fill=true", async ({ mount }) => {
  const component = await mount(<StatsSection fill>{defaultStats}</StatsSection>);
  await expect(component).toHaveClass(/fill/);
});

test("does not apply fill class when fill=false", async ({ mount }) => {
  const component = await mount(<StatsSection>{defaultStats}</StatsSection>);
  await expect(component).not.toHaveClass(/fill/);
});

// ---------------------------------------------------------------------------
// dividers prop forwarding
// ---------------------------------------------------------------------------

test("passes dividers prop to StatList", async ({ mount }) => {
  const component = await mount(<StatsSection dividers>{defaultStats}</StatsSection>);
  // StatList applies a dividers class when dividers=true
  await expect(component.locator('[class*="dividers"]')).toBeVisible();
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <StatsSection className="custom-stats">{defaultStats}</StatsSection>,
  );
  await expect(component).toHaveClass(/custom-stats/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <StatsSection data-testid="stats-root">{defaultStats}</StatsSection>,
  );
  await expect(component).toHaveAttribute("data-testid", "stats-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <StatsSection aria-label="Key metrics">{defaultStats}</StatsSection>,
  );
  await expect(component).toHaveAttribute("aria-label", "Key metrics");
});
