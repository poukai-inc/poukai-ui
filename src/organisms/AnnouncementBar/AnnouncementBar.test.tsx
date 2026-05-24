import { test, expect } from "@playwright/experimental-ct-react";
import { AnnouncementBar } from "./AnnouncementBar";

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

test("renders message text", async ({ mount }) => {
  const component = await mount(
    <AnnouncementBar id="test-render">Announcement copy.</AnnouncementBar>,
  );
  await expect(component).toBeVisible();
  await expect(component).toContainText("Announcement copy.");
});

test("applies region role and aria-label", async ({ mount }) => {
  const component = await mount(
    <AnnouncementBar id="test-role">Announcement copy.</AnnouncementBar>,
  );
  await expect(component).toHaveAttribute("role", "region");
  await expect(component).toHaveAttribute("aria-label", "Announcement");
});

test("renders dismiss button when dismissable (default)", async ({ mount }) => {
  const component = await mount(
    <AnnouncementBar id="test-dismiss-btn">With dismiss.</AnnouncementBar>,
  );
  const btn = component.getByRole("button", { name: "Dismiss announcement" });
  await expect(btn).toBeVisible();
});

test("does not render dismiss button when dismissable=false", async ({ mount }) => {
  const component = await mount(
    <AnnouncementBar id="test-no-dismiss" dismissable={false}>
      Mandatory notice.
    </AnnouncementBar>,
  );
  const btn = component.getByRole("button", { name: "Dismiss announcement" });
  await expect(btn).toHaveCount(0);
});

test("renders action slot when provided", async ({ mount }) => {
  const component = await mount(
    <AnnouncementBar
      id="test-action"
      action={
        <a href="/blog" data-testid="action-link">
          Read more
        </a>
      }
    >
      Launch copy.
    </AnnouncementBar>,
  );
  await expect(component.locator("[data-testid='action-link']")).toBeVisible();
});

test("does not render action slot when omitted", async ({ mount }) => {
  const component = await mount(<AnnouncementBar id="test-no-action">No action.</AnnouncementBar>);
  await expect(component.locator("[data-testid='action-link']")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Tone variants
// ---------------------------------------------------------------------------

test("applies data-tone=warm by default", async ({ mount }) => {
  const component = await mount(<AnnouncementBar id="test-tone-warm">Warm.</AnnouncementBar>);
  await expect(component).toHaveAttribute("data-tone", "warm");
});

// Playwright CT allows only one `mount()` per test; iterate via .forEach to
// generate a discrete test per tone instead of a loop inside one test.
(["neutral", "success", "danger", "warning"] as const).forEach((tone) => {
  test(`applies data-tone="${tone}"`, async ({ mount }) => {
    const component = await mount(
      <AnnouncementBar id={`test-tone-${tone}`} tone={tone}>
        {tone} copy.
      </AnnouncementBar>,
    );
    await expect(component).toHaveAttribute("data-tone", tone);
  });
});

// ---------------------------------------------------------------------------
// Dismiss interaction
// ---------------------------------------------------------------------------

test("clicking dismiss button removes bar from DOM", async ({ mount }) => {
  const component = await mount(
    <AnnouncementBar id="test-dismiss-click">Dismissable bar.</AnnouncementBar>,
  );
  await expect(component).toBeVisible();
  const btn = component.getByRole("button", { name: "Dismiss announcement" });
  await btn.click();
  // After transition the element is removed; the Playwright component handle becomes detached.
  await expect(component).not.toBeVisible({ timeout: 2000 });
});

test("dismiss persists to localStorage", async ({ mount, page }) => {
  await mount(<AnnouncementBar id="test-ls-persist">Persistent dismissal.</AnnouncementBar>);
  const btn = page.getByRole("button", { name: "Dismiss announcement" });
  await btn.click();
  // Give time for the localStorage write
  const stored = await page.evaluate(() =>
    localStorage.getItem("poukai-announcement-dismissed:test-ls-persist"),
  );
  expect(stored).toBe("1");
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <AnnouncementBar id="test-classname" className="custom-bar">
      Copy.
    </AnnouncementBar>,
  );
  await expect(component).toHaveClass(/custom-bar/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <AnnouncementBar id="test-data-attr" data-testid="bar-root">
      Copy.
    </AnnouncementBar>,
  );
  await expect(component).toHaveAttribute("data-testid", "bar-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <AnnouncementBar id="test-aria-attr" aria-describedby="some-desc">
      Copy.
    </AnnouncementBar>,
  );
  await expect(component).toHaveAttribute("aria-describedby", "some-desc");
});
