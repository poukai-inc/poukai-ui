import type { Story, StoryDefault } from "@ladle/react";
import { Caption } from "./Caption";

export default {
  title: "Molecules / Caption",
} satisfies StoryDefault;

/** Default — figcaption element inside a figure.
 *  Verifies: root is <figcaption>, --fs-micro size, --fg-muted color,
 *  --tracking-micro letter-spacing, --lh-meta line-height. */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <figure style={{ margin: 0 }}>
      <div
        style={{
          width: "100%",
          height: "160px",
          background: "var(--surface)",
          borderRadius: "var(--radius-3)",
        }}
      />
      <Caption style={{ marginTop: "var(--space-2)" }}>
        Fig. 1 — Pilot-to-production error rate, Q4 2023.
      </Caption>
    </figure>
  </div>
);

/** AsParagraph — standalone caption outside a figure using as="p".
 *  Verifies: root is <p>, same visual register as figcaption variant. */
export const AsParagraph: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <div
      style={{
        width: "100%",
        height: "160px",
        background: "var(--surface)",
        borderRadius: "var(--radius-3)",
      }}
    />
    <Caption as="p" style={{ marginTop: "var(--space-2)" }}>
      Source: internal benchmark suite, three model families, 16k-token context window.
    </Caption>
  </div>
);

/** AsSpan — inline context using as="span".
 *  Verifies: root is <span>, renders inline without layout breakage. */
export const AsSpan: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <p style={{ color: "var(--fg-muted)", fontSize: "var(--fs-meta)" }}>
      Audio track / <Caption as="span">recorded live, São Paulo, 2024</Caption>
    </p>
  </div>
);

/** InFigureComposition — full figure composition: image placeholder + figcaption.
 *  Verifies semantic association between <figure> and <figcaption> with no ARIA needed. */
export const InFigureComposition: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      maxWidth: "var(--hero-max)",
    }}
  >
    <figure style={{ margin: 0 }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          background: "var(--surface)",
          borderRadius: "var(--radius-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--fg-muted)",
          fontSize: "var(--fs-meta)",
        }}
      >
        [image placeholder]
      </div>
      <Caption style={{ marginTop: "var(--space-2)" }}>
        Fig. 2 — Latency distribution across three model families. Error bars show ±1σ.
      </Caption>
    </figure>
  </div>
);

/** WithInlineLink — caption containing a link.
 *  Verifies: link inherits global two-layer underline from tokens.css; no
 *  additional link styles authored by Caption. */
export const WithInlineLink: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <figure style={{ margin: 0 }}>
      <div
        style={{
          width: "100%",
          height: "120px",
          background: "var(--surface)",
          borderRadius: "var(--radius-3)",
        }}
      />
      <Caption style={{ marginTop: "var(--space-2)" }}>
        Data from the <a href="/methodology">public methodology doc</a>, updated monthly.
      </Caption>
    </figure>
  </div>
);

/** AllVariants — figcaption, p, and span side by side in a design matrix.
 *  Verifies all three as values render identically in terms of visual register. */
export const AllVariants: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)",
    }}
  >
    <figure style={{ margin: 0 }}>
      <div
        style={{
          width: "100%",
          height: "80px",
          background: "var(--surface)",
          borderRadius: "var(--radius-2)",
        }}
      />
      <Caption style={{ marginTop: "var(--space-2)" }}>
        as="figcaption" (default) — inside a figure element.
      </Caption>
    </figure>

    <div>
      <div
        style={{
          width: "100%",
          height: "80px",
          background: "var(--surface)",
          borderRadius: "var(--radius-2)",
        }}
      />
      <Caption as="p" style={{ marginTop: "var(--space-2)" }}>
        as="p" — standalone outside a figure element.
      </Caption>
    </div>

    <div>
      <div
        style={{
          width: "100%",
          height: "80px",
          background: "var(--surface)",
          borderRadius: "var(--radius-2)",
          display: "flex",
          alignItems: "center",
          paddingInline: "var(--space-4)",
        }}
      >
        <Caption as="span">as="span" — inline context inside another element.</Caption>
      </div>
    </div>
  </div>
);
