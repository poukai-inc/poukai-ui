import { test, expect } from "@playwright/experimental-ct-react";
import { ArticleLayout } from "./ArticleLayout";
import { Prose } from "../../atoms/Prose";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const bodyContent = <p>Article body content.</p>;

// ---------------------------------------------------------------------------
// Rendering: root element
// ---------------------------------------------------------------------------

test("renders an article landmark by default", async ({ mount }) => {
  const component = await mount(<ArticleLayout>{bodyContent}</ArticleLayout>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("article");
});

test("renders as div when as=div", async ({ mount }) => {
  const component = await mount(<ArticleLayout as="div">{bodyContent}</ArticleLayout>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

// ---------------------------------------------------------------------------
// Rendering: children
// ---------------------------------------------------------------------------

test("renders children inside content area", async ({ mount }) => {
  const component = await mount(
    <ArticleLayout>
      <p>Hello article body</p>
    </ArticleLayout>,
  );
  await expect(component.getByText("Hello article body")).toBeVisible();
});

test("renders Prose atom as child", async ({ mount }) => {
  const component = await mount(
    <ArticleLayout>
      <Prose>
        <p>Prose content inside article</p>
      </Prose>
    </ArticleLayout>,
  );
  await expect(component.getByText("Prose content inside article")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Rendering: header slot
// ---------------------------------------------------------------------------

test("renders header slot when provided", async ({ mount }) => {
  const component = await mount(
    <ArticleLayout header={<h1>Article title</h1>}>{bodyContent}</ArticleLayout>,
  );
  await expect(component.locator("h1")).toBeVisible();
  await expect(component.locator("h1")).toContainText("Article title");
});

test("does not render header slot when omitted", async ({ mount }) => {
  const component = await mount(<ArticleLayout>{bodyContent}</ArticleLayout>);
  await expect(component.locator("[class*='header']")).toHaveCount(0);
});

test("header slot renders above content", async ({ mount }) => {
  const component = await mount(
    <ArticleLayout header={<h1 data-testid="hdr">Title</h1>}>
      <p data-testid="body">Body</p>
    </ArticleLayout>,
  );
  const header = component.locator("[data-testid='hdr']");
  const body = component.locator("[data-testid='body']");
  await expect(header).toBeVisible();
  await expect(body).toBeVisible();
  // Verify DOM order: header before body
  const order = await component.evaluate((el) => {
    const hdrEl = el.querySelector("[data-testid='hdr']");
    const bodyEl = el.querySelector("[data-testid='body']");
    if (!hdrEl || !bodyEl) return null;
    return hdrEl.compareDocumentPosition(bodyEl) & Node.DOCUMENT_POSITION_FOLLOWING
      ? "header-before-body"
      : "body-before-header";
  });
  expect(order).toBe("header-before-body");
});

// ---------------------------------------------------------------------------
// className and data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <ArticleLayout className="custom-article-layout">{bodyContent}</ArticleLayout>,
  );
  await expect(component).toHaveClass(/custom-article-layout/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<ArticleLayout data-testid="al-root">{bodyContent}</ArticleLayout>);
  await expect(component).toHaveAttribute("data-testid", "al-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <ArticleLayout as="div" aria-label="Main article">
      {bodyContent}
    </ArticleLayout>,
  );
  await expect(component).toHaveAttribute("aria-label", "Main article");
});

// ---------------------------------------------------------------------------
// CSS classes
// ---------------------------------------------------------------------------

test("applies root class", async ({ mount }) => {
  const component = await mount(<ArticleLayout>{bodyContent}</ArticleLayout>);
  await expect(component).toHaveClass(/root/);
});

test("content area has content class", async ({ mount }) => {
  const component = await mount(<ArticleLayout>{bodyContent}</ArticleLayout>);
  await expect(component.locator("[class*='content']")).toBeVisible();
});
