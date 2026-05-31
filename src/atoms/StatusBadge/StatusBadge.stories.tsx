import type { Story, StoryDefault } from "@ladle/react";
import { StatusBadge, type StatusBadgeStatus, type StatusBadgeTone } from "./StatusBadge";

export default {
  title: "Atoms / StatusBadge",
  args: { status: "available", children: "Currently taking conversations for Q3." },
  argTypes: {
    status: {
      options: ["available", "idle", "closed"] satisfies StatusBadgeStatus[],
      control: { type: "radio" },
      defaultValue: "available",
    },
    tone: {
      options: [
        "neutral",
        "info",
        "success",
        "warning",
        "danger",
        "accent",
      ] satisfies StatusBadgeTone[],
      control: { type: "radio" },
    },
    pulse: {
      control: { type: "boolean" },
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{
  status: StatusBadgeStatus;
  tone: StatusBadgeTone;
  pulse: boolean;
  children: string;
}> = ({ status, tone, pulse, children }) => (
  <StatusBadge status={status} tone={tone} pulse={pulse}>
    {children}
  </StatusBadge>
);

export const AllStates: Story = () => (
  <div style={{ display: "grid", gap: "var(--space-3)" }}>
    <StatusBadge status="available">Currently taking conversations for Q3.</StatusBadge>
    <StatusBadge status="idle">Reviewing scope — next intake in two weeks.</StatusBadge>
    <StatusBadge status="closed">At capacity through end of quarter.</StatusBadge>
  </div>
);

export const ToneMatrix: Story = () => (
  <div style={{ display: "grid", gap: "var(--space-3)" }}>
    <StatusBadge tone="neutral">Neutral — static gray dot.</StatusBadge>
    <StatusBadge tone="info">Info — shares neutral color this pass (see OQ-1).</StatusBadge>
    <StatusBadge tone="success">Success — green dot.</StatusBadge>
    <StatusBadge tone="warning">Warning — amber dot.</StatusBadge>
    <StatusBadge tone="danger">Danger — red dot.</StatusBadge>
    <StatusBadge tone="accent">Accent — blue dot with halo.</StatusBadge>
  </div>
);

export const PulseExamples: Story = () => (
  <div style={{ display: "grid", gap: "var(--space-3)" }}>
    <StatusBadge tone="accent" pulse>
      Accent with explicit pulse.
    </StatusBadge>
    <StatusBadge tone="success" pulse>
      Success with explicit pulse.
    </StatusBadge>
    <StatusBadge tone="warning">Warning — no pulse.</StatusBadge>
    <StatusBadge status="available" pulse={false}>
      Available status, pulse explicitly off.
    </StatusBadge>
  </div>
);
