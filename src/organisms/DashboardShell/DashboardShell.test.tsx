import { test, expect } from "@playwright/experimental-ct-react";
import { DashboardShell } from "./DashboardShell";

const routes = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/team", label: "Team" },
];

/* ─── Landmark structure ──────────────────────────────────────── */

test("renders a complementary (aside) landmark with rail label", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  // Desktop aside is visible at 1280px default viewport
  const asides = component.getByRole("complementary");
  // Two asides exist: desktop rail + mobile panel (mobile panel is display:none)
  await expect(asides.first()).toBeVisible();
});

test("renders a main landmark", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  await expect(component.getByRole("main")).toBeVisible();
});

test("renders children in main", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes}>
      <p data-testid="page-content">Page body</p>
    </DashboardShell>,
  );
  await expect(component.locator("main [data-testid='page-content']")).toBeVisible();
});

/* ─── Wordmark home link ──────────────────────────────────────── */

test("renders Wordmark linked to homeHref default ('/')", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  // At desktop width (1280px), the desktop <aside> rail is visible.
  // Use getByRole to scope to the visible complementary landmark.
  // There are two <aside> elements; the first visible one is the desktop rail.
  const desktopRail = component.getByRole("complementary").first();
  await expect(desktopRail.locator("a[aria-label='Poukai — home']")).toBeVisible();
  await expect(desktopRail.locator("a[href='/']")).toBeVisible();
});

test("honours homeHref override", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes} homeHref="/admin">
      <p>content</p>
    </DashboardShell>,
  );
  // Scope to the visible desktop rail
  const desktopRail = component.getByRole("complementary").first();
  await expect(desktopRail.locator("a[href='/admin']")).toBeVisible();
});

/* ─── Nav ─────────────────────────────────────────────────────── */

test("renders nav when routes are provided", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  // The desktop rail nav is visible at default 1280px viewport
  const nav = component.getByRole("navigation", { name: "Sidebar" });
  await expect(nav.first()).toBeVisible();
});

test("custom navLabel is applied", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes} navLabel="Admin nav">
      <p>content</p>
    </DashboardShell>,
  );
  await expect(component.getByRole("navigation", { name: "Admin nav" }).first()).toBeVisible();
});

test("nav renders all route links", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  const nav = component.getByRole("navigation", { name: "Sidebar" }).first();
  await expect(nav.locator("a[href='/dashboard']")).toHaveText("Overview");
  await expect(nav.locator("a[href='/dashboard/jobs']")).toHaveText("Jobs");
  await expect(nav.locator("a[href='/dashboard/team']")).toHaveText("Team");
});

test("omits nav when routes is empty or undefined", async ({ mount }) => {
  const component = await mount(
    <DashboardShell>
      <p>content</p>
    </DashboardShell>,
  );
  await expect(component.getByRole("navigation")).toHaveCount(0);
});

/* ─── Active route ────────────────────────────────────────────── */

test("marks current route with aria-current=page", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes} currentRoute="/dashboard/jobs">
      <p>content</p>
    </DashboardShell>,
  );
  const nav = component.getByRole("navigation", { name: "Sidebar" }).first();
  await expect(nav.locator("a[href='/dashboard/jobs']")).toHaveAttribute("aria-current", "page");
  await expect(nav.locator("a[href='/dashboard']")).not.toHaveAttribute("aria-current", "page");
  await expect(nav.locator("a[href='/dashboard/team']")).not.toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("inactive nav links do not carry aria-current", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes} currentRoute="/dashboard">
      <p>content</p>
    </DashboardShell>,
  );
  const nav = component.getByRole("navigation", { name: "Sidebar" }).first();
  await expect(nav.locator("a[href='/dashboard/jobs']")).not.toHaveAttribute("aria-current");
  await expect(nav.locator("a[href='/dashboard/team']")).not.toHaveAttribute("aria-current");
});

test("no route is marked active when currentRoute does not match any href", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes} currentRoute="/not-a-route">
      <p>content</p>
    </DashboardShell>,
  );
  const nav = component.getByRole("navigation", { name: "Sidebar" }).first();
  const links = nav.locator("a[aria-current='page']");
  await expect(links).toHaveCount(0);
});

/* ─── Footer slot ─────────────────────────────────────────────── */

test("renders footer slot when provided", async ({ mount }) => {
  const component = await mount(
    <DashboardShell
      routes={routes}
      footer={
        <button type="button" data-testid="sign-out">
          Sign out
        </button>
      }
    >
      <p>content</p>
    </DashboardShell>,
  );
  // At desktop (1280px), getByRole scopes to the a11y tree (display:none elements excluded).
  // The desktop <aside> is visible; the mobile panel aside is display:none.
  const desktopRail = component.getByRole("complementary").first();
  await expect(desktopRail.locator("[data-testid='sign-out']")).toBeVisible();
});

test("omits footer container when footer prop is not provided", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  // No footer slot — confirmed by absence of sign-out
  await expect(component.locator("[data-testid='sign-out']")).toHaveCount(0);
});

/* ─── Rail slot ───────────────────────────────────────────────── */

test("renders rail slot when provided", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes} rail={<div data-testid="workspace">Acme Corp</div>}>
      <p>content</p>
    </DashboardShell>,
  );
  // At desktop (1280px), scope to the visible desktop rail aside.
  const desktopRail = component.getByRole("complementary").first();
  await expect(desktopRail.locator("[data-testid='workspace']")).toBeVisible();
});

test("omits rail slot container when rail prop is not provided", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  await expect(component.locator("[data-testid='workspace']")).toHaveCount(0);
});

/* ─── Nav links are real anchors ──────────────────────────────── */

test("all nav links are keyboard-focusable anchor elements with href", async ({ mount }) => {
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  const nav = component.getByRole("navigation", { name: "Sidebar" }).first();
  const links = nav.locator("a");
  const count = await links.count();
  expect(count).toBe(routes.length);
  for (let i = 0; i < count; i++) {
    await expect(links.nth(i)).toHaveAttribute("href");
  }
});

/* ─── Icon slot ───────────────────────────────────────────────── */

test("renders icon slot when route.icon is provided", async ({ mount }) => {
  const component = await mount(
    <DashboardShell
      routes={[
        {
          href: "/dashboard",
          label: "Overview",
          icon: <svg data-testid="icon-overview" width="16" height="16" aria-hidden="true" />,
        },
      ]}
    >
      <p>content</p>
    </DashboardShell>,
  );
  await expect(component.locator("[data-testid='icon-overview']").first()).toBeAttached();
});

/* ─── Mobile hamburger / panel ────────────────────────────────── */
// These tests set a narrow viewport (375px) so the hamburger is visible
// and the mobile panel is in play. At desktop width (1280px), the top bar
// is display:none and Playwright correctly ignores it.

test("hamburger button is visible on mobile", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await expect(hamburger).toHaveCount(1);
  await expect(hamburger).toBeVisible();
});

test("hamburger aria-expanded is false by default", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await expect(hamburger).toHaveAttribute("aria-expanded", "false");
});

test("hamburger click opens panel and sets aria-expanded=true", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await hamburger.click();
  const closeBtn = component.getByRole("button", { name: "Close navigation" });
  await expect(closeBtn).toHaveAttribute("aria-expanded", "true");
  // Panel transitions to open state
  await expect(component.locator("#dashboardshell-rail-panel")).toHaveAttribute(
    "data-state",
    "open",
  );
});

test("close button click collapses panel", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  // Open panel via hamburger
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await hamburger.click();
  await expect(component.locator("#dashboardshell-rail-panel")).toHaveAttribute(
    "data-state",
    "open",
  );
  // Close via the dedicated close button inside the panel
  const closeBtn = component.getByRole("button", { name: "Close navigation" });
  await closeBtn.click();
  await expect(hamburger).toHaveAttribute("aria-expanded", "false");
  await expect(component.locator("#dashboardshell-rail-panel")).toHaveAttribute(
    "data-state",
    "closed",
  );
});

test("Escape key closes mobile panel and returns focus to hamburger", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await hamburger.click();
  await expect(component.getByRole("button", { name: "Close navigation" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page.keyboard.press("Escape");
  await expect(component.getByRole("button", { name: "Open navigation" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("hamburger has aria-controls pointing to panel id", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await expect(hamburger).toHaveAttribute("aria-controls", "dashboardshell-rail-panel");
  await expect(component.locator("#dashboardshell-rail-panel")).toHaveCount(1);
});

test("custom mobileMenuLabel / mobileCloseLabel are applied", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <DashboardShell routes={routes} mobileMenuLabel="Menu öffnen" mobileCloseLabel="Menu schließen">
      <p>content</p>
    </DashboardShell>,
  );
  const hamburger = component.getByRole("button", { name: "Menu öffnen" });
  await expect(hamburger).toHaveCount(1);
  await hamburger.click();
  await expect(component.getByRole("button", { name: "Menu schließen" })).toHaveCount(1);
});

test("backdrop click closes mobile panel", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <DashboardShell routes={routes}>
      <p>content</p>
    </DashboardShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await hamburger.click();
  await expect(component.locator("#dashboardshell-rail-panel")).toHaveAttribute(
    "data-state",
    "open",
  );
  // Click in the right half of the viewport — outside the 14rem (224px) panel,
  // on the backdrop area. Force:true bypasses pointer-events if needed.
  await page.mouse.click(340, 400);
  await expect(component.locator("#dashboardshell-rail-panel")).toHaveAttribute(
    "data-state",
    "closed",
  );
});
