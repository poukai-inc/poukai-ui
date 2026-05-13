import type { Story, StoryDefault } from "@ladle/react";
import { StatusBadge, type StatusBadgeStatus } from "./StatusBadge";

export default {
  title: "Components / StatusBadge",
  args: { status: "available", children: "Currently taking conversations for Q3." },
  argTypes: {
    status: {
      options: ["available", "idle", "closed"] satisfies StatusBadgeStatus[],
      control: { type: "radio" },
      defaultValue: "available",
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{ status: StatusBadgeStatus; children: string }> = ({
  status,
  children,
}) => <StatusBadge status={status}>{children}</StatusBadge>;

export const AllStates: Story = () => (
  <div style={{ display: "grid", gap: "var(--space-3)" }}>
    <StatusBadge status="available">Currently taking conversations for Q3.</StatusBadge>
    <StatusBadge status="idle">Reviewing scope — next intake in two weeks.</StatusBadge>
    <StatusBadge status="closed">At capacity through end of quarter.</StatusBadge>
  </div>
);
