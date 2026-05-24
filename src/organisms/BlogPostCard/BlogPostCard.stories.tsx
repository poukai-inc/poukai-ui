import type { Story, StoryDefault } from "@ladle/react";
import { BlogPostCard } from "./BlogPostCard";
import { Byline } from "../../molecules/Byline";
import { TagList } from "../../molecules/TagList";
import { Tag } from "../../atoms/Tag";

export default {
  title: "Components / BlogPostCard",
} satisfies StoryDefault;

const sampleByline = (
  <Byline name="Arian Zargaran" role="Founder" publishedAt="2024-06-01" readTime="5 min read" />
);

const sampleTags = (
  <TagList>
    <Tag>AI</Tag>
    <Tag>Engineering</Tag>
    <Tag>Design Systems</Tag>
  </TagList>
);

export const Default: Story = () => (
  <div style={{ maxWidth: "480px", padding: "var(--space-8)" }}>
    <BlogPostCard
      href="/blog/shipping-with-ai"
      title="Shipping with AI: Closing the Gap Between Pilot and Production"
      lede="How we helped three platform teams move from prototype demos to shipped features — and what we learned about the gap between a working proof-of-concept and a production system."
      byline={sampleByline}
      tags={sampleTags}
    />
  </div>
);

export const WithCover: Story = () => (
  <div style={{ maxWidth: "480px", padding: "var(--space-8)" }}>
    <BlogPostCard
      href="/blog/design-systems-at-scale"
      title="Design Systems at Scale"
      lede="What we learned building a token-first component library for teams shipping across multiple surfaces and frameworks."
      byline={sampleByline}
      tags={
        <TagList>
          <Tag>Design Systems</Tag>
          <Tag>Tokens</Tag>
        </TagList>
      }
      cover={{
        src: "https://picsum.photos/seed/blogpostcard-cover/960/540",
        alt: "Abstract diagram of a design system token graph",
      }}
    />
  </div>
);

export const SubtleTone: Story = () => (
  <div
    style={{
      background: "var(--surface-section, var(--surface))",
      padding: "var(--space-8)",
      maxWidth: "480px",
    }}
  >
    <BlogPostCard
      href="/blog/ai-reliability"
      title="AI Reliability in Production"
      lede="Observations from six months of running LLM-backed features at scale — what breaks, what holds, and how to design for degraded states."
      byline={<Byline name="Arian Zargaran" publishedAt="2024-03-12" readTime="8 min read" />}
      tags={
        <TagList>
          <Tag>AI</Tag>
          <Tag>Reliability</Tag>
        </TagList>
      }
      tone="subtle"
    />
  </div>
);

export const HeadingLevel3: Story = () => (
  <div style={{ maxWidth: "480px", padding: "var(--space-8)" }}>
    <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-6)" }}>
      Related Posts
    </h2>
    <BlogPostCard
      href="/blog/observability"
      title="Observability for AI Systems"
      lede="Tracing, logging, and alerting patterns that actually work when your system's behavior is non-deterministic."
      byline={<Byline name="Arian Zargaran" publishedAt="2024-05-20" readTime="6 min read" />}
      tags={
        <TagList>
          <Tag>Observability</Tag>
          <Tag>AI</Tag>
        </TagList>
      }
      headingLevel={3}
    />
  </div>
);

export const BlogIndexComposition: Story = () => (
  <div
    style={{
      fontFamily: "var(--font-sans)",
      background: "var(--bg)",
      minHeight: "100vh",
      padding: "var(--space-8) var(--page-pad, var(--space-8))",
    }}
  >
    <h1
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "var(--fs-tagline)",
        marginBottom: "var(--space-8)",
        color: "var(--fg)",
      }}
    >
      Writing
    </h1>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "var(--space-6)",
        maxWidth: "var(--content-max)",
      }}
    >
      <BlogPostCard
        href="/blog/shipping-with-ai"
        title="Shipping with AI"
        lede="How we closed the gap between pilot and production on three consecutive engagements."
        byline={<Byline name="Arian Zargaran" publishedAt="2024-06-01" readTime="5 min read" />}
        tags={
          <TagList>
            <Tag>AI</Tag>
            <Tag>Engineering</Tag>
          </TagList>
        }
        cover={{
          src: "https://picsum.photos/seed/blog-1/960/540",
          alt: "Abstract network diagram",
        }}
        headingLevel={3}
      />
      <BlogPostCard
        href="/blog/design-systems"
        title="Design Systems at Scale"
        lede="Token-first component architecture for teams shipping across multiple surfaces."
        byline={<Byline name="Arian Zargaran" publishedAt="2024-04-15" readTime="7 min read" />}
        tags={
          <TagList>
            <Tag>Design Systems</Tag>
            <Tag>Tokens</Tag>
          </TagList>
        }
        cover={{
          src: "https://picsum.photos/seed/blog-2/960/540",
          alt: "Design token graph illustration",
        }}
        headingLevel={3}
      />
      <BlogPostCard
        href="/blog/observability"
        title="Observability for AI Systems"
        lede="Tracing, logging, and alerting patterns that work when behavior is non-deterministic."
        byline={<Byline name="Arian Zargaran" publishedAt="2024-03-12" readTime="6 min read" />}
        tags={
          <TagList>
            <Tag>Observability</Tag>
            <Tag>AI</Tag>
          </TagList>
        }
        headingLevel={3}
      />
    </div>
  </div>
);
