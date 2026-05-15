import type { CSSProperties, ReactNode } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Wordmark } from "./Wordmark";

export default {
  title: "Brand / Wordmark",
} satisfies StoryDefault;

/* ─── Layout helpers ──────────────────────────────────────── */

const wrapStyle: CSSProperties = {
  padding: "var(--space-8)",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
  gap: "var(--space-8)",
};

interface PanelProps {
  verdict: "do" | "dont";
  label: string;
  note: string;
  children: ReactNode;
}

const Panel = ({ verdict, label, note, children }: PanelProps) => (
  <div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        marginBottom: "var(--space-3)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "0.5rem",
          height: "0.5rem",
          borderRadius: "50%",
          background: verdict === "do" ? "var(--accent)" : "#c00",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: verdict === "do" ? "var(--accent)" : "#c00",
        }}
      >
        {verdict === "do" ? "Do" : "Don't"}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          marginLeft: "var(--space-1)",
        }}
      >
        — {label}
      </span>
    </div>

    <div
      style={{
        border: `1px solid ${verdict === "do" ? "var(--hairline)" : "#f5c0c0"}`,
        borderRadius: "var(--radius-3)",
        padding: "var(--space-6)",
        background: verdict === "do" ? "var(--bg)" : "#fff8f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "7rem",
        marginBottom: "var(--space-3)",
      }}
    >
      {children}
    </div>

    <p
      style={{
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      {note}
    </p>
  </div>
);

/* ─── Stories ─────────────────────────────────────────────── */

/**
 * Do / Don't pairs for Wordmark usage.
 * Brand rules are authoritative in meta/brand.md — this story is
 * the visual reference for those rules.
 */
export const DontDo: Story = () => (
  <div style={wrapStyle}>
    <Panel
      verdict="do"
      label="Minimum size 24 px"
      note="24 px is the smallest the wordmark can be rendered while remaining legible. Use height={24} or larger."
    >
      <Wordmark height={24} />
    </Panel>

    <Panel
      verdict="dont"
      label="Below minimum size"
      note="Below 24 px the letterforms lose definition and the isotype stroke weight breaks down. Never render smaller than 24 px."
    >
      <Wordmark height={12} />
    </Panel>

    <Panel
      verdict="do"
      label="Inherit from parent colour"
      note="Wordmark inherits currentColor. Set the colour on a parent element — on dark backgrounds wrap in a container with color: var(--bg)."
    >
      <div
        style={{
          background: "var(--fg)",
          padding: "var(--space-4) var(--space-6)",
          borderRadius: "var(--radius-2)",
          color: "var(--bg)",
        }}
      >
        <Wordmark height={40} />
      </div>
    </Panel>

    <Panel
      verdict="dont"
      label="Inline colour override"
      note="Do not override the wordmark's colour via style or className. The mark must always read as --fg on light or --bg on dark. Custom accent colours break brand consistency."
    >
      {/* Anti-pattern shown visually — colour via style is the violation */}
      <span style={{ color: "var(--accent)" }}>
        <Wordmark height={40} />
      </span>
    </Panel>

    <Panel
      verdict="do"
      label="Adequate clear space"
      note="Give the wordmark room to breathe. The clear space around it should be at least equal to the cap-height of the lettering."
    >
      <div style={{ padding: "var(--space-6)" }}>
        <Wordmark height={40} />
      </div>
    </Panel>

    <Panel
      verdict="dont"
      label="Cropped or edge-butted"
      note="Placing the wordmark flush against an edge or another element without clear space makes the lockup feel cramped and reduces legibility."
    >
      <div style={{ padding: 0, overflow: "hidden", width: "100%" }}>
        <Wordmark height={40} />
      </div>
    </Panel>

    <Panel
      verdict="do"
      label="Provide a descriptive label"
      note="The default label prop is 'Poukai'. When the wordmark serves as a home-page link, override to 'Go to Poukai homepage' so screen readers announce the destination."
    >
      <Wordmark height={40} label="Go to Poukai homepage" />
    </Panel>

    <Panel
      verdict="dont"
      label="Empty or generic label"
      note="An empty string or 'logo' gives screen reader users no useful information. Always set a label that describes what the mark is or where it navigates."
    >
      {/* Anti-pattern: meaningless alt text */}
      <Wordmark height={40} label="logo" />
    </Panel>
  </div>
);
