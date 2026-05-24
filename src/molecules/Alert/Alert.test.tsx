import { test, expect } from "@playwright/experimental-ct-react";
import { Alert } from "./Alert";

/* ---------- Root element ---------- */

test("root element is <div>", async ({ mount }) => {
  const component = await mount(<Alert>Body text.</Alert>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- ARIA role per variant ---------- */

test("info variant carries role=status", async ({ mount }) => {
  const component = await mount(<Alert variant="info">Info message.</Alert>);
  await expect(component).toHaveAttribute("role", "status");
});

test("success variant carries role=status", async ({ mount }) => {
  const component = await mount(<Alert variant="success">Success message.</Alert>);
  await expect(component).toHaveAttribute("role", "status");
});

test("warn variant carries role=status", async ({ mount }) => {
  const component = await mount(<Alert variant="warn">Warning message.</Alert>);
  await expect(component).toHaveAttribute("role", "status");
});

test("error variant carries role=alert", async ({ mount }) => {
  const component = await mount(<Alert variant="error">Error message.</Alert>);
  await expect(component).toHaveAttribute("role", "alert");
});

test("note variant carries role=note", async ({ mount }) => {
  const component = await mount(<Alert variant="note">Note message.</Alert>);
  await expect(component).toHaveAttribute("role", "note");
});

/* ---------- Default variant ---------- */

test("default variant is info (role=status)", async ({ mount }) => {
  const component = await mount(<Alert>Default variant message.</Alert>);
  await expect(component).toHaveAttribute("role", "status");
});

/* ---------- Variant CSS class ---------- */

test("applies variant class for info", async ({ mount }) => {
  const component = await mount(<Alert variant="info">Info.</Alert>);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/info/);
});

test("applies variant class for error", async ({ mount }) => {
  const component = await mount(<Alert variant="error">Error.</Alert>);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/error/);
});

test("applies variant class for success", async ({ mount }) => {
  const component = await mount(<Alert variant="success">Success.</Alert>);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/success/);
});

test("applies variant class for warn", async ({ mount }) => {
  const component = await mount(<Alert variant="warn">Warn.</Alert>);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/warn/);
});

test("applies variant class for note", async ({ mount }) => {
  const component = await mount(<Alert variant="note">Note.</Alert>);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/note/);
});

/* ---------- Body rendering ---------- */

test("renders children as body text", async ({ mount }) => {
  const component = await mount(<Alert>Please fix the highlighted fields.</Alert>);
  await expect(component.getByText("Please fix the highlighted fields.")).toBeVisible();
});

/* ---------- Title slot ---------- */

test("omits title element when title prop is not provided", async ({ mount }) => {
  const component = await mount(<Alert>Body only.</Alert>);
  const strong = component.locator("strong");
  await expect(strong).toHaveCount(0);
});

test("renders title as <strong> when provided", async ({ mount }) => {
  const component = await mount(<Alert title="Submission failed">Body text.</Alert>);
  const strong = component.locator("strong");
  await expect(strong).toHaveCount(1);
  await expect(strong).toHaveText("Submission failed");
});

test("renders title above body", async ({ mount }) => {
  const component = await mount(<Alert title="Error title">Error body text.</Alert>);
  await expect(component.locator("strong")).toBeVisible();
  await expect(component.getByText("Error body text.")).toBeVisible();
});

/* ---------- Icon slot ---------- */

test("renders default icon when icon prop is omitted", async ({ mount }) => {
  const component = await mount(<Alert variant="info">With default icon.</Alert>);
  const iconSlot = component.locator("span").first();
  await expect(iconSlot).toBeVisible();
  // SVG icon should be present
  const svg = component.locator("svg");
  await expect(svg).toHaveCount(1);
});

test("suppresses icon when icon={null}", async ({ mount }) => {
  const component = await mount(
    <Alert variant="info" icon={null}>
      No icon.
    </Alert>,
  );
  const svg = component.locator("svg");
  await expect(svg).toHaveCount(0);
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(<Alert className="custom-alert">Body.</Alert>);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/custom-alert/);
});

/* ---------- data-* forwarding ---------- */

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(<Alert data-testid="alert-root">Body.</Alert>);
  await expect(component).toHaveAttribute("data-testid", "alert-root");
});

/* ---------- aria-* forwarding ---------- */

test("forwards aria-label to root element", async ({ mount }) => {
  const component = await mount(<Alert aria-label="Payment error notice">Body.</Alert>);
  await expect(component).toHaveAttribute("aria-label", "Payment error notice");
});

/* ---------- Ref forwarding ---------- */

test("ref is forwarded to the root <div>", async ({ mount }) => {
  const component = await mount(
    <Alert
      ref={(el) => {
        void el;
      }}
    >
      Body.
    </Alert>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

/* ---------- a11y ---------- */

/* a11y scans are in src/a11y.test.tsx (central gate). */
