import type { Story, StoryDefault } from "@ladle/react";
import { marked } from "marked";

export default {
  title: "Showcase / Decisions",
} satisfies StoryDefault;

/* ─── Source: glob every meta/decisions/*.md at build time ────── */

const decisionModules = import.meta.glob<string>("../../meta/decisions/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

/* ─── Frontmatter parser (minimal YAML subset: scalars + arrays) ─ */

interface Frontmatter {
  id: string;
  title: string;
  date: string;
  status: string;
  deciders?: string[];
  tags?: string[];
}

function parseFrontmatter(raw: string): { frontmatter: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return {
      frontmatter: { id: "?", title: "?", date: "?", status: "?" },
      body: raw,
    };
  }
  const yaml = match[1] ?? "";
  const body = (match[2] ?? "").trim();
  const fm: Record<string, string | string[]> = {};
  for (const line of yaml.split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;
    const key = kv[1]!;
    const value = (kv[2] ?? "").trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      fm[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      fm[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return { frontmatter: fm as unknown as Frontmatter, body };
}

/* ─── Parse all ADRs once at module load, sort by id ────────────── */

interface Adr extends Frontmatter {
  bodyHtml: string;
  path: string;
}

const adrs: Adr[] = Object.entries(decisionModules)
  .map(([path, raw]) => {
    const { frontmatter, body } = parseFrontmatter(raw);
    return {
      ...frontmatter,
      bodyHtml: marked.parse(body, { async: false }) as string,
      path,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

/* ─── Card ─── */

const statusColour: Record<string, string> = {
  accepted: "var(--accent)",
  proposed: "var(--fg-muted)",
  superseded: "var(--fg-muted)",
  deprecated: "var(--fg-muted)",
};

const AdrCard = ({ adr }: { adr: Adr }) => (
  <article
    style={{
      borderTop: "1px solid var(--hairline)",
      paddingTop: "var(--space-8)",
      marginTop: "var(--space-8)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "var(--space-3)",
        marginBottom: "var(--space-2)",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          letterSpacing: "0.04em",
        }}
      >
        ADR-{adr.id}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          color: statusColour[adr.status] ?? "var(--fg-muted)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {adr.status}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          marginLeft: "auto",
        }}
      >
        {adr.date}
      </span>
    </div>

    <h3
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 400,
        fontSize: "clamp(1.125rem, 1rem + 0.5vw, 1.375rem)",
        lineHeight: 1.3,
        margin: "0 0 var(--space-4)",
        color: "var(--fg)",
      }}
    >
      {adr.title}
    </h3>

    <div
      style={{
        color: "var(--fg-muted)",
        fontSize: "var(--fs-body)",
        lineHeight: 1.6,
        maxWidth: "56ch",
      }}
      dangerouslySetInnerHTML={{ __html: adr.bodyHtml }}
    />

    {adr.deciders && adr.deciders.length > 0 && (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          marginTop: "var(--space-4)",
        }}
      >
        Deciders: {adr.deciders.join(" · ")}
      </p>
    )}

    {adr.tags && adr.tags.length > 0 && (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          marginTop: "var(--space-2)",
        }}
      >
        Tags: {adr.tags.join(" · ")}
      </p>
    )}
  </article>
);

/* ─── Stories ─── */

export const Default: Story = () => (
  <div
    style={{
      padding: "var(--space-12) var(--space-8)",
      maxWidth: "var(--content-max)",
      margin: "0 auto",
    }}
  >
    <h2
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 400,
        fontSize: "var(--fs-tagline)",
        lineHeight: 1.15,
        margin: "0 0 var(--space-4)",
      }}
    >
      Architecture decisions
    </h2>
    <p
      style={{
        color: "var(--fg-muted)",
        maxWidth: "44ch",
        margin: "0 0 var(--space-2)",
      }}
    >
      Lightweight records of the key decisions that shape this design system. Authoritative source:{" "}
      <code>meta/decisions/</code>.
    </p>
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-micro)",
        color: "var(--fg-muted)",
      }}
    >
      {adrs.length} decisions · {adrs.filter((a) => a.status === "accepted").length} accepted
    </p>
    {adrs.map((adr) => (
      <AdrCard key={adr.id} adr={adr} />
    ))}
  </div>
);
