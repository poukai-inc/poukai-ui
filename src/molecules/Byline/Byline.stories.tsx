import type { Story } from "@ladle/react";
import { Byline } from "./Byline.js";

export default { title: "Molecules/Byline" };

export const WithAllProps: Story = () => (
  <Byline
    avatar="https://i.pravatar.cc/64?img=5"
    name="Jane Doe"
    role="Editor"
    publishedAt="2026-05-21T10:00:00Z"
    readTime="6 min read"
  />
);

export const InitialsFallback: Story = () => (
  <Byline
    initials="JD"
    name="Jane Doe"
    role="Editor"
    publishedAt="2026-05-21T10:00:00Z"
    readTime="6 min read"
  />
);

export const NameOnly: Story = () => <Byline name="Jane Doe" />;

export const NoReadTime: Story = () => (
  <Byline name="Jane Doe" role="Editor" publishedAt="2026-05-21T10:00:00Z" />
);

export const NoPublishedAt: Story = () => (
  <Byline name="Jane Doe" role="Editor" readTime="6 min read" />
);

export const ReadTimeOnly: Story = () => <Byline name="Jane Doe" readTime="6 min read" />;

export const EmptyAvatar: Story = () => (
  <Byline name="Jane Doe" role="Editor" publishedAt="2026-05-21T10:00:00Z" readTime="6 min read" />
);
