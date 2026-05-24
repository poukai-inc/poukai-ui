import type { Story, StoryDefault } from "@ladle/react";
import { StatsSection } from "./StatsSection";
import { Stat } from "../../atoms/Stat";

export default {
  title: "Components / StatsSection",
} satisfies StoryDefault;

export const Default: Story = () => (
  <StatsSection>
    <Stat value="12k" caption="Users onboarded" />
    <Stat value="99.9%" caption="Uptime SLA" />
    <Stat value="< 48h" caption="Median time-to-value" />
  </StatsSection>
);

export const ByTheNumbers: Story = () => (
  <StatsSection heading="By the numbers" dividers fill>
    <Stat value="12k" caption="Users onboarded" />
    <Stat value="99.9%" caption="Uptime SLA" />
    <Stat value="< 48h" caption="Median time-to-value" />
    <Stat value="200" caption="Enterprise customers" />
  </StatsSection>
);

export const WithHeadingNoFill: Story = () => (
  <StatsSection heading="The impact so far">
    <Stat value="3x" caption="Faster deployment" />
    <Stat value="40%" caption="Cost reduction" />
    <Stat value="9/10" caption="Customer satisfaction" />
  </StatsSection>
);

export const FillNoDividers: Story = () => (
  <StatsSection fill>
    <Stat value="50+" caption="Engagements" />
    <Stat value="100%" caption="On-time delivery" />
  </StatsSection>
);

export const WithDividers: Story = () => (
  <StatsSection dividers>
    <Stat value="$2M+" caption="Value delivered" />
    <Stat value="18 mo" caption="Avg. engagement" />
    <Stat value="0" caption="Missed deadlines" />
  </StatsSection>
);
