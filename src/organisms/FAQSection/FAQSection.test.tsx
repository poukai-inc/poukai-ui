import { test, expect } from "@playwright/experimental-ct-react";
import { BasicFAQSection } from "./__test_harness__";
import { FAQSectionWithLede } from "./__test_harness__";
import { FAQSectionDefaultOpen } from "./__test_harness__";
import { FAQSectionMultiple } from "./__test_harness__";
import { FAQSectionTight } from "./__test_harness__";
import { ForwardingFAQSection } from "./__test_harness__";

// ---------------------------------------------------------------------------
// Rendering: Section landmark + header
// ---------------------------------------------------------------------------

test("renders a section landmark", async ({ mount }) => {
  const component = await mount(<BasicFAQSection />);
  // Component root IS the <section>
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("section landmark has aria-labelledby pointing at the title", async ({ mount }) => {
  const component = await mount(<BasicFAQSection />);
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  const labeled = component.locator(`[id="${labelledById}"]`);
  await expect(labeled).toBeVisible();
  await expect(labeled).toContainText("Frequently asked questions");
});

test("renders the title as an h2", async ({ mount }) => {
  const component = await mount(<BasicFAQSection />);
  const h2 = component.locator("h2").first();
  await expect(h2).toBeVisible();
  await expect(h2).toContainText("Frequently asked questions");
});

test("renders eyebrow when provided", async ({ mount }) => {
  const component = await mount(<BasicFAQSection />);
  await expect(component.getByText("FAQ")).toBeVisible();
});

test("renders lede when provided", async ({ mount }) => {
  const component = await mount(<FAQSectionWithLede />);
  await expect(component.getByText("Everything you need to know.")).toBeVisible();
});

test("does not render lede when omitted", async ({ mount }) => {
  const component = await mount(<BasicFAQSection />);
  // No element with .lede text content from FAQSectionWithLede
  await expect(component.getByText("Everything you need to know.")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Rendering: FAQItem children
// ---------------------------------------------------------------------------

test("renders trigger buttons with question text", async ({ mount }) => {
  const component = await mount(<BasicFAQSection />);
  await expect(component.getByRole("button", { name: "What is Poukai?" })).toBeVisible();
  await expect(component.getByRole("button", { name: "Who do you work with?" })).toBeVisible();
});

test("content panels are closed by default", async ({ mount }) => {
  const component = await mount(<BasicFAQSection />);
  const trigger = component.getByRole("button", { name: "What is Poukai?" });
  await expect(trigger).toHaveAttribute("data-state", "closed");
});

// ---------------------------------------------------------------------------
// Interaction: open / close
// ---------------------------------------------------------------------------

test("clicking trigger opens the answer panel", async ({ mount, page }) => {
  await mount(<BasicFAQSection />);
  const trigger = page.getByRole("button", { name: "What is Poukai?" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("data-state", "open");
  await expect(page.locator("[data-testid='answer-q1']")).toBeVisible();
});

test("clicking open trigger again closes the panel", async ({ mount, page }) => {
  await mount(<BasicFAQSection />);
  const trigger = page.getByRole("button", { name: "What is Poukai?" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("data-state", "open");
  await trigger.click();
  await expect(trigger).toHaveAttribute("data-state", "closed");
});

// ---------------------------------------------------------------------------
// defaultValue
// ---------------------------------------------------------------------------

test("defaultValue opens the specified item on mount", async ({ mount, page }) => {
  await mount(<FAQSectionDefaultOpen />);
  const openTrigger = page.getByRole("button", { name: "Open by default" });
  await expect(openTrigger).toHaveAttribute("data-state", "open");
  await expect(page.locator("[data-testid='default-open-answer']")).toBeVisible();
});

test("items without defaultValue are closed on mount", async ({ mount, page }) => {
  await mount(<FAQSectionDefaultOpen />);
  const closedTrigger = page.getByRole("button", { name: "Closed by default" });
  await expect(closedTrigger).toHaveAttribute("data-state", "closed");
});

// ---------------------------------------------------------------------------
// type="multiple"
// ---------------------------------------------------------------------------

test("multiple type: both items open simultaneously", async ({ mount, page }) => {
  await mount(<FAQSectionMultiple />);
  await expect(page.locator("[data-testid='answer-ma']")).toBeVisible();
  await expect(page.locator("[data-testid='answer-mb']")).toBeVisible();
});

// ---------------------------------------------------------------------------
// size variants
// ---------------------------------------------------------------------------

test("applies sizeTight class when size=tight", async ({ mount }) => {
  const component = await mount(<FAQSectionTight />);
  await expect(component).toHaveClass(/sizeTight/);
});

test("does not apply sizeTight class when size=default", async ({ mount }) => {
  const component = await mount(<BasicFAQSection />);
  await expect(component).not.toHaveClass(/sizeTight/);
});

// ---------------------------------------------------------------------------
// className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(<ForwardingFAQSection />);
  await expect(component).toHaveClass(/custom-faqsection/);
});

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(<ForwardingFAQSection />);
  await expect(component).toHaveAttribute("data-testid", "faqsection-root");
});
