import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { BasicFAQ } from "./__test_harness__";
import { FAQDefaultOpen } from "./__test_harness__";
import { MultipleOpenFAQ } from "./__test_harness__";
import { FAQWithH2 } from "./__test_harness__";
import { FAQWithH4 } from "./__test_harness__";
import { ForwardingFAQItem } from "./__test_harness__";

const AXE_ISOLATED = ["landmark-one-main", "page-has-heading-one", "region"] as const;

/* ─── Renders trigger buttons ────────────────────────────────────── */

test("renders trigger buttons with question text", async ({ mount }) => {
  const component = await mount(<BasicFAQ />);
  await expect(component.getByRole("button", { name: "What is Poukai?" })).toBeVisible();
  await expect(component.getByRole("button", { name: "Who do you work with?" })).toBeVisible();
});

/* ─── Closed by default ──────────────────────────────────────────── */

test("content panels are closed by default", async ({ mount }) => {
  const component = await mount(<BasicFAQ />);
  const trigger = component.getByRole("button", { name: "What is Poukai?" });
  await expect(trigger).toHaveAttribute("data-state", "closed");
});

/* ─── Click opens panel ──────────────────────────────────────────── */

test("clicking trigger opens the answer panel", async ({ mount, page }) => {
  await mount(<BasicFAQ />);
  const trigger = page.getByRole("button", { name: "What is Poukai?" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("data-state", "open");
  await expect(page.locator("[data-testid='answer-q1']")).toBeVisible();
});

/* ─── Click again closes ─────────────────────────────────────────── */

test("clicking open trigger again closes the panel", async ({ mount, page }) => {
  await mount(<BasicFAQ />);
  const trigger = page.getByRole("button", { name: "What is Poukai?" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("data-state", "open");
  await trigger.click();
  await expect(trigger).toHaveAttribute("data-state", "closed");
});

/* ─── defaultValue opens panel ───────────────────────────────────── */

test("defaultValue on Accordion.Root opens the specified item", async ({ mount, page }) => {
  await mount(<FAQDefaultOpen />);
  const openTrigger = page.getByRole("button", { name: "Open by default" });
  await expect(openTrigger).toHaveAttribute("data-state", "open");
  await expect(page.locator("[data-testid='default-open-answer']")).toBeVisible();
});

test("items without defaultValue are closed on mount", async ({ mount, page }) => {
  await mount(<FAQDefaultOpen />);
  const closedTrigger = page.getByRole("button", { name: "Closed by default" });
  await expect(closedTrigger).toHaveAttribute("data-state", "closed");
});

/* ─── Multiple type ──────────────────────────────────────────────── */

test("multiple type: both items open simultaneously", async ({ mount, page }) => {
  await mount(<MultipleOpenFAQ />);
  await expect(page.locator("[data-testid='answer-ma']")).toBeVisible();
  await expect(page.locator("[data-testid='answer-mb']")).toBeVisible();
});

/* ─── questionAs heading level ───────────────────────────────────── */

test("default questionAs renders h3 inside trigger", async ({ mount }) => {
  const component = await mount(<BasicFAQ />);
  const h3 = component.locator("h3").first();
  await expect(h3).toBeAttached();
  await expect(h3).toHaveText("What is Poukai?");
});

test("questionAs='h2' renders h2 inside trigger", async ({ mount }) => {
  const component = await mount(<FAQWithH2 />);
  const h2 = component.locator("h2");
  await expect(h2).toBeAttached();
  await expect(h2).toHaveText("H2 question");
});

test("questionAs='h4' renders h4 inside trigger", async ({ mount }) => {
  const component = await mount(<FAQWithH4 />);
  const h4 = component.locator("h4");
  await expect(h4).toBeAttached();
  await expect(h4).toHaveText("H4 question");
});

/* ─── className forwarding ───────────────────────────────────────── */

test("forwards className to the item root element", async ({ mount }) => {
  const component = await mount(<ForwardingFAQItem />);
  const item = component.locator("[data-testid='faq-item-root']");
  await expect(item).toBeAttached();
  await expect(item).toHaveClass(/custom-faqitem/);
});

/* ─── data-* forwarding ──────────────────────────────────────────── */

test("forwards data-testid to the item root element", async ({ mount }) => {
  const component = await mount(<ForwardingFAQItem />);
  await expect(component.locator("[data-testid='faq-item-root']")).toBeAttached();
});

/* ─── a11y ───────────────────────────────────────────────────────── */

test("a11y — FAQ list (all closed)", async ({ mount, page }) => {
  await mount(<BasicFAQ />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — FAQ list (one item open)", async ({ mount, page }) => {
  await mount(<FAQDefaultOpen />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — multiple FAQ items open", async ({ mount, page }) => {
  await mount(<MultipleOpenFAQ />);
  const { violations } = await new AxeBuilder({ page }).disableRules([...AXE_ISOLATED]).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
