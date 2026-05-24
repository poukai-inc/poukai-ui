import type { Story, StoryDefault } from "@ladle/react";
import { Stat } from "../../atoms/Stat";
import { StatList, type StatListAlign } from "./StatList";

export default {
  title: "Components / StatList",
  args: {
    dividers: false,
    align: "center",
  },
  argTypes: {
    dividers: {
      control: { type: "boolean" },
    },
    align: {
      options: ["start", "center"] satisfies StatListAlign[],
      control: { type: "radio" },
    },
  },
} satisfies StoryDefault;

export const Default: Story<{ dividers: boolean; align: StatListAlign }> = ({
  dividers,
  align,
}) => (
  <StatList dividers={dividers} align={align}>
    <Stat value="85%" caption="of AI pilots stall at proof-of-concept." source="MIT Sloan, 2025" />
    <Stat value="$300B" caption="annual enterprise AI spend." source="IDC, 2025" />
    <Stat value="3.2×" caption="faster delivery with a working dev loop." />
  </StatList>
);

export const WithDividers: Story = () => (
  <StatList dividers>
    <Stat value="12k" caption="Users" />
    <Stat value="200" caption="Customers" />
    <Stat value="99.9%" caption="Uptime" />
  </StatList>
);

export const FourStatRow: Story = () => (
  <StatList dividers align="center">
    <Stat value="85%" caption="Plateau rate" source="MIT Sloan, 2025" />
    <Stat value="$300B" caption="Annual spend" source="IDC, 2025" />
    <Stat value="3.2×" caption="Delivery speed" />
    <Stat value="12k" caption="Teams served" />
  </StatList>
);

export const ResponsiveCollapse: Story = () => (
  <div style={{ maxWidth: "28rem", resize: "horizontal", overflow: "auto", padding: "1rem" }}>
    <p
      style={{
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        marginBottom: "var(--space-4)",
      }}
    >
      Resize this box to see column → row collapse at 768px.
    </p>
    <StatList dividers align="start">
      <Stat value="85%" caption="of AI pilots never ship." />
      <Stat value="$300B" caption="annual spend, stalled." />
      <Stat value="3.2×" caption="faster with poukai." />
    </StatList>
  </div>
);

export const AlignStart: Story = () => (
  <StatList align="start">
    <Stat value="85%" caption="plateau rate" source="MIT Sloan, 2025" />
    <Stat value="$300B" caption="annual AI spend" source="IDC, 2025" />
    <Stat value="3.2×" caption="delivery multiplier" />
  </StatList>
);
