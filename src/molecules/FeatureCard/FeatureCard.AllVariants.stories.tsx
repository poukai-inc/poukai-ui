import type { Story, StoryDefault } from "@ladle/react";
import { Eyebrow } from "../../atoms/Eyebrow";
import { FeatureCard } from "./FeatureCard";

const ZapIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ShieldIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LayersIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const GitBranchIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

export default {
  title: "Components / Cards / FeatureCard / All Variants",
} satisfies StoryDefault;

/**
 * ThreeColumnGrid — three default FeatureCards in a CSS 3-column grid.
 * Varying body lengths. Verifies grid layout, icon alignment, tile rhythm.
 */
export const ThreeColumnGrid: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-6)",
    }}
  >
    <FeatureCard
      icon={<ZapIcon size={24} />}
      title="Ship faster"
      body="From prototype to production in days, not months."
    />
    <FeatureCard
      icon={<ShieldIcon size={24} />}
      title="Secure by default"
      body="Every pipeline is air-gapped, audited, and compliant with your existing security posture. No exceptions."
    />
    <FeatureCard
      icon={<LayersIcon size={24} />}
      title="Composable architecture"
      body="Stack capabilities modularly. Swap models, stores, and retrieval strategies without rebuilding."
    />
  </div>
);

/**
 * BorderedGrid — four bordered FeatureCards in a 2×2 CSS grid.
 * Verifies: bordered variant at grid scale, tile containment, radius +
 * border + surface bg working together.
 */
export const BorderedGrid: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "var(--space-6)",
    }}
  >
    <FeatureCard
      variant="bordered"
      icon={<ZapIcon size={24} />}
      title="Ship faster"
      body="From prototype to production in days, not months."
    />
    <FeatureCard
      variant="bordered"
      icon={<ShieldIcon size={24} />}
      title="Secure by default"
      body="Every pipeline is air-gapped, audited, and compliant with your existing security posture."
    />
    <FeatureCard
      variant="bordered"
      icon={<LayersIcon size={24} />}
      title="Composable architecture"
      body="Stack capabilities modularly. Swap models, stores, and retrieval strategies without rebuilding."
    />
    <FeatureCard
      variant="bordered"
      icon={<GitBranchIcon size={24} />}
      title="Version-controlled prompts"
      body="Every prompt change tracked, reviewed, and rollbackable. Treat inference as code."
    />
  </div>
);

/**
 * SemanticFeatureList — five FeatureCards as as="li" inside <ul>.
 * Stacked vertically (1 column). Verifies semantic list structure.
 */
export const SemanticFeatureList: Story = () => (
  <ul
    style={{
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      maxWidth: "36rem",
    }}
  >
    <FeatureCard
      as="li"
      icon={<ZapIcon size={24} />}
      title="Ship faster"
      body="From prototype to production in days, not months."
    />
    <FeatureCard
      as="li"
      icon={<ShieldIcon size={24} />}
      title="Secure by default"
      body="Every pipeline is air-gapped, audited, and compliant."
    />
    <FeatureCard
      as="li"
      icon={<LayersIcon size={24} />}
      title="Composable architecture"
      body="Stack capabilities modularly without rebuilding."
    />
    <FeatureCard
      as="li"
      icon={<GitBranchIcon size={24} />}
      title="Version-controlled prompts"
      body="Every prompt change tracked, reviewed, and rollbackable."
    />
    <FeatureCard
      as="li"
      title="No-lock-in deployment"
      body="Deploy to any cloud or on-prem environment. The stack is yours."
    />
  </ul>
);

/**
 * EyebrowReactNode — eyebrow={<Eyebrow variant="solid">New</Eyebrow>} ReactNode form.
 * Verifies pass-through (no double-wrapping), solid variant renders at full contrast.
 */
export const EyebrowReactNode: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <FeatureCard
      icon={<ZapIcon size={24} />}
      eyebrow={<Eyebrow variant="solid">New</Eyebrow>}
      title="Real-time tracing"
      body="Trace every token, every call, every latency spike — live in your existing observability stack."
    />
  </div>
);

/**
 * TitleH2Override — titleAs="h2" + full slots.
 * Verifies the title renders as <h2> for a standalone section context
 * that does not have a preceding h2.
 */
export const TitleH2Override: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <FeatureCard
      titleAs="h2"
      icon={<ShieldIcon size={24} />}
      eyebrow="Security"
      title="Zero-trust by design"
      body="Built for organizations where security is a constraint, not an afterthought."
    />
  </div>
);

/**
 * Icon32px — icon at size={32}.
 * Verifies icon wrapper and gap values remain correct at larger recommended size.
 */
export const Icon32px: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <FeatureCard
      icon={<ZapIcon size={32} />}
      eyebrow="Capability"
      title="High-throughput inference"
      body="Sustained thousands of requests per second with sub-100ms p95 latency on your own infrastructure."
    />
  </div>
);
