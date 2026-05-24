import type { Story } from "@ladle/react";
import { FeatureGrid } from "./FeatureGrid";
import { FeatureCard } from "../../molecules/FeatureCard";

export default { title: "Organisms/FeatureGrid" };

/* ---------- Default (3-column) ---------- */

export const Default: Story = () => (
  <FeatureGrid
    eyebrow="Platform"
    heading="What you get"
    lede="Every capability your team needs to ship AI reliably."
  >
    <FeatureCard title="Ship faster" body="From prototype to production in days, not months." />
    <FeatureCard
      title="Scale reliably"
      body="Automatic routing and load balancing across providers."
    />
    <FeatureCard title="Observe everything" body="Every inference logged, traced, and alertable." />
  </FeatureGrid>
);

/* ---------- Two-column ---------- */

export const TwoColumn: Story = () => (
  <FeatureGrid
    columns={2}
    heading="Enterprise capabilities"
    lede="Security and compliance controls built for operator-grade workloads."
  >
    <FeatureCard
      title="Enterprise SSO"
      body="SAML 2.0 and OIDC integrations with every major identity provider."
    />
    <FeatureCard
      title="Audit logs"
      body="Immutable, tamper-evident logs of every model call and admin action."
    />
    <FeatureCard
      title="Role-based access"
      body="Granular permissions scoped to projects, environments, and model tiers."
    />
    <FeatureCard
      title="Data residency"
      body="Keep inference data within the regions your compliance posture requires."
    />
  </FeatureGrid>
);

/* ---------- Three-column (explicit) ---------- */

export const ThreeColumn: Story = () => (
  <FeatureGrid columns={3} eyebrow="Core platform" heading="Built for reliability">
    <FeatureCard
      title="Multi-provider routing"
      body="Automatic failover and latency-optimised routing across OpenAI, Anthropic, and more."
    />
    <FeatureCard
      title="Semantic caching"
      body="Reduce latency and cost by serving cached responses for semantically equivalent queries."
    />
    <FeatureCard
      title="Streaming support"
      body="First-class SSE streaming with backpressure handling and reconnection logic."
    />
    <FeatureCard
      title="Prompt versioning"
      body="Track, diff, and roll back prompt templates with the same rigour as application code."
    />
    <FeatureCard
      title="Cost controls"
      body="Per-team and per-project budgets with real-time spend alerts."
    />
    <FeatureCard
      title="Evals pipeline"
      body="Automated regression testing for model outputs across every release."
    />
  </FeatureGrid>
);

/* ---------- Marketing-page composition ---------- */

export const MarketingPage: Story = () => (
  <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
    <FeatureGrid
      eyebrow="01 · Platform"
      heading="The infrastructure layer for AI teams."
      lede="pouk.ai sits between your application and the model providers — so your team ships fast and sleeps well."
      size="default"
    >
      <FeatureCard
        variant="bordered"
        title="Unified API"
        body="One integration. Every major model provider. No lock-in."
      />
      <FeatureCard
        variant="bordered"
        title="Observability"
        body="Request traces, cost breakdowns, and latency percentiles — out of the box."
      />
      <FeatureCard
        variant="bordered"
        title="Guardrails"
        body="Content filters, PII redaction, and output validation on every call."
      />
    </FeatureGrid>

    <FeatureGrid
      eyebrow="02 · Reliability"
      heading="Never dark. Never degraded."
      lede="Circuit breakers, fallback chains, and SLA commitments that match your uptime requirements."
      size="default"
    >
      <FeatureCard
        title="Automatic failover"
        body="When a provider degrades, traffic routes to the next best option in milliseconds."
      />
      <FeatureCard
        title="Rate-limit management"
        body="Burst queuing and fair-share scheduling across concurrent workloads."
      />
      <FeatureCard
        title="SLA dashboard"
        body="Real-time availability and P99 latency, per model and per environment."
      />
    </FeatureGrid>
  </div>
);

/* ---------- Tight size ---------- */

export const TightSize: Story = () => (
  <FeatureGrid size="tight" heading="Quick actions" lede="Common tasks, one click away.">
    <FeatureCard title="Deploy" body="Push the latest prompt version to production." />
    <FeatureCard title="Rollback" body="Revert to the previous stable version instantly." />
    <FeatureCard title="Inspect" body="View the last 100 requests with full trace detail." />
  </FeatureGrid>
);

/* ---------- Anonymous (no heading) ---------- */

export const Anonymous: Story = () => (
  <FeatureGrid>
    <FeatureCard title="Feature A" body="No section heading — anonymous grid block." />
    <FeatureCard title="Feature B" body="Embedded inside another Section if needed." />
    <FeatureCard title="Feature C" body="Grid gap and columns still apply." />
  </FeatureGrid>
);
