import type { Story, StoryDefault } from "@ladle/react";
import { ArticleHeader } from "./ArticleHeader";
import { Byline } from "../../molecules/Byline";

export default {
  title: "Organisms / ArticleHeader",
} satisfies StoryDefault;

const DefaultByline = (
  <Byline name="Arian Zargaran" role="Founder" publishedAt="2026-05-24" readTime="4 min read" />
);

export const Default: Story = () => (
  <article style={{ maxWidth: "42rem", padding: "var(--space-8) var(--page-pad)" }}>
    <ArticleHeader
      eyebrow="Engineering"
      title={
        <>
          Why we build with <em>AI</em>.
        </>
      }
      lede="A look at how we approach AI-assisted workflows in production environments, and what we've learned shipping alongside language models."
      byline={DefaultByline}
    />
  </article>
);

export const WithShare: Story = () => (
  <article style={{ maxWidth: "42rem", padding: "var(--space-8) var(--page-pad)" }}>
    <ArticleHeader
      eyebrow="Design"
      title="The token architecture behind our design system."
      lede="How we structure CSS custom properties to express brand decisions without encoding them in component code."
      byline={DefaultByline}
      share={
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            fontSize: "var(--fs-meta)",
            color: "var(--fg-muted)",
          }}
        >
          <span>Share:</span>
          <a href="#" style={{ color: "var(--accent)" }}>
            Twitter
          </a>
          <a href="#" style={{ color: "var(--accent)" }}>
            LinkedIn
          </a>
        </div>
      }
    />
  </article>
);

export const WithDivider: Story = () => (
  <article style={{ maxWidth: "42rem", padding: "var(--space-8) var(--page-pad)" }}>
    <ArticleHeader
      eyebrow="Case Study"
      title={
        <>
          Closing the gap between <em>pilot</em> and production.
        </>
      }
      lede="We embedded with a fintech team for six weeks to take their LLM prototype from internal demo to a customer-facing feature."
      byline={DefaultByline}
      divider
    />
    <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-body)", color: "var(--fg)" }}>
      Article body starts here…
    </p>
  </article>
);

export const BlogPostComposition: Story = () => (
  <div
    style={{
      fontFamily: "var(--font-sans)",
      background: "var(--bg)",
      minHeight: "100vh",
      padding: "var(--space-16) var(--page-pad)",
    }}
  >
    <article style={{ maxWidth: "42rem", marginInline: "auto" }}>
      <ArticleHeader
        eyebrow="Engineering"
        title={
          <>
            Shipping AI features with <em>confidence</em>.
          </>
        }
        lede="What separates a proof-of-concept from a production AI feature? In our experience: observability, fallback logic, and clear ownership boundaries."
        byline={
          <Byline
            name="Arian Zargaran"
            role="Founder"
            publishedAt="2026-05-24"
            readTime="6 min read"
          />
        }
        divider
      />
      <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-body)", color: "var(--fg)" }}>
        The first thing we noticed when embedding with production teams is that most AI prototypes
        lack any notion of graceful degradation…
      </p>
    </article>
  </div>
);
