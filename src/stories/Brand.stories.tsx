import type { CSSProperties } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Wordmark } from "../atoms/Wordmark";

export default {
  title: "Showcase / Brand",
} satisfies StoryDefault;

/* ─── Helpers ─────────────────────────────────────────────── */

const sectionStyle: CSSProperties = {
  borderTop: "1px solid var(--hairline)",
  paddingTop: "var(--space-8)",
  marginTop: "var(--space-8)",
};

const monoSmall: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--fs-micro)",
  color: "var(--fg-muted)",
  letterSpacing: "0.04em",
};

const labelStyle: CSSProperties = {
  ...monoSmall,
  textTransform: "uppercase",
  marginBottom: "var(--space-4)",
};

/* ─── Stories ─────────────────────────────────────────────── */

/**
 * Primary brand reference — wordmark lockups, colour palette, type specimens.
 * This is a read-only showcase; brand decisions live in meta/brand.md (owned
 * by poukai-design). Do not derive new brand rules from this story.
 */
export const Default: Story = () => (
  <div
    style={{
      padding: "var(--space-12) var(--space-8)",
      maxWidth: "var(--content-max)",
      margin: "0 auto",
    }}
  >
    <p style={monoSmall}>@poukai-inc/ui · Brand reference</p>
    <h2
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 400,
        fontSize: "var(--fs-tagline)",
        margin: "var(--space-4) 0 var(--space-2)",
        lineHeight: 1.15,
      }}
    >
      Poukai brand
    </h2>
    <p style={{ color: "var(--fg-muted)", maxWidth: "44ch", margin: 0 }}>
      Apple-light aesthetic — high contrast, generous whitespace, Instrument Serif for display,
      Geist for everything else.
    </p>

    {/* Wordmark */}
    <div style={sectionStyle}>
      <p style={labelStyle}>Wordmark</p>
      <p style={{ color: "var(--fg-muted)", marginBottom: "var(--space-8)", maxWidth: "44ch" }}>
        Isotype left, POUKAI lettering right. Inherits <code>currentColor</code> — place on any
        background by setting the parent's colour.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        {/* On light */}
        <div>
          <p style={{ ...monoSmall, marginBottom: "var(--space-3)" }}>On light (default)</p>
          <div
            style={{
              background: "var(--bg)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-3)",
              padding: "var(--space-8)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-8)",
              flexWrap: "wrap",
            }}
          >
            <Wordmark height={24} />
            <Wordmark height={40} />
            <Wordmark height={56} />
            <Wordmark height={80} />
          </div>
        </div>

        {/* On dark */}
        <div>
          <p style={{ ...monoSmall, marginBottom: "var(--space-3)" }}>On dark (inverted)</p>
          <div
            style={{
              background: "var(--fg)",
              borderRadius: "var(--radius-3)",
              padding: "var(--space-8)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-8)",
              flexWrap: "wrap",
              color: "var(--bg)",
            }}
          >
            <Wordmark height={24} />
            <Wordmark height={40} />
            <Wordmark height={56} />
            <Wordmark height={80} />
          </div>
        </div>

        {/* On surface */}
        <div>
          <p style={{ ...monoSmall, marginBottom: "var(--space-3)" }}>On surface</p>
          <div
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-3)",
              padding: "var(--space-8)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-8)",
              flexWrap: "wrap",
            }}
          >
            <Wordmark height={40} />
            <Wordmark height={56} />
          </div>
        </div>
      </div>
    </div>

    {/* Colour */}
    <div style={sectionStyle}>
      <p style={labelStyle}>Brand colours</p>
      <p style={{ color: "var(--fg-muted)", marginBottom: "var(--space-6)", maxWidth: "44ch" }}>
        Two primaries: near-black (<code>--fg</code>) and white (<code>--bg</code>). Accent blue
        reserved for interactive affordances only — never as decoration.
      </p>
      <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
        {(
          [
            { label: "--fg", bg: "var(--fg)", color: "var(--bg)" },
            { label: "--bg", bg: "var(--bg)", color: "var(--fg)", border: true },
            { label: "--surface", bg: "var(--surface)", color: "var(--fg)", border: true },
            { label: "--accent", bg: "var(--accent)", color: "#fff" },
          ] as { label: string; bg: string; color: string; border?: boolean }[]
        ).map(({ label, bg, color, border }) => (
          <div
            key={label}
            style={{
              background: bg,
              color,
              border: border ? "1px solid var(--hairline)" : undefined,
              borderRadius: "var(--radius-2)",
              padding: "var(--space-4) var(--space-6)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-micro)",
              minWidth: "7rem",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>

    {/* Typography */}
    <div style={sectionStyle}>
      <p style={labelStyle}>Type hierarchy</p>
      <div style={{ maxWidth: "56rem" }}>
        <p style={monoSmall}>Display — Instrument Serif, --fs-tagline</p>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--fs-tagline)",
            lineHeight: 1.15,
            margin: "var(--space-1) 0 var(--space-6)",
          }}
        >
          Technical consulting for teams shipping with <em>AI</em>.
        </p>

        <p style={monoSmall}>Body — Geist, --fs-body</p>
        <p
          style={{
            fontSize: "var(--fs-body)",
            lineHeight: 1.55,
            margin: "var(--space-1) 0 var(--space-6)",
            maxWidth: "44ch",
          }}
        >
          We work alongside founders and platform teams to close the gap between pilot and
          production — small, senior engagements, no juniors, no theatre.
        </p>

        <p style={monoSmall}>Meta — Geist, --fs-meta</p>
        <p
          style={{
            fontSize: "var(--fs-meta)",
            color: "var(--fg-muted)",
            margin: "var(--space-1) 0 var(--space-6)",
          }}
        >
          MIT Sloan Management Review · 2025 · AI Adoption Survey
        </p>

        <p style={monoSmall}>Micro — Geist Mono, --fs-micro, uppercase</p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--fg-muted)",
            margin: "var(--space-1) 0",
          }}
        >
          Component label · Section tag · Status
        </p>
      </div>
    </div>

    {/* Voice */}
    <div style={sectionStyle}>
      <p style={labelStyle}>Voice</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
          gap: "var(--space-6)",
          maxWidth: "56rem",
        }}
      >
        {(
          [
            { quality: "Precise", note: "Say exactly what you mean. No filler words." },
            { quality: "Direct", note: "Active voice. Short sentences. No hedge words." },
            { quality: "Dry", note: "Dry wit over enthusiasm. Trust the reader." },
            {
              quality: "Technical",
              note: "Use real terms. Don't simplify for an imagined audience.",
            },
          ] as { quality: string; note: string }[]
        ).map(({ quality, note }) => (
          <div key={quality}>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.25rem",
                margin: "0 0 var(--space-2)",
              }}
            >
              {quality}
            </p>
            <p style={{ color: "var(--fg-muted)", fontSize: "var(--fs-meta)", margin: 0 }}>
              {note}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const WordmarkSizes: Story = () => (
  <div style={{ padding: "var(--space-12) var(--space-8)" }}>
    <p style={{ ...monoSmall, marginBottom: "var(--space-8)" }}>
      Wordmark at all standard heights — 24, 32, 40, 48, 56, 64, 80, 96 px
    </p>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        alignItems: "flex-start",
      }}
    >
      {[24, 32, 40, 48, 56, 64, 80, 96].map((h) => (
        <div key={h} style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
          <Wordmark height={h} />
          <span style={monoSmall}>{h} px</span>
        </div>
      ))}
    </div>
  </div>
);
