import type { Story, StoryDefault } from "@ladle/react";
import { DocsLayout } from "./DocsLayout";
import { Sidebar } from "../Sidebar/Sidebar";
import { ArticleLayout } from "../ArticleLayout/ArticleLayout";
import { LinkList } from "../../molecules/LinkList/LinkList";
import { Prose } from "../../atoms/Prose";

export default {
  title: "Organisms / DocsLayout",
} satisfies StoryDefault;

const sidebarContent = (
  <Sidebar sticky={false}>
    <Sidebar.Group heading="Getting started">
      <LinkList.Item href="/docs/intro">Introduction</LinkList.Item>
      <LinkList.Item href="/docs/install">Installation</LinkList.Item>
      <LinkList.Item href="/docs/quickstart">Quick start</LinkList.Item>
    </Sidebar.Group>
    <Sidebar.Group heading="Components">
      <LinkList.Item href="/docs/button" current>
        Button
      </LinkList.Item>
      <LinkList.Item href="/docs/heading">Heading</LinkList.Item>
      <LinkList.Item href="/docs/link">Link</LinkList.Item>
    </Sidebar.Group>
    <Sidebar.Group heading="Advanced">
      <LinkList.Item href="/docs/theming">Theming</LinkList.Item>
      <LinkList.Item href="/docs/tokens">Design tokens</LinkList.Item>
    </Sidebar.Group>
  </Sidebar>
);

const tocContent = (
  <nav aria-label="On this page">
    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "var(--fs-meta)" }}>
      <li>
        <a href="#overview" style={{ color: "var(--fg-muted)", textDecoration: "none" }}>
          Overview
        </a>
      </li>
      <li>
        <a href="#anatomy" style={{ color: "var(--fg-muted)", textDecoration: "none" }}>
          Anatomy
        </a>
      </li>
      <li>
        <a href="#usage" style={{ color: "var(--fg-muted)", textDecoration: "none" }}>
          Usage
        </a>
      </li>
      <li>
        <a href="#a11y" style={{ color: "var(--fg-muted)", textDecoration: "none" }}>
          Accessibility
        </a>
      </li>
    </ul>
  </nav>
);

const articleContent = (
  <Prose>
    <h2 id="overview">Overview</h2>
    <p>
      DocsLayout is the three-column page template for documentation surfaces. It composes a Sidebar
      navigation rail on the left, a scrollable ArticleLayout content column in the center, and a
      TableOfContents anchor list on the right.
    </p>
    <h2 id="anatomy">Anatomy</h2>
    <p>
      The layout shell owns column widths, gap rhythm, and the responsive collapse rules — not the
      content inside any column. At mobile, the sidebar collapses to a drawer accessible via a
      hamburger trigger.
    </p>
    <h2 id="usage">Usage</h2>
    <p>
      Wrap your page content in a DocsLayout, passing the Sidebar organism and optionally a
      TableOfContents. The center column accepts any ReactNode, typically an ArticleLayout with{" "}
      <code>as="div"</code> to avoid double article landmarks.
    </p>
    <h2 id="a11y">Accessibility</h2>
    <p>
      The sidebar column has an <code>aria-label="Sidebar navigation"</code> aside landmark. The TOC
      column has an <code>aria-label="On this page"</code> aside landmark. Mobile drawer receives{" "}
      <code>role="dialog"</code> with <code>aria-modal="true"</code>.
    </p>
  </Prose>
);

export const Default: Story = () => (
  <DocsLayout sidebar={sidebarContent} toc={tocContent}>
    <ArticleLayout as="div">{articleContent}</ArticleLayout>
  </DocsLayout>
);

export const WithoutToc: Story = () => (
  <DocsLayout sidebar={sidebarContent}>
    <ArticleLayout as="div">{articleContent}</ArticleLayout>
  </DocsLayout>
);

export const CustomSidebarLabel: Story = () => (
  <DocsLayout sidebar={sidebarContent} toc={tocContent} sidebarLabel="Navigation">
    <ArticleLayout as="div">{articleContent}</ArticleLayout>
  </DocsLayout>
);
