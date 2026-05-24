import { test, expect } from "@playwright/experimental-ct-react";
import { BlogList } from "./BlogList";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const posts = [
  {
    title: "Closing the pilot gap",
    lede: "How teams move from proof-of-concept to production.",
    date: "12 May 2026",
    author: "Arian Z.",
    href: "/blog/closing-the-pilot-gap",
  },
  {
    title: "Model evaluation at scale",
    lede: "A practical framework for evaluating LLMs.",
    date: "3 Apr 2026",
    author: "Arian Z.",
    href: "/blog/model-evaluation",
  },
  {
    title: "Prompt engineering is not enough",
    date: "14 Mar 2026",
    href: "/blog/prompt-engineering",
  },
];

// ---------------------------------------------------------------------------
// Rendering: root landmark
// ---------------------------------------------------------------------------

test("renders a section element", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("has default aria-label 'Blog posts'", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} />);
  await expect(component).toHaveAttribute("aria-label", "Blog posts");
});

test("uses custom aria-label when provided", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} aria-label="Posts tagged design" />);
  await expect(component).toHaveAttribute("aria-label", "Posts tagged design");
});

// ---------------------------------------------------------------------------
// Rendering: card list
// ---------------------------------------------------------------------------

test("renders a ul with role=list", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} />);
  const ul = component.locator("ul");
  await expect(ul).toBeVisible();
  await expect(ul).toHaveAttribute("role", "list");
});

test("renders one li per post", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} />);
  await expect(component.locator("li")).toHaveCount(posts.length);
});

test("renders BlogPostCard for each post", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} />);
  await expect(component.getByText("Closing the pilot gap")).toBeVisible();
  await expect(component.getByText("Model evaluation at scale")).toBeVisible();
  await expect(component.getByText("Prompt engineering is not enough")).toBeVisible();
});

test("renders post lede when provided", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} />);
  await expect(
    component.getByText("How teams move from proof-of-concept to production."),
  ).toBeVisible();
});

test("renders post href links", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} />);
  const links = component.locator("a");
  await expect(links).toHaveCount(posts.length);
  await expect(links.first()).toHaveAttribute("href", "/blog/closing-the-pilot-gap");
});

// ---------------------------------------------------------------------------
// Rendering: pagination slot
// ---------------------------------------------------------------------------

test("does not render pagination footer when pagination prop is omitted", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} />);
  await expect(component.locator("[data-slot='pagination']")).toHaveCount(0);
});

test("renders pagination slot inside footer when provided", async ({ mount }) => {
  const component = await mount(
    <BlogList
      posts={posts}
      pagination={
        <nav aria-label="Pagination">
          <a href="/blog?page=2">Next</a>
        </nav>
      }
    />,
  );
  const paginationRow = component.locator("[data-slot='pagination']");
  await expect(paginationRow).toBeVisible();
  await expect(paginationRow.getByText("Next")).toBeVisible();
});

test("pagination footer follows the card list in DOM order", async ({ mount }) => {
  const component = await mount(
    <BlogList
      posts={posts}
      pagination={
        <nav aria-label="Pagination">
          <a href="/blog?page=2">Next</a>
        </nav>
      }
    />,
  );
  const ul = component.locator("ul");
  const paginationRow = component.locator("[data-slot='pagination']");
  await expect(ul).toBeVisible();
  await expect(paginationRow).toBeVisible();
  const order = await component.evaluate((el) => {
    const ulEl = el.querySelector("ul");
    const footerEl = el.querySelector("[data-slot='pagination']");
    if (!ulEl || !footerEl) return null;
    return ulEl.compareDocumentPosition(footerEl) & Node.DOCUMENT_POSITION_FOLLOWING
      ? "ul-before-footer"
      : "footer-before-ul";
  });
  expect(order).toBe("ul-before-footer");
});

// ---------------------------------------------------------------------------
// Size variants
// ---------------------------------------------------------------------------

test("applies sizeTight class when size=tight", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} size="tight" />);
  await expect(component).toHaveClass(/sizeTight/);
});

test("does not apply sizeTight class when size=default", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} size="default" />);
  await expect(component).not.toHaveClass(/sizeTight/);
});

// ---------------------------------------------------------------------------
// Forwarding
// ---------------------------------------------------------------------------

test("forwards className to root section element", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} className="custom-list" />);
  await expect(component).toHaveClass(/custom-list/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} data-testid="blog-list-root" />);
  await expect(component).toHaveAttribute("data-testid", "blog-list-root");
});

test("forwards aria-* attributes beyond aria-label to root element", async ({ mount }) => {
  const component = await mount(<BlogList posts={posts} aria-describedby="blog-desc" />);
  await expect(component).toHaveAttribute("aria-describedby", "blog-desc");
});
