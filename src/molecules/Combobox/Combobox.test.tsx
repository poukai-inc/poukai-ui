import { test, expect } from "@playwright/experimental-ct-react";
import { Combobox } from "./Combobox";
import { BASIC_OPTIONS } from "./__test_harness__";
import { ComboboxControlledHarness } from "./__test_harness__";
import { ComboboxUncontrolledHarness } from "./__test_harness__";
import { ComboboxFormHarness } from "./__test_harness__";
import { ComboboxGroupedHarness } from "./__test_harness__";
import { ComboboxCustomFilterHarness } from "./__test_harness__";

/* ---------- Root structure ---------- */

test("root element is a div", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

test("forwards ref and data-* props to root", async ({ mount }) => {
  const component = await mount(
    <Combobox options={BASIC_OPTIONS} aria-label="Fruit" data-testid="cb-root" />,
  );
  await expect(component).toHaveAttribute("data-testid", "cb-root");
});

test("merges consumer className onto root", async ({ mount }) => {
  const component = await mount(
    <Combobox options={BASIC_OPTIONS} aria-label="Fruit" className="my-combo" />,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/my-combo/);
});

/* ---------- Trigger ---------- */

test("trigger has role=combobox", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await expect(component.getByRole("combobox")).toBeVisible();
});

test("trigger shows placeholder when no value", async ({ mount }) => {
  const component = await mount(
    <Combobox options={BASIC_OPTIONS} placeholder="Pick one…" aria-label="Fruit" />,
  );
  await expect(component.getByRole("combobox")).toContainText("Pick one…");
});

test("trigger shows selected label when value is set (controlled)", async ({ mount }) => {
  const component = await mount(
    <Combobox options={BASIC_OPTIONS} value="banana" onValueChange={() => {}} aria-label="Fruit" />,
  );
  await expect(component.getByRole("combobox")).toContainText("Banana");
});

test("trigger aria-expanded is false when closed", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await expect(component.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
});

test("trigger aria-expanded is true when open", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").click();
  await expect(component.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
});

test("trigger is disabled when disabled prop is set", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} disabled aria-label="Fruit" />);
  await expect(component.getByRole("combobox")).toBeDisabled();
});

test("trigger has aria-invalid=true when invalid", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} invalid aria-label="Fruit" />);
  await expect(component.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
});

/* ---------- Popover opens/closes ---------- */

test("clicking trigger opens popover with listbox", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").click();
  await expect(component.getByRole("listbox")).toBeVisible();
});

test("clicking trigger again closes popover", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").click();
  await component.getByRole("combobox").click();
  await expect(component.getByRole("listbox")).not.toBeVisible();
});

test("search input is focused when popover opens", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").click();
  await expect(component.getByRole("searchbox")).toBeFocused();
});

/* ---------- Options ---------- */

test("all options are rendered in listbox", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").click();
  const options = component.getByRole("option");
  await expect(options).toHaveCount(BASIC_OPTIONS.length);
});

test("selected option has aria-selected=true", async ({ mount }) => {
  const component = await mount(
    <Combobox options={BASIC_OPTIONS} value="cherry" onValueChange={() => {}} aria-label="Fruit" />,
  );
  await component.getByRole("combobox").click();
  const cherryOpt = component.getByRole("option", { name: /Cherry/ });
  await expect(cherryOpt).toHaveAttribute("aria-selected", "true");
});

test("non-selected options have aria-selected=false", async ({ mount }) => {
  const component = await mount(
    <Combobox options={BASIC_OPTIONS} value="cherry" onValueChange={() => {}} aria-label="Fruit" />,
  );
  await component.getByRole("combobox").click();
  const appleOpt = component.getByRole("option", { name: /Apple/ });
  await expect(appleOpt).toHaveAttribute("aria-selected", "false");
});

/* ---------- Selection ---------- */

test("clicking an option calls onValueChange and closes popover", async ({ mount }) => {
  const values: string[] = [];
  const component = await mount(
    <Combobox
      options={BASIC_OPTIONS}
      value=""
      onValueChange={(v) => values.push(v)}
      aria-label="Fruit"
    />,
  );
  await component.getByRole("combobox").click();
  await component.getByRole("option", { name: "Apple" }).click();
  expect(values).toContain("apple");
  await expect(component.getByRole("listbox")).not.toBeVisible();
});

test("after selecting, trigger shows selected label", async ({ mount }) => {
  const component = await mount(<ComboboxControlledHarness />);
  await component.getByRole("combobox").click();
  await component.getByRole("option", { name: "Banana" }).click();
  await expect(component.getByRole("combobox")).toContainText("Banana");
});

test("selected value is reflected in data-testid span", async ({ mount }) => {
  const component = await mount(<ComboboxControlledHarness />);
  await component.getByRole("combobox").click();
  await component.getByRole("option", { name: "Cherry" }).click();
  await expect(component.getByTestId("selected-value")).toHaveText("cherry");
});

/* ---------- Search / filter ---------- */

test("typing in search input filters options", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").click();
  await component.getByRole("searchbox").fill("ban");
  const options = component.getByRole("option");
  await expect(options).toHaveCount(1);
  await expect(options.first()).toContainText("Banana");
});

test("empty state message when filter matches nothing", async ({ mount }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").click();
  await component.getByRole("searchbox").fill("xyz");
  await expect(component.getByRole("option", { name: /No options found/ })).toBeVisible();
});

test("custom filter is applied", async ({ mount }) => {
  const component = await mount(<ComboboxCustomFilterHarness />);
  await component.getByRole("combobox").click();
  // "Ban" prefix matches Banana but not Apple or Cherry
  await component.getByRole("searchbox").fill("Ban");
  const options = component.getByRole("option");
  await expect(options).toHaveCount(1);
  await expect(options.first()).toContainText("Banana");
});

/* ---------- Keyboard ---------- */

test("Enter key on trigger opens popover", async ({ mount, page }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").focus();
  await page.keyboard.press("Enter");
  await expect(component.getByRole("listbox")).toBeVisible();
});

test("ArrowDown on trigger opens popover", async ({ mount, page }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").focus();
  await page.keyboard.press("ArrowDown");
  await expect(component.getByRole("listbox")).toBeVisible();
});

test("Escape in search closes popover and returns focus to trigger", async ({ mount, page }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").click();
  await expect(component.getByRole("listbox")).toBeVisible();
  // Explicit focus — Webkit doesn't always honour auto-focus rAF in CT.
  await component.getByRole("searchbox").focus();
  await page.keyboard.press("Escape");
  await expect(component.getByRole("listbox")).not.toBeVisible();
  await expect(component.getByRole("combobox")).toBeFocused();
});

test("ArrowDown moves focus through options", async ({ mount, page }) => {
  const component = await mount(<Combobox options={BASIC_OPTIONS} aria-label="Fruit" />);
  await component.getByRole("combobox").click();
  await component.getByRole("searchbox").focus();
  await page.keyboard.press("ArrowDown");
  // First option should have data-focused attribute
  const firstOpt = component.getByRole("option").first();
  await expect(firstOpt).toHaveAttribute("data-focused", "");
});

test("Enter on focused option selects it", async ({ mount, page }) => {
  const values: string[] = [];
  const component = await mount(
    <Combobox
      options={BASIC_OPTIONS}
      value=""
      onValueChange={(v) => values.push(v)}
      aria-label="Fruit"
    />,
  );
  await component.getByRole("combobox").click();
  await component.getByRole("searchbox").focus();
  await page.keyboard.press("ArrowDown"); // focus first option (Apple)
  await page.keyboard.press("Enter");
  expect(values).toContain("apple");
});

/* ---------- Grouped options ---------- */

test("grouped options render group roles", async ({ mount }) => {
  const component = await mount(<ComboboxGroupedHarness />);
  await component.getByRole("combobox").click();
  const groups = component.locator('[role="group"]');
  await expect(groups).toHaveCount(2);
});

test("grouped options are all rendered", async ({ mount }) => {
  const component = await mount(<ComboboxGroupedHarness />);
  await component.getByRole("combobox").click();
  const options = component.getByRole("option");
  await expect(options).toHaveCount(4);
});

/* ---------- Hidden form input ---------- */

test("hidden input has correct name and initial value", async ({ mount }) => {
  const component = await mount(<ComboboxFormHarness />);
  const hidden = component.locator('input[type="hidden"][name="fruit"]');
  await expect(hidden).toHaveAttribute("name", "fruit");
});

/* ---------- Uncontrolled ---------- */

test("uncontrolled: defaultValue pre-selects option", async ({ mount }) => {
  const component = await mount(<ComboboxUncontrolledHarness defaultValue="banana" />);
  await expect(component.getByRole("combobox")).toContainText("Banana");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
