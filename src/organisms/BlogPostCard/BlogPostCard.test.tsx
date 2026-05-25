import { test, expect } from "@playwright/experimental-ct-react";
import { BlogPostCard } from "./BlogPostCard";
import { Byline } from "../../molecules/Byline";
import { TagList } from "../../molecules/TagList";
import { Tag } from "../../atoms/Tag";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const defaultByline = (
  <Byline name="Arian Zargaran" publishedAt="2024-06-01" readTime="5 min read" />
);

const defaultProps = {
  href: "/blog/test-post",
  title: "Test Post Title",
  lede: "A short excerpt describing the content of this test blog post.",
  byline: defaultByline,
};

// ---------------------------------------------------------------------------
// Rendering: title
// ---------------------------------------------------------------------------

test("renders title text", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} />);
  await expect(component.getByText("Test Post Title")).toBeVisible();
});

test("renders title as h2 by default", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} />);
  const h2 = component.locator("h2");
  await expect(h2).toBeVisible();
  await expect(h2).toContainText("Test Post Title");
});

test("renders title as h3 when headingLevel=3", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} headingLevel={3} />);
  // Root anchor wraps content; heading is a descendant. Use role-based query
  // which works regardless of whether the heading is wrapped further.
  await expect(component.getByRole("heading", { level: 3 })).toContainText("Test Post Title");
});

// ---------------------------------------------------------------------------
// Rendering: lede
// ---------------------------------------------------------------------------

test("renders lede text", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} />);
  await expect(
    component.getByText("A short excerpt describing the content of this test blog post."),
  ).toBeVisible();
});

// ---------------------------------------------------------------------------
// Rendering: byline
// ---------------------------------------------------------------------------

test("renders byline content", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} />);
  await expect(component.getByText("Arian Zargaran")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Rendering: tags
// ---------------------------------------------------------------------------

test("renders tags when provided", async ({ mount }) => {
  const component = await mount(
    <BlogPostCard
      {...defaultProps}
      tags={
        <TagList>
          <Tag>AI</Tag>
          <Tag>Engineering</Tag>
        </TagList>
      }
    />,
  );
  await expect(component.getByText("AI")).toBeVisible();
  await expect(component.getByText("Engineering")).toBeVisible();
});

test("does not render tags slot when tags is omitted", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} />);
  // No Tag elements should be present
  await expect(component.locator("[class*='tagsSlot']")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Rendering: cover image
// ---------------------------------------------------------------------------

test("renders cover image when provided", async ({ mount }) => {
  const component = await mount(
    <BlogPostCard
      {...defaultProps}
      cover={{ src: "https://picsum.photos/seed/test/960/540", alt: "Cover image description" }}
    />,
  );
  // Cover img descendant; use role-based query for the accessible name.
  await expect(component.getByAltText("Cover image description")).toBeAttached();
});

test("does not render cover image when cover is omitted", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} />);
  await expect(component.locator("img")).toHaveCount(0);
});

test("cover image renders before body content in DOM order", async ({ mount }) => {
  const component = await mount(
    <BlogPostCard
      {...defaultProps}
      cover={{ src: "https://picsum.photos/seed/order/960/540", alt: "Cover" }}
    />,
  );
  // `component` IS the root <a>; querySelector on the wrapper handle returns
  // the descendant img and h2 directly.
  const order = await component.evaluate((root) => {
    const img = root.querySelector("img");
    const title = root.querySelector("h2");
    if (!img || !title) return null;
    return img.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING
      ? "cover-before-title"
      : "title-before-cover";
  });
  expect(order).toBe("cover-before-title");
});

// ---------------------------------------------------------------------------
// Rendering: anchor / href
// ---------------------------------------------------------------------------

test("root element is an anchor with correct href", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} />);
  // `component` IS the root <a>; check its tag + href directly.
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("a");
  await expect(component).toHaveAttribute("href", "/blog/test-post");
});

// ---------------------------------------------------------------------------
// Tone variant
// ---------------------------------------------------------------------------

test("applies toneSubtle class when tone=subtle", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} tone="subtle" />);
  // tone class lives on the root anchor; assert against `component` directly.
  await expect(component).toHaveClass(/toneSubtle/);
});

test("does not apply toneSubtle class when tone=default", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} tone="default" />);
  await expect(component).not.toHaveClass(/toneSubtle/);
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} className="custom-blog-card" />);
  await expect(component).toHaveClass(/custom-blog-card/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<BlogPostCard {...defaultProps} data-testid="blog-card-root" />);
  await expect(component).toHaveAttribute("data-testid", "blog-card-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <BlogPostCard {...defaultProps} aria-label="Blog post: Test Post Title" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Blog post: Test Post Title");
});
