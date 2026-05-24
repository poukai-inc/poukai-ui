import type { Story } from "@ladle/react";
import { TimelineSection } from "./TimelineSection";
import { TimelineItem } from "../../molecules/TimelineItem";

export default {
  title: "Organisms/TimelineSection",
};

export const Default: Story = () => (
  <TimelineSection
    eyebrow="History"
    heading="Our story"
    lede="From side project to production-grade consulting practice."
  >
    <TimelineItem
      date="2024-01"
      title="Side project begins"
      body="Arian starts prototyping AI-assisted workflows for a fintech client."
      connector
    />
    <TimelineItem
      date="2024-09"
      title="First client engagement"
      body="Poukai lands its first production contract — a Series B company rebuilding their data pipeline."
      connector
    />
    <TimelineItem
      date="2025-03"
      title="Poukai Inc. incorporated"
      body="The practice is formalised. Senior-only teams. Production from day one."
      connector={false}
    />
  </TimelineSection>
);

export const OurStoryMilestones: Story = () => (
  <TimelineSection
    eyebrow="Company milestones"
    heading="Built for teams who ship"
    lede="Three years of quiet progress."
  >
    <TimelineItem
      date="2023-06"
      title="Concept"
      body="First experiments with LLM-assisted code review in a private repo."
      connector
    />
    <TimelineItem
      date="2024-01"
      title="Beta"
      body="A small group of engineering teams trialled the workflow tooling."
      connector
    />
    <TimelineItem
      date="2025-03"
      title="Public launch"
      body="poukai-ui design system open-sourced. The consulting practice goes public."
      connector={false}
    />
  </TimelineSection>
);

export const Reversed: Story = () => (
  <TimelineSection eyebrow="Changelog" heading="What's new" reversed>
    <TimelineItem
      date="2024-01"
      title="v0.1.0 — initial atoms"
      body="Wordmark, StatusBadge, Button."
      connector
    />
    <TimelineItem
      date="2024-06"
      title="v0.3.0 — molecules"
      body="Hero, RoleCard, Principle, FailureMode."
      connector
    />
    <TimelineItem
      date="2025-01"
      title="v0.5.0 — organisms"
      body="SiteShell, HeroSection, TimelineSection."
      connector={false}
    />
  </TimelineSection>
);

export const Tight: Story = () => (
  <TimelineSection eyebrow="Process" heading="How we work" size="tight">
    <TimelineItem
      date="2025-01"
      title="Discovery"
      body="Two-day working session with your team."
      connector
    />
    <TimelineItem
      date="2025-02"
      title="Build"
      body="Four-week sprint. Production-grade output."
      connector
    />
    <TimelineItem
      date="2025-03"
      title="Handoff"
      body="Full documentation and knowledge transfer."
      connector={false}
    />
  </TimelineSection>
);

export const NoHeader: Story = () => (
  <TimelineSection>
    <TimelineItem date="2024-03" title="Founded" connector />
    <TimelineItem date="2025-01" title="Launched" connector={false} />
  </TimelineSection>
);
