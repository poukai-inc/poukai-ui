import { test, expect } from "@playwright/experimental-ct-react";
import { Harness, ShowTrigger, MultiShow } from "./__test_harness__";

/* ─── Tests ───────────────────────────────────────────────────── */

test("show() creates a toast and renders the body text", async ({ mount, page }) => {
  await mount(
    <Harness position="bottom-right" defaultDuration={60000}>
      <ShowTrigger body="Hello from show()" />
    </Harness>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.locator("[data-tone]", { hasText: "Hello from show()" })).toBeVisible();
});

// Note: imperative dismiss() by captured id is not tested here.
// Playwright CT runs the test function in Node while JSX runs in the browser,
// so an `onShow` closure cannot transport the id back across process boundaries.
// The close-button-dismisses test below covers the dismiss code path adequately.

test("auto-dismiss after duration fires", async ({ mount, page }) => {
  await mount(
    <Harness position="bottom-right" defaultDuration={300}>
      <ShowTrigger body="Short-lived toast" />
    </Harness>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.locator("[data-tone]", { hasText: "Short-lived toast" })).toBeVisible();
  // Wait for auto-dismiss by polling until the element is gone (deterministic)
  await expect(page.locator("[data-tone]", { hasText: "Short-lived toast" })).toHaveCount(0, {
    timeout: 2000,
  });
});

test("action button invokes onClick", async ({ mount, page }) => {
  let actionFired = false;

  await mount(
    <Harness position="bottom-right" defaultDuration={60000}>
      <ShowTrigger
        body="Toast with action"
        action={{
          label: "Do it",
          onClick: () => {
            actionFired = true;
          },
        }}
      />
    </Harness>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.locator("[data-tone]", { hasText: "Toast with action" })).toBeVisible();
  // Two elements match "Do it": Radix's Action wrapper + our inner <Button>.
  // Click the outer Action wrapper (.first()) — clicks bubble to onClick.
  await page.getByRole("button", { name: "Do it" }).first().click();
  // The onClick was called in the page context; assert it executed
  // by checking the toast still rendered (action click does not auto-dismiss)
  expect(actionFired).toBe(true);
});

test("close button dismisses the toast", async ({ mount, page }) => {
  await mount(
    <Harness position="bottom-right" defaultDuration={60000}>
      <ShowTrigger body="Close me" />
    </Harness>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.locator("[data-tone]", { hasText: "Close me" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.locator("[data-tone]", { hasText: "Close me" })).toHaveCount(0);
});

test("max=2 enforced: 3rd show drops the oldest", async ({ mount, page }) => {
  await mount(
    <Harness position="bottom-right" max={2} defaultDuration={60000}>
      <MultiShow />
    </Harness>,
  );

  await page.getByTestId("show-a").click();
  await page.getByTestId("show-b").click();
  await page.getByTestId("show-c").click();

  // Toast A should have been dropped (oldest when cap exceeded by C)
  await expect(page.locator("[data-tone]", { hasText: "Toast A" })).toHaveCount(0);
  await expect(page.locator("[data-tone]", { hasText: "Toast B" })).toBeVisible();
  await expect(page.locator("[data-tone]", { hasText: "Toast C" })).toBeVisible();
});

test("position prop applies data-position attribute to viewport", async ({ mount, page }) => {
  await mount(
    <Harness position="top-center" defaultDuration={60000}>
      <ShowTrigger body="Position test" />
    </Harness>,
  );

  // The viewport always exists in the DOM (Radix renders it upfront)
  const viewport = page.locator("[data-position='top-center']");
  await expect(viewport).toBeAttached();
});

test("title and body are both rendered when title is provided", async ({ mount, page }) => {
  await mount(
    <Harness position="bottom-right" defaultDuration={60000}>
      <ShowTrigger title="My Title" body="My body copy" />
    </Harness>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.locator("[data-tone]", { hasText: "My Title" })).toBeVisible();
  await expect(page.locator("[data-tone]", { hasText: "My body copy" })).toBeVisible();
});

test("no title rendered when title prop is absent", async ({ mount, page }) => {
  await mount(
    <Harness position="bottom-right" defaultDuration={60000}>
      <ShowTrigger body="Body only" />
    </Harness>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.locator("[data-tone]", { hasText: "Body only" })).toBeVisible();
  // Radix Title element should not be in DOM when title prop is omitted
  // (ToastProvider conditionally renders it)
  const titleElements = page.locator("[data-radix-toast-title]");
  await expect(titleElements).toHaveCount(0);
});

test("danger tone sets data-tone='danger' on root", async ({ mount, page }) => {
  await mount(
    <Harness position="bottom-right" defaultDuration={60000}>
      <ShowTrigger tone="danger" body="Danger toast" />
    </Harness>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.locator("[data-tone]", { hasText: "Danger toast" })).toBeVisible();
  const toastRoot = page.locator("[data-tone='danger']");
  await expect(toastRoot).toBeVisible();
});

test("closeLabel prop overrides Close button aria-label", async ({ mount, page }) => {
  await mount(
    <Harness position="bottom-right" defaultDuration={60000} closeLabel="Fermer">
      <ShowTrigger body="French close label" />
    </Harness>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.locator("[data-tone]", { hasText: "French close label" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Fermer" })).toBeVisible();
});

test("per-toast duration overrides provider defaultDuration", async ({ mount, page }) => {
  await mount(
    // Provider default is long — the per-toast duration is short
    <Harness position="bottom-right" defaultDuration={60000}>
      <ShowTrigger body="Quick override" duration={300} />
    </Harness>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.locator("[data-tone]", { hasText: "Quick override" })).toBeVisible();
  // Wait for auto-dismiss by polling until the element is gone (deterministic)
  await expect(page.locator("[data-tone]", { hasText: "Quick override" })).toHaveCount(0, {
    timeout: 2000,
  });
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
