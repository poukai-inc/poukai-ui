import { test, expect } from "@playwright/experimental-ct-react";
import { PrincipleList } from "./PrincipleList";
import { Principle } from "../../molecules/Principle";
import { TwoPrinciples } from "./__test_harness__";

/* ── Rendering ─────────────────────────────────────────────── */

test("renders heading via Section title slot", async ({ mount }) => {
  const component = await mount(<TwoPrinciples />);
  await expect(component.getByRole("heading", { level: 2 })).toHaveText("Our principles.");
});

test("renders both Principle children", async ({ mount }) => {
  const component = await mount(<TwoPrinciples />);
  await expect(component.getByRole("heading", { level: 3 })).toHaveCount(2);
  await expect(
    component.getByRole("heading", { level: 3, name: "First principle." }),
  ).toBeVisible();
  await expect(
    component.getByRole("heading", { level: 3, name: "Second principle." }),
  ).toBeVisible();
});

test("wraps children in an ordered list", async ({ mount }) => {
  const component = await mount(<TwoPrinciples />);
  await expect(component.locator("ol")).toBeVisible();
  await expect(component.locator("ol li")).toHaveCount(2);
});

test("first list item has no divider class", async ({ mount }) => {
  const component = await mount(<TwoPrinciples />);
  const items = component.locator("ol li");
  const firstClasses = await items.nth(0).getAttribute("class");
  // first item must NOT carry the itemDivider class token
  expect(firstClasses).not.toContain("itemDivider");
});

test("second list item carries divider class", async ({ mount }) => {
  const component = await mount(<TwoPrinciples />);
  const items = component.locator("ol li");
  const secondClasses = await items.nth(1).getAttribute("class");
  expect(secondClasses).toContain("itemDivider");
});

test("renders eyebrow when provided", async ({ mount }) => {
  const component = await mount(
    <PrincipleList eyebrow="01 · Approach" heading="The rules.">
      <Principle numeral="i." title="A.">
        <p>Body.</p>
      </Principle>
      <Principle numeral="ii." title="B.">
        <p>Body.</p>
      </Principle>
    </PrincipleList>,
  );
  await expect(component.getByText("01 · Approach")).toBeVisible();
});

test("renders lede when provided", async ({ mount }) => {
  const component = await mount(
    <PrincipleList heading="The rules." lede="Supporting copy.">
      <Principle numeral="i." title="A.">
        <p>Body.</p>
      </Principle>
      <Principle numeral="ii." title="B.">
        <p>Body.</p>
      </Principle>
    </PrincipleList>,
  );
  await expect(component.getByText("Supporting copy.")).toBeVisible();
});

/* ── Vertical layout — 5 items ─────────────────────────────── */

test("renders five children in order", async ({ mount }) => {
  const component = await mount(
    <PrincipleList heading="Five.">
      <Principle numeral="i." title="One.">
        <p>A.</p>
      </Principle>
      <Principle numeral="ii." title="Two.">
        <p>B.</p>
      </Principle>
      <Principle numeral="iii." title="Three.">
        <p>C.</p>
      </Principle>
      <Principle numeral="iv." title="Four.">
        <p>D.</p>
      </Principle>
      <Principle numeral="v." title="Five.">
        <p>E.</p>
      </Principle>
    </PrincipleList>,
  );
  await expect(component.locator("ol li")).toHaveCount(5);
  // Items 2-5 all carry divider class
  for (let i = 1; i < 5; i++) {
    const cls = await component.locator("ol li").nth(i).getAttribute("class");
    expect(cls).toContain("itemDivider");
  }
});

/* ── Prop forwarding ───────────────────────────────────────── */

test("forwards className to root", async ({ mount }) => {
  const component = await mount(
    <PrincipleList heading="H." className="custom-root">
      <Principle numeral="i." title="A.">
        <p>B.</p>
      </Principle>
      <Principle numeral="ii." title="C.">
        <p>D.</p>
      </Principle>
    </PrincipleList>,
  );
  const classes = await component.getAttribute("class");
  expect(classes).toContain("custom-root");
});

test("forwards data-* attributes to root", async ({ mount }) => {
  const component = await mount(
    <PrincipleList heading="H." data-testid="pl-root">
      <Principle numeral="i." title="A.">
        <p>B.</p>
      </Principle>
      <Principle numeral="ii." title="C.">
        <p>D.</p>
      </Principle>
    </PrincipleList>,
  );
  await expect(component).toHaveAttribute("data-testid", "pl-root");
});

test("forwards aria-* attributes to root", async ({ mount }) => {
  const component = await mount(
    <PrincipleList heading="H." aria-label="Principles section">
      <Principle numeral="i." title="A.">
        <p>B.</p>
      </Principle>
      <Principle numeral="ii." title="C.">
        <p>D.</p>
      </Principle>
    </PrincipleList>,
  );
  await expect(component).toHaveAttribute("aria-label", "Principles section");
});

/* ── size prop ─────────────────────────────────────────────── */

test('size="tight" passes through to Section root', async ({ mount }) => {
  const component = await mount(
    <PrincipleList heading="H." size="tight">
      <Principle numeral="i." title="A.">
        <p>B.</p>
      </Principle>
      <Principle numeral="ii." title="C.">
        <p>D.</p>
      </Principle>
    </PrincipleList>,
  );
  // Section applies sizeTight class when size="tight"
  const classes = await component.getAttribute("class");
  expect(classes).toContain("sizeTight");
});
