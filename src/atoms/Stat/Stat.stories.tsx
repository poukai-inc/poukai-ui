import type { Story, StoryDefault } from "@ladle/react";
import { Stat, type StatAlign, type StatSize } from "./Stat";

export default {
  title: "Atoms / Stat",
  args: {
    value: "85%",
    caption: "of teams adopting AI plateau at pilot.",
    source: "MIT Sloan, 2025",
    align: "start",
    size: "md",
  },
  argTypes: {
    align: {
      options: ["start", "end"] satisfies StatAlign[],
      control: { type: "radio" },
    },
    size: {
      options: ["md", "lg"] satisfies StatSize[],
      control: { type: "radio" },
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{
  value: string;
  caption: string;
  source: string;
  align: StatAlign;
  size: StatSize;
}> = ({ value, caption, source, align, size }) => (
  <Stat value={value} caption={caption} source={source} align={align} size={size} />
);

export const NoSource: Story = () => (
  <Stat value="$300B" caption="annual spend on AI initiatives that never reach production." />
);

export const PairedRow: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-12)",
      maxWidth: "44rem",
    }}
  >
    <Stat value="85%" caption="of AI pilots never reach production." source="MIT Sloan, 2025" />
    <Stat
      value="$300B"
      caption="annual spend on initiatives that stall at proof-of-concept."
      source="IDC, 2025"
      align="end"
    />
  </div>
);

export const LargeSize: Story = () => (
  <Stat
    size="lg"
    value="3.2×"
    caption="faster delivery once a working dev loop replaces handoff theatre."
  />
);

export const WithIcon: Story = () => (
  <Stat
    icon={
      <svg width={28} height={28} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3 17l6-6 4 4 8-8"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    }
    value="3.2×"
    caption="faster delivery once a working dev loop replaces handoff theatre."
  />
);

export const Inverted: Story = () => (
  <div style={{ background: "var(--fg)", padding: "var(--space-12)", color: "var(--bg)" }}>
    <Stat
      value="85%"
      caption="of AI pilots never reach production."
      source="MIT Sloan, 2025"
      style={{ color: "inherit" }}
    />
  </div>
);
