import { test, expect } from "@playwright/experimental-ct-react";
import { DatePicker } from "./DatePicker";

/* ---------- Root structure ---------- */

test("root element is a div", async ({ mount }) => {
  const component = await mount(<DatePicker />);
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("div");
});

test("forwards ref to root div via data-testid", async ({ mount }) => {
  const component = await mount(<DatePicker data-testid="dp-root" />);
  await expect(component).toHaveAttribute("data-testid", "dp-root");
});

test("merges consumer className onto root", async ({ mount }) => {
  const component = await mount(<DatePicker className="custom-dp" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/custom-dp/);
});

test("forwards data-* props to root element", async ({ mount }) => {
  const component = await mount(<DatePicker data-analytics="date-picker" />);
  await expect(component).toHaveAttribute("data-analytics", "date-picker");
});

/* ---------- Trigger ---------- */

test("trigger is a button element", async ({ mount }) => {
  const component = await mount(<DatePicker />);
  const trigger = component.getByRole("button");
  const tagName = await trigger.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("button");
});

test("trigger has aria-haspopup=dialog", async ({ mount }) => {
  const component = await mount(<DatePicker />);
  const trigger = component.getByRole("button");
  await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
});

test("trigger is aria-expanded=false when closed", async ({ mount }) => {
  const component = await mount(<DatePicker />);
  const trigger = component.getByRole("button");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("trigger shows placeholder when no date selected", async ({ mount }) => {
  const component = await mount(<DatePicker placeholder="Pick a date" />);
  await expect(component.getByRole("button")).toContainText("Pick a date");
});

test("trigger shows formatted date when value is set", async ({ mount }) => {
  const component = await mount(
    <DatePicker value={new Date(2026, 4, 23)} onValueChange={() => {}} />,
  );
  // Should show the date in some human-readable form containing "2026"
  const text = await component.getByRole("button").textContent();
  expect(text).toMatch(/2026/);
});

test("id prop is forwarded to the trigger button", async ({ mount }) => {
  const component = await mount(<DatePicker id="sched-date" />);
  const trigger = component.locator("[id='sched-date']");
  await expect(trigger).toHaveCount(1);
});

test("trigger has data-invalid=true when invalid prop is set", async ({ mount }) => {
  // jsx-a11y/role-supports-aria-props disallows aria-invalid on role=button;
  // invalid state is exposed via data-invalid instead.
  const component = await mount(<DatePicker invalid />);
  await expect(component.getByRole("button")).toHaveAttribute("data-invalid", "true");
});

test("trigger has no data-invalid when invalid is false", async ({ mount }) => {
  const component = await mount(<DatePicker />);
  const trigger = component.getByRole("button");
  const attr = await trigger.getAttribute("data-invalid");
  expect(attr).toBeNull();
});

test("disabled trigger cannot be interacted with", async ({ mount }) => {
  const component = await mount(<DatePicker disabled />);
  await expect(component.getByRole("button")).toBeDisabled();
});

/* ---------- Calendar panel opens / closes ---------- */

test("clicking trigger opens calendar panel", async ({ mount }) => {
  const component = await mount(<DatePicker />);
  await component.getByRole("button").click();
  await expect(component.page().getByRole("dialog")).toBeVisible();
});

test("calendar panel has role=dialog and aria-label='Choose date'", async ({ mount }) => {
  const component = await mount(<DatePicker />);
  await component.getByRole("button").click();
  const dialog = component.page().getByRole("dialog");
  await expect(dialog).toHaveAttribute("aria-label", "Choose date");
});

test("calendar panel contains a grid", async ({ mount }) => {
  const component = await mount(<DatePicker />);
  await component.getByRole("button").click();
  await expect(component.page().getByRole("grid")).toBeVisible();
});

test("calendar panel has prev and next month buttons", async ({ mount }) => {
  const component = await mount(<DatePicker />);
  await component.getByRole("button").click();
  const page = component.page();
  await expect(page.getByRole("button", { name: "Previous month" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next month" })).toBeVisible();
});

test("month heading has role=heading", async ({ mount }) => {
  const component = await mount(<DatePicker />);
  await component.getByRole("button").click();
  const page = component.page();
  await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
});

/* ---------- Day selection ---------- */

test("selecting a day closes the panel and fires onValueChange", async ({ mount }) => {
  const dates: (Date | null)[] = [];
  const component = await mount(
    <DatePicker value={new Date(2026, 4, 1)} onValueChange={(d) => dates.push(d)} />,
  );
  await component.getByRole("button").click();
  const page = component.page();
  // Click day 15. Calendar may render outside the default CT viewport — scroll
  // the target into view first to bypass Playwright's actionability check.
  const day15 = page.getByRole("gridcell").filter({ hasText: "15" }).locator("button");
  await day15.scrollIntoViewIfNeeded();
  await day15.click();
  expect(dates.length).toBeGreaterThan(0);
  expect(dates[dates.length - 1]?.getDate()).toBe(15);
  // Panel should close
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

/* ---------- value / onValueChange ---------- */

test("uncontrolled: selecting a day updates the trigger label", async ({ mount }) => {
  const component = await mount(<DatePicker defaultValue={null} />);
  await component.getByRole("button").click();
  const page = component.page();
  // We need a specific month — open shows current month; click any enabled day.
  // Scroll first to bypass actionability check when calendar renders outside viewport.
  const firstDay = page.getByRole("gridcell").locator("button:not([disabled])").first();
  await firstDay.scrollIntoViewIfNeeded();
  await firstDay.click();
  // Trigger label should no longer be the placeholder
  const text = await component.getByRole("button").textContent();
  expect(text).not.toMatch(/Pick a date/);
});

/* ---------- Hidden input ---------- */

test("hidden input is present when name prop is set", async ({ mount }) => {
  const component = await mount(
    <DatePicker name="scheduledFor" value={new Date(2026, 4, 23)} onValueChange={() => {}} />,
  );
  const input = component.locator("[name='scheduledFor']");
  await expect(input).toHaveCount(1);
  await expect(input).toHaveAttribute("type", "hidden");
});

test("hidden input value is ISO-8601 when date is selected", async ({ mount }) => {
  const component = await mount(
    <DatePicker name="scheduledFor" value={new Date(2026, 4, 23)} onValueChange={() => {}} />,
  );
  await expect(component.locator("[name='scheduledFor']")).toHaveValue("2026-05-23");
});

test("hidden input value is empty when no date selected", async ({ mount }) => {
  const component = await mount(
    <DatePicker name="scheduledFor" value={null} onValueChange={() => {}} />,
  );
  await expect(component.locator("[name='scheduledFor']")).toHaveValue("");
});

/* ---------- Disabled days (min/max) ---------- */

test("days before min are disabled", async ({ mount }) => {
  const min = new Date(2026, 4, 15);
  const component = await mount(
    <DatePicker value={new Date(2026, 4, 1)} onValueChange={() => {}} min={min} />,
  );
  await component.getByRole("button").click();
  const page = component.page();
  // Day 1 (before min=15) should be disabled
  const day1 = page.getByRole("gridcell").locator("button[data-day='1']");
  await expect(day1).toBeDisabled();
});

test("days after max are disabled", async ({ mount }) => {
  const max = new Date(2026, 4, 10);
  const component = await mount(
    <DatePicker value={new Date(2026, 4, 1)} onValueChange={() => {}} max={max} />,
  );
  await component.getByRole("button").click();
  const page = component.page();
  // Day 20 (after max=10) should be disabled
  const day20 = page.getByRole("gridcell").locator("button[data-day='20']");
  await expect(day20).toBeDisabled();
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
