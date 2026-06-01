import { test, expect } from "@playwright/experimental-ct-react";
import { SiteShell } from "./SiteShell";

const routes = [
  { href: "/why-ai", label: "Why AI" },
  { href: "/roles", label: "Roles" },
];

const nestedRoutes = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/posts", label: "Posts" },
  {
    label: "More",
    items: [
      { href: "/settings", label: "Settings" },
      { href: "/billing", label: "Billing" },
    ],
  },
];

/* ─── Existing tests ──────────────────────────────────────────── */

test("renders wordmark linked to /", async ({ mount }) => {
  const component = await mount(
    <SiteShell>
      <p>content</p>
    </SiteShell>,
  );
  const brand = component.locator("a[href='/']").first();
  await expect(brand).toBeVisible();
  await expect(brand).toHaveAttribute("aria-label", "Poukai — home");
});

test("honours homeHref override", async ({ mount }) => {
  const component = await mount(
    <SiteShell homeHref="/landing">
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.locator("a[href='/landing']")).toBeVisible();
});

test("renders nav when routes are provided", async ({ mount }) => {
  const component = await mount(
    <SiteShell routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  // Scope to the <nav> element — mobile panel is display:none at desktop width
  const nav = component.getByRole("navigation", { name: "Primary" });
  await expect(nav).toBeVisible();
  await expect(nav.locator("a[href='/why-ai']")).toHaveText("Why AI");
  await expect(nav.locator("a[href='/roles']")).toHaveText("Roles");
});

test("omits nav when routes is empty or undefined", async ({ mount }) => {
  const component = await mount(
    <SiteShell>
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.getByRole("navigation")).toHaveCount(0);
});

test("marks current route with aria-current=page", async ({ mount }) => {
  const component = await mount(
    <SiteShell routes={routes} currentRoute="/roles">
      <p>content</p>
    </SiteShell>,
  );
  // Scope to the desktop nav to avoid duplicate elements in the mobile panel
  const nav = component.getByRole("navigation", { name: "Primary" });
  await expect(nav.locator("a[href='/roles']")).toHaveAttribute("aria-current", "page");
  await expect(nav.locator("a[href='/why-ai']")).not.toHaveAttribute("aria-current", "page");
});

test("renders footer slot when provided", async ({ mount }) => {
  const component = await mount(
    <SiteShell footer={<p data-testid="footer">Footer line</p>}>
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.locator("[data-testid='footer']")).toBeVisible();
  await expect(component.locator("footer")).toBeVisible();
});

test("omits footer element when slot is empty", async ({ mount }) => {
  const component = await mount(
    <SiteShell>
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.locator("footer")).toHaveCount(0);
});

test("renders children in main", async ({ mount }) => {
  const component = await mount(
    <SiteShell>
      <p data-testid="content">Body</p>
    </SiteShell>,
  );
  const main = component.locator("main");
  await expect(main.locator("[data-testid='content']")).toBeVisible();
});

test("custom navLabel is applied", async ({ mount }) => {
  const component = await mount(
    <SiteShell routes={routes} navLabel="Site sections">
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.getByRole("navigation", { name: "Site sections" })).toBeVisible();
});

/* ─── Landmark structure ──────────────────────────────────────── */

test("renders a header landmark", async ({ mount }) => {
  const component = await mount(
    <SiteShell>
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.locator("header")).toBeVisible();
});

test("renders a main landmark", async ({ mount }) => {
  const component = await mount(
    <SiteShell>
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.getByRole("main")).toBeVisible();
});

test("nav links are rendered in a list (ul > li)", async ({ mount }) => {
  const component = await mount(
    <SiteShell routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  const nav = component.getByRole("navigation", { name: "Primary" });
  await expect(nav.locator("ul")).toBeVisible();
  await expect(nav.locator("li")).toHaveCount(routes.length);
});

test("inactive nav links do not carry aria-current", async ({ mount }) => {
  const component = await mount(
    <SiteShell routes={routes} currentRoute="/roles">
      <p>content</p>
    </SiteShell>,
  );
  // Scope to desktop nav to avoid strict-mode violation from mobile panel duplicate
  const nav = component.getByRole("navigation", { name: "Primary" });
  await expect(nav.locator("a[href='/why-ai']")).not.toHaveAttribute("aria-current");
});

test("footer landmark is rendered when footer slot is provided", async ({ mount }) => {
  const component = await mount(
    <SiteShell footer={<p>© Pouk AI 2026</p>}>
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.locator("footer")).toBeVisible();
});

test("wordmark link carries accessible label", async ({ mount }) => {
  const component = await mount(
    <SiteShell>
      <p>content</p>
    </SiteShell>,
  );
  // Regardless of homeHref, the brand link always has this aria-label
  await expect(component.locator("a[aria-label='Poukai — home']")).toBeVisible();
});

test("all nav links are keyboard-focusable anchor elements", async ({ mount }) => {
  const component = await mount(
    <SiteShell routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  // Scope to the desktop <nav> only — mobile panel duplicates are hidden at 1280px
  const nav = component.getByRole("navigation", { name: "Primary" });
  const links = nav.locator("a");
  const count = await links.count();
  expect(count).toBe(routes.length);
  // Each link must have an href (making it a real anchor, not a span)
  for (let i = 0; i < count; i++) {
    await expect(links.nth(i)).toHaveAttribute("href");
  }
});

/* ─── sticky prop ─────────────────────────────────────────────── */

test("sticky=true: header is present and receives sticky class", async ({ mount, page }) => {
  const component = await mount(
    <SiteShell sticky routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  const header = component.locator("header");
  await expect(header).toBeVisible();
  // Verify position:sticky applied via computed style
  const position = await page.evaluate(() => {
    const h = document.querySelector("header");
    return h ? getComputedStyle(h).position : null;
  });
  expect(position).toBe("sticky");
});

test("sticky=false preserves non-sticky rendering", async ({ mount }) => {
  const component = await mount(
    <SiteShell sticky={false} routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.locator("header")).toBeVisible();
  await expect(component.getByRole("navigation", { name: "Primary" })).toBeVisible();
});

/* ─── end slot ────────────────────────────────────────────────── */

test("end slot renders in the header", async ({ mount }) => {
  const component = await mount(
    <SiteShell
      routes={routes}
      end={
        <button type="button" data-testid="sign-out">
          Sign out
        </button>
      }
    >
      <p>content</p>
    </SiteShell>,
  );
  // The desktop end slot is visible (display:flex at 1280px); the mobile panel
  // copy is display:none. Using .first() avoids strict-mode on the two copies.
  await expect(component.locator("[data-testid='sign-out']").first()).toBeVisible();
});

test("end slot is absent when prop not provided", async ({ mount }) => {
  const component = await mount(
    <SiteShell routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.locator("[data-testid='sign-out']")).toHaveCount(0);
});

/* ─── dropdown nav items ──────────────────────────────────────── */

test("route with items renders a dropdown trigger button", async ({ mount }) => {
  const component = await mount(
    <SiteShell routes={nestedRoutes}>
      <p>content</p>
    </SiteShell>,
  );
  // "More" has no href, has items — should render a button trigger in the desktop nav
  const nav = component.getByRole("navigation", { name: "Primary" });
  const trigger = nav.getByRole("button", { name: /More/i });
  await expect(trigger).toBeVisible();
});

test("dropdown trigger opens content with child links", async ({ mount, page }) => {
  const component = await mount(
    <SiteShell routes={nestedRoutes}>
      <p>content</p>
    </SiteShell>,
  );
  const nav = component.getByRole("navigation", { name: "Primary" });
  const trigger = nav.getByRole("button", { name: /More/i });
  await trigger.click();
  // Radix portals the content to document.body — use page scope
  await expect(page.locator("[role='menuitem']", { hasText: "Settings" }).first()).toBeVisible();
  await expect(page.locator("[role='menuitem']", { hasText: "Billing" }).first()).toBeVisible();
});

test("More item (no href) opens dropdown", async ({ mount, page }) => {
  const component = await mount(
    <SiteShell routes={nestedRoutes}>
      <p>content</p>
    </SiteShell>,
  );
  const nav = component.getByRole("navigation", { name: "Primary" });
  const moreTrigger = nav.getByRole("button", { name: /More/i });
  await expect(moreTrigger).toBeVisible();
  await moreTrigger.click();
  await expect(page.locator("[role='menuitem']", { hasText: "Settings" }).first()).toBeVisible();
});

/* ─── hamburger / mobile panel ────────────────────────────────── */
// These tests set a narrow viewport (375px) so the hamburger is visible
// and the mobile panel is in play. At desktop width (1280px), the hamburger
// is display:none and Playwright's getByRole correctly ignores it.

test("hamburger button exists when routes are provided", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await expect(hamburger).toHaveCount(1);
});

test("hamburger is absent when no routes are provided", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell>
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.locator("button[aria-expanded]")).toHaveCount(0);
});

test("hamburger aria-expanded is false by default", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await expect(hamburger).toHaveAttribute("aria-expanded", "false");
});

test("hamburger click sets aria-expanded=true and shows panel", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await hamburger.click();
  // After click, aria-expanded becomes true and label switches to close label
  const closeBtn = component.getByRole("button", { name: "Close navigation" });
  await expect(closeBtn).toHaveAttribute("aria-expanded", "true");
  // Panel has aria-hidden=false
  await expect(component.locator("#siteshell-mobile-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
});

test("close button click collapses panel", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await hamburger.click();
  const closeBtn = component.getByRole("button", { name: "Close navigation" });
  await closeBtn.click();
  // Back to closed state
  const openBtn = component.getByRole("button", { name: "Open navigation" });
  await expect(openBtn).toHaveAttribute("aria-expanded", "false");
});

test("Escape key closes mobile panel", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell routes={routes}>
      <p>content</p>
    </SiteShell>,
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

test("mobile panel has aria-controls relationship", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell routes={routes}>
      <p>content</p>
    </SiteShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await expect(hamburger).toHaveAttribute("aria-controls", "siteshell-mobile-panel");
  await expect(component.locator("#siteshell-mobile-panel")).toHaveCount(1);
});

/* ─── Mobile nested inline disclosure ──────────────────────────── */

test("nested route renders a disclosure toggle in mobile panel", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell routes={nestedRoutes}>
      <p>content</p>
    </SiteShell>,
  );
  // Open the mobile panel
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await hamburger.click();
  // "More" should appear as a toggle button inside the panel
  const panel = component.locator("#siteshell-mobile-panel");
  const disclosureBtn = panel.getByRole("button", { name: /More/i });
  await expect(disclosureBtn).toBeVisible();
  await expect(disclosureBtn).toHaveAttribute("aria-expanded", "false");
});

test("disclosure toggle expands to show child links", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell routes={nestedRoutes}>
      <p>content</p>
    </SiteShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await hamburger.click();
  const panel = component.locator("#siteshell-mobile-panel");
  const disclosureBtn = panel.getByRole("button", { name: /More/i });
  await disclosureBtn.click();
  await expect(disclosureBtn).toHaveAttribute("aria-expanded", "true");
  await expect(panel.locator("a[href='/settings']")).toBeVisible();
  await expect(panel.locator("a[href='/billing']")).toBeVisible();
});

/* ─── mobileMenuLabel / mobileCloseLabel props ─────────────────── */

test("custom mobileMenuLabel is applied to hamburger", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell routes={routes} mobileMenuLabel="Open menu" mobileCloseLabel="Close menu">
      <p>content</p>
    </SiteShell>,
  );
  await expect(component.getByRole("button", { name: "Open menu" })).toHaveCount(1);
});

/* ─── end slot in mobile panel ─────────────────────────────────── */

test("end slot content appears in mobile panel when open", async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const component = await mount(
    <SiteShell
      routes={routes}
      end={
        <button type="button" data-testid="sign-out-end">
          Sign out
        </button>
      }
    >
      <p>content</p>
    </SiteShell>,
  );
  const hamburger = component.getByRole("button", { name: "Open navigation" });
  await hamburger.click();
  const panel = component.locator("#siteshell-mobile-panel");
  await expect(panel.locator("[data-testid='sign-out-end']")).toBeVisible();
});

/* ─── flat routes regression ────────────────────────────────────── */

test("flat routes still render links with correct href and text", async ({ mount }) => {
  const component = await mount(
    <SiteShell routes={routes} currentRoute="/why-ai">
      <p>content</p>
    </SiteShell>,
  );
  // Scope to desktop nav to avoid strict-mode violations from mobile panel duplicates
  const nav = component.getByRole("navigation", { name: "Primary" });
  await expect(nav.locator("a[href='/why-ai']")).toHaveText("Why AI");
  await expect(nav.locator("a[href='/roles']")).toHaveText("Roles");
  await expect(nav.locator("a[href='/why-ai']")).toHaveAttribute("aria-current", "page");
});
