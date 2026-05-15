import type { CSSProperties } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Wordmark } from "./Wordmark";

export default {
  title: "Brand / Wordmark",
} satisfies StoryDefault;

const monoSmall: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--fs-micro)",
  color: "var(--fg-muted)",
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  marginBottom: "var(--space-3)",
};

/**
 * Every standard height on every background token.
 * Canonical visual regression reference for Wordmark.
 */
export const AllVariants: Story = () => (
  <div
    style={{
      padding: "var(--space-8)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-10)",
    }}
  >
    {/* On light */}
    <div>
      <p style={monoSmall}>On --bg (light)</p>
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-3)",
          padding: "var(--space-8)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: "var(--space-8)",
        }}
      >
        {[16, 24, 32, 40, 48, 56, 64, 80, 96].map((h) => (
          <div
            key={h}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Wordmark height={h} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-micro)",
                color: "var(--fg-muted)",
              }}
            >
              {h}px
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* On surface */}
    <div>
      <p style={monoSmall}>On --surface</p>
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-3)",
          padding: "var(--space-8)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: "var(--space-8)",
        }}
      >
        {[24, 40, 56, 80].map((h) => (
          <div
            key={h}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Wordmark height={h} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-micro)",
                color: "var(--fg-muted)",
              }}
            >
              {h}px
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* On dark */}
    <div>
      <p style={monoSmall}>On --fg (dark / inverted)</p>
      <div
        style={{
          background: "var(--fg)",
          borderRadius: "var(--radius-3)",
          padding: "var(--space-8)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: "var(--space-8)",
          color: "var(--bg)",
        }}
      >
        {[24, 40, 56, 80].map((h) => (
          <div
            key={h}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Wordmark height={h} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-micro)",
                color: "var(--bg)",
                opacity: 0.5,
              }}
            >
              {h}px
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Custom labels */}
    <div>
      <p style={monoSmall}>Custom label prop</p>
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-3)",
          padding: "var(--space-8)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--space-8)",
        }}
      >
        <div>
          <Wordmark height={48} label="Poukai — AI consulting" />
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-micro)",
              color: "var(--fg-muted)",
              marginTop: "var(--space-2)",
            }}
          >
            label="Poukai — AI consulting"
          </p>
        </div>
        <div>
          <Wordmark height={48} label="Go to Poukai homepage" />
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-micro)",
              color: "var(--fg-muted)",
              marginTop: "var(--space-2)",
            }}
          >
            label="Go to Poukai homepage"
          </p>
        </div>
      </div>
    </div>
  </div>
);
