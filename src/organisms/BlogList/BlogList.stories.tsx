import type { Story, StoryDefault } from "@ladle/react";
import { BlogList } from "./BlogList";

export default {
  title: "Components / BlogList",
} satisfies StoryDefault;

const posts = [
  {
    title: "Closing the pilot gap",
    lede: "How teams move from proof-of-concept to production-grade AI.",
    date: "12 May 2026",
    author: "Arian Z.",
    href: "/blog/closing-the-pilot-gap",
  },
  {
    title: "Model evaluation at scale",
    lede: "A practical framework for evaluating LLMs before deploying to production.",
    date: "3 Apr 2026",
    author: "Arian Z.",
    href: "/blog/model-evaluation",
  },
  {
    title: "Prompt engineering is not enough",
    lede: "Why teams need structured evals alongside prompt iteration.",
    date: "14 Mar 2026",
    author: "Arian Z.",
    href: "/blog/prompt-engineering-not-enough",
  },
];

export const Default: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)", background: "var(--bg)", minHeight: "100vh" }}>
    <BlogList posts={posts} />
  </div>
);

export const WithPagination: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)", background: "var(--bg)", minHeight: "100vh" }}>
    <BlogList
      posts={posts}
      pagination={
        <nav aria-label="Pagination">
          <a href="/blog?page=1" aria-current="page" style={{ marginInlineEnd: "var(--space-4)" }}>
            1
          </a>
          <a href="/blog?page=2" style={{ marginInlineEnd: "var(--space-4)" }}>
            2
          </a>
          <a href="/blog?page=3">3</a>
        </nav>
      }
    />
  </div>
);

export const Tight: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)", background: "var(--bg)", minHeight: "100vh" }}>
    <BlogList posts={posts} size="tight" />
  </div>
);

export const CategoryPage: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)", background: "var(--bg)", minHeight: "100vh" }}>
    <BlogList
      posts={posts.filter((p) => p.href.includes("pilot") || p.href.includes("model"))}
      aria-label="Posts tagged AI"
    />
  </div>
);

export const BlogIndexComposition: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)", background: "var(--bg)", minHeight: "100vh" }}>
    <header
      style={{
        padding: "var(--space-4) var(--page-pad)",
        borderBottom: "var(--hairline-w) solid var(--hairline)",
        maxWidth: "var(--content-max)",
        margin: "0 auto",
      }}
    >
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-wordmark)" }}>
        Poukai
      </span>
    </header>
    <main
      style={{
        maxWidth: "var(--content-max)",
        margin: "0 auto",
        paddingInline: "var(--page-pad)",
      }}
    >
      <BlogList
        posts={posts}
        pagination={
          <nav aria-label="Blog pagination">
            <a
              href="/blog?page=1"
              aria-current="page"
              style={{ marginInlineEnd: "var(--space-4)" }}
            >
              1
            </a>
            <a href="/blog?page=2">2</a>
          </nav>
        }
      />
    </main>
  </div>
);
