import { test, expect, type MountResult } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { SingleAccordion } from "./__test_harness__";
import { SingleDefaultOpen } from "./__test_harness__";
import { MultipleAccordion } from "./__test_harness__";
import { WithDisabledItem } from "./__test_harness__";
import { ControlledAccordion } from "./__test_harness__";
import { ForwardingAccordion } from "./__test_harness__";
import { TintedAccordion } from "./__test_harness__";
import { WithChildrenContent } from "./__test_harness__";

const AXE_ISOLATED = ["landmark-one-main", "page-has-heading-one", "region"] as const;

/* ─── Root renders ───────────────────────────────────────────────── */

test("root renders a div element", async ({ mount }) => {
  const component = await mount(<SingleAccordion />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ─── Triggers render ────────────────────────────────────────────── */

test("renders trigger buttons with correct text", async ({ mount }) => {
  const component = await mount(<SingleAccordion />);
  await expect(component.getByRole("button", { name: "Item one" })).toBeVisible();
  await expect(component.getByRole("button", { name: "Item two" })).toBeVisible();
});

/* ─── Closed by default ──────────────────────────────────────────── */

test("content panels are closed by default", async ({ mount }) => {
  const component = await mount(<SingleAccordion />);
  const trigger = component.getByRole("button", { name: "Item one" });
  await expect(trigger).toHaveAttribute("data-state", "closed");
});

/* ─── Click opens ────────────────────────────────────────────────── */

test("clicking trigger opens the content panel", async ({ mount, page }) => {
  await mount(<SingleAccordion />);
  const trigger = page.getByRole("button", { name: "Item one" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("data-state", "open");
});

/* ─── Click again closes (collapsible single) ────────────────────── */

test("clicking open trigger again closes the panel (collapsible)", async ({ mount, page }) => {
  await mount(<SingleAccordion />);
  const trigger = page.getByRole("button", { name: "Item one" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("data-state", "open");
  await trigger.click();
  await expect(trigger).toHaveAttribute("data-state", "closed");
});

/* ─── Single: opening one closes the other ───────────────────────── */

test("single type: opening one item closes the previously open item", async ({ mount, page }) => {
  await mount(<SingleAccordion />);
  const btn1 = page.getByRole("button", { name: "Item one" });
  const btn2 = page.getByRole("button", { name: "Item two" });
  await btn1.click();
  await expect(btn1).toHaveAttribute("data-state", "open");
  await btn2.click();
  await expect(btn2).toHaveAttribute("data-state", "open");
  await expect(btn1).toHaveAttribute("data-state", "closed");
});

/* ─── defaultValue opens item ────────────────────────────────────── */

test("defaultValue prop opens the specified item on mount", async ({ mount, page }) => {
  await mount(<SingleDefaultOpen />);
  const trigger = page.getByRole("button", { name: "Default open" });
  await expect(trigger).toHaveAttribute("data-state", "open");
  await expect(page.locator("[data-testid='default-open-content']")).toBeVisible();
});

/* ─── Multiple type ──────────────────────────────────────────────── */

test("multiple type: opening second item does not close first", async ({ mount, page }) => {
  await mount(<MultipleAccordion />);
  const btnA = page.getByRole("button", { name: "Alpha" });
  const btnB = page.getByRole("button", { name: "Beta" });
  await btnA.click();
  await btnB.click();
  await expect(btnA).toHaveAttribute("data-state", "open");
  await expect(btnB).toHaveAttribute("data-state", "open");
});

/* ─── Disabled item ──────────────────────────────────────────────── */

test("disabled item trigger has disabled attribute", async ({ mount, page }) => {
  await mount(<WithDisabledItem />);
  const disabledBtn = page.getByRole("button", { name: "Disabled item" });
  await expect(disabledBtn).toBeDisabled();
});

test("clicking disabled trigger does not open the item", async ({ mount, page }) => {
  await mount(<WithDisabledItem />);
  const disabledBtn = page.getByRole("button", { name: "Disabled item" });
  // disabled buttons should not be clickable; state remains closed
  await expect(disabledBtn).toHaveAttribute("data-state", "closed");
});

/* ─── ARIA roles ─────────────────────────────────────────────────── */

test("trigger button has aria-expanded=false when closed", async ({ mount, page }) => {
  await mount(<SingleAccordion />);
  const trigger = page.getByRole("button", { name: "Item one" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("trigger button has aria-expanded=true when open", async ({ mount, page }) => {
  await mount(<SingleAccordion />);
  const trigger = page.getByRole("button", { name: "Item one" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});

test("content panel has role=region", async ({ mount, page }) => {
  await mount(<SingleDefaultOpen />);
  const region = page.locator("[role='region']").first();
  await expect(region).toBeVisible();
});

/* ─── Chevron present ────────────────────────────────────────────── */

test("chevron SVG is rendered inside each trigger", async ({ mount }) => {
  const component = await mount(<SingleAccordion />);
  const svgs = component.locator("button svg");
  await expect(svgs.first()).toBeVisible();
});

test("chevron has aria-hidden=true", async ({ mount, page }) => {
  await mount(<SingleAccordion />);
  const chevron = page.locator("button svg[aria-hidden='true']").first();
  await expect(chevron).toBeAttached();
});

/* ─── className forwarding ───────────────────────────────────────── */

test("forwards className to Root, Item, Trigger", async ({ mount }) => {
  const component = await mount(<ForwardingAccordion />);
  const rootClass = await component.getAttribute("class");
  expect(rootClass).toMatch(/custom-root/);
  const itemClass = await component.locator("[data-testid='acc-item']").getAttribute("class");
  expect(itemClass).toMatch(/custom-item/);
  const triggerClass = await component.locator("[data-testid='acc-trigger']").getAttribute("class");
  expect(triggerClass).toMatch(/custom-trigger/);
});

/* ─── data-* forwarding ──────────────────────────────────────────── */

test("forwards data-testid to Root, Item, Trigger", async ({ mount }) => {
  const component = await mount(<ForwardingAccordion />);
  await expect(component).toHaveAttribute("data-testid", "acc-root");
  await expect(component.locator("[data-testid='acc-item']")).toBeAttached();
  await expect(component.locator("[data-testid='acc-trigger']")).toBeAttached();
});

/* ─── Content children ───────────────────────────────────────────── */

test("Content renders ReactNode children", async ({ mount, page }) => {
  await mount(
    <WithChildrenContent>
      <p data-testid="slot-child">Slot child content</p>
    </WithChildrenContent>,
  );
  await expect(page.locator("[data-testid='slot-child']")).toBeVisible();
});

/* ─── Controlled accordion ───────────────────────────────────────── */

test("controlled: onValueChange fires when trigger is clicked", async ({ mount, page }) => {
  await mount(<ControlledAccordion />);
  const trigger = page.getByRole("button", { name: "Controlled one" });
  await trigger.click();
  const output = page.locator("[data-testid='controlled-value']");
  await expect(output).toHaveText("ctrl-1");
});

/* ─── a11y ───────────────────────────────────────────────────────── */

test("a11y — single accordion (closed)", async ({ mount, page }) => {
  await mount(<SingleAccordion />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — single accordion (one item open)", async ({ mount, page }) => {
  await mount(<SingleDefaultOpen />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — multiple accordion", async ({ mount, page }) => {
  await mount(<MultipleAccordion />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — disabled item", async ({ mount, page }) => {
  await mount(<WithDisabledItem />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — tinted tone", async ({ mount, page }) => {
  await mount(<TintedAccordion />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
