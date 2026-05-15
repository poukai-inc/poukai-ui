import type { CSSProperties } from "react";
import type { Story, StoryDefault } from "@ladle/react";

export default {
  title: "Showcase / Tokens",
} satisfies StoryDefault;

/* ─── helpers ─────────────────────────────────────────────── */

const sectionStyle: CSSProperties = {
  borderTop: "1px solid var(--hairline)",
  paddingTop: "var(--space-8)",
  marginTop: "var(--space-8)",
};

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--fs-micro)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--fg-muted)",
  marginBottom: "var(--space-4)",
};

const monoSmall: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--fs-micro)",
  color: "var(--fg-muted)",
};

/* ─── Colour swatches ─────────────────────────────────────── */

interface SwatchProps {
  token: string;
  label: string;
  border?: boolean;
}

const Swatch = ({ token, label, border }: SwatchProps) => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
    <div
      style={{
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "var(--radius-2)",
        background: `var(${token})`,
        border: border ? "1px solid var(--hairline)" : undefined,
        flexShrink: 0,
      }}
    />
    <div>
      <p style={{ ...monoSmall, color: "var(--fg)", marginBottom: "0.125rem" }}>{token}</p>
      <p style={monoSmall}>{label}</p>
    </div>
  </div>
);

/* ─── Type specimen ───────────────────────────────────────── */

interface TypeRowProps {
  token: string;
  sample: string;
  family?: string;
}

const TypeRow = ({ token, sample, family }: TypeRowProps) => (
  <div style={{ marginBottom: "var(--space-4)" }}>
    <p style={monoSmall}>{token}</p>
    <p
      style={{
        fontSize: `var(${token})`,
        fontFamily: family ? `var(${family})` : undefined,
        lineHeight: 1.2,
        margin: "var(--space-1) 0 0",
      }}
    >
      {sample}
    </p>
  </div>
);

/* ─── Space ruler ─────────────────────────────────────────── */

interface SpaceRowProps {
  token: string;
}

const SpaceRow = ({ token }: SpaceRowProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)",
      marginBottom: "var(--space-2)",
    }}
  >
    <p style={{ ...monoSmall, width: "7rem", flexShrink: 0 }}>{token}</p>
    <div
      style={{
        height: "1rem",
        width: `var(${token})`,
        background: "var(--accent)",
        borderRadius: "var(--radius-1)",
      }}
    />
  </div>
);

/* ─── Stories ─────────────────────────────────────────────── */

export const Colour: Story = () => (
  <div style={{ padding: "var(--space-12) var(--space-8)", maxWidth: "var(--content-max)" }}>
    <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-8)" }}>
      Colour tokens
    </h2>
    <p style={{ color: "var(--fg-muted)", marginBottom: "var(--space-8)" }}>
      All colour values are defined in <code>src/tokens/tokens.css</code>. Component CSS references
      these custom properties exclusively — no raw hex values.
    </p>
    <div style={{ display: "grid", gap: "var(--space-4)", maxWidth: "32rem" }}>
      <Swatch token="--bg" label="Page background" border />
      <Swatch token="--surface" label="Subtle elevation, code/quote blocks" border />
      <Swatch token="--fg" label="Primary text, wordmark, sigil stroke" />
      <Swatch token="--fg-muted" label="Secondary copy, footer, captions" />
      <Swatch token="--hairline" label="Dividers, 1 px rules, borders" border />
      <Swatch token="--accent" label="Status dot, link underline on hover, focus ring" />
      <Swatch token="--accent-glow" label="Selection background" border />
    </div>
  </div>
);

export const Typography: Story = () => (
  <div style={{ padding: "var(--space-12) var(--space-8)", maxWidth: "var(--content-max)" }}>
    <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-8)" }}>
      Typography tokens
    </h2>

    <div style={sectionStyle}>
      <p style={labelStyle}>Font families</p>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <p style={monoSmall}>--font-serif</p>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--fs-tagline)",
            lineHeight: 1.2,
            margin: "var(--space-2) 0 var(--space-6)",
          }}
        >
          Instrument Serif
        </p>
        <p style={monoSmall}>--font-sans</p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(1.5rem, 1rem + 2vw, 2rem)",
            lineHeight: 1.2,
            margin: "var(--space-2) 0 var(--space-6)",
          }}
        >
          Geist
        </p>
        <p style={monoSmall}>--font-mono</p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-body)",
            lineHeight: 1.4,
            margin: "var(--space-2) 0",
          }}
        >
          Geist Mono
        </p>
      </div>
    </div>

    <div style={sectionStyle}>
      <p style={labelStyle}>Fluid type scale</p>
      <TypeRow token="--fs-wordmark" sample="POUKAI wordmark" />
      <TypeRow token="--fs-tagline" sample="Technical consulting." family="--font-serif" />
      <TypeRow token="--fs-body" sample="Body copy — the default reading size." />
      <TypeRow token="--fs-meta" sample="Meta — labels, captions, timestamps." />
      <TypeRow token="--fs-micro" sample="MICRO — uppercase labels, mono tags." />
    </div>

    <div style={sectionStyle}>
      <p style={labelStyle}>Stat / display numerals</p>
      <TypeRow token="--fs-stat" sample="85%" family="--font-serif" />
      <TypeRow token="--fs-stat-large" sample="3.2×" family="--font-serif" />
    </div>
  </div>
);

export const Spacing: Story = () => (
  <div style={{ padding: "var(--space-12) var(--space-8)", maxWidth: "var(--content-max)" }}>
    <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-8)" }}>
      Spacing tokens
    </h2>
    <p style={{ color: "var(--fg-muted)", marginBottom: "var(--space-8)" }}>
      4 px base grid. The bar width is proportional to the token value.
    </p>
    <SpaceRow token="--space-1" />
    <SpaceRow token="--space-2" />
    <SpaceRow token="--space-3" />
    <SpaceRow token="--space-4" />
    <SpaceRow token="--space-6" />
    <SpaceRow token="--space-8" />
    <SpaceRow token="--space-12" />
    <SpaceRow token="--space-16" />
    <SpaceRow token="--space-24" />
    <SpaceRow token="--space-32" />
  </div>
);

export const Motion: Story = () => (
  <div style={{ padding: "var(--space-12) var(--space-8)", maxWidth: "var(--content-max)" }}>
    <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-8)" }}>
      Motion tokens
    </h2>
    <p style={{ color: "var(--fg-muted)", marginBottom: "var(--space-8)" }}>
      Hover each bar to see the transition play at the token values.
    </p>

    <div style={sectionStyle}>
      <p style={labelStyle}>Durations</p>
      {(
        [
          { token: "--dur-fast", label: "180 ms — micro-interactions" },
          { token: "--dur-mid", label: "240 ms — link underlines, state changes" },
          { token: "--dur-slow", label: "600 ms — entrance animations" },
        ] as { token: string; label: string }[]
      ).map(({ token, label }) => (
        <div
          key={token}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-6)",
            marginBottom: "var(--space-4)",
          }}
        >
          <p style={{ ...monoSmall, width: "9rem", flexShrink: 0 }}>{token}</p>
          <div
            style={{
              height: "0.75rem",
              width: "6rem",
              background: "var(--accent)",
              borderRadius: "var(--radius-1)",
              transition: `width var(${token}) var(--easing), background var(${token}) var(--easing)`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.width = "14rem";
              (e.currentTarget as HTMLDivElement).style.background = "var(--fg)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.width = "6rem";
              (e.currentTarget as HTMLDivElement).style.background = "var(--accent)";
            }}
          />
          <p style={monoSmall}>{label}</p>
        </div>
      ))}
    </div>

    <div style={sectionStyle}>
      <p style={labelStyle}>Easings</p>
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {(
          [
            { token: "--easing", label: "expo-out — entrance" },
            { token: "--easing-link", label: "link underline grow" },
          ] as { token: string; label: string }[]
        ).map(({ token, label }) => (
          <div key={token} style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
            <p style={{ ...monoSmall, width: "11rem", flexShrink: 0 }}>{token}</p>
            <p style={monoSmall}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Radii: Story = () => (
  <div style={{ padding: "var(--space-12) var(--space-8)", maxWidth: "var(--content-max)" }}>
    <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-8)" }}>
      Radii tokens
    </h2>
    <div
      style={{ display: "flex", gap: "var(--space-8)", flexWrap: "wrap", alignItems: "flex-end" }}
    >
      {(
        [
          { token: "--radius-1", label: "focus ring (2 px)" },
          { token: "--radius-2", label: "buttons, inputs (4 px)" },
          { token: "--radius-3", label: "cards, panels (8 px)" },
        ] as { token: string; label: string }[]
      ).map(({ token, label }) => (
        <div key={token} style={{ textAlign: "center" }}>
          <div
            style={{
              width: "3.5rem",
              height: "3.5rem",
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: `var(${token})`,
              marginBottom: "var(--space-2)",
            }}
          />
          <p style={monoSmall}>{token}</p>
          <p style={{ ...monoSmall, marginTop: "0.125rem" }}>{label}</p>
        </div>
      ))}
    </div>
  </div>
);
