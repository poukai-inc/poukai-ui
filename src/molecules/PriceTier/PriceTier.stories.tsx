import type { Story, StoryDefault } from "@ladle/react";
import { PriceTier } from "./PriceTier";

export default {
  title: "Components / PriceTier",
} satisfies StoryDefault;

const ctaButton = (label: string) => (
  <button
    type="button"
    style={{
      width: "100%",
      padding: "var(--space-3) var(--space-4)",
      background: "var(--fg)",
      color: "var(--bg)",
      border: "none",
      borderRadius: "var(--radius-3)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      cursor: "pointer",
    }}
  >
    {label}
  </button>
);

const secondaryCtaButton = (label: string) => (
  <button
    type="button"
    style={{
      width: "100%",
      padding: "var(--space-3) var(--space-4)",
      background: "transparent",
      color: "var(--fg)",
      border: "var(--hairline-w) solid var(--hairline)",
      borderRadius: "var(--radius-3)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      cursor: "pointer",
    }}
  >
    {label}
  </button>
);

export const Default: Story = () => (
  <div style={{ maxWidth: "320px" }}>
    <PriceTier
      name="Starter"
      price="$0"
      cadence="free forever"
      description="Everything you need to get started."
      features={["5 projects", "1 GB storage", "Community support"]}
      cta={secondaryCtaButton("Get started with Starter")}
    />
  </div>
);

export const Featured: Story = () => (
  <div style={{ maxWidth: "320px" }}>
    <PriceTier
      featured
      name="Pro"
      price="$49"
      cadence="per month"
      description="For growing teams that need more power."
      features={[
        "Unlimited projects",
        "50 GB storage",
        "Priority support",
        "Custom domain",
        "Advanced analytics",
      ]}
      cta={ctaButton("Get started with Pro")}
    />
  </div>
);

export const Enterprise: Story = () => (
  <div style={{ maxWidth: "320px" }}>
    <PriceTier
      name="Enterprise"
      price="Custom"
      cadence="contact for pricing"
      description="Tailored for large organisations with compliance requirements."
      features={["Everything in Pro", "SSO / SAML", "SLA guarantee", "Dedicated support"]}
      cta={secondaryCtaButton("Contact sales")}
    />
  </div>
);

export const MinimalNoFeatures: Story = () => (
  <div style={{ maxWidth: "320px" }}>
    <PriceTier name="Basic" price="$9" cadence="per month" />
  </div>
);
