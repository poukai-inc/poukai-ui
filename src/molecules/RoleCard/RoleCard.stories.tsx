import type { Story, StoryDefault } from "@ladle/react";
import { RoleCard } from "./RoleCard";

/**
 * Stand-in icon — a simple rounded square. Ladle never imports lucide-react
 * because the DS doesn't either. Consumers (the site) pass their own glyph.
 */
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

export default {
  title: "Components / RoleCard",
} satisfies StoryDefault;

export const Playground: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <RoleCard
      icon={<PlaceholderIcon />}
      eyebrow="Role 01"
      title="Builder"
      body="Ships production systems end-to-end. Comfortable in the codebase from day one; closes the loop between design intent and what runs in prod."
      hiredBy="Anthropic · Vercel · Stripe"
    />
  </div>
);

export const NoIcon: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <RoleCard
      eyebrow="Role 02"
      title="Automator"
      body="Turns repeatable, high-friction internal work into reliable software."
      hiredBy="Linear · Notion"
    />
  </div>
);

export const NoFooter: Story = () => (
  <div style={{ maxWidth: "22rem" }}>
    <RoleCard
      icon={<PlaceholderIcon />}
      eyebrow="Role 03"
      title="Educator"
      body="Brings the team up the curve — workshops, pairing, and codified playbooks."
    />
  </div>
);

export const FourUpGrid: Story = () => {
  const roles: Array<{ eyebrow: string; title: string; body: string; hiredBy: string }> = [
    {
      eyebrow: "Role 01",
      title: "Builder",
      body: "Ships production systems end-to-end.",
      hiredBy: "Anthropic · Vercel · Stripe",
    },
    {
      eyebrow: "Role 02",
      title: "Automator",
      body: "Turns repeatable, high-friction internal work into reliable software.",
      hiredBy: "Linear · Notion",
    },
    {
      eyebrow: "Role 03",
      title: "Educator",
      body: "Brings the team up the curve — workshops, pairing, and codified playbooks.",
      hiredBy: "Shopify · Figma",
    },
    {
      eyebrow: "Role 04",
      title: "Creator",
      body: "Shapes the product surface — prototypes, motion, the feel of the thing.",
      hiredBy: "Arc · Raycast",
    },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
        gap: "var(--space-6)",
      }}
    >
      {roles.map((r) => (
        <RoleCard
          key={r.title}
          icon={<PlaceholderIcon />}
          eyebrow={r.eyebrow}
          title={r.title}
          body={r.body}
          hiredBy={r.hiredBy}
        />
      ))}
    </div>
  );
};
