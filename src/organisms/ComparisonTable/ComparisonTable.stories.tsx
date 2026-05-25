import type { Story, StoryDefault } from "@ladle/react";
import { ComparisonTable } from "./ComparisonTable";

export default {
  title: "Organisms / ComparisonTable",
} satisfies StoryDefault;

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const tiers = [
  { label: "Free" },
  { label: "Pro", featured: true, subtext: "/month" },
  { label: "Team", subtext: "/month" },
];

const rows = [
  { group: "Storage" },
  { feature: "Projects", values: ["3", "Unlimited", "Unlimited"] },
  { feature: "Members", values: ["1", "5", "Unlimited"] },
  { feature: "Storage", values: ["500 MB", "20 GB", "Unlimited"] },
  { group: "Support" },
  { feature: "SLA", values: ["—", "Email", "Priority"] },
  { feature: "Onboarding", values: ["—", "—", "Dedicated CSM"] },
];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = () => (
  <div style={{ padding: "var(--space-8)", background: "var(--bg)", maxWidth: "64rem" }}>
    <ComparisonTable caption="Plan feature comparison" tiers={tiers} rows={rows} />
  </div>
);

export const Striped: Story = () => (
  <div style={{ padding: "var(--space-8)", background: "var(--bg)", maxWidth: "64rem" }}>
    <ComparisonTable
      caption="Plan feature comparison — striped"
      tiers={tiers}
      rows={rows}
      striped
    />
  </div>
);

export const NoStickyHeader: Story = () => (
  <div
    style={{
      padding: "var(--space-8)",
      background: "var(--bg)",
      maxWidth: "64rem",
      height: "200px",
      overflow: "hidden",
    }}
  >
    <ComparisonTable caption="No sticky header" tiers={tiers} rows={rows} stickyHeader={false} />
  </div>
);

export const CaptionSrOnly: Story = () => (
  <div style={{ padding: "var(--space-8)", background: "var(--bg)", maxWidth: "64rem" }}>
    <ComparisonTable
      caption="Plan feature comparison"
      captionVisibility="sr-only"
      tiers={tiers}
      rows={rows}
    />
  </div>
);

export const ShorthandTiers: Story = () => (
  <div style={{ padding: "var(--space-8)", background: "var(--bg)", maxWidth: "64rem" }}>
    <ComparisonTable
      caption="Shorthand string tiers"
      tiers={["Free", "Pro", "Team"]}
      rows={[
        { feature: "Projects", values: ["3", "Unlimited", "Unlimited"] },
        { feature: "Members", values: ["1", "5", "Unlimited"] },
        { feature: "Support", values: ["—", "Email", "Priority"] },
      ]}
    />
  </div>
);

export const AllRows: Story = () => (
  <div style={{ padding: "var(--space-8)", background: "var(--bg)", maxWidth: "64rem" }}>
    <ComparisonTable
      caption="Full feature comparison"
      tiers={[
        { label: "Starter" },
        { label: "Growth", featured: true, subtext: "Most popular" },
        { label: "Scale" },
        { label: "Enterprise" },
      ]}
      rows={[
        { group: "Core" },
        { feature: "Projects", values: ["5", "25", "Unlimited", "Unlimited"] },
        { feature: "Users", values: ["1", "10", "50", "Unlimited"] },
        { feature: "API Calls / mo", values: ["10k", "100k", "1M", "Unlimited"] },
        { group: "Integrations" },
        { feature: "GitHub", values: ["✓", "✓", "✓", "✓"] },
        { feature: "Slack", values: ["—", "✓", "✓", "✓"] },
        { feature: "SSO / SAML", values: ["—", "—", "✓", "✓"] },
        { group: "Support" },
        { feature: "Documentation", values: ["✓", "✓", "✓", "✓"] },
        { feature: "Email support", values: ["—", "✓", "✓", "✓"] },
        { feature: "SLA", values: ["—", "—", "99.9%", "99.99%"] },
        { feature: "Dedicated CSM", values: ["—", "—", "—", "✓"] },
      ]}
      striped
    />
  </div>
);
