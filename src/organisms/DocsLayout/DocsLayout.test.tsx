import { test, expect } from "@playwright/experimental-ct-react";
import { DocsLayout } from "./DocsLayout";
import { Sidebar } from "../Sidebar/Sidebar";
import { ArticleLayout } from "../ArticleLayout/ArticleLayout";
import { LinkList } from "../../molecules/LinkList/LinkList";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const simpleSidebar = (
  <Sidebar sticky={false}>
    <Sidebar.Group heading="Getting started">
      <LinkList.Item href="/docs/intro">Introduction</LinkList.Item>
    </Sidebar.Group>
  </Sidebar>
);

const simpleToc = (
  <nav aria-label="On this page">
    <ul>
      <li>
        <a href="#intro">Introduction</a>
      </li>
    </ul>
  </nav>
);

const simpleContent = <p>Page content</p>;

// ---------------------------------------------------------------------------
// Rendering: root element
// ---------------------------------------------------------------------------

test("renders a div as root element", async ({ mount }) => {
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

// ---------------------------------------------------------------------------
// Rendering: sidebar
// ---------------------------------------------------------------------------

test("renders sidebar content in desktop column", async ({ mount }) => {
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  await expect(component.locator("[data-area='sidebar']")).toBeVisible();
});

test("renders sidebar aside with aria-label", async ({ mount }) => {
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  await expect(component.locator("aside[aria-label='Sidebar navigation']")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Rendering: content slot
// ---------------------------------------------------------------------------

test("renders children in content column", async ({ mount }) => {
  const component = await mount(
    <DocsLayout sidebar={simpleSidebar}>
      <p data-testid="center-content">Center</p>
    </DocsLayout>,
  );
  await expect(component.getByTestId("center-content")).toBeVisible();
});

test("content column has data-area=content", async ({ mount }) => {
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  await expect(component.locator("[data-area='content']")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Rendering: TOC slot
// ---------------------------------------------------------------------------

test("renders toc aside when toc prop is provided", async ({ mount }) => {
  const component = await mount(
    <DocsLayout sidebar={simpleSidebar} toc={simpleToc}>
      {simpleContent}
    </DocsLayout>,
  );
  await expect(component.locator("aside[aria-label='On this page']")).toBeVisible();
});

test("does not render toc column when toc prop is omitted", async ({ mount }) => {
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  await expect(component.locator("[data-area='toc']")).toHaveCount(0);
});

test("does not render empty aside when toc is omitted", async ({ mount }) => {
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  await expect(component.locator("aside[aria-label='On this page']")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Mobile menu trigger
// ---------------------------------------------------------------------------

test("renders mobile menu button", async ({ mount }) => {
  const component = await mount(
    <DocsLayout sidebar={simpleSidebar} sidebarLabel="Menu">
      {simpleContent}
    </DocsLayout>,
  );
  await expect(component.locator("button[aria-label='Menu']")).toBeAttached();
});

test("menu button has aria-expanded=false initially", async ({ mount }) => {
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  await expect(component.locator("button[aria-label='Menu']")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("menu button toggles aria-expanded on click", async ({ mount, page }) => {
  await page.setViewportSize({ width: 640, height: 800 });
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  const button = component.locator("button[aria-label='Menu']");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("drawer drops inert attribute when menu button is clicked", async ({ mount, page }) => {
  await page.setViewportSize({ width: 640, height: 800 });
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  const drawer = component.locator("[role='dialog']");
  // Initially inert (hidden + focus-disabled)
  await expect(drawer).toHaveAttribute("inert", "");
  const button = component.locator("button[aria-label='Menu']");
  await button.click();
  // After open: inert removed
  await expect(drawer).not.toHaveAttribute("inert");
});

// ---------------------------------------------------------------------------
// sidebarLabel prop
// ---------------------------------------------------------------------------

test("uses custom sidebarLabel for trigger button", async ({ mount }) => {
  const component = await mount(
    <DocsLayout sidebar={simpleSidebar} sidebarLabel="Navigation">
      {simpleContent}
    </DocsLayout>,
  );
  await expect(component.locator("button[aria-label='Navigation']")).toBeAttached();
});

test("uses default sidebarLabel Menu when not provided", async ({ mount }) => {
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  await expect(component.locator("button[aria-label='Menu']")).toBeAttached();
});

// ---------------------------------------------------------------------------
// className and data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <DocsLayout sidebar={simpleSidebar} className="custom-docs-layout">
      {simpleContent}
    </DocsLayout>,
  );
  await expect(component).toHaveClass(/custom-docs-layout/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <DocsLayout sidebar={simpleSidebar} data-testid="dl-root">
      {simpleContent}
    </DocsLayout>,
  );
  await expect(component).toHaveAttribute("data-testid", "dl-root");
});

// ---------------------------------------------------------------------------
// Composition with ArticleLayout
// ---------------------------------------------------------------------------

test("renders ArticleLayout as=div inside content column", async ({ mount }) => {
  const component = await mount(
    <DocsLayout sidebar={simpleSidebar}>
      <ArticleLayout as="div">
        <p>Article body</p>
      </ArticleLayout>
    </DocsLayout>,
  );
  await expect(component.getByText("Article body")).toBeVisible();
  // Ensure no article landmark double-nesting issue
  const tag = await component
    .locator("[data-area='content'] > *")
    .first()
    .evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

// ---------------------------------------------------------------------------
// CSS classes
// ---------------------------------------------------------------------------

test("applies root class", async ({ mount }) => {
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  await expect(component).toHaveClass(/root/);
});

test("applies noToc class when toc is omitted", async ({ mount }) => {
  const component = await mount(<DocsLayout sidebar={simpleSidebar}>{simpleContent}</DocsLayout>);
  await expect(component).toHaveClass(/noToc/);
});

test("does not apply noToc class when toc is provided", async ({ mount }) => {
  const component = await mount(
    <DocsLayout sidebar={simpleSidebar} toc={simpleToc}>
      {simpleContent}
    </DocsLayout>,
  );
  const classes = await component.getAttribute("class");
  expect(classes).not.toMatch(/noToc/);
});
