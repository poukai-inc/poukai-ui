import type { Story, StoryDefault } from "@ladle/react";
import { FeatureCard } from "./FeatureCard";

/**
 * Stand-in icon — a simple lightning bolt shape. Ladle stories in the DS
 * never import lucide-react; consumers (the site) pass their own glyph.
 */
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

export default {
  title: "Components / Cards / FeatureCard",
} satisfies StoryDefault;

/**
 * Default — icon + title + body. No eyebrow, no footer, default variant.
 * Verifies: icon renders with aria-hidden wrapper, gap stack correct,
 * body muted color, transparent background.
 */
export const Default: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <FeatureCard
      icon={<ZapIcon size={24} />}
      title="Ship faster"
      body="From prototype to production in days, not months. We close the loop between design intent and what runs in prod."
    />
  </div>
);

/**
 * WithEyebrowAndFooter — icon + eyebrow (string form) + title + body + footer.
 * Verifies: eyebrow wraps in <Eyebrow variant="muted">, body→footer gap at
 * --space-6, footer wrapper default muted/meta register.
 */
export const WithEyebrowAndFooter: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <FeatureCard
      icon={<ZapIcon size={24} />}
      eyebrow="Platform"
      title="Observability"
      body="Every inference logged, traced, and alertable. Full visibility into what your models are doing in production."
      footer={<a href="/docs/observability">Learn more →</a>}
    />
  </div>
);

/**
 * Bordered — variant="bordered" + full slots (icon + title + body).
 * Verifies: --surface background, 1px solid --hairline border, --radius-3
 * corners, padding reads correctly against visible edge.
 */
export const Bordered: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <FeatureCard
      variant="bordered"
      icon={<ZapIcon size={24} />}
      title="Custom AI builds"
      body="Production-grade pipelines tailored to your data, your stack, and your deployment constraints."
    />
  </div>
);

/**
 * TitleOnly — title + body only, no icon, no eyebrow, no footer.
 * Degenerate stress test: verifies clean render with minimum required slots
 * and no gap artifacts from absent optional slots.
 */
export const TitleOnly: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <FeatureCard
      title="Minimal feature tile"
      body="Both title and body are required. This story confirms the component renders cleanly without any optional slots present."
    />
  </div>
);

/**
 * AsLiPolymorphism — as="li" inside a <ul>.
 * Verifies: root element is <li>, inherits all styles identically, no
 * landmark regression (aria-labelledby is omitted for <li>).
 */
export const AsLiPolymorphism: Story = () => (
  <ul style={{ listStyle: "none", padding: 0, margin: 0, maxWidth: "22rem" }}>
    <FeatureCard
      as="li"
      icon={<ZapIcon size={24} />}
      eyebrow="Capability"
      title="Automated workflows"
      body="Turn repeatable, high-friction internal work into reliable software pipelines."
      footer={<a href="/capabilities">See all capabilities →</a>}
    />
  </ul>
);
