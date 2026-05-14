import type { CSSProperties } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Wordmark } from "../atoms/Wordmark";
import { StatusBadge } from "../atoms/StatusBadge";
import { Button } from "../atoms/Button";
import { Stat } from "../atoms/Stat";
import { Hero } from "../molecules/Hero";
import { Principle } from "../molecules/Principle";
import { RoleCard } from "../molecules/RoleCard";
import { FailureMode } from "../molecules/FailureMode";

export default {
  title: "Showcase / Overview",
} satisfies StoryDefault;

const PlaceholderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 12h8" />
  </svg>
);

const sectionStyle: CSSProperties = {
  borderTop: "1px solid var(--hairline)",
  paddingTop: "var(--space-12)",
  marginTop: "var(--space-12)",
};

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--fs-micro)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--fg-muted)",
  marginBottom: "var(--space-6)",
};

const rowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--space-4)",
};

/**
 * Full-library overview — one of every component, grouped by atomic layer.
 * Use this as a quick visual health check after token or component changes.
 */
export const Default: Story = () => (
  <div
    style={{
      padding: "var(--space-12) var(--space-8)",
      maxWidth: "var(--content-max)",
      margin: "0 auto",
    }}
  >
    {/* Header */}
    <div style={{ marginBottom: "var(--space-8)" }}>
      <Wordmark height={48} />
    </div>
    <h1
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "var(--fs-tagline)",
        margin: "0 0 var(--space-4)",
      }}
    >
      @poukai-inc/ui
    </h1>
    <p style={{ color: "var(--fg-muted)", maxWidth: "36rem", margin: "0 0 var(--space-2)" }}>
      Poukai design system — React components, design tokens, and brand assets.
    </p>
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-micro)",
        color: "var(--fg-muted)",
      }}
    >
      v{/* version injected at runtime by package.json consumers */}
      0.2.x · MIT-licensed tokens · UNLICENSED components
    </p>

    {/* ── Atoms ── */}
    <div style={sectionStyle}>
      <p style={labelStyle}>Atoms</p>

      <div style={{ marginBottom: "var(--space-8)" }}>
        <p style={{ ...labelStyle, fontSize: "var(--fs-micro)", marginBottom: "var(--space-3)" }}>
          Wordmark
        </p>
        <div style={rowStyle}>
          <Wordmark height={32} />
          <Wordmark height={48} />
          <Wordmark height={64} />
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-8)" }}>
        <p style={{ ...labelStyle, fontSize: "var(--fs-micro)", marginBottom: "var(--space-3)" }}>
          StatusBadge
        </p>
        <div style={rowStyle}>
          <StatusBadge status="available">Taking conversations for Q3.</StatusBadge>
          <StatusBadge status="idle">Reviewing scope.</StatusBadge>
          <StatusBadge status="closed">At capacity.</StatusBadge>
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-8)" }}>
        <p style={{ ...labelStyle, fontSize: "var(--fs-micro)", marginBottom: "var(--space-3)" }}>
          Button
        </p>
        <div style={rowStyle}>
          <Button variant="primary">Get in touch</Button>
          <Button variant="secondary">Learn more</Button>
          <Button variant="ghost">Dismiss</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-8)" }}>
        <p style={{ ...labelStyle, fontSize: "var(--fs-micro)", marginBottom: "var(--space-3)" }}>
          Stat
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
            gap: "var(--space-8)",
          }}
        >
          <Stat
            value="85%"
            caption="of AI pilots never reach production."
            source="MIT Sloan, 2025"
          />
          <Stat
            value="$300B"
            caption="annual spend that stalls at proof-of-concept."
            source="IDC, 2025"
            align="end"
          />
        </div>
      </div>
    </div>

    {/* ── Molecules ── */}
    <div style={sectionStyle}>
      <p style={labelStyle}>Molecules</p>

      <div style={{ marginBottom: "var(--space-12)" }}>
        <p style={{ ...labelStyle, fontSize: "var(--fs-micro)", marginBottom: "var(--space-3)" }}>
          Hero
        </p>
        <Hero
          status={<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>}
          title={
            <>
              Technical consulting for teams shipping with <em>AI</em>.
            </>
          }
          lede="We work alongside founders and platform teams to close the gap between pilot and production."
          cta={
            <Button asChild>
              <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
            </Button>
          }
        />
      </div>

      <div style={{ marginBottom: "var(--space-12)" }}>
        <p style={{ ...labelStyle, fontSize: "var(--fs-micro)", marginBottom: "var(--space-3)" }}>
          RoleCard
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
            gap: "var(--space-6)",
            maxWidth: "44rem",
          }}
        >
          <RoleCard
            icon={<PlaceholderIcon />}
            eyebrow="Role 01"
            title="Builder"
            body="Ships production systems end-to-end."
            hiredBy="Anthropic · Vercel"
          />
          <RoleCard
            icon={<PlaceholderIcon />}
            eyebrow="Role 02"
            title="Automator"
            body="Turns repeatable, high-friction work into reliable software."
            hiredBy="Linear · Notion"
          />
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-12)" }}>
        <p style={{ ...labelStyle, fontSize: "var(--fs-micro)", marginBottom: "var(--space-3)" }}>
          Principle
        </p>
        <div style={{ maxWidth: "56rem" }}>
          <Principle numeral="i." title="Ship the smallest real thing.">
            <p>Pilots fail because they're rehearsals. Production is the only proving ground.</p>
          </Principle>
          <Principle numeral="ii." title="Senior, end-to-end, no handoff theatre.">
            <p>Every engagement is one or two senior engineers from intake through cutover.</p>
          </Principle>
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-12)" }}>
        <p style={{ ...labelStyle, fontSize: "var(--fs-micro)", marginBottom: "var(--space-3)" }}>
          FailureMode
        </p>
        <div style={{ maxWidth: "56rem" }}>
          <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
            <p>The demo dazzles; the production loop never closes.</p>
          </FailureMode>
          <FailureMode index={2} title="Eval theatre.">
            <p>Vibes-based evaluation. Spreadsheets that nobody updates.</p>
          </FailureMode>
        </div>
      </div>
    </div>
  </div>
);
