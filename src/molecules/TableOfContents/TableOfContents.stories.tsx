import type { Story, StoryDefault } from "@ladle/react";
import { TableOfContents, type TableOfContentsItem } from "./TableOfContents";

export default {
  title: "Molecules / TableOfContents",
} satisfies StoryDefault;

/* ---------- shared fixtures ---------- */

const LONG_ARTICLE_ITEMS: TableOfContentsItem[] = [
  { id: "introduction", label: "Introduction" },
  { id: "background", label: "Background" },
  { id: "approach", label: "Approach" },
  { id: "approach-methodology", label: "Methodology", depth: 2 },
  { id: "results", label: "Results" },
];

const SHORT_ARTICLE_ITEMS: TableOfContentsItem[] = [
  { id: "context", label: "Context" },
  { id: "findings", label: "Findings" },
  { id: "conclusion", label: "Conclusion" },
];

/* ---------- Default — long article, 5 sections ---------- */

export const Default: Story = () => (
  <div
    style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "2rem", maxWidth: "900px" }}
  >
    {/* Simulated article body */}
    <article>
      <section id="introduction" style={{ marginBottom: "60vh" }}>
        <h2>Introduction</h2>
        <p>Opening paragraph with enough content to make the page scrollable.</p>
      </section>
      <section id="background" style={{ marginBottom: "60vh" }}>
        <h2>Background</h2>
        <p>Historical context for the topic under discussion.</p>
      </section>
      <section id="approach" style={{ marginBottom: "20vh" }}>
        <h2>Approach</h2>
        <p>How we tackled the problem.</p>
      </section>
      <section id="approach-methodology" style={{ marginBottom: "60vh" }}>
        <h3>Methodology</h3>
        <p>Detailed breakdown of research methodology.</p>
      </section>
      <section id="results" style={{ marginBottom: "40vh" }}>
        <h2>Results</h2>
        <p>What we found.</p>
      </section>
    </article>

    {/* TOC rail */}
    <aside>
      <TableOfContents heading="On this page" items={LONG_ARTICLE_ITEMS} />
    </aside>
  </div>
);

/* ---------- ShortArticle — 3 sections, no heading ---------- */

export const ShortArticle: Story = () => (
  <div
    style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "2rem", maxWidth: "800px" }}
  >
    <article>
      <section id="context" style={{ marginBottom: "50vh" }}>
        <h2>Context</h2>
        <p>Setting the scene.</p>
      </section>
      <section id="findings" style={{ marginBottom: "50vh" }}>
        <h2>Findings</h2>
        <p>Key observations from the research.</p>
      </section>
      <section id="conclusion" style={{ marginBottom: "30vh" }}>
        <h2>Conclusion</h2>
        <p>Summary and next steps.</p>
      </section>
    </article>

    <aside>
      <TableOfContents items={SHORT_ARTICLE_ITEMS} />
    </aside>
  </div>
);

/* ---------- InDocsLayout — composed in a docs-style layout shell ---------- */

export const InDocsLayout: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "200px 1fr 200px",
      gap: "var(--space-8, 2rem)",
      maxWidth: "1100px",
      fontFamily: "var(--font-sans, sans-serif)",
    }}
  >
    {/* Simulated sidebar */}
    <nav aria-label="Docs sidebar" style={{ color: "var(--fg-muted, #6e6e73)", fontSize: "14px" }}>
      <p
        style={{
          margin: "0 0 8px",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Docs
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Getting started
          </a>
        </li>
        <li>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Components
          </a>
        </li>
        <li>
          <a href="#" style={{ color: "inherit", textDecoration: "none", fontWeight: 500 }}>
            TableOfContents
          </a>
        </li>
        <li>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Tokens
          </a>
        </li>
      </ul>
    </nav>

    {/* Article body */}
    <article>
      <section id="overview" style={{ marginBottom: "60vh" }}>
        <h2>Overview</h2>
        <p>This component tracks scroll position and highlights the active section.</p>
      </section>
      <section id="usage" style={{ marginBottom: "60vh" }}>
        <h2>Usage</h2>
        <p>
          Import and pass items with <code>id</code> and <code>label</code>.
        </p>
      </section>
      <section id="props" style={{ marginBottom: "40vh" }}>
        <h2>Props</h2>
        <p>See the prop table below.</p>
      </section>
      <section id="props-items" style={{ marginBottom: "40vh" }}>
        <h3>items</h3>
        <p>
          Array of <code>{`{ id, label, depth? }`}</code>.
        </p>
      </section>
      <section id="a11y" style={{ marginBottom: "30vh" }}>
        <h2>Accessibility</h2>
        <p>
          Named nav landmark with <code>aria-current</code> on the active item.
        </p>
      </section>
    </article>

    {/* TOC rail */}
    <aside>
      <TableOfContents
        heading="On this page"
        items={[
          { id: "overview", label: "Overview" },
          { id: "usage", label: "Usage" },
          { id: "props", label: "Props" },
          { id: "props-items", label: "items", depth: 2 },
          { id: "a11y", label: "Accessibility" },
        ]}
      />
    </aside>
  </div>
);
