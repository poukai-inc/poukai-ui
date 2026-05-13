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
