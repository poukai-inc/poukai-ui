import type { Story } from "@ladle/react";
import { TagList } from "./TagList.js";
import { Tag } from "../../atoms/Tag/index.js";

export default { title: "Molecules / TagList" };

export const Default: Story = () => (
  <TagList>
    <Tag>Engineering</Tag>
    <Tag>Design Systems</Tag>
    <Tag>A11y</Tag>
  </TagList>
);

export const GapSm: Story = () => (
  <TagList gap="sm">
    <Tag>Engineering</Tag>
    <Tag>Design Systems</Tag>
    <Tag>A11y</Tag>
  </TagList>
);

export const WithMax: Story = () => (
  <TagList max={3}>
    <Tag>Engineering</Tag>
    <Tag>Design Systems</Tag>
    <Tag>A11y</Tag>
    <Tag>React</Tag>
    <Tag>TypeScript</Tag>
    <Tag>CSS Modules</Tag>
  </TagList>
);

export const WithMaxExactBoundary: Story = () => (
  <TagList max={3}>
    <Tag>Engineering</Tag>
    <Tag>Design Systems</Tag>
    <Tag>A11y</Tag>
  </TagList>
);

export const MixedTones: Story = () => (
  <TagList>
    <Tag>Published</Tag>
    <Tag tone="muted">Draft</Tag>
    <Tag tone="muted">Archived</Tag>
  </TagList>
);

/**
 * Article tagging composition — the primary surface for TagList:
 * tag row beneath an article title.
 */
export const ArticleTagging: Story = () => (
  <article style={{ maxWidth: "38rem", fontFamily: "var(--font-sans)" }}>
    <h2 style={{ marginBottom: "var(--space-2)" }}>
      Building production-grade AI systems without the plateau
    </h2>
    <TagList>
      <Tag>A11y</Tag>
      <Tag>Design Systems</Tag>
      <Tag>Engineering</Tag>
    </TagList>
    <p style={{ marginTop: "var(--space-4)", color: "var(--fg-muted)" }}>
      Most teams stop at the chatbot-on-top-of-RAG plateau. The demo dazzles; the production loop
      never closes.
    </p>
  </article>
);
