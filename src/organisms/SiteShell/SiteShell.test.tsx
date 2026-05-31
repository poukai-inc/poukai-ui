import { test, expect } from "@playwright/experimental-ct-react";
import { SiteShell } from "./SiteShell";

const routes = [
  { href: "/why-ai", label: "Why AI" },
  { href: "/roles", label: "Roles" },
];

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
  await expect(component.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(component.locator("a[href='/why-ai']")).toHaveText("Why AI");
  await expect(component.locator("a[href='/roles']")).toHaveText("Roles");
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
  await expect(component.locator("a[href='/roles']")).toHaveAttribute("aria-current", "page");
  await expect(component.locator("a[href='/why-ai']")).not.toHaveAttribute("aria-current", "page");
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
  // /why-ai is not the current route — it must not have aria-current
  await expect(component.locator("a[href='/why-ai']")).not.toHaveAttribute("aria-current");
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
  const links = component.locator("nav a");
  const count = await links.count();
  expect(count).toBe(routes.length);
  // Each link must have an href (making it a real anchor, not a span)
  for (let i = 0; i < count; i++) {
    await expect(links.nth(i)).toHaveAttribute("href");
  }
});
