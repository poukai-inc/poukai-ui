import { test, expect } from "@playwright/experimental-ct-react";
import { ToastProvider, useToast } from "./Toast";
import { Button } from "../../atoms/Button";

/* ─── Helpers ─────────────────────────────────────────────────── */

/** Minimal harness: renders a button that calls show() on click. */
function ShowTrigger({
  tone,
  title,
  body,
  duration,
  action,
  onShow,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
  body?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
  onShow?: (id: string) => void;
}) {
  const { show } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() => {
        const id = show({
          tone,
          title,
          body: body ?? "Test toast body",
          duration,
          action,
        });
        onShow?.(id);
      }}
    >
      Show toast
    </Button>
  );
}

function DismissTrigger({ toastId }: { toastId: string }) {
  const { dismiss } = useToast();
  return (
    <Button variant="ghost" onClick={() => dismiss(toastId)}>
      Dismiss
    </Button>
  );
}

/* ─── Tests ───────────────────────────────────────────────────── */

test("show() creates a toast and renders the body text", async ({ mount, page }) => {
  await mount(
    <ToastProvider position="bottom-right" defaultDuration={60000}>
      <ShowTrigger body="Hello from show()" />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Hello from show()")).toBeVisible();
});

test("dismiss() removes a toast by id", async ({ mount, page }) => {
  let capturedId = "";

  await mount(
    <ToastProvider position="bottom-right" defaultDuration={60000}>
      <ShowTrigger
        body="Dismissable toast"
        onShow={(id) => {
          capturedId = id;
        }}
      />
      {/* DismissTrigger is rendered AFTER capturedId is set via onShow */}
      <DismissController getCapturedId={() => capturedId} />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Dismissable toast")).toBeVisible();

  await page.getByRole("button", { name: "Dismiss captured" }).click();
  await expect(page.getByText("Dismissable toast")).toHaveCount(0);
});

/** Inline component: reads id at click time to work around closure capture. */
function DismissController({ getCapturedId }: { getCapturedId: () => string }) {
  const { dismiss } = useToast();
  return (
    <Button variant="ghost" onClick={() => dismiss(getCapturedId())}>
      Dismiss captured
    </Button>
  );
}

test("auto-dismiss after duration fires", async ({ mount, page }) => {
  await mount(
    <ToastProvider position="bottom-right" defaultDuration={300}>
      <ShowTrigger body="Short-lived toast" />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Short-lived toast")).toBeVisible();
  // Wait for auto-dismiss + animation settle
  await page.waitForTimeout(800);
  await expect(page.getByText("Short-lived toast")).toHaveCount(0);
});

test("action button invokes onClick", async ({ mount, page }) => {
  let actionFired = false;

  await mount(
    <ToastProvider position="bottom-right" defaultDuration={60000}>
      <ShowTrigger
        body="Toast with action"
        action={{
          label: "Do it",
          onClick: () => {
            actionFired = true;
          },
        }}
      />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Toast with action")).toBeVisible();
  await page.getByRole("button", { name: "Do it" }).click();
  // The onClick was called in the page context; assert it executed
  // by checking the toast still rendered (action click does not auto-dismiss)
  expect(actionFired).toBe(true);
});

test("close button dismisses the toast", async ({ mount, page }) => {
  await mount(
    <ToastProvider position="bottom-right" defaultDuration={60000}>
      <ShowTrigger body="Close me" />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Close me")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText("Close me")).toHaveCount(0);
});

test("max=2 enforced: 3rd show drops the oldest", async ({ mount, page }) => {
  function MultiShow() {
    const { show } = useToast();
    return (
      <div>
        <Button
          variant="secondary"
          data-testid="show-a"
          onClick={() => show({ body: "Toast A", duration: 60000 })}
        >
          A
        </Button>
        <Button
          variant="secondary"
          data-testid="show-b"
          onClick={() => show({ body: "Toast B", duration: 60000 })}
        >
          B
        </Button>
        <Button
          variant="secondary"
          data-testid="show-c"
          onClick={() => show({ body: "Toast C", duration: 60000 })}
        >
          C
        </Button>
      </div>
    );
  }

  await mount(
    <ToastProvider position="bottom-right" max={2} defaultDuration={60000}>
      <MultiShow />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "A" }).click();
  await page.getByRole("button", { name: "B" }).click();
  await page.getByRole("button", { name: "C" }).click();

  // Toast A should have been dropped (oldest when cap exceeded by C)
  await expect(page.getByText("Toast A")).toHaveCount(0);
  await expect(page.getByText("Toast B")).toBeVisible();
  await expect(page.getByText("Toast C")).toBeVisible();
});

test("position prop applies data-position attribute to viewport", async ({ mount, page }) => {
  await mount(
    <ToastProvider position="top-center" defaultDuration={60000}>
      <ShowTrigger body="Position test" />
    </ToastProvider>,
  );

  // The viewport always exists in the DOM (Radix renders it upfront)
  const viewport = page.locator("[data-position='top-center']");
  await expect(viewport).toBeAttached();
});

test("title and body are both rendered when title is provided", async ({ mount, page }) => {
  await mount(
    <ToastProvider position="bottom-right" defaultDuration={60000}>
      <ShowTrigger title="My Title" body="My body copy" />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("My Title")).toBeVisible();
  await expect(page.getByText("My body copy")).toBeVisible();
});

test("no title rendered when title prop is absent", async ({ mount, page }) => {
  await mount(
    <ToastProvider position="bottom-right" defaultDuration={60000}>
      <ShowTrigger body="Body only" />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Body only")).toBeVisible();
  // Radix Title element should not be in DOM when title prop is omitted
  // (ToastProvider conditionally renders it)
  const titleElements = page.locator("[data-radix-toast-title]");
  await expect(titleElements).toHaveCount(0);
});

test("danger tone sets data-tone='danger' on root", async ({ mount, page }) => {
  await mount(
    <ToastProvider position="bottom-right" defaultDuration={60000}>
      <ShowTrigger tone="danger" body="Danger toast" />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Danger toast")).toBeVisible();
  const toastRoot = page.locator("[data-tone='danger']");
  await expect(toastRoot).toBeVisible();
});

test("closeLabel prop overrides Close button aria-label", async ({ mount, page }) => {
  await mount(
    <ToastProvider position="bottom-right" defaultDuration={60000} closeLabel="Fermer">
      <ShowTrigger body="French close label" />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("French close label")).toBeVisible();
  await expect(page.getByRole("button", { name: "Fermer" })).toBeVisible();
});

test("per-toast duration overrides provider defaultDuration", async ({ mount, page }) => {
  await mount(
    // Provider default is long — the per-toast duration is short
    <ToastProvider position="bottom-right" defaultDuration={60000}>
      <ShowTrigger body="Quick override" duration={300} />
    </ToastProvider>,
  );

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Quick override")).toBeVisible();
  await page.waitForTimeout(800);
  await expect(page.getByText("Quick override")).toHaveCount(0);
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
