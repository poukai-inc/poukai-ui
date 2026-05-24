import type { Story, StoryDefault } from "@ladle/react";
import { PricingTable } from "./PricingTable";
import { PriceTier } from "../../molecules/PriceTier";

export default {
  title: "Components / PricingTable",
} satisfies StoryDefault;

const makeButton = (label: string, primary = false) => (
  <button
    type="button"
    style={{
      width: "100%",
      padding: "var(--space-3) var(--space-4)",
      background: primary ? "var(--fg)" : "transparent",
      color: primary ? "var(--bg)" : "var(--fg)",
      border: primary ? "none" : "var(--hairline-w) solid var(--hairline)",
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
  <PricingTable
    heading={
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--fs-h2)",
          color: "var(--fg)",
          margin: 0,
        }}
      >
        Simple, transparent pricing
      </h2>
    }
  >
    <PriceTier
      name="Starter"
      price="$0"
      cadence="free forever"
      description="Everything you need to get started."
      features={["5 projects", "1 GB storage", "Community support"]}
      cta={makeButton("Get started with Starter")}
    />
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
      cta={makeButton("Get started with Pro", true)}
    />
    <PriceTier
      name="Enterprise"
      price="Custom"
      cadence="contact for pricing"
      description="Tailored for large organisations with compliance requirements."
      features={["Everything in Pro", "SSO / SAML", "SLA guarantee", "Dedicated support"]}
      cta={makeButton("Contact sales")}
    />
  </PricingTable>
);

export const WithFeatured: Story = () => (
  <PricingTable>
    <PriceTier
      name="Basic"
      price="$9"
      cadence="per month"
      features={["3 projects", "5 GB storage"]}
      cta={makeButton("Get started with Basic")}
    />
    <PriceTier
      featured
      name="Pro"
      price="$49"
      cadence="per month"
      features={["Unlimited projects", "50 GB storage", "Priority support"]}
      cta={makeButton("Get started with Pro", true)}
    />
    <PriceTier
      name="Team"
      price="$99"
      cadence="per month"
      features={["Everything in Pro", "5 seats included", "Team billing"]}
      cta={makeButton("Get started with Team")}
    />
  </PricingTable>
);

export const TwoColumn: Story = () => (
  <PricingTable columns={2}>
    <PriceTier
      name="Starter"
      price="$0"
      cadence="free forever"
      features={["5 projects", "Community support"]}
      cta={makeButton("Get started with Starter")}
    />
    <PriceTier
      featured
      name="Pro"
      price="$49"
      cadence="per month"
      features={["Unlimited projects", "Priority support", "Custom domain"]}
      cta={makeButton("Get started with Pro", true)}
    />
  </PricingTable>
);

export const AlignTop: Story = () => (
  <PricingTable align="top">
    <PriceTier name="Starter" price="$0" cadence="free forever" />
    <PriceTier featured name="Pro" price="$49" cadence="per month" features={["Feature A"]} />
    <PriceTier
      name="Enterprise"
      price="Custom"
      features={["Feature A", "Feature B", "Feature C", "Feature D"]}
    />
  </PricingTable>
);

export const WithComparisonSlot: Story = () => (
  <PricingTable
    heading={
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h2)", margin: 0 }}>
        Plans
      </h2>
    }
    comparison={
      <div
        style={{
          padding: "var(--space-6)",
          border: "var(--hairline-w) solid var(--hairline)",
          borderRadius: "var(--radius-3)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-body)",
          color: "var(--fg-muted)",
        }}
      >
        Comparison table placeholder — ComparisonTable organism
      </div>
    }
  >
    <PriceTier name="Starter" price="$0" cadence="free forever" />
    <PriceTier featured name="Pro" price="$49" cadence="per month" />
    <PriceTier name="Enterprise" price="Custom" cadence="contact us" />
  </PricingTable>
);
