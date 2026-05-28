import { test, expect } from "@playwright/experimental-ct-react";
import { NotFound } from "./NotFound";

test("renders default 404 content", async ({ mount }) => {
  const component = await mount(<NotFound />);

  await expect(component.getByRole("heading", { level: 1 })).toContainText("Page not found.");
  await expect(component.getByText("404")).toBeVisible();
  await expect(component.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/");
});

test("renders with custom headline and homeLabel", async ({ mount }) => {
  const component = await mount(
    <NotFound headline="Custom" homeLabel="Go back" homeHref="/dashboard" />,
  );

  await expect(component.getByRole("heading", { level: 1 })).toHaveText("Custom");
  await expect(component.getByRole("link", { name: "Go back" })).toHaveAttribute(
    "href",
    "/dashboard",
  );
});

test("renders with suggestions and custom homeLabel", async ({ mount }) => {
  const component = await mount(
    <NotFound
      suggestions={[{ label: "Why AI", href: "/why-ai" }]}
      homeLabel="Go back"
      homeHref="/dashboard"
    />,
  );

  await expect(component.getByRole("heading", { level: 1 })).toHaveText("Page not found.");
  await expect(component.getByRole("link", { name: "Why AI" })).toHaveAttribute("href", "/why-ai");
  await expect(component.getByRole("link", { name: "Go back" })).toHaveAttribute(
    "href",
    "/dashboard",
  );
});

test("omits suggestions list when suggestions is empty", async ({ mount }) => {
  const component = await mount(<NotFound />);
  await expect(component.locator("ul")).toHaveCount(0);
});

test("renders suggestions list when suggestions are provided", async ({ mount }) => {
  const component = await mount(
    <NotFound
      suggestions={[
        { label: "Overview", href: "/overview" },
        { label: "Why AI", href: "/why-ai" },
      ]}
    />,
  );

  const list = component.locator("ul");
  await expect(list).toBeVisible();
  await expect(component.getByRole("link", { name: "Overview" })).toHaveAttribute(
    "href",
    "/overview",
  );
  await expect(component.getByRole("link", { name: "Why AI" })).toHaveAttribute("href", "/why-ai");
});

test("wordmark links to homeHref", async ({ mount }) => {
  const component = await mount(<NotFound homeHref="/app" />);
  // SiteShell renders the brand link as the first <a> in the header
  const brandLink = component.locator("header a").first();
  await expect(brandLink).toHaveAttribute("href", "/app");
});
