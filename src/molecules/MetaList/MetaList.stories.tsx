import type { Story, StoryDefault } from "@ladle/react";
import { MetaList } from "./MetaList";

export default {
  title: "Molecules / MetaList",
} satisfies StoryDefault;

export const Default: Story = () => (
  <div style={{ maxWidth: "20rem" }}>
    <MetaList
      items={[
        { label: "Published", value: "2026-05-22" },
        { label: "Reading time", value: "6 min" },
        { label: "Author", value: "Arian Zargaran" },
      ]}
    />
  </div>
);

export const ArticleMeta: Story = () => (
  <div style={{ maxWidth: "20rem" }}>
    <MetaList
      dividers
      items={[
        { label: "Published", value: "2026-05-22" },
        { label: "Updated", value: "2026-05-23" },
        { label: "Reading time", value: "6 min" },
        { label: "Author", value: "Arian Zargaran" },
        { label: "Category", value: "Design Systems" },
      ]}
    />
  </div>
);

export const PricingDetail: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <MetaList
      orientation="horizontal"
      labelWidth="9rem"
      dividers
      items={[
        { label: "Billing cycle", value: "Annual" },
        { label: "Seats", value: "Up to 10" },
        { label: "Support tier", value: "Priority" },
        { label: "SLA", value: "99.9% uptime" },
        { label: "Contract", value: "Month-to-month" },
      ]}
    />
  </div>
);

export const Horizontal: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <MetaList
      orientation="horizontal"
      labelWidth="8rem"
      items={[
        { label: "Version", value: "2.1.0" },
        { label: "License", value: "MIT" },
        { label: "Size", value: "42 kB" },
      ]}
    />
  </div>
);
