import type { Story } from "@ladle/react";
import { TimelineItem } from "./TimelineItem.js";

export default { title: "Molecules / TimelineItem" };

export const Default: Story = () => (
  <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
    <TimelineItem
      date="2026-05-22"
      title="Series A closed"
      body="$12M led by Acme Ventures, with participation from Seed Capital and three angels."
    />
  </ol>
);

export const CompanyMilestones: Story = () => (
  <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
    <TimelineItem
      date="2026-05-22"
      title="Series A closed"
      body="$12M led by Acme Ventures. The round will fund hiring across engineering and design."
    />
    <TimelineItem
      date="2025-09-01"
      title="Public beta launched"
      body="Poukai opens to 500 design teams. NPS scores 72 in the first cohort survey."
    />
    <TimelineItem date="2025-01-10" title="Company founded" connector={false} />
  </ol>
);

export const Changelog: Story = () => (
  <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
    <TimelineItem
      date="2026-05-22"
      title="v2.2.0 — TimelineItem molecule"
      body="Adds the TimelineItem molecule for changelog pages and company-milestone sections."
    />
    <TimelineItem
      date="2026-05-15"
      title="v2.1.0 — TagList molecule"
      body="Adds the TagList molecule. Tags now support icon slots and truncation."
    />
    <TimelineItem
      date="2026-05-01"
      title="v2.0.0 — Dark mode"
      body="Full dark-mode token tier shipped. All existing components updated."
      connector={false}
    />
  </ol>
);

export const TitleOnly: Story = () => (
  <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
    <TimelineItem date="2026-05-22" title="Series A closed" />
    <TimelineItem date="2025-09-01" title="Public beta launched" />
    <TimelineItem date="2025-01-10" title="Company founded" connector={false} />
  </ol>
);

export const LastItemNoConnector: Story = () => (
  <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
    <TimelineItem
      date="2026-05-22"
      title="Latest milestone"
      body="This item has a connector to the next."
    />
    <TimelineItem
      date="2025-01-10"
      title="First milestone"
      body="Last item — no connector line below."
      connector={false}
    />
  </ol>
);
