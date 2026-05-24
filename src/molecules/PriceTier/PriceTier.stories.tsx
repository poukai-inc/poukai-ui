import type { Story, StoryDefault } from "@ladle/react";
import { PriceTier } from "./PriceTier";

/** Minimal inline button stand-in — DS stories never import lucide-react. */
const Btn = ({ children, variant = "secondary" }: { children: string; variant?: string }) => (
  <button
    style={{
      width: "100%",
      padding: "0.625rem 1rem",
      border: variant === "primary" ? "none" : "1px solid var(--hairline)",
      borderRadius: "var(--radius-3)",
      background: variant === "primary" ? "var(--accent)" : "transparent",
      color: variant === "primary" ? "#fff" : "var(--fg)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-meta)",
      cursor: "pointer",
    }}
    type="button"
  >
    {children}
  </button>
);

/** Minimal inline check icon — no lucide-react dependency in DS stories. */
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 18 4 13" />
  </svg>
);

export default {
  title: "Components / Cards / PriceTier",
} satisfies StoryDefault;

/**
 * Default — minimal tier: name + price + bullets + CTA, no featured badge.
 */
export const Default: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <PriceTier
      name="Starter"
      price="$0"
      bullets={["5 projects", "1 GB storage", "Community support"]}
      cta={<Btn>Get started free</Btn>}
    />
  </div>
);

/**
 * Featured — recommended tier with elevated surface + badge + accent border.
 */
export const Featured: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <PriceTier
      featured
      name="Pro"
      price="$29"
      per="month"
      bullets={["Unlimited projects", "100 GB storage", "Priority support", "Custom integrations"]}
      cta={<Btn variant="primary">Start free trial</Btn>}
    />
  </div>
);

/**
 * WithLongBullets — stress-tests bullet wrapping at narrow card width.
 */
export const WithLongBullets: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <PriceTier
      name="Enterprise"
      price="Custom"
      bullets={[
        "Unlimited seats across all regions",
        "99.99% uptime SLA with dedicated infrastructure",
        "SOC 2 Type II compliance and audit logs",
        "Dedicated customer success manager",
      ]}
      bulletIcon={<CheckIcon />}
      cta={<Btn>Contact sales</Btn>}
    />
  </div>
);

/**
 * ThreeTierComposition — canonical pricing grid with Starter / Pro / Enterprise.
 * Featured is set on Pro only (spec anti-pattern: only one tier should be featured).
 */
export const ThreeTierComposition: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-4)",
      maxWidth: "56rem",
    }}
  >
    <PriceTier
      name="Starter"
      price="$0"
      bullets={["5 projects", "1 GB storage", "Community support"]}
      bulletIcon={<CheckIcon />}
      cta={<Btn>Get started</Btn>}
    />
    <PriceTier
      featured
      name="Pro"
      price="$29"
      per="month"
      bullets={["Unlimited projects", "100 GB storage", "Priority support", "Custom integrations"]}
      bulletIcon={<CheckIcon />}
      cta={<Btn variant="primary">Start free trial</Btn>}
    />
    <PriceTier
      name="Enterprise"
      price="Custom"
      bullets={["Unlimited seats", "Dedicated infrastructure", "SOC 2 compliance", "Dedicated CSM"]}
      bulletIcon={<CheckIcon />}
      cta={<Btn>Contact sales</Btn>}
    />
  </div>
);
