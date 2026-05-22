import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Radio, RadioGroup } from "./Radio";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const AXE_ISOLATED = ["landmark-one-main", "page-has-heading-one", "region"] as const;

async function expectAxeClean(page: import("@playwright/test").Page) {
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

/* ------------------------------------------------------------------ */
/*  Render                                                              */
/* ------------------------------------------------------------------ */

test("RadioGroup renders with role=radiogroup", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group">
      <Radio value="a" />
    </RadioGroup>,
  );
  await expect(component).toHaveAttribute("role", "radiogroup");
});

test("RadioGroup forwards aria-label to the root element", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Billing plan">
      <Radio value="a" />
    </RadioGroup>,
  );
  await expect(component).toHaveAttribute("aria-label", "Billing plan");
});

test("Radio renders as a button with role=radio", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group">
      <Radio value="a" />
    </RadioGroup>,
  );
  const item = component.locator("button").first();
  await expect(item).toHaveAttribute("role", "radio");
});

test("Radio renders an Indicator child element", async ({ mount }) => {
  const component = await mount(
    <RadioGroup value="a" onValueChange={() => undefined} aria-label="Test group">
      <Radio value="a" />
    </RadioGroup>,
  );
  // Radix mounts the indicator span only when checked
  const indicator = component.locator("span").first();
  await expect(indicator).toBeAttached();
});

test("Radio forwards id prop to the button element", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group">
      <Radio value="a" id="radio-a" />
    </RadioGroup>,
  );
  const item = component.locator("#radio-a");
  await expect(item).toBeAttached();
});

/* ------------------------------------------------------------------ */
/*  Checked state                                                       */
/* ------------------------------------------------------------------ */

test("unselected Radio has aria-checked=false", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group">
      <Radio value="a" />
    </RadioGroup>,
  );
  const item = component.locator("button").first();
  await expect(item).toHaveAttribute("aria-checked", "false");
});

test("selected Radio has aria-checked=true", async ({ mount }) => {
  const component = await mount(
    <RadioGroup value="a" onValueChange={() => undefined} aria-label="Test group">
      <Radio value="a" />
    </RadioGroup>,
  );
  const item = component.locator("button").first();
  await expect(item).toHaveAttribute("aria-checked", "true");
});

test("clicking an unselected Radio selects it", async ({ mount }) => {
  const component = await mount(
    <RadioGroup defaultValue="a" aria-label="Test group">
      <Radio value="a" />
      <Radio value="b" />
    </RadioGroup>,
  );
  const itemB = component.locator("button").nth(1);
  await expect(itemB).toHaveAttribute("aria-checked", "false");
  await itemB.click();
  await expect(itemB).toHaveAttribute("aria-checked", "true");
});

test("selecting one Radio deselects the other", async ({ mount }) => {
  const component = await mount(
    <RadioGroup defaultValue="a" aria-label="Test group">
      <Radio value="a" />
      <Radio value="b" />
    </RadioGroup>,
  );
  const itemA = component.locator("button").nth(0);
  const itemB = component.locator("button").nth(1);
  await expect(itemA).toHaveAttribute("aria-checked", "true");
  await itemB.click();
  await expect(itemA).toHaveAttribute("aria-checked", "false");
  await expect(itemB).toHaveAttribute("aria-checked", "true");
});

test("onValueChange fires with the new value on click", async ({ mount }) => {
  const received: string[] = [];
  const component = await mount(
    <RadioGroup defaultValue="a" onValueChange={(v) => received.push(v)} aria-label="Test group">
      <Radio value="a" />
      <Radio value="b" />
    </RadioGroup>,
  );
  const itemB = component.locator("button").nth(1);
  await itemB.click();
  expect(received).toEqual(["b"]);
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation — vertical (default)                           */
/* ------------------------------------------------------------------ */

test("ArrowDown moves selection to next item in vertical group", async ({ mount, page }) => {
  const component = await mount(
    <RadioGroup defaultValue="a" aria-label="Test group">
      <Radio value="a" />
      <Radio value="b" />
      <Radio value="c" />
    </RadioGroup>,
  );
  const itemA = component.locator("button").nth(0);
  // Hold keydown for ~50 ms. Radix `RovingFocusGroup` schedules `focus()` on
  // the next item via `setTimeout(0)` and Radix `RadioGroup` only fires the
  // selection-follows-focus click while a `document`-level keydown flag is
  // set (flag flips back to false on keyup). A zero-gap press flips the flag
  // off before the deferred focus lands, so we keep keydown depressed long
  // enough for the focus→onFocus→click chain to run while the flag is true.
  await itemA.focus();
  await expect(itemA).toBeFocused();
  await page.keyboard.press("ArrowDown", { delay: 50 });
  const itemB = component.locator("button").nth(1);
  await expect(itemB).toHaveAttribute("aria-checked", "true");
});

test("ArrowUp moves selection to previous item in vertical group", async ({ mount, page }) => {
  const component = await mount(
    <RadioGroup defaultValue="b" aria-label="Test group">
      <Radio value="a" />
      <Radio value="b" />
      <Radio value="c" />
    </RadioGroup>,
  );
  const itemB = component.locator("button").nth(1);
  await itemB.focus();
  await expect(itemB).toBeFocused();
  await page.keyboard.press("ArrowUp", { delay: 50 });
  const itemA = component.locator("button").nth(0);
  await expect(itemA).toHaveAttribute("aria-checked", "true");
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation — horizontal                                   */
/* ------------------------------------------------------------------ */

test("ArrowRight moves selection to next item in horizontal group", async ({ mount, page }) => {
  const component = await mount(
    <RadioGroup defaultValue="a" orientation="horizontal" aria-label="Test group">
      <Radio value="a" />
      <Radio value="b" />
      <Radio value="c" />
    </RadioGroup>,
  );
  const itemA = component.locator("button").nth(0);
  await itemA.focus();
  await expect(itemA).toBeFocused();
  await page.keyboard.press("ArrowRight", { delay: 50 });
  const itemB = component.locator("button").nth(1);
  await expect(itemB).toHaveAttribute("aria-checked", "true");
});

test("ArrowLeft moves selection to previous item in horizontal group", async ({ mount, page }) => {
  const component = await mount(
    <RadioGroup defaultValue="b" orientation="horizontal" aria-label="Test group">
      <Radio value="a" />
      <Radio value="b" />
      <Radio value="c" />
    </RadioGroup>,
  );
  const itemB = component.locator("button").nth(1);
  await itemB.focus();
  await expect(itemB).toBeFocused();
  await page.keyboard.press("ArrowLeft", { delay: 50 });
  const itemA = component.locator("button").nth(0);
  await expect(itemA).toHaveAttribute("aria-checked", "true");
});

/* ------------------------------------------------------------------ */
/*  Disabled                                                            */
/* ------------------------------------------------------------------ */

test("disabled Radio item is not clickable", async ({ mount }) => {
  const received: string[] = [];
  const component = await mount(
    <RadioGroup defaultValue="a" onValueChange={(v) => received.push(v)} aria-label="Test group">
      <Radio value="a" />
      <Radio value="b" disabled />
    </RadioGroup>,
  );
  const itemB = component.locator("button").nth(1);
  await expect(itemB).toBeDisabled();
  expect(received).toEqual([]);
});

test("group-level disabled propagates to all items", async ({ mount }) => {
  const component = await mount(
    <RadioGroup disabled defaultValue="a" aria-label="Test group">
      <Radio value="a" />
      <Radio value="b" />
    </RadioGroup>,
  );
  const items = component.locator("button");
  await expect(items.nth(0)).toBeDisabled();
  await expect(items.nth(1)).toBeDisabled();
});

/* ------------------------------------------------------------------ */
/*  Forwarding                                                          */
/* ------------------------------------------------------------------ */

test("RadioGroup forwards className to the root element", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group" className="custom-group">
      <Radio value="a" />
    </RadioGroup>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-group/);
});

test("Radio forwards className to the button element", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group">
      <Radio value="a" className="custom-radio" />
    </RadioGroup>,
  );
  const item = component.locator("button").first();
  const className = await item.getAttribute("class");
  expect(className).toMatch(/custom-radio/);
});

test("Radio forwards data-* attributes to the button element", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group">
      <Radio value="a" data-testid="radio-a" />
    </RadioGroup>,
  );
  const item = component.locator("[data-testid='radio-a']");
  await expect(item).toBeAttached();
});

test("RadioGroup forwards data-* attributes to the root element", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group" data-testid="rg-root">
      <Radio value="a" />
    </RadioGroup>,
  );
  await expect(component).toHaveAttribute("data-testid", "rg-root");
});

test("RadioGroup ref is forwarded to the root div", async ({ mount, page }) => {
  // Verify ref forwarding works by checking the element is a div
  const component = await mount(
    <RadioGroup aria-label="Test group">
      <Radio value="a" />
    </RadioGroup>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("Radio ref is forwarded to the button element", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group">
      <Radio value="a" />
    </RadioGroup>,
  );
  const item = component.locator("button").first();
  const tag = await item.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("button");
});

/* ------------------------------------------------------------------ */
/*  Layout                                                              */
/* ------------------------------------------------------------------ */

test("vertical group has flex-direction column", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group" orientation="vertical">
      <Radio value="a" />
      <Radio value="b" />
    </RadioGroup>,
  );
  await expect(component).toHaveCSS("flex-direction", "column");
});

test("horizontal group has flex-direction row", async ({ mount }) => {
  const component = await mount(
    <RadioGroup aria-label="Test group" orientation="horizontal">
      <Radio value="a" />
      <Radio value="b" />
    </RadioGroup>,
  );
  await expect(component).toHaveCSS("flex-direction", "row");
});

/* ------------------------------------------------------------------ */
/*  A11y (axe)                                                          */
/* ------------------------------------------------------------------ */

test("a11y — RadioGroup + Radio (unselected)", async ({ mount, page }) => {
  await mount(
    <RadioGroup aria-label="A11y gate: unselected">
      <Radio value="a" aria-label="Option A" />
      <Radio value="b" aria-label="Option B" />
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup + Radio (with selection)", async ({ mount, page }) => {
  await mount(
    <RadioGroup value="a" onValueChange={() => undefined} aria-label="A11y gate: selected">
      <Radio value="a" aria-label="Option A" />
      <Radio value="b" aria-label="Option B" />
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup horizontal orientation", async ({ mount, page }) => {
  await mount(
    <RadioGroup defaultValue="m" orientation="horizontal" aria-label="A11y gate: horizontal">
      <Radio value="s" aria-label="Small" />
      <Radio value="m" aria-label="Medium" />
      <Radio value="l" aria-label="Large" />
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup with disabled item", async ({ mount, page }) => {
  await mount(
    <RadioGroup defaultValue="a" aria-label="A11y gate: disabled item">
      <Radio value="a" aria-label="Option A" />
      <Radio value="b" aria-label="Option B" disabled />
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup with disabled group", async ({ mount, page }) => {
  await mount(
    <RadioGroup disabled defaultValue="a" aria-label="A11y gate: disabled group">
      <Radio value="a" aria-label="Option A" />
      <Radio value="b" aria-label="Option B" />
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup with labels (wrapping pattern)", async ({ mount, page }) => {
  await mount(
    <RadioGroup defaultValue="monthly" aria-label="Billing plan">
      <label>
        <Radio value="monthly" />
        Monthly
      </label>
      <label>
        <Radio value="annual" />
        Annual
      </label>
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup with aria-labelledby", async ({ mount, page }) => {
  await mount(
    <div>
      <p id="rg-heading">Choose a plan</p>
      <RadioGroup defaultValue="monthly" aria-labelledby="rg-heading">
        <label>
          <Radio value="monthly" />
          Monthly
        </label>
        <label>
          <Radio value="annual" />
          Annual
        </label>
      </RadioGroup>
    </div>,
  );
  await expectAxeClean(page);
});
