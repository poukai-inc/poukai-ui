import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Disclosure } from "./Disclosure";

/* ---------- Root element ---------- */

test("root element is <details>", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Details trigger">
      <p>Content</p>
    </Disclosure>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("details");
});

/* ---------- Summary renders trigger label ---------- */

test("renders summary label text inside <summary>", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Show details">
      <p>Body</p>
    </Disclosure>,
  );
  const summary = component.locator("summary");
  await expect(summary).toContainText("Show details");
});

/* ---------- Default closed state ---------- */

test("is closed by default (open attribute absent)", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Toggle me">
      <p>Hidden content</p>
    </Disclosure>,
  );
  const isOpen = await component.evaluate((el) => (el as HTMLDetailsElement).open);
  expect(isOpen).toBe(false);
});

/* ---------- defaultOpen prop ---------- */

test("defaultOpen=true renders with open attribute present", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Open by default" defaultOpen>
      <p>Visible content</p>
    </Disclosure>,
  );
  const isOpen = await component.evaluate((el) => (el as HTMLDetailsElement).open);
  expect(isOpen).toBe(true);
});

test("defaultOpen omitted (false) renders closed", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Closed by default" defaultOpen={false}>
      <p>Hidden content</p>
    </Disclosure>,
  );
  const isOpen = await component.evaluate((el) => (el as HTMLDetailsElement).open);
  expect(isOpen).toBe(false);
});

/* ---------- Click to open / close ---------- */

test("clicking summary opens the disclosure", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Click to open">
      <p>Revealed content</p>
    </Disclosure>,
  );
  const summary = component.locator("summary");
  await summary.click();
  const isOpen = await component.evaluate((el) => (el as HTMLDetailsElement).open);
  expect(isOpen).toBe(true);
});

test("clicking summary twice closes the disclosure", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Click to toggle">
      <p>Content</p>
    </Disclosure>,
  );
  const summary = component.locator("summary");
  await summary.click();
  await summary.click();
  const isOpen = await component.evaluate((el) => (el as HTMLDetailsElement).open);
  expect(isOpen).toBe(false);
});

/* ---------- Controlled open prop ---------- */

test("controlled open=true renders with open attribute", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Controlled open" open={true}>
      <p>Always visible</p>
    </Disclosure>,
  );
  const isOpen = await component.evaluate((el) => (el as HTMLDetailsElement).open);
  expect(isOpen).toBe(true);
});

test("controlled open=false renders without open attribute", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Controlled closed" open={false}>
      <p>Never visible until open=true</p>
    </Disclosure>,
  );
  const isOpen = await component.evaluate((el) => (el as HTMLDetailsElement).open);
  expect(isOpen).toBe(false);
});

/* ---------- Children content ---------- */

test("renders children inside the content region", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Show me" defaultOpen>
      <p data-testid="inner-content">Inner paragraph</p>
    </Disclosure>,
  );
  await expect(component.locator("[data-testid='inner-content']")).toBeVisible();
});

/* ---------- className forwarding ---------- */

test("merges consumer className onto root element", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Styled" className="my-disclosure">
      <p>Content</p>
    </Disclosure>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-disclosure/);
});

/* ---------- data-* / aria-* forwarding ---------- */

test("forwards data-testid to root <details>", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Test" data-testid="disc-root">
      <p>Content</p>
    </Disclosure>,
  );
  await expect(component).toHaveAttribute("data-testid", "disc-root");
});

test("forwards aria-label to root <details>", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Test" aria-label="extra label">
      <p>Content</p>
    </Disclosure>,
  );
  await expect(component).toHaveAttribute("aria-label", "extra label");
});

/* ---------- Chevron icon present ---------- */

test("renders a chevron SVG inside summary", async ({ mount }) => {
  const component = await mount(
    <Disclosure summary="Has chevron">
      <p>Content</p>
    </Disclosure>,
  );
  const svg = component.locator("summary svg");
  await expect(svg).toBeVisible();
});

/* ---------- a11y ---------- */

test("a11y — default (closed)", async ({ mount, page }) => {
  await mount(
    <Disclosure summary="What is Poukai?">
      <p>Poukai is a senior-only AI consulting practice.</p>
    </Disclosure>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — open state", async ({ mount, page }) => {
  await mount(
    <Disclosure summary="What is Poukai?" defaultOpen>
      <p>Poukai is a senior-only AI consulting practice.</p>
    </Disclosure>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — muted tone", async ({ mount, page }) => {
  await mount(
    <Disclosure summary="Advanced settings" tone="muted">
      <p>Additional configuration options.</p>
    </Disclosure>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — divider variant", async ({ mount, page }) => {
  await mount(
    <div>
      <Disclosure summary="First row" divider>
        <p>First row content.</p>
      </Disclosure>
      <Disclosure summary="Second row" divider>
        <p>Second row content.</p>
      </Disclosure>
    </div>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
